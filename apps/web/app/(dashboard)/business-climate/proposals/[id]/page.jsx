"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";
import {
  Megaphone,
  ArrowLeft,
  Loader2,
  Clock,
  FileText,
  Target,
  User,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Edit,
  Trash2,
  Send,
  Scale,
  AlertTriangle,
  ExternalLink,
  Printer,
} from "lucide-react";

import { exportProposalToPDF } from "@/app/utils/pdfExport";
import { ProposalGetById, ProposalDelete } from "@/app/services/admin/BusinessClimate.service";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600", icon: Clock },
  SUBMITTED: { label: "Soumis", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: Send },
  UNDER_REVIEW: { label: "En examen", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Clock },
  APPROVED: { label: "Approuvé", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  FORWARDED: { label: "Transmis", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", icon: Send },
  UNDER_DISCUSSION: { label: "En discussion", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", icon: Clock },
  ADOPTED: { label: "Adopté", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  REJECTED: { label: "Rejeté", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertCircle },
  WITHDRAWN: { label: "Retiré", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700", icon: AlertCircle },
  ARCHIVED: { label: "Archivé", color: "text-gray-500 dark:text-gray-500", bg: "bg-gray-100 dark:bg-gray-700", icon: FileText },
};

const proposalTypeLabels = {
  LAW: "Projet de loi",
  DECREE: "Projet de décret",
  ORDER: "Projet d'arrêté",
  CIRCULAR: "Projet de circulaire",
  REGULATION: "Projet de règlement",
  AMENDMENT: "Amendement",
  RECOMMENDATION: "Recommandation",
  OPINION: "Avis motivé",
  OTHER: "Autre",
};

const domainLabels = {
  INVESTMENT_CODE: "Code des investissements",
  TAX: "Fiscalité",
  CUSTOMS: "Douanes",
  LABOR: "Droit du travail",
  LAND: "Foncier",
  ENVIRONMENT: "Environnement",
  TRADE: "Commerce",
  MINING: "Mines",
  AGRICULTURE: "Agriculture",
  FINANCE: "Finance",
  BUSINESS_CREATION: "Création d'entreprise",
  OTHER: "Autre",
};

const priorityConfig = {
  LOW: { label: "Faible", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  MEDIUM: { label: "Moyen", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  HIGH: { label: "Élevé", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  URGENT: { label: "Urgent", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
};

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setPageTitle } = usePageTitle();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProposal();
    }
  }, [params.id]);

  // Set page title in header
  useEffect(() => {
    if (proposal) {
      document.title = `${proposal.title} | Propositions | ANAPI`;
      setPageTitle(proposal.title);
    }
    return () => setPageTitle(null);
  }, [proposal, setPageTitle]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Supprimer la proposition",
      text: `Êtes-vous sûr de vouloir supprimer la proposition ${proposal?.reference} ?`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/business-climate/proposals/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Proposition supprimée",
          text: "La proposition a été supprimée avec succès",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/business-climate/proposals");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorData.error || "Erreur lors de la suppression",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      console.error("Error deleting proposal:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la suppression",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setDeleting(false);
    }
  };

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await ProposalGetById(params.id);
      const data = response.data?.data || response.data;
      if (data?.proposal) {
        setProposal(data.proposal);
      } else if (data) {
        setProposal(data);
      } else {
        throw new Error("Proposition non trouvée");
      }
    } catch (err) {
      console.error("Error fetching proposal:", err);
      setError(err.response?.status === 404 ? "Proposition non trouvée" : "Erreur de connexion");
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
            href="/business-climate/proposals"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  const statusConf = statusConfig[proposal.status] || statusConfig.DRAFT;
  const StatusIcon = statusConf.icon;
  const priorityConf = priorityConfig[proposal.priority] || priorityConfig.MEDIUM;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Megaphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Détail de la proposition
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Direction du Climat des Affaires - Propositions légales
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/proposals"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des propositions
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${statusConf.bg}`}>
              <Megaphone className={`w-8 h-8 ${statusConf.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{proposal.reference}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  {proposalTypeLabels[proposal.proposalType] || proposal.proposalType}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {proposal.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConf.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                  {priorityConf.label}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportProposalToPDF(proposal)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-white"
            >
              <Printer className="w-4 h-4" />
              Exporter PDF
            </button>
            <Link
              href={`/business-climate/proposals/${proposal.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            {proposal.status === "DRAFT" && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Résumé
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {proposal.summary || "Aucun résumé"}
            </p>
          </div>

          {/* Justification */}
          {proposal.justification && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                Justification et contexte
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {proposal.justification}
              </p>
            </div>
          )}

          {/* Expected Impact */}
          {proposal.expectedImpact && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Impact attendu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {proposal.expectedImpact}
              </p>
            </div>
          )}

          {/* Full Text */}
          {proposal.fullText && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Texte complet
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-4 rounded-xl font-mono">
                  {proposal.fullText}
                </pre>
              </div>
            </div>
          )}

          {/* Feedback */}
          {proposal.feedback && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Retour / Feedback
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">{proposal.feedback}</p>
              {proposal.feedbackDate && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  Reçu le {formatDate(proposal.feedbackDate)}
                </p>
              )}
            </div>
          )}

          {/* Internal Notes */}
          {proposal.internalNotes && (
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes internes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{proposal.internalNotes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Référence</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{proposal.reference}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConf.label}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</div>
                <div className="text-sm text-gray-900 dark:text-white">
                  {proposalTypeLabels[proposal.proposalType] || proposal.proposalType}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Domaine</div>
                <div className="text-sm text-gray-900 dark:text-white">
                  {domainLabels[proposal.domain] || proposal.domain}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priorité</div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                  {priorityConf.label}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date de création</div>
                <div className="text-sm text-gray-900 dark:text-white">{formatDate(proposal.createdAt)}</div>
              </div>
              {proposal.submittedAt && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date de soumission</div>
                  <div className="text-sm text-gray-900 dark:text-white">{formatDate(proposal.submittedAt)}</div>
                </div>
              )}
              {proposal.adoptedAt && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date d'adoption</div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">{formatDate(proposal.adoptedAt)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Target Authority */}
          {proposal.targetAuthority && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Autorité destinataire
              </h3>
              <div className="text-sm text-gray-900 dark:text-white">{proposal.targetAuthority}</div>
            </div>
          )}

          {/* Related Legal Text */}
          {proposal.relatedText && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Texte juridique lié
              </h3>
              <Link
                href={`/legal/texts/${proposal.relatedText.id}`}
                className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>{proposal.relatedText.reference} - {proposal.relatedText.title}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Created By */}
          {proposal.createdBy && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Créé par</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {proposal.createdBy.firstName} {proposal.createdBy.lastName}
                  </div>
                  {proposal.createdBy.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{proposal.createdBy.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
