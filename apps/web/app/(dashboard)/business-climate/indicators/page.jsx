"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Plus,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  Loader2,
  RefreshCw,
  Activity,
  Globe,
  Clock,
  Award,
} from "lucide-react";
import Swal from "sweetalert2";

// Services
import { IndicatorList } from "@/app/services/admin/BusinessClimate.service";

const categoryOptions = [
  { value: "", label: "Toutes catégories" },
  { value: "DOING_BUSINESS", label: "Doing Business" },
  { value: "INVESTMENT_CLIMATE", label: "Climat d'investissement" },
  { value: "GOVERNANCE", label: "Gouvernance" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "HUMAN_CAPITAL", label: "Capital humain" },
  { value: "COMPETITIVENESS", label: "Compétitivité" },
  { value: "TRADE", label: "Commerce" },
  { value: "CORRUPTION", label: "Corruption" },
  { value: "EASE_OF_BUSINESS", label: "Facilité des affaires" },
  { value: "CUSTOM", label: "Personnalisé" },
];

const measureTypeOptions = [
  { value: "", label: "Tous types" },
  { value: "SCORE", label: "Score" },
  { value: "RANK", label: "Classement" },
  { value: "PERCENTAGE", label: "Pourcentage" },
  { value: "DAYS", label: "Jours" },
  { value: "COUNT", label: "Comptage" },
  { value: "CURRENCY", label: "Montant" },
  { value: "INDEX", label: "Indice" },
  { value: "RATIO", label: "Ratio" },
];

const categoryConfig = {
  DOING_BUSINESS: { label: "Doing Business", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", icon: Globe },
  INVESTMENT_CLIMATE: { label: "Climat d'investissement", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40", icon: TrendingUp },
  GOVERNANCE: { label: "Gouvernance", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40", icon: Award },
  INFRASTRUCTURE: { label: "Infrastructure", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40", icon: Activity },
  HUMAN_CAPITAL: { label: "Capital humain", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40", icon: Activity },
  COMPETITIVENESS: { label: "Compétitivité", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40", icon: Target },
  TRADE: { label: "Commerce", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40", icon: Globe },
  CORRUPTION: { label: "Corruption", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: Activity },
  EASE_OF_BUSINESS: { label: "Facilité des affaires", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: TrendingUp },
  CUSTOM: { label: "Personnalisé", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-600", icon: BarChart3 },
};

const measureTypeLabels = {
  SCORE: "Score",
  RANK: "Classement",
  PERCENTAGE: "%",
  DAYS: "jours",
  COUNT: "unités",
  CURRENCY: "USD",
  INDEX: "Indice",
  RATIO: "Ratio",
};

const frequencyLabels = {
  DAILY: "Quotidien",
  WEEKLY: "Hebdomadaire",
  MONTHLY: "Mensuel",
  QUARTERLY: "Trimestriel",
  ANNUALLY: "Annuel",
};

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    measureType: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Indicateurs du Climat des Affaires | ANAPI";
  }, []);

  useEffect(() => {
    fetchIndicators();
  }, [pagination.page, filters]);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
        withLatestValue: "true",
      };

      if (search) params.search = search;
      if (filters.category) params.category = filters.category;
      if (filters.measureType) params.measureType = filters.measureType;

      const response = await IndicatorList(params);
      const data = response.data;
      setIndicators(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      console.error("Error fetching indicators:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les indicateurs",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchIndicators();
  };

  const formatValue = (value, measureType, unit) => {
    if (value === null || value === undefined) return "-";
    const numValue = parseFloat(value);

    switch (measureType) {
      case "SCORE":
        return `${numValue.toFixed(1)} / 100`;
      case "RANK":
        return `#${numValue}`;
      case "PERCENTAGE":
        return `${numValue.toFixed(1)}%`;
      case "DAYS":
        return `${numValue} jours`;
      case "CURRENCY":
        return `${numValue.toLocaleString("fr-FR")} ${unit || "USD"}`;
      case "INDEX":
        return numValue.toFixed(2);
      default:
        return numValue.toLocaleString("fr-FR");
    }
  };

  const getLatestValue = (indicator) => {
    if (!indicator.values || indicator.values.length === 0) return null;
    return indicator.values[0];
  };

  const getTrendIcon = (indicator) => {
    const latestValue = getLatestValue(indicator);
    if (!latestValue || latestValue.changePercentage === null) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }

    const change = parseFloat(latestValue.changePercentage);
    const betterIsHigher = indicator.betterDirection === "HIGHER";

    if (change > 0) {
      return betterIsHigher
        ? <TrendingUp className="w-4 h-4 text-green-500" />
        : <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (change < 0) {
      return betterIsHigher
        ? <TrendingDown className="w-4 h-4 text-red-500" />
        : <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (indicator) => {
    const latestValue = getLatestValue(indicator);
    if (!latestValue || latestValue.changePercentage === null) {
      return "text-gray-400";
    }

    const change = parseFloat(latestValue.changePercentage);
    const betterIsHigher = indicator.betterDirection === "HIGHER";

    if (change > 0) {
      return betterIsHigher ? "text-green-500" : "text-red-500";
    } else if (change < 0) {
      return betterIsHigher ? "text-red-500" : "text-green-500";
    }
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-purple-600" />
            Indicateurs du Climat des Affaires
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Suivi des indicateurs économiques et de compétitivité
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchIndicators}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/business-climate/indicators/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvel indicateur
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
              placeholder="Rechercher par code, nom, description..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
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
                Type de mesure
              </label>
              <select
                value={filters.measureType}
                onChange={(e) => setFilters({ ...filters, measureType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {measureTypeOptions.map((opt) => (
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
      ) : indicators.length > 0 ? (
        <>
          {/* Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {indicators.map((indicator) => {
              const catConfig = categoryConfig[indicator.category] || categoryConfig.CUSTOM;
              const IconComponent = catConfig.icon;
              const latestValue = getLatestValue(indicator);

              return (
                <Link
                  key={indicator.id}
                  href={`/business-climate/indicators/${indicator.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${catConfig.bg}`}>
                      <IconComponent className={`w-5 h-5 ${catConfig.color}`} />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${catConfig.bg} ${catConfig.color}`}>
                      {catConfig.label}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">
                      {indicator.code}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {indicator.name}
                    </h3>
                  </div>

                  {/* Value */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Dernière valeur
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestValue
                          ? formatValue(latestValue.value, indicator.measureType, indicator.unit)
                          : "-"
                        }
                      </p>
                    </div>
                    {latestValue && latestValue.changePercentage !== null && (
                      <div className={`flex items-center gap-1 ${getTrendColor(indicator)}`}>
                        {getTrendIcon(indicator)}
                        <span className="text-sm font-medium">
                          {parseFloat(latestValue.changePercentage) > 0 ? "+" : ""}
                          {parseFloat(latestValue.changePercentage).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {frequencyLabels[indicator.updateFrequency] || indicator.updateFrequency}
                    </span>
                    {indicator.dataSource && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        {indicator.dataSource}
                      </span>
                    )}
                    {latestValue?.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {latestValue.year}
                        {latestValue.quarter && `Q${latestValue.quarter}`}
                      </span>
                    )}
                  </div>

                  {/* Target Progress */}
                  {indicator.targetValue && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          Objectif {indicator.targetYear}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {formatValue(indicator.targetValue, indicator.measureType, indicator.unit)}
                        </span>
                      </div>
                      {latestValue && (
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (parseFloat(latestValue.value) / parseFloat(indicator.targetValue)) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rank Info */}
                  {latestValue?.rank && (
                    <div className="flex items-center gap-2 mt-4 text-sm">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Rang: <strong>{latestValue.rank}</strong>
                        {latestValue.rankOutOf && ` / ${latestValue.rankOutOf}`}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} indicateurs)
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
          <BarChart3 className="w-16 h-16 text-purple-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun indicateur trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || Object.values(filters).some(v => v)
              ? "Aucun indicateur ne correspond à vos critères de recherche."
              : "Aucun indicateur n'a été créé pour le moment."}
          </p>
          <Link
            href="/business-climate/indicators/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un indicateur
          </Link>
        </div>
      )}
    </div>
  );
}
