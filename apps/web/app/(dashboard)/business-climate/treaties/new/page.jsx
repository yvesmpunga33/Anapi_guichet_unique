"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  FileText,
  MapPin,
  Building2,
  Users,
  Plus,
  X,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";

const treatyTypeOptions = [
  { value: "BIT", label: "Traité bilatéral d'investissement (BIT)" },
  { value: "FTA", label: "Accord de libre-échange (FTA)" },
  { value: "DTA", label: "Convention fiscale (DTA)" },
  { value: "INVESTMENT_PROTECTION", label: "Protection des investissements" },
  { value: "ECONOMIC_PARTNERSHIP", label: "Partenariat économique" },
  { value: "TRADE_AGREEMENT", label: "Accord commercial" },
  { value: "MULTILATERAL", label: "Accord multilatéral" },
  { value: "REGIONAL", label: "Accord régional" },
  { value: "SECTOR_SPECIFIC", label: "Accord sectoriel" },
  { value: "OTHER", label: "Autre" },
];

const statusOptions = [
  { value: "NEGOTIATING", label: "En négociation" },
  { value: "SIGNED", label: "Signé" },
  { value: "RATIFICATION_PENDING", label: "Ratification en cours" },
  { value: "RATIFIED", label: "Ratifié" },
  { value: "IN_FORCE", label: "En vigueur" },
  { value: "SUSPENDED", label: "Suspendu" },
  { value: "TERMINATED", label: "Terminé" },
  { value: "EXPIRED", label: "Expiré" },
  { value: "RENEGOTIATING", label: "En renégociation" },
];

const regionalOrganizations = [
  "SADC",
  "COMESA",
  "CEEAC",
  "UA",
  "ZLECAF",
  "OHADA",
  "CEMAC",
  "CEDEAO",
];

export default function NewTreatyPage() {
  const router = useRouter();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [newProvision, setNewProvision] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newSector, setNewSector] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    shortTitle: "",
    description: "",
    treatyType: "BIT",
    status: "NEGOTIATING",
    partnerCountries: [],
    regionalOrganization: "",
    negotiationStartDate: "",
    signedDate: "",
    ratifiedDate: "",
    entryIntoForceDate: "",
    expiryDate: "",
    duration: "",
    autoRenewal: false,
    renewalPeriod: "",
    keyProvisions: [],
    investorBenefits: [],
    coveredSectors: [],
    exclusions: [],
    disputeResolution: "",
    treatyTextUrl: "",
    notes: "",
    responsibleId: "",
  });

  useEffect(() => {
    document.title = "Nouveau Traité | ANAPI";
    setPageTitle("Nouveau Traité International");
    fetchUsers();
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users?limit=100");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addToArray = (field, value, setter) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const removeFromArray = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      Swal.fire({
        icon: "warning",
        title: "Champ requis",
        text: "Le titre du traité est obligatoire",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/business-climate/treaties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
          renewalPeriod: formData.renewalPeriod ? parseInt(formData.renewalPeriod) : null,
          negotiationStartDate: formData.negotiationStartDate || null,
          signedDate: formData.signedDate || null,
          ratifiedDate: formData.ratifiedDate || null,
          entryIntoForceDate: formData.entryIntoForceDate || null,
          expiryDate: formData.expiryDate || null,
          responsibleId: formData.responsibleId || null,
        }),
      });

      if (response.ok) {
        const treaty = await response.json();
        await Swal.fire({
          icon: "success",
          title: "Traité créé",
          text: `Le traité ${treaty.reference} a été créé avec succès`,
          confirmButtonColor: "#2563eb",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/business-climate/treaties");
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error || "Erreur lors de la création",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Error creating treaty:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la création du traité",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/business-climate/treaties"
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Globe className="w-7 h-7 text-blue-600" />
            Nouveau Traité International
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Enregistrer un accord bilatéral ou multilatéral
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Informations générales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du traité <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Accord de promotion et de protection des investissements"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre abrégé
              </label>
              <input
                type="text"
                name="shortTitle"
                value={formData.shortTitle}
                onChange={handleChange}
                placeholder="Ex: APPI RDC-France"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de traité
              </label>
              <select
                name="treatyType"
                value={formData.treatyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {treatyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organisation régionale
              </label>
              <select
                name="regionalOrganization"
                value={formData.regionalOrganization}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">- Aucune -</option>
                {regionalOrganizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Résumé du traité et de ses objectifs..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Partner Countries */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Pays partenaires
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="Ajouter un pays (ex: France, Belgique...)"
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("partnerCountries", newCountry, setNewCountry);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addToArray("partnerCountries", newCountry, setNewCountry)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.partnerCountries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.partnerCountries.map((country, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {country}
                  <button
                    type="button"
                    onClick={() => removeFromArray("partnerCountries", index)}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Dates importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Début négociations
              </label>
              <input
                type="date"
                name="negotiationStartDate"
                value={formData.negotiationStartDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de signature
              </label>
              <input
                type="date"
                name="signedDate"
                value={formData.signedDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de ratification
              </label>
              <input
                type="date"
                name="ratifiedDate"
                value={formData.ratifiedDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entrée en vigueur
              </label>
              <input
                type="date"
                name="entryIntoForceDate"
                value={formData.entryIntoForceDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date d'expiration
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Durée (années)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                placeholder="Ex: 10"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="autoRenewal"
                checked={formData.autoRenewal}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Renouvellement automatique
              </span>
            </label>
            {formData.autoRenewal && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Période:</span>
                <input
                  type="number"
                  name="renewalPeriod"
                  value={formData.renewalPeriod}
                  onChange={handleChange}
                  min="1"
                  placeholder="5"
                  className="w-20 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">ans</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Provisions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Dispositions clés
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newProvision}
              onChange={(e) => setNewProvision(e.target.value)}
              placeholder="Ajouter une disposition clé..."
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("keyProvisions", newProvision, setNewProvision);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addToArray("keyProvisions", newProvision, setNewProvision)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.keyProvisions.length > 0 && (
            <ul className="space-y-2">
              {formData.keyProvisions.map((provision, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">{provision}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray("keyProvisions", index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Investor Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Avantages pour les investisseurs
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Ajouter un avantage..."
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("investorBenefits", newBenefit, setNewBenefit);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addToArray("investorBenefits", newBenefit, setNewBenefit)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.investorBenefits.length > 0 && (
            <ul className="space-y-2">
              {formData.investorBenefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray("investorBenefits", index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Covered Sectors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Secteurs couverts
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
              placeholder="Ajouter un secteur (ex: Mines, Agriculture...)"
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("coveredSectors", newSector, setNewSector);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addToArray("coveredSectors", newSector, setNewSector)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.coveredSectors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.coveredSectors.map((sector, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {sector}
                  <button
                    type="button"
                    onClick={() => removeFromArray("coveredSectors", index)}
                    className="hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations complémentaires
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mécanisme de règlement des différends
              </label>
              <textarea
                name="disputeResolution"
                value={formData.disputeResolution}
                onChange={handleChange}
                rows={2}
                placeholder="Ex: Arbitrage CIRDI, médiation, etc."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL du texte du traité
              </label>
              <input
                type="url"
                name="treatyTextUrl"
                value={formData.treatyTextUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Responsable du suivi
              </label>
              <select
                name="responsibleId"
                value={formData.responsibleId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">- Sélectionner -</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Notes ou commentaires supplémentaires..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/business-climate/treaties"
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
