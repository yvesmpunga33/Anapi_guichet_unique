'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/contexts/LanguageContext';
import Swal from 'sweetalert2';

import {
  ArrowLeft,
  Save,
  X,
  User,
  Briefcase,
  MapPin,
  CreditCard,
  Phone,
  Camera,
  Calendar,
  Shield,
  Heart,
  Upload,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  Loader2,
  Building2,
  Award,
  Layers,
  FileText,
} from 'lucide-react';

import { createEmployee, uploadEmployeePhoto } from '@/app/services/hr';
import { getDepartments, createDepartment } from '@/app/services/hr/departmentService';
import { getPositions, createPosition } from '@/app/services/hr/positionService';
import { getGrades, createGrade } from '@/app/services/hr/gradeService';
import { getCategories, createCategory } from '@/app/services/hr/categoryService';
import { getContractTypes, createContractType } from '@/app/services/hr/contractTypeService';

// Form Section Component
function FormSection({ icon: Icon, title, color = 'text-[#0A1628]', children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-center gap-3">
          <div className={`rounded-lg bg-gray-100 p-2 dark:bg-gray-700 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="border-t border-gray-200 p-6 dark:border-gray-700">{children}</div>}
    </div>
  );
}

// Form Input Component
function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 focus:border-[#D4A853] focus:ring-[#D4A853]/20 dark:border-gray-600'
        } ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Form Select Component
function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 focus:border-[#D4A853] focus:ring-[#D4A853]/20 dark:border-gray-600'
        } ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        <option value="">{placeholder || `-- Selectionner --`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Form Select with Add Button Component
function FormSelectWithAdd({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  onAddClick,
  addButtonTitle = 'Ajouter',
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`flex-1 rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-[#D4A853] focus:ring-[#D4A853]/20 dark:border-gray-600'
          } ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <option value="">{placeholder || `-- Selectionner --`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center justify-center rounded-lg bg-[#D4A853] px-3 py-2.5 text-white transition-colors hover:bg-[#D4A853]/90"
          title={addButtonTitle}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Quick Add Modal Component - Adapté à chaque type
function QuickAddModal({ open, onClose, onSave, type, icon: Icon, title, loading }) {
  const intl = useIntl();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  // Initialiser le formulaire selon le type
  useEffect(() => {
    if (open) {
      switch (type) {
        case 'department':
          setFormData({ code: '', nom: '', description: '', budget: '', couleur: '#667eea' });
          break;
        case 'position':
          setFormData({ code: '', title: '', description: '', workDaysPerWeek: 5, workHoursPerDay: 8 });
          break;
        case 'grade':
          setFormData({ code: '', nom: '', description: '', niveau: 10, salaire_min: '', salaire_max: '', couleur: '#667eea' });
          break;
        case 'category':
          setFormData({ code: '', nom: '', description: '', salaire_type: 'mensuel' });
          break;
        case 'contractType':
          setFormData({ code: '', name: '', description: '', defaultDuration: '' });
          break;
        default:
          setFormData({ code: '', nom: '', description: '' });
      }
      setError('');
    }
  }, [open, type]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation selon le type
    const nameField = type === 'position' ? 'title' : type === 'contractType' ? 'name' : 'nom';
    if (!formData[nameField]?.trim()) {
      setError(intl.formatMessage({ id: 'common.nameRequired', defaultMessage: 'Le nom est requis' }));
      return;
    }
    setError('');
    await onSave(formData);
  };

  if (!open) return null;

  // Rendu des champs spécifiques selon le type
  const renderFields = () => {
    const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
    const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

    switch (type) {
      case 'department':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="DEP-001"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Couleur</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.couleur || '#667eea'}
                    onChange={(e) => handleChange('couleur', e.target.value)}
                    className="h-[42px] w-16 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.couleur || '#667eea'}
                    onChange={(e) => handleChange('couleur', e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Nom du departement <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.nom || ''}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Ex: Direction Generale"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Budget annuel (USD)</label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder="Ex: 50000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du departement..."
                rows={2}
                className={inputClass}
              />
            </div>
          </>
        );

      case 'position':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="POS-001"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Titre du poste <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ex: Directeur Technique"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jours/semaine</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.workDaysPerWeek || 5}
                  onChange={(e) => handleChange('workDaysPerWeek', parseInt(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Heures/jour</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formData.workHoursPerDay || 8}
                  onChange={(e) => handleChange('workHoursPerDay', parseInt(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Responsabilites du poste..."
                rows={2}
                className={inputClass}
              />
            </div>
          </>
        );

      case 'grade':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="GRD-001"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Niveau</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.niveau || 10}
                  onChange={(e) => handleChange('niveau', parseInt(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Nom du grade <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.nom || ''}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Ex: Cadre Superieur"
                required
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Salaire min (USD)</label>
                <input
                  type="number"
                  value={formData.salaire_min || ''}
                  onChange={(e) => handleChange('salaire_min', e.target.value)}
                  placeholder="1000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Salaire max (USD)</label>
                <input
                  type="number"
                  value={formData.salaire_max || ''}
                  onChange={(e) => handleChange('salaire_max', e.target.value)}
                  placeholder="5000"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Couleur</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.couleur || '#667eea'}
                    onChange={(e) => handleChange('couleur', e.target.value)}
                    className="h-[42px] w-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.couleur || '#667eea'}
                    onChange={(e) => handleChange('couleur', e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du grade..."
                rows={2}
                className={inputClass}
              />
            </div>
          </>
        );

      case 'category':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="CAT-001"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Type de salaire</label>
                <select
                  value={formData.salaire_type || 'mensuel'}
                  onChange={(e) => handleChange('salaire_type', e.target.value)}
                  className={inputClass}
                >
                  <option value="mensuel">Mensuel</option>
                  <option value="journalier">Journalier</option>
                  <option value="horaire">Horaire</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Nom de la categorie <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.nom || ''}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Ex: Cadre"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description de la categorie..."
                rows={2}
                className={inputClass}
              />
            </div>
          </>
        );

      case 'contractType':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="CDI"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Duree par defaut (mois)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.defaultDuration || ''}
                  onChange={(e) => handleChange('defaultDuration', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="12 (vide = indetermine)"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Nom du type de contrat <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Contrat a Duree Indeterminee"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du type de contrat..."
                rows={2}
                className={inputClass}
              />
            </div>
          </>
        );

      default:
        return (
          <>
            <div>
              <label className={labelClass}>Code</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                placeholder="CODE-001"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Nom <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.nom || ''}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Nom..."
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description..."
                rows={2}
                className={inputClass}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="sticky top-0 flex items-center gap-3 border-b border-gray-200 p-6 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A1628]">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.employees.quickAdd', defaultMessage: 'Ajout rapide' })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {renderFields()}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#D4A853] px-4 py-2.5 text-white transition-colors hover:bg-[#D4A853]/90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {intl.formatMessage({ id: 'common.create', defaultMessage: 'Creer' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Form Textarea Component
function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 3,
  className = '',
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 focus:border-[#D4A853] focus:ring-[#D4A853]/20 dark:border-gray-600'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Initial form state
const initialFormData = {
  // Personal Information
  matricule: '',
  nom: '',
  postnom: '',
  prenom: '',
  genre: '',
  dateNaissance: '',
  lieuNaissance: '',
  nationalite: 'Congolaise',
  numeroIdentite: '',
  numeroPasseport: '',
  numeroINSS: '',
  // Marital Status
  etatCivil: '',
  nomConjoint: '',
  telephoneConjoint: '',
  professionConjoint: '',
  nombreEnfants: 0,
  // Contact Information
  email: '',
  telephone1: '',
  telephone2: '',
  adresse: '',
  commune: '',
  ville: '',
  province: '',
  // Professional Information
  departement: '',
  poste: '',
  grade: '',
  categorie: '',
  typeContrat: '',
  dateEmbauche: '',
  dateFinContrat: '',
  salaireBase: '',
  salaireDevise: 'USD',
  statut: 'Actif',
  // Bank Information
  banque: '',
  numeroBanque: '',
  numeroCompte: '',
  // Emergency Contact
  nomUrgence: '',
  lienUrgence: '',
  telephoneUrgence: '',
  emailUrgence: '',
};

export default function NewEmployeePage() {
  const router = useRouter();
  const intl = useIntl();
  const { locale } = useLanguage();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [configs, setConfigs] = useState({
    departements: [],
    postes: [],
    grades: [],
    categories: [],
    typesContrat: [],
    statuts: [],
    banques: [],
    liensParente: [],
  });
  // Store full category objects to access salaire_base and salaire_devise
  const [categoriesData, setCategoriesData] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

  // Quick Add Modal states
  const [quickAddModal, setQuickAddModal] = useState({ open: false, type: null });
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  // Load configurations
  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setConfigLoading(true);

      // Load all configurations in parallel
      const [deptsRes, positionsRes, gradesRes, categoriesRes, contractTypesRes] = await Promise.all([
        getDepartments({ limit: 100 }),
        getPositions({ limit: 100 }),
        getGrades({ limit: 100 }),
        getCategories({ limit: 100 }),
        getContractTypes({ limit: 100 }),
      ]);

      // Transform data for select options
      const transformToOptions = (items, labelKey = 'nom', valueKey = 'id') => {
        if (!items || !Array.isArray(items)) return [];
        return items.map(item => ({
          value: item[valueKey] || item.id,
          label: item[labelKey] || item.name || item.title || item.nom,
        }));
      };

      // Store full categories data for salary lookup
      const categoriesRawData = categoriesRes?.data?.categories || categoriesRes?.data || [];
      setCategoriesData(Array.isArray(categoriesRawData) ? categoriesRawData : []);

      setConfigs({
        departements: transformToOptions(deptsRes?.data?.departments || deptsRes?.data || [], 'nom', 'id'),
        postes: transformToOptions(positionsRes?.data?.positions || positionsRes?.data || [], 'title', 'id'),
        grades: transformToOptions(gradesRes?.data?.grades || gradesRes?.data || [], 'nom', 'id'),
        categories: transformToOptions(categoriesRawData, 'nom', 'id'),
        typesContrat: transformToOptions(contractTypesRes?.data?.contractTypes || contractTypesRes?.data || [], 'name', 'code'),
        statuts: [],
        banques: [],
        liensParente: [],
      });
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setConfigLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle category change - auto-fill salary from category configuration
    if (name === 'categorie' && value) {
      const selectedCategory = categoriesData.find(cat =>
        cat.id === value || cat.id === parseInt(value) || String(cat.id) === value
      );
      if (selectedCategory) {
        const salaryValue = selectedCategory.salaire_base || selectedCategory.salaireBase || selectedCategory.baseSalary || '';
        const currencyValue = selectedCategory.salaire_devise || selectedCategory.salaireDevise || selectedCategory.currency || 'USD';
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          salaireBase: salaryValue,
          salaireDevise: currencyValue,
        }));
        // Clear errors
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: null, salaireBase: null }));
        }
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.employees.invalidImageType', defaultMessage: 'Veuillez selectionner une image valide' }),
        icon: 'error',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.employees.imageTooLarge', defaultMessage: "L'image ne doit pas depasser 5MB" }),
        icon: 'error',
      });
      return;
    }

    setPhoto(file);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.nom?.trim()) {
      newErrors.nom = intl.formatMessage({ id: 'hr.employees.errors.nomRequired', defaultMessage: 'Le nom est requis' });
    }
    if (!formData.prenom?.trim()) {
      newErrors.prenom = intl.formatMessage({ id: 'hr.employees.errors.prenomRequired', defaultMessage: 'Le prenom est requis' });
    }
    if (!formData.genre) {
      newErrors.genre = intl.formatMessage({ id: 'hr.employees.errors.genreRequired', defaultMessage: 'Le genre est requis' });
    }
    if (!formData.dateEmbauche) {
      newErrors.dateEmbauche = intl.formatMessage({ id: 'hr.employees.errors.dateEmbaucheRequired', defaultMessage: "La date d'embauche est requise" });
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = intl.formatMessage({ id: 'hr.employees.errors.invalidEmail', defaultMessage: 'Email invalide' });
    }

    // Phone validation
    if (formData.telephone1 && !/^[\d\s+()-]{8,}$/.test(formData.telephone1)) {
      newErrors.telephone1 = intl.formatMessage({ id: 'hr.employees.errors.invalidPhone', defaultMessage: 'Numero de telephone invalide' });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.employees.errors.formInvalid', defaultMessage: 'Veuillez corriger les erreurs dans le formulaire' }),
        icon: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare data
      const submitData = {
        ...formData,
        salaireBase: formData.salaireBase ? parseFloat(formData.salaireBase) : null,
        nombreEnfants: parseInt(formData.nombreEnfants) || 0,
      };

      const response = await createEmployee(submitData);

      if (response.success) {
        const employeeId = response.data?.id;

        // Upload photo if selected
        if (photo && employeeId) {
          try {
            await uploadEmployeePhoto(employeeId, photo);
          } catch (photoError) {
            console.error('Error uploading photo:', photoError);
            // Continue anyway, photo upload is not critical
          }
        }

        Swal.fire({
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'hr.employees.createSuccess', defaultMessage: 'Employe cree avec succes' }),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/hr/employees/${employeeId}`);
        });
      } else {
        throw new Error(response.message || 'Creation failed');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message || intl.formatMessage({ id: 'hr.employees.createError', defaultMessage: "Impossible de creer l'employe" }),
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: intl.formatMessage({ id: 'hr.employees.resetConfirmTitle', defaultMessage: 'Reinitialiser le formulaire?' }),
      text: intl.formatMessage({ id: 'hr.employees.resetConfirmMessage', defaultMessage: 'Toutes les donnees saisies seront perdues.' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0A1628',
      confirmButtonText: intl.formatMessage({ id: 'common.confirm', defaultMessage: 'Oui, reinitialiser' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(initialFormData);
        setErrors({});
        removePhoto();
      }
    });
  };

  // Quick Add handlers
  const openQuickAddModal = (type) => {
    setQuickAddModal({ open: true, type });
  };

  const closeQuickAddModal = () => {
    setQuickAddModal({ open: false, type: null });
  };

  const handleQuickAdd = async (data) => {
    setQuickAddLoading(true);
    try {
      let response;
      const { type } = quickAddModal;

      switch (type) {
        case 'department':
          response = await createDepartment({ code: data.code, nom: data.nom, description: data.description });
          break;
        case 'position':
          response = await createPosition({ code: data.code, title: data.nom, description: data.description });
          break;
        case 'grade':
          response = await createGrade({ code: data.code, nom: data.nom, description: data.description });
          break;
        case 'category':
          response = await createCategory({ code: data.code, nom: data.nom, description: data.description });
          break;
        case 'contractType':
          response = await createContractType({ code: data.code, name: data.nom, description: data.description });
          break;
        default:
          throw new Error('Type inconnu');
      }

      if (response.success) {
        Swal.fire({
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'hr.employees.quickAddSuccess', defaultMessage: 'Element ajoute avec succes' }),
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        closeQuickAddModal();
        // Reload configs to include the new item
        await loadConfigs();
      } else {
        throw new Error(response.message || 'Erreur lors de la creation');
      }
    } catch (error) {
      console.error('Error in quick add:', error);
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message || intl.formatMessage({ id: 'hr.employees.quickAddError', defaultMessage: 'Impossible de creer l\'element' }),
        icon: 'error',
      });
    } finally {
      setQuickAddLoading(false);
    }
  };

  // Get modal config based on type
  const getModalConfig = () => {
    switch (quickAddModal.type) {
      case 'department':
        return { icon: Building2, title: intl.formatMessage({ id: 'hr.employees.addDepartment', defaultMessage: 'Nouveau Departement' }) };
      case 'position':
        return { icon: Briefcase, title: intl.formatMessage({ id: 'hr.employees.addPosition', defaultMessage: 'Nouveau Poste' }) };
      case 'grade':
        return { icon: Award, title: intl.formatMessage({ id: 'hr.employees.addGrade', defaultMessage: 'Nouveau Grade' }) };
      case 'category':
        return { icon: Layers, title: intl.formatMessage({ id: 'hr.employees.addCategory', defaultMessage: 'Nouvelle Categorie' }) };
      case 'contractType':
        return { icon: FileText, title: intl.formatMessage({ id: 'hr.employees.addContractType', defaultMessage: 'Nouveau Type de Contrat' }) };
      default:
        return { icon: Plus, title: 'Ajouter' };
    }
  };

  // Gender options
  const genderOptions = [
    { value: 'M', label: intl.formatMessage({ id: 'hr.employees.male', defaultMessage: 'Masculin' }) },
    { value: 'F', label: intl.formatMessage({ id: 'hr.employees.female', defaultMessage: 'Feminin' }) },
  ];

  // Marital status options
  const maritalStatusOptions = [
    { value: 'celibataire', label: intl.formatMessage({ id: 'hr.employees.marital.single', defaultMessage: 'Celibataire' }) },
    { value: 'marie', label: intl.formatMessage({ id: 'hr.employees.marital.married', defaultMessage: 'Marie(e)' }) },
    { value: 'divorce', label: intl.formatMessage({ id: 'hr.employees.marital.divorced', defaultMessage: 'Divorce(e)' }) },
    { value: 'veuf', label: intl.formatMessage({ id: 'hr.employees.marital.widowed', defaultMessage: 'Veuf/Veuve' }) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/hr/employees"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.employees.newEmployee', defaultMessage: 'Nouvel Employe' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.employees.newEmployeeSubtitle', defaultMessage: 'Remplissez les informations pour creer un nouvel employe' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.reset', defaultMessage: 'Reinitialiser' })}</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white transition-colors hover:bg-[#0A1628]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.save', defaultMessage: 'Enregistrer' })}</span>
          </button>
        </div>
      </div>

      {configLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="group relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {intl.formatMessage({ id: 'hr.employees.employeePhoto', defaultMessage: "Photo de l'employe" })}
                </h4>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: 'hr.employees.photoHint', defaultMessage: 'JPG, PNG. Max 5MB.' })}
                </p>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-[#D4A853] px-4 py-2 text-[#D4A853] transition-colors hover:bg-[#D4A853]/10"
                >
                  <Upload className="h-4 w-4" />
                  {intl.formatMessage({ id: 'hr.employees.selectPhoto', defaultMessage: 'Choisir une photo' })}
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <FormSection
            icon={User}
            title={intl.formatMessage({ id: 'hr.employees.personalInfo', defaultMessage: 'Informations Personnelles' })}
            color="text-[#0A1628]"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.matricule', defaultMessage: 'Matricule' })}
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder={intl.formatMessage({ id: 'hr.employees.matriculePlaceholder', defaultMessage: 'Auto-genere si vide' })}
                error={errors.matricule}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.lastName', defaultMessage: 'Nom' })}
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                error={errors.nom}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.middleName', defaultMessage: 'Post-nom' })}
                name="postnom"
                value={formData.postnom}
                onChange={handleChange}
                error={errors.postnom}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.firstName', defaultMessage: 'Prenom' })}
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                error={errors.prenom}
              />
              <FormSelect
                label={intl.formatMessage({ id: 'hr.employees.gender', defaultMessage: 'Sexe' })}
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                options={genderOptions}
                required
                error={errors.genre}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.birthDate', defaultMessage: 'Date de naissance' })}
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleChange}
                error={errors.dateNaissance}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.birthPlace', defaultMessage: 'Lieu de naissance' })}
                name="lieuNaissance"
                value={formData.lieuNaissance}
                onChange={handleChange}
                error={errors.lieuNaissance}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.nationality', defaultMessage: 'Nationalite' })}
                name="nationalite"
                value={formData.nationalite}
                onChange={handleChange}
                error={errors.nationalite}
              />
            </div>
          </FormSection>

          {/* Identity Documents */}
          <FormSection
            icon={Shield}
            title={intl.formatMessage({ id: 'hr.employees.identityDocuments', defaultMessage: "Documents d'Identite" })}
            color="text-purple-600"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.idNumber', defaultMessage: "N Carte d'identite" })}
                name="numeroIdentite"
                value={formData.numeroIdentite}
                onChange={handleChange}
                error={errors.numeroIdentite}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.passportNumber', defaultMessage: 'N Passeport' })}
                name="numeroPasseport"
                value={formData.numeroPasseport}
                onChange={handleChange}
                error={errors.numeroPasseport}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.socialSecurityNumber', defaultMessage: 'N INSS' })}
                name="numeroINSS"
                value={formData.numeroINSS}
                onChange={handleChange}
                error={errors.numeroINSS}
              />
            </div>
          </FormSection>

          {/* Marital Status */}
          <FormSection
            icon={Heart}
            title={intl.formatMessage({ id: 'hr.employees.maritalStatus', defaultMessage: 'Etat Civil' })}
            color="text-pink-600"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormSelect
                label={intl.formatMessage({ id: 'hr.employees.civilStatus', defaultMessage: 'Etat civil' })}
                name="etatCivil"
                value={formData.etatCivil}
                onChange={handleChange}
                options={maritalStatusOptions}
                error={errors.etatCivil}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.spouseName', defaultMessage: 'Nom du conjoint' })}
                name="nomConjoint"
                value={formData.nomConjoint}
                onChange={handleChange}
                error={errors.nomConjoint}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.spousePhone', defaultMessage: 'Telephone conjoint' })}
                name="telephoneConjoint"
                value={formData.telephoneConjoint}
                onChange={handleChange}
                error={errors.telephoneConjoint}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.spouseProfession', defaultMessage: 'Profession conjoint' })}
                name="professionConjoint"
                value={formData.professionConjoint}
                onChange={handleChange}
                error={errors.professionConjoint}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.childrenCount', defaultMessage: "Nombre d'enfants" })}
                name="nombreEnfants"
                type="number"
                value={formData.nombreEnfants}
                onChange={handleChange}
                error={errors.nombreEnfants}
              />
            </div>
          </FormSection>

          {/* Contact Information */}
          <FormSection
            icon={MapPin}
            title={intl.formatMessage({ id: 'hr.employees.contactInfo', defaultMessage: 'Coordonnees' })}
            color="text-green-600"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.email', defaultMessage: 'Email' })}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.phone1', defaultMessage: 'Telephone 1' })}
                name="telephone1"
                value={formData.telephone1}
                onChange={handleChange}
                error={errors.telephone1}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.phone2', defaultMessage: 'Telephone 2' })}
                name="telephone2"
                value={formData.telephone2}
                onChange={handleChange}
                error={errors.telephone2}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.address', defaultMessage: 'Adresse' })}
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                error={errors.adresse}
                className="lg:col-span-2"
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.commune', defaultMessage: 'Commune' })}
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                error={errors.commune}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.city', defaultMessage: 'Ville' })}
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                error={errors.ville}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.province', defaultMessage: 'Province' })}
                name="province"
                value={formData.province}
                onChange={handleChange}
                error={errors.province}
              />
            </div>
          </FormSection>

          {/* Professional Information */}
          <FormSection
            icon={Briefcase}
            title={intl.formatMessage({ id: 'hr.employees.professionalInfo', defaultMessage: 'Informations Professionnelles' })}
            color="text-blue-600"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormSelectWithAdd
                label={intl.formatMessage({ id: 'hr.employees.department', defaultMessage: 'Departement' })}
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                options={configs.departements}
                error={errors.departement}
                onAddClick={() => openQuickAddModal('department')}
                addButtonTitle={intl.formatMessage({ id: 'hr.employees.addDepartment', defaultMessage: 'Ajouter un departement' })}
              />
              <FormSelectWithAdd
                label={intl.formatMessage({ id: 'hr.employees.position', defaultMessage: 'Poste' })}
                name="poste"
                value={formData.poste}
                onChange={handleChange}
                options={configs.postes}
                error={errors.poste}
                onAddClick={() => openQuickAddModal('position')}
                addButtonTitle={intl.formatMessage({ id: 'hr.employees.addPosition', defaultMessage: 'Ajouter un poste' })}
              />
              <FormSelectWithAdd
                label={intl.formatMessage({ id: 'hr.employees.grade', defaultMessage: 'Grade' })}
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                options={configs.grades}
                error={errors.grade}
                onAddClick={() => openQuickAddModal('grade')}
                addButtonTitle={intl.formatMessage({ id: 'hr.employees.addGrade', defaultMessage: 'Ajouter un grade' })}
              />
              <FormSelectWithAdd
                label={intl.formatMessage({ id: 'hr.employees.category', defaultMessage: 'Categorie' })}
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                options={configs.categories}
                error={errors.categorie}
                onAddClick={() => openQuickAddModal('category')}
                addButtonTitle={intl.formatMessage({ id: 'hr.employees.addCategory', defaultMessage: 'Ajouter une categorie' })}
              />
              <FormSelectWithAdd
                label={intl.formatMessage({ id: 'hr.employees.contractType', defaultMessage: 'Type de contrat' })}
                name="typeContrat"
                value={formData.typeContrat}
                onChange={handleChange}
                options={configs.typesContrat}
                error={errors.typeContrat}
                onAddClick={() => openQuickAddModal('contractType')}
                addButtonTitle={intl.formatMessage({ id: 'hr.employees.addContractType', defaultMessage: 'Ajouter un type de contrat' })}
              />
              <FormSelect
                label={intl.formatMessage({ id: 'hr.employees.status', defaultMessage: 'Statut' })}
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                options={configs.statuts.length > 0 ? configs.statuts : [
                  { value: 'Actif', label: 'Actif' },
                  { value: 'Inactif', label: 'Inactif' },
                  { value: 'En congé', label: 'En congé' },
                  { value: 'Suspendu', label: 'Suspendu' },
                ]}
                error={errors.statut}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.hireDate', defaultMessage: "Date d'embauche" })}
                name="dateEmbauche"
                type="date"
                value={formData.dateEmbauche}
                onChange={handleChange}
                required
                error={errors.dateEmbauche}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.contractEndDate', defaultMessage: 'Date fin contrat' })}
                name="dateFinContrat"
                type="date"
                value={formData.dateFinContrat}
                onChange={handleChange}
                error={errors.dateFinContrat}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.baseSalary', defaultMessage: 'Salaire de base' })}
                  {formData.salaireDevise && <span className="ml-1 text-gray-500">({formData.salaireDevise})</span>}
                </label>
                <input
                  type="number"
                  name="salaireBase"
                  value={formData.salaireBase}
                  readOnly
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-600 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: 'hr.employees.salaryFromCategory', defaultMessage: 'Le salaire est defini par la categorie selectionnee' })}
                </p>
              </div>
            </div>
          </FormSection>

          {/* Bank Information */}
          <FormSection
            icon={CreditCard}
            title={intl.formatMessage({ id: 'hr.employees.bankInfo', defaultMessage: 'Informations Bancaires' })}
            color="text-amber-600"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormSelect
                label={intl.formatMessage({ id: 'hr.employees.bank', defaultMessage: 'Banque' })}
                name="banque"
                value={formData.banque}
                onChange={handleChange}
                options={configs.banques}
                error={errors.banque}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.bankCode', defaultMessage: 'Code banque' })}
                name="numeroBanque"
                value={formData.numeroBanque}
                onChange={handleChange}
                error={errors.numeroBanque}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.accountNumber', defaultMessage: 'Numero de compte' })}
                name="numeroCompte"
                value={formData.numeroCompte}
                onChange={handleChange}
                error={errors.numeroCompte}
              />
            </div>
          </FormSection>

          {/* Emergency Contact */}
          <FormSection
            icon={AlertCircle}
            title={intl.formatMessage({ id: 'hr.employees.emergencyContact', defaultMessage: "Contact d'Urgence" })}
            color="text-red-600"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.contactName', defaultMessage: 'Nom complet' })}
                name="nomUrgence"
                value={formData.nomUrgence}
                onChange={handleChange}
                error={errors.nomUrgence}
              />
              <FormSelect
                label={intl.formatMessage({ id: 'hr.employees.relationship', defaultMessage: 'Lien de parente' })}
                name="lienUrgence"
                value={formData.lienUrgence}
                onChange={handleChange}
                options={configs.liensParente.length > 0 ? configs.liensParente : [
                  { value: 'Conjoint(e)', label: 'Conjoint(e)' },
                  { value: 'Pere', label: 'Pere' },
                  { value: 'Mere', label: 'Mere' },
                  { value: 'Frere', label: 'Frere' },
                  { value: 'Soeur', label: 'Soeur' },
                  { value: 'Enfant', label: 'Enfant' },
                  { value: 'Ami(e)', label: 'Ami(e)' },
                  { value: 'Autre', label: 'Autre' },
                ]}
                error={errors.lienUrgence}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.phone', defaultMessage: 'Telephone' })}
                name="telephoneUrgence"
                value={formData.telephoneUrgence}
                onChange={handleChange}
                error={errors.telephoneUrgence}
              />
              <FormInput
                label={intl.formatMessage({ id: 'hr.employees.email', defaultMessage: 'Email' })}
                name="emailUrgence"
                type="email"
                value={formData.emailUrgence}
                onChange={handleChange}
                error={errors.emailUrgence}
              />
            </div>
          </FormSection>

          {/* Action Buttons (Mobile) */}
          <div className="flex items-center justify-end gap-3 sm:hidden">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {intl.formatMessage({ id: 'common.reset', defaultMessage: 'Reinitialiser' })}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0A1628] px-4 py-3 text-white transition-colors hover:bg-[#0A1628]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {intl.formatMessage({ id: 'common.save', defaultMessage: 'Enregistrer' })}
            </button>
          </div>
        </form>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        open={quickAddModal.open}
        onClose={closeQuickAddModal}
        onSave={handleQuickAdd}
        type={quickAddModal.type}
        icon={getModalConfig().icon}
        title={getModalConfig().title}
        loading={quickAddLoading}
      />
    </div>
  );
}
