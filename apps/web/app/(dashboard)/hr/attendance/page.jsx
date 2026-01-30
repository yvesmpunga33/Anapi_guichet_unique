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
  LogIn,
  LogOut,
  Filter,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  ScanFace,
  Eye,
  CreditCard,
  QrCode,
  Edit,
  CalendarDays,
  FileBarChart,
  FileText,
  X,
} from 'lucide-react';

import {
  checkIn,
  checkOut,
  markAbsent,
  getDailyAttendance,
  ATTENDANCE_STATUS,
  CHECK_IN_METHODS,
  formatTime,
  formatWorkingHours,
  getPhotoUrl,
  getEmployees,
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

// Check-in Method Button Component
function MethodButton({ method, methodKey, selected, onClick }) {
  const icons = {
    manual: Edit,
    fingerprint: Fingerprint,
    facial: ScanFace,
    iris: Eye,
    badge: CreditCard,
    qrcode: QrCode,
  };
  const Icon = icons[methodKey] || Edit;

  return (
    <button
      onClick={() => onClick(methodKey)}
      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all ${
        selected
          ? 'border-[#D4A853] bg-[#D4A853] text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-[#D4A853]/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
      }`}
    >
      <Icon className="h-5 w-5" />
      <div className="text-left">
        <p className="font-semibold text-sm">{method.label}</p>
        <p className={`text-xs ${selected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          {method.description}
        </p>
      </div>
    </button>
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

// Check-in Dialog Component
function CheckInDialog({ employee, isOpen, onClose, onSubmit, intl }) {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(employee.id, time + ':00');
    setSubmitting(false);
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <LogIn className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'hr.attendance.manualCheckIn', defaultMessage: 'Pointage Manuel' })}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
              {employee.photo ? (
                <img src={getPhotoUrl(employee.photo)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold">{employee.prenom?.[0]}{employee.nom?.[0]}</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {employee.prenom} {employee.nom}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{employee.matricule}</p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {intl.formatMessage({ id: 'hr.attendance.entryTime', defaultMessage: "Heure d'entree" })}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-semibold focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !time}
              className="flex-1 rounded-xl bg-[#0A1628] px-4 py-3 font-medium text-white hover:bg-[#0A1628]/90 disabled:opacity-50"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              ) : (
                intl.formatMessage({ id: 'common.save', defaultMessage: 'Enregistrer' })
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Biometric Scan Dialog Component
function BiometricScanDialog({ isOpen, method, progress, onClose, intl }) {
  const icons = {
    fingerprint: Fingerprint,
    facial: ScanFace,
    iris: Eye,
  };
  const Icon = icons[method] || Fingerprint;
  const methodInfo = CHECK_IN_METHODS[method] || CHECK_IN_METHODS.manual;

  const messages = {
    fingerprint: intl.formatMessage({ id: 'hr.attendance.placeFinger', defaultMessage: 'Placez votre doigt sur le capteur' }),
    facial: intl.formatMessage({ id: 'hr.attendance.lookCamera', defaultMessage: 'Regardez la camera' }),
    iris: intl.formatMessage({ id: 'hr.attendance.lookScanner', defaultMessage: 'Regardez le scanner' }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * progress) / 100}
                className="text-[#D4A853] transition-all duration-150"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="h-12 w-12 text-[#0A1628] dark:text-[#D4A853]" />
            </div>
          </div>

          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {methodInfo.label}
          </h3>
          <p className="mb-4 text-center text-gray-500 dark:text-gray-400">
            {messages[method] || intl.formatMessage({ id: 'hr.attendance.pleaseWait', defaultMessage: 'Veuillez patienter...' })}
          </p>
          <p className="text-4xl font-bold text-[#0A1628] dark:text-[#D4A853]">
            {progress}%
          </p>
        </div>
      </div>
    </div>
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

export default function AttendancePage() {
  const intl = useIntl();
  const { locale } = useLanguage();

  // States
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ stats: {}, data: [], pagination: {} });
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInMethod, setCheckInMethod] = useState('manual');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Dialog states
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [processingEmployee, setProcessingEmployee] = useState(null);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricProgress, setBiometricProgress] = useState(0);

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

      // Extract departments array from response (handle various response structures)
      const deptsArray = deptRes?.data?.departments || deptRes?.data || [];
      setDepartments(Array.isArray(deptsArray) ? deptsArray : []);
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

  // Simulate biometric scan
  const simulateBiometricScan = (employee, isCheckOut = false) => {
    setBiometricScanning(true);
    setBiometricProgress(0);
    setSelectedEmployee(employee);

    const interval = setInterval(() => {
      setBiometricProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBiometricScanning(false);
          if (isCheckOut) {
            handleCheckOut(employee.id);
          } else {
            handleCheckIn(employee.id);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Check-in
  const handleCheckIn = async (employeeId, time = null) => {
    setProcessingEmployee(employeeId);
    try {
      await checkIn({
        employeeId,
        time: time || new Date().toTimeString().split(' ')[0],
        location: checkInMethod,
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
        text: error.message || intl.formatMessage({ id: 'hr.attendance.checkInError', defaultMessage: 'Erreur lors du pointage' }),
      });
    } finally {
      setProcessingEmployee(null);
      setCheckInDialogOpen(false);
    }
  };

  // Check-out
  const handleCheckOut = async (employeeId, time = null) => {
    setProcessingEmployee(employeeId);
    try {
      await checkOut({
        employeeId,
        time: time || new Date().toTimeString().split(' ')[0],
        location: checkInMethod,
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
        text: error.message || intl.formatMessage({ id: 'hr.attendance.checkOutError', defaultMessage: 'Erreur lors du pointage' }),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.attendance.title', defaultMessage: 'Pointage & Presences' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.attendance.subtitle', defaultMessage: 'Gestion des presences et pointages des employes' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/hr/attendance/daily"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.attendance.daily', defaultMessage: 'Journalier' })}</span>
          </Link>
          <Link
            href="/hr/attendance/monthly"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.attendance.monthly', defaultMessage: 'Mensuel' })}</span>
          </Link>
          <Link
            href="/hr/attendance/report"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FileBarChart className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.attendance.reports', defaultMessage: 'Rapports' })}</span>
          </Link>
          <Link
            href="/hr/attendance/justifications"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'hr.attendance.justifications', defaultMessage: 'Justifications' })}</span>
          </Link>
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title={intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.export', defaultMessage: 'Exporter' })}</span>
          </button>
        </div>
      </div>

      {/* Check-in Method Selection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          {intl.formatMessage({ id: 'hr.attendance.checkInMethod', defaultMessage: 'Methode de pointage' })}
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CHECK_IN_METHODS).map(([key, method]) => (
            <MethodButton
              key={key}
              methodKey={key}
              method={method}
              selected={checkInMethod === key}
              onClick={setCheckInMethod}
            />
          ))}
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
            <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
          <div className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0A1628] to-[#0A1628]/80 px-4 py-2.5">
            <span className="text-white/80 text-sm mr-2">{intl.formatMessage({ id: 'hr.attendance.rate', defaultMessage: 'Taux' })}:</span>
            <span className="text-xl font-bold text-[#D4A853]">
              {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(0) : 0}%
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
                  <td colSpan={8} className="px-6 py-12 text-center">
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
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.attendance.noEmployees', defaultMessage: 'Aucun employe trouve' })}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((item) => {
                  const emp = item.employee;
                  const att = item.attendance;
                  const isProcessing = processingEmployee === emp.id;

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                                onClick={() => {
                                  if (checkInMethod === 'manual') {
                                    setSelectedEmployee(emp);
                                    setCheckInDialogOpen(true);
                                  } else {
                                    simulateBiometricScan(emp, false);
                                  }
                                }}
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
                              onClick={() => {
                                if (checkInMethod === 'manual') {
                                  handleCheckOut(emp.id);
                                } else {
                                  simulateBiometricScan(emp, true);
                                }
                              }}
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

      {/* Dialogs */}
      <CheckInDialog
        employee={selectedEmployee}
        isOpen={checkInDialogOpen}
        onClose={() => setCheckInDialogOpen(false)}
        onSubmit={handleCheckIn}
        intl={intl}
      />

      <BiometricScanDialog
        isOpen={biometricScanning}
        method={checkInMethod}
        progress={biometricProgress}
        onClose={() => setBiometricScanning(false)}
        intl={intl}
      />
    </div>
  );
}
