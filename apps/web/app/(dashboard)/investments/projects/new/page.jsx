"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

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

const sectorOptions = [
  "Agriculture",
  "Mines",
  "Energie",
  "Technologies",
  "Tourisme",
  "Industrie",
  "Services",
  "Transport",
  "Construction",
  "Commerce",
  "Sante",
  "Education",
];

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Investor search
  const [investors, setInvestors] = useState([]);
  const [searchInvestor, setSearchInvestor] = useState("");
  const [showInvestorDropdown, setShowInvestorDropdown] = useState(false);
  const [loadingInvestors, setLoadingInvestors] = useState(false);

  // Location data
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    investorId: "",
    investorName: "",
    sector: "",
    subSector: "",
    amount: "",
    currency: "USD",
    jobsCreated: "",
    province: "",
    city: "",
    address: "",
    startDate: "",
    expectedEndDate: "",
    status: "DRAFT",
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

  // Fetch investors on search
  useEffect(() => {
    const fetchInvestors = async () => {
      if (searchInvestor.length < 2) {
        setInvestors([]);
        return;
      }

      setLoadingInvestors(true);
      try {
        const response = await fetch(`/api/investments/investors?search=${encodeURIComponent(searchInvestor)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setInvestors(data.investors || []);
        }
      } catch (err) {
        console.error("Error fetching investors:", err);
      } finally {
        setLoadingInvestors(false);
      }
    };

    const debounce = setTimeout(fetchInvestors, 300);
    return () => clearTimeout(debounce);
  }, [searchInvestor]);

  // Fetch provinces on load
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("/api/referentiels/provinces");
        if (response.ok) {
          const data = await response.json();
          setProvinces(data || []);
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.province) {
        setCities([]);
        return;
      }
      try {
        const response = await fetch(`/api/referentiels/cities?province=${encodeURIComponent(formData.province)}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data || []);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, [formData.province]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectInvestor = (investor) => {
    setFormData(prev => ({
      ...prev,
      investorId: investor.id,
      investorName: investor.companyName || `${investor.firstName} ${investor.lastName}`,
    }));
    setSearchInvestor(investor.companyName || `${investor.firstName} ${investor.lastName}`);
    setShowInvestorDropdown(false);
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
      const payload = {
        projectName: formData.projectName.trim(),
        description: formData.description.trim(),
        investorId: formData.investorId,
        sector: formData.sector,
        subSector: formData.subSector,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        currency: formData.currency,
        jobsCreated: formData.jobsCreated ? parseInt(formData.jobsCreated) : null,
        province: formData.province,
        city: formData.city,
        address: formData.address,
        startDate: formData.startDate || null,
        expectedEndDate: formData.expectedEndDate || null,
        status: formData.status,
        priority: formData.priority,
      };

      const response = await fetch("/api/investments/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la creation du projet");
      }

      const newProject = await response.json();
      router.push(`/investments/projects/${newProject.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/investments/projects"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour a la liste
          </Link>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouveau Projet d'Investissement</h1>
              <p className="text-gray-500">Enregistrer un nouveau projet dans le systeme</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Informations generales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              Informations generales
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Construction usine textile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description detaillee du projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut initial
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              Investisseur <span className="text-red-500">*</span>
            </h2>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInvestor}
                  onChange={(e) => {
                    setSearchInvestor(e.target.value);
                    setShowInvestorDropdown(true);
                    if (!e.target.value) {
                      handleChange("investorId", "");
                      handleChange("investorName", "");
                    }
                  }}
                  onFocus={() => setShowInvestorDropdown(true)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rechercher un investisseur par nom..."
                />
                {loadingInvestors && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                )}
              </div>

              {showInvestorDropdown && investors.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {investors.map((investor) => (
                    <button
                      key={investor.id}
                      type="button"
                      onClick={() => selectInvestor(investor)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {investor.companyName || `${investor.firstName} ${investor.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {investor.investorCode} - {investor.country || "RDC"}
                        </p>
                      </div>
                      {formData.investorId === investor.id && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showInvestorDropdown && searchInvestor.length >= 2 && investors.length === 0 && !loadingInvestors && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  Aucun investisseur trouve
                </div>
              )}
            </div>

            {formData.investorId && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Investisseur selectionne: <strong>{formData.investorName}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Section: Secteur */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Factory className="h-5 w-5 text-gray-400" />
              Secteur d'activite
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur principal
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleChange("sector", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selectionner un secteur</option>
                  {sectorOptions.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sous-secteur
                </label>
                <input
                  type="text"
                  value={formData.subSector}
                  onChange={(e) => handleChange("subSector", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Textile, Agroalimentaire..."
                />
              </div>
            </div>
          </div>

          {/* Section: Montant et Emplois */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              Montant et Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant de l'investissement
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Devise
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencyOptions.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emplois crees
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.jobsCreated}
                    onChange={(e) => handleChange("jobsCreated", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Localisation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              Localisation du projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => {
                    handleChange("province", e.target.value);
                    handleChange("city", "");
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selectionner une province</option>
                  {provinces.map((prov) => (
                    <option key={prov.id || prov.name} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.province}
                >
                  <option value="">Selectionner une ville</option>
                  {cities.map((city) => (
                    <option key={city.id || city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complete
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Numero, rue, quartier..."
                />
              </div>
            </div>
          </div>

          {/* Section: Dates */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              Calendrier du projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de debut prevue
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin prevue
                </label>
                <input
                  type="date"
                  value={formData.expectedEndDate}
                  onChange={(e) => handleChange("expectedEndDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/investments/projects"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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
