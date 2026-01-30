"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  User,
  Calendar,
  Loader2,
  RefreshCw,
  Eye,
  Edit2,
  MoreVertical,
  X,
  Download,
} from "lucide-react";

// Services
import { BarrierList } from "@/app/services/admin/BusinessClimate.service";

const categoryOptions = [
  { value: "", label: "Toutes catégories" },
  { value: "ADMINISTRATIVE", label: "Administratif" },
  { value: "FISCAL", label: "Fiscal" },
  { value: "REGULATORY", label: "Réglementaire" },
  { value: "LAND", label: "Foncier" },
  { value: "CUSTOMS", label: "Douanier" },
  { value: "LABOR", label: "Travail" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "FINANCIAL", label: "Financier" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "", label: "Tous statuts" },
  { value: "REPORTED", label: "Signalé" },
  { value: "ACKNOWLEDGED", label: "Accusé réception" },
  { value: "UNDER_ANALYSIS", label: "En analyse" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "ESCALATED", label: "Escaladé" },
  { value: "RESOLVED", label: "Résolu" },
  { value: "CLOSED", label: "Fermé" },
];

const priorityOptions = [
  { value: "", label: "Toutes priorités" },
  { value: "CRITICAL", label: "Critique" },
  { value: "HIGH", label: "Élevé" },
  { value: "MEDIUM", label: "Moyen" },
  { value: "LOW", label: "Faible" },
];

const priorityConfig = {
  CRITICAL: { label: "Critique", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", dot: "bg-red-500" },
  HIGH: { label: "Élevé", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40", dot: "bg-orange-500" },
  MEDIUM: { label: "Moyen", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40", dot: "bg-yellow-500" },
  LOW: { label: "Faible", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", dot: "bg-blue-500" },
};

const statusConfig = {
  REPORTED: { label: "Signalé", color: "text-gray-700 dark:text-gray-200", bg: "bg-gray-100 dark:bg-gray-600" },
  ACKNOWLEDGED: { label: "Accusé réception", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  UNDER_ANALYSIS: { label: "En analyse", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  IN_PROGRESS: { label: "En cours", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40" },
  ESCALATED: { label: "Escaladé", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  RESOLVED: { label: "Résolu", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40" },
  CLOSED: { label: "Fermé", color: "text-gray-700 dark:text-gray-200", bg: "bg-gray-100 dark:bg-gray-600" },
};

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

export default function BarriersPage() {
  const [barriers, setBarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Obstacles & Barrières | ANAPI";
  }, []);

  useEffect(() => {
    fetchBarriers();
  }, [pagination.page, filters]);

  const fetchBarriers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
      };

      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;

      const response = await BarrierList(params);
      // API returns { success: true, data: { barriers: [...], pagination: {...} } }
      const data = response.data?.data || response.data;
      setBarriers(data.barriers || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Error fetching barriers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBarriers();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysAgo = (date) => {
    if (!date) return "";
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days}j`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Obstacles & Barrières
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Suivi et résolution des obstacles rencontrés par les investisseurs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBarriers}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/business-climate/barriers/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Signaler un obstacle
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par référence, titre, description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters || Object.values(filters).some(v => v)
                ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-600"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {Object.values(filters).filter(v => v).length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priorité
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        </div>
      ) : barriers.length > 0 ? (
        <>
          {/* Barriers List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {barriers.map((barrier) => {
                const priorityConf = priorityConfig[barrier.severity] || priorityConfig.MEDIUM;
                const statusConf = statusConfig[barrier.status] || statusConfig.REPORTED;

                return (
                  <Link
                    key={barrier.id}
                    href={`/business-climate/barriers/${barrier.id}`}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    {/* Priority Indicator */}
                    <div className={`w-1 h-16 rounded-full ${priorityConf.dot} flex-shrink-0`}></div>

                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${priorityConf.bg} flex-shrink-0`}>
                      <AlertTriangle className={`w-5 h-5 ${priorityConf.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-sm font-mono font-medium text-gray-600 dark:text-gray-300">{barrier.reference}</span>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${priorityConf.bg} ${priorityConf.color}`}>
                              {priorityConf.label}
                            </span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                            {barrier.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                            {barrier.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusConf.bg} ${statusConf.color} flex-shrink-0`}>
                          {statusConf.label}
                        </span>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {categoryLabels[barrier.category] || barrier.category}
                        </span>
                        {barrier.investor && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {barrier.investor.name}
                          </span>
                        )}
                        {barrier.province && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {barrier.province}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {getDaysAgo(barrier.createdAt)}
                        </span>
                        {barrier.assignedTo && (
                          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <User className="w-4 h-4" />
                            Assigné à: {barrier.assignedTo.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} obstacles)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun obstacle trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || Object.values(filters).some(v => v)
              ? "Aucun obstacle ne correspond à vos critères de recherche."
              : "Aucun obstacle n'a été signalé pour le moment."}
          </p>
          <Link
            href="/business-climate/barriers/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Signaler un obstacle
          </Link>
        </div>
      )}
    </div>
  );
}
