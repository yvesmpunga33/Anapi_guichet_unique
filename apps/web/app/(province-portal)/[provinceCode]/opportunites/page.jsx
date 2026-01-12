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
  Calendar,
  DollarSign,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  Factory,
  Wheat,
  TreePine,
  Pickaxe,
  Zap,
  Hotel,
  ShoppingBag,
  Truck,
  Landmark,
  Star,
  Filter,
  Grid3X3,
  List,
  ArrowUpRight,
  Globe,
  Target,
} from "lucide-react";
import { ProvinceOpportunityList, ProvinceOpportunityDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const sectorConfig = {
  AGRICULTURE: { label: "Agriculture", icon: Wheat, color: "#22C55E" },
  MINES: { label: "Mines", icon: Pickaxe, color: "#F59E0B" },
  INDUSTRIE: { label: "Industrie", icon: Factory, color: "#6366F1" },
  TOURISME: { label: "Tourisme", icon: Hotel, color: "#EC4899" },
  ENERGIE: { label: "Energie", icon: Zap, color: "#14B8A6" },
  FORESTERIE: { label: "Foresterie", icon: TreePine, color: "#10B981" },
  COMMERCE: { label: "Commerce", icon: ShoppingBag, color: "#8B5CF6" },
  TRANSPORT: { label: "Transport/Logistique", icon: Truck, color: "#3B82F6" },
  IMMOBILIER: { label: "Immobilier", icon: Building2, color: "#F97316" },
  SERVICES: { label: "Services", icon: Briefcase, color: "#64748B" },
};

const statusConfig = {
  OPEN: { label: "Ouvert", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  NEGOTIATION: { label: "En negociation", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  RESERVED: { label: "Reserve", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  CLOSED: { label: "Cloture", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
};

const investmentTypes = {
  GREENFIELD: { label: "Greenfield", description: "Nouveau projet" },
  BROWNFIELD: { label: "Brownfield", description: "Site existant" },
  JOINT_VENTURE: { label: "Joint-venture", description: "Partenariat" },
  PPP: { label: "PPP", description: "Partenariat public-prive" },
  ACQUISITION: { label: "Acquisition", description: "Rachat" },
};

export default function OpportunitesPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, open: 0, totalInvestment: 0, averageROI: 0 });
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchOpportunities = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = { page: pagination.page, limit: pagination.limit };
      if (search) queryParams.search = search;
      if (sectorFilter !== "all") queryParams.sector = sectorFilter;
      if (statusFilter !== "all") queryParams.status = statusFilter;

      const response = await ProvinceOpportunityList(provinceCode, queryParams);
      if (response.data) {
        setOpportunities(response.data.opportunities || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement opportunites:", err);
      // Demo data
      setOpportunities([
        {
          id: 1,
          title: "Complexe agro-industriel de transformation",
          description: "Projet de construction d'une unite moderne de transformation de produits agricoles avec capacite de 50,000 tonnes/an",
          sector: "AGRICULTURE",
          investmentType: "GREENFIELD",
          status: "OPEN",
          minInvestment: 15000000,
          maxInvestment: 25000000,
          currency: "USD",
          expectedROI: 18,
          paybackPeriod: 5,
          location: "Zone economique speciale",
          landArea: 50,
          landUnit: "hectares",
          employmentPotential: 500,
          incentives: ["Exoneration fiscale 5 ans", "Terrain gratuit", "Facilites douanieres"],
          image: null,
          isFeatured: true,
          deadline: "2026-06-30",
          contactEmail: "invest@province.cd",
          tags: ["agro-industrie", "transformation", "export"],
        },
        {
          id: 2,
          title: "Centrale solaire de 50 MW",
          description: "Construction d'une centrale photovoltaique pour alimenter la zone industrielle et les communautes environnantes",
          sector: "ENERGIE",
          investmentType: "PPP",
          status: "OPEN",
          minInvestment: 45000000,
          maxInvestment: 60000000,
          currency: "USD",
          expectedROI: 15,
          paybackPeriod: 8,
          location: "Plateau sud",
          landArea: 100,
          landUnit: "hectares",
          employmentPotential: 150,
          incentives: ["Contrat d'achat garantie 20 ans", "Exemption TVA", "Rapatriement benefices"],
          image: null,
          isFeatured: true,
          deadline: "2026-12-31",
          contactEmail: "energy@province.cd",
          tags: ["energie", "solaire", "renouvelable"],
        },
        {
          id: 3,
          title: "Resort touristique lac",
          description: "Developpement d'un complexe hotelier 4 etoiles avec 200 chambres, spa et activites nautiques",
          sector: "TOURISME",
          investmentType: "JOINT_VENTURE",
          status: "NEGOTIATION",
          minInvestment: 30000000,
          maxInvestment: 40000000,
          currency: "USD",
          expectedROI: 22,
          paybackPeriod: 6,
          location: "Bord du lac",
          landArea: 25,
          landUnit: "hectares",
          employmentPotential: 350,
          incentives: ["TVA reduite", "Formation personnel gratuite", "Promotion internationale"],
          image: null,
          isFeatured: false,
          deadline: null,
          contactEmail: "tourism@province.cd",
          tags: ["hotel", "tourisme", "luxe"],
        },
        {
          id: 4,
          title: "Mine de coltan - Concession Nord",
          description: "Concession miniere pour l'exploitation de coltan sur une superficie de 500 hectares",
          sector: "MINES",
          investmentType: "ACQUISITION",
          status: "OPEN",
          minInvestment: 80000000,
          maxInvestment: 120000000,
          currency: "USD",
          expectedROI: 35,
          paybackPeriod: 4,
          location: "Zone Nord",
          landArea: 500,
          landUnit: "hectares",
          employmentPotential: 800,
          incentives: ["Permis simplifie", "Infrastructures existantes", "Main d'oeuvre qualifiee"],
          image: null,
          isFeatured: true,
          deadline: "2026-03-31",
          contactEmail: "mines@province.cd",
          tags: ["mines", "coltan", "minerais"],
        },
      ]);
      setStats({ total: 45, open: 32, totalInvestment: 2500000000, averageROI: 22 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [provinceCode, pagination.page, sectorFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchOpportunities();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceOpportunityDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchOpportunities(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return "-";
    return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Briefcase className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Opportunites d'Investissement
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Projets et opportunites de la province</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchOpportunities(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/opportunites/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Nouvelle opportunite
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Opportunites", value: stats.total, icon: Briefcase, color: "#6366F1" },
          { label: "Ouvertes", value: stats.open, icon: Target, color: "#10B981" },
          { label: "Volume total", value: formatCurrency(stats.totalInvestment), icon: DollarSign, color: "#8B5CF6" },
          { label: "ROI moyen", value: `${stats.averageROI}%`, icon: TrendingUp, color: "#F59E0B" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sector Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSectorFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            sectorFilter === "all"
              ? "text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          }`}
          style={sectorFilter === "all" ? { backgroundColor: accentColor } : {}}
        >
          Tous secteurs
        </button>
        {Object.entries(sectorConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setSectorFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                sectorFilter === key
                  ? "text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
              style={sectorFilter === key ? { backgroundColor: config.color } : {}}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une opportunite..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statusConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`px-3 py-2 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`px-3 py-2 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucune opportunite</h3>
          <p className="text-gray-500 mt-1">Ajoutez des opportunites d'investissement</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const sector = sectorConfig[opp.sector] || sectorConfig.SERVICES;
            const status = statusConfig[opp.status] || statusConfig.OPEN;
            const SectorIcon = sector.icon;

            return (
              <div key={opp.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Header Image */}
                <div className="h-40 relative" style={{ backgroundColor: `${sector.color}15` }}>
                  {opp.image ? (
                    <Image src={opp.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SectorIcon className="w-20 h-20 opacity-20" style={{ color: sector.color }} />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {opp.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: sector.color }}>
                      {sector.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{opp.description}</p>

                  {/* Investment Range */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Investissement requis</p>
                    <p className="text-lg font-bold" style={{ color: accentColor }}>
                      {formatCurrency(opp.minInvestment, opp.currency)} - {formatCurrency(opp.maxInvestment, opp.currency)}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{opp.expectedROI}%</p>
                      <p className="text-xs text-gray-500">ROI</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{opp.paybackPeriod}</p>
                      <p className="text-xs text-gray-500">ans</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{formatNumber(opp.employmentPotential)}</p>
                      <p className="text-xs text-gray-500">emplois</p>
                    </div>
                  </div>

                  {/* Location & Deadline */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {opp.location}
                    </span>
                    {opp.deadline && (
                      <span className="flex items-center gap-1 text-orange-500">
                        <Clock className="w-4 h-4" />
                        {new Date(opp.deadline).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex gap-1">
                      {opp.incentives?.slice(0, 2).map((inc, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs">
                          {inc.substring(0, 15)}...
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/${provinceCode}/opportunites/${opp.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/${provinceCode}/opportunites/${opp.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setShowDeleteModal(opp)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {opportunities.map((opp) => {
            const sector = sectorConfig[opp.sector] || sectorConfig.SERVICES;
            const status = statusConfig[opp.status] || statusConfig.OPEN;
            const SectorIcon = sector.icon;

            return (
              <div key={opp.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sector.color}20` }}>
                  <SectorIcon className="w-8 h-8" style={{ color: sector.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {opp.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{opp.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{opp.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {opp.location}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Users className="w-3 h-3" />
                      {formatNumber(opp.employmentPotential)} emplois
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold" style={{ color: accentColor }}>
                    {formatCurrency(opp.minInvestment, opp.currency)} - {formatCurrency(opp.maxInvestment, opp.currency)}
                  </p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-sm text-green-600 font-medium">{opp.expectedROI}% ROI</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/${provinceCode}/opportunites/${opp.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/${provinceCode}/opportunites/${opp.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setShowDeleteModal(opp)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'opportunite</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.title}</strong>" ?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50">
                Annuler
              </button>
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
