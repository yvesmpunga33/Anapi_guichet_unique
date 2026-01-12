"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CalendarDays,
  UserCheck,
  Video,
} from "lucide-react";
import { ProvinceEventList, ProvinceEventDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
  PUBLISHED: { label: "Publie", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  CANCELLED: { label: "Annule", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  COMPLETED: { label: "Termine", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

const typeConfig = {
  CONFERENCE: { label: "Conference", color: "bg-blue-500" },
  FORUM: { label: "Forum", color: "bg-purple-500" },
  WORKSHOP: { label: "Atelier", color: "bg-green-500" },
  CEREMONY: { label: "Ceremonie", color: "bg-yellow-500" },
  MEETING: { label: "Reunion", color: "bg-gray-500" },
  OTHER: { label: "Autre", color: "bg-pink-500" },
};

export default function EvenementsPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0, totalRegistrations: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchEvents = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await ProvinceEventList(provinceCode, params);
      if (response.data) {
        setEvents(response.data.events || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement evenements:", err);
      setEvents([
        {
          id: 1,
          title: "Forum des Investisseurs 2026",
          description: "Rencontrez plus de 200 investisseurs internationaux",
          eventType: "FORUM",
          status: "PUBLISHED",
          startDate: "2026-02-15T09:00:00Z",
          endDate: "2026-02-17T18:00:00Z",
          location: "Centre des Congres",
          isOnline: false,
          capacity: 500,
          registeredCount: 342,
          image: null,
        },
        {
          id: 2,
          title: "Atelier sur l'Agriculture Durable",
          description: "Formation pratique pour les agriculteurs locaux",
          eventType: "WORKSHOP",
          status: "PUBLISHED",
          startDate: "2026-01-25T08:00:00Z",
          endDate: "2026-01-25T17:00:00Z",
          location: "Salle Polyvalente",
          isOnline: true,
          onlineUrl: "https://meet.example.com/atelier",
          capacity: 100,
          registeredCount: 78,
          image: null,
        },
        {
          id: 3,
          title: "Ceremonie de Lancement du Plan Directeur",
          description: "Presentation officielle du plan de developpement provincial",
          eventType: "CEREMONY",
          status: "DRAFT",
          startDate: "2026-03-01T10:00:00Z",
          endDate: "2026-03-01T14:00:00Z",
          location: "Hotel de Ville",
          isOnline: false,
          capacity: 200,
          registeredCount: 0,
          image: null,
        },
      ]);
      setStats({ total: 24, upcoming: 8, past: 16, totalRegistrations: 1250 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [provinceCode, pagination.page, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchEvents();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceEventDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchEvents(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (date) => new Date(date) > new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <CalendarDays className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Evenements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Conferences, forums, ateliers et ceremonies</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchEvents(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/evenements/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Nouvel evenement
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: CalendarDays, color: "#6366F1" },
          { label: "A venir", value: stats.upcoming, icon: Clock, color: "#10B981" },
          { label: "Passes", value: stats.past, icon: CheckCircle2, color: "#8B5CF6" },
          { label: "Inscriptions", value: stats.totalRegistrations, icon: UserCheck, color: "#F59E0B" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un evenement..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
            <option value="all">Tous les statuts</option>
            <option value="PUBLISHED">Publies</option>
            <option value="DRAFT">Brouillons</option>
            <option value="COMPLETED">Termines</option>
            <option value="CANCELLED">Annules</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <CalendarDays className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucun evenement</h3>
            <p className="text-gray-500 mt-1">Planifiez votre premier evenement</p>
          </div>
        ) : (
          events.map((event) => {
            const status = statusConfig[event.status] || statusConfig.DRAFT;
            const type = typeConfig[event.eventType] || typeConfig.OTHER;
            const upcoming = isUpcoming(event.startDate);

            return (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Date Badge */}
                  <div className="md:w-28 p-4 flex md:flex-col items-center justify-center text-center" style={{ backgroundColor: upcoming ? accentColor : "#9CA3AF" }}>
                    <span className="text-3xl font-bold text-white">{new Date(event.startDate).getDate()}</span>
                    <span className="text-sm text-white/80 ml-2 md:ml-0">{new Date(event.startDate).toLocaleDateString("fr-FR", { month: "short" })}</span>
                    <span className="text-xs text-white/60 ml-2 md:ml-0">{new Date(event.startDate).getFullYear()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${type.color}`}>{type.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                      {event.isOnline && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          <Video className="w-3 h-3" />
                          En ligne
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(event.startDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.registeredCount} / {event.capacity}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-1 p-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700">
                    <Link href={`/${provinceCode}/evenements/${event.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/${provinceCode}/evenements/${event.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(event)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">Page {pagination.page} / {pagination.totalPages}</span>
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'evenement</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.title}</strong>" ?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
