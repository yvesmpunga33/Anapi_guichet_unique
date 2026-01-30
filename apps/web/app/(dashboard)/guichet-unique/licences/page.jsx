"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
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
  Factory,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

// Services
import { DossierList, DossierDelete } from "@/app/services/admin/GuichetUnique.service";

// LICENCES - Theme ORANGE/AMBER avec layout en cartes horizontales compactes
const statusConfig = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300",
    icon: FileText,
  },
  SUBMITTED: {
    label: "Soumis",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Clock,
  },
  IN_REVIEW: {
    label: "En examen",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: AlertCircle,
  },
  UNDER_REVIEW: {
    label: "En examen",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: AlertCircle,
  },
  PENDING_DOCUMENTS: {
    label: "Documents requis",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: FileText,
  },
  MINISTRY_REVIEW: {
    label: "Examen ministere",
    color: "bg-orange-200 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    icon: Building2,
  },
  APPROVED: {
    label: "Approuve",
    color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejete",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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

export default function LicencesPage() {
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

  // Fetch workflow steps dynamically pour LICENCE_EXPLOITATION
  const fetchWorkflowSteps = async () => {
    try {
      const response = await fetch('/api/config/workflow-steps?type=LICENCE_EXPLOITATION&activeOnly=true');
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
        { id: 6, stepNumber: 6, name: "Validation technique" },
        { id: 7, stepNumber: 7, name: "Approbation finale" },
        { id: 8, stepNumber: 8, name: "Delivrance Licence" },
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
        type: 'LICENCE',
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
      console.error('Error fetching licences:', error);
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

  // Handle delete with SweetAlert2
  const handleDelete = async (dossier) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: `Etes-vous sur de vouloir supprimer la licence ${dossier.dossierNumber} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await DossierDelete(dossier.id);
        Swal.fire({
          icon: 'success',
          title: 'Supprime',
          text: 'Licence supprimee avec succes',
          confirmButtonColor: '#f97316'
        });
        fetchDossiers();
      } catch (error) {
        console.error('Error deleting licence:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.response?.data?.message || 'Erreur lors de la suppression',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

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
      {/* Header avec design lateral - THEME AMBRE ATTENUE */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panneau gauche - Info principale */}
        <div className="lg:w-2/3 bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-amber-400/30">
                <Factory className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Licences d'Exploitation</h1>
                <p className="text-stone-300">Autorisations d'exploitation industrielle et commerciale</p>
              </div>
            </div>
            <Link
              href="/guichet-unique/dossiers/new?type=LICENCE_EXPLOITATION"
              className="inline-flex items-center px-5 py-2.5 bg-amber-500/90 text-white rounded-xl hover:bg-amber-600 transition-all font-medium mt-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Demande
            </Link>
          </div>
        </div>

        {/* Panneau droit - Stats rapides empilees */}
        <div className="lg:w-1/3 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-stone-200 dark:border-gray-700">
            <Factory className="w-6 h-6 text-stone-500 dark:text-stone-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-stone-200 dark:border-gray-700">
            <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400 mb-2" />
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.inReview + stats.submitted}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">En cours</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-stone-200 dark:border-gray-700">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.approved}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Delivrees</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-stone-200 dark:border-gray-700">
            <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 mb-2" />
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">{stats.rejected}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Rejetees</p>
          </div>
        </div>
      </div>

      {/* Filtres avec style neutre */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-stone-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher une licence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-stone-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="IN_REVIEW">En examen</option>
              <option value="APPROVED">Approuve</option>
              <option value="REJECTED">Rejete</option>
            </select>
          </div>
          <button className="p-2.5 border border-stone-200 dark:border-gray-600 rounded-lg hover:bg-stone-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Cartes horizontales - Layout specifique LICENCES */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement des licences...</span>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-orange-100 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Factory className="w-10 h-10 text-orange-400" />
          </div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Aucune licence trouvee</p>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'all'
              ? "Modifiez vos criteres de recherche"
              : "Creez votre premiere demande de licence d'exploitation"}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/guichet-unique/dossiers/new?type=LICENCE_EXPLOITATION"
              className="inline-flex items-center px-5 py-2.5 mt-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Licence
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Layout en CARTES HORIZONTALES compactes - specifique aux Licences */}
          <div className="space-y-4">
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-stone-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-amber-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Colonne gauche - Identification avec accent ambre */}
                    <div className="lg:w-1/4 p-4 bg-stone-100 dark:bg-gray-700 border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500 shadow-sm">
                          <Factory className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white text-base">{dossier.dossierNumber}</h3>
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase">Licence</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-stone-200 dark:border-gray-700">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Colonne centrale - Details du projet */}
                    <div className="lg:w-2/4 p-4 flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                        {dossier.projectName || "Projet non defini"}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <User className="w-4 h-4 mr-2 text-stone-400" />
                          <span className="truncate">{dossier.investorName || "Non specifie"}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-stone-400" />
                          <span>{dossier.projectProvince || "-"}</span>
                        </div>
                        {dossier.sector && (
                          <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Briefcase className="w-4 h-4 mr-2 text-stone-400" />
                            <span className="truncate">{dossier.sector}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatAmount(dossier.investmentAmount, dossier.currency)}
                          </span>
                        </div>
                      </div>
                      {/* Barre de progression horizontale */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{currentStepName}</span>
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{progress}%</span>
                        </div>
                        <div className="h-2 bg-stone-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              dossier.status === 'REJECTED' ? 'bg-rose-500' :
                              dossier.status === 'APPROVED' || dossier.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite - Actions et infos */}
                    <div className="lg:w-1/4 p-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col justify-between">
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span>{formatDate(dossier.submittedAt || dossier.createdAt)}</span>
                        </div>
                        {isUrgent && (
                          <span className="inline-flex items-center text-red-500 font-medium">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {daysSinceSubmission} jours
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Link
                          href={`/guichet-unique/dossiers/${dossier.id}`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-amber-500/90 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Voir
                        </Link>
                        <Link
                          href={`/guichet-unique/dossiers/${dossier.id}/edit`}
                          className="p-2 text-gray-700 dark:text-gray-200 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {dossier.status === 'DRAFT' && (
                          <button
                            onClick={() => handleDelete(dossier)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination - Style attenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-stone-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{dossiers.length}</span> sur{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> licences
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-stone-200 dark:border-gray-600 rounded-lg hover:bg-stone-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
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
                        ? "bg-amber-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-stone-200 dark:border-gray-600 rounded-lg hover:bg-stone-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
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
