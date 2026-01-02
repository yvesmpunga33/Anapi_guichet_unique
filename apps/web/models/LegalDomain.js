import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class LegalDomain extends Model {}

LegalDomain.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Code unique (INV, FISC, DOUA, etc.)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nom du domaine juridique',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID du domaine parent pour hierarchie',
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#3B82F6',
      comment: 'Couleur pour UI (format hex)',
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'scale',
      comment: 'Nom icone lucide-react',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'legal_domains',
    modelName: 'LegalDomain',
    timestamps: true,
  }
);

// Auto-reference pour la hierarchie
LegalDomain.belongsTo(LegalDomain, { as: 'parent', foreignKey: 'parentId' });
LegalDomain.hasMany(LegalDomain, { as: 'children', foreignKey: 'parentId' });

export default LegalDomain;
