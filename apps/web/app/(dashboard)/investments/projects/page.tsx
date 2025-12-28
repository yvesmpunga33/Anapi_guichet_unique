"use client";

import { useState } from "react";
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  Building2,
  Factory,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

interface Investment {
  id: string;
  projectCode: string;
  projectName: string;
  description: string;
  investorName: string;
  investorId: string;
  sector: string;
  subSector?: string;
  province: string;
  city: string;
  amount: number;
  currency: string;
  jobsCreated: number;
  jobsIndirect?: number;
  status: string;
  progress: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  DRAFT: { label: "Brouillon", color: "text-gray-600", bgColor: "bg-gray-100", icon: Clock },
  SUBMITTED: { label: "Soumis", color: "text-blue-600", bgColor: "bg-blue-100", icon: Clock },
  UNDER_REVIEW: { label: "En examen", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertCircle },
  APPROVED: { label: "Approuve", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle2 },
  REJECTED: { label: "Rejete", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle },
  IN_PROGRESS: { label: "En cours", color: "text-purple-600", bgColor: "bg-purple-100", icon: TrendingUp },
  COMPLETED: { label: "Termine", color: "text-emerald-600", bgColor: "bg-emerald-100", icon: CheckCircle2 },
  CANCELLED: { label: "Annule", color: "text-gray-600", bgColor: "bg-gray-100", icon: XCircle },
};

const sectorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Mines": Factory,
  "Agriculture": TrendingUp,
  "Technologies": Building2,
  "Tourisme": MapPin,
  "Industrie": Factory,
  "Services": Briefcase,
};

const mockInvestments: Investment[] = [
  {
    id: "1",
    projectCode: "INV-2024-00089",
    projectName: "Extension Mine de Cuivre Kolwezi",
    description: "Projet d'extension de la capacite de production de la mine de cuivre avec nouvelles installations de traitement",
    investorName: "Congo Mining Corporation",
    investorId: "1",
    sector: "Mines",
    subSector: "Cuivre et Cobalt",
    province: "Lualaba",
    city: "Kolwezi",
    amount: 45000000,
    currency: "USD",
    jobsCreated: 1200,
    jobsIndirect: 3500,
    status: "IN_PROGRESS",
    progress: 65,
    startDate: "2023-06-01",
    endDate: "2025-12-31",
    createdAt: "2023-05-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    projectCode: "INV-2024-00088",
    projectName: "Plantation de Palmiers a Huile",
    description: "Creation d'une plantation industrielle de palmiers a huile avec usine de transformation",
    investorName: "AgroTech RDC SARL",
    investorId: "2",
    sector: "Agriculture",
    subSector: "Agro-industrie",
    province: "Equateur",
    city: "Mbandaka",
    amount: 8500000,
    currency: "USD",
    jobsCreated: 450,
    jobsIndirect: 1200,
    status: "APPROVED",
    progress: 25,
    startDate: "2024-03-01",
    endDate: "2027-12-31",
    createdAt: "2023-12-01",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    projectCode: "INV-2024-00087",
    projectName: "Hotel Touristique Goma",
    description: "Construction d'un hotel 4 etoiles avec centre de conferences et spa",
    investorName: "Jean-Pierre Mukendi",
    investorId: "3",
    sector: "Tourisme",
    subSector: "Hotellerie",
    province: "Nord-Kivu",
    city: "Goma",
    amount: 2500000,
    currency: "USD",
    jobsCreated: 150,
    jobsIndirect: 300,
    status: "UNDER_REVIEW",
    progress: 0,
    startDate: "2024-06-01",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
  {
    id: "4",
    projectCode: "INV-2024-00086",
    projectName: "Data Center Kinshasa",
    description: "Installation d'un centre de donnees moderne avec solutions cloud pour entreprises",
    investorName: "TechInvest Africa Ltd",
    investorId: "4",
    sector: "Technologies",
    subSector: "Infrastructure IT",
    province: "Kinshasa",
    city: "Kinshasa",
    amount: 8000000,
    currency: "USD",
    jobsCreated: 80,
    jobsIndirect: 200,
    status: "SUBMITTED",
    progress: 0,
    startDate: "2024-09-01",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: "5",
    projectCode: "INV-2024-00085",
    projectName: "Usine de Ciment Matadi",
    description: "Construction d'une nouvelle ligne de production de ciment",
    investorName: "Congo Cement Industries",
    investorId: "5",
    sector: "Industrie",
    subSector: "Materiaux de construction",
    province: "Kongo Central",
    city: "Matadi",
    amount: 35000000,
    currency: "USD",
    jobsCreated: 500,
    jobsIndirect: 1500,
    status: "REJECTED",
    progress: 0,
    startDate: "2024-01-01",
    createdAt: "2023-11-01",
    updatedAt: "2024-01-12",
  },
  {
    id: "6",
    projectCode: "INV-2024-00084",
    projectName: "Centrale Solaire Lubumbashi",
    description: "Installation d'une centrale solaire photovoltaique de 50MW",
    investorName: "African Development Fund",
    investorId: "6",
    sector: "Energie",
    subSector: "Energies renouvelables",
    province: "Haut-Katanga",
    city: "Lubumbashi",
    amount: 75000000,
    currency: "USD",
    jobsCreated: 200,
    jobsIndirect: 500,
    status: "COMPLETED",
    progress: 100,
    startDate: "2022-01-01",
    endDate: "2023-12-31",
    createdAt: "2021-06-15",
    updatedAt: "2024-01-05",
  },
];

export default function ProjectsPage() {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.investorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || investment.status === statusFilter;
    const matchesSector = sectorFilter === "all" || investment.sector === sectorFilter;
    return matchesSearch && matchesStatus && matchesSector;
  });

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sectors = [...new Set(investments.map((i) => i.sector))];

  const stats = {
    total: investments.length,
    inProgress: investments.filter((i) => i.status === "IN_PROGRESS").length,
    totalAmount: investments.reduce((sum, i) => sum + i.amount, 0),
    totalJobs: investments.reduce((sum, i) => sum + i.jobsCreated, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projets d'Investissement
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Suivi et gestion des projets d'investissement
          </p>
        </div>
        <Link
          href="/investments/projects/new"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Projet
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">En Cours</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Montant Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatAmount(stats.totalAmount, "USD")}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois Crees</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {stats.totalJobs.toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par code, nom ou investisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les secteurs</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2.5 ${viewMode === "cards" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 ${viewMode === "table" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInvestments.map((investment) => {
            const status = statusConfig[investment.status] || statusConfig.DRAFT;
            const StatusIcon = status.icon;
            const SectorIcon = sectorIcons[investment.sector] || Factory;

            return (
              <div
                key={investment.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${status.bgColor} rounded-xl flex items-center justify-center`}>
                        <SectorIcon className={`w-6 h-6 ${status.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {investment.projectCode}
                        </p>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {investment.projectName}
                        </h3>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {investment.description}
                  </p>

                  {/* Investor */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{investment.investorName}</span>
                  </div>

                  {/* Progress Bar */}
                  {investment.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Progression</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{investment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            investment.progress === 100 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${investment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Montant</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {formatAmount(investment.amount, investment.currency)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Emplois</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {investment.jobsCreated.toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{investment.province}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(investment.startDate)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/investments/projects/${investment.id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Details
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Projet</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Investisseur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Secteur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredInvestments.map((investment) => {
                  const status = statusConfig[investment.status] || statusConfig.DRAFT;
                  const StatusIcon = status.icon;

                  return (
                    <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{investment.projectName}</p>
                          <p className="text-xs text-gray-500">{investment.projectCode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{investment.investorName}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{investment.sector}</span>
                        <p className="text-xs text-gray-400">{investment.province}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{formatAmount(investment.amount, investment.currency)}</p>
                        <p className="text-xs text-gray-500">{investment.jobsCreated} emplois</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/investments/projects/${investment.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredInvestments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun projet trouve</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de <span className="font-medium">{filteredInvestments.length}</span> projets
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
