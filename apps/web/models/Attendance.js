import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Attendance extends Model {}

Attendance.init(
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
    // Heures de travail
    checkIn: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    checkOut: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    breakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    breakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    // Heures calculées
    workingHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Heures travaillées (hors pause)',
    },
    breakHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    overtimeHours: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    // Statut de présence
    status: {
      type: DataTypes.ENUM(
        'PRESENT',
        'ABSENT',
        'LATE',
        'HALF_DAY',
        'ON_LEAVE',
        'REMOTE',
        'MISSION',
        'SICK',
        'HOLIDAY',
        'WEEKEND'
      ),
      defaultValue: 'PRESENT',
    },
    // Détails du retard
    lateMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    earlyLeaveMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Lieu de travail
    workLocation: {
      type: DataTypes.ENUM('OFFICE', 'REMOTE', 'FIELD', 'MISSION'),
      defaultValue: 'OFFICE',
    },
    locationDetails: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Géolocalisation (optionnel)
    checkInLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    checkInLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    checkOutLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    checkOutLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    // Justification
    absenceReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isJustified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    justificationDocument: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Lié à un congé
    leaveId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Validation
    isValidated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    validatedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Source de l'enregistrement
    source: {
      type: DataTypes.ENUM('MANUAL', 'BIOMETRIC', 'MOBILE', 'SYSTEM'),
      defaultValue: 'MANUAL',
    },
  },
  {
    sequelize,
    tableName: 'attendances',
    modelName: 'Attendance',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['employee_id', 'date'],
      },
    ],
  }
);

export default Attendance;
