"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-500", textColor: "text-gray-600", bgLight: "bg-gray-100" },
  SUBMITTED: { label: "Soumis", color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-100" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-500", textColor: "text-yellow-600", bgLight: "bg-yellow-100" },
  APPROVED: { label: "Approuve", color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-100" },
  REJECTED: { label: "Rejete", color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-100" },
  IN_PROGRESS: { label: "En cours", color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-100" },
  COMPLETED: { label: "Termine", color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-100" },
  CANCELLED: { label: "Annule", color: "bg-gray-500", textColor: "text-gray-600", bgLight: "bg-gray-100" },
};

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

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
          <p className="text-gray-600 dark:text-gray-400">Chargement du tableau de bord...</p>
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
            Tableau de bord
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Vue d'ensemble des investissements en RDC
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
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
            <p className="text-blue-100 text-sm mb-1">Investissements totaux</p>
            <p className="text-3xl font-bold">{formatCurrency(stats?.summary?.totalAmount || 0)}</p>
            <p className="text-blue-200 text-sm mt-2">
              {stats?.summary?.totalInvestments || 0} projets
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
                {stats?.summary?.activeInvestors || 0} actifs
              </div>
            </div>
            <p className="text-emerald-100 text-sm mb-1">Investisseurs</p>
            <p className="text-3xl font-bold">{stats?.summary?.totalInvestors || 0}</p>
            <p className="text-emerald-200 text-sm mt-2">
              Partenaires enregistres
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
                Impact social
              </div>
            </div>
            <p className="text-purple-100 text-sm mb-1">Emplois a creer</p>
            <p className="text-3xl font-bold">{formatNumber(totalJobs)}</p>
            <div className="flex gap-4 mt-2 text-purple-200 text-sm">
              <span>{formatNumber(stats?.summary?.totalJobs)} directs</span>
              <span>{formatNumber(stats?.summary?.totalJobsIndirect)} indirects</span>
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
                {stats?.summary?.approvedThisMonth || 0} ce mois
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">En attente</p>
            <p className="text-3xl font-bold">{stats?.summary?.pendingApprovals || 0}</p>
            <p className="text-orange-200 text-sm mt-2">
              Dossiers a traiter
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
                Evolution des investissements
              </h3>
              <p className="text-sm text-gray-500">Annee {new Date().getFullYear()}</p>
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
              Statut des projets
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
              <p className="text-gray-500 text-center py-8">Aucune donnee</p>
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
                Repartition par secteur
              </h3>
              <p className="text-sm text-gray-500">Top secteurs d'activite</p>
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
              <p className="text-gray-500 text-center py-8">Aucune donnee</p>
            )}
          </div>
        </div>

        {/* Province Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Repartition geographique
              </h3>
              <p className="text-sm text-gray-500">Par province</p>
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
              <p className="text-gray-500 text-center py-8">Aucune donnee</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Investments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Investissements recents
            </h3>
            <p className="text-sm text-gray-500">Derniers projets enregistres</p>
          </div>
          <Link
            href="/investments/projects"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentInvestments && stats.recentInvestments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Investisseur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Secteur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progression
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
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
                          Voir
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
            <p className="text-gray-500">Aucun investissement recent</p>
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
              <p className="text-sm text-gray-500">Pays</p>
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
              <p className="text-sm text-gray-500">Approuves</p>
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
              <p className="text-sm text-gray-500">En cours</p>
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
              <p className="text-sm text-gray-500">En examen</p>
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
