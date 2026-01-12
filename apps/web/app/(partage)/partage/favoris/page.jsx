"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Star,
  Search,
  Grid,
  List,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye,
  Clock,
  File,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  FileCode,
} from "lucide-react";

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Get file icon and color based on mime type
const getFileTypeInfo = (mimeType) => {
  if (mimeType?.startsWith("image/"))
    return { icon: ImageIcon, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" };
  if (mimeType?.includes("spreadsheet") || mimeType?.includes("excel"))
    return { icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" };
  if (mimeType?.includes("pdf"))
    return { icon: FileText, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" };
  if (mimeType?.includes("word") || mimeType?.includes("document"))
    return { icon: FileText, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" };
  if (mimeType?.includes("zip") || mimeType?.includes("archive"))
    return { icon: FileArchive, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
  if (mimeType?.startsWith("video/"))
    return { icon: Film, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" };
  if (mimeType?.startsWith("audio/"))
    return { icon: Music, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" };
  return { icon: File, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" };
};

// Favorite Card Component
function FavoriteCard({ item, onAction }) {
  const isFolder = item.type === "folder";
  const { icon: FileIcon, color, bg } = isFolder
    ? { icon: FolderOpen, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" }
    : getFileTypeInfo(item.mimeType);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all group">
      {/* Star Badge */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => onAction("unfavorite", item)}
          className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
        >
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </button>
      </div>

      {/* Content */}
      <Link href={isFolder ? `/partage/dossiers/${item.id}` : `/partage/documents/${item.id}`}>
        <div className="p-6 pb-4 relative">
          <div className={`w-16 h-16 rounded-xl ${bg} flex items-center justify-center mx-auto mb-4`}>
            <FileIcon className={`w-8 h-8 ${color}`} />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white text-center truncate" title={item.name}>
            {item.name}
          </h3>
          {!isFolder && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {formatFileSize(item.size || 0)}
            </p>
          )}
          {isFolder && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {item.itemCount || 0} éléments
            </p>
          )}
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(item.favoritedAt || item.createdAt)}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAction("view", item)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!isFolder && (
            <button
              onClick={() => onAction("download", item)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onAction("share", item)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Favorite Row Component (List View)
function FavoriteRow({ item, onAction }) {
  const isFolder = item.type === "folder";
  const { icon: FileIcon, color, bg } = isFolder
    ? { icon: FolderOpen, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" }
    : getFileTypeInfo(item.mimeType);

  return (
    <div className="flex items-center p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mr-4`}>
        <FileIcon className={`w-5 h-5 ${color}`} />
      </div>

      {/* Name & Info */}
      <Link
        href={isFolder ? `/partage/dossiers/${item.id}` : `/partage/documents/${item.id}`}
        className="flex-1 min-w-0"
      >
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isFolder ? `${item.itemCount || 0} éléments` : item.folder?.name || "Racine"}
        </p>
      </Link>

      {/* Type Badge */}
      <span className="hidden sm:inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-xs mr-4">
        {isFolder ? "Dossier" : "Document"}
      </span>

      {/* Size */}
      {!isFolder && (
        <span className="hidden md:block w-24 text-sm text-gray-500 dark:text-gray-400 text-right">
          {formatFileSize(item.size || 0)}
        </span>
      )}

      {/* Date */}
      <span className="hidden lg:block w-32 text-sm text-gray-500 dark:text-gray-400 text-right">
        {formatDate(item.favoritedAt || item.createdAt)}
      </span>

      {/* Actions */}
      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={() => onAction("unfavorite", item)}
          className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
        >
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </button>
        <button
          onClick={() => onAction("view", item)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-4 h-4 text-gray-400" />
        </button>
        {!isFolder && (
          <button
            onClick={() => onAction("download", item)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button
          onClick={() => onAction("share", item)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Share2 className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export default function FavorisPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Simulated data - replace with actual API call
      setFavorites([
        {
          id: "1",
          type: "document",
          name: "Rapport Annuel 2024.pdf",
          mimeType: "application/pdf",
          size: 2457600,
          folder: { name: "Rapports" },
          favoritedAt: new Date(Date.now() - 86400000),
          createdAt: new Date(Date.now() - 604800000),
        },
        {
          id: "2",
          type: "folder",
          name: "Projets 2024",
          itemCount: 15,
          favoritedAt: new Date(Date.now() - 172800000),
          createdAt: new Date(Date.now() - 2592000000),
        },
        {
          id: "3",
          type: "document",
          name: "Budget Prévisionnel.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 1048576,
          folder: { name: "Finance" },
          favoritedAt: new Date(Date.now() - 259200000),
          createdAt: new Date(Date.now() - 1209600000),
        },
        {
          id: "4",
          type: "document",
          name: "Photo Équipe.jpg",
          mimeType: "image/jpeg",
          size: 3145728,
          folder: { name: "Images" },
          favoritedAt: new Date(Date.now() - 345600000),
          createdAt: new Date(Date.now() - 1814400000),
        },
        {
          id: "5",
          type: "folder",
          name: "Documents RH",
          itemCount: 28,
          favoritedAt: new Date(Date.now() - 432000000),
          createdAt: new Date(Date.now() - 5184000000),
        },
        {
          id: "6",
          type: "document",
          name: "Contrat Partenariat.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 524288,
          folder: { name: "Contrats" },
          favoritedAt: new Date(Date.now() - 518400000),
          createdAt: new Date(Date.now() - 2419200000),
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    }
  };

  const handleAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case "unfavorite":
        setFavorites((prev) => prev.filter((f) => f.id !== item.id));
        break;
      case "view":
        // Navigate to item
        break;
      case "download":
        // Download file
        break;
      case "share":
        // Open share dialog
        break;
    }
  };

  const filteredFavorites = favorites.filter((item) => {
    // Filter by search
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter by type
    if (filterType === "documents" && item.type !== "document") {
      return false;
    }
    if (filterType === "folders" && item.type !== "folder") {
      return false;
    }
    return true;
  });

  const documentCount = favorites.filter((f) => f.type === "document").length;
  const folderCount = favorites.filter((f) => f.type === "folder").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favoris</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Vos documents et dossiers favoris pour un accès rapide
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{favorites.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total favoris</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{documentCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{folderCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dossiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les favoris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">Tous</option>
            <option value="documents">Documents</option>
            <option value="folders">Dossiers</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Grid/List */}
      {filteredFavorites.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFavorites.map((item) => (
              <FavoriteCard key={item.id} item={item} onAction={handleAction} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            {filteredFavorites.map((item) => (
              <FavoriteRow key={item.id} item={item} onAction={handleAction} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery || filterType !== "all" ? "Aucun résultat" : "Aucun favori"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || filterType !== "all"
              ? "Essayez avec d'autres critères"
              : "Ajoutez des documents ou dossiers à vos favoris pour y accéder rapidement"}
          </p>
          {!searchQuery && filterType === "all" && (
            <Link
              href="/partage/documents"
              className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Parcourir les documents
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
