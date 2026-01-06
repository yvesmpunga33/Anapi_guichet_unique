"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  File,
  Image,
  FileSpreadsheet,
  FilePdf,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Plus,
  Grid,
  List,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";

export default function InvestorDocumentsPage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    totalSize: 0,
  });

  useEffect(() => {
    setPageTitle("Mes Documents");
  }, [setPageTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        total: 12,
        verified: 8,
        pending: 4,
        totalSize: 45.6,
      });

      setDocuments([
        {
          id: "doc-001",
          name: "Etude de faisabilite - Usine agricole",
          category: "Etudes",
          type: "pdf",
          size: 4.5,
          uploadDate: "2025-05-15",
          status: "verified",
          projectName: "Usine de transformation agricole",
        },
        {
          id: "doc-002",
          name: "Business plan 2025-2030",
          category: "Plans d'affaires",
          type: "pdf",
          size: 2.8,
          uploadDate: "2025-05-10",
          status: "verified",
          projectName: "Usine de transformation agricole",
        },
        {
          id: "doc-003",
          name: "Statuts de l'entreprise",
          category: "Juridique",
          type: "pdf",
          size: 1.2,
          uploadDate: "2025-04-20",
          status: "verified",
          projectName: null,
        },
        {
          id: "doc-004",
          name: "Etude d'impact environnemental",
          category: "Environnement",
          type: "pdf",
          size: 8.3,
          uploadDate: "2025-11-25",
          status: "pending",
          projectName: "Centrale solaire Katanga",
        },
        {
          id: "doc-005",
          name: "Permis de construire",
          category: "Autorisations",
          type: "pdf",
          size: 0.8,
          uploadDate: "2025-06-01",
          status: "verified",
          projectName: "Usine de transformation agricole",
        },
        {
          id: "doc-006",
          name: "Plan financier previsionnel",
          category: "Financier",
          type: "xlsx",
          size: 1.5,
          uploadDate: "2025-12-10",
          status: "pending",
          projectName: "Hotel ecotouristique Virunga",
        },
        {
          id: "doc-007",
          name: "RCCM et numero impot",
          category: "Juridique",
          type: "pdf",
          size: 0.5,
          uploadDate: "2025-04-15",
          status: "verified",
          projectName: null,
        },
        {
          id: "doc-008",
          name: "Photos du site - Virunga",
          category: "Multimedia",
          type: "zip",
          size: 15.2,
          uploadDate: "2025-12-20",
          status: "pending",
          projectName: "Hotel ecotouristique Virunga",
        },
        {
          id: "doc-009",
          name: "Contrat de partenariat local",
          category: "Juridique",
          type: "pdf",
          size: 2.1,
          uploadDate: "2025-08-05",
          status: "verified",
          projectName: "Centrale solaire Katanga",
        },
        {
          id: "doc-010",
          name: "Plan architectural",
          category: "Technique",
          type: "pdf",
          size: 5.8,
          uploadDate: "2025-12-28",
          status: "pending",
          projectName: "Hotel ecotouristique Virunga",
        },
        {
          id: "doc-011",
          name: "Certificat d'agrement",
          category: "Agrements",
          type: "pdf",
          size: 0.3,
          uploadDate: "2025-06-10",
          status: "verified",
          projectName: "Usine de transformation agricole",
        },
        {
          id: "doc-012",
          name: "Rapport d'audit financier 2024",
          category: "Financier",
          type: "pdf",
          size: 3.1,
          uploadDate: "2025-03-15",
          status: "verified",
          projectName: null,
        },
      ]);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getFileIcon = (type) => {
    const icons = {
      pdf: FilePdf,
      xlsx: FileSpreadsheet,
      xls: FileSpreadsheet,
      jpg: Image,
      png: Image,
      zip: FolderOpen,
    };
    return icons[type] || File;
  };

  const getFileIconColor = (type) => {
    const colors = {
      pdf: "text-red-500",
      xlsx: "text-green-500",
      xls: "text-green-500",
      jpg: "text-blue-500",
      png: "text-blue-500",
      zip: "text-yellow-500",
    };
    return colors[type] || "text-gray-500";
  };

  const categories = [...new Set(documents.map((d) => d.category))];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de vos documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerez tous vos documents d'investissement</p>
        </div>
        <button className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg">
          <Upload className="w-5 h-5 mr-2" />
          Telecharger un document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#0A1628] dark:text-[#D4A853]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.verified}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verifies</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSize} MB</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Espace utilise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
          >
            <option value="all">Toutes les categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            >
              <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            >
              <Grid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents List/Grid */}
      {viewMode === "list" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Document</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Categorie</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Projet</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${getFileIconColor(doc.type)}`}>
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} MB</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {doc.projectName || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === "verified" ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(doc.uploadDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#D4A853] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#D4A853] transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.type);
            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#D4A853]/50 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-3 ${getFileIconColor(doc.type)}`}>
                  <FileIcon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
                  {doc.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{doc.size} MB</span>
                  {doc.status === "verified" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 p-2 text-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#D4A853] transition-colors">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 text-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#D4A853] transition-colors">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucun document trouve</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Commencez par telecharger vos premiers documents.
          </p>
          <button className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all">
            <Upload className="w-5 h-5 mr-2" />
            Telecharger un document
          </button>
        </div>
      )}
    </div>
  );
}
