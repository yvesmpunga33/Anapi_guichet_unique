"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileSearch,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  Edit,
  Trash2,
  Eye,
  Download,
  Plus,
  Users,
  Target,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MoreVertical,
  Send,
  Award,
  Pause,
  Play,
  ClipboardList,
  Upload,
  History,
  User,
  Percent,
} from "lucide-react";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  PUBLISHED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  OPEN: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CLOSED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  EVALUATION: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  AWARDED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  SUSPENDED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusLabels = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  OPEN: "Ouvert",
  CLOSED: "Clôturé",
  EVALUATION: "Évaluation",
  AWARDED: "Attribué",
  CANCELLED: "Annulé",
  SUSPENDED: "Suspendu",
};

const typeLabels = {
  OPEN: "Appel d'offres ouvert",
  RESTRICTED: "Appel d'offres restreint",
  NEGOTIATED: "Gré à gré",
  DIRECT: "Marché direct",
  FRAMEWORK: "Accord-cadre",
};

const categoryLabels = {
  WORKS: "Travaux",
  SUPPLIES: "Fournitures",
  SERVICES: "Services",
  CONSULTING: "Consultance",
};

const bidStatusColors = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  QUALIFIED: "bg-green-100 text-green-700",
  DISQUALIFIED: "bg-red-100 text-red-700",
  AWARDED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const bidStatusLabels = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  UNDER_REVIEW: "En évaluation",
  QUALIFIED: "Qualifié",
  DISQUALIFIED: "Disqualifié",
  AWARDED: "Attribué",
  REJECTED: "Rejeté",
};

export default function TenderDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const response = await fetch(`/api/procurement/tenders/${id}`);
        const data = await response.json();

        if (data.success) {
          setTender(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Erreur lors du chargement de l'appel d'offres");
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "Non défini";
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/procurement/tenders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setTender((prev) => ({ ...prev, status: newStatus }));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingStatus(false);
      setShowStatusMenu(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/procurement/tenders/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/procurement/tenders");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusActions = () => {
    const actions = [];
    switch (tender?.status) {
      case "DRAFT":
        actions.push({ status: "PUBLISHED", label: "Publier", icon: Send, color: "text-blue-600" });
        actions.push({ status: "CANCELLED", label: "Annuler", icon: XCircle, color: "text-red-600" });
        break;
      case "PUBLISHED":
        actions.push({ status: "OPEN", label: "Ouvrir aux soumissions", icon: Play, color: "text-green-600" });
        actions.push({ status: "SUSPENDED", label: "Suspendre", icon: Pause, color: "text-orange-600" });
        actions.push({ status: "CANCELLED", label: "Annuler", icon: XCircle, color: "text-red-600" });
        break;
      case "OPEN":
        actions.push({ status: "CLOSED", label: "Clôturer", icon: Clock, color: "text-yellow-600" });
        actions.push({ status: "SUSPENDED", label: "Suspendre", icon: Pause, color: "text-orange-600" });
        break;
      case "CLOSED":
        actions.push({ status: "EVALUATION", label: "Démarrer évaluation", icon: ClipboardList, color: "text-purple-600" });
        break;
      case "EVALUATION":
        actions.push({ status: "AWARDED", label: "Attribuer le marché", icon: Award, color: "text-emerald-600" });
        break;
      case "SUSPENDED":
        actions.push({ status: "OPEN", label: "Reprendre", icon: Play, color: "text-green-600" });
        actions.push({ status: "CANCELLED", label: "Annuler", icon: XCircle, color: "text-red-600" });
        break;
    }
    return actions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
        <Link
          href="/procurement/tenders"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Appel d'offres non trouvé</p>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(tender.submissionDeadline);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Link
              href="/procurement/tenders"
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {tender.reference}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[tender.status]}`}>
                  {statusLabels[tender.status]}
                </span>
                {tender.category && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {categoryLabels[tender.category]}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {tender.title}
              </h1>

              {tender.ministry && (
                <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {tender.ministry.name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status change button */}
            {getStatusActions().length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MoreVertical className="w-4 h-4" />
                  )}
                  Actions
                </button>

                {showStatusMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-10">
                    {getStatusActions().map((action) => (
                      <button
                        key={action.status}
                        onClick={() => handleStatusChange(action.status)}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 ${action.color}`}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link
              href={`/procurement/tenders/${id}/edit`}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(tender.estimatedBudget, tender.currency)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Budget estimé</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {tender.lots?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Lots</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {tender.bids?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Soumissions</div>
          </div>

          <div className="text-center">
            {daysRemaining !== null && daysRemaining > 0 ? (
              <>
                <div className={`text-2xl font-bold ${daysRemaining <= 7 ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                  {daysRemaining}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Jours restants</div>
              </>
            ) : tender.status === "CLOSED" || tender.status === "EVALUATION" || tender.status === "AWARDED" ? (
              <>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">—</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Clôturé</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">Expiré</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Date limite</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex space-x-1 p-1">
            {[
              { id: "overview", label: "Aperçu", icon: FileSearch },
              { id: "lots", label: "Lots", icon: Target },
              { id: "bids", label: "Soumissions", icon: ClipboardList },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "history", label: "Historique", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "bids" && tender.bids?.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {tender.bids.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Objectif</h3>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {tender.objective || "Non spécifié"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type de marché</h3>
                    <p className="text-gray-900 dark:text-white">{typeLabels[tender.type]}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Catégorie</h3>
                    <p className="text-gray-900 dark:text-white">{categoryLabels[tender.category]}</p>
                  </div>
                </div>

                {tender.terms && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Conditions</h3>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{tender.terms}</p>
                  </div>
                )}
              </div>

              {/* Dates & Criteria */}
              <div className="space-y-6">
                {/* Dates */}
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Dates importantes
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Publication</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(tender.publicationDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date limite soumission</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDateTime(tender.submissionDeadline)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ouverture des plis</span>
                      <span className="text-gray-900 dark:text-white">{formatDateTime(tender.openingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Période d'évaluation</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(tender.evaluationStartDate)} - {formatDate(tender.evaluationEndDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evaluation criteria */}
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-purple-600" />
                    Critères d'évaluation
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Pondération technique</span>
                        <span className="text-blue-600 font-medium">{tender.technicalWeight}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${tender.technicalWeight}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Pondération financière</span>
                        <span className="text-green-600 font-medium">{tender.financialWeight}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${tender.financialWeight}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Score technique minimum</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {tender.minimumTechnicalScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financing */}
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Financement
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Source</span>
                      <span className="text-gray-900 dark:text-white">
                        {tender.source === "NATIONAL" ? "Budget national" :
                         tender.source === "INTERNATIONAL" ? "Financement international" : "Mixte"}
                      </span>
                    </div>
                    {tender.financingSource && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bailleur</span>
                        <span className="text-gray-900 dark:text-white">{tender.financingSource}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lots Tab */}
          {activeTab === "lots" && (
            <div>
              {tender.lots?.length > 0 ? (
                <div className="space-y-4">
                  {tender.lots.map((lot) => (
                    <div
                      key={lot.id}
                      className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Lot #{lot.lotNumber}: {lot.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lot.status === "AWARDED" ? "bg-emerald-100 text-emerald-700" :
                          lot.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {lot.status || "Actif"}
                        </span>
                      </div>
                      {lot.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {lot.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Montant estimé:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(lot.estimatedAmount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantité:</span>{" "}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {lot.quantity} {lot.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Cet appel d'offres n'est pas divisé en lots
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bids Tab */}
          {activeTab === "bids" && (
            <div>
              {tender.bids?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Soumissionnaire
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Référence
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Offre financière
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Score total
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Rang
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Statut
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tender.bids.map((bid) => (
                        <tr
                          key={bid.id}
                          className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {bid.bidder?.companyName || "—"}
                                </p>
                                <p className="text-xs text-gray-500">{bid.bidder?.rccm}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                              {bid.reference}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {formatCurrency(bid.financialOffer)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {bid.totalScore ? (
                              <span className="font-medium text-gray-900 dark:text-white">
                                {bid.totalScore.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {bid.ranking ? (
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                bid.ranking === 1 ? "bg-yellow-100 text-yellow-700" :
                                bid.ranking === 2 ? "bg-gray-200 text-gray-700" :
                                bid.ranking === 3 ? "bg-orange-100 text-orange-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {bid.ranking}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${bidStatusColors[bid.status]}`}>
                              {bidStatusLabels[bid.status]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/procurement/bids/${bid.id}`}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucune soumission reçue
                  </p>
                  <Link
                    href={`/procurement/bids/new?tenderId=${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Enregistrer une soumission
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              {tender.documents?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tender.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">{doc.category}</p>
                      </div>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun document attaché
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Upload className="w-4 h-4" />
                    Ajouter un document
                  </button>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div>
              {tender.history?.length > 0 ? (
                <div className="space-y-4">
                  {tender.history.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        {index < tender.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-slate-700 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {entry.action}
                        </p>
                        {entry.changes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {entry.changes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{entry.user?.name || "Système"}</span>
                          <span>•</span>
                          <span>{formatDateTime(entry.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucun historique disponible
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer l'appel d'offres <strong>{tender.reference}</strong> ?
              Toutes les données associées (lots, soumissions, documents) seront également supprimées.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
