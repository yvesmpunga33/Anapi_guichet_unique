"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Globe,
  MapPin,
  Calendar,
  Save,
  X,
  Loader2,
  DollarSign,
  Briefcase,
  Users,
  Factory,
  Search,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Services
import { InvestorList } from "@/app/services/admin/Investor.service";
import { ProjectCreate } from "@/app/services/admin/Project.service";
import { ReferentielProvinceList, ReferentielCityList, ReferentielSectorList } from "@/app/services/admin/Referentiel.service";

const statusOptions = [
  { value: "DRAFT", label: "Brouillon", color: "bg-gray-100 text-gray-700" },
  { value: "SUBMITTED", label: "Soumis", color: "bg-blue-100 text-blue-700" },
  { value: "UNDER_REVIEW", label: "En examen", color: "bg-yellow-100 text-yellow-700" },
  { value: "APPROVED", label: "Approuve", color: "bg-green-100 text-green-700" },
  { value: "IN_PROGRESS", label: "En cours", color: "bg-purple-100 text-purple-700" },
];

const currencyOptions = [
  { value: "USD", label: "USD - Dollar americain" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "CDF", label: "CDF - Franc congolais" },
];


export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Investor search modal
  const [investors, setInvestors] = useState([]);
  const [searchInvestor, setSearchInvestor] = useState("");
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [loadingInvestors, setLoadingInvestors] = useState(false);
  const [investorPage, setInvestorPage] = useState(1);
  const [investorTotalPages, setInvestorTotalPages] = useState(1);
  const [investorTotal, setInvestorTotal] = useState(0);
  const modalRef = useRef(null);

  // Location and sector data
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    investorId: "",
    investorName: "",
    sectorId: "",
    subSector: "",
    amount: "",
    currency: "USD",
    jobsCreated: "",
    provinceId: "",
    cityId: "",
    address: "",
    startDate: "",
    expectedEndDate: "",
    status: "draft",
    priority: "MEDIUM",
  });

  // Pre-fill investor from URL params (when coming from investor detail page)
  useEffect(() => {
    const investorId = searchParams.get("investorId");
    const investorName = searchParams.get("investorName");
    if (investorId && investorName) {
      setFormData(prev => ({
        ...prev,
        investorId,
        investorName,
      }));
      setSearchInvestor(investorName);
    }
  }, [searchParams]);

  // Fetch investors for modal
  const fetchInvestorsForModal = async (search = "", page = 1) => {
    setLoadingInvestors(true);
    try {
      const response = await InvestorList({
        search: search.length >= 2 ? search : "",
        page,
        limit: 10
      });
      const data = response.data?.data || response.data;
      setInvestors(data?.investors || []);
      setInvestorTotal(data?.pagination?.total || 0);
      setInvestorTotalPages(data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching investors:", err);
      setInvestors([]);
    } finally {
      setLoadingInvestors(false);
    }
  };

  // Fetch investors when modal opens or search/page changes
  useEffect(() => {
    if (showInvestorModal) {
      const debounce = setTimeout(() => {
        fetchInvestorsForModal(searchInvestor, investorPage);
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [showInvestorModal, searchInvestor, investorPage]);

  // Reset page when search changes
  useEffect(() => {
    setInvestorPage(1);
  }, [searchInvestor]);

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowInvestorModal(false);
      }
    };
    if (showInvestorModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInvestorModal]);

  // Fetch provinces and sectors on load
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await ReferentielProvinceList();
        const provincesData = response.data?.data || response.data?.provinces || response.data || [];
        setProvinces(Array.isArray(provincesData) ? provincesData : []);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setProvinces([]);
      }
    };

    const fetchSectors = async () => {
      try {
        const response = await ReferentielSectorList();
        // API returns { success: true, data: { sectors: [...] } }
        const sectorsData = response.data?.data?.sectors || response.data?.sectors || response.data?.data || [];
        setSectors(Array.isArray(sectorsData) ? sectorsData : []);
      } catch (err) {
        console.error("Error fetching sectors:", err);
        setSectors([]);
      }
    };

    fetchProvinces();
    fetchSectors();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.provinceId) {
        setCities([]);
        return;
      }
      try {
        const response = await ReferentielCityList({ provinceId: formData.provinceId });
        const citiesData = response.data?.data || response.data?.cities || response.data || [];
        setCities(Array.isArray(citiesData) ? citiesData : []);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      }
    };
    fetchCities();
  }, [formData.provinceId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectInvestor = (investor) => {
    const name = investor.name || investor.companyName || `${investor.firstName || ""} ${investor.lastName || ""}`.trim();
    setFormData(prev => ({
      ...prev,
      investorId: investor.id,
      investorName: name,
    }));
    setShowInvestorModal(false);
    setSearchInvestor("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.projectName.trim()) {
      setError("Le nom du projet est requis");
      return;
    }

    if (!formData.investorId) {
      setError("Veuillez selectionner un investisseur");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.sectorId) {
        setError("Veuillez selectionner un secteur");
        setSaving(false);
        return;
      }
      if (!formData.provinceId) {
        setError("Veuillez selectionner une province");
        setSaving(false);
        return;
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError("Veuillez entrer un montant d'investissement valide");
        setSaving(false);
        return;
      }

      const payload = {
        projectName: formData.projectName.trim(),
        description: formData.description.trim() || null,
        investorId: formData.investorId,
        sectorId: formData.sectorId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        jobsCreated: formData.jobsCreated ? parseInt(formData.jobsCreated) : 0,
        provinceId: formData.provinceId,
        cityId: formData.cityId || null,
        startDate: formData.startDate || null,
        endDate: formData.expectedEndDate || null,
        notes: formData.address || null,
      };

      const response = await ProjectCreate(payload);
      const newProject = response.data?.data?.investment || response.data?.investment || response.data;
      router.push(`/investments/projects/${newProject.id}`);
    } catch (err) {
      console.error("Error creating investment:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Erreur lors de la creation";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/investments/projects"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour a la liste
          </Link>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouveau Projet d'Investissement</h1>
              <p className="text-gray-500 dark:text-gray-400">Enregistrer un nouveau projet dans le systeme</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Informations generales */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              Informations generales
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Construction usine textile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Description detaillee du projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut initial
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Investisseur */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              Investisseur <span className="text-red-500">*</span>
            </h2>

            {/* Button to open modal */}
            <button
              type="button"
              onClick={() => setShowInvestorModal(true)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-left bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                {formData.investorId ? (
                  <span className="text-gray-900 dark:text-white font-medium">{formData.investorName}</span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Cliquez pour rechercher un investisseur...</span>
                )}
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>

            {formData.investorId && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Investisseur selectionne: <strong>{formData.investorName}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, investorId: "", investorName: "" }));
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Investor Search Modal */}
          {showInvestorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Rechercher un investisseur
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowInvestorModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchInvestor}
                      onChange={(e) => setSearchInvestor(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tapez au moins 2 caracteres pour rechercher..."
                      autoFocus
                    />
                    {loadingInvestors && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
                    )}
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {investorTotal > 0 ? `${investorTotal} investisseurs trouves` : "Recherchez parmi plus de 4000 investisseurs"}
                  </p>
                </div>

                {/* Modal Body - List */}
                <div className="flex-1 overflow-y-auto">
                  {loadingInvestors ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                  ) : investors.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {investors.map((investor, index) => (
                        <button
                          key={investor.id}
                          type="button"
                          onClick={() => selectInvestor(investor)}
                          className={`w-full px-6 py-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-between transition-colors ${
                            formData.investorId === investor.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                              {(investor.name || investor.companyName || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {investor.name || investor.companyName || `${investor.firstName || ""} ${investor.lastName || ""}`}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {investor.investorCode || investor.email || ""} {investor.country ? `- ${investor.country}` : ""}
                              </p>
                            </div>
                          </div>
                          {formData.investorId === investor.id && (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : searchInvestor.length >= 2 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                      <User className="h-12 w-12 mb-4 opacity-50" />
                      <p>Aucun investisseur trouve</p>
                      <p className="text-sm">Essayez avec d'autres termes de recherche</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                      <Search className="h-12 w-12 mb-4 opacity-50" />
                      <p>Tapez au moins 2 caracteres pour rechercher</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer - Pagination */}
                {investors.length > 0 && investorTotalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Page {investorPage} sur {investorTotalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInvestorPage(prev => Math.max(1, prev - 1))}
                        disabled={investorPage === 1}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Precedent
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvestorPage(prev => Math.min(investorTotalPages, prev + 1))}
                        disabled={investorPage === investorTotalPages}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Secteur */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Factory className="h-5 w-5 text-gray-400" />
              Secteur d'activite
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secteur principal <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sectorId}
                  onChange={(e) => handleChange("sectorId", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Selectionner un secteur</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.nameFr || sector.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sous-secteur
                </label>
                <input
                  type="text"
                  value={formData.subSector}
                  onChange={(e) => handleChange("subSector", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Textile, Agroalimentaire..."
                />
              </div>
            </div>
          </div>

          {/* Section: Montant et Emplois */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              Montant et Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Montant de l'investissement <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Devise
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {currencyOptions.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emplois crees
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.jobsCreated}
                    onChange={(e) => handleChange("jobsCreated", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Localisation */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              Localisation du projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.provinceId}
                  onChange={(e) => {
                    handleChange("provinceId", e.target.value);
                    handleChange("cityId", "");
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Selectionner une province</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ville
                </label>
                <select
                  value={formData.cityId}
                  onChange={(e) => handleChange("cityId", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={!formData.provinceId}
                >
                  <option value="">Selectionner une ville</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse complete
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Numero, rue, quartier..."
                />
              </div>
            </div>
          </div>

          {/* Section: Dates */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              Calendrier du projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de debut prevue
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de fin prevue
                </label>
                <input
                  type="date"
                  value={formData.expectedEndDate}
                  onChange={(e) => handleChange("expectedEndDate", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/investments/projects"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Creer le projet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
