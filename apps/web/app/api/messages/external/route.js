import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Message, MessageAttachment, User, sequelize } from '../../../../models/index.js';
import nodemailer from 'nodemailer';
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
    const { SystemConfig } = await import('../../../../models/index.js');
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
    console.error('[ExternalEmail] Erreur recuperation config:', error.message);
    return null;
  }
}

// POST - Envoyer un email externe
export async function POST(request) {
  const transaction = await sequelize.transaction();

  try {
    const session = await auth();
    if (!session?.user?.id) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Recuperer la configuration email
    const emailConfig = await getEmailConfig();
    if (!emailConfig || emailConfig.email_enabled !== 'true' || !emailConfig.smtp_host || !emailConfig.smtp_user) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Configuration email non configuree. Veuillez configurer SMTP dans Administration > Parametres > Email.' },
        { status: 400 }
      );
    }

    // Gerer FormData pour les fichiers
    const formData = await request.formData();
    const subject = formData.get('subject');
    const body = formData.get('body');
    const priority = formData.get('priority') || 'NORMAL';
    const externalToJson = formData.get('externalTo');
    const externalCcJson = formData.get('externalCc');
    const files = formData.getAll('attachments');

    // Parser les emails externes
    let externalTo = [];
    let externalCc = [];
    try {
      if (externalToJson) externalTo = JSON.parse(externalToJson);
      if (externalCcJson) externalCc = JSON.parse(externalCcJson);
    } catch (e) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Format d\'emails invalide' },
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

    if (!externalTo || externalTo.length === 0) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Au moins un destinataire email est requis' },
        { status: 400 }
      );
    }

    // Valider les adresses email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = externalTo.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      await transaction.rollback();
      return NextResponse.json(
        { error: `Adresses email invalides: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    // Creer le message dans la base de donnees
    const message = await Message.create({
      subject,
      body,
      priority,
      senderId: session.user.id,
      messageType: 'EXTERNAL_OUT',
      externalTo: JSON.stringify(externalTo),
      externalCc: externalCc.length > 0 ? JSON.stringify(externalCc) : null,
      sendStatus: 'PENDING',
    }, { transaction });

    // Traiter les fichiers joints
    const attachmentRecords = [];
    const emailAttachments = [];
    const fs = await import('fs/promises');
    const path = await import('path');

    for (const file of files) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determiner le sous-dossier selon le type
        const subfolder = file.type?.startsWith('image/') ? 'images' :
                         file.type?.startsWith('video/') ? 'videos' : 'documents';
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

        // Pour l'envoi email
        emailAttachments.push({
          filename: file.name,
          content: buffer,
          contentType: file.type,
        });
      }
    }

    if (attachmentRecords.length > 0) {
      await MessageAttachment.bulkCreate(attachmentRecords, { transaction });
    }

    // Creer le transporteur email
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtp_host,
      port: parseInt(emailConfig.smtp_port) || 587,
      secure: emailConfig.smtp_secure === 'true',
      auth: {
        user: emailConfig.smtp_user,
        pass: emailConfig.smtp_pass,
      },
    });

    // Recuperer les infos de l'expediteur
    const sender = await User.findByPk(session.user.id);
    const senderName = sender?.name || session.user.name || 'ANAPI';
    const fromAddress = emailConfig.smtp_from || emailConfig.smtp_user;
    const fromName = emailConfig.smtp_from_name || 'ANAPI';

    // Envoyer l'email avec template professionnel
    try {
      const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header avec logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #047857 0%, #059669 100%); padding: 30px 40px; text-align: center;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <div style="display: inline-block; background-color: white; border-radius: 50%; width: 60px; height: 60px; line-height: 60px; text-align: center;">
                      <span style="font-size: 28px; font-weight: bold; color: #047857;">A</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 15px 0 5px 0; font-size: 24px; font-weight: 600;">ANAPI</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Agence Nationale pour la Promotion des Investissements</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              <div style="color: #1f2937; font-size: 15px; line-height: 1.7;">
                ${body}
              </div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" style="width: 100%; border-top: 1px solid #e5e7eb; padding-top: 25px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 5px 0; font-weight: 600; color: #1f2937; font-size: 15px;">${senderName}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">${session.user.email}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 40px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                      Ce message a ete envoye via la plateforme ANAPI
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Agence Nationale pour la Promotion des Investissements<br/>
                      Republique Democratique du Congo
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Mentions legales -->
        <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
          <tr>
            <td style="text-align: center; padding: 0 20px;">
              <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; margin: 0;">
                Cet email et ses pieces jointes sont confidentiels et destines exclusivement aux destinataires mentionnes.
                Si vous avez recu ce message par erreur, veuillez le supprimer et en informer l'expediteur.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: externalTo.join(', '),
        cc: externalCc.length > 0 ? externalCc.join(', ') : undefined,
        replyTo: `"${senderName}" <${session.user.email}>`,
        subject: subject,
        html: emailHtml,
        text: `${body.replace(/<[^>]*>/g, '')}\n\n---\n${senderName}\n${session.user.email}\n\nEnvoye via ANAPI - Agence Nationale pour la Promotion des Investissements`,
        attachments: emailAttachments,
      });

      // Mettre a jour le statut
      await message.update({
        sendStatus: 'SENT',
        sentAt: new Date(),
        externalMessageId: info.messageId,
      }, { transaction });

      await transaction.commit();

      return NextResponse.json({
        success: true,
        message: {
          id: message.id,
          subject: message.subject,
          externalTo,
          externalCc,
          sentAt: message.sentAt,
          messageId: info.messageId,
        },
      }, { status: 201 });

    } catch (emailError) {
      // Sauvegarder l'erreur mais commit quand meme
      await message.update({
        sendStatus: 'FAILED',
        sendError: emailError.message,
      }, { transaction });

      await transaction.commit();

      return NextResponse.json({
        success: false,
        error: 'Erreur lors de l\'envoi de l\'email',
        details: emailError.message,
        messageId: message.id,
      }, { status: 500 });
    }

  } catch (error) {
    await transaction.rollback();
    console.error('Error sending external email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Recuperer les emails externes envoyes
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where: {
        senderId: session.user.id,
        messageType: 'EXTERNAL_OUT',
        isDeleted: false,
      },
      include: [
        {
          model: MessageAttachment,
          as: 'attachments',
          attributes: ['id', 'filename', 'originalName', 'filetype', 'filesize'],
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
      externalTo: m.externalTo ? JSON.parse(m.externalTo) : [],
      externalCc: m.externalCc ? JSON.parse(m.externalCc) : [],
      sendStatus: m.sendStatus,
      sendError: m.sendError,
      sentAt: m.sentAt,
      createdAt: m.createdAt,
      attachments: m.attachments,
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
    console.error('Error fetching external emails:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des emails', details: error.message },
      { status: 500 }
    );
  }
}
