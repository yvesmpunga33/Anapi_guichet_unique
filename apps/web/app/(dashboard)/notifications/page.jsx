"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Clock,
  Target,
  FileText,
  Shield,
  ChevronRight,
  Filter,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Gavel,
  Building2,
} from "lucide-react";

const priorityConfig = {
  CRITICAL: { label: "Critique", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-100 dark:bg-red-900/30" },
  HIGH: { label: "Élevé", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-100 dark:bg-orange-900/30" },
  MEDIUM: { label: "Moyen", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-100 dark:bg-yellow-900/30" },
  LOW: { label: "Faible", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-100 dark:bg-blue-900/30" },
};

const categoryConfig = {
  investments: { label: "Investissements", icon: Building2, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  procurement: { label: "Passation des marchés", icon: Gavel, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  legal: { label: "Direction Juridique", icon: FileText, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
};

const typeIcons = {
  MILESTONE_DELAYED: Target,
  RISK_CRITICAL: AlertTriangle,
  APPROVAL_PENDING: Clock,
  TENDER_DEADLINE: Briefcase,
  CONTRACT_EXPIRING: FileText,
  LEGAL_CONTRACT_EXPIRING: FileText,
  LEGAL_ALERT: AlertCircle,
};

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  useEffect(() => {
    fetchAlerts();
  }, [selectedCategory, selectedPriority]);

  const fetchAlerts = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedPriority !== "all") params.append("priority", selectedPriority);
      params.append("limit", "50");

      const response = await fetch(`/api/notifications/alerts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.data || []);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
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

  const formatRelativeTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const target = new Date(date);
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)}j en retard`;
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    return `Dans ${diffDays}j`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement des alertes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            Notifications & Alertes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Centre de notifications du système
          </p>
        </div>
        <button
          onClick={() => fetchAlerts(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-gray-700 dark:text-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{summary.byPriority.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Élevées</p>
                <p className="text-2xl font-bold text-orange-600">{summary.byPriority.high}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Moyennes</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.byPriority.medium}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Filtrer:</span>
          </div>

          {/* Category filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Toutes catégories
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  selectedCategory === key
                    ? `${config.bg} ${config.color}`
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setSelectedPriority("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedPriority === "all"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Toutes priorités
            </button>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedPriority(key.toLowerCase())}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedPriority === key.toLowerCase()
                    ? `${config.bgLight} ${config.textColor}`
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {alerts.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {alerts.map((alert) => {
              const priorityConf = priorityConfig[alert.priority] || priorityConfig.MEDIUM;
              const categoryConf = categoryConfig[alert.category] || categoryConfig.investments;
              const IconComponent = typeIcons[alert.type] || AlertCircle;

              return (
                <Link
                  key={alert.id}
                  href={alert.link || "#"}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Priority indicator */}
                  <div className={`w-1 h-16 rounded-full ${priorityConf.color} flex-shrink-0`}></div>

                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${categoryConf.bg} flex-shrink-0`}>
                    <IconComponent className={`w-5 h-5 ${categoryConf.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {alert.description}
                        </p>
                        {(alert.projectCode || alert.reference) && (
                          <p className="text-xs text-gray-400 mt-1">
                            Réf: {alert.projectCode || alert.reference}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityConf.bgLight} ${priorityConf.textColor}`}>
                          {priorityConf.label}
                        </span>
                        {alert.dueDate && (
                          <span className={`text-xs ${
                            alert.daysLate ? "text-red-600" :
                            alert.daysRemaining <= 3 ? "text-orange-600" : "text-gray-500"
                          }`}>
                            {formatRelativeTime(alert.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${categoryConf.bg} ${categoryConf.color}`}>
                        <categoryConf.icon className="w-3 h-3" />
                        {categoryConf.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(alert.createdAt)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune alerte
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedCategory !== "all" || selectedPriority !== "all"
                ? "Aucune alerte ne correspond aux filtres sélectionnés."
                : "Tout est en ordre ! Aucune alerte à signaler pour le moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
