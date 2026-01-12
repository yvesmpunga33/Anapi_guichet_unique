"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileSearch,
  Calendar,
  DollarSign,
  Building2,
  Target,
  FileText,
  Percent,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { TenderGetById, TenderUpdate } from "@/app/services/admin/Procurement.service";

const tenderTypes = [
  { value: "OPEN", label: "Appel d'offres ouvert", description: "Ouvert à tous les soumissionnaires qualifiés" },
  { value: "RESTRICTED", label: "Appel d'offres restreint", description: "Limité aux soumissionnaires présélectionnés" },
  { value: "NEGOTIATED", label: "Gré à gré", description: "Négociation directe avec un ou plusieurs soumissionnaires" },
  { value: "DIRECT", label: "Marché direct", description: "Attribution directe sans mise en concurrence" },
  { value: "FRAMEWORK", label: "Accord-cadre", description: "Contrat-cadre pour des besoins récurrents" },
];

const categories = [
  { value: "WORKS", label: "Travaux", description: "Construction, rénovation, infrastructure" },
  { value: "GOODS", label: "Fournitures", description: "Équipements, matériels, consommables" },
  { value: "SERVICES", label: "Services", description: "Prestations de services généraux" },
  { value: "CONSULTING", label: "Consultance", description: "Études, conseils, expertise" },
];

export default function EditTenderPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [ministries, setMinistries] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    type: "OPEN",
    category: "SERVICES",
    ministryId: "",
    departmentId: "",
    estimatedBudget: "",
    currency: "USD",
    publicationDate: "",
    submissionDeadline: "",
    openingDate: "",
    evaluationStartDate: "",
    evaluationEndDate: "",
    technicalWeight: 70,
    financialWeight: 30,
    minimumTechnicalScore: 60,
    source: "NATIONAL",
    financingSource: "",
    terms: "",
    notes: "",
  });

  const [lots, setLots] = useState([]);

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  // Fetch tender data
  useEffect(() => {
    const fetchTender = async () => {
      try {
        const response = await TenderGetById(params.id);
        const data = response.data;

        if (data.success && data.data) {
          const tender = data.data;
          setFormData({
            title: tender.title || "",
            objective: tender.objective || "",
            type: tender.type || "OPEN",
            category: tender.category || "SERVICES",
            ministryId: tender.ministryId || "",
            departmentId: tender.departmentId || "",
            estimatedBudget: tender.estimatedBudget || "",
            currency: tender.currency || "USD",
            publicationDate: formatDateOnly(tender.publicationDate),
            submissionDeadline: formatDateForInput(tender.submissionDeadline),
            openingDate: formatDateForInput(tender.openingDate),
            evaluationStartDate: formatDateOnly(tender.evaluationStartDate),
            evaluationEndDate: formatDateOnly(tender.evaluationEndDate),
            technicalWeight: tender.technicalWeight || 70,
            financialWeight: tender.financialWeight || 30,
            minimumTechnicalScore: tender.minimumTechnicalScore || 60,
            source: tender.source || "NATIONAL",
            financingSource: tender.financingSource || "",
            terms: tender.terms || "",
            notes: tender.notes || "",
          });

          // Load lots if any
          if (tender.lots && tender.lots.length > 0) {
            setLots(tender.lots.map(lot => ({
              id: lot.id,
              lotNumber: lot.lotNumber,
              title: lot.title || "",
              description: lot.description || "",
              estimatedAmount: lot.estimatedAmount || "",
              quantity: lot.quantity || 1,
              unit: lot.unit || "",
            })));
          }
        } else {
          setError(data.error || "Appel d'offres non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement");
      } finally {
        setLoadingData(false);
      }
    };

    if (params.id) {
      fetchTender();
    }
  }, [params.id]);

  // Fetch ministries
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await fetch("/api/referentiels/ministries?limit=100");
        const data = await response.json();
        if (data.ministries) {
          setMinistries(data.ministries);
        } else if (data.success && data.data) {
          setMinistries(data.data);
        }
      } catch (err) {
        console.error("Error fetching ministries:", err);
      }
    };
    fetchMinistries();
  }, []);

  // Fetch departments when ministry changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.ministryId) {
        setDepartments([]);
        return;
      }
      try {
        const response = await fetch(`/api/referentiels/ministry-departments?ministryId=${formData.ministryId}`);
        const data = await response.json();
        if (data.success && data.data) {
          setDepartments(data.data);
        } else if (data.departments) {
          setDepartments(data.departments);
        } else {
          setDepartments([]);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [formData.ministryId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleWeightChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    if (field === "technicalWeight") {
      setFormData((prev) => ({
        ...prev,
        technicalWeight: numValue,
        financialWeight: 100 - numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        financialWeight: numValue,
        technicalWeight: 100 - numValue,
      }));
    }
  };

  // Lots management
  const addLot = () => {
    setLots((prev) => [
      ...prev,
      {
        id: Date.now(),
        lotNumber: (prev.length + 1).toString().padStart(2, "0"),
        title: "",
        description: "",
        estimatedAmount: "",
        quantity: 1,
        unit: "",
      },
    ]);
  };

  const updateLot = (id, field, value) => {
    setLots((prev) =>
      prev.map((lot) =>
        lot.id === id ? { ...lot, [field]: value } : lot
      )
    );
  };

  const removeLot = (id) => {
    setLots((prev) => prev.filter((lot) => lot.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title) {
        throw new Error("Le titre est obligatoire");
      }
      if (!formData.submissionDeadline) {
        throw new Error("La date limite de soumission est obligatoire");
      }

      const submitData = {
        ...formData,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
        lots: lots.map((lot) => ({
          id: lot.id,
          lotNumber: lot.lotNumber,
          title: lot.title,
          description: lot.description,
          estimatedAmount: lot.estimatedAmount ? parseFloat(lot.estimatedAmount) : null,
          quantity: lot.quantity,
          unit: lot.unit,
        })),
      };

      const response = await TenderUpdate(params.id, submitData);
      const data = response.data;

      if (data.success) {
        router.push(`/procurement/tenders/${params.id}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/procurement/tenders/${params.id}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSearch className="w-7 h-7 text-blue-600" />
              Modifier l'appel d'offres
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Modifiez les informations de cet appel d'offres
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
        {/* Basic Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Informations générales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de l'appel d'offres *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Objectif / Description *
              </label>
              <textarea
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de marché
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {tenderTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ministère / Entité
              </label>
              <select
                name="ministryId"
                value={formData.ministryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                {ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Département / Direction
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={!formData.ministryId}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Sélectionner...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Budget & Financing */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Budget et financement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget estimé
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-4 pr-16 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-600 dark:text-gray-400 text-sm focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="CDF">CDF</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source de financement
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="NATIONAL">Budget national</option>
                <option value="INTERNATIONAL">Financement international</option>
                <option value="MIXED">Mixte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bailleur / Source
              </label>
              <input
                type="text"
                name="financingSource"
                value={formData.financingSource}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dates & Deadlines */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Dates et délais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de publication
              </label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date limite de soumission *
              </label>
              <input
                type="datetime-local"
                name="submissionDeadline"
                value={formData.submissionDeadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date d'ouverture des plis
              </label>
              <input
                type="datetime-local"
                name="openingDate"
                value={formData.openingDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Début évaluation
              </label>
              <input
                type="date"
                name="evaluationStartDate"
                value={formData.evaluationStartDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fin évaluation
              </label>
              <input
                type="date"
                name="evaluationEndDate"
                value={formData.evaluationEndDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-orange-600" />
            Critères d'évaluation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pondération technique (%)
              </label>
              <input
                type="number"
                value={formData.technicalWeight}
                onChange={(e) => handleWeightChange("technicalWeight", e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pondération financière (%)
              </label>
              <input
                type="number"
                value={formData.financialWeight}
                onChange={(e) => handleWeightChange("financialWeight", e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Score technique minimum (%)
              </label>
              <input
                type="number"
                name="minimumTechnicalScore"
                value={formData.minimumTechnicalScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
              <div className="bg-blue-600 transition-all duration-300" style={{ width: `${formData.technicalWeight}%` }} />
              <div className="bg-green-600 transition-all duration-300" style={{ width: `${formData.financialWeight}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-blue-600">Technique: {formData.technicalWeight}%</span>
              <span className="text-green-600">Financière: {formData.financialWeight}%</span>
            </div>
          </div>
        </div>

        {/* Lots */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Lots
            </h2>
            <button
              type="button"
              onClick={addLot}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter un lot
            </button>
          </div>

          {lots.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucun lot. Cliquez sur "Ajouter un lot" pour diviser cet appel d'offres.
            </p>
          ) : (
            <div className="space-y-4">
              {lots.map((lot) => (
                <div key={lot.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900 dark:text-white">Lot #{lot.lotNumber}</span>
                    <button type="button" onClick={() => removeLot(lot.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Titre du lot</label>
                      <input
                        type="text"
                        value={lot.title}
                        onChange={(e) => updateLot(lot.id, "title", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Montant estimé</label>
                      <input
                        type="number"
                        value={lot.estimatedAmount}
                        onChange={(e) => updateLot(lot.id, "estimatedAmount", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Quantité</label>
                        <input
                          type="number"
                          value={lot.quantity}
                          onChange={(e) => updateLot(lot.id, "quantity", e.target.value)}
                          min="1"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Unité</label>
                        <input
                          type="text"
                          value={lot.unit}
                          onChange={(e) => updateLot(lot.id, "unit", e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-4">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                      <textarea
                        value={lot.description}
                        onChange={(e) => updateLot(lot.id, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations complémentaires
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conditions générales
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
              />
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex items-center justify-end gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <Link
            href={`/procurement/tenders/${params.id}`}
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
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
