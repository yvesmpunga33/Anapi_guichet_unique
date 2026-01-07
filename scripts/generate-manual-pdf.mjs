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
  info: {
    Title: 'Manuel Utilisateur - Guichet Unique des Investissements ANAPI',
    Author: 'FUTURISS VISION SA',
    Subject: 'Documentation technique et guide utilisateur',
    Keywords: 'ANAPI, Guichet Unique, Investissement, RDC, Congo',
  }
});

// Output file
const outputPath = path.join(__dirname, '..', 'FUTURISS_VISION_ANAPI_Manuel_Utilisateur.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const primaryColor = '#0A1628';
const accentColor = '#D4A853';
const textColor = '#333333';
const lightGray = '#666666';

// Helper function to add header
function addHeader(text, size = 24) {
  doc.fontSize(size)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text(text, { align: 'left' });
  doc.moveDown(0.5);
}

// Helper function to add subheader
function addSubHeader(text, size = 16) {
  doc.fontSize(size)
     .fillColor(accentColor)
     .font('Helvetica-Bold')
     .text(text);
  doc.moveDown(0.3);
}

// Helper function to add paragraph
function addParagraph(text) {
  doc.fontSize(11)
     .fillColor(textColor)
     .font('Helvetica')
     .text(text, { align: 'justify', lineGap: 4 });
  doc.moveDown(0.5);
}

// Helper function to add bullet point
function addBullet(text, indent = 20) {
  doc.fontSize(11)
     .fillColor(textColor)
     .font('Helvetica')
     .text(`• ${text}`, { indent, lineGap: 3 });
}

// Helper function for page break
function pageBreak() {
  doc.addPage();
}

// Helper to draw a horizontal line
function drawLine() {
  doc.strokeColor(accentColor)
     .lineWidth(2)
     .moveTo(50, doc.y)
     .lineTo(545, doc.y)
     .stroke();
  doc.moveDown(0.5);
}

// ========================================
// PAGE DE GARDE
// ========================================
doc.rect(0, 0, 595, 842).fill(primaryColor);

// Logo area
doc.fillColor('#FFFFFF')
   .fontSize(14)
   .font('Helvetica')
   .text('FUTURISS VISION SA', 50, 80, { align: 'center' });

doc.fontSize(10)
   .text('Solutions Technologiques Innovantes', { align: 'center' });

// Main title area
doc.moveDown(8);
doc.fillColor(accentColor)
   .fontSize(40)
   .font('Helvetica-Bold')
   .text('MANUEL', { align: 'center' });

doc.fontSize(40)
   .text("D'UTILISATEUR", { align: 'center' });

doc.moveDown(2);

// Project title
doc.fillColor('#FFFFFF')
   .fontSize(20)
   .font('Helvetica')
   .text('Projet Guichet Unique des Investissements', { align: 'center' });

doc.moveDown(1);

doc.fillColor(accentColor)
   .fontSize(36)
   .font('Helvetica-Bold')
   .text('ANAPI', { align: 'center' });

doc.fontSize(14)
   .fillColor('#FFFFFF')
   .font('Helvetica')
   .text('Agence Nationale pour la Promotion des Investissements', { align: 'center' });

doc.moveDown(3);

// Subtitle
doc.fontSize(16)
   .fillColor('#FFFFFF')
   .font('Helvetica')
   .text('République Démocratique du Congo', { align: 'center' });

// Footer on cover
doc.fontSize(10)
   .fillColor(lightGray)
   .text('Version 1.0 - Janvier 2026', 50, 750, { align: 'center' });

doc.text('Document confidentiel', { align: 'center' });

// ========================================
// PAGE 2 - TABLE DES MATIERES
// ========================================
pageBreak();

addHeader('TABLE DES MATIÈRES', 28);
drawLine();
doc.moveDown(1);

const toc = [
  { num: '1', title: 'Introduction', page: 3 },
  { num: '1.1', title: 'Présentation de FUTURISS VISION SA', page: 3 },
  { num: '1.2', title: 'Objectifs du Projet ANAPI', page: 3 },
  { num: '2', title: 'Architecture du Système', page: 4 },
  { num: '2.1', title: 'Technologies Utilisées', page: 4 },
  { num: '2.2', title: 'Structure de la Plateforme', page: 4 },
  { num: '3', title: 'Landing Page (Page d\'Accueil)', page: 5 },
  { num: '3.1', title: 'Navigation et Menu', page: 5 },
  { num: '3.2', title: 'Sélecteur de Langues', page: 5 },
  { num: '3.3', title: 'Sections Principales', page: 6 },
  { num: '4', title: 'Authentification', page: 7 },
  { num: '4.1', title: 'Connexion Administrateur', page: 7 },
  { num: '4.2', title: 'Création de Compte Investisseur', page: 8 },
  { num: '5', title: 'Dashboard (Tableau de Bord)', page: 9 },
  { num: '5.1', title: 'Vue d\'Ensemble', page: 9 },
  { num: '5.2', title: 'Modules Disponibles', page: 10 },
  { num: '6', title: 'Guichet Unique', page: 11 },
  { num: '6.1', title: 'Gestion des Dossiers', page: 11 },
  { num: '6.2', title: 'Workflow de Validation', page: 12 },
  { num: '7', title: 'Gestion des Utilisateurs', page: 13 },
  { num: '8', title: 'Support et Contact', page: 14 },
];

toc.forEach((item) => {
  const isMain = !item.num.includes('.');
  doc.fontSize(isMain ? 13 : 11)
     .fillColor(isMain ? primaryColor : textColor)
     .font(isMain ? 'Helvetica-Bold' : 'Helvetica');

  const indent = isMain ? 0 : 20;
  const dots = '.'.repeat(60);
  doc.text(`${item.num}  ${item.title}`, 50 + indent, doc.y, { continued: true, width: 400 });
  doc.text(`${item.page}`, { align: 'right' });
  doc.moveDown(0.3);
});

// ========================================
// PAGE 3 - INTRODUCTION
// ========================================
pageBreak();

addHeader('1. INTRODUCTION', 24);
drawLine();
doc.moveDown(1);

addSubHeader('1.1 Présentation de FUTURISS VISION SA');
addParagraph(
  "FUTURISS VISION SA est une entreprise technologique congolaise spécialisée dans le développement de solutions numériques innovantes pour le secteur public et privé. Notre mission est d'accompagner la transformation digitale de la République Démocratique du Congo en fournissant des plateformes modernes, sécurisées et performantes."
);
addParagraph(
  "Forte d'une équipe d'experts en développement web, mobile et intelligence artificielle, FUTURISS VISION SA s'est positionnée comme un acteur majeur de l'écosystème technologique congolais."
);

doc.moveDown(1);

addSubHeader('1.2 Objectifs du Projet ANAPI');
addParagraph(
  "Le projet Guichet Unique des Investissements pour l'ANAPI (Agence Nationale pour la Promotion des Investissements) vise à révolutionner le processus d'investissement en RDC à travers une plateforme numérique complète permettant :"
);

doc.moveDown(0.5);
addBullet("La soumission en ligne des demandes d'autorisations, licences et permis");
addBullet("Le suivi en temps réel de l'avancement des dossiers");
addBullet("La communication directe entre investisseurs et administrations");
addBullet("La génération automatique des documents officiels");
addBullet("L'accès multilingue pour les investisseurs internationaux (6 langues)");
addBullet("La transparence totale dans le traitement des demandes");

doc.moveDown(1);
addParagraph(
  "Cette plateforme s'inscrit dans la vision du Gouvernement de la RDC de simplifier l'environnement des affaires et d'attirer davantage d'investissements étrangers directs, conformément aux objectifs du Code des Investissements."
);

// ========================================
// PAGE 4 - ARCHITECTURE
// ========================================
pageBreak();

addHeader('2. ARCHITECTURE DU SYSTÈME', 24);
drawLine();
doc.moveDown(1);

addSubHeader('2.1 Technologies Utilisées');
addParagraph("La plateforme ANAPI Guichet Unique est construite avec les technologies les plus modernes et performantes :");

doc.moveDown(0.5);

// Frontend
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Frontend (Interface Utilisateur)');
doc.moveDown(0.3);
addBullet("Next.js 15 - Framework React avec rendu côté serveur");
addBullet("React 19 - Bibliothèque d'interface utilisateur");
addBullet("Tailwind CSS - Framework CSS utilitaire");
addBullet("Lucide React - Bibliothèque d'icônes");
addBullet("React-Intl - Internationalisation (6 langues)");

doc.moveDown(0.5);

// Backend
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Backend (Serveur)');
doc.moveDown(0.3);
addBullet("Node.js - Environnement d'exécution JavaScript");
addBullet("Express.js - Framework serveur");
addBullet("Sequelize ORM - Gestion de la base de données");
addBullet("NextAuth.js - Authentification sécurisée");

doc.moveDown(0.5);

// Database
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Base de Données');
doc.moveDown(0.3);
addBullet("PostgreSQL - Base de données relationnelle");
addBullet("Redis - Cache et sessions (optionnel)");

doc.moveDown(1);

addSubHeader('2.2 Structure de la Plateforme');
addParagraph("La plateforme est organisée en plusieurs modules interconnectés :");

doc.moveDown(0.5);
addBullet("Module Landing Page - Vitrine publique multilingue");
addBullet("Module Authentification - Connexion et inscription sécurisées");
addBullet("Module Dashboard - Tableau de bord personnalisé par rôle");
addBullet("Module Guichet Unique - Gestion des dossiers et workflow");
addBullet("Module Investissements - Suivi des projets d'investissement");
addBullet("Module Administration - Gestion des utilisateurs et paramètres");
addBullet("Module Rapports - Statistiques et exports");

// ========================================
// PAGE 5 - LANDING PAGE
// ========================================
pageBreak();

addHeader('3. LANDING PAGE (PAGE D\'ACCUEIL)', 24);
drawLine();
doc.moveDown(1);

addParagraph(
  "La Landing Page est la vitrine publique de la plateforme ANAPI. Elle présente les services offerts et invite les investisseurs du monde entier à créer un compte pour bénéficier de l'accompagnement de l'ANAPI."
);

addSubHeader('3.1 Navigation et Menu');
addParagraph("Le menu de navigation principal comprend les sections suivantes :");

doc.moveDown(0.5);
addBullet("Guichet Unique - Présentation du service digital");
addBullet("Services - Liste des services offerts aux investisseurs");
addBullet("Secteurs - Secteurs stratégiques d'investissement en RDC");
addBullet("Carte - Carte interactive des 26 provinces");
addBullet("Processus - Étapes pour investir via la plateforme");
addBullet("FAQ - Questions fréquemment posées");

doc.moveDown(0.5);
addParagraph("Deux boutons d'action sont disponibles en permanence :");
addBullet("Se connecter - Pour les utilisateurs existants");
addBullet("Rendez-vous - Pour prendre rendez-vous avec un conseiller ANAPI");

doc.moveDown(1);

addSubHeader('3.2 Sélecteur de Langues');
addParagraph(
  "La plateforme est disponible en 6 langues pour accueillir les investisseurs du monde entier :"
);

doc.moveDown(0.5);
addBullet("Français (FR) - Langue par défaut");
addBullet("English (EN) - Anglais");
addBullet("Português (PT) - Portugais");
addBullet("Español (ES) - Espagnol");
addBullet("中文 (ZH) - Chinois");
addBullet("العربية (AR) - Arabe");

doc.moveDown(0.5);
addParagraph(
  "Le sélecteur de langue est accessible depuis le menu principal. Le choix de langue est sauvegardé automatiquement pour les visites futures."
);

// ========================================
// PAGE 6 - LANDING PAGE (suite)
// ========================================
pageBreak();

addSubHeader('3.3 Sections Principales de la Landing Page');
doc.moveDown(0.5);

// Hero Section
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Section Hero');
doc.moveDown(0.3);
addParagraph(
  "La section d'accueil met en avant le message principal : \"Guichet Unique des Autorisations, Licences et Permis\" avec un appel à l'action pour démarrer une demande. Des statistiques clés sont affichées : nombre de demandes traitées, délai moyen, et taux de satisfaction."
);

// Guichet Unique Section
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Section Guichet Unique');
doc.moveDown(0.3);
addParagraph(
  "Cette section présente les 4 types de documents disponibles : Autorisations, Licences, Permis et Certificats. Elle met en avant les avantages : disponibilité 24h/24, suivi en temps réel, zéro déplacement, délais garantis, support multilingue et sécurité 100%."
);

// Investment Section
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Section Opportunités d\'Investissement');
doc.moveDown(0.3);
addParagraph(
  "Une section dédiée aux investisseurs présentant les secteurs stratégiques : Agriculture (80M ha de terres fertiles), Mines & Énergie (#1 mondial cobalt), Infrastructure (routes, ponts, ports), et Industries (santé, éducation, technologie). Un expert ANAPI est assigné à chaque investisseur dès la création du compte."
);

// Testimonials Section
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Section Témoignages');
doc.moveDown(0.3);
addParagraph(
  "Citations officielles de S.E. le Président Félix-Antoine TSHISEKEDI TSHILOMBO et de la Directrice Générale de l'ANAPI, Mme Rachel PUNGU LUAMBA, soulignant l'importance de la transformation digitale pour l'attraction des investissements."
);

// Map Section
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Section Carte Interactive');
doc.moveDown(0.3);
addParagraph(
  "Une carte interactive de la RDC permettant de visualiser les 26 provinces, leurs potentiels économiques et les opportunités d'investissement par région. Les investisseurs peuvent explorer les zones économiques spéciales et les projets en cours."
);

// FAQ Section
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Section FAQ');
doc.moveDown(0.3);
addParagraph(
  "Réponses aux questions fréquentes : Qui peut bénéficier du service ? Quels sont les délais ? Quels documents peut-on obtenir ? Le service est-il payant ?"
);

// ========================================
// PAGE 7 - AUTHENTIFICATION
// ========================================
pageBreak();

addHeader('4. AUTHENTIFICATION', 24);
drawLine();
doc.moveDown(1);

addSubHeader('4.1 Connexion Administrateur');
addParagraph(
  "Les administrateurs et agents ANAPI accèdent à la plateforme via la page de connexion sécurisée. L'authentification utilise le protocole NextAuth avec hachage bcrypt des mots de passe."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Procédure de Connexion');
doc.moveDown(0.3);
addBullet("Accéder à l'URL : https://anapi.futurissvision.com/login");
addBullet("Saisir l'adresse email professionnelle");
addBullet("Saisir le mot de passe");
addBullet("Cliquer sur \"Se connecter\"");
addBullet("En cas de succès, redirection vers le Dashboard");

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Rôles Utilisateurs');
doc.moveDown(0.3);
addParagraph("La plateforme gère 5 types de rôles avec des permissions différentes :");
addBullet("Admin - Accès complet à toutes les fonctionnalités");
addBullet("Manager - Gestion des équipes et validation des dossiers");
addBullet("Agent - Traitement des dossiers assignés");
addBullet("Investor - Accès au portail investisseur");
addBullet("Partner - Partenaires et ministères concernés");

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Sécurité');
doc.moveDown(0.3);
addBullet("Sessions sécurisées avec tokens JWT");
addBullet("Protection CSRF sur tous les formulaires");
addBullet("Expiration automatique après inactivité");
addBullet("Journalisation des connexions");
addBullet("Option \"Mot de passe oublié\" pour réinitialisation");

// ========================================
// PAGE 8 - INSCRIPTION INVESTISSEUR
// ========================================
pageBreak();

addSubHeader('4.2 Création de Compte Investisseur');
addParagraph(
  "Les investisseurs peuvent créer un compte gratuitement pour accéder aux services du Guichet Unique. Un expert ANAPI leur sera assigné pour les accompagner dans leurs démarches."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Étapes d\'Inscription');
doc.moveDown(0.3);

addBullet("1. Cliquer sur \"Créer mon compte\" depuis la Landing Page");
addBullet("2. Remplir le formulaire d'inscription :");
doc.moveDown(0.2);
doc.fontSize(10).fillColor(textColor).text("   - Nom complet", { indent: 40 });
doc.text("   - Adresse email", { indent: 40 });
doc.text("   - Numéro de téléphone", { indent: 40 });
doc.text("   - Pays d'origine", { indent: 40 });
doc.text("   - Mot de passe sécurisé", { indent: 40 });
doc.moveDown(0.3);
addBullet("3. Accepter les conditions d'utilisation");
addBullet("4. Valider l'inscription");
addBullet("5. Confirmer l'email via le lien envoyé");
addBullet("6. Se connecter et compléter le profil investisseur");

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Informations du Profil Investisseur');
doc.moveDown(0.3);
addParagraph("Après inscription, l'investisseur doit compléter son profil avec :");
addBullet("Type d'investisseur (Personne physique / Personne morale)");
addBullet("Secteur d'activité envisagé");
addBullet("Montant estimé de l'investissement");
addBullet("Province(s) d'implantation souhaitée(s)");
addBullet("Documents d'identification (passeport, RCCM, etc.)");

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Accompagnement Expert');
doc.moveDown(0.3);
addParagraph(
  "Dès la validation du compte, un expert ANAPI est assigné à l'investisseur. Cet expert sera son interlocuteur privilégié pour toutes ses démarches : conseils sectoriels, assistance administrative, mise en relation avec les ministères concernés, et suivi des dossiers."
);

// ========================================
// PAGE 9 - DASHBOARD
// ========================================
pageBreak();

addHeader('5. DASHBOARD (TABLEAU DE BORD)', 24);
drawLine();
doc.moveDown(1);

addSubHeader('5.1 Vue d\'Ensemble');
addParagraph(
  "Le Dashboard est l'interface centrale de la plateforme. Il présente une vue synthétique de l'activité et permet d'accéder rapidement à toutes les fonctionnalités. L'affichage est personnalisé selon le rôle de l'utilisateur."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Éléments du Dashboard');
doc.moveDown(0.3);

addBullet("Statistiques Clés - Compteurs de dossiers, investissements, utilisateurs");
addBullet("Graphiques - Évolution mensuelle, répartition par secteur");
addBullet("Dossiers Récents - Liste des dernières demandes");
addBullet("Notifications - Alertes et messages importants");
addBullet("Accès Rapides - Raccourcis vers les actions fréquentes");

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Navigation Latérale');
doc.moveDown(0.3);
addParagraph("Le menu latéral gauche donne accès aux différents modules :");

addBullet("Dashboard - Retour à l'accueil");
addBullet("Guichet Unique - Gestion des dossiers");
addBullet("Investissements - Projets et opportunités");
addBullet("Marchés Publics - Appels d'offres (si applicable)");
addBullet("Réformes Légales - Propositions de lois");
addBullet("Utilisateurs - Gestion des comptes");
addBullet("Référentiels - Provinces, secteurs, ministères");
addBullet("Rapports - Statistiques et exports");
addBullet("Paramètres - Configuration du compte");

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Barre Supérieure');
doc.moveDown(0.3);
addBullet("Recherche globale - Recherche dans tous les modules");
addBullet("Notifications - Cloche avec badge compteur");
addBullet("Profil utilisateur - Photo et menu déroulant");
addBullet("Déconnexion - Sortie sécurisée de la session");

// ========================================
// PAGE 10 - MODULES DASHBOARD
// ========================================
pageBreak();

addSubHeader('5.2 Modules Disponibles');
doc.moveDown(0.5);

// Module Guichet Unique
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Module Guichet Unique');
doc.moveDown(0.3);
addParagraph(
  "Ce module permet la gestion complète des dossiers de demandes d'autorisations, licences et permis. Les fonctionnalités incluent :"
);
addBullet("Liste des dossiers avec filtres (statut, date, type)");
addBullet("Création de nouveau dossier");
addBullet("Visualisation détaillée d'un dossier");
addBullet("Upload de documents justificatifs");
addBullet("Timeline de progression");
addBullet("Validation par étapes (workflow)");
addBullet("Génération de PDF des documents officiels");

doc.moveDown(0.5);

// Module Investissements
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Module Investissements');
doc.moveDown(0.3);
addParagraph(
  "Gestion des projets d'investissement déclarés à l'ANAPI :"
);
addBullet("Enregistrement des projets d'investissement");
addBullet("Suivi des montants et créations d'emplois");
addBullet("Avantages fiscaux accordés");
addBullet("Documents associés aux projets");
addBullet("Rapports par secteur et par province");

doc.moveDown(0.5);

// Module Utilisateurs
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Module Administration des Utilisateurs');
doc.moveDown(0.3);
addParagraph(
  "Réservé aux administrateurs, ce module permet :"
);
addBullet("Création de nouveaux comptes utilisateurs");
addBullet("Attribution des rôles et permissions");
addBullet("Affectation aux ministères/départements");
addBullet("Activation/désactivation des comptes");
addBullet("Réinitialisation des mots de passe");
addBullet("Historique des connexions");

doc.moveDown(0.5);

// Module Référentiels
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Module Référentiels');
doc.moveDown(0.3);
addParagraph(
  "Gestion des données de référence du système :"
);
addBullet("Provinces et villes de la RDC");
addBullet("Secteurs d'activité économique");
addBullet("Ministères et administrations");
addBullet("Types de documents requis");
addBullet("Paramètres de workflow");

// ========================================
// PAGE 11 - GUICHET UNIQUE
// ========================================
pageBreak();

addHeader('6. GUICHET UNIQUE', 24);
drawLine();
doc.moveDown(1);

addSubHeader('6.1 Gestion des Dossiers');
addParagraph(
  "Le module Guichet Unique est le cœur de la plateforme. Il digitalise l'ensemble du processus d'obtention des autorisations, licences et permis nécessaires à l'investissement en RDC."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Création d\'un Nouveau Dossier');
doc.moveDown(0.3);
addBullet("1. Cliquer sur \"Nouveau Dossier\" dans le menu");
addBullet("2. Sélectionner le type de demande :");
doc.fontSize(10).text("   - Autorisation commerciale", { indent: 40 });
doc.text("   - Licence professionnelle", { indent: 40 });
doc.text("   - Permis de construction", { indent: 40 });
doc.text("   - Certificat environnemental", { indent: 40 });
doc.text("   - Agrément d'investissement", { indent: 40 });
doc.moveDown(0.3);
addBullet("3. Remplir les informations du demandeur");
addBullet("4. Remplir les détails du projet");
addBullet("5. Uploader les documents requis");
addBullet("6. Valider et soumettre le dossier");

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Statuts des Dossiers');
doc.moveDown(0.3);
addParagraph("Chaque dossier passe par différents statuts :");
addBullet("DRAFT (Brouillon) - Dossier en cours de préparation");
addBullet("SUBMITTED (Soumis) - En attente de traitement");
addBullet("IN_PROGRESS (En cours) - Dossier assigné et en traitement");
addBullet("PENDING_DOCUMENTS (Documents manquants) - En attente de pièces");
addBullet("UNDER_REVIEW (En révision) - Analyse approfondie");
addBullet("APPROVED (Approuvé) - Demande acceptée");
addBullet("REJECTED (Rejeté) - Demande refusée");
addBullet("COMPLETED (Terminé) - Document final délivré");

// ========================================
// PAGE 12 - WORKFLOW
// ========================================
pageBreak();

addSubHeader('6.2 Workflow de Validation');
addParagraph(
  "Le système de workflow automatise le circuit de validation des dossiers. Chaque type de demande suit un parcours prédéfini avec des étapes et des validateurs spécifiques."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Étapes Typiques d\'un Dossier');
doc.moveDown(0.3);

addBullet("Étape 1 : Réception et vérification initiale");
doc.fontSize(10).text("   Vérification de la complétude du dossier par l'agent ANAPI", { indent: 40 });
doc.moveDown(0.2);

addBullet("Étape 2 : Analyse technique");
doc.fontSize(10).text("   Étude du projet par les experts sectoriels", { indent: 40 });
doc.moveDown(0.2);

addBullet("Étape 3 : Consultation ministérielle");
doc.fontSize(10).text("   Avis des ministères concernés selon le secteur", { indent: 40 });
doc.moveDown(0.2);

addBullet("Étape 4 : Validation managériale");
doc.fontSize(10).text("   Approbation par le responsable du département", { indent: 40 });
doc.moveDown(0.2);

addBullet("Étape 5 : Décision finale");
doc.fontSize(10).text("   Signature et délivrance du document officiel", { indent: 40 });

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Timeline Interactive');
doc.moveDown(0.3);
addParagraph(
  "Chaque dossier dispose d'une timeline visuelle montrant la progression à travers les étapes. L'investisseur peut suivre en temps réel l'avancement de sa demande, voir les étapes validées, l'étape en cours, et les étapes restantes."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Notifications Automatiques');
doc.moveDown(0.3);
addParagraph(
  "Le système envoie des notifications automatiques à chaque changement de statut :"
);
addBullet("Email de confirmation de réception");
addBullet("SMS lors du passage à l'étape suivante (optionnel)");
addBullet("Notification in-app dans le dashboard");
addBullet("Alerte en cas de documents manquants");
addBullet("Notification finale avec le document joint");

// ========================================
// PAGE 13 - GESTION UTILISATEURS
// ========================================
pageBreak();

addHeader('7. GESTION DES UTILISATEURS', 24);
drawLine();
doc.moveDown(1);

addParagraph(
  "Le module de gestion des utilisateurs permet aux administrateurs de créer et gérer les comptes des agents ANAPI, des partenaires ministériels et de visualiser les comptes investisseurs."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Création d\'un Nouvel Utilisateur');
doc.moveDown(0.3);
addBullet("Accéder à Admin > Utilisateurs");
addBullet("Cliquer sur \"Nouvel Utilisateur\"");
addBullet("Remplir le formulaire :");
doc.fontSize(10).text("   - Photo de profil (optionnel)", { indent: 40 });
doc.text("   - Prénom et Nom", { indent: 40 });
doc.text("   - Email professionnel", { indent: 40 });
doc.text("   - Téléphone", { indent: 40 });
doc.text("   - Rôle (Admin, Manager, Agent, etc.)", { indent: 40 });
doc.text("   - Ministère/Département d'affectation", { indent: 40 });
doc.text("   - Modules accessibles", { indent: 40 });
doc.moveDown(0.3);
addBullet("Un mot de passe temporaire est généré automatiquement");
addBullet("L'utilisateur reçoit un email avec ses identifiants");
addBullet("Première connexion : changement de mot de passe obligatoire");

doc.moveDown(1);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Gestion des Permissions');
doc.moveDown(0.3);
addParagraph(
  "Chaque rôle dispose de permissions spécifiques définissant les modules et actions accessibles. L'administrateur peut personnaliser les modules accessibles pour chaque utilisateur."
);

doc.moveDown(0.5);
doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold').text('Actions Disponibles');
doc.moveDown(0.3);
addBullet("Modifier - Mettre à jour les informations d'un utilisateur");
addBullet("Activer/Désactiver - Suspendre temporairement un compte");
addBullet("Réinitialiser - Envoyer un nouveau mot de passe");
addBullet("Supprimer - Supprimer définitivement un compte");
addBullet("Historique - Voir les actions de l'utilisateur");

// ========================================
// PAGE 14 - SUPPORT ET CONTACT
// ========================================
pageBreak();

addHeader('8. SUPPORT ET CONTACT', 24);
drawLine();
doc.moveDown(1);

addSubHeader('FUTURISS VISION SA');
doc.moveDown(0.5);

addParagraph("Pour toute assistance technique concernant la plateforme :");
doc.moveDown(0.5);

doc.fontSize(11).fillColor(textColor).font('Helvetica-Bold').text('Adresse :');
doc.font('Helvetica').text('Avenue du Commerce, Immeuble Futuriss');
doc.text('Commune de la Gombe, Kinshasa');
doc.text('République Démocratique du Congo');
doc.moveDown(0.5);

doc.font('Helvetica-Bold').text('Email :');
doc.font('Helvetica').text('support@futurissvision.com');
doc.moveDown(0.5);

doc.font('Helvetica-Bold').text('Téléphone :');
doc.font('Helvetica').text('+243 XXX XXX XXX');
doc.moveDown(0.5);

doc.font('Helvetica-Bold').text('Site Web :');
doc.font('Helvetica').text('https://futurissvision.com');
doc.moveDown(1);

addSubHeader('ANAPI - Agence Nationale pour la Promotion des Investissements');
doc.moveDown(0.5);

doc.fontSize(11).fillColor(textColor).font('Helvetica-Bold').text('Adresse :');
doc.font('Helvetica').text('5ème étage, Immeuble Concorde');
doc.text('Boulevard du 30 Juin');
doc.text('Commune de la Gombe, Kinshasa');
doc.moveDown(0.5);

doc.font('Helvetica-Bold').text('Site Web :');
doc.font('Helvetica').text('https://anapi.cd');
doc.moveDown(0.5);

doc.font('Helvetica-Bold').text('Plateforme Guichet Unique :');
doc.font('Helvetica').text('https://anapi.futurissvision.com');
doc.moveDown(2);

// Footer
drawLine();
doc.moveDown(1);
doc.fontSize(10).fillColor(lightGray).font('Helvetica').text(
  "Ce document est la propriété de FUTURISS VISION SA. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.",
  { align: 'center' }
);

doc.moveDown(1);
doc.fontSize(9).text('© 2026 FUTURISS VISION SA - Tous droits réservés', { align: 'center' });

// Finalize PDF
doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully!');
  console.log('Output file:', outputPath);
});

stream.on('error', (err) => {
  console.error('Error generating PDF:', err);
});
