import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class WorkSchedule extends Model {}

WorkSchedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Heures de travail par jour
    mondayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    mondayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    mondayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    mondayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    mondayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    tuesdayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    tuesdayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    tuesdayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    tuesdayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    tuesdayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    wednesdayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    wednesdayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    wednesdayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    wednesdayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    wednesdayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    thursdayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    thursdayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    thursdayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    thursdayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    thursdayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    fridayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fridayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fridayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fridayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fridayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    saturdayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    saturdayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    saturdayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    saturdayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    saturdayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    sundayStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    sundayEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    sundayBreakStart: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    sundayBreakEnd: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    sundayWorkHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    // Totaux
    weeklyHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    workingDays: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    // Tolérance de retard
    lateToleranceMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },
    earlyLeaveToleranceMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },
    // Heures supplémentaires
    overtimeThreshold: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 8,
      comment: 'Heures après lesquelles les HS commencent',
    },
    regularOvertimeRate: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1.5,
    },
    weekendOvertimeRate: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 2.0,
    },
    holidayOvertimeRate: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 2.5,
    },
    nightOvertimeRate: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1.75,
    },
    nightStartTime: {
      type: DataTypes.TIME,
      defaultValue: '22:00',
    },
    nightEndTime: {
      type: DataTypes.TIME,
      defaultValue: '06:00',
    },
    // Statut
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'work_schedules',
    modelName: 'WorkSchedule',
    timestamps: true,
    underscored: true,
  }
);

export default WorkSchedule;
