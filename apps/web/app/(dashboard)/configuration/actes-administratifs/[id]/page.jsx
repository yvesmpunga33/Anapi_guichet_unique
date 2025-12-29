"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  FileText,
  Clock,
  DollarSign,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  RefreshCw,
  Download,
  ExternalLink,
  Shield,
  Briefcase,
  Info,
} from "lucide-react";

const categoryConfig = {
  LICENCE: { label: "Licence", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: FileText },
  PERMIS: { label: "Permis", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Shield },
  AUTORISATION: { label: "Autorisation", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: CheckCircle2 },
  AGREMENT: { label: "Agrément", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: FileCheck },
  CERTIFICAT: { label: "Certificat", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200", icon: FileText },
  ATTESTATION: { label: "Attestation", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", icon: FileText },
};

const piecesCategoryConfig = {
  IDENTITE: { label: "Pièces d'identité", color: "text-blue-600" },
  JURIDIQUE: { label: "Documents juridiques", color: "text-purple-600" },
  FISCAL: { label: "Documents fiscaux", color: "text-green-600" },
  TECHNIQUE: { label: "Documents techniques", color: "text-orange-600" },
  FINANCIER: { label: "Documents financiers", color: "text-emerald-600" },
  AUTRE: { label: "Autres documents", color: "text-gray-600" },
};

export default function ActeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [acte, setActe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchActe();
  }, [params.id]);

  const fetchActe = async () => {
    try {
      const response = await fetch(`/api/config/actes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setActe(data.acte);
      } else {
        router.push("/configuration/actes-administratifs");
      }
    } catch (error) {
      console.error("Error fetching acte:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/config/actes/${params.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/configuration/actes-administratifs");
      }
    } catch (error) {
      console.error("Error deleting acte:", error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`/api/config/actes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle" }),
      });
      if (response.ok) {
        fetchActe();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!acte) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Acte non trouvé</p>
        <Link href="/configuration/actes-administratifs" className="text-blue-600 hover:underline mt-2 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const CategoryIcon = categoryConfig[acte.category]?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/configuration/actes-administratifs"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${categoryConfig[acte.category]?.color}`}>
                {categoryConfig[acte.category]?.label || acte.category}
              </span>
              <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{acte.code}</span>
              {acte.isActive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle2 className="w-3 h-3" /> Actif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  <AlertCircle className="w-3 h-3" /> Inactif
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{acte.name}</h1>
            {acte.shortName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">({acte.shortName})</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              acte.isActive
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            {acte.isActive ? "Désactiver" : "Activer"}
          </button>
          <Link
            href={`/configuration/actes-administratifs/${acte.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {acte.description && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{acte.description}</p>
            </div>
          )}

          {/* Pièces Requises */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4" /> Pièces requises ({acte.piecesRequises?.length || 0})
            </h3>
            {acte.piecesRequises && acte.piecesRequises.length > 0 ? (
              <div className="space-y-3">
                {acte.piecesRequises
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((piece, index) => (
                    <div
                      key={piece.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{piece.name}</p>
                          {piece.isRequired ? (
                            <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
                              Obligatoire
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 rounded">
                              Optionnel
                            </span>
                          )}
                        </div>
                        {piece.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{piece.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className={piecesCategoryConfig[piece.category]?.color}>
                            {piecesCategoryConfig[piece.category]?.label}
                          </span>
                          {piece.acceptedFormats && <span>Formats: {piece.acceptedFormats}</span>}
                          {piece.maxSizeMB && <span>Max: {piece.maxSizeMB} MB</span>}
                        </div>
                        {piece.templateUrl && (
                          <a
                            href={piece.templateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Download className="w-3 h-3" />
                            Télécharger le modèle
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune pièce requise définie</p>
            )}
          </div>

          {/* Instructions et Prérequis */}
          {(acte.instructions || acte.prerequisites) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
              {acte.instructions && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions</h4>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{acte.instructions}</p>
                </div>
              )}
              {acte.prerequisites && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prérequis</h4>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{acte.prerequisites}</p>
                </div>
              )}
            </div>
          )}

          {/* Base légale */}
          {acte.legalBasis && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Base légale
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{acte.legalBasis}</p>
            </div>
          )}
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Info Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Informations clés</h3>

            {/* Ministère */}
            {acte.ministry && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ministère responsable</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {acte.ministry.shortName || acte.ministry.name}
                  </p>
                </div>
              </div>
            )}

            {/* Secteur */}
            {acte.sector && (
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Secteur d'activité</p>
                  <p className="font-medium text-gray-900 dark:text-white">{acte.sector.name}</p>
                </div>
              </div>
            )}

            {/* Délai */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Délai légal</p>
                <p className="font-medium text-gray-900 dark:text-white">{acte.legalDelayDays} jours</p>
                <p className="text-xs text-gray-500">Alerte à J-{acte.warningDelayDays}</p>
              </div>
            </div>

            {/* Coût */}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Coût officiel</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(acte.cost, acte.currency)}
                </p>
                {acte.costCDF && (
                  <p className="text-xs text-gray-500">{formatCurrency(acte.costCDF, "CDF")}</p>
                )}
              </div>
            </div>

            {/* Validité */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Validité</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {acte.validityMonths ? `${acte.validityMonths} mois` : "Illimitée"}
                </p>
                {acte.isRenewable && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Renouvelable {acte.renewalDelayDays && `(J-${acte.renewalDelayDays})`}
                  </p>
                )}
              </div>
            </div>

            {/* Workflow */}
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Type de workflow</p>
                <p className="font-medium text-gray-900 dark:text-white">{acte.workflowType}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Créé le: {new Date(acte.createdAt).toLocaleDateString("fr-FR")}</p>
            <p>Modifié le: {new Date(acte.updatedAt).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmer la suppression</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cette action est irréversible</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer l'acte <strong>{acte.code}</strong> - {acte.name}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
