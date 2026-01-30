"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileSignature,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import { ContractList, ContractDelete, ContractTypeList } from "@/app/services/admin/Legal.service";

export default function ContractsPage() {
  const searchParams = useSearchParams();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    typeId: "",
    status: "",
    expiring: searchParams.get("expiring") || "",
  });
  const [contractTypes, setContractTypes] = useState([]);

  useEffect(() => {
    fetchContractTypes();
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [pagination.page, filters]);

  const fetchContractTypes = async () => {
    try {
      const response = await ContractTypeList({ activeOnly: true });
      const data = response.data?.data || response.data;
      setContractTypes(data.contractTypes || data.types || []);
    } catch (err) {
      console.error("Error fetching contract types:", err.response?.data?.message || err.message);
    }
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
      };
      if (filters.typeId) params.typeId = filters.typeId;
      if (filters.status) params.status = filters.status;
      if (filters.expiring) params.expiring = filters.expiring;

      const response = await ContractList(params);
      const data = response.data?.data || response.data;
      setContracts(data.contracts || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error("Error fetching contracts:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce contrat ?")) return;
    try {
      await ContractDelete(id);
      fetchContracts();
    } catch (err) {
      console.error("Error deleting contract:", err.response?.data?.message || err.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Brouillon" },
      PENDING_SIGNATURE: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "En attente signature",
      },
      ACTIVE: { bg: "bg-green-500/20", text: "text-green-400", label: "Actif" },
      SUSPENDED: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        label: "Suspendu",
      },
      EXPIRED: { bg: "bg-red-500/20", text: "text-red-400", label: "Expire" },
      TERMINATED: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Resilie",
      },
      RENEWED: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        label: "Renouvele",
      },
      ARCHIVED: {
        bg: "bg-slate-500/20",
        text: "text-slate-400",
        label: "Archive",
      },
    };
    const style = styles[status] || styles.DRAFT;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(value || 0);
  };

  const getDaysUntilExpiration = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileSignature className="w-8 h-8 text-green-500" />
            Contrats
          </h1>
          <p className="text-gray-400 mt-1">
            Gestion des contrats et conventions
          </p>
        </div>
        <Link
          href="/legal/contracts/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau contrat
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type */}
          <select
            value={filters.typeId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, typeId: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les types</option>
            {contractTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="DRAFT">Brouillon</option>
            <option value="EXPIRED">Expire</option>
            <option value="TERMINATED">Resilie</option>
          </select>

          {/* Expiring */}
          <select
            value={filters.expiring}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, expiring: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes les echeances</option>
            <option value="30">Expire dans 30 jours</option>
            <option value="60">Expire dans 60 jours</option>
            <option value="90">Expire dans 90 jours</option>
          </select>

          {/* Reset */}
          <button
            onClick={() =>
              setFilters({ typeId: "", status: "", expiring: "" })
            }
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Reinitialiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileSignature className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              Aucun contrat trouve
            </h3>
            <p className="text-gray-500 mt-1">
              Commencez par creer un nouveau contrat
            </p>
            <Link
              href="/legal/contracts/new"
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau contrat
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Reference
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Titre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Valeur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Echeance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Statut
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {contracts.map((contract) => {
                const daysLeft = getDaysUntilExpiration(contract.endDate);
                return (
                  <tr key={contract.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">
                        {contract.contractNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white truncate max-w-[200px]">
                        {contract.title}
                      </p>
                      {contract.parties?.length > 0 && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {contract.parties.map((p) => p.name).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-400">
                        {contract.contractType?.name || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {contract.value ? (
                        <span className="text-sm text-green-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(contract.value, contract.currency)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {contract.endDate ? (
                        <div>
                          <span className="text-sm text-gray-400">
                            {new Date(contract.endDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                          {daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && (
                            <p className="text-xs text-orange-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {daysLeft} jours restants
                            </p>
                          )}
                          {daysLeft !== null && daysLeft <= 0 && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Expire
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/legal/contracts/${contract.id}`}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </Link>
                        <Link
                          href={`/legal/contracts/${contract.id}/edit`}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </Link>
                        {contract.filePath && (
                          <a
                            href={contract.filePath}
                            download
                            className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                            title="Telecharger"
                          >
                            <Download className="w-4 h-4 text-gray-400" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {contracts.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
            <p className="text-sm text-gray-400">
              Page {pagination.page} sur {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
