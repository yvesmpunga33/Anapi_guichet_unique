"use client";

import { useState } from "react";
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
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  Mail,
  Phone,
  Hash,
  Target,
  ClipboardList,
  Shield,
  Factory,
  FileCheck,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "investor", name: "Investisseur", icon: Building2 },
  { id: "type", name: "Type de dossier", icon: FileText },
  { id: "project", name: "Projet", icon: Briefcase },
  { id: "financial", name: "Finances", icon: DollarSign },
  { id: "documents", name: "Documents", icon: Upload },
  { id: "summary", name: "Recapitulatif", icon: ClipboardList },
];

const dossierTypes = [
  {
    value: "AGREMENT_REGIME",
    label: "Agrement au Regime preferentiel",
    description: "Avantages fiscaux et douaniers",
    icon: Shield,
    color: "blue"
  },
  {
    value: "DECLARATION_INVESTISSEMENT",
    label: "Declaration d'investissement",
    description: "Declaration prealable obligatoire",
    icon: ClipboardList,
    color: "emerald"
  },
  {
    value: "DEMANDE_TERRAIN",
    label: "Demande de terrain industriel",
    description: "Attribution en zone economique",
    icon: Factory,
    color: "amber"
  },
  {
    value: "LICENCE_EXPLOITATION",
    label: "Licence d'exploitation",
    description: "Activite reglementee",
    icon: FileCheck,
    color: "purple"
  },
];

const sectors = [
  { value: "agriculture", label: "Agriculture et elevage" },
  { value: "mines", label: "Mines et extraction" },
  { value: "industrie", label: "Industries manufacturieres" },
  { value: "btp", label: "BTP et construction" },
  { value: "commerce", label: "Commerce et distribution" },
  { value: "transport", label: "Transport et logistique" },
  { value: "tech", label: "Technologies de l'information" },
  { value: "tourisme", label: "Tourisme et hotellerie" },
  { value: "finance", label: "Services financiers" },
  { value: "energie", label: "Energie et utilities" },
  { value: "sante", label: "Sante et pharmacie" },
  { value: "education", label: "Education et formation" },
];

const provinces = [
  "Kinshasa", "Kongo-Central", "Kwango", "Kwilu", "Mai-Ndombe",
  "Equateur", "Mongala", "Nord-Ubangi", "Sud-Ubangi", "Tshuapa",
  "Tshopo", "Bas-Uele", "Haut-Uele", "Ituri", "Nord-Kivu",
  "Sud-Kivu", "Maniema", "Haut-Katanga", "Haut-Lomami", "Lualaba",
  "Tanganyika", "Lomami", "Kasai", "Kasai-Central", "Kasai-Oriental", "Sankuru",
];

export default function NewDossierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("investor");

  const [formData, setFormData] = useState({
    dossierType: "",
    investorType: "company",
    investorName: "",
    rccm: "",
    idNat: "",
    nif: "",
    address: "",
    phone: "",
    email: "",
    country: "RDC",
    province: "",
    city: "",
    projectName: "",
    projectDescription: "",
    sector: "",
    subSector: "",
    projectProvince: "",
    projectCity: "",
    projectAddress: "",
    investmentAmount: "",
    currency: "USD",
    directJobs: "",
    indirectJobs: "",
    startDate: "",
    endDate: "",
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

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

  const currentSectionIndex = sections.findIndex(s => s.id === activeSection);

  // Validation par section
  const validateSection = (sectionId) => {
    const newErrors = {};

    switch (sectionId) {
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

      case "type":
        if (!formData.dossierType) {
          newErrors.dossierType = "Veuillez selectionner un type de dossier";
        }
        break;

      case "project":
        if (!formData.projectName.trim()) {
          newErrors.projectName = "Le nom du projet est obligatoire";
        }
        if (!formData.sector) {
          newErrors.sector = "Le secteur est obligatoire";
        }
        if (!formData.projectProvince) {
          newErrors.projectProvince = "La province du projet est obligatoire";
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
    // Valider la section actuelle avant de passer à la suivante
    if (!validateSection(activeSection)) {
      return; // Ne pas avancer si la validation échoue
    }

    if (currentSectionIndex < sections.length - 1) {
      setActiveSection(sections[currentSectionIndex + 1].id);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1].id);
    }
  };

  // Navigation par sidebar - valide la section actuelle si on avance
  const handleSectionClick = (sectionId) => {
    const targetIndex = sections.findIndex(s => s.id === sectionId);

    // Si on va en arrière ou reste sur la même section, pas de validation
    if (targetIndex <= currentSectionIndex) {
      setActiveSection(sectionId);
      return;
    }

    // Si on avance, valider toutes les sections entre la section actuelle et la cible
    for (let i = currentSectionIndex; i < targetIndex; i++) {
      if (!validateSection(sections[i].id)) {
        // Rester sur la section qui a échoué la validation
        setActiveSection(sections[i].id);
        return;
      }
    }

    // Toutes les validations passées, aller à la section cible
    setActiveSection(sectionId);
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/guichet-unique/dossiers");
    }, 1500);
  };

  const isSectionComplete = (sectionId) => {
    switch (sectionId) {
      case "type":
        return !!formData.dossierType;
      case "investor":
        return !!(formData.investorName && formData.email && formData.phone);
      case "project":
        return !!(formData.projectName && formData.sector && formData.projectProvince);
      case "financial":
        return !!formData.investmentAmount;
      case "documents":
        return documents.length > 0;
      default:
        return false;
    }
  };

  // Reusable Input Field
  const InputField = ({ label, required, error, className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
          error ? "border-red-500" : "border-gray-700"
        }`}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );

  // Reusable Select Field
  const SelectField = ({ label, required, error, options, placeholder, className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <select
        {...props}
        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none ${
          error ? "border-red-500" : "border-gray-700"
        }`}
      >
        <option value="" className="bg-gray-800">{placeholder}</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value} className="bg-gray-800">
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/guichet-unique/dossiers"
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              Nouveau Dossier d'Investissement
            </h1>
            <p className="text-sm text-gray-500">
              Enregistrement d'un nouveau dossier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded-xl hover:bg-orange-500/10 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-6">
        {/* Left Sidebar - Section Navigation */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-gray-800/50 rounded-2xl p-4 sticky top-4">
            <nav className="space-y-1">
              {sections.map((section, index) => {
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
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : isComplete
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {isComplete && !isActive ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <SectionIcon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50">
            {/* Section Type de dossier */}
            {activeSection === "type" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Type de dossier
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Selectionnez le type de procedure administrative
                </p>

                {errors.dossierType && (
                  <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {errors.dossierType}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {dossierTypes.map((type) => {
                    const TypeIcon = type.icon;
                    const isSelected = formData.dossierType === type.value;

                    return (
                      <label
                        key={type.value}
                        className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-500/10"
                            : errors.dossierType
                            ? "border-red-500/50 hover:border-red-400 bg-gray-800/30"
                            : "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="dossierType"
                          value={type.value}
                          checked={isSelected}
                          onChange={(e) => handleChange("dossierType", e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                        }`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-500 absolute top-3 right-3" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section Investisseur */}
            {activeSection === "investor" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Informations de l'investisseur
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Renseignez les informations du demandeur
                </p>

                {/* Type d'investisseur */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Type d'investisseur
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.investorType === "company"
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-gray-700 text-gray-400 hover:border-gray-600"
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
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.investorType === "individual"
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-gray-700 text-gray-400 hover:border-gray-600"
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

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label={formData.investorType === "company" ? "Nom de l'entreprise" : "Nom complet"}
                    required
                    type="text"
                    value={formData.investorName}
                    onChange={(e) => handleChange("investorName", e.target.value)}
                    placeholder={formData.investorType === "company" ? "Ex: Congo Mining Corp" : "Ex: Jean Mukendi"}
                    error={errors.investorName}
                    className="col-span-2"
                  />

                  {formData.investorType === "company" && (
                    <>
                      <InputField
                        label="RCCM"
                        type="text"
                        value={formData.rccm}
                        onChange={(e) => handleChange("rccm", e.target.value)}
                        placeholder="CD/KIN/RCCM/XX-X-XXXXX"
                      />
                      <InputField
                        label="ID National"
                        type="text"
                        value={formData.idNat}
                        onChange={(e) => handleChange("idNat", e.target.value)}
                        placeholder="01-XXX-NXXXXXK"
                      />
                      <InputField
                        label="NIF"
                        type="text"
                        value={formData.nif}
                        onChange={(e) => handleChange("nif", e.target.value)}
                        placeholder="AXXXXXXX"
                        className="col-span-2"
                      />
                    </>
                  )}

                  <InputField
                    label="Email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="contact@exemple.cd"
                    error={errors.email}
                  />
                  <InputField
                    label="Telephone"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+243 XXX XXX XXX"
                    error={errors.phone}
                  />

                  <SelectField
                    label="Province"
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                    options={provinces}
                    placeholder="Selectionnez"
                  />
                  <InputField
                    label="Ville"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Ex: Kinshasa"
                  />

                  <InputField
                    label="Adresse complete"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Numero, Avenue, Commune"
                    className="col-span-2"
                  />
                </div>
              </div>
            )}

            {/* Section Projet */}
            {activeSection === "project" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Details du projet
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Decrivez votre projet d'investissement
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Nom du projet"
                    required
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleChange("projectName", e.target.value)}
                    placeholder="Ex: Usine agroalimentaire"
                    error={errors.projectName}
                    className="col-span-2"
                  />

                  <SelectField
                    label="Secteur d'activite"
                    required
                    value={formData.sector}
                    onChange={(e) => handleChange("sector", e.target.value)}
                    options={sectors}
                    placeholder="Selectionnez un secteur"
                    error={errors.sector}
                  />
                  <InputField
                    label="Sous-secteur"
                    type="text"
                    value={formData.subSector}
                    onChange={(e) => handleChange("subSector", e.target.value)}
                    placeholder="Ex: Transformation cereales"
                  />

                  <SelectField
                    label="Province du projet"
                    required
                    value={formData.projectProvince}
                    onChange={(e) => handleChange("projectProvince", e.target.value)}
                    options={provinces}
                    placeholder="Selectionnez"
                    error={errors.projectProvince}
                  />
                  <InputField
                    label="Ville du projet"
                    type="text"
                    value={formData.projectCity}
                    onChange={(e) => handleChange("projectCity", e.target.value)}
                    placeholder="Ex: Kolwezi"
                  />

                  <InputField
                    label="Adresse du site"
                    type="text"
                    value={formData.projectAddress}
                    onChange={(e) => handleChange("projectAddress", e.target.value)}
                    placeholder="Localisation exacte"
                    className="col-span-2"
                  />

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description du projet
                    </label>
                    <textarea
                      value={formData.projectDescription}
                      onChange={(e) => handleChange("projectDescription", e.target.value)}
                      rows={4}
                      placeholder="Decrivez le projet, ses objectifs et son impact..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section Finances */}
            {activeSection === "financial" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Informations financieres
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Budget et impact economique du projet
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Montant d'investissement <span className="text-orange-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={formData.investmentAmount}
                        onChange={(e) => handleChange("investmentAmount", e.target.value)}
                        placeholder="Ex: 5,000,000"
                        className={`flex-1 px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 ${
                          errors.investmentAmount ? "border-red-500" : "border-gray-700"
                        }`}
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-28 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
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

                  <InputField
                    label="Emplois directs a creer"
                    type="number"
                    min="0"
                    value={formData.directJobs}
                    onChange={(e) => handleChange("directJobs", e.target.value)}
                    placeholder="Ex: 100"
                  />
                  <InputField
                    label="Emplois indirects a creer"
                    type="number"
                    min="0"
                    value={formData.indirectJobs}
                    onChange={(e) => handleChange("indirectJobs", e.target.value)}
                    placeholder="Ex: 250"
                  />

                  <InputField
                    label="Date de debut prevue"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                  <InputField
                    label="Date de fin prevue"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Section Documents */}
            {activeSection === "documents" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Documents justificatifs
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Telechargez les pieces requises
                </p>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mb-6 hover:border-orange-500/50 transition-colors">
                  <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    Glissez vos fichiers ici
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, JPG, PNG - Max 10MB
                  </p>
                  <label className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 cursor-pointer transition-colors font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Parcourir
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>

                {/* Documents list */}
                {documents.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-medium text-gray-400">
                      Fichiers ({documents.length})
                    </h4>
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Required docs info */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <h4 className="font-medium text-orange-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Documents requis
                  </h4>
                  <ul className="text-sm text-orange-300/80 space-y-1 ml-6 list-disc">
                    <li>Registre de commerce (RCCM)</li>
                    <li>Identification nationale</li>
                    <li>Plan d'affaires</li>
                    <li>Preuve capacite financiere</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section Recapitulatif */}
            {activeSection === "summary" && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Recapitulatif
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Verifiez les informations avant soumission
                </p>

                <div className="space-y-6">
                  {/* Type */}
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Type de dossier</h3>
                    <p className="text-white font-medium">
                      {dossierTypes.find(t => t.value === formData.dossierType)?.label || "Non selectionne"}
                    </p>
                  </div>

                  {/* Investisseur */}
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Investisseur</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Nom:</span>
                        <span className="text-white ml-2">{formData.investorName || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="text-white ml-2">{formData.email || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Telephone:</span>
                        <span className="text-white ml-2">{formData.phone || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Province:</span>
                        <span className="text-white ml-2">{formData.province || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Projet */}
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Projet</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Nom:</span>
                        <span className="text-white ml-2">{formData.projectName || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Secteur:</span>
                        <span className="text-white ml-2">{sectors.find(s => s.value === formData.sector)?.label || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Province:</span>
                        <span className="text-white ml-2">{formData.projectProvince || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Investissement:</span>
                        <span className="text-white ml-2">{formData.investmentAmount ? `${formData.investmentAmount} ${formData.currency}` : "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Documents</h3>
                    <p className="text-white">{documents.length} fichier(s) telecharge(s)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-4 border-t border-gray-700/50">
              <button
                onClick={goToPrevSection}
                disabled={currentSectionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Precedent
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Etape {currentSectionIndex + 1} / {sections.length}
                </span>
                <div className="flex gap-1">
                  {sections.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSectionIndex
                          ? "bg-orange-500"
                          : idx < currentSectionIndex
                          ? "bg-green-500"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {currentSectionIndex < sections.length - 1 ? (
                <button
                  onClick={goToNextSection}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Soumettre
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
