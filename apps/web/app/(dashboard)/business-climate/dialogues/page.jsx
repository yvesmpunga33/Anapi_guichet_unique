"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users2,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Video,
  Building2,
  User,
  Loader2,
  RefreshCw,
  Globe,
  Target,
} from "lucide-react";

// Services
import { DialogueList } from "@/app/services/admin/BusinessClimate.service";

const eventTypeOptions = [
  { value: "", label: "Tous types" },
  { value: "ROUNDTABLE", label: "Table ronde" },
  { value: "FORUM", label: "Forum" },
  { value: "WORKSHOP", label: "Atelier" },
  { value: "CONSULTATION", label: "Consultation" },
  { value: "CONFERENCE", label: "Conférence" },
  { value: "WORKING_GROUP", label: "Groupe de travail" },
  { value: "BILATERAL_MEETING", label: "Réunion bilatérale" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "", label: "Tous statuts" },
  { value: "PLANNED", label: "Planifié" },
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "ONGOING", label: "En cours" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
  { value: "POSTPONED", label: "Reporté" },
];

const thematicAreaOptions = [
  { value: "", label: "Toutes thématiques" },
  { value: "INVESTMENT_CLIMATE", label: "Climat d'investissement" },
  { value: "REGULATORY_REFORM", label: "Réforme réglementaire" },
  { value: "TAXATION", label: "Fiscalité" },
  { value: "LAND_RIGHTS", label: "Droits fonciers" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "SKILLS_DEVELOPMENT", label: "Développement des compétences" },
  { value: "SECTOR_SPECIFIC", label: "Spécifique au secteur" },
  { value: "PPP", label: "Partenariat public-privé" },
  { value: "OTHER", label: "Autre" },
];

const statusConfig = {
  PLANNED: { label: "Planifié", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  CONFIRMED: { label: "Confirmé", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  ONGOING: { label: "En cours", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  COMPLETED: { label: "Terminé", color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-700" },
  CANCELLED: { label: "Annulé", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  POSTPONED: { label: "Reporté", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
};

const eventTypeLabels = {
  ROUNDTABLE: "Table ronde",
  FORUM: "Forum",
  WORKSHOP: "Atelier",
  CONSULTATION: "Consultation",
  CONFERENCE: "Conférence",
  WORKING_GROUP: "Groupe de travail",
  BILATERAL_MEETING: "Réunion bilatérale",
  OTHER: "Autre",
};

const thematicAreaLabels = {
  INVESTMENT_CLIMATE: "Climat d'investissement",
  REGULATORY_REFORM: "Réforme réglementaire",
  TAXATION: "Fiscalité",
  LAND_RIGHTS: "Droits fonciers",
  INFRASTRUCTURE: "Infrastructure",
  SKILLS_DEVELOPMENT: "Développement des compétences",
  SECTOR_SPECIFIC: "Spécifique au secteur",
  PPP: "Partenariat public-privé",
  OTHER: "Autre",
};

export default function DialoguesPage() {
  const [dialogues, setDialogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    eventType: "",
    thematicArea: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // all, upcoming

  useEffect(() => {
    document.title = "Dialogues Parties Prenantes | ANAPI";
  }, []);

  useEffect(() => {
    fetchDialogues();
  }, [pagination.page, filters, viewMode]);

  const fetchDialogues = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
      };

      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.eventType) params.eventType = filters.eventType;
      if (filters.thematicArea) params.thematicArea = filters.thematicArea;
      if (viewMode === "upcoming") params.upcoming = "true";

      const response = await DialogueList(params);
      // API returns { success: true, data: { dialogues: [...], pagination: {...} } }
      const data = response.data?.data || response.data;
      setDialogues(data.dialogues || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Error fetching dialogues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDialogues();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntil = (date) => {
    if (!date) return "";
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Passé";
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    return `Dans ${days}j`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users2 className="w-7 h-7 text-blue-600" />
            Dialogues & Tables rondes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestion des événements de concertation avec les parties prenantes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDialogues}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/business-climate/dialogues/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Planifier un dialogue
          </Link>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "all"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          Tous les dialogues
        </button>
        <button
          onClick={() => setViewMode("upcoming")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          À venir
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par référence, titre, description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters || Object.values(filters).some(v => v)
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type d'événement
              </label>
              <select
                value={filters.eventType}
                onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {eventTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thématique
              </label>
              <select
                value={filters.thematicArea}
                onChange={(e) => setFilters({ ...filters, thematicArea: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {thematicAreaOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : dialogues.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dialogues.map((dialogue) => {
              const statusConf = statusConfig[dialogue.status] || statusConfig.PLANNED;
              const isUpcoming = dialogue.scheduledDate && new Date(dialogue.scheduledDate) > new Date();

              return (
                <Link
                  key={dialogue.id}
                  href={`/business-climate/dialogues/${dialogue.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isUpcoming ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}>
                      {dialogue.isOnline ? (
                        <Video className={`w-5 h-5 ${isUpcoming ? "text-blue-600" : "text-gray-500"}`} />
                      ) : (
                        <Users2 className={`w-5 h-5 ${isUpcoming ? "text-blue-600" : "text-gray-500"}`} />
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusConf.bg} ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {dialogue.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{dialogue.reference}</p>

                  {/* Description */}
                  {dialogue.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                      {dialogue.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(dialogue.scheduledDate)}</span>
                      {dialogue.scheduledDate && (
                        <span className={`ml-auto text-xs font-medium ${
                          isUpcoming ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                        }`}>
                          {getDaysUntil(dialogue.scheduledDate)}
                        </span>
                      )}
                    </div>

                    {dialogue.venue && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{dialogue.venue}</span>
                      </div>
                    )}

                    {dialogue.isOnline && dialogue.onlineLink && (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <span>En ligne</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {eventTypeLabels[dialogue.eventType] || dialogue.eventType}
                    </span>
                    {dialogue.expectedParticipants > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {dialogue.expectedParticipants} participants
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} dialogues)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun dialogue trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Aucun événement de dialogue n'a été planifié pour le moment.
          </p>
          <Link
            href="/business-climate/dialogues/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Planifier un dialogue
          </Link>
        </div>
      )}
    </div>
  );
}
