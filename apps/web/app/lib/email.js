import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Cle de chiffrement (en production, utiliser une variable d'environnement)
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

// Recuperer la configuration email depuis la base de donnees
async function getEmailConfig() {
  try {
    // Import dynamique pour eviter les problemes de chargement circulaire
    const { SystemConfig } = await import('../../models/index.js');

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
    console.error('[Email] Erreur recuperation config:', error.message);
    return null;
  }
}

// Configuration du transporteur email
const createTransporter = async () => {
  // D'abord essayer la configuration de la base de donnees
  const dbConfig = await getEmailConfig();

  if (dbConfig && dbConfig.email_enabled === 'true' && dbConfig.smtp_host && dbConfig.smtp_user) {
    console.log('[Email] Utilisation de la configuration base de donnees');
    return {
      transporter: nodemailer.createTransport({
        host: dbConfig.smtp_host,
        port: parseInt(dbConfig.smtp_port) || 587,
        secure: dbConfig.smtp_secure === 'true',
        auth: {
          user: dbConfig.smtp_user,
          pass: dbConfig.smtp_pass,
        },
      }),
      from: `"${dbConfig.smtp_from_name || 'ANAPI'}" <${dbConfig.smtp_from || dbConfig.smtp_user}>`,
    };
  }

  // Sinon utiliser les variables d'environnement
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  // En mode developpement sans config SMTP, utiliser simulation
  if (!process.env.SMTP_USER) {
    console.log('[Email] Mode simulation - emails non envoyes');
    return null;
  }

  console.log('[Email] Utilisation de la configuration environnement');
  return {
    transporter: nodemailer.createTransport(config),
    from: process.env.SMTP_FROM || '"ANAPI" <noreply@anapi.cd>',
  };
};

// Templates d'emails
const templates = {
  contractExpiring: (data) => ({
    subject: `[ANAPI] Alerte: Contrat "${data.contractTitle}" expire dans ${data.daysRemaining} jours`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .alert-box { background: ${data.priority === 'CRITICAL' ? '#fef2f2' : data.priority === 'HIGH' ? '#fffbeb' : '#f0fdf4'};
                       border-left: 4px solid ${data.priority === 'CRITICAL' ? '#ef4444' : data.priority === 'HIGH' ? '#f59e0b' : '#22c55e'};
                       padding: 15px; margin: 15px 0; border-radius: 4px; }
          .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .details { margin: 15px 0; }
          .details dt { font-weight: bold; color: #64748b; }
          .details dd { margin: 0 0 10px 0; color: #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">ANAPI - Direction Juridique</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Systeme d'alerte automatique</p>
          </div>
          <div class="content">
            <div class="alert-box">
              <strong>Alerte ${data.priority}</strong>
              <p style="margin: 5px 0 0 0;">Ce contrat expire dans <strong>${data.daysRemaining} jours</strong> (${data.expirationDate})</p>
            </div>

            <h2 style="color: #1e293b;">Details du contrat</h2>
            <dl class="details">
              <dt>Titre</dt>
              <dd>${data.contractTitle}</dd>
              <dt>Reference</dt>
              <dd>${data.reference || 'Non specifie'}</dd>
              <dt>Type</dt>
              <dd>${data.contractType || 'Non specifie'}</dd>
              <dt>Valeur</dt>
              <dd>${data.value ? `${data.value.toLocaleString()} ${data.currency || 'USD'}` : 'Non specifie'}</dd>
              <dt>Date de fin</dt>
              <dd>${data.expirationDate}</dd>
            </dl>

            <h3 style="color: #1e293b;">Actions recommandees</h3>
            <ul>
              <li>Verifier les clauses de renouvellement</li>
              <li>Contacter les parties concernees</li>
              <li>Preparer les documents de renouvellement si necessaire</li>
            </ul>

            <a href="${data.contractUrl}" class="btn">Voir le contrat</a>
          </div>
          <div class="footer">
            <p>ANAPI - Agence Nationale pour la Promotion des Investissements</p>
            <p>Cet email a ete envoye automatiquement. Merci de ne pas repondre.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
ANAPI - Direction Juridique
Alerte: Contrat expirant

Le contrat "${data.contractTitle}" expire dans ${data.daysRemaining} jours (${data.expirationDate}).

Details:
- Reference: ${data.reference || 'Non specifie'}
- Type: ${data.contractType || 'Non specifie'}
- Valeur: ${data.value ? `${data.value.toLocaleString()} ${data.currency || 'USD'}` : 'Non specifie'}

Lien: ${data.contractUrl}

---
ANAPI - Agence Nationale pour la Promotion des Investissements
    `,
  }),

  contractRenewalReminder: (data) => ({
    subject: `[ANAPI] Rappel de renouvellement: Contrat "${data.contractTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .renewal-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; margin-right: 10px; }
          .btn-secondary { background: #64748b; }
          .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">ANAPI - Renouvellement de contrat</h1>
          </div>
          <div class="content">
            <div class="renewal-box">
              <strong>Rappel de renouvellement</strong>
              <p style="margin: 5px 0 0 0;">Le contrat "${data.contractTitle}" necessite une action de renouvellement.</p>
            </div>

            <h3>Type de renouvellement: ${data.renewalType}</h3>
            <p>${data.renewalType === 'AUTO' ? 'Ce contrat sera automatiquement renouvele sauf action contraire.' :
               data.renewalType === 'TACIT' ? 'Ce contrat est en reconduction tacite.' :
               'Ce contrat necessite un renouvellement manuel.'}</p>

            <a href="${data.contractUrl}" class="btn">Voir le contrat</a>
            <a href="${data.renewUrl}" class="btn btn-secondary">Initier le renouvellement</a>
          </div>
          <div class="footer">
            <p>ANAPI - Agence Nationale pour la Promotion des Investissements</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
ANAPI - Rappel de renouvellement

Le contrat "${data.contractTitle}" necessite une action de renouvellement.
Type de renouvellement: ${data.renewalType}

Lien: ${data.contractUrl}

---
ANAPI
    `,
  }),

  alertAssignment: (data) => ({
    subject: `[ANAPI] Nouvelle alerte assignee: ${data.alertTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .priority-critical { background: #fef2f2; color: #dc2626; }
          .priority-high { background: #fffbeb; color: #d97706; }
          .priority-medium { background: #f0fdf4; color: #16a34a; }
          .priority-low { background: #f8fafc; color: #64748b; }
          .btn { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Nouvelle alerte assignee</h1>
          </div>
          <div class="content">
            <p>Bonjour ${data.assigneeName},</p>
            <p>Une nouvelle alerte vous a ete assignee:</p>

            <h2>${data.alertTitle}</h2>
            <p><span class="priority-badge priority-${data.priority.toLowerCase()}">${data.priority}</span></p>
            <p>${data.description}</p>

            <p><strong>Date limite:</strong> ${data.dueDate || 'Non specifie'}</p>

            <a href="${data.alertUrl}" class="btn">Traiter l'alerte</a>
          </div>
          <div class="footer">
            <p>ANAPI - Direction Juridique</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Nouvelle alerte assignee

Bonjour ${data.assigneeName},

Une nouvelle alerte vous a ete assignee:
${data.alertTitle}

Priorite: ${data.priority}
${data.description}

Date limite: ${data.dueDate || 'Non specifie'}

Lien: ${data.alertUrl}

---
ANAPI - Direction Juridique
    `,
  }),

  dailyDigest: (data) => ({
    subject: `[ANAPI] Resume quotidien - Direction Juridique (${data.date})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
          .stat-value { font-size: 28px; font-weight: bold; color: #059669; }
          .stat-label { font-size: 12px; color: #64748b; }
          .alert-list { list-style: none; padding: 0; }
          .alert-item { padding: 10px; margin: 5px 0; background: white; border-radius: 6px; border-left: 4px solid #f59e0b; }
          .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Resume Quotidien</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${data.date}</p>
          </div>
          <div class="content">
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-value">${data.stats.expiringContracts}</div>
                <div class="stat-label">Contrats expirant (30j)</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.stats.pendingAlerts}</div>
                <div class="stat-label">Alertes en attente</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.stats.urgentAlerts}</div>
                <div class="stat-label">Alertes urgentes</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.stats.totalContracts}</div>
                <div class="stat-label">Contrats actifs</div>
              </div>
            </div>

            ${data.urgentAlerts.length > 0 ? `
            <h3>Alertes urgentes a traiter</h3>
            <ul class="alert-list">
              ${data.urgentAlerts.map(alert => `
                <li class="alert-item">
                  <strong>${alert.title}</strong><br>
                  <small>${alert.description}</small>
                </li>
              `).join('')}
            </ul>
            ` : '<p>Aucune alerte urgente pour aujourd\'hui.</p>'}

            <a href="${data.dashboardUrl}" class="btn">Acceder au tableau de bord</a>
          </div>
          <div class="footer">
            <p>ANAPI - Agence Nationale pour la Promotion des Investissements</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #94a3b8;">Se desabonner des emails quotidiens</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
ANAPI - Resume Quotidien (${data.date})

Statistiques:
- Contrats expirant (30j): ${data.stats.expiringContracts}
- Alertes en attente: ${data.stats.pendingAlerts}
- Alertes urgentes: ${data.stats.urgentAlerts}
- Contrats actifs: ${data.stats.totalContracts}

${data.urgentAlerts.length > 0 ? `Alertes urgentes:\n${data.urgentAlerts.map(a => `- ${a.title}`).join('\n')}` : 'Aucune alerte urgente.'}

Tableau de bord: ${data.dashboardUrl}

---
ANAPI
    `,
  }),
};

// Fonction principale d'envoi d'email
export async function sendEmail(to, templateName, data) {
  const transporterConfig = await createTransporter();

  if (!transporterConfig) {
    console.log(`[Email] Simulation d'envoi a ${to}:`, templateName, data);
    return { success: true, simulated: true };
  }

  const { transporter, from } = transporterConfig;

  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template email "${templateName}" non trouve`);
  }

  const { subject, html, text } = template(data);

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });

    console.log(`[Email] Envoye a ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email] Erreur d'envoi a ${to}:`, error);
    throw error;
  }
}

// Fonction pour envoyer a plusieurs destinataires
export async function sendBulkEmail(recipients, templateName, dataGenerator) {
  const results = [];

  for (const recipient of recipients) {
    try {
      const data = typeof dataGenerator === 'function' ? dataGenerator(recipient) : dataGenerator;
      const result = await sendEmail(recipient.email, templateName, data);
      results.push({ recipient: recipient.email, ...result });
    } catch (error) {
      results.push({ recipient: recipient.email, success: false, error: error.message });
    }
  }

  return results;
}

// Verification de la configuration SMTP
export async function verifyEmailConfig() {
  const transporterConfig = await createTransporter();

  if (!transporterConfig) {
    return { configured: false, message: 'Configuration SMTP non definie' };
  }

  try {
    await transporterConfig.transporter.verify();
    return { configured: true, message: 'Configuration SMTP valide' };
  } catch (error) {
    return { configured: false, message: error.message };
  }
}

export default {
  sendEmail,
  sendBulkEmail,
  verifyEmailConfig,
  templates,
};
