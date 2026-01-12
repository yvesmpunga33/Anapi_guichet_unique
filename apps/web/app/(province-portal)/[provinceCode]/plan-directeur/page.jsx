"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Map,
  FileText,
  DollarSign,
  Users,
  Building2,
  Layers,
  Flag,
  ArrowUpRight,
  BarChart3,
  PieChart,
} from "lucide-react";
import { ProvinceMasterPlanList, ProvinceMasterPlanDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: FileText },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  IN_PROGRESS: { label: "En execution", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  COMPLETED: { label: "Termine", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  SUSPENDED: { label: "Suspendu", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: AlertCircle },
};

const priorityConfig = {
  HIGH: { label: "Haute", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
  MEDIUM: { label: "Moyenne", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
  LOW: { label: "Basse", color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
};

const sectorConfig = {
  INFRASTRUCTURE: { label: "Infrastructure", icon: Building2, color: "#3B82F6" },
  AGRICULTURE: { label: "Agriculture", icon: Target, color: "#22C55E" },
  EDUCATION: { label: "Education", icon: Users, color: "#8B5CF6" },
  SANTE: { label: "Sante", icon: Target, color: "#EF4444" },
  TOURISME: { label: "Tourisme", icon: Map, color: "#F59E0B" },
  INDUSTRIE: { label: "Industrie", icon: Building2, color: "#6366F1" },
  ENERGIE: { label: "Energie", icon: TrendingUp, color: "#14B8A6" },
  ENVIRONNEMENT: { label: "Environnement", icon: Layers, color: "#10B981" },
};

export default function PlanDirecteurPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, approved: 0, inProgress: 0, totalBudget: 0 });
  const [viewMode, setViewMode] = useState("timeline");

  const fetchPlans = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      if (sectorFilter !== "all") params.sector = sectorFilter;

      const response = await ProvinceMasterPlanList(provinceCode, params);
      if (response.data) {
        setPlans(response.data.plans || response.data.data || []);
        setStats(response.data.stats || stats);
      }
    } catch (err) {
      console.error("Erreur chargement plan directeur:", err);
      // Demo data
      setPlans([
        {
          id: 1,
          title: "Plan de developpement des infrastructures routieres",
          description: "Programme quinquennal de construction et rehabilitation du reseau routier provincial",
          sector: "INFRASTRUCTURE",
          status: "IN_PROGRESS",
          priority: "HIGH",
          startYear: 2024,
          endYear: 2029,
          totalBudget: 150000000,
          currency: "USD",
          allocatedBudget: 45000000,
          spentBudget: 12000000,
          objectives: ["Construire 500km de routes asphaltees", "Rehabiliter 300km de routes existantes", "Construire 15 ponts"],
          kpis: [
            { name: "Routes construites", target: 500, current: 75, unit: "km" },
            { name: "Ponts construits", target: 15, current: 3, unit: "" },
          ],
          progress: 25,
          responsibleEntity: "Ministere Provincial des Travaux Publics",
        },
        {
          id: 2,
          title: "Programme agricole provincial 2024-2028",
          description: "Modernisation du secteur agricole et securite alimentaire",
          sector: "AGRICULTURE",
          status: "APPROVED",
          priority: "HIGH",
          startYear: 2024,
          endYear: 2028,
          totalBudget: 80000000,
          currency: "USD",
          allocatedBudget: 20000000,
          spentBudget: 5000000,
          objectives: ["Augmenter la production agricole de 40%", "Former 10000 agriculteurs", "Creer 50 cooperatives"],
          kpis: [
            { name: "Agriculteurs formes", target: 10000, current: 2500, unit: "" },
            { name: "Cooperatives creees", target: 50, current: 12, unit: "" },
          ],
          progress: 15,
          responsibleEntity: "Ministere Provincial de l'Agriculture",
        },
        {
          id: 3,
          title: "Plan d'electrification rurale",
          description: "Extension du reseau electrique aux zones rurales",
          sector: "ENERGIE",
          status: "DRAFT",
          priority: "MEDIUM",
          startYear: 2025,
          endYear: 2030,
          totalBudget: 120000000,
          currency: "USD",
          allocatedBudget: 0,
          spentBudget: 0,
          objectives: ["Electrifier 200 villages", "Installer 50MW de capacite solaire"],
          kpis: [
            { name: "Villages electrifies", target: 200, current: 0, unit: "" },
            { name: "Capacite solaire", target: 50, current: 0, unit: "MW" },
          ],
          progress: 0,
          responsibleEntity: "Ministere Provincial de l'Energie",
        },
      ]);
      setStats({ total: 8, approved: 5, inProgress: 3, totalBudget: 450000000 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [provinceCode, statusFilter, sectorFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlans();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceMasterPlanDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchPlans(true);
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Map className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Plan Directeur
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Vision strategique et programmes de developpement provincial</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchPlans(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/plan-directeur/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Nouveau programme
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Programmes", value: stats.total, icon: Layers, color: "#6366F1" },
          { label: "Approuves", value: stats.approved, icon: CheckCircle2, color: "#10B981" },
          { label: "En execution", value: stats.inProgress, icon: Clock, color: "#F59E0B" },
          { label: "Budget total", value: formatCurrency(stats.totalBudget), icon: DollarSign, color: "#8B5CF6" },
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un programme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les secteurs</option>
            {Object.entries(sectorConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
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
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-2 ${viewMode === "timeline" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-2 ${viewMode === "cards" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Map className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucun programme</h3>
          <p className="text-gray-500 mt-1">Commencez par creer votre plan directeur</p>
        </div>
      ) : viewMode === "timeline" ? (
        /* Timeline View */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          {/* Timeline header */}
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            <div className="w-64 flex-shrink-0" />
            {Array.from({ length: 7 }, (_, i) => currentYear - 1 + i).map((year) => (
              <div
                key={year}
                className={`flex-1 min-w-[100px] text-center text-sm font-medium ${
                  year === currentYear ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                }`}
              >
                {year}
              </div>
            ))}
          </div>

          {/* Timeline items */}
          <div className="space-y-4">
            {plans.map((plan) => {
              const sector = sectorConfig[plan.sector] || sectorConfig.INFRASTRUCTURE;
              const status = statusConfig[plan.status] || statusConfig.DRAFT;
              const SectorIcon = sector.icon;
              const StatusIcon = status.icon;

              const startOffset = plan.startYear - (currentYear - 1);
              const duration = plan.endYear - plan.startYear + 1;

              return (
                <div key={plan.id} className="flex items-center gap-4">
                  {/* Plan info */}
                  <div className="w-64 flex-shrink-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sector.color}20` }}>
                        <SectorIcon className="w-5 h-5" style={{ color: sector.color }} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{plan.title}</h4>
                        <p className="text-xs text-gray-500">{sector.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline bar */}
                  <div className="flex-1 flex items-center h-12 relative">
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div
                          key={i}
                          className={`flex-1 border-l ${i === 1 ? "border-blue-300 dark:border-blue-600" : "border-gray-200 dark:border-gray-700"}`}
                        />
                      ))}
                    </div>
                    <div
                      className="absolute h-8 rounded-lg flex items-center px-3 gap-2"
                      style={{
                        left: `${(startOffset / 7) * 100}%`,
                        width: `${(duration / 7) * 100}%`,
                        backgroundColor: `${sector.color}20`,
                        borderLeft: `3px solid ${sector.color}`,
                      }}
                    >
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${status.color}`}>
                        {plan.progress}%
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {formatCurrency(plan.totalBudget, plan.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/${provinceCode}/plan-directeur/${plan.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/${provinceCode}/plan-directeur/${plan.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const sector = sectorConfig[plan.sector] || sectorConfig.INFRASTRUCTURE;
            const status = statusConfig[plan.status] || statusConfig.DRAFT;
            const priority = priorityConfig[plan.priority] || priorityConfig.MEDIUM;
            const SectorIcon = sector.icon;
            const StatusIcon = status.icon;

            return (
              <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${sector.color}20` }}>
                        <SectorIcon className="w-6 h-6" style={{ color: sector.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{plan.title}</h3>
                        <p className="text-sm text-gray-500">{sector.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>{priority.label}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">{plan.description}</p>
                </div>

                {/* Progress */}
                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avancement global</span>
                    <span className="text-sm font-medium" style={{ color: accentColor }}>{plan.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${plan.progress}%`, backgroundColor: accentColor }} />
                  </div>
                </div>

                {/* KPIs */}
                {plan.kpis && plan.kpis.length > 0 && (
                  <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Indicateurs cles</h4>
                    <div className="space-y-2">
                      {plan.kpis.slice(0, 2).map((kpi, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{kpi.name}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {kpi.current.toLocaleString()} / {kpi.target.toLocaleString()} {kpi.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {plan.startYear} - {plan.endYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(plan.totalBudget, plan.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/${provinceCode}/plan-directeur/${plan.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/${provinceCode}/plan-directeur/${plan.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setShowDeleteModal(plan)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer le programme</h3>
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
