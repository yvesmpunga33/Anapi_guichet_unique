import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create PDF document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true,
  info: {
    Title: 'Manuel Utilisateur - Guichet Unique des Investissements ANAPI',
    Author: 'FUTURISS VISION SA',
    Subject: 'Documentation technique et guide utilisateur',
    Keywords: 'ANAPI, Guichet Unique, Investissement, RDC, Congo',
    CreationDate: new Date(),
  }
});

// Output file
const outputPath = path.join(__dirname, '..', 'FUTURISS_VISION_ANAPI_Manuel_Utilisateur.pdf');
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
const warning = '#F59E0B';
const info = '#3B82F6';

// Helper functions
function addHeader(text, size = 20) {
  doc.fontSize(size).fillColor(primaryColor).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function addSubHeader(text, size = 13) {
  doc.fontSize(size).fillColor(secondaryColor).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function addParagraph(text) {
  doc.fontSize(10).fillColor(textColor).font('Helvetica').text(text, { align: 'justify', lineGap: 2 });
  doc.moveDown(0.3);
}

function addBullet(text) {
  doc.fontSize(10).fillColor(textColor).font('Helvetica').text(`• ${text}`, { indent: 15, lineGap: 1 });
}

function pageBreak() {
  doc.addPage();
}

function drawLine(color = accentColor) {
  doc.strokeColor(color).lineWidth(2).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);
}

function drawBox(x, y, width, height, color, radius = 6) {
  doc.roundedRect(x, y, width, height, radius).fill(color);
}

// ========================================
// PAGE 1 - PAGE DE GARDE
// ========================================
doc.rect(0, 0, 595, 842).fill(primaryColor);
doc.rect(0, 0, 595, 100).fill(secondaryColor);

doc.fontSize(16).fillColor(accentColor).font('Helvetica-Bold')
   .text('FUTURISS VISION', 45, 40, { continued: true }).fillColor(white).text(' SA');
doc.fontSize(10).fillColor(white).font('Helvetica').text('Solutions Technologiques Innovantes', 45, 62);

doc.fontSize(14).fillColor(accentColor).font('Helvetica')
   .text('MANUEL D\'UTILISATEUR', 45, 200, { align: 'center', width: 505 });
doc.fontSize(40).fillColor(white).font('Helvetica-Bold')
   .text('GUICHET UNIQUE', 45, 235, { align: 'center', width: 505 });
doc.fontSize(20).text('DES INVESTISSEMENTS', 45, 285, { align: 'center', width: 505 });

doc.strokeColor(accentColor).lineWidth(3).moveTo(180, 320).lineTo(415, 320).stroke();

doc.fontSize(44).fillColor(accentColor).font('Helvetica-Bold')
   .text('ANAPI', 45, 345, { align: 'center', width: 505 });
doc.fontSize(11).fillColor(white).font('Helvetica')
   .text('Agence Nationale pour la Promotion des Investissements', 45, 400, { align: 'center', width: 505 });
doc.fontSize(10).fillColor(lightGray)
   .text('RÉPUBLIQUE DÉMOCRATIQUE DU CONGO', 45, 420, { align: 'center', width: 505 });

// Features
doc.rect(0, 620, 595, 222).fill(secondaryColor);
const features = [
  { icon: '6', text: 'Langues disponibles' },
  { icon: '24/7', text: 'Accès permanent' },
  { icon: '100%', text: 'Plateforme digitale' },
  { icon: '0', text: 'Papier requis' },
];
let fx = 70;
features.forEach((f) => {
  doc.fontSize(18).fillColor(accentColor).font('Helvetica-Bold').text(f.icon, fx, 650, { width: 90, align: 'center' });
  doc.fontSize(8).fillColor(white).font('Helvetica').text(f.text, fx, 675, { width: 90, align: 'center' });
  fx += 120;
});

doc.fontSize(9).fillColor(lightGray).text('Version 1.0 - Janvier 2026', 45, 780, { align: 'center', width: 505 });

// ========================================
// PAGE 2 - SOMMAIRE
// ========================================
pageBreak();

addHeader('TABLE DES MATIÈRES', 22);
drawLine();

const toc = [
  '1. Introduction et Objectifs',
  '2. Accès à la Plateforme',
  '3. Page d\'Accueil (Landing Page)',
  '4. Connexion et Inscription',
  '5. Tableau de Bord',
  '6. Module Guichet Unique',
  '7. Module Investissements',
  '8. Module Marchés Publics',
  '9. Module Réformes Légales',
  '10. Gestion des Utilisateurs',
  '11. Référentiels',
  '12. Rapports et Statistiques',
  '13. Support et Assistance',
];

toc.forEach((item) => {
  doc.fontSize(11).fillColor(primaryColor).font('Helvetica').text(item, 60);
  doc.moveDown(0.25);
});

doc.moveDown(1);

// Introduction on same page
addHeader('1. INTRODUCTION', 18);
drawLine();

addParagraph(
  "Ce manuel vous guide dans l'utilisation de la plateforme Guichet Unique des Investissements de l'ANAPI. Cette plateforme révolutionnaire permet aux investisseurs nationaux et internationaux d'effectuer toutes leurs démarches administratives en ligne : demandes d'autorisations, licences, permis et certificats."
);

addSubHeader('Objectifs de la Plateforme');
addBullet("Centraliser toutes les démarches d'investissement en un seul point");
addBullet("Réduire les délais de traitement des dossiers");
addBullet("Assurer la transparence avec un suivi en temps réel");
addBullet("Éliminer les déplacements physiques inutiles");
addBullet("Offrir un service multilingue (6 langues)");
addBullet("Accompagner chaque investisseur par un expert dédié");

doc.moveDown(0.5);

// Stats
const statsY = doc.y + 5;
const stats = [
  { value: '2.5M km²', label: 'Superficie RDC' },
  { value: '100M+', label: 'Population' },
  { value: '$24T', label: 'Ressources naturelles' },
  { value: '#1', label: 'Cobalt mondial' },
];
let sx = 45;
stats.forEach((s) => {
  drawBox(sx, statsY, 122, 45, primaryColor, 5);
  doc.fontSize(13).fillColor(accentColor).font('Helvetica-Bold').text(s.value, sx, statsY + 8, { width: 122, align: 'center' });
  doc.fontSize(8).fillColor(white).font('Helvetica').text(s.label, sx, statsY + 28, { width: 122, align: 'center' });
  sx += 130;
});

// ========================================
// PAGE 3 - ACCÈS ET LANDING PAGE
// ========================================
pageBreak();

addHeader('2. ACCÈS À LA PLATEFORME', 18);
drawLine();

addSubHeader('URL d\'accès');
drawBox(45, doc.y + 5, 505, 35, '#E8F4FD', 5);
doc.fontSize(12).fillColor(info).font('Helvetica-Bold').text('https://anapi.futurissvision.com', 55, doc.y + 17);
doc.y += 50;

addSubHeader('Compatibilité');
addParagraph("La plateforme est accessible depuis tout navigateur web moderne (Chrome, Firefox, Safari, Edge) sur ordinateur, tablette ou smartphone.");

addSubHeader('Langues Disponibles');
const langs = ['Français (FR)', 'English (EN)', 'Português (PT)', 'Español (ES)', '中文 (ZH)', 'العربية (AR)'];
let lx = 45;
const ly = doc.y + 5;
langs.forEach((l, i) => {
  if (i === 3) { lx = 45; }
  const row = i < 3 ? 0 : 1;
  drawBox(lx, ly + row * 28, 163, 24, secondaryColor, 4);
  doc.fontSize(9).fillColor(white).font('Helvetica').text(l, lx, ly + row * 28 + 7, { width: 163, align: 'center' });
  lx += 170;
});
doc.y = ly + 65;

addHeader('3. PAGE D\'ACCUEIL (LANDING PAGE)', 18);
drawLine();

addParagraph("La page d'accueil présente les services de l'ANAPI et permet aux visiteurs de découvrir les opportunités d'investissement en RDC.");

addSubHeader('Sections de la Page d\'Accueil');

const sections = [
  { name: 'Hero Section', desc: 'Message de bienvenue et bouton pour démarrer une demande' },
  { name: 'Guichet Unique', desc: 'Présentation des 4 types de documents : Autorisations, Licences, Permis, Certificats' },
  { name: 'Secteurs d\'Investissement', desc: 'Agriculture (80M ha), Mines (#1 cobalt), Infrastructure, Industries' },
  { name: 'Carte Interactive', desc: 'Visualisation des 26 provinces et leurs potentiels économiques' },
  { name: 'Témoignages', desc: 'Citations du Président Tshisekedi et de la DG Rachel PUNGU LUAMBA' },
  { name: 'FAQ', desc: 'Réponses aux questions fréquentes sur le service' },
];

sections.forEach((sec) => {
  doc.fontSize(10).fillColor(accentColor).font('Helvetica-Bold').text(`${sec.name} : `, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(sec.desc);
  doc.moveDown(0.15);
});

// ========================================
// PAGE 4 - CONNEXION ET INSCRIPTION
// ========================================
pageBreak();

addHeader('4. CONNEXION ET INSCRIPTION', 18);
drawLine();

addSubHeader('4.1 Connexion (Utilisateurs Existants)');
addParagraph("Pour accéder à votre espace, cliquez sur \"Se connecter\" en haut à droite de la page d'accueil.");

addBullet("Entrez votre adresse email");
addBullet("Entrez votre mot de passe");
addBullet("Cliquez sur \"Se connecter\"");
addBullet("Vous êtes redirigé vers le Tableau de Bord");

doc.moveDown(0.3);

addSubHeader('4.2 Création de Compte Investisseur');
addParagraph("Les nouveaux investisseurs peuvent créer un compte gratuitement en cliquant sur \"Créer un compte\".");

// Steps
const steps = [
  { num: '1', title: 'Inscription', desc: 'Remplissez le formulaire : nom, email, téléphone, pays, mot de passe' },
  { num: '2', title: 'Vérification', desc: 'Confirmez votre email via le lien reçu dans votre boîte de réception' },
  { num: '3', title: 'Profil', desc: 'Complétez votre profil : type d\'investisseur, secteur, montant estimé' },
  { num: '4', title: 'Expert Assigné', desc: 'Un expert ANAPI vous est assigné pour vous accompagner' },
];

const stY = doc.y + 5;
steps.forEach((st, i) => {
  const x = 45 + (i % 2) * 260;
  const y = stY + Math.floor(i / 2) * 55;
  drawBox(x, y, 250, 50, '#F5F5F5', 5);
  doc.circle(x + 20, y + 25, 12).fill(accentColor);
  doc.fontSize(12).fillColor(white).font('Helvetica-Bold').text(st.num, x + 14, y + 19);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text(st.title, x + 40, y + 10);
  doc.fontSize(8).fillColor(textColor).font('Helvetica').text(st.desc, x + 40, y + 25, { width: 200 });
});
doc.y = stY + 120;

// Expert box
drawBox(45, doc.y, 505, 50, secondaryColor, 6);
doc.fontSize(11).fillColor(accentColor).font('Helvetica-Bold').text('ACCOMPAGNEMENT PERSONNALISÉ', 60, doc.y + 10);
doc.fontSize(9).fillColor(white).font('Helvetica').text("Chaque investisseur bénéficie d'un expert ANAPI dédié qui l'accompagne dans toutes ses démarches : conseils, assistance administrative, mise en relation avec les ministères.", 60, doc.y + 25, { width: 475 });
doc.y += 60;

addSubHeader('4.3 Rôles Utilisateurs');
addParagraph("La plateforme gère différents types d'utilisateurs avec des accès spécifiques :");

const roles = [
  { role: 'Investisseur', desc: 'Soumet des demandes, suit ses dossiers, communique avec son expert' },
  { role: 'Agent ANAPI', desc: 'Traite les dossiers assignés, valide les étapes, génère les documents' },
  { role: 'Manager', desc: 'Supervise les équipes, assigne les dossiers, valide les décisions' },
  { role: 'Administrateur', desc: 'Gère les utilisateurs, configure les paramètres, accède à toutes les fonctions' },
  { role: 'Partenaire', desc: 'Ministères et administrations partenaires qui interviennent dans le workflow' },
];

roles.forEach((r) => {
  doc.fontSize(10).fillColor(accentColor).font('Helvetica-Bold').text(`${r.role} : `, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(r.desc);
  doc.moveDown(0.1);
});

// ========================================
// PAGE 5 - TABLEAU DE BORD
// ========================================
pageBreak();

addHeader('5. TABLEAU DE BORD', 18);
drawLine();

addParagraph("Le Tableau de Bord est votre interface centrale. Il affiche un résumé de votre activité et donne accès rapide à toutes les fonctionnalités.");

addSubHeader('Éléments du Tableau de Bord');

addBullet("Statistiques : nombre de dossiers, statuts, montants investis");
addBullet("Graphiques : évolution mensuelle, répartition par secteur");
addBullet("Dossiers récents : liste des dernières demandes avec leur statut");
addBullet("Notifications : alertes, messages, rappels");
addBullet("Raccourcis : actions rapides (nouveau dossier, voir tous, exporter)");

doc.moveDown(0.3);

addSubHeader('Menu de Navigation (Barre Latérale)');
addParagraph("Le menu à gauche permet d'accéder aux différents modules de la plateforme :");

const menuModules = [
  { name: 'Dashboard', desc: 'Retour à l\'accueil du tableau de bord' },
  { name: 'Guichet Unique', desc: 'Gestion des demandes d\'autorisations, licences et permis' },
  { name: 'Investissements', desc: 'Suivi des projets d\'investissement déclarés' },
  { name: 'Marchés Publics', desc: 'Consultation des appels d\'offres' },
  { name: 'Réformes Légales', desc: 'Propositions de lois et textes réglementaires' },
  { name: 'Utilisateurs', desc: 'Gestion des comptes (administrateurs uniquement)' },
  { name: 'Référentiels', desc: 'Provinces, secteurs, ministères, types de documents' },
  { name: 'Rapports', desc: 'Statistiques et exports de données' },
];

menuModules.forEach((m) => {
  doc.fontSize(10).fillColor(secondaryColor).font('Helvetica-Bold').text(`${m.name} : `, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(m.desc);
  doc.moveDown(0.1);
});

// ========================================
// PAGE 6 - MODULE GUICHET UNIQUE
// ========================================
pageBreak();

addHeader('6. MODULE GUICHET UNIQUE', 18);
drawLine();

addParagraph("Le module Guichet Unique est le cœur de la plateforme. Il permet de soumettre et suivre vos demandes d'autorisations, licences, permis et certificats.");

addSubHeader('6.1 Types de Documents Disponibles');

const docTypes = [
  { type: 'Autorisation Commerciale', desc: 'Pour exercer une activité commerciale en RDC' },
  { type: 'Licence Professionnelle', desc: 'Pour les professions réglementées (import/export, etc.)' },
  { type: 'Permis de Construction', desc: 'Pour les projets immobiliers et industriels' },
  { type: 'Permis Environnemental', desc: 'Pour les activités impactant l\'environnement' },
  { type: 'Certificat d\'Agrément', desc: 'Reconnaissance officielle de votre investissement par l\'ANAPI' },
];

docTypes.forEach((d) => {
  doc.fontSize(10).fillColor(accentColor).font('Helvetica-Bold').text(`${d.type} : `, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(d.desc);
  doc.moveDown(0.1);
});

doc.moveDown(0.3);

addSubHeader('6.2 Comment Créer un Nouveau Dossier');
addBullet("Cliquez sur \"Nouveau Dossier\" dans le menu Guichet Unique");
addBullet("Sélectionnez le type de document souhaité");
addBullet("Remplissez les informations du demandeur (nom, adresse, contact)");
addBullet("Remplissez les détails du projet (secteur, localisation, montant)");
addBullet("Téléchargez les documents requis (identité, RCCM, statuts, etc.)");
addBullet("Vérifiez et soumettez votre dossier");

doc.moveDown(0.3);

addSubHeader('6.3 Suivi de Vos Dossiers');
addParagraph("Chaque dossier passe par plusieurs statuts que vous pouvez suivre en temps réel :");

const statuses = [
  { status: 'BROUILLON', desc: 'Dossier en cours de préparation, non encore soumis' },
  { status: 'SOUMIS', desc: 'Dossier envoyé, en attente de prise en charge' },
  { status: 'EN COURS', desc: 'Dossier assigné à un agent et en traitement' },
  { status: 'DOCUMENTS REQUIS', desc: 'Des pièces complémentaires sont demandées' },
  { status: 'EN RÉVISION', desc: 'Analyse approfondie par les experts' },
  { status: 'APPROUVÉ', desc: 'Votre demande a été acceptée' },
  { status: 'REJETÉ', desc: 'Votre demande n\'a pas été acceptée (motif fourni)' },
  { status: 'TERMINÉ', desc: 'Document final disponible au téléchargement' },
];

statuses.forEach((s) => {
  doc.fontSize(9).fillColor(info).font('Helvetica-Bold').text(`${s.status} : `, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(s.desc);
  doc.moveDown(0.05);
});

// ========================================
// PAGE 7 - WORKFLOW ET INVESTISSEMENTS
// ========================================
pageBreak();

addSubHeader('6.4 Workflow de Validation');
addParagraph("Votre dossier passe par un circuit de validation en plusieurs étapes. Vous recevez une notification à chaque changement :");

const workflow = [
  { step: 'Étape 1 - Réception', desc: 'L\'agent vérifie que votre dossier est complet' },
  { step: 'Étape 2 - Analyse Technique', desc: 'Les experts étudient la faisabilité de votre projet' },
  { step: 'Étape 3 - Consultation', desc: 'Avis des ministères concernés selon votre secteur' },
  { step: 'Étape 4 - Validation', desc: 'Le manager approuve ou demande des modifications' },
  { step: 'Étape 5 - Signature', desc: 'La direction générale signe le document' },
  { step: 'Étape 6 - Délivrance', desc: 'Votre document officiel est généré et disponible' },
];

workflow.forEach((w) => {
  doc.fontSize(10).fillColor(secondaryColor).font('Helvetica-Bold').text(w.step);
  doc.fontSize(9).fillColor(textColor).font('Helvetica').text(w.desc, { indent: 15 });
  doc.moveDown(0.15);
});

doc.moveDown(0.3);

addSubHeader('6.5 Timeline Interactive');
addParagraph("Dans chaque dossier, une timeline visuelle vous montre la progression : étapes validées (en vert), étape en cours (en orange), étapes à venir (en gris).");

addSubHeader('6.6 Téléchargement du Document Final');
addParagraph("Une fois votre dossier au statut \"TERMINÉ\", vous pouvez télécharger votre document officiel en format PDF depuis la page de détail du dossier.");

doc.moveDown(0.5);

addHeader('7. MODULE INVESTISSEMENTS', 18);
drawLine();

addParagraph("Ce module permet de déclarer et suivre vos projets d'investissement en RDC.");

addSubHeader('Fonctionnalités');
addBullet("Enregistrer un nouveau projet d'investissement");
addBullet("Renseigner le montant, le secteur, la localisation");
addBullet("Suivre les avantages fiscaux accordés (exonérations, réductions)");
addBullet("Déclarer les emplois créés (directs et indirects)");
addBullet("Joindre les documents relatifs au projet");
addBullet("Générer des rapports de suivi");

doc.moveDown(0.3);

addSubHeader('Avantages du Code des Investissements');
addParagraph("En fonction de votre projet, vous pouvez bénéficier de :");
addBullet("Exonération de droits de douane sur les équipements");
addBullet("Réduction d'impôt sur les bénéfices (jusqu'à 5 ans)");
addBullet("Exonération de TVA sur les intrants");
addBullet("Protection juridique de votre investissement");

// ========================================
// PAGE 8 - MARCHÉS PUBLICS ET RÉFORMES
// ========================================
pageBreak();

addHeader('8. MODULE MARCHÉS PUBLICS', 18);
drawLine();

addParagraph("Ce module vous permet de consulter les appels d'offres publics et de soumettre vos candidatures.");

addSubHeader('Fonctionnalités');
addBullet("Consulter la liste des appels d'offres en cours");
addBullet("Filtrer par secteur, montant, date limite");
addBullet("Télécharger les cahiers des charges");
addBullet("Soumettre votre offre en ligne");
addBullet("Suivre l'état de votre soumission");
addBullet("Consulter les résultats des attributions");

doc.moveDown(0.3);

addSubHeader('Types d\'Appels d\'Offres');
addBullet("Travaux : construction, réhabilitation, infrastructure");
addBullet("Fournitures : équipements, matériel, consommables");
addBullet("Services : études, conseil, formation, maintenance");

doc.moveDown(0.5);

addHeader('9. MODULE RÉFORMES LÉGALES', 18);
drawLine();

addParagraph("Ce module permet de suivre les propositions de réformes et les évolutions du cadre juridique des investissements.");

addSubHeader('Fonctionnalités');
addBullet("Consulter les propositions de lois en cours d'examen");
addBullet("Suivre le statut des réformes (brouillon, soumis, adopté)");
addBullet("Accéder aux textes complets des propositions");
addBullet("Voir l'impact prévu sur l'environnement des affaires");
addBullet("Recevoir des alertes sur les nouvelles réformes");

doc.moveDown(0.3);

addSubHeader('Types de Réformes');
addBullet("Lois : textes votés par le Parlement");
addBullet("Décrets : textes du Gouvernement");
addBullet("Arrêtés : décisions ministérielles");
addBullet("Recommandations : propositions d'amélioration");

// ========================================
// PAGE 9 - UTILISATEURS ET RÉFÉRENTIELS
// ========================================
pageBreak();

addHeader('10. GESTION DES UTILISATEURS', 18);
drawLine();

addParagraph("(Réservé aux Administrateurs) Ce module permet de créer et gérer les comptes utilisateurs de la plateforme.");

addSubHeader('Créer un Nouvel Utilisateur');
addBullet("Cliquez sur \"Nouvel Utilisateur\" dans le menu Admin > Utilisateurs");
addBullet("Remplissez : photo, prénom, nom, email, téléphone");
addBullet("Sélectionnez le rôle : Admin, Manager, Agent, Investor, Partner");
addBullet("Affectez à un ministère/département si nécessaire");
addBullet("Définissez les modules accessibles");
addBullet("Un mot de passe temporaire est envoyé par email");

doc.moveDown(0.3);

addSubHeader('Actions sur les Utilisateurs');
addBullet("Modifier : mettre à jour les informations");
addBullet("Activer/Désactiver : suspendre temporairement un compte");
addBullet("Réinitialiser : envoyer un nouveau mot de passe");
addBullet("Supprimer : supprimer définitivement un compte");

doc.moveDown(0.5);

addHeader('11. RÉFÉRENTIELS', 18);
drawLine();

addParagraph("Les référentiels sont les données de base utilisées dans toute la plateforme.");

addSubHeader('Référentiels Disponibles');

const refs = [
  { name: 'Provinces', desc: 'Les 26 provinces de la RDC avec leurs codes et caractéristiques' },
  { name: 'Villes/Communes', desc: 'Liste des villes et communes par province' },
  { name: 'Secteurs d\'Activité', desc: 'Agriculture, Mines, Énergie, Infrastructure, Industries, Services, etc.' },
  { name: 'Ministères', desc: 'Liste des ministères partenaires impliqués dans les workflows' },
  { name: 'Types de Documents', desc: 'Documents requis pour chaque type de demande' },
  { name: 'Étapes de Workflow', desc: 'Configuration des circuits de validation' },
];

refs.forEach((r) => {
  doc.fontSize(10).fillColor(secondaryColor).font('Helvetica-Bold').text(`${r.name} : `, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(r.desc);
  doc.moveDown(0.1);
});

// ========================================
// PAGE 10 - RAPPORTS ET SUPPORT
// ========================================
pageBreak();

addHeader('12. RAPPORTS ET STATISTIQUES', 18);
drawLine();

addParagraph("Le module Rapports permet de générer des statistiques et d'exporter des données.");

addSubHeader('Types de Rapports');
addBullet("Tableau de bord global : vue d'ensemble de l'activité");
addBullet("Dossiers par statut : répartition des demandes");
addBullet("Dossiers par secteur : analyse sectorielle");
addBullet("Dossiers par province : répartition géographique");
addBullet("Évolution mensuelle : tendances et comparaisons");
addBullet("Performance : délais de traitement, taux d'approbation");

doc.moveDown(0.3);

addSubHeader('Formats d\'Export');
addBullet("PDF : pour impression et archivage");
addBullet("Excel : pour analyses personnalisées");
addBullet("CSV : pour intégration dans d'autres systèmes");

doc.moveDown(0.5);

addHeader('13. SUPPORT ET ASSISTANCE', 18);
drawLine();

addParagraph("Notre équipe est disponible pour vous accompagner dans l'utilisation de la plateforme.");

// Contact boxes
const contactY = doc.y + 10;

drawBox(45, contactY, 245, 100, secondaryColor, 8);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('FUTURISS VISION SA', 60, contactY + 12);
doc.fontSize(9).fillColor(white).font('Helvetica').text('Support Technique', 60, contactY + 30);
doc.fontSize(9).fillColor(white)
   .text('Email : support@futurissvision.com', 60, contactY + 50)
   .text('Tél : +243 XXX XXX XXX', 60, contactY + 65)
   .text('Web : futurissvision.com', 60, contactY + 80);

drawBox(305, contactY, 245, 100, primaryColor, 8);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('ANAPI', 320, contactY + 12);
doc.fontSize(9).fillColor(white).font('Helvetica').text('Agence Nationale pour la Promotion des Investissements', 320, contactY + 30);
doc.fontSize(9).fillColor(white)
   .text('Adresse : Bd du 30 Juin, Gombe, Kinshasa', 320, contactY + 50)
   .text('Site : anapi.cd', 320, contactY + 65)
   .text('Plateforme : anapi.futurissvision.com', 320, contactY + 80);

doc.y = contactY + 120;

addSubHeader('Assistance en Ligne');
addBullet("FAQ intégrée dans la plateforme");
addBullet("Chat en direct avec un conseiller (heures ouvrables)");
addBullet("Formulaire de contact pour les demandes complexes");
addBullet("Vidéos tutorielles disponibles");

doc.moveDown(0.5);

// Footer
drawLine();
doc.fontSize(8).fillColor(lightGray).font('Helvetica')
   .text('© 2026 FUTURISS VISION SA - Tous droits réservés', { align: 'center' });
doc.text('Ce document est la propriété de FUTURISS VISION SA. Reproduction interdite sans autorisation.', { align: 'center' });

// Finalize
doc.end();

stream.on('finish', () => {
  console.log('PDF Manuel Utilisateur généré avec succès !');
  console.log('Fichier :', outputPath);
  console.log('Taille :', Math.round(fs.statSync(outputPath).size / 1024), 'KB');
});
