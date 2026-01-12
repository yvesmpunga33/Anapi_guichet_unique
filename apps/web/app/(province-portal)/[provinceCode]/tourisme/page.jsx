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
  MapPin,
  Star,
  Hotel,
  Compass,
  Mountain,
  Waves,
  Trees,
  Landmark,
  Camera,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Grid3X3,
  List,
  Phone,
  Globe,
  Wifi,
  Car,
  Utensils,
  Users,
  DollarSign,
} from "lucide-react";
import { ProvinceTourismList, ProvinceTourismDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const categoryConfig = {
  SITE_NATUREL: { label: "Site naturel", icon: Mountain, color: "#22C55E" },
  SITE_HISTORIQUE: { label: "Site historique", icon: Landmark, color: "#F59E0B" },
  PARC_RESERVE: { label: "Parc/Reserve", icon: Trees, color: "#10B981" },
  PLAGE_LAC: { label: "Plage/Lac", icon: Waves, color: "#3B82F6" },
  HOTEL: { label: "Hotel", icon: Hotel, color: "#8B5CF6" },
  RESTAURANT: { label: "Restaurant", icon: Utensils, color: "#EC4899" },
  ATTRACTION: { label: "Attraction", icon: Compass, color: "#6366F1" },
};

const statusConfig = {
  OUVERT: { label: "Ouvert", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  FERME_TEMPORAIRE: { label: "Ferme temporaire", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  EN_AMENAGEMENT: { label: "En amenagement", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  FERME: { label: "Ferme", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function TourismePage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, sites: 0, hotels: 0, visitors: 0 });
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const fetchSites = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = { page: pagination.page, limit: pagination.limit };
      if (search) queryParams.search = search;
      if (categoryFilter !== "all") queryParams.category = categoryFilter;

      const response = await ProvinceTourismList(provinceCode, queryParams);
      if (response.data) {
        setSites(response.data.sites || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement tourisme:", err);
      // Demo data
      setSites([
        {
          id: 1,
          name: "Parc National de la Province",
          category: "PARC_RESERVE",
          status: "OUVERT",
          description: "Reserve naturelle abritant une faune et flore exceptionnelles. Possibilite de safari et randonnees guidees.",
          location: "District Nord",
          address: "Route nationale 2, Km 85",
          rating: 4.7,
          reviewCount: 325,
          priceRange: "$$",
          entryFee: 50,
          currency: "USD",
          openingHours: "6h-18h",
          bestSeason: "Mai - Octobre",
          activities: ["Safari", "Randonnee", "Camping", "Observation d'oiseaux"],
          amenities: ["Parking", "Restaurant", "Guide", "Boutique"],
          phone: "+243 123 456 789",
          website: "www.parcnational.cd",
          image: null,
          images: [],
          isFeatured: true,
          visitorCount: 25000,
        },
        {
          id: 2,
          name: "Hotel Grand Provincial",
          category: "HOTEL",
          status: "OUVERT",
          description: "Hotel 5 etoiles au coeur de la ville avec vue panoramique. Piscine, spa et restaurant gastronomique.",
          location: "Centre-ville",
          address: "Avenue de l'Independance, 1",
          rating: 4.5,
          reviewCount: 512,
          priceRange: "$$$",
          entryFee: null,
          currency: "USD",
          roomCount: 150,
          openingHours: "24h/24",
          amenities: ["Wifi", "Piscine", "Spa", "Restaurant", "Parking", "Salle de gym"],
          phone: "+243 123 456 780",
          website: "www.grandprovincial.cd",
          image: null,
          images: [],
          isFeatured: true,
          stars: 5,
        },
        {
          id: 3,
          name: "Chutes de la Riviere",
          category: "SITE_NATUREL",
          status: "OUVERT",
          description: "Magnifiques chutes d'eau de 50m de haut dans un cadre naturel preserve. Site ideal pour la photographie.",
          location: "Region Est",
          address: "Piste forestiere, 25km",
          rating: 4.8,
          reviewCount: 189,
          priceRange: "$",
          entryFee: 10,
          currency: "USD",
          openingHours: "7h-17h",
          bestSeason: "Toute l'annee",
          activities: ["Randonnee", "Photographie", "Pique-nique", "Baignade"],
          amenities: ["Parking", "Toilettes", "Point de vue"],
          phone: "+243 123 456 781",
          website: null,
          image: null,
          images: [],
          isFeatured: false,
          visitorCount: 15000,
        },
        {
          id: 4,
          name: "Musee Provincial d'Histoire",
          category: "SITE_HISTORIQUE",
          status: "OUVERT",
          description: "Collection unique d'artefacts retraçant l'histoire de la region depuis l'antiquite jusqu'a nos jours.",
          location: "Centre historique",
          address: "Place du Musee, 5",
          rating: 4.3,
          reviewCount: 156,
          priceRange: "$",
          entryFee: 5,
          currency: "USD",
          openingHours: "9h-17h (ferme lundi)",
          activities: ["Visite guidee", "Exposition", "Atelier"],
          amenities: ["Climatisation", "Boutique", "Cafeteria"],
          phone: "+243 123 456 782",
          website: "www.musee-provincial.cd",
          image: null,
          images: [],
          isFeatured: false,
          visitorCount: 8000,
        },
      ]);
      setStats({ total: 85, sites: 45, hotels: 28, visitors: 150000 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [provinceCode, pagination.page, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchSites();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceTourismDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchSites(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "-";
    return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(num);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Compass className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Tourisme
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sites touristiques et hebergements</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchSites(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/tourisme/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Nouveau site
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total sites", value: stats.total, icon: MapPin, color: "#6366F1" },
          { label: "Sites naturels", value: stats.sites, icon: Mountain, color: "#22C55E" },
          { label: "Hotels", value: stats.hotels, icon: Hotel, color: "#8B5CF6" },
          { label: "Visiteurs/an", value: formatNumber(stats.visitors), icon: Users, color: "#F59E0B" },
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

      {/* Category Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            categoryFilter === "all" ? "text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          }`}
          style={categoryFilter === "all" ? { backgroundColor: accentColor } : {}}
        >
          Tous
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === key ? "text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
              style={categoryFilter === key ? { backgroundColor: config.color } : {}}
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
              placeholder="Rechercher un site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
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
      ) : sites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Compass className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucun site</h3>
          <p className="text-gray-500 mt-1">Ajoutez des sites touristiques</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => {
            const category = categoryConfig[site.category] || categoryConfig.ATTRACTION;
            const status = statusConfig[site.status] || statusConfig.OUVERT;
            const CategoryIcon = category.icon;

            return (
              <div key={site.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image */}
                <div className="h-48 relative" style={{ backgroundColor: `${category.color}15` }}>
                  {site.image ? (
                    <Image src={site.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon className="w-20 h-20 opacity-20" style={{ color: category.color }} />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {site.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: category.color }}>
                      {category.label}
                    </span>
                  </div>
                  {site.stars && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-lg">
                      {Array.from({ length: site.stars }, (_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {site.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                    {site.location}
                  </div>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{site.description}</p>

                  {/* Rating & Price */}
                  <div className="mt-4 flex items-center justify-between">
                    {site.rating && renderStars(site.rating)}
                    <div className="flex items-center gap-2">
                      {site.entryFee && (
                        <span className="text-sm font-medium" style={{ color: accentColor }}>
                          {site.entryFee} {site.currency}
                        </span>
                      )}
                      {site.priceRange && (
                        <span className="text-sm font-medium text-gray-500">{site.priceRange}</span>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  {site.amenities && site.amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {site.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                          {amenity}
                        </span>
                      ))}
                      {site.amenities.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                          +{site.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{site.reviewCount} avis</span>
                    <div className="flex items-center gap-1">
                      <Link href={`/${provinceCode}/tourisme/${site.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/${provinceCode}/tourisme/${site.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setShowDeleteModal(site)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer le site</h3>
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
