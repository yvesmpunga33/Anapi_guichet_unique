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
  Briefcase,
  DollarSign,
  ClipboardList,
  Shield,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { ReferentielProvinceList, ReferentielSectorList } from "@/app/services/admin/Referentiel.service";

const sections = [
  { id: "type", name: "Type de demande", icon: Shield },
  { id: "investor", name: "Investisseur", icon: Building2 },
  { id: "project", name: "Projet", icon: Briefcase },
  { id: "financial", name: "Finances", icon: DollarSign },
  { id: "documents", name: "Documents", icon: Upload },
  { id: "summary", name: "Recapitulatif", icon: ClipboardList },
];

const approvalTypes = [
  {
    value: "AGREMENT_REGIME",
    label: "Agrement au Regime preferentiel",
    description: "Pour beneficier des avantages fiscaux et douaniers",
    icon: Shield,
  },
  {
    value: "EXONERATION_FISCALE",
    label: "Exoneration Fiscale",
    description: "Exoneration de certaines taxes et impots",
    icon: DollarSign,
  },
  {
    value: "LICENCE_EXPLOITATION",
    label: "Licence d'Exploitation",
    description: "Autorisation d'exercer une activite reglementee",
    icon: FileText,
  },
  {
    value: "PERMIS_CONSTRUCTION",
    label: "Permis de Construction",
    description: "Autorisation de construire ou amenager",
    icon: Building2,
  },
  {
    value: "AUTORISATION_IMPORT",
    label: "Autorisation d'Importation",
    description: "Permission d'importer des biens specifiques",
    icon: Briefcase,
  },
];

const priorityOptions = [
  { value: "LOW", label: "Basse" },
  { value: "NORMAL", label: "Normale" },
  { value: "HIGH", label: "Haute" },
  { value: "URGENT", label: "Urgente" },
];

// Fallback data in case API fails
const DEFAULT_SECTORS = [
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

const DEFAULT_PROVINCES = [
  "Kinshasa", "Kongo-Central", "Kwango", "Kwilu", "Mai-Ndombe",
  "Equateur", "Mongala", "Nord-Ubangi", "Sud-Ubangi", "Tshuapa",
  "Tshopo", "Bas-Uele", "Haut-Uele", "Ituri", "Nord-Kivu",
  "Sud-Kivu", "Maniema", "Haut-Katanga", "Haut-Lomami", "Lualaba",
  "Tanganyika", "Lomami", "Kasai", "Kasai-Central", "Kasai-Oriental", "Sankuru",
];

// Reusable Input Field - defined outside component to prevent re-renders
const InputField = ({ label, required, error, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children || (
      <input
        {...props}
        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-600"
        }`}
      />
    )}
    {error && (
      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

export default function NewAgrementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("type");

  // Dynamic data loaded from API
  const [provinces, setProvinces] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [formData, setFormData] = useState({
    approvalType: "",
    priority: "NORMAL",
    description: "",
    investorType: "company",
    investorName: "",
    rccm: "",
    idNat: "",
    nif: "",
    address: "",
    phone: "",
    email: "",
    sector: "",
    employeesCount: "",
    capital: "",
    representative: "",
    projectName: "",
    projectProvince: "",
    projectCity: "",
    projectDescription: "",
    investmentAmount: "",
    currency: "USD",
    directJobs: "",
    indirectJobs: "",
    projectDuration: "",
    startDate: "",
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  // Load provinces and sectors from API
  useEffect(() => {
    const loadReferenceData = async () => {
      setLoadingData(true);
      setDataError(null);
      try {
        const [provincesRes, sectorsRes] = await Promise.all([
          ReferentielProvinceList().catch(() => null),
          ReferentielSectorList().catch(() => null),
        ]);

        // Extract provinces - handle various response structures
        const provincesData = provincesRes?.data?.data?.provinces
          || provincesRes?.data?.provinces
          || provincesRes?.data?.data
          || provincesRes?.data
          || [];
        setProvinces(Array.isArray(provincesData) ? provincesData : DEFAULT_PROVINCES.map((name, i) => ({ id: i, name })));

        // Extract sectors - handle various response structures
        const sectorsData = sectorsRes?.data?.data?.sectors
          || sectorsRes?.data?.sectors
          || sectorsRes?.data?.data
          || sectorsRes?.data
          || [];
        setSectors(Array.isArray(sectorsData) ? sectorsData : DEFAULT_SECTORS.map((name, i) => ({ id: i, name })));

      } catch (error) {
        console.error("Error loading reference data:", error);
        setDataError("Erreur lors du chargement des donnees de reference");
        // Use fallback data
        setProvinces(DEFAULT_PROVINCES.map((name, i) => ({ id: i, name })));
        setSectors(DEFAULT_SECTORS.map((name, i) => ({ id: i, name })));
      } finally {
        setLoadingData(false);
      }
    };

    loadReferenceData();
  }, []);

  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);

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
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const removeDocument = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const validateSection = (sectionId) => {
    const newErrors = {};

    switch (sectionId) {
      case "type":
        if (!formData.approvalType) {
          newErrors.approvalType = "Veuillez selectionner un type de demande";
        }
        break;
      case "investor":
        if (!formData.investorName.trim()) {
          newErrors.investorName = "Le nom est obligatoire";
        }
        if (!formData.email.trim()) {
          newErrors.email = "L'email est obligatoire";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Format d'email invalide";
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Le telephone est obligatoire";
        }
        break;
      case "project":
        if (!formData.projectName.trim()) {
          newErrors.projectName = "Le nom du projet est obligatoire";
        }
        if (!formData.projectProvince) {
          newErrors.projectProvince = "La province est obligatoire";
        }
        break;
      case "financial":
        if (!formData.investmentAmount.trim()) {
          newErrors.investmentAmount = "Le montant d'investissement est obligatoire";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextSection = () => {
    if (!validateSection(activeSection)) return;
    if (currentSectionIndex < sections.length - 1) {
      setActiveSection(sections[currentSectionIndex + 1].id);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1].id);
    }
  };

  const handleSectionClick = (sectionId) => {
    const targetIndex = sections.findIndex((s) => s.id === sectionId);
    if (targetIndex <= currentSectionIndex) {
      setActiveSection(sectionId);
      return;
    }
    for (let i = currentSectionIndex; i < targetIndex; i++) {
      if (!validateSection(sections[i].id)) {
        setActiveSection(sections[i].id);
        return;
      }
    }
    setActiveSection(sectionId);
  };

  const isSectionComplete = (sectionId) => {
    switch (sectionId) {
      case "type": return !!formData.approvalType;
      case "investor": return formData.investorName && formData.email && formData.phone;
      case "project": return formData.projectName && formData.projectProvince;
      case "financial": return !!formData.investmentAmount;
      case "documents": return documents.length > 0;
      default: return false;
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft) {
      for (const section of ["type", "investor", "project", "financial"]) {
        if (!validateSection(section)) {
          setActiveSection(section);
          return;
        }
      }
    }
    setLoading(true);
    try {
      const response = await fetch('/api/guichet-unique/agrements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalType: formData.approvalType,
          regime: formData.priority,
          investorType: formData.investorType,
          investorName: formData.investorName,
          rccm: formData.rccm,
          idNat: formData.idNat,
          nif: formData.nif,
          email: formData.email,
          phone: formData.phone,
          investorAddress: formData.address,
          sector: formData.sector,
          projectName: formData.projectName,
          projectProvince: formData.projectProvince,
          projectCity: formData.projectCity,
          projectDescription: formData.projectDescription || formData.description,
          investmentAmount: formData.investmentAmount,
          currency: formData.currency,
          directJobs: formData.directJobs,
          indirectJobs: formData.indirectJobs,
          isDraft,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la soumission');
      }

      router.push("/guichet-unique/agrements");
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/guichet-unique/agrements"
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Nouvelle Demande d'Agrement
          </h1>
          <p className="text-sm text-gray-400">
            Remplissez le formulaire pour soumettre une demande
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const SectionIcon = section.icon;
                const isActive = activeSection === section.id;
                const isComplete = isSectionComplete(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-orange-500/20 text-orange-400"
                        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? "bg-orange-500/30"
                          : isComplete
                          ? "bg-green-500/20"
                          : "bg-gray-700"
                      }`}
                    >
                      {isComplete && !isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <SectionIcon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{section.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Progress */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progression</span>
                <span className="text-orange-400 font-medium">
                  {Math.round(
                    (sections.filter((s) => isSectionComplete(s.id)).length / sections.length) * 100
                  )}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                  style={{
                    width: `${(sections.filter((s) => isSectionComplete(s.id)).length / sections.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
            {/* Section: Type de demande */}
            {activeSection === "type" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Type de demande</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Selectionnez le type d'agrement que vous souhaitez demander
                </p>

                {errors.approvalType && (
                  <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {errors.approvalType}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {approvalTypes.map((type) => {
                    const TypeIcon = type.icon;
                    const isSelected = formData.approvalType === type.value;

                    return (
                      <label
                        key={type.value}
                        className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-500/10"
                            : errors.approvalType
                            ? "border-red-500/50 hover:border-red-400 bg-gray-700/30"
                            : "border-gray-600 hover:border-gray-500 bg-gray-700/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="approvalType"
                          value={type.value}
                          checked={isSelected}
                          onChange={(e) => handleChange("approvalType", e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-orange-500/20" : "bg-gray-600/50"
                        }`}>
                          <TypeIcon className={`w-5 h-5 ${isSelected ? "text-orange-400" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isSelected ? "text-orange-400" : "text-white"}`}>
                            {type.label}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-400 absolute top-4 right-4" />
                        )}
                      </label>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priorite</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                    >
                      {priorityOptions.map((p) => (
                        <option key={p.value} value={p.value} className="bg-gray-800">{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description de la demande</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    placeholder="Decrivez votre demande en detail..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Section: Investisseur */}
            {activeSection === "investor" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Informations de l'investisseur</h2>
                <p className="text-sm text-gray-500 mb-6">Renseignez les informations concernant l'investisseur</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Type d'investisseur</label>
                  <div className="flex gap-4">
                    {[
                      { value: "company", label: "Entreprise", icon: Building2 },
                      { value: "individual", label: "Individuel", icon: User },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.investorType === opt.value
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="investorType"
                          value={opt.value}
                          checked={formData.investorType === opt.value}
                          onChange={(e) => handleChange("investorType", e.target.value)}
                          className="sr-only"
                        />
                        <opt.icon className={`w-5 h-5 ${formData.investorType === opt.value ? "text-orange-400" : "text-gray-400"}`} />
                        <span className={`font-medium ${formData.investorType === opt.value ? "text-orange-400" : "text-white"}`}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <InputField
                      label={formData.investorType === "company" ? "Nom de l'entreprise" : "Nom complet"}
                      required
                      error={errors.investorName}
                      type="text"
                      value={formData.investorName}
                      onChange={(e) => handleChange("investorName", e.target.value)}
                      placeholder={formData.investorType === "company" ? "Ex: Congo Mining Corporation" : "Ex: Jean-Pierre Mukendi"}
                    />
                  </div>

                  {formData.investorType === "company" && (
                    <InputField label="RCCM" type="text" value={formData.rccm} onChange={(e) => handleChange("rccm", e.target.value)} placeholder="CD/KIN/RCCM/XX-X-XXXXX" />
                  )}

                  <InputField label="ID National" type="text" value={formData.idNat} onChange={(e) => handleChange("idNat", e.target.value)} placeholder="01-XXX-NXXXXXK" />
                  <InputField label="NIF" type="text" value={formData.nif} onChange={(e) => handleChange("nif", e.target.value)} placeholder="AXXXXXXX" />
                  <InputField label="Email" required error={errors.email} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="contact@example.cd" />
                  <InputField label="Telephone" required error={errors.phone} type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+243 XXX XXX XXX" />

                  <div className="col-span-2">
                    <InputField label="Adresse" type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Adresse complete" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Secteur d'activite</label>
                    <select
                      value={formData.sector}
                      onChange={(e) => handleChange("sector", e.target.value)}
                      disabled={loadingData}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingData ? "Chargement..." : "Selectionnez un secteur"}
                      </option>
                      {sectors.map((s) => (
                        <option key={s.id || s.name || s} value={s.name || s} className="bg-gray-800">
                          {s.name || s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.investorType === "company" && (
                    <>
                      <InputField label="Nombre d'employes" type="number" value={formData.employeesCount} onChange={(e) => handleChange("employeesCount", e.target.value)} placeholder="Ex: 50" />
                      <InputField label="Capital social (USD)" type="text" value={formData.capital} onChange={(e) => handleChange("capital", e.target.value)} placeholder="Ex: 1,000,000" />
                      <div className="col-span-2">
                        <InputField label="Representant legal" type="text" value={formData.representative} onChange={(e) => handleChange("representative", e.target.value)} placeholder="Nom et fonction" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Section: Projet */}
            {activeSection === "project" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Details du projet</h2>
                <p className="text-sm text-gray-500 mb-6">Decrivez le projet pour lequel vous demandez l'agrement</p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <InputField
                      label="Nom du projet"
                      required
                      error={errors.projectName}
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => handleChange("projectName", e.target.value)}
                      placeholder="Ex: Centre de donnees Kinshasa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Province du projet <span className="text-orange-500">*</span>
                    </label>
                    <select
                      value={formData.projectProvince}
                      onChange={(e) => handleChange("projectProvince", e.target.value)}
                      disabled={loadingData}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:ring-2 focus:ring-orange-500 disabled:opacity-50 ${
                        errors.projectProvince ? "border-red-500" : "border-gray-600"
                      }`}
                    >
                      <option value="" className="bg-gray-800">
                        {loadingData ? "Chargement..." : "Selectionnez une province"}
                      </option>
                      {provinces.map((p) => (
                        <option key={p.id || p.name || p} value={p.name || p} className="bg-gray-800">
                          {p.name || p}
                        </option>
                      ))}
                    </select>
                    {errors.projectProvince && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.projectProvince}
                      </p>
                    )}
                  </div>

                  <InputField label="Ville" type="text" value={formData.projectCity} onChange={(e) => handleChange("projectCity", e.target.value)} placeholder="Ex: Kinshasa" />

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description du projet</label>
                    <textarea
                      value={formData.projectDescription}
                      onChange={(e) => handleChange("projectDescription", e.target.value)}
                      rows={4}
                      placeholder="Decrivez le projet, ses objectifs et son impact attendu..."
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section: Finances */}
            {activeSection === "financial" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Informations financieres</h2>
                <p className="text-sm text-gray-500 mb-6">Renseignez les details financiers du projet</p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Montant d'investissement <span className="text-orange-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={formData.investmentAmount}
                        onChange={(e) => handleChange("investmentAmount", e.target.value)}
                        placeholder="Ex: 5,000,000"
                        className={`flex-1 px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 ${
                          errors.investmentAmount ? "border-red-500" : "border-gray-600"
                        }`}
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-24 px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="USD" className="bg-gray-800">USD</option>
                        <option value="CDF" className="bg-gray-800">CDF</option>
                        <option value="EUR" className="bg-gray-800">EUR</option>
                      </select>
                    </div>
                    {errors.investmentAmount && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.investmentAmount}
                      </p>
                    )}
                  </div>

                  <InputField label="Duree du projet" type="text" value={formData.projectDuration} onChange={(e) => handleChange("projectDuration", e.target.value)} placeholder="Ex: 5 ans" />
                  <InputField label="Emplois directs a creer" type="number" min="0" value={formData.directJobs} onChange={(e) => handleChange("directJobs", e.target.value)} placeholder="Ex: 100" />
                  <InputField label="Emplois indirects a creer" type="number" min="0" value={formData.indirectJobs} onChange={(e) => handleChange("indirectJobs", e.target.value)} placeholder="Ex: 250" />
                  <InputField label="Date de debut prevue" type="date" value={formData.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
                </div>
              </div>
            )}

            {/* Section: Documents */}
            {activeSection === "documents" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Documents justificatifs</h2>
                <p className="text-sm text-gray-500 mb-6">Telechargez les documents requis pour votre demande</p>

                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Glissez vos fichiers ici ou cliquez pour telecharger</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG jusqu'a 10MB</p>
                  <label className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 cursor-pointer transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter des fichiers
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                </div>

                {documents.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeDocument(doc.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section: Recapitulatif */}
            {activeSection === "summary" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Recapitulatif de la demande</h2>
                <p className="text-sm text-gray-500 mb-6">Verifiez les informations avant de soumettre</p>

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Type de demande
                    </h3>
                    <p className="text-white font-medium">
                      {approvalTypes.find((t) => t.value === formData.approvalType)?.label || "-"}
                    </p>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Investisseur
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Nom:</span> <span className="text-white ml-2">{formData.investorName || "-"}</span></div>
                      <div><span className="text-gray-500">Email:</span> <span className="text-white ml-2">{formData.email || "-"}</span></div>
                      <div><span className="text-gray-500">Tel:</span> <span className="text-white ml-2">{formData.phone || "-"}</span></div>
                      <div><span className="text-gray-500">Secteur:</span> <span className="text-white ml-2">{formData.sector || "-"}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Projet
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Nom:</span> <span className="text-white ml-2">{formData.projectName || "-"}</span></div>
                      <div><span className="text-gray-500">Province:</span> <span className="text-white ml-2">{formData.projectProvince || "-"}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Finances
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Investissement:</span> <span className="text-white ml-2">{formData.investmentAmount ? `${formData.investmentAmount} ${formData.currency}` : "-"}</span></div>
                      <div><span className="text-gray-500">Emplois:</span> <span className="text-white ml-2">{(parseInt(formData.directJobs) || 0) + (parseInt(formData.indirectJobs) || 0)}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Documents ({documents.length})
                    </h3>
                    {documents.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {documents.map((doc) => (
                          <span key={doc.id} className="px-3 py-1 bg-gray-600/50 rounded-lg text-sm text-gray-300">{doc.name}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun document telecharge</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={goToPrevSection}
              disabled={currentSectionIndex === 0}
              className="px-6 py-3 border border-gray-600 text-gray-400 rounded-xl hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Precedent
            </button>

            <div className="flex gap-3">
              {activeSection === "summary" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-600 text-gray-400 rounded-xl hover:bg-gray-700/50 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Brouillon
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Soumettre
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={goToNextSection}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
