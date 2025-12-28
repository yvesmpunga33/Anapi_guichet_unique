"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Users,
  DollarSign,
  Activity,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface ProjectTracking {
  id: string;
  projectCode: string;
  projectName: string;
  investorName: string;
  sector: string;
  province: string;
  amount: number;
  currency: string;
  startDate: string;
  estimatedEndDate: string;
  actualProgress: number;
  plannedProgress: number;
  status: string;
  lastUpdate: string;
  nextMilestone: string;
  nextMilestoneDate: string;
  issues: number;
  updates: number;
  milestones: {
    name: string;
    date: string;
    status: string;
    progress: number;
  }[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  ON_TRACK: { label: "Dans les temps", color: "text-green-600", bgColor: "bg-green-100" },
  AT_RISK: { label: "A risque", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  DELAYED: { label: "En retard", color: "text-red-600", bgColor: "bg-red-100" },
  AHEAD: { label: "En avance", color: "text-blue-600", bgColor: "bg-blue-100" },
  COMPLETED: { label: "Termine", color: "text-purple-600", bgColor: "bg-purple-100" },
  PAUSED: { label: "Suspendu", color: "text-gray-600", bgColor: "bg-gray-100" },
};

const mockTrackingData: ProjectTracking[] = [
  {
    id: "1",
    projectCode: "INV-2024-00089",
    projectName: "Extension Mine de Cuivre Kolwezi",
    investorName: "Congo Mining Corporation",
    sector: "Mines",
    province: "Lualaba",
    amount: 45000000,
    currency: "USD",
    startDate: "2023-06-01",
    estimatedEndDate: "2025-12-31",
    actualProgress: 65,
    plannedProgress: 60,
    status: "AHEAD",
    lastUpdate: "2024-01-20",
    nextMilestone: "Installation equipements Phase 2",
    nextMilestoneDate: "2024-03-15",
    issues: 2,
    updates: 12,
    milestones: [
      { name: "Etude de faisabilite", date: "2023-08-01", status: "completed", progress: 100 },
      { name: "Obtention permis", date: "2023-10-15", status: "completed", progress: 100 },
      { name: "Construction Phase 1", date: "2024-01-31", status: "completed", progress: 100 },
      { name: "Installation equipements Phase 2", date: "2024-03-15", status: "in_progress", progress: 45 },
      { name: "Tests et mise en service", date: "2024-06-30", status: "pending", progress: 0 },
      { name: "Production complete", date: "2025-12-31", status: "pending", progress: 0 },
    ],
  },
  {
    id: "2",
    projectCode: "INV-2024-00088",
    projectName: "Plantation de Palmiers a Huile",
    investorName: "AgroTech RDC SARL",
    sector: "Agriculture",
    province: "Equateur",
    amount: 8500000,
    currency: "USD",
    startDate: "2024-03-01",
    estimatedEndDate: "2027-12-31",
    actualProgress: 15,
    plannedProgress: 25,
    status: "DELAYED",
    lastUpdate: "2024-01-18",
    nextMilestone: "Defrichage terrain",
    nextMilestoneDate: "2024-02-28",
    issues: 3,
    updates: 5,
    milestones: [
      { name: "Acquisition terrain", date: "2024-02-15", status: "completed", progress: 100 },
      { name: "Defrichage terrain", date: "2024-02-28", status: "in_progress", progress: 30 },
      { name: "Plantation Phase 1", date: "2024-06-30", status: "pending", progress: 0 },
      { name: "Construction usine", date: "2025-12-31", status: "pending", progress: 0 },
    ],
  },
  {
    id: "3",
    projectCode: "INV-2024-00084",
    projectName: "Centrale Solaire Lubumbashi",
    investorName: "African Development Fund",
    sector: "Energie",
    province: "Haut-Katanga",
    amount: 75000000,
    currency: "USD",
    startDate: "2022-01-01",
    estimatedEndDate: "2023-12-31",
    actualProgress: 100,
    plannedProgress: 100,
    status: "COMPLETED",
    lastUpdate: "2024-01-05",
    nextMilestone: "Projet termine",
    nextMilestoneDate: "2023-12-31",
    issues: 0,
    updates: 24,
    milestones: [
      { name: "Etude et conception", date: "2022-03-31", status: "completed", progress: 100 },
      { name: "Installation panneaux", date: "2022-09-30", status: "completed", progress: 100 },
      { name: "Raccordement reseau", date: "2023-06-30", status: "completed", progress: 100 },
      { name: "Mise en service", date: "2023-12-31", status: "completed", progress: 100 },
    ],
  },
  {
    id: "4",
    projectCode: "INV-2024-00086",
    projectName: "Data Center Kinshasa",
    investorName: "TechInvest Africa Ltd",
    sector: "Technologies",
    province: "Kinshasa",
    amount: 8000000,
    currency: "USD",
    startDate: "2024-09-01",
    estimatedEndDate: "2026-03-31",
    actualProgress: 0,
    plannedProgress: 0,
    status: "PAUSED",
    lastUpdate: "2024-01-18",
    nextMilestone: "Approbation finale",
    nextMilestoneDate: "2024-02-28",
    issues: 1,
    updates: 3,
    milestones: [
      { name: "Etude de marche", date: "2024-01-31", status: "completed", progress: 100 },
      { name: "Approbation ANAPI", date: "2024-02-28", status: "in_progress", progress: 50 },
      { name: "Acquisition terrain", date: "2024-04-30", status: "pending", progress: 0 },
      { name: "Construction batiment", date: "2025-06-30", status: "pending", progress: 0 },
    ],
  },
];

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<ProjectTracking[]>(mockTrackingData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectTracking | null>(null);

  const filteredData = trackingData.filter((project) => {
    const matchesSearch =
      project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.investorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getProgressDiff = (actual: number, planned: number) => {
    const diff = actual - planned;
    if (diff > 0) return { text: `+${diff}%`, color: "text-green-600" };
    if (diff < 0) return { text: `${diff}%`, color: "text-red-600" };
    return { text: "0%", color: "text-gray-600" };
  };

  const stats = {
    total: trackingData.length,
    onTrack: trackingData.filter((p) => p.status === "ON_TRACK" || p.status === "AHEAD").length,
    atRisk: trackingData.filter((p) => p.status === "AT_RISK" || p.status === "DELAYED").length,
    completed: trackingData.filter((p) => p.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Suivi des Projets
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tableau de bord de progression des investissements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projets Suivis</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dans les Temps</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.onTrack}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">A Risque / Retard</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.atRisk}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Termines</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
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
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredData.map((project) => {
          const status = statusConfig[project.status] || statusConfig.ON_TRACK;
          const progressDiff = getProgressDiff(project.actualProgress, project.plannedProgress);

          return (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Project Header */}
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${status.bgColor} rounded-xl flex items-center justify-center`}>
                      <Activity className={`w-7 h-7 ${status.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {project.projectName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{project.projectCode}</span>
                        <span>•</span>
                        <span>{project.investorName}</span>
                        <span>•</span>
                        <span>{project.sector}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project.actualProgress}%
                      </p>
                      <p className={`text-xs font-medium ${progressDiff.color}`}>
                        {progressDiff.text} vs plan
                      </p>
                    </div>
                    <Link
                      href={`/investments/projects/${project.id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Progression reelle vs planifiee</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Reel: {project.actualProgress}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                        Plan: {project.plannedProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gray-300 dark:bg-gray-500 rounded-full"
                      style={{ width: `${project.plannedProgress}%` }}
                    />
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        project.actualProgress >= project.plannedProgress
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${project.actualProgress}%` }}
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{formatAmount(project.amount, project.currency)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{project.province}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(project.startDate)} - {formatDate(project.estimatedEndDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>MAJ: {formatDate(project.lastUpdate)}</span>
                  </div>
                </div>
              </div>

              {/* Milestones Timeline */}
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Jalons du projet</h4>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {project.issues} problemes
                    </span>
                    <span className="flex items-center gap-1 text-blue-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {project.updates} mises a jour
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {project.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`flex-shrink-0 px-3 py-2 rounded-lg border ${
                        milestone.status === "completed"
                          ? "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700"
                          : milestone.status === "in_progress"
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700"
                          : "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {milestone.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : milestone.status === "in_progress" ? (
                            <Clock className="w-4 h-4 text-blue-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-500" />
                          )}
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {milestone.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          {formatDate(milestone.date)}
                        </p>
                      </div>
                      {index < project.milestones.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-300 mx-1 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Next Milestone */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Prochain jalon: <span className="font-medium">{project.nextMilestone}</span>
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(project.nextMilestoneDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun projet trouve</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}
    </div>
  );
}
