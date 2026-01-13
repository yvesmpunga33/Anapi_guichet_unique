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
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
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
  Building2,
  Ban,
} from 'lucide-react';

import {
  getLeaves,
  getLeaveById,
  getLeaveTypes,
  createLeave,
  updateLeave,
  deleteLeave,
  submitLeave,
  approveLeaveN1,
  approveLeaveN2,
  rejectLeave,
  cancelLeave,
  getEmployeeBalance,
  generateLeaveReference,
  getLeaveStats,
  LEAVE_STATUS_LABELS,
  LEAVE_STATUS_COLORS,
  calculateWorkingDays,
  getEmployees,
  getPhotoUrl,
} from '@/app/services/hr';

// Icon mapping for leave types
const LEAVE_TYPE_ICONS = {
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

// Stats Card Component
function StatCard({ stat, loading }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${stat.bgClass}`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">
            {loading ? (
              <div className="h-8 w-12 animate-pulse rounded bg-white/20" />
            ) : (
              stat.value
            )}
          </h3>
          <p className="text-sm text-white/85">{stat.title}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
          <stat.icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusInfo = LEAVE_STATUS_LABELS[status];
  const colorClasses = {
    brouillon: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    en_attente: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    approuve_n1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    approuve: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    refuse: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    annule: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[status] || colorClasses.brouillon}`}>
      {statusInfo || status}
    </span>
  );
}

// Tab Badge Component
function TabBadge({ count, active, color }) {
  const colorClasses = {
    primary: active ? 'bg-[#0A1628] text-white' : 'bg-[#0A1628]/10 text-[#0A1628] dark:bg-[#D4A853]/20 dark:text-[#D4A853]',
    success: active ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    error: active ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: active ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    info: active ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${colorClasses[color]}`}>
      {count > 999 ? '999+' : count}
    </span>
  );
}

// Leave Form Dialog
function LeaveFormDialog({ isOpen, onClose, leave, leaveTypes, employees, employeeBalance, onSubmit, saving, intl }) {
  const [formData, setFormData] = useState({
    reference: '',
    employeeId: '',
    leaveTypeId: '',
    dateDebut: '',
    dateFin: '',
    motif: '',
    remplacantId: '',
    commentaireEmploye: '',
    nombreJours: 0,
  });

  useEffect(() => {
    if (leave) {
      setFormData({
        reference: leave.reference || '',
        employeeId: leave.employeeId || '',
        leaveTypeId: leave.leaveTypeId || '',
        dateDebut: leave.dateDebut ? leave.dateDebut.split('T')[0] : '',
        dateFin: leave.dateFin ? leave.dateFin.split('T')[0] : '',
        motif: leave.motif || '',
        remplacantId: leave.remplacantId || '',
        commentaireEmploye: leave.commentaireEmploye || '',
        nombreJours: leave.nombreJours || 0,
      });
    }
  }, [leave]);

  useEffect(() => {
    if (formData.dateDebut && formData.dateFin) {
      const days = calculateWorkingDays(formData.dateDebut, formData.dateFin);
      setFormData(prev => ({ ...prev, nombreJours: days }));
    }
  }, [formData.dateDebut, formData.dateFin]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.employeeId || !formData.leaveTypeId || !formData.dateDebut || !formData.dateFin) {
      Swal.fire({
        icon: 'warning',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.leaves.fillRequired', defaultMessage: 'Veuillez remplir tous les champs obligatoires' }),
      });
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {leave ? intl.formatMessage({ id: 'hr.leaves.editRequest', defaultMessage: 'Modifier la demande' }) : intl.formatMessage({ id: 'hr.leaves.newRequest', defaultMessage: 'Nouvelle demande de conge' })}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaves.reference', defaultMessage: 'Reference' })}
              </label>
              <input
                type="text"
                value={formData.reference}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaves.employee', defaultMessage: 'Employe' })} *
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{intl.formatMessage({ id: 'hr.leaves.selectEmployee', defaultMessage: 'Selectionner un employe' })}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.matricule} - {emp.prenom} {emp.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.leaves.leaveType', defaultMessage: 'Type de conge' })} *
            </label>
            <select
              value={formData.leaveTypeId}
              onChange={(e) => handleChange('leaveTypeId', e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.leaves.selectLeaveType', defaultMessage: 'Selectionner un type' })}</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.nom} ({type.joursParDefaut} {intl.formatMessage({ id: 'hr.leaves.daysPerYear', defaultMessage: 'jours/an' })})
                </option>
              ))}
            </select>
          </div>

          {employeeBalance && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <CalendarDays className="h-5 w-5" />
                <span className="font-semibold">
                  {intl.formatMessage({ id: 'hr.leaves.availableBalance', defaultMessage: 'Solde disponible' })}: {employeeBalance.soldeDisponible || (employeeBalance.joursAlloues - employeeBalance.joursUtilises - employeeBalance.joursEnAttente)} {intl.formatMessage({ id: 'hr.leaves.days', defaultMessage: 'jours' })}
                </span>
              </div>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
                {intl.formatMessage({ id: 'hr.leaves.allocated', defaultMessage: 'Alloues' })}: {employeeBalance.joursAlloues} | {intl.formatMessage({ id: 'hr.leaves.used', defaultMessage: 'Utilises' })}: {employeeBalance.joursUtilises} | {intl.formatMessage({ id: 'hr.leaves.pending', defaultMessage: 'En attente' })}: {employeeBalance.joursEnAttente}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaves.startDate', defaultMessage: 'Date debut' })} *
              </label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => handleChange('dateDebut', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaves.endDate', defaultMessage: 'Date fin' })} *
              </label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => handleChange('dateFin', e.target.value)}
                min={formData.dateDebut}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.leaves.numberOfDays', defaultMessage: 'Nombre de jours' })}
              </label>
              <input
                type="text"
                value={formData.nombreJours}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.leaves.reason', defaultMessage: 'Motif' })}
            </label>
            <textarea
              value={formData.motif}
              onChange={(e) => handleChange('motif', e.target.value)}
              rows={3}
              placeholder={intl.formatMessage({ id: 'hr.leaves.reasonPlaceholder', defaultMessage: 'Decrivez le motif de votre demande...' })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.leaves.replacement', defaultMessage: 'Remplacant (optionnel)' })}
            </label>
            <select
              value={formData.remplacantId}
              onChange={(e) => handleChange('remplacantId', e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.leaves.none', defaultMessage: 'Aucun' })}</option>
              {employees.filter(emp => emp.id !== formData.employeeId).map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.prenom} {emp.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.leaves.comment', defaultMessage: 'Commentaire' })}
            </label>
            <textarea
              value={formData.commentaireEmploye}
              onChange={(e) => handleChange('commentaireEmploye', e.target.value)}
              rows={2}
              placeholder={intl.formatMessage({ id: 'hr.leaves.commentPlaceholder', defaultMessage: 'Commentaire additionnel...' })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
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
            {intl.formatMessage({ id: 'hr.leaves.saveDraft', defaultMessage: 'Enregistrer (Brouillon)' })}
          </button>
        </div>
      </div>
    </div>
  );
}

// Leave Detail Dialog
function LeaveDetailDialog({ isOpen, onClose, leave, intl }) {
  if (!isOpen || !leave) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getEmployeeName = (employee) => {
    if (!employee) return '-';
    return `${employee.prenom || ''} ${employee.nom || ''}`.trim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <Eye className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'hr.leaves.requestDetails', defaultMessage: 'Details de la demande' })}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={leave.statut} />
            <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                {leave.employee?.photo ? (
                  <img src={getPhotoUrl(leave.employee.photo)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold">
                    {leave.employee?.prenom?.[0]}{leave.employee?.nom?.[0]}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getEmployeeName(leave.employee)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {leave.employee?.matricule} | {leave.employee?.poste || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.reference', defaultMessage: 'Reference' })}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{leave.reference}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.leaveType', defaultMessage: 'Type de conge' })}</p>
                <div className="flex items-center gap-1">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: leave.leaveType?.couleur || '#1976d2' }}
                  />
                  <p className="font-semibold text-gray-900 dark:text-white">{leave.leaveType?.nom}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.startDate', defaultMessage: 'Date debut' })}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(leave.dateDebut)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.endDate', defaultMessage: 'Date fin' })}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(leave.dateFin)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.numberOfDays', defaultMessage: 'Nombre de jours' })}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{leave.nombreJours} jour(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.paid', defaultMessage: 'Conge paye' })}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{leave.leaveType?.estPaye ? 'Oui' : 'Non'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.createdAt', defaultMessage: 'Date creation' })}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(leave.createdAt)}</p>
              </div>
              {leave.remplacant && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hr.leaves.replacement', defaultMessage: 'Remplacant' })}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{getEmployeeName(leave.remplacant)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reason */}
          {leave.motif && (
            <div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                {intl.formatMessage({ id: 'hr.leaves.reason', defaultMessage: 'Motif' })}
              </h4>
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300">{leave.motif}</p>
              </div>
            </div>
          )}

          {/* Approval History */}
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.leaves.approvalHistory', defaultMessage: 'Historique d\'approbation' })}
            </h4>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700 space-y-4">
              {leave.dateSoumission && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {intl.formatMessage({ id: 'hr.leaves.submitted', defaultMessage: 'Soumis le' })} {formatDate(leave.dateSoumission)}
                    </p>
                  </div>
                </div>
              )}

              {leave.dateApprobationN1 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {intl.formatMessage({ id: 'hr.leaves.approvedManager', defaultMessage: 'Approuve Manager le' })} {formatDate(leave.dateApprobationN1)}
                    </p>
                    {leave.approbateurN1 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'hr.leaves.by', defaultMessage: 'Par' })}: {getEmployeeName(leave.approbateurN1)}
                      </p>
                    )}
                    {leave.commentaireN1 && (
                      <p className="text-sm italic text-gray-500 dark:text-gray-400">"{leave.commentaireN1}"</p>
                    )}
                  </div>
                </div>
              )}

              {leave.dateApprobationN2 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {intl.formatMessage({ id: 'hr.leaves.approvedHR', defaultMessage: 'Approuve RH le' })} {formatDate(leave.dateApprobationN2)}
                    </p>
                    {leave.approbateurN2 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'hr.leaves.by', defaultMessage: 'Par' })}: {getEmployeeName(leave.approbateurN2)}
                      </p>
                    )}
                    {leave.commentaireN2 && (
                      <p className="text-sm italic text-gray-500 dark:text-gray-400">"{leave.commentaireN2}"</p>
                    )}
                  </div>
                </div>
              )}

              {leave.statut === 'refuse' && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">
                      {intl.formatMessage({ id: 'hr.leaves.rejected', defaultMessage: 'Refuse le' })} {formatDate(leave.dateRefus)}
                    </p>
                    {leave.motifRefus && (
                      <p className="text-sm text-red-600 dark:text-red-300">
                        {intl.formatMessage({ id: 'hr.leaves.reason', defaultMessage: 'Motif' })}: {leave.motifRefus}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {leave.statut === 'annule' && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-700 dark:text-orange-400">
                      {intl.formatMessage({ id: 'hr.leaves.cancelled', defaultMessage: 'Annule le' })} {formatDate(leave.dateAnnulation)}
                    </p>
                    {leave.motifAnnulation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'hr.leaves.reason', defaultMessage: 'Motif' })}: {leave.motifAnnulation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.close', defaultMessage: 'Fermer' })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeavesPage() {
  const intl = useIntl();

  // States
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    approuve: 0,
    refuse: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [viewingLeave, setViewingLeave] = useState(null);
  const [saving, setSaving] = useState(false);
  const [employeeBalance, setEmployeeBalance] = useState(null);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      const [typesRes, employeesRes] = await Promise.all([
        getLeaveTypes({ actif: true }),
        getEmployees({ limit: 500 }),
      ]);
      if (typesRes.success) setLeaveTypes(typesRes.data || []);
      if (employeesRes.success) setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }, []);

  // Load leaves
  const loadLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        statut: filterStatus || undefined,
        leaveTypeId: filterType || undefined,
        annee: new Date().getFullYear(),
      };

      // Filter by tab
      if (tabValue === 1) params.statut = 'en_attente';
      else if (tabValue === 2) params.statut = 'approuve_n1';
      else if (tabValue === 3) params.statut = 'approuve';

      const response = await getLeaves(params);
      if (response.success) {
        setLeaves(response.data || []);
        setTotalCount(response.pagination?.total || 0);
      }

      // Load stats
      const statsRes = await getLeaveStats(new Date().getFullYear());
      if (statsRes.success && statsRes.data) {
        const statsData = statsRes.data.stats || statsRes.data;
        setStats({
          total: statsData.totalDemandes || statsData.total || 0,
          enAttente: statsData.enAttente || 0,
          approuve: statsData.approuvees || statsData.approuve || 0,
          refuse: statsData.refusees || statsData.refuse || 0,
        });
      }
    } catch (error) {
      console.error('Error loading leaves:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, filterStatus, filterType, tabValue]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  // Handle add
  const handleAdd = async () => {
    try {
      const response = await generateLeaveReference();
      setEditingLeave({
        reference: response.data?.reference || '',
        employeeId: '',
        leaveTypeId: '',
        dateDebut: '',
        dateFin: '',
        motif: '',
        remplacantId: '',
        commentaireEmploye: '',
        nombreJours: 0,
      });
      setEmployeeBalance(null);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error generating reference:', error);
    }
  };

  // Handle edit
  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setDialogOpen(true);
  };

  // Handle view
  const handleView = async (leave) => {
    try {
      const response = await getLeaveById(leave.id);
      if (response.success) {
        setViewingLeave(response.data);
        setViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error loading details:', error);
    }
  };

  // Handle save
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      let response;
      if (editingLeave?.id) {
        response = await updateLeave(editingLeave.id, formData);
      } else {
        response = await createLeave(formData);
      }

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: editingLeave?.id
            ? intl.formatMessage({ id: 'hr.leaves.updated', defaultMessage: 'Modifie!' })
            : intl.formatMessage({ id: 'hr.leaves.created', defaultMessage: 'Cree!' }),
          text: response.message,
          timer: 2000,
          showConfirmButton: false,
        });
        setDialogOpen(false);
        setEditingLeave(null);
        loadLeaves();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: error.message || intl.formatMessage({ id: 'hr.leaves.saveError', defaultMessage: 'Une erreur est survenue' }),
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (leave) => {
    if (leave.statut !== 'brouillon') {
      Swal.fire({
        icon: 'warning',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.leaves.onlyDraftDelete', defaultMessage: 'Seules les demandes en brouillon peuvent etre supprimees' }),
      });
      return;
    }

    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaves.deleteConfirm', defaultMessage: 'Supprimer cette demande?' }),
      text: intl.formatMessage({ id: 'common.actionIrreversible', defaultMessage: 'Cette action est irreversible.' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: intl.formatMessage({ id: 'common.yesDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteLeave(leave.id);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprime!' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaves();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaves.deleteError', defaultMessage: 'Impossible de supprimer' }),
        });
      }
    }
  };

  // Handle submit
  const handleSubmit = async (leave) => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaves.submitConfirm', defaultMessage: 'Soumettre cette demande?' }),
      text: intl.formatMessage({ id: 'hr.leaves.submitInfo', defaultMessage: 'La demande sera envoyee pour approbation.' }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'hr.leaves.yesSubmit', defaultMessage: 'Oui, soumettre' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await submitLeave(leave.id);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'hr.leaves.submitted', defaultMessage: 'Soumis!' }),
            text: intl.formatMessage({ id: 'hr.leaves.submittedInfo', defaultMessage: 'La demande a ete soumise pour approbation.' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaves();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaves.submitError', defaultMessage: 'Impossible de soumettre' }),
        });
      }
    }
  };

  // Handle approve N1
  const handleApproveN1 = async (leave) => {
    const { value: commentaire } = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaves.approveManager', defaultMessage: 'Approuver (Manager)?' }),
      input: 'textarea',
      inputLabel: intl.formatMessage({ id: 'hr.leaves.commentOptional', defaultMessage: 'Commentaire (optionnel)' }),
      inputPlaceholder: intl.formatMessage({ id: 'hr.leaves.addComment', defaultMessage: 'Ajouter un commentaire...' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'hr.leaves.approve', defaultMessage: 'Approuver' }),
      confirmButtonColor: '#4caf50',
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (commentaire !== undefined) {
      try {
        const response = await approveLeaveN1(leave.id, { commentaire });
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'hr.leaves.approvedN1', defaultMessage: 'Approuve (N1)!' }),
            text: intl.formatMessage({ id: 'hr.leaves.awaitingHR', defaultMessage: 'En attente de validation RH.' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaves();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaves.approveError', defaultMessage: 'Impossible d\'approuver' }),
        });
      }
    }
  };

  // Handle approve N2
  const handleApproveN2 = async (leave) => {
    const { value: commentaire } = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaves.approveHR', defaultMessage: 'Approuver definitivement (RH)?' }),
      input: 'textarea',
      inputLabel: intl.formatMessage({ id: 'hr.leaves.commentOptional', defaultMessage: 'Commentaire (optionnel)' }),
      inputPlaceholder: intl.formatMessage({ id: 'hr.leaves.addComment', defaultMessage: 'Ajouter un commentaire...' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'hr.leaves.approve', defaultMessage: 'Approuver' }),
      confirmButtonColor: '#4caf50',
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
    });

    if (commentaire !== undefined) {
      try {
        const response = await approveLeaveN2(leave.id, { commentaire });
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'hr.leaves.approvedFinal', defaultMessage: 'Approuve definitivement!' }),
            text: intl.formatMessage({ id: 'hr.leaves.leaveGranted', defaultMessage: 'Le conge est accorde.' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaves();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaves.approveError', defaultMessage: 'Impossible d\'approuver' }),
        });
      }
    }
  };

  // Handle reject
  const handleReject = async (leave) => {
    const { value: motifRefus } = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaves.rejectConfirm', defaultMessage: 'Refuser cette demande?' }),
      input: 'textarea',
      inputLabel: intl.formatMessage({ id: 'hr.leaves.rejectReasonRequired', defaultMessage: 'Motif du refus *' }),
      inputPlaceholder: intl.formatMessage({ id: 'hr.leaves.explainReason', defaultMessage: 'Expliquez le motif du refus...' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'hr.leaves.reject', defaultMessage: 'Refuser' }),
      confirmButtonColor: '#d33',
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
      inputValidator: (value) => {
        if (!value) return intl.formatMessage({ id: 'hr.leaves.reasonRequired', defaultMessage: 'Le motif du refus est obligatoire' });
      },
    });

    if (motifRefus) {
      try {
        const response = await rejectLeave(leave.id, { motifRefus });
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'hr.leaves.rejected', defaultMessage: 'Refuse!' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaves();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaves.rejectError', defaultMessage: 'Impossible de refuser' }),
        });
      }
    }
  };

  // Handle cancel
  const handleCancel = async (leave) => {
    const { value: motifAnnulation } = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.leaves.cancelConfirm', defaultMessage: 'Annuler cette demande?' }),
      input: 'textarea',
      inputLabel: intl.formatMessage({ id: 'hr.leaves.cancelReasonOptional', defaultMessage: 'Motif de l\'annulation (optionnel)' }),
      inputPlaceholder: intl.formatMessage({ id: 'hr.leaves.addComment', defaultMessage: 'Ajouter un commentaire...' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'hr.leaves.cancelRequest', defaultMessage: 'Annuler la demande' }),
      confirmButtonColor: '#ff9800',
      cancelButtonText: intl.formatMessage({ id: 'common.back', defaultMessage: 'Retour' }),
    });

    if (motifAnnulation !== undefined) {
      try {
        const response = await cancelLeave(leave.id, { motifAnnulation });
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: intl.formatMessage({ id: 'hr.leaves.cancelled', defaultMessage: 'Annule!' }),
            timer: 2000,
            showConfirmButton: false,
          });
          loadLeaves();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.leaves.cancelError', defaultMessage: 'Impossible d\'annuler' }),
        });
      }
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get employee name
  const getEmployeeName = (employee) => {
    if (!employee) return '-';
    return `${employee.prenom || ''} ${employee.nom || ''}`.trim();
  };

  // Get leave type icon
  const getLeaveTypeIcon = (leaveType) => {
    if (!leaveType) return Calendar;
    return LEAVE_TYPE_ICONS[leaveType.icone] || Calendar;
  };

  // Stats config
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.leaves.totalRequests', defaultMessage: 'Total Demandes' }),
      value: stats.total,
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaves.pending', defaultMessage: 'En Attente' }),
      value: stats.enAttente,
      icon: Clock,
      bgClass: 'bg-gradient-to-br from-orange-500 to-amber-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaves.approved', defaultMessage: 'Approuves' }),
      value: stats.approuve,
      icon: CheckCircle,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaves.rejected', defaultMessage: 'Refuses' }),
      value: stats.refuse,
      icon: XCircle,
      bgClass: 'bg-gradient-to-br from-red-500 to-rose-600',
    },
  ];

  // Tab config
  const TABS = [
    { label: intl.formatMessage({ id: 'hr.leaves.all', defaultMessage: 'Toutes' }), count: stats.total, color: 'primary' },
    { label: intl.formatMessage({ id: 'hr.leaves.pending', defaultMessage: 'En Attente' }), count: stats.enAttente, color: 'warning' },
    { label: intl.formatMessage({ id: 'hr.leaves.approvedManager', defaultMessage: 'Approuve Manager' }), count: 0, color: 'info' },
    { label: intl.formatMessage({ id: 'hr.leaves.approved', defaultMessage: 'Approuves' }), count: stats.approuve, color: 'success' },
  ];

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.leaves.title', defaultMessage: 'Gestion des Conges' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.leaves.subtitle', defaultMessage: 'Demandes de conges et workflow d\'approbation' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/hr/leaves/calendar"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.leaves.calendar', defaultMessage: 'Calendrier' })}</span>
          </a>
          <button
            onClick={loadLeaves}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title={intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Plus className="h-4 w-4" />
            <span>{intl.formatMessage({ id: 'hr.leaves.newRequest', defaultMessage: 'Nouvelle Demande' })}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab, index) => (
            <button
              key={index}
              onClick={() => setTabValue(index)}
              className={`flex items-center whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors ${
                tabValue === index
                  ? 'border-b-2 border-[#D4A853] text-[#0A1628] dark:text-[#D4A853]'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              <TabBadge count={tab.count} active={tabValue === index} color={tab.color} />
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={intl.formatMessage({ id: 'hr.leaves.search', defaultMessage: 'Rechercher...' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{intl.formatMessage({ id: 'hr.leaves.allTypes', defaultMessage: 'Tous les types' })}</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.nom}</option>
                ))}
              </select>
            </div>
            {tabValue === 0 && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{intl.formatMessage({ id: 'hr.leaves.allStatuses', defaultMessage: 'Tous les statuts' })}</option>
                  <option value="brouillon">{intl.formatMessage({ id: 'hr.leaves.draft', defaultMessage: 'Brouillon' })}</option>
                  <option value="en_attente">{intl.formatMessage({ id: 'hr.leaves.pending', defaultMessage: 'En attente' })}</option>
                  <option value="approuve_n1">{intl.formatMessage({ id: 'hr.leaves.approvedManager', defaultMessage: 'Approuve Manager' })}</option>
                  <option value="approuve">{intl.formatMessage({ id: 'hr.leaves.approved', defaultMessage: 'Approuve' })}</option>
                  <option value="refuse">{intl.formatMessage({ id: 'hr.leaves.rejected', defaultMessage: 'Refuse' })}</option>
                  <option value="annule">{intl.formatMessage({ id: 'hr.leaves.cancelled', defaultMessage: 'Annule' })}</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.leaves.reference', defaultMessage: 'Reference' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.leaves.employee', defaultMessage: 'Employe' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.leaves.type', defaultMessage: 'Type' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.leaves.period', defaultMessage: 'Periode' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.leaves.days', defaultMessage: 'Jours' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.leaves.status', defaultMessage: 'Statut' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                      <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.leaves.noRequests', defaultMessage: 'Aucune demande de conge' })}
                    </p>
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => {
                  const IconComponent = getLeaveTypeIcon(leave.leaveType);
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{leave.reference}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                            {leave.employee?.photo ? (
                              <img src={getPhotoUrl(leave.employee.photo)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium">{leave.employee?.prenom?.[0]}{leave.employee?.nom?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{getEmployeeName(leave.employee)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{leave.employee?.matricule}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: leave.leaveType?.couleur || '#0A1628' }}
                          />
                          <span className="text-gray-900 dark:text-white">{leave.leaveType?.nom || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {formatDate(leave.dateDebut)} - {formatDate(leave.dateFin)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-[#0A1628]/10 px-2.5 py-0.5 text-sm font-semibold text-[#0A1628] dark:bg-[#D4A853]/20 dark:text-[#D4A853]">
                          {leave.nombreJours} j
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={leave.statut} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(leave)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            title={intl.formatMessage({ id: 'hr.leaves.viewDetails', defaultMessage: 'Voir details' })}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {leave.statut === 'brouillon' && (
                            <>
                              <button
                                onClick={() => handleEdit(leave)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                title={intl.formatMessage({ id: 'common.edit', defaultMessage: 'Modifier' })}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleSubmit(leave)}
                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                title={intl.formatMessage({ id: 'hr.leaves.submit', defaultMessage: 'Soumettre' })}
                              >
                                <Send className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(leave)}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                title={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Supprimer' })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {leave.statut === 'en_attente' && (
                            <>
                              <button
                                onClick={() => handleApproveN1(leave)}
                                className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                                title={intl.formatMessage({ id: 'hr.leaves.approveManager', defaultMessage: 'Approuver (Manager)' })}
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(leave)}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                title={intl.formatMessage({ id: 'hr.leaves.reject', defaultMessage: 'Refuser' })}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {leave.statut === 'approuve_n1' && (
                            <>
                              <button
                                onClick={() => handleApproveN2(leave)}
                                className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                                title={intl.formatMessage({ id: 'hr.leaves.approveHR', defaultMessage: 'Approuver (RH)' })}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(leave)}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                title={intl.formatMessage({ id: 'hr.leaves.reject', defaultMessage: 'Refuser' })}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {['en_attente', 'approuve_n1', 'approuve'].includes(leave.statut) && (
                            <button
                              onClick={() => handleCancel(leave)}
                              className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30"
                              title={intl.formatMessage({ id: 'hr.leaves.cancelRequest', defaultMessage: 'Annuler' })}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'common.rowsPerPage', defaultMessage: 'Lignes par page:' })}
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {[10, 25, 50, 100].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalCount)} {intl.formatMessage({ id: 'common.of', defaultMessage: 'sur' })} {totalCount}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
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
      </div>

      {/* Dialogs */}
      <LeaveFormDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingLeave(null);
        }}
        leave={editingLeave}
        leaveTypes={leaveTypes}
        employees={employees}
        employeeBalance={employeeBalance}
        onSubmit={handleSave}
        saving={saving}
        intl={intl}
      />

      <LeaveDetailDialog
        isOpen={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setViewingLeave(null);
        }}
        leave={viewingLeave}
        intl={intl}
      />
    </div>
  );
}
