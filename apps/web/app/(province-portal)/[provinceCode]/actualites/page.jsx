"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Tag,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Zap,
} from "lucide-react";
import { ProvinceNewsList, ProvinceNewsDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: FileText },
  PUBLISHED: { label: "Publie", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  ARCHIVED: { label: "Archive", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: XCircle },
};

const categoryColors = {
  GENERAL: "bg-blue-100 text-blue-700",
  ECONOMIE: "bg-green-100 text-green-700",
  POLITIQUE: "bg-purple-100 text-purple-700",
  SOCIAL: "bg-yellow-100 text-yellow-700",
  CULTURE: "bg-pink-100 text-pink-700",
  SPORT: "bg-orange-100 text-orange-700",
  ENVIRONNEMENT: "bg-teal-100 text-teal-700",
};

export default function ActualitesPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });

  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const response = await ProvinceNewsList(provinceCode, params);
      if (response.data) {
        setNews(response.data.news || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement actualites:", err);
      // Mock data for demo
      setNews([
        {
          id: 1,
          title: "Inauguration du nouveau pont sur la riviere Kasai",
          excerpt: "Le Gouverneur a inaugure le nouveau pont qui facilitera les echanges commerciaux...",
          category: "ECONOMIE",
          status: "PUBLISHED",
          isBreaking: true,
          publishedAt: "2026-01-10T10:00:00Z",
          viewCount: 1234,
          author: { firstName: "Jean", lastName: "Mukendi" },
          image: null,
        },
        {
          id: 2,
          title: "Forum des investisseurs 2026 annonce pour fevrier",
          excerpt: "La province accueillera plus de 200 investisseurs internationaux...",
          category: "ECONOMIE",
          status: "PUBLISHED",
          isBreaking: false,
          publishedAt: "2026-01-09T14:30:00Z",
          viewCount: 856,
          author: { firstName: "Marie", lastName: "Kabongo" },
          image: null,
        },
        {
          id: 3,
          title: "Nouvelle zone economique speciale approuvee",
          excerpt: "Le gouvernement central a approuve la creation d'une ZES dans la province...",
          category: "POLITIQUE",
          status: "DRAFT",
          isBreaking: false,
          publishedAt: null,
          viewCount: 0,
          author: { firstName: "Admin", lastName: "Province" },
          image: null,
        },
      ]);
      setStats({ total: 156, published: 142, draft: 10, archived: 4 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [provinceCode, pagination.page, statusFilter, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchNews();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceNewsDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchNews(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Newspaper className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Actualites
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerez les actualites et communiques de la province
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link
            href={`/${provinceCode}/actualites/nouveau`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-5 h-5" />
            Nouvelle actualite
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900" },
          { label: "Publiees", value: stats.published, color: "text-green-600" },
          { label: "Brouillons", value: stats.draft, color: "text-yellow-600" },
          { label: "Archivees", value: stats.archived, color: "text-gray-500" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} dark:text-white`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une actualite..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50"
              style={{ "--tw-ring-color": accentColor }}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="PUBLISHED">Publiees</option>
              <option value="DRAFT">Brouillons</option>
              <option value="ARCHIVED">Archivees</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Toutes categories</option>
              <option value="GENERAL">General</option>
              <option value="ECONOMIE">Economie</option>
              <option value="POLITIQUE">Politique</option>
              <option value="SOCIAL">Social</option>
              <option value="CULTURE">Culture</option>
              <option value="SPORT">Sport</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucune actualite</h3>
            <p className="text-gray-500 mt-1">Commencez par creer votre premiere actualite</p>
            <Link
              href={`/${provinceCode}/actualites/nouveau`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Plus className="w-4 h-4" />
              Creer une actualite
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Titre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Categorie</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Vues</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {news.map((item) => {
                    const status = statusConfig[item.status] || statusConfig.DRAFT;
                    const StatusIcon = status.icon;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            {item.image ? (
                              <Image src={item.image} alt="" width={48} height={48} className="rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Newspaper className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {item.isBreaking && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                    <Zap className="w-3 h-3" />
                                    Breaking
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{item.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item.publishedAt || item.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            {item.viewCount?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/${provinceCode}/actualites/${item.id}`}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                              title="Voir"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/${provinceCode}/actualites/${item.id}/modifier`}
                              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setShowDeleteModal(item)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} sur {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'actualite</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.title}</strong>" ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
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
