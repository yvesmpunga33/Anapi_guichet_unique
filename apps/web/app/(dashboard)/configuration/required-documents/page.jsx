"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  GripVertical,
  Shield,
  FileCheck,
  Building2,
  Briefcase,
  ClipboardList,
  Factory,
} from "lucide-react";
import { RequiredDocumentList, RequiredDocumentCreate, RequiredDocumentUpdate, RequiredDocumentDelete } from "@/app/services/admin/Config.service";

const dossierTypes = [
  { value: "AGREMENT_REGIME", label: "Agréments", icon: Shield, color: "blue" },
  { value: "LICENCE_EXPLOITATION", label: "Licences", icon: FileCheck, color: "purple" },
  { value: "PERMIS_CONSTRUCTION", label: "Permis", icon: Building2, color: "orange" },
  { value: "AUTORISATION_ACTIVITE", label: "Autorisations", icon: Briefcase, color: "cyan" },
  { value: "DECLARATION_INVESTISSEMENT", label: "Déclarations", icon: ClipboardList, color: "emerald" },
  { value: "DEMANDE_TERRAIN", label: "Terrains", icon: Factory, color: "amber" },
];

const typeColors = {
  AGREMENT_REGIME: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  LICENCE_EXPLOITATION: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  PERMIS_CONSTRUCTION: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  AUTORISATION_ACTIVITE: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  DECLARATION_INVESTISSEMENT: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  DEMANDE_TERRAIN: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
};

export default function RequiredDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("LICENCE_EXPLOITATION");
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    dossierType: "",
    isRequired: true,
    isActive: true,
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await RequiredDocumentList({ dossierType: selectedType });
      setDocuments(response.data?.documents || []);
    } catch (error) {
      console.error("Erreur chargement documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedType]);

  const openCreateModal = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      dossierType: selectedType,
      isRequired: true,
      isActive: true,
    });
    setEditingDoc(null);
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    setFormData({
      code: doc.code,
      name: doc.name,
      description: doc.description || "",
      dossierType: doc.dossierType,
      isRequired: doc.isRequired,
      isActive: doc.isActive,
    });
    setEditingDoc(doc);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let response;
      if (editingDoc) {
        response = await RequiredDocumentUpdate(editingDoc.id, formData);
      } else {
        response = await RequiredDocumentCreate(formData);
      }

      if (response.data?.document) {
        setShowModal(false);
        fetchDocuments();
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: editingDoc ? "Document modifié" : "Document créé",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: response.data?.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc) => {
    const result = await Swal.fire({
      title: "Supprimer ce document ?",
      text: `Êtes-vous sûr de vouloir supprimer "${doc.name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await RequiredDocumentDelete(doc.id);
        fetchDocuments();
        Swal.fire({
          icon: "success",
          title: "Supprimé",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  const toggleRequired = async (doc) => {
    try {
      await RequiredDocumentUpdate(doc.id, { isRequired: !doc.isRequired });
      fetchDocuments();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const toggleActive = async (doc) => {
    try {
      await RequiredDocumentUpdate(doc.id, { isActive: !doc.isActive });
      fetchDocuments();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const currentTypeConfig = dossierTypes.find(t => t.value === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Documents Requis
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configuration des pièces justificatives par type de dossier
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un document
        </button>
      </div>

      {/* Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Type de dossier
        </label>
        <div className="flex flex-wrap gap-2">
          {dossierTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;

            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSelected
                    ? `${typeColors[type.value]} ring-2 ring-offset-2 ring-current`
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${typeColors[selectedType]} flex items-center justify-center`}>
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Requis</p>
              <p className="text-2xl font-bold text-orange-600">{documents.filter(d => d.isRequired).length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
              <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.isActive).length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Documents pour {currentTypeConfig?.label || selectedType}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucun document configuré</p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter le premier document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !doc.isActive ? "opacity-50" : ""
                }`}
              >
                {/* Order */}
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-sm font-medium w-6">{index + 1}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {doc.name}
                    </p>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded font-mono">
                      {doc.code}
                    </span>
                    {doc.isRequired && (
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded font-medium">
                        Requis
                      </span>
                    )}
                    {!doc.isActive && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded font-medium">
                        Inactif
                      </span>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {doc.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRequired(doc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      doc.isRequired
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 hover:bg-orange-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {doc.isRequired ? "Requis" : "Optionnel"}
                  </button>
                  <button
                    onClick={() => toggleActive(doc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      doc.isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {doc.isActive ? "Actif" : "Inactif"}
                  </button>
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingDoc ? "Modifier le document" : "Nouveau document requis"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Ex: RCCM"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de dossier *
                  </label>
                  <select
                    required
                    value={formData.dossierType}
                    onChange={(e) => setFormData({ ...formData, dossierType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {dossierTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du document *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Registre de commerce (RCCM)"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Instructions ou informations supplémentaires..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Document requis</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Actif</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingDoc ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
