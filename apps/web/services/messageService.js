import { NextResponse } from 'next/server';
import { auth } from '../app/lib/auth.js';
import { Message, MessageRecipient, MessageAttachment, User, Ministry, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Service pour la gestion des messages internes
 * Contient toute la logique métier séparée des routes
 */

// GET - Liste des messages (boite de reception ou envoyes)
export async function getMessages(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'inbox';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority');
    const unreadOnly = searchParams.get('unread') === 'true';
    const offset = (page - 1) * limit;

    let messages = [];
    let total = 0;

    if (type === 'inbox') {
      const result = await getInboxMessages(session.user.id, { search, priority, unreadOnly, limit, offset });
      messages = result.messages;
      total = result.total;
    } else if (type === 'sent') {
      const result = await getSentMessages(session.user.id, { search, priority, limit, offset });
      messages = result.messages;
      total = result.total;
    }

    const unreadCount = await getUnreadCount(session.user.id);

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
    console.error('[MessageService] Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des messages', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Envoyer un nouveau message
export async function sendMessage(request) {
  const transaction = await sequelize.transaction();

  try {
    const session = await auth();
    if (!session?.user?.id) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

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
      return NextResponse.json({ error: 'Format de destinataires invalide' }, { status: 400 });
    }

    // Validation
    if (!subject || !body) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Sujet et contenu sont requis' }, { status: 400 });
    }

    if (!recipients || recipients.length === 0) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Au moins un destinataire est requis' }, { status: 400 });
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
    await processAttachments(message.id, files, transaction);

    await transaction.commit();

    // Recuperer le message complet
    const fullMessage = await getMessageWithRelations(message.id);

    return NextResponse.json({
      success: true,
      message: fullMessage,
    }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.error('[MessageService] Error sending message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Obtenir un message par ID
export async function getMessageById(messageId, userId) {
  try {
    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
        },
        {
          model: MessageRecipient,
          as: 'recipients',
          include: [
            {
              model: User,
              as: 'recipient',
              attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            },
          ],
        },
        {
          model: MessageAttachment,
          as: 'attachments',
        },
      ],
    });

    if (!message) {
      return NextResponse.json({ error: 'Message non trouve' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('[MessageService] Error fetching message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du message' },
      { status: 500 }
    );
  }
}

// PUT - Marquer un message comme lu
export async function markAsRead(messageId, userId) {
  try {
    const recipient = await MessageRecipient.findOne({
      where: {
        messageId,
        recipientId: userId,
      },
    });

    if (!recipient) {
      return NextResponse.json({ error: 'Message non trouve' }, { status: 404 });
    }

    await recipient.update({ readAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[MessageService] Error marking as read:', error);
    return NextResponse.json(
      { error: 'Erreur lors du marquage du message' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un message
export async function deleteMessage(messageId, userId) {
  try {
    // Soft delete pour le destinataire
    const recipient = await MessageRecipient.findOne({
      where: {
        messageId,
        recipientId: userId,
      },
    });

    if (recipient) {
      await recipient.update({ isDeleted: true });
    }

    return NextResponse.json({ success: true, message: 'Message supprime' });
  } catch (error) {
    console.error('[MessageService] Error deleting message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du message' },
      { status: 500 }
    );
  }
}

// Helper: Get inbox messages
async function getInboxMessages(userId, { search, priority, unreadOnly, limit, offset }) {
  const whereRecipient = {
    recipientId: userId,
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
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
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

  const messages = rows.map(r => ({
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

  return { messages, total: count };
}

// Helper: Get sent messages
async function getSentMessages(userId, { search, priority, limit, offset }) {
  const whereMessage = {
    senderId: userId,
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
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
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

  const messages = rows.map(m => ({
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
    allRead: m.recipients.every(r => r.readAt),
    someRead: m.recipients.some(r => r.readAt),
  }));

  return { messages, total: count };
}

// Helper: Get unread count
async function getUnreadCount(userId) {
  return MessageRecipient.count({
    where: {
      recipientId: userId,
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
}

// Helper: Process attachments
async function processAttachments(messageId, files, transaction) {
  const attachmentRecords = [];
  const fs = await import('fs/promises');
  const path = await import('path');

  for (const file of files) {
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const subfolder = getAttachmentSubfolder(file.type);
      const timestamp = Date.now();
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${safeFilename}`;
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'communicationinterne', subfolder);

      await fs.mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);

      const webPath = `/images/communicationinterne/${subfolder}/${filename}`;

      attachmentRecords.push({
        messageId,
        filename,
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
}

// Helper: Get attachment subfolder
function getAttachmentSubfolder(mimetype) {
  if (mimetype?.startsWith('image/')) return 'images';
  if (mimetype?.startsWith('video/')) return 'videos';
  return 'documents';
}

// Helper: Get message with all relations
async function getMessageWithRelations(messageId) {
  return Message.findByPk(messageId, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      },
      {
        model: MessageRecipient,
        as: 'recipients',
        include: [
          {
            model: User,
            as: 'recipient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
          },
        ],
      },
      {
        model: MessageAttachment,
        as: 'attachments',
      },
    ],
  });
}
