"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  User,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  PauseCircle,
  Mail,
  Phone,
  MapPin,
  History,
  Send,
  FileCheck,
  Upload,
  File,
  Eye,
  Download,
  Trash2,
  Plus,
  Check,
  X,
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: Clock },
  SUBMITTED: { label: "Soumise", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  IN_PROGRESS: { label: "En traitement", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  PENDING_DOCUMENTS: { label: "Documents requis", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: AlertCircle },
  UNDER_REVIEW: { label: "En revision", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: FileText },
  APPROVED: { label: "Approuvee", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  REJECTED: { label: "Rejetee", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  CANCELLED: { label: "Annulee", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: XCircle },
};

const priorityConfig = {
  LOW: { label: "Basse", color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" },
  NORMAL: { label: "Normale", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  HIGH: { label: "Haute", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  URGENT: { label: "Urgente", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
};

const documentStatusConfig = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  UPLOADED: { label: "Uploade", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  VALIDATED: { label: "Valide", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const requestTypeLabels = {
  AUTORISATION: "Autorisation",
  LICENCE: "Licence",
  PERMIS: "Permis",
};

export default function RequestDetailPage({ params }) {
  const resolvedParams = use(params);
  const { ministryId, requestId } = resolvedParams;

  const [request, setRequest] = useState(null);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null);
  const [actionComment, setActionComment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [documentModal, setDocumentModal] = useState(null);
  const fileInputRef = useRef(null);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ministries/requests/${requestId}`);
      const result = await response.json();

      if (result.success) {
        setRequest(result.data);
        setWorkflowSteps(result.workflowSteps || []);
        setDocuments(result.data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequiredDocuments = async () => {
    try {
      const response = await fetch(`/api/ministries/requests/${requestId}/documents`);
      const result = await response.json();
      if (result.success) {
        setRequiredDocuments(result.requiredDocuments || []);
      }
    } catch (error) {
      console.error("Error fetching required documents:", error);
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchRequiredDocuments();
  }, [requestId]);

  const handleAction = async (action) => {
    setProcessing(true);
    try {
      // Si c'est une action HOLD, on doit d'abord creer les documents demandes
      if (action === "HOLD" && selectedDocuments.length > 0) {
        await fetch(`/api/ministries/requests/${requestId}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documents: selectedDocuments,
            note: actionComment,
          }),
        });
      }

      const response = await fetch(`/api/ministries/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          comment: actionComment,
          reason: actionComment,
        }),
      });

      if (response.ok) {
        const actionMessages = {
          APPROVE: request.currentStep >= request.totalSteps ? "Demande approuvee avec succes" : "Etape validee avec succes",
          REJECT: "Demande rejetee",
          HOLD: "Demande mise en attente - documents requis",
          COMMENT: "Commentaire ajoute",
        };
        setSuccessMessage(actionMessages[action] || "Action effectuee");
        setTimeout(() => setSuccessMessage(null), 3000);
        setActionModal(null);
        setActionComment("");
        setSelectedDocuments([]);
        fetchRequest();
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (docId, file) => {
    if (!file) return;

    setUploadingDoc(docId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentId", docId);

      const response = await fetch(`/api/ministries/requests/${requestId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("Document uploade avec succes");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchRequest();
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDocumentAction = async (docId, action, note = "") => {
    try {
      const response = await fetch(`/api/ministries/requests/${requestId}/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });

      if (response.ok) {
        setSuccessMessage(action === "VALIDATE" ? "Document valide" : "Document rejete");
        setTimeout(() => setSuccessMessage(null), 3000);
        setDocumentModal(null);
        fetchRequest();
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const toggleDocumentSelection = (doc) => {
    setSelectedDocuments(prev => {
      const exists = prev.find(d => d.id === doc.id || d.name === doc.name);
      if (exists) {
        return prev.filter(d => d.id !== doc.id && d.name !== doc.name);
      }
      return [...prev, { id: doc.id, name: doc.name, description: doc.description, type: doc.type }];
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const formatFileSize = (bytes) => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-lg">Demande non trouvee</p>
        <Link
          href={`/ministries/${ministryId}/autorisations`}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const status = statusConfig[request.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;
  const priority = priorityConfig[request.priority] || priorityConfig.NORMAL;
  const progress = (request.currentStep / request.totalSteps) * 100;
  const canTakeAction = ["SUBMITTED", "IN_PROGRESS", "UNDER_REVIEW", "PENDING_DOCUMENTS"].includes(request.status);
  const pendingDocuments = documents.filter(d => d.status === "PENDING");
  const uploadedDocuments = documents.filter(d => d.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/ministries/${ministryId}/${request.requestType.toLowerCase()}s`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {request.requestNumber}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                {priority.label}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {requestTypeLabels[request.requestType]} - {request.ministry?.name || "Ministere"}
            </p>
          </div>
        </div>

        {/* Actions */}
        {canTakeAction && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActionModal("APPROVE")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {request.currentStep >= request.totalSteps ? "Approuver" : "Valider etape"}
            </button>
            <button
              onClick={() => setActionModal("HOLD")}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <PauseCircle className="w-4 h-4" />
              Demander docs
            </button>
            <button
              onClick={() => setActionModal("REJECT")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Rejeter
            </button>
          </div>
        )}
      </div>

      {/* Workflow Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-500" />
          Progression du workflow
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Etape {request.currentStep} sur {request.totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Workflow Steps */}
        {workflowSteps.length > 0 && (
          <div className="relative overflow-x-auto">
            <div className="flex items-center justify-between min-w-max">
              {workflowSteps.map((step, index) => {
                const isCompleted = request.currentStep > step.stepNumber;
                const isCurrent = request.currentStep === step.stepNumber;

                return (
                  <div key={step.id} className="flex-1 relative min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-900"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          step.stepNumber
                        )}
                      </div>
                      <div className="mt-2 text-center px-2">
                        <p className={`text-sm font-medium ${
                          isCurrent ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                        }`}>
                          {step.stepName}
                        </p>
                        {step.responsibleRole && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {step.responsibleRole}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {workflowSteps.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300 py-4">
            Aucune etape de workflow configuree pour ce ministere
          </p>
        )}
      </div>

      {/* Documents Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <File className="w-5 h-5 text-blue-500" />
          Documents ({documents.length})
        </h2>

        {/* Documents en attente */}
        {pendingDocuments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Documents en attente ({pendingDocuments.length})
            </h3>
            <div className="space-y-3">
              {pendingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <File className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{doc.documentName}</p>
                      {doc.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                      )}
                      {doc.requestedByName && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Demande par {doc.requestedByName} le {formatDate(doc.requestedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${documentStatusConfig.PENDING.color}`}>
                      {documentStatusConfig.PENDING.label}
                    </span>
                    <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      {uploadingDoc === doc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span className="text-sm">Uploader</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0])}
                        disabled={uploadingDoc === doc.id}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents uploades */}
        {uploadedDocuments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Documents soumis ({uploadedDocuments.length})
            </h3>
            <div className="space-y-3">
              {uploadedDocuments.map((doc) => {
                const docStatus = documentStatusConfig[doc.status] || documentStatusConfig.PENDING;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{doc.documentName}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>{doc.fileName}</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                        </div>
                        {doc.uploadedByName && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Uploade par {doc.uploadedByName} le {formatDate(doc.uploadedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${docStatus.color}`}>
                        {docStatus.label}
                      </span>
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Voir le document"
                        >
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </a>
                      )}
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          download
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Telecharger"
                        >
                          <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </a>
                      )}
                      {doc.status === "UPLOADED" && canTakeAction && (
                        <>
                          <button
                            onClick={() => handleDocumentAction(doc.id, "VALIDATE")}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Valider"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => setDocumentModal({ doc, action: "REJECT" })}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Rejeter"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {documents.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300 py-8">
            Aucun document pour cette demande
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject & Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Details de la demande
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Objet</label>
                <p className="text-gray-900 dark:text-white font-medium mt-1">{request.subject}</p>
              </div>
              {request.description && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {request.sector && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Secteur</label>
                    <p className="text-gray-900 dark:text-white mt-1">{request.sector}</p>
                  </div>
                )}
                {request.province && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Province</label>
                    <p className="text-gray-900 dark:text-white mt-1">{request.province}</p>
                  </div>
                )}
                {request.investmentAmount && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Investissement</label>
                    <p className="text-gray-900 dark:text-white mt-1 font-semibold">
                      {formatAmount(request.investmentAmount, request.currency)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Demandeur
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.applicantName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.applicantEmail}</p>
                </div>
              </div>
              {request.applicantPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Telephone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{request.applicantPhone}</p>
                  </div>
                </div>
              )}
              {request.applicantAddress && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                    <p className="font-medium text-gray-900 dark:text-white">{request.applicantAddress}</p>
                  </div>
                </div>
              )}
            </div>
            {(request.rccm || request.idNat || request.nif) && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
                {request.rccm && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">RCCM</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{request.rccm}</p>
                  </div>
                )}
                {request.idNat && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID National</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{request.idNat}</p>
                  </div>
                )}
                {request.nif && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">NIF</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{request.nif}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-500" />
              Historique
            </h2>
            {request.history && request.history.length > 0 ? (
              <div className="space-y-4">
                {request.history.map((item, index) => (
                  <div key={item.id || index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      {index < request.history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.stepName || item.action}
                        </p>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      {item.performedByName && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Par {item.performedByName}
                        </p>
                      )}
                      {item.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                          {item.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                Aucun historique disponible
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Dates importantes</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cree le</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              {request.submittedAt && (
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Soumis le</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(request.submittedAt)}</p>
                  </div>
                </div>
              )}
              {request.decisionDate && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Decision le</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(request.decisionDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ministry Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Ministere
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {request.ministry?.name || "Non assigne"}
            </p>
            {request.ministry?.code && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Code: {request.ministry.code}
              </p>
            )}
          </div>

          {/* Decision Note */}
          {(request.decisionNote || request.rejectionReason) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {request.status === "REJECTED" ? "Motif du rejet" : "Note de decision"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {request.rejectionReason || request.decisionNote}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {actionModal === "APPROVE" && (request.currentStep >= request.totalSteps ? "Approuver la demande" : "Valider l'etape")}
                {actionModal === "REJECT" && "Rejeter la demande"}
                {actionModal === "HOLD" && "Demander des documents"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {request.requestNumber} - {request.applicantName}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Document Selection for HOLD action */}
              {actionModal === "HOLD" && requiredDocuments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Selectionner les documents requis
                  </label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-3">
                    {requiredDocuments.map((doc, index) => {
                      const isSelected = selectedDocuments.find(d => d.name === doc.name);
                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => toggleDocumentSelection(doc)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                            {doc.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Etape {doc.stepNumber}: {doc.stepName}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {selectedDocuments.length > 0 && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      {selectedDocuments.length} document(s) selectionne(s)
                    </p>
                  )}
                </div>
              )}

              {actionModal === "HOLD" && requiredDocuments.length === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Aucun document configure dans le workflow. Vous pouvez specifier les documents manuellement ci-dessous.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {actionModal === "REJECT" ? "Motif du rejet *" : actionModal === "HOLD" ? "Note / Documents supplementaires" : "Commentaire (optionnel)"}
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
                      ? "Ajoutez des precisions sur les documents requis..."
                      : "Ajouter un commentaire..."
                  }
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setActionModal(null);
                  setActionComment("");
                  setSelectedDocuments([]);
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction(actionModal)}
                disabled={
                  processing ||
                  (actionModal === "REJECT" && !actionComment.trim()) ||
                  (actionModal === "HOLD" && selectedDocuments.length === 0 && !actionComment.trim())
                }
                className={`px-4 py-2 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionModal === "APPROVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : actionModal === "REJECT"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : actionModal === "APPROVE" ? (
                  request.currentStep >= request.totalSteps ? "Approuver" : "Valider"
                ) : actionModal === "REJECT" ? (
                  "Rejeter"
                ) : (
                  "Demander"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Rejection Modal */}
      {documentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Rejeter le document
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {documentModal.doc.documentName}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Motif du rejet *
              </label>
              <textarea
                id="rejectionReason"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Indiquez pourquoi ce document est rejete..."
              />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setDocumentModal(null)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const reason = document.getElementById("rejectionReason").value;
                  if (reason.trim()) {
                    handleDocumentAction(documentModal.doc.id, "REJECT", reason);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
