'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';
import Swal from 'sweetalert2';

import {
  Users,
  Wallet,
  Calculator,
  Calendar,
  Search,
  RefreshCw,
  Eye,
  FileText,
  Archive,
  Play,
  Check,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  Banknote,
  Filter,
  X,
} from 'lucide-react';

import {
  getPayrolls,
  traiterPaieMensuelle,
  validerPayrollsEnMasse,
  payerPayrollsEnMasse,
  getRecapitulatifMensuel,
  archiverMois,
  formatMontant,
  getNomMois,
  getStatutConfig,
} from '@/app/services/hr/payrollService';
import { getEmployees } from '@/app/services/hr/employeeService';
import { getCategories } from '@/app/services/hr/categoryService';
import { getDepartments } from '@/app/services/hr/departmentService';

// Status badge component
const StatusBadge = ({ statut }) => {
  const config = getStatutConfig(statut);
  const statusStyles = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    secondary: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const icons = {
    brouillon: Clock,
    calcule: Calculator,
    valide: CheckCircle,
    paye: Banknote,
    archive: Archive,
  };

  const Icon = icons[statut] || Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[config.color] || statusStyles.default}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

// KPI Card Component
function KPICard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${colorClass}`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/85">{title}</p>
          <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-white/70">{subtitle}</p>}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

// Process Dialog Component
function ProcessDialog({
  isOpen,
  onClose,
  onProcess,
  periodeLabel,
  employeesCount,
  categories,
  departments,
  processing,
  intl,
}) {
  const [calcMode, setCalcMode] = useState('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [joursOuvres, setJoursOuvres] = useState(26);

  const handleSubmit = () => {
    onProcess({
      calcMode,
      selectedCategoryId,
      selectedDepartment,
      joursOuvres,
    });
  };

  const isValid = calcMode === 'all' ||
    (calcMode === 'category' && selectedCategoryId) ||
    (calcMode === 'department' && selectedDepartment);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0A1628] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'payroll.calculatePayroll', defaultMessage: 'Calculer la Paie' })} - {periodeLabel}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Info Alert */}
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
            <Users className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {intl.formatMessage({ id: 'payroll.selectEmployeesInfo', defaultMessage: 'Selectionnez les employes pour lesquels calculer la paie de' })} {periodeLabel}.
            </p>
          </div>

          {/* Calculation Scope */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'payroll.calculateScope', defaultMessage: 'Perimetre de calcul' })}
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="calcMode"
                  value="all"
                  checked={calcMode === 'all'}
                  onChange={() => {
                    setCalcMode('all');
                    setSelectedCategoryId('');
                    setSelectedDepartment('');
                  }}
                  className="h-4 w-4 text-[#D4A853] focus:ring-[#D4A853]"
                />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.allActiveEmployees', defaultMessage: 'Tous les employes actifs' })}
                </span>
                <span className="rounded-full bg-[#0A1628] px-2.5 py-0.5 text-xs text-white">
                  {employeesCount} {intl.formatMessage({ id: 'payroll.employees', defaultMessage: 'employes' })}
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="calcMode"
                  value="category"
                  checked={calcMode === 'category'}
                  onChange={() => {
                    setCalcMode('category');
                    setSelectedDepartment('');
                  }}
                  className="h-4 w-4 text-[#D4A853] focus:ring-[#D4A853]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.byCategory', defaultMessage: 'Par categorie' })}
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="calcMode"
                  value="department"
                  checked={calcMode === 'department'}
                  onChange={() => {
                    setCalcMode('department');
                    setSelectedCategoryId('');
                  }}
                  className="h-4 w-4 text-[#D4A853] focus:ring-[#D4A853]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.byDepartment', defaultMessage: 'Par departement' })}
                </span>
              </label>
            </div>
          </div>

          {/* Category selector */}
          {calcMode === 'category' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'payroll.selectCategory', defaultMessage: 'Selectionner une categorie' })}
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">-- {intl.formatMessage({ id: 'common.select', defaultMessage: 'Selectionner' })} --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom} {cat.salaireBase ? `(${formatMontant(cat.salaireBase)})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Department selector */}
          {calcMode === 'department' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'payroll.selectDepartment', defaultMessage: 'Selectionner un departement' })}
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">-- {intl.formatMessage({ id: 'common.select', defaultMessage: 'Selectionner' })} --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-600" />

          {/* Working days */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'payroll.workingDays', defaultMessage: 'Jours ouvres du mois' })}
            </label>
            <input
              type="number"
              value={joursOuvres}
              onChange={(e) => setJoursOuvres(parseInt(e.target.value) || 26)}
              min={1}
              max={31}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: 'payroll.workingDaysHelp', defaultMessage: 'Nombre de jours travailles standard pour ce mois' })}
            </p>
          </div>

          {/* Calculation info */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'payroll.calculationIncludes', defaultMessage: 'Le calcul inclut :' })}
            </p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>- {intl.formatMessage({ id: 'payroll.baseSalaryCategory', defaultMessage: 'Salaire de base selon la categorie' })}</li>
              <li>- {intl.formatMessage({ id: 'payroll.generalIndividualBonuses', defaultMessage: 'Primes generales et individuelles' })}</li>
              <li>- {intl.formatMessage({ id: 'payroll.socialContributions', defaultMessage: 'Cotisations sociales (CNSS 5% employe, 9% employeur)' })}</li>
              <li>- {intl.formatMessage({ id: 'payroll.iprWithAllowance', defaultMessage: 'IPR avec abattement familial' })}</li>
              <li>- {intl.formatMessage({ id: 'payroll.variousDeductions', defaultMessage: 'Retenues diverses' })}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={processing}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'payroll.cancel', defaultMessage: 'Annuler' })}
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing || !isValid}
            className="flex items-center gap-2 rounded-xl bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90 disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {intl.formatMessage({ id: 'payroll.calculatingProgress', defaultMessage: 'Calcul en cours...' })}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {intl.formatMessage({ id: 'payroll.launchCalculationBtn', defaultMessage: 'Lancer le calcul' })}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Archive Dialog Component
function ArchiveDialog({ isOpen, onClose, onArchive, periodeLabel, recap, processing, intl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between bg-yellow-500 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'payroll.archive', defaultMessage: 'Archiver' })} - {periodeLabel}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <Archive className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300">Attention !</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {intl.formatMessage({ id: 'payroll.archiveWarning', defaultMessage: 'Cette action est irreversible. Les fiches de paie seront verrouillees.' })}
              </p>
            </div>
          </div>

          {/* Summary */}
          {recap?.global && (
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'payroll.summaryToArchive', defaultMessage: 'Resume a archiver :' })}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.employees', defaultMessage: 'Employes' })}:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{recap.global.nombreEmployes}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'hrDashboard.totalSalary', defaultMessage: 'Masse salariale' })}:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{formatMontant(recap.global.masseSalariale)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a payer' })}:</span>
                  <span className="ml-2 font-semibold text-green-600 dark:text-green-400">{formatMontant(recap.global.netAPayer)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.taxCharges', defaultMessage: 'Charges fiscales' })}:</span>
                  <span className="ml-2 font-semibold text-orange-600 dark:text-orange-400">{formatMontant(recap.fiscalite?.totalAVerser)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={processing}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'payroll.cancel', defaultMessage: 'Annuler' })}
          </button>
          <button
            onClick={onArchive}
            disabled={processing}
            className="flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {intl.formatMessage({ id: 'payroll.archiving', defaultMessage: 'Archivage...' })}
              </>
            ) : (
              <>
                <Archive className="h-4 w-4" />
                {intl.formatMessage({ id: 'payroll.confirmArchive', defaultMessage: 'Confirmer l\'archivage' })}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Detail Dialog Component
function DetailDialog({ isOpen, onClose, payroll, intl, router }) {
  if (!isOpen || !payroll) return null;

  const fmt = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const currency = payroll.currency?.code || 'USD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0A1628] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'payroll.details', defaultMessage: 'Details' })} - {payroll.reference}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge statut={payroll.statut} />
            <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Employee Info */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A1628] text-white">
                  <span className="text-lg font-bold">
                    {payroll.employee?.prenom?.[0]}{payroll.employee?.nom?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {payroll.employee?.prenom} {payroll.employee?.nom}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {intl.formatMessage({ id: 'payroll.matricule', defaultMessage: 'Matricule' })}: {payroll.employee?.matricule}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.department', defaultMessage: 'Departement' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{payroll.employee?.departement || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.position', defaultMessage: 'Poste' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{payroll.employee?.poste || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.category', defaultMessage: 'Categorie' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{payroll.category?.nom || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.familyCharges', defaultMessage: 'Charges familiales' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{payroll.chargesFamiliales || 0} {intl.formatMessage({ id: 'payroll.persons', defaultMessage: 'personnes' })}</p>
                </div>
              </div>
            </div>

            {/* Period Info */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Calendar className="h-4 w-4" />
                {intl.formatMessage({ id: 'payroll.periodAndDays', defaultMessage: 'Periode et jours' })}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.period', defaultMessage: 'Periode' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{getNomMois(payroll.mois)} {payroll.annee}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.currency', defaultMessage: 'Devise' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{currency}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.workingDaysLabel', defaultMessage: 'Jours ouvres' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{payroll.joursOuvres || 26}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.workedDays', defaultMessage: 'Jours travailles' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{payroll.joursTravailles || 26}</p>
                </div>
              </div>
            </div>

            {/* Gains */}
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/10">
              <h4 className="mb-3 font-semibold text-green-700 dark:text-green-400">
                {intl.formatMessage({ id: 'payroll.gains', defaultMessage: 'Gains' })}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.baseSalary', defaultMessage: 'Salaire de base' })}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{fmt(payroll.salaireBase)} {currency}</span>
                </div>
                {payroll.totalPrimes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalBonuses', defaultMessage: 'Total primes' })}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+{fmt(payroll.totalPrimes)} {currency}</span>
                  </div>
                )}
                {payroll.totalIndemnites > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalAllowances', defaultMessage: 'Total indemnites' })}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+{fmt(payroll.totalIndemnites)} {currency}</span>
                  </div>
                )}
                <div className="border-t border-green-200 pt-2 dark:border-green-700">
                  <div className="flex justify-between rounded-lg bg-green-600 px-3 py-2 text-white">
                    <span className="font-semibold">{intl.formatMessage({ id: 'payroll.grossSalary', defaultMessage: 'Salaire brut' })}</span>
                    <span className="font-bold">{fmt(payroll.salaireBrut)} {currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Withholdings */}
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/10">
              <h4 className="mb-3 font-semibold text-red-700 dark:text-red-400">
                {intl.formatMessage({ id: 'payroll.withholdings', defaultMessage: 'Retenues' })}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.cnss', defaultMessage: 'CNSS' })} ({payroll.tauxCnssEmploye || 5}%)</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-{fmt(payroll.cnssEmploye)} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.ipr', defaultMessage: 'IPR' })}</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-{fmt(payroll.iprNet)} {currency}</span>
                </div>
                {payroll.detailRetenues?.filter(r => r.source !== 'absences').length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.otherWithholdings', defaultMessage: 'Autres retenues' })}</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{fmt(payroll.detailRetenues.filter(r => r.source !== 'absences').reduce((sum, r) => sum + (r.montant || 0), 0))} {currency}
                    </span>
                  </div>
                )}
                <div className="border-t border-red-200 pt-2 dark:border-red-700">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.totalWithholdings', defaultMessage: 'Total retenues' })}</span>
                    <span className="font-bold text-red-600 dark:text-red-400">-{fmt(payroll.totalRetenuesSalariales)} {currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net to Pay */}
            <div className="col-span-full rounded-xl bg-[#0A1628] p-6 text-center text-white">
              <h4 className="text-lg">{intl.formatMessage({ id: 'payroll.netToPayLabel', defaultMessage: 'Net a Payer' })}</h4>
              <p className="mt-2 text-4xl font-bold text-[#D4A853]">{fmt(payroll.netAPayer)} {currency}</p>
            </div>

            {/* Employer Charges */}
            <div className="col-span-full rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
              <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'payroll.employerCharges', defaultMessage: 'Charges patronales' })}
              </h4>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.cnssEmployer', defaultMessage: 'CNSS Employeur' })}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{fmt(payroll.cnssEmployeur)} {currency}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">INPP</p>
                  <p className="font-medium text-gray-900 dark:text-white">{fmt(payroll.inppEmployeur)} {currency}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">ONEM</p>
                  <p className="font-medium text-gray-900 dark:text-white">{fmt(payroll.onemEmployeur)} {currency}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalEmployerCost', defaultMessage: 'Cout total employeur' })}</p>
                  <p className="font-semibold text-[#0A1628] dark:text-[#D4A853]">{fmt(payroll.coutTotalEmployeur)} {currency}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'payroll.close', defaultMessage: 'Fermer' })}
          </button>
          <button
            onClick={() => {
              onClose();
              router.push(`/hr/payroll/${payroll.id}`);
            }}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <FileText className="h-4 w-4" />
            {intl.formatMessage({ id: 'payroll.viewPdfPayslip', defaultMessage: 'Voir bulletin PDF' })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PayrollPage() {
  const router = useRouter();
  const intl = useIntl();

  // Period state
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [annee, setAnnee] = useState(currentYear);
  const [mois, setMois] = useState(currentMonth);

  // Data state
  const [payrolls, setPayrolls] = useState([]);
  const [recap, setRecap] = useState(null);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & filters
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const searchTimeoutRef = useRef(null);

  // Selection
  const [selected, setSelected] = useState([]);

  // Dialogs
  const [processDialog, setProcessDialog] = useState(false);
  const [archiveDialog, setArchiveDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // Filter options
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [payrollsRes, recapRes, employeesRes] = await Promise.all([
        getPayrolls({
          annee,
          mois,
          statut: statutFilter || undefined,
          search: debouncedSearch || undefined,
          page: page + 1,
          limit: rowsPerPage,
        }),
        getRecapitulatifMensuel(annee, mois),
        getEmployees({ statut: 'Actif', limit: 1 }),
      ]);

      if (payrollsRes.success) {
        const payrollsArray = payrollsRes.data?.payrolls || payrollsRes.data || [];
        setPayrolls(Array.isArray(payrollsArray) ? payrollsArray : []);
        setTotal(payrollsRes.pagination?.total || payrollsRes.data?.pagination?.total || 0);
      }

      if (recapRes.success) {
        setRecap(recapRes.data);
      }

      if (employeesRes.success) {
        setEmployeesCount(employeesRes.pagination?.total || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [annee, mois, page, rowsPerPage, debouncedSearch, statutFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          getCategories(),
          getDepartments(),
        ]);
        // Extract arrays safely (handle various response structures)
        const catsArray = catRes?.data?.categories || catRes?.data || [];
        const deptsArray = deptRes?.data?.departments || deptRes?.data || [];
        if (catRes.success) setCategories(Array.isArray(catsArray) ? catsArray : []);
        if (deptRes.success) setDepartments(Array.isArray(deptsArray) ? deptsArray : []);
      } catch (err) {
        console.error('Error loading filters:', err);
      }
    };
    loadFilters();
  }, []);

  // Process payroll
  const handleTraiterPaie = async ({ calcMode, selectedCategoryId, selectedDepartment, joursOuvres }) => {
    setProcessing(true);
    setError(null);
    try {
      const params = { annee, mois, joursOuvres };

      if (calcMode === 'category' && selectedCategoryId) {
        params.categoryId = selectedCategoryId;
      } else if (calcMode === 'department' && selectedDepartment) {
        params.departmentId = selectedDepartment;
      }

      const response = await traiterPaieMensuelle(params);

      if (response.success) {
        const modeLabel = calcMode === 'all' ? 'tous les employes' :
          calcMode === 'category' ? `la categorie ${categories.find(c => c.id === selectedCategoryId)?.nom || ''}` :
          `le departement ${departments.find(d => d.id === selectedDepartment)?.nom || ''}`;

        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: `${response.data?.employees_traites || 0} fiches de paie generees pour ${modeLabel}`,
          timer: 3000,
        });
        setProcessDialog(false);
        loadData();
      } else {
        setError(response.message || 'Erreur lors du traitement');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Validate selected
  const handleValider = async () => {
    if (selected.length === 0) return;
    setProcessing(true);
    try {
      const response = await validerPayrollsEnMasse(selected);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: `${response.data?.updatedCount || 0} fiches validees`,
          timer: 2000,
        });
        setSelected([]);
        loadData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Pay selected
  const handlePayer = async () => {
    if (selected.length === 0) return;
    setProcessing(true);
    try {
      const response = await payerPayrollsEnMasse(selected);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: `${response.data?.updatedCount || 0} fiches marquees comme payees`,
          timer: 2000,
        });
        setSelected([]);
        loadData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Archive month
  const handleArchiver = async () => {
    setProcessing(true);
    try {
      const response = await archiverMois(annee, mois);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: response.data?.message || 'Archive effectuee',
          timer: 2000,
        });
        setArchiveDialog(false);
        loadData();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(payrolls.filter(p => p.statut !== 'archive').map(p => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setDetailDialog(true);
  };

  const periodeLabel = `${getNomMois(mois).charAt(0).toUpperCase() + getNomMois(mois).slice(1)} ${annee}`;
  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'payroll.title', defaultMessage: 'Gestion de la Paie' })}
          </h1>
          <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {periodeLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={mois}
            onChange={(e) => setMois(parseInt(e.target.value))}
            className="rounded-xl border border-gray-200 px-3 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {getNomMois(i + 1).charAt(0).toUpperCase() + getNomMois(i + 1).slice(1)}
              </option>
            ))}
          </select>
          <select
            value={annee}
            onChange={(e) => setAnnee(parseInt(e.target.value))}
            className="rounded-xl border border-gray-200 px-3 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => setProcessDialog(true)}
            disabled={processing}
            className="flex items-center gap-2 rounded-xl bg-[#0A1628] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#0A1628]/90 disabled:opacity-50"
          >
            <Calculator className="h-5 w-5" />
            <span className="hidden sm:inline">
              {intl.formatMessage({ id: 'payroll.calculatePayroll', defaultMessage: 'Calculer la Paie' })}
            </span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <X className="h-5 w-5 cursor-pointer" onClick={() => setError(null)} />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-5 w-5 cursor-pointer" onClick={() => setSuccess(null)} />
          {success}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={intl.formatMessage({ id: 'payroll.activeEmployees', defaultMessage: 'Employes actifs' })}
          value={employeesCount}
          subtitle={`${recap?.global?.nombreEmployes || 0} ${intl.formatMessage({ id: 'payroll.treatedThisMonth', defaultMessage: 'traites ce mois' })}`}
          icon={Users}
          colorClass="bg-gradient-to-br from-purple-600 to-indigo-700"
        />
        <KPICard
          title={intl.formatMessage({ id: 'hrDashboard.totalSalary', defaultMessage: 'Masse salariale' })}
          value={formatMontant(recap?.global?.masseSalariale || 0)}
          subtitle={intl.formatMessage({ id: 'payroll.grossSalaries', defaultMessage: 'Salaires bruts' })}
          icon={Wallet}
          colorClass="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <KPICard
          title={intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a payer' })}
          value={formatMontant(recap?.global?.netAPayer || 0)}
          subtitle={intl.formatMessage({ id: 'payroll.totalToDisburse', defaultMessage: 'Total a decaisser' })}
          icon={DollarSign}
          colorClass="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <KPICard
          title={intl.formatMessage({ id: 'payroll.taxCharges', defaultMessage: 'Charges fiscales' })}
          value={formatMontant(recap?.fiscalite?.totalAVerser || 0)}
          subtitle="IPR + CNSS + INPP + ONEM"
          icon={Building}
          colorClass="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: 'payroll.searchEmployee', defaultMessage: 'Rechercher employe...' })}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={statutFilter}
                onChange={(e) => {
                  setStatutFilter(e.target.value);
                  setPage(0);
                }}
                className="rounded-xl border border-gray-200 px-3 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{intl.formatMessage({ id: 'payroll.all', defaultMessage: 'Tous' })}</option>
                <option value="calcule">{intl.formatMessage({ id: 'payroll.calculated', defaultMessage: 'Calcule' })}</option>
                <option value="valide">{intl.formatMessage({ id: 'payroll.validated', defaultMessage: 'Valide' })}</option>
                <option value="paye">{intl.formatMessage({ id: 'payroll.paid', defaultMessage: 'Paye' })}</option>
                <option value="archive">{intl.formatMessage({ id: 'payroll.archived', defaultMessage: 'Archive' })}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#0A1628] px-2.5 py-0.5 text-xs text-white">
                    {selected.length} {intl.formatMessage({ id: 'payroll.selected', defaultMessage: 'selectionnes' })}
                  </span>
                  <button
                    onClick={handleValider}
                    disabled={processing}
                    className="flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-1.5 text-sm text-white hover:bg-yellow-600 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {intl.formatMessage({ id: 'payroll.validate', defaultMessage: 'Valider' })}
                  </button>
                  <button
                    onClick={handlePayer}
                    disabled={processing}
                    className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    <CreditCard className="h-4 w-4" />
                    {intl.formatMessage({ id: 'payroll.pay', defaultMessage: 'Payer' })}
                  </button>
                </div>
              )}

              <button
                onClick={() => setArchiveDialog(true)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <Archive className="h-4 w-4" />
                <span className="hidden sm:inline">{intl.formatMessage({ id: 'payroll.archive', defaultMessage: 'Archiver' })}</span>
              </button>

              <button
                onClick={loadData}
                disabled={loading}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading bar */}
        {loading && (
          <div className="h-1 w-full overflow-hidden bg-gray-200">
            <div className="h-full w-1/2 animate-[shimmer_1s_infinite] bg-[#D4A853]" />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={payrolls.length > 0 && selected.length === payrolls.filter(p => p.statut !== 'archive').length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#D4A853] focus:ring-[#D4A853]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.reference', defaultMessage: 'Reference' })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.employee', defaultMessage: 'Employe' })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.department', defaultMessage: 'Departement' })}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.baseSalary', defaultMessage: 'Salaire base' })}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.bonuses', defaultMessage: 'Primes' })}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.gross', defaultMessage: 'Brut' })}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.withholdings', defaultMessage: 'Retenues' })}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a payer' })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.status', defaultMessage: 'Statut' })}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'payroll.actions', defaultMessage: 'Actions' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payrolls.map((payroll) => {
                const isSelected = selected.includes(payroll.id);
                return (
                  <tr
                    key={payroll.id}
                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelect(payroll.id)}
                        disabled={payroll.statut === 'archive'}
                        className="h-4 w-4 rounded border-gray-300 text-[#D4A853] focus:ring-[#D4A853] disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#0A1628] dark:text-[#D4A853]">
                        {payroll.reference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A1628] text-sm text-white">
                          {payroll.employee?.prenom?.[0]}{payroll.employee?.nom?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {payroll.employee?.prenom} {payroll.employee?.nom}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {payroll.employee?.matricule}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400">
                        {payroll.employee?.departement || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">
                      {formatMontant(payroll.salaireBase)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-400">
                      +{formatMontant(payroll.totalPrimes)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {formatMontant(payroll.salaireBrut)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-red-600 dark:text-red-400">
                      -{formatMontant(payroll.totalRetenuesSalariales)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-green-600 dark:text-green-400">
                      {formatMontant(payroll.netAPayer)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge statut={payroll.statut} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewDetails(payroll)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#0A1628] dark:hover:bg-gray-700 dark:hover:text-[#D4A853]"
                          title={intl.formatMessage({ id: 'payroll.viewDetails', defaultMessage: 'Voir details' })}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/hr/payroll/${payroll.id}`)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title={intl.formatMessage({ id: 'payroll.payslipPdf', defaultMessage: 'Bulletin PDF' })}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {payrolls.length === 0 && !loading && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-3 font-medium text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'payroll.noPayslips', defaultMessage: 'Aucune fiche de paie pour' })} {periodeLabel}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {intl.formatMessage({ id: 'payroll.launchCalculation', defaultMessage: 'Lancez un calcul pour generer les fiches' })}
                    </p>
                    <button
                      onClick={() => setProcessDialog(true)}
                      className="mt-4 flex items-center gap-2 mx-auto rounded-xl bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
                    >
                      <Calculator className="h-4 w-4" />
                      {intl.formatMessage({ id: 'payroll.calculatePayroll', defaultMessage: 'Calculer la Paie' })}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {payrolls.length > 0 && (
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
                {[10, 20, 50, 100].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, total)} sur {total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ProcessDialog
        isOpen={processDialog}
        onClose={() => setProcessDialog(false)}
        onProcess={handleTraiterPaie}
        periodeLabel={periodeLabel}
        employeesCount={employeesCount}
        categories={categories}
        departments={departments}
        processing={processing}
        intl={intl}
      />

      <ArchiveDialog
        isOpen={archiveDialog}
        onClose={() => setArchiveDialog(false)}
        onArchive={handleArchiver}
        periodeLabel={periodeLabel}
        recap={recap}
        processing={processing}
        intl={intl}
      />

      <DetailDialog
        isOpen={detailDialog}
        onClose={() => setDetailDialog(false)}
        payroll={selectedPayroll}
        intl={intl}
        router={router}
      />
    </div>
  );
}
