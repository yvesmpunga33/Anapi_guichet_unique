"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Users2,
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  Video,
  Target,
  Info,
  Plus,
  X,
} from "lucide-react";

const eventTypeOptions = [
  { value: "ROUNDTABLE", label: "Table ronde" },
  { value: "FORUM", label: "Forum" },
  { value: "WORKSHOP", label: "Atelier" },
  { value: "CONSULTATION", label: "Consultation" },
  { value: "CONFERENCE", label: "Conférence" },
  { value: "WORKING_GROUP", label: "Groupe de travail" },
  { value: "BILATERAL", label: "Réunion bilatérale" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "PLANNED", label: "Planifié" },
  { value: "INVITATIONS_SENT", label: "Invitations envoyées" },
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
  { value: "POSTPONED", label: "Reporté" },
];

const sectorOptions = [
  { value: "INVESTMENT_CLIMATE", label: "Climat d'investissement" },
  { value: "REGULATORY_REFORM", label: "Réforme réglementaire" },
  { value: "TAXATION", label: "Fiscalité" },
  { value: "LAND_RIGHTS", label: "Droits fonciers" },
  { value: "INFRASTRUCTURE", label: "Infrastructure" },
  { value: "SKILLS_DEVELOPMENT", label: "Développement des compétences" },
  { value: "SECTOR_SPECIFIC", label: "Spécifique au secteur" },
  { value: "PPP", label: "Partenariat public-privé" },
  { value: "OTHER", label: "Autre" },
];

export default function EditDialoguePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    status: "",
    sector: "",
    scheduledDate: "",
    venue: "",
    isOnline: false,
    onlineLink: "",
    objectives: [],
    expectedParticipants: "",
    actualParticipants: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (params.id) {
      fetchDialogue();
    }
  }, [params.id]);

  const fetchDialogue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business-climate/dialogues/${params.id}`);
      if (!response.ok) {
        throw new Error("Dialogue non trouvé");
      }
      const data = await response.json();

      // Format date for datetime-local input
      let scheduledDate = "";
      if (data.scheduledDate) {
        const date = new Date(data.scheduledDate);
        scheduledDate = date.toISOString().slice(0, 16);
      }

      setFormData({
        title: data.title || "",
        description: data.description || "",
        eventType: data.eventType || "",
        status: data.status || "",
        sector: data.sector || "",
        scheduledDate: scheduledDate,
        venue: data.venue || "",
        isOnline: data.isOnline || false,
        onlineLink: data.onlineLink || "",
        objectives: data.objectives || [],
        expectedParticipants: data.expectedParticipants?.toString() || "",
        actualParticipants: data.actualParticipants?.toString() || "",
        notes: data.notes || "",
      });
    } catch (err) {
      console.error("Error fetching dialogue:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors du chargement du dialogue",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.eventType) newErrors.eventType = "Le type d'événement est requis";
    if (!formData.scheduledDate) newErrors.scheduledDate = "La date est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        objectives: formData.objectives.filter((o) => o.trim()),
        expectedParticipants: formData.expectedParticipants ? parseInt(formData.expectedParticipants) : null,
        actualParticipants: formData.actualParticipants ? parseInt(formData.actualParticipants) : null,
      };

      const response = await fetch(`/api/business-climate/dialogues/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Modifications enregistrées",
          text: "Le dialogue a été mis à jour avec succès",
          confirmButtonColor: "#2563eb",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push(`/business-climate/dialogues/${params.id}`);
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error || "Erreur lors de la mise à jour",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error updating dialogue:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la mise à jour du dialogue",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/business-climate/dialogues/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dialogue
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Users2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Modifier le dialogue
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Mettez à jour les informations du dialogue
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Informations générales
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de l'événement <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type d'événement <span className="text-red-500">*</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.eventType ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <option value="">Sélectionner</option>
                  {eventTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.eventType && <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secteur
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  {sectorOptions.map((sector) => (
                    <option key={sector.value} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Location */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Date et lieu
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date et heure <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scheduledDate ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.scheduledDate && <p className="mt-1 text-sm text-red-500">{errors.scheduledDate}</p>}
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Video className="w-4 h-4" />
                  Événement en ligne
                </span>
              </label>
            </div>

            {formData.isOnline ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lien de connexion
                </label>
                <input
                  type="url"
                  name="onlineLink"
                  value={formData.onlineLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lieu
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Ex: Salle de conférence ANAPI"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Objectifs
          </h2>

          <div className="space-y-2">
            {formData.objectives.map((obj, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleArrayChange("objectives", index, e.target.value)}
                  placeholder={`Objectif ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("objectives", index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("objectives")}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Ajouter un objectif
            </button>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-600" />
            Participants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Participants prévus
              </label>
              <input
                type="number"
                name="expectedParticipants"
                value={formData.expectedParticipants}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Participants réels
              </label>
              <input
                type="number"
                name="actualParticipants"
                value={formData.actualParticipants}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes internes</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Notes internes sur le dialogue..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href={`/business-climate/dialogues/${params.id}`}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
