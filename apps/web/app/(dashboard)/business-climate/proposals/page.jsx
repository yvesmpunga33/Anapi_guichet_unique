"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Loader2,
  RefreshCw,
  Scale,
  Send,
  ThumbsUp,
  ThumbsDown,
  Archive,
  AlertCircle,
} from "lucide-react";

// Services
import { ProposalList } from "@/app/services/admin/BusinessClimate.service";

const proposalTypeOptions = [
  { value: "", label: "Tous types" },
  { value: "LAW", label: "Projet de loi" },
  { value: "DECREE", label: "Projet de décret" },
  { value: "ORDER", label: "Projet d'arrêté" },
  { value: "CIRCULAR", label: "Circulaire" },
  { value: "REGULATION", label: "Règlement" },
  { value: "AMENDMENT", label: "Amendement" },
  { value: "RECOMMENDATION", label: "Recommandation" },
  { value: "OPINION", label: "Avis motivé" },
  { value: "OTHER", label: "Autre" },
];

const domainOptions = [
  { value: "", label: "Tous domaines" },
  { value: "INVESTMENT_CODE", label: "Code des investissements" },
  { value: "TAX", label: "Fiscalité" },
  { value: "CUSTOMS", label: "Douanes" },
  { value: "LABOR", label: "Droit du travail" },
  { value: "LAND", label: "Foncier" },
  { value: "ENVIRONMENT", label: "Environnement" },
  { value: "TRADE", label: "Commerce" },
  { value: "MINING", label: "Mines" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "FINANCE", label: "Finance" },
  { value: "BUSINESS_CREATION", label: "Création d'entreprise" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "", label: "Tous statuts" },
  { value: "DRAFT", label: "Brouillon" },
  { value: "SUBMITTED", label: "Soumis" },
  { value: "UNDER_REVIEW", label: "En examen" },
  { value: "APPROVED", label: "Approuvé" },
  { value: "FORWARDED", label: "Transmis" },
  { value: "UNDER_DISCUSSION", label: "En discussion" },
  { value: "ADOPTED", label: "Adopté" },
  { value: "REJECTED", label: "Rejeté" },
  { value: "WITHDRAWN", label: "Retiré" },
  { value: "ARCHIVED", label: "Archivé" },
];

const priorityOptions = [
  { value: "", label: "Toutes priorités" },
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "Élevé" },
  { value: "MEDIUM", label: "Moyen" },
  { value: "LOW", label: "Faible" },
];

const priorityConfig = {
  URGENT: { label: "Urgent", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", dot: "bg-red-500" },
  HIGH: { label: "Élevé", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", dot: "bg-orange-500" },
  MEDIUM: { label: "Moyen", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30", dot: "bg-yellow-500" },
  LOW: { label: "Faible", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", dot: "bg-blue-500" },
};

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-700", icon: FileText },
  SUBMITTED: { label: "Soumis", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", icon: Send },
  UNDER_REVIEW: { label: "En examen", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30", icon: Clock },
  APPROVED: { label: "Approuvé", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  FORWARDED: { label: "Transmis", color: "text-cyan-600", bg: "bg-cyan-100 dark:bg-cyan-900/30", icon: Send },
  UNDER_DISCUSSION: { label: "En discussion", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30", icon: Scale },
  ADOPTED: { label: "Adopté", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: ThumbsUp },
  REJECTED: { label: "Rejeté", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", icon: ThumbsDown },
  WITHDRAWN: { label: "Retiré", color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700", icon: AlertCircle },
  ARCHIVED: { label: "Archivé", color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700", icon: Archive },
};

const typeLabels = {
  LAW: "Projet de loi",
  DECREE: "Décret",
  ORDER: "Arrêté",
  CIRCULAR: "Circulaire",
  REGULATION: "Règlement",
  AMENDMENT: "Amendement",
  RECOMMENDATION: "Recommandation",
  OPINION: "Avis motivé",
  OTHER: "Autre",
};

const domainLabels = {
  INVESTMENT_CODE: "Code des investissements",
  TAX: "Fiscalité",
  CUSTOMS: "Douanes",
  LABOR: "Droit du travail",
  LAND: "Foncier",
  ENVIRONMENT: "Environnement",
  TRADE: "Commerce",
  MINING: "Mines",
  AGRICULTURE: "Agriculture",
  FINANCE: "Finance",
  BUSINESS_CREATION: "Création d'entreprise",
  OTHER: "Autre",
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    proposalType: "",
    domain: "",
    priority: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Propositions Légales | ANAPI";
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [pagination.page, filters]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
      };

      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.proposalType) params.proposalType = filters.proposalType;
      if (filters.domain) params.domain = filters.domain;
      if (filters.priority) params.priority = filters.priority;

      const response = await ProposalList(params);
      // API returns { success: true, data: { proposals: [...], pagination: {...} } }
      const data = response.data?.data || response.data;
      setProposals(data.proposals || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProposals();
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

  // Stats
  const stats = {
    total: pagination.total || 0,
    draft: proposals.filter(p => p.status === "DRAFT").length,
    submitted: proposals.filter(p => ["SUBMITTED", "UNDER_REVIEW", "FORWARDED", "UNDER_DISCUSSION"].includes(p.status)).length,
    adopted: proposals.filter(p => p.status === "ADOPTED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-purple-600" />
            Propositions légales
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Propositions de réformes et améliorations du cadre juridique
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProposals}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/business-climate/proposals/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle proposition
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Brouillons</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En cours</p>
          <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Adoptées</p>
          <p className="text-2xl font-bold text-green-600">{stats.adopted}</p>
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
              placeholder="Rechercher par référence, titre, résumé..."
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
            {Object.values(filters).filter(v => v).length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-purple-600 text-white rounded-full">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.proposalType}
                onChange={(e) => setFilters({ ...filters, proposalType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {proposalTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Domaine
              </label>
              <select
                value={filters.domain}
                onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {domainOptions.map((opt) => (
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
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : proposals.length > 0 ? (
        <>
          {/* Proposals List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {proposals.map((proposal) => {
                const priorityConf = priorityConfig[proposal.priority] || priorityConfig.MEDIUM;
                const statusConf = statusConfig[proposal.status] || statusConfig.DRAFT;
                const StatusIcon = statusConf.icon;

                return (
                  <Link
                    key={proposal.id}
                    href={`/business-climate/proposals/${proposal.id}`}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Priority Indicator */}
                    <div className={`w-1.5 h-24 rounded-full ${priorityConf.dot} flex-shrink-0`}></div>

                    {/* Icon */}
                    <div className={`p-2.5 rounded-xl ${statusConf.bg} flex-shrink-0`}>
                      <StatusIcon className={`w-5 h-5 ${statusConf.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-medium text-gray-500">{proposal.reference}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${priorityConf.bg} ${priorityConf.color}`}>
                              {priorityConf.label}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {typeLabels[proposal.proposalType] || proposal.proposalType}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {proposal.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {proposal.summary}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConf.bg} ${statusConf.color} flex-shrink-0`}>
                          {statusConf.label}
                        </span>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5" />
                          {domainLabels[proposal.domain] || proposal.domain}
                        </span>
                        {proposal.targetAuthority && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {proposal.targetAuthority}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {getDaysAgo(proposal.createdAt)}
                        </span>
                        {proposal.targetedBarriers && proposal.targetedBarriers.length > 0 && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <FileText className="w-3.5 h-3.5" />
                            {proposal.targetedBarriers.length} obstacle(s) visé(s)
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} propositions)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
          <Megaphone className="w-16 h-16 text-purple-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune proposition trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || Object.values(filters).some(v => v)
              ? "Aucune proposition ne correspond à vos critères de recherche."
              : "Aucune proposition légale n'a été soumise pour le moment."}
          </p>
          <Link
            href="/business-climate/proposals/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle proposition
          </Link>
        </div>
      )}
    </div>
  );
}
