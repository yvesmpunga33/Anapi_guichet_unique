'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';

import {
  Calendar,
  CalendarDays,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
  X,
  User,
  Umbrella,
  Stethoscope,
  Baby,
  Users,
  Star,
  DollarOff,
  GraduationCap,
  Timer,
  ArrowLeft,
} from 'lucide-react';

import {
  getLeaveCalendar,
  getLeaveTypes,
  LEAVE_STATUS_LABELS,
  getDepartments,
  getPhotoUrl,
} from '@/app/services/hr';

// Dynamically import FullCalendar to avoid SSR issues
const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });

// Icon mapping for leave types
const LEAVE_TYPE_ICONS = {
  ANN: Umbrella,
  MAL: Stethoscope,
  MAT: Baby,
  PAT: User,
  FAM: Users,
  EXC: Star,
  SSO: DollarOff,
  FOR: GraduationCap,
  REC: Timer,
};

// Stats Card Component
function StatCard({ stat }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg ${stat.bgClass}`}>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{stat.value}</h3>
          <p className="text-sm text-white/85">{stat.title}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <stat.icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Status color helper
const getStatusColor = (status) => {
  const colors = {
    brouillon: '#9e9e9e',
    en_attente: '#ff9800',
    approuve_n1: '#2196f3',
    approuve: '#4caf50',
    refuse: '#f44336',
    annule: '#795548',
  };
  return colors[status] || '#667eea';
};

// Leave Detail Dialog
function LeaveDetailDialog({ isOpen, onClose, event, intl }) {
  if (!isOpen || !event) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const IconComponent = LEAVE_TYPE_ICONS[event.leaveType?.code] || Calendar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 rounded-t-2xl dark:border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <IconComponent className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'hr.leaves.leaveDetails', defaultMessage: 'Details du Conge' })}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Employee Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
              {event.employee?.photo ? (
                <img
                  src={getPhotoUrl(event.employee.photo)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {event.employee?.prenom?.[0]}{event.employee?.nom?.[0]}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event.employee?.prenom} {event.employee?.nom}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {event.employee?.matricule} - {event.employee?.departement || intl.formatMessage({ id: 'hr.leaves.undefined', defaultMessage: 'Non defini' })}
              </p>
            </div>
          </div>

          {/* Leave Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.leaves.leaveType', defaultMessage: 'Type de conge' })}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: event.leaveType?.couleur || '#667eea' }}
                />
                <p className="font-semibold text-gray-900 dark:text-white">
                  {event.leaveType?.nom || intl.formatMessage({ id: 'hr.leaves.undefined', defaultMessage: 'Non defini' })}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.leaves.status', defaultMessage: 'Statut' })}
              </p>
              <div className="mt-1">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {LEAVE_STATUS_LABELS[event.status] || event.status}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.leaves.startDate', defaultMessage: 'Date debut' })}
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {formatDate(event.leave?.dateDebut)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.leaves.endDate', defaultMessage: 'Date fin' })}
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {formatDate(event.leave?.dateFin)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.leaves.numberOfDays', defaultMessage: 'Nombre de jours' })}
              </p>
              <p className="mt-1 font-semibold text-[#D4A853]">
                {event.days} {intl.formatMessage({ id: 'hr.leaves.day', defaultMessage: 'jour(s)' })}
              </p>
            </div>
          </div>

          {/* Reason */}
          {event.leave?.motif && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.leaves.reason', defaultMessage: 'Motif' })}
              </p>
              <p className="mt-1 rounded-lg bg-gray-100 p-3 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {event.leave.motif}
              </p>
            </div>
          )}

          {/* Reference */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.leaves.reference', defaultMessage: 'Reference' })}
            </p>
            <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
              {event.leave?.reference || '-'}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4 dark:border-gray-700">
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

export default function LeaveCalendarPage() {
  const intl = useIntl();
  const calendarRef = useRef(null);

  // States
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [calendarReady, setCalendarReady] = useState(false);

  // Load leave types and departments
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [typesRes, deptsRes] = await Promise.all([
          getLeaveTypes({ actif: true }),
          getDepartments(),
        ]);
        // Extract arrays safely (handle various response structures)
        const typesArray = typesRes?.data?.leaveTypes || typesRes?.data || [];
        const deptsArray = deptsRes?.data?.departments || deptsRes?.data || [];
        setLeaveTypes(Array.isArray(typesArray) ? typesArray : []);
        setDepartments(Array.isArray(deptsArray) ? deptsArray : []);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };
    loadConfig();
  }, []);

  // Add days helper
  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Load calendar data
  const loadCalendarData = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];

      const response = await getLeaveCalendar(startDate, endDate, selectedDepartment || undefined);
      let data = response?.data || [];

      // Filter by type if selected
      if (selectedType) {
        data = data.filter((leave) => leave.leaveType?.id === selectedType);
      }

      // Transform to FullCalendar events
      const calendarEvents = data.map((leave) => {
        const leaveType = leave.leaveType || {};
        const employee = leave.employee || {};
        const statusColor = getStatusColor(leave.statut);

        return {
          id: leave.id,
          title: `${employee.prenom || ''} ${employee.nom || ''} - ${leaveType.nom || 'Conge'}`,
          start: leave.dateDebut,
          end: addDays(leave.dateFin, 1), // FullCalendar end is exclusive
          backgroundColor: leaveType.couleur || statusColor,
          borderColor: leaveType.couleur || statusColor,
          textColor: '#ffffff',
          extendedProps: {
            leave,
            employee,
            leaveType,
            status: leave.statut,
            days: leave.nombreJours,
          },
        };
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment, selectedType]);

  // Initial load
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    loadCalendarData(start, end);
    setCalendarReady(true);
  }, [loadCalendarData]);

  // Handle dates change
  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.start);
    loadCalendarData(dateInfo.start, dateInfo.end);
  };

  // Navigation
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi?.();
    calendarApi?.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi?.();
    calendarApi?.next();
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi?.();
    calendarApi?.today();
  };

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current?.getApi?.();
    calendarApi?.changeView(view);
    setCurrentView(view);
  };

  // Handle event click
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setDetailDialogOpen(true);
  };

  // Calculate stats
  const getStats = () => {
    const stats = {
      total: events.length,
      approuve: events.filter((e) => e.extendedProps.status === 'approuve').length,
      en_attente: events.filter(
        (e) => e.extendedProps.status === 'en_attente' || e.extendedProps.status === 'approuve_n1'
      ).length,
      totalJours: events.reduce((sum, e) => sum + (e.extendedProps.days || 0), 0),
    };
    return stats;
  };

  const stats = getStats();

  // Stats config
  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.leaves.displayedLeaves', defaultMessage: 'Conges affiches' }),
      value: stats.total,
      icon: CalendarDays,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaves.approved', defaultMessage: 'Approuves' }),
      value: stats.approuve,
      icon: Umbrella,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaves.pending', defaultMessage: 'En attente' }),
      value: stats.en_attente,
      icon: Timer,
      bgClass: 'bg-gradient-to-br from-orange-500 to-amber-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.leaves.totalDays', defaultMessage: 'Jours total' }),
      value: stats.totalJours,
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/hr/leaves"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.leaves.calendar', defaultMessage: 'Calendrier des Conges' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.leaves.calendarSubtitle', defaultMessage: 'Vue d\'ensemble des conges de tous les employes' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const calendarApi = calendarRef.current?.getApi?.();
              if (calendarApi) {
                loadCalendarData(calendarApi.view.activeStart, calendarApi.view.activeEnd);
              }
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Filters and Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Navigation */}
          <div className="flex items-center gap-2 lg:col-span-4">
            <button
              onClick={handlePrev}
              className="rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleToday}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Calendar className="h-4 w-4" />
              <span>{intl.formatMessage({ id: 'hr.leaves.today', defaultMessage: 'Aujourd\'hui' })}</span>
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 lg:col-span-3">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                currentView === 'dayGridMonth'
                  ? 'bg-[#0A1628] text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {intl.formatMessage({ id: 'hr.leaves.month', defaultMessage: 'Mois' })}
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                currentView === 'timeGridWeek'
                  ? 'bg-[#0A1628] text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {intl.formatMessage({ id: 'hr.leaves.week', defaultMessage: 'Semaine' })}
            </button>
            <button
              onClick={() => handleViewChange('listMonth')}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                currentView === 'listMonth'
                  ? 'bg-[#0A1628] text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {intl.formatMessage({ id: 'hr.leaves.list', defaultMessage: 'Liste' })}
            </button>
          </div>

          {/* Filters */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{intl.formatMessage({ id: 'hr.leaves.allDepartments', defaultMessage: 'Tous les dep.' })}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{intl.formatMessage({ id: 'hr.leaves.allTypes', defaultMessage: 'Tous les types' })}</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-gray-800/70">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
          </div>
        )}

        {calendarReady && (
          <FullCalendar
            ref={calendarRef}
            plugins={[
              require('@fullcalendar/daygrid').default,
              require('@fullcalendar/timegrid').default,
              require('@fullcalendar/list').default,
              require('@fullcalendar/interaction').default,
            ]}
            initialView="dayGridMonth"
            locale={require('@fullcalendar/core/locales/fr').default}
            headerToolbar={false}
            events={events}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            height="auto"
            dayMaxEvents={3}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={true}
            weekends={true}
            eventContent={(eventInfo) => (
              <div className="overflow-hidden p-1">
                <p className="truncate text-xs font-medium">{eventInfo.event.title}</p>
                <p className="text-xs opacity-80">{eventInfo.event.extendedProps.days} jour(s)</p>
              </div>
            )}
          />
        )}

        {/* Legend */}
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.leaves.legend', defaultMessage: 'Legende des types:' })}
          </p>
          <div className="flex flex-wrap gap-4">
            {leaveTypes.slice(0, 6).map((type) => (
              <div key={type.id} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: type.couleur || '#667eea' }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300">{type.nom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <LeaveDetailDialog
        isOpen={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        intl={intl}
      />
    </div>
  );
}
