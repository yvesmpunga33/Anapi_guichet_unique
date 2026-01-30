'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/contexts/LanguageContext';
import Swal from 'sweetalert2';

import {
  ArrowLeft,
  User,
  Users,
  CreditCard,
  FileText,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Heart,
  Baby,
  Shield,
  AlertCircle,
  Camera,
  Printer,
  Download,
  Upload,
  X,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import {
  getEmployeeById,
  deleteEmployee,
  uploadEmployeePhoto,
  deleteEmployeePhoto,
  getPhotoUrl,
} from '@/app/services/hr';

import {
  getEmployeeDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentUrl,
  getDownloadUrl,
  DOCUMENT_TYPES,
  formatFileSize,
  canPreview,
} from '@/app/services/hr/employeeDocumentService';

// Tab configuration
const getTabs = (intl) => [
  { id: 'personal', name: intl.formatMessage({ id: 'hr.employees.tabs.personal', defaultMessage: 'Informations Personnelles' }), icon: User },
  { id: 'professional', name: intl.formatMessage({ id: 'hr.employees.tabs.professional', defaultMessage: 'Infos Professionnelles' }), icon: Briefcase },
  { id: 'family', name: intl.formatMessage({ id: 'hr.employees.tabs.family', defaultMessage: 'Agregat Familial' }), icon: Users },
  { id: 'bank', name: intl.formatMessage({ id: 'hr.employees.tabs.bank', defaultMessage: 'Comptes Bancaires' }), icon: CreditCard },
  { id: 'documents', name: intl.formatMessage({ id: 'hr.employees.tabs.documents', defaultMessage: 'Documents' }), icon: FileText },
  { id: 'emergency', name: intl.formatMessage({ id: 'hr.employees.tabs.emergency', defaultMessage: "Contacts d'Urgence" }), icon: Phone },
];

// Status badge styles
const getStatusStyles = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  switch (status.toLowerCase()) {
    case 'actif':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'en conge':
    case 'en congé':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'inactif':
    case 'suspendu':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Info Item Component
function InfoItem({ label, value, icon }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900 dark:text-white">
        {icon}
        {value || '-'}
      </dd>
    </div>
  );
}

// Section Header Component
function SectionHeader({ icon: Icon, title, color = 'text-[#0A1628]', action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className={`flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white`}>
        <Icon className={`h-5 w-5 ${color}`} />
        {title}
      </h3>
      {action}
    </div>
  );
}

// Add Button Component
function AddButton({ onClick, label, intl }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-[#0A1628]/10 px-3 py-1.5 text-sm font-medium text-[#0A1628] transition-colors hover:bg-[#0A1628]/20 dark:bg-[#D4A853]/20 dark:text-[#D4A853] dark:hover:bg-[#D4A853]/30"
    >
      <Plus className="h-4 w-4" />
      {label || intl.formatMessage({ id: 'common.add', defaultMessage: 'Ajouter' })}
    </button>
  );
}

// Document Upload Modal Component
function DocumentUploadModal({ isOpen, onClose, onUpload, intl }) {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    type: 'autre',
    description: '',
    documentDate: '',
    expiryDate: '',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !metadata.title) return;

    setUploading(true);
    try {
      await onUpload(file, metadata);
      setFile(null);
      setMetadata({
        title: '',
        type: 'autre',
        description: '',
        documentDate: '',
        expiryDate: '',
      });
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.employees.uploadDocument', defaultMessage: 'Telecharger un document' })}
          </h3>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.employees.file', defaultMessage: 'Fichier' })} *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-[#D4A853] dark:border-gray-600"
            >
              {file ? (
                <div className="text-center">
                  <FileText className="mx-auto h-8 w-8 text-[#D4A853]" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {intl.formatMessage({ id: 'hr.employees.clickToUpload', defaultMessage: 'Cliquez pour selectionner un fichier' })}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.employees.documentTitle', defaultMessage: 'Titre' })} *
            </label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.employees.documentType', defaultMessage: 'Type' })}
            </label>
            <select
              value={metadata.type}
              onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(DOCUMENT_TYPES).map(([key, doc]) => (
                <option key={key} value={doc.value}>
                  {doc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.employees.description', defaultMessage: 'Description' })}
            </label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.employees.documentDate', defaultMessage: 'Date document' })}
              </label>
              <input
                type="date"
                value={metadata.documentDate}
                onChange={(e) => setMetadata({ ...metadata, documentDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.employees.expiryDate', defaultMessage: "Date d'expiration" })}
              </label>
              <input
                type="date"
                value={metadata.expiryDate}
                onChange={(e) => setMetadata({ ...metadata, expiryDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
            </button>
            <button
              type="submit"
              disabled={!file || !metadata.title || uploading}
              className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white transition-colors hover:bg-[#0A1628]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {intl.formatMessage({ id: 'common.upload', defaultMessage: 'Telecharger' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const intl = useIntl();
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef(null);

  const tabs = getTabs(intl);

  useEffect(() => {
    if (params.id) {
      fetchEmployee(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id && activeTab === 'documents') {
      loadDocuments();
    }
  }, [params.id, activeTab]);

  const fetchEmployee = async (id) => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      if (response.success) {
        // Handle nested response structure: response.data.employee or response.data directly
        const employeeData = response.data?.employee || response.data;
        setEmployee(employeeData);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.employees.loadError', defaultMessage: 'Impossible de charger les donnees' }),
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await getEmployeeDocuments(params.id);
      if (response.success) {
        setDocuments(response.data || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
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

    setPhotoUploading(true);
    try {
      const response = await uploadEmployeePhoto(params.id, file);
      if (response.success) {
        setEmployee((prev) => ({ ...prev, photo: response.data?.photo || response.data?.filePath }));
        Swal.fire({
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'hr.employees.photoUploaded', defaultMessage: 'Photo mise a jour avec succes' }),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message || intl.formatMessage({ id: 'hr.employees.photoUploadError', defaultMessage: 'Impossible de telecharger la photo' }),
        icon: 'error',
      });
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
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
      try {
        const response = await deleteEmployeePhoto(params.id);
        if (response.success) {
          setEmployee((prev) => ({ ...prev, photo: null }));
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
      }
    }
  };

  const handleDocumentUpload = async (file, metadata) => {
    try {
      const response = await uploadDocument(params.id, file, metadata);
      if (response.success) {
        loadDocuments();
        Swal.fire({
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'hr.employees.documentUploaded', defaultMessage: 'Document telecharge avec succes' }),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteDocument = async (documentId) => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.employees.deleteDocumentTitle', defaultMessage: 'Supprimer le document' }),
      text: intl.formatMessage({ id: 'hr.employees.deleteDocumentConfirm', defaultMessage: 'Voulez-vous vraiment supprimer ce document?' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0A1628',
      confirmButtonText: intl.formatMessage({ id: 'common.confirmDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteDocument(params.id, documentId);
        if (response.success) {
          loadDocuments();
          Swal.fire({
            title: intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprime!' }),
            text: intl.formatMessage({ id: 'hr.employees.documentDeleted', defaultMessage: 'Document supprime avec succes' }),
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: intl.formatMessage({ id: 'hr.employees.documentDeleteError', defaultMessage: 'Impossible de supprimer le document' }),
          icon: 'error',
        });
      }
    }
  };

  const handleDeleteEmployee = async () => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.employees.deleteConfirmTitle', defaultMessage: 'Confirmer la suppression' }),
      html: intl.formatMessage(
        { id: 'hr.employees.deleteConfirmMessage', defaultMessage: 'Voulez-vous vraiment supprimer <strong>{name}</strong>?' },
        { name: `${employee?.prenom} ${employee?.nom}` }
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0A1628',
      confirmButtonText: intl.formatMessage({ id: 'common.confirmDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteEmployee(params.id);
        if (response.success) {
          Swal.fire({
            title: intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprime!' }),
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          router.push('/hr/employees');
        }
      } catch (error) {
        Swal.fire({
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: intl.formatMessage({ id: 'hr.employees.deleteError', defaultMessage: 'Impossible de supprimer' }),
          icon: 'error',
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ${intl.formatMessage({ id: 'hr.employees.years', defaultMessage: 'ans' })}`;
  };

  const getMaritalStatusLabel = (status) => {
    if (!status) return '-';
    const labels = {
      celibataire: intl.formatMessage({ id: 'hr.employees.marital.single', defaultMessage: 'Celibataire' }),
      marie: intl.formatMessage({ id: 'hr.employees.marital.married', defaultMessage: 'Marie(e)' }),
      divorce: intl.formatMessage({ id: 'hr.employees.marital.divorced', defaultMessage: 'Divorce(e)' }),
      veuf: intl.formatMessage({ id: 'hr.employees.marital.widowed', defaultMessage: 'Veuf/Veuve' }),
    };
    return labels[status.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
      </div>
    );
  }

  if (!employee) {
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
          <Link
            href="/hr/employees"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            {/* Avatar with Photo Upload */}
            <div className="group relative">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0A1628] to-[#1a2d4a] text-xl font-bold text-white shadow-lg">
                {photoUploading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                ) : employee.photo ? (
                  <img
                    src={getPhotoUrl(employee.photo)}
                    alt={`${employee.prenom} ${employee.nom}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    {employee.prenom?.[0]}
                    {employee.nom?.[0]}
                  </>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                  title={intl.formatMessage({ id: 'hr.employees.changePhoto', defaultMessage: 'Changer la photo' })}
                >
                  <Camera className="h-4 w-4" />
                </button>
                {employee.photo && (
                  <button
                    onClick={handleDeletePhoto}
                    className="ml-1 rounded-full bg-red-500/80 p-2 text-white hover:bg-red-600"
                    title={intl.formatMessage({ id: 'hr.employees.deletePhoto', defaultMessage: 'Supprimer la photo' })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {employee.prenom} {employee.postnom && `${employee.postnom} `}
                {employee.nom}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-[#D4A853]">{employee.matricule}</span>
                {(employee.poste_nom || employee.poste) && ` - ${employee.poste_nom || employee.poste}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${getStatusStyles(employee.statut)}`}>
            {employee.statut || intl.formatMessage({ id: 'common.undefined', defaultMessage: 'Non defini' })}
          </span>
          <Link
            href={`/hr/employees/${employee.id}/edit`}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white transition-colors hover:bg-[#0A1628]/90"
          >
            <Edit className="h-4 w-4" />
            <span>{intl.formatMessage({ id: 'common.edit', defaultMessage: 'Modifier' })}</span>
          </Link>
          <button
            onClick={handleDeleteEmployee}
            className="rounded-lg border border-red-300 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#D4A853] text-[#D4A853]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-8">
              {/* Identity Section */}
              <div>
                <SectionHeader icon={User} title={intl.formatMessage({ id: 'hr.employees.identity', defaultMessage: 'Identite' })} color="text-[#0A1628]" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.lastName', defaultMessage: 'Nom' })} value={employee.nom} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.middleName', defaultMessage: 'Post-nom' })} value={employee.postnom} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.firstName', defaultMessage: 'Prenom' })} value={employee.prenom} />
                  <InfoItem
                    label={intl.formatMessage({ id: 'hr.employees.gender', defaultMessage: 'Sexe' })}
                    value={
                      employee.genre === 'M'
                        ? intl.formatMessage({ id: 'hr.employees.male', defaultMessage: 'Masculin' })
                        : employee.genre === 'F'
                          ? intl.formatMessage({ id: 'hr.employees.female', defaultMessage: 'Feminin' })
                          : '-'
                    }
                  />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.birthDate', defaultMessage: 'Date de naissance' })} value={formatDate(employee.dateNaissance)} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.age', defaultMessage: 'Age' })} value={calculateAge(employee.dateNaissance)} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.birthPlace', defaultMessage: 'Lieu de naissance' })} value={employee.lieuNaissance} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.province', defaultMessage: "Province d'origine" })} value={employee.province} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.nationality', defaultMessage: 'Nationalite' })} value={employee.nationalite} />
                </div>
              </div>

              {/* Marital Status Section */}
              <div>
                <SectionHeader icon={Heart} title={intl.formatMessage({ id: 'hr.employees.maritalStatus', defaultMessage: 'Etat Civil' })} color="text-pink-600" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.civilStatus', defaultMessage: 'Etat civil' })} value={getMaritalStatusLabel(employee.etatCivil)} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.spouseName', defaultMessage: 'Nom du conjoint' })} value={employee.nomConjoint} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.childrenCount', defaultMessage: "Nombre d'enfants" })} value={String(employee.nombreEnfants ?? 0)} />
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <SectionHeader icon={MapPin} title={intl.formatMessage({ id: 'hr.employees.contact', defaultMessage: 'Coordonnees' })} color="text-green-600" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.address', defaultMessage: 'Adresse' })} value={employee.adresse} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.commune', defaultMessage: 'Commune' })} value={employee.commune} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.city', defaultMessage: 'Ville' })} value={employee.ville} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.province', defaultMessage: 'Province' })} value={employee.province} />
                  <InfoItem
                    label={intl.formatMessage({ id: 'hr.employees.phone1', defaultMessage: 'Telephone 1' })}
                    value={employee.telephone1}
                    icon={<Phone className="h-4 w-4 text-gray-400" />}
                  />
                  <InfoItem
                    label={intl.formatMessage({ id: 'hr.employees.phone2', defaultMessage: 'Telephone 2' })}
                    value={employee.telephone2}
                    icon={<Phone className="h-4 w-4 text-gray-400" />}
                  />
                  <InfoItem
                    label={intl.formatMessage({ id: 'hr.employees.email', defaultMessage: 'Email' })}
                    value={employee.email}
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                  />
                </div>
              </div>

              {/* Identity Documents Section */}
              <div>
                <SectionHeader icon={Shield} title={intl.formatMessage({ id: 'hr.employees.identityDocuments', defaultMessage: "Documents d'Identite" })} color="text-purple-600" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.idNumber', defaultMessage: "N Carte d'identite" })} value={employee.numeroIdentite} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.passportNumber', defaultMessage: 'N Passeport' })} value={employee.numeroPasseport} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.socialSecurityNumber', defaultMessage: 'N INSS' })} value={employee.numeroINSS} />
                </div>
              </div>
            </div>
          )}

          {/* Professional Info Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-8">
              <div>
                <SectionHeader icon={Building2} title={intl.formatMessage({ id: 'hr.employees.assignment', defaultMessage: 'Affectation' })} color="text-[#0A1628]" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.department', defaultMessage: 'Departement' })} value={employee.departement_nom || employee.departement} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.position', defaultMessage: 'Poste' })} value={employee.poste_nom || employee.poste} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.grade', defaultMessage: 'Grade' })} value={employee.grade_nom || employee.grade} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.category', defaultMessage: 'Categorie' })} value={employee.categorie_nom || employee.categorie} />
                </div>
              </div>

              <div>
                <SectionHeader icon={Calendar} title={intl.formatMessage({ id: 'hr.employees.contract', defaultMessage: 'Contrat' })} color="text-green-600" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.contractType', defaultMessage: 'Type de contrat' })} value={employee.typeContrat} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.hireDate', defaultMessage: "Date d'embauche" })} value={formatDate(employee.dateEmbauche)} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.contractEndDate', defaultMessage: 'Date fin contrat' })} value={formatDate(employee.dateFinContrat)} />
                </div>
              </div>

              <div>
                <SectionHeader icon={DollarSign} title={intl.formatMessage({ id: 'hr.employees.remuneration', defaultMessage: 'Remuneration' })} color="text-amber-600" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.baseSalary', defaultMessage: 'Salaire de base' })} value={formatCurrency(employee.salaireBase)} />
                  <InfoItem label={intl.formatMessage({ id: 'hr.employees.status', defaultMessage: 'Statut' })} value={employee.statut} />
                </div>
              </div>
            </div>
          )}

          {/* Family Tab */}
          {activeTab === 'family' && (
            <div className="space-y-8">
              {/* Spouse Section */}
              <div>
                <SectionHeader
                  icon={Heart}
                  title={intl.formatMessage({ id: 'hr.employees.spouse', defaultMessage: 'Conjoint(e)' })}
                  color="text-pink-600"
                  action={<AddButton intl={intl} label={intl.formatMessage({ id: 'common.add', defaultMessage: 'Ajouter' })} />}
                />
                {employee.nomConjoint ? (
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <InfoItem label={intl.formatMessage({ id: 'hr.employees.fullName', defaultMessage: 'Nom complet' })} value={employee.nomConjoint} />
                      <InfoItem label={intl.formatMessage({ id: 'hr.employees.phone', defaultMessage: 'Telephone' })} value={employee.telephoneConjoint} />
                      <InfoItem label={intl.formatMessage({ id: 'hr.employees.profession', defaultMessage: 'Profession' })} value={employee.professionConjoint} />
                    </div>
                  </div>
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400">
                    {intl.formatMessage({ id: 'hr.employees.noSpouse', defaultMessage: 'Aucun conjoint enregistre' })}
                  </p>
                )}
              </div>

              {/* Children Section */}
              <div>
                <SectionHeader
                  icon={Baby}
                  title={`${intl.formatMessage({ id: 'hr.employees.children', defaultMessage: 'Enfants' })} (${employee.nombreEnfants || 0})`}
                  color="text-blue-600"
                  action={<AddButton intl={intl} label={intl.formatMessage({ id: 'common.add', defaultMessage: 'Ajouter' })} />}
                />
                {employee.enfants && employee.enfants.length > 0 ? (
                  <div className="space-y-4">
                    {employee.enfants.map((child, index) => (
                      <div key={child.id || index} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {intl.formatMessage({ id: 'hr.employees.child', defaultMessage: 'Enfant' })} {index + 1}: {child.prenom} {child.nom}
                          </h4>
                          <div className="flex items-center gap-2">
                            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <InfoItem
                            label={intl.formatMessage({ id: 'hr.employees.gender', defaultMessage: 'Sexe' })}
                            value={
                              child.genre === 'M'
                                ? intl.formatMessage({ id: 'hr.employees.male', defaultMessage: 'Masculin' })
                                : intl.formatMessage({ id: 'hr.employees.female', defaultMessage: 'Feminin' })
                            }
                          />
                          <InfoItem label={intl.formatMessage({ id: 'hr.employees.birthDate', defaultMessage: 'Date de naissance' })} value={formatDate(child.dateNaissance)} />
                          <InfoItem label={intl.formatMessage({ id: 'hr.employees.age', defaultMessage: 'Age' })} value={calculateAge(child.dateNaissance)} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400">
                    {intl.formatMessage({ id: 'hr.employees.noChildren', defaultMessage: 'Aucun enfant enregistre' })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bank Accounts Tab */}
          {activeTab === 'bank' && (
            <div>
              <SectionHeader
                icon={CreditCard}
                title={intl.formatMessage({ id: 'hr.employees.bankAccounts', defaultMessage: 'Comptes Bancaires' })}
                color="text-green-600"
                action={<AddButton intl={intl} label={intl.formatMessage({ id: 'common.add', defaultMessage: 'Ajouter' })} />}
              />
              {employee.banque ? (
                <div className="rounded-xl border-2 border-green-500 bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{employee.banque}</h4>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {intl.formatMessage({ id: 'hr.employees.default', defaultMessage: 'Par defaut' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem label={intl.formatMessage({ id: 'hr.employees.bank', defaultMessage: 'Banque' })} value={employee.banque} />
                    <InfoItem label={intl.formatMessage({ id: 'hr.employees.bankCode', defaultMessage: 'Code banque' })} value={employee.numeroBanque} />
                    <InfoItem label={intl.formatMessage({ id: 'hr.employees.accountNumber', defaultMessage: 'Numero compte' })} value={employee.numeroCompte} />
                  </div>
                </div>
              ) : (
                <p className="italic text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: 'hr.employees.noBankAccount', defaultMessage: 'Aucun compte bancaire enregistre' })}
                </p>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <SectionHeader
                icon={FileText}
                title={intl.formatMessage({ id: 'hr.employees.documents', defaultMessage: 'Documents' })}
                color="text-purple-600"
                action={
                  <AddButton
                    intl={intl}
                    label={intl.formatMessage({ id: 'hr.employees.uploadDocument', defaultMessage: 'Telecharger' })}
                    onClick={() => setUploadModalOpen(true)}
                  />
                }
              />
              {documentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                </div>
              ) : documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                          {intl.formatMessage({ id: 'hr.employees.documentTitle', defaultMessage: 'Titre' })}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                          {intl.formatMessage({ id: 'hr.employees.documentType', defaultMessage: 'Type' })}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                          {intl.formatMessage({ id: 'hr.employees.size', defaultMessage: 'Taille' })}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                          {intl.formatMessage({ id: 'hr.employees.uploadDate', defaultMessage: 'Date ajout' })}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                          {intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-white">{doc.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex rounded-full px-2 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: `${DOCUMENT_TYPES[doc.type]?.color}20`,
                                color: DOCUMENT_TYPES[doc.type]?.color,
                              }}
                            >
                              {DOCUMENT_TYPES[doc.type]?.label || doc.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatFileSize(doc.size)}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(doc.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {canPreview(doc.mimeType) && (
                                <a
                                  href={getDocumentUrl(doc.filePath)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              )}
                              <a
                                href={getDownloadUrl(params.id, doc.id)}
                                className="rounded-lg p-1.5 text-gray-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="italic text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: 'hr.employees.noDocuments', defaultMessage: 'Aucun document enregistre' })}
                </p>
              )}
            </div>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === 'emergency' && (
            <div>
              <SectionHeader
                icon={Phone}
                title={intl.formatMessage({ id: 'hr.employees.emergencyContacts', defaultMessage: "Contacts d'Urgence" })}
                color="text-red-600"
                action={<AddButton intl={intl} label={intl.formatMessage({ id: 'common.add', defaultMessage: 'Ajouter' })} />}
              />
              {employee.nomUrgence ? (
                <div className="rounded-xl border-2 border-red-500 bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{employee.nomUrgence}</h4>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {intl.formatMessage({ id: 'hr.employees.primary', defaultMessage: 'Principal' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoItem label={intl.formatMessage({ id: 'hr.employees.relationship', defaultMessage: 'Lien' })} value={employee.lienUrgence} />
                    <InfoItem
                      label={intl.formatMessage({ id: 'hr.employees.phone', defaultMessage: 'Telephone' })}
                      value={employee.telephoneUrgence}
                      icon={<Phone className="h-4 w-4 text-gray-400" />}
                    />
                    <InfoItem
                      label={intl.formatMessage({ id: 'hr.employees.email', defaultMessage: 'Email' })}
                      value={employee.emailUrgence}
                      icon={<Mail className="h-4 w-4 text-gray-400" />}
                    />
                  </div>
                </div>
              ) : (
                <p className="italic text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: 'hr.employees.noEmergencyContact', defaultMessage: "Aucun contact d'urgence enregistre" })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleDocumentUpload} intl={intl} />
    </div>
  );
}
