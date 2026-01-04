"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  FileText,
  Award,
  Star,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  User,
  Banknote,
  Building,
  Hash,
  Shield,
  Clock,
  Briefcase,
} from "lucide-react";

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  BLACKLISTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const statusLabels = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  BLACKLISTED: "Liste noire",
  PENDING_VERIFICATION: "En vérification",
};

const categoryLabels = {
  MICRO: "Micro entreprise",
  SMALL: "Petite entreprise",
  MEDIUM: "Moyenne entreprise",
  LARGE: "Grande entreprise",
};

const legalFormLabels = {
  SARL: "SARL - Société à Responsabilité Limitée",
  SA: "SA - Société Anonyme",
  SAS: "SAS - Société par Actions Simplifiée",
  SNC: "SNC - Société en Nom Collectif",
  EI: "EI - Entreprise Individuelle",
  COOP: "Coopérative",
  ONG: "ONG - Organisation Non Gouvernementale",
  OTHER: "Autre",
};

export default function BidderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bidder, setBidder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBidder = async () => {
      try {
        const response = await fetch(`/api/procurement/bidders/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setBidder(data.data);
        } else {
          setError(data.error || "Soumissionnaire non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBidder();
    }
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/procurement/bidders/${params.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        router.push("/procurement/bidders");
      } else {
        alert(data.error);
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
      day: "numeric",
      month: "long",
      year: "numeric",
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
      <div className="space-y-6">
        <Link
          href="/procurement/bidders"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la liste
        </Link>

        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Erreur</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/procurement/bidders"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              {bidder.logo ? (
                <img src={bidder.logo} alt={bidder.companyName} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bidder.companyName}
                </h1>
                {bidder.isVerified && (
                  <CheckCircle className="w-6 h-6 text-green-500" title="Vérifié" />
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {bidder.code}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[bidder.status]}`}>
                  {statusLabels[bidder.status]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/procurement/bidders/${params.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Modifier
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Informations générales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Raison sociale</label>
                <p className="font-medium text-gray-900 dark:text-white">{bidder.companyName}</p>
              </div>
              {bidder.tradeName && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Nom commercial</label>
                  <p className="font-medium text-gray-900 dark:text-white">{bidder.tradeName}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Forme juridique</label>
                <p className="font-medium text-gray-900 dark:text-white">
                  {legalFormLabels[bidder.legalForm] || bidder.legalForm}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Catégorie</label>
                <p className="font-medium text-gray-900 dark:text-white">
                  {categoryLabels[bidder.category] || bidder.category}
                </p>
              </div>
              {bidder.foundingDate && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Date de création</label>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(bidder.foundingDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Identifiants légaux */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              Identifiants légaux
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">RCCM</label>
                <p className="font-mono font-medium text-gray-900 dark:text-white">{bidder.rccm || "—"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">ID National</label>
                <p className="font-mono font-medium text-gray-900 dark:text-white">{bidder.idnat || "—"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">NIF</label>
                <p className="font-mono font-medium text-gray-900 dark:text-white">{bidder.nif || "—"}</p>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Coordonnées
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bidder.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                    <p className="font-medium text-gray-900 dark:text-white">{bidder.email}</p>
                  </div>
                </div>
              )}
              {bidder.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Téléphone</label>
                    <p className="font-medium text-gray-900 dark:text-white">{bidder.phone}</p>
                  </div>
                </div>
              )}
              {bidder.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Site web</label>
                    <a href={bidder.website} target="_blank" rel="noopener noreferrer"
                       className="font-medium text-blue-600 hover:underline">{bidder.website}</a>
                  </div>
                </div>
              )}
              {(bidder.address || bidder.city || bidder.province) && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Adresse</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {[bidder.address, bidder.city?.name, bidder.province?.name, bidder.country?.name]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Représentant légal */}
          {(bidder.representativeName || bidder.contactPerson) && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Représentant légal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Nom</label>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {bidder.representativeName || bidder.contactPerson || "—"}
                  </p>
                </div>
                {(bidder.representativeTitle || bidder.contactTitle) && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Fonction</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bidder.representativeTitle || bidder.contactTitle}
                    </p>
                  </div>
                )}
                {(bidder.representativePhone || bidder.contactPhone) && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Téléphone</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bidder.representativePhone || bidder.contactPhone}
                    </p>
                  </div>
                )}
                {(bidder.representativeEmail || bidder.contactEmail) && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bidder.representativeEmail || bidder.contactEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Finance */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Performance
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">Soumissions</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{bidder.totalBids || 0}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Contrats gagnés</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{bidder.totalContractsWon || 0}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Banknote className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700 dark:text-gray-300">Valeur totale</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(bidder.totalContractsValue)}
                </span>
              </div>

              {bidder.rating && (
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                    <span className="text-gray-700 dark:text-gray-300">Note moyenne</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{bidder.rating.toFixed(1)}/5</span>
                </div>
              )}
            </div>
          </div>

          {/* Informations financières */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-blue-600" />
              Informations financières
            </h2>

            <div className="space-y-4">
              {bidder.capitalAmount && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Capital social</label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(bidder.capitalAmount, bidder.currency)}
                  </p>
                </div>
              )}
              {bidder.annualTurnover && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Chiffre d'affaires annuel</label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(bidder.annualTurnover, bidder.currency)}
                  </p>
                </div>
              )}
              {bidder.bankName && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Banque</label>
                  <p className="font-medium text-gray-900 dark:text-white">{bidder.bankName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Métadonnées */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Informations système
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Créé le</span>
                <span className="text-gray-900 dark:text-white">{formatDate(bidder.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Modifié le</span>
                <span className="text-gray-900 dark:text-white">{formatDate(bidder.updatedAt)}</span>
              </div>
              {bidder.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Vérifié le</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(bidder.verifiedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
              Êtes-vous sûr de vouloir supprimer le soumissionnaire <strong>{bidder.companyName}</strong> ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
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
