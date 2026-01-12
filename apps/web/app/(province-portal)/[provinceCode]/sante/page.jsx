"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Stethoscope,
  Hospital,
  Activity,
  Users,
  Bed,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Heart,
  Pill,
  Syringe,
  Baby,
  Brain,
  Grid3X3,
  List,
  Phone,
  Clock,
} from "lucide-react";
import { ProvinceHealthList, ProvinceHealthDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const typeConfig = {
  HOPITAL_GENERAL: { label: "Hopital General", icon: Hospital, color: "#EF4444" },
  HOPITAL_PROVINCIAL: { label: "Hopital Provincial", icon: Hospital, color: "#DC2626" },
  CENTRE_SANTE: { label: "Centre de Sante", icon: Stethoscope, color: "#3B82F6" },
  CLINIQUE: { label: "Clinique", icon: Activity, color: "#8B5CF6" },
  MATERNITE: { label: "Maternite", icon: Baby, color: "#EC4899" },
  CENTRE_SPECIALISE: { label: "Centre Specialise", icon: Brain, color: "#14B8A6" },
  PHARMACIE: { label: "Pharmacie", icon: Pill, color: "#22C55E" },
  LABORATOIRE: { label: "Laboratoire", icon: Syringe, color: "#F59E0B" },
};

const statusConfig = {
  OPERATIONNEL: { label: "Operationnel", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  EN_CONSTRUCTION: { label: "En construction", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  EN_RENOVATION: { label: "En renovation", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  FERME: { label: "Ferme", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const ownershipConfig = {
  PUBLIC: { label: "Public", color: "bg-blue-50 text-blue-700" },
  PRIVE: { label: "Prive", color: "bg-purple-50 text-purple-700" },
  CONFESSIONNEL: { label: "Confessionnel", color: "bg-amber-50 text-amber-700" },
  ONG: { label: "ONG", color: "bg-green-50 text-green-700" },
};

export default function SantePage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, beds: 0, doctors: 0, hospitals: 0 });
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const fetchFacilities = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = { page: pagination.page, limit: pagination.limit };
      if (search) queryParams.search = search;
      if (typeFilter !== "all") queryParams.type = typeFilter;
      if (statusFilter !== "all") queryParams.status = statusFilter;

      const response = await ProvinceHealthList(provinceCode, queryParams);
      if (response.data) {
        setFacilities(response.data.facilities || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement sante:", err);
      // Demo data
      setFacilities([
        {
          id: 1,
          name: "Hopital General Provincial",
          type: "HOPITAL_PROVINCIAL",
          ownership: "PUBLIC",
          status: "OPERATIONNEL",
          location: "Chef-lieu",
          address: "Avenue de la Sante, 1",
          bedCount: 500,
          doctorCount: 120,
          nurseCount: 350,
          specialties: ["Chirurgie", "Pediatrie", "Gynecologie", "Medecine interne", "Urgences"],
          services: ["Bloc operatoire", "Imagerie medicale", "Laboratoire", "Pharmacie"],
          phone: "+243 123 456 789",
          emergencyPhone: "+243 999 999 999",
          openingHours: "24h/24",
          hasEmergency: true,
          hasAmbulance: true,
          image: null,
        },
        {
          id: 2,
          name: "Centre de Sante Mama Yemo",
          type: "CENTRE_SANTE",
          ownership: "CONFESSIONNEL",
          status: "OPERATIONNEL",
          location: "Quartier Nord",
          address: "Rue de la Charite, 45",
          bedCount: 50,
          doctorCount: 8,
          nurseCount: 25,
          specialties: ["Medecine generale", "Pediatrie", "Maternite"],
          services: ["Consultation", "Maternite", "Vaccination"],
          phone: "+243 123 456 780",
          emergencyPhone: null,
          openingHours: "6h-18h",
          hasEmergency: false,
          hasAmbulance: false,
          image: null,
        },
        {
          id: 3,
          name: "Clinique Saint-Joseph",
          type: "CLINIQUE",
          ownership: "PRIVE",
          status: "OPERATIONNEL",
          location: "Centre-ville",
          address: "Boulevard Principal, 123",
          bedCount: 80,
          doctorCount: 25,
          nurseCount: 60,
          specialties: ["Cardiologie", "Ophtalmologie", "Dermatologie", "ORL"],
          services: ["Bloc operatoire", "Scanner", "Echographie"],
          phone: "+243 123 456 781",
          emergencyPhone: "+243 888 888 888",
          openingHours: "7h-21h",
          hasEmergency: true,
          hasAmbulance: true,
          image: null,
        },
        {
          id: 4,
          name: "Centre de Sante Communautaire",
          type: "CENTRE_SANTE",
          ownership: "ONG",
          status: "EN_RENOVATION",
          location: "Zone rurale Est",
          address: "Village Mbudi",
          bedCount: 20,
          doctorCount: 2,
          nurseCount: 8,
          specialties: ["Medecine generale"],
          services: ["Consultation", "Vaccination", "Planning familial"],
          phone: "+243 123 456 782",
          emergencyPhone: null,
          openingHours: "7h-17h",
          hasEmergency: false,
          hasAmbulance: false,
          image: null,
        },
      ]);
      setStats({ total: 156, beds: 2500, doctors: 380, hospitals: 8 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [provinceCode, pagination.page, typeFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchFacilities();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceHealthDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchFacilities(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "-";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Heart className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Sante
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Infrastructures sanitaires de la province</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchFacilities(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/sante/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Nouvelle structure
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Structures", value: formatNumber(stats.total), icon: Building2, color: "#6366F1" },
          { label: "Lits", value: formatNumber(stats.beds), icon: Bed, color: "#10B981" },
          { label: "Medecins", value: formatNumber(stats.doctors), icon: Stethoscope, color: "#F59E0B" },
          { label: "Hopitaux", value: stats.hospitals, icon: Hospital, color: "#EF4444" },
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

      {/* Type Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setTypeFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            typeFilter === "all" ? "text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          }`}
          style={typeFilter === "all" ? { backgroundColor: accentColor } : {}}
        >
          Tous types
        </button>
        {Object.entries(typeConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                typeFilter === key ? "text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
              style={typeFilter === key ? { backgroundColor: config.color } : {}}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une structure..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statusConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`px-3 py-2 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`px-3 py-2 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucune structure</h3>
          <p className="text-gray-500 mt-1">Ajoutez des structures sanitaires</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => {
            const type = typeConfig[facility.type] || typeConfig.CENTRE_SANTE;
            const status = statusConfig[facility.status] || statusConfig.OPERATIONNEL;
            const ownership = ownershipConfig[facility.ownership] || ownershipConfig.PUBLIC;
            const TypeIcon = type.icon;

            return (
              <div key={facility.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="h-32 relative" style={{ backgroundColor: `${type.color}15` }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TypeIcon className="w-16 h-16 opacity-30" style={{ color: type.color }} />
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: type.color }}>
                      {type.label}
                    </span>
                    {facility.hasEmergency && (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500 text-white flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Urgences
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{facility.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${ownership.color}`}>
                      {ownership.label}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                      {facility.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: accentColor }} />
                      {facility.openingHours}
                    </div>
                    {facility.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" style={{ color: accentColor }} />
                        {facility.phone}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{facility.bedCount}</p>
                      <p className="text-xs text-gray-500">Lits</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{facility.doctorCount}</p>
                      <p className="text-xs text-gray-500">Medecins</p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{facility.nurseCount}</p>
                      <p className="text-xs text-gray-500">Infirmiers</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  {facility.specialties && facility.specialties.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {facility.specialties.slice(0, 3).map((spec, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                      {facility.specialties.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                          +{facility.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-1">
                    <Link href={`/${provinceCode}/sante/${facility.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/${provinceCode}/sante/${facility.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(facility)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {facilities.map((facility) => {
            const type = typeConfig[facility.type] || typeConfig.CENTRE_SANTE;
            const status = statusConfig[facility.status] || statusConfig.OPERATIONNEL;
            const ownership = ownershipConfig[facility.ownership] || ownershipConfig.PUBLIC;
            const TypeIcon = type.icon;

            return (
              <div key={facility.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${type.color}20` }}>
                  <TypeIcon className="w-7 h-7" style={{ color: type.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{facility.name}</h3>
                    {facility.hasEmergency && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Urgences</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {facility.location}
                    </span>
                    <span>{type.label}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${ownership.color}`}>{ownership.label}</span>
                  </div>
                </div>

                <div className="text-center px-4 flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{facility.bedCount}</p>
                  <p className="text-xs text-gray-500">Lits</p>
                </div>

                <div className="text-center px-4 flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{facility.doctorCount}</p>
                  <p className="text-xs text-gray-500">Medecins</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/${provinceCode}/sante/${facility.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/${provinceCode}/sante/${facility.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setShowDeleteModal(facility)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer la structure</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.name}</strong>" ?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50">
                Annuler
              </button>
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
