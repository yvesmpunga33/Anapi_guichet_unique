# SYSTÈME DE PARTAGE D'INFORMATIONS - ANAPI

**Version:** 1.0
**Date:** Janvier 2025
**Statut:** Document de Spécification
**Auteur:** Équipe Développement ANAPI

---

## TABLE DES MATIÈRES

1. [Introduction](#1-introduction)
2. [Architecture Globale](#2-architecture-globale)
3. [Structure des Menus](#3-structure-des-menus)
4. [Module Gestion Documentaire](#4-module-gestion-documentaire)
5. [Module Collaboration](#5-module-collaboration)
6. [Module Workflow & Approbations](#6-module-workflow--approbations)
7. [Module Notifications](#7-module-notifications)
8. [Structure Technique Backend](#8-structure-technique-backend)
9. [Structure Technique Frontend](#9-structure-technique-frontend)
10. [Modèles de Données](#10-modèles-de-données)
11. [Intégration avec l'Existant](#11-intégration-avec-lexistant)
12. [Technologies Additionnelles](#12-technologies-additionnelles)
13. [Plan d'Implémentation](#13-plan-dimplémentation)

---

## 1. Introduction

### 1.1 Contexte

Le Système de Partage d'Informations est un module complémentaire à la plateforme ANAPI existante. Il vise à centraliser la gestion documentaire, faciliter la collaboration entre équipes et automatiser les workflows de validation.

### 1.2 Objectifs

- **Centralisation** : Regrouper 100% des documents actifs sur la plateforme
- **Collaboration** : Réduire le temps de coordination entre services de 40%
- **Traçabilité** : Assurer un suivi complet de chaque document (100% des actions tracées)
- **Sécurité** : Protéger les informations sensibles (Zéro incident de fuite)
- **Productivité** : Gain de 30% de productivité

### 1.3 Principes Directeurs

1. **Simplicité d'utilisation** : Interface intuitive accessible à tous
2. **Accessibilité** : Disponible sur ordinateur, tablette et smartphone
3. **Fiabilité** : Système robuste avec sauvegarde automatique
4. **Évolutivité** : Capacité à grandir avec les besoins
5. **Conformité** : Respect des normes et réglementations

---

## 2. Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE PARTAGE D'INFORMATIONS                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │  DOCUMENTS  │  │ COLLABORATION│  │  WORKFLOW   │  │NOTIFICATIONS│ │
│  │             │  │             │  │             │  │            │ │
│  │ • Upload    │  │ • Messagerie│  │ • Validation│  │ • Temps réel│ │
│  │ • Dossiers  │  │ • Co-édition│  │ • Signatures│  │ • Email    │ │
│  │ • Recherche │  │ • Présence  │  │ • Suivi     │  │ • Push     │ │
│  │ • Versioning│  │ • Commentaires│ │ • Délais   │  │ • Préférences│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PLATEFORME CENTRALE                       │   │
│  │         (Authentification, Sécurité, Audit Trail)           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.1 Modules Principaux

| Module | Description | Priorité |
|--------|-------------|----------|
| Gestion Documentaire | Upload, organisation, recherche, versioning | Haute |
| Collaboration | Messagerie temps réel, commentaires, présence | Haute |
| Workflow | Validation, approbations, suivi des processus | Moyenne |
| Notifications | Alertes temps réel, email, push | Moyenne |

---

## 3. Structure des Menus

### 3.1 Menu Principal (Sidebar)

```
📁 ESPACE DOCUMENTAIRE
├── 🏠 Mon Espace
│   ├── Documents récents
│   ├── Favoris ⭐
│   ├── Partagés avec moi
│   └── Corbeille 🗑️
│
├── 📂 Dossiers
│   ├── Direction Générale
│   ├── Département Investissements
│   ├── Département Juridique
│   ├── Ressources Humaines
│   ├── Finances
│   └── + Nouveau dossier
│
├── 🔍 Recherche Avancée
│
└── 📊 Statistiques d'utilisation

💬 COLLABORATION
├── 📨 Messagerie
│   ├── Boîte de réception
│   ├── Messages envoyés
│   ├── Brouillons
│   └── Conversations de groupe
│
├── 👥 Équipes & Groupes
│   ├── Mes équipes
│   └── Créer un groupe
│
└── 🟢 Utilisateurs en ligne

✅ WORKFLOWS
├── 📋 Mes tâches
│   ├── En attente de validation
│   ├── À réviser
│   └── Terminées
│
├── 📝 Demandes soumises
│
└── 📈 Suivi des processus

🔔 NOTIFICATIONS
├── Toutes les notifications
├── Non lues
└── ⚙️ Préférences

⚙️ PARAMÈTRES (Admin)
├── Gestion des utilisateurs
├── Permissions & Rôles
├── Configuration des workflows
├── Audit & Logs
└── Stockage & Quotas
```

---

## 4. Module Gestion Documentaire

### 4.1 Interface Principale - Liste des Documents

```
┌────────────────────────────────────────────────────────────────────┐
│ 🔍 Rechercher...                    [📤 Upload] [📁 Nouveau dossier]│
├────────────────────────────────────────────────────────────────────┤
│ Fil d'Ariane: 🏠 > Direction Générale > Rapports 2024             │
├────────────────────────────────────────────────────────────────────┤
│ ☐ Nom                    │ Modifié       │ Taille │ Partagé │ ⋮   │
├────────────────────────────────────────────────────────────────────┤
│ ☐ 📁 Rapports Trimestriels│ 15 Jan 2025  │ -      │ 👥 3    │ ⋮   │
│ ☐ 📁 Procès-Verbaux       │ 10 Jan 2025  │ -      │ 🔒      │ ⋮   │
│ ☐ 📄 Rapport_Annuel_2024.pdf│ 08 Jan 2025│ 2.4 MB │ 👥 12   │ ⋮   │
│ ☐ 📊 Budget_2025.xlsx     │ 05 Jan 2025  │ 1.1 MB │ 👥 5    │ ⋮   │
│ ☐ 📝 Note_Service_001.docx│ 03 Jan 2025  │ 245 KB │ 🔒      │ ⋮   │
└────────────────────────────────────────────────────────────────────┘
│ Vue: [☷ Liste] [⊞ Grille]          Trier: [Date ▼]    5 éléments │
└────────────────────────────────────────────────────────────────────┘
```

### 4.2 Actions sur Documents (Menu Contextuel)

| Action | Icône | Description |
|--------|-------|-------------|
| Prévisualiser | 👁️ | Voir sans télécharger |
| Télécharger | ⬇️ | Télécharger le fichier |
| Renommer | ✏️ | Modifier le nom |
| Déplacer vers | 📁 | Changer de dossier |
| Copier vers | 📋 | Dupliquer |
| Partager | 🔗 | Partager avec utilisateurs/groupes |
| Favoris | ⭐ | Ajouter/retirer des favoris |
| Tags | 🏷️ | Gérer les étiquettes |
| Versions | 📜 | Historique des versions |
| Commentaires | 💬 | Voir/ajouter commentaires |
| Propriétés | ℹ️ | Métadonnées |
| Permissions | 🔒 | Gérer les accès |
| Supprimer | 🗑️ | Mettre à la corbeille |

### 4.3 Zone d'Upload (Drag & Drop)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│     ┌──────────────────────────────────────────────────────┐      │
│     │                                                      │      │
│     │        📤 Glissez vos fichiers ici                  │      │
│     │                                                      │      │
│     │              ou cliquez pour parcourir              │      │
│     │                                                      │      │
│     │         Formats: PDF, DOC, XLS, PPT, Images         │      │
│     │              Taille max: 500 Mo par fichier         │      │
│     │                                                      │      │
│     └──────────────────────────────────────────────────────┘      │
│                                                                    │
│  Uploads en cours:                                                 │
│  ├── 📄 Rapport_Q4.pdf ████████████░░░░ 75% - 2.1 MB / 2.8 MB    │
│  └── 📊 Données.xlsx   ██████████████████ 100% ✅                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 4.4 Panneau de Détails (Sidebar Droite)

```
┌────────────────────────────┐
│ 📄 Rapport_Annuel_2024.pdf │
├────────────────────────────┤
│ [Prévisualisation miniature]│
├────────────────────────────┤
│ INFORMATIONS               │
│ Type: PDF Document         │
│ Taille: 2.4 MB            │
│ Créé: 01 Dec 2024         │
│ Modifié: 08 Jan 2025      │
│ Par: Jean Kabila          │
│ Version: 3                 │
├────────────────────────────┤
│ TAGS                       │
│ [Rapport] [2024] [Annuel]  │
│ + Ajouter tag              │
├────────────────────────────┤
│ PARTAGÉ AVEC               │
│ 👤 Marie K. (Peut modifier)│
│ 👤 Pierre M. (Lecture)     │
│ 👥 Direction (Lecture)     │
│ + Partager                 │
├────────────────────────────┤
│ ACTIVITÉ RÉCENTE           │
│ • Jean a modifié - 08 Jan  │
│ • Marie a commenté - 07 Jan│
│ • Pierre a consulté - 05 Jan│
└────────────────────────────┘
```

### 4.5 Historique des Versions

```
┌────────────────────────────────────────────────────────────────────┐
│ 📜 Historique - Rapport_Annuel_2024.pdf                           │
├────────────────────────────────────────────────────────────────────┤
│ Version │ Date           │ Auteur      │ Taille │ Actions         │
├────────────────────────────────────────────────────────────────────┤
│ v3 ●    │ 08 Jan 2025   │ Jean K.     │ 2.4 MB │ [Actuelle]      │
│ v2      │ 15 Dec 2024   │ Marie M.    │ 2.1 MB │ [↩️ Restaurer] [👁️]│
│ v1      │ 01 Dec 2024   │ Jean K.     │ 1.8 MB │ [↩️ Restaurer] [👁️]│
├────────────────────────────────────────────────────────────────────┤
│ [📊 Comparer v2 avec v3]                                          │
└────────────────────────────────────────────────────────────────────┘
```

### 4.6 Formats de Fichiers Supportés

| Catégorie | Formats |
|-----------|---------|
| Documents | PDF, DOC, DOCX, ODT, TXT, RTF |
| Tableurs | XLS, XLSX, ODS, CSV |
| Présentations | PPT, PPTX, ODP |
| Images | JPG, JPEG, PNG, GIF, BMP, SVG |
| Vidéos | MP4, AVI, MOV, MKV |
| Archives | ZIP, RAR, 7Z |

---

## 5. Module Collaboration

### 5.1 Messagerie Instantanée

```
┌─────────────────────────────────────────────────────────────────────┐
│ 💬 MESSAGERIE                                          [+ Nouveau] │
├──────────────────┬──────────────────────────────────────────────────┤
│ CONVERSATIONS    │  👤 Marie Kabongo                     🟢 En ligne│
│                  │──────────────────────────────────────────────────│
│ 🔍 Rechercher... │                                                  │
│                  │  Marie: Bonjour, avez-vous vu le rapport?  10:30│
│ ● Marie K.  🟢   │  ◀─────────────────────────────────────────────  │
│   Bonjour, av... │                                                  │
│                  │  Vous: Oui, je l'ai consulté ce matin.    10:32 │
│ ○ Pierre M. 🟡   │  ─────────────────────────────────────────────▶  │
│   D'accord, je...│                                                  │
│                  │  Marie: Parfait! Pouvez-vous valider     10:35  │
│ ○ Équipe RH  👥  │  la section financière?                          │
│   3 messages     │  ◀─────────────────────────────────────────────  │
│                  │                                                  │
│ ○ Jean D.   ⚫   │  📎 Rapport_Annuel_2024.pdf                      │
│   Hors ligne     │  [📄 Voir le document]                           │
│                  │                                                  │
├──────────────────┼──────────────────────────────────────────────────┤
│                  │ [📎] [😊] Écrivez votre message...    [Envoyer ➤]│
└──────────────────┴──────────────────────────────────────────────────┘
```

### 5.2 Statuts de Présence

| Statut | Icône | Description |
|--------|-------|-------------|
| En ligne | 🟢 | Utilisateur actif |
| Absent | 🟡 | Inactif depuis 5+ minutes |
| Occupé | 🔴 | Ne pas déranger |
| Hors ligne | ⚫ | Déconnecté |

### 5.3 Panneau Utilisateurs en Ligne

```
┌─────────────────────────────┐
│ 👥 UTILISATEURS EN LIGNE    │
├─────────────────────────────┤
│ 🟢 En ligne (5)             │
│   👤 Marie Kabongo          │
│   👤 Jean Diallo            │
│   👤 Pierre Mukendi         │
│   👤 Anne Tshilombo         │
│   👤 Vous                   │
├─────────────────────────────┤
│ 🟡 Absent (3)               │
│   👤 Paul Kasongo           │
│   👤 Claire Mbaya           │
│   👤 David Nkumu            │
├─────────────────────────────┤
│ ⚫ Hors ligne (12)          │
│   [Voir tous]               │
└─────────────────────────────┘
```

### 5.4 Commentaires sur Documents

```
┌────────────────────────────────────────────────────────────────────┐
│ 💬 Commentaires - Rapport_Annuel_2024.pdf                    [×]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  👤 Marie K. • 07 Jan 2025 à 14:30                                │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ La section 3.2 nécessite une mise à jour des chiffres.  │     │
│  │ @Jean peux-tu vérifier les données du Q4?               │     │
│  └──────────────────────────────────────────────────────────┘     │
│     [👍 2] [Répondre]                                             │
│     │                                                              │
│     └─ 👤 Jean D. • 07 Jan 2025 à 15:45                          │
│        Je vais m'en occuper aujourd'hui. ✅                       │
│        [👍 1]                                                      │
│                                                                    │
│  👤 Pierre M. • 06 Jan 2025 à 09:15                               │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ Excellent travail sur l'introduction!                    │     │
│  └──────────────────────────────────────────────────────────┘     │
│     [👍 5] [Répondre]                                             │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ [📎] Ajouter un commentaire...                        [Publier]   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. Module Workflow & Approbations

### 6.1 Liste des Tâches

```
┌────────────────────────────────────────────────────────────────────┐
│ ✅ MES TÂCHES                                                      │
├────────────────────────────────────────────────────────────────────┤
│ [En attente (3)] [À réviser (1)] [Terminées (15)]                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ 🔴 URGENT - Échéance dépassée                                     │
│ ├── 📄 Convention_Partenariat.pdf                                 │
│ │   Demandé par: Direction Générale                               │
│ │   Échéance: 05 Jan 2025 (3 jours de retard)                    │
│ │   [✅ Approuver] [❌ Rejeter] [💬 Commenter]                    │
│                                                                    │
│ 🟡 À traiter cette semaine                                        │
│ ├── 📄 Budget_Dept_IT_2025.xlsx                                   │
│ │   Demandé par: Département IT                                   │
│ │   Échéance: 12 Jan 2025                                        │
│ │   [✅ Approuver] [❌ Rejeter] [💬 Commenter]                    │
│ │                                                                  │
│ └── 📄 Rapport_Activité_Dec.pdf                                   │
│     Demandé par: RH                                               │
│     Échéance: 15 Jan 2025                                        │
│     [✅ Approuver] [❌ Rejeter] [💬 Commenter]                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 6.2 États d'un Document dans le Workflow

```
BROUILLON → EN RÉVISION → APPROUVÉ → PUBLIÉ → ARCHIVÉ
                ↓
             REJETÉ → (Modifier) → EN RÉVISION
```

| État | Description | Actions Possibles |
|------|-------------|-------------------|
| Brouillon | Document en cours de création | Modifier, Soumettre |
| En révision | En attente de validation | Approuver, Rejeter, Commenter |
| Approuvé | Validé par l'approbateur | Publier |
| Rejeté | Refusé avec commentaires | Modifier, Re-soumettre |
| Publié | Accessible à tous les autorisés | Archiver |
| Archivé | Conservé mais non actif | Restaurer |

### 6.3 Suivi d'un Workflow

```
┌────────────────────────────────────────────────────────────────────┐
│ 📈 SUIVI - Convention_Partenariat.pdf                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ✅ CRÉATION          ✅ RÉVISION         🔄 APPROBATION          │
│  ●────────────────────●────────────────────◐─ ─ ─ ─ ─ ─ ─        │
│  Jean K.             Marie M.            Direction               │
│  01 Jan 2025         03 Jan 2025         En attente              │
│                                                                    │
│                                              ○ PUBLICATION        │
│                                          ─ ─ ─ ─ ─ ─ ─○          │
│                                              À venir              │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ HISTORIQUE                                                        │
│ • 03 Jan - Marie M. a validé avec commentaires                   │
│ • 02 Jan - Jean K. a soumis une révision                         │
│ • 01 Jan - Jean K. a créé le document                            │
└────────────────────────────────────────────────────────────────────┘
```

---

## 7. Module Notifications

### 7.1 Centre de Notifications

```
┌────────────────────────────────────────────────────────────────────┐
│ 🔔 NOTIFICATIONS                          [Tout marquer comme lu] │
├────────────────────────────────────────────────────────────────────┤
│ Aujourd'hui                                                        │
│ ├── 🔵 Marie K. a partagé "Rapport_Q4.pdf" avec vous    il y a 2h│
│ ├── 🟢 Votre document "Budget.xlsx" a été approuvé      il y a 3h│
│ └── 💬 Nouveau commentaire sur "Convention.pdf"         il y a 5h│
│                                                                    │
│ Hier                                                               │
│ ├── 🔴 RAPPEL: Document en attente de validation                  │
│ ├── 👤 Jean D. vous a mentionné dans un commentaire              │
│ └── 📁 Nouveau dossier créé dans "Direction Générale"            │
│                                                                    │
│ Cette semaine                                                      │
│ ├── ✅ Workflow "Approbation Budget" terminé                      │
│ └── 📊 Rapport hebdomadaire disponible                            │
│                                                                    │
│ [Voir toutes les notifications]                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 7.2 Types de Notifications

| Type | Icône | Description |
|------|-------|-------------|
| Document partagé | 🔵 | Quelqu'un a partagé un document avec vous |
| Document approuvé | 🟢 | Votre document a été validé |
| Document rejeté | 🔴 | Votre document a été refusé |
| Commentaire | 💬 | Nouveau commentaire sur un document |
| Mention | 👤 | Vous avez été mentionné (@) |
| Rappel | ⏰ | Échéance approchant |
| Workflow | ✅ | Changement de statut workflow |
| Système | ⚙️ | Notification système |

### 7.3 Préférences de Notifications

```
┌────────────────────────────────────────────────────────────────────┐
│ ⚙️ PRÉFÉRENCES DE NOTIFICATIONS                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ CANAUX DE NOTIFICATION                                            │
│ ┌─────────────────────┬─────────┬─────────┬─────────┐            │
│ │ Événement           │ In-App  │ Email   │ Push    │            │
│ ├─────────────────────┼─────────┼─────────┼─────────┤            │
│ │ Document partagé    │ [✓]     │ [✓]     │ [ ]     │            │
│ │ Commentaire         │ [✓]     │ [ ]     │ [ ]     │            │
│ │ Mention (@)         │ [✓]     │ [✓]     │ [✓]     │            │
│ │ Validation requise  │ [✓]     │ [✓]     │ [✓]     │            │
│ │ Document approuvé   │ [✓]     │ [✓]     │ [ ]     │            │
│ │ Document rejeté     │ [✓]     │ [✓]     │ [✓]     │            │
│ │ Rappel d'échéance   │ [✓]     │ [✓]     │ [✓]     │            │
│ │ Nouveau message     │ [✓]     │ [ ]     │ [ ]     │            │
│ └─────────────────────┴─────────┴─────────┴─────────┘            │
│                                                                    │
│ DIGEST EMAIL                                                       │
│ Fréquence: [Quotidien ▼]   Heure: [08:00 ▼]                       │
│                                                                    │
│ [Enregistrer les préférences]                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 8. Structure Technique Backend

### 8.1 Nouvelles Routes API

```
/api/v1/
│
├── /documents
│   ├── GET    /                    # Liste documents (filtres, pagination)
│   ├── POST   /                    # Upload document
│   ├── GET    /:id                 # Détails document
│   ├── PUT    /:id                 # Modifier métadonnées
│   ├── DELETE /:id                 # Supprimer (corbeille)
│   ├── GET    /:id/versions        # Historique versions
│   ├── POST   /:id/versions        # Nouvelle version
│   ├── PUT    /:id/versions/:vid/restore  # Restaurer version
│   ├── GET    /:id/preview         # Prévisualisation
│   ├── GET    /:id/download        # Télécharger
│   ├── POST   /:id/share           # Partager
│   ├── DELETE /:id/share/:userId   # Retirer partage
│   ├── POST   /:id/favorite        # Ajouter favoris
│   ├── DELETE /:id/favorite        # Retirer favoris
│   └── GET    /:id/activity        # Journal activité
│
├── /folders
│   ├── GET    /                    # Liste dossiers (arbre)
│   ├── POST   /                    # Créer dossier
│   ├── GET    /:id                 # Contenu dossier
│   ├── PUT    /:id                 # Modifier dossier
│   ├── DELETE /:id                 # Supprimer dossier
│   └── POST   /:id/move            # Déplacer dossier
│
├── /comments
│   ├── GET    /document/:docId     # Commentaires d'un document
│   ├── POST   /document/:docId     # Ajouter commentaire
│   ├── PUT    /:id                 # Modifier commentaire
│   ├── DELETE /:id                 # Supprimer commentaire
│   └── POST   /:id/reply           # Répondre
│
├── /messages
│   ├── GET    /conversations       # Liste conversations
│   ├── POST   /conversations       # Nouvelle conversation
│   ├── GET    /conversations/:id   # Messages d'une conversation
│   ├── POST   /conversations/:id   # Envoyer message
│   └── PUT    /conversations/:id/read  # Marquer comme lu
│
├── /doc-workflows
│   ├── GET    /                    # Liste workflows
│   ├── POST   /                    # Créer workflow
│   ├── GET    /:id                 # Détails workflow
│   ├── POST   /:id/submit          # Soumettre pour validation
│   ├── POST   /:id/approve         # Approuver
│   ├── POST   /:id/reject          # Rejeter
│   └── GET    /:id/history         # Historique
│
├── /notifications
│   ├── GET    /                    # Liste notifications
│   ├── PUT    /:id/read            # Marquer comme lue
│   ├── PUT    /read-all            # Tout marquer comme lu
│   ├── GET    /preferences         # Préférences
│   └── PUT    /preferences         # Modifier préférences
│
├── /search
│   └── GET    /                    # Recherche globale
│
└── /trash
    ├── GET    /                    # Contenu corbeille
    ├── POST   /:id/restore         # Restaurer
    └── DELETE /:id                 # Supprimer définitivement
```

### 8.2 WebSocket Events (Socket.io)

```javascript
// Client → Serveur
'join_room'           // Rejoindre une conversation
'leave_room'          // Quitter une conversation
'send_message'        // Envoyer un message
'typing'              // Indicateur de frappe
'update_presence'     // Mettre à jour le statut

// Serveur → Client
'new_message'         // Nouveau message reçu
'user_typing'         // Utilisateur en train d'écrire
'presence_update'     // Changement de statut utilisateur
'notification'        // Nouvelle notification
'document_updated'    // Document modifié
'comment_added'       // Nouveau commentaire
```

---

## 9. Structure Technique Frontend

### 9.1 Nouvelles Pages

```
/anapi/apps/web/app/
│
├── (dashboard)/
│   │
│   ├── documents/
│   │   ├── page.jsx                 # Mon espace (récents, favoris)
│   │   ├── folders/
│   │   │   ├── page.jsx             # Liste dossiers racine
│   │   │   └── [folderId]/page.jsx  # Contenu dossier
│   │   ├── shared/page.jsx          # Partagés avec moi
│   │   ├── favorites/page.jsx       # Mes favoris
│   │   ├── trash/page.jsx           # Corbeille
│   │   ├── search/page.jsx          # Recherche avancée
│   │   └── [documentId]/
│   │       ├── page.jsx             # Détails document
│   │       ├── versions/page.jsx    # Historique versions
│   │       └── activity/page.jsx    # Journal activité
│   │
│   ├── collaboration/
│   │   ├── messages/
│   │   │   ├── page.jsx             # Liste conversations
│   │   │   └── [conversationId]/page.jsx  # Conversation
│   │   ├── teams/
│   │   │   ├── page.jsx             # Mes équipes
│   │   │   └── [teamId]/page.jsx    # Détail équipe
│   │   └── online/page.jsx          # Utilisateurs en ligne
│   │
│   ├── doc-workflows/
│   │   ├── tasks/page.jsx           # Mes tâches
│   │   ├── submitted/page.jsx       # Demandes soumises
│   │   └── [workflowId]/page.jsx    # Détail workflow
│   │
│   └── notifications/
│       ├── page.jsx                 # Centre notifications
│       └── preferences/page.jsx     # Préférences
```

### 9.2 Nouveaux Composants

```
/components/
│
├── documents/
│   ├── DocumentList.jsx          # Liste de documents
│   ├── DocumentCard.jsx          # Carte document (vue grille)
│   ├── DocumentRow.jsx           # Ligne document (vue liste)
│   ├── DocumentPreview.jsx       # Prévisualisation
│   ├── DocumentUpload.jsx        # Zone upload drag & drop
│   ├── DocumentDetails.jsx       # Panneau détails
│   ├── FolderTree.jsx            # Arborescence dossiers
│   ├── VersionHistory.jsx        # Historique versions
│   ├── ShareDialog.jsx           # Modal partage
│   └── TagsInput.jsx             # Gestion des tags
│
├── collaboration/
│   ├── ConversationList.jsx      # Liste conversations
│   ├── MessageThread.jsx         # Fil de messages
│   ├── MessageInput.jsx          # Zone de saisie message
│   ├── PresenceIndicator.jsx     # Indicateur de présence
│   ├── OnlineUsers.jsx           # Liste utilisateurs en ligne
│   ├── CommentSection.jsx        # Section commentaires
│   └── TypingIndicator.jsx       # Indicateur "en train d'écrire"
│
├── workflows/
│   ├── TaskList.jsx              # Liste des tâches
│   ├── TaskCard.jsx              # Carte tâche
│   ├── WorkflowTimeline.jsx      # Timeline du workflow
│   ├── ApprovalDialog.jsx        # Modal approbation
│   └── WorkflowHistory.jsx       # Historique workflow
│
└── notifications/
    ├── NotificationCenter.jsx    # Centre notifications
    ├── NotificationItem.jsx      # Item notification
    ├── NotificationBell.jsx      # Icône avec badge
    └── NotificationPreferences.jsx # Préférences
```

---

## 10. Modèles de Données

### 10.1 Document

```javascript
{
  id: UUID,
  name: String,                  // Nom affiché
  originalName: String,          // Nom original du fichier
  mimeType: String,              // Type MIME (application/pdf, etc.)
  size: Integer,                 // Taille en bytes
  path: String,                  // Chemin de stockage
  folderId: UUID,                // Dossier parent (null = racine)
  ownerId: UUID,                 // Propriétaire
  version: Integer,              // Numéro de version actuelle
  tags: JSONB,                   // ["rapport", "2024", "finance"]
  metadata: JSONB,               // Métadonnées personnalisées
  status: Enum,                  // draft, active, archived, deleted
  isPublic: Boolean,             // Document public?
  publicLink: String,            // Lien de partage public
  publicLinkExpiry: Date,        // Expiration du lien
  createdAt: DateTime,
  updatedAt: DateTime,
  deletedAt: DateTime            // Soft delete
}
```

### 10.2 Folder

```javascript
{
  id: UUID,
  name: String,
  parentId: UUID,                // Dossier parent (null = racine)
  ownerId: UUID,                 // Propriétaire
  departmentId: UUID,            // Département associé
  color: String,                 // Couleur de l'icône (#3498db)
  icon: String,                  // Icône personnalisée
  isSystem: Boolean,             // Dossier système (non supprimable)
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 10.3 DocumentVersion

```javascript
{
  id: UUID,
  documentId: UUID,              // Document parent
  version: Integer,              // Numéro de version
  path: String,                  // Chemin de stockage
  size: Integer,                 // Taille
  createdById: UUID,             // Créateur de cette version
  comment: String,               // Note de version
  createdAt: DateTime
}
```

### 10.4 DocumentShare

```javascript
{
  id: UUID,
  documentId: UUID,              // Document partagé
  userId: UUID,                  // Utilisateur destinataire
  groupId: UUID,                 // Ou groupe destinataire
  permission: Enum,              // view, comment, edit, full
  sharedById: UUID,              // Qui a partagé
  expiresAt: DateTime,           // Expiration du partage
  createdAt: DateTime
}
```

### 10.5 Comment

```javascript
{
  id: UUID,
  documentId: UUID,              // Document concerné
  userId: UUID,                  // Auteur
  parentId: UUID,                // Commentaire parent (pour réponses)
  content: Text,                 // Contenu du commentaire
  mentions: JSONB,               // ["user-id-1", "user-id-2"]
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 10.6 Conversation

```javascript
{
  id: UUID,
  type: Enum,                    // private, group
  name: String,                  // Nom (pour groupes)
  createdById: UUID,             // Créateur
  lastMessageAt: DateTime,       // Dernier message
  createdAt: DateTime
}
```

### 10.7 ConversationParticipant

```javascript
{
  id: UUID,
  conversationId: UUID,
  userId: UUID,
  lastReadAt: DateTime,          // Dernière lecture
  joinedAt: DateTime
}
```

### 10.8 Message

```javascript
{
  id: UUID,
  conversationId: UUID,          // Conversation
  senderId: UUID,                // Expéditeur
  content: Text,                 // Contenu
  attachments: JSONB,            // Documents joints
  createdAt: DateTime
}
```

### 10.9 Notification

```javascript
{
  id: UUID,
  userId: UUID,                  // Destinataire
  type: Enum,                    // document_shared, comment, mention, etc.
  title: String,                 // Titre
  content: String,               // Contenu
  data: JSONB,                   // Données contextuelles
  isRead: Boolean,
  readAt: DateTime,
  createdAt: DateTime
}
```

### 10.10 NotificationPreference

```javascript
{
  id: UUID,
  userId: UUID,
  type: Enum,                    // Type de notification
  inApp: Boolean,                // Notification in-app
  email: Boolean,                // Notification email
  push: Boolean                  // Notification push
}
```

### 10.11 ActivityLog

```javascript
{
  id: UUID,
  userId: UUID,                  // Utilisateur
  action: Enum,                  // create, update, delete, share, download, view
  entityType: String,            // document, folder, comment
  entityId: UUID,                // ID de l'entité
  details: JSONB,                // Détails supplémentaires
  ipAddress: String,
  userAgent: String,
  createdAt: DateTime
}
```

---

## 11. Intégration avec l'Existant

### 11.1 Schéma d'Intégration

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ANAPI PLATFORM                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │ INVESTISSEMENTS │    │  GUICHET UNIQUE │    │   MINISTÈRES    │ │
│  │    (Existant)   │    │    (Existant)   │    │   (Existant)    │ │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘ │
│           │                      │                      │          │
│           └──────────────────────┼──────────────────────┘          │
│                                  │                                  │
│                    ┌─────────────▼─────────────┐                   │
│                    │   SYSTÈME DE PARTAGE      │                   │
│                    │    D'INFORMATIONS         │                   │
│                    │      (NOUVEAU)            │                   │
│                    └───────────────────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 Points d'Intégration

| Existant | Nouveau Module | Intégration |
|----------|----------------|-------------|
| Documents investissements | Gestion Documentaire | Stocker dans dossiers organisés |
| Utilisateurs/Rôles | Permissions documents | Réutiliser les rôles existants |
| Notifications existantes | Module Notifications | Unifier le système de notifications |
| Workflow agrément | Workflows documents | Même logique, appliquée aux documents |

### 11.3 Modifications au Menu Existant

Ajouter au menu principal du dashboard:

```
📊 Tableau de bord        (existant)
💼 Investissements        (existant)
🏛️ Guichet Unique        (existant)
🏢 Ministères             (existant)
──────────────────────────
📁 Espace Documentaire    (NOUVEAU)
💬 Collaboration          (NOUVEAU)
✅ Mes Tâches             (NOUVEAU)
──────────────────────────
⚙️ Configuration          (existant)
```

---

## 12. Technologies Additionnelles

### 12.1 Stack Technique

| Fonctionnalité | Technologie | Usage |
|----------------|-------------|-------|
| Temps réel | **Socket.io** | Chat, présence, notifications |
| Stockage fichiers | **Local / AWS S3** | Documents uploadés |
| Prévisualisation PDF | **PDF.js** | Viewer PDF intégré |
| Prévisualisation Office | **LibreOffice / OnlyOffice** | Conversion et preview |
| Recherche full-text | **PostgreSQL FTS** | Recherche dans documents |
| Notifications push | **Web Push API** | Alertes navigateur |
| Envoi emails | **Nodemailer + SendGrid** | Notifications email |
| File upload | **Multer** | Gestion des uploads |

### 12.2 Dépendances Backend à Ajouter

```json
{
  "dependencies": {
    "socket.io": "^4.x",
    "multer": "^1.4.x",
    "aws-sdk": "^2.x",
    "nodemailer": "^6.x",
    "pdf-parse": "^1.x",
    "sharp": "^0.32.x"
  }
}
```

### 12.3 Dépendances Frontend à Ajouter

```json
{
  "dependencies": {
    "socket.io-client": "^4.x",
    "react-dropzone": "^14.x",
    "pdfjs-dist": "^3.x",
    "@tanstack/react-query": "^5.x"
  }
}
```

---

## 13. Plan d'Implémentation

### 13.1 Phase 1: Backend - Modèles et API (Priorité Haute)

- [ ] Créer les modèles Sequelize (Document, Folder, etc.)
- [ ] Implémenter les routes /documents
- [ ] Implémenter les routes /folders
- [ ] Configurer Multer pour l'upload
- [ ] Implémenter la recherche full-text

### 13.2 Phase 2: Frontend - Gestion Documentaire (Priorité Haute)

- [ ] Créer les pages documents/*
- [ ] Implémenter le composant DocumentUpload (drag & drop)
- [ ] Implémenter l'arborescence des dossiers
- [ ] Implémenter la prévisualisation PDF
- [ ] Implémenter le partage et les permissions

### 13.3 Phase 3: Backend - Collaboration (Priorité Haute)

- [ ] Configurer Socket.io
- [ ] Implémenter les routes /messages
- [ ] Implémenter les routes /comments
- [ ] Gérer la présence en temps réel

### 13.4 Phase 4: Frontend - Collaboration (Priorité Haute)

- [ ] Créer les pages collaboration/*
- [ ] Implémenter la messagerie temps réel
- [ ] Implémenter les commentaires
- [ ] Afficher la présence des utilisateurs

### 13.5 Phase 5: Workflows et Notifications (Priorité Moyenne)

- [ ] Implémenter les routes /doc-workflows
- [ ] Implémenter les routes /notifications
- [ ] Créer les pages workflows/*
- [ ] Configurer les notifications email
- [ ] Implémenter les préférences de notification

### 13.6 Phase 6: Optimisations (Priorité Basse)

- [ ] Versioning des documents
- [ ] Export ZIP de dossiers
- [ ] Recherche avancée avec filtres
- [ ] Audit trail complet
- [ ] Tests et optimisations

---

## Annexe: Glossaire

| Terme | Définition |
|-------|------------|
| **Workflow** | Processus automatisé de validation d'un document |
| **RBAC** | Role-Based Access Control - Contrôle d'accès basé sur les rôles |
| **Tag** | Étiquette pour catégoriser un document |
| **Métadonnées** | Informations descriptives d'un document |
| **Versioning** | Gestion des versions d'un document |
| **Audit Trail** | Journal de traçabilité des actions |
| **Co-édition** | Modification simultanée par plusieurs utilisateurs |
| **Socket.io** | Bibliothèque pour communication temps réel |

---

**Document préparé pour l'équipe ANAPI**
**Prêt pour implémentation sur validation**
