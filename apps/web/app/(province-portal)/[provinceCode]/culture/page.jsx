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
  Calendar,
  Music,
  Palette,
  Theater,
  Book,
  Landmark,
  Users,
  Camera,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Grid3X3,
  List,
  Award,
  Globe,
  Heart,
  Sparkles,
} from "lucide-react";
import { ProvinceCultureList, ProvinceCultureDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const categoryConfig = {
  PATRIMOINE_MATERIEL: { label: "Patrimoine materiel", icon: Landmark, color: "#F59E0B" },
  PATRIMOINE_IMMATERIEL: { label: "Patrimoine immateriel", icon: Sparkles, color: "#8B5CF6" },
  ARTISANAT: { label: "Artisanat", icon: Palette, color: "#EC4899" },
  MUSIQUE_DANSE: { label: "Musique & Danse", icon: Music, color: "#3B82F6" },
  THEATRE_SPECTACLE: { label: "Theatre & Spectacle", icon: Theater, color: "#EF4444" },
  LITTERATURE: { label: "Litterature", icon: Book, color: "#10B981" },
  FESTIVAL: { label: "Festival", icon: Award, color: "#6366F1" },
  GROUPE_CULTUREL: { label: "Groupe culturel", icon: Users, color: "#14B8A6" },
};

const statusConfig = {
  ACTIF: { label: "Actif", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  PROTEGE: { label: "Protege UNESCO", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  EN_DANGER: { label: "En danger", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ARCHIVE: { label: "Archive", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
};

export default function CulturePage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, patrimoine: 0, artistes: 0, festivals: 0 });
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const fetchItems = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = { page: pagination.page, limit: pagination.limit };
      if (search) queryParams.search = search;
      if (categoryFilter !== "all") queryParams.category = categoryFilter;

      const response = await ProvinceCultureList(provinceCode, queryParams);
      if (response.data) {
        setItems(response.data.items || response.data.data || []);
        setStats(response.data.stats || stats);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement culture:", err);
      // Demo data
      setItems([
        {
          id: 1,
          name: "Danse traditionnelle Mukanda",
          category: "PATRIMOINE_IMMATERIEL",
          status: "PROTEGE",
          description: "Danse initiatique ancestrale pratiquee lors des ceremonies de passage a l'age adulte. Inscrite au patrimoine immateriel.",
          origin: "Ethnie Lunda",
          location: "Ensemble de la province",
          yearRecognized: 2015,
          practitioners: 250,
          image: null,
          isUNESCO: true,
          relatedEvents: ["Festival annuel Mukanda", "Ceremonies d'initiation"],
          tags: ["danse", "initiation", "tradition"],
        },
        {
          id: 2,
          name: "Forge traditionnelle de Katanga",
          category: "ARTISANAT",
          status: "ACTIF",
          description: "Technique ancestrale de forge produisant des outils agricoles et objets decoratifs en fer. Savoir-faire transmis de generation en generation.",
          origin: "Village des forgerons",
          location: "District Est",
          practitioners: 45,
          image: null,
          products: ["Houes", "Machettes", "Sculptures en fer", "Bijoux"],
          workshops: 12,
          tags: ["forge", "metal", "artisanat"],
        },
        {
          id: 3,
          name: "Festival International de Musique",
          category: "FESTIVAL",
          status: "ACTIF",
          description: "Plus grand evenement culturel de la province reunissant artistes locaux et internationaux chaque annee en aout.",
          origin: "Chef-lieu",
          location: "Stade provincial",
          yearCreated: 2010,
          visitors: 50000,
          duration: "5 jours",
          nextEdition: "Aout 2026",
          image: null,
          artists: ["Artistes locaux", "Artistes africains", "Artistes internationaux"],
          tags: ["musique", "festival", "evenement"],
        },
        {
          id: 4,
          name: "Palais Royal historique",
          category: "PATRIMOINE_MATERIEL",
          status: "PROTEGE",
          description: "Ancienne residence royale du 18eme siecle, temoignage de l'architecture traditionnelle et de l'histoire du royaume.",
          origin: "Dynastie Luba",
          location: "Centre historique",
          yearBuilt: 1750,
          yearRecognized: 2008,
          surface: 5000,
          image: null,
          features: ["Architecture traditionnelle", "Salle du trone", "Jardins royaux", "Musee"],
          visitorCount: 15000,
          tags: ["palais", "royaute", "histoire"],
        },
        {
          id: 5,
          name: "Groupe folklorique Kasayi",
          category: "GROUPE_CULTUREL",
          status: "ACTIF",
          description: "Troupe de danseurs et musiciens preservant les danses et chants traditionnels de la region. Performances nationales et internationales.",
          origin: "Province",
          location: "Maison de la Culture",
          yearCreated: 1985,
          members: 35,
          image: null,
          repertoire: ["Danses traditionnelles", "Chants ancestraux", "Theatre populaire"],
          performances: 45,
          awards: ["Prix national de la culture 2022", "Festival panafricain 2021"],
          tags: ["folklore", "danse", "musique"],
        },
      ]);
      setStats({ total: 125, patrimoine: 35, artistes: 450, festivals: 12 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [provinceCode, pagination.page, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) fetchItems();
      else setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceCultureDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchItems(true);
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
              <Palette className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Culture & Patrimoine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Richesses culturelles de la province</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchItems(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/culture/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Nouveau element
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Elements", value: stats.total, icon: Palette, color: "#6366F1" },
          { label: "Patrimoines", value: stats.patrimoine, icon: Landmark, color: "#F59E0B" },
          { label: "Artistes", value: stats.artistes, icon: Users, color: "#EC4899" },
          { label: "Festivals", value: stats.festivals, icon: Award, color: "#22C55E" },
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
              placeholder="Rechercher..."
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
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Palette className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucun element</h3>
          <p className="text-gray-500 mt-1">Documentez le patrimoine culturel</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const category = categoryConfig[item.category] || categoryConfig.ARTISANAT;
            const status = statusConfig[item.status] || statusConfig.ACTIF;
            const CategoryIcon = category.icon;

            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image */}
                <div className="h-40 relative" style={{ backgroundColor: `${category.color}15` }}>
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon className="w-16 h-16 opacity-20" style={{ color: category.color }} />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {item.isUNESCO && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                        <Globe className="w-3 h-3" />
                        UNESCO
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: category.color }}>
                      {category.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                    {item.location || item.origin}
                  </div>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    {item.practitioners && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.practitioners} praticiens
                      </span>
                    )}
                    {item.members && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.members} membres
                      </span>
                    )}
                    {item.visitors && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(item.visitors)} visiteurs
                      </span>
                    )}
                    {item.yearRecognized && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.yearRecognized}
                      </span>
                    )}
                  </div>

                  {/* Awards */}
                  {item.awards && item.awards.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-500 truncate">{item.awards[0]}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-1">
                    <Link href={`/${provinceCode}/culture/${item.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/${provinceCode}/culture/${item.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(item)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'element</h3>
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
