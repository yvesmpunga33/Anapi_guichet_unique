import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class DossierSector extends Model {}

DossierSector.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dossierId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'dossiers',
        key: 'id',
      },
    },
    sectorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sectors',
        key: 'id',
      },
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indique si c\'est le secteur principal du dossier',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Note ou justification pour ce secteur',
    },
  },
  {
    sequelize,
    tableName: 'dossier_sectors',
    modelName: 'DossierSector',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['dossierId', 'sectorId'],
        name: 'unique_dossier_sector',
      },
      { fields: ['dossierId'] },
      { fields: ['sectorId'] },
      { fields: ['isPrimary'] },
    ],
  }
);

export default DossierSector;
