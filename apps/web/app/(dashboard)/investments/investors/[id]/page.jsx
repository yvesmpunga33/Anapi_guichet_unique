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
  MessageSquare,
  Send,
  AlertCircle,
  Loader2,
  RefreshCw,
  Upload,
  Download,
  Eye,
  File,
  Image,
  FileIcon,
} from "lucide-react";

// Services
import {
  InvestorGetById,
  InvestorUpdate,
  InvestorDelete,
  InvestorGetDocuments,
  InvestorAddDocument,
  InvestorDeleteDocument
} from "@/app/services/admin/Investor.service";

const investorTypes = {
  company: { label: "Societe", icon: Building2 },
  individual: { label: "Individuel", icon: User },
  organization: { label: "Organisation", icon: Globe },
  government: { label: "Gouvernement", icon: Building2 },
};

const statusConfig = {
  ACTIVE: { label: "Actif", color: "bg-green-100 text-green-700", bgColor: "bg-green-500" },
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-500" },
  SUSPENDED: { label: "Suspendu", color: "bg-red-100 text-red-700", bgColor: "bg-red-500" },
  INACTIVE: { label: "Inactif", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500" },
};

const investmentStatusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700" },
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  UNDER_REVIEW: { label: "En examen", color: "bg-blue-100 text-blue-700" },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700" },
  ACTIVE: { label: "Actif", color: "bg-green-100 text-green-700" },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Termine", color: "bg-purple-100 text-purple-700" },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Annule", color: "bg-red-100 text-red-700" },
};

export default function InvestorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvestor, setEditedInvestor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Document states
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentType, setDocumentType] = useState("autre");
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Check if edit mode is requested via URL parameter
  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  // Fetch investor data
  const fetchInvestor = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await InvestorGetById(params.id);
      // L'API retourne { success: true, data: { investor: {...} } }
      const investorData = response.data?.data?.investor || response.data?.investor || response.data;

      setInvestor(investorData);
      setEditedInvestor(investorData);
    } catch (err) {
      console.error("Error fetching investor:", err);
      if (err.response?.status === 404) {
        setError("Investisseur non trouve");
      } else {
        setError(err.response?.data?.message || err.message || "Erreur lors du chargement de l'investisseur");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchInvestor();
    }
  }, [params.id]);

  // Fetch documents when tab changes to documents
  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await InvestorGetDocuments(params.id);
      const docs = response.data?.data?.documents || response.data?.documents || [];
      setDocuments(docs);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (activeTab === "documents" && params.id) {
      fetchDocuments();
    }
  }, [activeTab, params.id]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert("Veuillez selectionner un fichier");
      return;
    }

    try {
      setUploadingDocument(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", documentName || selectedFile.name);
      formData.append("description", documentDescription);
      formData.append("type", documentType);

      await InvestorAddDocument(params.id, formData);

      // Reset form and close modal
      setSelectedFile(null);
      setDocumentName("");
      setDocumentDescription("");
      setDocumentType("autre");
      setShowUploadModal(false);

      // Refresh documents list
      fetchDocuments();
    } catch (err) {
      console.error("Error uploading document:", err);
      alert(err.response?.data?.message || "Erreur lors de l'upload du document");
    } finally {
      setUploadingDocument(false);
    }
  };

  // Handle document delete
  const handleDeleteDocument = async (documentId) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce document ?")) {
      return;
    }

    try {
      setDeletingDocumentId(documentId);
      await InvestorDeleteDocument(params.id, documentId);
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setDeletingDocumentId(null);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get document icon based on mime type
  const getDocumentIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) return Image;
    if (mimeType === "application/pdf") return FileText;
    return File;
  };

  // Document type labels
  const documentTypeLabels = {
    rccm: "RCCM",
    id_nat: "ID National",
    nif: "NIF",
    statuts: "Statuts",
    contrat: "Contrat",
    autre: "Autre"
  };

  // Get auth token for document preview URLs
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || "";
    }
    return "";
  };

  // Open document preview - fetch with auth and create blob URL
  const openDocumentPreview = async (doc) => {
    setPreviewDocument(doc);
    setLoadingPreview(true);
    setPreviewBlobUrl(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3502";
      const token = getAuthToken();

      const response = await fetch(`${baseUrl}/api/v1/investors/${params.id}/documents/${doc.id}/view`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load document');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPreviewBlobUrl(blobUrl);
    } catch (err) {
      console.error("Error loading preview:", err);
      alert("Erreur lors du chargement de l'apercu");
    } finally {
      setLoadingPreview(false);
    }
  };

  // Close preview and cleanup blob URL
  const closePreview = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewDocument(null);
    setPreviewBlobUrl(null);
  };

  // Download document with authentication
  const downloadDocument = async (doc) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3502";
      const token = getAuthToken();

      const response = await fetch(`${baseUrl}/api/v1/investors/${params.id}/documents/${doc.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.originalName || doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading document:", err);
      alert("Erreur lors du telechargement");
    }
  };

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

      const response = await InvestorUpdate(params.id, editedInvestor);
      // L'API retourne { success: true, data: { investor: {...} } }
      const updatedInvestor = response.data?.data?.investor || response.data?.investor || response.data;

      setInvestor(updatedInvestor);
      setEditedInvestor(updatedInvestor);
      setIsEditing(false);

      // Remove edit param from URL
      router.replace(`/investments/investors/${params.id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedInvestor(investor);
    setIsEditing(false);
    // Remove edit param from URL
    router.replace(`/investments/investors/${params.id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await InvestorDelete(params.id);
      router.push("/investments/investors");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Erreur lors de la suppression");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Chargement de l'investisseur...</p>
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
            onClick={fetchInvestor}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reessayer
          </button>
          <Link
            href="/investments/investors"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour a la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Investisseur non trouve</h2>
        <p className="text-gray-500 mt-2">L'investisseur demande n'existe pas ou a ete supprime.</p>
        <Link href="/investments/investors" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const status = statusConfig[investor.status] || statusConfig.PENDING;
  const typeInfo = investorTypes[investor.type] || investorTypes.company;
  const TypeIcon = typeInfo.icon;

  // Calculate stats from investments
  const stats = investor.stats || {
    totalInvestments: investor.investments?.length || 0,
    totalAmount: investor.investments?.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0) || 0,
    activeProjects: investor.investments?.filter((inv) => inv.status === "ACTIVE" || inv.status === "IN_PROGRESS").length || 0,
    completedProjects: investor.investments?.filter((inv) => inv.status === "COMPLETED").length || 0,
    totalJobsCreated: investor.investments?.reduce((sum, inv) => sum + (inv.jobsCreated || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/investments/investors"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TypeIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {investor.name}
                </h1>
                {investor.isVerified && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-500 dark:text-gray-400">{investor.investorCode}</p>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                  {typeInfo.label}
                </span>
                {investor.category && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{investor.category}</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalInvestments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Investi</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatAmount(stats.totalAmount, "USD")}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Inscrit le</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {formatDate(investor.createdAt)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois crees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalJobsCreated}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {[
            { id: "overview", label: "Informations", icon: User },
            { id: "investments", label: "Investissements", icon: TrendingUp },
            { id: "documents", label: "Documents", icon: FileText },
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
          {/* General Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Generales</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editedInvestor.name || ""}
                    onChange={(e) => setEditedInvestor({ ...editedInvestor, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select
                      value={editedInvestor.type || "company"}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Object.entries(investorTypes).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
                    <input
                      type="text"
                      value={editedInvestor.category || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editedInvestor.description || ""}
                    onChange={(e) => setEditedInvestor({ ...editedInvestor, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                  <select
                    value={editedInvestor.status || "PENDING"}
                    onChange={(e) => setEditedInvestor({ ...editedInvestor, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RCCM</label>
                    <input
                      type="text"
                      value={editedInvestor.rccm || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, rccm: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID National</label>
                    <input
                      type="text"
                      value={editedInvestor.idNat || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, idNat: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NIF</label>
                    <input
                      type="text"
                      value={editedInvestor.nif || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, nif: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {investor.description && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-gray-900 dark:text-white mt-1">{investor.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {investor.rccm && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">RCCM</p>
                      <p className="text-gray-900 dark:text-white mt-1">{investor.rccm}</p>
                    </div>
                  )}
                  {investor.idNat && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID National</p>
                      <p className="text-gray-900 dark:text-white mt-1">{investor.idNat}</p>
                    </div>
                  )}
                  {investor.nif && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">NIF</p>
                      <p className="text-gray-900 dark:text-white mt-1">{investor.nif}</p>
                    </div>
                  )}
                </div>
                {!investor.description && !investor.rccm && !investor.idNat && !investor.nif && (
                  <p className="text-gray-500 dark:text-gray-400 italic">Aucune information supplementaire</p>
                )}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coordonnees</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedInvestor.email || ""}
                    onChange={(e) => setEditedInvestor({ ...editedInvestor, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={editedInvestor.phone || ""}
                    onChange={(e) => setEditedInvestor({ ...editedInvestor, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site web</label>
                  <input
                    type="text"
                    value={editedInvestor.website || ""}
                    onChange={(e) => setEditedInvestor({ ...editedInvestor, website: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                    <input
                      type="text"
                      value={editedInvestor.country || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, country: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
                    <input
                      type="text"
                      value={editedInvestor.province || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, province: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                    <input
                      type="text"
                      value={editedInvestor.city || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={editedInvestor.address || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {investor.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{investor.email}</span>
                  </div>
                )}
                {investor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{investor.phone}</span>
                  </div>
                )}
                {investor.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{investor.website}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white">{investor.country || "RDC"}</p>
                    {investor.province && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {investor.city ? `${investor.city}, ` : ""}{investor.province}
                      </p>
                    )}
                    {investor.address && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{investor.address}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Person */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personne de Contact</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                    <input
                      type="text"
                      value={editedInvestor.contactPerson || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, contactPerson: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fonction</label>
                    <input
                      type="text"
                      value={editedInvestor.contactPosition || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, contactPosition: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={editedInvestor.contactEmail || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telephone</label>
                    <input
                      type="text"
                      value={editedInvestor.contactPhone || ""}
                      onChange={(e) => setEditedInvestor({ ...editedInvestor, contactPhone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : investor.contactPerson ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{investor.contactPerson}</p>
                  {investor.contactPosition && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{investor.contactPosition}</p>
                  )}
                  {investor.contactEmail && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{investor.contactEmail}</p>
                  )}
                  {investor.contactPhone && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{investor.contactPhone}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">Aucune personne de contact</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "investments" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Projets d'Investissement ({investor.investments?.length || 0})
            </h3>
            <Link
              href={`/investments/projects/new?investorId=${investor.id}&investorName=${encodeURIComponent(investor.name)}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Nouveau Projet
            </Link>
          </div>
          {investor.investments && investor.investments.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {investor.investments.map((investment) => {
                const invStatus = investmentStatusConfig[investment.status] || investmentStatusConfig.PENDING;
                return (
                  <Link
                    key={investment.id}
                    href={`/investments/projects/${investment.id}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{investment.projectName}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{investment.projectCode}</span>
                            {investment.sector && (
                              <>
                                <span>•</span>
                                <span>{investment.sector}</span>
                              </>
                            )}
                            {investment.province && (
                              <>
                                <span>•</span>
                                <span>{investment.province}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {formatAmount(investment.amount, investment.currency || "USD")}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${invStatus.color}`}>
                          {invStatus.label}
                        </span>
                      </div>
                    </div>
                    {(investment.jobsCreated > 0 || investment.progress > 0) && (
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {investment.jobsCreated > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {investment.jobsCreated} emplois
                          </span>
                        )}
                        {investment.progress > 0 && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {investment.progress}% progression
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun investissement enregistre</p>
              <Link
                href={`/investments/projects/new?investorId=${investor.id}&investorName=${encodeURIComponent(investor.name)}`}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Briefcase className="w-4 h-4" />
                Creer le premier projet
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Documents ({documents.length})
            </h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Ajouter un document
            </button>
          </div>

          {loadingDocuments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : documents.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {documents.map((doc) => {
                const DocIcon = getDocumentIcon(doc.mimeType);
                return (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <DocIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                              {documentTypeLabels[doc.type] || doc.type}
                            </span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>•</span>
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Preview button - only for images and PDF */}
                        {(doc.mimeType?.startsWith("image/") || doc.mimeType === "application/pdf") && (
                          <button
                            onClick={() => openDocumentPreview(doc)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Visualiser"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Telecharger"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          disabled={deletingDocumentId === doc.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingDocumentId === doc.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun document</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Cliquez sur "Ajouter un document" pour telecharger vos fichiers
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ajouter un document
                </h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setDocumentName("");
                    setDocumentDescription("");
                    setDocumentType("autre");
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fichier *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                  onClick={() => document.getElementById("document-file-input").click()}
                >
                  <input
                    id="document-file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Cliquez pour selectionner un fichier
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        PDF, Images, Word (max 50 MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du document
                </label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Nom du document"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de document
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="rccm">RCCM</option>
                  <option value="id_nat">ID National</option>
                  <option value="nif">NIF</option>
                  <option value="statuts">Statuts</option>
                  <option value="contrat">Contrat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  rows={3}
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Description du document..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setDocumentName("");
                  setDocumentDescription("");
                  setDocumentType("autre");
                }}
                disabled={uploadingDocument}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={!selectedFile || uploadingDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploadingDocument ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Telecharger
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  {previewDocument.mimeType?.startsWith("image/") ? (
                    <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{previewDocument.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {documentTypeLabels[previewDocument.type] || previewDocument.type} • {formatFileSize(previewDocument.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadDocument(previewDocument)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Telecharger"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
              {loadingPreview ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Chargement de l'apercu...</p>
                </div>
              ) : previewBlobUrl ? (
                previewDocument.mimeType?.startsWith("image/") ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <img
                      src={previewBlobUrl}
                      alt={previewDocument.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : previewDocument.mimeType === "application/pdf" ? (
                  <iframe
                    src={previewBlobUrl}
                    className="w-full h-[70vh] rounded-lg border-0"
                    title={previewDocument.name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
                    <File className="w-16 h-16 mb-4" />
                    <p>Apercu non disponible pour ce type de fichier</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-16 h-16 mb-4 text-red-400" />
                  <p>Erreur lors du chargement de l'apercu</p>
                  <button
                    onClick={() => openDocumentPreview(previewDocument)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reessayer
                  </button>
                </div>
              )}
            </div>

            {previewDocument.description && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Description:</span> {previewDocument.description}
                </p>
              </div>
            )}
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
                Supprimer cet investisseur ?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Cette action est irreversible. Toutes les donnees associees seront egalement supprimees.
              </p>
              {investor.investments && investor.investments.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 text-center">
                    Attention: Cet investisseur a {investor.investments.length} investissement(s) associe(s).
                  </p>
                </div>
              )}
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
