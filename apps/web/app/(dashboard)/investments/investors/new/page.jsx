"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Globe,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Services
import { InvestorCreate } from "@/app/services/admin/Investor.service";
import { ReferentielProvinceList, CountryList } from "@/app/services/admin/Referentiel.service";

const investorTypes = [
  { value: "company", label: "Societe", icon: Building2, description: "Entreprise ou societe commerciale" },
  { value: "individual", label: "Individuel", icon: User, description: "Personne physique" },
  { value: "organization", label: "Organisation", icon: Globe, description: "ONG, association ou fondation" },
  { value: "government", label: "Gouvernement", icon: Building2, description: "Entite gouvernementale" },
];

// Fallback provinces
const DEFAULT_PROVINCES = [
  "Kinshasa", "Kongo-Central", "Kwango", "Kwilu", "Mai-Ndombe",
  "Equateur", "Mongala", "Nord-Ubangi", "Sud-Ubangi", "Tshuapa",
  "Tshopo", "Bas-Uele", "Haut-Uele", "Ituri", "Nord-Kivu",
  "Sud-Kivu", "Maniema", "Haut-Katanga", "Haut-Lomami", "Lualaba",
  "Tanganyika", "Lomami", "Kasai", "Kasai-Central", "Kasai-Oriental", "Sankuru",
];

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

export default function NewInvestorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Dynamic data loading
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load reference data on mount
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [provincesRes, countriesRes] = await Promise.all([
          ReferentielProvinceList().catch(() => null),
          CountryList().catch(() => null),
        ]);

        // Extract provinces with multiple fallback paths
        const provincesData = provincesRes?.data?.data?.provinces
          || provincesRes?.data?.provinces
          || provincesRes?.data?.data
          || provincesRes?.data
          || [];

        if (Array.isArray(provincesData) && provincesData.length > 0) {
          // Check if data is already in {id, name} format or just strings
          const formattedProvinces = provincesData.map((p, i) =>
            typeof p === 'string' ? { id: i, name: p } : { id: p.id || i, name: p.name || p.nom || p }
          );
          setProvinces(formattedProvinces);
        } else {
          setProvinces(DEFAULT_PROVINCES.map((name, i) => ({ id: i, name })));
        }

        // Extract countries
        const countriesData = countriesRes?.data?.data?.countries
          || countriesRes?.data?.countries
          || countriesRes?.data?.data
          || countriesRes?.data
          || [];

        if (Array.isArray(countriesData) && countriesData.length > 0) {
          setCountries(countriesData);
        } else {
          // Default countries fallback
          setCountries([
            { code: "RDC", name: "RD Congo" },
            { code: "other", name: "Autre" }
          ]);
        }
      } catch (error) {
        console.error("Error loading reference data:", error);
        setProvinces(DEFAULT_PROVINCES.map((name, i) => ({ id: i, name })));
        setCountries([
          { code: "RDC", name: "RD Congo" },
          { code: "other", name: "Autre" }
        ]);
      } finally {
        setLoadingData(false);
      }
    };

    loadReferenceData();
  }, []);

  const [formData, setFormData] = useState({
    type: "company",
    name: "",
    email: "",
    phone: "",
    country: "RDC",
    province: "",
    city: "",
    address: "",
    rccm: "",
    idNat: "",
    nif: "",
    website: "",
    contactPerson: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le telephone est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await InvestorCreate(formData);
      router.push("/investments/investors");
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({ submit: error.response?.data?.message || error.message || "Erreur lors de la creation" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/investments/investors"
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              Nouvel Investisseur
            </h1>
            <p className="text-sm text-gray-500">
              Enregistrer un nouvel investisseur
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/investments/investors"
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type d'investisseur */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Type d'investisseur</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {investorTypes.map((type) => {
              const TypeIcon = type.icon;
              const isSelected = formData.type === type.value;

              return (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={isSelected}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    isSelected ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                  }`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <p className={`font-medium text-sm ${isSelected ? "text-orange-400" : "text-white"}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {type.description}
                  </p>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 absolute top-2 right-2" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Informations generales */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Informations generales</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={formData.type === "company" ? "Nom de l'entreprise" : "Nom complet"}
              required
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={formData.type === "company" ? "Ex: Congo Mining Corp" : "Ex: Jean Mukendi"}
              error={errors.name}
              className="col-span-2"
            />

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

            <InputField
              label="Site web"
              type="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://www.exemple.cd"
            />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Pays</label>
              <select
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                disabled={loadingData}
              >
                {loadingData ? (
                  <option value="" className="bg-gray-800">Chargement...</option>
                ) : (
                  <>
                    {countries.map((c) => (
                      <option key={c.code || c.id} value={c.code || c.id} className="bg-gray-800">
                        {c.name || c.nom}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Province</label>
              <select
                value={formData.province}
                onChange={(e) => handleChange("province", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500"
                disabled={loadingData}
              >
                {loadingData ? (
                  <option value="" className="bg-gray-800">Chargement...</option>
                ) : (
                  <>
                    <option value="" className="bg-gray-800">Selectionnez</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.name} className="bg-gray-800">{p.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <InputField
              label="Ville"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Ex: Kinshasa"
            />

            <InputField
              label="Adresse"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Adresse complete"
              className="col-span-2"
            />
          </div>
        </div>

        {/* Documents legaux (pour les entreprises) */}
        {formData.type === "company" && (
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Documents legaux</h2>
            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </div>
        )}

        {/* Personne de contact */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Personne de contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nom du contact"
              type="text"
              value={formData.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              placeholder="Nom complet"
            />
            <InputField
              label="Fonction"
              type="text"
              value={formData.contactPosition}
              onChange={(e) => handleChange("contactPosition", e.target.value)}
              placeholder="Ex: Directeur General"
            />
            <InputField
              label="Email du contact"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="contact@exemple.cd"
            />
            <InputField
              label="Telephone du contact"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              placeholder="+243 XXX XXX XXX"
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            placeholder="Description de l'investisseur, activites principales..."
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </form>
    </div>
  );
}
