'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

import {
  Archive,
  Calendar,
  Users,
  DollarSign,
  Building,
  Gavel,
  RefreshCw,
  Printer,
  Eye,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Lock,
  TrendingUp,
  HeartPulse,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import {
  getArchives,
  formatMontant,
  getNomMois,
} from '@/app/services/hr/payrollService';

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

// Month Card Component for Calendar View
function MonthCard({ mois, annee, archive, onClick }) {
  const nomMois = getNomMois(mois);
  const isArchived = !!archive;
  const isPast = new Date(annee, mois - 1) < new Date(new Date().getFullYear(), new Date().getMonth());

  return (
    <div
      onClick={() => isArchived && onClick && onClick(archive)}
      className={`rounded-xl border-2 p-4 text-center transition-all ${
        isArchived
          ? 'border-green-500 bg-green-50 cursor-pointer hover:shadow-lg hover:-translate-y-1 dark:bg-green-900/20 dark:border-green-600'
          : isPast
            ? 'border-dashed border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10'
            : 'border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800/50'
      }`}
    >
      <p className={`text-sm font-semibold ${isArchived ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {nomMois.charAt(0).toUpperCase() + nomMois.slice(1)}
      </p>

      {isArchived ? (
        <>
          <CheckCircle className="mx-auto my-2 h-7 w-7 text-green-600 dark:text-green-400" />
          <p className="text-xs font-medium text-green-700 dark:text-green-400">{archive.nombreEmployes} emp.</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatMontant(archive.totalNetAPayer)}</p>
        </>
      ) : isPast ? (
        <>
          <Clock className="mx-auto my-2 h-7 w-7 text-yellow-500 dark:text-yellow-400" />
          <p className="text-xs text-yellow-600 dark:text-yellow-400">Non archive</p>
        </>
      ) : (
        <>
          <Lock className="mx-auto my-2 h-7 w-7 text-gray-400 dark:text-gray-500" />
          <p className="text-xs text-gray-400 dark:text-gray-500">A venir</p>
        </>
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-[#0A1628] text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function PayrollArchivesPage() {
  const router = useRouter();
  const intl = useIntl();

  // State
  const currentYear = new Date().getFullYear();
  const [annee, setAnnee] = useState(currentYear);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Load archives
  const loadArchives = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getArchives({
        annee,
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response.success) {
        setArchives(response.data || []);
        setTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [annee, page, rowsPerPage]);

  useEffect(() => {
    loadArchives();
  }, [loadArchives]);

  // Calculate annual totals
  const totauxAnnuels = archives.reduce((acc, arch) => ({
    employes: acc.employes + (arch.nombreEmployes || 0),
    masseSalariale: acc.masseSalariale + parseFloat(arch.totalSalaireBrut || 0),
    netTotal: acc.netTotal + parseFloat(arch.totalNetAPayer || 0),
    chargesPatronales: acc.chargesPatronales + parseFloat(arch.totalChargesPatronales || 0),
    ipr: acc.ipr + parseFloat(arch.fiscaliteAVerser?.ipr || 0),
    cnssEmploye: acc.cnssEmploye + parseFloat(arch.fiscaliteAVerser?.cnss_employe || 0),
    cnssEmployeur: acc.cnssEmployeur + parseFloat(arch.fiscaliteAVerser?.cnss_employeur || 0),
    inpp: acc.inpp + parseFloat(arch.fiscaliteAVerser?.inpp || 0),
    onem: acc.onem + parseFloat(arch.fiscaliteAVerser?.onem || 0),
    fiscalite: acc.fiscalite + parseFloat(arch.fiscaliteAVerser?.total || 0),
  }), { employes: 0, masseSalariale: 0, netTotal: 0, chargesPatronales: 0, ipr: 0, cnssEmploye: 0, cnssEmployeur: 0, inpp: 0, onem: 0, fiscalite: 0 });

  // Map archives by month for calendar view
  const archivesByMonth = {};
  archives.forEach(a => {
    archivesByMonth[a.mois] = a;
  });

  // Navigate to archive detail
  const handleViewArchive = (archive) => {
    router.push(`/hr/payroll/archives/${archive.id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  // Format amount
  const fmt = (val) => {
    if (val === null || val === undefined || val === '') return '0,00';
    const num = parseFloat(val);
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Archive className="h-7 w-7 text-[#D4A853]" />
            {intl.formatMessage({ id: 'payroll.payrollArchives', defaultMessage: 'Archives de Paie' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'payroll.archiveHistory', defaultMessage: 'Historique et recapitulatifs des paies archivees' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={annee}
            onChange={(e) => setAnnee(parseInt(e.target.value))}
            className="rounded-xl border border-gray-200 px-3 py-2 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {[currentYear - 3, currentYear - 2, currentYear - 1, currentYear].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={loadArchives}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Printer className="h-4 w-4" />
            {intl.formatMessage({ id: 'common.print', defaultMessage: 'Imprimer' })}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="h-1 w-full overflow-hidden rounded bg-gray-200">
          <div className="h-full w-1/2 animate-[shimmer_1s_infinite] bg-[#D4A853]" />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title={intl.formatMessage({ id: 'payroll.archivedMonths', defaultMessage: 'Mois Archives' })}
          value={`${archives.length} / 12`}
          subtitle={`${intl.formatMessage({ id: 'payroll.year', defaultMessage: 'Annee' })} ${annee}`}
          icon={Calendar}
          colorClass="bg-gradient-to-br from-purple-600 to-indigo-700"
        />
        <KPICard
          title={intl.formatMessage({ id: 'payroll.averageHeadcount', defaultMessage: 'Effectif Moyen' })}
          value={archives.length > 0 ? Math.round(totauxAnnuels.employes / archives.length) : 0}
          subtitle={intl.formatMessage({ id: 'payroll.employeesPerMonth', defaultMessage: 'Employes par mois' })}
          icon={Users}
          colorClass="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <KPICard
          title={intl.formatMessage({ id: 'payroll.grossPayroll', defaultMessage: 'Masse Salariale' })}
          value={formatMontant(totauxAnnuels.masseSalariale)}
          subtitle={`Total brut ${annee}`}
          icon={Building}
          colorClass="bg-gradient-to-br from-pink-500 to-rose-600"
        />
        <KPICard
          title={intl.formatMessage({ id: 'payroll.netPaid', defaultMessage: 'Net Paye' })}
          value={formatMontant(totauxAnnuels.netTotal)}
          subtitle={`Total decaisse ${annee}`}
          icon={DollarSign}
          colorClass="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <KPICard
          title={intl.formatMessage({ id: 'payroll.taxesPaid', defaultMessage: 'Fiscalite Versee' })}
          value={formatMontant(totauxAnnuels.fiscalite)}
          subtitle="IPR + CNSS + INPP + ONEM"
          icon={Gavel}
          colorClass="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 print:border-0 print:shadow-none">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 p-4 dark:border-gray-700 print:hidden">
          <TabButton
            active={activeTab === 0}
            onClick={() => setActiveTab(0)}
            icon={Calendar}
            label={intl.formatMessage({ id: 'payroll.calendarView', defaultMessage: 'Vue Calendrier' })}
          />
          <TabButton
            active={activeTab === 1}
            onClick={() => setActiveTab(1)}
            icon={Archive}
            label={intl.formatMessage({ id: 'payroll.detailedList', defaultMessage: 'Liste Detaillee' })}
          />
          <TabButton
            active={activeTab === 2}
            onClick={() => setActiveTab(2)}
            icon={Gavel}
            label={intl.formatMessage({ id: 'payroll.taxSummary', defaultMessage: 'Recapitulatif Fiscal' })}
          />
        </div>

        {/* Tab 0: Calendar View */}
        {activeTab === 0 && (
          <div className="p-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'payroll.archiveCalendar', defaultMessage: 'Calendrier des Archives' })} - {annee}
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: 'payroll.clickArchivedMonth', defaultMessage: 'Cliquez sur un mois archive pour voir les details' })}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(mois => (
                <MonthCard
                  key={mois}
                  mois={mois}
                  annee={annee}
                  archive={archivesByMonth[mois]}
                  onClick={handleViewArchive}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.archived', defaultMessage: 'Archive' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.notArchived', defaultMessage: 'Non archive' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.upcoming', defaultMessage: 'A venir' })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Detailed List */}
        {activeTab === 1 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.reference', defaultMessage: 'Reference' })}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.period', defaultMessage: 'Periode' })}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.employees', defaultMessage: 'Employes' })}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.grossPayroll', defaultMessage: 'Masse Salariale' })}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a Payer' })}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.employerCharges', defaultMessage: 'Charges Patronales' })}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.taxes', defaultMessage: 'Fiscalite' })}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'payroll.archivedOn', defaultMessage: 'Archive le' })}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">{intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {archives.map((archive, index) => (
                  <tr
                    key={archive.id}
                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${index % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <Archive className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{archive.reference}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#0A1628] px-2.5 py-0.5 text-xs font-medium text-[#0A1628] dark:border-[#D4A853] dark:text-[#D4A853]">
                        <Calendar className="h-3 w-3" />
                        {getNomMois(archive.mois).charAt(0).toUpperCase() + getNomMois(archive.mois).slice(1)} {archive.annee}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Users className="h-3 w-3" />
                        {archive.nombreEmployes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                      {formatMontant(archive.totalSalaireBrut)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600 dark:text-green-400">
                      {formatMontant(archive.totalNetAPayer)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                      {formatMontant(archive.totalChargesPatronales)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-orange-600 dark:text-orange-400">
                      {formatMontant(archive.fiscaliteAVerser?.total || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {archive.dateArchivage
                          ? new Date(archive.dateArchivage).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </p>
                      {archive.archivePar && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          par {archive.archivePar.firstName} {archive.archivePar.lastName}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewArchive(archive)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#0A1628] dark:hover:bg-gray-700 dark:hover:text-[#D4A853]"
                          title={intl.formatMessage({ id: 'common.viewDetails', defaultMessage: 'Voir details' })}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/hr/payroll/archives/${archive.id}/pdf`)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title={intl.formatMessage({ id: 'payroll.downloadPdf', defaultMessage: 'Telecharger PDF' })}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {archives.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <Archive className="mx-auto h-16 w-16 text-gray-400" />
                      <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
                        {intl.formatMessage({ id: 'payroll.noArchivesFor', defaultMessage: 'Aucune archive pour' })} {annee}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {intl.formatMessage({ id: 'payroll.archivesWillAppear', defaultMessage: 'Les archives apparaitront ici une fois les mois clotures' })}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {archives.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {intl.formatMessage({ id: 'payroll.archivesPerPage', defaultMessage: 'Archives par page:' })}
                  </span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {[6, 12, 24].map((option) => (
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
        )}

        {/* Tab 2: Tax Summary */}
        {activeTab === 2 && (
          <div className="p-6">
            {archives.length > 0 ? (
              <>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {intl.formatMessage({ id: 'payroll.annualTaxSummary', defaultMessage: 'Recapitulatif Fiscal Annuel' })} - {annee}
                </h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: 'payroll.taxAndSocialSynthesis', defaultMessage: 'Synthese des declarations fiscales et sociales' })}
                </p>

                {/* Tax Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* IPR */}
                  <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                        <Gavel className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">DGI - Direction Generale des Impots</p>
                        <h4 className="font-semibold text-gray-900 dark:text-white">IPR (Impot Professionnel sur Remunerations)</h4>
                      </div>
                    </div>
                    <div className="border-t border-red-200 pt-4 dark:border-red-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total IPR {annee}</span>
                        <span className="text-2xl font-bold text-red-700 dark:text-red-400">{formatMontant(totauxAnnuels.ipr)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CNSS */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <HeartPulse className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">CNSS - Caisse Nationale de Securite Sociale</p>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Cotisations Sociales</h4>
                      </div>
                    </div>
                    <div className="border-t border-blue-200 pt-4 dark:border-blue-700">
                      <table className="w-full text-sm">
                        <tbody className="space-y-2">
                          <tr className="flex justify-between">
                            <td className="text-gray-600 dark:text-gray-400">Part Salariale (5%)</td>
                            <td className="font-medium text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.cnssEmploye)}</td>
                          </tr>
                          <tr className="flex justify-between">
                            <td className="text-gray-600 dark:text-gray-400">Part Patronale (9%)</td>
                            <td className="font-medium text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.cnssEmployeur)}</td>
                          </tr>
                          <tr className="flex justify-between rounded-lg bg-blue-100 px-2 py-1 dark:bg-blue-900/50">
                            <td className="font-semibold text-blue-700 dark:text-blue-400">Total CNSS</td>
                            <td className="font-bold text-blue-700 dark:text-blue-400">{formatMontant(totauxAnnuels.cnssEmploye + totauxAnnuels.cnssEmployeur)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* INPP & ONEM */}
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                        <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Autres Organismes</p>
                        <h4 className="font-semibold text-gray-900 dark:text-white">INPP & ONEM</h4>
                      </div>
                    </div>
                    <div className="border-t border-yellow-200 pt-4 dark:border-yellow-700">
                      <table className="w-full text-sm">
                        <tbody className="space-y-2">
                          <tr className="flex justify-between">
                            <td className="text-gray-600 dark:text-gray-400">INPP - Formation Professionnelle (1%)</td>
                            <td className="font-medium text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.inpp)}</td>
                          </tr>
                          <tr className="flex justify-between">
                            <td className="text-gray-600 dark:text-gray-400">ONEM - Office National Emploi (0.2%)</td>
                            <td className="font-medium text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.onem)}</td>
                          </tr>
                          <tr className="flex justify-between rounded-lg bg-yellow-100 px-2 py-1 dark:bg-yellow-900/50">
                            <td className="font-semibold text-yellow-700 dark:text-yellow-400">Total INPP + ONEM</td>
                            <td className="font-bold text-yellow-700 dark:text-yellow-400">{formatMontant(totauxAnnuels.inpp + totauxAnnuels.onem)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6 dark:bg-green-900/20">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Synthese Annuelle</p>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Total Versements {annee}</h4>
                      </div>
                    </div>
                    <div className="border-t border-green-200 pt-4 text-center dark:border-green-700">
                      <p className="text-4xl font-bold text-green-700 dark:text-green-400">{formatMontant(totauxAnnuels.fiscalite)}</p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">IPR + CNSS + INPP + ONEM</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Detail Table */}
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {intl.formatMessage({ id: 'payroll.monthlyDetail', defaultMessage: 'Detail Mensuel' })}
                </h4>
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.month', defaultMessage: 'Mois' })}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">IPR</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">CNSS {intl.formatMessage({ id: 'payroll.employee', defaultMessage: 'Salarie' })}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">CNSS {intl.formatMessage({ id: 'payroll.employer', defaultMessage: 'Employeur' })}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">INPP</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">ONEM</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {archives.map((archive) => (
                        <tr key={archive.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {getNomMois(archive.mois).charAt(0).toUpperCase() + getNomMois(archive.mois).slice(1)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{formatMontant(archive.fiscaliteAVerser?.ipr || 0)}</td>
                          <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{formatMontant(archive.fiscaliteAVerser?.cnss_employe || 0)}</td>
                          <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{formatMontant(archive.fiscaliteAVerser?.cnss_employeur || 0)}</td>
                          <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{formatMontant(archive.fiscaliteAVerser?.inpp || 0)}</td>
                          <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{formatMontant(archive.fiscaliteAVerser?.onem || 0)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-orange-600 dark:text-orange-400">{formatMontant(archive.fiscaliteAVerser?.total || 0)}</td>
                        </tr>
                      ))}
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">TOTAL {annee}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.ipr)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.cnssEmploye)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.cnssEmployeur)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.inpp)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{formatMontant(totauxAnnuels.onem)}</td>
                        <td className="px-4 py-3 text-right text-lg font-bold text-green-700 dark:text-green-400">{formatMontant(totauxAnnuels.fiscalite)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Gavel className="mx-auto h-16 w-16 text-gray-400" />
                <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
                  {intl.formatMessage({ id: 'payroll.noTaxDataFor', defaultMessage: 'Aucune donnee fiscale pour' })} {annee}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {intl.formatMessage({ id: 'payroll.summariesWillAppear', defaultMessage: 'Les recapitulatifs apparaitront ici une fois les mois archives' })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
