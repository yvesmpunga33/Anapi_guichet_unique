import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceEvent extends Model {}

ProvinceEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provinceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'province_id',
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('CONFERENCE', 'FORUM', 'SEMINAIRE', 'ATELIER', 'INAUGURATION', 'CEREMONIE', 'FESTIVAL', 'EXPOSITION', 'REUNION', 'AUTRE'),
      defaultValue: 'AUTRE',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cover_image',
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Lieu de l\'evenement',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date',
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'end_time',
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_online',
    },
    onlineLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'online_link',
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_participants',
    },
    registrationRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'registration_required',
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'registration_deadline',
    },
    registrationFee: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'registration_fee',
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    organizer: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Organisateur de l\'evenement',
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'contact_email',
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'contact_phone',
    },
    speakers: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Liste des intervenants [{name, title, photo, bio}]',
    },
    agenda: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Programme de l\'evenement [{time, title, description, speaker}]',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'),
      defaultValue: 'DRAFT',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_events',
    modelName: 'ProvinceEvent',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['province_id'],
      },
      {
        unique: true,
        fields: ['province_id', 'slug'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['start_date'],
      },
    ],
  }
);

export default ProvinceEvent;
