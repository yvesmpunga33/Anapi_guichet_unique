"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";

export default function InvestorProjectsPage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Statistiques des projets
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    approved: 0,
    totalInvestment: 0,
    totalEmployees: 0,
  });

  // Liste des projets
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setPageTitle("Mes Projets");
  }, [setPageTitle]);

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setStats({
        total: 5,
        active: 3,
        pending: 2,
        approved: 2,
        totalInvestment: 8500000,
        totalEmployees: 156,
      });

      setProjects([
        {
          id: "proj-001",
          name: "Usine de transformation agricole",
          description: "Transformation et conditionnement de produits agricoles locaux pour l'exportation",
          sector: "Agriculture",
          status: "approved",
          investment: 2500000,
          progress: 75,
          location: "Kasai",
          province: "Kasai Central",
          startDate: "2025-06-15",
          expectedEndDate: "2026-12-31",
          employees: 85,
          createdAt: "2025-05-01",
          lastUpdate: "2025-12-28",
          approvalDate: "2025-06-10",
          approvalType: "Regime General",
        },
        {
          id: "proj-002",
          name: "Centrale solaire Katanga",
          description: "Installation d'une centrale photovoltaique de 50MW pour alimenter les zones industrielles",
          sector: "Energie",
          status: "pending",
          investment: 4000000,
          progress: 30,
          location: "Lubumbashi",
          province: "Haut-Katanga",
          startDate: "2025-09-01",
          expectedEndDate: "2027-06-30",
          employees: 45,
          createdAt: "2025-08-15",
          lastUpdate: "2025-12-20",
          currentStep: "Evaluation technique",
        },
        {
          id: "proj-003",
          name: "Hotel ecotouristique Virunga",
          description: "Construction d'un hotel de luxe eco-responsable aux abords du parc national des Virunga",
          sector: "Tourisme",
          status: "in_review",
          investment: 2000000,
          progress: 15,
          location: "Goma",
          province: "Nord-Kivu",
          startDate: "2026-01-15",
          expectedEndDate: "2027-12-31",
          employees: 26,
          createdAt: "2025-12-01",
          lastUpdate: "2025-12-30",
          currentStep: "Verification documents",
        },
        {
          id: "proj-004",
          name: "Exploitation miniere artisanale modernisee",
          description: "Modernisation des techniques d'extraction et de traitement dans le respect des normes environnementales",
          sector: "Mines",
          status: "approved",
          investment: 1500000,
          progress: 60,
          location: "Kolwezi",
          province: "Lualaba",
          startDate: "2025-04-01",
          expectedEndDate: "2026-09-30",
          employees: 120,
          createdAt: "2025-02-15",
          lastUpdate: "2025-12-15",
          approvalDate: "2025-03-25",
          approvalType: "Regime Preferentiel",
        },
        {
          id: "proj-005",
          name: "Unite de production textile",
          description: "Fabrication de textiles a partir de coton local pour le marche regional",
          sector: "Industrie",
          status: "draft",
          investment: 800000,
          progress: 5,
          location: "Kinshasa",
          province: "Kinshasa",
          startDate: null,
          expectedEndDate: null,
          employees: 0,
          createdAt: "2025-12-28",
          lastUpdate: "2025-12-28",
        },
      ]);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Approuve",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        label: "En attente",
        icon: Clock,
      },
      in_review: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "En revision",
        icon: Eye,
      },
      draft: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-600 dark:text-gray-400",
        label: "Brouillon",
        icon: FileText,
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Rejete",
        icon: AlertCircle,
      },
    };
    return configs[status] || configs.draft;
  };

  const getSectorIcon = (sector) => {
    const icons = {
      Agriculture: "🌾",
      Energie: "⚡",
      Tourisme: "🏨",
      Mines: "⛏️",
      Industrie: "🏭",
    };
    return icons[sector] || "📦";
  };

  // Filtrage des projets
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesSector = sectorFilter === "all" || project.sector === sectorFilter;

    return matchesSearch && matchesStatus && matchesSector;
  });

  const sectors = [...new Set(projects.map((p) => p.sector))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de vos projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Projets d'Investissement</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerez et suivez l'avancement de vos projets</p>
        </div>
        <Link
          href="/investor/projects/new"
          className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau projet
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0A1628] dark:text-[#D4A853]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Approuves</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Actifs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">En attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalInvestment)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Investissement</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Emplois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="approved">Approuves</option>
              <option value="pending">En attente</option>
              <option value="in_review">En revision</option>
              <option value="draft">Brouillons</option>
              <option value="rejected">Rejetes</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
            >
              <option value="all">Tous les secteurs</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucun projet trouve</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== "all" || sectorFilter !== "all"
                ? "Aucun projet ne correspond a vos criteres de recherche."
                : "Vous n'avez pas encore de projet. Commencez par en creer un!"}
            </p>
            <Link
              href="/investor/projects/new"
              className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Creer un projet
            </Link>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const statusConfig = getStatusConfig(project.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#D4A853]/50 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                          {getSectorIcon(project.sector)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {project.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              <StatusIcon className="w-3.5 h-3.5 mr-1" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {project.sector}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {project.location}, {project.province}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatCurrency(project.investment)}
                            </span>
                            {project.employees > 0 && (
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {project.employees} emplois
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {project.status !== "draft" && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Progression</span>
                            <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#D4A853] rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
                        {project.startDate && (
                          <span className="text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Debut: {new Date(project.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                        {project.approvalType && (
                          <span className="px-2 py-0.5 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 text-[#0A1628] dark:text-[#D4A853] text-xs font-medium rounded">
                            {project.approvalType}
                          </span>
                        )}
                        {project.currentStep && (
                          <span className="text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {project.currentStep}
                          </span>
                        )}
                        <span className="text-gray-400 dark:text-gray-500 ml-auto">
                          Mis a jour: {new Date(project.lastUpdate).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link
                        href={`/investor/projects/${project.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-[#0A1628] text-white rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir details
                      </Link>
                      {(project.status === "draft" || project.status === "rejected") && (
                        <Link
                          href={`/investor/projects/${project.id}/edit`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      )}
                      {project.status === "approved" && (
                        <Link
                          href={`/investor/approvals?project=${project.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-[#D4A853] text-[#D4A853] rounded-lg font-medium hover:bg-[#D4A853]/10 transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Agrement
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination info */}
      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <p>Affichage de {filteredProjects.length} projet(s) sur {projects.length}</p>
        </div>
      )}
    </div>
  );
}
