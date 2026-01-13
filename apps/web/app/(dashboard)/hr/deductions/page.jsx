'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  TrendingDown,
  Users,
  User,
  Calendar,
  RefreshCw,
  Plus,
  ChevronRight,
  DollarSign,
  Percent,
  MinusCircle,
} from 'lucide-react';

import {
  getDeductions,
  getDeductionStats,
  formatDeductionAmount,
} from '@/app/services/hr/deductionService';
import { formatBonusPeriod } from '@/app/services/hr/bonusService';
import { getPhotoUrl } from '@/app/services/hr/employeeService';

// Stat Card Component
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

// Quick Action Card Component
function QuickActionCard({ title, subtitle, icon: Icon, href, color }) {
  const colorClasses = {
    success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

// Status Badge Component
function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
      }`}
    >
      {active ? 'Actif' : 'Inactif'}
    </span>
  );
}

// Type Badge Component
function TypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        type === 'fixe'
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      }`}
    >
      {type === 'fixe' ? <DollarSign className="h-3 w-3" /> : <Percent className="h-3 w-3" />}
      {type === 'fixe' ? 'Fixe' : '%'}
    </span>
  );
}

// Month name helper
const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
];

const getMonthName = (month) => {
  return MONTHS[(month - 1) % 12] || `Mois ${month}`;
};

export default function DeductionsDashboardPage() {
  const intl = useIntl();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [deductionStats, setDeductionStats] = useState(null);
  const [recentDeductions, setRecentDeductions] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [deductionStatsRes, deductionsRes] = await Promise.all([
        getDeductionStats(selectedYear),
        getDeductions({ limit: 10, annee: selectedYear }),
      ]);

      if (deductionStatsRes.success) setDeductionStats(deductionStatsRes.data);
      if (deductionsRes.success) setRecentDeductions(deductionsRes.data?.data || deductionsRes.data || []);
    } catch (error) {
      console.error('Erreur chargement donnees:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Stats configuration
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.deductions.totalDeductions', defaultMessage: 'Total Reductions' }),
      value: deductionStats?.totalDeductions || 0,
      icon: TrendingDown,
      bgClass: 'bg-gradient-to-br from-red-500 to-rose-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.deductions.thisMonth', defaultMessage: 'Ce mois' }),
      value: deductionStats?.deductionsThisMonth || 0,
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-orange-500 to-amber-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.deductions.generalDeductions', defaultMessage: 'Reductions Generales' }),
      value: deductionStats?.generalDeductions || 0,
      icon: Users,
      bgClass: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.deductions.totalAmount', defaultMessage: 'Montant Total' }),
      value: formatCurrency(deductionStats?.totalFixeAmount),
      icon: DollarSign,
      bgClass: 'bg-gradient-to-br from-gray-600 to-gray-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.deductions.title', defaultMessage: 'Reductions' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.deductions.subtitle', defaultMessage: 'Gestion des reductions sur salaire' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickActionCard
          title={intl.formatMessage({ id: 'hr.deductions.generalDeductions', defaultMessage: 'Reductions Generales' })}
          subtitle={intl.formatMessage({ id: 'hr.deductions.byCategory', defaultMessage: 'Par categorie' })}
          icon={Users}
          href="/hr/deductions/general"
          color="error"
        />
        <QuickActionCard
          title={intl.formatMessage({ id: 'hr.deductions.individualDeductions', defaultMessage: 'Reductions Individuelles' })}
          subtitle={intl.formatMessage({ id: 'hr.deductions.byEmployee', defaultMessage: 'Par employe' })}
          icon={User}
          href="/hr/deductions/individual"
          color="warning"
        />
      </div>

      {/* Recent Deductions */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <MinusCircle className="h-5 w-5 text-red-500" />
            {intl.formatMessage({ id: 'hr.deductions.recentDeductions', defaultMessage: 'Reductions Recentes' })}
            <span className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {recentDeductions.length}
            </span>
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.reference', defaultMessage: 'Reference' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.concern', defaultMessage: 'Concerne' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.deduction', defaultMessage: 'Reduction' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.type', defaultMessage: 'Type' })}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.amount', defaultMessage: 'Montant' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.period', defaultMessage: 'Periode' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.status', defaultMessage: 'Statut' })}
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
              ) : recentDeductions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <TrendingDown className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.deductions.noDeductions', defaultMessage: 'Aucune reduction trouvee' })} {selectedYear}
                    </p>
                    <button
                      onClick={() => router.push('/hr/deductions/individual')}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
                    >
                      <Plus className="h-4 w-4" />
                      {intl.formatMessage({ id: 'hr.deductions.addDeduction', defaultMessage: 'Ajouter une reduction' })}
                    </button>
                  </td>
                </tr>
              ) : (
                recentDeductions.map((deduction) => (
                  <tr key={deduction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{deduction.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                          {deduction.employee?.photo ? (
                            <img src={getPhotoUrl(deduction.employee.photo)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium">
                              {deduction.employee
                                ? `${deduction.employee.prenom?.[0] || ''}${deduction.employee.nom?.[0] || ''}`
                                : deduction.category
                                  ? 'C'
                                  : '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {deduction.employee
                              ? `${deduction.employee.prenom || ''} ${deduction.employee.nom || ''}`
                              : deduction.category
                                ? deduction.category.nom
                                : 'Generale'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {deduction.employee ? deduction.employee.matricule : deduction.category?.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{deduction.nom}</td>
                    <td className="px-6 py-4 text-center">
                      <TypeBadge type={deduction.type} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-red-600 dark:text-red-400">
                      -{formatDeductionAmount(deduction)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {formatBonusPeriod(deduction, getMonthName)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge active={deduction.actif} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
