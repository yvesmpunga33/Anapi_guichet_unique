"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Trash2,
  Search,
  RotateCcw,
  AlertTriangle,
  File,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  Clock,
  Check,
  X,
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

// Days until permanent deletion
const daysUntilDeletion = (deletedAt) => {
  const deleteDate = new Date(deletedAt);
  const permanentDeleteDate = new Date(deleteDate.getTime() + 30 * 86400000); // 30 days
  const now = new Date();
  const diff = permanentDeleteDate - now;
  return Math.max(0, Math.ceil(diff / 86400000));
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

// Trash Item Row
function TrashItemRow({ item, onRestore, onDelete, isSelected, onSelect }) {
  const isFolder = item.type === "folder";
  const { icon: FileIcon, color, bg } = isFolder
    ? { icon: FolderOpen, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" }
    : getFileTypeInfo(item.mimeType);

  const daysLeft = daysUntilDeletion(item.deletedAt);

  return (
    <div className={`flex items-center p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group ${isSelected ? "bg-red-50 dark:bg-red-900/10" : ""}`}>
      {/* Checkbox */}
      <button
        onClick={() => onSelect(item.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 transition-colors ${
          isSelected
            ? "bg-red-500 border-red-500 text-white"
            : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500"
        }`}
      >
        {isSelected && <Check className="w-3 h-3" />}
      </button>

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mr-4 flex-shrink-0 opacity-60`}>
        <FileIcon className={`w-5 h-5 ${color}`} />
      </div>

      {/* Name & Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-600 dark:text-gray-300 truncate">{item.name}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Supprimé le {formatDate(item.deletedAt)}
        </p>
      </div>

      {/* Days Left */}
      <div className="hidden sm:flex items-center mr-4">
        {daysLeft <= 7 ? (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {daysLeft}j restants
          </span>
        ) : (
          <span className="text-sm text-gray-400">{daysLeft}j restants</span>
        )}
      </div>

      {/* Size */}
      {!isFolder && (
        <span className="hidden md:block w-20 text-sm text-gray-400 text-right mr-4">
          {formatFileSize(item.size || 0)}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onRestore(item)}
          className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 transition-colors"
          title="Restaurer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
          title="Supprimer définitivement"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Confirm Dialog
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, variant = "danger" }) {
  if (!isOpen) return null;

  const colors = {
    danger: "bg-red-600 hover:bg-red-700",
    success: "bg-emerald-600 hover:bg-emerald-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${colors[variant]}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CorbeillePage() {
  const { data: session } = useSession();
  const [trashedItems, setTrashedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    fetchTrashedItems();
  }, []);

  const fetchTrashedItems = async () => {
    try {
      // Simulated data - replace with actual API call
      setTrashedItems([
        {
          id: "1",
          type: "document",
          name: "Ancien Rapport.pdf",
          mimeType: "application/pdf",
          size: 2457600,
          deletedAt: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          id: "2",
          type: "folder",
          name: "Dossier Temporaire",
          itemCount: 5,
          deletedAt: new Date(Date.now() - 172800000), // 2 days ago
        },
        {
          id: "3",
          type: "document",
          name: "Brouillon Budget.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 524288,
          deletedAt: new Date(Date.now() - 604800000), // 7 days ago
        },
        {
          id: "4",
          type: "document",
          name: "Photo Non Utilisée.jpg",
          mimeType: "image/jpeg",
          size: 3145728,
          deletedAt: new Date(Date.now() - 1209600000), // 14 days ago
        },
        {
          id: "5",
          type: "document",
          name: "Notes Anciennes.txt",
          mimeType: "text/plain",
          size: 8192,
          deletedAt: new Date(Date.now() - 2160000000), // 25 days ago
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trashed items:", error);
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === trashedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(trashedItems.map((item) => item.id));
    }
  };

  const handleRestore = (item) => {
    setConfirmDialog({
      title: "Restaurer l'élément",
      message: `Voulez-vous restaurer "${item.name}" ?`,
      variant: "success",
      onConfirm: () => {
        setTrashedItems((prev) => prev.filter((i) => i.id !== item.id));
        setConfirmDialog(null);
      },
    });
  };

  const handleDelete = (item) => {
    setConfirmDialog({
      title: "Supprimer définitivement",
      message: `Cette action est irréversible. "${item.name}" sera définitivement supprimé.`,
      variant: "danger",
      onConfirm: () => {
        setTrashedItems((prev) => prev.filter((i) => i.id !== item.id));
        setSelectedItems((prev) => prev.filter((id) => id !== item.id));
        setConfirmDialog(null);
      },
    });
  };

  const handleBulkRestore = () => {
    setConfirmDialog({
      title: "Restaurer les éléments",
      message: `Voulez-vous restaurer ${selectedItems.length} élément(s) ?`,
      variant: "success",
      onConfirm: () => {
        setTrashedItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
        setSelectedItems([]);
        setConfirmDialog(null);
      },
    });
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      title: "Supprimer définitivement",
      message: `Cette action est irréversible. ${selectedItems.length} élément(s) seront définitivement supprimés.`,
      variant: "danger",
      onConfirm: () => {
        setTrashedItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
        setSelectedItems([]);
        setConfirmDialog(null);
      },
    });
  };

  const handleEmptyTrash = () => {
    setConfirmDialog({
      title: "Vider la corbeille",
      message: "Cette action est irréversible. Tous les éléments seront définitivement supprimés.",
      variant: "danger",
      onConfirm: () => {
        setTrashedItems([]);
        setSelectedItems([]);
        setConfirmDialog(null);
      },
    });
  };

  const filteredItems = trashedItems.filter((item) => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalSize = trashedItems.reduce((sum, item) => sum + (item.size || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Corbeille</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Les éléments sont supprimés définitivement après 30 jours
          </p>
        </div>
        {trashedItems.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vider la corbeille
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{trashedItems.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Éléments supprimés</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatFileSize(totalSize)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Espace utilisé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      {trashedItems.some((item) => daysUntilDeletion(item.deletedAt) <= 7) && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-700 dark:text-amber-300">Attention</h4>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Certains éléments seront définitivement supprimés dans moins de 7 jours.
            </p>
          </div>
        </div>
      )}

      {/* Search & Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans la corbeille..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{selectedItems.length} sélectionné(s)</span>
              <button
                onClick={handleBulkRestore}
                className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
              >
                Restaurer
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trashed Items List */}
      {filteredItems.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button
              onClick={handleSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 transition-colors ${
                selectedItems.length === filteredItems.length
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500"
              }`}
            >
              {selectedItems.length === filteredItems.length && <Check className="w-3 h-3" />}
            </button>
            <span className="flex-1">Nom</span>
            <span className="hidden sm:block w-28 text-center">Expiration</span>
            <span className="hidden md:block w-20 text-right mr-4">Taille</span>
            <span className="w-24 text-right">Actions</span>
          </div>

          {/* Items */}
          {filteredItems.map((item) => (
            <TrashItemRow
              key={item.id}
              item={item}
              onRestore={handleRestore}
              onDelete={handleDelete}
              isSelected={selectedItems.includes(item.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun résultat" : "Corbeille vide"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Essayez avec d'autres termes de recherche"
              : "Aucun élément supprimé"}
          </p>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.title || ""}
        message={confirmDialog?.message || ""}
        variant={confirmDialog?.variant || "danger"}
        onConfirm={confirmDialog?.onConfirm || (() => {})}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
}
