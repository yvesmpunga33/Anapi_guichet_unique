"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileCheck,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  User,
  Star,
  Target,
  Percent,
  Hash,
  ExternalLink,
} from "lucide-react";
import { BidGetById, BidDelete } from "@/app/services/admin/Procurement.service";

const statusColors = {
  RECEIVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  TECHNICALLY_COMPLIANT: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  TECHNICALLY_NON_COMPLIANT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  FINANCIALLY_EVALUATED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  SHORTLISTED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  AWARDED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  WITHDRAWN: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const statusLabels = {
  RECEIVED: "Reçue",
  UNDER_REVIEW: "En cours d'examen",
  TECHNICALLY_COMPLIANT: "Conforme techniquement",
  TECHNICALLY_NON_COMPLIANT: "Non conforme techniquement",
  FINANCIALLY_EVALUATED: "Évaluée financièrement",
  SHORTLISTED: "Présélectionnée",
  AWARDED: "Attribuée",
  REJECTED: "Rejetée",
  WITHDRAWN: "Retirée",
};

const statusIcons = {
  RECEIVED: Clock,
  UNDER_REVIEW: FileText,
  TECHNICALLY_COMPLIANT: CheckCircle,
  TECHNICALLY_NON_COMPLIANT: XCircle,
  FINANCIALLY_EVALUATED: DollarSign,
  SHORTLISTED: Award,
  AWARDED: Award,
  REJECTED: XCircle,
  WITHDRAWN: XCircle,
};

export default function BidDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const response = await BidGetById(params.id);
        const data = response.data;

        if (data.success) {
          setBid(data.data);
        } else {
          setError(data.error || "Soumission non trouvée");
        }
      } catch (err) {
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBid();
    }
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await BidDelete(params.id);
      const data = response.data;

      if (data.success) {
        router.push("/procurement/bids");
      } else {
        alert(data.error);
        setShowDeleteModal(false);
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "—";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Erreur</h3>
            <p>{error}</p>
          </div>
        </div>
        <Link
          href="/procurement/bids"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux soumissions
        </Link>
      </div>
    );
  }

  if (!bid) return null;

  const StatusIcon = statusIcons[bid.status] || FileCheck;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/procurement/bids"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {bid.reference}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${statusColors[bid.status]}`}>
                <StatusIcon className="w-4 h-4" />
                {statusLabels[bid.status] || bid.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Soumission du {formatDate(bid.submissionDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/procurement/bids/${params.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Modifier
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Offre financière
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <div className="text-sm text-green-600 dark:text-green-400 mb-1">Montant proposé</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(bid.financialOffer, bid.currency)}
                </div>
              </div>

              {bid.technicalScore !== null && bid.technicalScore !== undefined && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Score technique</div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {bid.technicalScore}%
                  </div>
                </div>
              )}

              {bid.financialScore !== null && bid.financialScore !== undefined && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Score financier</div>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {bid.financialScore}%
                  </div>
                </div>
              )}

              {bid.totalScore !== null && bid.totalScore !== undefined && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                  <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Score total</div>
                  <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                    {bid.totalScore}%
                  </div>
                </div>
              )}
            </div>

            {bid.rank && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">Classement:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    {bid.rank}{bid.rank === 1 ? "er" : "ème"} position
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tender Information */}
          {bid.tender && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Appel d'offres associé
              </h2>

              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-1">
                      {bid.tender.reference}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {bid.tender.title}
                    </h3>
                    {bid.tender.objective && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {bid.tender.objective}
                      </p>
                    )}

                    {bid.lot && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Lot {bid.lot.lotNumber}: {bid.lot.title || "Sans titre"}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/procurement/tenders/${bid.tender.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Voir l'appel d'offres"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Technical Evaluation */}
          {(bid.technicalEvaluation || bid.technicalComments) && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Évaluation technique
              </h2>

              {bid.technicalComments && (
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Commentaires</div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {bid.technicalComments}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {bid.notes && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notes internes
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {bid.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bidder Information */}
          {bid.bidder && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Soumissionnaire
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {bid.bidder.companyName}
                    </h3>
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {bid.bidder.code}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {bid.bidder.rccm && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Hash className="w-4 h-4" />
                      <span>RCCM: {bid.bidder.rccm}</span>
                    </div>
                  )}
                  {bid.bidder.nif && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Hash className="w-4 h-4" />
                      <span>NIF: {bid.bidder.nif}</span>
                    </div>
                  )}
                  {bid.bidder.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{bid.bidder.email}</span>
                    </div>
                  )}
                  {bid.bidder.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{bid.bidder.phone}</span>
                    </div>
                  )}
                  {bid.bidder.address && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{bid.bidder.address}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/procurement/bidders/${bid.bidder.id}`}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir le profil complet
                </Link>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Dates
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date de soumission</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(bid.submissionDate)}
                </span>
              </div>

              {bid.evaluationDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Date d'évaluation</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(bid.evaluationDate)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Créée le</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(bid.createdAt)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Dernière modification</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(bid.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Validity */}
          {bid.validityPeriod && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Validité de l'offre
              </h2>

              <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {bid.validityPeriod}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">jours</div>
              </div>
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
              Êtes-vous sûr de vouloir supprimer la soumission <strong>{bid.reference}</strong> ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
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
