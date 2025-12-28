"use client";

import { useState } from "react";
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Building2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface ApprovalRequest {
  id: string;
  requestNumber: string;
  investorName: string;
  investorType: string;
  approvalType: string;
  description: string;
  status: string;
  priority: string;
  submittedAt: string;
  dueDate: string;
  assignedTo: string;
  currentStep: string;
  steps: {
    name: string;
    status: string;
    completedAt?: string;
  }[];
}

const approvalTypes: Record<string, { label: string; color: string }> = {
  AGREMENT_REGIME: { label: "Agrement au Regime", color: "bg-purple-100 text-purple-700" },
  EXONERATION_FISCALE: { label: "Exoneration Fiscale", color: "bg-blue-100 text-blue-700" },
  LICENCE_EXPLOITATION: { label: "Licence d'Exploitation", color: "bg-green-100 text-green-700" },
  PERMIS_CONSTRUCTION: { label: "Permis de Construction", color: "bg-orange-100 text-orange-700" },
  AUTORISATION_IMPORT: { label: "Autorisation Import", color: "bg-cyan-100 text-cyan-700" },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700", icon: FileText },
  SUBMITTED: { label: "Soumise", color: "bg-blue-100 text-blue-700", icon: Clock },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  PENDING_INFO: { label: "Info requise", color: "bg-orange-100 text-orange-700", icon: AlertCircle },
  APPROVED: { label: "Approuvee", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  REJECTED: { label: "Rejetee", color: "bg-red-100 text-red-700", icon: XCircle },
  REVISION: { label: "En revision", color: "bg-purple-100 text-purple-700", icon: RotateCcw },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Basse", color: "bg-gray-100 text-gray-600" },
  NORMAL: { label: "Normale", color: "bg-blue-100 text-blue-600" },
  HIGH: { label: "Haute", color: "bg-orange-100 text-orange-600" },
  URGENT: { label: "Urgente", color: "bg-red-100 text-red-600" },
};

const mockApprovals: ApprovalRequest[] = [
  {
    id: "1",
    requestNumber: "AGR-2024-00089",
    investorName: "Congo Mining Corporation",
    investorType: "company",
    approvalType: "AGREMENT_REGIME",
    description: "Demande d'agrement au regime preferentiel pour projet minier",
    status: "UNDER_REVIEW",
    priority: "HIGH",
    submittedAt: "2024-01-15",
    dueDate: "2024-02-15",
    assignedTo: "Jean Kabila",
    currentStep: "Examen technique",
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-15" },
      { name: "Verification documents", status: "completed", completedAt: "2024-01-17" },
      { name: "Examen technique", status: "in_progress" },
      { name: "Examen juridique", status: "pending" },
      { name: "Decision finale", status: "pending" },
    ],
  },
  {
    id: "2",
    requestNumber: "AGR-2024-00088",
    investorName: "AgroTech RDC SARL",
    investorType: "company",
    approvalType: "EXONERATION_FISCALE",
    description: "Demande d'exoneration fiscale pour importation equipements agricoles",
    status: "PENDING_INFO",
    priority: "NORMAL",
    submittedAt: "2024-01-12",
    dueDate: "2024-02-12",
    assignedTo: "Marie Lumumba",
    currentStep: "Documents manquants",
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-12" },
      { name: "Verification documents", status: "pending" },
      { name: "Examen fiscal", status: "pending" },
      { name: "Decision finale", status: "pending" },
    ],
  },
  {
    id: "3",
    requestNumber: "AGR-2024-00087",
    investorName: "TechInvest Africa Ltd",
    investorType: "company",
    approvalType: "LICENCE_EXPLOITATION",
    description: "Licence d'exploitation pour centre de donnees",
    status: "APPROVED",
    priority: "NORMAL",
    submittedAt: "2024-01-08",
    dueDate: "2024-02-08",
    assignedTo: "Pierre Tshisekedi",
    currentStep: "Termine",
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-08" },
      { name: "Verification documents", status: "completed", completedAt: "2024-01-10" },
      { name: "Examen technique", status: "completed", completedAt: "2024-01-15" },
      { name: "Decision finale", status: "completed", completedAt: "2024-01-18" },
    ],
  },
  {
    id: "4",
    requestNumber: "AGR-2024-00086",
    investorName: "Jean-Pierre Mukendi",
    investorType: "individual",
    approvalType: "PERMIS_CONSTRUCTION",
    description: "Permis de construction pour hotel touristique",
    status: "SUBMITTED",
    priority: "URGENT",
    submittedAt: "2024-01-20",
    dueDate: "2024-01-30",
    assignedTo: "Non assigne",
    currentStep: "En attente d'assignation",
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-20" },
      { name: "Assignation", status: "pending" },
      { name: "Examen urbanistique", status: "pending" },
      { name: "Decision finale", status: "pending" },
    ],
  },
  {
    id: "5",
    requestNumber: "AGR-2024-00085",
    investorName: "Congo Cement Industries",
    investorType: "company",
    approvalType: "AUTORISATION_IMPORT",
    description: "Autorisation d'importation d'equipements industriels",
    status: "REJECTED",
    priority: "HIGH",
    submittedAt: "2024-01-05",
    dueDate: "2024-02-05",
    assignedTo: "Marie Lumumba",
    currentStep: "Rejete",
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-05" },
      { name: "Verification documents", status: "completed", completedAt: "2024-01-07" },
      { name: "Examen douanier", status: "completed", completedAt: "2024-01-10" },
      { name: "Decision finale", status: "rejected", completedAt: "2024-01-12" },
    ],
  },
];

export default function AgrementsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || approval.status === statusFilter;
    const matchesType = typeFilter === "all" || approval.approvalType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const stats = {
    total: approvals.length,
    pending: approvals.filter((a) => ["SUBMITTED", "UNDER_REVIEW", "PENDING_INFO"].includes(a.status)).length,
    approved: approvals.filter((a) => a.status === "APPROVED").length,
    urgent: approvals.filter((a) => a.priority === "URGENT" || a.priority === "HIGH").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Demandes d'Agrement
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Suivi des autorisations, licences et permis
          </p>
        </div>
        <Link
          href="/guichet-unique/agrements/new"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Demande
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Demandes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">En Traitement</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approuvees</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prioritaires</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.urgent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numero, investisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les types</option>
              {Object.entries(approvalTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredApprovals.map((approval) => {
          const status = statusConfig[approval.status] || statusConfig.DRAFT;
          const StatusIcon = status.icon;
          const type = approvalTypes[approval.approvalType];
          const priority = priorityConfig[approval.priority];
          const daysRemaining = getDaysRemaining(approval.dueDate);
          const completedSteps = approval.steps.filter(s => s.status === "completed").length;
          const progress = (completedSteps / approval.steps.length) * 100;

          return (
            <div
              key={approval.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {approval.requestNumber}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${type?.color || 'bg-gray-100 text-gray-700'}`}>
                        {type?.label || approval.approvalType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.color}`}>
                      {priority.label}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Investor Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    {approval.investorType === "company" ? (
                      <Building2 className="w-4 h-4 text-gray-400" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                    <p className="font-medium text-gray-900 dark:text-white">
                      {approval.investorName}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {approval.description}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Progression: {approval.currentStep}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {completedSteps}/{approval.steps.length} etapes
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {approval.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : step.status === "in_progress"
                            ? "bg-yellow-500"
                            : step.status === "rejected"
                            ? "bg-red-500"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                        title={step.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(approval.submittedAt)}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      daysRemaining < 0 ? "text-red-500" : daysRemaining <= 7 ? "text-orange-500" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>
                        {daysRemaining < 0
                          ? `${Math.abs(daysRemaining)}j en retard`
                          : `${daysRemaining}j restants`}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/guichet-unique/agrements/${approval.id}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {approval.assignedTo.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {approval.assignedTo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApprovals.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <FileCheck className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucune demande trouvee</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de <span className="font-medium">{filteredApprovals.length}</span> demandes
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
