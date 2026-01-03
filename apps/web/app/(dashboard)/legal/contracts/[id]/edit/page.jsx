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
  Eye,
  Download,
  Maximize2,
  Minimize2,
  File,
  FileImage,
} from "lucide-react";

export default function EditContractPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contractTypes, setContractTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]); // Multiple files
  const [parties, setParties] = useState([]);
  const [newParty, setNewParty] = useState({ name: "", role: "", contact: "" });
  const [existingFiles, setExistingFiles] = useState([]); // Multiple existing files
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // File being previewed

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

        // Support multiple files - convert single file to array format
        if (contract.files && contract.files.length > 0) {
          setExistingFiles(contract.files);
        } else if (contract.filePath) {
          setExistingFiles([{
            id: 'main',
            name: contract.fileName,
            path: contract.filePath,
            size: contract.fileSize,
          }]);
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
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    const validFiles = [];
    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(`Format non autorise pour ${file.name}. Utilisez PDF, DOCX, ou images.`);
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert(`Fichier ${file.name} trop volumineux. Maximum 50 MB.`);
        continue;
      }
      // Add preview URL for new files
      validFiles.push({
        file,
        id: `new-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: file.type.startsWith('image/') || file.type === 'application/pdf'
          ? URL.createObjectURL(file)
          : null,
      });
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  const removeNewFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const removeExistingFile = (fileId) => {
    setExistingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const openPreview = (file, isExisting = false) => {
    if (isExisting) {
      setPreviewFile({ ...file, isExisting: true });
    } else {
      setPreviewFile({ ...file, isExisting: false });
    }
    setShowPdfModal(true);
  };

  const getFileIcon = (fileName, fileType) => {
    if (fileType?.startsWith('image/') || fileName?.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <FileImage className="w-8 h-8 text-blue-400" />;
    }
    if (fileType === 'application/pdf' || fileName?.endsWith('.pdf')) {
      return <FileText className="w-8 h-8 text-red-400" />;
    }
    return <File className="w-8 h-8 text-gray-400" />;
  };

  const canPreview = (fileName, fileType) => {
    return fileType?.startsWith('image/') ||
           fileType === 'application/pdf' ||
           fileName?.endsWith('.pdf') ||
           fileName?.match(/\.(jpg|jpeg|png|gif)$/i);
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
      // Utiliser FormData pour supporter l'upload de fichiers multiples
      const submitFormData = new FormData();
      submitFormData.append(
        "data",
        JSON.stringify({
          ...formData,
          parties: parties.map(({ id, ...rest }) => rest),
          value: formData.value ? parseFloat(formData.value) : null,
          existingFileIds: existingFiles.map(f => f.id), // IDs des fichiers existants a garder
        })
      );

      // Add all new files
      files.forEach((fileWrapper, index) => {
        submitFormData.append(`files`, fileWrapper.file);
      });

      const response = await fetch(`/api/legal/contracts/${params.id}`, {
        method: "PUT",
        body: submitFormData,
      });

      if (response.ok) {
        // Clean up preview URLs
        files.forEach(f => {
          if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        });
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

        {/* Documents du contrat */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Documents du contrat
            <span className="text-sm text-gray-400 font-normal ml-2">
              ({existingFiles.length + files.length} fichier{existingFiles.length + files.length !== 1 ? 's' : ''})
            </span>
          </h2>

          {/* Documents existants */}
          {existingFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Documents actuels:</p>
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg group"
                  >
                    {getFileIcon(file.name, file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {canPreview(file.name, file.type) && (
                        <button
                          type="button"
                          onClick={() => openPreview(file, true)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Visualiser"
                        >
                          <Eye className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      {file.path && (
                        <a
                          href={file.path}
                          download={file.name}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Telecharger"
                        >
                          <Download className="w-4 h-4 text-blue-400" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingFile(file.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nouveaux documents a ajouter */}
          {files.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">
                Nouveaux documents a ajouter ({files.length}):
              </p>
              <div className="space-y-2">
                {files.map((fileWrapper) => (
                  <div
                    key={fileWrapper.id}
                    className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                  >
                    {getFileIcon(fileWrapper.name, fileWrapper.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{fileWrapper.name}</p>
                      <p className="text-xs text-gray-400">
                        {(fileWrapper.size / 1024 / 1024).toFixed(2)} MB
                        <span className="text-green-400 ml-2">• Nouveau</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {fileWrapper.previewUrl && canPreview(fileWrapper.name, fileWrapper.type) && (
                        <button
                          type="button"
                          onClick={() => openPreview(fileWrapper, false)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Visualiser avant enregistrement"
                        >
                          <Eye className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewFile(fileWrapper.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Retirer"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone d'upload - toujours visible */}
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-green-500/50 transition-colors">
            <label className="cursor-pointer block">
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">
                <span className="text-green-400">Cliquer pour ajouter</span> un ou plusieurs documents
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Formats: PDF, DOCX, Images (JPG, PNG) | Max: 50 MB par fichier
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
            </label>
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

      {/* Modal de visualisation PDF/Image */}
      {showPdfModal && previewFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`bg-slate-800 rounded-xl shadow-2xl flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[85vh]'}`}>
            {/* Header de la modal */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                {getFileIcon(previewFile.name, previewFile.type)}
                <div>
                  <h3 className="text-lg font-semibold text-white">{previewFile.name}</h3>
                  <p className="text-sm text-gray-400">
                    {previewFile.size ? `${(previewFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    {!previewFile.isExisting && (
                      <span className="text-green-400 ml-2">• Apercu avant enregistrement</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewFile.isExisting && previewFile.path && (
                  <a
                    href={previewFile.path}
                    download={previewFile.name}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Telecharger"
                  >
                    <Download className="w-5 h-5 text-gray-400 hover:text-white" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  title={isFullscreen ? "Reduire" : "Plein ecran"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-400 hover:text-white" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-400 hover:text-white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPdfModal(false);
                    setIsFullscreen(false);
                    setPreviewFile(null);
                  }}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Fermer"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>

            {/* Contenu - PDF ou Image */}
            <div className="flex-1 bg-slate-900 rounded-b-xl overflow-hidden flex items-center justify-center">
              {(previewFile.type?.startsWith('image/') || previewFile.name?.match(/\.(jpg|jpeg|png|gif)$/i)) ? (
                // Image preview
                <img
                  src={previewFile.isExisting ? previewFile.path : previewFile.previewUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                // PDF preview
                <iframe
                  src={`${previewFile.isExisting ? previewFile.path : previewFile.previewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full"
                  title="Visualisation du document"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
