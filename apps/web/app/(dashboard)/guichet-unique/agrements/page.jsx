"use client";

import { useState, useEffect } from "react";
import {
  FileCheck,
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
  TrendingUp,
  BarChart3,
  Shield,
} from "lucide-react";
import Link from "next/link";

// Services
import { DossierList } from "@/app/services/admin/GuichetUnique.service";

// AGREMENT - Theme INDIGO/BLEU professionnel avec layout en liste detaillee
const statusConfig = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    icon: FileText,
  },
  SUBMITTED: {
    label: "Soumis",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: Clock,
  },
  IN_REVIEW: {
    label: "En examen",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    icon: AlertCircle,
  },
  UNDER_REVIEW: {
    label: "En examen",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    icon: AlertCircle,
  },
  PENDING_DOCUMENTS: {
    label: "Documents requis",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: FileText,
  },
  MINISTRY_REVIEW: {
    label: "Examen ministere",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
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
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
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

export default function AgrementsPage() {
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

  // Fetch workflow steps dynamically pour AGREMENT_REGIME
  const fetchWorkflowSteps = async () => {
    try {
      const response = await fetch('/api/config/workflow-steps?type=AGREMENT_REGIME&activeOnly=true');
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
        { id: 6, stepNumber: 6, name: "Commission Interministerielle" },
        { id: 7, stepNumber: 7, name: "Signature DG" },
        { id: 8, stepNumber: 8, name: "Delivrance Agrement" },
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
        type: 'AGREMENT',
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
      console.error('Error fetching agrements:', error);
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
      {/* Header avec banniere gradient - THEME INDIGO ATTENUE */}
      <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-indigo-300/30">
              <Shield className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Agrements au Regime
              </h1>
              <p className="text-slate-300 mt-1">
                Gestion des demandes d'agrement - Code des Investissements
              </p>
            </div>
          </div>
          <Link
            href="/guichet-unique/dossiers/new?type=AGREMENT_REGIME"
            className="inline-flex items-center px-5 py-3 bg-indigo-500/90 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-md font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel Agrement
          </Link>
        </div>
      </div>

      {/* Stats en bande horizontale avec icones distinctives - Couleurs attenuees */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Dossiers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-slate-500 dark:text-slate-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Traitement</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats.inReview + stats.submitted}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approuves</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejetes</p>
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres avec design epure */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par reference, investisseur ou projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400"
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

      {/* Liste des dossiers - Layout en TABLEAU pour Agrements */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement des agrements...</span>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-indigo-100 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Aucun agrement trouve</p>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'all'
              ? "Essayez de modifier vos filtres de recherche"
              : "Commencez par creer une nouvelle demande d'agrement au regime"}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/guichet-unique/dossiers/new?type=AGREMENT_REGIME"
              className="inline-flex items-center px-5 py-2.5 mt-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Creer un Agrement
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Vue en TABLEAU detaille - specifique aux Agrements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:from-gray-700 dark:to-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Projet / Investisseur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Province</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Investissement</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Progression</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                  {Array.isArray(dossiers) && dossiers.map((dossier, index) => {
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
                      <tr
                        key={dossier.id}
                        className={`hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-slate-50/50 dark:bg-gray-750'}`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                              <Shield className="w-5 h-5 text-indigo-500/70 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{dossier.dossierNumber}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-300">{formatDate(dossier.createdAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{dossier.projectName || "Projet non defini"}</p>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                              <User className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate">{dossier.investorName || "Non specifie"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                            <span>{dossier.projectProvince || "-"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatAmount(dossier.investmentAmount, dossier.currency)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5 mr-1" />
                            {status.label}
                          </span>
                          {isUrgent && (
                            <span className="ml-2 text-xs text-rose-500 font-medium">{daysSinceSubmission}j</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-32">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-700 dark:text-white font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  dossier.status === 'REJECTED' ? 'bg-rose-500' :
                                  dossier.status === 'APPROVED' || dossier.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-700 dark:text-white mt-0.5 truncate">{currentStepName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/guichet-unique/dossiers/${dossier.id}`}
                              className="p-2 text-gray-600 dark:text-gray-200 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                              title="Voir details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/guichet-unique/dossiers/${dossier.id}/edit`}
                              className="p-2 text-gray-600 dark:text-gray-200 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Style Indigo attenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de <span className="font-semibold text-slate-700 dark:text-white">{dossiers.length}</span> sur{" "}
              <span className="font-semibold text-slate-700 dark:text-white">{pagination.total}</span> agrements
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-gray-400" />
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
                        ? "bg-indigo-500 text-white shadow-md"
                        : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700"
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
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
