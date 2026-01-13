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
  Check,
  X,
  TrendingUp,
  CalendarOff,
} from 'lucide-react';

import {
  getMonthlyReport,
  ATTENDANCE_STATUS,
  formatWorkingHours,
  getPhotoUrl,
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

// Progress Bar Component
function ProgressBar({ value, color }) {
  const colorClasses = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const getColor = (val) => {
    if (val >= 90) return 'green';
    if (val >= 70) return 'orange';
    return 'red';
  };

  const actualColor = color || getColor(value);

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full ${colorClasses[actualColor]} transition-all`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className={`text-sm font-semibold ${
        actualColor === 'green' ? 'text-green-600 dark:text-green-400' :
        actualColor === 'orange' ? 'text-orange-600 dark:text-orange-400' :
        'text-red-600 dark:text-red-400'
      }`}>
        {value}%
      </span>
    </div>
  );
}

// Day Status Cell Component
function DayStatusCell({ status, dayNum, isWeekend, isFuture }) {
  if (isWeekend) {
    return (
      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
        <span className="text-[10px] font-medium text-white">W</span>
      </div>
    );
  }

  if (isFuture) {
    return (
      <div className="mx-auto h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
    );
  }

  const statusColors = {
    present: 'bg-green-500',
    late: 'bg-orange-500',
    absent: 'bg-red-500',
    half_day: 'bg-blue-500',
    leave: 'bg-purple-500',
  };

  const bgColor = statusColors[status] || 'bg-red-500';

  return (
    <div className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full ${bgColor}`}>
      {status === 'present' && <Check className="h-3 w-3 text-white" />}
      {status === 'late' && <Clock className="h-3 w-3 text-white" />}
      {(status === 'absent' || !status) && <X className="h-3 w-3 text-white" />}
      {status === 'leave' && <CalendarOff className="h-3 w-3 text-white" />}
      {status === 'half_day' && <span className="text-[10px] font-bold text-white">1/2</span>}
    </div>
  );
}

export default function MonthlyAttendancePage() {
  const intl = useIntl();
  const { locale } = useLanguage();
  const currentDate = new Date();

  // States
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reportRes, deptRes] = await Promise.all([
        getMonthlyReport({
          month: selectedMonth,
          year: selectedYear,
          departmentId: selectedDepartment || undefined,
        }),
        getDepartments(),
      ]);

      setReportData(reportRes?.data || null);
      setDepartments(deptRes?.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.attendance.loadError', defaultMessage: 'Erreur lors du chargement' }),
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedDepartment, intl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    const daysCount = new Date(year, month, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  };

  // Check if day is weekend
  const isWeekend = (year, month, day) => {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Get day status for employee
  const getDayStatus = (details, dayNum) => {
    if (!details) return null;
    const targetDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayDetail = details.find((d) => d.date === targetDate);
    return dayDetail?.status || null;
  };

  // Filter report by search
  const filteredReport = (reportData?.report || []).filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const fullName = `${row.employee.prenom} ${row.employee.nom}`.toLowerCase();
    const reverseName = `${row.employee.nom} ${row.employee.prenom}`.toLowerCase();
    const matricule = (row.employee.matricule || '').toLowerCase();
    return fullName.includes(query) || reverseName.includes(query) || matricule.includes(query);
  });

  // Export CSV
  const exportCSV = () => {
    if (!reportData?.report) return;

    const headers = ['Matricule', 'Nom', 'Prenom', 'Departement', 'Presents', 'Absents', 'Retards', 'Conges', 'Taux (%)'];
    const rows = reportData.report.map((r) => [
      r.employee.matricule,
      r.employee.nom,
      r.employee.prenom,
      r.employee.department || '-',
      r.summary.present,
      r.summary.absent,
      r.summary.late,
      r.summary.onLeave,
      r.attendanceRate,
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_presences_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

  const globalStats = reportData?.globalStats || {};
  const allDaysOfMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Get rate color class
  const getRateColorClass = (rate) => {
    const r = parseFloat(rate);
    if (r >= 90) return 'text-green-600 dark:text-green-400';
    if (r >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Stats configuration
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.attendance.totalEmployees', defaultMessage: 'Employes' }),
      value: globalStats.totalEmployees || 0,
      icon: Users,
      bgClass: 'bg-purple-100 dark:bg-purple-900/30',
      iconClass: 'text-purple-600 dark:text-purple-400',
      valueClass: 'text-gray-900 dark:text-white',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.totalPresent', defaultMessage: 'Total Presents' }),
      value: globalStats.totalPresent || 0,
      icon: UserCheck,
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      iconClass: 'text-green-600 dark:text-green-400',
      valueClass: 'text-green-600 dark:text-green-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.totalAbsent', defaultMessage: 'Total Absents' }),
      value: globalStats.totalAbsent || 0,
      icon: UserX,
      bgClass: 'bg-red-100 dark:bg-red-900/30',
      iconClass: 'text-red-600 dark:text-red-400',
      valueClass: 'text-red-600 dark:text-red-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.totalLate', defaultMessage: 'Total Retards' }),
      value: globalStats.totalLate || 0,
      icon: Clock,
      bgClass: 'bg-orange-100 dark:bg-orange-900/30',
      iconClass: 'text-orange-600 dark:text-orange-400',
      valueClass: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.averageRate', defaultMessage: 'Taux Moyen' }),
      value: `${globalStats.averageAttendanceRate || 0}%`,
      icon: TrendingUp,
      bgClass: 'bg-blue-100 dark:bg-blue-900/30',
      iconClass: 'text-blue-600 dark:text-blue-400',
      valueClass: getRateColorClass(globalStats.averageAttendanceRate),
    },
  ];

  // Month label
  const getMonthLabel = (monthValue) => {
    const month = MONTHS.find((m) => m.value === monthValue);
    return month ? intl.formatMessage({ id: month.labelKey, defaultMessage: month.defaultLabel }) : '';
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
              {intl.formatMessage({ id: 'hr.attendance.monthlyReport', defaultMessage: 'Rapport Mensuel de Presences' })}
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
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-3 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.attendance.exportCSV', defaultMessage: 'Exporter CSV' })}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.attendance.searchEmployee', defaultMessage: 'Rechercher un employe...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
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
              <option value="">{intl.formatMessage({ id: 'hr.attendance.allDepartments', defaultMessage: 'Tous' })}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.nom}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0A1628] to-[#0A1628]/80 px-4 py-2.5">
            <span className="text-white/80 text-sm mr-2">{intl.formatMessage({ id: 'hr.attendance.workingDays', defaultMessage: 'Jours ouvrables' })}:</span>
            <span className="text-xl font-bold text-[#D4A853]">{globalStats.workingDaysInMonth || 0}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Report Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.attendance.detailedReport', defaultMessage: 'Rapport detaille par employe' })}
          </h2>
          {!loading && reportData?.report?.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery
                ? intl.formatMessage(
                    { id: 'hr.attendance.filteredCount', defaultMessage: '{filtered} sur {total} employes' },
                    { filtered: filteredReport.length, total: reportData.report.length }
                  )
                : intl.formatMessage(
                    { id: 'hr.attendance.employeeCount', defaultMessage: '{count} employes' },
                    { count: reportData.report.length }
                  )}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
            </p>
          </div>
        ) : !reportData?.report?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.attendance.noData', defaultMessage: 'Aucune donnee pour cette periode' })}
            </p>
          </div>
        ) : filteredReport.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.attendance.noResults', defaultMessage: 'Aucun resultat pour' })} "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ maxHeight: '600px' }}>
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:bg-gray-700/50 dark:text-gray-300" style={{ minWidth: '200px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.employee', defaultMessage: 'Employe' })}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300" style={{ minWidth: '70px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.present', defaultMessage: 'Pres.' })}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300" style={{ minWidth: '70px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.absent', defaultMessage: 'Abs.' })}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300" style={{ minWidth: '70px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.late', defaultMessage: 'Ret.' })}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300" style={{ minWidth: '70px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.leave', defaultMessage: 'Cong.' })}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300" style={{ minWidth: '80px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.hours', defaultMessage: 'Heures' })}
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300" style={{ minWidth: '100px' }}>
                    {intl.formatMessage({ id: 'hr.attendance.rate', defaultMessage: 'Taux' })}
                  </th>
                  {allDaysOfMonth.map((dayNum) => {
                    const weekend = isWeekend(selectedYear, selectedMonth, dayNum);
                    return (
                      <th
                        key={dayNum}
                        className={`px-1 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 ${
                          weekend ? 'bg-gray-100 dark:bg-gray-600/50' : ''
                        }`}
                        style={{ minWidth: '36px' }}
                      >
                        {dayNum}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReport.map((row, index) => {
                  const emp = row.employee;
                  const summary = row.summary;

                  return (
                    <tr key={emp.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                            {emp.photo ? (
                              <img src={getPhotoUrl(emp.photo)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-medium">{emp.prenom?.[0]}{emp.nom?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {emp.prenom} {emp.nom}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{emp.matricule}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center rounded-full border border-green-300 px-2 py-0.5 text-xs font-medium text-green-700 dark:border-green-600 dark:text-green-400">
                          {summary.present}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center rounded-full border border-red-300 px-2 py-0.5 text-xs font-medium text-red-700 dark:border-red-600 dark:text-red-400">
                          {summary.absent}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center rounded-full border border-orange-300 px-2 py-0.5 text-xs font-medium text-orange-700 dark:border-orange-600 dark:text-orange-400">
                          {summary.late}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center rounded-full border border-purple-300 px-2 py-0.5 text-xs font-medium text-purple-700 dark:border-purple-600 dark:text-purple-400">
                          {summary.onLeave}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatWorkingHours(summary.totalWorkingHours)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <ProgressBar value={parseFloat(row.attendanceRate) || 0} />
                      </td>
                      {allDaysOfMonth.map((dayNum) => {
                        const weekend = isWeekend(selectedYear, selectedMonth, dayNum);
                        const status = getDayStatus(row.details, dayNum);
                        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const isFuture = new Date(dateStr) > new Date();

                        return (
                          <td
                            key={dayNum}
                            className={`px-1 py-3 ${weekend ? 'bg-gray-100 dark:bg-gray-600/50' : ''}`}
                            title={`${dayNum}/${selectedMonth}/${selectedYear} - ${
                              weekend ? 'Weekend' : isFuture ? 'Jour futur' : ATTENDANCE_STATUS[status]?.label || status || 'Non pointe'
                            }`}
                          >
                            <DayStatusCell
                              status={status}
                              dayNum={dayNum}
                              isWeekend={weekend}
                              isFuture={isFuture}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.attendance.legend', defaultMessage: 'Legende' })}:
          </p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(ATTENDANCE_STATUS)
              .filter(([k]) => ['present', 'late', 'absent', 'leave', 'half_day'].includes(k))
              .map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${
                    key === 'present' ? 'bg-green-500' :
                    key === 'late' ? 'bg-orange-500' :
                    key === 'absent' ? 'bg-red-500' :
                    key === 'leave' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{val.label}</span>
                </div>
              ))}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Weekend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.attendance.futureDay', defaultMessage: 'Jour futur' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
