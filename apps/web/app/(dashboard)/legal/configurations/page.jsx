"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  FileText,
  Folder,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Search,
} from "lucide-react";
import {
  DocumentTypeList,
  DocumentTypeCreate,
  DocumentTypeUpdate,
  DocumentTypeDelete,
  LegalDomainList,
  LegalDomainCreate,
  LegalDomainUpdate,
  LegalDomainDelete,
} from "@/app/services/admin/Legal.service";

export default function LegalConfigurationsPage() {
  const [activeTab, setActiveTab] = useState("document-types");

  // Document Types state
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [savingType, setSavingType] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [typeFormData, setTypeFormData] = useState({
    code: "",
    name: "",
    description: "",
    category: "legislation",
    prefix: "",
    isActive: true,
    sortOrder: 0,
  });

  // Domains state
  const [domains, setDomains] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [savingDomain, setSavingDomain] = useState(false);
  const [editingDomainId, setEditingDomainId] = useState(null);
  const [showDomainForm, setShowDomainForm] = useState(false);
  const [domainFormData, setDomainFormData] = useState({
    code: "",
    name: "",
    description: "",
    parentId: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (activeTab === "document-types") {
      fetchDocumentTypes();
    } else if (activeTab === "domains") {
      fetchDomains();
    }
  }, [activeTab]);

  // ==================== DOCUMENT TYPES ====================

  const fetchDocumentTypes = async () => {
    setLoadingTypes(true);
    try {
      const response = await DocumentTypeList();
      setDocumentTypes(response.data.types || []);
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      setLoadingTypes(false);
    }
  };

  const resetTypeForm = () => {
    setTypeFormData({
      code: "",
      name: "",
      description: "",
      category: "legislation",
      prefix: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingTypeId(null);
    setShowTypeForm(false);
  };

  const handleEditType = (type) => {
    setTypeFormData({
      code: type.code,
      name: type.name,
      description: type.description || "",
      category: type.category || "legislation",
      prefix: type.prefix || "",
      isActive: type.isActive,
      sortOrder: type.sortOrder || 0,
    });
    setEditingTypeId(type.id);
    setShowTypeForm(true);
  };

  const handleSubmitType = async (e) => {
    e.preventDefault();
    if (!typeFormData.code || !typeFormData.name) {
      alert("Code et nom sont requis");
      return;
    }

    setSavingType(true);
    try {
      if (editingTypeId) {
        await DocumentTypeUpdate(editingTypeId, typeFormData);
      } else {
        await DocumentTypeCreate(typeFormData);
      }
      fetchDocumentTypes();
      resetTypeForm();
    } catch (error) {
      console.error("Error saving document type:", error);
      alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSavingType(false);
    }
  };

  const handleDeleteType = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce type de document ?")) return;
    try {
      await DocumentTypeDelete(id);
      fetchDocumentTypes();
    } catch (error) {
      console.error("Error deleting document type:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleTypeActive = async (type) => {
    try {
      await DocumentTypeUpdate(type.id, { isActive: !type.isActive });
      fetchDocumentTypes();
    } catch (error) {
      console.error("Error toggling type:", error);
    }
  };

  // ==================== DOMAINS ====================

  const fetchDomains = async () => {
    setLoadingDomains(true);
    try {
      const response = await LegalDomainList();
      setDomains(response.data.domains || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setLoadingDomains(false);
    }
  };

  const resetDomainForm = () => {
    setDomainFormData({
      code: "",
      name: "",
      description: "",
      parentId: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingDomainId(null);
    setShowDomainForm(false);
  };

  const handleEditDomain = (domain) => {
    setDomainFormData({
      code: domain.code,
      name: domain.name,
      description: domain.description || "",
      parentId: domain.parentId || "",
      isActive: domain.isActive,
      sortOrder: domain.sortOrder || 0,
    });
    setEditingDomainId(domain.id);
    setShowDomainForm(true);
  };

  const handleSubmitDomain = async (e) => {
    e.preventDefault();
    if (!domainFormData.code || !domainFormData.name) {
      alert("Code et nom sont requis");
      return;
    }

    setSavingDomain(true);
    try {
      if (editingDomainId) {
        await LegalDomainUpdate(editingDomainId, domainFormData);
      } else {
        await LegalDomainCreate(domainFormData);
      }
      fetchDomains();
      resetDomainForm();
    } catch (error) {
      console.error("Error saving domain:", error);
      alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSavingDomain(false);
    }
  };

  const handleDeleteDomain = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce domaine ?")) return;
    try {
      await LegalDomainDelete(id);
      fetchDomains();
    } catch (error) {
      console.error("Error deleting domain:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleDomainActive = async (domain) => {
    try {
      await LegalDomainUpdate(domain.id, { isActive: !domain.isActive });
      fetchDomains();
    } catch (error) {
      console.error("Error toggling domain:", error);
    }
  };

  const tabs = [
    { id: "document-types", label: "Types de documents", icon: FileText },
    { id: "domains", label: "Domaines juridiques", icon: Folder },
  ];

  const categories = [
    { value: "legislation", label: "Legislation" },
    { value: "regulation", label: "Reglementation" },
    { value: "jurisprudence", label: "Jurisprudence" },
    { value: "doctrine", label: "Doctrine" },
    { value: "other", label: "Autre" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" />
          Configurations - Direction Juridique
        </h1>
        <p className="text-gray-400 mt-1">
          Gestion des types de documents et domaines juridiques
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

      {/* Document Types Tab */}
      {activeTab === "document-types" && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Types de documents juridiques
            </h2>
            <button
              onClick={() => {
                resetTypeForm();
                setShowTypeForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau type
            </button>
          </div>

          {/* Form */}
          {showTypeForm && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingTypeId ? "Modifier le type" : "Nouveau type de document"}
              </h3>
              <form onSubmit={handleSubmitType} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={typeFormData.code}
                      onChange={(e) =>
                        setTypeFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="LOI"
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
                      value={typeFormData.name}
                      onChange={(e) =>
                        setTypeFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Loi"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Prefixe
                    </label>
                    <input
                      type="text"
                      value={typeFormData.prefix}
                      onChange={(e) =>
                        setTypeFormData((prev) => ({ ...prev, prefix: e.target.value }))
                      }
                      placeholder="LOI"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Categorie
                    </label>
                    <select
                      value={typeFormData.category}
                      onChange={(e) =>
                        setTypeFormData((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={typeFormData.sortOrder}
                      onChange={(e) =>
                        setTypeFormData((prev) => ({
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
                        checked={typeFormData.isActive}
                        onChange={(e) =>
                          setTypeFormData((prev) => ({
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

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={typeFormData.description}
                    onChange={(e) =>
                      setTypeFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={2}
                    placeholder="Description du type de document..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetTypeForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingType}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingType ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingTypeId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingTypes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : documentTypes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucun type de document configure
                </h3>
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
                      Categorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Prefixe
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
                  {documentTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-white">
                          {type.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{type.name}</p>
                        {type.description && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {type.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400 capitalize">
                          {type.category || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400">
                          {type.prefix || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleTypeActive(type)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            type.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {type.isActive ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditType(type)}
                            className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteType(type.id)}
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

      {/* Domains Tab */}
      {activeTab === "domains" && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Domaines juridiques
            </h2>
            <button
              onClick={() => {
                resetDomainForm();
                setShowDomainForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau domaine
            </button>
          </div>

          {/* Form */}
          {showDomainForm && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingDomainId ? "Modifier le domaine" : "Nouveau domaine juridique"}
              </h3>
              <form onSubmit={handleSubmitDomain} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={domainFormData.code}
                      onChange={(e) =>
                        setDomainFormData((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="INVEST"
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
                      value={domainFormData.name}
                      onChange={(e) =>
                        setDomainFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Investissement"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Domaine parent
                    </label>
                    <select
                      value={domainFormData.parentId}
                      onChange={(e) =>
                        setDomainFormData((prev) => ({ ...prev, parentId: e.target.value }))
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Aucun (domaine principal)</option>
                      {domains
                        .filter((d) => d.id !== editingDomainId)
                        .map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={domainFormData.sortOrder}
                      onChange={(e) =>
                        setDomainFormData((prev) => ({
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
                        checked={domainFormData.isActive}
                        onChange={(e) =>
                          setDomainFormData((prev) => ({
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

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={domainFormData.description}
                    onChange={(e) =>
                      setDomainFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={2}
                    placeholder="Description du domaine..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetDomainForm}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingDomain}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {savingDomain ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingDomainId ? "Mettre a jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {loadingDomains ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : domains.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400">
                  Aucun domaine configure
                </h3>
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
                  {domains.map((domain) => (
                    <tr key={domain.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-white">
                          {domain.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{domain.name}</p>
                        {domain.parent && (
                          <p className="text-xs text-gray-500">
                            Parent: {domain.parent.name}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400 truncate max-w-xs block">
                          {domain.description || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleDomainActive(domain)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            domain.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {domain.isActive ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditDomain(domain)}
                            className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteDomain(domain.id)}
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
    </div>
  );
}
