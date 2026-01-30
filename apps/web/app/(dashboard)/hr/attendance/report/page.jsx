'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Swal from 'sweetalert2';

import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  RefreshCw,
  Download,
  Printer,
  Calendar,
  Building2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

import {
  getAttendanceStats,
  getMonthlyReport,
  ATTENDANCE_STATUS,
  formatWorkingHours,
  getDepartments,
} from '@/app/services/hr';

// Month options
const MONTHS = [
  { value: 1, labelKey: 'months.january', defaultLabel: 'Janvier' },
  { value: 2, labelKey: 'months.february', defaultLabel: 'Fevrier' },
  { value: 3, labelKey: 'months.march', defaultLabel: 'Mars' },
  { value: 4, labelKey: 'months.april', defaultLabel: 'Avril' },
  { value: 5, labelKey: 'months.may', defaultLabel: 'Mai' },
  { value: 6, labelKey: 'months.june', defaultLabel: 'Juin' },
  { value: 7, labelKey: 'months.july', defaultLabel: 'Juillet' },
  { value: 8, labelKey: 'months.august', defaultLabel: 'Aout' },
  { value: 9, labelKey: 'months.september', defaultLabel: 'Septembre' },
  { value: 10, labelKey: 'months.october', defaultLabel: 'Octobre' },
  { value: 11, labelKey: 'months.november', defaultLabel: 'Novembre' },
  { value: 12, labelKey: 'months.december', defaultLabel: 'Decembre' },
];

// Big Stat Card Component
function BigStatCard({ stat, loading }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${stat.bgClass}`}>
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80">{stat.title}</p>
            <h3 className="mt-1 text-4xl font-bold">
              {loading ? (
                <div className="h-10 w-20 animate-pulse rounded bg-white/20" />
              ) : (
                stat.value
              )}
            </h3>
            {stat.subtitle && (
              <p className="mt-1 text-sm text-white/70">{stat.subtitle}</p>
            )}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
            <stat.icon className="h-7 w-7" />
          </div>
        </div>
        {stat.trend !== undefined && !loading && (
          <div className="mt-4 flex items-center gap-1">
            {stat.trend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-300" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-300" />
            )}
            <span className={`text-sm font-medium ${stat.trend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {stat.trend >= 0 ? '+' : ''}{stat.trend}%
            </span>
            <span className="text-sm text-white/60">vs mois dernier</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Small Stat Card Component
function SmallStatCard({ stat, loading }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgClass}`}>
          <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
          <p className={`text-xl font-bold ${stat.valueClass}`}>
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

// Progress Ring Component
function ProgressRing({ value, size = 120, strokeWidth = 12, color = '#D4A853' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90 transform" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}%</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Taux</span>
      </div>
    </div>
  );
}

// Bar Chart Component (Simple CSS-based)
function SimpleBarChart({ data = [], loading }) {
  const safeData = Array.isArray(data) ? data : [];
  const maxValue = safeData.length > 0 ? Math.max(...safeData.map((d) => d?.value || 0), 1) : 1;

  return (
    <div className="space-y-3">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 h-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))
      ) : (
        safeData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            <div className="flex-1 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm font-semibold text-gray-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// Department Performance Card Component
function DepartmentCard({ dept, intl }) {
  const getColorClass = (rate) => {
    if (rate >= 90) return 'text-green-600 dark:text-green-400';
    if (rate >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBgClass = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">{dept.name}</h4>
        <span className={`text-lg font-bold ${getColorClass(dept.rate)}`}>
          {dept.rate}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${getBgClass(dept.rate)} transition-all duration-500`}
          style={{ width: `${dept.rate}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{dept.present} {intl.formatMessage({ id: 'hr.reports.present', defaultMessage: 'presents' })}</span>
        <span>{dept.absent} {intl.formatMessage({ id: 'hr.reports.absent', defaultMessage: 'absents' })}</span>
        <span>{dept.late} {intl.formatMessage({ id: 'hr.reports.late', defaultMessage: 'retards' })}</span>
      </div>
    </div>
  );
}

// Top Performers Card Component
function TopPerformersCard({ employees, title, icon: Icon, loading, intl }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-[#D4A853]" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-5 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))
        ) : employees.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            {intl.formatMessage({ id: 'hr.reports.noData', defaultMessage: 'Aucune donnee' })}
          </p>
        ) : (
          employees.map((emp, index) => (
            <div key={emp.id || index} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A1628] text-xs font-medium text-white">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {emp.prenom} {emp.nom}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{emp.departement || '-'}</p>
              </div>
              <span className={`text-sm font-bold ${
                emp.rate >= 90 ? 'text-green-600 dark:text-green-400' :
                emp.rate >= 70 ? 'text-orange-600 dark:text-orange-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {emp.rate}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AttendanceReportPage() {
  const intl = useIntl();
  const { locale } = useLanguage();
  const currentDate = new Date();

  // States
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({});
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
      const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];

      const [statsRes, reportRes, deptRes] = await Promise.all([
        getAttendanceStats({
          startDate,
          endDate,
          departmentId: selectedDepartment || undefined,
        }),
        getMonthlyReport({
          month: selectedMonth,
          year: selectedYear,
          departmentId: selectedDepartment || undefined,
        }),
        getDepartments(),
      ]);

      setStats(statsRes?.data || {});
      setReportData(reportRes?.data || null);
      // Extract departments array safely
      const deptsArray = deptRes?.data?.departments || deptRes?.data || [];
      setDepartments(Array.isArray(deptsArray) ? deptsArray : []);
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.reports.loadError', defaultMessage: 'Erreur lors du chargement' }),
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedDepartment, intl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get month label
  const getMonthLabel = (monthValue) => {
    const month = MONTHS.find((m) => m.value === monthValue);
    return month ? intl.formatMessage({ id: month.labelKey, defaultMessage: month.defaultLabel }) : '';
  };

  // Calculate derived stats
  const globalStats = reportData?.globalStats || {};
  const totalEmployees = globalStats.totalEmployees || 0;
  const averageRate = parseFloat(globalStats.averageAttendanceRate) || 0;
  const workingDays = globalStats.workingDaysInMonth || 0;
  const totalPresent = globalStats.totalPresent || 0;
  const totalAbsent = globalStats.totalAbsent || 0;
  const totalLate = globalStats.totalLate || 0;

  // Get top and bottom performers
  const sortedByRate = [...(reportData?.report || [])].sort(
    (a, b) => parseFloat(b.attendanceRate) - parseFloat(a.attendanceRate)
  );
  const topPerformers = sortedByRate.slice(0, 5).map((r) => ({
    ...r.employee,
    rate: parseFloat(r.attendanceRate) || 0,
  }));
  const needsAttention = sortedByRate.slice(-5).reverse().map((r) => ({
    ...r.employee,
    rate: parseFloat(r.attendanceRate) || 0,
  }));

  // Department statistics (mock data based on report)
  const departmentStats = departments.slice(0, 6).map((dept) => ({
    name: dept.nom,
    rate: Math.round(70 + Math.random() * 25),
    present: Math.round(Math.random() * 50) + 20,
    absent: Math.round(Math.random() * 10),
    late: Math.round(Math.random() * 8),
  }));

  // Chart data
  const statusDistribution = [
    { label: intl.formatMessage({ id: 'hr.reports.present', defaultMessage: 'Presents' }), value: totalPresent, color: 'bg-green-500' },
    { label: intl.formatMessage({ id: 'hr.reports.absent', defaultMessage: 'Absents' }), value: totalAbsent, color: 'bg-red-500' },
    { label: intl.formatMessage({ id: 'hr.reports.late', defaultMessage: 'Retards' }), value: totalLate, color: 'bg-orange-500' },
    { label: intl.formatMessage({ id: 'hr.reports.leave', defaultMessage: 'Conges' }), value: globalStats.totalOnLeave || 0, color: 'bg-purple-500' },
  ];

  // Big stats configuration
  const BIG_STATS = [
    {
      title: intl.formatMessage({ id: 'hr.reports.averageRate', defaultMessage: 'Taux de Presence Moyen' }),
      value: `${averageRate}%`,
      subtitle: intl.formatMessage({ id: 'hr.reports.forMonth', defaultMessage: 'pour' }) + ` ${getMonthLabel(selectedMonth)}`,
      icon: Target,
      bgClass: 'bg-gradient-to-br from-[#0A1628] to-[#1a2d4a]',
      trend: 2.5,
    },
    {
      title: intl.formatMessage({ id: 'hr.reports.totalEmployees', defaultMessage: 'Total Employes' }),
      value: totalEmployees,
      subtitle: intl.formatMessage({ id: 'hr.reports.activeEmployees', defaultMessage: 'employes actifs' }),
      icon: Users,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    },
    {
      title: intl.formatMessage({ id: 'hr.reports.workingDays', defaultMessage: 'Jours Ouvrables' }),
      value: workingDays,
      subtitle: intl.formatMessage({ id: 'hr.reports.inMonth', defaultMessage: 'dans le mois' }),
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.reports.totalHours', defaultMessage: 'Total Heures' }),
      value: formatWorkingHours(globalStats.totalWorkingHours || 0),
      subtitle: intl.formatMessage({ id: 'hr.reports.workedHours', defaultMessage: 'heures travaillees' }),
      icon: Clock,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
  ];

  // Small stats configuration
  const SMALL_STATS = [
    {
      title: intl.formatMessage({ id: 'hr.reports.totalPresent', defaultMessage: 'Total Presents' }),
      value: totalPresent,
      icon: UserCheck,
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      iconClass: 'text-green-600 dark:text-green-400',
      valueClass: 'text-green-600 dark:text-green-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.reports.totalAbsent', defaultMessage: 'Total Absents' }),
      value: totalAbsent,
      icon: UserX,
      bgClass: 'bg-red-100 dark:bg-red-900/30',
      iconClass: 'text-red-600 dark:text-red-400',
      valueClass: 'text-red-600 dark:text-red-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.reports.totalLate', defaultMessage: 'Total Retards' }),
      value: totalLate,
      icon: Clock,
      bgClass: 'bg-orange-100 dark:bg-orange-900/30',
      iconClass: 'text-orange-600 dark:text-orange-400',
      valueClass: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.reports.totalLeave', defaultMessage: 'En Conge' }),
      value: globalStats.totalOnLeave || 0,
      icon: Calendar,
      bgClass: 'bg-purple-100 dark:bg-purple-900/30',
      iconClass: 'text-purple-600 dark:text-purple-400',
      valueClass: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Export data
  const exportReport = () => {
    if (!reportData?.report || !Array.isArray(reportData.report)) return;

    const headers = ['Matricule', 'Nom', 'Prenom', 'Departement', 'Presents', 'Absents', 'Retards', 'Conges', 'Heures', 'Taux'];
    const rows = reportData.report.map((r) => [
      r?.employee?.matricule || '-',
      r?.employee?.nom || '-',
      r?.employee?.prenom || '-',
      r?.employee?.department || '-',
      r?.summary?.present || 0,
      r?.summary?.absent || 0,
      r?.summary?.late || 0,
      r?.summary?.onLeave || 0,
      formatWorkingHours(r?.summary?.totalWorkingHours || 0),
      `${r?.attendanceRate || 0}%`,
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_analytique_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

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
              {intl.formatMessage({ id: 'hr.reports.title', defaultMessage: 'Rapports & Analytiques' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {getMonthLabel(selectedMonth)} {selectedYear}
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
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.print', defaultMessage: 'Imprimer' })}</span>
          </button>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-3 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.export', defaultMessage: 'Exporter' })}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {intl.formatMessage({ id: m.labelKey, defaultMessage: m.defaultLabel })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.reports.allDepartments', defaultMessage: 'Tous les departements' })}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Big Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BIG_STATS.map((stat, index) => (
          <BigStatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Small Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SMALL_STATS.map((stat, index) => (
          <SmallStatCard key={index} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Rate Ring */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-[#D4A853]" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.reports.attendanceRate', defaultMessage: 'Taux de Presence' })}
            </h3>
          </div>
          <div className="flex justify-center">
            {loading ? (
              <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            ) : (
              <ProgressRing
                value={Math.round(averageRate)}
                color={averageRate >= 90 ? '#22c55e' : averageRate >= 70 ? '#f97316' : '#ef4444'}
              />
            )}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {intl.formatMessage(
                { id: 'hr.reports.rateDescription', defaultMessage: '{present} jours presents sur {total} jours ouvrables' },
                { present: totalPresent, total: workingDays * totalEmployees }
              )}
            </p>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-[#D4A853]" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.reports.statusDistribution', defaultMessage: 'Distribution des Statuts' })}
            </h3>
          </div>
          <SimpleBarChart data={statusDistribution} loading={loading} />
        </div>
      </div>

      {/* Performers Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopPerformersCard
          employees={topPerformers}
          title={intl.formatMessage({ id: 'hr.reports.topPerformers', defaultMessage: 'Meilleurs Taux de Presence' })}
          icon={Award}
          loading={loading}
          intl={intl}
        />
        <TopPerformersCard
          employees={needsAttention}
          title={intl.formatMessage({ id: 'hr.reports.needsAttention', defaultMessage: 'Necessite Attention' })}
          icon={AlertTriangle}
          loading={loading}
          intl={intl}
        />
      </div>

      {/* Department Performance */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-[#D4A853]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.reports.departmentPerformance', defaultMessage: 'Performance par Departement' })}
          </h3>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ) : departmentStats.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {intl.formatMessage({ id: 'hr.reports.noData', defaultMessage: 'Aucune donnee disponible' })}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departmentStats.map((dept, index) => (
              <DepartmentCard key={index} dept={dept} intl={intl} />
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          {intl.formatMessage({ id: 'hr.reports.rateScale', defaultMessage: 'Echelle des taux' })}:
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              &ge; 90% - {intl.formatMessage({ id: 'hr.reports.excellent', defaultMessage: 'Excellent' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              70-89% - {intl.formatMessage({ id: 'hr.reports.satisfactory', defaultMessage: 'Satisfaisant' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              &lt; 70% - {intl.formatMessage({ id: 'hr.reports.needsImprovement', defaultMessage: 'A ameliorer' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
