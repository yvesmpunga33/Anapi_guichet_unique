"use client";

import { useState, useEffect } from "react";
import {
  MapPinned,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  StarOff,
  Building,
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Factory,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { usePageTitle } from "../../../../contexts/PageTitleContext";

// Services
import {
  OpportunityList,
  OpportunityCreate,
  OpportunityUpdate,
  OpportunityDelete
} from "@/app/services/admin/Opportunity.service";
import { ReferentielProvinceList, ReferentielSectorList } from "@/app/services/admin/Referentiel.service";

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = {
    DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
    PUBLISHED: { label: "Publiee", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    CLOSED: { label: "Cloturee", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    ARCHIVED: { label: "Archivee", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  };
  const config = statusConfig[status] || statusConfig.DRAFT;
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

// Priority badge
function PriorityBadge({ priority }) {
  const config = {
    LOW: { label: "Basse", color: "bg-slate-100 text-slate-600" },
    MEDIUM: { label: "Moyenne", color: "bg-blue-100 text-blue-600" },
    HIGH: { label: "Haute", color: "bg-orange-100 text-orange-600" },
    URGENT: { label: "Urgente", color: "bg-red-100 text-red-600" },
  };
  const c = config[priority] || config.MEDIUM;
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${c.color}`}>
      {c.label}
    </span>
  );
}

// Format currency
function formatCurrency(amount) {
  if (!amount) return "-";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Modal component
function Modal({ isOpen, onClose, title, children, size = "lg" }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-xl shadow-2xl`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Form for creating/editing opportunity
function OpportunityForm({ opportunity, provinces, sectors, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    title: opportunity?.title || "",
    description: opportunity?.description || "",
    provinceId: opportunity?.provinceId || "",
    sectorId: opportunity?.sectorId || "",
    minInvestment: opportunity?.minInvestment || "",
    maxInvestment: opportunity?.maxInvestment || "",
    expectedJobs: opportunity?.expectedJobs || "",
    projectDuration: opportunity?.projectDuration || "",
    location: opportunity?.location || "",
    advantages: opportunity?.advantages || [],
    requirements: opportunity?.requirements || [],
    contactName: opportunity?.contactName || "",
    contactEmail: opportunity?.contactEmail || "",
    contactPhone: opportunity?.contactPhone || "",
    deadline: opportunity?.deadline || "",
    status: opportunity?.status || "DRAFT",
    priority: opportunity?.priority || "MEDIUM",
    isFeatured: opportunity?.isFeatured || false,
    requiredDocuments: opportunity?.requiredDocuments || [],
  });

  const [newAdvantage, setNewAdvantage] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newDocument, setNewDocument] = useState({ name: "", isRequired: true, category: "OTHER" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addAdvantage = () => {
    if (newAdvantage.trim()) {
      setFormData({ ...formData, advantages: [...formData.advantages, newAdvantage.trim()] });
      setNewAdvantage("");
    }
  };

  const removeAdvantage = (index) => {
    setFormData({ ...formData, advantages: formData.advantages.filter((_, i) => i !== index) });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement.trim()] });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData({ ...formData, requirements: formData.requirements.filter((_, i) => i !== index) });
  };

  const addDocument = () => {
    if (newDocument.name.trim()) {
      setFormData({ ...formData, requiredDocuments: [...formData.requiredDocuments, { ...newDocument }] });
      setNewDocument({ name: "", isRequired: true, category: "OTHER" });
    }
  };

  const removeDocument = (index) => {
    setFormData({ ...formData, requiredDocuments: formData.requiredDocuments.filter((_, i) => i !== index) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titre de l&apos;opportunite *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Centrale solaire de 50 MW"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Province *
          </label>
          <select
            required
            value={formData.provinceId}
            onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selectionner une province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Secteur d&apos;activite
          </label>
          <select
            value={formData.sectorId}
            onChange={(e) => setFormData({ ...formData, sectorId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selectionner un secteur</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Description detaillee du projet d'investissement..."
          />
        </div>
      </div>

      {/* Investment Details */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Details de l&apos;investissement</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Investissement minimum (USD)
            </label>
            <input
              type="number"
              min="0"
              value={formData.minInvestment}
              onChange={(e) => setFormData({ ...formData, minInvestment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Investissement maximum (USD)
            </label>
            <input
              type="number"
              min="0"
              value={formData.maxInvestment}
              onChange={(e) => setFormData({ ...formData, maxInvestment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Emplois prevus
            </label>
            <input
              type="number"
              min="0"
              value={formData.expectedJobs}
              onChange={(e) => setFormData({ ...formData, expectedJobs: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duree du projet
            </label>
            <input
              type="text"
              value={formData.projectDuration}
              onChange={(e) => setFormData({ ...formData, projectDuration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="24 mois"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Localisation precise
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Zone industrielle de Lubumbashi"
            />
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Avantages offerts</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAdvantage}
            onChange={(e) => setNewAdvantage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ajouter un avantage..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAdvantage())}
          />
          <button type="button" onClick={addAdvantage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.advantages.map((adv, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {adv}
              <button type="button" onClick={() => removeAdvantage(i)} className="hover:text-green-900">
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Exigences pour les investisseurs</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ajouter une exigence..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
          />
          <button type="button" onClick={addRequirement} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requirements.map((req, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              {req}
              <button type="button" onClick={() => removeRequirement(i)} className="hover:text-orange-900">
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Documents requis</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
          <input
            type="text"
            value={newDocument.name}
            onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
            className="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Nom du document..."
          />
          <select
            value={newDocument.category}
            onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="LEGAL">Juridique</option>
            <option value="FINANCIAL">Financier</option>
            <option value="TECHNICAL">Technique</option>
            <option value="ADMINISTRATIVE">Administratif</option>
            <option value="OTHER">Autre</option>
          </select>
          <button type="button" onClick={addDocument} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {formData.requiredDocuments.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900 dark:text-white">{doc.name}</span>
                <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">{doc.category}</span>
              </div>
              <button type="button" onClick={() => removeDocument(i)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du contact</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telephone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Status & Options */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Parametres</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publiee</option>
              <option value="CLOSED">Cloturee</option>
              <option value="ARCHIVED">Archivee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priorite</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date limite</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Mettre en avant</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {opportunity ? "Mettre a jour" : "Creer"}
        </button>
      </div>
    </form>
  );
}

export default function OpportunitiesPage() {
  const { setPageTitle } = usePageTitle();
  const [opportunities, setOpportunities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Filters
  const [search, setSearch] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setPageTitle("Opportunites par province");
  }, [setPageTitle]);

  // Fetch data
  useEffect(() => {
    fetchOpportunities();
    fetchProvinces();
    fetchSectors();
  }, [pagination.page, search, filterProvince, filterSector, filterStatus]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (search) params.search = search;
      if (filterProvince) params.provinceId = filterProvince;
      if (filterSector) params.sectorId = filterSector;
      if (filterStatus) params.status = filterStatus;

      const response = await OpportunityList(params);
      const data = response.data;

      setOpportunities(data.opportunities || []);
      setStats(data.stats || {});
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await ReferentielProvinceList({ activeOnly: true });
      setProvinces(response.data?.provinces || []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await ReferentielSectorList({ activeOnly: true });
      setSectors(response.data?.sectors || []);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const handleCreate = async (formData) => {
    try {
      setSaving(true);
      await OpportunityCreate(formData);
      setShowCreateModal(false);
      fetchOpportunities();
    } catch (error) {
      console.error("Error creating opportunity:", error);
      alert(error.response?.data?.message || "Erreur lors de la creation");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setSaving(true);
      await OpportunityUpdate(selectedOpportunity.id, formData);
      setShowEditModal(false);
      setSelectedOpportunity(null);
      fetchOpportunities();
    } catch (error) {
      console.error("Error updating opportunity:", error);
      alert(error.response?.data?.message || "Erreur lors de la mise a jour");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await OpportunityDelete(selectedOpportunity.id);
      setShowDeleteConfirm(false);
      setSelectedOpportunity(null);
      fetchOpportunities();
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const toggleFeatured = async (opp) => {
    try {
      await OpportunityUpdate(opp.id, { isFeatured: !opp.isFeatured });
      fetchOpportunities();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunites d&apos;investissement</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerez les opportunites d&apos;investissement par province
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle opportunite
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPinned className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.published || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Publiees</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draft || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Brouillons</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.closed || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cloturees</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.featured || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">En vedette</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les provinces</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les secteurs</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publiee</option>
            <option value="CLOSED">Cloturee</option>
            <option value="ARCHIVED">Archivee</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MapPinned className="w-12 h-12 mb-4 opacity-50" />
            <p>Aucune opportunite trouvee</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Opportunite</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Province</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Secteur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Investissement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {opp.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{opp.title}</p>
                          <p className="text-xs text-gray-500">{opp.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{opp.province?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Factory className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{opp.sector?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(opp.minInvestment)}
                          {opp.maxInvestment && ` - ${formatCurrency(opp.maxInvestment)}`}
                        </p>
                        {opp.expectedJobs && (
                          <p className="text-xs text-gray-500">{opp.expectedJobs} emplois</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={opp.status} />
                        <PriorityBadge priority={opp.priority} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedOpportunity(opp); setShowViewModal(true); }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => { setSelectedOpportunity(opp); setShowEditModal(true); }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => toggleFeatured(opp)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title={opp.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
                        >
                          {opp.isFeatured ? (
                            <StarOff className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Star className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => { setSelectedOpportunity(opp); setShowDeleteConfirm(true); }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} resultats)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nouvelle opportunite" size="xl">
        <OpportunityForm
          provinces={provinces}
          sectors={sectors}
          onSave={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          saving={saving}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedOpportunity(null); }} title="Modifier l'opportunite" size="xl">
        {selectedOpportunity && (
          <OpportunityForm
            opportunity={selectedOpportunity}
            provinces={provinces}
            sectors={sectors}
            onSave={handleUpdate}
            onCancel={() => { setShowEditModal(false); setSelectedOpportunity(null); }}
            saving={saving}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => { setShowViewModal(false); setSelectedOpportunity(null); }} title="Details de l'opportunite" size="lg">
        {selectedOpportunity && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedOpportunity.title}</h3>
                <p className="text-sm text-gray-500">{selectedOpportunity.reference}</p>
              </div>
              <StatusBadge status={selectedOpportunity.status} />
            </div>

            {selectedOpportunity.description && (
              <p className="text-gray-600 dark:text-gray-300">{selectedOpportunity.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{selectedOpportunity.province?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{selectedOpportunity.sector?.name || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {formatCurrency(selectedOpportunity.minInvestment)}
                  {selectedOpportunity.maxInvestment && ` - ${formatCurrency(selectedOpportunity.maxInvestment)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{selectedOpportunity.expectedJobs || 0} emplois prevus</span>
              </div>
            </div>

            {selectedOpportunity.requiredDocuments?.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Documents requis</h4>
                <div className="space-y-1">
                  {selectedOpportunity.requiredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{doc.name}</span>
                      {doc.isRequired && <span className="text-xs text-red-500">*</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setSelectedOpportunity(null); }} title="Confirmer la suppression" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Etes-vous sur de vouloir supprimer cette opportunite ?
          </p>
          <p className="text-sm text-gray-500 mb-6">{selectedOpportunity?.title}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => { setShowDeleteConfirm(false); setSelectedOpportunity(null); }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
