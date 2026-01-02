"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditContractPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contractTypes, setContractTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [file, setFile] = useState(null);
  const [parties, setParties] = useState([]);
  const [newParty, setNewParty] = useState({ name: "", role: "", contact: "" });
  const [existingFile, setExistingFile] = useState(null);

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
    if (params.id) {
      fetchContract();
    }
  }, [params.id]);

  const fetchReferentials = async () => {
    try {
      const [typesRes, currenciesRes] = await Promise.all([
        fetch("/api/legal/contract-types?activeOnly=true"),
        fetch("/api/referentiels/currencies?activeOnly=true"),
      ]);
      const typesData = await typesRes.json();
      const currenciesData = await currenciesRes.json();
      setContractTypes(typesData.types || []);
      setCurrencies(currenciesData.currencies || []);
    } catch (error) {
      console.error("Error fetching referentials:", error);
    }
  };

  const fetchContract = async () => {
    try {
      const response = await fetch(`/api/legal/contracts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const contract = data.contract;

        setFormData({
          title: contract.title || "",
          typeId: contract.typeId || "",
          reference: contract.reference || "",
          startDate: contract.startDate ? contract.startDate.split("T")[0] : "",
          endDate: contract.endDate ? contract.endDate.split("T")[0] : "",
          value: contract.value || "",
          currency: contract.currency || "USD",
          description: contract.description || "",
          status: contract.status || "DRAFT",
          alertEnabled: contract.alertEnabled !== false,
          alertDays: contract.alertDays || [30, 60, 90],
          renewalType: contract.renewalType || "MANUAL",
        });

        setParties(contract.parties || []);

        if (contract.filePath) {
          setExistingFile({
            name: contract.fileName,
            path: contract.filePath,
            size: contract.fileSize,
          });
        }
      } else {
        router.push("/legal/contracts");
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
    } finally {
      setLoading(false);
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
      setExistingFile(null);
    }
  };

  const addParty = () => {
    if (newParty.name.trim()) {
      setParties([...parties, { ...newParty, id: Date.now() }]);
      setNewParty({ name: "", role: "", contact: "" });
    }
  };

  const removeParty = (index) => {
    setParties(parties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.typeId) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setSaving(true);
    try {
      // Utiliser FormData pour supporter l'upload de fichier
      const submitFormData = new FormData();
      submitFormData.append(
        "data",
        JSON.stringify({
          ...formData,
          parties: parties.map(({ id, ...rest }) => rest),
          value: formData.value ? parseFloat(formData.value) : null,
          removeFile: !existingFile && !file, // Supprimer le fichier existant
        })
      );
      if (file) {
        submitFormData.append("file", file);
      }

      const response = await fetch(`/api/legal/contracts/${params.id}`, {
        method: "PUT",
        body: submitFormData,
      });

      if (response.ok) {
        router.push(`/legal/contracts/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la mise a jour");
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      alert("Erreur lors de la mise a jour du contrat");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/legal/contracts/${params.id}`}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileSignature className="w-8 h-8 text-green-500" />
            Modifier le Contrat
          </h1>
          <p className="text-gray-400 mt-1">
            Mettre a jour les informations du contrat
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

          {parties.length > 0 && (
            <div className="space-y-2 mb-4">
              {parties.map((party, index) => (
                <div
                  key={index}
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
                    onClick={() => removeParty(index)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

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

        {/* Document existant */}
        {existingFile && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              Document actuel
            </h2>
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <FileText className="w-10 h-10 text-green-500" />
              <div className="flex-1">
                <p className="text-white font-medium">{existingFile.name}</p>
                <p className="text-sm text-gray-400">
                  {existingFile.size
                    ? `${(existingFile.size / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExistingFile(null)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {/* Nouveau document */}
        {!existingFile && (
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
        )}

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
            <option value="SUSPENDED">Suspendu</option>
            <option value="EXPIRED">Expire</option>
            <option value="TERMINATED">Resilie</option>
            <option value="RENEWED">Renouvele</option>
            <option value="ARCHIVED">Archive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href={`/legal/contracts/${params.id}`}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {saving ? (
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
