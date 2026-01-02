"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  FolderOpen,
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
  X,
  Loader2,
  User,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  FileCheck,
  Award,
  ScrollText,
  FileBadge,
  Building2,
  Circle,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Helper to get Lucide icon by name
const getIcon = (iconName) => {
  return LucideIcons[iconName] || Circle;
};

// Configuration des types de dossiers
const dossierTypes = {
  // Agréments
  AGREMENT_REGIME: {
    label: "Agrément au Régime",
    shortLabel: "Agrément",
    icon: FileCheck,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    borderColor: "border-blue-500",
    bgGradient: "from-blue-500 to-blue-600",
  },
  AGREMENT: {
    label: "Agrément",
    shortLabel: "Agrément",
    icon: FileCheck,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    borderColor: "border-blue-500",
    bgGradient: "from-blue-500 to-blue-600",
  },
  // Licences
  LICENCE_EXPLOITATION: {
    label: "Licence d'Exploitation",
    shortLabel: "Licence",
    icon: Award,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    borderColor: "border-purple-500",
    bgGradient: "from-purple-500 to-purple-600",
  },
  LICENCE: {
    label: "Licence",
    shortLabel: "Licence",
    icon: Award,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    borderColor: "border-purple-500",
    bgGradient: "from-purple-500 to-purple-600",
  },
  // Permis
  PERMIS_CONSTRUCTION: {
    label: "Permis de Construire",
    shortLabel: "Permis",
    icon: ScrollText,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    borderColor: "border-amber-500",
    bgGradient: "from-amber-500 to-amber-600",
  },
  PERMIS: {
    label: "Permis",
    shortLabel: "Permis",
    icon: ScrollText,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    borderColor: "border-amber-500",
    bgGradient: "from-amber-500 to-amber-600",
  },
  // Autorisations
  AUTORISATION_ACTIVITE: {
    label: "Autorisation d'Activité",
    shortLabel: "Autorisation",
    icon: FileBadge,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    borderColor: "border-emerald-500",
    bgGradient: "from-emerald-500 to-emerald-600",
  },
  AUTORISATION: {
    label: "Autorisation",
    shortLabel: "Autorisation",
    icon: FileBadge,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    borderColor: "border-emerald-500",
    bgGradient: "from-emerald-500 to-emerald-600",
  },
  // Déclarations d'investissement
  DECLARATION_INVESTISSEMENT: {
    label: "Déclaration d'Investissement",
    shortLabel: "Déclaration",
    icon: FileText,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    borderColor: "border-cyan-500",
    bgGradient: "from-cyan-500 to-cyan-600",
  },
  // Exonérations
  EXONERATION_FISCALE: {
    label: "Exonération Fiscale",
    shortLabel: "Exonération",
    icon: DollarSign,
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    borderColor: "border-teal-500",
    bgGradient: "from-teal-500 to-teal-600",
  },
  // Autres
  AUTRE: {
    label: "Autre",
    shortLabel: "Autre",
    icon: FolderOpen,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    borderColor: "border-gray-400",
    bgGradient: "from-gray-500 to-gray-600",
  },
};

const statusConfig = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    icon: FileText,
    step: 0,
  },
  SUBMITTED: {
    label: "Soumis",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
    step: 1,
  },
  IN_REVIEW: {
    label: "En examen",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertCircle,
    step: 2,
  },
  UNDER_REVIEW: {
    label: "En examen",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertCircle,
    step: 2,
  },
  PENDING_DOCUMENTS: {
    label: "Documents requis",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: FileText,
    step: 2,
  },
  MINISTRY_REVIEW: {
    label: "Examen ministère",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: Building2,
    step: 3,
  },
  APPROVED: {
    label: "Approuvé",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
    step: 5,
  },
  REJECTED: {
    label: "Rejeté",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
    step: -1,
  },
  COMPLETED: {
    label: "Terminé",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: CheckCircle2,
    step: 5,
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

export default function DossiersPage() {
  const router = useRouter();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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

  // Fetch workflow steps dynamically - utilise le type selectionne ou AGREMENT_REGIME par defaut
  const fetchWorkflowSteps = async (dossierType = 'AGREMENT_REGIME') => {
    try {
      const response = await fetch(`/api/config/workflow-steps?type=${dossierType}&activeOnly=true`);
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
        { id: 8, stepNumber: 8, name: "Delivrance" },
      ]);
    }
  };

  useEffect(() => {
    // Charger les workflow steps selon le type filtre
    const type = typeFilter !== 'all' ? typeFilter : 'AGREMENT_REGIME';
    fetchWorkflowSteps(type);
  }, [typeFilter]);

  // Fetch dossiers from API
  const fetchDossiers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
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
      } else {
        console.error('Error fetching dossiers:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, [pagination.page, statusFilter, typeFilter]);

  // Debounce search
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDelete = async (dossier) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer le dossier ${dossier.dossierNumber} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/guichet-unique/dossiers/${dossier.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            text: 'Dossier supprimé avec succès',
            timer: 3000,
            showConfirmButton: false,
          });
          fetchDossiers();
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: data.error || 'Erreur lors de la suppression',
          });
        }
      } catch (error) {
        console.error('Error deleting dossier:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la suppression',
        });
      }
    }
  };

  const pendingCount = (stats.submitted || 0) + (stats.inReview || 0);

  // Get dossier type info
  const getDossierTypeInfo = (type) => {
    return dossierTypes[type] || {
      label: type || "Non défini",
      shortLabel: type || "N/A",
      icon: FolderOpen,
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      borderColor: "border-gray-400",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Guichet Unique - Tous les Dossiers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Vue d'ensemble de tous les dossiers d'investissement
          </p>
        </div>
        <Link
          href="/guichet-unique/dossiers/new"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Dossier
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stats.draft}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Brouillons</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.submitted}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Soumis</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inReview}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">En examen</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Approuvés</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rejetés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par référence, investisseur ou projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Type Filter - Types principaux uniquement */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Type:</span>
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Tous
            </button>
            {/* Types principaux pour les filtres */}
            {[
              { key: "AGREMENT", config: dossierTypes.AGREMENT },
              { key: "LICENCE", config: dossierTypes.LICENCE },
              { key: "PERMIS", config: dossierTypes.PERMIS },
              { key: "AUTORISATION", config: dossierTypes.AUTORISATION },
            ].map(({ key, config }) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {config.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="SUBMITTED">Soumis</option>
              <option value="IN_REVIEW">En examen</option>
              <option value="PENDING_DOCUMENTS">Documents requis</option>
              <option value="APPROVED">Approuvé</option>
              <option value="REJECTED">Rejeté</option>
            </select>
          </div>

          <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500">Chargement...</span>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Aucun dossier trouvé</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? "Essayez de modifier vos filtres de recherche"
              : "Commencez par créer un nouveau dossier"}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Link
              href="/guichet-unique/dossiers/new"
              className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer un dossier
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dossiers.map((dossier) => {
              const status = statusConfig[dossier.status] || statusConfig.DRAFT;
              const StatusIcon = status.icon;
              const typeInfo = getDossierTypeInfo(dossier.dossierType);
              const TypeIcon = typeInfo.icon;
              const totalSteps = workflowSteps.length;
              // Use currentStep if available, otherwise calculate from status
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
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${typeInfo.borderColor} border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200`}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {dossier.dossierNumber}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
                            {typeInfo.shortLabel}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5 mr-1" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Project Name */}
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {dossier.projectName || "Projet non défini"}
                    </h4>

                    {/* Investor */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{dossier.investorName || "Non spécifié"}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{dossier.projectProvince || "Province non spécifiée"}</span>
                    </div>

                    {/* Ministry */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Landmark className="w-4 h-4 mr-2 text-indigo-500" />
                      <span className="truncate">
                        {dossier.ministry?.shortName || dossier.ministry?.name || "Non assigné"}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatAmount(dossier.investmentAmount, dossier.currency)}
                      </span>
                    </div>

                    {/* Sectors */}
                    {dossier.sectors && dossier.sectors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dossier.sectors.slice(0, 2).map((sector) => (
                          <span
                            key={sector.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            {sector.name}
                          </span>
                        ))}
                        {dossier.sectors.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-500">
                            +{dossier.sectors.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Progression
                        </span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {currentStepName}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            dossier.status === 'REJECTED'
                              ? 'bg-red-500'
                              : dossier.status === 'APPROVED' || dossier.status === 'COMPLETED'
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {/* Progress Steps - Dynamic */}
                      <div className="flex justify-between mt-1">
                        {workflowSteps.map((step) => {
                          const stepProgress = (step.stepNumber / totalSteps) * 100;
                          const isCompleted = dossier.currentStep >= step.stepNumber ||
                            (dossier.status === 'APPROVED' || dossier.status === 'COMPLETED');
                          const isCurrent = dossier.currentStep === step.stepNumber;
                          return (
                            <div
                              key={step.id}
                              className={`w-2 h-2 rounded-full transition-all ${
                                isCompleted
                                  ? dossier.status === 'REJECTED' ? 'bg-red-500' : 'bg-blue-500'
                                  : isCurrent
                                    ? 'bg-blue-300 ring-2 ring-blue-500 ring-offset-1'
                                    : 'bg-gray-200 dark:bg-gray-600'
                              }`}
                              title={`${step.name}${step.responsibleRole ? ` - ${step.responsibleRole}` : ''}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(dossier.submittedAt || dossier.createdAt)}
                      </div>
                      {dossier.status !== 'DRAFT' && dossier.status !== 'APPROVED' && dossier.status !== 'REJECTED' && (
                        <span className={`text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {daysSinceSubmission} jour{daysSinceSubmission > 1 ? 's' : ''}
                          {isUrgent && ' ⚠️'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/guichet-unique/dossiers/${dossier.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/guichet-unique/dossiers/${dossier.id}/edit`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
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
                    <Link
                      href={`/guichet-unique/dossiers/${dossier.id}`}
                      className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de <span className="font-medium">{dossiers.length}</span> sur{" "}
              <span className="font-medium">{pagination.total}</span> dossiers
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === page
                        ? "bg-blue-600 text-white"
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
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
