"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  FileText,
  Briefcase,
  Users,
  History,
  AlertCircle,
  Loader2,
  RefreshCw,
  Factory,
  ArrowUpRight,
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500", icon: Clock },
  SUBMITTED: { label: "Soumis", color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-500", icon: Clock },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-500", icon: AlertCircle },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700", bgColor: "bg-green-500", icon: CheckCircle2 },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700", bgColor: "bg-red-500", icon: XCircle },
  IN_PROGRESS: { label: "En cours", color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-500", icon: TrendingUp },
  COMPLETED: { label: "Termine", color: "bg-emerald-100 text-emerald-700", bgColor: "bg-emerald-500", icon: CheckCircle2 },
  CANCELLED: { label: "Annule", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500", icon: XCircle },
};

const sectorIcons = {
  "Mines": Factory,
  "Agriculture": TrendingUp,
  "Technologies": Building2,
  "Tourisme": MapPin,
  "Industrie": Factory,
  "Services": Briefcase,
  "Energie": TrendingUp,
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if edit mode is requested via URL parameter
  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  // Fetch project data
  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/investments/projects/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Projet non trouve");
        }
        throw new Error("Erreur lors du chargement du projet");
      }

      const data = await response.json();
      setProject(data);
      setEditedProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch(`/api/investments/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProject),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      const updatedProject = await response.json();
      setProject(updatedProject);
      setEditedProject(updatedProject);
      setIsEditing(false);

      // Remove edit param from URL
      router.replace(`/investments/projects/${params.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProject(project);
    setIsEditing(false);
    // Remove edit param from URL
    router.replace(`/investments/projects/${params.id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/investments/projects/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      router.push("/investments/projects");
    } catch (err) {
      alert(err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Chargement du projet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{error}</h2>
        <p className="text-gray-500 mt-2">Une erreur s'est produite lors du chargement des donnees.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={fetchProject}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reessayer
          </button>
          <Link
            href="/investments/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour a la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projet non trouve</h2>
        <p className="text-gray-500 mt-2">Le projet demande n'existe pas ou a ete supprime.</p>
        <Link href="/investments/projects" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const status = statusConfig[project.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;
  const SectorIcon = sectorIcons[project.sector] || Factory;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/investments/projects"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${status.color.split(' ')[0]} rounded-xl flex items-center justify-center`}>
              <SectorIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.projectName}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-500 dark:text-gray-400">{project.projectCode}</p>
                {project.sector && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                      {project.sector}
                    </span>
                  </>
                )}
                {project.subSector && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{project.subSector}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2 inline" />
                )}
                Enregistrer
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2 inline" />
                Modifier
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 border border-red-200 dark:border-red-800 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar (if applicable) */}
      {project.progress > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression du projet</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                project.progress === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatAmount(project.amount, project.currency)}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois directs</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {(project.jobsCreated || 0).toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois indirects</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {(project.jobsIndirect || 0).toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date de debut</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {formatDate(project.startDate)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {[
            { id: "overview", label: "Informations", icon: Briefcase },
            { id: "investor", label: "Investisseur", icon: Building2 },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "history", label: "Historique", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details du Projet</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du projet</label>
                  <input
                    type="text"
                    value={editedProject.projectName || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, projectName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={editedProject.description || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secteur</label>
                    <input
                      type="text"
                      value={editedProject.sector || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, sector: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sous-secteur</label>
                    <input
                      type="text"
                      value={editedProject.subSector || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, subSector: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                  <select
                    value={editedProject.status || "DRAFT"}
                    onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Progression (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editedProject.progress || 0}
                    onChange={(e) => setEditedProject({ ...editedProject, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {project.description && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Secteur</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.sector || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sous-secteur</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.subSector || "-"}</p>
                  </div>
                </div>
                {project.rejectionReason && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">Motif de rejet</p>
                    <p className="text-red-600 dark:text-red-300 mt-1">{project.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Financial Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Financieres</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant</label>
                    <input
                      type="number"
                      value={editedProject.amount || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Devise</label>
                    <select
                      value={editedProject.currency || "USD"}
                      onChange={(e) => setEditedProject({ ...editedProject, currency: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="CDF">CDF</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emplois directs</label>
                    <input
                      type="number"
                      value={editedProject.jobsCreated || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, jobsCreated: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emplois indirects</label>
                    <input
                      type="number"
                      value={editedProject.jobsIndirect || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, jobsIndirect: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Montant total</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {formatAmount(project.amount, project.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Devise</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.currency || "USD"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emplois directs</p>
                    <p className="text-gray-900 dark:text-white mt-1">{(project.jobsCreated || 0).toLocaleString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emplois indirects</p>
                    <p className="text-gray-900 dark:text-white mt-1">{(project.jobsIndirect || 0).toLocaleString("fr-FR")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Localisation</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
                    <input
                      type="text"
                      value={editedProject.province || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, province: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                    <input
                      type="text"
                      value={editedProject.city || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={editedProject.address || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  {project.province && (
                    <p className="text-gray-900 dark:text-white">
                      {project.city ? `${project.city}, ` : ""}{project.province}
                    </p>
                  )}
                  {project.address && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.address}</p>
                  )}
                  {!project.province && !project.city && !project.address && (
                    <p className="text-gray-500 dark:text-gray-400 italic">Localisation non definie</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calendrier</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de debut</label>
                    <input
                      type="date"
                      value={editedProject.startDate ? editedProject.startDate.split('T')[0] : ""}
                      onChange={(e) => setEditedProject({ ...editedProject, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin prevue</label>
                    <input
                      type="date"
                      value={editedProject.endDate ? editedProject.endDate.split('T')[0] : ""}
                      onChange={(e) => setEditedProject({ ...editedProject, endDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de debut</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de fin prevue</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(project.endDate)}</p>
                  </div>
                </div>
                {project.approvalDate && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date d'approbation</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(project.approvalDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "investor" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Investisseur
            </h3>
          </div>
          {project.investor ? (
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.investor.name}
                    </h4>
                    {project.investor.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{project.investor.investorCode}</p>
                  <div className="flex items-center gap-4 mt-4">
                    {project.investor.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        {project.investor.email}
                      </div>
                    )}
                    {project.investor.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4" />
                        {project.investor.phone}
                      </div>
                    )}
                  </div>
                  {(project.investor.country || project.investor.province) && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {[project.investor.city, project.investor.province, project.investor.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                <Link
                  href={`/investments/investors/${project.investor.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir le profil
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun investisseur associe</p>
              <p className="text-sm text-gray-400 mt-1">Ce projet n'est pas encore lie a un investisseur</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Documents
            </h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Ajouter un document
            </button>
          </div>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun document</p>
            <p className="text-sm text-gray-400 mt-1">Les documents seront affiches ici</p>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Historique
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Projet cree</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(project.createdAt)}</p>
                </div>
              </div>
              {project.approvalDate && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Projet approuve</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(project.approvalDate)}</p>
                  </div>
                </div>
              )}
              {project.rejectionDate && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Projet rejete</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(project.rejectionDate)}</p>
                    {project.rejectionReason && (
                      <p className="text-sm text-red-500 mt-1">Motif: {project.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}
              {project.updatedAt !== project.createdAt && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Derniere modification</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(project.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Supprimer ce projet ?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Cette action est irreversible. Toutes les donnees associees seront egalement supprimees.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : null}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
