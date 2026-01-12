"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ReferentielSectorList,
  ReferentielSectorCreate,
  ReferentielSectorUpdate,
  ReferentielSectorDelete,
} from "@/app/services/admin/Procurement.service";
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Save,
  X,
  ArrowLeft,
  ChevronRight,
  Palette,
} from "lucide-react";

const colorOptions = [
  { value: "blue", label: "Bleu", class: "bg-blue-500" },
  { value: "green", label: "Vert", class: "bg-green-500" },
  { value: "red", label: "Rouge", class: "bg-red-500" },
  { value: "yellow", label: "Jaune", class: "bg-yellow-500" },
  { value: "purple", label: "Violet", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "pink", label: "Rose", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "teal", label: "Cyan", class: "bg-teal-500" },
  { value: "gray", label: "Gris", class: "bg-gray-500" },
];

export default function SectorsConfigPage() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    parentId: "",
    color: "blue",
    isActive: true,
  });

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSectors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;

      const response = await ReferentielSectorList(params);
      const data = response.data;

      if (data.sectors) {
        setSectors(data.sectors);
      } else {
        setError(data.error || "Erreur lors du chargement");
      }
    } catch (err) {
      setError("Erreur lors du chargement des secteurs");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const openModal = (sector = null) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({
        code: sector.code,
        name: sector.name,
        description: sector.description || "",
        parentId: sector.parentId || "",
        color: sector.color || "blue",
        isActive: sector.isActive,
      });
    } else {
      setEditingSector(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        parentId: "",
        color: "blue",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = editingSector
        ? { ...formData, id: editingSector.id }
        : formData;

      const response = editingSector
        ? await ReferentielSectorUpdate(body)
        : await ReferentielSectorCreate(body);

      const data = response.data;

      if (data.sector) {
        fetchSectors();
        setShowModal(false);
      } else {
        alert(data.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await ReferentielSectorDelete(deleteId);
      const data = response.data;

      if (data.message) {
        fetchSectors();
        setDeleteId(null);
      } else {
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  // Group sectors by parent
  const rootSectors = sectors.filter((s) => !s.parentId);
  const getSubSectors = (parentId) => sectors.filter((s) => s.parentId === parentId);

  const getColorClass = (color) => {
    const found = colorOptions.find((c) => c.value === color);
    return found ? found.class : "bg-blue-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/procurement/config"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-blue-600" />
              Secteurs d'activité
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez les secteurs d'activité pour les soumissionnaires
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Nouveau secteur
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par code ou nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sectors List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : sectors.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun secteur d'activité
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Créez votre premier secteur d'activité
          </p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Ajouter un secteur
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {rootSectors.map((sector) => (
              <div key={sector.id}>
                {/* Parent sector */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${getColorClass(sector.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                          {sector.code}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {sector.name}
                        </h3>
                        {!sector.isActive && (
                          <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-400 rounded">
                            Inactif
                          </span>
                        )}
                        {sector.subSectors && sector.subSectors.length > 0 && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                            {sector.subSectors.length} sous-secteurs
                          </span>
                        )}
                      </div>
                      {sector.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {sector.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(sector)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(sector.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-sectors */}
                {sector.subSectors && sector.subSectors.length > 0 && (
                  <div className="bg-gray-50 dark:bg-slate-700/30">
                    {getSubSectors(sector.id).map((subSector) => (
                      <div
                        key={subSector.id}
                        className="px-6 py-3 pl-16 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors border-t border-gray-100 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className={`w-8 h-8 ${getColorClass(subSector.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Briefcase className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-gray-100 dark:bg-slate-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                                {subSector.code}
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {subSector.name}
                              </span>
                              {!subSector.isActive && (
                                <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-400 rounded">
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(subSector)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(subSector.id)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{sectors.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total secteurs</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="text-2xl font-bold text-green-600">{sectors.filter((s) => s.isActive).length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Secteurs actifs</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="text-2xl font-bold text-blue-600">{rootSectors.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Secteurs principaux</div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingSector ? "Modifier le secteur" : "Nouveau secteur d'activité"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="BTP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Secteur parent
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Aucun (secteur principal)</option>
                    {rootSectors
                      .filter((s) => s.id !== editingSector?.id)
                      .map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Bâtiment et Travaux Publics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Description du secteur..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Couleur
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded-lg ${color.class} flex items-center justify-center transition-transform ${
                        formData.color === color.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"
                      }`}
                    >
                      {formData.color === color.value && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Secteur actif</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.code || !formData.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer ce secteur d'activité ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
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
