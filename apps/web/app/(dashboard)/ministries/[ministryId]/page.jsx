"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Building2,
  FileCheck,
  FileBadge,
  FileKey,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Calendar,
  Users,
  Timer,
  BarChart3,
  Activity,
  Zap,
  Loader2,
  RefreshCw,
} from "lucide-react";

const requestTypeConfig = {
  AUTORISATION: {
    label: "Autorisations",
    icon: FileCheck,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  LICENCE: {
    label: "Licences",
    icon: FileBadge,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  PERMIS: {
    label: "Permis",
    icon: FileKey,
    color: "orange",
    gradient: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50 dark:bg-orange-900/20",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  AGREMENT: {
    label: "Agrément",
    icon: FileCheck,
    color: "green",
    gradient: "from-green-500 to-green-600",
    bgLight: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400",
  },
  OTHER: {
    label: "Autre",
    icon: FileCheck,
    color: "gray",
    gradient: "from-gray-500 to-gray-600",
    bgLight: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-600 dark:text-gray-400",
  },
};

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
  SUBMITTED: { label: "Soumis", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  IN_PROGRESS: { label: "En cours", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  PENDING_DOCUMENTS: { label: "Documents requis", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const priorityConfig = {
  LOW: { label: "Basse", color: "text-gray-500" },
  NORMAL: { label: "Normale", color: "text-blue-500" },
  HIGH: { label: "Haute", color: "text-orange-500" },
  URGENT: { label: "Urgente", color: "text-red-500", icon: Zap },
};

export default function MinistryDashboard({ params }) {
  const resolvedParams = use(params);
  const { ministryId } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const fetchDashboard = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`/api/ministries/${ministryId}/dashboard`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [ministryId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Impossible de charger les donnees</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.ministry?.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Code: {data.ministry?.code} • Tableau de bord ministeriel
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium">Total Demandes</p>
            <p className="text-4xl font-bold mt-2">{data.globalStats?.total || 0}</p>
            <div className="flex items-center gap-2 mt-3 text-blue-100 text-sm">
              <Activity className="w-4 h-4" />
              <span>Toutes categories</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-yellow-500/25">
          <div className="relative z-10">
            <p className="text-yellow-100 text-sm font-medium">En Attente</p>
            <p className="text-4xl font-bold mt-2">{data.globalStats?.pending || 0}</p>
            <div className="flex items-center gap-2 mt-3 text-yellow-100 text-sm">
              <Clock className="w-4 h-4" />
              <span>A traiter</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-green-500/25">
          <div className="relative z-10">
            <p className="text-green-100 text-sm font-medium">Approuves</p>
            <p className="text-4xl font-bold mt-2">{data.globalStats?.approved || 0}</p>
            <div className="flex items-center gap-2 mt-3 text-green-100 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valides</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="relative z-10">
            <p className="text-gray-300 text-sm font-medium">Delai Moyen</p>
            <p className="text-4xl font-bold mt-2">{data.avgProcessingDays || 0}<span className="text-lg font-normal text-gray-400 ml-1">jours</span></p>
            <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
              <Timer className="w-4 h-4" />
              <span>Temps de traitement</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Types de demandes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {["AUTORISATION", "LICENCE", "PERMIS"].map((type) => {
          const config = requestTypeConfig[type];
          const stats = data.stats?.[type] || { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 };
          const TypeIcon = config.icon;
          const workflowSteps = data.workflowConfig?.[type] || 0;

          return (
            <div
              key={type}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-r ${config.gradient} p-5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{config.label}</h3>
                      <p className="text-white/80 text-sm">{workflowSteps} etapes configurees</p>
                    </div>
                  </div>
                  <Link
                    href={`/ministries/${ministryId}/${type === 'PERMIS' ? 'permis' : type.toLowerCase() + 's'}`}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </Link>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">En attente</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Approuves</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">Rejetes</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demandes urgentes et récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandes urgentes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Demandes Urgentes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priorite haute ou en retard</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded-full">
                {data.urgentRequests?.length || 0}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.urgentRequests?.length > 0 ? (
              data.urgentRequests.map((request) => {
                const typeConfig = requestTypeConfig[request.requestType];
                const prioConfig = priorityConfig[request.priority];
                const PrioIcon = prioConfig.icon;

                return (
                  <Link
                    key={request.id}
                    href={`/ministries/${ministryId}/requests/${request.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`w-10 h-10 ${typeConfig.bgLight} rounded-lg flex items-center justify-center`}>
                      <typeConfig.icon className={`w-5 h-5 ${typeConfig.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {request.requestNumber}
                        </p>
                        {PrioIcon && <PrioIcon className={`w-4 h-4 ${prioConfig.color}`} />}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {request.applicantName}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </Link>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucune demande urgente</p>
              </div>
            )}
          </div>
        </div>

        {/* Demandes récentes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Demandes Recentes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dernieres soumissions</p>
                </div>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
            {data.recentRequests?.length > 0 ? (
              data.recentRequests.map((request) => {
                const typeConfig = requestTypeConfig[request.requestType] || requestTypeConfig.OTHER;
                const status = statusConfig[request.status] || statusConfig.DRAFT;

                return (
                  <Link
                    key={request.id}
                    href={`/ministries/${ministryId}/requests/${request.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`w-10 h-10 ${typeConfig.bgLight} rounded-lg flex items-center justify-center`}>
                      <typeConfig.icon className={`w-5 h-5 ${typeConfig.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.requestNumber}
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {request.subject}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.currentStep}/{request.totalSteps}
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${typeConfig.gradient}`}
                          style={{ width: `${(request.currentStep / request.totalSteps) * 100}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucune demande recente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
