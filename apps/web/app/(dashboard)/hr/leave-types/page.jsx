'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import Swal from 'sweetalert2';

import {
  Calendar,
  CalendarDays,
  Plus,
  RefreshCw,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Umbrella,
  Stethoscope,
  Baby,
  User,
  Users,
  Star,
  DollarOff,
  GraduationCap,
  Timer,
  FileText,
  Clock,
  ToggleLeft,
  ToggleRight,
  Palette,
} from 'lucide-react';

import {
  getLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  generateLeaveTypeCode,
  initDefaultLeaveTypes,
  toggleLeaveTypeStatus,
} from '@/app/services/hr';

// Icon mapping
const ICON_MAP = {
  BeachAccess: Umbrella,
  LocalHospital: Stethoscope,
  ChildCare: Baby,
  Face: User,
  FamilyRestroom: Users,
  Star: Star,
  MoneyOff: DollarOff,
  School: GraduationCap,
  Schedule: Timer,
  Event: Calendar,
};

const ICON_OPTIONS = [
  { value: 'BeachAccess', label: 'Plage (Annuel)', Icon: Umbrella },
  { value: 'LocalHospital', label: 'Hopital (Maladie)', Icon: Stethoscope },
  { value: 'ChildCare', label: 'Bebe (Maternite)', Icon: Baby },
  { value: 'Face', label: 'Visage (Paternite)', Icon: User },
  { value: 'FamilyRestroom', label: 'Famille', Icon: Users },
  { value: 'Star', label: 'Etoile (Exceptionnel)', Icon: Star },
  { value: 'MoneyOff', label: 'Sans solde', Icon: DollarOff },
  { value: 'School', label: 'Ecole (Formation)', Icon: GraduationCap },
  { value: 'Schedule', label: 'Horloge (Recuperation)', Icon: Timer },
  { value: 'Event', label: 'Evenement', Icon: Calendar },
];

const GENRE_LABELS = {
  tous: 'Tous',
  M: 'Hommes uniquement',
  F: 'Femmes uniquement',
};

// Stats Card Component
function StatCard({ stat }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${stat.bgClass}`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">{stat.value}</h3>
          <p className="text-sm text-white/85">{stat.title}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
          <stat.icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

// Leave Type Card Component
function LeaveTypeCard({ leaveType, onEdit, onDelete, onToggleStatus, intl }) {
  const color = leaveType.couleur || '#1976d2';
  const IconComponent = ICON_MAP[leaveType.icone] || Calendar;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      style={{ borderTopColor: color, borderTopWidth: '4px' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <IconComponent className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 dark:text-white">{leaveType.nom}</h3>
                <span
                  className="rounded px-2 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {leaveType.code}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {GENRE_LABELS[leaveType.genreApplicable]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleStatus(leaveType)}
              className={`rounded-lg p-1 transition-colors ${
                leaveType.actif
                  ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30'
                  : 'text-gray-400 hover:bg-gray-50 dark:text-gray-500 dark:hover:bg-gray-700'
              }`}
              title={leaveType.actif ? intl.formatMessage({ id: 'hr.leaveTypes.active', defaultMessage: 'Actif' }) : intl.formatMessage({ id: 'hr.leaveTypes.inactive', defaultMessage: 'Inactif' })}
            >
              {leaveType.actif ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
            </button>
            <button
              onClick={() => onEdit(leaveType)}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(leaveType)}
              className="rounded-lg p-1 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-gray-500 dark:text-gray-400">
          {leaveType.description || intl.formatMessage({ id: 'hr.leaveTypes.noDescription', defaultMessage: 'Aucune description' })}
        </p>

        <div className="mb-4 border-t border-gray-100 dark:border-gray-700" />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaveTypes.daysPerYear', defaultMessage: 'Jours/an' })}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{leaveType.joursParDefaut || 0} {intl.formatMessage({ id: 'hr.leaveTypes.days', defaultMessage: 'jours' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {leaveType.estPaye ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaveTypes.paid', defaultMessage: 'Paye' })}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{leaveType.estPaye ? intl.formatMessage({ id: 'common.yes', defaultMessage: 'Oui' }) : intl.formatMessage({ id: 'common.no', defaultMessage: 'Non' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaveTypes.minDelay', defaultMessage: 'Delai demande' })}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{leaveType.delaiMinDemande || 0} j. {intl.formatMessage({ id: 'hr.leaveTypes.before', defaultMessage: 'avant' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className={`h-4 w-4 ${leaveType.requiertJustificatif ? 'text-orange-500' : 'text-gray-300'}`} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaveTypes.justification', defaultMessage: 'Justificatif' })}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {leaveType.requiertJustificatif ? intl.formatMessage({ id: 'hr.leaveTypes.required', defaultMessage: 'Requis' }) : intl.formatMessage({ id: 'hr.leaveTypes.notRequired', defaultMessage: 'Non requis' })}
              </p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div
          className="mt-4 rounded-xl p-3 text-center"
          style={{ backgroundColor: `${color}10` }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.leaveTypes.duration', defaultMessage: 'Duree' })}: {leaveType.dureeMinJours || 1} - {leaveType.dureeMaxJours || '∞'} {intl.formatMessage({ id: 'hr.leaveTypes.days', defaultMessage: 'jour(s)' })}
          </p>
        </div>
      </div>
    </div>
  );
}

// Leave Type Form Dialog
function LeaveTypeFormDialog({ isOpen, onClose, leaveType, onSubmit, saving, intl }) {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    joursParDefaut: 0,
    estPaye: true,
    estDeductible: true,
    requiertJustificatif: false,
    delaiMinDemande: 0,
    dureeMinJours: 1,
    dureeMaxJours: '',
    genreApplicable: 'tous',
    couleur: '#1976d2',
    icone: 'Event',
    ordre: 0,
    actif: true,
  });

  useEffect(() => {
    if (leaveType) {
      setFormData({
        code: leaveType.code || '',
        nom: leaveType.nom || '',
        description: leaveType.description || '',
        joursParDefaut: leaveType.joursParDefaut || 0,
        estPaye: leaveType.estPaye !== false,
        estDeductible: leaveType.estDeductible !== false,
        requiertJustificatif: leaveType.requiertJustificatif === true,
        delaiMinDemande: leaveType.delaiMinDemande || 0,
        dureeMinJours: leaveType.dureeMinJours || 1,
        dureeMaxJours: leaveType.dureeMaxJours || '',
        genreApplicable: leaveType.genreApplicable || 'tous',
        couleur: leaveType.couleur || '#1976d2',
        icone: leaveType.icone || 'Event',
        ordre: leaveType.ordre || 0,
        actif: leaveType.actif !== false,
      });
    }
  }, [leaveType]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nom.trim()) {
      Swal.fire({
        icon: 'warning',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.leaveTypes.nameRequired', defaultMessage: 'Le nom est obligatoire' }),
      });
      return;
    }
    onSubmit({
      ...formData,
      dureeMaxJours: formData.dureeMaxJours === '' ? null : parseInt(formData.dureeMaxJours),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {leaveType?.id
                ? intl.formatMessage({ id: 'hr.leaveTypes.edit', defaultMessage: 'Modifier le type de conge' })
                : intl.formatMessage({ id: 'hr.leaveTypes.new', defaultMessage: 'Nouveau type de conge' })}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Code and Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.code', defaultMessage: 'Code' })}
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.name', defaultMessage: 'Nom' })} *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.leaveTypes.description', defaultMessage: 'Description' })}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Days settings */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.defaultDays', defaultMessage: 'Jours par defaut/an' })}
              </label>
              <input
                type="number"
                value={formData.joursParDefaut}
                onChange={(e) => handleChange('joursParDefaut', parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.minDuration', defaultMessage: 'Duree min (jours)' })}
              </label>
              <input
                type="number"
                value={formData.dureeMinJours}
                onChange={(e) => handleChange('dureeMinJours', parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.maxDuration', defaultMessage: 'Duree max (jours)' })}
              </label>
              <input
                type="number"
                value={formData.dureeMaxJours}
                onChange={(e) => handleChange('dureeMaxJours', e.target.value)}
                placeholder={intl.formatMessage({ id: 'hr.leaveTypes.unlimited', defaultMessage: 'Illimite' })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Delay, Genre, Icon */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.minRequestDelay', defaultMessage: 'Delai min demande (j)' })}
              </label>
              <input
                type="number"
                value={formData.delaiMinDemande}
                onChange={(e) => handleChange('delaiMinDemande', parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.applicableGender', defaultMessage: 'Genre applicable' })}
              </label>
              <select
                value={formData.genreApplicable}
                onChange={(e) => handleChange('genreApplicable', e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="tous">{intl.formatMessage({ id: 'hr.leaveTypes.all', defaultMessage: 'Tous' })}</option>
                <option value="M">{intl.formatMessage({ id: 'hr.leaveTypes.menOnly', defaultMessage: 'Hommes uniquement' })}</option>
                <option value="F">{intl.formatMessage({ id: 'hr.leaveTypes.womenOnly', defaultMessage: 'Femmes uniquement' })}</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.icon', defaultMessage: 'Icone' })}
              </label>
              <select
                value={formData.icone}
                onChange={(e) => handleChange('icone', e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color and Order */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.color', defaultMessage: 'Couleur' })}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.couleur}
                  onChange={(e) => handleChange('couleur', e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-gray-200 p-1"
                />
                <input
                  type="text"
                  value={formData.couleur}
                  onChange={(e) => handleChange('couleur', e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.displayOrder', defaultMessage: 'Ordre d\'affichage' })}
              </label>
              <input
                type="number"
                value={formData.ordre}
                onChange={(e) => handleChange('ordre', parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <input
                type="checkbox"
                checked={formData.estPaye}
                onChange={(e) => handleChange('estPaye', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.paidLeave', defaultMessage: 'Conge paye' })}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <input
                type="checkbox"
                checked={formData.estDeductible}
                onChange={(e) => handleChange('estDeductible', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.deductible', defaultMessage: 'Deductible' })}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <input
                type="checkbox"
                checked={formData.requiertJustificatif}
                onChange={(e) => handleChange('requiertJustificatif', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.requiresJustification', defaultMessage: 'Justificatif requis' })}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <input
                type="checkbox"
                checked={formData.actif}
                onChange={(e) => handleChange('actif', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0A1628] focus:ring-[#D4A853]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaveTypes.active', defaultMessage: 'Actif' })}
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#0A1628] px-4 py-2.5 font-medium text-white hover:bg-[#0A1628]/90 disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {intl.formatMessage({ id: 'common.save', defaultMessage: 'Enregistrer' })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeaveTypesPage() {
  const intl = useIntl();

  // States
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load leave types
  const loadLeaveTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLeaveTypes({ search: searchQuery });
      if (response.success) {
        setLeaveTypes(response.data || []);
      }
    } catch (error) {
      console.error('Error loading leave types:', error);
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.leaveTypes.loadError', defaultMessage: 'Impossible de charger les types de conges' }),
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, intl]);

  useEffect(() => {
    loadLeaveTypes();
  }, [loadLeaveTypes]);

  // Handle add
  const handleAdd = async () => {
    try {
      const response = await generateLeaveTypeCode();
      setEditingType({
        code: response.data?.code || '',
        nom: '',
        description: '',
        joursParDefaut: 0,
        estPaye: true,
        estDeductible: true,
        requiertJustificatif: false,
        delaiMinDemande: 0,
        dureeMinJours: 1,
        dureeMaxJours: '',
        genreApplicable: 'tous',
        couleur: '#1976d2',
        icone: 'Event',
        ordre: leaveTypes.length,
        actif: true,
      });
      setDialogOpen(true);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  // Handle edit
  const handleEdit = (leaveType) => {
    setEditingType(leaveType);
    setDialogOpen(true);
  };

  // Handle save
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      let response;
      if (editingType?.id) {
        response = await updateLeaveType(editingType.id, formData);
      } else {
        response = await createLeaveType(formData);
      }

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: editingType?.id
            ? intl.formatMessage({ id: 'hr.leaveTypes.updated', defaultMessage: 'Modifie!' })
            : intl.formatMessage({ id: 'hr.leaveTypes.created', defaultMessage: 'Cree!' }),
          text: response.message,
          timer: 2000,
          showConfirmButton: false,
        });
        setDialogOpen(false);
        setEditingType(null);
        loadLeaveTypes();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message || intl.formatMessage({ id: 'hr.leaveTypes.saveError', defaultMessage: 'Une erreur est survenue' }),
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (leaveType) => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaveTypes.deleteConfirm', defaultMessage: 'Supprimer ce type de conge?' }),
      html: `${intl.formatMessage({ id: 'hr.leaveTypes.deleteConfirmText', defaultMessage: 'Voulez-vous vraiment supprimer' })} <strong>${leaveType.nom}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: intl.formatMessage({ id: 'common.yesDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteLeaveType(leaveType.id);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprime!' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaveTypes();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaveTypes.deleteError', defaultMessage: 'Impossible de supprimer' }),
        });
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (leaveType) => {
    try {
      const response = await toggleLeaveTypeStatus(leaveType.id);
      if (response.success) {
        loadLeaveTypes();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Handle init defaults
  const handleInitDefaults = async () => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaveTypes.initDefaults', defaultMessage: 'Initialiser les types par defaut?' }),
      text: intl.formatMessage({ id: 'hr.leaveTypes.initDefaultsText', defaultMessage: 'Cette action va creer les types de conges standards (Annuel, Maladie, Maternite, etc.)' }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'hr.leaveTypes.yesInit', defaultMessage: 'Oui, initialiser' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await initDefaultLeaveTypes();
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'hr.leaveTypes.initialized', defaultMessage: 'Initialise!' }),
            text: response.message,
            timer: 3000,
          });
          loadLeaveTypes();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: intl.formatMessage({ id: 'hr.leaveTypes.initError', defaultMessage: 'Impossible d\'initialiser' }),
        });
      }
    }
  };

  // Stats
  const stats = {
    total: leaveTypes.length,
    actifs: leaveTypes.filter((t) => t.actif).length,
    payes: leaveTypes.filter((t) => t.estPaye).length,
    nonPayes: leaveTypes.filter((t) => !t.estPaye).length,
  };

  // Stats config
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.leaveTypes.totalTypes', defaultMessage: 'Total Types' }),
      value: stats.total,
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaveTypes.activeTypes', defaultMessage: 'Types Actifs' }),
      value: stats.actifs,
      icon: CheckCircle,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaveTypes.paidLeaves', defaultMessage: 'Conges Payes' }),
      value: stats.payes,
      icon: Umbrella,
      bgClass: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaveTypes.unpaidLeaves', defaultMessage: 'Non Payes' }),
      value: stats.nonPayes,
      icon: DollarOff,
      bgClass: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.leaveTypes.title', defaultMessage: 'Types de Conges' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.leaveTypes.subtitle', defaultMessage: 'Configuration des types de conges disponibles' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadLeaveTypes}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title={intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleInitDefaults}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.leaveTypes.initDefaults', defaultMessage: 'Initialiser defauts' })}</span>
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Plus className="h-4 w-4" />
            <span>{intl.formatMessage({ id: 'hr.leaveTypes.add', defaultMessage: 'Ajouter' })}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={intl.formatMessage({ id: 'hr.leaveTypes.search', defaultMessage: 'Rechercher un type de conge...' })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Leave Types Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
        </div>
      ) : leaveTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {intl.formatMessage({ id: 'hr.leaveTypes.noTypes', defaultMessage: 'Aucun type de conge configure' })}
          </h3>
          <button
            onClick={handleInitDefaults}
            className="mt-4 flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Palette className="h-4 w-4" />
            {intl.formatMessage({ id: 'hr.leaveTypes.initDefaults', defaultMessage: 'Initialiser les types par defaut' })}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leaveTypes.map((leaveType) => (
            <LeaveTypeCard
              key={leaveType.id}
              leaveType={leaveType}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              intl={intl}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <LeaveTypeFormDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingType(null);
        }}
        leaveType={editingType}
        onSubmit={handleSave}
        saving={saving}
        intl={intl}
      />
    </div>
  );
}
