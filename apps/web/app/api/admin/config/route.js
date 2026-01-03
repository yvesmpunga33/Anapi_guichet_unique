import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { SystemConfig } from '../../../../models/index.js';
import crypto from 'crypto';

// Cle de chiffrement (en production, utiliser une variable d'environnement)
const ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY || 'anapi-config-key-32-characters!';
const IV_LENGTH = 16;

// Chiffrer une valeur
function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

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
    console.error('Decryption error:', error);
    return '';
  }
}

// GET - Recuperer les configurations
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Verifier le role admin (a adapter selon votre systeme de roles)
    // if (session.user?.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Acces refuse' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = {};
    if (category) where.category = category;

    const configs = await SystemConfig.findAll({
      where,
      order: [['category', 'ASC'], ['key', 'ASC']],
    });

    // Masquer les mots de passe dans la reponse
    const safeConfigs = configs.map(config => {
      const data = config.toJSON();
      if (data.type === 'password' && data.value) {
        data.value = '••••••••';
        data.hasValue = true;
      }
      return data;
    });

    // Grouper par categorie
    const grouped = safeConfigs.reduce((acc, config) => {
      if (!acc[config.category]) {
        acc[config.category] = [];
      }
      acc[config.category].push(config);
      return acc;
    }, {});

    return NextResponse.json({
      configs: safeConfigs,
      grouped,
      categories: Object.keys(grouped),
    });
  } catch (error) {
    console.error('Error fetching configs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des configurations' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour les configurations
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();
    const { configs } = body;

    if (!configs || !Array.isArray(configs)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    }

    const results = [];

    for (const { key, value } of configs) {
      const config = await SystemConfig.findOne({ where: { key } });

      if (!config) {
        results.push({ key, success: false, error: 'Configuration non trouvee' });
        continue;
      }

      if (!config.isEditable) {
        results.push({ key, success: false, error: 'Configuration non modifiable' });
        continue;
      }

      // Ne pas mettre a jour si c'est un mot de passe masque
      if (config.type === 'password' && value === '••••••••') {
        results.push({ key, success: true, message: 'Non modifie' });
        continue;
      }

      // Chiffrer les mots de passe
      let finalValue = value;
      if (config.type === 'password' && value) {
        finalValue = encrypt(value);
      }

      await config.update({
        value: finalValue,
        updatedById: session.user?.id,
      });

      results.push({ key, success: true });
    }

    return NextResponse.json({
      success: true,
      message: 'Configurations mises a jour',
      results,
    });
  } catch (error) {
    console.error('Error updating configs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour des configurations' },
      { status: 500 }
    );
  }
}

// POST - Tester la configuration email
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();
    const { action, testEmail } = body;

    if (action === 'test_email') {
      // Recuperer la configuration email
      const emailConfigs = await SystemConfig.findAll({
        where: { category: 'email' },
      });

      const config = {};
      emailConfigs.forEach(c => {
        let value = c.value;
        if (c.type === 'password' && value) {
          value = decrypt(value);
        }
        config[c.key] = value;
      });

      // Verifier que la configuration est complete
      if (!config.smtp_host || !config.smtp_user) {
        return NextResponse.json({
          success: false,
          error: 'Configuration SMTP incomplete',
          details: 'Veuillez configurer le serveur SMTP et le nom d\'utilisateur',
        });
      }

      // Essayer d'envoyer un email de test
      const nodemailer = await import('nodemailer');

      const transporter = nodemailer.default.createTransport({
        host: config.smtp_host,
        port: parseInt(config.smtp_port) || 587,
        secure: config.smtp_secure === 'true',
        auth: {
          user: config.smtp_user,
          pass: config.smtp_pass,
        },
      });

      try {
        await transporter.verify();

        // Envoyer un email de test
        const targetEmail = testEmail || session.user?.email;
        if (targetEmail) {
          await transporter.sendMail({
            from: `"${config.smtp_from_name || 'ANAPI'}" <${config.smtp_from || config.smtp_user}>`,
            to: targetEmail,
            subject: 'Test de configuration SMTP - ANAPI',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Configuration SMTP reussie!</h2>
                <p>Cet email confirme que la configuration SMTP de votre systeme ANAPI fonctionne correctement.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #6b7280; font-size: 12px;">
                  Envoye depuis le systeme ANAPI le ${new Date().toLocaleString('fr-FR')}
                </p>
              </div>
            `,
          });

          return NextResponse.json({
            success: true,
            message: `Email de test envoye avec succes a ${targetEmail}`,
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Connexion SMTP verifiee avec succes',
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Echec de la connexion SMTP',
          details: error.message,
        });
      }
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (error) {
    console.error('Error testing config:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test' },
      { status: 500 }
    );
  }
}
