"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  FileText,
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Send,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const approvalTypes = [
  { value: "AGREMENT_REGIME", label: "Agrement au Regime preferentiel", description: "Pour beneficier des avantages fiscaux et douaniers" },
  { value: "EXONERATION_FISCALE", label: "Exoneration Fiscale", description: "Exoneration de certaines taxes et impots" },
  { value: "LICENCE_EXPLOITATION", label: "Licence d'Exploitation", description: "Autorisation d'exercer une activite reglementee" },
  { value: "PERMIS_CONSTRUCTION", label: "Permis de Construction", description: "Autorisation de construire ou amenager" },
  { value: "AUTORISATION_IMPORT", label: "Autorisation d'Importation", description: "Permission d'importer des biens specifiques" },
];

const priorityOptions = [
  { value: "LOW", label: "Basse", color: "bg-gray-100 text-gray-600" },
  { value: "NORMAL", label: "Normale", color: "bg-blue-100 text-blue-600" },
  { value: "HIGH", label: "Haute", color: "bg-orange-100 text-orange-600" },
  { value: "URGENT", label: "Urgente", color: "bg-red-100 text-red-600" },
];

const sectors = [
  "Agriculture et elevage",
  "Mines et extraction",
  "Industries manufacturieres",
  "BTP et construction",
  "Commerce et distribution",
  "Transport et logistique",
  "Technologies de l'information",
  "Tourisme et hotellerie",
  "Services financiers",
  "Energie et utilities",
  "Sante et pharmacie",
  "Education et formation",
];

export default function NewAgrementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    investor: true,
    project: true,
    documents: false,
  });

  const [formData, setFormData] = useState({
    // Type de demande
    approvalType: "",
    priority: "NORMAL",
    description: "",

    // Investisseur
    investorType: "company",
    investorName: "",
    rccm: "",
    idNat: "",
    nif: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    sector: "",
    employeesCount: "",
    capital: "",
    representative: "",

    // Projet
    projectTitle: "",
    projectLocation: "",
    investmentAmount: "",
    jobsCreated: "",
    projectDuration: "",
    startDate: "",
    projectDescription: "",
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
      file: file,
      status: "pending",
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const removeDocument = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.approvalType) newErrors.approvalType = "Selectionnez un type de demande";
    if (!formData.investorName) newErrors.investorName = "Nom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.phone) newErrors.phone = "Telephone requis";
    if (!formData.projectTitle) newErrors.projectTitle = "Titre du projet requis";
    if (!formData.projectLocation) newErrors.projectLocation = "Localisation requise";
    if (!formData.investmentAmount) newErrors.investmentAmount = "Montant requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    setLoading(true);

    // Simuler l'envoi
    setTimeout(() => {
      setLoading(false);
      router.push("/guichet-unique/agrements");
    }, 1500);
  };

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-t-xl border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/guichet-unique/agrements"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouvelle Demande d'Agrement
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remplissez le formulaire pour soumettre une demande
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Type de demande */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader title="Type de demande" section="type" icon={FileText} />
          {expandedSections.type && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'agrement *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {approvalTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all ${
                        formData.approvalType === type.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="approvalType"
                        value={type.value}
                        checked={formData.approvalType === type.value}
                        onChange={(e) => handleChange("approvalType", e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{type.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                      </div>
                      {formData.approvalType === type.value && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 absolute top-4 right-4" />
                      )}
                    </label>
                  ))}
                </div>
                {errors.approvalType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.approvalType}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priorite
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {priorityOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description de la demande
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  placeholder="Decrivez votre demande en detail..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Informations Investisseur */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader title="Informations de l'investisseur" section="investor" icon={Building2} />
          {expandedSections.investor && (
            <div className="p-6 space-y-4">
              {/* Type d'investisseur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'investisseur
                </label>
                <div className="flex gap-4">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.investorType === "company"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="investorType"
                      value="company"
                      checked={formData.investorType === "company"}
                      onChange={(e) => handleChange("investorType", e.target.value)}
                      className="sr-only"
                    />
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">Entreprise</span>
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.investorType === "individual"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="investorType"
                      value="individual"
                      checked={formData.investorType === "individual"}
                      onChange={(e) => handleChange("investorType", e.target.value)}
                      className="sr-only"
                    />
                    <User className="w-5 h-5" />
                    <span className="font-medium">Individuel</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {formData.investorType === "company" ? "Nom de l'entreprise *" : "Nom complet *"}
                  </label>
                  <input
                    type="text"
                    value={formData.investorName}
                    onChange={(e) => handleChange("investorName", e.target.value)}
                    placeholder={formData.investorType === "company" ? "Ex: Congo Mining Corporation" : "Ex: Jean-Pierre Mukendi"}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.investorName ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                  {errors.investorName && (
                    <p className="text-red-500 text-sm mt-1">{errors.investorName}</p>
                  )}
                </div>

                {formData.investorType === "company" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RCCM
                    </label>
                    <input
                      type="text"
                      value={formData.rccm}
                      onChange={(e) => handleChange("rccm", e.target.value)}
                      placeholder="CD/KIN/RCCM/XX-X-XXXXX"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID National
                  </label>
                  <input
                    type="text"
                    value={formData.idNat}
                    onChange={(e) => handleChange("idNat", e.target.value)}
                    placeholder="01-XXX-NXXXXXK"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    NIF
                  </label>
                  <input
                    type="text"
                    value={formData.nif}
                    onChange={(e) => handleChange("nif", e.target.value)}
                    placeholder="AXXXXXXX"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="contact@example.cd"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+243 XXX XXX XXX"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Adresse complete"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Secteur d'activite
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleChange("sector", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Selectionnez un secteur</option>
                    {sectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.investorType === "company" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre d'employes
                      </label>
                      <input
                        type="number"
                        value={formData.employeesCount}
                        onChange={(e) => handleChange("employeesCount", e.target.value)}
                        placeholder="Ex: 50"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Capital social (USD)
                      </label>
                      <input
                        type="text"
                        value={formData.capital}
                        onChange={(e) => handleChange("capital", e.target.value)}
                        placeholder="Ex: 1,000,000"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Representant legal
                      </label>
                      <input
                        type="text"
                        value={formData.representative}
                        onChange={(e) => handleChange("representative", e.target.value)}
                        placeholder="Nom et fonction"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Details du Projet */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader title="Details du projet" section="project" icon={FileText} />
          {expandedSections.project && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => handleChange("projectTitle", e.target.value)}
                    placeholder="Ex: Centre de donnees Kinshasa"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.projectTitle ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Localisation *
                  </label>
                  <input
                    type="text"
                    value={formData.projectLocation}
                    onChange={(e) => handleChange("projectLocation", e.target.value)}
                    placeholder="Province, Ville"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.projectLocation ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Montant d'investissement (USD) *
                  </label>
                  <input
                    type="text"
                    value={formData.investmentAmount}
                    onChange={(e) => handleChange("investmentAmount", e.target.value)}
                    placeholder="Ex: 5,000,000"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.investmentAmount ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emplois a creer
                  </label>
                  <input
                    type="number"
                    value={formData.jobsCreated}
                    onChange={(e) => handleChange("jobsCreated", e.target.value)}
                    placeholder="Ex: 100"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duree du projet
                  </label>
                  <input
                    type="text"
                    value={formData.projectDuration}
                    onChange={(e) => handleChange("projectDuration", e.target.value)}
                    placeholder="Ex: 5 ans"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de debut prevue
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description du projet
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => handleChange("projectDescription", e.target.value)}
                    rows={4}
                    placeholder="Decrivez le projet, ses objectifs et son impact attendu..."
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader title="Documents justificatifs" section="documents" icon={Upload} />
          {expandedSections.documents && (
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Glissez vos fichiers ici ou cliquez pour telecharger
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, JPG, PNG jusqu'a 10MB
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter des fichiers
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Link
            href="/guichet-unique/agrements"
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center"
          >
            Annuler
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer brouillon
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Soumettre la demande
          </button>
        </div>
      </form>
    </div>
  );
}
