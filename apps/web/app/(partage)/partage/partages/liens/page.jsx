"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Link as LinkIcon,
  Search,
  Copy,
  Trash2,
  Eye,
  Clock,
  File,
  FileText,
  Globe,
  Lock,
  MoreVertical,
  ExternalLink,
  Settings,
  Calendar,
  Users,
  Download,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  Plus,
  Check,
  X,
} from "lucide-react";

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Get file icon based on mime type
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

// Link Card Component
function PublicLinkCard({ link, onAction, onCopy }) {
  const { icon: FileIcon, color, bg } = getFileTypeInfo(link.document?.mimeType);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.(link);
  };

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border ${isExpired ? "border-red-200 dark:border-red-800" : "border-gray-100 dark:border-slate-700"} hover:shadow-lg transition-all`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <FileIcon className={`w-6 h-6 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate" title={link.document?.name}>
              {link.document?.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {link.isPublic ? (
                <span className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                  <Globe className="w-3 h-3 mr-1" />
                  Public
                </span>
              ) : (
                <span className="inline-flex items-center text-xs text-orange-600 dark:text-orange-400">
                  <Lock className="w-3 h-3 mr-1" />
                  Protégé
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center text-xs text-red-600 dark:text-red-400">
                  <X className="w-3 h-3 mr-1" />
                  Expiré
                </span>
              )}
            </div>
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
                      onAction("view", link);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Ouvrir le lien
                  </button>
                  <button
                    onClick={() => {
                      onAction("settings", link);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Paramètres
                  </button>
                  <hr className="my-1 border-gray-100 dark:border-slate-700" />
                  <button
                    onClick={() => {
                      onAction("delete", link);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Supprimer le lien
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Link URL */}
      <div className="p-4">
        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
          <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
            {link.url}
          </span>
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-colors ${
              copied
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg py-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{link.viewCount || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Vues</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg py-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{link.downloadCount || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Télécharg.</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg py-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {link.expiresAt ? formatDate(link.expiresAt) : "∞"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expiration</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Créé le {formatDate(link.createdAt)}
        </span>
        {link.allowDownload && (
          <span className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Download className="w-3 h-3 mr-1" />
            Téléchargement activé
          </span>
        )}
      </div>
    </div>
  );
}

export default function LiensPublicsPage() {
  const { data: session } = useSession();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      // Simulated data - replace with actual API call
      setLinks([
        {
          id: "1",
          url: "https://partage.anapi.cd/p/abc123xyz",
          document: {
            id: "doc1",
            name: "Rapport Annuel 2024.pdf",
            mimeType: "application/pdf",
          },
          isPublic: true,
          allowDownload: true,
          viewCount: 45,
          downloadCount: 12,
          createdAt: new Date(Date.now() - 604800000),
          expiresAt: new Date(Date.now() + 2592000000),
        },
        {
          id: "2",
          url: "https://partage.anapi.cd/p/def456uvw",
          document: {
            id: "doc2",
            name: "Présentation Projet.pptx",
            mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          },
          isPublic: false,
          password: "***",
          allowDownload: false,
          viewCount: 23,
          downloadCount: 0,
          createdAt: new Date(Date.now() - 259200000),
          expiresAt: null,
        },
        {
          id: "3",
          url: "https://partage.anapi.cd/p/ghi789rst",
          document: {
            id: "doc3",
            name: "Photo Équipe.jpg",
            mimeType: "image/jpeg",
          },
          isPublic: true,
          allowDownload: true,
          viewCount: 156,
          downloadCount: 34,
          createdAt: new Date(Date.now() - 1209600000),
          expiresAt: new Date(Date.now() - 86400000), // Expired
        },
        {
          id: "4",
          url: "https://partage.anapi.cd/p/jkl012mno",
          document: {
            id: "doc4",
            name: "Budget 2024.xlsx",
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          isPublic: false,
          password: "***",
          allowDownload: true,
          viewCount: 8,
          downloadCount: 5,
          createdAt: new Date(Date.now() - 432000000),
          expiresAt: new Date(Date.now() + 5184000000),
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching links:", error);
      setLoading(false);
    }
  };

  const handleAction = (action, link) => {
    console.log(`Action: ${action}`, link);
    switch (action) {
      case "view":
        window.open(link.url, "_blank");
        break;
      case "settings":
        // Open settings modal
        break;
      case "delete":
        setLinks((prev) => prev.filter((l) => l.id !== link.id));
        break;
    }
  };

  const handleCopy = (link) => {
    console.log("Link copied:", link.url);
  };

  const filteredLinks = links.filter((link) => {
    if (searchQuery) {
      return link.document?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const activeLinks = links.filter((l) => !l.expiresAt || new Date(l.expiresAt) > new Date());
  const expiredLinks = links.filter((l) => l.expiresAt && new Date(l.expiresAt) < new Date());

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liens Publics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez vos liens de partage publics
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Créer un lien
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{links.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total liens</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeLinks.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {links.reduce((sum, l) => sum + (l.viewCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vues totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {links.reduce((sum, l) => sum + (l.downloadCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Téléchargements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un lien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Links Grid */}
      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <PublicLinkCard
              key={link.id}
              link={link}
              onAction={handleAction}
              onCopy={handleCopy}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun résultat" : "Aucun lien public"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery
              ? "Essayez avec d'autres termes de recherche"
              : "Créez un lien public pour partager vos documents"}
          </p>
          {!searchQuery && (
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Créer un lien
            </button>
          )}
        </div>
      )}
    </div>
  );
}
