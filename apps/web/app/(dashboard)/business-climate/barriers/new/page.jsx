"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Save,
  Loader2,
  Building2,
  User,
  MapPin,
  FileText,
  Phone,
  Mail,
  DollarSign,
  Upload,
  X,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const categoryOptions = [
  { value: "ADMINISTRATIVE", label: "Administratif", description: "Procédures, délais, bureaucratie" },
  { value: "FISCAL", label: "Fiscal", description: "Taxes, impôts, TVA" },
  { value: "REGULATORY", label: "Réglementaire", description: "Normes, règlements, conformité" },
  { value: "LAND", label: "Foncier", description: "Terrains, titres, propriété" },
  { value: "CUSTOMS", label: "Douanier", description: "Import/export, droits de douane" },
  { value: "LABOR", label: "Travail", description: "Emploi, contrats, syndicats" },
  { value: "INFRASTRUCTURE", label: "Infrastructure", description: "Routes, électricité, eau" },
  { value: "FINANCIAL", label: "Financier", description: "Banques, crédits, devises" },
  { value: "OTHER", label: "Autre", description: "Autres obstacles" },
];

const priorityOptions = [
  { value: "LOW", label: "Faible", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  { value: "MEDIUM", label: "Moyen", color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" },
  { value: "HIGH", label: "Élevé", color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  { value: "CRITICAL", label: "Critique", color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
];

const provinceOptions = [
  "Kinshasa", "Kongo-Central", "Kwango", "Kwilu", "Mai-Ndombe",
  "Équateur", "Mongala", "Nord-Ubangi", "Sud-Ubangi", "Tshuapa",
  "Haut-Katanga", "Haut-Lomami", "Lualaba", "Tanganyika",
  "Maniema", "Nord-Kivu", "Sud-Kivu",
  "Ituri", "Tshopo", "Bas-Uele", "Haut-Uele",
  "Kasaï", "Kasaï-Central", "Kasaï-Oriental", "Lomami", "Sankuru",
];

const sectorOptions = [
  "Agriculture", "Mines", "Énergie", "Télécommunications", "Banque & Finance",
  "Commerce", "Construction", "Transport", "Tourisme", "Industries manufacturières",
  "Services", "Santé", "Éducation", "Technologies", "Autre",
];

export default function NewBarrierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingInvestors, setLoadingInvestors] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    priority: "MEDIUM",
    sector: "",
    province: "",
    investorId: "",
    projectId: "",
    administrationConcerned: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    estimatedImpact: "",
    impactDetails: "",
  });

  const [errors, setErrors] = useState({});

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    document.title = "Signaler un obstacle | ANAPI";
    fetchInvestors();
  }, []);

  useEffect(() => {
    if (formData.investorId) {
      fetchProjects(formData.investorId);
    } else {
      setProjects([]);
    }
  }, [formData.investorId]);

  const fetchInvestors = async () => {
    try {
      const response = await fetch("/api/investments/investors?limit=100");
      if (response.ok) {
        const data = await response.json();
        setInvestors(data.investors || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching investors:", error);
    } finally {
      setLoadingInvestors(false);
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
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.priority) newErrors.priority = "La priorité est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/business-climate/barriers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        showNotification("Obstacle créé avec succès", "success");
        setTimeout(() => router.push(`/business-climate/barriers/${data.id}`), 1500);
      } else {
        const error = await response.json();
        showNotification(error.error || "Erreur lors de la création", "error");
      }
    } catch (error) {
      console.error("Error creating barrier:", error);
      showNotification("Erreur lors de la création de l'obstacle", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-900/90 border border-green-200 dark:border-green-700"
              : "bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-700"
          }`}>
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <p className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification({ show: false, message: "", type: "success" })}
              className={`ml-2 p-1 rounded-full hover:bg-opacity-20 ${
                notification.type === "success"
                  ? "text-green-600 dark:text-green-400 hover:bg-green-600"
                  : "text-red-600 dark:text-red-400 hover:bg-red-600"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/business-climate/barriers"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Signaler un obstacle
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Signalez un problème rencontré dans l'environnement des affaires
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de l'obstacle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Délais excessifs pour l'obtention du permis de construire"
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description détaillée <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez en détail l'obstacle rencontré, son contexte et ses conséquences..."
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.category ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label} - {cat.description}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priorité <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {priorityOptions.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: p.value }))}
                      className={`px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                        formData.priority === p.value
                          ? `${p.color} border-current shadow-sm`
                          : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sector and Province */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secteur d'activité
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un secteur</option>
                  {sectorOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Province concernée
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une province</option>
                  {provinceOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Investisseur concerné
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Investisseur
              </label>
              <select
                name="investorId"
                value={formData.investorId}
                onChange={handleChange}
                disabled={loadingInvestors}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Sélectionner un investisseur (optionnel)</option>
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} ({inv.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Projet d'investissement
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                disabled={!formData.investorId || projects.length === 0}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Sélectionner un projet (optionnel)</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.projectCode} - {proj.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Administration Concerned */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Administration concernée
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de l'administration/service
              </label>
              <input
                type="text"
                name="administrationConcerned"
                value={formData.administrationConcerned}
                onChange={handleChange}
                placeholder="Ex: Direction Générale des Impôts, Guichet Unique..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Personne de contact
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Nom du contact"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+243 XXX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Impact estimé
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Impact financier estimé (USD)
              </label>
              <input
                type="text"
                name="estimatedImpact"
                value={formData.estimatedImpact}
                onChange={handleChange}
                placeholder="Ex: 50000"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Détails de l'impact
              </label>
              <input
                type="text"
                name="impactDetails"
                value={formData.impactDetails}
                onChange={handleChange}
                placeholder="Ex: Retard de 3 mois sur le projet"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Les champs marqués <span className="text-red-500">*</span> sont obligatoires</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/business-climate/barriers"
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Signaler l'obstacle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
