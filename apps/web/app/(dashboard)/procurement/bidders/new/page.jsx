"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BidderCreate, SectorList, SectorCreate } from "@/app/services/admin/Procurement.service";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  FileText,
  Loader2,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Briefcase,
  Plus,
  X,
  CheckCircle,
  Palette,
} from "lucide-react";

const colorOptions = [
  { value: "blue", label: "Bleu", class: "bg-blue-500" },
  { value: "green", label: "Vert", class: "bg-green-500" },
  { value: "red", label: "Rouge", class: "bg-red-500" },
  { value: "yellow", label: "Jaune", class: "bg-yellow-500" },
  { value: "purple", label: "Violet", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "pink", label: "Rose", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "teal", label: "Cyan", class: "bg-teal-500" },
  { value: "gray", label: "Gris", class: "bg-gray-500" },
];

const categories = [
  { value: "MICRO", label: "Micro entreprise", description: "CA < 50 000 USD" },
  { value: "SMALL", label: "Petite entreprise", description: "CA 50 000 - 500 000 USD" },
  { value: "MEDIUM", label: "Moyenne entreprise", description: "CA 500 000 - 5 000 000 USD" },
  { value: "LARGE", label: "Grande entreprise", description: "CA > 5 000 000 USD" },
];

const legalForms = [
  { value: "SARL", label: "SARL - Société à Responsabilité Limitée" },
  { value: "SA", label: "SA - Société Anonyme" },
  { value: "SAS", label: "SAS - Société par Actions Simplifiée" },
  { value: "SNC", label: "SNC - Société en Nom Collectif" },
  { value: "EI", label: "EI - Entreprise Individuelle" },
  { value: "COOP", label: "Coopérative" },
  { value: "ONG", label: "ONG - Organisation Non Gouvernementale" },
  { value: "OTHER", label: "Autre" },
];

export default function NewBidderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference data
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);

  // Sector modal state
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [savingSector, setSavingSector] = useState(false);
  const [sectorFormData, setSectorFormData] = useState({
    code: "",
    name: "",
    description: "",
    color: "blue",
    isActive: true,
  });

  const [formData, setFormData] = useState({
    companyName: "",
    tradeName: "",
    legalForm: "SARL",
    rccm: "",
    idnat: "",
    nif: "",
    category: "SMALL",
    sectorId: "",
    establishmentDate: "",

    // Contact
    email: "",
    phone: "",
    alternatePhone: "",
    website: "",

    // Address
    countryId: "",
    provinceId: "",
    cityId: "",
    address: "",
    postalCode: "",

    // Representative
    representativeName: "",
    representativeTitle: "",
    representativePhone: "",
    representativeEmail: "",

    // Financial
    capitalAmount: "",
    annualTurnover: "",
    bankName: "",
    bankAccount: "",

    // Notes
    specializations: "",
    notes: "",
  });

  // Fetch reference data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, provincesRes, sectorsRes] = await Promise.all([
          fetch("/api/referentiels/countries?limit=300"),
          fetch("/api/referentiels/provinces?limit=100"),
          SectorList({ limit: 100 }),
        ]);

        const [countriesData, provincesData] = await Promise.all([
          countriesRes.json(),
          provincesRes.json(),
        ]);
        const sectorsData = sectorsRes.data;

        // APIs return { countries: [...] }, { provinces: [...] }, { sectors: [...] }
        setCountries(countriesData.countries || countriesData.data || []);
        setProvinces(provincesData.provinces || provincesData.data || []);
        setSectors(sectorsData.sectors || sectorsData.data || []);

        // Set DRC as default country
        const countriesList = countriesData.countries || countriesData.data || [];
        const drc = countriesList.find(c => c.code === "CD");
        if (drc) {
          setFormData(prev => ({ ...prev, countryId: drc.id }));
        }
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.provinceId) {
        setCities([]);
        return;
      }
      try {
        const response = await fetch(`/api/referentiels/cities?provinceId=${formData.provinceId}&limit=100`);
        const data = await response.json();
        // API returns { cities: [...] }
        setCities(data.cities || data.data || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, [formData.provinceId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  // Sector modal functions
  const openSectorModal = () => {
    setSectorFormData({
      code: "",
      name: "",
      description: "",
      color: "blue",
      isActive: true,
    });
    setShowSectorModal(true);
  };

  const handleSaveSector = async () => {
    if (!sectorFormData.code || !sectorFormData.name) {
      alert("Le code et le nom sont obligatoires");
      return;
    }

    setSavingSector(true);
    try {
      const response = await SectorCreate(sectorFormData);
      const data = response.data;

      if (data.sector) {
        // Refresh sectors list
        const sectorsResponse = await SectorList({ limit: 100 });
        const sectorsData = sectorsResponse.data;
        if (sectorsData.sectors) {
          setSectors(sectorsData.sectors);
        }

        // Select the new sector
        setFormData((prev) => ({ ...prev, sectorId: data.sector.id }));
        setShowSectorModal(false);
      } else {
        alert(data.error || "Erreur lors de la création du secteur");
      }
    } catch (err) {
      alert("Erreur lors de la création du secteur");
    } finally {
      setSavingSector(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.companyName) {
        throw new Error("Le nom de l'entreprise est obligatoire");
      }
      if (!formData.rccm) {
        throw new Error("Le numéro RCCM est obligatoire");
      }

      // Prepare data
      const submitData = {
        ...formData,
        capitalAmount: formData.capitalAmount ? parseFloat(formData.capitalAmount) : null,
        annualTurnover: formData.annualTurnover ? parseFloat(formData.annualTurnover) : null,
      };

      const response = await BidderCreate(submitData);
      const data = response.data;

      if (data.success) {
        router.push(`/procurement/bidders/${data.data.id}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/procurement/bidders"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-7 h-7 text-blue-600" />
              Nouveau soumissionnaire
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Enregistrez une nouvelle entreprise soumissionnaire
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Informations de l'entreprise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Raison sociale *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: CONGO CONSTRUCTION SARL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom commercial
              </label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Nom commercial (si différent)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Forme juridique
              </label>
              <select
                name="legalForm"
                value={formData.legalForm}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {legalForms.map((form) => (
                  <option key={form.value} value={form.value}>{form.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro RCCM *
              </label>
              <input
                type="text"
                name="rccm"
                value={formData.rccm}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: CD/KIN/RCCM/XX-X-XXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro IDNAT
              </label>
              <input
                type="text"
                name="idnat"
                value={formData.idnat}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Numéro d'identification nationale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro Impôt (NIF)
              </label>
              <input
                type="text"
                name="nif"
                value={formData.nif}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Numéro d'identification fiscale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie d'entreprise
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {categories.find((c) => c.value === formData.category)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Secteur d'activité
              </label>
              <div className="flex gap-2">
                <select
                  name="sectorId"
                  value={formData.sectorId}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={openSectorModal}
                  className="px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  title="Ajouter un secteur"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de création
              </label>
              <input
                type="date"
                name="establishmentDate"
                value={formData.establishmentDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            Coordonnées
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="contact@entreprise.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone principal
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="+243 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone secondaire
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="+243 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.entreprise.com"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Adresse
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pays
              </label>
              <select
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Province
              </label>
              <select
                name="provinceId"
                value={formData.provinceId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ville
              </label>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                disabled={!formData.provinceId}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Sélectionner...</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse complète
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Numéro, avenue, quartier, commune..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code postal
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Code postal"
              />
            </div>
          </div>
        </div>

        {/* Representative */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-600" />
            Représentant légal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Nom et prénom du représentant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fonction
              </label>
              <input
                type="text"
                name="representativeTitle"
                value={formData.representativeTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Directeur Général"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="representativePhone"
                value={formData.representativePhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="+243 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="representativeEmail"
                value={formData.representativeEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="representant@entreprise.com"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Informations financières
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capital social (USD)
              </label>
              <input
                type="number"
                name="capitalAmount"
                value={formData.capitalAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chiffre d'affaires annuel (USD)
              </label>
              <input
                type="number"
                name="annualTurnover"
                value={formData.annualTurnover}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Banque
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de la banque"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro de compte
              </label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Numéro de compte bancaire"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations complémentaires
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Spécialisations / Domaines d'expertise
              </label>
              <textarea
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Listez les domaines d'expertise de l'entreprise..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes internes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Notes internes sur le soumissionnaire..."
              />
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex items-center justify-end gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <Link
            href="/procurement/bidders"
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sector Modal */}
      {showSectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Nouveau secteur d'activité
              </h3>
              <button
                onClick={() => setShowSectorModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={sectorFormData.code}
                  onChange={(e) => setSectorFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: BTP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={sectorFormData.name}
                  onChange={(e) => setSectorFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Bâtiment et Travaux Publics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={sectorFormData.description}
                  onChange={(e) => setSectorFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Description du secteur..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Couleur
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSectorFormData((prev) => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded-lg ${color.class} flex items-center justify-center transition-transform ${
                        sectorFormData.color === color.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"
                      }`}
                    >
                      {sectorFormData.color === color.value && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setShowSectorModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveSector}
                disabled={savingSector || !sectorFormData.code || !sectorFormData.name}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {savingSector && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
