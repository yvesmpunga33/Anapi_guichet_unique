"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical,
  CheckCircle2,
  Circle,
  FileText,
  Clock,
  Users,
  Building2,
  Shield,
  AlertCircle,
  Loader2,
  ChevronDown,
  Settings,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const workflowTypes = [
  { value: "AGREMENT", label: "Demandes d'agrement", category: "general" },
  { value: "INVESTMENT", label: "Projets d'investissement", category: "general" },
  // Types specifiques du Guichet Unique
  { value: "AGREMENT_REGIME", label: "Agréments", category: "guichet" },
  { value: "LICENCE_EXPLOITATION", label: "Licences", category: "guichet" },
  { value: "PERMIS_CONSTRUCTION", label: "Permis", category: "guichet" },
  { value: "AUTORISATION_ACTIVITE", label: "Autorisations", category: "guichet" },
];

const iconOptions = [
  { value: "Circle", label: "Cercle", icon: Circle },
  { value: "CheckCircle2", label: "Check", icon: CheckCircle2 },
  { value: "FileText", label: "Document", icon: FileText },
  { value: "Clock", label: "Horloge", icon: Clock },
  { value: "Users", label: "Utilisateurs", icon: Users },
  { value: "Building2", label: "Batiment", icon: Building2 },
  { value: "Shield", label: "Bouclier", icon: Shield },
  { value: "AlertCircle", label: "Alerte", icon: AlertCircle },
  { value: "Settings", label: "Parametres", icon: Settings },
];

const colorOptions = [
  { value: "#3B82F6", label: "Bleu" },
  { value: "#10B981", label: "Vert" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#EF4444", label: "Rouge" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EC4899", label: "Rose" },
  { value: "#14B8A6", label: "Turquoise" },
  { value: "#64748B", label: "Gris" },
];

const defaultStep = {
  name: "",
  description: "",
  icon: "Circle",
  color: "#3B82F6",
  estimatedDays: 7,
  responsibleRole: "",
  isRequired: true,
  isFinal: false,
};

export default function WorkflowStepsPage() {
  const [selectedType, setSelectedType] = useState("AGREMENT");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [formData, setFormData] = useState(defaultStep);

  useEffect(() => {
    fetchSteps();
  }, [selectedType]);

  const fetchSteps = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/config/workflow-steps?type=${selectedType}&activeOnly=false`);
      if (response.ok) {
        const data = await response.json();
        setSteps(data.steps || []);
      }
    } catch (error) {
      console.error("Error fetching steps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Le nom de l'etape est requis");
      return;
    }

    try {
      setSaving(true);

      const url = "/api/config/workflow-steps";
      const method = editingStep ? "PUT" : "POST";
      const body = {
        ...formData,
        workflowType: selectedType,
        ...(editingStep && { id: editingStep.id }),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      await fetchSteps();
      setShowModal(false);
      setEditingStep(null);
      setFormData(defaultStep);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (step) => {
    if (!confirm(`Supprimer l'etape "${step.name}" ?`)) return;

    try {
      const response = await fetch(`/api/config/workflow-steps?id=${step.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      await fetchSteps();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMoveStep = async (index, direction) => {
    const newSteps = [...steps];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= steps.length) return;

    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];

    try {
      const response = await fetch("/api/config/workflow-steps/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: newSteps }),
      });

      if (response.ok) {
        setSteps(newSteps);
      }
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  const handleEdit = (step) => {
    setEditingStep(step);
    setFormData({
      name: step.name,
      description: step.description || "",
      icon: step.icon || "Circle",
      color: step.color || "#3B82F6",
      estimatedDays: step.estimatedDays || 7,
      responsibleRole: step.responsibleRole || "",
      isRequired: step.isRequired !== false,
      isFinal: step.isFinal || false,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (step) => {
    try {
      const response = await fetch("/api/config/workflow-steps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: step.id, isActive: !step.isActive }),
      });

      if (response.ok) {
        await fetchSteps();
      }
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  };

  const getIconComponent = (iconName) => {
    const found = iconOptions.find((i) => i.value === iconName);
    return found ? found.icon : Circle;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuration des etapes de workflow
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerez les etapes de progression pour chaque type de demande
          </p>
        </div>
        <button
          onClick={() => {
            setEditingStep(null);
            setFormData(defaultStep);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter une etape
        </button>
      </div>

      {/* Workflow Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        {/* Types generaux */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Types généraux
          </label>
          <div className="flex flex-wrap gap-2">
            {workflowTypes.filter(t => t.category === 'general').map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Types Guichet Unique */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Guichet Unique
          </label>
          <div className="flex flex-wrap gap-2">
            {workflowTypes.filter(t => t.category === 'guichet').map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type.value
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Etapes ({steps.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : steps.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune etape configuree</p>
            <p className="text-sm text-gray-400 mt-1">
              Cliquez sur "Ajouter une etape" pour commencer
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {steps.map((step, index) => {
              const IconComponent = getIconComponent(step.icon);
              return (
                <div
                  key={step.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !step.isActive ? "opacity-50" : ""
                  }`}
                >
                  {/* Order controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveStep(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveStep(index, "down")}
                      disabled={index === steps.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Step number */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: step.color || "#3B82F6" }}
                  >
                    {step.stepNumber}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: step.color }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {step.name}
                      </p>
                      {step.isRequired && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs rounded font-medium">
                          Obligatoire
                        </span>
                      )}
                      {step.isFinal && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded font-medium">
                          Finale
                        </span>
                      )}
                      {!step.isActive && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {step.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      {step.estimatedDays && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.estimatedDays} jours
                        </span>
                      )}
                      {step.responsibleRole && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {step.responsibleRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(step)}
                      className={`p-2 rounded-lg transition-colors ${
                        step.isActive
                          ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title={step.isActive ? "Desactiver" : "Activer"}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(step)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(step)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingStep ? "Modifier l'etape" : "Nouvelle etape"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de l'etape *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Verification documents"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Description de l'etape..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icone
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Couleur
                  </label>
                  <div className="flex gap-2">
                    {colorOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFormData({ ...formData, color: opt.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === opt.value
                            ? "border-gray-900 dark:border-white scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: opt.value }}
                        title={opt.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Duree & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duree estimee (jours)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({ ...formData, estimatedDays: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role responsable
                  </label>
                  <input
                    type="text"
                    value={formData.responsibleRole}
                    onChange={(e) => setFormData({ ...formData, responsibleRole: e.target.value })}
                    placeholder="Ex: Agent fiscal"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Etape obligatoire</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFinal}
                    onChange={(e) => setFormData({ ...formData, isFinal: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Etape finale</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingStep(null);
                  setFormData(defaultStep);
                }}
                disabled={saving}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingStep ? "Mettre a jour" : "Creer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
