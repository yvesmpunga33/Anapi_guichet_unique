"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  Upload,
  Download,
  Share2,
  Eye,
  Trash2,
  Edit,
  FolderPlus,
  FileText,
  MessageSquare,
  UserPlus,
  UserMinus,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowDownToLine,
} from "lucide-react";

// Format date
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;

  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get action icon and color
const getActionInfo = (action) => {
  const actions = {
    document_created: {
      icon: Upload,
      color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
      label: "Upload",
    },
    document_viewed: {
      icon: Eye,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
      label: "Consultation",
    },
    document_downloaded: {
      icon: Download,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
      label: "Téléchargement",
    },
    document_updated: {
      icon: Edit,
      color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
      label: "Modification",
    },
    document_deleted: {
      icon: Trash2,
      color: "text-red-500 bg-red-100 dark:bg-red-900/30",
      label: "Suppression",
    },
    share_created: {
      icon: Share2,
      color: "text-teal-500 bg-teal-100 dark:bg-teal-900/30",
      label: "Partage créé",
    },
    share_revoked: {
      icon: UserMinus,
      color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30",
      label: "Partage révoqué",
    },
    share_accessed: {
      icon: UserPlus,
      color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
      label: "Accès via partage",
    },
    folder_created: {
      icon: FolderPlus,
      color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
      label: "Dossier créé",
    },
    comment_created: {
      icon: MessageSquare,
      color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
      label: "Commentaire",
    },
    comment_resolved: {
      icon: MessageSquare,
      color: "text-green-500 bg-green-100 dark:bg-green-900/30",
      label: "Commentaire résolu",
    },
  };

  return actions[action] || {
    icon: Activity,
    color: "text-gray-500 bg-gray-100 dark:bg-gray-900/30",
    label: "Action",
  };
};

// Activity Item Component
function ActivityItem({ activity }) {
  const { icon: ActionIcon, color, label } = getActionInfo(activity.action);

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
      {/* Icon */}
      <div className={`p-3 rounded-xl ${color}`}>
        <ActionIcon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(activity.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-900 dark:text-white mt-1">
          {activity.description}
        </p>
        {activity.metadata?.ipAddress && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            IP: {activity.metadata.ipAddress}
          </p>
        )}
      </div>
    </div>
  );
}

// Filter Chip
function FilterChip({ label, active, onClick, count }) {
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
      {count !== undefined && (
        <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
          active
            ? "bg-emerald-200 dark:bg-emerald-800"
            : "bg-gray-200 dark:bg-slate-600"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Stats Card
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const actionTypes = [
    { key: "all", label: "Toutes" },
    { key: "document", label: "Documents" },
    { key: "share", label: "Partages" },
    { key: "folder", label: "Dossiers" },
    { key: "comment", label: "Commentaires" },
  ];

  const periods = [
    { key: "24h", label: "24 heures" },
    { key: "7d", label: "7 jours" },
    { key: "30d", label: "30 jours" },
    { key: "90d", label: "90 jours" },
  ];

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [filter, period, page]);

  const fetchActivities = async () => {
    try {
      // Simulate API call
      const mockActivities = [
        {
          id: 1,
          action: "document_created",
          description: 'Document "Rapport Annuel 2024.pdf" uploadé',
          createdAt: new Date(),
          metadata: { ipAddress: "192.168.1.100" },
        },
        {
          id: 2,
          action: "share_created",
          description: '"Budget Prévisionnel.xlsx" partagé avec Marie Martin',
          createdAt: new Date(Date.now() - 1800000),
          metadata: {},
        },
        {
          id: 3,
          action: "document_viewed",
          description: '"Présentation Projet.pptx" consulté',
          createdAt: new Date(Date.now() - 3600000),
          metadata: { ipAddress: "192.168.1.101" },
        },
        {
          id: 4,
          action: "document_downloaded",
          description: '"Contrat de Service.pdf" téléchargé',
          createdAt: new Date(Date.now() - 7200000),
          metadata: {},
        },
        {
          id: 5,
          action: "folder_created",
          description: 'Dossier "Projets 2024" créé',
          createdAt: new Date(Date.now() - 14400000),
          metadata: {},
        },
        {
          id: 6,
          action: "share_revoked",
          description: 'Accès de Pierre Durand à "Plan Marketing.pdf" révoqué',
          createdAt: new Date(Date.now() - 28800000),
          metadata: {},
        },
        {
          id: 7,
          action: "comment_created",
          description: 'Commentaire ajouté sur "Cahier des charges.docx"',
          createdAt: new Date(Date.now() - 43200000),
          metadata: {},
        },
        {
          id: 8,
          action: "document_updated",
          description: 'Nouvelle version de "Planning Q1.xlsx" uploadée',
          createdAt: new Date(Date.now() - 86400000),
          metadata: { ipAddress: "192.168.1.102" },
        },
        {
          id: 9,
          action: "document_deleted",
          description: '"Brouillon.txt" déplacé vers la corbeille',
          createdAt: new Date(Date.now() - 172800000),
          metadata: {},
        },
        {
          id: 10,
          action: "share_accessed",
          description: 'Sophie Bernard a accédé à "Documentation API.pdf"',
          createdAt: new Date(Date.now() - 259200000),
          metadata: {},
        },
      ];

      // Filter activities
      let filtered = mockActivities;
      if (filter !== "all") {
        filtered = mockActivities.filter((a) => a.action.startsWith(filter));
      }
      if (searchQuery) {
        filtered = filtered.filter((a) =>
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setActivities(filtered);
      setTotalPages(Math.ceil(filtered.length / 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Simulate API call
      setStats({
        total: 156,
        uploads: 42,
        downloads: 78,
        shares: 36,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleExport = async () => {
    // Export functionality
    console.log("Exporting activities...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Journal d'activités
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Suivez toutes les actions sur vos documents
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowDownToLine className="w-4 h-4 mr-2" />
          Exporter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total activités" value={stats.total} icon={Activity} color="emerald" />
        <StatCard title="Uploads" value={stats.uploads} icon={Upload} color="blue" />
        <StatCard title="Téléchargements" value={stats.downloads} icon={Download} color="purple" />
        <StatCard title="Partages" value={stats.shares} icon={Share2} color="orange" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les activités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Period Filter */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {periods.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={() => {
              setLoading(true);
              fetchActivities();
              fetchStats();
            }}
            className="p-2 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Action Type Filters */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          {actionTypes.map((type) => (
            <FilterChip
              key={type.key}
              label={type.label}
              active={filter === type.key}
              onClick={() => setFilter(type.key)}
            />
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {activities.length > 0 ? (
          <>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-slate-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune activité
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Aucune activité ne correspond à votre recherche"
                : "Aucune activité enregistrée pour cette période"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
