'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Trash2,
} from 'lucide-react';

import {
  getEmployeeById,
  updateEmployee,
  uploadEmployeePhoto,
  deleteEmployeePhoto,
  getPhotoUrl,
} from '@/app/services/hr';
import { getAllConfigs, configsToOptions, CONFIG_TYPES } from '@/app/services/hr/hrconfigService';

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
        value={value || ''}
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
        value={value || ''}
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

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const intl = useIntl();
  const { locale } = useLanguage();
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef(null);

  // Load employee data
  useEffect(() => {
    if (params.id) {
      fetchEmployee(params.id);
    }
  }, [params.id]);

  // Load configurations
  useEffect(() => {
    loadConfigs();
  }, []);

  const fetchEmployee = async (id) => {
    try {
      setFetchLoading(true);
      const response = await getEmployeeById(id);
      if (response.success) {
        // Handle nested response structure: response.data.employee or response.data directly
        const employee = response.data?.employee || response.data;
        // Format dates for input fields
        const formattedData = {
          ...employee,
          dateNaissance: employee.dateNaissance ? employee.dateNaissance.split('T')[0] : '',
          dateEmbauche: employee.dateEmbauche ? employee.dateEmbauche.split('T')[0] : '',
          dateFinContrat: employee.dateFinContrat ? employee.dateFinContrat.split('T')[0] : '',
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
        if (employee.photo) {
          setPhotoPreview(getPhotoUrl(employee.photo));
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.employees.loadError', defaultMessage: 'Impossible de charger les donnees' }),
        icon: 'error',
      }).then(() => {
        router.push('/hr/employees');
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const loadConfigs = async () => {
    try {
      setConfigLoading(true);
      const response = await getAllConfigs();
      if (response.success && response.data) {
        setConfigs({
          departements: configsToOptions(response.data[CONFIG_TYPES.DEPARTEMENT] || []),
          postes: configsToOptions(response.data[CONFIG_TYPES.POSTE] || []),
          grades: configsToOptions(response.data[CONFIG_TYPES.GRADE] || []),
          categories: configsToOptions(response.data[CONFIG_TYPES.CATEGORIE] || []),
          typesContrat: configsToOptions(response.data[CONFIG_TYPES.TYPE_CONTRAT] || [], true),
          statuts: configsToOptions(response.data[CONFIG_TYPES.STATUT_EMPLOYE] || []),
          banques: configsToOptions(response.data[CONFIG_TYPES.BANQUE] || []),
          liensParente: configsToOptions(response.data[CONFIG_TYPES.LIEN_PARENTE] || []),
        });
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setConfigLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
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

    setNewPhoto(file);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = async () => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.employees.deletePhotoTitle', defaultMessage: 'Supprimer la photo' }),
      text: intl.formatMessage({ id: 'hr.employees.deletePhotoConfirm', defaultMessage: 'Voulez-vous vraiment supprimer la photo?' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0A1628',
      confirmButtonText: intl.formatMessage({ id: 'common.confirmDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      setPhotoUploading(true);
      try {
        const response = await deleteEmployeePhoto(params.id);
        if (response.success) {
          setFormData((prev) => ({ ...prev, photo: null }));
          setPhotoPreview(null);
          setNewPhoto(null);
          Swal.fire({
            title: intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprime!' }),
            text: intl.formatMessage({ id: 'hr.employees.photoDeleted', defaultMessage: 'Photo supprimee avec succes' }),
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: intl.formatMessage({ id: 'hr.employees.photoDeleteError', defaultMessage: 'Impossible de supprimer la photo' }),
          icon: 'error',
        });
      } finally {
        setPhotoUploading(false);
      }
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

      // Remove fields that shouldn't be updated
      delete submitData.id;
      delete submitData.createdAt;
      delete submitData.updatedAt;
      delete submitData.photo;

      const response = await updateEmployee(params.id, submitData);

      if (response.success) {
        // Upload new photo if selected
        if (newPhoto) {
          try {
            await uploadEmployeePhoto(params.id, newPhoto);
          } catch (photoError) {
            console.error('Error uploading photo:', photoError);
          }
        }

        Swal.fire({
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'hr.employees.updateSuccess', defaultMessage: 'Employe mis a jour avec succes' }),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/hr/employees/${params.id}`);
        });
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message || intl.formatMessage({ id: 'hr.employees.updateError', defaultMessage: "Impossible de mettre a jour l'employe" }),
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || newPhoto !== null;

    if (hasChanges) {
      Swal.fire({
        title: intl.formatMessage({ id: 'hr.employees.cancelConfirmTitle', defaultMessage: 'Annuler les modifications?' }),
        text: intl.formatMessage({ id: 'hr.employees.cancelConfirmMessage', defaultMessage: 'Les modifications non enregistrees seront perdues.' }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#0A1628',
        confirmButtonText: intl.formatMessage({ id: 'common.confirm', defaultMessage: 'Oui, annuler' }),
        cancelButtonText: intl.formatMessage({ id: 'common.stay', defaultMessage: 'Rester' }),
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/hr/employees/${params.id}`);
        }
      });
    } else {
      router.push(`/hr/employees/${params.id}`);
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

  if (fetchLoading || configLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <User className="mb-4 h-16 w-16 text-gray-400" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          {intl.formatMessage({ id: 'hr.employees.notFound', defaultMessage: 'Employe non trouve' })}
        </p>
        <Link href="/hr/employees" className="mt-4 text-[#D4A853] hover:underline">
          {intl.formatMessage({ id: 'hr.employees.backToList', defaultMessage: 'Retour a la liste' })}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.employees.editEmployee', defaultMessage: 'Modifier Employe' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {formData.prenom} {formData.nom} - <span className="font-semibold text-[#D4A853]">{formData.matricule}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}</span>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Section */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="group relative">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                {photoUploading ? (
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                ) : photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-10 w-10 text-gray-400" />
                )}
              </div>
              {photoPreview && !photoUploading && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
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
                disabled={photoUploading}
                className="flex items-center gap-2 rounded-lg border border-[#D4A853] px-4 py-2 text-[#D4A853] transition-colors hover:bg-[#D4A853]/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {intl.formatMessage({ id: 'hr.employees.changePhoto', defaultMessage: 'Changer la photo' })}
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
              disabled
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
            <FormSelect
              label={intl.formatMessage({ id: 'hr.employees.department', defaultMessage: 'Departement' })}
              name="departement"
              value={formData.departement}
              onChange={handleChange}
              options={configs.departements}
              error={errors.departement}
            />
            <FormSelect
              label={intl.formatMessage({ id: 'hr.employees.position', defaultMessage: 'Poste' })}
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              options={configs.postes}
              error={errors.poste}
            />
            <FormSelect
              label={intl.formatMessage({ id: 'hr.employees.grade', defaultMessage: 'Grade' })}
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              options={configs.grades}
              error={errors.grade}
            />
            <FormSelect
              label={intl.formatMessage({ id: 'hr.employees.category', defaultMessage: 'Categorie' })}
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              options={configs.categories}
              error={errors.categorie}
            />
            <FormSelect
              label={intl.formatMessage({ id: 'hr.employees.contractType', defaultMessage: 'Type de contrat' })}
              name="typeContrat"
              value={formData.typeContrat}
              onChange={handleChange}
              options={configs.typesContrat}
              error={errors.typeContrat}
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
            <FormInput
              label={intl.formatMessage({ id: 'hr.employees.baseSalary', defaultMessage: 'Salaire de base (USD)' })}
              name="salaireBase"
              type="number"
              value={formData.salaireBase}
              onChange={handleChange}
              error={errors.salaireBase}
            />
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
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
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
    </div>
  );
}
