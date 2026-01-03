import nodemailer from 'nodemailer';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY || 'anapi-config-key-32-characters!';

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

// Configuration
const config = {
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
  user: 'merrykapula@futurissvision.com',
  pass: decrypt('db6c5eb101247c7c79788b87048a5ca3:2fb12fa9a1b1b5920b733c4d5bd44cd6'),
};

console.log('Configuration SMTP:');
console.log('- Host:', config.host);
console.log('- Port:', config.port);
console.log('- User:', config.user);
console.log('- Password decrypted:', config.pass ? 'OK' : 'ERREUR');

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

console.log('\nVerification de la connexion SMTP...');

try {
  await transporter.verify();
  console.log('Connexion SMTP OK!');

  console.log('\nEnvoi de l\'email de test...');

  const info = await transporter.sendMail({
    from: '"ANAPI" <merrykapula@futurissvision.com>',
    to: 'yves.mpunga33@gmail.com',
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

  console.log('Email envoye avec succes!');
  console.log('Message ID:', info.messageId);

} catch (error) {
  console.error('Erreur:', error.message);
}
