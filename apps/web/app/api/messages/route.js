import { NextResponse } from 'next/server';
import { auth } from '../../lib/auth.js';
import { Message, MessageRecipient, MessageAttachment, User, Ministry, sequelize } from '../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des messages (boite de reception ou envoyes)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'inbox'; // inbox, sent, all
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority');
    const unreadOnly = searchParams.get('unread') === 'true';
    const offset = (page - 1) * limit;

    let messages = [];
    let total = 0;

    if (type === 'inbox') {
      // Messages recus
      const whereRecipient = {
        recipientId: session.user.id,
        isDeleted: false,
      };

      if (unreadOnly) {
        whereRecipient.readAt = null;
      }

      const { count, rows } = await MessageRecipient.findAndCountAll({
        where: whereRecipient,
        include: [
          {
            model: Message,
            as: 'message',
            where: {
              isDeleted: false,
              ...(search && {
                [Op.or]: [
                  { subject: { [Op.iLike]: `%${search}%` } },
                  { body: { [Op.iLike]: `%${search}%` } },
                ],
              }),
              ...(priority && { priority }),
            },
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email', 'image', 'ministryId'],
                include: [
                  {
                    model: Ministry,
                    as: 'ministry',
                    attributes: ['id', 'code', 'name', 'shortName'],
                  },
                ],
              },
              {
                model: MessageAttachment,
                as: 'attachments',
                attributes: ['id', 'filename', 'originalName', 'filetype', 'filesize'],
              },
            ],
          },
        ],
        order: [[{ model: Message, as: 'message' }, 'createdAt', 'DESC']],
        limit,
        offset,
      });

      total = count;
      messages = rows.map(r => ({
        id: r.message.id,
        subject: r.message.subject,
        body: r.message.body,
        priority: r.message.priority,
        sender: r.message.sender,
        attachments: r.message.attachments,
        createdAt: r.message.createdAt,
        readAt: r.readAt,
        isRead: !!r.readAt,
        recipientType: r.recipientType,
      }));
    } else if (type === 'sent') {
      // Messages envoyes
      const whereMessage = {
        senderId: session.user.id,
        isDeleted: false,
        ...(search && {
          [Op.or]: [
            { subject: { [Op.iLike]: `%${search}%` } },
            { body: { [Op.iLike]: `%${search}%` } },
          ],
        }),
        ...(priority && { priority }),
      };

      const { count, rows } = await Message.findAndCountAll({
        where: whereMessage,
        include: [
          {
            model: MessageRecipient,
            as: 'recipients',
            include: [
              {
                model: User,
                as: 'recipient',
                attributes: ['id', 'name', 'email', 'image'],
              },
            ],
          },
          {
            model: MessageAttachment,
            as: 'attachments',
            attributes: ['id', 'filename', 'originalName', 'filetype', 'filesize'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true,
      });

      total = count;
      messages = rows.map(m => ({
        id: m.id,
        subject: m.subject,
        body: m.body,
        priority: m.priority,
        recipients: m.recipients.map(r => ({
          ...r.recipient?.dataValues,
          readAt: r.readAt,
          isRead: !!r.readAt,
          recipientType: r.recipientType,
        })),
        attachments: m.attachments,
        createdAt: m.createdAt,
        // Calculer si tous les destinataires ont lu
        allRead: m.recipients.every(r => r.readAt),
        someRead: m.recipients.some(r => r.readAt),
      }));
    }

    // Compter les messages non lus
    const unreadCount = await MessageRecipient.count({
      where: {
        recipientId: session.user.id,
        readAt: null,
        isDeleted: false,
      },
      include: [
        {
          model: Message,
          as: 'message',
          where: { isDeleted: false },
          required: true,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des messages', details: error.message },
      { status: 500 }
    );
  }
}

// Fonction pour determiner le sous-dossier selon le type de fichier
function getAttachmentSubfolder(mimetype) {
  if (mimetype?.startsWith('image/')) return 'images';
  if (mimetype?.startsWith('video/')) return 'videos';
  return 'documents';
}

// POST - Envoyer un nouveau message
export async function POST(request) {
  const transaction = await sequelize.transaction();

  try {
    const session = await auth();
    if (!session?.user?.id) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Gerer FormData pour les fichiers
    const formData = await request.formData();
    const subject = formData.get('subject');
    const body = formData.get('body');
    const priority = formData.get('priority') || 'NORMAL';
    const recipientsJson = formData.get('recipients');
    const files = formData.getAll('attachments');

    // Parser les destinataires
    let recipients = [];
    try {
      recipients = JSON.parse(recipientsJson);
    } catch (e) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Format de destinataires invalide' },
        { status: 400 }
      );
    }

    // Validation
    if (!subject || !body) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Sujet et contenu sont requis' },
        { status: 400 }
      );
    }

    if (!recipients || recipients.length === 0) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Au moins un destinataire est requis' },
        { status: 400 }
      );
    }

    // Creer le message
    const message = await Message.create({
      subject,
      body,
      priority,
      senderId: session.user.id,
    }, { transaction });

    // Creer les destinataires
    const recipientRecords = recipients.map(r => ({
      messageId: message.id,
      recipientId: r.id || r.recipientId,
      recipientType: r.type || 'TO',
    }));

    await MessageRecipient.bulkCreate(recipientRecords, { transaction });

    // Traiter les fichiers joints
    const attachmentRecords = [];
    const fs = await import('fs/promises');
    const path = await import('path');

    for (const file of files) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determiner le sous-dossier selon le type
        const subfolder = getAttachmentSubfolder(file.type);
        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${safeFilename}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'communicationinterne', subfolder);

        // Creer le repertoire si necessaire
        await fs.mkdir(uploadDir, { recursive: true });

        // Sauvegarder le fichier
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);

        // Chemin relatif pour l'acces web
        const webPath = `/images/communicationinterne/${subfolder}/${filename}`;

        attachmentRecords.push({
          messageId: message.id,
          filename: filename,
          originalName: file.name,
          filepath: webPath,
          filetype: file.type,
          filesize: file.size,
        });
      }
    }

    if (attachmentRecords.length > 0) {
      await MessageAttachment.bulkCreate(attachmentRecords, { transaction });
    }

    await transaction.commit();

    // Recuperer le message complet avec les relations
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'image'],
        },
        {
          model: MessageRecipient,
          as: 'recipients',
          include: [
            {
              model: User,
              as: 'recipient',
              attributes: ['id', 'name', 'email', 'image'],
            },
          ],
        },
        {
          model: MessageAttachment,
          as: 'attachments',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: fullMessage,
    }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message', details: error.message },
      { status: 500 }
    );
  }
}
