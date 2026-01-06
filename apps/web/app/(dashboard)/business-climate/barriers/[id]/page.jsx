"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  History,
  Send,
  X,
  Users,
  PhoneCall,
  TrendingUp,
} from "lucide-react";

const priorityConfig = {
  CRITICAL: { label: "Critique", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  HIGH: { label: "Élevé", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  MEDIUM: { label: "Moyen", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  LOW: { label: "Faible", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
};

const statusConfig = {
  REPORTED: { label: "Signalé", color: "text-gray-700 dark:text-gray-200", bg: "bg-gray-100 dark:bg-gray-700", icon: AlertCircle },
  ACKNOWLEDGED: { label: "Accusé réception", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: CheckCircle2 },
  UNDER_ANALYSIS: { label: "En analyse", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", icon: FileText },
  IN_PROGRESS: { label: "En cours", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Clock },
  ESCALATED: { label: "Escaladé", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertTriangle },
  RESOLVED: { label: "Résolu", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  CLOSED: { label: "Fermé", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-700", icon: CheckCircle2 },
  REJECTED: { label: "Rejeté", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertCircle },
};

const categoryLabels = {
  ADMINISTRATIVE: "Administratif",
  FISCAL: "Fiscal",
  REGULATORY: "Réglementaire",
  LAND: "Foncier",
  CUSTOMS: "Douanier",
  LABOR: "Travail",
  INFRASTRUCTURE: "Infrastructure",
  FINANCIAL: "Financier",
  CORRUPTION: "Corruption",
  OTHER: "Autre",
};

const actionTypes = [
  { value: "STATUS_CHANGE", label: "Changement de statut", icon: TrendingUp },
  { value: "CONTACT_ADMIN", label: "Contact administration", icon: PhoneCall },
  { value: "MEETING", label: "Réunion", icon: Users },
  { value: "DOCUMENT_REQUEST", label: "Demande de document", icon: FileText },
  { value: "ESCALATION", label: "Escalade", icon: AlertTriangle },
  { value: "FOLLOW_UP", label: "Suivi", icon: Clock },
];

export default function BarrierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setPageTitle } = usePageTitle();
  const [barrier, setBarrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Action form
  const [actionForm, setActionForm] = useState({
    actionType: "CONTACT_ADMIN",
    description: "",
    newStatus: "",
    contactName: "",
    contactOrganization: "",
    contactEmail: "",
    followUpDate: "",
    isInternal: false,
  });

  // Comment form
  const [commentText, setCommentText] = useState("");

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    if (params.id) {
      fetchBarrier();
    }
  }, [params.id]);

  // Set page title in header
  useEffect(() => {
    if (barrier) {
      document.title = `${barrier.title} | Obstacles | ANAPI`;
      setPageTitle(barrier.title);
    }
    return () => setPageTitle(null);
  }, [barrier, setPageTitle]);

  const fetchBarrier = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business-climate/barriers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBarrier(data);
      } else if (response.status === 404) {
        setError("Obstacle non trouvé");
      } else {
        setError("Erreur lors du chargement");
      }
    } catch (err) {
      console.error("Error fetching barrier:", err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!actionForm.description.trim()) {
      alert("Veuillez entrer une description");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/business-climate/barriers/${params.id}/resolutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionForm),
      });

      if (response.ok) {
        setShowActionModal(false);
        setActionForm({
          actionType: "CONTACT_ADMIN",
          description: "",
          newStatus: "",
          contactName: "",
          contactOrganization: "",
          contactEmail: "",
          followUpDate: "",
          isInternal: false,
        });
        showNotification("Action ajoutée avec succès", "success");
        fetchBarrier(); // Refresh data
      } else {
        const data = await response.json();
        showNotification(data.error || "Erreur lors de l'ajout de l'action", "error");
      }
    } catch (err) {
      console.error("Error adding action:", err);
      showNotification("Erreur de connexion", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert("Veuillez entrer un commentaire");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/business-climate/barriers/${params.id}/resolutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "COMMENT",
          description: commentText,
          isInternal: true,
        }),
      });

      if (response.ok) {
        setShowCommentModal(false);
        setCommentText("");
        showNotification("Commentaire ajouté avec succès", "success");
        fetchBarrier(); // Refresh data
      } else {
        const data = await response.json();
        showNotification(data.error || "Erreur lors de l'ajout du commentaire", "error");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      showNotification("Erreur de connexion", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{error}</h2>
        <Link
          href="/business-climate/barriers"
          className="text-red-600 hover:underline"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  if (!barrier) return null;

  const priorityConf = priorityConfig[barrier.severity] || priorityConfig.MEDIUM;
  const statusConf = statusConfig[barrier.status] || statusConfig.REPORTED;
  const StatusIcon = statusConf.icon;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-900/90 border border-green-200 dark:border-green-700"
              : "bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-700"
          }`}>
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <p className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification({ show: false, message: "", type: "success" })}
              className={`ml-2 p-1 rounded-full hover:bg-opacity-20 ${
                notification.type === "success"
                  ? "text-green-600 dark:text-green-400 hover:bg-green-600"
                  : "text-red-600 dark:text-red-400 hover:bg-red-600"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fiche de suivi - Obstacle
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Direction du Climat des Affaires • Gestion des obstacles à l'investissement
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/barriers"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          ← Retour à la liste des obstacles
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${priorityConf.bg}`}>
              <AlertTriangle className={`w-8 h-8 ${priorityConf.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{barrier.reference}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${priorityConf.bg} ${priorityConf.color}`}>
                  {priorityConf.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {barrier.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConf.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Signalé le {formatDate(barrier.reportedAt)}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/business-climate/barriers/${params.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-white"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {barrier.description}
            </p>
          </div>

          {/* Investor & Project */}
          {(barrier.investor || barrier.project) && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                Investisseur concerné
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barrier.investor && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Investisseur</p>
                    <p className="font-medium text-gray-900 dark:text-white">{barrier.investor.name}</p>
                    {barrier.investor.country && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{barrier.investor.country}</p>
                    )}
                  </div>
                )}
                {barrier.project && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Projet</p>
                    <p className="font-medium text-gray-900 dark:text-white">{barrier.project.projectName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{barrier.project.projectCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Administration concernée */}
          {(barrier.concernedAdministration || barrier.reporterName) && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                Administration & Contact
              </h2>
              <div className="space-y-4">
                {barrier.concernedAdministration && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Administration concernée</p>
                    <p className="font-medium text-gray-900 dark:text-white">{barrier.concernedAdministration}</p>
                  </div>
                )}
                {barrier.reporterName && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">{barrier.reporterName}</span>
                    </div>
                    {barrier.reporterEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <a href={`mailto:${barrier.reporterEmail}`} className="text-red-600 dark:text-red-400 hover:underline">
                          {barrier.reporterEmail}
                        </a>
                      </div>
                    )}
                    {barrier.reporterPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-300">{barrier.reporterPhone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resolution History */}
          {barrier.resolutions && barrier.resolutions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-red-600" />
                Historique des actions
              </h2>
              <div className="space-y-4">
                {barrier.resolutions.map((resolution, index) => (
                  <div key={resolution.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      {index < barrier.resolutions.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-600 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {resolution.actionType === "STATUS_CHANGE" && "Changement de statut"}
                          {resolution.actionType === "COMMENT" && "Commentaire"}
                          {resolution.actionType === "ASSIGNMENT" && "Assignation"}
                          {resolution.actionType === "MEETING" && "Réunion"}
                          {resolution.actionType === "ESCALATION" && "Escalade"}
                          {resolution.actionType === "RESOLUTION" && "Résolution"}
                        </span>
                        {resolution.newStatus && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            → {statusConfig[resolution.newStatus]?.label || resolution.newStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{resolution.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(resolution.actionDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Informations</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Catégorie</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {categoryLabels[barrier.category] || barrier.category}
                  </p>
                </div>
              </div>

              {barrier.sector && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Secteur</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{barrier.sector}</p>
                  </div>
                </div>
              )}

              {barrier.province && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Province</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{barrier.province}</p>
                  </div>
                </div>
              )}

              {barrier.estimatedImpact && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Impact estimé</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(barrier.estimatedImpact)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Délai objectif</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {barrier.targetResolutionDays || 30} jours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent assigné */}
          {barrier.assignedAgent && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Agent assigné</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{barrier.assignedAgent.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{barrier.assignedAgent.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes internes */}
          {barrier.internalNotes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-6">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notes internes
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">{barrier.internalNotes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowActionModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Ajouter une action
              </button>
              <button
                onClick={() => setShowCommentModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <MessageSquare className="w-4 h-4" />
                Ajouter un commentaire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter une action</h2>
              <button
                onClick={() => setShowActionModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitAction} className="p-6 space-y-4">
              {/* Action Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'action *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {actionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setActionForm({ ...actionForm, actionType: type.value })}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-colors text-left ${
                          actionForm.actionType === type.value
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* New Status (for STATUS_CHANGE) */}
              {actionForm.actionType === "STATUS_CHANGE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nouveau statut *
                  </label>
                  <select
                    value={actionForm.newStatus}
                    onChange={(e) => setActionForm({ ...actionForm, newStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Sélectionner un statut</option>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Contact Info (for CONTACT_ADMIN) */}
              {actionForm.actionType === "CONTACT_ADMIN" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du contact
                    </label>
                    <input
                      type="text"
                      value={actionForm.contactName}
                      onChange={(e) => setActionForm({ ...actionForm, contactName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      placeholder="Nom de la personne contactée"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organisation
                    </label>
                    <input
                      type="text"
                      value={actionForm.contactOrganization}
                      onChange={(e) => setActionForm({ ...actionForm, contactOrganization: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      placeholder="Administration ou organisation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email du contact
                    </label>
                    <input
                      type="email"
                      value={actionForm.contactEmail}
                      onChange={(e) => setActionForm({ ...actionForm, contactEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      placeholder="email@exemple.com"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={actionForm.description}
                  onChange={(e) => setActionForm({ ...actionForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Décrivez l'action effectuée..."
                  required
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de suivi prévue
                </label>
                <input
                  type="date"
                  value={actionForm.followUpDate}
                  onChange={(e) => setActionForm({ ...actionForm, followUpDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Internal checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isInternal"
                  checked={actionForm.isInternal}
                  onChange={(e) => setActionForm({ ...actionForm, isInternal: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isInternal" className="text-sm text-gray-600 dark:text-gray-400">
                  Note interne (non visible par l'investisseur)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter un commentaire</h2>
              <button
                onClick={() => setShowCommentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitComment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commentaire *
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Ajoutez votre commentaire..."
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ce commentaire sera visible uniquement par les agents ANAPI.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCommentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
