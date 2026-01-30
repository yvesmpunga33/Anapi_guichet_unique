"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Calendar,
  Tag,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Eye,
  X,
} from "lucide-react";
import {
  LegalTextGetById,
  LegalTextDelete,
} from "@/app/services/admin/Legal.service";

export default function LegalTextDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchText();
    }
  }, [params.id]);

  const fetchText = async () => {
    try {
      const response = await LegalTextGetById(params.id);
      // API returns { success: true, data: { juridicalText } }
      const data = response.data?.data || response.data;
      setText(data.juridicalText || data.text);
    } catch (error) {
      console.error("Error fetching text:", error);
      router.push("/legal/texts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce texte ?")) return;
    try {
      await LegalTextDelete(params.id);
      router.push("/legal/texts");
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Brouillon", icon: Clock },
      PENDING_APPROVAL: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "En attente", icon: Clock },
      ACTIVE: { bg: "bg-green-500/20", text: "text-green-400", label: "En vigueur", icon: CheckCircle },
      MODIFIED: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Modifie", icon: AlertCircle },
      ABROGATED: { bg: "bg-red-500/20", text: "text-red-400", label: "Abroge", icon: AlertCircle },
      ARCHIVED: { bg: "bg-slate-500/20", text: "text-slate-400", label: "Archive", icon: Clock },
    };
    const style = styles[status] || styles.DRAFT;
    const Icon = style.icon;
    return (
      <span className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full ${style.bg} ${style.text}`}>
        <Icon className="w-4 h-4" />
        {style.label}
      </span>
    );
  };

  const isPdf = (filePath, mimeType) => {
    return mimeType === "application/pdf" || filePath?.toLowerCase().endsWith('.pdf');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!text) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-400">Texte non trouve</h3>
        <Link href="/legal/texts" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
          Retour a la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/legal/texts"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors mt-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">
                {text.documentNumber}
              </h1>
              {getStatusBadge(text.status)}
            </div>
            <p className="text-gray-400">{text.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {text.filePath && (
            <a
              href={`/api${text.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Telecharger
            </a>
          )}
          <Link
            href={`/legal/texts/${text.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Classification */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Classification</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Type</p>
            <p className="text-sm text-white">
              {text.documentType?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Domaine</p>
            <p className="text-sm text-white">{text.domain?.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Reference officielle</p>
            <p className="text-sm text-white">{text.officialReference || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Journal Officiel</p>
            <p className="text-sm text-white">{text.journalOfficiel || "-"}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Dates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Publication</p>
            <p className="text-sm text-white">
              {text.publicationDate
                ? new Date(text.publicationDate).toLocaleDateString("fr-FR")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Entree en vigueur</p>
            <p className="text-sm text-white">
              {text.effectiveDate
                ? new Date(text.effectiveDate).toLocaleDateString("fr-FR")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Expiration</p>
            <p className="text-sm text-white">
              {text.expirationDate
                ? new Date(text.expirationDate).toLocaleDateString("fr-FR")
                : "Indefinie"}
            </p>
          </div>
        </div>
      </div>

      {/* Resume */}
      {text.summary && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Resume</h2>
          <p className="text-gray-400 whitespace-pre-wrap">{text.summary}</p>
        </div>
      )}

      {/* Mots-cles */}
      {text.keywords && text.keywords.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            Mots-cles
          </h2>
          <div className="flex flex-wrap gap-2">
            {text.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Document */}
      {text.filePath && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Document attache
            </h2>
            <div className="flex gap-2">
              {isPdf(text.filePath, text.mimeType) && (
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Visualiser
                </button>
              )}
              <a
                href={`/api${text.filePath}`}
                download={text.fileName}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Telecharger
              </a>
            </div>
          </div>

          {/* Info fichier */}
          <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
            <FileText className="w-10 h-10 text-blue-500" />
            <div className="flex-1">
              <p className="text-white font-medium">{text.fileName}</p>
              <p className="text-sm text-gray-400">
                {text.fileSize
                  ? `${(text.fileSize / 1024 / 1024).toFixed(2)} MB`
                  : "Taille inconnue"}
                {text.mimeType && ` • ${text.mimeType}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal PDF Viewer */}
      {showPdfModal && text.filePath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[95vw] h-[95vh] bg-slate-900 rounded-xl shadow-2xl flex flex-col">
            {/* Header du modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{text.fileName}</h3>
                  <p className="text-sm text-gray-400">
                    {text.fileSize ? `${(text.fileSize / 1024 / 1024).toFixed(2)} MB` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/api${text.filePath}`}
                  download={text.fileName}
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
                src={`/api${text.filePath}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full rounded-lg border-0"
                title={text.fileName}
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
              {new Date(text.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Modifie le</p>
            <p className="text-white">
              {new Date(text.updatedAt).toLocaleString("fr-FR")}
            </p>
          </div>
          {text.checksum && (
            <div className="col-span-2">
              <p className="text-gray-500">Checksum (SHA-256)</p>
              <p className="text-white font-mono text-xs break-all">
                {text.checksum}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
