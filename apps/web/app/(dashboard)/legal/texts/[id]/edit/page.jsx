"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Calendar,
  Tag,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import {
  LegalTextGetById,
  LegalTextUpdate,
  DocumentTypeList,
  LegalDomainList,
} from "@/app/services/admin/Legal.service";
import http from "@/app/http-common";

export default function EditLegalTextPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [domains, setDomains] = useState([]);
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [existingFile, setExistingFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    typeId: "",
    domainId: "",
    officialReference: "",
    journalOfficiel: "",
    publicationDate: "",
    effectiveDate: "",
    expirationDate: "",
    summary: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetchReferentials();
    if (params.id) {
      fetchText();
    }
  }, [params.id]);

  const fetchReferentials = async () => {
    try {
      const [typesRes, domainsRes] = await Promise.all([
        DocumentTypeList({ activeOnly: true }),
        LegalDomainList({ activeOnly: true }),
      ]);
      // API returns { success: true, data: { documentTypes/domains } }
      const typesData = typesRes.data?.data || typesRes.data;
      const domainsData = domainsRes.data?.data || domainsRes.data;
      setDocumentTypes(typesData.documentTypes || typesData.types || []);
      setDomains(domainsData.domains || []);
    } catch (error) {
      console.error("Error fetching referentials:", error);
    }
  };

  const fetchText = async () => {
    try {
      const response = await LegalTextGetById(params.id);
      // API returns { success: true, data: { juridicalText } }
      const data = response.data?.data || response.data;
      const text = data.juridicalText || data.text;

      setFormData({
        title: text.title || "",
        typeId: text.typeId || "",
        domainId: text.domainId || "",
        officialReference: text.officialReference || "",
        journalOfficiel: text.journalOfficiel || "",
        publicationDate: text.publicationDate ? text.publicationDate.split("T")[0] : "",
        effectiveDate: text.effectiveDate ? text.effectiveDate.split("T")[0] : "",
        expirationDate: text.expirationDate ? text.expirationDate.split("T")[0] : "",
        summary: text.summary || "",
        status: text.status || "DRAFT",
      });

      setKeywords(text.keywords || []);

      if (text.filePath) {
        setExistingFile({
          name: text.fileName,
          path: text.filePath,
          size: text.fileSize,
        });
      }
    } catch (error) {
      console.error("Error fetching text:", error);
      router.push("/legal/texts");
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

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter((k) => k !== keyword));
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
      const submitData = new FormData();
      submitData.append(
        "data",
        JSON.stringify({
          ...formData,
          keywords,
          removeFile: !existingFile && !file, // Supprimer le fichier existant
        })
      );
      if (file) {
        submitData.append("file", file);
      }

      await http.put(`/legal/texts/${params.id}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push(`/legal/texts/${params.id}`);
    } catch (err) {
      console.error("Error updating text:", err);
      alert(err.response?.data?.error || "Erreur lors de la mise a jour du texte");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/legal/texts/${params.id}`}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Modifier le Texte Juridique
          </h1>
          <p className="text-gray-400 mt-1">
            Mettre a jour les informations du texte
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Classification */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Classification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type de document *
              </label>
              <select
                value={formData.typeId}
                onChange={(e) => handleChange("typeId", e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectionner un type</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Domaine juridique
              </label>
              <select
                value={formData.domainId}
                onChange={(e) => handleChange("domainId", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selectionner un domaine</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
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
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                placeholder="Ex: Loi relative au code des investissements"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Reference officielle
                </label>
                <input
                  type="text"
                  value={formData.officialReference}
                  onChange={(e) =>
                    handleChange("officialReference", e.target.value)
                  }
                  placeholder="Ex: Loi n°24-001 du 15/01/2024"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Journal Officiel
                </label>
                <input
                  type="text"
                  value={formData.journalOfficiel}
                  onChange={(e) =>
                    handleChange("journalOfficiel", e.target.value)
                  }
                  placeholder="Ex: JO n°2024-05"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Dates importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date de publication
              </label>
              <input
                type="date"
                value={formData.publicationDate}
                onChange={(e) =>
                  handleChange("publicationDate", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date d'entree en vigueur
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => handleChange("effectiveDate", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date d'expiration
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) =>
                  handleChange("expirationDate", e.target.value)
                }
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Resume</h2>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={4}
            placeholder="Resume du texte juridique..."
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mots-cles */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            Mots-cles
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addKeyword())
              }
              placeholder="Ajouter un mot-cle"
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document existant */}
        {existingFile && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Document actuel
            </h2>
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <FileText className="w-10 h-10 text-blue-500" />
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
              <FileText className="w-5 h-5 text-blue-500" />
              Document PDF
            </h2>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <FileText className="w-12 h-12 text-blue-500" />
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
                    <span className="text-blue-400">
                      cliquer pour telecharger
                    </span>
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
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="DRAFT">Brouillon</option>
            <option value="PENDING_APPROVAL">En attente de validation</option>
            <option value="ACTIVE">En vigueur</option>
            <option value="MODIFIED">Modifie</option>
            <option value="ABROGATED">Abroge</option>
            <option value="ARCHIVED">Archive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href={`/legal/texts/${params.id}`}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
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
