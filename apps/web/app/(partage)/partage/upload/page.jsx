"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  FileCode,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderOpen,
  Tag,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  ZoomIn,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get file icon based on mime type
const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith("image/")) return ImageIcon;
  if (mimeType?.includes("spreadsheet") || mimeType?.includes("excel")) return FileSpreadsheet;
  if (mimeType?.includes("pdf")) return FileText;
  if (mimeType?.includes("zip") || mimeType?.includes("archive")) return FileArchive;
  if (mimeType?.startsWith("video/")) return Film;
  if (mimeType?.startsWith("audio/")) return Music;
  if (mimeType?.includes("code") || mimeType?.includes("javascript")) return FileCode;
  return File;
};

// File Preview Modal
function FilePreviewModal({ file, onClose }) {
  const isImage = file?.type?.startsWith("image/");
  const isPdf = file?.type?.includes("pdf");
  const isVideo = file?.type?.startsWith("video/");
  const isAudio = file?.type?.startsWith("audio/");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file && (isImage || isPdf || isVideo || isAudio)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage, isPdf, isVideo, isAudio]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {(() => {
                const FileIcon = getFileIcon(file.type);
                return <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
              })()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white truncate max-w-md">{file.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex items-center justify-center bg-gray-100 dark:bg-slate-900">
          {isImage && previewUrl && (
            <img
              src={previewUrl}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
            />
          )}
          {isPdf && previewUrl && (
            <iframe
              src={previewUrl}
              title={file.name}
              className="w-full h-[70vh] rounded-lg"
            />
          )}
          {isVideo && previewUrl && (
            <video
              src={previewUrl}
              controls
              className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            />
          )}
          {isAudio && previewUrl && (
            <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl">
              <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-center text-gray-900 dark:text-white font-medium mb-4">{file.name}</p>
              <audio src={previewUrl} controls className="w-full" />
            </div>
          )}
          {!isImage && !isPdf && !isVideo && !isAudio && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const FileIcon = getFileIcon(file.type);
                  return <FileIcon className="w-12 h-12 text-gray-400" />;
                })()}
              </div>
              <p className="text-gray-500 dark:text-gray-400">Aperçu non disponible pour ce type de fichier</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{file.type || "Type inconnu"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// File Card Component with Preview
function FileCard({ fileItem, onRemove, onPreview }) {
  const { file, status, progress, error } = fileItem;
  const FileIcon = getFileIcon(file.type);
  const isImage = file.type?.startsWith("image/");
  const [thumbnail, setThumbnail] = useState(null);

  // Generate thumbnail for images
  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setThumbnail(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  const statusColors = {
    pending: "border-gray-200 dark:border-slate-600",
    uploading: "border-blue-400 dark:border-blue-600",
    success: "border-emerald-400 dark:border-emerald-600",
    error: "border-red-400 dark:border-red-600",
  };

  const statusBg = {
    pending: "bg-white dark:bg-slate-800",
    uploading: "bg-blue-50 dark:bg-blue-900/20",
    success: "bg-emerald-50 dark:bg-emerald-900/20",
    error: "bg-red-50 dark:bg-red-900/20",
  };

  return (
    <div
      className={`relative rounded-xl border-2 ${statusColors[status]} ${statusBg[status]} overflow-hidden transition-all hover:shadow-lg group`}
    >
      {/* Thumbnail / Icon Preview */}
      <div
        className="relative h-32 bg-gray-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer"
        onClick={() => onPreview(file)}
      >
        {isImage && thumbnail ? (
          <img
            src={thumbnail}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        )}

        {/* Overlay with preview icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <div className="p-2 bg-white/90 rounded-full">
            <Eye className="w-5 h-5 text-gray-700" />
          </div>
        </div>

        {/* Status indicator */}
        {status === "uploading" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
              <span className="text-white text-sm font-medium">{progress}%</span>
            </div>
          </div>
        )}
        {status === "success" && (
          <div className="absolute top-2 right-2">
            <div className="p-1 bg-emerald-500 rounded-full">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="absolute top-2 right-2">
            <div className="p-1 bg-red-500 rounded-full">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate" title={file.name}>
          {file.name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatFileSize(file.size)}
        </p>

        {/* Error message */}
        {status === "error" && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1 truncate" title={error}>
            {error}
          </p>
        )}

        {/* Progress bar */}
        {status === "uploading" && (
          <div className="mt-2">
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Remove button */}
      {status === "pending" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-800/90 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </button>
      )}
    </div>
  );
}

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Folders state
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [foldersError, setFoldersError] = useState(null);

  // Fetch folders from API
  const fetchFolders = useCallback(async () => {
    if (!session?.accessToken) return;

    setLoadingFolders(true);
    setFoldersError(null);

    try {
      const response = await fetch(`${API_URL}/folders/tree`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des dossiers");
      }

      const data = await response.json();

      // Flatten tree for select
      const flattenTree = (nodes, prefix = "") => {
        let result = [];
        for (const node of nodes) {
          result.push({
            id: node.id,
            name: prefix + node.name,
            color: node.color,
          });
          if (node.children && node.children.length > 0) {
            result = result.concat(flattenTree(node.children, prefix + "  "));
          }
        }
        return result;
      };

      if (data.success && data.data?.tree) {
        setFolders(flattenTree(data.data.tree));
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      setFoldersError(error.message);
    } finally {
      setLoadingFolders(false);
    }
  }, [session?.accessToken]);

  // Load folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      progress: 0,
      error: null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Remove file from list
  const removeFile = useCallback((fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0 || !session?.accessToken) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      if (fileItem.status !== "pending") continue;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: "uploading" } : f
        )
      );

      try {
        // Create form data
        const formData = new FormData();
        formData.append("file", fileItem.file);
        if (selectedFolder) formData.append("folderId", selectedFolder);
        if (description) formData.append("description", description);
        if (tags.length > 0) formData.append("tags", JSON.stringify(tags));

        // Upload with progress tracking
        const xhr = new XMLHttpRequest();

        await new Promise((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileItem.id ? { ...f, progress } : f
                )
              );
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
            } else {
              reject(new Error(xhr.responseText || "Erreur d'upload"));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Erreur réseau"));
          });

          xhr.open("POST", `${API_URL}/documents`);
          xhr.setRequestHeader("Authorization", `Bearer ${session.accessToken}`);
          xhr.send(formData);
        });

        // Mark as success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, status: "success", progress: 100 } : f
          )
        );
      } catch (error) {
        // Mark as error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "error", error: error.message || "Erreur d'upload" }
              : f
          )
        );
      }
    }

    setUploading(false);
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload de documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Uploadez vos fichiers en les glissant ou en les sélectionnant
          </p>
        </div>
        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={pendingCount === 0 || uploading}
            className={`inline-flex items-center px-5 py-2.5 rounded-xl font-medium transition-all ${
              pendingCount === 0 || uploading
                ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Uploader {pendingCount > 0 && `(${pendingCount})`}
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Drop Zone and Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compact Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-slate-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.mp4,.mp3"
            />

            <div className="flex items-center justify-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDragging
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-gray-100 dark:bg-slate-700"
                }`}
              >
                <Upload
                  className={`w-6 h-6 ${
                    isDragging ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {isDragging ? "Déposez vos fichiers ici" : "Glissez vos fichiers ici"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ou <span className="text-blue-600 dark:text-blue-400">cliquez pour parcourir</span> • Max 100 MB
                </p>
              </div>
            </div>
          </div>

          {/* Files Grid */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Fichiers sélectionnés ({files.length})
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  {successCount > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {successCount} uploadé{successCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errorCount} erreur{errorCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {!uploading && files.length > 0 && (
                    <button
                      onClick={clearFiles}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Tout effacer
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of file cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((fileItem) => (
                  <FileCard
                    key={fileItem.id}
                    fileItem={fileItem}
                    onRemove={() => removeFile(fileItem.id)}
                    onPreview={(file) => setPreviewFile(file)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {files.length === 0 && (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun fichier sélectionné
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Glissez vos fichiers dans la zone ci-dessus ou cliquez pour les sélectionner
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Sélectionner des fichiers
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Options */}
        <div className="space-y-6">
          {/* Options Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 space-y-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">Options d'upload</h3>

            {/* Folder Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FolderOpen className="w-4 h-4 inline mr-2" />
                Dossier de destination
              </label>

              {loadingFolders ? (
                <div className="flex items-center space-x-2 px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Chargement...</span>
                </div>
              ) : foldersError ? (
                <div className="flex items-center justify-between px-3 py-2.5 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <span className="text-sm text-red-600 dark:text-red-400">Erreur</span>
                  <button
                    onClick={fetchFolders}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ) : (
                <select
                  value={selectedFolder || ""}
                  onChange={(e) => setSelectedFolder(e.target.value || null)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Racine (aucun dossier)</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Quick create folder link */}
              <div className="mt-2">
                <Link
                  href="/partage/dossiers?create=true"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Créer un nouveau dossier
                </Link>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Ajoutez une description..."
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Tags
              </label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  placeholder="Ajouter un tag..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTag}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleUpload}
              disabled={pendingCount === 0 || uploading}
              className={`w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-medium transition-all ${
                pendingCount === 0 || uploading
                  ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Uploader {pendingCount > 0 && `(${pendingCount})`}
                </>
              )}
            </button>
            <Link
              href="/partage/documents"
              className="w-full text-center py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              Annuler
            </Link>
          </div>

          {/* Success Message */}
          {successCount > 0 && successCount === files.length && !uploading && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                Upload terminé!
              </h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">
                {successCount} fichier{successCount > 1 ? "s" : ""} uploadé{successCount > 1 ? "s" : ""}
              </p>
              <Link
                href="/partage/documents"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
              >
                Voir mes documents
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
