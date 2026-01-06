"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import {
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Globe,
  Factory,
  MapPin,
  FileText,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Loader2,
  RefreshCw,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Shield,
  Zap,
  Heart,
  GraduationCap,
  Banknote,
  Flag,
  UserCheck,
  Download,
} from "lucide-react";

const getStatusConfig = (intl) => ({
  DRAFT: { label: intl.formatMessage({ id: "status.draft", defaultMessage: "Brouillon" }), color: "bg-gray-500", textColor: "text-gray-600", bgLight: "bg-gray-100" },
  SUBMITTED: { label: intl.formatMessage({ id: "status.submitted", defaultMessage: "Soumis" }), color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-100" },
  UNDER_REVIEW: { label: intl.formatMessage({ id: "status.underReview", defaultMessage: "En examen" }), color: "bg-yellow-500", textColor: "text-yellow-600", bgLight: "bg-yellow-100" },
  APPROVED: { label: intl.formatMessage({ id: "status.approved", defaultMessage: "Approuvé" }), color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-100" },
  REJECTED: { label: intl.formatMessage({ id: "status.rejected", defaultMessage: "Rejeté" }), color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-100" },
  IN_PROGRESS: { label: intl.formatMessage({ id: "status.inProgress", defaultMessage: "En cours" }), color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-100" },
  COMPLETED: { label: intl.formatMessage({ id: "status.completed", defaultMessage: "Terminé" }), color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-100" },
  CANCELLED: { label: intl.formatMessage({ id: "status.cancelled", defaultMessage: "Annulé" }), color: "bg-gray-500", textColor: "text-gray-600", bgLight: "bg-gray-100" },
});

const sectorColors = {
  "Mines": "#F59E0B",
  "Agriculture": "#10B981",
  "Technologies": "#6366F1",
  "Tourisme": "#EC4899",
  "Industrie": "#8B5CF6",
  "Services": "#14B8A6",
  "Energie": "#F97316",
  "Construction": "#64748B",
};

const riskLevelConfig = {
  LOW: { label: "Faible", color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-100" },
  MODERATE: { label: "Modéré", color: "bg-yellow-500", textColor: "text-yellow-600", bgLight: "bg-yellow-100" },
  HIGH: { label: "Élevé", color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-100" },
  CRITICAL: { label: "Critique", color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-100" },
};

const riskCategoryConfig = {
  FINANCIAL: { label: "Financier", icon: DollarSign },
  TECHNICAL: { label: "Technique", icon: Zap },
  OPERATIONAL: { label: "Opérationnel", icon: Activity },
  REGULATORY: { label: "Réglementaire", icon: FileText },
  ENVIRONMENTAL: { label: "Environnemental", icon: Globe },
  SOCIAL: { label: "Social", icon: Users },
  POLITICAL: { label: "Politique", icon: Flag },
  MARKET: { label: "Marché", icon: TrendingUp },
  SUPPLY_CHAIN: { label: "Chaîne d'appro.", icon: Factory },
  SECURITY: { label: "Sécurité", icon: Shield },
  OTHER: { label: "Autre", icon: AlertCircle },
};

const milestoneStatusConfig = {
  NOT_STARTED: { label: "Non démarré", color: "bg-gray-500" },
  PENDING: { label: "En attente", color: "bg-yellow-500" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-500" },
  COMPLETED: { label: "Terminé", color: "bg-green-500" },
  DELAYED: { label: "En retard", color: "bg-red-500" },
  ON_HOLD: { label: "Suspendu", color: "bg-orange-500" },
  CANCELLED: { label: "Annulé", color: "bg-gray-400" },
};

export default function DashboardPage() {
  const intl = useIntl();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const statusConfig = getStatusConfig(intl);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + " Mrd $";
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + " M $";
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fr-FR").format(num || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: "dashboard.loading", defaultMessage: "Chargement du tableau de bord..." })}
          </p>
        </div>
      </div>
    );
  }

  const totalJobs = (stats?.summary?.totalJobs || 0) + (stats?.summary?.totalJobsIndirect || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: "dashboard.title", defaultMessage: "Tableau de bord" })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {intl.formatMessage({ id: "dashboard.subtitle", defaultMessage: "Vue d'ensemble des investissements en RDC" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <a
                href="/api/exports/investments?type=projects&format=xlsx"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
              >
                Projets (Excel)
              </a>
              <a
                href="/api/exports/investments?type=impacts&format=xlsx"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Impacts (Excel)
              </a>
              <a
                href="/api/exports/investments?type=risks&format=xlsx"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Risques (Excel)
              </a>
              <a
                href="/api/exports/investments?type=summary&format=xlsx"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl"
              >
                Rapport synthèse
              </a>
            </div>
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-gray-700 dark:text-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {intl.formatMessage({ id: "common.refresh", defaultMessage: "Actualiser" })}
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Investissements */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              {stats?.summary?.amountGrowth !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${stats?.summary?.amountGrowth > 0 ? "text-green-200" : "text-red-200"}`}>
                  {stats?.summary?.amountGrowth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(stats?.summary?.amountGrowth || 0)}%
                </div>
              )}
            </div>
            <p className="text-blue-100 text-sm mb-1">{intl.formatMessage({ id: "dashboard.totalInvestments", defaultMessage: "Investissements totaux" })}</p>
            <p className="text-3xl font-bold">{formatCurrency(stats?.summary?.totalAmount || 0)}</p>
            <p className="text-blue-200 text-sm mt-2">
              {stats?.summary?.totalInvestments || 0} {intl.formatMessage({ id: "dashboard.projects", defaultMessage: "projets" })}
            </p>
          </div>
        </div>

        {/* Investisseurs */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-200">
                <Activity className="w-4 h-4" />
                {stats?.summary?.activeInvestors || 0} {intl.formatMessage({ id: "dashboard.active", defaultMessage: "actifs" })}
              </div>
            </div>
            <p className="text-emerald-100 text-sm mb-1">{intl.formatMessage({ id: "dashboard.investors", defaultMessage: "Investisseurs" })}</p>
            <p className="text-3xl font-bold">{stats?.summary?.totalInvestors || 0}</p>
            <p className="text-emerald-200 text-sm mt-2">
              {intl.formatMessage({ id: "dashboard.registeredPartners", defaultMessage: "Partenaires enregistrés" })}
            </p>
          </div>
        </div>

        {/* Emplois */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm text-purple-200">
                <Target className="w-4 h-4" />
                {intl.formatMessage({ id: "dashboard.socialImpact", defaultMessage: "Impact social" })}
              </div>
            </div>
            <p className="text-purple-100 text-sm mb-1">{intl.formatMessage({ id: "dashboard.jobsToCreate", defaultMessage: "Emplois à créer" })}</p>
            <p className="text-3xl font-bold">{formatNumber(totalJobs)}</p>
            <div className="flex gap-4 mt-2 text-purple-200 text-sm">
              <span>{formatNumber(stats?.summary?.totalJobs)} {intl.formatMessage({ id: "dashboard.directJobs", defaultMessage: "directs" })}</span>
              <span>{formatNumber(stats?.summary?.totalJobsIndirect)} {intl.formatMessage({ id: "dashboard.indirectJobs", defaultMessage: "indirects" })}</span>
            </div>
          </div>
        </div>

        {/* En attente */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm text-orange-200">
                <CheckCircle2 className="w-4 h-4" />
                {stats?.summary?.approvedThisMonth || 0} {intl.formatMessage({ id: "dashboard.thisMonth", defaultMessage: "ce mois" })}
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">{intl.formatMessage({ id: "dashboard.pending", defaultMessage: "En attente" })}</p>
            <p className="text-3xl font-bold">{stats?.summary?.pendingApprovals || 0}</p>
            <p className="text-orange-200 text-sm mt-2">
              {intl.formatMessage({ id: "dashboard.filesToProcess", defaultMessage: "Dossiers à traiter" })}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {intl.formatMessage({ id: "dashboard.investmentEvolution", defaultMessage: "Évolution des investissements" })}
              </h3>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.year", defaultMessage: "Année" })} {new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end gap-2">
            {stats?.charts?.monthly?.map((item, index) => {
              const maxAmount = Math.max(...(stats?.charts?.monthly?.map(m => m.amount) || [1]));
              const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
              const isCurrentMonth = index === new Date().getMonth();

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    {item.amount > 0 && (
                      <span className="text-xs text-gray-500 mb-1">
                        {formatCurrency(item.amount)}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrentMonth
                          ? "bg-gradient-to-t from-blue-600 to-blue-400"
                          : "bg-gradient-to-t from-blue-400 to-blue-300"
                      }`}
                      style={{ height: `${Math.max(height, 4)}%`, minHeight: "8px" }}
                    ></div>
                  </div>
                  <span className={`text-xs ${isCurrentMonth ? "font-bold text-blue-600" : "text-gray-500"}`}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: "dashboard.projectStatus", defaultMessage: "Statut des projets" })}
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {stats?.charts?.statusDistribution?.map((item) => {
              const config = statusConfig[item.status] || statusConfig.DRAFT;
              const total = stats?.summary?.totalInvestments || 1;
              const percentage = Math.round((item.count / total) * 100);

              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                      <span className="text-gray-700 dark:text-gray-300">{config.label}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${config.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {(!stats?.charts?.statusDistribution || stats.charts.statusDistribution.length === 0) && (
              <p className="text-gray-500 text-center py-8">{intl.formatMessage({ id: "common.noData", defaultMessage: "Aucune donnée" })}</p>
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sector Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {intl.formatMessage({ id: "dashboard.sectorDistribution", defaultMessage: "Répartition par secteur" })}
              </h3>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.topSectors", defaultMessage: "Top secteurs d'activité" })}</p>
            </div>
            <Factory className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {stats?.charts?.sectorDistribution?.slice(0, 5).map((item, index) => {
              const maxAmount = stats?.charts?.sectorDistribution?.[0]?.amount || 1;
              const percentage = Math.round((item.amount / maxAmount) * 100);
              const color = sectorColors[item.sector] || "#64748B";

              return (
                <div key={item.sector} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: color }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{item.sector}</span>
                      <span className="text-sm text-gray-500">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {(!stats?.charts?.sectorDistribution || stats.charts.sectorDistribution.length === 0) && (
              <p className="text-gray-500 text-center py-8">{intl.formatMessage({ id: "common.noData", defaultMessage: "Aucune donnée" })}</p>
            )}
          </div>
        </div>

        {/* Province Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {intl.formatMessage({ id: "dashboard.geographicDistribution", defaultMessage: "Répartition géographique" })}
              </h3>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.byProvince", defaultMessage: "Par province" })}</p>
            </div>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {stats?.charts?.provinceDistribution?.slice(0, 6).map((item, index) => {
              const maxAmount = stats?.charts?.provinceDistribution?.[0]?.amount || 1;
              const percentage = Math.round((item.amount / maxAmount) * 100);
              const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

              return (
                <div key={item.province} className="flex items-center gap-3">
                  <div
                    className="w-2 h-10 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.province}</span>
                      <span className="text-sm text-gray-500">{item.count} projet(s)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mr-3">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {(!stats?.charts?.provinceDistribution || stats.charts.provinceDistribution.length === 0) && (
              <p className="text-gray-500 text-center py-8">{intl.formatMessage({ id: "common.noData", defaultMessage: "Aucune donnée" })}</p>
            )}
          </div>
        </div>
      </div>

      {/* Impact Section - Consolidated Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Impact consolidé des investissements
            </h3>
            <p className="text-sm text-gray-500">Résultats réels rapportés par les projets</p>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Heart className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Emplois directs créés */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Emplois directs</span>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatNumber(stats?.impacts?.totalDirectJobs || 0)}
            </p>
          </div>

          {/* Emplois indirects créés */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-indigo-600 font-medium">Emplois indirects</span>
            </div>
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              {formatNumber(stats?.impacts?.totalIndirectJobs || 0)}
            </p>
          </div>

          {/* Emplois féminins */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-600" />
              <span className="text-xs text-pink-600 font-medium">Emplois féminins</span>
            </div>
            <p className="text-2xl font-bold text-pink-700 dark:text-pink-400">
              {formatNumber(stats?.impacts?.totalFemaleJobs || 0)}
            </p>
          </div>

          {/* Taxes payées */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Taxes payées</span>
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(stats?.impacts?.totalTaxes || 0)}
            </p>
          </div>

          {/* Exportations */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-600 font-medium">Exportations</span>
            </div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {formatCurrency(stats?.impacts?.totalExports || 0)}
            </p>
          </div>

          {/* Employés formés */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Formés</span>
            </div>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {formatNumber(stats?.impacts?.totalTrainedEmployees || 0)}
            </p>
          </div>
        </div>

        {/* Additional impact metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Revenus générés</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(stats?.impacts?.totalRevenue || 0)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Achats locaux</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(stats?.impacts?.totalLocalPurchases || 0)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Invest. communautaires</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(stats?.impacts?.totalCommunityInvestment || 0)}</span>
          </div>
        </div>
      </div>

      {/* Risks and Milestones Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analyse des risques
              </h3>
              <p className="text-sm text-gray-500">Risques actifs sur les projets</p>
            </div>
            <div className="flex items-center gap-2">
              {(stats?.risks?.totalCritical > 0 || stats?.risks?.totalHigh > 0) && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                  {stats.risks.totalCritical + stats.risks.totalHigh} à surveiller
                </span>
              )}
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          {/* Risk level distribution */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((level) => {
              const config = riskLevelConfig[level];
              const count = stats?.risks?.distribution?.find(r => r.level === level)?.count || 0;
              return (
                <div key={level} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                  <div className={`w-3 h-3 rounded-full ${config.color} mx-auto mb-1`}></div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{count}</p>
                  <p className="text-xs text-gray-500">{config.label}</p>
                </div>
              );
            })}
          </div>

          {/* Critical risks list */}
          {stats?.risks?.critical && stats.risks.critical.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Risques critiques/élevés</p>
              {stats.risks.critical.slice(0, 3).map((risk) => {
                const levelConfig = riskLevelConfig[risk.riskLevel] || riskLevelConfig.MODERATE;
                return (
                  <Link
                    key={risk.id}
                    href={`/investments/projects/${risk.projectId}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`w-2 h-8 rounded-full ${levelConfig.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{risk.title}</p>
                      <p className="text-xs text-gray-500">{risk.projectCode}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${levelConfig.bgLight} ${levelConfig.textColor}`}>
                      {levelConfig.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Shield className="w-10 h-10 text-green-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucun risque critique</p>
            </div>
          )}
        </div>

        {/* Milestones Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suivi des jalons
              </h3>
              <p className="text-sm text-gray-500">Progression globale: {stats?.milestones?.avgProgress || 0}%</p>
            </div>
            <Target className="w-5 h-5 text-blue-500" />
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progression moyenne</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats?.milestones?.avgProgress || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${stats?.milestones?.avgProgress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Milestones stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{stats?.milestones?.completed || 0}</p>
              <p className="text-xs text-green-600">Terminés</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{stats?.milestones?.inProgress || 0}</p>
              <p className="text-xs text-blue-600">En cours</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-lg font-bold text-red-700 dark:text-red-400">{stats?.milestones?.delayed?.length || 0}</p>
              <p className="text-xs text-red-600">En retard</p>
            </div>
          </div>

          {/* Delayed milestones list */}
          {stats?.milestones?.delayed && stats.milestones.delayed.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Jalons en retard</p>
              {stats.milestones.delayed.slice(0, 3).map((milestone) => (
                <Link
                  key={milestone.id}
                  href={`/investments/projects/${milestone.projectId}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-2 h-8 rounded-full bg-red-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{milestone.name}</p>
                    <p className="text-xs text-gray-500">{milestone.projectCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{milestone.progress}%</p>
                    <p className="text-xs text-gray-500">
                      {milestone.plannedEndDate ? new Date(milestone.plannedEndDate).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-10 h-10 text-green-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Tous les jalons sont dans les temps</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Investments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: "dashboard.recentInvestments", defaultMessage: "Investissements récents" })}
            </h3>
            <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.latestProjects", defaultMessage: "Derniers projets enregistrés" })}</p>
          </div>
          <Link
            href="/investments/projects"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {intl.formatMessage({ id: "dashboard.viewAll", defaultMessage: "Voir tout" })}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentInvestments && stats.recentInvestments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "dashboard.project", defaultMessage: "Projet" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "dashboard.investor", defaultMessage: "Investisseur" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "dashboard.sector", defaultMessage: "Secteur" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "dashboard.amount", defaultMessage: "Montant" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "dashboard.progress", defaultMessage: "Progression" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "common.status", defaultMessage: "Statut" })}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "common.actions", defaultMessage: "Actions" })}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.recentInvestments.map((investment) => {
                  const config = statusConfig[investment.status] || statusConfig.DRAFT;

                  return (
                    <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {investment.name}
                          </p>
                          <p className="text-sm text-gray-500">{investment.projectCode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{investment.investor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 dark:text-gray-300">{investment.sector || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(investment.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500 transition-all"
                              style={{ width: `${investment.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{investment.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgLight} ${config.textColor}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/investments/projects/${investment.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {intl.formatMessage({ id: "common.view", defaultMessage: "Voir" })}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{intl.formatMessage({ id: "dashboard.noRecentInvestments", defaultMessage: "Aucun investissement récent" })}</p>
          </div>
        )}
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.countries", defaultMessage: "Pays" })}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats?.charts?.countryDistribution?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.approved", defaultMessage: "Approuvés" })}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats?.charts?.statusDistribution?.find(s => s.status === "APPROVED")?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.inProgress", defaultMessage: "En cours" })}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats?.charts?.statusDistribution?.find(s => s.status === "IN_PROGRESS")?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{intl.formatMessage({ id: "dashboard.underReview", defaultMessage: "En examen" })}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats?.charts?.statusDistribution?.find(s => s.status === "UNDER_REVIEW")?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
