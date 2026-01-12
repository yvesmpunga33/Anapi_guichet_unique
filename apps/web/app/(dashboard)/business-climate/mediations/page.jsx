"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Handshake,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Calendar,
  Loader2,
  RefreshCw,
  DollarSign,
  Scale,
  FileText,
} from "lucide-react";

// Services
import { MediationList } from "@/app/services/admin/BusinessClimate.service";

const disputeTypeOptions = [
  { value: "", label: "Tous types" },
  { value: "CONTRACT", label: "Contrat" },
  { value: "TAX", label: "Fiscal" },
  { value: "LABOR", label: "Travail" },
  { value: "LAND", label: "Foncier" },
  { value: "PERMIT", label: "Permis" },
  { value: "CUSTOMS", label: "Douane" },
  { value: "ENVIRONMENTAL", label: "Environnement" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "", label: "Tous statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "ACCEPTED", label: "Accepté" },
  { value: "ONGOING", label: "En cours" },
  { value: "HEARING_SCHEDULED", label: "Audience planifiée" },
  { value: "SETTLED", label: "Réglé" },
  { value: "FAILED", label: "Échoué" },
  { value: "WITHDRAWN", label: "Retiré" },
  { value: "REFERRED_TO_COURT", label: "Référé au tribunal" },
];

const urgencyOptions = [
  { value: "", label: "Toutes urgences" },
  { value: "CRITICAL", label: "Critique" },
  { value: "HIGH", label: "Élevée" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "LOW", label: "Faible" },
];

const statusConfig = {
  SUBMITTED: { label: "Soumis", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600" },
  PENDING: { label: "En attente", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600" },
  ACCEPTED: { label: "Accepté", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/50" },
  SCHEDULED: { label: "Programmé", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/50" },
  IN_MEDIATION: { label: "En médiation", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/50" },
  ONGOING: { label: "En cours", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/50" },
  HEARING_SCHEDULED: { label: "Audience planifiée", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/50" },
  AGREEMENT_REACHED: { label: "Accord trouvé", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/50" },
  SETTLED: { label: "Réglé", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/50" },
  CLOSED: { label: "Clôturé", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600" },
  FAILED: { label: "Échoué", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/50" },
  REJECTED: { label: "Rejeté", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/50" },
  WITHDRAWN: { label: "Retiré", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600" },
  REFERRED_TO_COURT: { label: "Référé au tribunal", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/50" },
  REFERRED_COURT: { label: "Référé au tribunal", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/50" },
};

const urgencyConfig = {
  URGENT: { label: "Urgent", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/50", dot: "bg-red-500" },
  CRITICAL: { label: "Critique", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/50", dot: "bg-red-500" },
  HIGH: { label: "Élevée", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/50", dot: "bg-orange-500" },
  MEDIUM: { label: "Moyenne", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/50", dot: "bg-yellow-500" },
  LOW: { label: "Faible", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/50", dot: "bg-blue-500" },
};

const disputeTypeLabels = {
  CONTRACT: "Contrat",
  TAX: "Fiscal",
  LABOR: "Travail",
  LAND: "Foncier",
  PERMIT: "Permis",
  CUSTOMS: "Douane",
  ENVIRONMENTAL: "Environnement",
  COMMERCIAL: "Commercial",
  OTHER: "Autre",
};

export default function MediationsPage() {
  const [mediations, setMediations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    disputeType: "",
    urgencyLevel: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Médiations | ANAPI";
  }, []);

  useEffect(() => {
    fetchMediations();
  }, [pagination.page, filters]);

  const fetchMediations = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
      };

      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.disputeType) params.disputeType = filters.disputeType;
      if (filters.urgencyLevel) params.urgencyLevel = filters.urgencyLevel;

      const response = await MediationList(params);
      const data = response.data;
      setMediations(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching mediations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchMediations();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Handshake className="w-7 h-7 text-purple-600" />
            Médiations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestion des cas de médiation entre investisseurs et administration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMediations}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/business-climate/mediations/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle médiation
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
              placeholder="Rechercher par référence, titre, réclamation..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters || Object.values(filters).some(v => v)
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de litige
              </label>
              <select
                value={filters.disputeType}
                onChange={(e) => setFilters({ ...filters, disputeType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {disputeTypeOptions.map((opt) => (
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
                Urgence
              </label>
              <select
                value={filters.urgencyLevel}
                onChange={(e) => setFilters({ ...filters, urgencyLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {urgencyOptions.map((opt) => (
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
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : mediations.length > 0 ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {mediations.map((mediation) => {
                const statusConf = statusConfig[mediation.status] || statusConfig.SUBMITTED;
                const urgencyConf = urgencyConfig[mediation.priority] || urgencyConfig.MEDIUM;

                return (
                  <Link
                    key={mediation.id}
                    href={`/business-climate/mediations/${mediation.id}`}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`w-1.5 h-20 rounded-full ${urgencyConf.dot} flex-shrink-0`}></div>

                    <div className={`p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex-shrink-0`}>
                      <Scale className="w-5 h-5 text-purple-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{mediation.reference}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${urgencyConf.bg} ${urgencyConf.color}`}>
                              {urgencyConf.label}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {mediation.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {mediation.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConf.bg} ${statusConf.color} flex-shrink-0`}>
                          {statusConf.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {disputeTypeLabels[mediation.disputeType] || mediation.disputeType}
                        </span>
                        {mediation.investor && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {mediation.investor.name}
                          </span>
                        )}
                        {mediation.disputedAmount && (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                            <DollarSign className="w-3.5 h-3.5" />
                            {formatCurrency(mediation.disputedAmount, mediation.currency)}
                          </span>
                        )}
                        {mediation.firstSessionAt && (
                          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <Calendar className="w-3.5 h-3.5" />
                            Session: {formatDate(mediation.firstSessionAt)}
                          </span>
                        )}
                        {mediation.mediator && (
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <User className="w-3.5 h-3.5" />
                            Médiateur: {mediation.mediator.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} médiations)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
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
            Aucune médiation trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Aucun cas de médiation n'a été enregistré pour le moment.
          </p>
          <Link
            href="/business-climate/mediations/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle médiation
          </Link>
        </div>
      )}
    </div>
  );
}
