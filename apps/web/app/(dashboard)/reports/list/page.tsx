"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  File,
  Printer,
  Share2,
  MoreVertical,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  format: string;
  createdBy: string;
  createdAt: string;
  period: string;
  status: string;
  size: string;
  downloads: number;
}

const reportTypes: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  analytics: { label: "Analytique", icon: BarChart3, color: "bg-blue-100 text-blue-600" },
  financial: { label: "Financier", icon: TrendingUp, color: "bg-green-100 text-green-600" },
  operational: { label: "Operationnel", icon: PieChart, color: "bg-purple-100 text-purple-600" },
  statistical: { label: "Statistique", icon: FileSpreadsheet, color: "bg-orange-100 text-orange-600" },
};

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
  DOCX: File,
};

const mockReports: Report[] = [
  {
    id: "1",
    title: "Rapport Trimestriel des Investissements Q4 2024",
    description: "Analyse complete des investissements du quatrieme trimestre 2024",
    type: "analytics",
    category: "Investissements",
    format: "PDF",
    createdBy: "Jean Kabila",
    createdAt: "2024-01-15",
    period: "Q4 2024",
    status: "published",
    size: "2.4 MB",
    downloads: 45,
  },
  {
    id: "2",
    title: "Bilan Annuel des Agrements 2024",
    description: "Synthese des agrements accordes et rejetes en 2024",
    type: "operational",
    category: "Guichet Unique",
    format: "PDF",
    createdBy: "Marie Lumumba",
    createdAt: "2024-01-10",
    period: "2024",
    status: "published",
    size: "1.8 MB",
    downloads: 32,
  },
  {
    id: "3",
    title: "Statistiques Sectorielles - Mines",
    description: "Donnees detaillees sur les investissements dans le secteur minier",
    type: "statistical",
    category: "Secteurs",
    format: "XLSX",
    createdBy: "Pierre Tshisekedi",
    createdAt: "2024-01-08",
    period: "2024",
    status: "published",
    size: "856 KB",
    downloads: 28,
  },
  {
    id: "4",
    title: "Rapport Financier Mensuel - Decembre 2024",
    description: "Analyse des flux financiers et montants investis",
    type: "financial",
    category: "Finance",
    format: "PDF",
    createdBy: "Jean Kabila",
    createdAt: "2024-01-05",
    period: "Dec 2024",
    status: "published",
    size: "1.2 MB",
    downloads: 19,
  },
  {
    id: "5",
    title: "Repartition Geographique des Projets",
    description: "Cartographie des investissements par province",
    type: "analytics",
    category: "Geographie",
    format: "PDF",
    createdBy: "Marie Lumumba",
    createdAt: "2024-01-03",
    period: "2024",
    status: "draft",
    size: "3.1 MB",
    downloads: 0,
  },
  {
    id: "6",
    title: "Performance des Delais de Traitement",
    description: "Analyse des temps de traitement des dossiers par ministere",
    type: "operational",
    category: "Performance",
    format: "XLSX",
    createdBy: "Pierre Tshisekedi",
    createdAt: "2024-01-02",
    period: "Q4 2024",
    status: "published",
    size: "645 KB",
    downloads: 15,
  },
  {
    id: "7",
    title: "Tableau de Bord Executif - Janvier 2025",
    description: "Resume executif pour la direction generale",
    type: "analytics",
    category: "Direction",
    format: "PDF",
    createdBy: "Jean Kabila",
    createdAt: "2024-01-20",
    period: "Jan 2025",
    status: "draft",
    size: "980 KB",
    downloads: 0,
  },
];

const reportTemplates = [
  { name: "Rapport Trimestriel", icon: BarChart3 },
  { name: "Bilan Annuel", icon: PieChart },
  { name: "Statistiques Secteur", icon: TrendingUp },
  { name: "Analyse Geographique", icon: FileSpreadsheet },
];

export default function ReportsListPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = {
    total: reports.length,
    published: reports.filter((r) => r.status === "published").length,
    draft: reports.filter((r) => r.status === "draft").length,
    totalDownloads: reports.reduce((sum, r) => sum + r.downloads, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Generation et consultation des rapports
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Rapport
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Rapports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Publies</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Brouillons</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Telechargements</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalDownloads}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Modeles rapides</h3>
        <div className="flex flex-wrap gap-3">
          {reportTemplates.map((template, index) => {
            const Icon = template.icon;
            return (
              <button
                key={index}
                className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{template.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les types</option>
              {Object.entries(reportTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publie</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const type = reportTypes[report.type];
          const TypeIcon = type?.icon || FileText;
          const FormatIcon = formatIcons[report.format] || FileText;

          return (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${type?.color || "bg-gray-100 text-gray-600"}`}>
                  <TypeIcon className="w-7 h-7" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {report.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        report.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {report.status === "published" ? "Publie" : "Brouillon"}
                      </span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <FormatIcon className="w-4 h-4" />
                      <span>{report.format} - {report.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>{report.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{report.period}</span>
                    </div>
                    {report.downloads > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Download className="w-4 h-4" />
                        <span>{report.downloads} telechargements</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Download className="w-4 h-4 mr-1.5" />
                      Telecharger
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <Eye className="w-4 h-4 mr-1.5" />
                      Apercu
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <Share2 className="w-4 h-4 mr-1.5" />
                      Partager
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <Printer className="w-4 h-4 mr-1.5" />
                      Imprimer
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors ml-auto">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun rapport trouve</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de <span className="font-medium">{filteredReports.length}</span> rapports
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
