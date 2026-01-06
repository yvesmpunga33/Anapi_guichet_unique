"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Award,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Calendar,
  Building,
  ArrowRight,
  Download,
  ChevronRight,
  Shield,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";

export default function InvestorApprovalsPage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [approvals, setApprovals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    inReview: 0,
  });

  useEffect(() => {
    setPageTitle("Mes Agrements");
  }, [setPageTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        total: 4,
        approved: 2,
        pending: 1,
        inReview: 1,
      });

      setApprovals([
        {
          id: "agr-001",
          reference: "AGR-2025-0125",
          projectName: "Usine de transformation agricole",
          projectId: "proj-001",
          type: "Regime General",
          status: "approved",
          submittedDate: "2025-05-20",
          approvalDate: "2025-06-10",
          expiryDate: "2035-06-10",
          duration: "10 ans",
          benefits: [
            "Exoneration impot sur benefices",
            "Franchise droits de douane",
            "TVA importation exoneree",
          ],
          documents: 8,
        },
        {
          id: "agr-002",
          reference: "AGR-2025-0189",
          projectName: "Centrale solaire Katanga",
          projectId: "proj-002",
          type: "Regime Preferentiel",
          status: "pending",
          submittedDate: "2025-11-15",
          currentStep: "Evaluation technique",
          stepProgress: 60,
          estimatedCompletion: "2026-01-30",
          documents: 12,
        },
        {
          id: "agr-003",
          reference: "AGR-2025-0201",
          projectName: "Hotel ecotouristique Virunga",
          projectId: "proj-003",
          type: "Zone Economique Speciale",
          status: "in_review",
          submittedDate: "2025-12-28",
          currentStep: "Verification documents",
          stepProgress: 25,
          estimatedCompletion: "2026-02-15",
          documents: 6,
          pendingDocuments: 2,
        },
        {
          id: "agr-004",
          reference: "AGR-2025-0098",
          projectName: "Exploitation miniere artisanale modernisee",
          projectId: "proj-004",
          type: "Regime Preferentiel",
          status: "approved",
          submittedDate: "2025-02-28",
          approvalDate: "2025-03-25",
          expiryDate: "2030-03-25",
          duration: "5 ans",
          benefits: [
            "Exoneration impot sur benefices (5 ans)",
            "Taux reduit droits de douane",
          ],
          documents: 10,
        },
      ]);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Approuve",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        label: "En attente",
        icon: Clock,
      },
      in_review: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "En revision",
        icon: RefreshCw,
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Rejete",
        icon: XCircle,
      },
    };
    return configs[status] || configs.pending;
  };

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || approval.status === statusFilter;
    const matchesType = typeFilter === "all" || approval.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const types = [...new Set(approvals.map((a) => a.type))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de vos agrements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Demandes d'Agrement</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Suivez l'etat de vos demandes d'agrement au Code des Investissements</p>
        </div>
        <Link
          href="/investor/approvals/new"
          className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle demande
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#0A1628] dark:text-[#D4A853]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total demandes</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approuves</p>
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
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inReview}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">En revision</p>
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
              placeholder="Rechercher par nom ou reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
          >
            <option value="all">Tous les statuts</option>
            <option value="approved">Approuves</option>
            <option value="pending">En attente</option>
            <option value="in_review">En revision</option>
            <option value="rejected">Rejetes</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
          >
            <option value="all">Tous les types</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune demande trouvee</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Commencez par soumettre une demande d'agrement pour vos projets.
            </p>
            <Link
              href="/investor/approvals/new"
              className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle demande
            </Link>
          </div>
        ) : (
          filteredApprovals.map((approval) => {
            const statusConfig = getStatusConfig(approval.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={approval.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#D4A853]/50 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Award className="w-7 h-7 text-[#D4A853]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {approval.projectName}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              <StatusIcon className="w-3.5 h-3.5 mr-1" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Reference: <span className="font-mono font-medium">{approval.reference}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-0.5 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 text-[#0A1628] dark:text-[#D4A853] text-xs font-medium rounded">
                              {approval.type}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Soumis le {new Date(approval.submittedDate).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {approval.documents} documents
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress for pending/in_review */}
                      {approval.currentStep && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              Etape actuelle: <span className="font-medium text-gray-900 dark:text-white">{approval.currentStep}</span>
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">{approval.stepProgress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#D4A853] rounded-full"
                              style={{ width: `${approval.stepProgress}%` }}
                            />
                          </div>
                          {approval.pendingDocuments && (
                            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              {approval.pendingDocuments} document(s) en attente de soumission
                            </p>
                          )}
                        </div>
                      )}

                      {/* Benefits for approved */}
                      {approval.status === "approved" && approval.benefits && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Avantages accordes ({approval.duration})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {approval.benefits.map((benefit, i) => (
                              <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                                {benefit}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                            Valide jusqu'au {new Date(approval.expiryDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link
                        href={`/investor/approvals/${approval.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-[#0A1628] text-white rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Link>
                      {approval.status === "approved" && (
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-[#D4A853] text-[#D4A853] rounded-lg font-medium hover:bg-[#D4A853]/10 transition-colors text-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Certificat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
