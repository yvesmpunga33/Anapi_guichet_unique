"use client";

import { useState, useEffect } from "react";
import {
  FileBadge,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  User,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  Building2,
  Circle,
  Landmark,
  ShieldCheck,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

// Services
import { DossierList } from "@/app/services/admin/GuichetUnique.service";

// Helper function to get icon dynamically
const getIcon = (iconName) => {
  if (!iconName) return Circle;
  const icon = LucideIcons[iconName];
  return icon || Circle;
};

// AUTORISATIONS - Theme VIOLET/PURPLE avec layout en timeline verticale
const statusConfig = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    icon: FileText,
  },
  SUBMITTED: {
    label: "Soumis",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    icon: Clock,
  },
  IN_REVIEW: {
    label: "En examen",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: AlertCircle,
  },
  UNDER_REVIEW: {
    label: "En examen",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: AlertCircle,
  },
  PENDING_DOCUMENTS: {
    label: "Documents requis",
    color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
    icon: FileText,
  },
  MINISTRY_REVIEW: {
    label: "Examen ministere",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: Building2,
  },
  APPROVED: {
    label: "Approuve",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejete",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    icon: XCircle,
  },
  COMPLETED: {
    label: "Termine",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
};

// Default workflow steps (fallback if API fails) pour AUTORISATION_ACTIVITE
const defaultWorkflowSteps = [
  { id: 1, stepNumber: 1, name: "Soumission" },
  { id: 2, stepNumber: 2, name: "Verification documentaire" },
  { id: 3, stepNumber: 3, name: "Analyse ANAPI" },
  { id: 4, stepNumber: 4, name: "Transmission Ministere" },
  { id: 5, stepNumber: 5, name: "Examen Ministere" },
  { id: 6, stepNumber: 6, name: "Verification conformite" },
  { id: 7, stepNumber: 7, name: "Approbation autorite" },
  { id: 8, stepNumber: 8, name: "Delivrance Autorisation" },
];

// Calculate progress based on currentStep
const getProgressFromStep = (currentStep, totalSteps) => {
  if (!currentStep || !totalSteps || totalSteps === 0) return 0;
  return Math.round((currentStep / totalSteps) * 100);
};

// Fallback: Calculate progress based on status (when currentStep is not available)
const getProgressFromStatus = (status, totalSteps) => {
  const stepMap = {
    DRAFT: 0,
    SUBMITTED: 1,
    IN_REVIEW: 2,
    UNDER_REVIEW: 2,
    PENDING_DOCUMENTS: 2,
    MINISTRY_REVIEW: Math.ceil(totalSteps * 0.6),
    APPROVED: totalSteps,
    REJECTED: totalSteps,
    COMPLETED: totalSteps,
  };
  const step = stepMap[status] || 0;
  return getProgressFromStep(step, totalSteps);
};

const getCurrentStepName = (status, workflowSteps, currentStep) => {
  // If we have currentStep, find the step name from workflow
  if (currentStep && workflowSteps.length > 0) {
    const step = workflowSteps.find(s => s.stepNumber === currentStep);
    if (step) return step.name;
  }

  // Fallback to status-based name
  const nameMap = {
    DRAFT: "Brouillon",
    SUBMITTED: "Reception",
    IN_REVIEW: "Analyse ANAPI",
    UNDER_REVIEW: "Analyse ANAPI",
    PENDING_DOCUMENTS: "Documents requis",
    MINISTRY_REVIEW: "Examen Ministere",
    APPROVED: "Approuve",
    REJECTED: "Rejete",
    COMPLETED: "Termine",
  };
  return nameMap[status] || status;
};

export default function AutorisationsPage() {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Fetch workflow steps from configuration pour AUTORISATION_ACTIVITE
  const fetchWorkflowSteps = async () => {
    try {
      const response = await fetch('/api/config/workflow-steps?type=AUTORISATION_ACTIVITE&activeOnly=true');
      if (response.ok) {
        const data = await response.json();
        const steps = (data.steps || [])
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map(s => ({
            id: s.id,
            stepNumber: s.stepNumber,
            name: s.name,
            description: s.description,
            icon: s.icon,
            color: s.color,
            responsibleRole: s.responsibleRole,
            isFinal: s.isFinal,
          }));
        setWorkflowSteps(steps);
      } else {
        setWorkflowSteps(defaultWorkflowSteps);
      }
    } catch (error) {
      console.error('Error fetching workflow steps:', error);
      setWorkflowSteps(defaultWorkflowSteps);
    }
  };

  const fetchDossiers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        type: 'AUTORISATION_ACTIVITE',
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await DossierList(params);
      const result = response.data;

      // API returns: { success: true, data: { dossiers: [...], pagination: {...} } }
      const dossiersData = Array.isArray(result?.data?.dossiers)
        ? result.data.dossiers
        : Array.isArray(result?.dossiers)
          ? result.dossiers
          : [];

      setDossiers(dossiersData);
      setStats(result.data?.stats || result.stats || stats);
      setPagination(prev => ({
        ...prev,
        total: result.data?.pagination?.total || result.pagination?.total || 0,
        totalPages: result.data?.pagination?.totalPages || result.pagination?.totalPages || 0,
      }));
    } catch (error) {
      console.error('Error fetching autorisations:', error);
      // Set empty array on error to prevent map error
      setDossiers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowSteps();
  }, []);

  useEffect(() => {
    fetchDossiers();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchDossiers();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysSinceSubmission = (submittedAt) => {
    if (!submittedAt) return 0;
    const submitted = new Date(submittedAt);
    const now = new Date();
    const diffTime = Math.abs(now - submitted);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header avec design elegant - THEME VIOLET ATTENUE */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 rounded-2xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20 rounded-2xl"></div>
        <div className="relative z-10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-purple-400/30">
                <ShieldCheck className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Autorisations d'Activite</h1>
                <p className="text-slate-300 mt-1">Permis et autorisations d'exercice d'activites</p>
              </div>
            </div>
            <Link
              href="/guichet-unique/dossiers/new?type=AUTORISATION_ACTIVITE"
              className="inline-flex items-center px-5 py-3 bg-purple-500/90 text-white rounded-xl hover:bg-purple-600 transition-all shadow-md font-semibold group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Nouvelle Demande
            </Link>
          </div>
        </div>
      </div>

      {/* Stats avec design simple */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="relative">
            <ClipboardList className="w-8 h-8 text-slate-500 dark:text-slate-400 mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Demandes</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="relative">
            <Clock className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-2" />
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.inReview + stats.submitted}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">En traitement</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="relative">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-2" />
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.approved}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Accordees</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="relative">
            <XCircle className="w-8 h-8 text-rose-500 dark:text-rose-400 mb-2" />
            <p className="text-3xl font-bold text-rose-700 dark:text-rose-400">{stats.rejected}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Refusees</p>
          </div>
        </div>
      </div>

      {/* Filtres avec style neutre */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une autorisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="IN_REVIEW">En examen</option>
              <option value="APPROVED">Approuve</option>
              <option value="REJECTED">Rejete</option>
            </select>
          </div>
          <button className="p-2.5 border border-slate-200 dark:border-gray-600 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Liste en TIMELINE verticale - Layout specifique AUTORISATIONS */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement des autorisations...</span>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-violet-100 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="w-10 h-10 text-violet-500" />
          </div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Aucune autorisation trouvee</p>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'all'
              ? "Modifiez vos criteres de recherche"
              : "Deposez votre premiere demande d'autorisation d'activite"}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/guichet-unique/dossiers/new?type=AUTORISATION_ACTIVITE"
              className="inline-flex items-center px-5 py-2.5 mt-6 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Autorisation
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Layout en TIMELINE VERTICALE avec ligne de connexion */}
          <div className="relative">
            {/* Ligne de timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/60 via-purple-300/40 to-slate-300"></div>

            <div className="space-y-4">
              {Array.isArray(dossiers) && dossiers.map((dossier, index) => {
                const status = statusConfig[dossier.status] || statusConfig.DRAFT;
                const StatusIcon = status.icon;
                const totalSteps = workflowSteps.length || defaultWorkflowSteps.length;
                const progress = dossier.currentStep
                  ? getProgressFromStep(dossier.currentStep, totalSteps)
                  : getProgressFromStatus(dossier.status, totalSteps);
                const daysSinceSubmission = getDaysSinceSubmission(dossier.submittedAt);
                const isUrgent = daysSinceSubmission > 30 && !['APPROVED', 'REJECTED', 'COMPLETED', 'DRAFT'].includes(dossier.status);
                const currentSteps = workflowSteps.length > 0 ? workflowSteps : defaultWorkflowSteps;

                return (
                  <div key={dossier.id} className="relative flex gap-4">
                    {/* Point de timeline */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        dossier.status === 'APPROVED' || dossier.status === 'COMPLETED'
                          ? 'bg-emerald-500/90'
                          : dossier.status === 'REJECTED'
                            ? 'bg-rose-500/90'
                            : 'bg-purple-500/80'
                      }`}>
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Carte principale */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-purple-300 transition-all">
                      <div className="flex flex-col lg:flex-row">
                        {/* Section principale */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-purple-700 dark:text-purple-400">{dossier.dossierNumber}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {dossier.projectName || "Projet non defini"}
                              </h4>
                            </div>
                            {isUrgent && (
                              <span className="flex items-center text-xs text-rose-500 font-medium bg-rose-50 px-2 py-1 rounded-lg">
                                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                {daysSinceSubmission}j
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                              <User className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="truncate">{dossier.investorName || "Non specifie"}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                              <span>{dossier.projectProvince || "-"}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                              <span className="font-bold text-gray-900 dark:text-white">
                                {formatAmount(dossier.investmentAmount, dossier.currency)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                              <Calendar className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
                              <span>{formatDate(dossier.createdAt)}</span>
                            </div>
                          </div>

                          {/* Progression en etapes visuelles */}
                          <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Etape:</span>
                            <div className="flex-1 flex items-center gap-1">
                              {currentSteps.slice(0, 6).map((step, idx) => {
                                const stepProgress = ((idx + 1) / totalSteps) * 100;
                                const isCompleted = progress >= stepProgress;
                                const isCurrent = progress >= stepProgress && progress < ((idx + 2) / totalSteps) * 100;
                                return (
                                  <div
                                    key={step.id}
                                    className={`h-1.5 flex-1 rounded-full transition-all ${
                                      isCompleted
                                        ? dossier.status === 'REJECTED' ? 'bg-rose-500' : 'bg-violet-500'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    } ${isCurrent ? 'ring-2 ring-violet-300' : ''}`}
                                    title={step.name}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">{progress}%</span>
                          </div>
                        </div>

                        {/* Section actions */}
                        <div className="lg:w-40 p-4 bg-slate-50 dark:bg-gray-700/50 flex flex-row lg:flex-col items-center justify-center gap-2">
                          <Link
                            href={`/guichet-unique/dossiers/${dossier.id}`}
                            className="flex-1 lg:w-full inline-flex items-center justify-center px-4 py-2 bg-purple-500/90 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Details
                          </Link>
                          <Link
                            href={`/guichet-unique/dossiers/${dossier.id}/edit`}
                            className="p-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination - Style attenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white">{dossiers.length}</span> sur{" "}
              <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> autorisations
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
                const page = startPage + i;
                if (page > pagination.totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === page
                        ? "bg-purple-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
