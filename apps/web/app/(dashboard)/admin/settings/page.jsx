"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Check,
  Globe,
  FileText,
  Building,
  Search,
  Mail,
  Server,
  TestTube,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Map,
  Users,
  TrendingUp,
  Building2,
  Star,
  Filter,
  RefreshCw,
  Factory,
} from "lucide-react";
import {
  ReferentielProvinceList,
  ReferentielProvinceCreate,
  ReferentielProvinceUpdate,
  ReferentielProvinceDelete,
  VilleList,
  VilleCreate,
  VilleUpdate,
  VilleDelete,
  CurrencyList,
  CurrencyCreate,
  CurrencyUpdate,
  CurrencyDelete,
  CountryList,
  CountryCreate,
  CountryUpdate,
  CountryDelete,
  ReferentielSectorList,
  ReferentielSectorCreate,
  ReferentielSectorUpdate,
  ReferentielSectorDelete,
} from "@/app/services/admin/Referentiel.service";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("currencies");

  // Currencies state
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [editingCurrencyId, setEditingCurrencyId] = useState(null);
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [currencyFormData, setCurrencyFormData] = useState({
    code: "",
    name: "",
    nameFr: "",
    nameEn: "",
    symbol: "",
    decimals: 2,
    exchangeRate: 1,
    isBaseCurrency: false,
    isActive: true,
    sortOrder: 0,
  });

  // Countries state
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [savingCountry, setSavingCountry] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [countryFormData, setCountryFormData] = useState({
    code: "",
    code3: "",
    name: "",
    nameFr: "",
    nameEn: "",
    nationality: "",
    nationalityFr: "",
    phoneCode: "",
    continent: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (activeTab === "currencies") {
      fetchCurrencies();
    } else if (activeTab === "countries") {
      fetchCountries();
    }
  }, [activeTab]);

  // ==================== CURRENCIES ====================

  const fetchCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      const response = await CurrencyList();
      const data = response.data;
      setCurrencies(data.currencies || data.data || []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const resetCurrencyForm = () => {
    setCurrencyFormData({
      code: "",
      name: "",
      nameFr: "",
      nameEn: "",
      symbol: "",
      decimals: 2,
      exchangeRate: 1,
      isBaseCurrency: false,
      isActive: true,
      sortOrder: 0,
    });
    setEditingCurrencyId(null);
    setShowCurrencyForm(false);
  };

  const handleEditCurrency = (currency) => {
    setCurrencyFormData({
      code: currency.code,
      name: currency.name,
      nameFr: currency.nameFr,
      nameEn: currency.nameEn || "",
      symbol: currency.symbol,
      decimals: currency.decimals,
      exchangeRate: currency.exchangeRate,
      isBaseCurrency: currency.isBaseCurrency,
      isActive: currency.isActive,
      sortOrder: currency.sortOrder,
    });
    setEditingCurrencyId(currency.id);
    setShowCurrencyForm(true);
  };

  const handleSubmitCurrency = async (e) => {
    e.preventDefault();
    if (!currencyFormData.code || !currencyFormData.name || !currencyFormData.symbol) {
      alert("Code, nom et symbole sont requis");
      return;
    }

    setSavingCurrency(true);
    try {
      if (editingCurrencyId) {
        await CurrencyUpdate(editingCurrencyId, currencyFormData);
      } else {
        await CurrencyCreate(currencyFormData);
      }
      fetchCurrencies();
      resetCurrencyForm();
    } catch (error) {
      console.error("Error saving currency:", error);
      alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleDeleteCurrency = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette devise ?")) return;
    try {
      await CurrencyDelete(id);
      fetchCurrencies();
    } catch (error) {
      console.error("Error deleting currency:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleCurrencyActive = async (currency) => {
    try {
      await CurrencyUpdate(currency.id, { isActive: !currency.isActive });
      fetchCurrencies();
    } catch (error) {
      console.error("Error toggling currency:", error);
    }
  };

  // ==================== COUNTRIES ====================

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const params = {};
      if (countrySearch) params.search = countrySearch;
      if (countryFilter) params.continent = countryFilter;

      const response = await CountryList(params);
      const data = response.data;
      setCountries(data.countries || data.data || []);
      setContinents(data.continents || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    if (activeTab === "countries") {
      const debounce = setTimeout(() => {
        fetchCountries();
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [countrySearch, countryFilter]);

  const resetCountryForm = () => {
    setCountryFormData({
      code: "",
      code3: "",
      name: "",
      nameFr: "",
      nameEn: "",
      nationality: "",
      nationalityFr: "",
      phoneCode: "",
      continent: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingCountryId(null);
    setShowCountryForm(false);
  };

  const handleEditCountry = (country) => {
    setCountryFormData({
      code: country.code,
      code3: country.code3 || "",
      name: country.name,
      nameFr: country.nameFr,
      nameEn: country.nameEn || "",
      nationality: country.nationality || "",
      nationalityFr: country.nationalityFr || "",
      phoneCode: country.phoneCode || "",
      continent: country.continent || "",
      isActive: country.isActive,
      sortOrder: country.sortOrder,
    });
    setEditingCountryId(country.id);
    setShowCountryForm(true);
  };

  const handleSubmitCountry = async (e) => {
    e.preventDefault();
    if (!countryFormData.code || !countryFormData.name || !countryFormData.nameFr) {
      alert("Code, nom et nom francais sont requis");
      return;
    }

    setSavingCountry(true);
    try {
      if (editingCountryId) {
        await CountryUpdate(editingCountryId, countryFormData);
      } else {
        await CountryCreate(countryFormData);
      }
      fetchCountries();
      resetCountryForm();
    } catch (error) {
      console.error("Error saving country:", error);
      alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSavingCountry(false);
    }
  };

  const handleDeleteCountry = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce pays ?")) return;
    try {
      await CountryDelete(id);
      fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleCountryActive = async (country) => {
    try {
      await CountryUpdate(country.id, { isActive: !country.isActive });
      fetchCountries();
    } catch (error) {
      console.error("Error toggling country:", error);
    }
  };

  // ==================== EMAIL CONFIG ====================
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const fetchEmailConfig = async () => {
    setLoadingEmail(true);
    try {
      const response = await fetch("/api/admin/config?category=email");
      const data = await response.json();
      setEmailConfigs(data.configs || []);
    } catch (error) {
      console.error("Error fetching email config:", error);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleEmailConfigChange = (key, value) => {
    setEmailConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value } : c))
    );
  };

  const handleSaveEmailConfig = async () => {
    setSavingEmail(true);
    setEmailMessage(null);
    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configs: emailConfigs.map((c) => ({ key: c.key, value: c.value })),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setEmailMessage({ type: "success", text: "Configuration enregistree" });
        fetchEmailConfig();
      } else {
        setEmailMessage({ type: "error", text: data.error || "Erreur" });
      }
    } catch (error) {
      setEmailMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailMessage(null);
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_email", testEmail }),
      });
      const data = await response.json();

      if (data.success) {
        setEmailMessage({ type: "success", text: data.message });
      } else {
        setEmailMessage({ type: "error", text: data.error + (data.details ? `: ${data.details}` : "") });
      }
    } catch (error) {
      setEmailMessage({ type: "error", text: "Erreur lors du test" });
    } finally {
      setTestingEmail(false);
    }
  };

  const togglePassword = (key) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (activeTab === "email") {
      fetchEmailConfig();
    }
  }, [activeTab]);

  // ==================== PROVINCES ====================
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [savingProvince, setSavingProvince] = useState(false);
  const [showProvinceForm, setShowProvinceForm] = useState(false);
  const [editingProvinceId, setEditingProvinceId] = useState(null);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [provincePage, setProvincePage] = useState(1);
  const [provincePerPage] = useState(10);
  const [provinceStats, setProvinceStats] = useState({
    total: 0,
    totalPopulation: 0,
    totalArea: 0,
    active: 0,
  });
  const [provinceFormData, setProvinceFormData] = useState({
    code: "",
    name: "",
    capital: "",
    population: "",
    area: "",
    isActive: true,
  });

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await ReferentielProvinceList();
      const data = response.data;
      // Backend returns { success: true, data: [...] } or { provinces: [...], stats: {...} }
      const provincesData = data.provinces || data.data || [];
      setProvinces(Array.isArray(provincesData) ? provincesData : []);

      // Calculate stats from data if not provided
      if (data.stats) {
        setProvinceStats(data.stats);
      } else if (Array.isArray(provincesData)) {
        setProvinceStats({
          total: provincesData.length,
          totalPopulation: provincesData.reduce((sum, p) => sum + (Number(p.population) || 0), 0),
          totalArea: provincesData.reduce((sum, p) => sum + (Number(p.area) || 0), 0),
          active: provincesData.filter(p => p.isActive !== false).length,
        });
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const resetProvinceForm = () => {
    setProvinceFormData({
      code: "",
      name: "",
      capital: "",
      population: "",
      area: "",
      isActive: true,
    });
    setEditingProvinceId(null);
    setShowProvinceForm(false);
  };

  const handleEditProvince = (province) => {
    setProvinceFormData({
      code: province.code || "",
      name: province.name || "",
      capital: province.capital || "",
      population: province.population || "",
      area: province.area || "",
      isActive: province.isActive !== false,
    });
    setEditingProvinceId(province.id);
    setShowProvinceForm(true);
  };

  const handleSubmitProvince = async (e) => {
    e.preventDefault();
    if (!provinceFormData.code || !provinceFormData.name) {
      alert("Code et nom sont requis");
      return;
    }

    setSavingProvince(true);
    try {
      if (editingProvinceId) {
        await ReferentielProvinceUpdate(editingProvinceId, provinceFormData);
      } else {
        await ReferentielProvinceCreate(provinceFormData);
      }
      fetchProvinces();
      resetProvinceForm();
    } catch (error) {
      console.error("Error saving province:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSavingProvince(false);
    }
  };

  const handleDeleteProvince = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette province ?")) return;
    try {
      await ReferentielProvinceDelete(id);
      fetchProvinces();
    } catch (error) {
      console.error("Error deleting province:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleToggleProvinceActive = async (province) => {
    try {
      await ReferentielProvinceUpdate(province.id, { isActive: !province.isActive });
      fetchProvinces();
    } catch (error) {
      console.error("Error toggling province:", error);
    }
  };

  const filteredProvinces = provinces.filter((province) => {
    const matchesSearch =
      province.name?.toLowerCase().includes(provinceSearch.toLowerCase()) ||
      province.code?.toLowerCase().includes(provinceSearch.toLowerCase()) ||
      province.capital?.toLowerCase().includes(provinceSearch.toLowerCase());
    return matchesSearch;
  });

  // Pagination for provinces
  const provinceTotalPages = Math.ceil(filteredProvinces.length / provincePerPage);
  const paginatedProvinces = filteredProvinces.slice(
    (provincePage - 1) * provincePerPage,
    provincePage * provincePerPage
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setProvincePage(1);
  }, [provinceSearch]);

  // ==================== CITIES ====================
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [savingCity, setSavingCity] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [editingCityId, setEditingCityId] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [cityProvinceFilter, setCityProvinceFilter] = useState("");
  const [cityPage, setCityPage] = useState(1);
  const [cityPerPage] = useState(10);
  const [cityStats, setCityStats] = useState({
    total: 0,
    totalPopulation: 0,
    capitals: 0,
    active: 0,
  });
  const [cityFormData, setCityFormData] = useState({
    code: "",
    name: "",
    provinceId: "",
    population: "",
    isCapital: false,
    isActive: true,
  });

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const params = {};
      if (cityProvinceFilter) {
        params.provinceId = cityProvinceFilter;
      }
      const response = await VilleList(params);
      const data = response.data;
      // Backend returns { success: true, data: [...] } or { cities: [...], stats: {...} }
      const citiesData = data.cities || data.data || [];
      setCities(Array.isArray(citiesData) ? citiesData : []);

      // Calculate stats from data if not provided
      if (data.stats) {
        setCityStats(data.stats);
      } else if (Array.isArray(citiesData)) {
        setCityStats({
          total: citiesData.length,
          totalPopulation: citiesData.reduce((sum, c) => sum + (Number(c.population) || 0), 0),
          capitals: citiesData.filter(c => c.cityType === 'capital').length,
          active: citiesData.filter(c => c.isActive !== false).length,
        });
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const resetCityForm = () => {
    setCityFormData({
      code: "",
      name: "",
      provinceId: cityProvinceFilter || "",
      population: "",
      isCapital: false,
      isActive: true,
    });
    setEditingCityId(null);
    setShowCityForm(false);
  };

  const handleEditCity = (city) => {
    setCityFormData({
      code: city.code || "",
      name: city.name || "",
      provinceId: city.provinceId || "",
      population: city.population || "",
      isCapital: city.isCapital === true,
      isActive: city.isActive !== false,
    });
    setEditingCityId(city.id);
    setShowCityForm(true);
  };

  const handleSubmitCity = async (e) => {
    e.preventDefault();
    if (!cityFormData.code || !cityFormData.name || !cityFormData.provinceId) {
      alert("Code, nom et province sont requis");
      return;
    }

    setSavingCity(true);
    try {
      if (editingCityId) {
        await VilleUpdate(editingCityId, cityFormData);
      } else {
        await VilleCreate(cityFormData);
      }
      fetchCities();
      resetCityForm();
    } catch (error) {
      console.error("Error saving city:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSavingCity(false);
    }
  };

  const handleDeleteCity = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette ville ?")) return;
    try {
      await VilleDelete(id);
      fetchCities();
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleToggleCityActive = async (city) => {
    try {
      await VilleUpdate(city.id, { isActive: !city.isActive });
      fetchCities();
    } catch (error) {
      console.error("Error toggling city:", error);
    }
  };

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name?.toLowerCase().includes(citySearch.toLowerCase()) ||
      city.code?.toLowerCase().includes(citySearch.toLowerCase()) ||
      city.province?.name?.toLowerCase().includes(citySearch.toLowerCase());
    return matchesSearch;
  });

  // Pagination for cities
  const cityTotalPages = Math.ceil(filteredCities.length / cityPerPage);
  const paginatedCities = filteredCities.slice(
    (cityPage - 1) * cityPerPage,
    cityPage * cityPerPage
  );

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCityPage(1);
  }, [citySearch, cityProvinceFilter]);

  const formatNumber = (num) => {
    if (!num) return "-";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  useEffect(() => {
    if (activeTab === "provinces") {
      fetchProvinces();
    } else if (activeTab === "cities") {
      fetchProvinces(); // For city form dropdown
      fetchCities();
    } else if (activeTab === "sectors") {
      fetchSectors();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "cities") {
      fetchCities();
    }
  }, [cityProvinceFilter]);

  // ==================== SECTORS ====================
  const [sectors, setSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [savingSector, setSavingSector] = useState(false);
  const [showSectorForm, setShowSectorForm] = useState(false);
  const [editingSectorId, setEditingSectorId] = useState(null);
  const [sectorSearch, setSectorSearch] = useState("");
  const [sectorPage, setSectorPage] = useState(1);
  const [sectorPerPage] = useState(10);
  const [sectorStats, setSectorStats] = useState({
    total: 0,
    active: 0,
  });
  const [sectorFormData, setSectorFormData] = useState({
    code: "",
    name: "",
    nameFr: "",
    description: "",
    color: "blue",
    isActive: true,
  });

  const sectorColors = [
    { value: "blue", label: "Bleu" },
    { value: "green", label: "Vert" },
    { value: "purple", label: "Violet" },
    { value: "orange", label: "Orange" },
    { value: "red", label: "Rouge" },
    { value: "yellow", label: "Jaune" },
    { value: "pink", label: "Rose" },
    { value: "gray", label: "Gris" },
  ];

  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await ReferentielSectorList();
      const data = response.data;
      const sectorsData = data.data?.sectors || data.sectors || data.data || [];
      setSectors(Array.isArray(sectorsData) ? sectorsData : []);

      // Calculate stats
      if (Array.isArray(sectorsData)) {
        setSectorStats({
          total: sectorsData.length,
          active: sectorsData.filter(s => s.isActive !== false).length,
        });
      }
    } catch (error) {
      console.error("Error fetching sectors:", error);
    } finally {
      setLoadingSectors(false);
    }
  };

  const resetSectorForm = () => {
    setSectorFormData({
      code: "",
      name: "",
      nameFr: "",
      description: "",
      color: "blue",
      isActive: true,
    });
    setEditingSectorId(null);
    setShowSectorForm(false);
  };

  const handleEditSector = (sector) => {
    setSectorFormData({
      code: sector.code || "",
      name: sector.name || "",
      nameFr: sector.nameFr || "",
      description: sector.description || "",
      color: sector.color || "blue",
      isActive: sector.isActive !== false,
    });
    setEditingSectorId(sector.id);
    setShowSectorForm(true);
  };

  const handleSubmitSector = async (e) => {
    e.preventDefault();
    if (!sectorFormData.code || !sectorFormData.name) {
      alert("Code et nom sont requis");
      return;
    }

    setSavingSector(true);
    try {
      if (editingSectorId) {
        await ReferentielSectorUpdate(editingSectorId, sectorFormData);
      } else {
        await ReferentielSectorCreate(sectorFormData);
      }
      fetchSectors();
      resetSectorForm();
    } catch (error) {
      console.error("Error saving sector:", error);
      alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSavingSector(false);
    }
  };

  const handleDeleteSector = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce secteur ?")) return;
    try {
      await ReferentielSectorDelete(id);
      fetchSectors();
    } catch (error) {
      console.error("Error deleting sector:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleSectorActive = async (sector) => {
    try {
      await ReferentielSectorUpdate(sector.id, { isActive: !sector.isActive });
      fetchSectors();
    } catch (error) {
      console.error("Error toggling sector:", error);
    }
  };

  const filteredSectors = sectors.filter((sector) => {
    const matchesSearch =
      sector.name?.toLowerCase().includes(sectorSearch.toLowerCase()) ||
      sector.nameFr?.toLowerCase().includes(sectorSearch.toLowerCase()) ||
      sector.code?.toLowerCase().includes(sectorSearch.toLowerCase());
    return matchesSearch;
  });

  const sectorTotalPages = Math.ceil(filteredSectors.length / sectorPerPage);
  const paginatedSectors = filteredSectors.slice(
    (sectorPage - 1) * sectorPerPage,
    sectorPage * sectorPerPage
  );

  useEffect(() => {
    setSectorPage(1);
  }, [sectorSearch]);

  const tabs = [
    { id: "currencies", label: "Devises", icon: DollarSign },
    { id: "countries", label: "Pays", icon: Globe },
    { id: "provinces", label: "Provinces", icon: Map },
    { id: "cities", label: "Villes", icon: Building2 },
    { id: "sectors", label: "Secteurs", icon: Factory },
    { id: "email", label: "Email / SMTP", icon: Mail },
    { id: "document-types", label: "Types de documents", icon: FileText },
    { id: "general", label: "General", icon: Building },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" />
          Parametres
        </h1>
        <p className="text-gray-400 mt-1">
          Configuration generale du systeme
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "currencies" && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Gestion des devises
            </h2>
            <button
              onClick={() => {
                resetCurrencyForm();
                setShowCurrencyForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle devise
            </button>
          </div>

          {/* Form */}
          {showCurrencyForm && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingCurrencyId ? "Modifier la devise" : "Nouvelle devise"}
              </h3>
              <form onSubmit={handleSubmitCurrency} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code ISO *
                    </label>
                    <input
                      type="text"
                      value={currencyFormData.code}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      maxLength={3}
                      placeholder="USD"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={currencyFormData.name}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Dollar americain"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Symbole *
                    </label>
                    <input
                      type="text"
                      value={currencyFormData.symbol}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({ ...prev, symbol: e.target.value }))
                      }
                      placeholder="$"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom francais
                    </label>
                    <input
                      type="text"
                      value={currencyFormData.nameFr}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({ ...prev, nameFr: e.target.value }))
                      }
                      placeholder="Dollar americain"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom anglais
                    </label>
                    <input
                      type="text"
                      value={currencyFormData.nameEn}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({ ...prev, nameEn: e.target.value }))
                      }
                      placeholder="US Dollar"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Decimales
                    </label>
                    <input
                      type="number"
                      value={currencyFormData.decimals}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({
                          ...prev,
                          decimals: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="0"
                      max="4"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Taux de change
                    </label>
                    <input
                      type="number"
                      value={currencyFormData.exchangeRate}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({
                          ...prev,
                          exchangeRate: parseFloat(e.target.value) || 1,
                        }))
                      }
                      step="0.000001"
                      min="0"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={currencyFormData.sortOrder}
                      onChange={(e) =>
                        setCurrencyFormData((prev) => ({
                          ...prev,
                          sortOrder: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="0"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-8">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currencyFormData.isBaseCurrency}
                        onChange={(e) =>
                          setCurrencyFormData((prev) => ({
                            ...prev,
                            isBaseCurrency: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      Devise de base
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currencyFormData.isActive}
                        onChange={(e) =>
                          setCurrencyFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetCurrencyForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingCurrency}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingCurrency ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingCurrencyId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingCurrencies ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : currencies.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucune devise configuree
                </h3>
                <p className="text-gray-500 mt-1">
                  Ajoutez des devises pour commencer
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Nom
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Symbole
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Taux
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currencies.map((currency) => (
                    <tr key={currency.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-white">
                          {currency.code}
                        </span>
                        {currency.isBaseCurrency && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                            Base
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{currency.nameFr}</p>
                        {currency.nameEn && (
                          <p className="text-xs text-gray-500">{currency.nameEn}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400">
                          {currency.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400">
                          {parseFloat(currency.exchangeRate).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleCurrencyActive(currency)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            currency.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {currency.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditCurrency(currency)}
                            className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteCurrency(currency.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "countries" && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              Gestion des pays
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                />
              </div>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les continents</option>
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  resetCountryForm();
                  setShowCountryForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouveau pays
              </button>
            </div>
          </div>

          {/* Form */}
          {showCountryForm && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingCountryId ? "Modifier le pays" : "Nouveau pays"}
              </h3>
              <form onSubmit={handleSubmitCountry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code ISO 2 *
                    </label>
                    <input
                      type="text"
                      value={countryFormData.code}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      maxLength={2}
                      placeholder="CD"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code ISO 3
                    </label>
                    <input
                      type="text"
                      value={countryFormData.code3}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({
                          ...prev,
                          code3: e.target.value.toUpperCase(),
                        }))
                      }
                      maxLength={3}
                      placeholder="COD"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={countryFormData.name}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Democratic Republic of Congo"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom francais *
                    </label>
                    <input
                      type="text"
                      value={countryFormData.nameFr}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, nameFr: e.target.value }))
                      }
                      placeholder="Republique Democratique du Congo"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom anglais
                    </label>
                    <input
                      type="text"
                      value={countryFormData.nameEn}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, nameEn: e.target.value }))
                      }
                      placeholder="Democratic Republic of Congo"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nationalite (EN)
                    </label>
                    <input
                      type="text"
                      value={countryFormData.nationality}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, nationality: e.target.value }))
                      }
                      placeholder="Congolese"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nationalite (FR)
                    </label>
                    <input
                      type="text"
                      value={countryFormData.nationalityFr}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, nationalityFr: e.target.value }))
                      }
                      placeholder="Congolais(e)"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Indicatif tel.
                    </label>
                    <input
                      type="text"
                      value={countryFormData.phoneCode}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, phoneCode: e.target.value }))
                      }
                      placeholder="+243"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Continent
                    </label>
                    <select
                      value={countryFormData.continent}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({ ...prev, continent: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectionner...</option>
                      <option value="Afrique">Afrique</option>
                      <option value="Ameriques">Ameriques</option>
                      <option value="Asie">Asie</option>
                      <option value="Europe">Europe</option>
                      <option value="Oceanie">Oceanie</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={countryFormData.sortOrder}
                      onChange={(e) =>
                        setCountryFormData((prev) => ({
                          ...prev,
                          sortOrder: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="0"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={countryFormData.isActive}
                        onChange={(e) =>
                          setCountryFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      Actif
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetCountryForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingCountry}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingCountry ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingCountryId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingCountries ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : countries.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucun pays configure
                </h3>
                <p className="text-gray-500 mt-1">
                  Ajoutez des pays pour commencer
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Continent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Indicatif
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {countries.map((country) => (
                      <tr key={country.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">
                              {country.code}
                            </span>
                            {country.code3 && (
                              <span className="text-xs text-gray-500">
                                ({country.code3})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white">{country.nameFr}</p>
                          {country.nameEn && (
                            <p className="text-xs text-gray-500">{country.nameEn}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {country.continent || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {country.phoneCode || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleCountryActive(country)}
                            className={`px-2 py-1 text-xs rounded-full ${
                              country.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {country.isActive ? "Actif" : "Inactif"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCountry(country)}
                              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteCountry(country.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats */}
          {!loadingCountries && countries.length > 0 && (
            <div className="text-sm text-gray-500 text-right">
              {countries.length} pays affiche(s)
            </div>
          )}
        </div>
      )}

      {activeTab === "provinces" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Provinces</p>
                  <p className="text-2xl font-bold text-white mt-1">{provinceStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Population</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatNumber(provinceStats.totalPopulation)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Superficie</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatNumber(Math.round(provinceStats.totalArea || 0))} km2
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Actives</p>
                  <p className="text-2xl font-bold text-white mt-1">{provinceStats.active}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              Gestion des provinces
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={provinceSearch}
                  onChange={(e) => setProvinceSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                />
              </div>
              <button
                onClick={() => {
                  resetProvinceForm();
                  setShowProvinceForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvelle province
              </button>
            </div>
          </div>

          {/* Form */}
          {showProvinceForm && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingProvinceId ? "Modifier la province" : "Nouvelle province"}
              </h3>
              <form onSubmit={handleSubmitProvince} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={provinceFormData.code}
                      onChange={(e) =>
                        setProvinceFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      maxLength={10}
                      placeholder="KIN"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={provinceFormData.name}
                      onChange={(e) =>
                        setProvinceFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Kinshasa"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Capitale
                    </label>
                    <input
                      type="text"
                      value={provinceFormData.capital}
                      onChange={(e) =>
                        setProvinceFormData((prev) => ({ ...prev, capital: e.target.value }))
                      }
                      placeholder="Kinshasa"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Population
                    </label>
                    <input
                      type="number"
                      value={provinceFormData.population}
                      onChange={(e) =>
                        setProvinceFormData((prev) => ({
                          ...prev,
                          population: e.target.value,
                        }))
                      }
                      placeholder="17000000"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Superficie (km2)
                    </label>
                    <input
                      type="number"
                      value={provinceFormData.area}
                      onChange={(e) =>
                        setProvinceFormData((prev) => ({
                          ...prev,
                          area: e.target.value,
                        }))
                      }
                      placeholder="9965"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={provinceFormData.isActive}
                        onChange={(e) =>
                          setProvinceFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetProvinceForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingProvince}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingProvince ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingProvinceId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingProvinces ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : filteredProvinces.length === 0 ? (
              <div className="text-center py-12">
                <Map className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucune province configuree
                </h3>
                <p className="text-gray-500 mt-1">
                  Ajoutez des provinces pour commencer
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Province
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Capitale
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Population
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Superficie
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {paginatedProvinces.map((province, index) => (
                      <tr key={province.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-400">{(provincePage - 1) * provincePerPage + index + 1}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {province.name}
                              </p>
                              <p className="text-xs text-gray-500">{province.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {province.capital || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {formatNumber(province.population)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {province.area ? `${formatNumber(Math.round(province.area))} km2` : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleProvinceActive(province)}
                            className={`px-2 py-1 text-xs rounded-full ${
                              province.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {province.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProvince(province)}
                              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteProvince(province.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loadingProvinces && filteredProvinces.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Affichage {(provincePage - 1) * provincePerPage + 1} - {Math.min(provincePage * provincePerPage, filteredProvinces.length)} sur {filteredProvinces.length} province(s)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProvincePage((p) => Math.max(1, p - 1))}
                  disabled={provincePage === 1}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  Precedent
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, provinceTotalPages) }, (_, i) => {
                    let pageNum;
                    if (provinceTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (provincePage <= 3) {
                      pageNum = i + 1;
                    } else if (provincePage >= provinceTotalPages - 2) {
                      pageNum = provinceTotalPages - 4 + i;
                    } else {
                      pageNum = provincePage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setProvincePage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          provincePage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setProvincePage((p) => Math.min(provinceTotalPages, p + 1))}
                  disabled={provincePage === provinceTotalPages}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "cities" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Villes</p>
                  <p className="text-2xl font-bold text-white mt-1">{cityStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Population</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatNumber(cityStats.totalPopulation)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Capitales</p>
                  <p className="text-2xl font-bold text-white mt-1">{cityStats.capitals}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Actives</p>
                  <p className="text-2xl font-bold text-white mt-1">{cityStats.active}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold text-white">
              Gestion des villes
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={cityProvinceFilter}
                  onChange={(e) => setCityProvinceFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 appearance-none min-w-[180px]"
                >
                  <option value="">Toutes les provinces</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  resetCityForm();
                  setShowCityForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvelle ville
              </button>
            </div>
          </div>

          {/* Form */}
          {showCityForm && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingCityId ? "Modifier la ville" : "Nouvelle ville"}
              </h3>
              <form onSubmit={handleSubmitCity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={cityFormData.code}
                      onChange={(e) =>
                        setCityFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      maxLength={20}
                      placeholder="KIN-001"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={cityFormData.name}
                      onChange={(e) =>
                        setCityFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Kinshasa"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Province *
                    </label>
                    <select
                      value={cityFormData.provinceId}
                      onChange={(e) =>
                        setCityFormData((prev) => ({ ...prev, provinceId: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selectionner une province</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Population
                    </label>
                    <input
                      type="number"
                      value={cityFormData.population}
                      onChange={(e) =>
                        setCityFormData((prev) => ({
                          ...prev,
                          population: e.target.value,
                        }))
                      }
                      placeholder="500000"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-8">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cityFormData.isCapital}
                        onChange={(e) =>
                          setCityFormData((prev) => ({
                            ...prev,
                            isCapital: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      Capitale de province
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cityFormData.isActive}
                        onChange={(e) =>
                          setCityFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetCityForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingCity}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingCity ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingCityId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingCities ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucune ville configuree
                </h3>
                <p className="text-gray-500 mt-1">
                  Ajoutez des villes pour commencer
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Ville
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Province
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Population
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {paginatedCities.map((city, index) => (
                      <tr key={city.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-400">{(cityPage - 1) * cityPerPage + index + 1}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              city.cityType === 'capital'
                                ? 'bg-yellow-500/20'
                                : 'bg-blue-500/20'
                            }`}>
                              {city.cityType === 'capital' ? (
                                <Star className="w-5 h-5 text-yellow-400" />
                              ) : (
                                <Building2 className="w-5 h-5 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {city.name}
                              </p>
                              <p className="text-xs text-gray-500">{city.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-400">
                              {city.province?.name || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {formatNumber(city.population)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {city.cityType === 'capital' ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                              Capitale
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
                              Ville
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleCityActive(city)}
                            className={`px-2 py-1 text-xs rounded-full ${
                              city.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {city.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCity(city)}
                              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteCity(city.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loadingCities && filteredCities.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Affichage {(cityPage - 1) * cityPerPage + 1} - {Math.min(cityPage * cityPerPage, filteredCities.length)} sur {filteredCities.length} ville(s)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCityPage((p) => Math.max(1, p - 1))}
                  disabled={cityPage === 1}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  Precedent
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, cityTotalPages) }, (_, i) => {
                    let pageNum;
                    if (cityTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (cityPage <= 3) {
                      pageNum = i + 1;
                    } else if (cityPage >= cityTotalPages - 2) {
                      pageNum = cityTotalPages - 4 + i;
                    } else {
                      pageNum = cityPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCityPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          cityPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCityPage((p) => Math.min(cityTotalPages, p + 1))}
                  disabled={cityPage === cityTotalPages}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "sectors" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Secteurs</p>
                  <p className="text-2xl font-bold text-white mt-1">{sectorStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Factory className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Actifs</p>
                  <p className="text-2xl font-bold text-white mt-1">{sectorStats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un secteur..."
                value={sectorSearch}
                onChange={(e) => setSectorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowSectorForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter un secteur
            </button>
          </div>

          {/* Form */}
          {showSectorForm && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {editingSectorId ? "Modifier le secteur" : "Nouveau secteur"}
                </h3>
                <button
                  onClick={resetSectorForm}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmitSector} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={sectorFormData.code}
                      onChange={(e) =>
                        setSectorFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="AGRI"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={sectorFormData.name}
                      onChange={(e) =>
                        setSectorFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Agriculture"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nom (Francais)
                    </label>
                    <input
                      type="text"
                      value={sectorFormData.nameFr}
                      onChange={(e) =>
                        setSectorFormData((prev) => ({
                          ...prev,
                          nameFr: e.target.value,
                        }))
                      }
                      placeholder="Agriculture"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Couleur
                    </label>
                    <select
                      value={sectorFormData.color}
                      onChange={(e) =>
                        setSectorFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {sectorColors.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={sectorFormData.description}
                    onChange={(e) =>
                      setSectorFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description du secteur..."
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sectorFormData.isActive}
                      onChange={(e) =>
                        setSectorFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    />
                    Actif
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetSectorForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingSector}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingSector ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingSectorId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingSectors ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : filteredSectors.length === 0 ? (
              <div className="text-center py-12">
                <Factory className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucun secteur configure
                </h3>
                <p className="text-gray-500 mt-1">
                  Ajoutez des secteurs pour commencer
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Secteur
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {paginatedSectors.map((sector, index) => (
                      <tr key={sector.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-400">{(sectorPage - 1) * sectorPerPage + index + 1}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${sector.color || 'blue'}-500/20 rounded-lg flex items-center justify-center`}>
                              <Factory className={`w-5 h-5 text-${sector.color || 'blue'}-400`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {sector.nameFr || sector.name}
                              </p>
                              {sector.nameFr && sector.name !== sector.nameFr && (
                                <p className="text-xs text-gray-500">{sector.name}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded bg-slate-700 text-gray-300">
                            {sector.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400 line-clamp-2">
                            {sector.description || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleSectorActive(sector)}
                            className={`px-2 py-1 text-xs rounded-full ${
                              sector.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {sector.isActive ? "Actif" : "Inactif"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditSector(sector)}
                              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteSector(sector.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loadingSectors && filteredSectors.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Affichage {(sectorPage - 1) * sectorPerPage + 1} - {Math.min(sectorPage * sectorPerPage, filteredSectors.length)} sur {filteredSectors.length} secteur(s)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSectorPage((p) => Math.max(1, p - 1))}
                  disabled={sectorPage === 1}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  Precedent
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, sectorTotalPages) }, (_, i) => {
                    let pageNum;
                    if (sectorTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (sectorPage <= 3) {
                      pageNum = i + 1;
                    } else if (sectorPage >= sectorTotalPages - 2) {
                      pageNum = sectorTotalPages - 4 + i;
                    } else {
                      pageNum = sectorPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setSectorPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          sectorPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setSectorPage((p) => Math.min(sectorTotalPages, p + 1))}
                  disabled={sectorPage === sectorTotalPages}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "email" && (
        <div className="space-y-6">
          {/* Message */}
          {emailMessage && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                emailMessage.type === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {emailMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              {emailMessage.text}
            </div>
          )}

          {/* SMTP Settings */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  Configuration SMTP
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Configurez votre serveur de messagerie pour l'envoi d'emails
                </p>
              </div>
              <button
                onClick={handleSaveEmailConfig}
                disabled={savingEmail || loadingEmail}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {savingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Enregistrer
              </button>
            </div>

            {loadingEmail ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {emailConfigs.map((config) => {
                  const isPassword = config.type === "password";
                  const showPassword = showPasswords[config.key];
                  const label = config.key
                    .replace(/_/g, " ")
                    .replace(/smtp /i, "SMTP ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  return (
                    <div
                      key={config.key}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
                    >
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          {label}
                        </label>
                        <p className="text-xs text-gray-500">{config.description}</p>
                      </div>
                      <div className="md:col-span-2">
                        {config.type === "boolean" ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleEmailConfigChange(
                                  config.key,
                                  config.value === "true" ? "false" : "true"
                                )
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                config.value === "true"
                                  ? "bg-green-500"
                                  : "bg-slate-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  config.value === "true"
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className="text-sm text-gray-400">
                              {config.value === "true" ? "Active" : "Desactive"}
                            </span>
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type={
                                isPassword && !showPassword
                                  ? "password"
                                  : config.type === "number"
                                  ? "number"
                                  : "text"
                              }
                              value={config.value || ""}
                              onChange={(e) =>
                                handleEmailConfigChange(config.key, e.target.value)
                              }
                              placeholder={config.description}
                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                            {isPassword && (
                              <button
                                type="button"
                                onClick={() => togglePassword(config.key)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Test Email */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TestTube className="w-5 h-5 text-purple-400" />
                Tester la configuration
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Envoyez un email de test pour verifier que la configuration fonctionne
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">
                    Email de destination (optionnel)
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@exemple.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser votre email de session
                  </p>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTestEmail}
                    disabled={testingEmail}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {testingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    Envoyer un test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aide */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Guide de configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2">Gmail</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Serveur: smtp.gmail.com</li>
                  <li>Port: 587</li>
                  <li>Utilisez un mot de passe d'application</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Outlook / Office 365</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Serveur: smtp.office365.com</li>
                  <li>Port: 587</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Autre</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Port 587 pour STARTTLS</li>
                  <li>Port 465 pour SSL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "document-types" && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              Types de documents
            </h3>
            <p className="text-gray-500 mt-1">
              Cette fonctionnalite sera disponible prochainement
            </p>
          </div>
        </div>
      )}

      {activeTab === "general" && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-center py-8">
            <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              Parametres generaux
            </h3>
            <p className="text-gray-500 mt-1">
              Cette fonctionnalite sera disponible prochainement
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
