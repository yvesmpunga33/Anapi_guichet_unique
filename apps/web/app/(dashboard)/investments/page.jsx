"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronRight,
  Factory,
  Globe,
  BarChart3,
  PieChart,
} from "lucide-react";

// Services
import { ProjectList } from "@/app/services/admin/Project.service";
import { InvestorList } from "@/app/services/admin/Investor.service";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500" },
  SUBMITTED: { label: "Soumis", color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-500" },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-500" },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700", bgColor: "bg-green-500" },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700", bgColor: "bg-red-500" },
  IN_PROGRESS: { label: "En cours", color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-500" },
  COMPLETED: { label: "Termine", color: "bg-emerald-100 text-emerald-700", bgColor: "bg-emerald-500" },
  CANCELLED: { label: "Annule", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500" },
};

const sectorColors = {
  "Agriculture": "bg-green-500",
  "Mines": "bg-amber-500",
  "Energie": "bg-yellow-500",
  "Technologies": "bg-blue-500",
  "Tourisme": "bg-pink-500",
  "Industrie": "bg-purple-500",
  "Services": "bg-cyan-500",
  "Transport": "bg-orange-500",
  "Construction": "bg-red-500",
  "Commerce": "bg-indigo-500",
  "Sante": "bg-rose-500",
  "Education": "bg-teal-500",
};

export default function InvestmentsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    projects: [],
    investors: [],
    stats: null,
    sectors: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch projects and investors in parallel
      const [projectsResponse, investorsResponse] = await Promise.all([
        ProjectList({ limit: 100 }),
        InvestorList({ limit: 100 }),
      ]);

      const projectsData = projectsResponse.data;
      const investorsData = investorsResponse.data;

      // Calculate additional stats
      const projects = projectsData.projects || [];
      const investors = investorsData.investors || [];

      // Group by sector
      const sectorStats = {};
      projects.forEach(p => {
        if (p.sector) {
          if (!sectorStats[p.sector]) {
            sectorStats[p.sector] = { count: 0, amount: 0, jobs: 0 };
          }
          sectorStats[p.sector].count++;
          sectorStats[p.sector].amount += parseFloat(p.amount) || 0;
          sectorStats[p.sector].jobs += p.jobsCreated || 0;
        }
      });

      // Group by status
      const statusStats = {};
      projects.forEach(p => {
        if (!statusStats[p.status]) {
          statusStats[p.status] = 0;
        }
        statusStats[p.status]++;
      });

      // Group by province
      const provinceStats = {};
      projects.forEach(p => {
        if (p.province) {
          if (!provinceStats[p.province]) {
            provinceStats[p.province] = { count: 0, amount: 0 };
          }
          provinceStats[p.province].count++;
          provinceStats[p.province].amount += parseFloat(p.amount) || 0;
        }
      });

      // Recent projects (last 5)
      const recentProjects = projects.slice(0, 5);

      // Projects by month (last 6 months)
      const monthlyStats = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        monthlyStats[key] = 0;
      }
      projects.forEach(p => {
        const d = new Date(p.createdAt);
        const key = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        if (monthlyStats[key] !== undefined) {
          monthlyStats[key]++;
        }
      });

      setData({
        projects,
        investors,
        stats: {
          ...projectsData.stats,
          investorCount: investors.length,
          sectorStats,
          statusStats,
          provinceStats,
          monthlyStats,
        },
        recentProjects,
        sectors: projectsData.sectors || [],
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatAmount = (amount, currency = "USD") => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B ${currency}`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${currency}`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${currency}`;
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">{error}</h2>
        <button
          onClick={fetchData}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reessayer
        </button>
      </div>
    );
  }

  const { stats, recentProjects, projects, investors } = data;

  // Calculate sector data for chart
  const sectorData = Object.entries(stats?.sectorStats || {})
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const totalSectorAmount = sectorData.reduce((sum, s) => sum + s.amount, 0);

  // Calculate province data
  const provinceData = Object.entries(stats?.provinceStats || {})
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord - Investissements</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble des projets et investisseurs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/investments/projects/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Nouveau Projet
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projets</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.total || 0}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {stats?.inProgress || 0} en cours
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Investissements</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatAmount(stats?.totalAmount || 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Moy. {formatAmount((stats?.totalAmount || 0) / (stats?.total || 1))}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emplois Crees</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalJobs || 0}</p>
              <p className="text-sm text-gray-500 mt-1">
                ~{Math.round((stats?.totalJobs || 0) / (stats?.total || 1))} par projet
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Investisseurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.investorCount || 0}</p>
              <Link
                href="/investments/investors"
                className="text-sm text-blue-600 mt-1 flex items-center gap-1 hover:underline"
              >
                Voir tous
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Repartition par Secteur</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          {sectorData.length > 0 ? (
            <div className="space-y-4">
              {sectorData.map((sector, index) => {
                const percentage = totalSectorAmount > 0
                  ? ((sector.amount / totalSectorAmount) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={sector.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{sector.name}</span>
                      <span className="text-gray-500">
                        {sector.count} projets - {formatAmount(sector.amount)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${sectorColors[sector.name] || 'bg-blue-500'} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Factory className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune donnee sectorielle</p>
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Statut des Projets</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats?.statusStats || {}).map(([status, count]) => {
              const config = statusConfig[status] || statusConfig.DRAFT;
              return (
                <div key={status} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${config.bgColor}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{config.label}</p>
                    <p className="text-lg font-bold text-gray-700">{count}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(stats?.statusStats || {}).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun projet</p>
            </div>
          )}
        </div>
      </div>

      {/* Province Distribution & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Province Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Provinces</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

          {provinceData.length > 0 ? (
            <div className="space-y-3">
              {provinceData.map((province, index) => (
                <div key={province.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-700">{province.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{province.count} projets</p>
                    <p className="text-xs text-gray-500">{formatAmount(province.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune donnee geographique</p>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Projets Recents</h3>
            <Link
              href="/investments/projects"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Voir tous
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentProjects && recentProjects.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentProjects.map((project) => {
                const status = statusConfig[project.status] || statusConfig.DRAFT;
                return (
                  <Link
                    key={project.id}
                    href={`/investments/projects/${project.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${sectorColors[project.sector] || 'bg-blue-500'} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                        <Briefcase className={`w-5 h-5 ${sectorColors[project.sector] ? sectorColors[project.sector].replace('bg-', 'text-') : 'text-blue-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{project.projectName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{project.projectCode}</span>
                          {project.sector && (
                            <>
                              <span>•</span>
                              <span>{project.sector}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatAmount(project.amount, project.currency || "USD")}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun projet recent</p>
              <Link
                href="/investments/projects/new"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Creer un projet
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/investments/projects"
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Gestion des Projets</h3>
              <p className="text-blue-100 text-sm mt-1">Voir, creer et modifier les projets</p>
            </div>
            <Briefcase className="w-10 h-10 text-blue-200" />
          </div>
        </Link>

        <Link
          href="/investments/investors"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Gestion des Investisseurs</h3>
              <p className="text-purple-100 text-sm mt-1">Repertoire des investisseurs</p>
            </div>
            <Building2 className="w-10 h-10 text-purple-200" />
          </div>
        </Link>

        <Link
          href="/investments/tracking"
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Suivi des Projets</h3>
              <p className="text-green-100 text-sm mt-1">Progression et etapes cles</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-200" />
          </div>
        </Link>
      </div>
    </div>
  );
}
