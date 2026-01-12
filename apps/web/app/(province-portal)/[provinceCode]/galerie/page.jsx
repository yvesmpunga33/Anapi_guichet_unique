"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  Video,
  Download,
  Filter,
  Grid,
  List,
  Loader2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Upload,
  FolderOpen,
  Play,
  Calendar,
  Tag,
} from "lucide-react";
import { ProvinceGalleryList, ProvinceGalleryDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const categoryConfig = {
  INFRASTRUCTURE: { label: "Infrastructure", color: "bg-blue-100 text-blue-700" },
  EVENTS: { label: "Evenements", color: "bg-purple-100 text-purple-700" },
  TOURISM: { label: "Tourisme", color: "bg-green-100 text-green-700" },
  CULTURE: { label: "Culture", color: "bg-pink-100 text-pink-700" },
  ECONOMY: { label: "Economie", color: "bg-yellow-100 text-yellow-700" },
  GOVERNMENT: { label: "Gouvernement", color: "bg-red-100 text-red-700" },
  OTHER: { label: "Autre", color: "bg-gray-100 text-gray-700" },
};

export default function GaleriePage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, images: 0, videos: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, totalPages: 0 });

  const fetchGallery = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (search) params.search = search;
      if (typeFilter !== "all") params.mediaType = typeFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const response = await ProvinceGalleryList(provinceCode, params);
      if (response.data) {
        setItems(response.data.items || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement galerie:", err);
      // Mock data
      const mockItems = [];
      for (let i = 1; i <= 12; i++) {
        mockItems.push({
          id: i,
          title: `Image ${i}`,
          description: "Description de l'image",
          mediaType: i % 4 === 0 ? "VIDEO" : "IMAGE",
          url: null,
          thumbnail: null,
          category: Object.keys(categoryConfig)[i % 7],
          tags: ["province", "developpement"],
          viewCount: Math.floor(Math.random() * 1000),
          createdAt: new Date(2026, 0, i).toISOString(),
        });
      }
      setItems(mockItems);
      setStats({ total: 245, images: 227, videos: 18 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [provinceCode, pagination.page, typeFilter, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchGallery();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceGalleryDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchGallery(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <ImageIcon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Galerie
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Photos et videos de la province</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchGallery(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/galerie/upload`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Upload className="w-5 h-5" />
            Ajouter
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, icon: FolderOpen, color: "#6366F1" },
          { label: "Images", value: stats.images, icon: ImageIcon, color: "#10B981" },
          { label: "Videos", value: stats.videos, icon: Video, color: "#F59E0B" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
          </div>
          <div className="flex gap-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
              <option value="all">Tous types</option>
              <option value="IMAGE">Images</option>
              <option value="VIDEO">Videos</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
              <option value="all">Toutes categories</option>
              {Object.entries(categoryConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Galerie vide</h3>
          <p className="text-gray-500 mt-1">Ajoutez des photos et videos</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => {
            const category = categoryConfig[item.category] || categoryConfig.OTHER;
            return (
              <div key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                  {item.thumbnail || item.url ? (
                    <Image src={item.thumbnail || item.url} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item.mediaType === "VIDEO" ? (
                        <Video className="w-12 h-12 text-gray-400" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  )}
                  {item.mediaType === "VIDEO" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => setShowPreview(item)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
                      <Eye className="w-5 h-5" />
                    </button>
                    <Link href={`/${provinceCode}/galerie/${item.id}/modifier`} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(item)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${item.mediaType === "VIDEO" ? "bg-purple-500 text-white" : "bg-blue-500 text-white"}`}>
                      {item.mediaType === "VIDEO" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-xs ${category.color}`}>{category.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((item) => {
            const category = categoryConfig[item.category] || categoryConfig.OTHER;
            return (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative">
                  {item.thumbnail || item.url ? (
                    <Image src={item.thumbnail || item.url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item.mediaType === "VIDEO" ? <Video className="w-6 h-6 text-gray-400" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${item.mediaType === "VIDEO" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {item.mediaType}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${category.color}`}>{category.label}</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white truncate mt-1">{item.title}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.viewCount}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowPreview(item)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link href={`/${provinceCode}/galerie/${item.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setShowDeleteModal(item)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">Page {pagination.page} / {pagination.totalPages}</span>
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(null)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            {showPreview.mediaType === "VIDEO" ? (
              <div className="bg-black rounded-xl overflow-hidden">
                <video src={showPreview.url} controls className="max-h-[80vh]" autoPlay />
              </div>
            ) : (
              <div className="relative">
                {showPreview.url ? (
                  <Image src={showPreview.url} alt={showPreview.title} width={800} height={600} className="rounded-xl max-h-[80vh] object-contain" />
                ) : (
                  <div className="w-[600px] h-[400px] bg-gray-800 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-gray-600" />
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 text-white">
              <h3 className="font-semibold text-lg">{showPreview.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{showPreview.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'element</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.title}</strong>" ?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
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
