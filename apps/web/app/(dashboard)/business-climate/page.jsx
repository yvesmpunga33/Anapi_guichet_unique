"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  AlertTriangle,
  Handshake,
  Users2,
  Megaphone,
  Globe,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Building2,
  FileText,
  Scale,
  ChevronRight,
  Plus,
  Activity,
  Shield,
  Zap,
  Award,
  PieChart,
  BarChart2,
  MapPin,
  Briefcase,
} from "lucide-react";

// Services
import { BusinessClimateStatistics } from "@/app/services/admin/BusinessClimate.service";

const categoryLabels = {
  ADMINISTRATIVE: "Administratif",
  FISCAL: "Fiscal",
  REGULATORY: "Réglementaire",
  LAND: "Foncier",
  CUSTOMS: "Douanier",
  LABOR: "Travail",
  INFRASTRUCTURE: "Infrastructure",
  FINANCIAL: "Financier",
  OTHER: "Autre",
};

const statusLabels = {
  REPORTED: "Signalé",
  ACKNOWLEDGED: "Accusé réception",
  UNDER_ANALYSIS: "En analyse",
  IN_PROGRESS: "En cours",
  ESCALATED: "Escaladé",
  RESOLVED: "Résolu",
  CLOSED: "Fermé",
};

const priorityConfig = {
  CRITICAL: { label: "Critique", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  HIGH: { label: "Élevé", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  MEDIUM: { label: "Moyen", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  LOW: { label: "Faible", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
};

// Circular Progress Component
function CircularProgress({ value, size = 120, strokeWidth = 10, color = "text-blue-600" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subValue, icon: Icon, iconBg, iconColor, href, trend, trendUp }) {
  const content = (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all group h-full">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {href && (
          <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
      {(subValue || trend !== undefined) && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {trend !== undefined ? (
            <div className="flex items-center gap-2">
              {trendUp ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}%
              </span>
              <span className="text-xs text-gray-400">vs période précédente</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{subValue}</p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function BusinessClimateDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
  }, [selectedYear]);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await BusinessClimateStatistics({ year: selectedYear });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 $";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold">Direction du Climat des Affaires</h1>
            </div>
            <p className="text-slate-400 max-w-2xl">
              Suivi et amélioration de l'environnement des affaires en RDC - Gestion des obstacles,
              médiations, dialogues et réformes réglementaires.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year} className="bg-slate-800">{year}</option>
              ))}
            </select>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>

        {/* Quick Actions in Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Link
            href="/business-climate/barriers/new"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium">Signaler un obstacle</span>
          </Link>
          <Link
            href="/business-climate/mediations/new"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <Handshake className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">Nouvelle médiation</span>
          </Link>
          <Link
            href="/business-climate/dialogues/new"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <Users2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">Planifier un dialogue</span>
          </Link>
          <Link
            href="/business-climate/proposals/new"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <Megaphone className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Nouvelle proposition</span>
          </Link>
        </div>
      </div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Obstacles signalés"
          value={stats?.barriers?.total || 0}
          subValue={`${stats?.barriers?.critical || 0} critique(s)`}
          icon={AlertTriangle}
          iconBg="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600"
          href="/business-climate/barriers"
        />
        <StatCard
          title="Cas de médiation"
          value={stats?.mediations?.total || 0}
          subValue={`${stats?.mediations?.ongoing || 0} en cours`}
          icon={Handshake}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600"
          href="/business-climate/mediations"
        />
        <StatCard
          title="Dialogues organisés"
          value={stats?.dialogues?.total || 0}
          subValue={`${stats?.dialogues?.upcoming || 0} à venir`}
          icon={Users2}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600"
          href="/business-climate/dialogues"
        />
        <StatCard
          title="Propositions légales"
          value={stats?.proposals?.total || 0}
          subValue={`${stats?.proposals?.adopted || 0} adoptée(s)`}
          icon={Megaphone}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600"
          href="/business-climate/proposals"
        />
      </div>

      {/* Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resolution Rate Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Taux de résolution</h3>
              <p className="text-sm text-gray-500">Obstacles résolus</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <CircularProgress
              value={stats?.barriers?.resolutionRate || 0}
              color="text-green-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.barriers?.resolved || 0}</p>
              <p className="text-xs text-gray-500">Résolus</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{stats?.barriers?.inProgress || 0}</p>
              <p className="text-xs text-gray-500">En cours</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">{stats?.barriers?.critical || 0}</p>
              <p className="text-xs text-gray-500">Critiques</p>
            </div>
          </div>
        </div>

        {/* Mediation Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Taux de succès</h3>
              <p className="text-sm text-gray-500">Médiations réglées</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <CircularProgress
              value={stats?.mediations?.successRate || 0}
              color="text-purple-500"
            />
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Montant réclamé</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(stats?.mediations?.totalClaimAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Montant réglé</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(stats?.mediations?.totalSettlementAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Treaties & Indicators */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accords internationaux</h3>
              <p className="text-sm text-gray-500">Traités et conventions</p>
            </div>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.treaties?.total || 0}</p>
                <p className="text-sm text-gray-500">Traités signés</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.treaties?.inForce || 0}</p>
                <p className="text-sm text-gray-500">En vigueur</p>
              </div>
            </div>
          </div>
          <Link
            href="/business-climate/treaties"
            className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-indigo-600 hover:text-indigo-700"
          >
            Voir tous les traités <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Obstacles by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <PieChart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Obstacles par catégorie</h3>
                <p className="text-sm text-gray-500">Répartition des signalements</p>
              </div>
            </div>
            <Link
              href="/business-climate/barriers"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Détails <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {stats?.barriers?.byCategory?.length > 0 ? (
            <div className="space-y-3">
              {stats.barriers.byCategory.slice(0, 6).map((item, index) => {
                const total = stats.barriers.total || 1;
                const percentage = Math.round((item.count / total) * 100);
                const colors = [
                  "bg-red-500", "bg-orange-500", "bg-yellow-500",
                  "bg-green-500", "bg-blue-500", "bg-purple-500"
                ];
                return (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {categoryLabels[item.category] || item.category}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <BarChart2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
              <Link
                href="/business-climate/barriers/new"
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Signaler un obstacle <Plus className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Obstacles by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statut des obstacles</h3>
                <p className="text-sm text-gray-500">Progression du traitement</p>
              </div>
            </div>
          </div>

          {stats?.barriers?.byStatus?.length > 0 ? (
            <div className="space-y-3">
              {stats.barriers.byStatus.map((item) => {
                const total = stats.barriers.total || 1;
                const percentage = Math.round((item.count / total) * 100);
                const statusColors = {
                  REPORTED: "bg-gray-400",
                  ACKNOWLEDGED: "bg-blue-400",
                  UNDER_ANALYSIS: "bg-purple-500",
                  IN_PROGRESS: "bg-yellow-500",
                  ESCALATED: "bg-red-500",
                  RESOLVED: "bg-green-500",
                  CLOSED: "bg-gray-500",
                };
                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {statusLabels[item.status] || item.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[item.status] || 'bg-gray-400'} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Obstacles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Obstacles récents</h3>
            </div>
            <Link
              href="/business-climate/barriers"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats?.barriers?.recent?.length > 0 ? (
              stats.barriers.recent.map((barrier) => {
                const priorityConf = priorityConfig[barrier.severity] || priorityConfig.MEDIUM;
                return (
                  <Link
                    key={barrier.id}
                    href={`/business-climate/barriers/${barrier.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${priorityConf.bg}`}>
                      <AlertTriangle className={`w-4 h-4 ${priorityConf.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {barrier.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{barrier.reference}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {categoryLabels[barrier.category] || barrier.category}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${priorityConf.bg} ${priorityConf.color}`}>
                      {priorityConf.label}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-300 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucun obstacle en attente</p>
                <p className="text-xs text-gray-400 mt-1">Tous les obstacles ont été traités</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Dialogues */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prochains dialogues</h3>
            </div>
            <Link
              href="/business-climate/dialogues"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats?.dialogues?.upcomingEvents?.length > 0 ? (
              stats.dialogues.upcomingEvents.map((dialogue) => (
                <Link
                  key={dialogue.id}
                  href={`/business-climate/dialogues/${dialogue.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {dialogue.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-blue-600 font-medium">
                        {formatDate(dialogue.scheduledDate)}
                      </span>
                      {dialogue.venue && (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-gray-400 ml-1" />
                          <span className="text-xs text-gray-500 truncate">
                            {dialogue.venue}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucun dialogue planifié</p>
                <Link
                  href="/business-climate/dialogues/new"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Planifier un dialogue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Traités internationaux"
          value={stats?.treaties?.total || 0}
          subValue={`${stats?.treaties?.inForce || 0} en vigueur`}
          icon={Globe}
          iconBg="bg-indigo-100 dark:bg-indigo-900/30"
          iconColor="text-indigo-600"
          href="/business-climate/treaties"
        />
        <StatCard
          title="Indicateurs climat"
          value="--"
          subValue="Doing Business, etc."
          icon={Target}
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          iconColor="text-yellow-600"
          href="/business-climate/indicators"
        />
        <StatCard
          title="Participants dialogues"
          value={formatNumber(stats?.dialogues?.totalParticipants)}
          subValue={`${stats?.dialogues?.completed || 0} événements terminés`}
          icon={Briefcase}
          iconBg="bg-teal-100 dark:bg-teal-900/30"
          iconColor="text-teal-600"
        />
        <StatCard
          title="Propositions en révision"
          value={stats?.proposals?.underReview || 0}
          subValue="En attente de décision"
          icon={FileText}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600"
          href="/business-climate/proposals"
        />
      </div>
    </div>
  );
}
