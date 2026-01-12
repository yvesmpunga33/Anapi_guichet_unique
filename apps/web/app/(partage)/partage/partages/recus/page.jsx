"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  Search,
  Grid,
  List,
  MoreVertical,
  Download,
  Share2,
  Eye,
  Clock,
  File,
  User,
  Filter,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  FileCode,
  ExternalLink,
  Star,
  Check,
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
    hour: "2-digit",
    minute: "2-digit",
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

// Permission badge
function PermissionBadge({ permission }) {
  const colors = {
    view: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    edit: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  const labels = {
    view: "Lecture seule",
    edit: "Modification",
    admin: "Admin",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[permission] || colors.view}`}>
      {labels[permission] || permission}
    </span>
  );
}

// Shared Document Card
function SharedDocumentCard({ share, onAction }) {
  const { icon: FileIcon, color, bg } = getFileTypeInfo(share.document?.mimeType);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all group">
      {/* Document Preview */}
      <Link href={`/partage/documents/${share.document?.id}`}>
        <div className="p-6 pb-4">
          <div className={`w-16 h-16 rounded-xl ${bg} flex items-center justify-center mx-auto mb-4`}>
            <FileIcon className={`w-8 h-8 ${color}`} />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white text-center truncate" title={share.document?.name}>
            {share.document?.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            {formatFileSize(share.document?.size || 0)}
          </p>
        </div>
      </Link>

      {/* Shared By Info */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
              {share.sharedBy?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                {share.sharedBy?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(share.sharedAt).split(",")[0]}
              </p>
            </div>
          </div>
          <PermissionBadge permission={share.permission} />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <button
          onClick={() => onAction("favorite", share)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <Star className={`w-4 h-4 ${share.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
        </button>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAction("view", share)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAction("download", share)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 bottom-full mb-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-20">
                  <button
                    onClick={() => {
                      onAction("open", share);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Ouvrir
                  </button>
                  {(share.permission === "edit" || share.permission === "admin") && (
                    <button
                      onClick={() => {
                        onAction("share", share);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <Share2 className="w-4 h-4 mr-3" />
                      Repartager
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared Document Row (List View)
function SharedDocumentRow({ share, onAction }) {
  const { icon: FileIcon, color, bg } = getFileTypeInfo(share.document?.mimeType);

  return (
    <div className="flex items-center p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mr-4`}>
        <FileIcon className={`w-5 h-5 ${color}`} />
      </div>

      {/* Name & Info */}
      <Link href={`/partage/documents/${share.document?.id}`} className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{share.document?.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Partagé par {share.sharedBy?.name}
        </p>
      </Link>

      {/* Permission */}
      <div className="hidden sm:block mr-4">
        <PermissionBadge permission={share.permission} />
      </div>

      {/* Size */}
      <span className="hidden md:block w-24 text-sm text-gray-500 dark:text-gray-400 text-right">
        {formatFileSize(share.document?.size || 0)}
      </span>

      {/* Date */}
      <span className="hidden lg:block w-40 text-sm text-gray-500 dark:text-gray-400 text-right">
        {formatDate(share.sharedAt)}
      </span>

      {/* Actions */}
      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={() => onAction("favorite", share)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star className={`w-4 h-4 ${share.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
        </button>
        <button
          onClick={() => onAction("view", share)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={() => onAction("download", share)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Download className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export default function PartagesRecusPage() {
  const { data: session } = useSession();
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterPermission, setFilterPermission] = useState(null);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      // Simulated data - replace with actual API call
      setShares([
        {
          id: "1",
          document: {
            id: "doc1",
            name: "Budget 2024 - Direction.xlsx",
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 2457600,
          },
          sharedBy: { name: "Jean Dupont", email: "jean.dupont@anapi.cd" },
          permission: "edit",
          sharedAt: new Date(Date.now() - 86400000),
          isFavorite: true,
        },
        {
          id: "2",
          document: {
            id: "doc2",
            name: "Guide des Procédures ANAPI.pdf",
            mimeType: "application/pdf",
            size: 5242880,
          },
          sharedBy: { name: "Marie Martin", email: "marie.martin@anapi.cd" },
          permission: "view",
          sharedAt: new Date(Date.now() - 172800000),
          isFavorite: false,
        },
        {
          id: "3",
          document: {
            id: "doc3",
            name: "Organigramme 2024.png",
            mimeType: "image/png",
            size: 1048576,
          },
          sharedBy: { name: "Pierre Durand", email: "pierre.durand@anapi.cd" },
          permission: "view",
          sharedAt: new Date(Date.now() - 259200000),
          isFavorite: false,
        },
        {
          id: "4",
          document: {
            id: "doc4",
            name: "Projet Innovation - Présentation.pptx",
            mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            size: 8388608,
          },
          sharedBy: { name: "Sophie Bernard", email: "sophie.bernard@anapi.cd" },
          permission: "admin",
          sharedAt: new Date(Date.now() - 345600000),
          isFavorite: true,
        },
        {
          id: "5",
          document: {
            id: "doc5",
            name: "Contrat Partenariat.docx",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            size: 524288,
          },
          sharedBy: { name: "Luc Petit", email: "luc.petit@anapi.cd" },
          permission: "edit",
          sharedAt: new Date(Date.now() - 432000000),
          isFavorite: false,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shares:", error);
      setLoading(false);
    }
  };

  const handleAction = (action, share) => {
    console.log(`Action: ${action}`, share);
    switch (action) {
      case "view":
        // Navigate to document preview
        break;
      case "download":
        // Download document
        break;
      case "favorite":
        setShares((prev) =>
          prev.map((s) =>
            s.id === share.id ? { ...s, isFavorite: !s.isFavorite } : s
          )
        );
        break;
      case "share":
        // Open share dialog
        break;
    }
  };

  const filteredShares = shares.filter((share) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !share.document?.name?.toLowerCase().includes(query) &&
        !share.sharedBy?.name?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    // Filter by permission
    if (filterPermission && share.permission !== filterPermission) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partagés avec moi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {shares.length} documents partagés par d'autres utilisateurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {shares.filter((s) => s.permission === "view").length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lecture seule</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {shares.filter((s) => s.permission === "edit").length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Modification</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(shares.map((s) => s.sharedBy?.email)).size}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Partageurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Permission Filter */}
          <select
            value={filterPermission || ""}
            onChange={(e) => setFilterPermission(e.target.value || null)}
            className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les droits</option>
            <option value="view">Lecture seule</option>
            <option value="edit">Modification</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredShares.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredShares.map((share) => (
              <SharedDocumentCard key={share.id} share={share} onAction={handleAction} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* List Header */}
            <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="w-10 mr-4"></span>
              <span className="flex-1">Document</span>
              <span className="hidden sm:block w-24 text-center mr-4">Droits</span>
              <span className="hidden md:block w-24 text-right">Taille</span>
              <span className="hidden lg:block w-40 text-right">Date</span>
              <span className="w-28 text-right">Actions</span>
            </div>
            {filteredShares.map((share) => (
              <SharedDocumentRow key={share.id} share={share} onAction={handleAction} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery || filterPermission ? "Aucun résultat" : "Aucun document partagé"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || filterPermission
              ? "Essayez avec d'autres critères de recherche"
              : "Personne n'a encore partagé de documents avec vous"}
          </p>
        </div>
      )}
    </div>
  );
}
