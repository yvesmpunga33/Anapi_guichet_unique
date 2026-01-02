# Module Direction Juridique - Spécifications Fonctionnelles

## 1. Vue d'ensemble

Le module Direction Juridique permet la gestion électronique des documents juridiques, contrats, et la veille réglementaire pour l'ANAPI.

### 1.1 Objectifs
- Centraliser tous les textes juridiques et réglementaires
- Gérer les contrats avec alertes d'échéances
- Assurer la veille juridique efficace
- Archiver et retrouver facilement les documents

---

## 2. Architecture Documents (GED)

### 2.1 Structure de stockage

```
uploads/
├── legal/
│   ├── texts/              # Textes de loi (PDF)
│   │   ├── 2024/
│   │   ├── 2025/
│   │   └── 2026/
│   ├── contracts/          # Contrats signés
│   │   ├── active/
│   │   ├── expired/
│   │   └── archived/
│   ├── contentieux/        # Dossiers contentieux
│   │   └── [dossier-id]/
│   └── autres/             # Autres documents
│
├── dossiers/               # Documents investisseurs (existant)
└── ...
```

### 2.2 Politique de nommage des fichiers
```
[TYPE]-[ANNEE]-[NUMERO]-[VERSION].[ext]
Exemple: LOI-2024-00123-v1.pdf
         CONTRAT-2025-00045-v2.pdf
```

---

## 3. Modèles de Données

### 3.1 Types de Documents Juridiques (Configurable)

```javascript
// Table: legal_document_types
LegalDocumentType {
  id: UUID (PK)
  code: STRING(20) UNIQUE      // 'LOI', 'DECRET', 'ARRETE', etc.
  name: STRING(100)            // 'Loi', 'Décret', 'Arrêté ministériel'
  description: TEXT
  category: ENUM [
    'LEGISLATION',             // Lois, ordonnances
    'REGLEMENTATION',          // Décrets, arrêtés
    'CONTRAT',                 // Contrats, conventions
    'JURISPRUDENCE',           // Décisions de justice
    'DOCTRINE',                // Avis, circulaires
    'INTERNE'                  // Documents internes ANAPI
  ]
  requiredFields: JSON         // Champs requis selon le type
  allowedExtensions: JSON      // ['.pdf', '.docx']
  maxFileSize: INTEGER         // En MB
  retentionPeriod: INTEGER     // Durée conservation en années
  requiresApproval: BOOLEAN    // Workflow validation
  isActive: BOOLEAN
  createdAt, updatedAt
}
```

**Exemple requiredFields:**
```json
{
  "LOI": ["publicationDate", "effectiveDate", "journalOfficiel"],
  "CONTRAT": ["parties", "startDate", "endDate", "value"]
}
```

### 3.2 Domaines Juridiques (Hiérarchique)

```javascript
// Table: legal_domains
LegalDomain {
  id: UUID (PK)
  code: STRING(20) UNIQUE      // 'INV', 'FISC', 'DOUA'
  name: STRING(100)            // 'Investissement', 'Fiscalité'
  description: TEXT
  parentId: UUID (FK -> self)  // Pour hiérarchie
  color: STRING(7)             // '#3B82F6' pour UI
  icon: STRING(50)             // 'scale' pour lucide-react
  sortOrder: INTEGER
  isActive: BOOLEAN
  createdAt, updatedAt
}
```

**Hiérarchie exemple:**
```
├── Investissement (INV)
│   ├── Code des investissements (INV-CODE)
│   ├── Régime préférentiel (INV-PREF)
│   └── Zones économiques (INV-ZES)
├── Fiscalité (FISC)
│   ├── Impôts directs (FISC-DIR)
│   └── TVA et taxes (FISC-TVA)
├── Douanes (DOUA)
├── Travail (TRAV)
└── Foncier (FONC)
```

### 3.3 Document Juridique

```javascript
// Table: legal_documents
LegalDocument {
  id: UUID (PK)
  documentNumber: STRING(50) UNIQUE  // 'LOI-2024-00123'
  title: STRING(255) NOT NULL

  // Classification
  typeId: UUID (FK -> legal_document_types) NOT NULL
  domainId: UUID (FK -> legal_domains)

  // Références légales
  officialReference: STRING(100)     // 'Loi n°24-001 du 15/01/2024'
  journalOfficiel: STRING(50)        // 'JO n°2024-05'

  // Dates importantes
  publicationDate: DATE
  effectiveDate: DATE                // Date entrée en vigueur
  expirationDate: DATE               // Date d'abrogation/expiration

  // Contenu
  summary: TEXT                      // Résumé
  content: TEXT                      // Texte complet (si extrait)
  keywords: JSON                     // ['investissement', 'avantages']
  tags: JSON                         // Tags libres

  // Fichier
  filePath: STRING(500)
  fileName: STRING(255)
  fileSize: INTEGER                  // En bytes
  mimeType: STRING(100)
  checksum: STRING(64)               // SHA-256 pour intégrité

  // Versioning
  version: INTEGER DEFAULT 1
  previousVersionId: UUID (FK -> self)
  isCurrentVersion: BOOLEAN DEFAULT true

  // Statut
  status: ENUM [
    'DRAFT',                         // Brouillon
    'PENDING_APPROVAL',              // En attente validation
    'ACTIVE',                        // En vigueur
    'MODIFIED',                      // Modifié par autre texte
    'ABROGATED',                     // Abrogé
    'ARCHIVED'                       // Archivé
  ]

  // Relations
  modifiedById: UUID (FK)            // Document qui modifie celui-ci
  abrogatedById: UUID (FK)           // Document qui abroge celui-ci
  relatedDocuments: JSON             // IDs documents liés

  // Audit
  createdById: TEXT (FK -> users)
  updatedById: TEXT
  approvedById: TEXT
  approvedAt: TIMESTAMP

  createdAt, updatedAt
}
```

### 3.4 Types de Contrats (Configurable)

```javascript
// Table: contract_types
ContractType {
  id: UUID (PK)
  code: STRING(20) UNIQUE      // 'PREST', 'PART', 'BAIL'
  name: STRING(100)            // 'Prestation de services'
  description: TEXT
  defaultDuration: INTEGER     // Durée par défaut en mois
  alertDays: JSON              // [30, 60, 90] avant expiration
  requiredFields: JSON
  template: TEXT               // Modèle de contrat
  isActive: BOOLEAN
  createdAt, updatedAt
}
```

### 3.5 Contrat

```javascript
// Table: contracts
Contract {
  id: UUID (PK)
  contractNumber: STRING(50) UNIQUE  // 'CONTRAT-2025-00045'
  title: STRING(255) NOT NULL

  // Classification
  typeId: UUID (FK -> contract_types) NOT NULL
  domainId: UUID (FK -> legal_domains)

  // Parties
  parties: JSON [
    {
      name: "ANAPI",
      role: "Client",
      representative: "Jean Mukendi",
      contact: "contact@anapi.cd"
    },
    {
      name: "Société XYZ",
      role: "Prestataire",
      representative: "Pierre Kabongo",
      contact: "info@xyz.cd"
    }
  ]

  // Objet et description
  object: TEXT                       // Objet du contrat
  description: TEXT

  // Dates
  signatureDate: DATE
  startDate: DATE NOT NULL
  endDate: DATE
  renewalDate: DATE                  // Date de renouvellement tacite

  // Valeur
  value: DECIMAL(18,2)
  currency: STRING(3) DEFAULT 'USD'
  paymentTerms: TEXT

  // Clauses importantes
  obligations: JSON [
    {
      party: "Prestataire",
      description: "Livrer le rapport mensuel",
      dueDate: "Chaque 5 du mois"
    }
  ]

  // Fichiers
  filePath: STRING(500)
  fileName: STRING(255)
  fileSize: INTEGER
  annexes: JSON                      // [{name, path, size}]

  // Statut
  status: ENUM [
    'DRAFT',                         // En préparation
    'PENDING_SIGNATURE',             // En attente signature
    'ACTIVE',                        // En cours
    'SUSPENDED',                     // Suspendu
    'EXPIRED',                       // Expiré
    'TERMINATED',                    // Résilié
    'RENEWED',                       // Renouvelé
    'ARCHIVED'                       // Archivé
  ]

  // Alertes
  alertDays: JSON                    // [30, 60, 90]
  lastAlertSent: DATE

  // Renouvellement
  isRenewable: BOOLEAN DEFAULT true
  renewalTerms: TEXT
  previousContractId: UUID (FK -> self)

  // Audit
  createdById: TEXT
  updatedById: TEXT

  createdAt, updatedAt
}
```

### 3.6 Alertes Juridiques

```javascript
// Table: legal_alerts
LegalAlert {
  id: UUID (PK)
  alertNumber: STRING(50) UNIQUE     // 'ALERT-2025-00001'

  type: ENUM [
    'CONTRACT_EXPIRATION',           // Expiration contrat
    'CONTRACT_RENEWAL',              // Renouvellement
    'DOCUMENT_REVIEW',               // Révision document
    'LAW_MODIFICATION',              // Modification législative
    'DEADLINE',                      // Échéance
    'CUSTOM'                         // Personnalisée
  ]

  priority: ENUM ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  title: STRING(255) NOT NULL
  description: TEXT

  // Dates
  triggerDate: DATE                  // Date de déclenchement
  dueDate: DATE                      // Date limite

  // Relations
  contractId: UUID (FK -> contracts)
  documentId: UUID (FK -> legal_documents)

  // Affectation
  assignedToId: TEXT (FK -> users)
  notifiedUsers: JSON                // IDs utilisateurs notifiés

  // Statut
  status: ENUM [
    'PENDING',                       // En attente
    'NOTIFIED',                      // Notification envoyée
    'ACKNOWLEDGED',                  // Prise en compte
    'IN_PROGRESS',                   // En cours de traitement
    'RESOLVED',                      // Résolue
    'DISMISSED'                      // Ignorée
  ]

  // Actions
  actions: JSON [
    {
      date: "2025-01-15",
      userId: "xxx",
      action: "Notification envoyée",
      note: "Email envoyé à 3 destinataires"
    }
  ]

  resolvedAt: TIMESTAMP
  resolvedById: TEXT
  resolutionNote: TEXT

  createdAt, updatedAt
}
```

---

## 4. Structure Menu Application

```
ANAPI
├── PRINCIPAL
│   ├── Tableau de bord
│   └── Messages
│
├── GUICHET UNIQUE
│   ├── Tous les dossiers
│   ├── Agréments
│   ├── Licences
│   ├── Permis
│   └── Autorisations
│
├── DIRECTION JURIDIQUE          ← NOUVEAU MODULE
│   ├── Tableau de bord juridique
│   │   └── (stats, alertes, activité récente)
│   │
│   ├── Veille juridique
│   │   ├── Tous les textes
│   │   ├── Nouveau texte
│   │   ├── Par domaine
│   │   └── Recherche avancée
│   │
│   ├── Contrats
│   │   ├── Tous les contrats
│   │   ├── Nouveau contrat
│   │   ├── Échéances
│   │   └── Contrats expirés
│   │
│   ├── Alertes
│   │   ├── Toutes les alertes
│   │   ├── Mes alertes
│   │   └── Créer une alerte
│   │
│   └── Contentieux
│       ├── Dossiers en cours
│       └── Nouveau dossier
│
├── INVESTISSEMENTS
│   └── ...
│
├── RÉFÉRENTIELS
│   ├── Provinces / Villes / Communes
│   ├── Secteurs d'activité
│   ├── Ministères
│   ├── Types de documents juridiques  ← NOUVEAU
│   ├── Domaines juridiques            ← NOUVEAU
│   └── Types de contrats              ← NOUVEAU
│
└── RESSOURCES HUMAINES
    └── ...
```

---

## 5. Fonctionnalités Détaillées

### 5.1 Upload de Documents

**Processus d'upload:**
1. Sélection du type de document
2. Formulaire dynamique selon le type (requiredFields)
3. Upload du fichier PDF
4. Validation (taille, format)
5. Génération du numéro unique
6. Extraction texte OCR (optionnel)
7. Stockage fichier + métadonnées
8. Indexation pour recherche

**Validations:**
- Extensions autorisées: .pdf, .docx (configurable)
- Taille max: 50 MB (configurable)
- Vérification intégrité (checksum)

### 5.2 Versioning Documents

```
Document LOI-2024-00123
├── v1 (2024-01-15) - Version initiale
├── v2 (2024-06-20) - Modification art. 5
└── v3 (2025-01-10) - Version consolidée [CURRENT]
```

- Chaque modification crée une nouvelle version
- L'ancienne version est conservée
- Seule la version courante est affichée par défaut
- Historique accessible

### 5.3 Système d'Alertes

**Alertes automatiques:**
- 90 jours avant expiration contrat
- 60 jours avant expiration contrat
- 30 jours avant expiration contrat
- À l'expiration

**Notifications:**
- Email aux responsables
- Notification in-app
- Badge sur le menu

**Workflow:**
1. Alerte créée (PENDING)
2. Notification envoyée (NOTIFIED)
3. Utilisateur accuse réception (ACKNOWLEDGED)
4. Traitement en cours (IN_PROGRESS)
5. Résolution (RESOLVED)

### 5.4 Recherche Avancée

**Critères de recherche:**
- Texte libre (titre, contenu, mots-clés)
- Type de document
- Domaine juridique
- Période (publication, entrée en vigueur)
- Statut
- Tags

**Fonctionnalités:**
- Recherche full-text
- Filtres combinables
- Sauvegarde des recherches
- Export résultats

---

## 6. API Endpoints

### 6.1 Documents Juridiques

```
GET    /api/legal/documents                 # Liste avec filtres
POST   /api/legal/documents                 # Créer (FormData)
GET    /api/legal/documents/:id             # Détail
PUT    /api/legal/documents/:id             # Modifier
DELETE /api/legal/documents/:id             # Supprimer
GET    /api/legal/documents/:id/download    # Télécharger fichier
GET    /api/legal/documents/:id/versions    # Historique versions
POST   /api/legal/documents/:id/version     # Nouvelle version
```

### 6.2 Contrats

```
GET    /api/legal/contracts                 # Liste
POST   /api/legal/contracts                 # Créer
GET    /api/legal/contracts/:id             # Détail
PUT    /api/legal/contracts/:id             # Modifier
DELETE /api/legal/contracts/:id             # Supprimer
GET    /api/legal/contracts/:id/download    # Télécharger
POST   /api/legal/contracts/:id/renew       # Renouveler
GET    /api/legal/contracts/expiring        # Contrats expirant bientôt
```

### 6.3 Alertes

```
GET    /api/legal/alerts                    # Liste
POST   /api/legal/alerts                    # Créer
GET    /api/legal/alerts/:id                # Détail
PUT    /api/legal/alerts/:id                # Modifier
POST   /api/legal/alerts/:id/acknowledge    # Accuser réception
POST   /api/legal/alerts/:id/resolve        # Résoudre
GET    /api/legal/alerts/my                 # Mes alertes
GET    /api/legal/alerts/pending            # Alertes en attente
```

### 6.4 Référentiels

```
GET    /api/legal/document-types            # Types documents
POST   /api/legal/document-types
GET    /api/legal/domains                   # Domaines juridiques
POST   /api/legal/domains
GET    /api/legal/contract-types            # Types contrats
POST   /api/legal/contract-types
```

---

## 7. Interface Utilisateur

### 7.1 Tableau de Bord Juridique

```
┌─────────────────────────────────────────────────────────┐
│  Direction Juridique - Tableau de bord                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   125    │ │    45    │ │    12    │ │    3     │   │
│  │ Documents│ │ Contrats │ │ Alertes  │ │Contentieux│  │
│  │ actifs   │ │ actifs   │ │ en cours │ │ en cours │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  ┌─────────────────────┐ ┌─────────────────────────┐   │
│  │ Alertes urgentes    │ │ Contrats expirant       │   │
│  │ ⚠ Contrat EXP-001  │ │ 📅 CONT-2025-001 (15j) │   │
│  │ ⚠ Révision LOI-XX  │ │ 📅 CONT-2025-002 (30j) │   │
│  └─────────────────────┘ └─────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Activité récente                                │   │
│  │ • Nouveau texte ajouté: Décret n°2025-001      │   │
│  │ • Contrat renouvelé: CONT-2024-045             │   │
│  │ • Alerte résolue: ALERT-2025-012               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Liste des Documents

```
┌─────────────────────────────────────────────────────────┐
│  Veille Juridique - Textes                [+ Nouveau]   │
├─────────────────────────────────────────────────────────┤
│  🔍 Rechercher...          [Type ▼] [Domaine ▼] [Statut]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📄 LOI-2024-00123 | Loi sur les investissements       │
│     Investissement | En vigueur | 15/01/2024           │
│                                                         │
│  📄 DEC-2024-00456 | Décret d'application              │
│     Investissement | En vigueur | 20/03/2024           │
│                                                         │
│  📄 ARR-2025-00012 | Arrêté fixant les taux            │
│     Fiscalité | En vigueur | 05/01/2025                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Formulaire Document (Dynamique)

```
┌─────────────────────────────────────────────────────────┐
│  Nouveau Document Juridique                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Type de document *        [Sélectionner...        ▼]   │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  [Champs dynamiques selon le type sélectionné]         │
│                                                         │
│  Titre *                   [________________________]   │
│  Référence officielle      [________________________]   │
│  Date de publication *     [____/____/________]        │
│  Date d'entrée en vigueur  [____/____/________]        │
│  Domaine juridique         [Sélectionner...        ▼]   │
│                                                         │
│  Résumé                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Mots-clés                 [investissement] [x] [+]    │
│                                                         │
│  Document PDF *                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📎 Glisser un fichier ou cliquer pour upload  │   │
│  │     Formats: PDF, DOCX | Max: 50 MB            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                        [Annuler]  [Enregistrer]        │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Sécurité et Permissions

### 8.1 Rôles

| Rôle | Permissions |
|------|-------------|
| JURIDIQUE_ADMIN | Tout (CRUD complet + config) |
| JURIDIQUE_MANAGER | CRUD documents/contrats + alertes |
| JURIDIQUE_USER | Lecture + création brouillons |
| VIEWER | Lecture seule |

### 8.2 Audit Trail

Toutes les actions sont tracées:
- Création/Modification/Suppression
- Téléchargements
- Changements de statut
- Résolution d'alertes

---

## 9. Intégration avec Modules Existants

### 9.1 Guichet Unique
- Lien vers textes juridiques applicables par type de dossier
- Référence aux lois dans les décisions

### 9.2 Investissements
- Contrats liés aux projets d'investissement
- Conventions avec investisseurs

### 9.3 Notifications
- Alertes via le système de messages existant
- Intégration avec le centre de notifications

---

## 10. Roadmap d'Implémentation

### Phase 1 - Fondations
1. Modèles Sequelize (LegalDocument, Contract, LegalAlert, etc.)
2. Tables base de données
3. API CRUD de base
4. Upload fichiers

### Phase 2 - Interface
5. Menu Direction Juridique
6. Pages liste/détail documents
7. Pages liste/détail contrats
8. Formulaires dynamiques

### Phase 3 - Fonctionnalités Avancées
9. Système d'alertes automatiques
10. Recherche avancée
11. Versioning documents
12. Tableau de bord juridique

### Phase 4 - Optimisations
13. OCR extraction texte
14. Recherche full-text
15. Rapports et statistiques
16. Export PDF/Excel

---

## 11. Technologies Utilisées

- **Backend**: Next.js API Routes
- **ORM**: Sequelize
- **Base de données**: PostgreSQL
- **Stockage fichiers**: Système de fichiers local (évolutif vers S3)
- **Frontend**: React + Tailwind CSS
- **PDF Viewer**: react-pdf ou embed natif
- **Recherche**: PostgreSQL Full-Text Search

---

*Document créé le: 2 janvier 2026*
*Version: 1.0*
*Auteur: Claude Code Assistant*
