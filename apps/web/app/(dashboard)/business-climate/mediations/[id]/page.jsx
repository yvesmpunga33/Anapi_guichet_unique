"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";
import {
  Handshake,
  ArrowLeft,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  DollarSign,
  User,
  CheckCircle2,
  AlertCircle,
  Scale,
  X,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";

const statusConfig = {
  SUBMITTED: { label: "Soumis", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700", icon: Clock },
  ACCEPTED: { label: "Accepté", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: CheckCircle2 },
  REJECTED: { label: "Rejeté", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: X },
  SCHEDULED: { label: "Programmé", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", icon: Calendar },
  IN_MEDIATION: { label: "En médiation", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Scale },
  AGREEMENT_REACHED: { label: "Accord trouvé", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  FAILED: { label: "Échoué", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertCircle },
  CLOSED: { label: "Clôturé", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700", icon: CheckCircle2 },
  REFERRED_COURT: { label: "Renvoyé au tribunal", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", icon: AlertTriangle },
};

const priorityConfig = {
  URGENT: { label: "Urgent", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  HIGH: { label: "Élevé", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  MEDIUM: { label: "Moyen", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  LOW: { label: "Faible", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
};

const disputeTypeLabels = {
  CONTRACT: "Litige contractuel",
  TAX: "Litige fiscal",
  LABOR: "Litige du travail",
  LAND: "Litige foncier",
  PERMIT: "Litige sur permis",
  CUSTOMS: "Litige douanier",
  ADMINISTRATIVE: "Litige administratif",
  COMMERCIAL: "Litige commercial",
  ENVIRONMENTAL: "Litige environnemental",
  OTHER: "Autre",
};

const respondentTypeLabels = {
  MINISTRY: "Ministère",
  AGENCY: "Agence gouvernementale",
  COMPANY: "Entreprise",
  INDIVIDUAL: "Individu",
};

export default function MediationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setPageTitle } = usePageTitle();
  const [mediation, setMediation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    if (params.id) {
      fetchMediation();
    }
  }, [params.id]);

  // Set page title in header
  useEffect(() => {
    if (mediation) {
      document.title = `Médiation: ${mediation.reference} | ANAPI`;
      setPageTitle(`Médiation: ${mediation.reference}`);
    }
    return () => setPageTitle(null);
  }, [mediation, setPageTitle]);

  const fetchMediation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business-climate/mediations/${params.id}`);
      if (!response.ok) {
        throw new Error("Médiation non trouvée");
      }
      const data = await response.json();
      setMediation(data);
    } catch (err) {
      console.error("Error fetching mediation:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency = "USD") => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Erreur
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <Link
            href="/business-climate/mediations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!mediation) return null;

  const statusConf = statusConfig[mediation.status] || statusConfig.SUBMITTED;
  const priorityConf = priorityConfig[mediation.priority] || priorityConfig.MEDIUM;
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
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Handshake className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fiche de médiation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Direction du Climat des Affaires - Gestion des litiges
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/mediations"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des médiations
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${priorityConf.bg}`}>
              <Scale className={`w-8 h-8 ${priorityConf.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{mediation.reference}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${priorityConf.bg} ${priorityConf.color}`}>
                  {priorityConf.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {mediation.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConf.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Soumis le {formatDate(mediation.submittedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Description du litige
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {mediation.description || "Aucune description"}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span>Type: {disputeTypeLabels[mediation.disputeType] || mediation.disputeType}</span>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Parties au litige
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demandeur */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                  Demandeur (Investisseur)
                </h4>
                {mediation.investor ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {mediation.investor.name}
                      </span>
                    </div>
                    {mediation.investor.country && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        {mediation.investor.country}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Non spécifié</p>
                )}

                {mediation.project && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Projet concerné</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {mediation.project.projectCode} - {mediation.project.projectName}
                    </div>
                  </div>
                )}
              </div>

              {/* Défendeur */}
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-3">
                  Défendeur
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {mediation.respondentName || "Non spécifié"}
                    </span>
                  </div>
                  {mediation.respondentType && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Briefcase className="w-4 h-4" />
                      {respondentTypeLabels[mediation.respondentType] || mediation.respondentType}
                    </div>
                  )}
                  {mediation.respondentContact && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      {mediation.respondentContact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Montant en litige */}
          {mediation.disputedAmount && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Montant en litige
              </h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatAmount(mediation.disputedAmount, mediation.currency)}
              </div>
            </div>
          )}

          {/* Notes internes */}
          {mediation.internalNotes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notes internes
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">{mediation.internalNotes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations clés */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Référence</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{mediation.reference}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConf.label}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priorité</div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                  {priorityConf.label}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date de soumission</div>
                <div className="text-sm text-gray-900 dark:text-white">{formatDate(mediation.submittedAt)}</div>
              </div>
              {mediation.firstSessionAt && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Première session</div>
                  <div className="text-sm text-gray-900 dark:text-white">{formatDateTime(mediation.firstSessionAt)}</div>
                </div>
              )}
              {mediation.sessionsCount > 0 && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre de sessions</div>
                  <div className="text-sm text-gray-900 dark:text-white">{mediation.sessionsCount}</div>
                </div>
              )}
            </div>
          </div>

          {/* Médiateur */}
          {mediation.mediator && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Médiateur assigné</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{mediation.mediator.name}</div>
                  {mediation.mediator.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{mediation.mediator.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Obstacle lié */}
          {mediation.barrier && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Obstacle lié</h3>
              <Link
                href={`/business-climate/barriers/${mediation.barrier.id}`}
                className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <div className="text-xs text-red-600 dark:text-red-400">{mediation.barrier.reference}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{mediation.barrier.title}</div>
                </div>
              </Link>
            </div>
          )}

          {/* Résultat */}
          {mediation.outcome && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Résultat
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">{mediation.outcome}</p>
              {mediation.agreementSummary && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400 mb-1">Résumé de l'accord</div>
                  <p className="text-sm text-green-700 dark:text-green-300">{mediation.agreementSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
