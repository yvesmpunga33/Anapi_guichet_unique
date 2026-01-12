"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  PauseCircle,
  MessageSquare,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  RefreshCw,
  Zap,
  ArrowUpDown,
  X,
  FileCheck,
  FileBadge,
  FileKey,
} from "lucide-react";
import { MinistryRequestList, MinistryRequestUpdate } from "@/app/services/admin/Ministry.service";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: Clock },
  SUBMITTED: { label: "Soumis", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  IN_PROGRESS: { label: "En traitement", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  PENDING_DOCUMENTS: { label: "Documents requis", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: AlertTriangle },
  UNDER_REVIEW: { label: "En revision", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Eye },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  CANCELLED: { label: "Annule", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: XCircle },
};

const priorityConfig = {
  LOW: { label: "Basse", color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700" },
  NORMAL: { label: "Normale", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  HIGH: { label: "Haute", color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  URGENT: { label: "Urgente", color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", icon: Zap },
};

const typeConfig = {
  AUTORISATION: { icon: FileCheck, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  LICENCE: { icon: FileBadge, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  PERMIS: { icon: FileKey, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
};

export default function RequestsList({
  ministryId,
  requestType,
  title,
  description,
  gradient = "from-blue-500 to-blue-600",
}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [actionComment, setActionComment] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    approved: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchRequests = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {
        ministryId,
        requestType,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;

      const response = await MinistryRequestList(params);
      const result = response.data;

      if (result) {
        setRequests(result.data || []);
        setStats(result.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination?.total || 0,
          totalPages: result.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [ministryId, requestType, pagination.page, statusFilter, priorityFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchRequests();
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAction = async (action) => {
    if (!selectedRequest) return;

    try {
      const response = await MinistryRequestUpdate(selectedRequest.id, {
        action,
        comment: actionComment,
        reason: actionComment,
      });

      if (response.data) {
        setSuccessMessage(
          action === "APPROVE"
            ? "Demande approuvee avec succes"
            : action === "REJECT"
            ? "Demande rejetee"
            : action === "HOLD"
            ? "Demande mise en attente"
            : "Action effectuee"
        );
        setTimeout(() => setSuccessMessage(null), 3000);
        setActionModal(null);
        setActionComment("");
        setSelectedRequest(null);
        fetchRequests(true);
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount, currency = "USD") => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const TypeIcon = typeConfig[requestType]?.icon || FileCheck;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-2 p-1 hover:bg-green-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
            <TypeIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRequests(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Soumis</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.submitted}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">En cours</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Approuves</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Rejetes</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numero, demandeur ou objet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Toutes priorites</option>
              {Object.entries(priorityConfig).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-500">Chargement...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Demandeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Objet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Progression
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {requests.map((request) => {
                    const status = statusConfig[request.status] || statusConfig.DRAFT;
                    const priority = priorityConfig[request.priority] || priorityConfig.NORMAL;
                    const StatusIcon = status.icon;
                    const PriorityIcon = priority.icon;
                    const progress = (request.currentStep / request.totalSteps) * 100;

                    return (
                      <tr
                        key={request.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${typeConfig[requestType].bg} rounded-lg flex items-center justify-center`}>
                              <TypeIcon className={`w-5 h-5 ${typeConfig[requestType].color}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {request.requestNumber}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(request.submittedAt || request.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {request.applicantName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {request.applicantEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 dark:text-white truncate max-w-xs">
                            {request.subject}
                          </p>
                          {request.investmentAmount && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatAmount(request.investmentAmount, request.currency)}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-28">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Etape {request.currentStep}/{request.totalSteps}
                              </span>
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="w-3.5 h-3.5 mr-1" />
                              {status.label}
                            </span>
                            {PriorityIcon && (
                              <PriorityIcon className={`w-4 h-4 ${priority.color}`} />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/ministries/${ministryId}/requests/${request.id}`}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Voir details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {["SUBMITTED", "IN_PROGRESS", "UNDER_REVIEW"].includes(request.status) && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setActionModal("APPROVE");
                                  }}
                                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Approuver"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setActionModal("HOLD");
                                  }}
                                  className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                                  title="Mettre en attente"
                                >
                                  <PauseCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setActionModal("REJECT");
                                  }}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Rejeter"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setActionModal("CONTACT");
                              }}
                              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                              title="Contacter"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {requests.length === 0 && (
              <div className="text-center py-16">
                <TypeIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune demande trouvee</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {searchTerm || statusFilter !== "all"
                    ? "Essayez de modifier vos filtres"
                    : "Les nouvelles demandes apparaitront ici"}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Affichage de <span className="font-medium">{requests.length}</span> sur{" "}
                  <span className="font-medium">{pagination.total}</span> demandes
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPagination((prev) => ({ ...prev, page }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        pagination.page === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {actionModal === "APPROVE" && "Approuver la demande"}
                {actionModal === "REJECT" && "Rejeter la demande"}
                {actionModal === "HOLD" && "Mettre en attente"}
                {actionModal === "CONTACT" && "Contacter le demandeur"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedRequest.requestNumber} - {selectedRequest.applicantName}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {actionModal === "REJECT" ? "Motif du rejet" : "Commentaire (optionnel)"}
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder={
                  actionModal === "REJECT"
                    ? "Indiquez le motif du rejet..."
                    : actionModal === "HOLD"
                    ? "Documents ou informations manquantes..."
                    : actionModal === "CONTACT"
                    ? "Message pour le demandeur..."
                    : "Ajouter un commentaire..."
                }
              />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setActionModal(null);
                  setActionComment("");
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction(actionModal)}
                className={`px-4 py-2 rounded-xl text-white transition-colors ${
                  actionModal === "APPROVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : actionModal === "REJECT"
                    ? "bg-red-600 hover:bg-red-700"
                    : actionModal === "HOLD"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {actionModal === "APPROVE" && "Approuver"}
                {actionModal === "REJECT" && "Rejeter"}
                {actionModal === "HOLD" && "Mettre en attente"}
                {actionModal === "CONTACT" && "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
