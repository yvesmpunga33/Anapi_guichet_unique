import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 60, left: 50, right: 50 },
  autoFirstPage: false,
  info: {
    Title: 'Manuel Utilisateur - Guichet Unique ANAPI',
    Author: 'FUTURISS VISION SA',
  }
});

const outputPath = path.join(__dirname, '..', 'FUTURISS_Manuel_ANAPI.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const primary = '#0A1628';
const accent = '#D4A853';
const secondary = '#1E3A5F';
const text = '#333333';
const gray = '#666666';

let currentPage = 0;

function addPage() {
  doc.addPage();
  currentPage++;
  // Footer avec numéro de page
  doc.fontSize(9).fillColor(gray).text(
    `FUTURISS VISION SA - Manuel Utilisateur ANAPI | Page ${currentPage}`,
    50, 780, { align: 'center', width: 495 }
  );
  doc.y = 50;
}

function title(t) {
  doc.fontSize(18).fillColor(primary).font('Helvetica-Bold').text(t, 50, doc.y);
  doc.moveTo(50, doc.y + 3).lineTo(200, doc.y + 3).strokeColor(accent).lineWidth(2).stroke();
  doc.y += 15;
}

function subtitle(t) {
  doc.fontSize(12).fillColor(secondary).font('Helvetica-Bold').text(t, 50, doc.y);
  doc.y += 5;
}

function para(t) {
  doc.fontSize(10).fillColor(text).font('Helvetica').text(t, 50, doc.y, { width: 495, align: 'justify' });
  doc.y += 5;
}

function bullet(t) {
  doc.fontSize(10).fillColor(text).font('Helvetica').text(`• ${t}`, 60, doc.y, { width: 485 });
  doc.y += 3;
}

function step(n, t, d) {
  doc.fontSize(10).fillColor(accent).font('Helvetica-Bold').text(`${n}. ${t}`, 60, doc.y, { continued: !!d });
  if (d) doc.fillColor(text).font('Helvetica').text(` : ${d}`);
  doc.y += 3;
}

function space(n = 10) { doc.y += n; }

// =====================
// PAGE COUVERTURE
// =====================
doc.addPage();
doc.rect(0, 0, 595, 842).fill(primary);
doc.rect(0, 0, 595, 100).fill(secondary);

doc.fontSize(16).fillColor(accent).font('Helvetica-Bold').text('FUTURISS VISION SA', 50, 35);
doc.fontSize(10).fillColor('#FFFFFF').font('Helvetica').text('Solutions Technologiques Innovantes', 50, 55);

doc.fontSize(11).fillColor(accent).text('MANUEL UTILISATEUR', 0, 170, { align: 'center', width: 595 });
doc.fontSize(32).fillColor('#FFFFFF').font('Helvetica-Bold').text('GUICHET UNIQUE', 0, 195, { align: 'center', width: 595 });
doc.fontSize(18).text('DES INVESTISSEMENTS', 0, 235, { align: 'center', width: 595 });
doc.moveTo(200, 265).lineTo(395, 265).strokeColor(accent).lineWidth(3).stroke();
doc.fontSize(42).fillColor(accent).text('ANAPI', 0, 280, { align: 'center', width: 595 });
doc.fontSize(10).fillColor('#FFFFFF').font('Helvetica').text('Agence Nationale pour la Promotion des Investissements', 0, 340, { align: 'center', width: 595 });
doc.text('République Démocratique du Congo', 0, 355, { align: 'center', width: 595 });

doc.roundedRect(100, 420, 395, 80, 8).fill(secondary);
doc.fontSize(9).fillColor('#FFFFFF').text(
  'Ce manuel explique comment utiliser la plateforme Guichet Unique des Investissements. Il couvre toutes les fonctionnalités pour les investisseurs et les administrateurs.',
  120, 440, { width: 355, align: 'center' }
);

doc.rect(0, 700, 595, 142).fill(secondary);
doc.fontSize(9).fillColor(gray).text('Version 2.0 - Janvier 2026', 0, 810, { align: 'center', width: 595 });

// =====================
// PAGE 1 - TABLE DES MATIÈRES
// =====================
addPage();
title('TABLE DES MATIÈRES');
space(10);

const toc = [
  ['1', 'Introduction', 2],
  ['2', 'Connexion Investisseurs', 2],
  ['3', 'Connexion Administrateurs', 3],
  ['4', 'Tableau de Bord', 3],
  ['5', 'Module Guichet Unique', 4],
  ['6', 'Agréments', 5],
  ['7', 'Licences', 5],
  ['8', 'Permis', 6],
  ['9', 'Autorisations', 6],
  ['10', 'Direction Juridique', 7],
  ['11', 'Module Investissements', 8],
  ['12', 'Climat des Affaires', 8],
  ['13', 'Référentiels et Ministères', 9],
  ['14', 'Passation de Marchés', 9],
  ['15', 'Configuration', 10],
  ['16', 'Rapports et Statistiques', 10],
  ['17', 'Support', 11],
];

toc.forEach(([num, titre, pg]) => {
  const y = doc.y;
  doc.fontSize(10).fillColor(primary).font('Helvetica-Bold').text(num + '.', 60, y);
  doc.font('Helvetica').text(titre, 85, y);
  doc.fillColor(gray).text('.'.repeat(40), 250, y);
  doc.fillColor(primary).font('Helvetica-Bold').text(String(pg), 520, y);
  doc.y = y + 20;
});

// =====================
// PAGE 2 - INTRODUCTION + CONNEXION INVESTISSEURS
// =====================
addPage();
title('1. INTRODUCTION');
para('Le Guichet Unique des Investissements est une plateforme numérique développée par FUTURISS VISION SA pour l\'ANAPI. Elle permet aux investisseurs d\'effectuer toutes leurs démarches administratives en ligne : demandes d\'agréments, licences, permis et autorisations.');
space();
subtitle('Objectifs de la Plateforme');
bullet('Simplifier les procédures administratives');
bullet('Réduire les délais de traitement de 60%');
bullet('Assurer la transparence avec un suivi en temps réel');
bullet('Éliminer les déplacements physiques');
bullet('Offrir un accompagnement par des experts ANAPI');
bullet('Supporter 6 langues (FR, EN, PT, ES, ZH, AR)');
space(15);

title('2. CONNEXION - INVESTISSEURS');
subtitle('Créer un compte investisseur');
para('Les investisseurs créent un compte gratuitement pour accéder aux services :');
step('1', 'Accéder au site', 'https://anapi.futurissvision.com');
step('2', 'Cliquer sur "Créer un compte"');
step('3', 'Remplir le formulaire', 'nom, email, téléphone, mot de passe');
step('4', 'Vérifier l\'email', 'cliquer sur le lien de confirmation');
step('5', 'Compléter le profil', 'type d\'investisseur, secteur, montant');
step('6', 'Expert assigné', 'un expert ANAPI vous accompagne');
space();
subtitle('Se connecter');
para('Rendez-vous sur la page de connexion, entrez votre email et mot de passe, puis cliquez sur "Se connecter". Vous êtes redirigé vers votre Tableau de Bord.');

// =====================
// PAGE 3 - CONNEXION ADMIN + DASHBOARD
// =====================
addPage();
title('3. CONNEXION - ADMINISTRATEURS');
para('Les administrateurs sont les membres du personnel ANAPI et des ministères partenaires. Leurs comptes sont créés par le super-administrateur.');
space();
subtitle('Types de comptes');
bullet('Agent ANAPI : traite les dossiers assignés, communique avec les investisseurs');
bullet('Manager : supervise les équipes, assigne les dossiers, valide les décisions');
bullet('Administrateur : gère les utilisateurs, configure le système');
bullet('Partenaire (Ministères) : donne les avis techniques requis');
space();
subtitle('Processus de connexion');
para('Les administrateurs reçoivent leurs identifiants par email. À la première connexion, ils définissent leur mot de passe personnel. Ensuite, ils se connectent via la page de login standard.');
space(15);

title('4. TABLEAU DE BORD');
para('Le Tableau de Bord est votre page d\'accueil après connexion. Il affiche une vue synthétique de votre activité.');
space();
subtitle('Pour les Investisseurs');
bullet('Statistiques : nombre de dossiers, statuts');
bullet('Dossiers récents : 5 dernières demandes');
bullet('Notifications : messages de votre expert');
bullet('Mon expert : coordonnées de votre accompagnateur');
space();
subtitle('Pour les Administrateurs');
bullet('Statistiques globales : total des dossiers');
bullet('Graphiques : évolution mensuelle, répartition par secteur');
bullet('Dossiers à traiter : en attente d\'action');
bullet('Performance : délais moyens, taux de validation');

// =====================
// PAGE 4 - GUICHET UNIQUE
// =====================
addPage();
title('5. MODULE GUICHET UNIQUE');
para('Le Guichet Unique est le cœur de la plateforme. Il permet de soumettre et suivre les demandes d\'autorisations, licences, permis et agréments.');
space();
subtitle('Les 4 Types de Documents');
bullet('Agréments : certificats d\'agrément au Code des Investissements');
bullet('Licences : autorisations d\'exercer une activité réglementée');
bullet('Permis : permis de construire, environnementaux, de travail');
bullet('Autorisations : autorisations commerciales et administratives');
space();
subtitle('Workflow de Traitement');
step('1', 'Soumission', 'l\'investisseur crée et soumet son dossier');
step('2', 'Réception', 'un agent vérifie la complétude');
step('3', 'Analyse', 'étude technique par les experts');
step('4', 'Consultation', 'avis des ministères si nécessaire');
step('5', 'Validation', 'approbation par le manager');
step('6', 'Signature', 'signature par la Direction');
step('7', 'Délivrance', 'document disponible au téléchargement');
space();
subtitle('Statuts des Dossiers');
bullet('BROUILLON : en préparation, non soumis');
bullet('SOUMIS : envoyé, en attente de prise en charge');
bullet('EN COURS : en traitement par un agent');
bullet('DOCUMENTS REQUIS : pièces complémentaires demandées');
bullet('APPROUVÉ : demande acceptée');
bullet('REJETÉ : demande refusée (motif fourni)');
bullet('TERMINÉ : document final disponible');

// =====================
// PAGE 5 - AGRÉMENTS + LICENCES
// =====================
addPage();
title('6. AGRÉMENTS');
para('L\'Agrément au Code des Investissements est le document officiel qui reconnaît votre projet et vous donne accès aux avantages fiscaux.');
space();
subtitle('Avantages');
bullet('Exonération des droits de douane sur les équipements');
bullet('Exonération de TVA sur les équipements');
bullet('Réduction de l\'impôt sur les bénéfices (jusqu\'à 5 ans)');
bullet('Protection juridique de l\'investissement');
space();
subtitle('Documents Requis');
bullet('Statuts de la société (notariés)');
bullet('RCCM et Numéro d\'Identification Nationale');
bullet('Plan d\'affaires détaillé');
bullet('Preuves de financement');
bullet('Étude d\'impact environnemental (si applicable)');
space(15);

title('7. LICENCES');
para('Les licences sont des autorisations d\'exercer une activité professionnelle réglementée.');
space();
subtitle('Types de Licences');
bullet('Import/Export : licence d\'importation, d\'exportation');
bullet('Télécommunications : opérateurs, fournisseurs');
bullet('Financières : banques, microfinance');
bullet('Minières : exploitation, recherche');
bullet('Transport : marchandises, personnes');

// =====================
// PAGE 6 - PERMIS + AUTORISATIONS
// =====================
addPage();
title('8. PERMIS');
para('Les permis sont des autorisations pour des activités nécessitant un contrôle administratif.');
space();
subtitle('Types de Permis');
bullet('Permis de construire : bâtiments, usines, infrastructures');
bullet('Permis environnemental : activités impactant l\'environnement');
bullet('Permis de travail : emploi de personnel étranger');
space();
subtitle('Documents pour un Permis de Construire');
bullet('Plan architectural signé par un architecte agréé');
bullet('Titre de propriété ou bail du terrain');
bullet('Étude de sol');
bullet('Devis estimatif des travaux');
space(15);

title('9. AUTORISATIONS');
para('Les autorisations permettent d\'exercer légalement une activité commerciale ou industrielle.');
space();
subtitle('Types d\'Autorisations');
bullet('Autorisation d\'ouverture d\'établissement');
bullet('Autorisation d\'exploitation commerciale');
bullet('Autorisation de vente de produits réglementés');
bullet('Autorisation d\'installation industrielle');
space();
subtitle('Validité');
para('Les autorisations ont une durée de validité de 1 à 5 ans selon le type. La plateforme vous alerte 30 jours avant l\'expiration.');

// =====================
// PAGE 7 - DIRECTION JURIDIQUE
// =====================
addPage();
title('10. DIRECTION JURIDIQUE');
para('Le module Direction Juridique centralise les textes de loi, contrats et alertes juridiques.');
space();
subtitle('Textes Juridiques');
para('Accédez à tous les textes réglementaires :');
bullet('Lois : Code des Investissements, Code Minier, Code du Travail');
bullet('Décrets : textes d\'application');
bullet('Arrêtés : décisions ministérielles');
space();
subtitle('Contrats');
para('Gestion des conventions et accords signés :');
bullet('Conventions d\'établissement');
bullet('Contrats de partenariat public-privé');
bullet('Accords-cadres avec les investisseurs');
bullet('Suivi des échéances et obligations');
space();
subtitle('Alertes');
para('Système de notifications automatiques :');
bullet('Expiration de licences/permis (30, 15, 7 jours avant)');
bullet('Nouvelles lois ou décrets publiés');
bullet('Échéances de paiement');
bullet('Changement de statut des dossiers');

// =====================
// PAGE 8 - INVESTISSEMENTS + CLIMAT
// =====================
addPage();
title('11. MODULE INVESTISSEMENTS');
para('Ce module permet d\'enregistrer et suivre vos projets d\'investissement en RDC.');
space();
subtitle('Enregistrer un Projet');
step('1', 'Créer le projet', 'nom, description, objectifs');
step('2', 'Données financières', 'montant, sources de financement');
step('3', 'Localisation', 'province, ville, site');
step('4', 'Secteur', 'agriculture, mines, industries...');
step('5', 'Emplois', 'nombre d\'emplois créés');
space();
subtitle('Opportunités');
para('Consultez les secteurs prioritaires identifiés par l\'ANAPI :');
bullet('Agriculture : 80 millions d\'hectares de terres arables');
bullet('Mines : premier producteur mondial de cobalt');
bullet('Énergie : potentiel hydroélectrique de 100.000 MW');
bullet('Infrastructure : routes, ports, télécoms');
space(15);

title('12. CLIMAT DES AFFAIRES');
para('Indicateurs et réformes pour améliorer l\'environnement des affaires en RDC.');
space();
subtitle('Indicateurs Suivis');
bullet('Classement Doing Business');
bullet('Délais de création d\'entreprise');
bullet('Obtention de permis de construire');
bullet('Commerce transfrontalier');
space();
subtitle('Réformes');
para('Suivez les réformes en cours pour améliorer le climat des investissements.');

// =====================
// PAGE 9 - RÉFÉRENTIELS + MARCHÉS
// =====================
addPage();
title('13. RÉFÉRENTIELS ET MINISTÈRES');
subtitle('Référentiels');
para('Données de base utilisées dans la plateforme :');
bullet('Provinces : les 26 provinces de la RDC');
bullet('Secteurs d\'activité : agriculture, mines, industries...');
bullet('Types de documents : agréments, licences, permis...');
bullet('Ministères partenaires');
space();
subtitle('Ministères Partenaires');
para('L\'ANAPI collabore avec plusieurs ministères :');
bullet('Commerce Extérieur : licences import/export');
bullet('Mines : permis d\'exploitation');
bullet('Environnement : certificats environnementaux');
bullet('Travail : permis de travail');
bullet('Finances : régimes fiscaux');
space(15);

title('14. PASSATION DE MARCHÉS');
para('Consultez les appels d\'offres publics et soumettez vos candidatures.');
space();
subtitle('Types de Marchés');
bullet('Travaux : construction, réhabilitation');
bullet('Fournitures : équipements, matériels');
bullet('Services : études, conseil, formation');
space();
subtitle('Comment Soumissionner');
step('1', 'Consulter les appels d\'offres');
step('2', 'Télécharger le cahier des charges');
step('3', 'Préparer votre offre');
step('4', 'Soumettre en ligne avant la date limite');
step('5', 'Suivre l\'état de votre soumission');

// =====================
// PAGE 10 - CONFIGURATION + RAPPORTS
// =====================
addPage();
title('15. CONFIGURATION');
para('Module réservé aux administrateurs pour paramétrer la plateforme.');
space();
subtitle('Fonctionnalités');
bullet('Gestion des utilisateurs : créer, modifier, désactiver');
bullet('Attribution des rôles et permissions');
bullet('Configuration des workflows de validation');
bullet('Paramètres de sécurité');
bullet('Modèles de documents');
space(15);

title('16. RAPPORTS ET STATISTIQUES');
para('Générez des statistiques et analyses sur l\'activité de la plateforme.');
space();
subtitle('Types de Rapports');
bullet('Tableau de bord global');
bullet('Dossiers par type et statut');
bullet('Répartition par province et secteur');
bullet('Délais moyens de traitement');
bullet('Performance des agents');
space();
subtitle('Formats d\'Export');
bullet('PDF : pour impression');
bullet('Excel : pour analyses');
bullet('CSV : pour intégration');

// =====================
// PAGE 11 - SUPPORT
// =====================
addPage();
title('17. SUPPORT ET ASSISTANCE');
para('Notre équipe est disponible pour vous accompagner.');
space(20);

// Contact boxes
doc.roundedRect(50, doc.y, 220, 100, 6).fill(secondary);
doc.fontSize(11).fillColor(accent).font('Helvetica-Bold').text('FUTURISS VISION SA', 65, doc.y - 90);
doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica')
  .text('Support Technique', 65, doc.y - 70)
  .text('Email: support@futurissvision.com', 65, doc.y - 50)
  .text('Tél: +243 XXX XXX XXX', 65, doc.y - 35)
  .text('Web: www.futurissvision.com', 65, doc.y - 20);

doc.roundedRect(290, doc.y - 100, 255, 100, 6).fill(primary);
doc.fontSize(11).fillColor(accent).font('Helvetica-Bold').text('ANAPI', 305, doc.y - 90);
doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica')
  .text('Promotion des Investissements', 305, doc.y - 70)
  .text('Adresse: Bd du 30 Juin, Gombe', 305, doc.y - 50)
  .text('Kinshasa, RDC', 305, doc.y - 35)
  .text('Site: www.anapi.cd', 305, doc.y - 20);

doc.y += 20;
space(20);

subtitle('Ressources d\'Aide');
bullet('FAQ : questions fréquentes dans l\'application');
bullet('Chat en direct : assistance en temps réel');
bullet('Formulaire de contact : demandes complexes');
space();
subtitle('Horaires');
bullet('Lundi - Vendredi : 8h00 - 17h00');
bullet('Samedi : 9h00 - 13h00');
space(30);

doc.fontSize(10).fillColor(accent).font('Helvetica-Bold').text(
  'Merci d\'utiliser le Guichet Unique ANAPI !',
  0, doc.y, { align: 'center', width: 595 }
);
space();
doc.fontSize(8).fillColor(gray).font('Helvetica').text(
  '© 2026 FUTURISS VISION SA - Tous droits réservés',
  0, doc.y, { align: 'center', width: 595 }
);

// Finalize
doc.end();

stream.on('finish', () => {
  console.log('✅ Manuel généré avec succès !');
  console.log('📄 Fichier :', outputPath);
  console.log('📊 Pages :', currentPage);
  console.log('💾 Taille :', Math.round(fs.statSync(outputPath).size / 1024), 'KB');
});
