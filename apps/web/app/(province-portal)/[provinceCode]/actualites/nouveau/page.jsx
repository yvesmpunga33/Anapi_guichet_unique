"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  X,
  Loader2,
  Calendar,
  Tag,
  FileText,
  Zap,
  Globe,
  Clock,
} from "lucide-react";
import { ProvinceNewsCreate } from "@/app/services/Province.service";
import { useProvince } from "../../layout";

const categories = [
  { value: "GENERAL", label: "General" },
  { value: "ECONOMIE", label: "Economie" },
  { value: "POLITIQUE", label: "Politique" },
  { value: "SOCIAL", label: "Social" },
  { value: "CULTURE", label: "Culture" },
  { value: "SPORT", label: "Sport" },
  { value: "ENVIRONNEMENT", label: "Environnement" },
];

export default function NouvelleActualitePage() {
  const params = useParams();
  const router = useRouter();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "GENERAL",
    tags: "",
    status: "DRAFT",
    isBreaking: false,
    isFeatured: false,
    publishedAt: "",
    image: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (status = "DRAFT") => {
    setError("");

    if (!formData.title.trim()) {
      setError("Le titre est requis");
      return;
    }
    if (!formData.content.trim()) {
      setError("Le contenu est requis");
      return;
    }

    setSaving(true);

    try {
      const data = {
        ...formData,
        status,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        publishedAt: status === "PUBLISHED" ? formData.publishedAt || new Date().toISOString() : null,
      };

      await ProvinceNewsCreate(provinceCode, data);
      router.push(`/${provinceCode}/actualites`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${provinceCode}/actualites`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouvelle actualite
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Creer une nouvelle actualite pour la province
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? "Editer" : "Apercu"}
          </button>
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FileText className="w-4 h-4" />
            Brouillon
          </button>
          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
            style={{ backgroundColor: accentColor }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publier
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre de l'actualite"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 text-lg"
              style={{ "--tw-ring-color": accentColor }}
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resume / Extrait
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Bref resume de l'actualite (optionnel)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">{formData.excerpt.length}/300 caracteres</p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenu *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Redigez le contenu de l'actualite..."
              rows={15}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Markdown supporte</p>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">SEO & Meta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta titre
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Titre pour les moteurs de recherche"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Description pour les moteurs de recherche"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Options</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (separes par virgule)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="economie, investissement, ..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de publication
                </label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isBreaking"
                    checked={formData.isBreaking}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Zap className="w-4 h-4 text-red-500" />
                    Breaking News
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Mettre en avant
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Image principale</h3>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 mb-2">Glissez une image ici</p>
              <p className="text-xs text-gray-400 mb-4">PNG, JPG jusqu'a 5MB</p>
              <button
                type="button"
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Parcourir
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ou URL de l'image
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Conseils</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Utilisez un titre accrocheur</li>
              <li>• Ajoutez une image de qualite</li>
              <li>• Le resume apparait dans les listes</li>
              <li>• Les tags ameliorent la recherche</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
