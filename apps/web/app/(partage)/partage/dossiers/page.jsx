"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FolderOpen,
  FolderPlus,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Move,
  Share2,
  ChevronRight,
  Home,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Check,
  FileText,
  Grid,
  List,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Color options for folders
const folderColors = [
  { name: "Bleu", value: "#3498db" },
  { name: "Vert", value: "#2ecc71" },
  { name: "Rouge", value: "#e74c3c" },
  { name: "Orange", value: "#e67e22" },
  { name: "Violet", value: "#9b59b6" },
  { name: "Rose", value: "#e91e63" },
  { name: "Cyan", value: "#00bcd4" },
  { name: "Jaune", value: "#f1c40f" },
];

// Folder Card Component
function FolderCard({ folder, onEdit, onDelete, onMove, onShare, onClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isSharedWithMe = folder.isSharedWithMe;

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group relative"
      onClick={() => onClick(folder)}
    >
      {/* Shared Badge */}
      {isSharedWithMe && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Share2 className="w-3 h-3 mr-1" />
            Partagé
          </span>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center relative"
            style={{ backgroundColor: folder.color + "20" }}
          >
            <FolderOpen className="w-6 h-6" style={{ color: folder.color }} />
            {isSharedWithMe && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Share2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{folder.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {folder.itemCount?.folders || 0} dossiers, {folder.itemCount?.documents || 0} documents
            </p>
            {isSharedWithMe && folder.owner && (
              <p className="text-xs text-blue-500 dark:text-blue-400">
                Par {folder.owner.firstName} {folder.owner.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(folder);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(folder);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Move className="w-4 h-4" />
                  <span>Déplacer</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(folder);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>
                <hr className="my-1 border-gray-100 dark:border-slate-700" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(folder);
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {folder.description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {folder.description}
        </p>
      )}
    </div>
  );
}

// Create/Edit Folder Modal
function FolderModal({ isOpen, onClose, folder, onSave, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3498db");

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setDescription(folder.description || "");
      setColor(folder.color || "#3498db");
    } else {
      setName("");
      setDescription("");
      setColor("#3498db");
    }
  }, [folder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {folder ? "Modifier le dossier" : "Nouveau dossier"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du dossier *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex: Rapports 2024"
              className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Description du dossier..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Couleur
            </label>
            <div className="flex flex-wrap gap-2">
              {folderColors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                    color === c.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {color === c.value && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {folder ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteModal({ isOpen, onClose, folder, onConfirm, loading }) {
  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Supprimer le dossier
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Êtes-vous sûr de vouloir supprimer le dossier "{folder.name}" ?
            {(folder.itemCount?.folders > 0 || folder.itemCount?.documents > 0) && (
              <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                Ce dossier contient {folder.itemCount?.folders || 0} sous-dossier(s) et{" "}
                {folder.itemCount?.documents || 0} document(s) qui seront également supprimés.
              </span>
            )}
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => onConfirm(folder)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FoldersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState(null);
  const [saving, setSaving] = useState(false);

  // Check if we need to open create modal from URL
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setModalOpen(true);
      // Remove the query param
      router.replace("/partage/dossiers");
    }
  }, [searchParams, router]);

  // Fetch folders
  const fetchFolders = useCallback(async (parentId = null) => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const url = parentId
        ? `${API_URL}/folders?parentId=${parentId}&includeDocuments=false`
        : `${API_URL}/folders?parentId=root&includeDocuments=false`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des dossiers");
      }

      const data = await response.json();

      if (data.success) {
        setFolders(data.data.folders || []);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  // Load folders on mount
  useEffect(() => {
    fetchFolders(currentFolder?.id);
  }, [fetchFolders, currentFolder?.id]);

  // Navigate into folder
  const handleFolderClick = async (folder) => {
    setBreadcrumb((prev) => [...prev, folder]);
    setCurrentFolder(folder);
  };

  // Navigate back
  const handleNavigateBack = (index) => {
    if (index === -1) {
      // Go to root
      setBreadcrumb([]);
      setCurrentFolder(null);
    } else {
      // Go to specific folder
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);
      setCurrentFolder(newBreadcrumb[newBreadcrumb.length - 1] || null);
    }
  };

  // Create/Update folder
  const handleSaveFolder = async (data) => {
    if (!session?.accessToken) return;

    setSaving(true);

    try {
      const url = editingFolder
        ? `${API_URL}/folders/${editingFolder.id}`
        : `${API_URL}/folders`;

      const method = editingFolder ? "PUT" : "POST";

      const body = {
        ...data,
        parentId: currentFolder?.id || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la sauvegarde");
      }

      // Refresh folders
      await fetchFolders(currentFolder?.id);
      setModalOpen(false);
      setEditingFolder(null);
    } catch (error) {
      console.error("Error saving folder:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folder) => {
    if (!session?.accessToken) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/folders/${folder.id}?recursive=true`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      // Refresh folders
      await fetchFolders(currentFolder?.id);
      setDeleteModalOpen(false);
      setDeletingFolder(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter folders
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes dossiers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organisez vos documents dans des dossiers
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFolder(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FolderPlus className="w-5 h-5 mr-2" />
          Nouveau dossier
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm overflow-x-auto pb-2">
        <button
          onClick={() => handleNavigateBack(-1)}
          className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
            breadcrumb.length === 0
              ? "text-gray-900 dark:text-white font-medium"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Racine</span>
        </button>

        {breadcrumb.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => handleNavigateBack(index)}
              className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
                index === breadcrumb.length - 1
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un dossier..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-600 shadow"
                : "hover:bg-white/50 dark:hover:bg-slate-600/50"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-600 shadow"
                : "hover:bg-white/50 dark:hover:bg-slate-600/50"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="font-medium text-red-700 dark:text-red-300 mb-2">Erreur</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchFolders(currentFolder?.id)}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        </div>
      ) : filteredFolders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-100 dark:border-slate-700">
          <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun dossier trouvé" : "Aucun dossier"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery
              ? "Essayez avec d'autres termes de recherche"
              : "Créez votre premier dossier pour organiser vos documents"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => {
                setEditingFolder(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              Créer un dossier
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onEdit={(f) => {
                setEditingFolder(f);
                setModalOpen(true);
              }}
              onDelete={(f) => {
                setDeletingFolder(f);
                setDeleteModalOpen(true);
              }}
              onMove={(f) => alert("Déplacer: " + f.name)}
              onShare={(f) => alert("Partager: " + f.name)}
              onClick={handleFolderClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contenu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredFolders.map((folder) => (
                <tr
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: folder.color + "20" }}
                      >
                        <FolderOpen className="w-5 h-5" style={{ color: folder.color }} />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {folder.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {folder.itemCount?.folders || 0} dossiers, {folder.itemCount?.documents || 0} documents
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(folder.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolder(folder);
                          setModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingFolder(folder);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <FolderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
        onSave={handleSaveFolder}
        loading={saving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingFolder(null);
        }}
        folder={deletingFolder}
        onConfirm={handleDeleteFolder}
        loading={saving}
      />
    </div>
  );
}
