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
} from "lucide-react";
import Link from "next/link";

const statusConfig = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    icon: FileText,
  },
  SUBMITTED: {
    label: "Soumis",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  IN_REVIEW: {
    label: "En examen",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertCircle,
  },
  UNDER_REVIEW: {
    label: "En examen",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertCircle,
  },
  PENDING_DOCUMENTS: {
    label: "Documents requis",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: FileText,
  },
  MINISTRY_REVIEW: {
    label: "Examen ministere",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: Building2,
  },
  APPROVED: {
    label: "Approuve",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejete",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
  COMPLETED: {
    label: "Termine",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
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
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        type: 'PERMIS_CONSTRUCTION',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/guichet-unique/dossiers?${params}`);
      const result = await response.json();

      if (response.ok) {
        setDossiers(result.data || []);
        setStats(result.stats || stats);
        setPagination(prev => ({
          ...prev,
          total: result.pagination?.total || 0,
          totalPages: result.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching permis:', error);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Permis
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Gestion des demandes de permis
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/guichet-unique/dossiers/new?type=PERMIS_CONSTRUCTION"
          className="inline-flex items-center px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Permis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.inReview + stats.submitted}</p>
              <p className="text-xs text-gray-500">En cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-500">Approuves</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-gray-500">Rejetes</p>
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
              placeholder="Rechercher par reference, investisseur ou projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="IN_REVIEW">En examen</option>
              <option value="APPROVED">Approuve</option>
              <option value="REJECTED">Rejete</option>
            </select>
          </div>
          <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement...</span>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <ScrollText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Aucun permis trouve</p>
          <p className="text-sm text-gray-400 mt-2">
            {searchTerm || statusFilter !== 'all'
              ? "Essayez de modifier vos filtres"
              : "Commencez par creer une nouvelle demande de permis"}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/guichet-unique/dossiers/new?type=PERMIS_CONSTRUCTION"
              className="inline-flex items-center px-4 py-2 mt-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Permis
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dossiers.map((dossier) => {
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-amber-500 border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                          <ScrollText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {dossier.dossierNumber}
                          </h3>
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Permis
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5 mr-1" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {dossier.projectName || "Projet non defini"}
                    </h4>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{dossier.investorName || "Non specifie"}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{dossier.projectProvince || "Province non specifiee"}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatAmount(dossier.investmentAmount, dossier.currency)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">Progression</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {currentStepName}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            dossier.status === 'REJECTED' ? 'bg-red-500' :
                            dossier.status === 'APPROVED' || dossier.status === 'COMPLETED' ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {/* Progress Steps - Dynamic */}
                      <div className="flex justify-between mt-1">
                        {workflowSteps.map((step) => {
                          const isCompleted = dossier.currentStep >= step.stepNumber ||
                            (dossier.status === 'APPROVED' || dossier.status === 'COMPLETED');
                          const isCurrent = dossier.currentStep === step.stepNumber;
                          return (
                            <div
                              key={step.id}
                              className={`w-2 h-2 rounded-full transition-all ${
                                isCompleted
                                  ? dossier.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'
                                  : isCurrent
                                    ? 'bg-amber-300 ring-2 ring-amber-500 ring-offset-1'
                                    : 'bg-gray-200 dark:bg-gray-600'
                              }`}
                              title={`${step.name}${step.responsibleRole ? ` - ${step.responsibleRole}` : ''}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(dossier.submittedAt || dossier.createdAt)}
                      </div>
                      {dossier.status !== 'DRAFT' && dossier.status !== 'APPROVED' && dossier.status !== 'REJECTED' && (
                        <span className={`text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-gray-500'}`}>
                          {daysSinceSubmission} jour{daysSinceSubmission > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/guichet-unique/dossiers/${dossier.id}`}
                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg"
                        title="Voir details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/guichet-unique/dossiers/${dossier.id}/edit`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                    <Link
                      href={`/guichet-unique/dossiers/${dossier.id}`}
                      className="inline-flex items-center text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium"
                    >
                      Voir plus
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Affichage de <span className="font-medium">{dossiers.length}</span> sur{" "}
              <span className="font-medium">{pagination.total}</span> permis
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
                const page = startPage + i;
                if (page > pagination.totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      pagination.page === page
                        ? "bg-amber-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
