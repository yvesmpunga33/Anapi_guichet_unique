"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSignature,
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import { ContractTypeList, ContractCreateWithFormData } from "@/app/services/admin/Legal.service";
import { CurrencyList } from "@/app/services/admin/Referentiel.service";

export default function NewContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contractTypes, setContractTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [file, setFile] = useState(null);
  const [parties, setParties] = useState([]);
  const [newParty, setNewParty] = useState({ name: "", role: "", contact: "" });

  const [formData, setFormData] = useState({
    title: "",
    typeId: "",
    reference: "",
    startDate: "",
    endDate: "",
    value: "",
    currency: "USD",
    description: "",
    status: "DRAFT",
    alertEnabled: true,
    alertDays: [30, 60, 90],
    renewalType: "MANUAL",
  });

  useEffect(() => {
    fetchReferentials();
  }, []);

  const fetchReferentials = async () => {
    try {
      const [typesRes, currenciesRes] = await Promise.all([
        ContractTypeList({ activeOnly: true }),
        CurrencyList({ activeOnly: true }),
      ]);
      // API returns { success: true, data: { contractTypes/currencies } }
      const typesData = typesRes.data?.data || typesRes.data;
      const currenciesData = currenciesRes.data?.data || currenciesRes.data;
      setContractTypes(typesData.contractTypes || typesData.types || []);
      setCurrencies(currenciesData.currencies || []);
    } catch (err) {
      console.error("Error fetching referentials:", err.response?.data?.message || err.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Format non autorise. Utilisez PDF ou DOCX.");
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("Fichier trop volumineux. Maximum 50 MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const addParty = () => {
    if (newParty.name.trim()) {
      setParties([...parties, { ...newParty, id: Date.now() }]);
      setNewParty({ name: "", role: "", contact: "" });
    }
  };

  const removeParty = (id) => {
    setParties(parties.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.typeId) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append(
        "data",
        JSON.stringify({
          ...formData,
          parties: parties.map(({ id, ...rest }) => rest),
          value: formData.value ? parseFloat(formData.value) : null,
        })
      );
      if (file) {
        submitData.append("file", file);
      }

      const response = await ContractCreateWithFormData(submitData);
      router.push(`/legal/contracts/${response.data.contract.id}`);
    } catch (err) {
      console.error("Error creating contract:", err);
      alert(err.response?.data?.error || "Erreur lors de la creation du contrat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/legal/contracts"
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileSignature className="w-8 h-8 text-green-500" />
            Nouveau Contrat
          </h1>
          <p className="text-gray-400 mt-1">
            Creer un nouveau contrat ou convention
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type et Reference */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Classification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type de contrat *
              </label>
              <select
                value={formData.typeId}
                onChange={(e) => handleChange("typeId", e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selectionner un type</option>
                {contractTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reference interne
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleChange("reference", e.target.value)}
                placeholder="Ex: CTR-2024-001"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Informations generales */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Informations generales
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Titre du contrat *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                placeholder="Ex: Contrat de prestation de services informatiques"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                placeholder="Description du contrat..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Parties au contrat
          </h2>

          {/* Liste des parties */}
          {parties.length > 0 && (
            <div className="space-y-2 mb-4">
              {parties.map((party) => (
                <div
                  key={party.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {party.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {party.role}
                      {party.contact && ` - ${party.contact}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeParty(party.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter une partie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newParty.name}
              onChange={(e) =>
                setNewParty((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nom de la partie"
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              value={newParty.role}
              onChange={(e) =>
                setNewParty((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="Role (ex: Prestataire)"
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newParty.contact}
                onChange={(e) =>
                  setNewParty((prev) => ({ ...prev, contact: e.target.value }))
                }
                placeholder="Contact"
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={addParty}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Duree du contrat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date de debut
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Valeur financiere */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Valeur financiere
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Montant
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Devise
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              >
                {currencies.map((curr) => (
                  <option key={curr.id} value={curr.code}>
                    {curr.nameFr} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alertes et renouvellement */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Alertes et renouvellement
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="alertEnabled"
                checked={formData.alertEnabled}
                onChange={(e) =>
                  handleChange("alertEnabled", e.target.checked)
                }
                className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
              />
              <label htmlFor="alertEnabled" className="text-sm text-gray-400">
                Activer les alertes d'expiration
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type de renouvellement
              </label>
              <select
                value={formData.renewalType}
                onChange={(e) => handleChange("renewalType", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="MANUAL">Manuel</option>
                <option value="AUTO">Automatique</option>
                <option value="TACIT">Tacite reconduction</option>
                <option value="NONE">Sans renouvellement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Document du contrat
          </h2>
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            {file ? (
              <div className="flex items-center justify-center gap-4">
                <FileText className="w-12 h-12 text-green-500" />
                <div className="text-left">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  Glisser un fichier ou{" "}
                  <span className="text-green-400">cliquer pour telecharger</span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Formats: PDF, DOCX | Max: 50 MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Statut */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Statut</h2>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
          >
            <option value="DRAFT">Brouillon</option>
            <option value="PENDING_SIGNATURE">En attente de signature</option>
            <option value="ACTIVE">Actif</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/legal/contracts"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
