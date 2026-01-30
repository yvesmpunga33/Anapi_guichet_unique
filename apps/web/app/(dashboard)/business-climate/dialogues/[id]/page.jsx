"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";
import {
  Users2,
  ArrowLeft,
  Loader2,
  Clock,
  FileText,
  Target,
  User,
  CheckCircle2,
  AlertCircle,
  Video,
  Globe,
  X,
  Building2,
  Mail,
  UserPlus,
  ClipboardList,
  Edit,
  Trash2,
  MapPin,
  Printer,
} from "lucide-react";

import { exportDialogueToPDF } from "@/app/utils/pdfExport";
import { DialogueGetById, DialogueDelete } from "@/app/services/admin/BusinessClimate.service";

const statusConfig = {
  PLANNED: { label: "Planifié", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-600", icon: Clock },
  INVITATIONS_SENT: { label: "Invitations envoyées", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: Mail },
  CONFIRMED: { label: "Confirmé", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  IN_PROGRESS: { label: "En cours", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Clock },
  COMPLETED: { label: "Terminé", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
  CANCELLED: { label: "Annulé", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: X },
  POSTPONED: { label: "Reporté", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", icon: Clock },
};

const eventTypeLabels = {
  ROUNDTABLE: "Table ronde",
  FORUM: "Forum",
  WORKSHOP: "Atelier",
  CONSULTATION: "Consultation",
  BILATERAL: "Réunion bilatérale",
  SECTOR_MEETING: "Réunion sectorielle",
  WORKING_GROUP: "Groupe de travail",
  CONFERENCE: "Conférence",
  WEBINAR: "Webinaire",
  OTHER: "Autre",
};

export default function DialogueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setPageTitle } = usePageTitle();
  const [dialogue, setDialogue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchDialogue();
    }
  }, [params.id]);

  // Set page title in header
  useEffect(() => {
    if (dialogue) {
      document.title = `${dialogue.title} | Dialogues | ANAPI`;
      setPageTitle(dialogue.title);
    }
    return () => setPageTitle(null);
  }, [dialogue, setPageTitle]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Supprimer le dialogue",
      text: `Êtes-vous sûr de vouloir supprimer le dialogue ${dialogue?.reference} ? Tous les participants associés seront également supprimés.`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/business-climate/dialogues/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Dialogue supprimé",
          text: "Le dialogue a été supprimé avec succès",
          confirmButtonColor: "#2563eb",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/business-climate/dialogues");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorData.error || "Erreur lors de la suppression",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      console.error("Error deleting dialogue:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la suppression",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setDeleting(false);
    }
  };

  const fetchDialogue = async () => {
    try {
      setLoading(true);
      const response = await DialogueGetById(params.id);
      const data = response.data?.data || response.data;
      if (data?.dialogue) {
        setDialogue(data.dialogue);
      } else if (data) {
        setDialogue(data);
      } else {
        throw new Error("Dialogue non trouvé");
      }
    } catch (err) {
      console.error("Error fetching dialogue:", err);
      setError(err.response?.status === 404 ? "Dialogue non trouvé" : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Erreur
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <Link
            href="/business-climate/dialogues"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!dialogue) return null;

  const statusConf = statusConfig[dialogue.status] || statusConfig.PLANNED;
  const StatusIcon = statusConf.icon;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Détail du dialogue
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Direction du Climat des Affaires - Dialogues avec les parties prenantes
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/dialogues"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des dialogues
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${statusConf.bg}`}>
              <Users2 className={`w-8 h-8 ${statusConf.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{dialogue.reference}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {eventTypeLabels[dialogue.eventType] || dialogue.eventType}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {dialogue.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConf.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(dialogue.scheduledDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportDialogueToPDF(dialogue)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-white"
            >
              <Printer className="w-4 h-4" />
              Exporter PDF
            </button>
            <Link
              href={`/business-climate/dialogues/${dialogue.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {dialogue.description || "Aucune description"}
            </p>

            {dialogue.sector && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>Secteur: {dialogue.sector}</span>
                </div>
              </div>
            )}
          </div>

          {/* Objectives */}
          {dialogue.objectives && dialogue.objectives.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Objectifs
              </h3>
              <ul className="space-y-2">
                {dialogue.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Agenda */}
          {dialogue.agenda && dialogue.agenda.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Ordre du jour
              </h3>
              <ul className="space-y-2">
                {dialogue.agenda.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{typeof item === 'string' ? item : item.topic || item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Participants */}
          {dialogue.participants && dialogue.participants.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Participants ({dialogue.participants.length})
              </h3>
              <div className="space-y-3">
                {dialogue.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {participant.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {participant.organization}
                        {participant.role && ` - ${participant.role}`}
                      </div>
                    </div>
                    {participant.email && (
                      <a href={`mailto:${participant.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minutes */}
          {dialogue.minutes && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Compte-rendu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{dialogue.minutes}</p>
            </div>
          )}

          {/* Notes */}
          {dialogue.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">{dialogue.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Référence</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{dialogue.reference}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConf.label}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type d'événement</div>
                <div className="text-sm text-gray-900 dark:text-white">
                  {eventTypeLabels[dialogue.eventType] || dialogue.eventType}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</div>
                <div className="text-sm text-gray-900 dark:text-white">{formatDate(dialogue.scheduledDate)}</div>
              </div>
              {(dialogue.startTime || dialogue.endTime) && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Horaire</div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatTime(dialogue.startTime)} {dialogue.endTime && `- ${formatTime(dialogue.endTime)}`}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Participants prévus</div>
                <div className="text-sm text-gray-900 dark:text-white">{dialogue.expectedParticipants || 0}</div>
              </div>
              {dialogue.actualParticipants && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Participants réels</div>
                  <div className="text-sm text-gray-900 dark:text-white">{dialogue.actualParticipants}</div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {dialogue.isOnline ? <Video className="w-4 h-4 text-blue-600" /> : <MapPin className="w-4 h-4 text-blue-600" />}
              {dialogue.isOnline ? "Événement en ligne" : "Lieu"}
            </h3>
            {dialogue.isOnline ? (
              <div className="space-y-2">
                {dialogue.onlineLink && (
                  <a
                    href={dialogue.onlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    Rejoindre la réunion
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-gray-900 dark:text-white">{dialogue.venue || "Non spécifié"}</div>
                {dialogue.venueAddress && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">{dialogue.venueAddress}</div>
                )}
              </div>
            )}
          </div>

          {/* Organizer */}
          {dialogue.organizer && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Organisateur</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{dialogue.organizer.name}</div>
                  {dialogue.organizer.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{dialogue.organizer.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Decisions */}
          {dialogue.decisions && dialogue.decisions.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Décisions prises
              </h3>
              <ul className="space-y-2">
                {dialogue.decisions.map((decision, idx) => (
                  <li key={idx} className="text-sm text-green-700 dark:text-green-300">
                    • {typeof decision === 'string' ? decision : decision.text || decision.decision}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
