'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import {
  Users,
  UserPlus,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Building2,
  Cake,
  GraduationCap,
  CalendarDays,
  MoreVertical,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UsersRound,
  BadgeCheck,
  BarChart3,
  Bell,
  RefreshCw,
  Eye,
  FileText,
  UserCheck,
  UserX,
  Loader2,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Services
import {
  employeeService,
  departmentService,
  attendanceService,
  leaveService,
  dashboardService,
} from '@/app/services/hr';

// ANAPI Color Scheme
const COLORS = {
  darkBlue: '#0A1628',
  gold: '#D4A853',
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
};

// Chart Colors
const CHART_COLORS = ['#D4A853', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, color, trend, trendValue }) {
  const isPositive = trend === 'up';
  const colorClasses = {
    primary: 'bg-blue-500/10 text-blue-600',
    success: 'bg-emerald-500/10 text-emerald-600',
    warning: 'bg-amber-500/10 text-amber-600',
    error: 'bg-red-500/10 text-red-600',
    info: 'bg-cyan-500/10 text-cyan-600',
    gold: 'bg-[#D4A853]/10 text-[#D4A853]',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {trendValue}
              </span>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </span>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color] || colorClasses.primary}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}

// Welcome Card with Attendance Rate
function WelcomeCard({ totalEmployees, presentToday, intl }) {
  const presenceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (presenceRate / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2d4a] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            {intl.formatMessage({ id: 'hr.dashboard.welcome', defaultMessage: 'Tableau de bord RH' })}
          </h2>
          <p className="text-gray-300 mb-6 max-w-md">
            {intl.formatMessage({ id: 'hr.dashboard.welcomeDesc', defaultMessage: 'Gerez efficacement vos ressources humaines, suivez les presences et optimisez la performance de votre equipe.' })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hr/employees/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D4A853] hover:bg-[#c49943] text-[#0A1628] font-medium rounded-xl transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              {intl.formatMessage({ id: 'hr.dashboard.newEmployee', defaultMessage: 'Nouvel employe' })}
            </Link>
            <Link
              href="/hr/employees"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              {intl.formatMessage({ id: 'hr.dashboard.viewReport', defaultMessage: 'Voir les rapports' })}
            </Link>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{presenceRate}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            {intl.formatMessage({ id: 'hr.dashboard.attendanceRate', defaultMessage: 'Taux de presence' })}
          </p>
        </div>
      </div>
    </div>
  );
}

// Department Distribution Chart
function DepartmentChart({ departments = [], intl }) {
  const safeDepartments = Array.isArray(departments) ? departments : [];
  const total = safeDepartments.reduce((acc, dep) => acc + (dep?.employeeCount || 0), 0);

  const chartData = safeDepartments.slice(0, 6).map((dept, index) => ({
    name: dept?.name || 'Non défini',
    value: dept?.employeeCount || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.dashboard.departmentDistribution', defaultMessage: 'Repartition par departement' })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.dashboard.totalEmployees', defaultMessage: '{count} employes au total' }, { count: total })}
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, intl.formatMessage({ id: 'hr.dashboard.employees', defaultMessage: 'Employes' })]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {chartData.map((dept, index) => {
              const percentage = total > 0 ? Math.round((dept.value / total) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {dept.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {dept.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: dept.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <Building2 className="w-12 h-12 text-gray-300 mb-2" />
          <p>{intl.formatMessage({ id: 'common.noData', defaultMessage: 'Aucune donnee' })}</p>
        </div>
      )}

      <Link
        href="/hr/departments"
        className="flex items-center justify-center gap-2 mt-6 py-2.5 text-sm font-medium text-[#D4A853] hover:bg-[#D4A853]/10 rounded-xl transition-colors"
      >
        {intl.formatMessage({ id: 'hr.dashboard.viewAllDepartments', defaultMessage: 'Voir tous les departements' })}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// Attendance Overview Chart
function AttendanceChart({ attendanceData, intl }) {
  const chartData = attendanceData.length > 0 ? attendanceData : [
    { day: 'Lun', present: 0, absent: 0, late: 0 },
    { day: 'Mar', present: 0, absent: 0, late: 0 },
    { day: 'Mer', present: 0, absent: 0, late: 0 },
    { day: 'Jeu', present: 0, absent: 0, late: 0 },
    { day: 'Ven', present: 0, absent: 0, late: 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.dashboard.attendanceOverview', defaultMessage: 'Apercu des presences' })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.dashboard.thisWeek', defaultMessage: 'Cette semaine' })}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'hr.dashboard.present', defaultMessage: 'Present' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'hr.dashboard.absent', defaultMessage: 'Absent' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: 'hr.dashboard.late', defaultMessage: 'Retard' })}</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="present" name={intl.formatMessage({ id: 'hr.dashboard.present', defaultMessage: 'Present' })} fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name={intl.formatMessage({ id: 'hr.dashboard.absent', defaultMessage: 'Absent' })} fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" name={intl.formatMessage({ id: 'hr.dashboard.late', defaultMessage: 'Retard' })} fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Link
        href="/hr/attendance"
        className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-medium text-[#D4A853] hover:bg-[#D4A853]/10 rounded-xl transition-colors"
      >
        {intl.formatMessage({ id: 'hr.dashboard.viewAttendanceDetails', defaultMessage: 'Voir les details de presence' })}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// Recent Activities Card
function RecentActivities({ activities, intl }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'hire':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'leave':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'promotion':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'termination':
        return <UserX className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'hire':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'leave':
        return 'bg-amber-100 dark:bg-amber-900/30';
      case 'promotion':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'termination':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  // Default activities if none provided
  const defaultActivities = [
    { id: 1, type: 'hire', title: 'Nouvel employe ajoute', description: 'Jean Mukeba a rejoint le departement IT', time: 'Il y a 2 heures' },
    { id: 2, type: 'leave', title: 'Demande de conge', description: 'Marie Kabongo - Conge annuel (5 jours)', time: 'Il y a 4 heures' },
    { id: 3, type: 'promotion', title: 'Promotion', description: 'Pierre Kasongo promu Chef de service', time: 'Hier' },
    { id: 4, type: 'hire', title: 'Nouvel employe ajoute', description: 'Anne Lukusa a rejoint les RH', time: 'Il y a 2 jours' },
  ];

  const displayActivities = activities && activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.dashboard.recentActivities', defaultMessage: 'Activites recentes' })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.dashboard.latestUpdates', defaultMessage: 'Dernieres mises a jour' })}
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#D4A853]/10 text-[#D4A853]">
          {displayActivities.length} {intl.formatMessage({ id: 'hr.dashboard.new', defaultMessage: 'nouvelles' })}
        </span>
      </div>

      <div className="space-y-4">
        {displayActivities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getActivityBg(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/hr/activities"
        className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-medium text-[#D4A853] hover:bg-[#D4A853]/10 rounded-xl transition-colors"
      >
        {intl.formatMessage({ id: 'hr.dashboard.viewAllActivities', defaultMessage: 'Voir toutes les activites' })}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// Leave Requests Card
function LeaveRequestsCard({ intl }) {
  const requests = [
    { id: 1, name: 'Marie Kabongo', type: 'Conge annuel', days: 5, status: 'pending', avatar: 'MK' },
    { id: 2, name: 'Jean Mukeba', type: 'Maladie', days: 2, status: 'approved', avatar: 'JM' },
    { id: 3, name: 'Pierre Kasongo', type: 'Conge annuel', days: 10, status: 'pending', avatar: 'PK' },
    { id: 4, name: 'Anne Lukusa', type: 'Maternite', days: 90, status: 'approved', avatar: 'AL' },
  ];

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: intl.formatMessage({ id: 'hr.dashboard.approved', defaultMessage: 'Approuve' }),
          className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      case 'rejected':
        return {
          label: intl.formatMessage({ id: 'hr.dashboard.rejected', defaultMessage: 'Refuse' }),
          className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          icon: <XCircle className="w-3 h-3" />
        };
      default:
        return {
          label: intl.formatMessage({ id: 'hr.dashboard.pending', defaultMessage: 'En attente' }),
          className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.dashboard.leaveRequests', defaultMessage: 'Demandes de conge' })}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.dashboard.processQuickly', defaultMessage: 'A traiter rapidement' })}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Bell className="w-3 h-3" />
          {pendingCount} {intl.formatMessage({ id: 'hr.dashboard.pending', defaultMessage: 'en attente' })}
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          return (
            <div
              key={request.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A1628] to-[#1a2d4a] flex items-center justify-center text-white text-sm font-medium">
                {request.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {request.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {request.type} - {request.days} {intl.formatMessage({ id: 'hr.dashboard.days', defaultMessage: 'jours' })}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
          );
        })}
      </div>

      <Link
        href="/hr/leaves"
        className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
      >
        {intl.formatMessage({ id: 'hr.dashboard.manageRequests', defaultMessage: 'Gerer les demandes' })}
      </Link>
    </div>
  );
}

// Quick Actions Component
function QuickActions({ intl }) {
  const actions = [
    { icon: UserPlus, label: intl.formatMessage({ id: 'hr.dashboard.newEmployee', defaultMessage: 'Nouvel employe' }), href: '/hr/employees/new', color: '#3B82F6' },
    { icon: Building2, label: intl.formatMessage({ id: 'hr.dashboard.departments', defaultMessage: 'Departements' }), href: '/hr/departments', color: '#10B981' },
    { icon: BadgeCheck, label: intl.formatMessage({ id: 'hr.dashboard.positions', defaultMessage: 'Postes' }), href: '/hr/positions', color: '#F59E0B' },
    { icon: Clock, label: intl.formatMessage({ id: 'hr.dashboard.attendance', defaultMessage: 'Presences' }), href: '/hr/attendance', color: '#06B6D4' },
    { icon: Calendar, label: intl.formatMessage({ id: 'hr.dashboard.leaves', defaultMessage: 'Conges' }), href: '/hr/leaves', color: '#EF4444' },
    { icon: GraduationCap, label: intl.formatMessage({ id: 'hr.dashboard.training', defaultMessage: 'Formations' }), href: '/hr/training', color: '#8B5CF6' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {intl.formatMessage({ id: 'hr.dashboard.quickActions', defaultMessage: 'Actions rapides' })}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#D4A853]/50 hover:bg-[#D4A853]/5 transition-all group"
              style={{ borderColor: `${action.color}20` }}
            >
              <div
                className="p-3 rounded-xl transition-colors"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center group-hover:text-gray-900 dark:group-hover:text-white">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Main HR Dashboard Page
export default function HRDashboardPage() {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    totalSalary: 0,
    departments: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Fetch dashboard data from backend
      const [dashboardRes, departmentsRes] = await Promise.all([
        dashboardService.getDashboardStats().catch(() => ({ data: null })),
        departmentService.getDepartments().catch(() => ({ data: { departments: [] } })),
      ]);

      const dashboardData = dashboardRes?.data || {};
      const departmentsList = departmentsRes?.data?.departments || [];

      // Extract stats from dashboard response
      const statistics = dashboardData.statistics || {};
      const counts = dashboardData.counts || {};
      const employeesByDepartment = dashboardData.employeesByDepartment || [];

      setStats({
        totalEmployees: parseInt(statistics.total_employees || 0),
        presentToday: parseInt(statistics.active_employees || 0),
        onLeave: 0, // TODO: Fetch from leaves endpoint
        totalSalary: parseFloat(statistics.total_salaries || 0),
        departments: counts.departments || departmentsList.length,
      });

      // Map departments with employee counts from backend
      const safeDeptList = Array.isArray(departmentsList) ? departmentsList : [];
      const safeEmpByDept = Array.isArray(employeesByDepartment) ? employeesByDepartment : [];
      const deptWithCounts = safeDeptList.map(dept => {
        const deptStats = safeEmpByDept.find(d => d?.departement === dept?.nom);
        return {
          ...dept,
          name: dept?.nom || 'Non défini',
          employeeCount: parseInt(deptStats?.count || 0),
        };
      });

      setDepartments(deptWithCounts);
      setEmployees(dashboardData.recentEmployees || []);

      // Generate attendance data for the week (TODO: fetch from real API)
      const totalActive = parseInt(statistics.active_employees || 10);
      const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
      const sampleAttendance = weekDays.map(day => ({
        day,
        present: Math.floor(totalActive * 0.85 + Math.random() * totalActive * 0.15),
        absent: Math.floor(Math.random() * 3),
        late: Math.floor(Math.random() * 2),
      }));
      setAttendanceData(sampleAttendance);

    } catch (error) {
      console.error('Error loading HR dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4A853] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.dashboard.loading', defaultMessage: 'Chargement du tableau de bord...' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.dashboard.title', defaultMessage: 'Tableau de bord RH' })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {intl.formatMessage({ id: 'hr.dashboard.subtitle', defaultMessage: 'Vue d\'ensemble de la gestion des ressources humaines' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
          </button>
          <Link
            href="/hr/employees/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4A853] hover:bg-[#c49943] text-[#0A1628] font-medium rounded-xl transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            {intl.formatMessage({ id: 'hr.dashboard.newEmployee', defaultMessage: 'Nouvel employe' })}
          </Link>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="mb-6">
        <WelcomeCard
          totalEmployees={stats.totalEmployees}
          presentToday={stats.presentToday}
          intl={intl}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title={intl.formatMessage({ id: 'hr.dashboard.totalEmployees', defaultMessage: 'Total employes' })}
          value={stats.totalEmployees}
          subtitle={intl.formatMessage({ id: 'hr.dashboard.thisMonth', defaultMessage: 'Ce mois' })}
          icon={UsersRound}
          color="primary"
          trend="up"
          trendValue="+5"
        />
        <StatCard
          title={intl.formatMessage({ id: 'hr.dashboard.presentToday', defaultMessage: 'Presents aujourd\'hui' })}
          value={stats.presentToday}
          subtitle={`${stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}% ${intl.formatMessage({ id: 'hr.dashboard.presence', defaultMessage: 'de presence' })}`}
          icon={UserCheck}
          color="success"
        />
        <StatCard
          title={intl.formatMessage({ id: 'hr.dashboard.onLeave', defaultMessage: 'En conge' })}
          value={stats.onLeave}
          subtitle={intl.formatMessage({ id: 'hr.dashboard.thisWeek', defaultMessage: 'Cette semaine' })}
          icon={Calendar}
          color="warning"
        />
        <StatCard
          title={intl.formatMessage({ id: 'hr.dashboard.totalSalary', defaultMessage: 'Masse salariale' })}
          value={formatCurrency(stats.totalSalary)}
          subtitle={intl.formatMessage({ id: 'hr.dashboard.thisMonth', defaultMessage: 'Ce mois' })}
          icon={DollarSign}
          color="gold"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions intl={intl} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DepartmentChart departments={departments} intl={intl} />
        <AttendanceChart attendanceData={attendanceData} intl={intl} />
      </div>

      {/* Activities and Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={activities} intl={intl} />
        <LeaveRequestsCard intl={intl} />
      </div>
    </div>
  );
}
