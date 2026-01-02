"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ScrollText,
  Search,
  Filter,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Hourglass,
  FileText,
  Landmark,
  User,
  MapPin,
  DollarSign,
  Download,
  Award,
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: FileText },
  SUBMITTED: { label: "Soumis", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", icon: Clock },
  IN_REVIEW: { label: "En examen", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300", icon: Hourglass },
  PENDING_DOCUMENTS: { label: "Docs requis", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", icon: AlertCircle },
  UNDER_REVIEW: { label: "En révision", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", icon: Eye },
  MINISTRY_REVIEW: { label: "Examen ministère", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", icon: Building2 },
  APPROVED: { label: "Approuvé", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", icon: CheckCircle },
  REJECTED: { label: "Rejeté", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", icon: XCircle },
  CANCELLED: { label: "Annulé", color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400", icon: XCircle },
  COMPLETED: { label: "Terminé", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", icon: CheckCircle },
};

export default function AllPermisPage() {
  const [dossiers, setDossiers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ministryFilter, setMinistryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, inReview: 0, submitted: 0 });

  const fetchMinistries = async () => {
    try {
      const res = await fetch("/api/referentiels/ministries?limit=100");
      const data = await res.json();
      setMinistries(data.success ? data.data : (data.ministries || []));
    } catch (err) {
      console.error("Erreur chargement ministères:", err);
    }
  };

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: "PERMIS",
        page: currentPage.toString(),
        limit: "20",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      // Ajouter le filtre ministère si sélectionné
      // Note: L'API devra supporter ce paramètre
      if (ministryFilter) {
        params.append('ministryId', ministryFilter);
      }

      const response = await fetch(`/api/guichet-unique/dossiers?${params}`);
      const result = await response.json();

      if (response.ok) {
        setDossiers(result.data || []);
        setPagination(result.pagination || { total: 0, totalPages: 1 });
        const s = result.stats || {};
        setStats({
          total: s.total || 0,
          pending: (s.submitted || 0) + (s.inReview || 0),
          approved: s.approved || 0,
          rejected: s.rejected || 0,
          inReview: s.inReview || 0,
          submitted: s.submitted || 0,
        });
      }
    } catch (err) {
      console.error("Erreur chargement permis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  useEffect(() => {
    fetchDossiers();
  }, [currentPage, searchTerm, statusFilter, ministryFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount, currency = 'USD') => {
    if (!amount) return '-';
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/80 to-orange-500/80 dark:from-amber-800/60 dark:to-orange-700/60 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <ScrollText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Permis</h1>
              <p className="text-orange-100 mt-1">
                Toutes les demandes de permis de tous les ministères
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-white" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-white/90 font-medium">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-200" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-white/90 font-medium">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-200" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
                <p className="text-sm text-white/90 font-medium">Approuvés</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-200" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                <p className="text-sm text-white/90 font-medium">Rejetés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, investisseur, projet..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={ministryFilter}
              onChange={(e) => { setMinistryFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tous les ministères</option>
              {ministries.map((m) => (
                <option key={m.id} value={m.id}>{m.shortName || m.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : dossiers.length === 0 ? (
          <div className="text-center py-20">
            <ScrollText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun permis trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">N° Dossier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Investisseur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Ministère</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Province</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Certificat</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {dossiers.map((dossier) => {
                  const status = statusConfig[dossier.status] || statusConfig.DRAFT;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={dossier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ScrollText className="w-4 h-4 text-orange-500" />
                          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                            {dossier.dossierNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{dossier.investorName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{dossier.investorEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]" title={dossier.projectName}>
                          {dossier.projectName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-indigo-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {dossier.ministry?.shortName || dossier.ministry?.name || "Non assigné"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {dossier.projectProvince || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {formatAmount(dossier.investmentAmount, dossier.currency)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {formatDate(dossier.submittedAt || dossier.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {dossier.status === 'APPROVED' || dossier.status === 'COMPLETED' ? (
                          <button
                            onClick={() => window.open(`/api/guichet-unique/dossiers/${dossier.id}/certificate`, '_blank')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg text-xs font-medium transition-colors"
                            title="Télécharger le certificat"
                          >
                            <Award className="w-4 h-4" />
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/guichet-unique/dossiers/${dossier.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                        >
                          Voir
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page <span className="font-medium">{currentPage}</span> sur{" "}
            <span className="font-medium">{pagination.totalPages}</span>
            {" "}({pagination.total} résultats)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
