"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSignature,
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Calendar,
  DollarSign,
  Users,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Eye,
  X,
  Printer,
  RefreshCcw,
} from "lucide-react";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showOfficialPdfModal, setShowOfficialPdfModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchContract();
    }
  }, [params.id]);

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/legal/contracts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContract(data.contract);
      } else {
        router.push("/legal/contracts");
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce contrat ?")) return;
    try {
      const response = await fetch(`/api/legal/contracts/${params.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/legal/contracts");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Brouillon" },
      PENDING_SIGNATURE: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "En attente signature" },
      ACTIVE: { bg: "bg-green-500/20", text: "text-green-400", label: "Actif" },
      SUSPENDED: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Suspendu" },
      EXPIRED: { bg: "bg-red-500/20", text: "text-red-400", label: "Expire" },
      TERMINATED: { bg: "bg-red-500/20", text: "text-red-400", label: "Resilie" },
      RENEWED: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Renouvele" },
      ARCHIVED: { bg: "bg-slate-500/20", text: "text-slate-400", label: "Archive" },
    };
    const style = styles[status] || styles.DRAFT;
    return (
      <span className={`px-3 py-1.5 text-sm rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(value || 0);
  };

  const getDaysUntilExpiration = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <FileSignature className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-400">Contrat non trouve</h3>
        <Link href="/legal/contracts" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
          Retour a la liste
        </Link>
      </div>
    );
  }

  const daysLeft = getDaysUntilExpiration(contract.endDate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/legal/contracts"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors mt-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">
                {contract.contractNumber}
              </h1>
              {getStatusBadge(contract.status)}
            </div>
            <p className="text-gray-400">{contract.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowOfficialPdfModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          {contract.filePath && (
            <a
              href={`/api${contract.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Telecharger
            </a>
          )}
          <Link
            href={`/legal/contracts/${contract.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Link>
          {["ACTIVE", "EXPIRED"].includes(contract.status) && (
            <Link
              href={`/legal/contracts/${contract.id}/renew`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Renouveler
            </Link>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Alerte expiration */}
      {daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold text-orange-400">
                Contrat expirant bientot
              </h3>
              <p className="text-sm text-orange-300">
                Ce contrat expire dans {daysLeft} jour(s)
              </p>
            </div>
          </div>
        </div>
      )}

      {daysLeft !== null && daysLeft <= 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-400">
                Contrat expire
              </h3>
              <p className="text-sm text-red-300">
                Ce contrat a expire depuis {Math.abs(daysLeft)} jour(s)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informations generales */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Informations generales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Type</p>
            <p className="text-sm text-white">
              {contract.contractType?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Reference</p>
            <p className="text-sm text-white">{contract.reference || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Renouvellement</p>
            <p className="text-sm text-white">
              {contract.renewalType === "AUTO"
                ? "Automatique"
                : contract.renewalType === "TACIT"
                ? "Tacite"
                : contract.renewalType === "NONE"
                ? "Sans"
                : "Manuel"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Alertes</p>
            <p className="text-sm text-white">
              {contract.alertEnabled ? (
                <span className="text-green-400">Activees</span>
              ) : (
                <span className="text-gray-500">Desactivees</span>
              )}
            </p>
          </div>
        </div>
        {contract.description && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-gray-500 uppercase mb-1">Description</p>
            <p className="text-sm text-gray-400">{contract.description}</p>
          </div>
        )}
      </div>

      {/* Parties */}
      {contract.parties && contract.parties.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Parties au contrat
          </h2>
          <div className="space-y-3">
            {contract.parties.map((party, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-white">{party.name}</p>
                  <p className="text-xs text-gray-400">
                    {party.role}
                    {party.contact && ` - ${party.contact}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duree et Valeur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duree */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Duree
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date de debut</span>
              <span className="text-white">
                {contract.startDate
                  ? new Date(contract.startDate).toLocaleDateString("fr-FR")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date de fin</span>
              <span className="text-white">
                {contract.endDate
                  ? new Date(contract.endDate).toLocaleDateString("fr-FR")
                  : "Indefinie"}
              </span>
            </div>
            {daysLeft !== null && daysLeft > 0 && (
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-gray-400">Jours restants</span>
                <span
                  className={`font-medium ${
                    daysLeft <= 30 ? "text-orange-400" : "text-green-400"
                  }`}
                >
                  {daysLeft} jours
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Valeur */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Valeur financiere
          </h2>
          {contract.value ? (
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(contract.value, contract.currency)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Montant du contrat</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucune valeur specifiee
            </p>
          )}
        </div>
      </div>

      {/* Document */}
      {contract.filePath && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              Document du contrat
            </h2>
            <div className="flex gap-2">
              {(contract.mimeType === "application/pdf" || contract.filePath?.toLowerCase().endsWith('.pdf')) && (
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Visualiser
                </button>
              )}
              <a
                href={`/api${contract.filePath}`}
                download={contract.fileName}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Telecharger
              </a>
            </div>
          </div>

          {/* Info fichier */}
          <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
            <FileText className="w-10 h-10 text-green-500" />
            <div className="flex-1">
              <p className="text-white font-medium">{contract.fileName}</p>
              <p className="text-sm text-gray-400">
                {contract.fileSize
                  ? `${(contract.fileSize / 1024 / 1024).toFixed(2)} MB`
                  : "Taille inconnue"}
                {contract.mimeType && ` • ${contract.mimeType}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal PDF Viewer */}
      {showPdfModal && contract.filePath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[95vw] h-[95vh] bg-slate-900 rounded-xl shadow-2xl flex flex-col">
            {/* Header du modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{contract.fileName}</h3>
                  <p className="text-sm text-gray-400">
                    {contract.fileSize ? `${(contract.fileSize / 1024 / 1024).toFixed(2)} MB` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/api${contract.filePath}`}
                  download={contract.fileName}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Telecharger
                </a>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Fermer
                </button>
              </div>
            </div>
            {/* Contenu PDF */}
            <div className="flex-1 p-2">
              <iframe
                src={`/api${contract.filePath}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full rounded-lg border-0"
                title={contract.fileName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Metadonnees */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Metadonnees</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Cree le</p>
            <p className="text-white">
              {new Date(contract.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Modifie le</p>
            <p className="text-white">
              {new Date(contract.updatedAt).toLocaleString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      {/* Modal PDF Officiel ANAPI */}
      {showOfficialPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[95vw] h-[95vh] bg-slate-900 rounded-xl shadow-2xl flex flex-col">
            {/* Header du modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <FileSignature className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Document Officiel ANAPI</h3>
                  <p className="text-sm text-gray-400">
                    Contrat {contract.contractNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/api/legal/contracts/${contract.id}/pdf`}
                  download={`Contrat-${contract.contractNumber}.pdf`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Telecharger PDF
                </a>
                <button
                  onClick={() => {
                    const iframe = document.getElementById('official-pdf-iframe');
                    if (iframe) {
                      iframe.contentWindow.print();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
                <button
                  onClick={() => setShowOfficialPdfModal(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Fermer
                </button>
              </div>
            </div>
            {/* Contenu PDF */}
            <div className="flex-1 p-2">
              <iframe
                id="official-pdf-iframe"
                src={`/api/legal/contracts/${contract.id}/pdf#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full rounded-lg border-0 bg-white"
                title={`Contrat officiel ${contract.contractNumber}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
