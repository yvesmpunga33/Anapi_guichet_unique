"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  RefreshCw,
  XCircle,
  Printer,
  Download,
  X,
} from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useLanguage } from "@/contexts/LanguageContext";

// Services
import { ProjectList } from "@/app/services/admin/Project.service";

// Statuts de projet (workflow d'approbation) - fonction dynamique pour l'internationalisation
const getProjectStatusConfig = (intl) => ({
  DRAFT: { label: intl.formatMessage({ id: "status.draft", defaultMessage: "Brouillon" }), color: "text-gray-600", bgColor: "bg-gray-100", icon: Clock },
  SUBMITTED: { label: intl.formatMessage({ id: "status.submitted", defaultMessage: "Soumis" }), color: "text-blue-600", bgColor: "bg-blue-100", icon: Clock },
  UNDER_REVIEW: { label: intl.formatMessage({ id: "status.underReview", defaultMessage: "En examen" }), color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertCircle },
  APPROVED: { label: intl.formatMessage({ id: "status.approved", defaultMessage: "Approuvé" }), color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle2 },
  REJECTED: { label: intl.formatMessage({ id: "status.rejected", defaultMessage: "Rejeté" }), color: "text-red-600", bgColor: "bg-red-100", icon: XCircle },
  IN_PROGRESS: { label: intl.formatMessage({ id: "status.inProgress", defaultMessage: "En cours" }), color: "text-purple-600", bgColor: "bg-purple-100", icon: TrendingUp },
  COMPLETED: { label: intl.formatMessage({ id: "status.completed", defaultMessage: "Terminé" }), color: "text-emerald-600", bgColor: "bg-emerald-100", icon: CheckCircle2 },
  CANCELLED: { label: intl.formatMessage({ id: "status.cancelled", defaultMessage: "Annulé" }), color: "text-gray-600", bgColor: "bg-gray-100", icon: XCircle },
});

// Statuts de suivi (progression) - fonction dynamique pour l'internationalisation
const getTrackingStatusConfig = (intl) => ({
  ON_TRACK: { label: intl.formatMessage({ id: "trackingStatus.onTrack", defaultMessage: "Dans les temps" }), color: "text-green-600", bgColor: "bg-green-100" },
  AT_RISK: { label: intl.formatMessage({ id: "trackingStatus.atRisk", defaultMessage: "À risque" }), color: "text-yellow-600", bgColor: "bg-yellow-100" },
  DELAYED: { label: intl.formatMessage({ id: "trackingStatus.delayed", defaultMessage: "En retard" }), color: "text-red-600", bgColor: "bg-red-100" },
  AHEAD: { label: intl.formatMessage({ id: "trackingStatus.ahead", defaultMessage: "En avance" }), color: "text-blue-600", bgColor: "bg-blue-100" },
  COMPLETED: { label: intl.formatMessage({ id: "trackingStatus.completed", defaultMessage: "Terminé" }), color: "text-emerald-600", bgColor: "bg-emerald-100" },
  NOT_STARTED: { label: intl.formatMessage({ id: "trackingStatus.notStarted", defaultMessage: "Non démarré" }), color: "text-gray-600", bgColor: "bg-gray-100" },
});

export default function TrackingPage() {
  const intl = useIntl();
  const { locale } = useLanguage();
  const projectStatusConfig = getProjectStatusConfig(intl);
  const trackingStatusConfig = getTrackingStatusConfig(intl);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const printRef = useRef(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await ProjectList(params);
      const data = response.data;

      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.response?.data?.message || err.message || intl.formatMessage({ id: "tracking.error.loading", defaultMessage: "Erreur lors du chargement des projets" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Determine tracking status based on progress and dates
  const getTrackingStatus = (project) => {
    if (project.status === "COMPLETED") return "COMPLETED";
    if (project.status === "REJECTED" || project.status === "CANCELLED") return "NOT_STARTED";
    if (project.progress === 0) return "NOT_STARTED";

    // Calculate expected progress based on dates
    if (project.startDate && project.endDate) {
      const start = new Date(project.startDate).getTime();
      const end = new Date(project.endDate).getTime();
      const now = Date.now();
      const totalDuration = end - start;
      const elapsed = now - start;
      const expectedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      const diff = project.progress - expectedProgress;
      if (diff >= 5) return "AHEAD";
      if (diff <= -10) return "DELAYED";
      if (diff <= -5) return "AT_RISK";
      return "ON_TRACK";
    }

    return "ON_TRACK";
  };

  const getProgressDiff = (actual, expected) => {
    const diff = Math.round(actual - expected);
    if (diff > 0) return { text: `+${diff}%`, color: "text-green-600" };
    if (diff < 0) return { text: `${diff}%`, color: "text-red-600" };
    return { text: "0%", color: "text-gray-600" };
  };

  // Calculate stats from dynamic data
  const stats = {
    total: projects.length,
    approved: projects.filter((p) => p.status === "APPROVED").length,
    inProgress: projects.filter((p) => p.status === "IN_PROGRESS").length,
    underReview: projects.filter((p) => p.status === "UNDER_REVIEW" || p.status === "SUBMITTED").length,
    rejected: projects.filter((p) => p.status === "REJECTED").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
  };

  // Handle print/PDF view
  const handlePrint = () => {
    setShowPdfViewer(true);
  };

  const printContent = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Liste des Projets - ANAPI</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h1 { text-align: center; color: #1e40af; margin-bottom: 10px; }
          h2 { text-align: center; color: #666; font-size: 14px; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin-bottom: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; }
          .stat { text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1e40af; }
          .stat-label { font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #1e40af; color: white; padding: 12px 8px; text-align: left; font-size: 12px; }
          td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
          tr:nth-child(even) { background: #f9fafb; }
          .status { padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
          .status-approved { background: #dcfce7; color: #166534; }
          .status-rejected { background: #fee2e2; color: #991b1b; }
          .status-in_progress { background: #f3e8ff; color: #7c3aed; }
          .status-under_review { background: #fef3c7; color: #92400e; }
          .status-submitted { background: #dbeafe; color: #1e40af; }
          .status-completed { background: #d1fae5; color: #065f46; }
          .status-draft { background: #f3f4f6; color: #4b5563; }
          .status-cancelled { background: #f3f4f6; color: #4b5563; }
          .amount { font-weight: 600; color: #059669; }
          .progress { display: inline-block; width: 60px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
          .progress-bar { height: 100%; background: #3b82f6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #9ca3af; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <h1>ANAPI - Agence Nationale pour la Promotion des Investissements</h1>
        <h2>Liste des Projets d'Investissement - ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</h2>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Projets</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #059669;">${stats.approved}</div>
            <div class="stat-label">Approuves</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #7c3aed;">${stats.inProgress}</div>
            <div class="stat-label">En Cours</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #f59e0b;">${stats.underReview}</div>
            <div class="stat-label">En Examen</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #dc2626;">${stats.rejected}</div>
            <div class="stat-label">Rejetes</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #065f46;">${stats.completed}</div>
            <div class="stat-label">Termines</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom du Projet</th>
              <th>Investisseur</th>
              <th>Secteur</th>
              <th>Province</th>
              <th>Montant</th>
              <th>Progression</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(project => `
              <tr>
                <td>${project.projectCode}</td>
                <td><strong>${project.projectName}</strong></td>
                <td>${project.investor?.name || '-'}</td>
                <td>${project.sector || '-'}</td>
                <td>${project.province || '-'}</td>
                <td class="amount">${formatAmount(project.amount, project.currency)}</td>
                <td>
                  <div class="progress">
                    <div class="progress-bar" style="width: ${project.progress || 0}%"></div>
                  </div>
                  ${project.progress || 0}%
                </td>
                <td><span class="status status-${project.status?.toLowerCase()}">${projectStatusConfig[project.status]?.label || project.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Document genere automatiquement par le systeme ANAPI - ${new Date().toLocaleString('fr-FR')}</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: "tracking.title", defaultMessage: "Suivi des Projets" })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {intl.formatMessage({ id: "tracking.subtitle", defaultMessage: "Tableau de bord de progression et statut des investissements" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            <Eye className="w-5 h-5 mr-2" />
            {intl.formatMessage({ id: "tracking.viewPdf", defaultMessage: "Visualiser PDF" })}
          </button>
          <button
            onClick={printContent}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-5 h-5 mr-2" />
            {intl.formatMessage({ id: "tracking.print", defaultMessage: "Imprimer" })}
          </button>
        </div>
      </div>

      {/* Stats Cards - Statuts de projet */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
            statusFilter === "all" ? "border-blue-500" : "border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.total", defaultMessage: "Total" })}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
            statusFilter === "APPROVED" ? "border-green-500" : "border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.approved", defaultMessage: "Approuvés" })}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("IN_PROGRESS")}
          className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
            statusFilter === "IN_PROGRESS" ? "border-purple-500" : "border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.inProgress", defaultMessage: "En Cours" })}</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.inProgress}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("UNDER_REVIEW")}
          className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
            statusFilter === "UNDER_REVIEW" ? "border-yellow-500" : "border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.underReview", defaultMessage: "En Examen" })}</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.underReview}</p>
            </div>
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("REJECTED")}
          className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
            statusFilter === "REJECTED" ? "border-red-500" : "border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.rejected", defaultMessage: "Rejetés" })}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
            statusFilter === "COMPLETED" ? "border-emerald-500" : "border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.completed", defaultMessage: "Terminés" })}</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "tracking.searchPlaceholder", defaultMessage: "Rechercher par code, nom ou investisseur..." })}
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
            <option value="all">{intl.formatMessage({ id: "tracking.allStatuses", defaultMessage: "Tous les statuts" })}</option>
            {Object.entries(projectStatusConfig).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <button
            onClick={fetchProjects}
            className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={fetchProjects}
            className="ml-auto text-red-600 hover:text-red-700 font-medium text-sm"
          >
            {intl.formatMessage({ id: "tracking.retry", defaultMessage: "Réessayer" })}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.loadingProjects", defaultMessage: "Chargement des projets..." })}</p>
        </div>
      )}

      {/* Projects List */}
      {!loading && (
        <div className="space-y-4">
          {projects.map((project) => {
            const status = projectStatusConfig[project.status] || projectStatusConfig.DRAFT;
            const StatusIcon = status.icon;
            const trackingStatus = getTrackingStatus(project);
            const tracking = trackingStatusConfig[trackingStatus];

            // Calculate expected progress
            let expectedProgress = 0;
            if (project.startDate && project.endDate) {
              const start = new Date(project.startDate).getTime();
              const end = new Date(project.endDate).getTime();
              const now = Date.now();
              expectedProgress = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
            }
            const progressDiff = getProgressDiff(project.progress || 0, expectedProgress);

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
                        <StatusIcon className={`w-7 h-7 ${status.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {project.projectName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                          {project.progress > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tracking.bgColor} ${tracking.color}`}>
                              {tracking.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                          <span>{project.projectCode}</span>
                          {project.investor && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {project.investor.name}
                              </span>
                            </>
                          )}
                          {project.sector && (
                            <>
                              <span>•</span>
                              <span>{project.sector}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {project.progress || 0}%
                        </p>
                        {project.progress > 0 && (
                          <p className={`text-xs font-medium ${progressDiff.color}`}>
                            {progressDiff.text} {intl.formatMessage({ id: "tracking.vsPlan", defaultMessage: "vs plan" })}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/investments/projects/${project.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(project.progress > 0 || project.status === "IN_PROGRESS") && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.progression", defaultMessage: "Progression" })}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            {intl.formatMessage({ id: "tracking.actual", defaultMessage: "Réel" })}: {project.progress || 0}%
                          </span>
                          {expectedProgress > 0 && (
                            <span className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                              <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-400"></span>
                              {intl.formatMessage({ id: "tracking.expected", defaultMessage: "Attendu" })}: {expectedProgress}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        {expectedProgress > 0 && (
                          <div
                            className="absolute inset-y-0 left-0 bg-gray-300 dark:bg-gray-500 rounded-full"
                            style={{ width: `${expectedProgress}%` }}
                          />
                        )}
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            (project.progress || 0) >= expectedProgress
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {project.status === "REJECTED" && project.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        <strong>{intl.formatMessage({ id: "tracking.rejectionReason", defaultMessage: "Motif de rejet" })}:</strong> {project.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-green-600">{formatAmount(project.amount, project.currency)}</span>
                    </div>
                    {project.province && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{project.city ? `${project.city}, ` : ""}{project.province}</span>
                      </div>
                    )}
                    {project.startDate && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(project.startDate)}{project.endDate ? ` - ${formatDate(project.endDate)}` : ""}</span>
                      </div>
                    )}
                    {project.jobsCreated > 0 && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{project.jobsCreated} {intl.formatMessage({ id: "tracking.jobs", defaultMessage: "emplois" })}</span>
                      </div>
                    )}
                    {project.approvalDate && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{intl.formatMessage({ id: "tracking.approvedOn", defaultMessage: "Approuvé le" })} {formatDate(project.approvalDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "tracking.noProjectsFound", defaultMessage: "Aucun projet trouvé" })}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {statusFilter !== "all"
              ? intl.formatMessage({ id: "tracking.noProjectsWithStatus", defaultMessage: "Aucun projet avec le statut \"{status}\"" }, { status: projectStatusConfig[statusFilter]?.label })
              : intl.formatMessage({ id: "tracking.tryModifyFilters", defaultMessage: "Essayez de modifier vos filtres de recherche" })
            }
          </p>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {intl.formatMessage({ id: "tracking.viewAllProjects", defaultMessage: "Voir tous les projets" })}
            </button>
          )}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {intl.formatMessage({ id: "tracking.preview", defaultMessage: "Aperçu - Liste des Projets" })}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={printContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Printer className="w-4 h-4 inline mr-2" />
                  {intl.formatMessage({ id: "tracking.print", defaultMessage: "Imprimer" })}
                </button>
                <button
                  onClick={() => setShowPdfViewer(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
              <div className="bg-white dark:bg-gray-800 shadow-lg mx-auto max-w-4xl p-8" ref={printRef}>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                    ANAPI - {intl.formatMessage({ id: "app.title", defaultMessage: "Agence Nationale pour la Promotion des Investissements" })}
                  </h1>
                  <h2 className="text-gray-500 mt-2">
                    {intl.formatMessage({ id: "tracking.projectsList", defaultMessage: "Liste des Projets d'Investissement" })} - {new Date().toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
                  </h2>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-6 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{intl.formatMessage({ id: "tracking.total", defaultMessage: "Total" })}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{intl.formatMessage({ id: "tracking.approved", defaultMessage: "Approuvés" })}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{intl.formatMessage({ id: "tracking.inProgress", defaultMessage: "En Cours" })}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{intl.formatMessage({ id: "tracking.underReview", defaultMessage: "En Examen" })}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{intl.formatMessage({ id: "tracking.rejected", defaultMessage: "Rejetés" })}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{intl.formatMessage({ id: "tracking.completed", defaultMessage: "Terminés" })}</p>
                  </div>
                </div>

                {/* Projects Table */}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      <th className="px-3 py-2 text-left">{intl.formatMessage({ id: "tracking.code", defaultMessage: "Code" })}</th>
                      <th className="px-3 py-2 text-left">{intl.formatMessage({ id: "tracking.project", defaultMessage: "Projet" })}</th>
                      <th className="px-3 py-2 text-left">{intl.formatMessage({ id: "tracking.investor", defaultMessage: "Investisseur" })}</th>
                      <th className="px-3 py-2 text-left">{intl.formatMessage({ id: "tracking.sector", defaultMessage: "Secteur" })}</th>
                      <th className="px-3 py-2 text-right">{intl.formatMessage({ id: "tracking.amount", defaultMessage: "Montant" })}</th>
                      <th className="px-3 py-2 text-center">{intl.formatMessage({ id: "tracking.progress", defaultMessage: "Progression" })}</th>
                      <th className="px-3 py-2 text-center">{intl.formatMessage({ id: "tracking.status", defaultMessage: "Statut" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={project.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""}>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{project.projectCode}</td>
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{project.projectName}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{project.investor?.name || '-'}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{project.sector || '-'}</td>
                        <td className="px-3 py-2 text-right font-medium text-green-600">{formatAmount(project.amount, project.currency)}</td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-xs">{project.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${projectStatusConfig[project.status]?.bgColor} ${projectStatusConfig[project.status]?.color}`}>
                            {projectStatusConfig[project.status]?.label || project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400">
                  {intl.formatMessage({ id: "tracking.generatedBy", defaultMessage: "Document généré automatiquement par le système ANAPI" })} - {new Date().toLocaleString(locale)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
