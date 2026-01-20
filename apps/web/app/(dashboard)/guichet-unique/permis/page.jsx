"use client";

import { useState, useEffect } from "react";
import {
  ScrollText,
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
  Landmark,
  HardHat,
  Ruler,
  Home,
} from "lucide-react";
import Link from "next/link";

// Services
import { DossierList } from "@/app/services/admin/GuichetUnique.service";

// PERMIS - Theme CYAN/TEAL avec layout en grille de cartes compactes
const statusConfig = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    icon: FileText,
  },
  SUBMITTED: {
    label: "Soumis",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    icon: Clock,
  },
  IN_REVIEW: {
    label: "En examen",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    icon: AlertCircle,
  },
  UNDER_REVIEW: {
    label: "En examen",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    icon: AlertCircle,
  },
  PENDING_DOCUMENTS: {
    label: "Documents requis",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    icon: FileText,
  },
  MINISTRY_REVIEW: {
    label: "Examen ministere",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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

// Calcul de la progression basé sur currentStep et les étapes dynamiques
const getProgressFromStep = (currentStep, totalSteps) => {
  if (!currentStep || !totalSteps || totalSteps === 0) return 0;
  return Math.round((currentStep / totalSteps) * 100);
};

// Fallback pour le statut si pas de currentStep
const getProgressFromStatus = (status, totalSteps) => {
  const stepMap = {
    DRAFT: 0,
    SUBMITTED: totalSteps > 0 ? Math.round((1 / totalSteps) * 100) : 20,
    IN_REVIEW: totalSteps > 0 ? Math.round((2 / totalSteps) * 100) : 40,
    UNDER_REVIEW: totalSteps > 0 ? Math.round((2 / totalSteps) * 100) : 40,
    PENDING_DOCUMENTS: totalSteps > 0 ? Math.round((2 / totalSteps) * 100) : 40,
    MINISTRY_REVIEW: totalSteps > 0 ? Math.round((3 / totalSteps) * 100) : 60,
    APPROVED: 100,
    REJECTED: 100,
    COMPLETED: 100,
  };
  return stepMap[status] || 0;
};

export default function PermisPage() {
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

  // Fetch workflow steps dynamically pour PERMIS_CONSTRUCTION
  const fetchWorkflowSteps = async () => {
    try {
      const response = await fetch('/api/config/workflow-steps?type=PERMIS_CONSTRUCTION&activeOnly=true');
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
      }
    } catch (error) {
      console.error('Error fetching workflow steps:', error);
      // Fallback to default steps if API fails
      setWorkflowSteps([
        { id: 1, stepNumber: 1, name: "Soumission" },
        { id: 2, stepNumber: 2, name: "Verification documentaire" },
        { id: 3, stepNumber: 3, name: "Analyse ANAPI" },
        { id: 4, stepNumber: 4, name: "Transmission Ministere" },
        { id: 5, stepNumber: 5, name: "Examen Ministere" },
        { id: 6, stepNumber: 6, name: "Inspection terrain" },
        { id: 7, stepNumber: 7, name: "Validation urbanisme" },
        { id: 8, stepNumber: 8, name: "Delivrance Permis" },
      ]);
    }
  };

  useEffect(() => {
    fetchWorkflowSteps();
  }, []);

  const fetchDossiers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        type: 'PERMIS_CONSTRUCTION',
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
      console.error('Error fetching permis:', error);
      // Set empty array on error to prevent map error
      setDossiers([]);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Header avec design construction - THEME TEAL ATTENUE */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 rounded-2xl shadow-md">
        {/* Motif architectural en arriere-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)'}}></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)'}}></div>
        </div>
        <div className="relative z-10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-teal-400/30">
                <HardHat className="w-8 h-8 text-teal-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Permis de Construire</h1>
                <p className="text-slate-300 mt-1">Autorisations de construction et d'amenagement</p>
              </div>
            </div>
            <Link
              href="/guichet-unique/dossiers/new?type=PERMIS_CONSTRUCTION"
              className="inline-flex items-center px-5 py-3 bg-teal-500/90 text-white rounded-xl hover:bg-teal-600 transition-all shadow-md font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Permis
            </Link>
          </div>
        </div>
      </div>

      {/* Stats en ligne horizontale avec icones construction */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">Total Permis</p>
            </div>
            <Home className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">{stats.inReview + stats.submitted}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">En cours</p>
            </div>
            <Ruler className="w-8 h-8 text-teal-500 dark:text-teal-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.approved}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">Delivres</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-rose-700 dark:text-rose-400">{stats.rejected}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">Refuses</p>
            </div>
            <XCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
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
              placeholder="Rechercher un permis de construire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-400"
            >
              <option value="all">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="IN_REVIEW">En examen</option>
              <option value="APPROVED">Approuve</option>
              <option value="REJECTED">Rejete</option>
            </select>
          </div>
          <button className="p-2.5 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Grille de CARTES COMPACTES - Layout specifique PERMIS */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement des permis...</span>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border-2 border-dashed border-cyan-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <HardHat className="w-10 h-10 text-cyan-500" />
          </div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Aucun permis trouve</p>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'all'
              ? "Modifiez vos criteres de recherche"
              : "Deposez votre premiere demande de permis de construire"}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/guichet-unique/dossiers/new?type=PERMIS_CONSTRUCTION"
              className="inline-flex items-center px-5 py-2.5 mt-6 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Permis
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Grille 4 colonnes de cartes compactes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.isArray(dossiers) && dossiers.map((dossier) => {
              const status = statusConfig[dossier.status] || statusConfig.DRAFT;
              const StatusIcon = status.icon;
              const totalSteps = workflowSteps.length;
              const progress = dossier.currentStep
                ? getProgressFromStep(dossier.currentStep, totalSteps)
                : getProgressFromStatus(dossier.status, totalSteps);
              const currentStepData = workflowSteps.find(s => s.stepNumber === dossier.currentStep);
              const currentStepName = currentStepData?.name || status.label;
              const daysSinceSubmission = getDaysSinceSubmission(dossier.submittedAt);
              const isUrgent = daysSinceSubmission > 30 && !['APPROVED', 'REJECTED', 'COMPLETED', 'DRAFT'].includes(dossier.status);

              return (
                <div
                  key={dossier.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Header compact avec icone et statut */}
                  <div className="bg-slate-700 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-500/30 rounded-lg flex items-center justify-center">
                          <HardHat className="w-4 h-4 text-teal-300" />
                        </div>
                        <span className="font-bold text-white text-sm">{dossier.dossierNumber}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 min-h-[2.5rem]">
                      {dossier.projectName || "Projet non defini"}
                    </h4>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span className="truncate">{dossier.investorName || "Non specifie"}</span>
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span>{dossier.projectProvince || "-"}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatAmount(dossier.investmentAmount, dossier.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Barre de progression circulaire */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 transform -rotate-90">
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${progress} 100`}
                            strokeLinecap="round"
                            className={`${
                              dossier.status === 'REJECTED' ? 'text-rose-500' :
                              dossier.status === 'APPROVED' || dossier.status === 'COMPLETED' ? 'text-emerald-500' : 'text-cyan-500'
                            }`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                          {progress}%
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{currentStepName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(dossier.createdAt)}</p>
                      </div>
                    </div>

                    {isUrgent && (
                      <div className="flex items-center text-xs text-rose-500 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {daysSinceSubmission} jours
                      </div>
                    )}
                  </div>

                  {/* Footer avec actions */}
                  <div className="px-3 py-2 bg-slate-50 dark:bg-gray-700/50 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <Link
                      href={`/guichet-unique/dossiers/${dossier.id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-teal-500/90 text-white rounded-lg hover:bg-teal-600 transition-colors text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Details
                    </Link>
                    <Link
                      href={`/guichet-unique/dossiers/${dossier.id}/edit`}
                      className="ml-2 p-1.5 text-gray-700 dark:text-gray-200 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination - Style attenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white">{dossiers.length}</span> / <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> permis
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
                        ? "bg-teal-500 text-white shadow-md"
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
