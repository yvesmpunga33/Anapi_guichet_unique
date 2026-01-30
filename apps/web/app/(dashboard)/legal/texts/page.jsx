"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  LegalTextList,
  LegalTextDelete,
  DocumentTypeList,
  LegalDomainList,
} from "@/app/services/admin/Legal.service";

export default function LegalTextsPage() {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    search: "",
    typeId: "",
    domainId: "",
    status: "",
  });
  const [documentTypes, setDocumentTypes] = useState([]);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    fetchReferentials();
  }, []);

  useEffect(() => {
    fetchTexts();
  }, [pagination.page, filters]);

  const fetchReferentials = async () => {
    try {
      const [typesRes, domainsRes] = await Promise.all([
        DocumentTypeList({ activeOnly: true }),
        LegalDomainList({ activeOnly: true }),
      ]);
      // API returns documentTypes and domains in data.data
      const typesData = typesRes.data?.data || typesRes.data;
      const domainsData = domainsRes.data?.data || domainsRes.data;
      setDocumentTypes(typesData.documentTypes || typesData.types || []);
      setDomains(domainsData.domains || []);
    } catch (error) {
      console.error("Error fetching referentials:", error);
    }
  };

  const fetchTexts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.typeId) params.typeId = filters.typeId;
      if (filters.domainId) params.domainId = filters.domainId;
      if (filters.status) params.status = filters.status;

      const response = await LegalTextList(params);
      const data = response.data?.data || response.data;
      // API returns juridicalTexts, not texts
      setTexts(data.juridicalTexts || data.texts || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (error) {
      console.error("Error fetching texts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce texte ?")) return;
    try {
      await LegalTextDelete(id);
      fetchTexts();
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Brouillon" },
      PENDING_APPROVAL: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "En attente",
      },
      ACTIVE: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        label: "En vigueur",
      },
      MODIFIED: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        label: "Modifie",
      },
      ABROGATED: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Abroge",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Textes Juridiques
          </h1>
          <p className="text-gray-400 mt-1">
            Veille juridique - Lois, decrets, arretes et circulaires
          </p>
        </div>
        <Link
          href="/legal/texts/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau texte
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type */}
          <select
            value={filters.typeId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, typeId: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Domain */}
          <select
            value={filters.domainId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, domainId: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les domaines</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">En vigueur</option>
            <option value="DRAFT">Brouillon</option>
            <option value="MODIFIED">Modifie</option>
            <option value="ABROGATED">Abroge</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : texts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              Aucun texte juridique
            </h3>
            <p className="text-gray-500 mt-1">
              Commencez par ajouter un nouveau texte
            </p>
            <Link
              href="/legal/texts/new"
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau texte
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
                  Domaine
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Date
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
              {texts.map((text) => (
                <tr key={text.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">
                      {text.documentNumber}
                    </span>
                    {text.officialReference && (
                      <p className="text-xs text-gray-500">
                        {text.officialReference}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white truncate max-w-[250px]">
                      {text.title}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-400">
                      {text.documentType?.name || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-400">
                      {text.domain?.name || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-400">
                      {text.effectiveDate
                        ? new Date(text.effectiveDate).toLocaleDateString(
                            "fr-FR"
                          )
                        : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(text.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/legal/texts/${text.id}`}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                      <Link
                        href={`/legal/texts/${text.id}/edit`}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </Link>
                      {text.filePath && (
                        <a
                          href={text.filePath}
                          download
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Telecharger"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(text.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {texts.length > 0 && (
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
