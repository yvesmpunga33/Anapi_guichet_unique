"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  FileCheck,
  FileBadge,
  FileKey,
  Plus,
  Trash2,
  Save,
  GripVertical,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Edit3,
} from "lucide-react";
import { MinistryWorkflowList, MinistryWorkflowCreate, MinistryWorkflowUpdate, MinistryWorkflowDelete } from "@/app/services/admin/Config.service";
import { ReferentielMinistryList } from "@/app/services/admin/Referentiel.service";

const requestTypes = [
  { value: "AUTORISATION", label: "Autorisations", icon: FileCheck, color: "blue" },
  { value: "LICENCE", label: "Licences", icon: FileBadge, color: "purple" },
  { value: "PERMIS", label: "Permis", icon: FileKey, color: "orange" },
];

const defaultStep = {
  stepName: "",
  stepDescription: "",
  responsibleRole: "",
  estimatedDays: 3,
  requiredDocuments: [],
};

export default function MinistryWorkflowsPage() {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedType, setSelectedType] = useState("AUTORISATION");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [newDocument, setNewDocument] = useState("");

  // Charger les ministères
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await ReferentielMinistryList();
        const data = response.data?.ministries || response.data?.data || [];
        setMinistries(data);
        if (data.length > 0) {
          setSelectedMinistry(data[0]);
        }
      } catch (error) {
        console.error("Error fetching ministries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMinistries();
  }, []);

  // Charger le workflow quand ministère ou type change
  useEffect(() => {
    if (selectedMinistry) {
      fetchWorkflow();
    }
  }, [selectedMinistry, selectedType]);

  const fetchWorkflow = async () => {
    try {
      const response = await MinistryWorkflowList({
        ministryId: selectedMinistry.id,
        requestType: selectedType,
      });
      const result = response.data;

      if (result?.data?.length > 0) {
        const workflowData = result.data[0];
        setSteps(workflowData.steps || []);
      } else {
        // Workflow par défaut si aucun n'existe
        setSteps([
          { stepName: "Reception", stepDescription: "Reception et verification initiale du dossier", responsibleRole: "Agent", estimatedDays: 2, requiredDocuments: [] },
          { stepName: "Analyse technique", stepDescription: "Analyse technique du dossier", responsibleRole: "Technicien", estimatedDays: 5, requiredDocuments: [] },
          { stepName: "Validation", stepDescription: "Validation par le responsable", responsibleRole: "Chef de service", estimatedDays: 3, requiredDocuments: [] },
          { stepName: "Approbation finale", stepDescription: "Approbation par le Directeur", responsibleRole: "Directeur", estimatedDays: 2, requiredDocuments: [] },
        ]);
      }
    } catch (error) {
      console.error("Error fetching workflow:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedMinistry || steps.length === 0) return;

    setSaving(true);
    try {
      await MinistryWorkflowCreate({
        ministryId: selectedMinistry.id,
        requestType: selectedType,
        steps,
      });

      setSuccessMessage("Workflow enregistre avec succes");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error saving workflow:", error);
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => {
    setSteps([...steps, { ...defaultStep, stepName: `Etape ${steps.length + 1}` }]);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= steps.length) return;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const toggleExpand = (index) => {
    setExpandedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addDocument = (stepIndex) => {
    if (!newDocument.trim()) return;
    const newSteps = [...steps];
    newSteps[stepIndex].requiredDocuments = [
      ...(newSteps[stepIndex].requiredDocuments || []),
      newDocument.trim(),
    ];
    setSteps(newSteps);
    setNewDocument("");
  };

  const removeDocument = (stepIndex, docIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].requiredDocuments = newSteps[stepIndex].requiredDocuments.filter(
      (_, i) => i !== docIndex
    );
    setSteps(newSteps);
  };

  const typeConfig = requestTypes.find((t) => t.value === selectedType);
  const TypeIcon = typeConfig?.icon || FileCheck;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configuration des Workflows
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Definir les etapes de traitement par ministere
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || steps.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>
      </div>

      {/* Sélecteurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sélection du ministère */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Building2 className="w-4 h-4 inline mr-2" />
            Ministere
          </label>
          <select
            value={selectedMinistry?.id || ""}
            onChange={(e) => {
              const ministry = ministries.find((m) => m.id === e.target.value);
              setSelectedMinistry(ministry);
            }}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sélection du type */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type de demande
          </label>
          <div className="grid grid-cols-3 gap-2">
            {requestTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20 text-${type.color}-700 dark:text-${type.color}-400`
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? `text-${type.color}-500` : "text-gray-400"}`} />
                  <span className="font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Étapes du workflow */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${typeConfig?.color || "blue"}-100 dark:bg-${typeConfig?.color || "blue"}-900/30 rounded-xl flex items-center justify-center`}>
              <TypeIcon className={`w-5 h-5 text-${typeConfig?.color || "blue"}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Etapes du workflow - {typeConfig?.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {steps.length} etape(s) configuree(s)
              </p>
            </div>
          </div>
          <button
            onClick={addStep}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une etape
          </button>
        </div>

        <div className="p-5 space-y-4">
          {steps.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucune etape configuree</p>
              <button
                onClick={addStep}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Ajouter la premiere etape
              </button>
            </div>
          ) : (
            steps.map((step, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                {/* Header de l'étape */}
                <div
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(index, -1);
                      }}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(index, 1);
                      }}
                      disabled={index === steps.length - 1}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {step.stepName || `Etape ${index + 1}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.responsibleRole || "Role non defini"} • {step.estimatedDays} jour(s)
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(index);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSteps[index] ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Contenu détaillé */}
                {expandedSteps[index] && (
                  <div className="p-5 space-y-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom de l'etape *
                        </label>
                        <input
                          type="text"
                          value={step.stepName}
                          onChange={(e) => updateStep(index, "stepName", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Ex: Verification technique"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Responsable
                        </label>
                        <input
                          type="text"
                          value={step.responsibleRole}
                          onChange={(e) => updateStep(index, "responsibleRole", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Ex: Chef de service"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={step.stepDescription}
                        onChange={(e) => updateStep(index, "stepDescription", e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        placeholder="Description de cette etape..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Duree estimee (jours)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={step.estimatedDays}
                          onChange={(e) => updateStep(index, "estimatedDays", parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Documents requis
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newDocument}
                            onChange={(e) => setNewDocument(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addDocument(index)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Nom du document"
                          />
                          <button
                            onClick={() => addDocument(index)}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {step.requiredDocuments?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {step.requiredDocuments.map((doc, docIndex) => (
                              <span
                                key={docIndex}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                              >
                                {doc}
                                <button
                                  onClick={() => removeDocument(index, docIndex)}
                                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
