"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  DollarSign,
  Briefcase,
  ClipboardList,
  Shield,
  Factory,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  Users,
  Calendar,
  Hash,
} from "lucide-react";
import InvestorSelector from "@/app/components/InvestorSelector";

const sections = [
  { id: "type", name: "Type de dossier", icon: FileText },
  { id: "investor", name: "Investisseur", icon: Building2 },
  { id: "project", name: "Projet", icon: Briefcase },
  { id: "financial", name: "Finances", icon: DollarSign },
  { id: "documents", name: "Documents", icon: Upload },
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

// Reusable Input Field
const InputField = ({ label, required, error, className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-400 mb-1.5">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2.5 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm ${
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

// Section Card Component
const SectionCard = ({ id, title, icon: Icon, children, isComplete, sectionRef }) => (
  <div
    ref={sectionRef}
    id={`section-${id}`}
    className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden"
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700/50 bg-gray-800/20">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
        isComplete ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
      }`}>
        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

function NewDossierForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  // Refs for scrolling
  const sectionRefs = {
    type: useRef(null),
    investor: useRef(null),
    project: useRef(null),
    financial: useRef(null),
    documents: useRef(null),
  };

  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Geographic data states
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  // Investor location
  const [investorCities, setInvestorCities] = useState([]);
  const [loadingInvestorCities, setLoadingInvestorCities] = useState(false);
  const [investorCommunes, setInvestorCommunes] = useState([]);
  const [loadingInvestorCommunes, setLoadingInvestorCommunes] = useState(false);

  // Project location
  const [projectCities, setProjectCities] = useState([]);
  const [loadingProjectCities, setLoadingProjectCities] = useState(false);
  const [projectCommunes, setProjectCommunes] = useState([]);
  const [loadingProjectCommunes, setLoadingProjectCommunes] = useState(false);

  // Countries
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Selected existing investor
  const [selectedExistingInvestor, setSelectedExistingInvestor] = useState(null);

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
    country: "CD",
    investorId: null,
    representativeName: "",
    representativeFunction: "",
    representativePhone: "",
    representativeEmail: "",
    investorProvinceId: "",
    investorProvince: "",
    investorCityId: "",
    investorCity: "",
    investorCommuneId: "",
    investorCommune: "",
    projectName: "",
    projectDescription: "",
    sectors: [],
    subSector: "",
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

  const [documentsByType, setDocumentsByType] = useState({});
  const [errors, setErrors] = useState({});

  // Get required documents
  const getRequiredDocuments = () => {
    return requiredDocuments.map(doc => ({
      id: doc.id,
      name: doc.name,
      required: doc.isRequired,
      code: doc.code
    }));
  };

  // Load sectors
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoadingSectors(true);
        const response = await fetch("/api/referentiels/sectors?isActive=true");
        const result = await response.json();
        setSectors(result.sectors || []);
      } catch (err) {
        console.error("Error loading sectors:", err);
      } finally {
        setLoadingSectors(false);
      }
    };
    fetchSectors();
  }, []);

  // Load countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await fetch("/api/referentiels/countries");
        const result = await response.json();
        setCountries(result.countries || []);
      } catch (err) {
        console.error("Error loading countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Load required documents when dossier type changes
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
        setDocumentsByType({});
      } catch (err) {
        console.error("Error loading required documents:", err);
        setRequiredDocuments([]);
      } finally {
        setLoadingDocuments(false);
      }
    };
    fetchRequiredDocuments();
  }, [formData.dossierType]);

  // Load provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch("/api/referentiels/provinces?activeOnly=true");
        const result = await response.json();
        setProvinces(result.provinces || []);
      } catch (err) {
        console.error("Error loading provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Load investor cities
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
        console.error("Error loading investor cities:", err);
        setInvestorCities([]);
      } finally {
        setLoadingInvestorCities(false);
      }
    };
    fetchInvestorCities();
  }, [formData.investorProvinceId]);

  // Load investor communes
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
        console.error("Error loading investor communes:", err);
        setInvestorCommunes([]);
      } finally {
        setLoadingInvestorCommunes(false);
      }
    };
    fetchInvestorCommunes();
  }, [formData.investorCityId]);

  // Load project cities
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
        console.error("Error loading project cities:", err);
        setProjectCities([]);
      } finally {
        setLoadingProjectCities(false);
      }
    };
    fetchProjectCities();
  }, [formData.projectProvinceId]);

  // Load project communes
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
        console.error("Error loading project communes:", err);
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

  // Cascade handlers for investor location
  const handleInvestorProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData(prev => ({
      ...prev,
      investorProvinceId: provinceId,
      investorProvince: province?.name || "",
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

  // Cascade handlers for project location
  const handleProjectProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData(prev => ({
      ...prev,
      projectProvinceId: provinceId,
      projectProvince: province?.name || "",
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

  // Select existing investor
  const handleSelectExistingInvestor = (investor) => {
    setSelectedExistingInvestor(investor);
    setFormData(prev => ({
      ...prev,
      investorId: investor.id,
      investorType: investor.type || "company",
      investorName: investor.name || "",
      rccm: investor.rccm || "",
      idNat: investor.idNat || "",
      nif: investor.nif || "",
      email: investor.email || "",
      phone: investor.phone || "",
      country: investor.country || "CD",
      investorProvinceId: investor.provinceId || "",
      investorProvince: investor.province || "",
      investorCityId: investor.cityId || "",
      investorCity: investor.city || "",
      investorCommuneId: investor.communeId || "",
      investorCommune: investor.commune || "",
      address: investor.address || "",
      representativeName: investor.representativeName || "",
      representativeFunction: investor.representativeFunction || "",
      representativePhone: investor.representativePhone || "",
      representativeEmail: investor.representativeEmail || "",
    }));
  };

  // Clear existing investor
  const handleClearExistingInvestor = () => {
    setSelectedExistingInvestor(null);
    setFormData(prev => ({
      ...prev,
      investorId: null,
      investorType: "company",
      investorName: "",
      rccm: "",
      idNat: "",
      nif: "",
      email: "",
      phone: "",
      country: "CD",
      investorProvinceId: "",
      investorProvince: "",
      investorCityId: "",
      investorCity: "",
      investorCommuneId: "",
      investorCommune: "",
      address: "",
      representativeName: "",
      representativeFunction: "",
      representativePhone: "",
      representativeEmail: "",
    }));
  };

  // File upload handlers
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
      if (errors[`doc_${documentTypeId}`]) {
        setErrors((prev) => ({ ...prev, [`doc_${documentTypeId}`]: null }));
      }
    }
  };

  const removeDocumentForType = (documentTypeId) => {
    setDocumentsByType((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentTypeId];
      return newDocs;
    });
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Section completion check
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
        const requiredDocs = getRequiredDocuments().filter(d => d.required);
        return requiredDocs.every(doc => documentsByType[doc.id]);
      default:
        return false;
    }
  };

  // Validate all sections
  const validateForm = () => {
    const newErrors = {};

    // Type validation
    if (!formData.dossierType) {
      newErrors.dossierType = "Veuillez selectionner un type de dossier";
    }

    // Investor validation
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

    // Project validation
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Le nom du projet est obligatoire";
    }
    if (!formData.sectors || formData.sectors.length === 0) {
      newErrors.sectors = "Selectionnez au moins un secteur d'activite";
    }
    if (!formData.projectProvince) {
      newErrors.projectProvince = "La province du projet est obligatoire";
    }

    // Financial validation
    if (!formData.investmentAmount.trim()) {
      newErrors.investmentAmount = "Le montant d'investissement est obligatoire";
    }

    // Documents validation
    const requiredDocs = getRequiredDocuments().filter(d => d.required);
    requiredDocs.forEach((doc) => {
      if (!documentsByType[doc.id]) {
        newErrors[`doc_${doc.id}`] = `Le document "${doc.name}" est requis`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      // Scroll to first error section
      if (errors.dossierType) scrollToSection('type');
      else if (errors.investorName || errors.email || errors.phone) scrollToSection('investor');
      else if (errors.projectName || errors.sectors || errors.projectProvince) scrollToSection('project');
      else if (errors.investmentAmount) scrollToSection('financial');
      else scrollToSection('documents');
      return;
    }

    setLoading(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append('data', JSON.stringify({
        ...formData,
        isDraft,
      }));

      Object.entries(documentsByType).forEach(([docTypeId, docInfo]) => {
        if (docInfo.file) {
          submitFormData.append(`documents[${docTypeId}]`, docInfo.file);
        }
      });

      // Get auth token
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/guichet-unique/dossiers/upload', {
        method: 'POST',
        headers,
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error formats from API
        const errorMessage = typeof result.error === 'string'
          ? result.error
          : result.message || result.error?.message || JSON.stringify(result.error) || 'Erreur lors de la soumission';
        throw new Error(errorMessage);
      }

      router.push("/guichet-unique/dossiers");
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message || 'Une erreur est survenue' });
      setLoading(false);
    }
  };

  const completedSections = sections.filter(s => isSectionComplete(s.id)).length;
  const progressPercent = Math.round((completedSections / sections.length) * 100);

  return (
    <div className="min-h-screen pb-8">
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
              Remplissez toutes les sections pour soumettre votre dossier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/guichet-unique/dossiers"
            className="px-4 py-2 text-gray-400 border border-gray-600 rounded-xl hover:bg-gray-700/50 transition-colors font-medium"
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
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Soumettre
          </button>
        </div>
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.submit}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-gray-800/50 rounded-xl p-4 sticky top-4">
            {/* Progress */}
            <div className="mb-4 pb-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progression</span>
                <span className="text-sm font-medium text-orange-400">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {completedSections} / {sections.length} sections completes
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {sections.map((section) => {
                const SectionIcon = section.icon;
                const isComplete = isSectionComplete(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      isComplete
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isComplete
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <SectionIcon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content - All Sections */}
        <div className="flex-1 space-y-6">
          {/* Section: Type de dossier */}
          <SectionCard
            id="type"
            title="Type de dossier"
            icon={FileText}
            isComplete={isSectionComplete("type")}
            sectionRef={sectionRefs.type}
          >
            <p className="text-sm text-gray-500 mb-4">
              Selectionnez le type de procedure administrative
            </p>

            {errors.dossierType && (
              <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.dossierType}
              </p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {dossierTypes.map((type) => {
                const TypeIcon = type.icon;
                const isSelected = formData.dossierType === type.value;

                return (
                  <label
                    key={type.value}
                    className={`relative flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
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
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                    }`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm leading-tight">
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-orange-500 absolute top-2 right-2" />
                    )}
                  </label>
                );
              })}
            </div>
          </SectionCard>

          {/* Section: Investisseur */}
          <SectionCard
            id="investor"
            title="Informations de l'investisseur"
            icon={Building2}
            isComplete={isSectionComplete("investor")}
            sectionRef={sectionRefs.investor}
          >
            {/* Investor selector */}
            <div className="mb-5">
              <InvestorSelector
                selectedInvestor={selectedExistingInvestor}
                onSelect={handleSelectExistingInvestor}
                onClear={handleClearExistingInvestor}
              />
            </div>

            {/* Only show form if no existing investor selected */}
            {!selectedExistingInvestor && (
              <>
                {/* Investor type */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Type d'investisseur
                  </label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
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
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium text-sm">Entreprise</span>
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
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
                      <User className="w-4 h-4" />
                      <span className="font-medium text-sm">Individuel</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField
                    label={formData.investorType === "company" ? "Nom de l'entreprise" : "Nom complet"}
                    required
                    type="text"
                    value={formData.investorName}
                    onChange={(e) => handleChange("investorName", e.target.value)}
                    placeholder={formData.investorType === "company" ? "Ex: Congo Mining Corp" : "Ex: Jean Mukendi"}
                    error={errors.investorName}
                    className="lg:col-span-2"
                  />

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      <Globe className="w-3 h-3 inline mr-1" />
                      Pays
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      disabled={loadingCountries}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm"
                    >
                      {loadingCountries ? (
                        <option value="" className="bg-gray-800">Chargement...</option>
                      ) : (
                        countries.map((country) => (
                          <option key={country.code} value={country.code} className="bg-gray-800">
                            {country.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

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

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Province
                    </label>
                    <select
                      value={formData.investorProvinceId}
                      onChange={(e) => handleInvestorProvinceChange(e.target.value)}
                      disabled={loadingProvinces}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingProvinces ? "Chargement..." : "Selectionnez"}
                      </option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id} className="bg-gray-800">
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Ville
                    </label>
                    <select
                      value={formData.investorCityId}
                      onChange={(e) => handleInvestorCityChange(e.target.value)}
                      disabled={!formData.investorProvinceId || loadingInvestorCities}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingInvestorCities ? "Chargement..." : !formData.investorProvinceId ? "Province d'abord" : "Selectionnez"}
                      </option>
                      {investorCities.map((city) => (
                        <option key={city.id} value={city.id} className="bg-gray-800">
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Commune */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Commune
                    </label>
                    <select
                      value={formData.investorCommuneId}
                      onChange={(e) => handleInvestorCommuneChange(e.target.value)}
                      disabled={!formData.investorCityId || loadingInvestorCommunes}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm"
                    >
                      <option value="" className="bg-gray-800">
                        {loadingInvestorCommunes ? "Chargement..." : !formData.investorCityId ? "Ville d'abord" : investorCommunes.length === 0 ? "Aucune" : "Selectionnez"}
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
                    className="lg:col-span-2"
                  />
                </div>

                {/* Legal representative - only for companies */}
                {formData.investorType === "company" && (
                  <div className="mt-5 pt-5 border-t border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-orange-400" />
                      <h3 className="text-sm font-medium text-white">Representant legal</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InputField
                        label="Nom complet"
                        type="text"
                        value={formData.representativeName}
                        onChange={(e) => handleChange("representativeName", e.target.value)}
                        placeholder="Ex: Jean-Pierre Mukendi"
                      />
                      <InputField
                        label="Fonction"
                        type="text"
                        value={formData.representativeFunction}
                        onChange={(e) => handleChange("representativeFunction", e.target.value)}
                        placeholder="Ex: Directeur General"
                      />
                      <InputField
                        label="Telephone"
                        type="tel"
                        value={formData.representativePhone}
                        onChange={(e) => handleChange("representativePhone", e.target.value)}
                        placeholder="+243 XXX XXX XXX"
                      />
                      <InputField
                        label="Email"
                        type="email"
                        value={formData.representativeEmail}
                        onChange={(e) => handleChange("representativeEmail", e.target.value)}
                        placeholder="representant@exemple.cd"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </SectionCard>

          {/* Section: Projet */}
          <SectionCard
            id="project"
            title="Details du projet"
            icon={Briefcase}
            isComplete={isSectionComplete("project")}
            sectionRef={sectionRefs.project}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label="Nom du projet"
                required
                type="text"
                value={formData.projectName}
                onChange={(e) => handleChange("projectName", e.target.value)}
                placeholder="Ex: Usine agroalimentaire"
                error={errors.projectName}
                className="lg:col-span-2"
              />

              <InputField
                label="Sous-secteur / Specialite"
                type="text"
                value={formData.subSector}
                onChange={(e) => handleChange("subSector", e.target.value)}
                placeholder="Ex: Transformation cereales"
              />

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Province du projet <span className="text-orange-500">*</span>
                </label>
                <select
                  value={formData.projectProvinceId}
                  onChange={(e) => handleProjectProvinceChange(e.target.value)}
                  disabled={loadingProvinces}
                  className={`w-full px-3 py-2.5 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm ${
                    errors.projectProvince ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <option value="" className="bg-gray-800">
                    {loadingProvinces ? "Chargement..." : "Selectionnez"}
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

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Ville du projet
                </label>
                <select
                  value={formData.projectCityId}
                  onChange={(e) => handleProjectCityChange(e.target.value)}
                  disabled={!formData.projectProvinceId || loadingProjectCities}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm"
                >
                  <option value="" className="bg-gray-800">
                    {loadingProjectCities ? "Chargement..." : !formData.projectProvinceId ? "Province d'abord" : "Selectionnez"}
                  </option>
                  {projectCities.map((city) => (
                    <option key={city.id} value={city.id} className="bg-gray-800">
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Commune */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Commune du projet
                </label>
                <select
                  value={formData.projectCommuneId}
                  onChange={(e) => handleProjectCommuneChange(e.target.value)}
                  disabled={!formData.projectCityId || loadingProjectCommunes}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none disabled:opacity-50 text-sm"
                >
                  <option value="" className="bg-gray-800">
                    {loadingProjectCommunes ? "Chargement..." : !formData.projectCityId ? "Ville d'abord" : projectCommunes.length === 0 ? "Aucune" : "Selectionnez"}
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
                className="lg:col-span-3"
              />

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Description du projet
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleChange("projectDescription", e.target.value)}
                  rows={3}
                  placeholder="Decrivez le projet, ses objectifs et son impact..."
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Sectors selection */}
            <div className="mt-5 pt-5 border-t border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Secteurs d'activite <span className="text-orange-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Selectionnez un ou plusieurs secteurs. Chaque secteur est lie a un ministere de tutelle.
              </p>

              {loadingSectors ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  <span className="ml-2 text-gray-400 text-sm">Chargement des secteurs...</span>
                </div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[250px] overflow-y-auto p-3 rounded-xl border ${
                  errors.sectors ? "border-red-500" : "border-gray-700"
                } bg-gray-800/30`}>
                  {sectors.map((sector) => {
                    const isSelected = formData.sectors.includes(sector.id);
                    return (
                      <label
                        key={sector.id}
                        className={`flex items-start gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${
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
                          className="w-4 h-4 mt-0.5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-xs ${isSelected ? "text-orange-400" : "text-white"}`}>
                            {sector.name}
                          </p>
                          {sector.ministry && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {sector.ministry.name}
                            </p>
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

              {/* Selected sectors display */}
              {formData.sectors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sectors.filter(s => formData.sectors.includes(s.id)).map(sector => (
                    <span
                      key={sector.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs"
                    >
                      <Factory className="w-3 h-3" />
                      {sector.name}
                      <button
                        type="button"
                        onClick={() => handleChange("sectors", formData.sectors.filter(id => id !== sector.id))}
                        className="ml-1 hover:text-orange-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* Section: Finances */}
          <SectionCard
            id="financial"
            title="Informations financieres"
            icon={DollarSign}
            isComplete={isSectionComplete("financial")}
            sectionRef={sectionRefs.financial}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Montant d'investissement <span className="text-orange-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.investmentAmount}
                    onChange={(e) => handleChange("investmentAmount", e.target.value)}
                    placeholder="Ex: 5,000,000"
                    className={`flex-1 px-3 py-2.5 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 text-sm ${
                      errors.investmentAmount ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className="w-24 px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="USD" className="bg-gray-800">USD</option>
                    <option value="CDF" className="bg-gray-800">CDF</option>
                    <option value="EUR" className="bg-gray-800">EUR</option>
                  </select>
                </div>
                {errors.investmentAmount && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.investmentAmount}
                  </p>
                )}
              </div>

              <div className="hidden lg:block" />

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

              <div className="hidden lg:block" />

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
          </SectionCard>

          {/* Section: Documents */}
          <SectionCard
            id="documents"
            title="Documents justificatifs"
            icon={Upload}
            isComplete={isSectionComplete("documents")}
            sectionRef={sectionRefs.documents}
          >
            {/* Message if no dossier type selected */}
            {!formData.dossierType && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-medium text-sm">
                  Type de dossier non selectionne
                </p>
                <p className="text-xs text-yellow-300/70 mt-1">
                  Veuillez d'abord selectionner un type de dossier pour voir les documents requis.
                </p>
              </div>
            )}

            {/* Loading */}
            {formData.dossierType && loadingDocuments && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-400 text-sm">Chargement des documents requis...</span>
              </div>
            )}

            {/* No documents configured */}
            {formData.dossierType && !loadingDocuments && getRequiredDocuments().length === 0 && (
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Aucun document requis configure pour ce type de dossier.
                </p>
              </div>
            )}

            {/* Documents list */}
            {formData.dossierType && !loadingDocuments && getRequiredDocuments().length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getRequiredDocuments().map((docType) => {
                  const uploadedDoc = documentsByType[docType.id];
                  const hasError = errors[`doc_${docType.id}`];

                  return (
                    <div
                      key={docType.id}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        uploadedDoc
                          ? "border-green-500/50 bg-green-500/5"
                          : hasError
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-gray-700 bg-gray-800/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            uploadedDoc
                              ? "bg-green-500/20"
                              : hasError
                              ? "bg-red-500/20"
                              : "bg-gray-700"
                          }`}>
                            {uploadedDoc ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <FileText className={`w-4 h-4 ${hasError ? "text-red-400" : "text-gray-400"}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium text-sm ${
                                uploadedDoc
                                  ? "text-green-400"
                                  : hasError
                                  ? "text-red-400"
                                  : "text-white"
                              }`}>
                                {docType.name}
                              </p>
                              {docType.required && (
                                <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded font-medium">
                                  Requis
                                </span>
                              )}
                            </div>

                            {uploadedDoc && (
                              <div className="flex items-center gap-2 mt-1.5 p-1.5 bg-gray-800/50 rounded">
                                <span className="text-xs text-gray-300 truncate flex-1">
                                  {uploadedDoc.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {uploadedDoc.size}
                                </span>
                                <button
                                  onClick={() => removeDocumentForType(docType.id)}
                                  className="p-0.5 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <label className={`flex items-center gap-1 px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-medium text-xs ${
                          uploadedDoc
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}>
                          {uploadedDoc ? "Changer" : "Ajouter"}
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
              </div>
            )}

            {/* Summary */}
            {formData.dossierType && !loadingDocuments && getRequiredDocuments().length > 0 && (
              <div className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Documents telecharges:</span>
                  <span className="text-sm font-medium text-white">
                    {Object.keys(documentsByType).length} / {getRequiredDocuments().length}
                  </span>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// Export with Suspense for useSearchParams
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
