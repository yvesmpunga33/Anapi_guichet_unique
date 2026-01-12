"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileCheck,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Filter,
} from "lucide-react";
import { BidList, BidDelete, TenderList } from "@/app/services/admin/Procurement.service";

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

export default function BidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ byStatus: [] });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tenderFilter, setTenderFilter] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Tenders for filter
  const [tenders, setTenders] = useState([]);

  const fetchBids = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (tenderFilter) params.tenderId = tenderFilter;

      const response = await BidList(params);
      const data = response.data;

      if (data.success) {
        setBids(data.data);
        setStats(data.stats || { byStatus: [] });
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors du chargement des soumissions");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, tenderFilter]);

  // Load tenders for filter
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await TenderList({ limit: 100 });
        const data = response.data;
        if (data.success) {
          setTenders(data.data);
        }
      } catch (err) {
        console.error("Error loading tenders:", err);
      }
    };
    fetchTenders();
  }, []);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const response = await BidDelete(id);
      const data = response.data;

      if (data.success) {
        fetchBids();
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
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-blue-600" />
            Soumissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les soumissions aux appels d'offres
          </p>
        </div>

        <Link
          href="/procurement/bids/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Nouvelle soumission
        </Link>
      </div>

      {/* Stats */}
      {stats.byStatus && stats.byStatus.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.byStatus.slice(0, 5).map((stat) => {
            const StatusIcon = statusIcons[stat.status] || FileCheck;
            return (
              <div
                key={stat.status}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusColors[stat.status]?.split(' ').slice(0, 1).join('')}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {statusLabels[stat.status] || stat.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par référence..."
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
              value={tenderFilter}
              onChange={(e) => {
                setTenderFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 max-w-xs"
            >
              <option value="">Tous les appels d'offres</option>
              {tenders.map((tender) => (
                <option key={tender.id} value={tender.id}>
                  {tender.reference} - {tender.title?.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bids List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune soumission trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Commencez par enregistrer une nouvelle soumission
          </p>
          <Link
            href="/procurement/bids/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Enregistrer une soumission
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Soumissionnaire
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Appel d'offres
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Lot
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date soumission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {bids.map((bid) => {
                  const StatusIcon = statusIcons[bid.status] || FileCheck;
                  return (
                    <tr key={bid.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                          {bid.reference}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {bid.bidder?.companyName || "—"}
                            </div>
                            {bid.bidder?.rccm && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                RCCM: {bid.bidder.rccm}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {bid.tender?.reference || "—"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {bid.tender?.title || ""}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {bid.lot ? (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Lot {bid.lot.lotNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Tous lots</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(bid.financialOffer, bid.currency)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(bid.submissionDate)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[bid.status]}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusLabels[bid.status] || bid.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/procurement/bids/${bid.id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>

                          <Link
                            href={`/procurement/bids/${bid.id}/edit`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>

                          <button
                            onClick={() => setDeleteId(bid.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && bids.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 px-4 py-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
            {pagination.total} soumissions
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
              Êtes-vous sûr de vouloir supprimer cette soumission ? Cette action ne peut pas être annulée.
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
