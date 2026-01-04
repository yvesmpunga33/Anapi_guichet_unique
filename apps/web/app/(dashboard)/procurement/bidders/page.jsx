"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Award,
  Ban,
  Star,
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

export default function BiddersPage() {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBidders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);
      if (verifiedFilter) params.append("isVerified", verifiedFilter);

      const response = await fetch(`/api/procurement/bidders?${params}`);
      const data = await response.json();

      if (data.success) {
        setBidders(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors du chargement des soumissionnaires");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, categoryFilter, verifiedFilter]);

  useEffect(() => {
    fetchBidders();
  }, [fetchBidders]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/procurement/bidders/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        fetchBidders();
        setDeleteId(null);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "—";
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Soumissionnaires
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les entreprises soumissionnaires
          </p>
        </div>

        <Link
          href="/procurement/bidders/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Nouveau soumissionnaire
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, RCCM, NIF, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Vérification</option>
              <option value="true">Vérifiés</option>
              <option value="false">Non vérifiés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bidders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : bidders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun soumissionnaire trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Commencez par enregistrer votre premier soumissionnaire
          </p>
          <Link
            href="/procurement/bidders/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Enregistrer un soumissionnaire
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400">
            <div className="col-span-4">Entreprise</div>
            <div className="col-span-2">Identifiants</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Statistiques</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {bidders.map((bidder) => (
              <div
                key={bidder.id}
                className="lg:grid lg:grid-cols-12 gap-4 p-4 lg:px-6 lg:py-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/* Entreprise */}
                <div className="col-span-4 flex items-center gap-3 mb-3 lg:mb-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    {bidder.logo ? (
                      <img src={bidder.logo} alt={bidder.companyName} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {bidder.companyName}
                      </h3>
                      {bidder.isVerified && (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" title="Vérifié" />
                      )}
                    </div>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[bidder.status]}`}>
                      {statusLabels[bidder.status]}
                    </span>
                  </div>
                </div>

                {/* Identifiants */}
                <div className="col-span-2 flex flex-col justify-center gap-1 mb-3 lg:mb-0">
                  {bidder.rccm && (
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-gray-400 dark:text-gray-500">RCCM:</span> {bidder.rccm}
                    </span>
                  )}
                  {bidder.nif && (
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-gray-400 dark:text-gray-500">NIF:</span> {bidder.nif}
                    </span>
                  )}
                </div>

                {/* Contact */}
                <div className="col-span-3 flex flex-col justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3 lg:mb-0">
                  {bidder.email && (
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{bidder.email}</span>
                    </span>
                  )}
                  {bidder.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      {bidder.phone}
                    </span>
                  )}
                  {(bidder.city || bidder.province) && (
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{[bidder.city?.name, bidder.province?.name].filter(Boolean).join(", ")}</span>
                    </span>
                  )}
                </div>

                {/* Statistiques */}
                <div className="col-span-2 flex flex-col justify-center gap-1 mb-3 lg:mb-0">
                  <div className="flex items-center gap-1.5 text-sm">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {bidder._count?.bids || 0}
                    </span>
                    <span className="text-gray-500 text-xs">soumissions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {bidder._count?.contracts || 0}
                    </span>
                    <span className="text-gray-500 text-xs">contrats</span>
                  </div>
                  {bidder.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {bidder.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <Link
                    href={`/procurement/bidders/${bidder.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  <Link
                    href={`/procurement/bidders/${bidder.id}/edit`}
                    className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => setDeleteId(bidder.id)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && bidders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 px-4 py-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
            {pagination.total} soumissionnaires
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} sur {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
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
              Êtes-vous sûr de vouloir supprimer ce soumissionnaire ? Cette action ne peut pas être annulée.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
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
