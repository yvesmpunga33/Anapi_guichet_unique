"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  Copy,
  Clock,
  DollarSign,
  FileCheck,
  Building2,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { ActeAdministratifList, ActeAdministratifDelete } from "@/app/services/admin/Config.service";
import { ReferentielMinistryList } from "@/app/services/admin/Referentiel.service";

const categoryConfig = {
  LICENCE: { label: "Licence", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  PERMIS: { label: "Permis", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  AUTORISATION: { label: "Autorisation", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  AGREMENT: { label: "Agrément", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  CERTIFICAT: { label: "Certificat", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  ATTESTATION: { label: "Attestation", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
};

export default function ActesAdministratifsPage() {
  const [actes, setActes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [ministryFilter, setMinistryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ministries, setMinistries] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingActe, setEditingActe] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Charger les donnees
  useEffect(() => {
    fetchActes();
    fetchStats();
    fetchMinistries();
  }, [search, categoryFilter, ministryFilter, statusFilter]);

  const fetchActes = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (ministryFilter) params.ministryId = ministryFilter;
      if (statusFilter !== "") params.isActive = statusFilter;

      const response = await ActeAdministratifList(params);
      setActes(response.data?.actes || []);
      setStats(response.data?.stats || null);
    } catch (error) {
      console.error("Error fetching actes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Stats are now included in ActeAdministratifList response
  };

  const fetchMinistries = async () => {
    try {
      const response = await ReferentielMinistryList({ isActive: true });
      setMinistries(response.data?.ministries || response.data?.data || []);
    } catch (error) {
      console.error("Error fetching ministries:", error);
    }
  };

  const handleToggleStatus = async (acte) => {
    try {
      const { ActeAdministratifUpdate } = await import("@/app/services/admin/Config.service");
      await ActeAdministratifUpdate(acte.id, { isActive: !acte.isActive });
      fetchActes();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ActeAdministratifDelete(id);
      setDeleteConfirm(null);
      fetchActes();
    } catch (error) {
      console.error("Error deleting acte:", error);
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catalogue des Actes Administratifs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des licences, permis, autorisations et agréments
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/configuration/actes-administratifs/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvel acte
          </Link>
        </div>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Actes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.global?.totalActes || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {stats.global?.totalActifs || 0} actifs
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Délai Moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.delayStats?.avg || 0} <span className="text-sm font-normal">jours</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Min: {stats.delayStats?.min || 0} - Max: {stats.delayStats?.max || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Coût Moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stats.costStats?.avg || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Total: {formatCurrency(stats.costStats?.total || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pièces Requises</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.global?.totalPieces || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ~{stats.global?.avgPiecesPerActe || 0} par acte
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <FileCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Stats */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Répartition par catégorie
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.byCategory.map((cat) => (
              <div
                key={cat.category}
                className={`px-4 py-2 rounded-lg ${categoryConfig[cat.category]?.color || "bg-gray-100"}`}
              >
                <span className="font-semibold">{cat.count}</span>{" "}
                <span className="text-sm">{categoryConfig[cat.category]?.label || cat.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code, nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200"
                  : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtres
              {(categoryFilter || ministryFilter || statusFilter !== "") && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => {
                fetchActes();
                fetchStats();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Toutes les catégories</option>
                  {Object.entries(categoryConfig).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ministère
                </label>
                <select
                  value={ministryFilter}
                  onChange={(e) => setMinistryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Tous les ministères</option>
                  {ministries.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.shortName || m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Tous les statuts</option>
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Chargement...
            </div>
          ) : actes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Aucun acte trouvé</p>
              <Link
                href="/configuration/actes-administratifs/nouveau"
                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Créer le premier acte
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code / Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ministère
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Délai
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Coût
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pièces
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {actes.map((acte) => (
                  <tr
                    key={acte.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
                          {acte.code}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {acte.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          categoryConfig[acte.category]?.color || "bg-gray-100"
                        }`}
                      >
                        {categoryConfig[acte.category]?.label || acte.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {acte.ministry?.shortName || acte.ministry?.name || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {acte.legalDelayDays}j
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(acte.cost, acte.currency)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                        {acte.piecesRequises?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(acte)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          acte.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {acte.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Actif
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Inactif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/configuration/actes-administratifs/${acte.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/configuration/actes-administratifs/${acte.id}/edit`}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(acte)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cette action est irréversible
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer l'acte{" "}
              <strong>{deleteConfirm.code}</strong> - {deleteConfirm.name}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
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
