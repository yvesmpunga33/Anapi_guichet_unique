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
  LogIn,
  LogOut,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Filter,
  MoreVertical,
  Eye,
} from 'lucide-react';

import {
  checkIn,
  checkOut,
  markAbsent,
  getDailyAttendance,
  ATTENDANCE_STATUS,
  formatTime,
  formatWorkingHours,
  getPhotoUrl,
  getDepartments,
} from '@/app/services/hr';

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
  const statusInfo = ATTENDANCE_STATUS[status];
  if (!statusInfo) {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-600 dark:text-gray-400">
        Non pointe
      </span>
    );
  }

  const colorClasses = {
    present: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    late: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    half_day: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    leave: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    holiday: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    weekend: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[status] || colorClasses.absent}`}>
      {statusInfo.label}
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
  };

  return (
    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${colorClasses[color]}`}>
      {count > 999 ? '999+' : count}
    </span>
  );
}

export default function DailyAttendancePage() {
  const intl = useIntl();
  const { locale } = useLanguage();

  // States
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ stats: {}, data: [], pagination: {} });
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [processingEmployee, setProcessingEmployee] = useState(null);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [deptRes, attRes] = await Promise.all([
        getDepartments(),
        getDailyAttendance({
          date: selectedDate,
          departmentId: selectedDepartment || undefined,
          search: searchTerm || undefined,
          page: page + 1,
          limit: rowsPerPage,
        }),
      ]);

      setDepartments(deptRes?.data || []);
      setAttendanceData(attRes?.data || { stats: {}, data: [], pagination: {} });
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.attendance.loadError', defaultMessage: 'Erreur lors du chargement des donnees' }),
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedDepartment, searchTerm, page, rowsPerPage, intl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Check-in
  const handleCheckIn = async (employeeId) => {
    setProcessingEmployee(employeeId);
    try {
      await checkIn({
        employeeId,
        time: new Date().toTimeString().split(' ')[0],
        location: 'manual',
      });
      Swal.fire({
        icon: 'success',
        title: intl.formatMessage({ id: 'hr.attendance.checkInSuccess', defaultMessage: "Pointage d'entree enregistre" }),
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
    } finally {
      setProcessingEmployee(null);
    }
  };

  // Check-out
  const handleCheckOut = async (employeeId) => {
    setProcessingEmployee(employeeId);
    try {
      await checkOut({
        employeeId,
        time: new Date().toTimeString().split(' ')[0],
        location: 'manual',
      });
      Swal.fire({
        icon: 'success',
        title: intl.formatMessage({ id: 'hr.attendance.checkOutSuccess', defaultMessage: 'Pointage de sortie enregistre' }),
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
    } finally {
      setProcessingEmployee(null);
    }
  };

  // Mark absent
  const handleMarkAbsent = async (employeeId) => {
    setProcessingEmployee(employeeId);
    try {
      await markAbsent({ employeeId, date: selectedDate });
      Swal.fire({
        icon: 'info',
        title: intl.formatMessage({ id: 'hr.attendance.markedAbsent', defaultMessage: 'Employe marque absent' }),
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
    } finally {
      setProcessingEmployee(null);
    }
  };

  // Navigate date
  const navigateDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Filter employees by tab
  const getFilteredEmployees = () => {
    const data = attendanceData?.data || [];
    if (activeTab === 0) return data;
    if (activeTab === 1) return data.filter((item) => item.attendance && ['present', 'late'].includes(item.attendance.status));
    if (activeTab === 2) return data.filter((item) => !item.attendance || item.attendance.status === 'absent');
    if (activeTab === 3) return data.filter((item) => item.attendance?.status === 'late');
    return data;
  };

  const filteredEmployees = getFilteredEmployees();
  const stats = attendanceData.stats || {};
  const pagination = attendanceData.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / rowsPerPage);

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Stats configuration
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.attendance.totalEmployees', defaultMessage: 'Total Employes' }),
      value: stats.total || 0,
      icon: Users,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.present', defaultMessage: 'Presents' }),
      value: stats.present || 0,
      icon: UserCheck,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.absent', defaultMessage: 'Absents' }),
      value: stats.absent || 0,
      icon: UserX,
      bgClass: 'bg-gradient-to-br from-red-500 to-rose-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.attendance.late', defaultMessage: 'En retard' }),
      value: stats.late || 0,
      icon: Clock,
      bgClass: 'bg-gradient-to-br from-orange-500 to-amber-600',
    },
  ];

  // Tab configuration
  const TABS = [
    { label: intl.formatMessage({ id: 'hr.attendance.all', defaultMessage: 'Tous' }), count: stats.total || 0, color: 'primary' },
    { label: intl.formatMessage({ id: 'hr.attendance.present', defaultMessage: 'Presents' }), count: stats.present || 0, color: 'success' },
    { label: intl.formatMessage({ id: 'hr.attendance.absent', defaultMessage: 'Absents' }), count: stats.absent || 0, color: 'error' },
    { label: intl.formatMessage({ id: 'hr.attendance.late', defaultMessage: 'En retard' }), count: stats.late || 0, color: 'warning' },
  ];

  // Export to CSV
  const exportCSV = () => {
    if (!filteredEmployees.length) return;

    const headers = ['Matricule', 'Nom', 'Prenom', 'Departement', 'Statut', 'Entree', 'Sortie', 'Heures', 'Retard'];
    const rows = filteredEmployees.map((item) => {
      const emp = item.employee;
      const att = item.attendance;
      return [
        emp.matricule || '',
        emp.nom || '',
        emp.prenom || '',
        emp.departement || '',
        att?.status ? ATTENDANCE_STATUS[att.status]?.label || att.status : 'Non pointe',
        att?.checkIn ? formatTime(att.checkIn) : '',
        att?.checkOut ? formatTime(att.checkOut) : '',
        att?.workingHours ? formatWorkingHours(parseFloat(att.workingHours)) : '',
        att?.lateMinutes > 0 ? `${att.lateMinutes} min` : '',
      ];
    });

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `presences_${selectedDate}.csv`;
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
              {intl.formatMessage({ id: 'hr.attendance.dailyView', defaultMessage: 'Vue Journaliere' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 capitalize">
              {formatDisplayDate(selectedDate)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title={intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
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
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.export', defaultMessage: 'Exporter' })}</span>
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => navigateDate(-1)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48 rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-center font-medium focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={() => navigateDate(1)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="rounded-lg border border-[#D4A853] px-3 py-2 text-[#D4A853] hover:bg-[#D4A853]/10"
        >
          {intl.formatMessage({ id: 'hr.attendance.today', defaultMessage: "Aujourd'hui" })}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.attendance.searchEmployee', defaultMessage: 'Rechercher un employe...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.attendance.allDepartments', defaultMessage: 'Tous les departements' })}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.nom}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center rounded-xl bg-green-50 px-4 py-2.5 dark:bg-green-900/20">
            <span className="text-green-700 text-sm mr-2 dark:text-green-400">
              {intl.formatMessage({ id: 'hr.attendance.rate', defaultMessage: 'Taux' })}:
            </span>
            <span className="text-xl font-bold text-green-700 dark:text-green-400">
              {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="flex items-center justify-center rounded-xl bg-blue-50 px-4 py-2.5 dark:bg-blue-900/20">
            <Clock className="h-5 w-5 text-blue-600 mr-2 dark:text-blue-400" />
            <span className="text-blue-700 text-sm mr-2 dark:text-blue-400">
              {intl.formatMessage({ id: 'hr.attendance.totalHours', defaultMessage: 'Heures totales' })}:
            </span>
            <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
              {formatWorkingHours(stats.totalHours || 0)}
            </span>
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
              onClick={() => setActiveTab(index)}
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
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.employee', defaultMessage: 'Employe' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.department', defaultMessage: 'Departement' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.status', defaultMessage: 'Statut' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.entry', defaultMessage: 'Entree' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.exit', defaultMessage: 'Sortie' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.hours', defaultMessage: 'Heures' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.attendance.delay', defaultMessage: 'Retard' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                      <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.attendance.noEmployees', defaultMessage: 'Aucun employe trouve' })}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((item, index) => {
                  const emp = item.employee;
                  const att = item.attendance;
                  const isProcessing = processingEmployee === emp.id;

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {item.rowNumber || page * rowsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                            {emp.photo ? (
                              <img src={getPhotoUrl(emp.photo)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium">{emp.prenom?.[0]}{emp.nom?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {emp.prenom} {emp.nom}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{emp.matricule}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {emp.departement || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={att?.status} />
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                        {att?.checkIn ? formatTime(att.checkIn) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                        {att?.checkOut ? formatTime(att.checkOut) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                        {att?.workingHours ? formatWorkingHours(parseFloat(att.workingHours)) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {att?.lateMinutes > 0 ? (
                          <span className="inline-flex items-center rounded-full border border-orange-300 px-2 py-0.5 text-xs font-medium text-orange-700 dark:border-orange-600 dark:text-orange-400">
                            {att.lateMinutes} min
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {!att?.checkIn ? (
                            <>
                              <button
                                onClick={() => handleCheckIn(emp.id)}
                                disabled={isProcessing}
                                className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                                title={intl.formatMessage({ id: 'hr.attendance.checkIn', defaultMessage: "Pointer entree" })}
                              >
                                {isProcessing ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
                                ) : (
                                  <LogIn className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleMarkAbsent(emp.id)}
                                disabled={isProcessing}
                                className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                title={intl.formatMessage({ id: 'hr.attendance.markAbsent', defaultMessage: "Marquer absent" })}
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            </>
                          ) : !att?.checkOut ? (
                            <button
                              onClick={() => handleCheckOut(emp.id)}
                              disabled={isProcessing}
                              className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                              title={intl.formatMessage({ id: 'hr.attendance.checkOut', defaultMessage: "Pointer sortie" })}
                            >
                              {isProcessing ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
                              ) : (
                                <LogOut className="h-4 w-4" />
                              )}
                            </button>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-green-300 px-2 py-0.5 text-xs font-medium text-green-700 dark:border-green-600 dark:text-green-400">
                              {intl.formatMessage({ id: 'hr.attendance.completed', defaultMessage: 'Termine' })}
                            </span>
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
              {intl.formatMessage(
                { id: 'common.displayedRows', defaultMessage: '{from}-{to} sur {count}' },
                {
                  from: page * rowsPerPage + 1,
                  to: Math.min((page + 1) * rowsPerPage, pagination.total || 0),
                  count: pagination.total || 0,
                }
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
    </div>
  );
}
