"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Clock,
  Search,
  Grid,
  List,
  Download,
  Share2,
  Eye,
  Star,
  File,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  FileCode,
  Calendar,
  MoreVertical,
} from "lucide-react";

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Format relative time
const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
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

// Recent Item Row
function RecentItemRow({ item, onAction }) {
  const isFolder = item.type === "folder";
  const { icon: FileIcon, color, bg } = isFolder
    ? { icon: FolderOpen, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" }
    : getFileTypeInfo(item.mimeType);

  const actionLabel = {
    view: "Consulté",
    edit: "Modifié",
    upload: "Uploadé",
    share: "Partagé",
    download: "Téléchargé",
  };

  return (
    <div className="flex items-center p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mr-4 flex-shrink-0`}>
        <FileIcon className={`w-5 h-5 ${color}`} />
      </div>

      {/* Name & Info */}
      <Link
        href={isFolder ? `/partage/dossiers/${item.id}` : `/partage/documents/${item.id}`}
        className="flex-1 min-w-0"
      >
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {actionLabel[item.action] || "Accédé"} • {item.folder?.name || "Racine"}
        </p>
      </Link>

      {/* Time */}
      <span className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 mr-4">
        <Clock className="w-4 h-4 mr-1" />
        {formatRelativeTime(item.accessedAt)}
      </span>

      {/* Size */}
      {!isFolder && (
        <span className="hidden md:block w-20 text-sm text-gray-500 dark:text-gray-400 text-right mr-4">
          {formatFileSize(item.size || 0)}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onAction("favorite", item)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star className={`w-4 h-4 ${item.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
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

// Group items by date
function groupByDate(items) {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 604800000);
  const monthAgo = new Date(today.getTime() - 2592000000);

  items.forEach((item) => {
    const itemDate = new Date(item.accessedAt);
    if (itemDate >= today) {
      groups.today.push(item);
    } else if (itemDate >= yesterday) {
      groups.yesterday.push(item);
    } else if (itemDate >= weekAgo) {
      groups.thisWeek.push(item);
    } else if (itemDate >= monthAgo) {
      groups.thisMonth.push(item);
    } else {
      groups.older.push(item);
    }
  });

  return groups;
}

export default function RecentsPage() {
  const { data: session } = useSession();
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      // Simulated data - replace with actual API call
      setRecentItems([
        {
          id: "1",
          type: "document",
          name: "Rapport Mensuel Janvier.pdf",
          mimeType: "application/pdf",
          size: 2457600,
          folder: { name: "Rapports" },
          action: "view",
          accessedAt: new Date(Date.now() - 1800000), // 30 min ago
          isFavorite: false,
        },
        {
          id: "2",
          type: "document",
          name: "Budget 2024.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 1048576,
          folder: { name: "Finance" },
          action: "edit",
          accessedAt: new Date(Date.now() - 7200000), // 2 hours ago
          isFavorite: true,
        },
        {
          id: "3",
          type: "folder",
          name: "Projets 2024",
          itemCount: 15,
          action: "view",
          accessedAt: new Date(Date.now() - 14400000), // 4 hours ago
          isFavorite: false,
        },
        {
          id: "4",
          type: "document",
          name: "Présentation Direction.pptx",
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          size: 5242880,
          folder: { name: "Présentations" },
          action: "upload",
          accessedAt: new Date(Date.now() - 86400000), // Yesterday
          isFavorite: false,
        },
        {
          id: "5",
          type: "document",
          name: "Contrat Partenariat.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 524288,
          folder: { name: "Contrats" },
          action: "share",
          accessedAt: new Date(Date.now() - 100800000), // Yesterday
          isFavorite: true,
        },
        {
          id: "6",
          type: "document",
          name: "Photo Événement.jpg",
          mimeType: "image/jpeg",
          size: 3145728,
          folder: { name: "Images" },
          action: "download",
          accessedAt: new Date(Date.now() - 259200000), // 3 days ago
          isFavorite: false,
        },
        {
          id: "7",
          type: "folder",
          name: "Archives 2023",
          itemCount: 42,
          action: "view",
          accessedAt: new Date(Date.now() - 432000000), // 5 days ago
          isFavorite: false,
        },
        {
          id: "8",
          type: "document",
          name: "Notes Réunion.txt",
          mimeType: "text/plain",
          size: 12288,
          folder: { name: "Notes" },
          action: "edit",
          accessedAt: new Date(Date.now() - 604800000), // 1 week ago
          isFavorite: false,
        },
        {
          id: "9",
          type: "document",
          name: "Rapport Annuel 2023.pdf",
          mimeType: "application/pdf",
          size: 8388608,
          folder: { name: "Rapports" },
          action: "view",
          accessedAt: new Date(Date.now() - 1209600000), // 2 weeks ago
          isFavorite: true,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recent items:", error);
      setLoading(false);
    }
  };

  const handleAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case "favorite":
        setRecentItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i))
        );
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

  const filteredItems = recentItems.filter((item) => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const groupedItems = groupByDate(filteredItems);

  const groupLabels = {
    today: "Aujourd'hui",
    yesterday: "Hier",
    thisWeek: "Cette semaine",
    thisMonth: "Ce mois",
    older: "Plus ancien",
  };

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents Récents</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Vos fichiers et dossiers consultés récemment
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les récents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grouped Items */}
      {filteredItems.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(
            ([key, items]) =>
              items.length > 0 && (
                <div key={key}>
                  {/* Group Header */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {groupLabels[key]}
                    </h2>
                    <span className="text-xs text-gray-400">({items.length})</span>
                  </div>

                  {/* Items List */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    {items.map((item) => (
                      <RecentItemRow key={item.id} item={item} onAction={handleAction} />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun résultat" : "Aucune activité récente"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery
              ? "Essayez avec d'autres termes de recherche"
              : "Vos documents récemment consultés apparaîtront ici"}
          </p>
          {!searchQuery && (
            <Link
              href="/partage/documents"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
