"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  FileText,
  Upload,
  X,
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
  Globe,
  MapPin,
} from "lucide-react";

const sections = [
  { id: "type", name: "Type de dossier", icon: FileText },
  { id: "investor", name: "Investisseur", icon: Building2 },
  { id: "project", name: "Projet", icon: Briefcase },
  { id: "financial", name: "Finances", icon: DollarSign },
  { id: "documents", name: "Documents", icon: Upload },
];

const dossierTypes = [
  { value: "AGREMENT_REGIME", label: "Agrement au Regime preferentiel", icon: Shield },
  { value: "DECLARATION_INVESTISSEMENT", label: "Declaration d'investissement", icon: ClipboardList },
  { value: "DEMANDE_TERRAIN", label: "Demande de terrain industriel", icon: Factory },
  { value: "LICENCE_EXPLOITATION", label: "Licence d'exploitation", icon: FileCheck },
  { value: "PERMIS_CONSTRUCTION", label: "Permis de construire", icon: Building2 },
  { value: "AUTORISATION_ACTIVITE", label: "Autorisation d'activite", icon: Briefcase },
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

export default function EditDossierPage() {
  const router = useRouter();
  const params = useParams();
  const dossierId = params.id;

  // Refs for scrolling
  const sectionRefs = {
    type: useRef(null),
    investor: useRef(null),
    project: useRef(null),
    financial: useRef(null),
    documents: useRef(null),
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState([]);

  // Geographic data states
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [projectCities, setProjectCities] = useState([]);
  const [loadingProjectCities, setLoadingProjectCities] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

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
    country: "CD",
    investorId: null,
    representativeName: "",
    representativeFunction: "",
    representativePhone: "",
    representativeEmail: "",
    projectName: "",
    projectDescription: "",
    sectors: [],
    subSector: "",
    projectProvinceId: "",
    projectProvince: "",
    projectCityId: "",
    projectCity: "",
    projectAddress: "",
    investmentAmount: "",
    currency: "USD",
    directJobs: "",
    indirectJobs: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
  });

  const [documentsByType, setDocumentsByType] = useState({});
  const [errors, setErrors] = useState({});

  // Load dossier data
  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`/api/guichet-unique/dossiers/${dossierId}`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (!response.ok) {
          throw new Error('Dossier non trouve');
        }

        const result = await response.json();
        const dossier = result.data?.dossier || result.dossier;

        if (dossier) {
          setFormData({
            dossierType: dossier.dossierType || "",
            investorType: dossier.investorType || "company",
            investorName: dossier.investorName || "",
            rccm: dossier.rccm || "",
            idNat: dossier.idNat || "",
            nif: dossier.nif || "",
            address: dossier.investorAddress || "",
            phone: dossier.investorPhone || "",
            email: dossier.investorEmail || "",
            country: dossier.investorCountry || "CD",
            investorId: dossier.investorId || null,
            representativeName: dossier.representativeName || "",
            representativeFunction: dossier.representativeFunction || "",
            representativePhone: dossier.representativePhone || "",
            representativeEmail: dossier.representativeEmail || "",
            projectName: dossier.projectName || "",
            projectDescription: dossier.projectDescription || "",
            sectors: dossier.sectors ? dossier.sectors.map(s => s.id || s) : [],
            subSector: dossier.subSector || "",
            projectProvinceId: dossier.projectProvinceId || "",
            projectProvince: dossier.projectProvince || "",
            projectCityId: dossier.projectCityId || "",
            projectCity: dossier.projectCity || "",
            projectAddress: dossier.projectAddress || "",
            investmentAmount: dossier.investmentAmount?.toString() || "",
            currency: dossier.currency || "USD",
            directJobs: dossier.directJobs?.toString() || "",
            indirectJobs: dossier.indirectJobs?.toString() || "",
            startDate: dossier.startDate ? dossier.startDate.split('T')[0] : "",
            endDate: dossier.endDate ? dossier.endDate.split('T')[0] : "",
            status: dossier.status || "DRAFT",
          });

          // Store existing documents
          if (dossier.documents) {
            setExistingDocuments(dossier.documents);
          }
        }
      } catch (error) {
        console.error('Error fetching dossier:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger le dossier',
          confirmButtonColor: '#ef4444'
        }).then(() => {
          router.push('/guichet-unique/dossiers');
        });
      } finally {
        setLoading(false);
      }
    };

    if (dossierId) {
      fetchDossier();
    }
  }, [dossierId, router]);

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleProjectProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData(prev => ({
      ...prev,
      projectProvinceId: provinceId,
      projectProvince: province?.name || "",
      projectCityId: "",
      projectCity: "",
    }));
  };

  const handleProjectCityChange = (cityId) => {
    const city = projectCities.find(c => c.id === cityId);
    setFormData(prev => ({
      ...prev,
      projectCityId: cityId,
      projectCity: city?.name || "",
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
        return !!(formData.projectName && formData.projectProvince);
      case "financial":
        return !!formData.investmentAmount;
      case "documents":
        return true; // Optional for editing
      default:
        return false;
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.dossierType) {
      newErrors.dossierType = "Veuillez selectionner un type de dossier";
    }
    if (!formData.investorName.trim()) {
      newErrors.investorName = "Le nom est obligatoire";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le telephone est obligatoire";
    }
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Le nom du projet est obligatoire";
    }
    if (!formData.projectProvince) {
      newErrors.projectProvince = "La province du projet est obligatoire";
    }
    if (!formData.investmentAmount.trim()) {
      newErrors.investmentAmount = "Le montant d'investissement est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      const response = await fetch(`/api/guichet-unique/dossiers/${dossierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          projectName: formData.projectName,
          projectDescription: formData.projectDescription,
          projectProvince: formData.projectProvince,
          projectCity: formData.projectCity,
          investmentAmount: parseFloat(formData.investmentAmount.replace(/[^0-9.]/g, '')) || 0,
          currency: formData.currency,
          directJobs: parseInt(formData.directJobs) || 0,
          indirectJobs: parseInt(formData.indirectJobs) || 0,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          sector: formData.sectors[0] || null,
          subSector: formData.subSector,
          notes: formData.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Erreur lors de la mise a jour');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Dossier mis a jour !',
        text: 'Les modifications ont ete enregistrees avec succes.',
        confirmButtonText: 'Voir le dossier',
        confirmButtonColor: '#f97316'
      });

      router.push(`/guichet-unique/dossiers/${dossierId}`);
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la mise a jour',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  const completedSections = sections.filter(s => isSectionComplete(s.id)).length;
  const progressPercent = Math.round((completedSections / sections.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-gray-400">Chargement du dossier...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              Modifier le Dossier
            </h1>
            <p className="text-sm text-gray-500">
              Mettez a jour les informations du dossier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 border border-gray-600 rounded-xl hover:bg-gray-700/50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </div>
      </div>

      {/* Status badge */}
      {formData.status !== 'DRAFT' && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-400 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            Ce dossier est en statut <strong>{formData.status}</strong>. Certaines modifications peuvent etre limitees.
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
                      disabled={formData.status !== 'DRAFT'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                label={formData.investorType === "company" ? "Nom de l'entreprise" : "Nom complet"}
                required
                type="text"
                value={formData.investorName}
                onChange={(e) => handleChange("investorName", e.target.value)}
                error={errors.investorName}
                className="lg:col-span-2"
                disabled={formData.status !== 'DRAFT'}
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  <Globe className="w-3 h-3 inline mr-1" />
                  Pays
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  disabled={loadingCountries || formData.status !== 'DRAFT'}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 text-sm disabled:opacity-50"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code} className="bg-gray-800">
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                disabled={formData.status !== 'DRAFT'}
              />
              <InputField
                label="Telephone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={errors.phone}
                disabled={formData.status !== 'DRAFT'}
              />
              <InputField
                label="Adresse"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={formData.status !== 'DRAFT'}
              />
            </div>
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
                error={errors.projectName}
                className="lg:col-span-2"
              />

              <InputField
                label="Sous-secteur"
                type="text"
                value={formData.subSector}
                onChange={(e) => handleChange("subSector", e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Province du projet <span className="text-orange-500">*</span>
                </label>
                <select
                  value={formData.projectProvinceId}
                  onChange={(e) => handleProjectProvinceChange(e.target.value)}
                  disabled={loadingProvinces}
                  className={`w-full px-3 py-2.5 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 text-sm ${
                    errors.projectProvince ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <option value="" className="bg-gray-800">Selectionnez</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id} className="bg-gray-800">
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Ville du projet
                </label>
                <select
                  value={formData.projectCityId}
                  onChange={(e) => handleProjectCityChange(e.target.value)}
                  disabled={!formData.projectProvinceId || loadingProjectCities}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 text-sm disabled:opacity-50"
                >
                  <option value="" className="bg-gray-800">
                    {!formData.projectProvinceId ? "Province d'abord" : "Selectionnez"}
                  </option>
                  {projectCities.map((city) => (
                    <option key={city.id} value={city.id} className="bg-gray-800">
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Adresse du site"
                type="text"
                value={formData.projectAddress}
                onChange={(e) => handleChange("projectAddress", e.target.value)}
              />

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Description du projet
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleChange("projectDescription", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Sectors selection */}
            <div className="mt-5 pt-5 border-t border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Secteurs d'activite
              </label>

              {loadingSectors ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-3 rounded-xl border border-gray-700 bg-gray-800/30">
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
                        <span className={`font-medium text-xs ${isSelected ? "text-orange-400" : "text-white"}`}>
                          {sector.name}
                        </span>
                      </label>
                    );
                  })}
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
                label="Emplois directs"
                type="number"
                min="0"
                value={formData.directJobs}
                onChange={(e) => handleChange("directJobs", e.target.value)}
              />
              <InputField
                label="Emplois indirects"
                type="number"
                min="0"
                value={formData.indirectJobs}
                onChange={(e) => handleChange("indirectJobs", e.target.value)}
              />

              <div className="hidden lg:block" />

              <InputField
                label="Date de debut"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
              <InputField
                label="Date de fin"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </SectionCard>

          {/* Section: Documents */}
          <SectionCard
            id="documents"
            title="Documents existants"
            icon={Upload}
            isComplete={isSectionComplete("documents")}
            sectionRef={sectionRefs.documents}
          >
            {existingDocuments.length > 0 ? (
              <div className="space-y-3">
                {existingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{doc.documentType?.name || doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.originalName}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-xs font-medium"
                    >
                      Voir
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucun document associe</p>
              </div>
            )}

            <p className="mt-4 text-xs text-gray-500">
              Pour ajouter ou modifier des documents, veuillez utiliser la page de gestion des documents.
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
