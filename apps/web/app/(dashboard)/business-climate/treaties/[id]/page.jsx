"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  Calendar,
  FileText,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Printer,
  Info,
  Shield,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";

const treatyTypeConfig = {
  BIT: { label: "Traité bilatéral d'investissement", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  FTA: { label: "Accord de libre-échange", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40" },
  DTA: { label: "Convention fiscale", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  INVESTMENT_PROTECTION: { label: "Protection des investissements", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  ECONOMIC_PARTNERSHIP: { label: "Partenariat économique", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  TRADE_AGREEMENT: { label: "Accord commercial", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40" },
  MULTILATERAL: { label: "Accord multilatéral", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  REGIONAL: { label: "Accord régional", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/40" },
  SECTOR_SPECIFIC: { label: "Accord sectoriel", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
  OTHER: { label: "Autre", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-600" },
};

const statusConfig = {
  NEGOTIATING: { label: "En négociation", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600", icon: Clock },
  SIGNED: { label: "Signé", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: FileText },
  RATIFICATION_PENDING: { label: "Ratification en cours", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Clock },
  RATIFIED: { label: "Ratifié", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", icon: CheckCircle2 },
  IN_FORCE: { label: "En vigueur", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  SUSPENDED: { label: "Suspendu", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", icon: AlertCircle },
  TERMINATED: { label: "Terminé", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: X },
  EXPIRED: { label: "Expiré", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700", icon: AlertCircle },
  RENEGOTIATING: { label: "En renégociation", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/30", icon: Clock },
};

export default function TreatyDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { setPageTitle } = usePageTitle();
  const [treaty, setTreaty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreaty();
  }, [id]);

  useEffect(() => {
    if (treaty) {
      document.title = `${treaty.shortTitle || treaty.title} | ANAPI`;
      setPageTitle(treaty.shortTitle || treaty.title);
    }
    return () => setPageTitle(null);
  }, [treaty, setPageTitle]);

  const fetchTreaty = async () => {
    try {
      const response = await fetch(`/api/business-climate/treaties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTreaty(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Traité non trouvé",
          confirmButtonColor: "#2563eb",
        }).then(() => router.push("/business-climate/treaties"));
      }
    } catch (error) {
      console.error("Error fetching treaty:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer ce traité ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/business-climate/treaties/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await Swal.fire({
            icon: "success",
            title: "Supprimé",
            text: "Le traité a été supprimé",
            confirmButtonColor: "#2563eb",
            timer: 2000,
          });
          router.push("/business-climate/treaties");
        } else {
          const error = await response.json();
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: error.error || "Erreur lors de la suppression",
            confirmButtonColor: "#2563eb",
          });
        }
      } catch (error) {
        console.error("Error deleting treaty:", error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!treaty) {
    return null;
  }

  const typeConfig = treatyTypeConfig[treaty.treatyType] || treatyTypeConfig.OTHER;
  const statConfig = statusConfig[treaty.status] || statusConfig.NEGOTIATING;
  const StatusIcon = statConfig.icon;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          aside, header, nav {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .lg\\:pl-72 {
            padding-left: 0 !important;
          }
          .dark\\:bg-gray-800, .dark\\:bg-gray-900 {
            background: white !important;
          }
          .dark\\:text-white, .dark\\:text-gray-100, .dark\\:text-gray-200, .dark\\:text-gray-300 {
            color: black !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 print:p-0 print:bg-white">
        {/* Print Header */}
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ANAPI - Traité International</h1>
              <p className="text-gray-600">République Démocratique du Congo</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Imprimé le {new Date().toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <Link
              href="/business-climate/treaties"
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 print:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  {treaty.reference}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
                <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${statConfig.bg} ${statConfig.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statConfig.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {treaty.title}
              </h1>
              {treaty.shortTitle && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {treaty.shortTitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <Link
              href={`/business-climate/treaties/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {treaty.description && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {treaty.description}
                </p>
              </div>
            )}

            {/* Partner Countries */}
            {treaty.partnerCountries && treaty.partnerCountries.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Pays partenaires
                </h2>
                <div className="flex flex-wrap gap-2">
                  {treaty.partnerCountries.map((country, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Provisions */}
            {treaty.keyProvisions && treaty.keyProvisions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Dispositions clés
                </h2>
                <ul className="space-y-2">
                  {treaty.keyProvisions.map((provision, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{provision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Investor Benefits */}
            {treaty.investorBenefits && treaty.investorBenefits.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Avantages pour les investisseurs
                </h2>
                <ul className="space-y-2">
                  {treaty.investorBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Covered Sectors */}
            {treaty.coveredSectors && treaty.coveredSectors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Secteurs couverts
                </h2>
                <div className="flex flex-wrap gap-2">
                  {treaty.coveredSectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dispute Resolution */}
            {treaty.disputeResolution && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Mécanisme de règlement des différends
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {treaty.disputeResolution}
                </p>
              </div>
            )}

            {/* Notes */}
            {treaty.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Notes
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {treaty.notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Dates importantes
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Négociations</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(treaty.negotiationStartDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Signature</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(treaty.signedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Ratification</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(treaty.ratifiedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Entrée en vigueur</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatDate(treaty.entryIntoForceDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Expiration</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(treaty.expiryDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration */}
            {(treaty.duration || treaty.autoRenewal) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Durée
                </h2>
                <div className="space-y-3">
                  {treaty.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Durée initiale</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {treaty.duration} ans
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Renouvellement auto</span>
                    <span className={`font-medium ${treaty.autoRenewal ? 'text-green-600' : 'text-gray-500'}`}>
                      {treaty.autoRenewal ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  {treaty.renewalPeriod && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Période renouvellement</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {treaty.renewalPeriod} ans
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regional Organization */}
            {treaty.regionalOrganization && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Organisation régionale
                </h2>
                <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                  {treaty.regionalOrganization}
                </span>
              </div>
            )}

            {/* Responsible */}
            {treaty.responsible && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Responsable
                </h2>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {treaty.responsible.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {treaty.responsible.email}
                  </p>
                </div>
              </div>
            )}

            {/* Treaty Text Link */}
            {treaty.treatyTextUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 print:hidden">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Document
                </h2>
                <a
                  href={treaty.treatyTextUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir le texte du traité
                </a>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Métadonnées
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Créé par</span>
                  <span className="text-gray-900 dark:text-white">
                    {treaty.createdBy?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Créé le</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(treaty.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Modifié le</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(treaty.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
