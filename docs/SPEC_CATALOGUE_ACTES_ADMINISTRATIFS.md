# Spécification : Catalogue des Actes Administratifs
## Guichet Unique ANAPI - Module Central

**Date:** 29 Décembre 2025
**Version:** 1.0
**Statut:** En attente de validation

---

## 1. Vue d'ensemble

Le Catalogue des Actes Administratifs est le coeur du Guichet Unique. Il centralise toutes les informations sur les licences, permis, autorisations et agréments que l'ANAPI traite pour les investisseurs.

### Objectifs
- Informer les usagers sur les procédures, délais et coûts
- Standardiser les pièces requises par type d'acte
- Suivre les délais légaux (SLA)
- Faciliter la création de dossiers avec checklist automatique

---

## 2. Modèles de données

### 2.1 ActeAdministratif (Table principale)

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID | Identifiant unique | Oui |
| code | STRING(20) | Code unique (ex: LIC-COM-001) | Oui |
| name | STRING(200) | Nom de l'acte | Oui |
| shortName | STRING(50) | Nom abrégé | Non |
| description | TEXT | Description détaillée | Oui |
| category | ENUM | Catégorie (voir ci-dessous) | Oui |
| sectorId | UUID | Secteur d'activité concerné | Non |
| ministryId | UUID | Ministère responsable | Oui |
| legalBasis | TEXT | Base légale (loi, décret, arrêté) | Non |
| legalDelayDays | INTEGER | Délai légal en jours ouvrables | Oui |
| warningDelayDays | INTEGER | Délai d'alerte (avant expiration) | Oui |
| cost | DECIMAL(15,2) | Coût officiel en USD | Oui |
| costCDF | DECIMAL(15,2) | Coût en CDF (optionnel) | Non |
| currency | ENUM | Devise principale (USD/CDF) | Oui |
| validityMonths | INTEGER | Durée de validité en mois | Non |
| isRenewable | BOOLEAN | Renouvelable ou non | Oui |
| renewalDelayDays | INTEGER | Délai pour renouvellement | Non |
| workflowType | STRING | Type de workflow associé | Oui |
| isActive | BOOLEAN | Actif/Inactif | Oui |
| createdAt | DATETIME | Date de création | Auto |
| updatedAt | DATETIME | Date de modification | Auto |

#### Valeurs ENUM pour `category`
- `LICENCE` - Licence
- `PERMIS` - Permis
- `AUTORISATION` - Autorisation
- `AGREMENT` - Agrément
- `CERTIFICAT` - Certificat
- `ATTESTATION` - Attestation

---

### 2.2 PieceRequise (Documents requis par acte)

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID | Identifiant unique | Oui |
| acteId | UUID | Référence vers ActeAdministratif | Oui |
| name | STRING(200) | Nom du document | Oui |
| description | TEXT | Description/précisions | Non |
| category | ENUM | Catégorie du document | Oui |
| isRequired | BOOLEAN | Obligatoire ou optionnel | Oui |
| acceptedFormats | STRING | Formats acceptés (PDF, JPG, etc.) | Non |
| maxSizeMB | INTEGER | Taille max en MB | Non |
| templateUrl | STRING | URL du modèle à télécharger | Non |
| orderIndex | INTEGER | Ordre d'affichage | Oui |
| validityMonths | INTEGER | Durée de validité du document | Non |
| isActive | BOOLEAN | Actif/Inactif | Oui |

#### Valeurs ENUM pour `category` (PieceRequise)
- `IDENTITE` - Pièces d'identité
- `JURIDIQUE` - Documents juridiques
- `FISCAL` - Documents fiscaux
- `TECHNIQUE` - Documents techniques
- `FINANCIER` - Documents financiers
- `AUTRE` - Autres documents

---

### 2.3 ActeAdministration (Administrations impliquées par acte)

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID | Identifiant unique | Oui |
| acteId | UUID | Référence vers ActeAdministratif | Oui |
| ministryId | UUID | Ministère/Administration | Oui |
| role | ENUM | Rôle dans le processus | Oui |
| stepNumber | INTEGER | Numéro d'étape | Oui |
| delayDays | INTEGER | Délai alloué à cette admin | Non |
| isRequired | BOOLEAN | Validation obligatoire | Oui |

#### Valeurs ENUM pour `role`
- `INITIATEUR` - Reçoit la demande
- `VERIFICATEUR` - Vérifie les documents
- `EXAMINATEUR` - Examine le fond
- `APPROBATEUR` - Approuve/Rejette
- `SIGNATAIRE` - Signe le document final
- `NOTIFICATEUR` - Notifie le demandeur

---

## 3. Relations entre modèles

```
ActeAdministratif
    │
    ├── hasMany → PieceRequise (pièces à fournir)
    │
    ├── hasMany → ActeAdministration (administrations impliquées)
    │
    ├── belongsTo → Sector (secteur d'activité)
    │
    ├── belongsTo → Ministry (ministère principal)
    │
    └── hasMany → WorkflowStep (via workflowType)
```

---

## 4. Interfaces utilisateur

### 4.1 Liste des Actes (CRUD)

**URL:** `/configuration/actes-administratifs`

**Fonctionnalités:**
- Tableau avec colonnes: Code, Nom, Catégorie, Ministère, Délai, Coût, Statut
- Filtres: Catégorie, Ministère, Secteur, Statut
- Recherche par nom/code
- Actions: Voir, Modifier, Dupliquer, Activer/Désactiver, Supprimer
- Export: Excel, PDF
- Import: Excel (template fourni)

**KPIs en haut de page:**
- Total des actes actifs
- Par catégorie (Licences, Permis, Autorisations, Agréments)
- Délai moyen de traitement
- Coût moyen

---

### 4.2 Formulaire Création/Édition d'un Acte

**Sections du formulaire:**

#### Section 1: Informations générales
- Code (auto-généré ou manuel)
- Nom complet
- Nom abrégé
- Catégorie (select)
- Description (textarea)

#### Section 2: Cadre réglementaire
- Base légale (textarea)
- Ministère responsable (select)
- Secteur d'activité (select, optionnel)

#### Section 3: Délais et coûts
- Délai légal (jours)
- Délai d'alerte (jours)
- Coût (montant + devise)
- Durée de validité (mois)
- Renouvelable (checkbox)
- Délai de renouvellement (jours)

#### Section 4: Workflow
- Type de workflow (select parmi les types configurés)
- Administrations impliquées (multi-select avec ordre et rôle)

#### Section 5: Pièces requises
- Liste des pièces avec drag & drop pour réordonner
- Bouton "Ajouter une pièce"
- Pour chaque pièce: Nom, Description, Catégorie, Obligatoire, Formats, Taille max, Modèle

---

### 4.3 Page de détail d'un Acte

**Affichage:**
- En-tête avec badge catégorie et statut
- Onglets:
  1. **Informations** - Détails généraux
  2. **Pièces requises** - Liste avec téléchargement des modèles
  3. **Workflow** - Visualisation du circuit
  4. **Statistiques** - Nombre de demandes, délai moyen, taux d'approbation
  5. **Historique** - Modifications apportées

---

### 4.4 Dashboard Catalogue

**URL:** `/configuration/actes-administratifs/dashboard`

**Widgets:**
1. **Répartition par catégorie** - Graphique en donut
2. **Actes par ministère** - Bar chart horizontal
3. **Délais moyens par catégorie** - Bar chart
4. **Coûts par catégorie** - Range/Min-Max
5. **Actes les plus demandés** - Top 10 avec nombre de dossiers
6. **Taux de conformité des délais** - Gauge chart

---

## 5. API Endpoints

### 5.1 Actes Administratifs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/config/actes` | Liste avec filtres et pagination |
| GET | `/api/config/actes/:id` | Détail d'un acte |
| POST | `/api/config/actes` | Créer un acte |
| PUT | `/api/config/actes/:id` | Modifier un acte |
| DELETE | `/api/config/actes/:id` | Supprimer un acte |
| PATCH | `/api/config/actes/:id/toggle` | Activer/Désactiver |
| POST | `/api/config/actes/:id/duplicate` | Dupliquer un acte |
| GET | `/api/config/actes/export` | Export Excel/PDF |
| POST | `/api/config/actes/import` | Import Excel |

### 5.2 Pièces Requises

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/config/actes/:acteId/pieces` | Liste des pièces d'un acte |
| POST | `/api/config/actes/:acteId/pieces` | Ajouter une pièce |
| PUT | `/api/config/actes/:acteId/pieces/:id` | Modifier une pièce |
| DELETE | `/api/config/actes/:acteId/pieces/:id` | Supprimer une pièce |
| POST | `/api/config/actes/:acteId/pieces/reorder` | Réordonner les pièces |
| POST | `/api/config/actes/:acteId/pieces/:id/template` | Upload modèle |

### 5.3 Dashboard

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/config/actes/stats` | Statistiques globales |
| GET | `/api/config/actes/stats/by-category` | Stats par catégorie |
| GET | `/api/config/actes/stats/by-ministry` | Stats par ministère |
| GET | `/api/config/actes/stats/top-requested` | Top actes demandés |

---

## 6. Workflow d'utilisation

### 6.1 Création d'un dossier avec checklist automatique

```
1. Usager sélectionne le type d'acte demandé
2. Système affiche:
   - Description de l'acte
   - Coût et délai
   - Liste des pièces requises avec modèles
3. Usager uploade les documents
4. Système vérifie la complétude (checklist)
5. Si complet → Dossier créé avec workflow approprié
6. Si incomplet → Alerte des pièces manquantes
```

### 6.2 Suivi des délais (SLA)

```
- Chaque dossier a un délai légal basé sur l'acte
- Alertes automatiques:
  - Jaune: Délai d'alerte atteint (ex: 2 jours avant échéance)
  - Rouge: Délai dépassé
- Dashboard affiche les dossiers en retard
- Rapports sur le respect des délais
```

---

## 7. Données de test (Seed)

### Exemples d'actes à créer:

1. **Agrément au Code des Investissements**
   - Catégorie: AGREMENT
   - Délai: 30 jours
   - Coût: 500 USD
   - Pièces: Statuts, RCCM, NIF, Business plan, etc.

2. **Licence d'importation**
   - Catégorie: LICENCE
   - Délai: 15 jours
   - Coût: 200 USD

3. **Permis de construire**
   - Catégorie: PERMIS
   - Délai: 45 jours
   - Coût: Variable

4. **Autorisation d'exploitation minière**
   - Catégorie: AUTORISATION
   - Délai: 60 jours
   - Coût: 1000 USD

---

## 8. Prochaines étapes

- [ ] Validation de cette spécification
- [ ] Création des modèles Sequelize
- [ ] Création des API endpoints
- [ ] Création de l'interface CRUD
- [ ] Création du Dashboard
- [ ] Script de seed avec données de test
- [ ] Intégration avec le formulaire de création de dossier
- [ ] Tests et validation

---

## 9. Questions en suspens

1. Faut-il gérer les tarifs variables selon le type d'entreprise (PME, Grande entreprise)?
2. Intégration avec un système de paiement existant?
3. Gestion multi-langue (FR/EN)?
4. Notifications par email/SMS?

---

**Document préparé pour validation avant implémentation.**
