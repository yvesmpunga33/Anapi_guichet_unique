'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Swal from 'sweetalert2';

import {
  Search,
  RefreshCw,
  Plus,
  FileText,
  Check,
  X,
  Eye,
  Trash2,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Building2,
  Calendar,
  Paperclip,
  AlertTriangle,
  Users,
  Briefcase,
  GraduationCap,
  Plane,
  CloudRain,
  Bus,
  HelpCircle,
  HeartPulse,
  Gavel,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  createJustification,
  getJustifications,
  approveJustification,
  rejectJustification,
  deleteJustification,
  getJustificationStats,
  JUSTIFICATION_TYPES,
  JUSTIFICATION_STATUS,
  getJustificationDocumentUrl,
  getEmployees,
  getPhotoUrl,
  getDepartments,
} from '@/app/services/hr';

// Type Icons mapping
const TYPE_ICONS = {
  maladie: HeartPulse,
  accident: AlertTriangle,
  famille: Users,
  convocation: Gavel,
  formation: GraduationCap,
  mission: Briefcase,
  greve: Users,
  intemperie: CloudRain,
  transport: Bus,
  autre: HelpCircle,
};

// Stats Card Component
function StatCard({ stat, loading }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgClass}`}>
          <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
          <p className={`text-2xl font-bold ${stat.valueClass}`}>
            {loading ? (
              <span className="inline-block h-6 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            ) : (
              stat.value
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusInfo = JUSTIFICATION_STATUS[status];
  if (!statusInfo) return null;

  const colorClasses = {
    pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[status]}`}>
      {statusInfo.label}
    </span>
  );
}

// Type Badge Component
function TypeBadge({ type }) {
  const typeInfo = JUSTIFICATION_TYPES[type] || JUSTIFICATION_TYPES.autre;
  const Icon = TYPE_ICONS[type] || HelpCircle;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${typeInfo.color}20`, color: typeInfo.color }}
    >
      <Icon className="h-3 w-3" />
      {typeInfo.label}
    </span>
  );
}

// Tab Badge Component
function TabBadge({ count, active, color }) {
  const colorClasses = {
    primary: active ? 'bg-[#0A1628] text-white' : 'bg-[#0A1628]/10 text-[#0A1628] dark:bg-[#D4A853]/20 dark:text-[#D4A853]',
    warning: active ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    success: active ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    error: active ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${colorClasses[color]}`}>
      {count > 999 ? '999+' : count}
    </span>
  );
}

// New Justification Dialog Component
function NewJustificationDialog({ isOpen, onClose, onSubmit, employees, intl }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'maladie',
    reason: '',
    isPaid: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.reason) {
      Swal.fire({
        icon: 'warning',
        title: intl.formatMessage({ id: 'common.warning', defaultMessage: 'Attention' }),
        text: intl.formatMessage({ id: 'hr.justifications.fillRequired', defaultMessage: 'Veuillez remplir tous les champs obligatoires' }),
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData, selectedFile);
      setFormData({
        employeeId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        type: 'maladie',
        reason: '',
        isPaid: false,
      });
      setSelectedFile(null);
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {intl.formatMessage({ id: 'hr.justifications.new', defaultMessage: "Nouvelle Justification d'Absence" })}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Employee */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.justifications.employee', defaultMessage: 'Employe' })} *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.justifications.selectEmployee', defaultMessage: 'Selectionner un employe' })}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.matricule} - {emp.prenom} {emp.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.justifications.startDate', defaultMessage: 'Date debut' })} *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.justifications.endDate', defaultMessage: 'Date fin' })} *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.justifications.type', defaultMessage: 'Type de justification' })} *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(JUSTIFICATION_TYPES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} {val.requiresDocument ? '(Doc. requis)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.justifications.reason', defaultMessage: 'Motif detaille' })} *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder={intl.formatMessage({ id: 'hr.justifications.reasonPlaceholder', defaultMessage: 'Decrivez le motif de cette absence...' })}
            />
          </div>

          {/* Document */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.justifications.document', defaultMessage: 'Document justificatif' })}
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-4 text-gray-500 transition-colors hover:border-[#D4A853] hover:text-[#D4A853] dark:border-gray-600 dark:text-gray-400">
              <Paperclip className="h-5 w-5" />
              <span className="text-sm">
                {selectedFile
                  ? selectedFile.name
                  : intl.formatMessage({ id: 'hr.justifications.attachDocument', defaultMessage: 'Joindre un document (certificat medical, etc.)' })}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* Is Paid */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPaid"
              checked={formData.isPaid}
              onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#D4A853] focus:ring-[#D4A853]"
            />
            <label htmlFor="isPaid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.justifications.paidAbsence', defaultMessage: 'Absence payee' })}
            </label>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-xl bg-[#0A1628] px-4 py-2.5 font-medium text-white hover:bg-[#0A1628]/90 disabled:opacity-50"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : (
              intl.formatMessage({ id: 'common.submit', defaultMessage: 'Soumettre' })
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// View Justification Dialog Component
function ViewJustificationDialog({ justification, isOpen, onClose, intl, locale }) {
  if (!isOpen || !justification) return null;

  const emp = justification.employee;
  const typeInfo = JUSTIFICATION_TYPES[justification.type] || JUSTIFICATION_TYPES.autre;
  const statusInfo = JUSTIFICATION_STATUS[justification.status] || JUSTIFICATION_STATUS.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.justifications.details', defaultMessage: 'Details de la justification' })}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Employee Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
              {emp?.photo ? (
                <img src={getPhotoUrl(emp.photo)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{emp?.prenom?.[0]}{emp?.nom?.[0]}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {emp?.prenom} {emp?.nom}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{emp?.matricule}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.justifications.type', defaultMessage: 'Type' })}
              </p>
              <TypeBadge type={justification.type} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.justifications.status', defaultMessage: 'Statut' })}
              </p>
              <StatusBadge status={justification.status} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.justifications.period', defaultMessage: 'Periode' })}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(justification.startDate).toLocaleDateString(locale)} -{' '}
                {new Date(justification.endDate).toLocaleDateString(locale)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.justifications.days', defaultMessage: 'Nombre de jours' })}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {justification.daysCount || 1} {intl.formatMessage({ id: 'hr.justifications.day', defaultMessage: 'jour(s)' })}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.justifications.reason', defaultMessage: 'Motif' })}
            </p>
            <p className="text-sm text-gray-900 dark:text-white">{justification.reason}</p>
          </div>

          {/* Review Notes */}
          {justification.reviewNotes && (
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.justifications.reviewNotes', defaultMessage: 'Notes du responsable' })}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">{justification.reviewNotes}</p>
            </div>
          )}

          {/* Document */}
          {justification.documentPath && (
            <button
              onClick={() => window.open(getJustificationDocumentUrl(justification.documentPath), '_blank')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-[#0A1628] hover:bg-gray-50 dark:border-gray-600 dark:text-[#D4A853] dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              {intl.formatMessage({ id: 'hr.justifications.downloadDocument', defaultMessage: 'Telecharger le document' })}
            </button>
          )}

          {/* Paid Badge */}
          {justification.isPaid && (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center rounded-full border border-green-300 px-3 py-1 text-sm font-medium text-green-700 dark:border-green-600 dark:text-green-400">
                <Check className="mr-1 h-4 w-4" />
                {intl.formatMessage({ id: 'hr.justifications.paid', defaultMessage: 'Absence payee' })}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.close', defaultMessage: 'Fermer' })}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reject Dialog Component
function RejectDialog({ isOpen, onClose, onConfirm, intl }) {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-red-600 px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {intl.formatMessage({ id: 'hr.justifications.reject', defaultMessage: 'Rejeter la justification' })}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {intl.formatMessage({ id: 'hr.justifications.rejectReason', defaultMessage: 'Motif du rejet' })}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder={intl.formatMessage({ id: 'hr.justifications.rejectPlaceholder', defaultMessage: 'Expliquez pourquoi cette justification est rejetee...' })}
          />
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
          >
            {intl.formatMessage({ id: 'hr.justifications.confirmReject', defaultMessage: 'Rejeter' })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JustificationsPage() {
  const intl = useIntl();
  const { locale } = useLanguage();

  // States
  const [loading, setLoading] = useState(true);
  const [justifications, setJustifications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  // Dialog states
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState(null);

  // Status by tab
  const statusByTab = ['', 'pending', 'approved', 'rejected'];

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusByTab[activeTab];
      const [justRes, empRes, deptRes, statsRes] = await Promise.all([
        getJustifications({
          status: status || undefined,
          type: filterType || undefined,
          departmentId: filterDepartment || undefined,
          page: page + 1,
          limit: 20,
        }),
        getEmployees({ status: 'actif', limit: 500 }),
        getDepartments(),
        getJustificationStats(),
      ]);

      // Extract arrays safely (handle various response structures)
      const justArray = justRes?.data?.justifications || justRes?.data || [];
      const empArray = empRes?.data?.employees || empRes?.data || [];
      const deptsArray = deptRes?.data?.departments || deptRes?.data || [];
      setJustifications(Array.isArray(justArray) ? justArray : []);
      setPagination({ page: page + 1, total: justRes?.total || 0 });
      setEmployees(Array.isArray(empArray) ? empArray : []);
      setDepartments(Array.isArray(deptsArray) ? deptsArray : []);
      setStats(statsRes?.data || {});
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.justifications.loadError', defaultMessage: 'Erreur lors du chargement' }),
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, filterType, filterDepartment, page, intl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Submit new justification
  const handleSubmit = async (formData, file) => {
    await createJustification(formData, file);
    Swal.fire({
      icon: 'success',
      title: intl.formatMessage({ id: 'hr.justifications.submitSuccess', defaultMessage: 'Justification soumise avec succes' }),
      timer: 2000,
      showConfirmButton: false,
    });
    loadData();
  };

  // Approve
  const handleApprove = async (id, isPaid = false) => {
    try {
      await approveJustification(id, { isPaid });
      Swal.fire({
        icon: 'success',
        title: intl.formatMessage({ id: 'hr.justifications.approved', defaultMessage: 'Justification approuvee' }),
        timer: 2000,
        showConfirmButton: false,
      });
      loadData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message,
      });
    }
  };

  // Reject
  const handleReject = async (notes) => {
    if (!selectedJustification) return;
    try {
      await rejectJustification(selectedJustification.id, { notes });
      Swal.fire({
        icon: 'info',
        title: intl.formatMessage({ id: 'hr.justifications.rejected', defaultMessage: 'Justification rejetee' }),
        timer: 2000,
        showConfirmButton: false,
      });
      setSelectedJustification(null);
      loadData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message,
      });
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.justifications.deleteConfirm', defaultMessage: 'Supprimer cette justification?' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0A1628',
      confirmButtonText: intl.formatMessage({ id: 'common.confirmDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        await deleteJustification(id);
        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'hr.justifications.deleted', defaultMessage: 'Justification supprimee' }),
          timer: 2000,
          showConfirmButton: false,
        });
        loadData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message,
        });
      }
    }
  };

  // Filter justifications by search
  const filteredJustifications = justifications.filter((j) => {
    if (!searchTerm) return true;
    const emp = j.employee;
    return (
      emp?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Stats configuration
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.justifications.total', defaultMessage: 'Total' }),
      value: stats.total || 0,
      icon: FileText,
      bgClass: 'bg-purple-100 dark:bg-purple-900/30',
      iconClass: 'text-purple-600 dark:text-purple-400',
      valueClass: 'text-gray-900 dark:text-white',
    },
    {
      title: intl.formatMessage({ id: 'hr.justifications.pending', defaultMessage: 'En attente' }),
      value: stats.pending || 0,
      icon: Clock,
      bgClass: 'bg-orange-100 dark:bg-orange-900/30',
      iconClass: 'text-orange-600 dark:text-orange-400',
      valueClass: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.justifications.approved', defaultMessage: 'Approuvees' }),
      value: stats.approved || 0,
      icon: CheckCircle,
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      iconClass: 'text-green-600 dark:text-green-400',
      valueClass: 'text-green-600 dark:text-green-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.justifications.rejected', defaultMessage: 'Rejetees' }),
      value: stats.rejected || 0,
      icon: XCircle,
      bgClass: 'bg-red-100 dark:bg-red-900/30',
      iconClass: 'text-red-600 dark:text-red-400',
      valueClass: 'text-red-600 dark:text-red-400',
    },
  ];

  // Tab configuration
  const TABS = [
    { label: intl.formatMessage({ id: 'hr.justifications.all', defaultMessage: 'Toutes' }), count: stats.total || 0, color: 'primary' },
    { label: intl.formatMessage({ id: 'hr.justifications.pending', defaultMessage: 'En attente' }), count: stats.pending || 0, color: 'warning' },
    { label: intl.formatMessage({ id: 'hr.justifications.approved', defaultMessage: 'Approuvees' }), count: stats.approved || 0, color: 'success' },
    { label: intl.formatMessage({ id: 'hr.justifications.rejected', defaultMessage: 'Rejetees' }), count: stats.rejected || 0, color: 'error' },
  ];

  const totalPages = Math.ceil(pagination.total / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/hr/attendance"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.justifications.title', defaultMessage: "Justifications d'Absence" })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.justifications.subtitle', defaultMessage: "Gestion des justifications et documents d'absence" })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setNewDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Plus className="h-4 w-4" />
            <span>{intl.formatMessage({ id: 'hr.justifications.new', defaultMessage: 'Nouvelle Justification' })}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.justifications.searchEmployee', defaultMessage: 'Rechercher un employe...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.justifications.allTypes', defaultMessage: 'Tous les types' })}</option>
              {Object.entries(JUSTIFICATION_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.justifications.allDepartments', defaultMessage: 'Tous les departements' })}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setPage(0);
              }}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === index
                  ? 'border-b-2 border-[#D4A853] text-[#0A1628] dark:text-[#D4A853]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              <TabBadge count={tab.count} active={activeTab === index} color={tab.color} />
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.employee', defaultMessage: 'Employe' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.type', defaultMessage: 'Type' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.period', defaultMessage: 'Periode' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.days', defaultMessage: 'Jours' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.reason', defaultMessage: 'Motif' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.document', defaultMessage: 'Doc.' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.justifications.status', defaultMessage: 'Statut' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                      <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredJustifications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.justifications.noData', defaultMessage: 'Aucune justification trouvee' })}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredJustifications.map((j) => {
                  const emp = j.employee;

                  return (
                    <tr key={j.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                            {emp?.photo ? (
                              <img src={getPhotoUrl(emp.photo)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium">{emp?.prenom?.[0]}{emp?.nom?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {emp?.prenom} {emp?.nom}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{emp?.matricule}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TypeBadge type={j.type} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {new Date(j.startDate).toLocaleDateString(locale)}
                        {j.startDate !== j.endDate && ` - ${new Date(j.endDate).toLocaleDateString(locale)}`}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                        {j.daysCount || 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-[200px] truncate text-sm text-gray-600 dark:text-gray-300" title={j.reason}>
                          {j.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {j.documentPath ? (
                          <button
                            onClick={() => window.open(getJustificationDocumentUrl(j.documentPath), '_blank')}
                            className="rounded-lg p-2 text-[#0A1628] hover:bg-gray-100 dark:text-[#D4A853] dark:hover:bg-gray-700"
                          >
                            <Paperclip className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <StatusBadge status={j.status} />
                          {j.isPaid && (
                            <span className="inline-flex items-center rounded-full border border-green-300 px-2 py-0.5 text-xs font-medium text-green-700 dark:border-green-600 dark:text-green-400">
                              {intl.formatMessage({ id: 'hr.justifications.paid', defaultMessage: 'Payee' })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedJustification(j);
                              setViewDialogOpen(true);
                            }}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={intl.formatMessage({ id: 'common.view', defaultMessage: 'Voir' })}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {j.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(j.id)}
                                className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                title={intl.formatMessage({ id: 'hr.justifications.approve', defaultMessage: 'Approuver' })}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedJustification(j);
                                  setRejectDialogOpen(true);
                                }}
                                className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                title={intl.formatMessage({ id: 'hr.justifications.reject', defaultMessage: 'Rejeter' })}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(j.id)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Supprimer' })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {intl.formatMessage(
              { id: 'common.totalResults', defaultMessage: '{count} resultat(s)' },
              { count: pagination.total }
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-3 text-sm text-gray-600 dark:text-gray-400">
              {page + 1} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <NewJustificationDialog
        isOpen={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onSubmit={handleSubmit}
        employees={employees}
        intl={intl}
      />

      <ViewJustificationDialog
        justification={selectedJustification}
        isOpen={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedJustification(null);
        }}
        intl={intl}
        locale={locale}
      />

      <RejectDialog
        isOpen={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setSelectedJustification(null);
        }}
        onConfirm={handleReject}
        intl={intl}
      />
    </div>
  );
}
