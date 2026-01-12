"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
  Clock,
  Building2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { ActeAdministratifGetById, ActeAdministratifUpdate } from "@/app/services/admin/Config.service";
import { ReferentielMinistryList, ReferentielSectorList } from "@/app/services/admin/Referentiel.service";

const categories = [
  { value: "LICENCE", label: "Licence" },
  { value: "PERMIS", label: "Permis" },
  { value: "AUTORISATION", label: "Autorisation" },
  { value: "AGREMENT", label: "Agrément" },
  { value: "CERTIFICAT", label: "Certificat" },
  { value: "ATTESTATION", label: "Attestation" },
];

const pieceCategories = [
  { value: "IDENTITE", label: "Pièces d'identité" },
  { value: "JURIDIQUE", label: "Documents juridiques" },
  { value: "FISCAL", label: "Documents fiscaux" },
  { value: "TECHNIQUE", label: "Documents techniques" },
  { value: "FINANCIER", label: "Documents financiers" },
  { value: "AUTRE", label: "Autres documents" },
];

const workflowTypes = [
  { value: "AGREMENT", label: "Agrément" },
  { value: "DOSSIER", label: "Dossier standard" },
  { value: "INVESTMENT", label: "Investissement" },
];

export default function EditActePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ministries, setMinistries] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [expandedSections, setExpandedSections] = useState(["general", "delais", "pieces"]);

  const [formData, setFormData] = useState({
    id: "",
    code: "",
    name: "",
    shortName: "",
    description: "",
    category: "AUTORISATION",
    ministryId: "",
    sectorId: "",
    legalBasis: "",
    legalDelayDays: 30,
    warningDelayDays: 5,
    cost: 0,
    costCDF: "",
    currency: "USD",
    validityMonths: "",
    isRenewable: false,
    renewalDelayDays: "",
    workflowType: "DOSSIER",
    instructions: "",
    prerequisites: "",
    isActive: true,
    piecesRequises: [],
  });

  useEffect(() => {
    fetchActe();
    fetchMinistries();
    fetchSectors();
  }, [params.id]);

  const fetchActe = async () => {
    try {
      const response = await ActeAdministratifGetById(params.id);
      if (response.data?.acte) {
        const acte = response.data.acte;
        setFormData({
          id: acte.id,
          code: acte.code || "",
          name: acte.name || "",
          shortName: acte.shortName || "",
          description: acte.description || "",
          category: acte.category || "AUTORISATION",
          ministryId: acte.ministryId || "",
          sectorId: acte.sectorId || "",
          legalBasis: acte.legalBasis || "",
          legalDelayDays: acte.legalDelayDays || 30,
          warningDelayDays: acte.warningDelayDays || 5,
          cost: acte.cost || 0,
          costCDF: acte.costCDF || "",
          currency: acte.currency || "USD",
          validityMonths: acte.validityMonths || "",
          isRenewable: acte.isRenewable || false,
          renewalDelayDays: acte.renewalDelayDays || "",
          workflowType: acte.workflowType || "DOSSIER",
          instructions: acte.instructions || "",
          prerequisites: acte.prerequisites || "",
          isActive: acte.isActive !== false,
          piecesRequises: (acte.piecesRequises || []).map((p) => ({
            id: p.id,
            name: p.name || "",
            description: p.description || "",
            category: p.category || "AUTRE",
            isRequired: p.isRequired !== false,
            acceptedFormats: p.acceptedFormats || "PDF,JPG,PNG",
            maxSizeMB: p.maxSizeMB || 10,
            validityMonths: p.validityMonths || "",
            instructions: p.instructions || "",
            orderIndex: p.orderIndex,
          })),
        });
      } else {
        router.push("/configuration/actes-administratifs");
      }
    } catch (error) {
      console.error("Error fetching acte:", error);
      router.push("/configuration/actes-administratifs");
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistries = async () => {
    try {
      const response = await ReferentielMinistryList({ isActive: true });
      setMinistries(response.data?.ministries || response.data?.data || []);
    } catch (error) {
      console.error("Error fetching ministries:", error);
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await ReferentielSectorList({ isActive: true });
      setSectors(response.data?.sectors || response.data?.data || []);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addPiece = () => {
    setFormData((prev) => ({
      ...prev,
      piecesRequises: [
        ...prev.piecesRequises,
        {
          tempId: Date.now(),
          name: "",
          description: "",
          category: "AUTRE",
          isRequired: true,
          acceptedFormats: "PDF,JPG,PNG",
          maxSizeMB: 10,
          validityMonths: "",
          instructions: "",
        },
      ],
    }));
  };

  const updatePiece = (index, field, value) => {
    setFormData((prev) => {
      const pieces = [...prev.piecesRequises];
      pieces[index] = { ...pieces[index], [field]: value };
      return { ...prev, piecesRequises: pieces };
    });
  };

  const removePiece = (index) => {
    setFormData((prev) => ({
      ...prev,
      piecesRequises: prev.piecesRequises.filter((_, i) => i !== index),
    }));
  };

  const movePiece = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.piecesRequises.length) return;

    setFormData((prev) => {
      const pieces = [...prev.piecesRequises];
      [pieces[index], pieces[newIndex]] = [pieces[newIndex], pieces[index]];
      return { ...prev, piecesRequises: pieces };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const dataToSend = {
        ...formData,
        cost: parseFloat(formData.cost) || 0,
        costCDF: formData.costCDF ? parseFloat(formData.costCDF) : null,
        legalDelayDays: parseInt(formData.legalDelayDays) || 30,
        warningDelayDays: parseInt(formData.warningDelayDays) || 5,
        validityMonths: formData.validityMonths ? parseInt(formData.validityMonths) : null,
        renewalDelayDays: formData.renewalDelayDays ? parseInt(formData.renewalDelayDays) : null,
        ministryId: formData.ministryId || null,
        sectorId: formData.sectorId || null,
        piecesRequises: formData.piecesRequises.map((p, i) => ({
          ...p,
          orderIndex: i + 1,
          maxSizeMB: parseInt(p.maxSizeMB) || 10,
          validityMonths: p.validityMonths ? parseInt(p.validityMonths) : null,
        })),
      };

      const response = await ActeAdministratifUpdate(params.id, dataToSend);

      if (response.data?.error) {
        throw new Error(response.data.error || "Erreur lors de la mise à jour");
      }

      router.push(`/configuration/actes-administratifs/${params.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const SectionHeader = ({ section, title, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
      </div>
      {expandedSections.includes(section) ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/configuration/actes-administratifs/${params.id}`}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier l'Acte</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formData.code} - {formData.name}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informations générales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader section="general" title="Informations générales" icon={FileText} />
          {expandedSections.includes("general") && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom abrégé</label>
                <input
                  type="text"
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ministère responsable</label>
                  <select
                    name="ministryId"
                    value={formData.ministryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    {ministries.map((m) => (
                      <option key={m.id} value={m.id}>{m.shortName || m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secteur d'activité</label>
                  <select
                    name="sectorId"
                    value={formData.sectorId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Tous secteurs</option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base légale</label>
                <textarea
                  name="legalBasis"
                  value={formData.legalBasis}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de workflow</label>
                <select
                  name="workflowType"
                  value={formData.workflowType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {workflowTypes.map((w) => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Délais et coûts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader section="delais" title="Délais et coûts" icon={Clock} />
          {expandedSections.includes("delais") && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Délai légal (jours) *</label>
                  <input
                    type="number"
                    name="legalDelayDays"
                    value={formData.legalDelayDays}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Délai d'alerte (jours) *</label>
                  <input
                    type="number"
                    name="warningDelayDays"
                    value={formData.warningDelayDays}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validité (mois)</label>
                  <input
                    type="number"
                    name="validityMonths"
                    value={formData.validityMonths}
                    onChange={handleChange}
                    min="1"
                    placeholder="Illimité"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coût *</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Devise</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coût en CDF</label>
                  <input
                    type="number"
                    name="costCDF"
                    value={formData.costCDF}
                    onChange={handleChange}
                    min="0"
                    placeholder="Optionnel"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isRenewable"
                    checked={formData.isRenewable}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Renouvelable</span>
                </label>
                {formData.isRenewable && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Délai de renouvellement:</label>
                    <input
                      type="number"
                      name="renewalDelayDays"
                      value={formData.renewalDelayDays}
                      onChange={handleChange}
                      min="1"
                      placeholder="jours"
                      className="w-24 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Pièces requises */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader section="pieces" title="Pièces requises" icon={FileCheck} />
          {expandedSections.includes("pieces") && (
            <div className="p-6 space-y-4">
              {formData.piecesRequises.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune pièce requise</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.piecesRequises.map((piece, index) => (
                    <div
                      key={piece.id || piece.tempId || index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => movePiece(index, -1)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-gray-500 text-center">{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => movePiece(index, 1)}
                            disabled={index === formData.piecesRequises.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={piece.name}
                              onChange={(e) => updatePiece(index, "name", e.target.value)}
                              placeholder="Nom du document *"
                              required
                              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <select
                              value={piece.category}
                              onChange={(e) => updatePiece(index, "category", e.target.value)}
                              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              {pieceCategories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            value={piece.description || ""}
                            onChange={(e) => updatePiece(index, "description", e.target.value)}
                            placeholder="Description (optionnel)"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={piece.isRequired}
                                onChange={(e) => updatePiece(index, "isRequired", e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Obligatoire</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-500">Formats:</label>
                              <input
                                type="text"
                                value={piece.acceptedFormats || ""}
                                onChange={(e) => updatePiece(index, "acceptedFormats", e.target.value)}
                                className="w-32 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-500">Max:</label>
                              <input
                                type="number"
                                value={piece.maxSizeMB || ""}
                                onChange={(e) => updatePiece(index, "maxSizeMB", e.target.value)}
                                className="w-16 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <span className="text-sm text-gray-500">MB</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePiece(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={addPiece}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter une pièce requise
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <SectionHeader section="instructions" title="Instructions" icon={Building2} />
          {expandedSections.includes("instructions") && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions pour le demandeur</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prérequis ou conditions</label>
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Actif</span>
              </label>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href={`/configuration/actes-administratifs/${params.id}`}
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
