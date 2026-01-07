import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create PDF document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
  info: {
    Title: 'Manuel Utilisateur Complet - Guichet Unique ANAPI',
    Author: 'FUTURISS VISION SA',
    Subject: 'Guide complet d\'utilisation de la plateforme',
    Keywords: 'ANAPI, Guichet Unique, Investissement, RDC, Manuel',
    CreationDate: new Date(),
  }
});

// Output file
const outputPath = path.join(__dirname, '..', 'FUTURISS_VISION_Manuel_Complet_ANAPI.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const primaryColor = '#0A1628';
const accentColor = '#D4A853';
const secondaryColor = '#1E3A5F';
const textColor = '#333333';
const lightGray = '#666666';
const white = '#FFFFFF';
const success = '#22C55E';
const info = '#3B82F6';

let pageNumber = 0;

// Helper functions
function newPage() {
  if (pageNumber > 0) doc.addPage();
  pageNumber++;
  // Add page number footer
  doc.fontSize(8).fillColor(lightGray).text(
    `Page ${pageNumber}`,
    50, 800,
    { align: 'center', width: 495 }
  );
  doc.y = 50;
}

function addTitle(text, size = 22) {
  doc.fontSize(size).fillColor(primaryColor).font('Helvetica-Bold').text(text);
  doc.strokeColor(accentColor).lineWidth(3).moveTo(50, doc.y + 5).lineTo(250, doc.y + 5).stroke();
  doc.moveDown(0.8);
}

function addSubTitle(text, size = 14) {
  doc.fontSize(size).fillColor(secondaryColor).font('Helvetica-Bold').text(text);
  doc.moveDown(0.3);
}

function addSection(text, size = 12) {
  doc.fontSize(size).fillColor(accentColor).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function addParagraph(text) {
  doc.fontSize(10).fillColor(textColor).font('Helvetica').text(text, { align: 'justify', lineGap: 3 });
  doc.moveDown(0.4);
}

function addBullet(text, indent = 20) {
  doc.fontSize(10).fillColor(textColor).font('Helvetica').text(`• ${text}`, { indent, lineGap: 2 });
  doc.moveDown(0.1);
}

function addNumberedStep(num, title, desc) {
  doc.fontSize(10).fillColor(accentColor).font('Helvetica-Bold').text(`${num}. ${title}`, { continued: desc ? true : false });
  if (desc) {
    doc.fillColor(textColor).font('Helvetica').text(` - ${desc}`);
  }
  doc.moveDown(0.2);
}

function addInfoBox(title, content) {
  const boxY = doc.y;
  doc.roundedRect(50, boxY, 495, 60, 5).fill('#E8F4FD');
  doc.fontSize(10).fillColor(info).font('Helvetica-Bold').text(title, 60, boxY + 10);
  doc.fontSize(9).fillColor(textColor).font('Helvetica').text(content, 60, boxY + 28, { width: 475 });
  doc.y = boxY + 70;
}

function addWarningBox(content) {
  const boxY = doc.y;
  doc.roundedRect(50, boxY, 495, 45, 5).fill('#FEF3C7');
  doc.fontSize(9).fillColor('#92400E').font('Helvetica-Bold').text('⚠ Important : ', 60, boxY + 15, { continued: true });
  doc.font('Helvetica').text(content, { width: 460 });
  doc.y = boxY + 55;
}

function addFeatureBox(title, features) {
  const boxY = doc.y;
  const height = 25 + features.length * 18;
  doc.roundedRect(50, boxY, 495, height, 5).fill('#F0FDF4');
  doc.fontSize(10).fillColor(success).font('Helvetica-Bold').text(title, 60, boxY + 8);
  let y = boxY + 25;
  features.forEach(f => {
    doc.fontSize(9).fillColor(textColor).font('Helvetica').text(`✓ ${f}`, 70, y);
    y += 18;
  });
  doc.y = boxY + height + 10;
}

// ========================================
// PAGE 1 - COUVERTURE
// ========================================
doc.rect(0, 0, 595, 842).fill(primaryColor);

// Header band
doc.rect(0, 0, 595, 120).fill(secondaryColor);
doc.fontSize(18).fillColor(accentColor).font('Helvetica-Bold').text('FUTURISS VISION', 50, 40, { continued: true });
doc.fillColor(white).text(' SA');
doc.fontSize(11).fillColor(white).font('Helvetica').text('Solutions Technologiques Innovantes pour l\'Afrique', 50, 65);
doc.fontSize(9).fillColor(lightGray).text('Kinshasa, République Démocratique du Congo', 50, 85);

// Main title
doc.fontSize(12).fillColor(accentColor).font('Helvetica').text('MANUEL D\'UTILISATEUR COMPLET', 50, 180, { align: 'center', width: 495 });
doc.fontSize(38).fillColor(white).font('Helvetica-Bold').text('GUICHET UNIQUE', 50, 210, { align: 'center', width: 495 });
doc.fontSize(22).text('DES INVESTISSEMENTS', 50, 260, { align: 'center', width: 495 });

doc.strokeColor(accentColor).lineWidth(4).moveTo(150, 300).lineTo(445, 300).stroke();

doc.fontSize(52).fillColor(accentColor).font('Helvetica-Bold').text('ANAPI', 50, 320, { align: 'center', width: 495 });
doc.fontSize(12).fillColor(white).font('Helvetica').text('Agence Nationale pour la Promotion des Investissements', 50, 385, { align: 'center', width: 495 });

// Description box
doc.roundedRect(80, 440, 435, 120, 10).fill(secondaryColor);
doc.fontSize(10).fillColor(white).font('Helvetica').text(
  'Ce manuel vous guide pas à pas dans l\'utilisation de la plateforme Guichet Unique des Investissements. Il couvre toutes les fonctionnalités pour les investisseurs et les administrateurs.',
  100, 460, { width: 395, align: 'center' }
);
doc.fontSize(9).fillColor(accentColor).text('Destiné aux :', 100, 510, { width: 395, align: 'center' });
doc.fillColor(white).text('Investisseurs • Administrateurs • Agents ANAPI • Partenaires', 100, 525, { width: 395, align: 'center' });

// Features at bottom
doc.rect(0, 620, 595, 222).fill(secondaryColor);
const features = [
  { num: '50+', label: 'Pages détaillées' },
  { num: '8', label: 'Modules expliqués' },
  { num: '6', label: 'Langues supportées' },
  { num: '24/7', label: 'Accès plateforme' },
];
let fx = 60;
features.forEach(f => {
  doc.fontSize(20).fillColor(accentColor).font('Helvetica-Bold').text(f.num, fx, 660, { width: 110, align: 'center' });
  doc.fontSize(9).fillColor(white).font('Helvetica').text(f.label, fx, 690, { width: 110, align: 'center' });
  fx += 125;
});

doc.fontSize(10).fillColor(lightGray).text('Version 2.0 - Janvier 2026', 50, 780, { align: 'center', width: 495 });

// ========================================
// PAGE 2 - TABLE DES MATIÈRES
// ========================================
newPage();
addTitle('TABLE DES MATIÈRES');

const toc = [
  { num: '1', title: 'Introduction et Présentation', page: '3' },
  { num: '2', title: 'Connexion - Investisseurs', page: '4' },
  { num: '3', title: 'Connexion - Administrateurs', page: '5' },
  { num: '4', title: 'Le Tableau de Bord (Dashboard)', page: '6' },
  { num: '5', title: 'Module Guichet Unique', page: '7' },
  { num: '6', title: 'Tous les Dossiers', page: '8' },
  { num: '7', title: 'Agréments', page: '9' },
  { num: '8', title: 'Licences', page: '10' },
  { num: '9', title: 'Permis', page: '11' },
  { num: '10', title: 'Autorisations', page: '12' },
  { num: '11', title: 'Direction Juridique - Textes', page: '13' },
  { num: '12', title: 'Direction Juridique - Contrats', page: '14' },
  { num: '13', title: 'Direction Juridique - Alertes', page: '15' },
  { num: '14', title: 'Investissements - Projets', page: '16' },
  { num: '15', title: 'Investissements - Opportunités', page: '17' },
  { num: '16', title: 'Climat des Affaires', page: '18' },
  { num: '17', title: 'Référentiels', page: '19' },
  { num: '18', title: 'Ministères Partenaires', page: '20' },
  { num: '19', title: 'Passation de Marchés', page: '21' },
  { num: '20', title: 'Configuration du Système', page: '22' },
  { num: '21', title: 'Rapports et Statistiques', page: '23' },
  { num: '22', title: 'Support et Assistance', page: '24' },
];

// Table des matières avec format tableau
let tocY = doc.y;
toc.forEach(item => {
  const dots = '.'.repeat(50);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold')
    .text(`${item.num}.`, 60, tocY, { width: 25 });
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica')
    .text(item.title, 85, tocY, { width: 300 });
  doc.fontSize(10).fillColor(lightGray).font('Helvetica')
    .text(dots, 280, tocY, { width: 200 });
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold')
    .text(item.page, 500, tocY, { width: 40, align: 'right' });
  tocY += 18;
});
doc.y = tocY + 10;

// ========================================
// PAGE 3 - INTRODUCTION
// ========================================
newPage();
addTitle('1. INTRODUCTION');

addSubTitle('Qu\'est-ce que le Guichet Unique ANAPI ?');
addParagraph(
  'Le Guichet Unique des Investissements est une plateforme numérique développée par FUTURISS VISION SA pour l\'ANAPI (Agence Nationale pour la Promotion des Investissements). Cette plateforme révolutionne la manière dont les investisseurs interagissent avec l\'administration congolaise en centralisant toutes les démarches administratives en un seul point d\'accès.'
);

addSubTitle('Objectifs de la Plateforme');
addBullet('Simplifier les procédures administratives pour les investisseurs');
addBullet('Réduire les délais de traitement des dossiers de 60%');
addBullet('Éliminer les déplacements physiques inutiles');
addBullet('Assurer la transparence avec un suivi en temps réel');
addBullet('Offrir un accompagnement personnalisé par des experts ANAPI');
addBullet('Supporter 6 langues internationales (FR, EN, PT, ES, ZH, AR)');

doc.moveDown(0.5);

addSubTitle('Types d\'Utilisateurs');
addParagraph('La plateforme distingue deux types principaux d\'utilisateurs :');

addSection('A. Les Investisseurs');
addBullet('Créent un compte sur la plateforme');
addBullet('Soumettent leurs demandes d\'agréments, licences, permis');
addBullet('Suivent l\'avancement de leurs dossiers en temps réel');
addBullet('Communiquent avec leur expert ANAPI assigné');
addBullet('Téléchargent leurs documents officiels');

doc.moveDown(0.3);

addSection('B. Les Administrateurs (Staff ANAPI)');
addBullet('Agents : Traitent les dossiers assignés');
addBullet('Managers : Supervisent les équipes et valident les décisions');
addBullet('Administrateurs : Gèrent le système et les utilisateurs');
addBullet('Partenaires : Ministères intervenant dans les workflows');

doc.moveDown(0.5);

addInfoBox(
  'Accès à la Plateforme',
  'URL : https://anapi.futurissvision.com\nLa plateforme est accessible 24h/24, 7j/7 depuis tout navigateur web moderne (Chrome, Firefox, Safari, Edge) sur ordinateur, tablette ou smartphone.'
);

// ========================================
// PAGE 4 - CONNEXION INVESTISSEURS
// ========================================
newPage();
addTitle('2. CONNEXION - INVESTISSEURS');

addSubTitle('Comment créer un compte investisseur ?');
addParagraph(
  'Les investisseurs peuvent créer un compte gratuitement pour accéder à tous les services du Guichet Unique. Voici les étapes détaillées :'
);

addSection('Étape 1 : Accéder à la page d\'inscription');
addParagraph('Rendez-vous sur https://anapi.futurissvision.com et cliquez sur le bouton "Créer un compte" ou "S\'inscrire" situé en haut à droite de la page d\'accueil.');

addSection('Étape 2 : Remplir le formulaire d\'inscription');
addBullet('Prénom et Nom complet');
addBullet('Adresse email professionnelle (sera votre identifiant)');
addBullet('Numéro de téléphone avec indicatif pays');
addBullet('Pays de résidence');
addBullet('Mot de passe sécurisé (minimum 8 caractères, avec majuscule et chiffre)');

addSection('Étape 3 : Vérification de l\'email');
addParagraph('Un email de confirmation est envoyé à l\'adresse fournie. Cliquez sur le lien de vérification pour activer votre compte. Ce lien expire après 24 heures.');

addSection('Étape 4 : Compléter votre profil investisseur');
addBullet('Type d\'investisseur (Personne physique / Société)');
addBullet('Secteur d\'activité principal');
addBullet('Montant estimé de l\'investissement');
addBullet('Province(s) ciblée(s) pour l\'investissement');

addSection('Étape 5 : Attribution d\'un expert');
addParagraph('Dès la validation de votre profil, un expert ANAPI vous est automatiquement assigné. Cet expert sera votre interlocuteur privilégié pour toutes vos démarches.');

doc.moveDown(0.5);

addWarningBox('Conservez précieusement vos identifiants de connexion. En cas d\'oubli du mot de passe, utilisez la fonction "Mot de passe oublié" sur la page de connexion.');

doc.moveDown(0.5);

addSubTitle('Se connecter à son compte');
addNumberedStep('1', 'Accédez à la page de connexion', 'https://anapi.futurissvision.com/login');
addNumberedStep('2', 'Entrez votre email', 'L\'adresse utilisée lors de l\'inscription');
addNumberedStep('3', 'Entrez votre mot de passe', '');
addNumberedStep('4', 'Cliquez sur "Se connecter"', '');
addNumberedStep('5', 'Redirection automatique', 'Vous arrivez sur votre Tableau de Bord');

// ========================================
// PAGE 5 - CONNEXION ADMINISTRATEURS
// ========================================
newPage();
addTitle('3. CONNEXION - ADMINISTRATEURS');

addSubTitle('Qui sont les administrateurs ?');
addParagraph(
  'Les administrateurs sont les membres du personnel de l\'ANAPI et des ministères partenaires qui utilisent la plateforme pour traiter les demandes des investisseurs. Leurs comptes sont créés par le super-administrateur du système.'
);

addSection('Types de comptes administrateurs');

addSubTitle('A. Agent ANAPI');
addBullet('Reçoit et traite les dossiers qui lui sont assignés');
addBullet('Vérifie la conformité des documents soumis');
addBullet('Communique avec les investisseurs via la messagerie interne');
addBullet('Fait avancer les dossiers dans le workflow de validation');
addBullet('Génère les documents intermédiaires');

doc.moveDown(0.3);

addSubTitle('B. Manager');
addBullet('Supervise une équipe d\'agents');
addBullet('Assigne les dossiers aux agents de son équipe');
addBullet('Valide les décisions importantes');
addBullet('Accède aux statistiques de performance');
addBullet('Peut réassigner les dossiers en cas de besoin');

doc.moveDown(0.3);

addSubTitle('C. Administrateur Système');
addBullet('Gère les comptes utilisateurs (création, modification, suppression)');
addBullet('Configure les paramètres du système');
addBullet('Gère les référentiels (provinces, secteurs, types de documents)');
addBullet('Accède à tous les modules sans restriction');
addBullet('Génère les rapports globaux');

doc.moveDown(0.3);

addSubTitle('D. Partenaire (Ministères)');
addBullet('Accès limité aux dossiers concernant leur ministère');
addBullet('Donne les avis techniques requis dans le workflow');
addBullet('Valide les étapes relevant de leur compétence');

doc.moveDown(0.5);

addSubTitle('Processus de connexion administrateur');
addParagraph('Les administrateurs reçoivent leurs identifiants par email lors de la création de leur compte :');
addNumberedStep('1', 'Email de bienvenue', 'Contient un lien de première connexion');
addNumberedStep('2', 'Définir son mot de passe', 'Créez un mot de passe personnel sécurisé');
addNumberedStep('3', 'Connexion standard', 'Utilisez https://anapi.futurissvision.com/login');
addNumberedStep('4', 'Accès au Dashboard', 'Interface adaptée selon votre rôle');

doc.moveDown(0.5);

addInfoBox(
  'Sécurité des comptes administrateurs',
  'Les sessions administrateur expirent après 8 heures d\'inactivité. Pour des raisons de sécurité, ne partagez jamais vos identifiants et déconnectez-vous après chaque utilisation sur un ordinateur partagé.'
);

// ========================================
// PAGE 6 - DASHBOARD
// ========================================
newPage();
addTitle('4. TABLEAU DE BORD (DASHBOARD)');

addSubTitle('Vue d\'ensemble');
addParagraph(
  'Le Tableau de Bord est votre page d\'accueil après connexion. Il offre une vue synthétique de votre activité et des accès rapides à toutes les fonctionnalités de la plateforme.'
);

addSection('Éléments du Dashboard - Investisseur');
addBullet('Statistiques personnelles : Nombre de dossiers, statuts en cours');
addBullet('Mes dossiers récents : Liste des 5 dernières demandes avec leur statut');
addBullet('Notifications : Messages de votre expert, alertes sur vos dossiers');
addBullet('Actions rapides : Boutons pour créer un nouveau dossier');
addBullet('Mon expert : Coordonnées de l\'expert ANAPI assigné');

doc.moveDown(0.3);

addSection('Éléments du Dashboard - Administrateur');
addBullet('Statistiques globales : Total des dossiers, répartition par statut');
addBullet('Graphiques : Évolution mensuelle, répartition par secteur/province');
addBullet('Dossiers à traiter : Liste des dossiers en attente d\'action');
addBullet('Performance : Délais moyens de traitement, taux de validation');
addBullet('Alertes système : Dossiers urgents, échéances proches');

doc.moveDown(0.5);

addSubTitle('Le Menu de Navigation (Sidebar)');
addParagraph('Le menu latéral gauche donne accès à tous les modules de la plateforme. Voici la structure complète visible sur votre écran :');

const menuItems = [
  'Tous les dossiers - Vue globale de toutes les demandes',
  'Agréments - Certificats d\'agrément au Code des Investissements',
  'Licences - Licences d\'exploitation et professionnelles',
  'Permis - Permis de travail, environnementaux, de construction',
  'Autorisations - Autorisations commerciales et administratives',
  'Direction Juridique - Textes, contrats et alertes juridiques',
  'Investissements - Projets déclarés et opportunités',
  'Climat des Affaires - Indicateurs et réformes',
  'Référentiels - Données de base du système',
  'Ministères - Partenaires institutionnels',
  'Passation de Marchés - Appels d\'offres publics',
  'Configuration - Paramètres du système (admin)',
  'Rapports - Statistiques et exports',
];

menuItems.forEach((item, i) => {
  doc.fontSize(9).fillColor(textColor).font('Helvetica').text(`${i + 1}. ${item}`, 60);
  doc.moveDown(0.1);
});

// ========================================
// PAGE 7 - GUICHET UNIQUE VUE D'ENSEMBLE
// ========================================
newPage();
addTitle('5. MODULE GUICHET UNIQUE');

addSubTitle('Présentation du Module');
addParagraph(
  'Le Guichet Unique est le cœur de la plateforme. C\'est ici que les investisseurs soumettent leurs demandes et que les administrateurs les traitent. Le module gère 4 types de documents administratifs essentiels pour investir en RDC.'
);

addSection('Les 4 Types de Documents');

doc.moveDown(0.3);
addSubTitle('1. Agréments');
addParagraph('Les agréments sont des certificats officiels délivrés par l\'ANAPI reconnaissant votre projet d\'investissement et vous donnant accès aux avantages du Code des Investissements (exonérations fiscales, douanières, etc.).');

addSubTitle('2. Licences');
addParagraph('Les licences sont des autorisations d\'exercer une activité professionnelle réglementée. Elles sont obligatoires pour certains secteurs comme l\'import/export, les télécommunications, ou les activités financières.');

addSubTitle('3. Permis');
addParagraph('Les permis sont des autorisations spécifiques pour des activités ponctuelles ou continues : permis de construire, permis environnemental, permis de travail pour employés étrangers, etc.');

addSubTitle('4. Autorisations');
addParagraph('Les autorisations commerciales permettent d\'exercer légalement une activité commerciale en RDC : autorisation d\'ouverture d\'établissement, autorisation d\'exploitation, etc.');

doc.moveDown(0.5);

addSubTitle('Workflow de Traitement');
addParagraph('Chaque dossier suit un circuit de validation en plusieurs étapes :');

addNumberedStep('1', 'Soumission', 'L\'investisseur crée et soumet son dossier');
addNumberedStep('2', 'Réception', 'Un agent vérifie la complétude du dossier');
addNumberedStep('3', 'Analyse', 'Étude technique par les experts ANAPI');
addNumberedStep('4', 'Consultation', 'Avis des ministères concernés si nécessaire');
addNumberedStep('5', 'Validation', 'Approbation par le manager');
addNumberedStep('6', 'Signature', 'Signature par la Direction Générale');
addNumberedStep('7', 'Délivrance', 'Génération et mise à disposition du document');

doc.moveDown(0.5);

addFeatureBox('Fonctionnalités Clés', [
  'Suivi en temps réel de chaque étape',
  'Notifications automatiques à chaque changement de statut',
  'Messagerie intégrée avec l\'agent traitant',
  'Téléchargement des documents officiels en PDF',
]);

// ========================================
// PAGE 8 - TOUS LES DOSSIERS
// ========================================
newPage();
addTitle('6. TOUS LES DOSSIERS');

addSubTitle('Description');
addParagraph(
  'La section "Tous les dossiers" affiche la liste complète de toutes vos demandes (pour les investisseurs) ou de tous les dossiers du système (pour les administrateurs). C\'est votre vue centrale pour gérer l\'ensemble de vos démarches.'
);

addSubTitle('Interface de la Liste');
addParagraph('L\'écran affiche un tableau avec les colonnes suivantes :');
addBullet('Référence : Numéro unique du dossier (ex: DOS-2026-00001)');
addBullet('Type : Agrément, Licence, Permis ou Autorisation');
addBullet('Demandeur : Nom de l\'investisseur');
addBullet('Date de soumission : Date de création du dossier');
addBullet('Statut : État actuel du dossier');
addBullet('Agent assigné : Responsable du traitement');
addBullet('Actions : Boutons pour voir, modifier, supprimer');

doc.moveDown(0.3);

addSubTitle('Les Statuts des Dossiers');
addParagraph('Chaque dossier peut avoir l\'un des statuts suivants :');

const statuts = [
  { status: 'BROUILLON', color: '#6B7280', desc: 'Dossier en cours de préparation, non soumis' },
  { status: 'SOUMIS', color: '#3B82F6', desc: 'Dossier envoyé, en attente de prise en charge' },
  { status: 'EN COURS', color: '#F59E0B', desc: 'Dossier en cours de traitement par un agent' },
  { status: 'DOCUMENTS REQUIS', color: '#EF4444', desc: 'Pièces complémentaires demandées' },
  { status: 'EN RÉVISION', color: '#8B5CF6', desc: 'Analyse approfondie par les experts' },
  { status: 'APPROUVÉ', color: '#22C55E', desc: 'Demande acceptée, en attente de signature' },
  { status: 'REJETÉ', color: '#EF4444', desc: 'Demande refusée (motif fourni)' },
  { status: 'TERMINÉ', color: '#22C55E', desc: 'Document final disponible' },
];

statuts.forEach(s => {
  doc.fontSize(9).fillColor(s.color).font('Helvetica-Bold').text(`${s.status} : `, 60, doc.y, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(s.desc);
  doc.moveDown(0.15);
});

doc.moveDown(0.3);

addSubTitle('Filtres et Recherche');
addParagraph('Utilisez les filtres pour trouver rapidement un dossier :');
addBullet('Recherche par référence ou nom du demandeur');
addBullet('Filtre par type de document');
addBullet('Filtre par statut');
addBullet('Filtre par date (période)');
addBullet('Filtre par agent assigné (admin)');

doc.moveDown(0.3);

addSubTitle('Créer un Nouveau Dossier');
addParagraph('Pour créer une nouvelle demande :');
addNumberedStep('1', 'Cliquez sur "Nouveau Dossier"');
addNumberedStep('2', 'Sélectionnez le type de document');
addNumberedStep('3', 'Remplissez les informations requises');
addNumberedStep('4', 'Téléchargez les pièces justificatives');
addNumberedStep('5', 'Vérifiez et soumettez');

// ========================================
// PAGE 9 - AGRÉMENTS
// ========================================
newPage();
addTitle('7. AGRÉMENTS');

addSubTitle('Qu\'est-ce qu\'un Agrément ?');
addParagraph(
  'L\'Agrément au Code des Investissements est le document officiel délivré par l\'ANAPI qui reconnaît votre projet d\'investissement et vous accorde les avantages prévus par la loi. C\'est le premier document à obtenir pour bénéficier du régime privilégié des investisseurs en RDC.'
);

addSubTitle('Avantages de l\'Agrément');
addBullet('Exonération des droits de douane sur les équipements importés');
addBullet('Exonération de TVA sur les équipements et matériaux');
addBullet('Réduction de l\'impôt sur les bénéfices (jusqu\'à 5 ans)');
addBullet('Protection juridique de l\'investissement');
addBullet('Garantie de transfert des capitaux et bénéfices');

doc.moveDown(0.3);

addSubTitle('Conditions d\'Éligibilité');
addBullet('Investissement minimum de 200.000 USD');
addBullet('Création d\'au moins 10 emplois directs');
addBullet('Projet dans un secteur éligible');
addBullet('Plan d\'affaires viable');

doc.moveDown(0.3);

addSubTitle('Documents Requis');
addParagraph('Pour une demande d\'agrément, vous devez fournir :');
addBullet('Formulaire de demande dûment rempli');
addBullet('Statuts de la société (notariés)');
addBullet('RCCM (Registre du Commerce)');
addBullet('Numéro d\'Identification Nationale');
addBullet('Plan d\'affaires détaillé');
addBullet('Preuves de financement');
addBullet('Étude d\'impact environnemental (si applicable)');
addBullet('CV des dirigeants');

doc.moveDown(0.3);

addSubTitle('Procédure de Demande');
addNumberedStep('1', 'Créer le dossier', 'Menu Guichet Unique > Agréments > Nouveau');
addNumberedStep('2', 'Informations générales', 'Nom du projet, montant, secteur, localisation');
addNumberedStep('3', 'Détails du projet', 'Description, objectifs, emplois créés');
addNumberedStep('4', 'Téléchargement documents', 'Joindre toutes les pièces requises');
addNumberedStep('5', 'Soumission', 'Vérifier et soumettre le dossier');
addNumberedStep('6', 'Suivi', 'Suivre l\'avancement dans "Mes dossiers"');

doc.moveDown(0.3);

addInfoBox(
  'Délai de traitement',
  'Le délai moyen de traitement d\'une demande d\'agrément est de 30 jours ouvrables à compter de la soumission d\'un dossier complet. Des pièces manquantes peuvent allonger ce délai.'
);

// ========================================
// PAGE 10 - LICENCES
// ========================================
newPage();
addTitle('8. LICENCES');

addSubTitle('Qu\'est-ce qu\'une Licence ?');
addParagraph(
  'Une licence est une autorisation administrative obligatoire pour exercer certaines activités professionnelles réglementées en RDC. Elle atteste que vous remplissez les conditions techniques, financières et professionnelles requises pour votre secteur d\'activité.'
);

addSubTitle('Types de Licences Disponibles');

addSection('Licences d\'Import/Export');
addBullet('Licence d\'importation de marchandises');
addBullet('Licence d\'exportation de produits');
addBullet('Licence de transit');
addBullet('Licence de commerce transfrontalier');

doc.moveDown(0.2);

addSection('Licences Sectorielles');
addBullet('Licence de télécommunications');
addBullet('Licence bancaire et financière');
addBullet('Licence d\'exploitation minière');
addBullet('Licence de transport');
addBullet('Licence pharmaceutique');
addBullet('Licence touristique');

doc.moveDown(0.3);

addSubTitle('Documents Généralement Requis');
addBullet('Formulaire de demande');
addBullet('Copie des statuts de la société');
addBullet('RCCM et NIF');
addBullet('Attestation fiscale');
addBullet('Preuves de capacité technique');
addBullet('Références professionnelles');
addBullet('Garantie bancaire (selon le type)');

doc.moveDown(0.3);

addSubTitle('Procédure');
addNumberedStep('1', 'Identifier le type de licence', 'Selon votre activité');
addNumberedStep('2', 'Créer le dossier', 'Menu Guichet Unique > Licences > Nouveau');
addNumberedStep('3', 'Remplir le formulaire', 'Informations sur l\'activité et l\'entreprise');
addNumberedStep('4', 'Joindre les documents', 'Scanner et télécharger les pièces');
addNumberedStep('5', 'Payer les frais', 'Selon le barème en vigueur');
addNumberedStep('6', 'Soumettre', 'Le dossier entre dans le circuit de validation');

doc.moveDown(0.3);

addWarningBox('Les licences ont généralement une durée de validité limitée (1 à 5 ans). Pensez à renouveler votre licence avant son expiration pour éviter toute interruption d\'activité.');

// ========================================
// PAGE 11 - PERMIS
// ========================================
newPage();
addTitle('9. PERMIS');

addSubTitle('Qu\'est-ce qu\'un Permis ?');
addParagraph(
  'Un permis est une autorisation spécifique délivrée pour réaliser une action ou exercer une activité ponctuelle ou continue nécessitant un contrôle administratif particulier. Contrairement aux licences, les permis sont souvent liés à des projets spécifiques.'
);

addSubTitle('Types de Permis Disponibles');

addSection('Permis de Construction');
addParagraph('Obligatoire pour tout projet de construction, rénovation majeure ou modification de bâtiment. Délivré après vérification de la conformité aux règles d\'urbanisme.');
addBullet('Permis de construire (bâtiments neufs)');
addBullet('Permis de rénovation');
addBullet('Permis de démolition');

doc.moveDown(0.2);

addSection('Permis Environnementaux');
addParagraph('Requis pour les activités ayant un impact sur l\'environnement :');
addBullet('Certificat environnemental');
addBullet('Permis d\'exploitation de ressources naturelles');
addBullet('Autorisation de rejet (eaux usées, émissions)');

doc.moveDown(0.2);

addSection('Permis de Travail');
addParagraph('Pour l\'emploi de personnel étranger :');
addBullet('Permis de travail pour expatriés');
addBullet('Visa de travail');
addBullet('Carte de séjour professionnel');

doc.moveDown(0.3);

addSubTitle('Documents Requis (Permis de Construire)');
addBullet('Plan architectural signé par un architecte agréé');
addBullet('Titre de propriété ou bail du terrain');
addBullet('Étude de sol');
addBullet('Plan d\'implantation');
addBullet('Devis estimatif des travaux');
addBullet('Attestation d\'alignement');

doc.moveDown(0.3);

addSubTitle('Suivi de Votre Demande');
addParagraph('Après soumission, vous pouvez suivre votre permis :');
addBullet('Timeline visuelle : voir l\'étape en cours');
addBullet('Notifications : alertes à chaque changement');
addBullet('Messages : communication avec l\'agent');
addBullet('Documents : pièces ajoutées par l\'administration');

// ========================================
// PAGE 12 - AUTORISATIONS
// ========================================
newPage();
addTitle('10. AUTORISATIONS');

addSubTitle('Qu\'est-ce qu\'une Autorisation ?');
addParagraph(
  'Les autorisations sont des documents administratifs qui vous permettent d\'exercer légalement une activité commerciale ou industrielle en RDC. Elles sont délivrées après vérification que vous respectez les conditions réglementaires.'
);

addSubTitle('Types d\'Autorisations');

addSection('Autorisations Commerciales');
addBullet('Autorisation d\'ouverture d\'établissement commercial');
addBullet('Autorisation d\'exploitation de commerce');
addBullet('Autorisation de vente de produits réglementés');
addBullet('Autorisation de publicité commerciale');

doc.moveDown(0.2);

addSection('Autorisations Industrielles');
addBullet('Autorisation d\'installation d\'usine');
addBullet('Autorisation d\'exploitation industrielle');
addBullet('Autorisation de fabrication');
addBullet('Autorisation de stockage de produits dangereux');

doc.moveDown(0.2);

addSection('Autorisations Spéciales');
addBullet('Autorisation de transfert de fonds');
addBullet('Autorisation d\'ouverture de compte en devises');
addBullet('Autorisation d\'emploi d\'expatriés');

doc.moveDown(0.3);

addSubTitle('Processus de Demande');
addParagraph('Le processus est similaire aux autres types de documents :');
addNumberedStep('1', 'Sélectionner le type d\'autorisation');
addNumberedStep('2', 'Remplir les informations requises');
addNumberedStep('3', 'Joindre les justificatifs');
addNumberedStep('4', 'Soumettre la demande');
addNumberedStep('5', 'Suivre le traitement');
addNumberedStep('6', 'Télécharger le document final');

doc.moveDown(0.3);

addSubTitle('Validité et Renouvellement');
addParagraph('Les autorisations ont une durée de validité variable :');
addBullet('Autorisation commerciale : généralement 1 an, renouvelable');
addBullet('Autorisation industrielle : 3 à 5 ans selon le type');
addBullet('La plateforme vous alerte 30 jours avant expiration');

doc.moveDown(0.3);

addFeatureBox('Fonctionnalités du Module', [
  'Création guidée pas à pas',
  'Vérification automatique des pièces',
  'Calcul automatique des frais',
  'Paiement en ligne sécurisé',
  'Téléchargement du document signé',
]);

// ========================================
// PAGE 13 - DIRECTION JURIDIQUE - TEXTES
// ========================================
newPage();
addTitle('11. DIRECTION JURIDIQUE');
addSubTitle('Textes Juridiques');

addParagraph(
  'Le module Direction Juridique centralise tous les textes de loi, décrets, arrêtés et réglementations relatifs aux investissements en RDC. C\'est votre bibliothèque juridique de référence.'
);

addSubTitle('Types de Textes Disponibles');

addSection('Lois');
addBullet('Code des Investissements');
addBullet('Code Minier');
addBullet('Code du Travail');
addBullet('Code des Impôts');
addBullet('Code du Commerce');

doc.moveDown(0.2);

addSection('Décrets');
addBullet('Décrets d\'application des lois');
addBullet('Décrets portant organisation des ministères');
addBullet('Décrets réglementaires');

doc.moveDown(0.2);

addSection('Arrêtés');
addBullet('Arrêtés ministériels');
addBullet('Arrêtés interministériels');
addBullet('Arrêtés provinciaux');

doc.moveDown(0.3);

addSubTitle('Fonctionnalités');
addBullet('Recherche par mot-clé dans les textes');
addBullet('Filtrage par type de texte, date, ministère');
addBullet('Téléchargement en PDF des textes officiels');
addBullet('Historique des versions et amendements');
addBullet('Textes connexes et références croisées');

doc.moveDown(0.3);

addSubTitle('Comment Utiliser');
addNumberedStep('1', 'Accéder au module', 'Menu > Direction Juridique > Textes Juridiques');
addNumberedStep('2', 'Rechercher', 'Utilisez la barre de recherche ou les filtres');
addNumberedStep('3', 'Consulter', 'Cliquez sur un texte pour le lire');
addNumberedStep('4', 'Télécharger', 'Bouton PDF pour sauvegarder');

doc.moveDown(0.3);

addInfoBox(
  'Mise à jour des textes',
  'Les textes juridiques sont mis à jour régulièrement par l\'équipe juridique de l\'ANAPI. La date de dernière mise à jour est indiquée sur chaque document.'
);

// ========================================
// PAGE 14 - DIRECTION JURIDIQUE - CONTRATS
// ========================================
newPage();
addTitle('12. CONTRATS');

addSubTitle('Gestion des Contrats');
addParagraph(
  'Le module Contrats permet de gérer les conventions et accords signés entre l\'ANAPI, les investisseurs et les partenaires. Il assure un suivi rigoureux des engagements contractuels.'
);

addSubTitle('Types de Contrats');
addBullet('Conventions d\'établissement');
addBullet('Contrats de partenariat public-privé (PPP)');
addBullet('Accords-cadres avec les investisseurs');
addBullet('Conventions fiscales');
addBullet('Contrats de concession');
addBullet('Protocoles d\'accord');

doc.moveDown(0.3);

addSubTitle('Informations Suivies');
addParagraph('Pour chaque contrat, le système enregistre :');
addBullet('Parties prenantes (signataires)');
addBullet('Objet du contrat');
addBullet('Date de signature');
addBullet('Durée et date d\'expiration');
addBullet('Montants et conditions financières');
addBullet('Obligations de chaque partie');
addBullet('Clauses particulières');
addBullet('Avenants et modifications');

doc.moveDown(0.3);

addSubTitle('Fonctionnalités');
addBullet('Création et enregistrement de nouveaux contrats');
addBullet('Stockage sécurisé des documents signés');
addBullet('Suivi des échéances et obligations');
addBullet('Alertes de renouvellement');
addBullet('Historique des modifications');
addBullet('Recherche avancée');

doc.moveDown(0.3);

addSubTitle('Accès aux Contrats');
addParagraph('L\'accès aux contrats est limité selon votre rôle :');
addBullet('Investisseurs : Uniquement leurs propres contrats');
addBullet('Agents : Contrats des dossiers assignés');
addBullet('Managers : Tous les contrats de leur service');
addBullet('Administrateurs : Accès complet');

// ========================================
// PAGE 15 - DIRECTION JURIDIQUE - ALERTES
// ========================================
newPage();
addTitle('13. ALERTES JURIDIQUES');

addSubTitle('Système d\'Alertes');
addParagraph(
  'Le module Alertes vous informe automatiquement des événements importants liés à vos activités juridiques et administratives. Ne manquez plus aucune échéance !'
);

addSubTitle('Types d\'Alertes');

addSection('Alertes de Renouvellement');
addBullet('Expiration prochaine d\'une licence (30, 15, 7 jours avant)');
addBullet('Renouvellement d\'agrément nécessaire');
addBullet('Permis arrivant à échéance');
addBullet('Autorisation à renouveler');

doc.moveDown(0.2);

addSection('Alertes Réglementaires');
addBullet('Nouvelle loi ou décret publié');
addBullet('Modification d\'une réglementation vous concernant');
addBullet('Changement de procédure administrative');

doc.moveDown(0.2);

addSection('Alertes Contractuelles');
addBullet('Échéance de paiement');
addBullet('Date limite d\'exécution d\'une obligation');
addBullet('Fin de période contractuelle');

doc.moveDown(0.2);

addSection('Alertes Dossiers');
addBullet('Changement de statut de votre dossier');
addBullet('Document requis par l\'administration');
addBullet('Message de votre agent traitant');

doc.moveDown(0.3);

addSubTitle('Configuration des Alertes');
addParagraph('Personnalisez vos notifications :');
addBullet('Par email : Recevoir un email pour chaque alerte');
addBullet('Dans l\'application : Notification sur le dashboard');
addBullet('Fréquence : Immédiate, quotidienne ou hebdomadaire');
addBullet('Types : Choisir les alertes à recevoir');

doc.moveDown(0.3);

addWarningBox('Les alertes de renouvellement sont cruciales. Un document expiré peut entraîner l\'arrêt de votre activité. Configurez vos alertes dès maintenant !');

// ========================================
// PAGE 16 - INVESTISSEMENTS - PROJETS
// ========================================
newPage();
addTitle('14. MODULE INVESTISSEMENTS');
addSubTitle('Projets d\'Investissement');

addParagraph(
  'Le module Investissements permet d\'enregistrer et de suivre vos projets d\'investissement déclarés en RDC. Il offre une vue complète sur le portefeuille d\'investissements et les avantages obtenus.'
);

addSubTitle('Enregistrer un Projet');
addParagraph('Pour déclarer un nouveau projet d\'investissement :');
addNumberedStep('1', 'Créer le projet', 'Menu Investissements > Projets > Nouveau');
addNumberedStep('2', 'Informations générales', 'Nom, description, objectifs');
addNumberedStep('3', 'Données financières', 'Montant total, sources de financement');
addNumberedStep('4', 'Localisation', 'Province(s), ville(s), site(s)');
addNumberedStep('5', 'Secteur', 'Agriculture, Mines, Industries, Services...');
addNumberedStep('6', 'Emplois', 'Nombre d\'emplois directs et indirects créés');
addNumberedStep('7', 'Calendrier', 'Dates de début et fin prévues');

doc.moveDown(0.3);

addSubTitle('Informations du Projet');
addBullet('Identifiant unique du projet');
addBullet('Statut : En préparation, En cours, Achevé');
addBullet('Montant investi vs montant prévu');
addBullet('Avantages fiscaux accordés');
addBullet('Documents associés (études, plans, rapports)');
addBullet('Historique des modifications');

doc.moveDown(0.3);

addSubTitle('Suivi des Avantages');
addParagraph('Le système calcule et affiche :');
addBullet('Total des exonérations douanières obtenues');
addBullet('Réductions d\'impôts accordées');
addBullet('TVA récupérée');
addBullet('Économies réalisées grâce à l\'agrément');

doc.moveDown(0.3);

addSubTitle('Rapports de Projet');
addParagraph('Générez des rapports détaillés :');
addBullet('Fiche synthétique du projet');
addBullet('État d\'avancement');
addBullet('Bilan des avantages');
addBullet('Impact économique (emplois, revenus générés)');

// ========================================
// PAGE 17 - INVESTISSEMENTS - OPPORTUNITÉS
// ========================================
newPage();
addTitle('15. OPPORTUNITÉS D\'INVESTISSEMENT');

addSubTitle('Description');
addParagraph(
  'La section Opportunités présente les projets et secteurs prioritaires identifiés par l\'ANAPI où les investisseurs peuvent trouver des possibilités d\'investissement attractives en RDC.'
);

addSubTitle('Catégories d\'Opportunités');

addSection('Agriculture');
addBullet('80 millions d\'hectares de terres arables');
addBullet('Cultures vivrières et industrielles');
addBullet('Élevage et pêche');
addBullet('Transformation agroalimentaire');

doc.moveDown(0.2);

addSection('Mines et Énergie');
addBullet('Premier producteur mondial de cobalt');
addBullet('Cuivre, coltan, or, diamant');
addBullet('Potentiel hydroélectrique de 100.000 MW');
addBullet('Énergies renouvelables');

doc.moveDown(0.2);

addSection('Infrastructure');
addBullet('Routes et ponts');
addBullet('Ports et aéroports');
addBullet('Télécommunications');
addBullet('Logements et immobilier');

doc.moveDown(0.2);

addSection('Industries');
addBullet('Transformation des matières premières');
addBullet('Manufacturing');
addBullet('Construction');
addBullet('Technologies');

doc.moveDown(0.3);

addSubTitle('Fonctionnalités');
addBullet('Catalogue des opportunités par secteur et province');
addBullet('Fiches détaillées avec études de marché');
addBullet('Contact direct avec les experts sectoriels');
addBullet('Mise en relation avec des partenaires locaux');
addBullet('Téléchargement de documents promotionnels');

doc.moveDown(0.3);

addSubTitle('Exprimer son Intérêt');
addParagraph('Pour manifester votre intérêt pour une opportunité :');
addNumberedStep('1', 'Parcourir les opportunités');
addNumberedStep('2', 'Sélectionner un projet');
addNumberedStep('3', 'Cliquer sur "Je suis intéressé"');
addNumberedStep('4', 'Remplir le formulaire de contact');
addNumberedStep('5', 'Un expert vous contactera sous 48h');

// ========================================
// PAGE 18 - CLIMAT DES AFFAIRES
// ========================================
newPage();
addTitle('16. CLIMAT DES AFFAIRES');

addSubTitle('Description');
addParagraph(
  'Le module Climat des Affaires présente les indicateurs et réformes visant à améliorer l\'environnement des affaires en RDC. Il permet de suivre les progrès du pays dans les classements internationaux.'
);

addSubTitle('Indicateurs Suivis');

addSection('Classement Doing Business');
addBullet('Position globale de la RDC');
addBullet('Évolution par rapport aux années précédentes');
addBullet('Comparaison avec les pays voisins');
addBullet('Détail par indicateur');

doc.moveDown(0.2);

addSection('Indicateurs Spécifiques');
addBullet('Création d\'entreprise : délais et coûts');
addBullet('Obtention de permis de construire');
addBullet('Raccordement à l\'électricité');
addBullet('Transfert de propriété');
addBullet('Obtention de crédit');
addBullet('Protection des investisseurs');
addBullet('Paiement des impôts');
addBullet('Commerce transfrontalier');
addBullet('Exécution des contrats');
addBullet('Résolution de l\'insolvabilité');

doc.moveDown(0.3);

addSubTitle('Réformes en Cours');
addParagraph('Consultez les réformes mises en œuvre pour améliorer le climat :');
addBullet('Réformes adoptées : Mesures déjà en application');
addBullet('Réformes en cours : Projets en discussion');
addBullet('Impact attendu : Amélioration prévue des indicateurs');

doc.moveDown(0.3);

addSubTitle('Statistiques');
addBullet('Nombre de nouvelles entreprises créées');
addBullet('Investissements directs étrangers (IDE)');
addBullet('Emplois créés par les investisseurs agréés');
addBullet('Volume des échanges commerciaux');

// ========================================
// PAGE 19 - RÉFÉRENTIELS
// ========================================
newPage();
addTitle('17. RÉFÉRENTIELS');

addSubTitle('Qu\'est-ce que les Référentiels ?');
addParagraph(
  'Les référentiels sont les données de base utilisées dans toute la plateforme. Ils assurent la cohérence et la standardisation des informations. Seuls les administrateurs peuvent modifier ces données.'
);

addSubTitle('Types de Référentiels');

addSection('Géographiques');
addBullet('Provinces : Les 26 provinces de la RDC');
addBullet('Villes : Liste des villes par province');
addBullet('Communes : Subdivisions des villes');
addBullet('Territoires : Zones rurales');

doc.moveDown(0.2);

addSection('Sectoriels');
addBullet('Secteurs d\'activité : Agriculture, Mines, Industries...');
addBullet('Sous-secteurs : Détail de chaque secteur');
addBullet('Codes NACE : Classification économique');

doc.moveDown(0.2);

addSection('Administratifs');
addBullet('Types de documents : Agréments, Licences, Permis...');
addBullet('Types de demandeurs : Personne physique, Société...');
addBullet('Statuts de dossier : Brouillon, Soumis, En cours...');
addBullet('Motifs de rejet : Raisons standardisées');

doc.moveDown(0.2);

addSection('Organisationnels');
addBullet('Ministères : Liste des ministères partenaires');
addBullet('Services : Services au sein de chaque ministère');
addBullet('Rôles utilisateurs : Admin, Manager, Agent...');

doc.moveDown(0.3);

addSubTitle('Gestion des Référentiels (Admin)');
addParagraph('Les administrateurs peuvent :');
addBullet('Ajouter de nouvelles entrées');
addBullet('Modifier les entrées existantes');
addBullet('Désactiver les entrées obsolètes');
addBullet('Exporter les référentiels en Excel');
addBullet('Importer des données en masse');

// ========================================
// PAGE 20 - MINISTÈRES
// ========================================
newPage();
addTitle('18. MINISTÈRES PARTENAIRES');

addSubTitle('Rôle des Ministères');
addParagraph(
  'L\'ANAPI travaille en collaboration avec plusieurs ministères qui interviennent dans le processus de traitement des demandes d\'investissement. Chaque ministère donne un avis technique dans son domaine de compétence.'
);

addSubTitle('Ministères Impliqués');

addSection('Ministère du Commerce Extérieur');
addBullet('Licences d\'import/export');
addBullet('Autorisations commerciales');
addBullet('Agrément des sociétés commerciales');

doc.moveDown(0.2);

addSection('Ministère des Mines');
addBullet('Permis de recherche minière');
addBullet('Permis d\'exploitation');
addBullet('Agréments miniers');

doc.moveDown(0.2);

addSection('Ministère de l\'Environnement');
addBullet('Études d\'impact environnemental');
addBullet('Certificats environnementaux');
addBullet('Permis de pollution');

doc.moveDown(0.2);

addSection('Ministère du Travail');
addBullet('Permis de travail pour expatriés');
addBullet('Visa de travail');
addBullet('Homologation des contrats');

doc.moveDown(0.2);

addSection('Ministère des Finances');
addBullet('Régimes fiscaux privilégiés');
addBullet('Exonérations douanières');
addBullet('Agréments fiscaux');

doc.moveDown(0.3);

addSubTitle('Workflow Inter-Ministériel');
addParagraph('Certains dossiers nécessitent l\'avis de plusieurs ministères :');
addNumberedStep('1', 'L\'ANAPI reçoit le dossier');
addNumberedStep('2', 'Transmission aux ministères concernés');
addNumberedStep('3', 'Chaque ministère donne son avis');
addNumberedStep('4', 'Consolidation des avis par l\'ANAPI');
addNumberedStep('5', 'Décision finale');

// ========================================
// PAGE 21 - PASSATION DE MARCHÉS
// ========================================
newPage();
addTitle('19. PASSATION DE MARCHÉS');

addSubTitle('Description');
addParagraph(
  'Le module Passation de Marchés permet de consulter les appels d\'offres publics et de soumettre des candidatures pour les marchés de l\'État congolais et de ses partenaires.'
);

addSubTitle('Types de Marchés');

addSection('Marchés de Travaux');
addBullet('Construction d\'infrastructures');
addBullet('Réhabilitation de bâtiments');
addBullet('Travaux routiers');
addBullet('Aménagements urbains');

doc.moveDown(0.2);

addSection('Marchés de Fournitures');
addBullet('Équipements et matériels');
addBullet('Véhicules');
addBullet('Mobilier');
addBullet('Consommables');

doc.moveDown(0.2);

addSection('Marchés de Services');
addBullet('Études et conseil');
addBullet('Formation');
addBullet('Maintenance');
addBullet('Services informatiques');

doc.moveDown(0.3);

addSubTitle('Fonctionnalités');
addBullet('Liste des appels d\'offres en cours');
addBullet('Filtrage par type, secteur, montant');
addBullet('Téléchargement des cahiers des charges');
addBullet('Soumission des offres en ligne');
addBullet('Suivi des candidatures');
addBullet('Résultats des attributions');

doc.moveDown(0.3);

addSubTitle('Comment Soumissionner');
addNumberedStep('1', 'Consulter les appels d\'offres', 'Menu > Passation de Marchés');
addNumberedStep('2', 'Télécharger le dossier', 'Cahier des charges, spécifications');
addNumberedStep('3', 'Préparer votre offre', 'Selon les exigences du dossier');
addNumberedStep('4', 'Soumettre en ligne', 'Avant la date limite');
addNumberedStep('5', 'Suivre', 'État de votre soumission');

// ========================================
// PAGE 22 - CONFIGURATION
// ========================================
newPage();
addTitle('20. CONFIGURATION');

addSubTitle('Réservé aux Administrateurs');
addParagraph(
  'Le module Configuration permet aux administrateurs de paramétrer et personnaliser la plateforme selon les besoins de l\'ANAPI.'
);

addSubTitle('Paramètres Généraux');
addBullet('Nom et logo de l\'organisation');
addBullet('Informations de contact');
addBullet('Langues activées');
addBullet('Fuseau horaire');

doc.moveDown(0.2);

addSubTitle('Gestion des Utilisateurs');
addBullet('Créer de nouveaux comptes');
addBullet('Attribuer les rôles et permissions');
addBullet('Activer/désactiver des comptes');
addBullet('Réinitialiser les mots de passe');
addBullet('Affecter les utilisateurs aux services');

doc.moveDown(0.2);

addSubTitle('Configuration des Workflows');
addBullet('Définir les étapes de validation par type de document');
addBullet('Assigner les rôles responsables de chaque étape');
addBullet('Configurer les délais de traitement');
addBullet('Paramétrer les notifications automatiques');

doc.moveDown(0.2);

addSubTitle('Documents Types');
addBullet('Modèles de documents officiels');
addBullet('Templates d\'emails automatiques');
addBullet('Formulaires de demande');

doc.moveDown(0.2);

addSubTitle('Paramètres de Sécurité');
addBullet('Politique de mot de passe');
addBullet('Durée des sessions');
addBullet('Journalisation des accès');
addBullet('Sauvegarde des données');

doc.moveDown(0.3);

addWarningBox('Les modifications de configuration peuvent affecter tous les utilisateurs. Testez les changements avant de les appliquer en production.');

// ========================================
// PAGE 23 - RAPPORTS ET STATISTIQUES
// ========================================
newPage();
addTitle('21. RAPPORTS ET STATISTIQUES');

addSubTitle('Description');
addParagraph(
  'Le module Rapports génère des statistiques et des analyses sur l\'activité de la plateforme. Il permet de mesurer la performance et de prendre des décisions basées sur les données.'
);

addSubTitle('Types de Rapports');

addSection('Tableau de Bord Global');
addBullet('Vue d\'ensemble de l\'activité');
addBullet('KPIs principaux');
addBullet('Tendances mensuelles');

doc.moveDown(0.2);

addSection('Rapports sur les Dossiers');
addBullet('Nombre de dossiers par type');
addBullet('Répartition par statut');
addBullet('Délais moyens de traitement');
addBullet('Taux d\'approbation/rejet');

doc.moveDown(0.2);

addSection('Rapports Géographiques');
addBullet('Investissements par province');
addBullet('Carte interactive des projets');
addBullet('Comparaison inter-provinciale');

doc.moveDown(0.2);

addSection('Rapports Sectoriels');
addBullet('Répartition par secteur d\'activité');
addBullet('Montants investis par secteur');
addBullet('Emplois créés par secteur');

doc.moveDown(0.2);

addSection('Rapports de Performance');
addBullet('Performance par agent');
addBullet('Charge de travail');
addBullet('Respect des délais');

doc.moveDown(0.3);

addSubTitle('Formats d\'Export');
addBullet('PDF : Rapports formatés pour impression');
addBullet('Excel : Données brutes pour analyse');
addBullet('CSV : Intégration avec d\'autres systèmes');

doc.moveDown(0.3);

addSubTitle('Génération de Rapports');
addNumberedStep('1', 'Sélectionner le type de rapport');
addNumberedStep('2', 'Définir les filtres (période, type, province...)');
addNumberedStep('3', 'Prévisualiser');
addNumberedStep('4', 'Exporter ou imprimer');

// ========================================
// PAGE 24 - SUPPORT
// ========================================
newPage();
addTitle('22. SUPPORT ET ASSISTANCE');

addSubTitle('Besoin d\'Aide ?');
addParagraph(
  'Notre équipe est à votre disposition pour vous accompagner dans l\'utilisation de la plateforme Guichet Unique des Investissements.'
);

doc.moveDown(0.5);

// Support boxes
const boxY1 = doc.y;
doc.roundedRect(50, boxY1, 230, 120, 8).fill(secondaryColor);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('FUTURISS VISION SA', 65, boxY1 + 15);
doc.fontSize(10).fillColor(white).font('Helvetica').text('Support Technique', 65, boxY1 + 35);
doc.fontSize(9).fillColor(white)
  .text('Email : support@futurissvision.com', 65, boxY1 + 60)
  .text('Tél : +243 XXX XXX XXX', 65, boxY1 + 78)
  .text('Web : www.futurissvision.com', 65, boxY1 + 96);

doc.roundedRect(310, boxY1, 235, 120, 8).fill(primaryColor);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('ANAPI', 325, boxY1 + 15);
doc.fontSize(9).fillColor(white).font('Helvetica').text('Agence Nationale pour la Promotion', 325, boxY1 + 35);
doc.text('des Investissements', 325, boxY1 + 48);
doc.fontSize(9).fillColor(white)
  .text('Adresse : Bd du 30 Juin, Gombe', 325, boxY1 + 70)
  .text('Kinshasa, RDC', 325, boxY1 + 83)
  .text('Site : www.anapi.cd', 325, boxY1 + 96);

doc.y = boxY1 + 140;

addSubTitle('Ressources d\'Aide');
addBullet('FAQ : Questions fréquemment posées dans l\'application');
addBullet('Vidéos tutorielles : Guides pas à pas en vidéo');
addBullet('Chat en direct : Assistance en temps réel (heures ouvrables)');
addBullet('Formulaire de contact : Pour les demandes complexes');

doc.moveDown(0.3);

addSubTitle('Horaires de Support');
addBullet('Lundi - Vendredi : 8h00 - 17h00 (heure de Kinshasa)');
addBullet('Samedi : 9h00 - 13h00');
addBullet('Dimanche et jours fériés : Fermé');

doc.moveDown(0.3);

addSubTitle('Signaler un Problème');
addParagraph('Si vous rencontrez un bug ou un problème technique :');
addNumberedStep('1', 'Notez les étapes qui ont conduit au problème');
addNumberedStep('2', 'Faites une capture d\'écran si possible');
addNumberedStep('3', 'Contactez le support avec ces informations');
addNumberedStep('4', 'Un ticket sera créé et vous serez informé de l\'avancement');

doc.moveDown(0.5);

// Footer
doc.strokeColor(accentColor).lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
doc.moveDown(0.5);
doc.fontSize(9).fillColor(lightGray).font('Helvetica')
  .text('© 2026 FUTURISS VISION SA - Tous droits réservés', { align: 'center' });
doc.text('Ce manuel est la propriété de FUTURISS VISION SA.', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(10).fillColor(accentColor).font('Helvetica-Bold')
  .text('Merci d\'utiliser le Guichet Unique ANAPI !', { align: 'center' });

// Finalize
doc.end();

stream.on('finish', () => {
  console.log('✅ Manuel Utilisateur Complet généré avec succès !');
  console.log('📄 Fichier :', outputPath);
  console.log('📊 Pages :', pageNumber);
  console.log('💾 Taille :', Math.round(fs.statSync(outputPath).size / 1024), 'KB');
});
