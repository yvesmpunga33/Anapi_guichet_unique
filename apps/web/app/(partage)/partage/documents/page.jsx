"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Download,
  Share2,
  Star,
  Trash2,
  Eye,
  Edit,
  Upload,
  ChevronRight,
  SortAsc,
  SortDesc,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  FileCode,
  Calendar,
  Clock,
  File,
  X,
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
  if (mimeType?.includes("presentation") || mimeType?.includes("powerpoint"))
    return { icon: FileText, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" };
  if (mimeType?.includes("zip") || mimeType?.includes("archive"))
    return { icon: FileArchive, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
  if (mimeType?.startsWith("video/"))
    return { icon: Film, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" };
  if (mimeType?.startsWith("audio/"))
    return { icon: Music, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" };
  if (mimeType?.includes("code") || mimeType?.includes("javascript") || mimeType?.includes("json"))
    return { icon: FileCode, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" };
  return { icon: File, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" };
};

// Document Card (Grid View)
function DocumentCard({ document, onSelect, isSelected, onAction }) {
  const { icon: FileIcon, color, bg } = getFileTypeInfo(document.mimeType);
  const [showMenu, setShowMenu] = useState(false);
  const isSharedWithMe = document.isSharedWithMe;

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer group ${
        isSelected
          ? "border-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/30"
          : "border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
      }`}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-3 left-3 z-10 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(document.id);
          }}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500 hover:border-emerald-500"
          }`}
        >
          {isSelected && <Check className="w-4 h-4" />}
        </button>
      </div>

      {/* Shared Badge */}
      {isSharedWithMe && (
        <div className="absolute top-3 left-12 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Share2 className="w-3 h-3 mr-1" />
            Partagé
          </span>
        </div>
      )}

      {/* Favorite Button */}
      <button
        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onAction("favorite", document);
        }}
      >
        <Star className={`w-4 h-4 ${document.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
      </button>

      {/* File Preview */}
      <Link href={`/partage/documents/${document.id}`}>
        <div className="p-6 pb-4">
          <div className={`w-16 h-16 rounded-xl ${bg} flex items-center justify-center mx-auto mb-4`}>
            <FileIcon className={`w-8 h-8 ${color}`} />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white text-center truncate" title={document.name}>
            {document.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            {formatFileSize(document.size)}
          </p>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(document.createdAt).split(",")[0]}
        </span>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {/* Action Menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 bottom-full mb-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-20">
                <button
                  onClick={() => {
                    onAction("view", document);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  Aperçu
                </button>
                <button
                  onClick={() => {
                    onAction("download", document);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Télécharger
                </button>
                <button
                  onClick={() => {
                    onAction("share", document);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Share2 className="w-4 h-4 mr-3" />
                  Partager
                </button>
                <button
                  onClick={() => {
                    onAction("rename", document);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Renommer
                </button>
                <hr className="my-1 border-gray-100 dark:border-slate-700" />
                <button
                  onClick={() => {
                    onAction("delete", document);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Document Row (List View)
function DocumentRow({ document, onSelect, isSelected, onAction }) {
  const { icon: FileIcon, color, bg } = getFileTypeInfo(document.mimeType);
  const isSharedWithMe = document.isSharedWithMe;

  return (
    <div
      className={`flex items-center p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group ${
        isSelected ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onSelect(document.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 transition-colors ${
          isSelected
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500"
        }`}
      >
        {isSelected && <Check className="w-3 h-3" />}
      </button>

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mr-4 relative`}>
        <FileIcon className={`w-5 h-5 ${color}`} />
        {isSharedWithMe && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Share2 className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Name & Info */}
      <Link href={`/partage/documents/${document.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{document.name}</h3>
          {isSharedWithMe && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Partagé par {document.owner?.firstName}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {document.folder?.name || "Racine"} • {document.owner?.firstName} {document.owner?.lastName}
          {isSharedWithMe && document.permission && (
            <span className="ml-2 text-blue-500">
              • {document.permission === "view" ? "Lecture" : document.permission === "edit" ? "Modification" : "Complet"}
            </span>
          )}
        </p>
      </Link>

      {/* Size */}
      <span className="hidden sm:block w-24 text-sm text-gray-500 dark:text-gray-400 text-right">
        {formatFileSize(document.size)}
      </span>

      {/* Date */}
      <span className="hidden md:block w-40 text-sm text-gray-500 dark:text-gray-400 text-right">
        {formatDate(document.createdAt)}
      </span>

      {/* Actions */}
      <div className="flex items-center space-x-1 ml-4">
        <button
          onClick={() => onAction("favorite", document)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star className={`w-4 h-4 ${document.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
        </button>
        <button
          onClick={() => onAction("share", document)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Share2 className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={() => onAction("download", document)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Download className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={() => onAction("delete", document)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}

// Filter Chip
function FilterChip({ label, active, onClick, onRemove }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
        active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
      }`}
    >
      {label}
      {active && onRemove && (
        <X
          className="w-3 h-3 ml-2 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}

export default function DocumentsPage() {
  const { data: session } = useSession();
  const [allDocuments, setAllDocuments] = useState([]); // All documents (mine + shared)
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState(null);
  const [filterSource, setFilterSource] = useState("all"); // "all", "mine", "shared"
  const [showFilters, setShowFilters] = useState(false);

  const fileTypes = [
    { key: "pdf", label: "PDF" },
    { key: "image", label: "Images" },
    { key: "document", label: "Documents" },
    { key: "spreadsheet", label: "Tableurs" },
    { key: "archive", label: "Archives" },
    { key: "video", label: "Vidéos" },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Simulate API call - In real app, fetch both user's documents AND shared documents
      // The API should return documents where user is owner OR has share permission
      const myDocuments = [
        {
          id: "1",
          name: "Rapport Annuel 2024.pdf",
          mimeType: "application/pdf",
          size: 2457600,
          createdAt: new Date(),
          owner: { firstName: "Jean", lastName: "Dupont" },
          folder: { name: "Rapports" },
          isFavorite: true,
          isSharedWithMe: false,
        },
        {
          id: "2",
          name: "Budget Prévisionnel 2024.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 1048576,
          createdAt: new Date(Date.now() - 86400000),
          owner: { firstName: "Jean", lastName: "Dupont" },
          folder: { name: "Finance" },
          isFavorite: false,
          isSharedWithMe: false,
        },
      ];

      const sharedWithMe = [
        {
          id: "3",
          name: "Plan Stratégique 2025.pptx",
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          size: 5242880,
          createdAt: new Date(Date.now() - 172800000),
          owner: { firstName: "Marie", lastName: "Martin" },
          folder: { name: "Direction" },
          isFavorite: false,
          isSharedWithMe: true,
          permission: "view",
          sharedBy: { firstName: "Marie", lastName: "Martin" },
          sharedAt: new Date(Date.now() - 100000000),
        },
        {
          id: "4",
          name: "Projet Innovation - Phase 2.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 3145728,
          createdAt: new Date(Date.now() - 259200000),
          owner: { firstName: "Pierre", lastName: "Durand" },
          folder: { name: "Projets" },
          isFavorite: true,
          isSharedWithMe: true,
          permission: "edit",
          sharedBy: { firstName: "Pierre", lastName: "Durand" },
          sharedAt: new Date(Date.now() - 200000000),
        },
        {
          id: "5",
          name: "Contrat Partenariat ABC.pdf",
          mimeType: "application/pdf",
          size: 524288,
          createdAt: new Date(Date.now() - 345600000),
          owner: { firstName: "Sophie", lastName: "Bernard" },
          folder: { name: "Contrats" },
          isFavorite: false,
          isSharedWithMe: true,
          permission: "view",
          sharedBy: { firstName: "Sophie", lastName: "Bernard" },
          sharedAt: new Date(Date.now() - 300000000),
        },
        {
          id: "6",
          name: "Budget Formation 2024.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 1572864,
          createdAt: new Date(Date.now() - 432000000),
          owner: { firstName: "Luc", lastName: "Petit" },
          folder: { name: "RH" },
          isFavorite: false,
          isSharedWithMe: true,
          permission: "full",
          sharedBy: { firstName: "Luc", lastName: "Petit" },
          sharedAt: new Date(Date.now() - 400000000),
        },
      ];

      // Store all documents
      setAllDocuments([...myDocuments, ...sharedWithMe]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id));
    }
  };

  const handleAction = (action, document) => {
    console.log(`Action: ${action}`, document);
    // Implement actions
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedDocuments);
    // Implement bulk actions
  };

  // Filter documents based on source, type, and search
  const documents = allDocuments.filter((doc) => {
    // Filter by source
    if (filterSource === "mine" && doc.isSharedWithMe) return false;
    if (filterSource === "shared" && !doc.isSharedWithMe) return false;
    // Filter by type
    if (filterType) {
      const mimeType = doc.mimeType?.toLowerCase() || "";
      if (filterType === "pdf" && !mimeType.includes("pdf")) return false;
      if (filterType === "image" && !mimeType.startsWith("image/")) return false;
      if (filterType === "document" && !mimeType.includes("word") && !mimeType.includes("document")) return false;
      if (filterType === "spreadsheet" && !mimeType.includes("spreadsheet") && !mimeType.includes("excel")) return false;
      if (filterType === "archive" && !mimeType.includes("zip") && !mimeType.includes("archive")) return false;
      if (filterType === "video" && !mimeType.startsWith("video/")) return false;
    }
    return true;
  });

  const filteredDocuments = documents.filter((doc) => {
    if (searchQuery) {
      return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const myDocsCount = allDocuments.filter(d => !d.isSharedWithMe).length;
  const sharedDocsCount = allDocuments.filter(d => d.isSharedWithMe).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {documents.length} documents • {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
          </p>
        </div>
        <Link
          href="/partage/upload"
          className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Link>
      </div>

      {/* Source Filter Tabs */}
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFilterSource("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filterSource === "all"
              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Tous
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-slate-500">
            {myDocsCount + sharedDocsCount}
          </span>
        </button>
        <button
          onClick={() => setFilterSource("mine")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filterSource === "mine"
              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Mes documents
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            {myDocsCount}
          </span>
        </button>
        <button
          onClick={() => setFilterSource("shared")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
            filterSource === "shared"
              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Share2 className="w-4 h-4 mr-1" />
          Partagés avec moi
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {sharedDocsCount}
          </span>
        </button>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="createdAt-desc">Plus récent</option>
            <option value="createdAt-asc">Plus ancien</option>
            <option value="name-asc">Nom A-Z</option>
            <option value="name-desc">Nom Z-A</option>
            <option value="size-desc">Plus gros</option>
            <option value="size-asc">Plus petit</option>
          </select>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors ${
              filterType
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {filterType && <span className="ml-2 px-1.5 py-0.5 text-xs bg-emerald-500 text-white rounded">1</span>}
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <FilterChip
              label="Tous"
              active={!filterType}
              onClick={() => setFilterType(null)}
            />
            {fileTypes.map((type) => (
              <FilterChip
                key={type.key}
                label={type.label}
                active={filterType === type.key}
                onClick={() => setFilterType(type.key)}
                onRemove={filterType === type.key ? () => setFilterType(null) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedDocuments.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-emerald-700 dark:text-emerald-300 hover:underline"
            >
              {selectedDocuments.length === documents.length ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              {selectedDocuments.length} sélectionné(s)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction("download")}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </button>
            <button
              onClick={() => handleBulkAction("share")}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Documents Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onSelect={handleSelect}
              isSelected={selectedDocuments.includes(doc.id)}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* List Header */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button
              onClick={handleSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 transition-colors ${
                selectedDocuments.length === documents.length
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500"
              }`}
            >
              {selectedDocuments.length === documents.length && <Check className="w-3 h-3" />}
            </button>
            <span className="flex-1">Nom</span>
            <span className="hidden sm:block w-24 text-right">Taille</span>
            <span className="hidden md:block w-40 text-right">Date</span>
            <span className="w-32 text-right">Actions</span>
          </div>

          {/* List Items */}
          {filteredDocuments.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              onSelect={handleSelect}
              isSelected={selectedDocuments.includes(doc.id)}
              onAction={handleAction}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun résultat" : "Aucun document"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery
              ? "Essayez avec d'autres termes de recherche"
              : "Commencez par uploader votre premier document"}
          </p>
          {!searchQuery && (
            <Link
              href="/partage/upload"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload un document
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
