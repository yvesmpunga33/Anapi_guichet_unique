"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Share2,
  Clock,
  Upload,
  Star,
  TrendingUp,
  Users,
  Download,
  Eye,
  ArrowUpRight,
  MoreVertical,
  File,
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
  });
};

// Get file icon based on mime type
const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith("image/")) return ImageIcon;
  if (mimeType?.includes("spreadsheet") || mimeType?.includes("excel")) return FileSpreadsheet;
  if (mimeType?.includes("zip") || mimeType?.includes("archive")) return FileArchive;
  if (mimeType?.startsWith("video/")) return Film;
  if (mimeType?.startsWith("audio/")) return Music;
  if (mimeType?.includes("code") || mimeType?.includes("javascript") || mimeType?.includes("json"))
    return FileCode;
  return FileText;
};

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, trendValue, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            <TrendingUp className={`w-4 h-4 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
    </div>
  );
}

// Recent Document Card
function RecentDocumentCard({ document }) {
  const FileIcon = getFileIcon(document.mimeType);

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
          <FileIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
            {document.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(document.size)} • {formatDate(document.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Eye className="w-4 h-4 text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Download className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// Activity Item
function ActivityItem({ activity }) {
  const getActivityIcon = (action) => {
    switch (action) {
      case "document_created":
        return { icon: Upload, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30" };
      case "document_viewed":
        return { icon: Eye, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" };
      case "document_downloaded":
        return { icon: Download, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" };
      case "share_created":
        return { icon: Share2, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30" };
      default:
        return { icon: FileText, color: "text-gray-500 bg-gray-100 dark:bg-gray-900/30" };
    }
  };

  const { icon: ActivityIcon, color } = getActivityIcon(activity.action);

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <ActivityIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatDate(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}

// Shared With Me Card
function SharedWithMeCard({ share }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
          {share.sharedBy?.firstName?.charAt(0) || "U"}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{share.document?.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Partagé par {share.sharedBy?.firstName} {share.sharedBy?.lastName}
          </p>
        </div>
      </div>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          share.permission === "edit"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
        }`}
      >
        {share.permission === "edit" ? "Modification" : "Lecture"}
      </span>
    </div>
  );
}

// Quick Action Button
function QuickAction({ icon: Icon, label, href, color }) {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    emerald: "bg-emerald-500 hover:bg-emerald-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${colorClasses[color]} text-white transition-colors`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export default function PartageDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalFolders: 0,
    sharedWithMe: 0,
    sharedByMe: 0,
    totalSize: 0,
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API calls
      setStats({
        totalDocuments: 156,
        totalFolders: 23,
        sharedWithMe: 42,
        sharedByMe: 18,
        totalSize: 2684354560, // 2.5 GB
      });

      setRecentDocuments([
        {
          id: 1,
          name: "Rapport Annuel 2024.pdf",
          mimeType: "application/pdf",
          size: 2457600,
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "Budget Prévisionnel.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 1048576,
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          id: 3,
          name: "Présentation Projet.pptx",
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          size: 5242880,
          createdAt: new Date(Date.now() - 172800000),
        },
        {
          id: 4,
          name: "Photo Equipe.jpg",
          mimeType: "image/jpeg",
          size: 3145728,
          createdAt: new Date(Date.now() - 259200000),
        },
      ]);

      setRecentActivity([
        {
          id: 1,
          action: "document_created",
          description: 'Document "Rapport Annuel 2024.pdf" uploadé',
          createdAt: new Date(),
        },
        {
          id: 2,
          action: "share_created",
          description: '"Budget Prévisionnel.xlsx" partagé avec Jean Dupont',
          createdAt: new Date(Date.now() - 3600000),
        },
        {
          id: 3,
          action: "document_viewed",
          description: '"Présentation Projet.pptx" consulté',
          createdAt: new Date(Date.now() - 7200000),
        },
        {
          id: 4,
          action: "document_downloaded",
          description: '"Contrat de Service.pdf" téléchargé',
          createdAt: new Date(Date.now() - 86400000),
        },
      ]);

      setSharedWithMe([
        {
          id: 1,
          document: { name: "Cahier des charges.docx" },
          sharedBy: { firstName: "Marie", lastName: "Martin" },
          permission: "edit",
        },
        {
          id: 2,
          document: { name: "Plan Marketing 2024.pdf" },
          sharedBy: { firstName: "Pierre", lastName: "Durand" },
          permission: "view",
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bienvenue, {session?.user?.name?.split(" ")[0] || "Utilisateur"}!
            </h1>
            <p className="text-emerald-100">
              Gérez et partagez vos documents en toute sécurité
            </p>
          </div>
          <Link
            href="/partage/upload"
            className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Nouveau document</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Documents"
          value={stats.totalDocuments}
          icon={FileText}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        <StatCard
          title="Dossiers"
          value={stats.totalFolders}
          icon={FolderOpen}
          color="emerald"
        />
        <StatCard
          title="Partagés avec moi"
          value={stats.sharedWithMe}
          icon={Share2}
          trend="up"
          trendValue="+5"
          color="purple"
        />
        <StatCard
          title="Espace utilisé"
          value={formatFileSize(stats.totalSize)}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction icon={Upload} label="Upload" href="/partage/upload" color="emerald" />
          <QuickAction icon={FolderOpen} label="Nouveau dossier" href="/partage/dossiers?new=true" color="blue" />
          <QuickAction icon={Share2} label="Partager" href="/partage/partages/envoyes" color="purple" />
          <QuickAction icon={Star} label="Favoris" href="/partage/favoris" color="orange" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents récents</h2>
            <Link
              href="/partage/documents"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
            >
              Voir tout
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentDocuments.map((doc) => (
              <RecentDocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h2>
            <Link
              href="/partage/activites"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
            >
              Voir tout
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-4 divide-y divide-gray-100 dark:divide-slate-700">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Shared With Me Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-emerald-500" />
              Partagés avec moi
            </span>
          </h2>
          <Link
            href="/partage/partages/recus"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
          >
            Voir tout
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedWithMe.map((share) => (
            <SharedWithMeCard key={share.id} share={share} />
          ))}
        </div>
      </div>
    </div>
  );
}
