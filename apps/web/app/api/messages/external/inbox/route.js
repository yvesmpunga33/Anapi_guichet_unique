import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Message, MessageAttachment, SystemConfig } from '../../../../../models/index.js';
import crypto from 'crypto';

// Cle de chiffrement
const ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY || 'anapi-config-key-32-characters!';

// Dechiffrer une valeur
function decrypt(text) {
  if (!text || !text.includes(':')) return '';
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return '';
  }
}

// Recuperer la configuration email
async function getEmailConfig() {
  try {
    const configs = await SystemConfig.findAll({
      where: { category: 'email' },
    });

    const config = {};
    configs.forEach(c => {
      let value = c.value;
      if (c.type === 'password' && value) {
        value = decrypt(value);
      }
      config[c.key] = value;
    });

    return config;
  } catch (error) {
    console.error('[IMAP] Erreur recuperation config:', error.message);
    return null;
  }
}

// POST - Synchroniser les emails depuis IMAP
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Recuperer la configuration email
    const emailConfig = await getEmailConfig();
    if (!emailConfig || emailConfig.email_enabled !== 'true') {
      return NextResponse.json(
        { error: 'Configuration email non activee' },
        { status: 400 }
      );
    }

    // Verifier la config IMAP
    const imapHost = emailConfig.imap_host || emailConfig.smtp_host?.replace('mail.', 'mail.');
    const imapPort = parseInt(emailConfig.imap_port) || 993;
    const imapUser = emailConfig.imap_user || emailConfig.smtp_user;
    const imapPass = emailConfig.imap_pass || emailConfig.smtp_pass;

    if (!imapHost || !imapUser || !imapPass) {
      return NextResponse.json(
        { error: 'Configuration IMAP incomplete. Configurez imap_host, imap_user et imap_pass.' },
        { status: 400 }
      );
    }

    // Importer imap-simple
    const imaps = await import('imap-simple');
    const { simpleParser } = await import('mailparser');

    const imapConfig = {
      imap: {
        user: imapUser,
        password: imapPass,
        host: imapHost,
        port: imapPort,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000,
      },
    };

    console.log('[IMAP] Connexion a', imapHost, 'port', imapPort);

    let connection;
    try {
      connection = await imaps.connect(imapConfig);
    } catch (connError) {
      console.error('[IMAP] Erreur connexion:', connError.message);
      return NextResponse.json({
        success: false,
        error: 'Impossible de se connecter au serveur IMAP',
        details: connError.message,
      }, { status: 500 });
    }

    try {
      await connection.openBox('INBOX');

      // Rechercher les emails non lus ou recents (30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateString = thirtyDaysAgo.toISOString().slice(0, 10).replace(/-/g, '-');

      const searchCriteria = [['SINCE', thirtyDaysAgo]];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        struct: true,
        markSeen: false,
      };

      const messages = await connection.search(searchCriteria, fetchOptions);
      console.log('[IMAP] Messages trouves:', messages.length);

      let imported = 0;
      let skipped = 0;

      for (const message of messages) {
        try {
          // Extraire le contenu complet
          const allParts = message.parts.find(p => p.which === '');
          if (!allParts) continue;

          const parsed = await simpleParser(allParts.body);

          // Verifier si deja importe (par Message-ID)
          const messageId = parsed.messageId;
          if (messageId) {
            const existing = await Message.findOne({
              where: { externalMessageId: messageId },
            });
            if (existing) {
              skipped++;
              continue;
            }
          }

          // Extraire les informations
          const from = parsed.from?.value?.[0]?.address || parsed.from?.text || 'unknown@unknown.com';
          const fromName = parsed.from?.value?.[0]?.name || from;
          const to = parsed.to?.value?.map(t => t.address) || [];
          const cc = parsed.cc?.value?.map(t => t.address) || [];
          const subject = parsed.subject || '(Sans sujet)';
          const body = parsed.html || parsed.textAsHtml || `<p>${parsed.text || ''}</p>`;
          const date = parsed.date || new Date();

          // Creer le message
          const newMessage = await Message.create({
            subject,
            body,
            priority: 'NORMAL',
            senderId: null, // Email externe, pas d'expediteur interne
            messageType: 'EXTERNAL_IN',
            externalFrom: from,
            externalTo: JSON.stringify(to),
            externalCc: cc.length > 0 ? JSON.stringify(cc) : null,
            externalMessageId: messageId,
            sentAt: date,
            sendStatus: 'SENT',
            createdAt: date,
          });

          // Gerer les pieces jointes
          if (parsed.attachments && parsed.attachments.length > 0) {
            const fs = await import('fs/promises');
            const path = await import('path');

            for (const attachment of parsed.attachments) {
              try {
                const subfolder = attachment.contentType?.startsWith('image/') ? 'images' :
                                 attachment.contentType?.startsWith('video/') ? 'videos' : 'documents';
                const timestamp = Date.now();
                const safeFilename = (attachment.filename || 'attachment').replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `${timestamp}_${safeFilename}`;
                const uploadDir = path.join(process.cwd(), 'public', 'images', 'communicationinterne', subfolder);

                await fs.mkdir(uploadDir, { recursive: true });

                const filepath = path.join(uploadDir, filename);
                await fs.writeFile(filepath, attachment.content);

                const webPath = `/images/communicationinterne/${subfolder}/${filename}`;

                await MessageAttachment.create({
                  messageId: newMessage.id,
                  filename: filename,
                  originalName: attachment.filename || 'attachment',
                  filepath: webPath,
                  filetype: attachment.contentType,
                  filesize: attachment.size || attachment.content.length,
                });
              } catch (attError) {
                console.error('[IMAP] Erreur piece jointe:', attError.message);
              }
            }
          }

          imported++;
        } catch (msgError) {
          console.error('[IMAP] Erreur traitement message:', msgError.message);
        }
      }

      connection.end();

      return NextResponse.json({
        success: true,
        message: `Synchronisation terminee: ${imported} emails importes, ${skipped} deja existants`,
        imported,
        skipped,
        total: messages.length,
      });

    } catch (boxError) {
      connection.end();
      console.error('[IMAP] Erreur boite:', boxError.message);
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la lecture des emails',
        details: boxError.message,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[IMAP] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Recuperer les emails externes recus
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    const where = {
      messageType: 'EXTERNAL_IN',
      isDeleted: false,
    };

    // Recherche
    if (search) {
      const { Op } = await import('sequelize');
      where[Op.or] = [
        { subject: { [Op.iLike]: `%${search}%` } },
        { externalFrom: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Message.findAndCountAll({
      where,
      include: [
        {
          model: MessageAttachment,
          as: 'attachments',
          attributes: ['id', 'filename', 'originalName', 'filetype', 'filesize', 'filepath'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const messages = rows.map(m => ({
      id: m.id,
      subject: m.subject,
      body: m.body,
      priority: m.priority,
      externalFrom: m.externalFrom,
      externalTo: m.externalTo ? JSON.parse(m.externalTo) : [],
      externalCc: m.externalCc ? JSON.parse(m.externalCc) : [],
      sentAt: m.sentAt,
      createdAt: m.createdAt,
      attachments: m.attachments,
      isRead: m.isRead || false,
    }));

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching external inbox:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des emails', details: error.message },
      { status: 500 }
    );
  }
}
