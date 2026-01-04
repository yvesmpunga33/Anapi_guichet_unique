import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Overtime extends Model {}

Overtime.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Heures supplémentaires
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    // Type d'heures supplémentaires
    type: {
      type: DataTypes.ENUM(
        'REGULAR',
        'NIGHT',
        'WEEKEND',
        'HOLIDAY',
        'EMERGENCY'
      ),
      defaultValue: 'REGULAR',
    },
    // Taux de majoration
    rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 1.5,
      comment: 'Coefficient multiplicateur (1.5, 2, etc.)',
    },
    // Raison
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Projet ou tâche associé',
    },
    // Demande
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isPreApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Demande approuvée avant exécution',
    },
    // Statut
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
        'COMPLETED',
        'PAID'
      ),
      defaultValue: 'PENDING',
    },
    // Compensation
    compensationType: {
      type: DataTypes.ENUM('PAYMENT', 'TIME_OFF', 'MIXED'),
      defaultValue: 'PAYMENT',
    },
    compensationAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    compensationHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Heures de récupération accordées',
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    // Paiement
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payslipId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Approbation
    requestedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'overtimes',
    modelName: 'Overtime',
    timestamps: true,
    underscored: true,
  }
);

export default Overtime;
