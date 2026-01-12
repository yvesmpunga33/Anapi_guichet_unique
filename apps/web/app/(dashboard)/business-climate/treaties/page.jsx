"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Users,
  X,
} from "lucide-react";

// Services
import { TreatyList } from "@/app/services/admin/BusinessClimate.service";

const treatyTypeConfig = {
  BIT: { label: "Traite bilateral d'investissement", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  FTA: { label: "Accord de libre-echange", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40" },
  DTA: { label: "Convention fiscale", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  INVESTMENT_PROTECTION: { label: "Protection des investissements", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  ECONOMIC_PARTNERSHIP: { label: "Partenariat economique", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  TRADE_AGREEMENT: { label: "Accord commercial", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40" },
  MULTILATERAL: { label: "Accord multilateral", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  REGIONAL: { label: "Accord regional", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/40" },
  SECTOR_SPECIFIC: { label: "Accord sectoriel", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
  OTHER: { label: "Autre", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-600" },
};

const statusConfig = {
  NEGOTIATING: { label: "En negociation", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600", icon: Clock },
  SIGNED: { label: "Signe", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: FileText },
  RATIFICATION_PENDING: { label: "Ratification en cours", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Clock },
  RATIFIED: { label: "Ratifie", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", icon: CheckCircle2 },
  IN_FORCE: { label: "En vigueur", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  SUSPENDED: { label: "Suspendu", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", icon: AlertCircle },
  TERMINATED: { label: "Termine", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: X },
  EXPIRED: { label: "Expire", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700", icon: AlertCircle },
  RENEGOTIATING: { label: "En renegociation", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/30", icon: Clock },
};

export default function TreatiesPage() {
  const [treaties, setTreaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    treatyType: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Traites Internationaux | ANAPI";
  }, []);

  useEffect(() => {
    fetchTreaties();
  }, [pagination.page, filters]);

  const fetchTreaties = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.status) params.status = filters.status;
      if (filters.treatyType) params.treatyType = filters.treatyType;
      if (search) params.search = search;

      const response = await TreatyList(params);
      const data = response.data;
      setTreaties(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      console.error("Error fetching treaties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTreaties();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCountriesDisplay = (countries) => {
    if (!countries || countries.length === 0) return "-";
    if (countries.length <= 3) return countries.join(", ");
    return `${countries.slice(0, 3).join(", ")} +${countries.length - 3}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Globe className="w-7 h-7 text-blue-600" />
            Traites Internationaux
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Accords bilateraux et multilateraux de la RDC
          </p>
        </div>
        <Link
          href="/business-climate/treaties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau traite
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un traite..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tous les statuts</option>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de traite
              </label>
              <select
                value={filters.treatyType}
                onChange={(e) => setFilters({ ...filters, treatyType: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tous les types</option>
                {Object.entries(treatyTypeConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {treaties.filter(t => t.status === 'IN_FORCE').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">En vigueur</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {treaties.filter(t => t.status === 'SIGNED').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Signes</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {treaties.filter(t => t.status === 'NEGOTIATING').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">En negociation</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.total}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total traites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Treaties List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : treaties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun traite trouve
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Commencez par ajouter un nouveau traite international
          </p>
          <Link
            href="/business-climate/treaties/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter un traite
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {treaties.map((treaty) => {
            const typeConfig = treatyTypeConfig[treaty.treatyType] || treatyTypeConfig.OTHER;
            const statConfig = statusConfig[treaty.status] || statusConfig.NEGOTIATING;
            const StatusIcon = statConfig.icon;

            return (
              <Link
                key={treaty.id}
                href={`/business-climate/treaties/${treaty.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {treaty.reference}
                      </span>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${statConfig.bg} ${statConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statConfig.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {treaty.title}
                    </h3>
                    {treaty.shortTitle && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                        {treaty.shortTitle}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {treaty.partnerCountries && treaty.partnerCountries.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{getCountriesDisplay(treaty.partnerCountries)}</span>
                        </div>
                      )}
                      {treaty.regionalOrganization && (
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{treaty.regionalOrganization}</span>
                        </div>
                      )}
                      {treaty.signedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Signe: {formatDate(treaty.signedDate)}</span>
                        </div>
                      )}
                      {treaty.entryIntoForceDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>En vigueur: {formatDate(treaty.entryIntoForceDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {treaty.responsible && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{treaty.responsible.name}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} sur {pagination.totalPages} ({pagination.total} traites)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
