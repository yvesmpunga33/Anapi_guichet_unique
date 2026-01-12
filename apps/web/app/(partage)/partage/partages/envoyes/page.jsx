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
  Trash2,
  Eye,
  Users,
  Clock,
  File,
  X,
  Check,
  ArrowLeftRight,
  ExternalLink,
  UserPlus,
  Copy,
  Settings,
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
    view: "Lecture",
    edit: "Modification",
    admin: "Admin",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[permission] || colors.view}`}>
      {labels[permission] || permission}
    </span>
  );
}

// Share Card
function ShareCard({ share, onAction }) {
  const { icon: FileIcon, color, bg } = getFileTypeInfo(share.document?.mimeType);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
      {/* Document Info */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <FileIcon className={`w-6 h-6 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate" title={share.document?.name}>
              {share.document?.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatFileSize(share.document?.size || 0)}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-20">
                  <button
                    onClick={() => {
                      onAction("view", share);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4 mr-3" />
                    Voir le document
                  </button>
                  <button
                    onClick={() => {
                      onAction("editPermissions", share);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Modifier les droits
                  </button>
                  <button
                    onClick={() => {
                      onAction("copyLink", share);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <Copy className="w-4 h-4 mr-3" />
                    Copier le lien
                  </button>
                  <hr className="my-1 border-gray-100 dark:border-slate-700" />
                  <button
                    onClick={() => {
                      onAction("revoke", share);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Révoquer l'accès
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shared With */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Partagé avec :</span>
        </div>

        <div className="space-y-2">
          {share.sharedWith?.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.email}</p>
                  {user.name && <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>}
                </div>
              </div>
              <PermissionBadge permission={user.permission} />
            </div>
          ))}
        </div>

        {/* Share Date */}
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Partagé le {formatDate(share.sharedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MesPartagesPage() {
  const { data: session } = useSession();
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

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
            name: "Rapport Annuel 2024.pdf",
            mimeType: "application/pdf",
            size: 2457600,
          },
          sharedWith: [
            { name: "Marie Martin", email: "marie.martin@anapi.cd", permission: "edit" },
            { name: "Pierre Durand", email: "pierre.durand@anapi.cd", permission: "view" },
          ],
          sharedAt: new Date(Date.now() - 86400000),
        },
        {
          id: "2",
          document: {
            id: "doc2",
            name: "Budget Prévisionnel.xlsx",
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 1048576,
          },
          sharedWith: [
            { name: "Sophie Bernard", email: "sophie.bernard@anapi.cd", permission: "admin" },
          ],
          sharedAt: new Date(Date.now() - 172800000),
        },
        {
          id: "3",
          document: {
            id: "doc3",
            name: "Présentation Projet.pptx",
            mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            size: 5242880,
          },
          sharedWith: [
            { email: "equipe-projet@anapi.cd", permission: "view" },
            { name: "Luc Petit", email: "luc.petit@anapi.cd", permission: "edit" },
          ],
          sharedAt: new Date(Date.now() - 259200000),
        },
        {
          id: "4",
          document: {
            id: "doc4",
            name: "Photo Équipe.jpg",
            mimeType: "image/jpeg",
            size: 3145728,
          },
          sharedWith: [
            { name: "Équipe RH", email: "rh@anapi.cd", permission: "view" },
          ],
          sharedAt: new Date(Date.now() - 345600000),
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
        // Navigate to document
        break;
      case "editPermissions":
        // Open permissions modal
        break;
      case "copyLink":
        // Copy share link
        break;
      case "revoke":
        // Revoke access
        break;
    }
  };

  const filteredShares = shares.filter((share) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        share.document?.name?.toLowerCase().includes(query) ||
        share.sharedWith?.some(
          (user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        )
      );
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Partages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Documents que vous avez partagés avec d'autres utilisateurs
          </p>
        </div>
        <Link
          href="/partage/documents"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Partager un document
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{shares.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Documents partagés</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {shares.reduce((sum, s) => sum + (s.sharedWith?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs avec accès</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {shares.filter((s) => s.sharedWith?.some((u) => u.permission === "edit" || u.permission === "admin")).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avec droits de modification</p>
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
              placeholder="Rechercher par document ou utilisateur..."
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
        </div>
      </div>

      {/* Shares Grid */}
      {filteredShares.length > 0 ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredShares.map((share) => (
            <ShareCard key={share.id} share={share} onAction={handleAction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun résultat" : "Aucun partage"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery
              ? "Essayez avec d'autres termes de recherche"
              : "Vous n'avez pas encore partagé de documents"}
          </p>
          {!searchQuery && (
            <Link
              href="/partage/documents"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager un document
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
