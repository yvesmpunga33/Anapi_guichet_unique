import { SystemConfig } from '../apps/web/models/index.js';

async function addImapConfig() {
  const imapConfigs = [
    { key: 'imap_host', value: '', category: 'email', type: 'string', description: 'Serveur IMAP pour la reception d\'emails', isEditable: true },
    { key: 'imap_port', value: '993', category: 'email', type: 'number', description: 'Port IMAP (993 pour SSL)', isEditable: true },
    { key: 'imap_user', value: '', category: 'email', type: 'string', description: 'Utilisateur IMAP (laissez vide pour utiliser smtp_user)', isEditable: true },
    { key: 'imap_pass', value: '', category: 'email', type: 'password', description: 'Mot de passe IMAP (laissez vide pour utiliser smtp_pass)', isEditable: true },
  ];

  console.log('Ajout des configurations IMAP...');

  for (const config of imapConfigs) {
    try {
      const [instance, created] = await SystemConfig.findOrCreate({
        where: { key: config.key },
        defaults: config,
      });
      console.log(`  ${config.key}: ${created ? 'cree' : 'existe deja'}`);
    } catch (error) {
      console.error(`  Erreur pour ${config.key}:`, error.message);
    }
  }

  console.log('Terminé!');
  process.exit(0);
}

addImapConfig().catch(e => {
  console.error('Erreur:', e);
  process.exit(1);
});
