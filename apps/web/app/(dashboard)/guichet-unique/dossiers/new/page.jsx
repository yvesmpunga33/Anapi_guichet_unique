"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  {
    value: "PERMIS_CONSTRUCTION",
    label: "Permis de construire",
    description: "Construction et amenagement",
    icon: Building2,
    color: "orange"
  },
  {
    value: "AUTORISATION_ACTIVITE",
    label: "Autorisation d'activite",
    description: "Exercice d'activite specifique",
    icon: Briefcase,
    color: "cyan"
  },
];

// Les secteurs, provinces, villes et communes sont chargés dynamiquement depuis l'API

// Les documents requis sont maintenant chargés dynamiquement depuis l'API

// Reusable Input Field - defined outside component to prevent re-renders
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

// Reusable Select Field - defined outside component to prevent re-renders
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

function NewDossierForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("investor");
  const [sectors, setSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // États pour les données géographiques
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  // Pour l'investisseur
  const [investorCities, setInvestorCities] = useState([]);
  const [loadingInvestorCities, setLoadingInvestorCities] = useState(false);
  const [investorCommunes, setInvestorCommunes] = useState([]);
  const [loadingInvestorCommunes, setLoadingInvestorCommunes] = useState(false);

  // Pour le projet
  const [projectCities, setProjectCities] = useState([]);
  const [loadingProjectCities, setLoadingProjectCities] = useState(false);
  const [projectCommunes, setProjectCommunes] = useState([]);
  const [loadingProjectCommunes, setLoadingProjectCommunes] = useState(false);

  const [formData, setFormData] = useState({
    dossierType: typeFromUrl || "",
    investorType: "company",
    investorName: "",
    rccm: "",
    idNat: "",
    nif: "",
    address: "",
    phone: "",
    email: "",
    country: "RDC",
    // Investisseur - Province, Ville, Commune
    investorProvinceId: "",
    investorProvince: "",
    investorCityId: "",
    investorCity: "",
    investorCommuneId: "",
    investorCommune: "",
    // Projet
    projectName: "",
    projectDescription: "",
    sectors: [], // Multi-sélection des secteurs (tableau d'IDs)
    subSector: "",
    // Projet - Province, Ville, Commune
    projectProvinceId: "",
    projectProvince: "",
    projectCityId: "",
    projectCity: "",
    projectCommuneId: "",
    projectCommune: "",
    projectAddress: "",
    investmentAmount: "",
    currency: "USD",
    directJobs: "",
    indirectJobs: "",
    startDate: "",
    endDate: "",
  });

  // Documents associés aux types requis: { documentTypeId: { file, name, size, type } }
  const [documentsByType, setDocumentsByType] = useState({});
  const [errors, setErrors] = useState({});

  // Obtenir les documents requis pour le type de dossier sélectionné
  const getRequiredDocuments = () => {
    return requiredDocuments.map(doc => ({
      id: doc.id,
      name: doc.name,
      required: doc.isRequired,
      code: doc.code
    }));
  };

  // Charger les secteurs depuis l'API
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoadingSectors(true);
        const response = await fetch("/api/referentiels/sectors?isActive=true");
        const result = await response.json();
        setSectors(result.sectors || []);
      } catch (err) {
        console.error("Erreur chargement secteurs:", err);
      } finally {
        setLoadingSectors(false);
      }
    };
    fetchSectors();
  }, []);

  // Charger les documents requis depuis l'API lorsque le type de dossier change
  useEffect(() => {
    const fetchRequiredDocuments = async () => {
      if (!formData.dossierType) {
        setRequiredDocuments([]);
        return;
      }
      try {
        setLoadingDocuments(true);
        const response = await fetch(
          `/api/config/required-documents?dossierType=${formData.dossierType}&activeOnly=true`
        );
        const result = await response.json();
        setRequiredDocuments(result.documents || []);
        // Réinitialiser les documents uploadés quand le type change
        setDocumentsByType({});
      } catch (err) {
        console.error("Erreur chargement documents requis:", err);
        setRequiredDocuments([]);
      } finally {
        setLoadingDocuments(false);
      }
    };
    fetchRequiredDocuments();
  }, [formData.dossierType]);

  // Charger les provinces depuis l'API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch("/api/referentiels/provinces?activeOnly=true");
        const result = await response.json();
        setProvinces(result.provinces || []);
      } catch (err) {
        console.error("Erreur chargement provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Charger les villes de l'investisseur quand la province change
  useEffect(() => {
    const fetchInvestorCities = async () => {
      if (!formData.investorProvinceId) {
        setInvestorCities([]);
        return;
      }
      try {
        setLoadingInvestorCities(true);
        const response = await fetch(`/api/referentiels/provinces/${formData.investorProvinceId}/cities`);
        const result = await response.json();
        setInvestorCities(result.cities || []);
      } catch (err) {
        console.error("Erreur chargement villes investisseur:", err);
        setInvestorCities([]);
      } finally {
        setLoadingInvestorCities(false);
      }
    };
    fetchInvestorCities();
  }, [formData.investorProvinceId]);

  // Charger les communes de l'investisseur quand la ville change
  useEffect(() => {
    const fetchInvestorCommunes = async () => {
      if (!formData.investorCityId) {
        setInvestorCommunes([]);
        return;
      }
      try {
        setLoadingInvestorCommunes(true);
        const response = await fetch(`/api/referentiels/cities/${formData.investorCityId}/communes`);
        const result = await response.json();
        setInvestorCommunes(result.communes || []);
      } catch (err) {
        console.error("Erreur chargement communes investisseur:", err);
        setInvestorCommunes([]);
      } finally {
        setLoadingInvestorCommunes(false);
      }
    };
    fetchInvestorCommunes();
  }, [formData.investorCityId]);

  // Charger les villes du projet quand la province change
  useEffect(() => {
    const fetchProjectCities = async () => {
      if (!formData.projectProvinceId) {
        setProjectCities([]);
        return;
      }
      try {
        setLoadingProjectCities(true);
        const response = await fetch(`/api/referentiels/provinces/${formData.projectProvinceId}/cities`);
        const result = await response.json();
        setProjectCities(result.cities || []);
      } catch (err) {
        console.error("Erreur chargement villes projet:", err);
        setProjectCities([]);
      } finally {
        setLoadingProjectCities(false);
      }
    };
    fetchProjectCities();
  }, [formData.projectProvinceId]);

  // Charger les communes du projet quand la ville change
  useEffect(() => {
    const fetchProjectCommunes = async () => {
      if (!formData.projectCityId) {
        setProjectCommunes([]);
        return;
      }
      try {
        setLoadingProjectCommunes(true);
        const response = await fetch(`/api/referentiels/cities/${formData.projectCityId}/communes`);
        const result = await response.json();
        setProjectCommunes(result.communes || []);
      } catch (err) {
        console.error("Erreur chargement communes projet:", err);
        setProjectCommunes([]);
      } finally {
        setLoadingProjectCommunes(false);
      }
    };
    fetchProjectCommunes();
  }, [formData.projectCityId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Gestion des changements en cascade pour l'investisseur
  const handleInvestorProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData(prev => ({
      ...prev,
      investorProvinceId: provinceId,
      investorProvince: province?.name || "",
      // Réinitialiser ville et commune
      investorCityId: "",
      investorCity: "",
      investorCommuneId: "",
      investorCommune: "",
    }));
    setInvestorCommunes([]);
  };

  const handleInvestorCityChange = (cityId) => {
    const city = investorCities.find(c => c.id === cityId);
    setFormData(prev => ({
      ...prev,
      investorCityId: cityId,
      investorCity: city?.name || "",
      // Réinitialiser commune
      investorCommuneId: "",
      investorCommune: "",
    }));
  };

  const handleInvestorCommuneChange = (communeId) => {
    const commune = investorCommunes.find(c => c.id === communeId);
    setFormData(prev => ({
      ...prev,
      investorCommuneId: communeId,
      investorCommune: commune?.name || "",
    }));
  };

  // Gestion des changements en cascade pour le projet
  const handleProjectProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData(prev => ({
      ...prev,
      projectProvinceId: provinceId,
      projectProvince: province?.name || "",
      // Réinitialiser ville et commune
      projectCityId: "",
      projectCity: "",
      projectCommuneId: "",
      projectCommune: "",
    }));
    setProjectCommunes([]);
  };

  const handleProjectCityChange = (cityId) => {
    const city = projectCities.find(c => c.id === cityId);
    setFormData(prev => ({
      ...prev,
      projectCityId: cityId,
      projectCity: city?.name || "",
      // Réinitialiser commune
      projectCommuneId: "",
      projectCommune: "",
    }));
  };

  const handleProjectCommuneChange = (communeId) => {
    const commune = projectCommunes.find(c => c.id === communeId);
    setFormData(prev => ({
      ...prev,
      projectCommuneId: communeId,
      projectCommune: commune?.name || "",
    }));
  };

  // Upload un fichier pour un type de document spécifique
  const handleFileUploadForType = (documentTypeId, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentsByType((prev) => ({
        ...prev,
        [documentTypeId]: {
          file: file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type,
        },
      }));
      // Effacer l'erreur pour ce document
      if (errors[`doc_${documentTypeId}`]) {
        setErrors((prev) => ({ ...prev, [`doc_${documentTypeId}`]: null }));
      }
    }
  };

  // Supprimer un fichier pour un type de document
  const removeDocumentForType = (documentTypeId) => {
    setDocumentsByType((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentTypeId];
      return newDocs;
    });
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
        if (!formData.sectors || formData.sectors.length === 0) {
          newErrors.sectors = "Selectionnez au moins un secteur d'activite";
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

      case "documents":
        // Vérifier que tous les documents requis sont fournis
        const requiredDocs = getRequiredDocuments().filter(d => d.required);
        requiredDocs.forEach((doc) => {
          if (!documentsByType[doc.id]) {
            newErrors[`doc_${doc.id}`] = `Le document "${doc.name}" est requis`;
          }
        });
        if (Object.keys(newErrors).length > 0) {
          newErrors.documents = "Veuillez fournir tous les documents requis";
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
    // Validate all sections before submitting (not for drafts)
    if (!isDraft) {
      for (const section of sections.slice(0, -1)) { // Exclude summary section
        if (!validateSection(section.id)) {
          setActiveSection(section.id);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const response = await fetch('/api/guichet-unique/dossiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isDraft,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la soumission');
      }

      // Redirect to dossiers list on success
      router.push("/guichet-unique/dossiers");
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message });
      setLoading(false);
    }
  };

  const isSectionComplete = (sectionId) => {
    switch (sectionId) {
      case "type":
        return !!formData.dossierType;
      case "investor":
        return !!(formData.investorName && formData.email && formData.phone);
      case "project":
        return !!(formData.projectName && formData.sectors && formData.sectors.length > 0 && formData.projectProvince);
      case "financial":
        return !!formData.investmentAmount;
      case "documents":
        // Vérifier que tous les documents requis sont fournis
        const requiredDocs = getRequiredDocuments().filter(d => d.required);
        return requiredDocs.every(doc => documentsByType[doc.id]);
      default:
        return false;
    }
  };

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
          <Link
            href="/guichet-unique/dossiers"
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded-xl hover:bg-orange-500/10 transition-colors font-medium"
          >
            Annuler
          </Link>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Brouillon
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

                  {/* Province, Ville, Commune en cascade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Province
                    </label>
                    <select
                      value={formData.investorProvinceId}
                      onChange={(e) => handleInvestorProvinceChange(e.target.value)}
                      disabled={loadingProvinces}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingProvinces ? "Chargement..." : "Selectionnez une province"}
                      </option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id} className="bg-gray-800">
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ville
                    </label>
                    <select
                      value={formData.investorCityId}
                      onChange={(e) => handleInvestorCityChange(e.target.value)}
                      disabled={!formData.investorProvinceId || loadingInvestorCities}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingInvestorCities
                          ? "Chargement..."
                          : !formData.investorProvinceId
                            ? "Selectionnez d'abord une province"
                            : "Selectionnez une ville"}
                      </option>
                      {investorCities.map((city) => (
                        <option key={city.id} value={city.id} className="bg-gray-800">
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Commune
                    </label>
                    <select
                      value={formData.investorCommuneId}
                      onChange={(e) => handleInvestorCommuneChange(e.target.value)}
                      disabled={!formData.investorCityId || loadingInvestorCommunes}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingInvestorCommunes
                          ? "Chargement..."
                          : !formData.investorCityId
                            ? "Selectionnez d'abord une ville"
                            : investorCommunes.length === 0
                              ? "Aucune commune disponible"
                              : "Selectionnez une commune"}
                      </option>
                      {investorCommunes.map((commune) => (
                        <option key={commune.id} value={commune.id} className="bg-gray-800">
                          {commune.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Adresse complete"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Numero, Avenue"
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

                  {/* Multi-sélection des secteurs */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Secteurs d'activite <span className="text-orange-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Selectionnez un ou plusieurs secteurs. Chaque secteur est lie a un ministere de tutelle.
                    </p>

                    {loadingSectors ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                        <span className="ml-2 text-gray-400">Chargement des secteurs...</span>
                      </div>
                    ) : (
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-3 rounded-xl border ${
                        errors.sectors ? "border-red-500" : "border-gray-700"
                      } bg-gray-800/30`}>
                        {sectors.map((sector) => {
                          const isSelected = formData.sectors.includes(sector.id);
                          return (
                            <label
                              key={sector.id}
                              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-orange-500/20 border border-orange-500/50"
                                  : "bg-gray-800/50 border border-gray-700 hover:border-gray-600"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleChange("sectors", [...formData.sectors, sector.id]);
                                  } else {
                                    handleChange("sectors", formData.sectors.filter(id => id !== sector.id));
                                  }
                                }}
                                className="w-4 h-4 mt-1 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                              />
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm ${isSelected ? "text-orange-400" : "text-white"}`}>
                                  {sector.name}
                                </p>
                                <p className="text-xs text-gray-500">{sector.code}</p>
                                {sector.ministry && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Building2 className="w-3 h-3 text-blue-400" />
                                    <span className="text-xs text-blue-400">
                                      {sector.ministry.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {errors.sectors && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.sectors}
                      </p>
                    )}

                    {/* Afficher les secteurs sélectionnés avec leurs ministères */}
                    {formData.sectors.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                        <p className="text-xs font-medium text-gray-400 mb-2">
                          {formData.sectors.length} secteur(s) selectionne(s) - Ministeres impliques:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const selectedSectors = sectors.filter(s => formData.sectors.includes(s.id));
                            const uniqueMinistries = [...new Map(
                              selectedSectors
                                .filter(s => s.ministry)
                                .map(s => [s.ministry.id, s.ministry])
                            ).values()];

                            return uniqueMinistries.map(ministry => (
                              <span
                                key={ministry.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs"
                              >
                                <Building2 className="w-3 h-3" />
                                {ministry.name}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  <InputField
                    label="Sous-secteur / Specialite"
                    type="text"
                    value={formData.subSector}
                    onChange={(e) => handleChange("subSector", e.target.value)}
                    placeholder="Ex: Transformation cereales"
                    className="col-span-2"
                  />

                  {/* Province, Ville, Commune du projet en cascade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Province du projet <span className="text-orange-500">*</span>
                    </label>
                    <select
                      value={formData.projectProvinceId}
                      onChange={(e) => handleProjectProvinceChange(e.target.value)}
                      disabled={loadingProvinces}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 ${
                        errors.projectProvince ? "border-red-500" : "border-gray-700"
                      }`}
                    >
                      <option value="" className="bg-gray-800">
                        {loadingProvinces ? "Chargement..." : "Selectionnez une province"}
                      </option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id} className="bg-gray-800">
                          {prov.name}
                        </option>
                      ))}
                    </select>
                    {errors.projectProvince && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.projectProvince}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ville du projet
                    </label>
                    <select
                      value={formData.projectCityId}
                      onChange={(e) => handleProjectCityChange(e.target.value)}
                      disabled={!formData.projectProvinceId || loadingProjectCities}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingProjectCities
                          ? "Chargement..."
                          : !formData.projectProvinceId
                            ? "Selectionnez d'abord une province"
                            : "Selectionnez une ville"}
                      </option>
                      {projectCities.map((city) => (
                        <option key={city.id} value={city.id} className="bg-gray-800">
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Commune du projet
                    </label>
                    <select
                      value={formData.projectCommuneId}
                      onChange={(e) => handleProjectCommuneChange(e.target.value)}
                      disabled={!formData.projectCityId || loadingProjectCommunes}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingProjectCommunes
                          ? "Chargement..."
                          : !formData.projectCityId
                            ? "Selectionnez d'abord une ville"
                            : projectCommunes.length === 0
                              ? "Aucune commune disponible"
                              : "Selectionnez une commune"}
                      </option>
                      {projectCommunes.map((commune) => (
                        <option key={commune.id} value={commune.id} className="bg-gray-800">
                          {commune.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Adresse du site"
                    type="text"
                    value={formData.projectAddress}
                    onChange={(e) => handleChange("projectAddress", e.target.value)}
                    placeholder="Localisation exacte"
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
                  Telechargez les pieces requises pour votre dossier
                </p>

                {/* Message d'erreur global */}
                {errors.documents && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.documents}
                    </p>
                  </div>
                )}

                {/* Message si aucun type de dossier sélectionné */}
                {!formData.dossierType && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                    <p className="text-yellow-400 font-medium mb-1">
                      Type de dossier non selectionne
                    </p>
                    <p className="text-sm text-yellow-300/70">
                      Veuillez d'abord selectionner un type de dossier pour voir les documents requis.
                    </p>
                  </div>
                )}

                {/* Liste des documents requis avec upload */}
                {formData.dossierType && loadingDocuments && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    <span className="ml-2 text-gray-400">Chargement des documents requis...</span>
                  </div>
                )}

                {formData.dossierType && !loadingDocuments && getRequiredDocuments().length === 0 && (
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
                    <FileText className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">
                      Aucun document requis configure pour ce type de dossier.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Contactez l'administrateur pour configurer les documents requis.
                    </p>
                  </div>
                )}

                {formData.dossierType && !loadingDocuments && getRequiredDocuments().length > 0 && (
                  <div className="space-y-4">
                    {getRequiredDocuments().map((docType) => {
                      const uploadedDoc = documentsByType[docType.id];
                      const hasError = errors[`doc_${docType.id}`];

                      return (
                        <div
                          key={docType.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            uploadedDoc
                              ? "border-green-500/50 bg-green-500/5"
                              : hasError
                              ? "border-red-500/50 bg-red-500/5"
                              : "border-gray-700 bg-gray-800/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Info du document requis */}
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                uploadedDoc
                                  ? "bg-green-500/20"
                                  : hasError
                                  ? "bg-red-500/20"
                                  : "bg-gray-700"
                              }`}>
                                {uploadedDoc ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                                ) : (
                                  <FileText className={`w-5 h-5 ${hasError ? "text-red-400" : "text-gray-400"}`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${
                                    uploadedDoc
                                      ? "text-green-400"
                                      : hasError
                                      ? "text-red-400"
                                      : "text-white"
                                  }`}>
                                    {docType.name}
                                  </p>
                                  {docType.required && (
                                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded font-medium">
                                      Requis
                                    </span>
                                  )}
                                </div>

                                {/* Fichier uploadé */}
                                {uploadedDoc && (
                                  <div className="flex items-center gap-2 mt-2 p-2 bg-gray-800/50 rounded-lg">
                                    <FileText className="w-4 h-4 text-orange-400" />
                                    <span className="text-sm text-gray-300 truncate flex-1">
                                      {uploadedDoc.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {uploadedDoc.size}
                                    </span>
                                    <button
                                      onClick={() => removeDocumentForType(docType.id)}
                                      className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}

                                {/* Message d'erreur */}
                                {hasError && !uploadedDoc && (
                                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Document requis non fourni
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Bouton upload */}
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors font-medium text-sm ${
                              uploadedDoc
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                            }`}>
                              {uploadedDoc ? (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Remplacer
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Selectionner
                                </>
                              )}
                              <input
                                type="file"
                                onChange={(e) => handleFileUploadForType(docType.id, e)}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                          </div>
                        </div>
                      );
                    })}

                    {/* Résumé */}
                    <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">Documents telecharges:</span>
                        </div>
                        <span className="text-white font-medium">
                          {Object.keys(documentsByType).length} / {getRequiredDocuments().length}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getRequiredDocuments().map((docType) => (
                          <span
                            key={docType.id}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              documentsByType[docType.id]
                                ? "bg-green-500/20 text-green-400"
                                : docType.required
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {docType.name.split(" ")[0]}
                            {documentsByType[docType.id] && " ✓"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

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
                        <span className="text-white ml-2">{formData.investorProvince || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ville:</span>
                        <span className="text-white ml-2">{formData.investorCity || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Commune:</span>
                        <span className="text-white ml-2">{formData.investorCommune || "-"}</span>
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
                        <span className="text-gray-500">Province:</span>
                        <span className="text-white ml-2">{formData.projectProvince || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ville:</span>
                        <span className="text-white ml-2">{formData.projectCity || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Commune:</span>
                        <span className="text-white ml-2">{formData.projectCommune || "-"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Investissement:</span>
                        <span className="text-white ml-2">{formData.investmentAmount ? `${formData.investmentAmount} ${formData.currency}` : "-"}</span>
                      </div>
                    </div>

                    {/* Secteurs sélectionnés */}
                    {formData.sectors.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-500 mb-2">Secteurs d'activite:</p>
                        <div className="flex flex-wrap gap-2">
                          {sectors.filter(s => formData.sectors.includes(s.id)).map(sector => (
                            <span
                              key={sector.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs"
                            >
                              <Factory className="w-3 h-3" />
                              {sector.name}
                            </span>
                          ))}
                        </div>

                        {/* Ministères impliqués */}
                        <p className="text-xs text-gray-500 mt-3 mb-2">Ministeres impliques:</p>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const selectedSectors = sectors.filter(s => formData.sectors.includes(s.id));
                            const uniqueMinistries = [...new Map(
                              selectedSectors
                                .filter(s => s.ministry)
                                .map(s => [s.ministry.id, s.ministry])
                            ).values()];

                            return uniqueMinistries.map(ministry => (
                              <span
                                key={ministry.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs"
                              >
                                <Building2 className="w-3 h-3" />
                                {ministry.name}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Documents</h3>
                    <p className="text-white mb-3">{Object.keys(documentsByType).length} fichier(s) telecharge(s)</p>
                    {Object.keys(documentsByType).length > 0 && (
                      <div className="space-y-2">
                        {getRequiredDocuments().map((docType) => {
                          const uploadedDoc = documentsByType[docType.id];
                          return (
                            <div
                              key={docType.id}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                uploadedDoc ? "bg-green-500/10" : "bg-gray-700/50"
                              }`}
                            >
                              {uploadedDoc ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="text-sm text-gray-400">{docType.name}:</span>
                              <span className={`text-sm ${uploadedDoc ? "text-green-400" : "text-gray-500"}`}>
                                {uploadedDoc ? uploadedDoc.name : "Non fourni"}
                              </span>
                              {docType.required && !uploadedDoc && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                                  Requis
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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

// Export avec Suspense pour useSearchParams
export default function NewDossierPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <NewDossierForm />
    </Suspense>
  );
}
