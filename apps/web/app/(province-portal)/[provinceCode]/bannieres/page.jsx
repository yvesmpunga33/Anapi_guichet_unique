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
  Image as ImageIcon,
  Video,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  GripVertical,
  MonitorPlay,
} from "lucide-react";
import { ProvinceBannerList, ProvinceBannerDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const statusConfig = {
  ACTIVE: { label: "Actif", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  INACTIVE: { label: "Inactif", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
  SCHEDULED: { label: "Planifie", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export default function BannièresPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBanners = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await ProvinceBannerList(provinceCode);
      if (response.data) {
        setBanners(response.data.banners || response.data.data || []);
      }
    } catch (err) {
      console.error("Erreur chargement bannieres:", err);
      setBanners([
        {
          id: 1,
          title: "Bienvenue dans notre province",
          subtitle: "Decouvrez les opportunites d'investissement",
          mediaType: "IMAGE",
          mediaUrl: null,
          status: "ACTIVE",
          displayOrder: 1,
          startDate: "2026-01-01",
          endDate: "2026-12-31",
        },
        {
          id: 2,
          title: "Forum des Investisseurs 2026",
          subtitle: "Rejoignez-nous en fevrier",
          mediaType: "VIDEO",
          mediaUrl: null,
          status: "SCHEDULED",
          displayOrder: 2,
          startDate: "2026-02-01",
          endDate: "2026-02-28",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [provinceCode]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceBannerDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchBanners(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <MonitorPlay className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Bannieres
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerez les bannieres du slider de la page d'accueil
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchBanners(true)}
            disabled={refreshing}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link
            href={`/${provinceCode}/bannieres/nouveau`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-5 h-5" />
            Nouvelle banniere
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16">
            <MonitorPlay className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucune banniere</h3>
            <p className="text-gray-500 mt-1">Ajoutez des bannieres pour votre slider</p>
            <Link
              href={`/${provinceCode}/bannieres/nouveau`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Plus className="w-4 h-4" />
              Creer une banniere
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {banners.map((banner, index) => {
              const status = statusConfig[banner.status] || statusConfig.INACTIVE;
              return (
                <div key={banner.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-4">
                  <div className="text-gray-400 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Preview */}
                  <div className="w-32 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {banner.mediaUrl ? (
                      banner.mediaType === "VIDEO" ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <Image src={banner.mediaUrl} alt="" width={128} height={80} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {banner.mediaType === "VIDEO" ? (
                          <Video className="w-8 h-8 text-gray-400" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">#{banner.displayOrder}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${banner.mediaType === "VIDEO" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {banner.mediaType}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{banner.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/${provinceCode}/bannieres/${banner.id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/${provinceCode}/bannieres/${banner.id}/modifier`}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(banner)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer la banniere</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.title}</strong>" ?
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
