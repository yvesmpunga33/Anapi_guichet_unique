"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Megaphone,
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Target,
  Users,
  AlertTriangle,
  Plus,
  X,
  Info,
  Scale,
  Building,
} from "lucide-react";

const proposalTypeOptions = [
  { value: "LAW", label: "Projet de loi", description: "Texte législatif à soumettre au Parlement" },
  { value: "DECREE", label: "Projet de décret", description: "Texte réglementaire du Gouvernement" },
  { value: "ORDER", label: "Projet d'arrêté", description: "Décision ministérielle ou administrative" },
  { value: "CIRCULAR", label: "Projet de circulaire", description: "Instructions administratives" },
  { value: "REGULATION", label: "Projet de règlement", description: "Règles et procédures" },
  { value: "AMENDMENT", label: "Amendement", description: "Modification d'un texte existant" },
  { value: "RECOMMENDATION", label: "Recommandation", description: "Suggestion d'amélioration" },
  { value: "OPINION", label: "Avis motivé", description: "Position officielle argumentée" },
  { value: "OTHER", label: "Autre", description: "Autre type de proposition" },
];

const domainOptions = [
  { value: "INVESTMENT_CODE", label: "Code des investissements", icon: "📊" },
  { value: "TAX", label: "Fiscalité", icon: "💰" },
  { value: "CUSTOMS", label: "Douanes", icon: "🚢" },
  { value: "LABOR", label: "Droit du travail", icon: "👷" },
  { value: "LAND", label: "Foncier", icon: "🏗️" },
  { value: "ENVIRONMENT", label: "Environnement", icon: "🌿" },
  { value: "TRADE", label: "Commerce", icon: "🏪" },
  { value: "MINING", label: "Mines", icon: "⛏️" },
  { value: "AGRICULTURE", label: "Agriculture", icon: "🌾" },
  { value: "FINANCE", label: "Finance", icon: "🏦" },
  { value: "BUSINESS_CREATION", label: "Création d'entreprise", icon: "🚀" },
  { value: "OTHER", label: "Autre domaine", icon: "📁" },
];

const priorityOptions = [
  { value: "LOW", label: "Faible", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "MEDIUM", label: "Moyen", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "HIGH", label: "Élevé", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
];

const targetAuthorityOptions = [
  "Présidence de la République",
  "Primature",
  "Ministère de l'Économie",
  "Ministère des Finances",
  "Ministère du Commerce",
  "Ministère du Travail",
  "Ministère des Mines",
  "Ministère de l'Agriculture",
  "Ministère de l'Environnement",
  "Ministère de l'Industrie",
  "Assemblée Nationale",
  "Sénat",
  "Conseil d'État",
  "Direction Générale des Impôts",
  "Direction Générale des Douanes et Accises",
  "Guichet Unique de Création d'Entreprise",
  "Autre",
];

export default function NewProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [barriers, setBarriers] = useState([]);
  const [legalTexts, setLegalTexts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    fullText: "",
    proposalType: "RECOMMENDATION",
    domain: "INVESTMENT_CODE",
    priority: "MEDIUM",
    justification: "",
    expectedImpact: "",
    targetAuthority: "",
    targetedBarriers: [],
    relatedTextId: "",
    internalNotes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Nouvelle proposition légale | ANAPI";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [barriersRes, textsRes] = await Promise.all([
        fetch("/api/business-climate/barriers?status=OPEN,IN_PROGRESS&limit=50"),
        fetch("/api/legal/texts?limit=100"),
      ]);

      if (barriersRes.ok) {
        const data = await barriersRes.json();
        setBarriers(data.data || []);
      }

      if (textsRes.ok) {
        const data = await textsRes.json();
        setLegalTexts(data.texts || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBarrierToggle = (barrierId) => {
    setFormData((prev) => {
      const current = prev.targetedBarriers || [];
      if (current.includes(barrierId)) {
        return { ...prev, targetedBarriers: current.filter((id) => id !== barrierId) };
      } else {
        return { ...prev, targetedBarriers: [...current, barrierId] };
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.summary.trim()) newErrors.summary = "Le résumé est requis";
    if (!formData.proposalType) newErrors.proposalType = "Le type de proposition est requis";
    if (!formData.domain) newErrors.domain = "Le domaine est requis";
    if (!formData.justification.trim()) newErrors.justification = "La justification est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/business-climate/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        await Swal.fire({
          icon: "success",
          title: "Proposition créée",
          text: "La proposition légale a été enregistrée avec succès",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push(`/business-climate/proposals/${data.id}`);
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error || "Erreur lors de la création",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la création de la proposition",
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
          href="/business-climate/proposals"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Megaphone className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouvelle proposition légale
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Soumettez une proposition de réforme ou d'amélioration du cadre légal
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            Informations générales
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de la proposition <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Simplification des procédures d'agrément au Code des Investissements"
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Résumé <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={3}
                placeholder="Résumez brièvement l'objet et les objectifs de cette proposition..."
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.summary ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary}</p>}
            </div>

            {/* Type and Domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de proposition <span className="text-red-500">*</span>
                </label>
                <select
                  name="proposalType"
                  value={formData.proposalType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.proposalType ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {proposalTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.proposalType && <p className="mt-1 text-sm text-red-500">{errors.proposalType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domaine concerné <span className="text-red-500">*</span>
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.domain ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {domainOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
                {errors.domain && <p className="mt-1 text-sm text-red-500">{errors.domain}</p>}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priorité
              </label>
              <div className="grid grid-cols-4 gap-2">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, priority: p.value }))}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      formData.priority === p.value
                        ? `${p.color} border-current`
                        : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Justification and Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            Justification et impact
          </h2>

          <div className="space-y-4">
            {/* Justification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Justification et contexte <span className="text-red-500">*</span>
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                rows={4}
                placeholder="Expliquez pourquoi cette proposition est nécessaire, quels problèmes elle résout..."
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.justification ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.justification && <p className="mt-1 text-sm text-red-500">{errors.justification}</p>}
            </div>

            {/* Expected Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Impact attendu
              </label>
              <textarea
                name="expectedImpact"
                value={formData.expectedImpact}
                onChange={handleChange}
                rows={3}
                placeholder="Décrivez les bénéfices et résultats attendus de cette réforme..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Target Authority */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            Autorité destinataire
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Autorité/Institution cible
            </label>
            <select
              name="targetAuthority"
              value={formData.targetAuthority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner une autorité</option>
              {targetAuthorityOptions.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Targeted Barriers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-purple-600" />
            Obstacles visés
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Sélectionnez les obstacles que cette proposition vise à résoudre
          </p>

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : barriers.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {barriers.map((barrier) => (
                <label
                  key={barrier.id}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    formData.targetedBarriers.includes(barrier.id)
                      ? "bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500"
                      : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.targetedBarriers.includes(barrier.id)}
                    onChange={() => handleBarrierToggle(barrier.id)}
                    className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{barrier.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {barrier.reference} • {barrier.category}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Aucun obstacle actif à lier
            </p>
          )}
        </div>

        {/* Related Legal Text (for amendments) */}
        {formData.proposalType === "AMENDMENT" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Texte juridique à amender
            </h2>

            <select
              name="relatedTextId"
              value={formData.relatedTextId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner un texte existant</option>
              {legalTexts.map((text) => (
                <option key={text.id} value={text.id}>
                  {text.reference} - {text.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Full Text */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Texte complet de la proposition
          </h2>

          <textarea
            name="fullText"
            value={formData.fullText}
            onChange={handleChange}
            rows={10}
            placeholder="Rédigez le texte complet de votre proposition avec les articles, dispositions, etc..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Internal Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            Notes internes
          </h2>

          <textarea
            name="internalNotes"
            value={formData.internalNotes}
            onChange={handleChange}
            rows={3}
            placeholder="Notes internes, commentaires, références additionnelles..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/business-climate/proposals"
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Soumettre la proposition
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
