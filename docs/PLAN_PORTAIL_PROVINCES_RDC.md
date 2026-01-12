# PLAN DE DÉVELOPPEMENT - PORTAIL MULTI-PROVINCE RDC

## PROJET : Système de Gestion des 26 Provinces de la RDC

**Date de création :** 11 Janvier 2026
**Version :** 1.0
**Client :** ANAPI - Agence Nationale pour la Promotion des Investissements

---

## 1. VISION DU PROJET

Créer un portail unifié permettant aux 26 provinces de la RDC de :
- Gérer leurs opportunités d'investissement
- Promouvoir leurs réalisations et attraits
- Attirer les investisseurs nationaux et internationaux
- Centraliser les informations économiques et administratives

---

## 2. ARCHITECTURE TECHNIQUE

### Stack Technologique
| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 15 (App Router) |
| Backend | Node.js + Express |
| Base de données | PostgreSQL |
| ORM | Sequelize |
| Authentification | NextAuth.js (séparé par portail) |
| Styling | Tailwind CSS |
| Déploiement | PM2 + Nginx |

### Architecture Multi-Tenant
- **Une seule base de code** pour les 26 provinces
- **Menu dynamique** configurable par province
- **Authentification séparée** (ANAPI vs Province vs Investisseur)

---

## 3. PHASES DE DÉVELOPPEMENT

### PHASE 1 : AUTHENTIFICATION & FONDATIONS
**Durée estimée :** À définir
**Statut :** 🔄 En cours

| Tâche | Description | Statut |
|-------|-------------|--------|
| 1.1 | Modèle `ProvinceUser` - Utilisateurs province | ✅ Fait |
| 1.2 | Modèle `ProvinceSettings` - Configuration province | ✅ Fait |
| 1.3 | Modèle `ProvinceMessage` - Messages officiels | ✅ Fait |
| 1.4 | Page login province élégante | ⏳ En attente |
| 1.5 | Layout admin avec menu dynamique | ⏳ En attente |
| 1.6 | Dashboard province avec KPIs | ⏳ En attente |

**Modèles créés :**
- `ProvinceUser` - Authentification séparée avec rôles (ADMIN, MANAGER, EDITOR, VIEWER)
- `ProvinceSettings` - Logo, couleurs, menu configurable, infos Gouverneur/Président
- `ProvinceMessage` - Messages du Gouverneur, Président, Vice-Gouverneur

---

### PHASE 2 : CONTENU PUBLIC
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 2.1 | Modèle `ProvinceBanner` - Bannières dynamiques | ✅ Fait |
| 2.2 | Modèle `ProvinceNews` - Actualités temps réel | ✅ Fait |
| 2.3 | Modèle `ProvinceAchievement` - Réalisations | ✅ Fait |
| 2.4 | Modèle `ProvinceAchievementMedia` - Médias | ✅ Fait |
| 2.5 | Modèle `ProvinceEvent` - Événements | ✅ Fait |
| 2.6 | Modèle `ProvinceEventRegistration` - Inscriptions | ✅ Fait |
| 2.7 | Modèle `ProvinceGallery` - Galerie photos/vidéos | ✅ Fait |
| 2.8 | CRUD Bannières | ⏳ En attente |
| 2.9 | CRUD Actualités | ⏳ En attente |
| 2.10 | CRUD Réalisations | ⏳ En attente |
| 2.11 | CRUD Événements | ⏳ En attente |
| 2.12 | CRUD Galerie | ⏳ En attente |

**Modèles créés :**
- `ProvinceBanner` - Slider images/vidéos avec dates d'affichage
- `ProvinceNews` - Actualités avec catégories, tags, breaking news
- `ProvinceAchievement` - Projets terminés avec budget, bénéficiaires
- `ProvinceAchievementMedia` - Photos/vidéos des réalisations
- `ProvinceEvent` - Conférences, forums, ateliers avec inscription
- `ProvinceEventRegistration` - Gestion des participants
- `ProvinceGallery` - Médiathèque de la province

---

### PHASE 3 : INFRASTRUCTURE
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 3.1 | Modèle `ProvinceInfrastructure` | ✅ Fait |
| 3.2 | Modèle `ProvinceMasterPlan` - Plan directeur | ✅ Fait |
| 3.3 | CRUD Routes (existantes, en construction, planifiées) | ⏳ En attente |
| 3.4 | CRUD Ponts | ⏳ En attente |
| 3.5 | CRUD Aéroports/Ports | ⏳ En attente |
| 3.6 | CRUD Barrages/Centrales | ⏳ En attente |
| 3.7 | Affichage Plan Directeur | ⏳ En attente |
| 3.8 | Carte interactive des infrastructures | ⏳ En attente |

**Modèles créés :**
- `ProvinceInfrastructure` - Routes, ponts, ports, aéroports, barrages avec coordonnées GPS
- `ProvinceMasterPlan` - Vision stratégique, phases, KPIs, projets clés

---

### PHASE 4 : ÉDUCATION & SANTÉ
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 4.1 | Modèle `ProvinceSchool` - Écoles | ⏳ En attente |
| 4.2 | Modèle `ProvinceUniversity` - Universités | ⏳ En attente |
| 4.3 | Modèle `ProvinceHospital` - Hôpitaux | ⏳ En attente |
| 4.4 | CRUD Établissements scolaires | ⏳ En attente |
| 4.5 | CRUD Universités/Instituts | ⏳ En attente |
| 4.6 | CRUD Hôpitaux/Centres de santé | ⏳ En attente |
| 4.7 | Statistiques éducation/santé | ⏳ En attente |

---

### PHASE 5 : TOURISME & CULTURE
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 5.1 | Modèle `ProvinceMuseum` - Musées | ⏳ En attente |
| 5.2 | Modèle `ProvinceTouristSite` - Sites touristiques | ⏳ En attente |
| 5.3 | Modèle `ProvinceLeisure` - Bars, restaurants, magasins | ⏳ En attente |
| 5.4 | Historique de la province | ⏳ En attente |
| 5.5 | CRUD Sites touristiques | ⏳ En attente |
| 5.6 | CRUD Lieux de loisir | ⏳ En attente |
| 5.7 | Carte touristique | ⏳ En attente |

---

### PHASE 6 : ORGANISATION PROVINCIALE
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 6.1 | Modèle `ProvinceOrgChart` - Organigramme | ⏳ En attente |
| 6.2 | Modèle `GovernmentMember` - Membres gouvernorat | ⏳ En attente |
| 6.3 | Modèle `AssemblyMember` - Députés provinciaux | ⏳ En attente |
| 6.4 | Modèle `AssemblyCommission` - Commissions | ⏳ En attente |
| 6.5 | Page Gouvernorat avec photos | ⏳ En attente |
| 6.6 | Page Assemblée Provinciale | ⏳ En attente |
| 6.7 | Organigramme interactif | ⏳ En attente |

---

### PHASE 7 : MODULE INVESTISSEURS
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 7.1 | Modèle `ProvinceInvestor` - Investisseurs | ⏳ En attente |
| 7.2 | Modèle `InvestmentProject` - Projets d'investissement | ⏳ En attente |
| 7.3 | Modèle `InvestmentContract` - Contrats | ⏳ En attente |
| 7.4 | Modèle `InvestmentType` - Types (BOT, PPP, IDE, etc.) | ⏳ En attente |
| 7.5 | Liste des investisseurs | ⏳ En attente |
| 7.6 | Suivi des projets | ⏳ En attente |
| 7.7 | Gestion des contrats | ⏳ En attente |
| 7.8 | Dashboard investissements par secteur | ⏳ En attente |
| 7.9 | Rapports et statistiques | ⏳ En attente |

**Types d'investissement :**
- BOT (Build-Operate-Transfer)
- PPP (Partenariat Public-Privé)
- IDE (Investissement Direct Étranger)
- Joint-Venture
- BOO (Build-Own-Operate)
- BOOT (Build-Own-Operate-Transfer)

---

### PHASE 8 : MODULE EMPLOIS
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 8.1 | Modèle `ProvinceJob` - Offres d'emploi | ⏳ En attente |
| 8.2 | Modèle `JobApplication` - Candidatures | ⏳ En attente |
| 8.3 | CRUD Offres d'emploi | ⏳ En attente |
| 8.4 | Gestion des candidatures | ⏳ En attente |
| 8.5 | Portail candidat | ⏳ En attente |

---

### PHASE 9 : ACTIVITÉS ÉCONOMIQUES
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 9.1 | Modèle `ProvinceMarket` - Marchés | ⏳ En attente |
| 9.2 | Modèle `ProvinceBusinessman` - Hommes d'affaires | ⏳ En attente |
| 9.3 | Modèle `ProvincePort` - Ports | ⏳ En attente |
| 9.4 | Modèle `ProvinceEnterprise` - Entreprises | ⏳ En attente |
| 9.5 | Gestion des imports/exports | ⏳ En attente |
| 9.6 | CRUD Marchés | ⏳ En attente |
| 9.7 | CRUD Entreprises locales | ⏳ En attente |
| 9.8 | Statistiques économiques | ⏳ En attente |

---

### PHASE 10 : LANDING PAGE PUBLIQUE
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 10.1 | Page d'accueil dynamique par province | ⏳ En attente |
| 10.2 | Section Gouverneur avec message | ⏳ En attente |
| 10.3 | Section Président avec discours | ⏳ En attente |
| 10.4 | Slider bannières | ⏳ En attente |
| 10.5 | Actualités en temps réel | ⏳ En attente |
| 10.6 | Opportunités d'investissement | ⏳ En attente |
| 10.7 | Réalisations phares | ⏳ En attente |
| 10.8 | Événements à venir | ⏳ En attente |
| 10.9 | Galerie photos | ⏳ En attente |
| 10.10 | Carte interactive | ⏳ En attente |

---

### PHASE 11 : MODULE RH
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 11.1 | Modèle `ProvinceEmployee` - Personnel avec photo | ⏳ En attente |
| 11.2 | Modèle `ProvinceLeave` - Congés | ⏳ En attente |
| 11.3 | Gestion du personnel | ⏳ En attente |
| 11.4 | Gestion des congés | ⏳ En attente |
| 11.5 | Annuaire du personnel | ⏳ En attente |
| 11.6 | Organigramme RH | ⏳ En attente |

---

### PHASE 12 : CONFIGURATION (Dernier menu)
**Durée estimée :** À définir
**Statut :** ⏳ En attente

| Tâche | Description | Statut |
|-------|-------------|--------|
| 12.1 | Gestion des types d'investissement | ⏳ En attente |
| 12.2 | Gestion des types de contrat | ⏳ En attente |
| 12.3 | Configuration du menu | ⏳ En attente |
| 12.4 | Gestion des utilisateurs province | ⏳ En attente |
| 12.5 | Paramètres généraux | ⏳ En attente |
| 12.6 | Personnalisation thème/couleurs | ⏳ En attente |

---

## 4. MODÈLES DE DONNÉES CRÉÉS

### Phase 1 - Authentification
```
ProvinceUser
├── id (UUID)
├── provinceId (FK -> provinces)
├── email (unique)
├── password
├── firstName, lastName
├── phone, photo
├── role (ADMIN, MANAGER, EDITOR, VIEWER)
├── department, position
├── permissions (JSONB)
├── isActive, isVerified
└── lastLoginAt

ProvinceSettings
├── id (UUID)
├── provinceId (FK, unique)
├── logo, banner, slogan
├── description, history
├── primaryColor, secondaryColor, accentColor
├── email, phone, address, website
├── socialMedia (JSONB)
├── menuConfig (JSONB) - Menu dynamique
├── governorName, governorPhoto, governorTitle, governorBio
├── viceGovernorName, viceGovernorPhoto
├── presidentPhoto, presidentName
├── timezone, currency, language
├── isPublic, maintenanceMode
└── timestamps

ProvinceMessage
├── id (UUID)
├── provinceId (FK)
├── type (GOVERNOR, PRESIDENT, VICE_GOVERNOR, ASSEMBLY_PRESIDENT, OTHER)
├── title, content
├── authorName, authorTitle, authorPhoto
├── signature
├── displayOnHome, displayOrder
├── isActive
├── publishedAt, expiresAt
└── createdById
```

### Phase 2 - Contenu
```
ProvinceBanner, ProvinceNews, ProvinceAchievement,
ProvinceAchievementMedia, ProvinceEvent,
ProvinceEventRegistration, ProvinceGallery
```

### Phase 3 - Infrastructure
```
ProvinceInfrastructure, ProvinceMasterPlan
```

---

## 5. STRUCTURE DES MENUS

### Menu Admin Province (Configurable)
```
📊 Tableau de bord
📰 Actualités
💰 Opportunités
🏆 Réalisations
📅 Événements
🖼️ Galerie
🛤️ Infrastructure
🎓 Éducation
🏥 Santé
🏛️ Tourisme & Culture
🏢 Organisation
💼 Investisseurs
💼 Emplois
📈 Activités Économiques
👥 Ressources Humaines
⚙️ Configuration (dernier)
```

---

## 6. CRITÈRES DE DESIGN

- ✅ Pages attrayantes et exceptionnelles
- ✅ Couleurs sobres (éviter les couleurs vives)
- ✅ Formulaires attractifs
- ✅ Design professionnel et moderne
- ✅ Support mode sombre
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Photos pour tout le personnel (Gouverneur, Assemblée, Employés)

---

## 7. PROCHAINES ÉTAPES

1. **Déployer la correction** de l'erreur utilisateurs sur le serveur
2. **Terminer Phase 1** - Login et Layout province
3. **Créer les APIs** pour chaque modèle
4. **Développer les interfaces** CRUD
5. **Tester** chaque module
6. **Déployer** sur production

---

## 8. NOTES IMPORTANTES

- Chaque province a son propre **système d'authentification**
- Les **opportunités** des provinces s'affichent sur le landing ANAPI
- Le menu est **100% dynamique** et configurable par province
- Toutes les photos sont obligatoires pour le personnel officiel
- Les actualités peuvent être en **temps réel** (breaking news)

---

**Document généré automatiquement**
**Projet ANAPI - Portail Multi-Province RDC**
