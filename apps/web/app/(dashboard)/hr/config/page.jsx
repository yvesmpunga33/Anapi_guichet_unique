'use client';

import { useIntl, FormattedMessage } from 'react-intl';
import Link from 'next/link';
import {
  Settings,
  Clock,
  Gift,
  MinusCircle,
  ChevronRight,
  Building2,
  Briefcase,
  Award,
  Layers,
  Users,
  Calendar,
  DollarSign,
} from 'lucide-react';

// ANAPI Colors
const COLORS = {
  darkBlue: '#0A1628',
  gold: '#D4A853',
};

// Config Card Component
function ConfigCard({ title, description, icon: Icon, href, color, stats }) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-[#D4A853] transition-all group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#D4A853] transition-colors">
              {title}
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#D4A853] group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {description}
          </p>
          {stats && (
            <div className="mt-3 flex items-center gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Section Header Component
function SectionHeader({ title, description, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: COLORS.darkBlue }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function HRConfigPage() {
  const intl = useIntl();

  const organizationConfigs = [
    {
      title: intl.formatMessage({ id: 'hr.config.departments', defaultMessage: 'Departements' }),
      description: intl.formatMessage({ id: 'hr.config.departmentsDesc', defaultMessage: 'Gerer la structure departementale de l\'organisation' }),
      icon: Building2,
      href: '/hr/config/departments',
      color: '#6366f1',
    },
    {
      title: intl.formatMessage({ id: 'hr.config.positions', defaultMessage: 'Postes' }),
      description: intl.formatMessage({ id: 'hr.config.positionsDesc', defaultMessage: 'Configurer les postes et fonctions disponibles' }),
      icon: Briefcase,
      href: '/hr/config/positions',
      color: '#8b5cf6',
    },
    {
      title: intl.formatMessage({ id: 'hr.config.grades', defaultMessage: 'Grades Salariaux' }),
      description: intl.formatMessage({ id: 'hr.config.gradesDesc', defaultMessage: 'Definir les echelons et grilles salariales' }),
      icon: Award,
      href: '/hr/config/grades',
      color: '#f59e0b',
    },
    {
      title: intl.formatMessage({ id: 'hr.config.categories', defaultMessage: 'Categories' }),
      description: intl.formatMessage({ id: 'hr.config.categoriesDesc', defaultMessage: 'Classifier les employes par categorie professionnelle' }),
      icon: Layers,
      href: '/hr/config/categories',
      color: '#10b981',
    },
    {
      title: intl.formatMessage({ id: 'hr.config.contractTypes', defaultMessage: 'Types de Contrat' }),
      description: intl.formatMessage({ id: 'hr.config.contractTypesDesc', defaultMessage: 'Configurer les types de contrat de travail' }),
      icon: Users,
      href: '/hr/config/contract-types',
      color: '#ec4899',
    },
  ];

  const payrollConfigs = [
    {
      title: intl.formatMessage({ id: 'hr.config.bonusTypes', defaultMessage: 'Types de Primes' }),
      description: intl.formatMessage({ id: 'hr.config.bonusTypesDesc', defaultMessage: 'Configurer les primes et bonus disponibles pour les employes' }),
      icon: Gift,
      href: '/hr/config/bonus-types',
      color: '#22c55e',
    },
    {
      title: intl.formatMessage({ id: 'hr.config.deductionTypes', defaultMessage: 'Types de Retenues' }),
      description: intl.formatMessage({ id: 'hr.config.deductionTypesDesc', defaultMessage: 'Gerer les retenues et deductions sur salaire' }),
      icon: MinusCircle,
      href: '/hr/config/deduction-types',
      color: '#ef4444',
    },
  ];

  const attendanceConfigs = [
    {
      title: intl.formatMessage({ id: 'hr.config.attendanceTypes', defaultMessage: 'Types de Presence' }),
      description: intl.formatMessage({ id: 'hr.config.attendanceTypesDesc', defaultMessage: 'Configurer les types de pointage et de presence' }),
      icon: Clock,
      href: '/hr/config/attendance-types',
      color: '#3b82f6',
    },
    {
      title: intl.formatMessage({ id: 'hr.config.leaveTypes', defaultMessage: 'Types de Conges' }),
      description: intl.formatMessage({ id: 'hr.config.leaveTypesDesc', defaultMessage: 'Definir les types de conges et absences autorisees' }),
      icon: Calendar,
      href: '/hr/leave-types',
      color: '#06b6d4',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: COLORS.darkBlue }}
        >
          <Settings className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <FormattedMessage id="hr.config.title" defaultMessage="Configuration RH" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <FormattedMessage id="hr.config.subtitle" defaultMessage="Parametres et configuration du module Ressources Humaines" />
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <Building2 className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">--</p>
          <p className="text-sm opacity-80">
            <FormattedMessage id="hr.config.departments" defaultMessage="Departements" />
          </p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
          <Briefcase className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">--</p>
          <p className="text-sm opacity-80">
            <FormattedMessage id="hr.config.positions" defaultMessage="Postes" />
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <Award className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">--</p>
          <p className="text-sm opacity-80">
            <FormattedMessage id="hr.config.grades" defaultMessage="Grades" />
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">--</p>
          <p className="text-sm opacity-80">
            <FormattedMessage id="hr.config.employees" defaultMessage="Employes" />
          </p>
        </div>
      </div>

      {/* Organization Structure Section */}
      <div>
        <SectionHeader
          title={intl.formatMessage({ id: 'hr.config.organization', defaultMessage: 'Structure Organisationnelle' })}
          description={intl.formatMessage({ id: 'hr.config.organizationDesc', defaultMessage: 'Configuration de l\'organisation' })}
          icon={Building2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizationConfigs.map((config) => (
            <ConfigCard key={config.href} {...config} />
          ))}
        </div>
      </div>

      {/* Payroll Configuration Section */}
      <div>
        <SectionHeader
          title={intl.formatMessage({ id: 'hr.config.payroll', defaultMessage: 'Configuration Paie' })}
          description={intl.formatMessage({ id: 'hr.config.payrollDesc', defaultMessage: 'Primes, retenues et elements de paie' })}
          icon={DollarSign}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payrollConfigs.map((config) => (
            <ConfigCard key={config.href} {...config} />
          ))}
        </div>
      </div>

      {/* Attendance & Leave Section */}
      <div>
        <SectionHeader
          title={intl.formatMessage({ id: 'hr.config.attendance', defaultMessage: 'Presence et Conges' })}
          description={intl.formatMessage({ id: 'hr.config.attendanceDesc', defaultMessage: 'Gestion des presences et absences' })}
          icon={Clock}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendanceConfigs.map((config) => (
            <ConfigCard key={config.href} {...config} />
          ))}
        </div>
      </div>

      {/* Help Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200">
              <FormattedMessage id="hr.config.helpTitle" defaultMessage="Besoin d'aide?" />
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              <FormattedMessage
                id="hr.config.helpDesc"
                defaultMessage="Ces parametres determinent le fonctionnement du module RH. Assurez-vous de configurer correctement chaque element avant d'ajouter des employes."
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
