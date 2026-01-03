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
} from "lucide-react";

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
      const response = await fetch("/api/referentiels/currencies");
      const data = await response.json();
      setCurrencies(data.currencies || []);
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
      const url = editingCurrencyId
        ? `/api/referentiels/currencies/${editingCurrencyId}`
        : "/api/referentiels/currencies";
      const method = editingCurrencyId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currencyFormData),
      });

      if (response.ok) {
        fetchCurrencies();
        resetCurrencyForm();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving currency:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleDeleteCurrency = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette devise ?")) return;
    try {
      const response = await fetch(`/api/referentiels/currencies/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCurrencies();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting currency:", error);
    }
  };

  const handleToggleCurrencyActive = async (currency) => {
    try {
      const response = await fetch(`/api/referentiels/currencies/${currency.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currency.isActive }),
      });
      if (response.ok) {
        fetchCurrencies();
      }
    } catch (error) {
      console.error("Error toggling currency:", error);
    }
  };

  // ==================== COUNTRIES ====================

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      let url = "/api/referentiels/countries";
      const params = new URLSearchParams();
      if (countrySearch) params.append("search", countrySearch);
      if (countryFilter) params.append("continent", countryFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      setCountries(data.countries || []);
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
      const url = editingCountryId
        ? `/api/referentiels/countries/${editingCountryId}`
        : "/api/referentiels/countries";
      const method = editingCountryId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(countryFormData),
      });

      if (response.ok) {
        fetchCountries();
        resetCountryForm();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving country:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSavingCountry(false);
    }
  };

  const handleDeleteCountry = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce pays ?")) return;
    try {
      const response = await fetch(`/api/referentiels/countries/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCountries();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  const handleToggleCountryActive = async (country) => {
    try {
      const response = await fetch(`/api/referentiels/countries/${country.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !country.isActive }),
      });
      if (response.ok) {
        fetchCountries();
      }
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

  const tabs = [
    { id: "currencies", label: "Devises", icon: DollarSign },
    { id: "countries", label: "Pays", icon: Globe },
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
