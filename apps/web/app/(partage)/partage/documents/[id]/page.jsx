"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Share2,
  Star,
  Trash2,
  Edit,
  Eye,
  Clock,
  User,
  Folder,
  FileText,
  MoreVertical,
  MessageSquare,
  History,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  Send,
  ChevronDown,
  Lock,
  Unlock,
  Calendar,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Film,
  Music,
  File,
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get file type info
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

// Tab Component
function Tab({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          active
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Comment Component
function Comment({ comment, onReply, onResolve }) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  return (
    <div className={`p-4 rounded-lg ${comment.isResolved ? "bg-gray-50 dark:bg-slate-700/30" : "bg-white dark:bg-slate-800"} border border-gray-100 dark:border-slate-700`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {comment.author?.firstName?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.author?.firstName} {comment.author?.lastName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(modifié)</span>
              )}
            </div>
            {comment.isResolved && (
              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full">
                Résolu
              </span>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              Répondre
            </button>
            {!comment.isResolved && (
              <button
                onClick={() => onResolve(comment.id)}
                className="text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
              >
                Marquer résolu
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReply && (
            <div className="mt-3 flex items-center space-x-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre réponse..."
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  onReply(comment.id, replyContent);
                  setReplyContent("");
                  setShowReply(false);
                }}
                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-slate-600 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {reply.author?.firstName}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Version Item
function VersionItem({ version, isCurrent }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${isCurrent ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800" : "bg-gray-50 dark:bg-slate-700/50"}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCurrent ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300"}`}>
          v{version.versionNumber}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {version.name}
            {isCurrent && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">(actuelle)</span>}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(version.createdAt)} • {formatFileSize(version.size)}
          </p>
          {version.changeLog && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{version.changeLog}</p>
          )}
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg">
        <Download className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

// User Search Result Item
function UserSearchItem({ user, onSelect, isSelected }) {
  return (
    <button
      onClick={() => onSelect(user)}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
        isSelected
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500"
          : "hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          user.firstName?.charAt(0) || user.name?.charAt(0) || "U"
        )}
      </div>
      {/* User Info */}
      <div className="flex-1 text-left min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.name || user.email}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
        {user.department && (
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.department}</p>
        )}
      </div>
      {/* Selection indicator */}
      {isSelected && (
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
}

// Selected User Badge
function SelectedUserBadge({ user, onRemove }) {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
        {user.firstName?.charAt(0) || user.name?.charAt(0) || "U"}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
      </div>
      <button
        onClick={() => onRemove(user)}
        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Share Modal
function ShareModal({ isOpen, onClose, documentName }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [permission, setPermission] = useState("view");
  const [copied, setCopied] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simulated users list - In real app, this would come from API
  const allUsers = [
    { id: "1", firstName: "Marie", lastName: "Martin", email: "marie.martin@anapi.cd", department: "Direction Générale", image: null },
    { id: "2", firstName: "Pierre", lastName: "Durand", email: "pierre.durand@anapi.cd", department: "Finance", image: null },
    { id: "3", firstName: "Sophie", lastName: "Bernard", email: "sophie.bernard@anapi.cd", department: "Ressources Humaines", image: null },
    { id: "4", firstName: "Luc", lastName: "Petit", email: "luc.petit@anapi.cd", department: "IT", image: null },
    { id: "5", firstName: "Julie", lastName: "Moreau", email: "julie.moreau@anapi.cd", department: "Juridique", image: null },
    { id: "6", firstName: "Thomas", lastName: "Lefebvre", email: "thomas.lefebvre@anapi.cd", department: "Investissements", image: null },
    { id: "7", firstName: "Emma", lastName: "Garcia", email: "emma.garcia@anapi.cd", department: "Communication", image: null },
    { id: "8", firstName: "Nicolas", lastName: "Dubois", email: "nicolas.dubois@anapi.cd", department: "Guichet Unique", image: null },
  ];

  // Search users
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const query = searchQuery.toLowerCase();
        const results = allUsers.filter(
          (user) =>
            !selectedUsers.find((s) => s.id === user.id) &&
            (user.firstName?.toLowerCase().includes(query) ||
              user.lastName?.toLowerCase().includes(query) ||
              user.email?.toLowerCase().includes(query) ||
              user.department?.toLowerCase().includes(query))
        );
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, selectedUsers]);

  const handleSelectUser = (user) => {
    if (!selectedUsers.find((s) => s.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery("");
    setShowResults(false);
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((s) => s.id !== user.id));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (selectedUsers.length === 0) return;
    console.log("Sharing with:", selectedUsers, "Permission:", permission);
    // API call to share document
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Partager "{documentName}"
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* User Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                placeholder="Nom, email ou département..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchResults.map((user) => (
                  <UserSearchItem
                    key={user.id}
                    user={user}
                    onSelect={handleSelectUser}
                    isSelected={false}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {showResults && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun utilisateur trouvé pour "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Utilisateurs sélectionnés ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <SelectedUserBadge key={user.id} user={user} onRemove={handleRemoveUser} />
                ))}
              </div>
            </div>
          )}

          {/* Permission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permission
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="view">Lecture seule - Peut uniquement voir le document</option>
              <option value="download">Téléchargement - Peut voir et télécharger</option>
              <option value="edit">Modification - Peut modifier le document</option>
              <option value="full">Accès complet - Tous les droits</option>
            </select>
          </div>

          {/* Copy Link */}
          <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Lien de partage</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex items-center justify-end space-x-3 pt-4 mt-4 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleShare}
            disabled={selectedUsers.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Partager avec {selectedUsers.length > 0 ? `${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? "s" : ""}` : "..."}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showShareModal, setShowShareModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchDocument();
  }, [params.id]);

  const fetchDocument = async () => {
    try {
      // Simulate API call
      setDocument({
        id: params.id,
        name: "Rapport Annuel 2024.pdf",
        originalName: "Rapport_Annuel_2024.pdf",
        description: "Rapport annuel des activités de l'ANAPI pour l'année 2024. Ce document contient les statistiques d'investissements, les projets réalisés et les perspectives pour l'année à venir.",
        mimeType: "application/pdf",
        size: 2457600,
        version: 3,
        status: "active",
        isPublic: false,
        downloadCount: 45,
        viewCount: 128,
        createdAt: new Date(Date.now() - 604800000),
        updatedAt: new Date(Date.now() - 86400000),
        lastAccessedAt: new Date(),
        owner: { id: "1", firstName: "Jean", lastName: "Dupont", email: "jean.dupont@anapi.cd" },
        folder: { id: "1", name: "Rapports" },
        tags: ["rapport", "annuel", "2024", "investissements"],
        versions: [
          { id: "v3", versionNumber: 3, name: "Rapport_Annuel_2024_v3.pdf", size: 2457600, createdAt: new Date(Date.now() - 86400000), changeLog: "Correction des graphiques" },
          { id: "v2", versionNumber: 2, name: "Rapport_Annuel_2024_v2.pdf", size: 2400000, createdAt: new Date(Date.now() - 259200000), changeLog: "Ajout des statistiques Q4" },
          { id: "v1", versionNumber: 1, name: "Rapport_Annuel_2024.pdf", size: 2200000, createdAt: new Date(Date.now() - 604800000), changeLog: "Version initiale" },
        ],
        shares: [
          { id: "s1", user: { firstName: "Marie", lastName: "Martin", email: "marie@anapi.cd" }, permission: "view", createdAt: new Date() },
          { id: "s2", user: { firstName: "Pierre", lastName: "Durand", email: "pierre@anapi.cd" }, permission: "edit", createdAt: new Date() },
        ],
        comments: [
          {
            id: "c1",
            content: "Excellent rapport, très complet. Pourriez-vous ajouter les données sur les investissements par secteur?",
            author: { firstName: "Sophie", lastName: "Bernard" },
            createdAt: new Date(Date.now() - 172800000),
            isResolved: false,
            replies: [
              { id: "r1", content: "C'est noté, je vais préparer une mise à jour.", author: { firstName: "Jean" }, createdAt: new Date(Date.now() - 86400000) },
            ],
          },
          {
            id: "c2",
            content: "La mise en page de la page 12 nécessite des corrections.",
            author: { firstName: "Luc", lastName: "Petit" },
            createdAt: new Date(Date.now() - 259200000),
            isResolved: true,
            replies: [],
          },
        ],
        isFavorite: true,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching document:", error);
      setLoading(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // Add comment logic
    console.log("Adding comment:", newComment);
    setNewComment("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Document non trouvé
        </h3>
        <Link href="/partage/documents" className="text-emerald-600 hover:underline">
          Retour aux documents
        </Link>
      </div>
    );
  }

  const { icon: FileIcon, color, bg } = getFileTypeInfo(document.mimeType);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/partage/documents"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux documents
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Document Info */}
          <div className="flex items-start space-x-4">
            <div className={`p-4 rounded-2xl ${bg}`}>
              <FileIcon className={`w-12 h-12 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {document.name}
                </h1>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                  <Star
                    className={`w-5 h-5 ${
                      document.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {document.owner?.firstName} {document.owner?.lastName}
                </span>
                <span className="flex items-center">
                  <Folder className="w-4 h-4 mr-1" />
                  {document.folder?.name || "Racine"}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(document.createdAt)}
                </span>
              </div>
              {/* Tags */}
              {document.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </button>
            <button className="p-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{document.viewCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Vues</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{document.downloadCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Téléchargements</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{document.shares?.length || 0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Partages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">v{document.version}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-gray-100 dark:border-slate-700">
          <div className="flex overflow-x-auto">
            <Tab label="Détails" active={activeTab === "details"} onClick={() => setActiveTab("details")} />
            <Tab label="Commentaires" active={activeTab === "comments"} onClick={() => setActiveTab("comments")} count={document.comments?.length} />
            <Tab label="Versions" active={activeTab === "versions"} onClick={() => setActiveTab("versions")} count={document.versions?.length} />
            <Tab label="Partages" active={activeTab === "shares"} onClick={() => setActiveTab("shares")} count={document.shares?.length} />
          </div>
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {document.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{document.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Informations
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Taille</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">{formatFileSize(document.size)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">{document.mimeType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Extension</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">.{document.originalName?.split(".").pop()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Statut</dt>
                      <dd>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          document.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {document.status === "active" ? "Actif" : document.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Dates
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Créé le</dt>
                      <dd className="text-gray-900 dark:text-white">{formatDate(document.createdAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Modifié le</dt>
                      <dd className="text-gray-900 dark:text-white">{formatDate(document.updatedAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Dernier accès</dt>
                      <dd className="text-gray-900 dark:text-white">{formatDate(document.lastAccessedAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              {/* New Comment */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Commenter
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                {document.comments?.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onReply={(id, content) => console.log("Reply:", id, content)}
                    onResolve={(id) => console.log("Resolve:", id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Versions Tab */}
          {activeTab === "versions" && (
            <div className="space-y-3">
              {document.versions?.map((version, index) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  isCurrent={index === 0}
                />
              ))}
            </div>
          )}

          {/* Shares Tab */}
          {activeTab === "shares" && (
            <div className="space-y-4">
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Nouveau partage
              </button>

              <div className="space-y-3">
                {document.shares?.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                        {share.user?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {share.user?.firstName} {share.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{share.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        share.permission === "edit"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {share.permission === "edit" ? "Modification" : share.permission === "view" ? "Lecture" : share.permission}
                      </span>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentName={document.name}
      />
    </div>
  );
}
