"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Users2,
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Video,
  Globe,
  Target,
  Info,
  Plus,
  X,
  Clock,
} from "lucide-react";

const eventTypeOptions = [
  { value: "ROUNDTABLE", label: "Table ronde", description: "Discussion ouverte entre parties prenantes" },
  { value: "FORUM", label: "Forum", description: "Grande réunion thématique" },
  { value: "WORKSHOP", label: "Atelier", description: "Session de travail pratique" },
  { value: "CONSULTATION", label: "Consultation", description: "Recueil d'avis des parties prenantes" },
  { value: "CONFERENCE", label: "Conférence", description: "Présentation et échanges" },
  { value: "WORKING_GROUP", label: "Groupe de travail", description: "Équipe dédiée à un sujet" },
  { value: "BILATERAL_MEETING", label: "Réunion bilatérale", description: "Entre deux parties" },
  { value: "OTHER", label: "Autre", description: "Autre type d'événement" },
];

const thematicAreaOptions = [
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

export default function NewDialoguePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    thematicArea: "",
    eventDate: "",
    endDate: "",
    location: "",
    isVirtual: false,
    virtualPlatform: "",
    virtualLink: "",
    objectives: [""],
    expectedOutcomes: [""],
    targetParticipants: "",
    maxParticipants: "",
    isPublic: false,
    registrationDeadline: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Nouveau dialogue | ANAPI";
  }, []);

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
    if (!formData.eventDate) newErrors.eventDate = "La date est requise";
    if (!formData.isVirtual && !formData.location.trim()) {
      newErrors.location = "Le lieu est requis pour un événement en présentiel";
    }
    if (formData.isVirtual && !formData.virtualPlatform.trim()) {
      newErrors.virtualPlatform = "La plateforme est requise pour un événement virtuel";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Filter out empty strings from arrays
      const submitData = {
        ...formData,
        objectives: formData.objectives.filter((o) => o.trim()),
        expectedOutcomes: formData.expectedOutcomes.filter((o) => o.trim()),
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };

      const response = await fetch("/api/business-climate/dialogues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        await Swal.fire({
          icon: "success",
          title: "Dialogue créé",
          text: "Le dialogue a été planifié avec succès",
          confirmButtonColor: "#2563eb",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push(`/business-climate/dialogues/${data.id}`);
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error || "Erreur lors de la création du dialogue",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error creating dialogue:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la création du dialogue",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/dialogues"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Users2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Planifier un dialogue
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Organisez une table ronde, un forum ou un atelier avec les parties prenantes
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
                placeholder="Ex: Table ronde sur l'amélioration du climat des affaires"
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
                placeholder="Décrivez l'événement, son contexte et son importance..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="">Sélectionner un type</option>
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
                  Thématique
                </label>
                <select
                  name="thematicArea"
                  value={formData.thematicArea}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une thématique</option>
                  {thematicAreaOptions.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date et heure de début <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.eventDate ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                />
                {errors.eventDate && <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date et heure de fin
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Virtual toggle */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Video className="w-4 h-4" />
                  Événement virtuel
                </span>
              </label>
            </div>

            {formData.isVirtual ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plateforme <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="virtualPlatform"
                    value={formData.virtualPlatform}
                    onChange={handleChange}
                    placeholder="Ex: Zoom, Teams, Google Meet"
                    className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.virtualPlatform ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                  {errors.virtualPlatform && <p className="mt-1 text-sm text-red-500">{errors.virtualPlatform}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lien de connexion
                  </label>
                  <input
                    type="url"
                    name="virtualLink"
                    value={formData.virtualLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lieu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Salle de conférence ANAPI, Kinshasa"
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Objectives and Outcomes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Objectifs et résultats attendus
          </h2>

          <div className="space-y-6">
            {/* Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Objectifs
              </label>
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
                    {formData.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("objectives", index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
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

            {/* Expected Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Résultats attendus
              </label>
              <div className="space-y-2">
                {formData.expectedOutcomes.map((outcome, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => handleArrayChange("expectedOutcomes", index, e.target.value)}
                      placeholder={`Résultat ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.expectedOutcomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("expectedOutcomes", index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("expectedOutcomes")}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un résultat attendu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Participation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-600" />
            Participation
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Participants cibles
                </label>
                <input
                  type="text"
                  name="targetParticipants"
                  value={formData.targetParticipants}
                  onChange={handleChange}
                  placeholder="Ex: Investisseurs, administrations, FEC"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre maximum de participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="Ex: 50"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date limite d'inscription
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-full">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Globe className="w-4 h-4" />
                      Événement public
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Visible par tous les utilisateurs</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/business-climate/dialogues"
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Planifier le dialogue
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
