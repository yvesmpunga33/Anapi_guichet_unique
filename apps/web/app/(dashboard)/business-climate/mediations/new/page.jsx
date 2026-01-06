"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Handshake,
  ArrowLeft,
  Save,
  Loader2,
  Building2,
  User,
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  Info,
  Scale,
} from "lucide-react";

const disputeTypeOptions = [
  { value: "CONTRACT", label: "Litige contractuel", description: "Différends sur les termes d'un contrat" },
  { value: "TAX", label: "Litige fiscal", description: "Contestation d'impôts ou taxes" },
  { value: "LABOR", label: "Litige du travail", description: "Conflits employeur-employé" },
  { value: "LAND", label: "Litige foncier", description: "Propriété, occupation de terrain" },
  { value: "PERMIT", label: "Litige sur permis", description: "Refus ou retrait de permis" },
  { value: "CUSTOMS", label: "Litige douanier", description: "Import/export, droits de douane" },
  { value: "ENVIRONMENTAL", label: "Litige environnemental", description: "Pollution, impact environnemental" },
  { value: "COMMERCIAL", label: "Litige commercial", description: "Différends commerciaux généraux" },
  { value: "OTHER", label: "Autre", description: "Autres types de litiges" },
];

const urgencyOptions = [
  { value: "LOW", label: "Faible", color: "bg-blue-100 text-blue-700" },
  { value: "MEDIUM", label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
  { value: "HIGH", label: "Élevée", color: "bg-orange-100 text-orange-700" },
  { value: "CRITICAL", label: "Critique", color: "bg-red-100 text-red-700" },
];

const respondentTypeOptions = [
  { value: "MINISTRY", label: "Ministère" },
  { value: "AGENCY", label: "Agence gouvernementale" },
  { value: "LOCAL_GOVERNMENT", label: "Administration locale" },
  { value: "PUBLIC_ENTERPRISE", label: "Entreprise publique" },
  { value: "PRIVATE_COMPANY", label: "Entreprise privée" },
  { value: "INDIVIDUAL", label: "Individu" },
  { value: "OTHER", label: "Autre" },
];

export default function NewMediationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [barriers, setBarriers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    disputeType: "",
    urgencyLevel: "MEDIUM",
    investorId: "",
    projectId: "",
    relatedBarrierId: "",
    respondentName: "",
    respondentType: "",
    respondentContact: "",
    investorClaim: "",
    claimAmount: "",
    claimCurrency: "USD",
    respondentPosition: "",
    hearingDate: "",
    hearingLocation: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Nouvelle médiation | ANAPI";
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.investorId) {
      fetchProjects(formData.investorId);
    } else {
      setProjects([]);
    }
  }, [formData.investorId]);

  const fetchData = async () => {
    try {
      const [investorsRes, barriersRes] = await Promise.all([
        fetch("/api/investments/investors?limit=100"),
        fetch("/api/business-climate/barriers?limit=100&status=IN_PROGRESS"),
      ]);

      if (investorsRes.ok) {
        const data = await investorsRes.json();
        setInvestors(data.investors || data.data || []);
      }

      if (barriersRes.ok) {
        const data = await barriersRes.json();
        setBarriers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchProjects = async (investorId) => {
    try {
      const response = await fetch(`/api/investments/projects?investorId=${investorId}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.disputeType) newErrors.disputeType = "Le type de litige est requis";
    if (!formData.investorId) newErrors.investorId = "L'investisseur est requis";
    if (!formData.investorClaim.trim()) newErrors.investorClaim = "La réclamation est requise";
    if (!formData.respondentName.trim()) newErrors.respondentName = "Le nom du défendeur est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/business-climate/mediations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/business-climate/mediations/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating mediation:", error);
      alert("Erreur lors de la création de la médiation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/mediations"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Handshake className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouvelle médiation
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Créez un nouveau cas de médiation entre un investisseur et une administration
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
            Informations du litige
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du litige <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Contestation de la taxe sur l'exploitation minière"
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description du litige <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Décrivez brièvement le contexte et la nature du litige..."
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de litige <span className="text-red-500">*</span>
                </label>
                <select
                  name="disputeType"
                  value={formData.disputeType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.disputeType ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <option value="">Sélectionner un type</option>
                  {disputeTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.disputeType && <p className="mt-1 text-sm text-red-500">{errors.disputeType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Niveau d'urgence <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {urgencyOptions.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, urgencyLevel: u.value }))}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        formData.urgencyLevel === u.value
                          ? `${u.color} border-current`
                          : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300"
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Obstacle lié (optionnel)
              </label>
              <select
                name="relatedBarrierId"
                value={formData.relatedBarrierId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Aucun obstacle lié</option>
                {barriers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.reference} - {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            Parties au litige
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demandeur (Investor) */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-700">
                Demandeur (Investisseur)
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Investisseur <span className="text-red-500">*</span>
                </label>
                <select
                  name="investorId"
                  value={formData.investorId}
                  onChange={handleChange}
                  disabled={loadingData}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.investorId ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <option value="">Sélectionner l'investisseur</option>
                  {investors.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.country})
                    </option>
                  ))}
                </select>
                {errors.investorId && <p className="mt-1 text-sm text-red-500">{errors.investorId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Projet concerné
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  disabled={!formData.investorId}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Sélectionner un projet</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.projectCode} - {proj.projectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Défendeur */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-700">
                Défendeur
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du défendeur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="respondentName"
                  value={formData.respondentName}
                  onChange={handleChange}
                  placeholder="Ex: Direction Générale des Impôts"
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.respondentName ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                />
                {errors.respondentName && <p className="mt-1 text-sm text-red-500">{errors.respondentName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de défendeur
                </label>
                <select
                  name="respondentType"
                  value={formData.respondentType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner le type</option>
                  {respondentTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact du défendeur
                </label>
                <input
                  type="text"
                  name="respondentContact"
                  value={formData.respondentContact}
                  onChange={handleChange}
                  placeholder="Email ou téléphone"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Claim Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Détails de la réclamation
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Réclamation de l'investisseur <span className="text-red-500">*</span>
              </label>
              <textarea
                name="investorClaim"
                value={formData.investorClaim}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez la réclamation de l'investisseur..."
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.investorClaim ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.investorClaim && <p className="mt-1 text-sm text-red-500">{errors.investorClaim}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Montant réclamé
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="claimAmount"
                    value={formData.claimAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    name="claimCurrency"
                    value={formData.claimCurrency}
                    onChange={handleChange}
                    className="w-24 px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CDF">CDF</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position du défendeur
              </label>
              <textarea
                name="respondentPosition"
                value={formData.respondentPosition}
                onChange={handleChange}
                rows={3}
                placeholder="Position ou réponse du défendeur (si connue)..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Hearing Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Audience (optionnel)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de l'audience
              </label>
              <input
                type="datetime-local"
                name="hearingDate"
                value={formData.hearingDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lieu de l'audience
              </label>
              <input
                type="text"
                name="hearingLocation"
                value={formData.hearingLocation}
                onChange={handleChange}
                placeholder="Ex: Salle de réunion ANAPI"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/business-climate/mediations"
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
                Création...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Créer la médiation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
