"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ArrowLeft,
  Reply,
  Forward,
  Trash2,
  Star,
  AlertTriangle,
  Paperclip,
  Clock,
  User,
  Users,
  Download,
  FileText,
  ImageIcon,
  Film,
  File,
  Loader2,
  MailOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Landmark,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ReadMessagePage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/messages/${params.id}`);
        const result = await response.json();

        if (result.success) {
          setMessage(result.data);
        } else {
          console.error("Erreur:", result.error);
        }
      } catch (error) {
        console.error("Erreur chargement message:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMessage();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/messages/${params.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        router.push("/messages");
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAsUnread = async () => {
    try {
      await fetch(`/api/messages/${params.id}/read`, { method: "DELETE" });
      router.push("/messages");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getFileIcon = (filetype) => {
    if (filetype?.startsWith("image/"))
      return <ImageIcon className="w-5 h-5 text-green-500" />;
    if (filetype?.startsWith("video/"))
      return <Film className="w-5 h-5 text-purple-500" />;
    if (filetype?.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (filetype?.includes("word") || filetype?.includes("document"))
      return <FileText className="w-5 h-5 text-blue-500" />;
    if (filetype?.includes("excel") || filetype?.includes("spreadsheet"))
      return <FileText className="w-5 h-5 text-green-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "URGENT":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            Urgent
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
            <Star className="w-4 h-4 mr-1.5" />
            Important
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-20">
        <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Message introuvable
        </p>
        <Link
          href="/messages"
          className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la boîte de réception
        </Link>
      </div>
    );
  }

  const sender = message.sender || {};
  const recipients = message.recipients || [];
  const toRecipients = recipients.filter((r) => r.recipientType === "TO");
  const ccRecipients = recipients.filter((r) => r.recipientType === "CC");
  const attachments = message.attachments || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 dark:from-blue-800/60 dark:to-indigo-700/60 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MailOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold truncate max-w-md">
                {message.subject}
              </h1>
              <p className="text-blue-100 text-sm">
                {format(new Date(message.createdAt), "EEEE d MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          {getPriorityBadge(message.priority)}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/messages/compose?reply=${message.id}`}
              className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Reply className="w-4 h-4 mr-2" />
              Répondre
            </Link>
            <Link
              href={`/messages/compose?forward=${message.id}`}
              className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Forward className="w-4 h-4 mr-2" />
              Transférer
            </Link>
            <button
              onClick={handleMarkAsUnread}
              className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Marquer non lu
            </button>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Supprimer
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Sender Info */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            {sender.image ? (
              <Image
                src={sender.image}
                alt={sender.name || ""}
                width={56}
                height={56}
                className="rounded-full"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {(sender.name || sender.email || "?")[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sender.name || "Utilisateur inconnu"}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  &lt;{sender.email}&gt;
                </span>
                {/* Ministry Badge */}
                {sender.ministry && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                    <Landmark className="w-3.5 h-3.5 mr-1.5" />
                    {sender.ministry.shortName || sender.ministry.code || sender.ministry.name}
                  </span>
                )}
              </div>

              {/* Recipients */}
              <div className="mt-2 space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    À :
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1">
                      {(showAllRecipients
                        ? toRecipients
                        : toRecipients.slice(0, 3)
                      ).map((r) => (
                        <span
                          key={r.id}
                          className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                        >
                          {r.recipient?.name || r.recipient?.email}
                        </span>
                      ))}
                      {toRecipients.length > 3 && !showAllRecipients && (
                        <button
                          onClick={() => setShowAllRecipients(true)}
                          className="inline-flex items-center px-2 py-0.5 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                          +{toRecipients.length - 3} autres
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {ccRecipients.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                      Cc :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ccRecipients.map((r) => (
                        <span
                          key={r.id}
                          className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                        >
                          {r.recipient?.name || r.recipient?.email}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showAllRecipients && (
                  <button
                    onClick={() => setShowAllRecipients(false)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    Réduire
                    <ChevronUp className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {format(new Date(message.createdAt), "d MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Message Body - Render HTML content from rich text editor */}
        <div className="p-6">
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 message-body-content"
            dangerouslySetInnerHTML={{ __html: message.body }}
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <Paperclip className="w-4 h-4 mr-2" />
              {attachments.length} pièce{attachments.length > 1 ? "s" : ""}{" "}
              jointe{attachments.length > 1 ? "s" : ""}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.filepath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {getFileIcon(attachment.filetype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {attachment.originalName || attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(attachment.filesize)}
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/messages"
          className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la boîte de réception
        </Link>
        <Link
          href={`/messages/compose?reply=${message.id}`}
          className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Reply className="w-5 h-5 mr-2" />
          Répondre
        </Link>
      </div>
    </div>
  );
}
