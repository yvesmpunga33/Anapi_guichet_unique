"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileSignature,
  BookOpen,
  RefreshCw,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  LegalAlertList,
  LegalAlertUpdate,
  LegalAlertGenerate,
  LegalAlertGenerateStats,
} from "@/app/services/admin/Legal.service";

export default function LegalAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: "",
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchStats = async () => {
    try {
      const response = await LegalAlertGenerateStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const generateAlerts = async () => {
    setGenerating(true);
    setNotification(null);
    try {
      const response = await LegalAlertGenerate();
      const data = response.data;
      setNotification({
        type: "success",
        message: data.message,
        details: data.alertsCreated,
      });
      fetchAlerts();
      fetchStats();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Erreur lors de la generation",
      });
    } finally {
      setGenerating(false);
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
      };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.type) params.type = filters.type;

      const response = await LegalAlertList(params);
      const data = response.data;
      setAlerts(data.alerts || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await LegalAlertUpdate(id, { status: "RESOLVED", resolvedAt: new Date() });
      fetchAlerts();
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const handleDismiss = async (id) => {
    if (!confirm("Voulez-vous vraiment ignorer cette alerte ?")) return;
    try {
      await LegalAlertUpdate(id, { status: "DISMISSED" });
      fetchAlerts();
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "En attente",
      },
      NOTIFIED: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        label: "Notifie",
      },
      ACKNOWLEDGED: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        label: "Accuse",
      },
      IN_PROGRESS: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        label: "En cours",
      },
      RESOLVED: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        label: "Resolu",
      },
      DISMISSED: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        label: "Ignore",
      },
    };
    const style = styles[status] || styles.PENDING;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      LOW: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Basse" },
      MEDIUM: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        label: "Moyenne",
      },
      HIGH: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        label: "Haute",
      },
      CRITICAL: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Critique",
      },
    };
    const style = styles[priority] || styles.MEDIUM;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "CONTRACT_EXPIRATION":
      case "CONTRACT_RENEWAL":
        return <FileSignature className="w-5 h-5 text-green-500" />;
      case "DOCUMENT_REVIEW":
      case "LAW_MODIFICATION":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-orange-500" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      CONTRACT_EXPIRATION: "Expiration contrat",
      CONTRACT_RENEWAL: "Renouvellement",
      DOCUMENT_REVIEW: "Revision document",
      LAW_MODIFICATION: "Modification loi",
      DEADLINE: "Echeance",
      CUSTOM: "Personnalisee",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-orange-500" />
            Alertes Juridiques
          </h1>
          <p className="text-gray-400 mt-1">
            Suivi des echeances et notifications importantes
          </p>
        </div>
        <button
          onClick={generateAlerts}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {generating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          {generating ? "Generation..." : "Generer les alertes"}
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-500/20 border-green-500/50 text-green-400"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          {notification.details && notification.details.length > 0 && (
            <div className="mt-2 ml-7 text-sm">
              {notification.details.map((detail, idx) => (
                <div key={idx} className="text-green-300">
                  • {detail.alertNumber}: {detail.reference} ({detail.daysRemaining} jours)
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.urgent || 0}</p>
                <p className="text-xs text-gray-400">Urgentes (7 jours)</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.byStatus?.PENDING || 0}</p>
                <p className="text-xs text-gray-400">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.byPriority?.HIGH || 0}</p>
                <p className="text-xs text-gray-400">Priorite haute</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.byStatus?.RESOLVED || 0}</p>
                <p className="text-xs text-gray-400">Resolues</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Resolu</option>
            <option value="DISMISSED">Ignore</option>
          </select>

          {/* Priority */}
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Toutes les priorites</option>
            <option value="CRITICAL">Critique</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>

          {/* Type */}
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tous les types</option>
            <option value="CONTRACT_EXPIRATION">Expiration contrat</option>
            <option value="CONTRACT_RENEWAL">Renouvellement</option>
            <option value="DOCUMENT_REVIEW">Revision document</option>
            <option value="DEADLINE">Echeance</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => setFilters({ status: "", priority: "", type: "" })}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Reinitialiser
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              Aucune alerte trouvee
            </h3>
            <p className="text-gray-500 mt-1">
              Les alertes seront generees automatiquement
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-slate-800 rounded-xl border p-4 ${
                alert.priority === "CRITICAL"
                  ? "border-red-500/50"
                  : alert.priority === "HIGH"
                  ? "border-orange-500/50"
                  : "border-slate-700"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  {getTypeIcon(alert.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium text-white">
                      {alert.title}
                    </h3>
                    {getPriorityBadge(alert.priority)}
                    {getStatusBadge(alert.status)}
                  </div>

                  <p className="text-sm text-gray-400 mb-2">
                    {alert.description || getTypeLabel(alert.type)}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.alertNumber}
                    </span>
                    {alert.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Echeance:{" "}
                        {new Date(alert.dueDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {alert.contract && (
                      <Link
                        href={`/legal/contracts/${alert.contract.id}`}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300"
                      >
                        <FileSignature className="w-3 h-3" />
                        {alert.contract.contractNumber}
                      </Link>
                    )}
                    {alert.document && (
                      <Link
                        href={`/legal/texts/${alert.document.id}`}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        <BookOpen className="w-3 h-3" />
                        {alert.document.documentNumber}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {alert.status !== "RESOLVED" && alert.status !== "DISMISSED" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                      title="Marquer comme resolu"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="p-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors"
                      title="Ignorer"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {alerts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Page {pagination.page} sur {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(prev.totalPages, prev.page + 1),
                }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
