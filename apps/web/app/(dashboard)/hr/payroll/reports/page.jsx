'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';

import {
  Users,
  Wallet,
  DollarSign,
  Building,
  Calendar,
  RefreshCw,
  Printer,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Gavel,
  HeartPulse,
  Briefcase,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import {
  getRecapitulatifMensuel,
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

// Report Section Component
function ReportSection({ title, icon: Icon, color, children }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-500 dark:bg-blue-900/20',
    green: 'bg-green-50 border-green-500 dark:bg-green-900/20',
    red: 'bg-red-50 border-red-500 dark:bg-red-900/20',
    yellow: 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20',
    purple: 'bg-purple-50 border-purple-500 dark:bg-purple-900/20',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className={`flex items-center gap-2 border-b-2 p-4 ${colorClasses[color]}`}>
        <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-0">
        {children}
      </div>
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

export default function PayrollReportsPage() {
  const intl = useIntl();

  // Period state
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [annee, setAnnee] = useState(currentYear);
  const [mois, setMois] = useState(currentMonth);

  // Data state
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecapitulatifMensuel(annee, mois);
      if (response.success) {
        setRecap(response.data);
      } else {
        setError(response.message || intl.formatMessage({ id: 'common.loadError', defaultMessage: 'Erreur lors du chargement' }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [annee, mois, intl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const periodeLabel = `${getNomMois(mois).charAt(0).toUpperCase() + getNomMois(mois).slice(1)} ${annee}`;

  // Format amount
  const fmt = (val) => {
    if (val === null || val === undefined || val === '') return '0,00';
    const num = parseFloat(val);
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'payroll.reports', defaultMessage: 'Rapports de Paie' })}
          </h1>
          <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {intl.formatMessage({ id: 'payroll.reportsAndAnalytics', defaultMessage: 'Recapitulatifs et etats de paie' })} - {periodeLabel}
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
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={loadData}
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

      {recap && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title={intl.formatMessage({ id: 'payroll.treatedStaff', defaultMessage: 'Effectif Traite' })}
              value={recap.global?.nombreEmployes || 0}
              subtitle={intl.formatMessage({ id: 'payroll.employeesWithPayslip', defaultMessage: 'Employes avec bulletin' })}
              icon={Users}
              colorClass="bg-gradient-to-br from-purple-600 to-indigo-700"
            />
            <KPICard
              title={intl.formatMessage({ id: 'payroll.grossPayroll', defaultMessage: 'Masse Salariale Brute' })}
              value={formatMontant(recap.global?.masseSalariale || 0)}
              subtitle={intl.formatMessage({ id: 'payroll.totalGrossSalaries', defaultMessage: 'Total salaires bruts' })}
              icon={Wallet}
              colorClass="bg-gradient-to-br from-blue-500 to-cyan-600"
            />
            <KPICard
              title={intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a Payer' })}
              value={formatMontant(recap.global?.netAPayer || 0)}
              subtitle={intl.formatMessage({ id: 'payroll.totalToDisburse', defaultMessage: 'Total a decaisser' })}
              icon={DollarSign}
              colorClass="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <KPICard
              title={intl.formatMessage({ id: 'payroll.totalEmployerCostLabel', defaultMessage: 'Cout Total Employeur' })}
              value={formatMontant(recap.global?.coutTotal || 0)}
              subtitle={intl.formatMessage({ id: 'payroll.salariesAndCharges', defaultMessage: 'Salaires + Charges patronales' })}
              icon={Building}
              colorClass="bg-gradient-to-br from-orange-500 to-amber-600"
            />
          </div>

          {/* Tabs */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 print:border-0 print:shadow-none">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 p-4 dark:border-gray-700 print:hidden">
              <TabButton
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
                icon={BarChart3}
                label={intl.formatMessage({ id: 'payroll.globalSummary', defaultMessage: 'Resume Global' })}
              />
              <TabButton
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                icon={Gavel}
                label={intl.formatMessage({ id: 'payroll.taxesAndContributions', defaultMessage: 'Cotisations & Impots' })}
              />
              <TabButton
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                icon={Building}
                label={intl.formatMessage({ id: 'payroll.byDepartment', defaultMessage: 'Par Departement' })}
              />
              <TabButton
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
                icon={Briefcase}
                label={intl.formatMessage({ id: 'payroll.byCategory', defaultMessage: 'Par Categorie' })}
              />
            </div>

            {/* Tab 0: Global Summary */}
            {activeTab === 0 && (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* General Summary */}
                  <ReportSection
                    title={intl.formatMessage({ id: 'payroll.generalSummary', defaultMessage: 'Recapitulatif General' })}
                    icon={FileText}
                    color="blue"
                  >
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.employeeCount', defaultMessage: 'Nombre d\'employes' })}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{recap.global?.nombreEmployes || 0}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalBaseSalaries', defaultMessage: 'Total Salaires de Base' })}</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.global?.masseSalariale)} USD</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalBonuses', defaultMessage: 'Total Primes' })}</td>
                          <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">+{fmt(recap.global?.totalPrimes)} USD</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalAllowances', defaultMessage: 'Total Indemnites' })}</td>
                          <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">+{fmt(recap.global?.totalIndemnites)} USD</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.grossSalaryTotal', defaultMessage: 'SALAIRE BRUT TOTAL' })}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{fmt(recap.global?.masseSalariale)} USD</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.totalEmployeeDeductions', defaultMessage: 'Total Retenues Salariales' })}</td>
                          <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">-{fmt(recap.global?.totalRetenues)} USD</td>
                        </tr>
                        <tr className="bg-green-50 dark:bg-green-900/20">
                          <td className="px-4 py-3 font-bold text-green-700 dark:text-green-400">{intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'NET A PAYER' })}</td>
                          <td className="px-4 py-3 text-right text-lg font-bold text-green-700 dark:text-green-400">{fmt(recap.global?.netAPayer)} USD</td>
                        </tr>
                      </tbody>
                    </table>
                  </ReportSection>

                  {/* Employer Charges */}
                  <ReportSection
                    title={intl.formatMessage({ id: 'payroll.employerCharges', defaultMessage: 'Charges Patronales' })}
                    icon={Building}
                    color="yellow"
                  >
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'payroll.cnssEmployer', defaultMessage: 'CNSS Employeur' })} (9%)</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.global?.cnssEmployeur)} USD</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">INPP (1%)</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.global?.inppEmployeur)} USD</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">ONEM (0.2%)</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.global?.onemEmployeur)} USD</td>
                        </tr>
                        <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                          <td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">{intl.formatMessage({ id: 'payroll.totalEmployerCharges', defaultMessage: 'TOTAL CHARGES PATRONALES' })}</td>
                          <td className="px-4 py-3 text-right font-bold text-yellow-700 dark:text-yellow-400">{fmt(recap.global?.chargesPatronales)} USD</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.totalEmployerCostLabel', defaultMessage: 'COUT TOTAL EMPLOYEUR' })}</td>
                          <td className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">{fmt(recap.global?.coutTotal)} USD</td>
                        </tr>
                      </tbody>
                    </table>
                  </ReportSection>
                </div>
              </div>
            )}

            {/* Tab 1: Taxes & Contributions */}
            {activeTab === 1 && (
              <div className="p-6">
                <ReportSection
                  title={intl.formatMessage({ id: 'payroll.taxAndSocialDeclarations', defaultMessage: 'Declarations Fiscales et Sociales' })}
                  icon={Gavel}
                  color="red"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.organization', defaultMessage: 'Organisme' })}</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.type', defaultMessage: 'Type' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.employeePart', defaultMessage: 'Part Salariale' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.employerPart', defaultMessage: 'Part Patronale' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.totalToPay', defaultMessage: 'Total a Verser' })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* IPR */}
                        <tr>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <Gavel className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">DGI - Direction Generale des Impots</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">IPR (Impot Professionnel sur les Remunerations)</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">{fmt(recap.fiscalite?.ipr)} USD</td>
                          <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">-</td>
                          <td className="px-4 py-3 text-right font-bold text-red-600 dark:text-red-400">{fmt(recap.fiscalite?.ipr)} USD</td>
                        </tr>

                        {/* CNSS */}
                        <tr>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <HeartPulse className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">CNSS - Caisse Nationale de Securite Sociale</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Cotisations Sociales (5% + 9%)</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.fiscalite?.cnssEmploye)} USD</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.fiscalite?.cnssEmployeur)} USD</td>
                          <td className="px-4 py-3 text-right font-bold text-blue-600 dark:text-blue-400">{fmt(recap.fiscalite?.cnssTotal)} USD</td>
                        </tr>

                        {/* INPP */}
                        <tr>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">INPP - Institut National de Preparation Professionnelle</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Formation Professionnelle (1%)</td>
                          <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">-</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.fiscalite?.inpp)} USD</td>
                          <td className="px-4 py-3 text-right font-bold text-yellow-600 dark:text-yellow-400">{fmt(recap.fiscalite?.inpp)} USD</td>
                        </tr>

                        {/* ONEM */}
                        <tr>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">ONEM - Office National de l'Emploi</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Cotisation Emploi (0.2%)</td>
                          <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">-</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(recap.fiscalite?.onem)} USD</td>
                          <td className="px-4 py-3 text-right font-bold text-purple-600 dark:text-purple-400">{fmt(recap.fiscalite?.onem)} USD</td>
                        </tr>

                        {/* Total */}
                        <tr className="bg-red-50 dark:bg-red-900/20">
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-white" colSpan={2}>
                            {intl.formatMessage({ id: 'payroll.totalToPayOrganizations', defaultMessage: 'TOTAL A VERSER AUX ORGANISMES' })}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                            {fmt((recap.fiscalite?.cnssEmploye || 0) + (recap.fiscalite?.ipr || 0))} USD
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                            {fmt((recap.fiscalite?.cnssEmployeur || 0) + (recap.fiscalite?.inpp || 0) + (recap.fiscalite?.onem || 0))} USD
                          </td>
                          <td className="px-4 py-3 text-right text-xl font-bold text-red-700 dark:text-red-400">
                            {fmt(recap.fiscalite?.totalAVerser)} USD
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </ReportSection>

                {/* Summary Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
                    <Gavel className="mx-auto h-10 w-10 text-red-600 dark:text-red-400" />
                    <p className="mt-4 text-3xl font-bold text-red-700 dark:text-red-400">{fmt(recap.fiscalite?.ipr)} USD</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">IPR a declarer a la DGI</p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-800 dark:bg-blue-900/20">
                    <HeartPulse className="mx-auto h-10 w-10 text-blue-600 dark:text-blue-400" />
                    <p className="mt-4 text-3xl font-bold text-blue-700 dark:text-blue-400">{fmt(recap.fiscalite?.cnssTotal)} USD</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Cotisations CNSS (Salarie + Employeur)</p>
                  </div>
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-800 dark:bg-yellow-900/20">
                    <TrendingUp className="mx-auto h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                    <p className="mt-4 text-3xl font-bold text-yellow-700 dark:text-yellow-400">{fmt((recap.fiscalite?.inpp || 0) + (recap.fiscalite?.onem || 0))} USD</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">INPP + ONEM</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: By Department */}
            {activeTab === 2 && (
              <div className="p-6">
                <ReportSection
                  title={intl.formatMessage({ id: 'payroll.distributionByDepartment', defaultMessage: 'Repartition par Departement' })}
                  icon={Building}
                  color="blue"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.department', defaultMessage: 'Departement' })}</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.headcount', defaultMessage: 'Effectif' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.grossPayroll', defaultMessage: 'Masse Salariale' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a Payer' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">% {intl.formatMessage({ id: 'payroll.ofTotal', defaultMessage: 'du Total' })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recap.parDepartement?.map((dept, index) => {
                          const total = parseFloat(recap.global?.masseSalariale) || 1;
                          const pct = ((parseFloat(dept.masse_salariale) || 0) / total * 100).toFixed(1);
                          return (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">{dept.departement || 'Non defini'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="rounded-full bg-[#0A1628] px-2.5 py-0.5 text-xs text-white">{dept.nombre}</span>
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(dept.masse_salariale)} USD</td>
                              <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">{fmt(dept.net_a_payer)} USD</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      className="h-full bg-blue-500"
                                      style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                                    />
                                  </div>
                                  <span className="w-12 text-right font-semibold text-gray-900 dark:text-white">{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {(!recap.parDepartement || recap.parDepartement.length === 0) && (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                              {intl.formatMessage({ id: 'common.noData', defaultMessage: 'Aucune donnee disponible' })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </ReportSection>
              </div>
            )}

            {/* Tab 3: By Category */}
            {activeTab === 3 && (
              <div className="p-6">
                <ReportSection
                  title={intl.formatMessage({ id: 'payroll.distributionByCategory', defaultMessage: 'Repartition par Categorie' })}
                  icon={Briefcase}
                  color="purple"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Code</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.category', defaultMessage: 'Categorie' })}</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.headcount', defaultMessage: 'Effectif' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.grossPayroll', defaultMessage: 'Masse Salariale' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'Net a Payer' })}</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">% {intl.formatMessage({ id: 'payroll.ofTotal', defaultMessage: 'du Total' })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recap.parCategorie?.map((cat, index) => {
                          const total = parseFloat(recap.global?.masseSalariale) || 1;
                          const pct = ((parseFloat(cat.masse_salariale) || 0) / total * 100).toFixed(1);
                          return (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3">
                                <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400">
                                  {cat.code || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{cat.nom || 'Non categorise'}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                  {cat.nombre}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{fmt(cat.masse_salariale)} USD</td>
                              <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">{fmt(cat.net_a_payer)} USD</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      className="h-full bg-purple-500"
                                      style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                                    />
                                  </div>
                                  <span className="w-12 text-right font-semibold text-gray-900 dark:text-white">{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {(!recap.parCategorie || recap.parCategorie.length === 0) && (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                              {intl.formatMessage({ id: 'common.noData', defaultMessage: 'Aucune donnee disponible' })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </ReportSection>
              </div>
            )}
          </div>
        </>
      )}

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
