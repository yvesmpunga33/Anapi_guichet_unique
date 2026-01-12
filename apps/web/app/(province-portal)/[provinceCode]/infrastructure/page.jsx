"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Route,
  Building,
  Plane,
  Ship,
  Train,
  Zap,
  Droplets,
  Radio,
  Landmark,
  MoreHorizontal,
  Map,
  List,
  Grid,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { ProvinceInfrastructureList, ProvinceInfrastructureDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const typeConfig = {
  ROUTE: { label: "Route", icon: Route, color: "#3B82F6" },
  PONT: { label: "Pont", icon: Building, color: "#8B5CF6" },
  AEROPORT: { label: "Aeroport", icon: Plane, color: "#06B6D4" },
  PORT: { label: "Port", icon: Ship, color: "#0EA5E9" },
  GARE: { label: "Gare", icon: Train, color: "#F59E0B" },
  BARRAGE: { label: "Barrage", icon: Droplets, color: "#10B981" },
  CENTRALE_ELECTRIQUE: { label: "Centrale Electrique", icon: Zap, color: "#EF4444" },
  RESEAU_EAU: { label: "Reseau d'Eau", icon: Droplets, color: "#14B8A6" },
  RESEAU_TELECOM: { label: "Telecom", icon: Radio, color: "#A855F7" },
  BATIMENT_PUBLIC: { label: "Batiment Public", icon: Landmark, color: "#EC4899" },
  AUTRE: { label: "Autre", icon: Building, color: "#6B7280" },
};

const categoryConfig = {
  EXISTANT: { label: "Existant", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  EN_CONSTRUCTION: { label: "En Construction", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  PLANIFIE: { label: "Planifie", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  A_REHABILITER: { label: "A Rehabiliter", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

const statusConfig = {
  OPERATIONNEL: { label: "Operationnel", icon: CheckCircle2, color: "text-green-600" },
  EN_TRAVAUX: { label: "En Travaux", icon: Clock, color: "text-blue-600" },
  HORS_SERVICE: { label: "Hors Service", icon: AlertTriangle, color: "text-red-600" },
  PROJET: { label: "Projet", icon: FileText, color: "text-gray-600" },
};

export default function InfrastructurePage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    operational: 0,
    inProgress: 0,
    planned: 0,
    totalCost: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const fetchInfrastructure = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = { page: pagination.page, limit: pagination.limit };
      if (search) queryParams.search = search;
      if (typeFilter !== "all") queryParams.type = typeFilter;
      if (categoryFilter !== "all") queryParams.category = categoryFilter;
      if (statusFilter !== "all") queryParams.status = statusFilter;

      const response = await ProvinceInfrastructureList(provinceCode, queryParams);
      if (response.data) {
        setItems(response.data.infrastructure || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement infrastructure:", err);
      // Mock data
      setItems([
        {
          id: 1,
          name: "Route Nationale 1 - Troncon Nord",
          description: "Rehabilitation de 120km de route asphaltee",
          type: "ROUTE",
          category: "EN_CONSTRUCTION",
          status: "EN_TRAVAUX",
          location: "District Nord",
          latitude: -4.3217,
          longitude: 15.3125,
          cost: 45000000,
          currency: "USD",
          completionDate: "2026-12-31",
          importance: 5,
          image: null,
        },
        {
          id: 2,
          name: "Pont Kasai",
          description: "Pont moderne de 500m reliant les deux rives",
          type: "PONT",
          category: "EXISTANT",
          status: "OPERATIONNEL",
          location: "Centre-ville",
          latitude: -4.3100,
          longitude: 15.3200,
          cost: 25000000,
          currency: "USD",
          completionDate: "2025-06-15",
          importance: 5,
          image: null,
        },
        {
          id: 3,
          name: "Aeroport International",
          description: "Extension de la piste et nouveau terminal",
          type: "AEROPORT",
          category: "PLANIFIE",
          status: "PROJET",
          location: "Zone Aeroportuaire",
          latitude: -4.2800,
          longitude: 15.3500,
          cost: 150000000,
          currency: "USD",
          completionDate: "2028-12-31",
          importance: 5,
          image: null,
        },
        {
          id: 4,
          name: "Barrage Hydroelectrique",
          description: "Production de 500MW pour la province",
          type: "BARRAGE",
          category: "EN_CONSTRUCTION",
          status: "EN_TRAVAUX",
          location: "Riviere Kwango",
          latitude: -4.4000,
          longitude: 15.2000,
          cost: 800000000,
          currency: "USD",
          completionDate: "2029-06-30",
          importance: 5,
          image: null,
        },
        {
          id: 5,
          name: "Port Fluvial",
          description: "Modernisation du port pour le commerce regional",
          type: "PORT",
          category: "A_REHABILITER",
          status: "HORS_SERVICE",
          location: "Berge Sud",
          latitude: -4.3500,
          longitude: 15.2800,
          cost: 35000000,
          currency: "USD",
          completionDate: null,
          importance: 4,
          image: null,
        },
        {
          id: 6,
          name: "Reseau Fibre Optique",
          description: "500km de fibre optique pour connecter la province",
          type: "RESEAU_TELECOM",
          category: "EN_CONSTRUCTION",
          status: "EN_TRAVAUX",
          location: "Province entiere",
          latitude: null,
          longitude: null,
          cost: 28000000,
          currency: "USD",
          completionDate: "2026-09-30",
          importance: 4,
          image: null,
        },
      ]);
      setStats({
        total: 48,
        operational: 25,
        inProgress: 15,
        planned: 8,
        totalCost: 2500000000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInfrastructure();
  }, [provinceCode, pagination.page, typeFilter, categoryFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchInfrastructure();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceInfrastructureDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchInfrastructure(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Route className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Infrastructure
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Routes, ponts, aeroports, barrages et autres infrastructures</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${provinceCode}/infrastructure/carte`} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50">
            <Map className="w-5 h-5" />
            <span className="hidden sm:inline">Carte</span>
          </Link>
          <button onClick={() => fetchInfrastructure(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/infrastructure/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Ajouter
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Building, color: "#6366F1" },
          { label: "Operationnels", value: stats.operational, icon: CheckCircle2, color: "#10B981" },
          { label: "En Travaux", value: stats.inProgress, icon: Clock, color: "#F59E0B" },
          { label: "Planifies", value: stats.planned, icon: FileText, color: "#8B5CF6" },
          { label: "Cout Total", value: formatCurrency(stats.totalCost), icon: DollarSign, color: "#EC4899" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Type Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === "all" ? "text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50"}`}
          style={typeFilter === "all" ? { backgroundColor: accentColor } : {}}
        >
          Tous
        </button>
        {Object.entries(typeConfig).slice(0, 8).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === key ? "text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50"}`}
              style={typeFilter === key ? { backgroundColor: config.color } : {}}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher une infrastructure..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
          </div>
          <div className="flex gap-3">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
              <option value="all">Toutes categories</option>
              {Object.entries(categoryConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
              <option value="all">Tous statuts</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Building className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucune infrastructure</h3>
          <p className="text-gray-500 mt-1">Ajoutez votre premiere infrastructure</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const type = typeConfig[item.type] || typeConfig.AUTRE;
            const category = categoryConfig[item.category] || categoryConfig.EXISTANT;
            const status = statusConfig[item.status] || statusConfig.PROJET;
            const TypeIcon = type.icon;
            const StatusIcon = status.icon;

            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header with type color */}
                <div className="h-2" style={{ backgroundColor: type.color }} />

                <div className="p-5">
                  {/* Type & Category */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${type.color}15` }}>
                        <TypeIcon className="w-5 h-5" style={{ color: type.color }} />
                      </div>
                      <div>
                        <span className="text-xs font-medium" style={{ color: type.color }}>{type.label}</span>
                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}>{category.label}</span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span>{status.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <DollarSign className="w-4 h-4" style={{ color: accentColor }} />
                      {formatCurrency(item.cost, item.currency)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                      {formatDate(item.completionDate)}
                    </div>
                  </div>

                  {/* Importance */}
                  <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-2 h-2 rounded-full ${star <= item.importance ? "" : "bg-gray-200 dark:bg-gray-600"}`}
                        style={star <= item.importance ? { backgroundColor: accentColor } : {}}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">Importance</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-1">
                    <Link href={`/${provinceCode}/infrastructure/${item.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/${provinceCode}/infrastructure/${item.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(item)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Infrastructure</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Categorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cout</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((item) => {
                const type = typeConfig[item.type] || typeConfig.AUTRE;
                const category = categoryConfig[item.category] || categoryConfig.EXISTANT;
                const status = statusConfig[item.status] || statusConfig.PROJET;
                const TypeIcon = type.icon;
                const StatusIcon = status.icon;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${type.color}15` }}>
                          <TypeIcon className="w-5 h-5" style={{ color: type.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={{ color: type.color }}>{type.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${category.color}`}>{category.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-sm ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.cost, item.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/${provinceCode}/infrastructure/${item.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/${provinceCode}/infrastructure/${item.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setShowDeleteModal(item)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">Page {pagination.page} / {pagination.totalPages}</span>
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'infrastructure</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.name}</strong>" ?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
