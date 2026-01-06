import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class OpportunityApplication extends Model {}

OpportunityApplication.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Reference unique de la candidature (ex: CAND-2026-001)',
    },
    opportunityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'province_opportunities',
        key: 'id',
      },
      comment: 'Opportunite concernee',
    },
    investorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'investors',
        key: 'id',
      },
      comment: 'Investisseur candidat',
    },
    proposedAmount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      comment: 'Montant d\'investissement propose (USD)',
    },
    proposedJobs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nombre d\'emplois proposes',
    },
    motivation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Lettre de motivation / presentation',
    },
    experience: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Experience pertinente de l\'investisseur',
    },
    timeline: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Calendrier propose pour le projet',
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'WITHDRAWN'),
      allowNull: false,
      defaultValue: 'DRAFT',
      comment: 'Statut de la candidature',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de soumission',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de revision',
    },
    reviewedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Agent qui a examine la candidature',
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes de l\'agent sur la candidature',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Score d\'evaluation (0-100)',
    },
  },
  {
    sequelize,
    tableName: 'opportunity_applications',
    modelName: 'OpportunityApplication',
    timestamps: true,
    indexes: [
      { fields: ['reference'], unique: true },
      { fields: ['opportunityId'] },
      { fields: ['investorId'] },
      { fields: ['status'] },
      { fields: ['submittedAt'] },
    ],
  }
);

export default OpportunityApplication;
