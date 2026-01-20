"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  FileText,
  Briefcase,
  Users,
  History,
  AlertCircle,
  Loader2,
  RefreshCw,
  Factory,
  ArrowUpRight,
  Printer,
  Upload,
  Download,
  Eye,
  File,
  Image,
  FileSpreadsheet,
  Target,
  AlertTriangle,
  BarChart3,
  Plus,
  Flag,
  Shield,
  Zap,
  Leaf,
  HeartHandshake,
} from "lucide-react";

// Services
import { ProjectGetById, ProjectUpdate, ProjectDelete } from "@/app/services/admin/Project.service";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500", icon: Clock },
  SUBMITTED: { label: "Soumis", color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-500", icon: Clock },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-500", icon: AlertCircle },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700", bgColor: "bg-green-500", icon: CheckCircle2 },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700", bgColor: "bg-red-500", icon: XCircle },
  IN_PROGRESS: { label: "En cours", color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-500", icon: TrendingUp },
  COMPLETED: { label: "Termine", color: "bg-emerald-100 text-emerald-700", bgColor: "bg-emerald-500", icon: CheckCircle2 },
  CANCELLED: { label: "Annule", color: "bg-gray-100 text-gray-700", bgColor: "bg-gray-500", icon: XCircle },
};

const sectorIcons = {
  "Mines": Factory,
  "Agriculture": TrendingUp,
  "Technologies": Building2,
  "Tourisme": MapPin,
  "Industrie": Factory,
  "Services": Briefcase,
  "Energie": TrendingUp,
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] = useState("other");
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Milestones state
  const [milestones, setMilestones] = useState([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    name: "", description: "", dueDate: "", status: "PENDING", progress: "",
    plannedBudget: "", actualBudget: "", deliverables: "", priority: "MEDIUM"
  });

  // Risks state
  const [risks, setRisks] = useState([]);
  const [loadingRisks, setLoadingRisks] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [riskForm, setRiskForm] = useState({
    title: "", description: "", category: "OPERATIONAL", probability: "MEDIUM",
    impact: "MEDIUM", status: "IDENTIFIED", mitigationStrategy: "", contingencyPlan: ""
  });

  // Impacts state
  const [impacts, setImpacts] = useState([]);
  const [loadingImpacts, setLoadingImpacts] = useState(false);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [impactForm, setImpactForm] = useState({
    reportDate: new Date().toISOString().split('T')[0], directJobs: "", indirectJobs: "",
    localRevenue: "", taxContribution: "", exportValue: "", localPurchases: "",
    trainingHours: "", environmentalScore: "", socialScore: "", notes: ""
  });

  // Check if edit mode is requested via URL parameter
  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  // Fetch project data
  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ProjectGetById(params.id);
      // API returns { success: true, data: { investment: {...} } }
      const data = response.data?.data?.investment || response.data?.investment || response.data;

      setProject(data);
      setEditedProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
      if (err.response?.status === 404) {
        setError("Projet non trouve");
      } else {
        setError(err.response?.data?.message || err.message || "Erreur lors du chargement du projet");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const formatAmount = (amount, currency = "USD") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await ProjectUpdate(params.id, editedProject);
      const updatedProject = response.data?.data?.investment || response.data?.investment || response.data;

      setProject(updatedProject);
      setEditedProject(updatedProject);
      setIsEditing(false);

      // Remove edit param from URL
      router.replace(`/investments/projects/${params.id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProject(project);
    setIsEditing(false);
    // Remove edit param from URL
    router.replace(`/investments/projects/${params.id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await ProjectDelete(params.id);
      router.push("/investments/projects");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Erreur lors de la suppression");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const response = await fetch(`/api/investments/projects/${params.id}/documents`);
      if (response.ok) {
        const data = await response.json();
        // API returns { success: true, data: { documents: [...] } }
        const docs = data.data?.documents || data.documents || [];
        setDocuments(docs);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Load documents when tab changes to documents
  useEffect(() => {
    if (activeTab === "documents" && params.id) {
      fetchDocuments();
    }
  }, [activeTab, params.id]);

  // Fetch project history
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await fetch(`/api/investments/projects/${params.id}/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load history when tab changes to history
  useEffect(() => {
    if (activeTab === "history" && params.id) {
      fetchHistory();
    }
  }, [activeTab, params.id]);

  // ========== MILESTONES ==========
  const fetchMilestones = async () => {
    try {
      setLoadingMilestones(true);
      const response = await fetch(`/api/investments/projects/${params.id}/milestones`);
      if (response.ok) {
        const data = await response.json();
        setMilestones(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching milestones:", err);
    } finally {
      setLoadingMilestones(false);
    }
  };

  useEffect(() => {
    if (activeTab === "milestones" && params.id) {
      fetchMilestones();
    }
  }, [activeTab, params.id]);

  const handleSaveMilestone = async () => {
    try {
      const url = editingMilestone
        ? `/api/investments/projects/${params.id}/milestones?id=${editingMilestone.id}`
        : `/api/investments/projects/${params.id}/milestones`;
      const method = editingMilestone ? "PUT" : "POST";

      // Mapper les champs du formulaire vers l'API
      const payload = {
        name: milestoneForm.name,
        description: milestoneForm.description,
        plannedEndDate: milestoneForm.dueDate,
        status: milestoneForm.status,
        progress: milestoneForm.progress,
        budget: milestoneForm.plannedBudget,
        actualCost: milestoneForm.actualBudget,
        deliverables: milestoneForm.deliverables ? [milestoneForm.deliverables] : [],
        priority: milestoneForm.priority,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur");
      }

      await fetchMilestones();
      setShowMilestoneModal(false);
      setEditingMilestone(null);
      setMilestoneForm({
        name: "", description: "", dueDate: "", status: "PENDING", progress: 0,
        plannedBudget: "", actualBudget: "", deliverables: "", priority: "MEDIUM"
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (!confirm("Supprimer ce jalon ?")) return;
    try {
      const response = await fetch(`/api/investments/projects/${params.id}/milestones?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMilestones(milestones.filter(m => m.id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ========== RISKS ==========
  const fetchRisks = async () => {
    try {
      setLoadingRisks(true);
      const response = await fetch(`/api/investments/projects/${params.id}/risks`);
      if (response.ok) {
        const data = await response.json();
        setRisks(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching risks:", err);
    } finally {
      setLoadingRisks(false);
    }
  };

  useEffect(() => {
    if (activeTab === "risks" && params.id) {
      fetchRisks();
    }
  }, [activeTab, params.id]);

  const handleSaveRisk = async () => {
    try {
      const url = editingRisk
        ? `/api/investments/projects/${params.id}/risks?id=${editingRisk.id}`
        : `/api/investments/projects/${params.id}/risks`;
      const method = editingRisk ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(riskForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur");
      }

      await fetchRisks();
      setShowRiskModal(false);
      setEditingRisk(null);
      setRiskForm({
        title: "", description: "", category: "OPERATIONAL", probability: "MEDIUM",
        impact: "MEDIUM", status: "IDENTIFIED", mitigationStrategy: "", contingencyPlan: ""
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteRisk = async (id) => {
    if (!confirm("Supprimer ce risque ?")) return;
    try {
      const response = await fetch(`/api/investments/projects/${params.id}/risks?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRisks(risks.filter(r => r.id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ========== IMPACTS ==========
  const fetchImpacts = async () => {
    try {
      setLoadingImpacts(true);
      const response = await fetch(`/api/investments/projects/${params.id}/impacts`);
      if (response.ok) {
        const data = await response.json();
        setImpacts(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching impacts:", err);
    } finally {
      setLoadingImpacts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "impacts" && params.id) {
      fetchImpacts();
    }
  }, [activeTab, params.id]);

  const handleSaveImpact = async () => {
    try {
      const isEditing = impactForm.id;
      const url = isEditing
        ? `/api/investments/projects/${params.id}/impacts?id=${impactForm.id}`
        : `/api/investments/projects/${params.id}/impacts`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(impactForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur");
      }

      await fetchImpacts();
      setShowImpactModal(false);
      setImpactForm({
        reportDate: new Date().toISOString().split('T')[0], directJobs: 0, indirectJobs: 0,
        localRevenue: 0, taxContribution: 0, exportValue: 0, localPurchases: 0,
        trainingHours: 0, environmentalScore: 0, socialScore: 0, notes: ""
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteImpact = async (id) => {
    if (!confirm("Supprimer ce rapport d'impact ?")) return;
    try {
      const response = await fetch(`/api/investments/projects/${params.id}/impacts?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setImpacts(impacts.filter(i => i.id !== id));
      } else {
        const data = await response.json();
        throw new Error(data.error || "Erreur");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Config objects for display
  const milestoneStatusConfig = {
    NOT_STARTED: { label: "Non demarre", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
    PENDING: { label: "En attente", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
    IN_PROGRESS: { label: "En cours", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    COMPLETED: { label: "Termine", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    DELAYED: { label: "En retard", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    ON_HOLD: { label: "En pause", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    CANCELLED: { label: "Annule", color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" },
  };

  const priorityConfig = {
    LOW: { label: "Basse", color: "bg-gray-100 text-gray-600" },
    MEDIUM: { label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
    HIGH: { label: "Haute", color: "bg-orange-100 text-orange-700" },
    CRITICAL: { label: "Critique", color: "bg-red-100 text-red-700" },
  };

  const riskCategoryConfig = {
    FINANCIAL: { label: "Financier", icon: DollarSign },
    OPERATIONAL: { label: "Operationnel", icon: Briefcase },
    TECHNICAL: { label: "Technique", icon: Zap },
    LEGAL: { label: "Juridique", icon: Shield },
    ENVIRONMENTAL: { label: "Environnemental", icon: Leaf },
    SOCIAL: { label: "Social", icon: HeartHandshake },
    POLITICAL: { label: "Politique", icon: Flag },
    MARKET: { label: "Marche", icon: TrendingUp },
  };

  const riskLevelConfig = {
    LOW: { label: "Faible", color: "bg-green-100 text-green-700" },
    MEDIUM: { label: "Moyen", color: "bg-yellow-100 text-yellow-700" },
    HIGH: { label: "Eleve", color: "bg-orange-100 text-orange-700" },
    CRITICAL: { label: "Critique", color: "bg-red-100 text-red-700" },
  };

  const riskStatusConfig = {
    IDENTIFIED: { label: "Identifie", color: "bg-blue-100 text-blue-700" },
    ANALYZING: { label: "En analyse", color: "bg-yellow-100 text-yellow-700" },
    MITIGATING: { label: "En mitigation", color: "bg-orange-100 text-orange-700" },
    MONITORING: { label: "Sous surveillance", color: "bg-purple-100 text-purple-700" },
    RESOLVED: { label: "Resolu", color: "bg-green-100 text-green-700" },
    ACCEPTED: { label: "Accepte", color: "bg-gray-100 text-gray-700" },
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Upload document
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert("Veuillez selectionner un fichier");
      return;
    }

    try {
      setUploadingDoc(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", docName || selectedFile.name);
      formData.append("description", docDescription);
      formData.append("category", docCategory);

      const response = await fetch(`/api/investments/projects/${params.id}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      const result = await response.json();
      // API returns { success: true, data: { document: {...} } }
      const newDoc = result.data?.document || result.document || result;
      setDocuments([newDoc, ...documents]);
      setShowUploadModal(false);
      setSelectedFile(null);
      setDocName("");
      setDocDescription("");
      setDocCategory("other");
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (docId) => {
    if (!confirm("Supprimer ce document ?")) return;

    try {
      const response = await fetch(
        `/api/investments/projects/${params.id}/documents?documentId=${docId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setDocuments(documents.filter((d) => d.id !== docId));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Get document icon based on type
  const getDocIcon = (type, mimeType) => {
    if (type === "pdf" || mimeType === "application/pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (type === "image" || mimeType?.startsWith("image/")) {
      return <Image className="w-8 h-8 text-green-500" />;
    }
    if (type === "spreadsheet" || mimeType?.includes("spreadsheet") || mimeType?.includes("excel")) {
      return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    }
    if (type === "document" || mimeType?.includes("word")) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "-";
    const size = parseInt(bytes);
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Print project details
  const handlePrint = () => {
    const status = statusConfig[project.status] || statusConfig.DRAFT;
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fiche Projet - ${project.projectCode}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1e40af; }
          .logo { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
          .subtitle { color: #666; font-size: 14px; }
          .investor-header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px; }
          .investor-name { font-size: 18px; font-weight: 600; margin-bottom: 5px; }
          .investor-code { font-size: 13px; opacity: 0.9; }
          .investor-contact { font-size: 12px; opacity: 0.8; margin-top: 10px; }
          .project-title { background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #1e40af; }
          .project-name { font-size: 22px; font-weight: bold; color: #1e3a8a; margin-bottom: 8px; }
          .project-code { color: #64748b; font-size: 14px; }
          .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 10px; }
          .status-approved { background: #dcfce7; color: #166534; }
          .status-rejected { background: #fee2e2; color: #991b1b; }
          .status-in_progress { background: #f3e8ff; color: #7c3aed; }
          .status-completed { background: #d1fae5; color: #065f46; }
          .status-under_review { background: #fef3c7; color: #92400e; }
          .status-submitted { background: #dbeafe; color: #1e40af; }
          .status-draft { background: #f3f4f6; color: #4b5563; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
          .stat-card { background: #f8fafc; padding: 18px; border-radius: 10px; text-align: center; border: 1px solid #e2e8f0; }
          .stat-value { font-size: 22px; font-weight: bold; color: #1e40af; }
          .stat-value.green { color: #059669; }
          .stat-value.purple { color: #7c3aed; }
          .stat-value.orange { color: #ea580c; }
          .stat-label { font-size: 11px; color: #64748b; margin-top: 5px; text-transform: uppercase; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: 600; color: #1e3a8a; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .info-item { padding: 12px; background: #f8fafc; border-radius: 8px; }
          .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .info-value { font-size: 14px; color: #1e293b; font-weight: 500; }
          .description { background: #f8fafc; padding: 15px; border-radius: 8px; line-height: 1.6; color: #475569; }
          .progress-section { margin-bottom: 25px; }
          .progress-bar-container { background: #e2e8f0; height: 12px; border-radius: 6px; overflow: hidden; }
          .progress-bar { height: 100%; background: linear-gradient(90deg, #3b82f6, #1e40af); border-radius: 6px; }
          .progress-label { display: flex; justify-content: space-between; margin-top: 8px; font-size: 13px; color: #64748b; }
          .rejection-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .rejection-title { color: #991b1b; font-weight: 600; margin-bottom: 5px; }
          .rejection-reason { color: #dc2626; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print {
            body { padding: 20px; }
            .stats-grid { grid-template-columns: repeat(4, 1fr); }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">ANAPI</div>
          <div class="subtitle">Agence Nationale pour la Promotion des Investissements</div>
          <div class="subtitle">Republique Democratique du Congo</div>
        </div>

        ${project.investor ? `
        <div class="investor-header">
          <div class="investor-name">${project.investor.name}</div>
          <div class="investor-code">${project.investor.investorCode || ''} ${project.investor.type ? `• ${project.investor.type}` : ''}</div>
          <div class="investor-contact">
            ${project.investor.email ? `Email: ${project.investor.email}` : ''}
            ${project.investor.phone ? ` | Tel: ${project.investor.phone}` : ''}
            ${project.investor.country ? ` | ${[project.investor.city, project.investor.province, project.investor.country].filter(Boolean).join(', ')}` : ''}
          </div>
        </div>
        ` : ''}

        <div class="project-title">
          <div class="project-name">
            ${project.projectName}
            <span class="status-badge status-${project.status?.toLowerCase()}">${status.label}</span>
          </div>
          <div class="project-code">${project.projectCode} ${project.sector ? `• ${project.sector?.nameFr || project.sector?.name || ''}` : ''} ${project.subSector ? `• ${project.subSector}` : ''}</div>
        </div>

        ${project.progress > 0 ? `
        <div class="progress-section">
          <div class="section-title">Progression du Projet</div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${project.progress}%"></div>
          </div>
          <div class="progress-label">
            <span>Avancement</span>
            <span><strong>${project.progress}%</strong></span>
          </div>
        </div>
        ` : ''}

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value green">${formatAmount(project.amount, project.currency)}</div>
            <div class="stat-label">Montant Investi</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${(project.jobsCreated || 0).toLocaleString('fr-FR')}</div>
            <div class="stat-label">Emplois Directs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value purple">${(project.jobsIndirect || 0).toLocaleString('fr-FR')}</div>
            <div class="stat-label">Emplois Indirects</div>
          </div>
          <div class="stat-card">
            <div class="stat-value orange">${((project.jobsCreated || 0) + (project.jobsIndirect || 0)).toLocaleString('fr-FR')}</div>
            <div class="stat-label">Total Emplois</div>
          </div>
        </div>

        ${project.description ? `
        <div class="section">
          <div class="section-title">Description du Projet</div>
          <div class="description">${project.description}</div>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Informations Generales</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Localisation</div>
              <div class="info-value">${[project.city?.name, project.province?.name || project.province?.nameFr].filter(Boolean).join(', ') || 'Non definie'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Devise</div>
              <div class="info-value">${project.currency || 'USD'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date de Debut</div>
              <div class="info-value">${project.startDate ? formatDate(project.startDate) : '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date de Fin Prevue</div>
              <div class="info-value">${project.endDate ? formatDate(project.endDate) : '-'}</div>
            </div>
            ${project.approvalDate ? `
            <div class="info-item">
              <div class="info-label">Date d'Approbation</div>
              <div class="info-value">${formatDate(project.approvalDate)}</div>
            </div>
            ` : ''}
            <div class="info-item">
              <div class="info-label">Date de Creation</div>
              <div class="info-value">${formatDate(project.createdAt)}</div>
            </div>
          </div>
        </div>

        ${project.status === 'REJECTED' && project.rejectionReason ? `
        <div class="rejection-box">
          <div class="rejection-title">Motif de Rejet</div>
          <div class="rejection-reason">${project.rejectionReason}</div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Document genere le ${new Date().toLocaleString('fr-FR')} - ANAPI Guichet Unique</p>
          <p>Ce document est une fiche recapitulative du projet d'investissement</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Chargement du projet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{error}</h2>
        <p className="text-gray-500 mt-2">Une erreur s'est produite lors du chargement des donnees.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={fetchProject}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reessayer
          </button>
          <Link
            href="/investments/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour a la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projet non trouve</h2>
        <p className="text-gray-500 mt-2">Le projet demande n'existe pas ou a ete supprime.</p>
        <Link href="/investments/projects" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const status = statusConfig[project.status?.toUpperCase()] || statusConfig.DRAFT;
  const StatusIcon = status.icon;
  const sectorName = project.sector?.nameFr || project.sector?.name || project.sector || "";
  const SectorIcon = sectorIcons[sectorName] || Factory;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/investments/projects"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${status.color.split(' ')[0]} rounded-xl flex items-center justify-center`}>
              <SectorIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.projectName}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-500 dark:text-gray-400">{project.projectCode}</p>
                {sectorName && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                      {sectorName}
                    </span>
                  </>
                )}
                {project.subSector && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{project.subSector}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2 inline" />
                )}
                Enregistrer
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <Printer className="w-4 h-4 mr-2 inline" />
                Imprimer
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2 inline" />
                Modifier
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 border border-red-200 dark:border-red-800 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar (if applicable) */}
      {project.progress > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression du projet</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                project.progress === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatAmount(project.amount, project.currency)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois directs</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {(project.jobsCreated || 0).toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois indirects</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {(project.jobsIndirect || 0).toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date de debut</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {formatDate(project.startDate)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {[
            { id: "overview", label: "Informations", icon: Briefcase },
            { id: "milestones", label: "Jalons", icon: Target },
            { id: "risks", label: "Risques", icon: AlertTriangle },
            { id: "impacts", label: "Impacts", icon: BarChart3 },
            { id: "investor", label: "Investisseur", icon: Building2 },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "history", label: "Historique", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details du Projet</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du projet</label>
                  <input
                    type="text"
                    value={editedProject.projectName || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, projectName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={editedProject.description || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secteur</label>
                    <input
                      type="text"
                      value={editedProject.sector?.nameFr || editedProject.sector?.name || ""}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sous-secteur</label>
                    <input
                      type="text"
                      value={editedProject.subSector || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, subSector: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                  <select
                    value={editedProject.status || "DRAFT"}
                    onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Progression (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editedProject.progress || 0}
                    onChange={(e) => setEditedProject({ ...editedProject, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {project.description && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Secteur</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.sector?.nameFr || project.sector?.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sous-secteur</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.subSector || "-"}</p>
                  </div>
                </div>
                {project.rejectionReason && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">Motif de rejet</p>
                    <p className="text-red-600 dark:text-red-300 mt-1">{project.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Financial Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Financieres</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant</label>
                    <input
                      type="number"
                      value={editedProject.amount || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Devise</label>
                    <select
                      value={editedProject.currency || "USD"}
                      onChange={(e) => setEditedProject({ ...editedProject, currency: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="CDF">CDF</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emplois directs</label>
                    <input
                      type="number"
                      value={editedProject.jobsCreated || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, jobsCreated: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emplois indirects</label>
                    <input
                      type="number"
                      value={editedProject.jobsIndirect || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, jobsIndirect: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Montant total</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {formatAmount(project.amount, project.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Devise</p>
                    <p className="text-gray-900 dark:text-white mt-1">{project.currency || "USD"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emplois directs</p>
                    <p className="text-gray-900 dark:text-white mt-1">{(project.jobsCreated || 0).toLocaleString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emplois indirects</p>
                    <p className="text-gray-900 dark:text-white mt-1">{(project.jobsIndirect || 0).toLocaleString("fr-FR")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Localisation</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
                    <input
                      type="text"
                      value={editedProject.province || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, province: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                    <input
                      type="text"
                      value={editedProject.city || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={editedProject.address || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  {(project.province || project.city) && (
                    <p className="text-gray-900 dark:text-white">
                      {project.city?.name ? `${project.city.name}, ` : ""}{project.province?.name || project.province?.nameFr || ""}
                    </p>
                  )}
                  {project.address && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.address}</p>
                  )}
                  {project.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.notes}</p>
                  )}
                  {!project.province && !project.city && !project.address && !project.notes && (
                    <p className="text-gray-500 dark:text-gray-400 italic">Localisation non definie</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calendrier</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de debut</label>
                    <input
                      type="date"
                      value={editedProject.startDate ? editedProject.startDate.split('T')[0] : ""}
                      onChange={(e) => setEditedProject({ ...editedProject, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin prevue</label>
                    <input
                      type="date"
                      value={editedProject.endDate ? editedProject.endDate.split('T')[0] : ""}
                      onChange={(e) => setEditedProject({ ...editedProject, endDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de debut</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de fin prevue</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(project.endDate)}</p>
                  </div>
                </div>
                {project.approvalDate && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date d'approbation</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(project.approvalDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== MILESTONES TAB ========== */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Jalons du projet ({milestones.length})
              </h3>
              <button
                onClick={() => {
                  setEditingMilestone(null);
                  setMilestoneForm({
                    name: "", description: "", dueDate: "", status: "PENDING", progress: 0,
                    plannedBudget: "", actualBudget: "", deliverables: "", priority: "MEDIUM"
                  });
                  setShowMilestoneModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un jalon
              </button>
            </div>

            {loadingMilestones ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : milestones.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Aucun jalon defini</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Ajoutez des jalons pour suivre l'avancement du projet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {milestones.map((milestone) => {
                  const msStatus = milestoneStatusConfig[milestone.status] || milestoneStatusConfig.PENDING;
                  const msPriority = priorityConfig[milestone.priority] || priorityConfig.MEDIUM;
                  return (
                    <div key={milestone.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{milestone.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${msStatus.color}`}>
                              {msStatus.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${msPriority.color}`}>
                              {msPriority.label}
                            </span>
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{milestone.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {milestone.plannedEndDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(milestone.plannedEndDate)}
                              </span>
                            )}
                            {milestone.budget && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Budget: {formatAmount(milestone.budget)}
                              </span>
                            )}
                          </div>
                          {milestone.progress > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">Progression</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{milestone.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${milestone.progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                                  style={{ width: `${milestone.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMilestone(milestone);
                              setMilestoneForm({
                                name: milestone.name || "",
                                description: milestone.description || "",
                                dueDate: milestone.plannedEndDate ? milestone.plannedEndDate.split('T')[0] : "",
                                status: milestone.status || "PENDING",
                                progress: milestone.progress || 0,
                                plannedBudget: milestone.budget || "",
                                actualBudget: milestone.actualCost || "",
                                deliverables: Array.isArray(milestone.deliverables) ? milestone.deliverables.join(", ") : (milestone.deliverables || ""),
                                priority: milestone.priority || "MEDIUM"
                              });
                              setShowMilestoneModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== RISKS TAB ========== */}
      {activeTab === "risks" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Risques identifies ({risks.length})
              </h3>
              <button
                onClick={() => {
                  setEditingRisk(null);
                  setRiskForm({
                    title: "", description: "", category: "OPERATIONAL", probability: "MEDIUM",
                    impact: "MEDIUM", status: "IDENTIFIED", mitigationStrategy: "", contingencyPlan: ""
                  });
                  setShowRiskModal(true);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un risque
              </button>
            </div>

            {loadingRisks ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : risks.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Aucun risque identifie</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Evaluez les risques pour mieux gerer le projet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {risks.map((risk) => {
                  const riskCategory = riskCategoryConfig[risk.category] || riskCategoryConfig.OPERATIONAL;
                  const RiskIcon = riskCategory.icon;
                  const probLevel = riskLevelConfig[risk.probability] || riskLevelConfig.MEDIUM;
                  const impactLevel = riskLevelConfig[risk.impact] || riskLevelConfig.MEDIUM;
                  const riskStatus = riskStatusConfig[risk.status] || riskStatusConfig.IDENTIFIED;
                  return (
                    <div key={risk.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${impactLevel.color}`}>
                            <RiskIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{risk.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskStatus.color}`}>
                                {riskStatus.label}
                              </span>
                            </div>
                            {risk.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{risk.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Categorie: <span className="font-medium">{riskCategory.label}</span>
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${probLevel.color}`}>
                                Prob: {probLevel.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${impactLevel.color}`}>
                                Impact: {impactLevel.label}
                              </span>
                            </div>
                            {risk.mitigationStrategy && (
                              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-xs text-green-700 dark:text-green-400">
                                  <strong>Mitigation:</strong> {risk.mitigationStrategy}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingRisk(risk);
                              setRiskForm({
                                title: risk.title || "",
                                description: risk.description || "",
                                category: risk.category || "OPERATIONAL",
                                probability: risk.probability || "MEDIUM",
                                impact: risk.impact || "MEDIUM",
                                status: risk.status || "IDENTIFIED",
                                mitigationStrategy: risk.mitigationStrategy || "",
                                contingencyPlan: risk.contingencyPlan || ""
                              });
                              setShowRiskModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRisk(risk.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== IMPACTS TAB ========== */}
      {activeTab === "impacts" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          {impacts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Emplois directs</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {impacts.reduce((sum, i) => sum + (i.directJobsCreated || i.directJobs || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Emplois indirects</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {impacts.reduce((sum, i) => sum + (i.indirectJobsCreated || i.indirectJobs || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenus locaux</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatAmount(impacts.reduce((sum, i) => sum + (parseFloat(i.actualRevenue || i.localRevenue) || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Taxes</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatAmount(impacts.reduce((sum, i) => sum + (parseFloat(i.taxesPaid || i.taxContribution) || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rapports d'impact ({impacts.length})
              </h3>
              <button
                onClick={() => {
                  setImpactForm({
                    reportDate: new Date().toISOString().split('T')[0], directJobs: 0, indirectJobs: 0,
                    localRevenue: 0, taxContribution: 0, exportValue: 0, localPurchases: 0,
                    trainingHours: 0, environmentalScore: 0, socialScore: 0, notes: ""
                  });
                  setShowImpactModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau rapport
              </button>
            </div>

            {loadingImpacts ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              </div>
            ) : impacts.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Aucun rapport d'impact</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Documentez l'impact du projet sur l'economie locale</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {impacts.map((impact) => (
                  <div key={impact.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            Rapport du {formatDate(impact.reportDate)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Emplois directs</p>
                            <p className="font-medium text-gray-900 dark:text-white">{impact.directJobsCreated || impact.directJobs || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Emplois indirects</p>
                            <p className="font-medium text-gray-900 dark:text-white">{impact.indirectJobsCreated || impact.indirectJobs || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Revenus locaux</p>
                            <p className="font-medium text-green-600">{formatAmount(impact.actualRevenue || impact.localRevenue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Taxes</p>
                            <p className="font-medium text-orange-600">{formatAmount(impact.taxesPaid || impact.taxContribution)}</p>
                          </div>
                        </div>
                        {(impact.environmentalScore > 0 || impact.socialScore > 0) && (
                          <div className="mt-3 flex items-center gap-4">
                            {impact.environmentalScore > 0 && (
                              <div className="flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Env: {impact.environmentalScore}/10
                                </span>
                              </div>
                            )}
                            {impact.socialScore > 0 && (
                              <div className="flex items-center gap-2">
                                <HeartHandshake className="w-4 h-4 text-pink-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Social: {impact.socialScore}/10
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {impact.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">{impact.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setImpactForm({
                              reportDate: impact.reportDate ? impact.reportDate.split('T')[0] : "",
                              directJobs: impact.directJobsCreated || impact.directJobs || 0,
                              indirectJobs: impact.indirectJobsCreated || impact.indirectJobs || 0,
                              localRevenue: impact.actualRevenue || impact.localRevenue || 0,
                              taxContribution: impact.taxesPaid || impact.taxContribution || 0,
                              exportValue: impact.exportRevenue || impact.exportValue || 0,
                              localPurchases: impact.localPurchases || 0,
                              trainingHours: impact.trainingHours || 0,
                              environmentalScore: impact.environmentalScore || 0,
                              socialScore: impact.socialScore || 0,
                              notes: impact.notes || "",
                              id: impact.id
                            });
                            setShowImpactModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteImpact(impact.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "investor" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Investisseur
            </h3>
          </div>
          {project.investor ? (
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.investor.name}
                    </h4>
                    {project.investor.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{project.investor.investorCode}</p>
                  <div className="flex items-center gap-4 mt-4">
                    {project.investor.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        {project.investor.email}
                      </div>
                    )}
                    {project.investor.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4" />
                        {project.investor.phone}
                      </div>
                    )}
                  </div>
                  {(project.investor.country || project.investor.province) && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {[project.investor.city, project.investor.province, project.investor.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                <Link
                  href={`/investments/investors/${project.investor.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir le profil
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun investisseur associe</p>
              <p className="text-sm text-gray-400 mt-1">Ce projet n'est pas encore lie a un investisseur</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Documents ({documents.length})
              </h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Ajouter un document
              </button>
            </div>

            {loadingDocs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun document</p>
                <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter un document" pour commencer</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id || `doc-${index}`}
                    className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      selectedDoc?.id === doc.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex-shrink-0">
                      {getDocIcon(doc.type, doc.mimeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.createdAt)}</span>
                        {doc.category && doc.category !== "other" && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                              {doc.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/investments/projects/${params.id}/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Ouvrir"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={`/api/investments/projects/${params.id}/documents/${doc.id}/download`}
                        download={doc.originalName || doc.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Telecharger"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Apercu
              </h3>
            </div>
            {selectedDoc ? (
              <div className="p-4">
                {/* Preview based on type */}
                {selectedDoc.mimeType?.startsWith("image/") ? (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`/api/investments/projects/${params.id}/documents/${selectedDoc.id}/download`}
                      alt={selectedDoc.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : selectedDoc.mimeType === "application/pdf" ? (
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                    <iframe
                      src={`/api/investments/projects/${params.id}/documents/${selectedDoc.id}/download`}
                      className="w-full h-full"
                      title={selectedDoc.name}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    {getDocIcon(selectedDoc.type, selectedDoc.mimeType)}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedDoc.name}</p>
                  </div>
                  {selectedDoc.description && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                      <p className="text-gray-900 dark:text-white">{selectedDoc.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Taille</p>
                      <p className="text-gray-900 dark:text-white">{formatFileSize(selectedDoc.size)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <p className="text-gray-900 dark:text-white">{selectedDoc.mimeType || selectedDoc.extension || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date d'ajout</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedDoc.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`/api/investments/projects/${params.id}/documents/${selectedDoc.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                  >
                    Ouvrir
                  </a>
                  <a
                    href={`/api/investments/projects/${params.id}/documents/${selectedDoc.id}/download`}
                    download={selectedDoc.originalName || selectedDoc.name}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center text-sm"
                  >
                    Telecharger
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selectionnez un document</p>
                <p className="text-sm text-gray-400 mt-1">pour afficher l'apercu</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ajouter un document
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* File Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  selectedFile
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    {getDocIcon(null, selectedFile.type)}
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Glissez un fichier ici ou
                    </p>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
                      Parcourir
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-3">
                      PDF, Images, Word, Excel (max 10MB)
                    </p>
                  </>
                )}
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du document
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Ex: Etude de faisabilite"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categorie
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="other">Autre</option>
                  <option value="legal">Juridique</option>
                  <option value="financial">Financier</option>
                  <option value="technical">Technique</option>
                  <option value="administrative">Administratif</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  rows={3}
                  placeholder="Description du document..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setDocName("");
                  setDocDescription("");
                  setDocCategory("other");
                }}
                disabled={uploadingDoc}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={uploadingDoc || !selectedFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploadingDoc ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Historique des modifications
            </h3>
            <button
              onClick={fetchHistory}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="p-6">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : history.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-6">
                  {history.map((entry, index) => {
                    const actionConfig = {
                      CREATED: { icon: Clock, color: "bg-blue-100 text-blue-600", label: "Creation" },
                      UPDATED: { icon: Edit, color: "bg-gray-100 text-gray-600", label: "Modification" },
                      STATUS_CHANGED: { icon: RefreshCw, color: "bg-purple-100 text-purple-600", label: "Statut" },
                      APPROVED: { icon: CheckCircle2, color: "bg-green-100 text-green-600", label: "Approuve" },
                      REJECTED: { icon: XCircle, color: "bg-red-100 text-red-600", label: "Rejete" },
                      STARTED: { icon: TrendingUp, color: "bg-purple-100 text-purple-600", label: "Demarre" },
                      COMPLETED: { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600", label: "Termine" },
                      CANCELLED: { icon: XCircle, color: "bg-gray-100 text-gray-600", label: "Annule" },
                      DOCUMENT_UPLOADED: { icon: Upload, color: "bg-blue-100 text-blue-600", label: "Document" },
                      DOCUMENT_DELETED: { icon: Trash2, color: "bg-red-100 text-red-600", label: "Suppression" },
                      AMOUNT_UPDATED: { icon: DollarSign, color: "bg-green-100 text-green-600", label: "Montant" },
                      INVESTOR_CHANGED: { icon: Building2, color: "bg-orange-100 text-orange-600", label: "Investisseur" },
                      COMMENT_ADDED: { icon: FileText, color: "bg-yellow-100 text-yellow-600", label: "Commentaire" },
                      MILESTONE_REACHED: { icon: CheckCircle2, color: "bg-teal-100 text-teal-600", label: "Jalon" },
                    };
                    const config = actionConfig[entry.action] || actionConfig.UPDATED;
                    const IconComponent = config.icon;

                    return (
                      <div key={entry.id} className="relative pl-10">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(entry.createdAt).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {entry.description || `Action: ${entry.action}`}
                          </p>
                          {entry.performedByName && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Par: {entry.performedByName}
                            </p>
                          )}
                          {entry.previousStatus && entry.newStatus && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <span className="text-gray-500">{entry.previousStatus}</span>
                              <ArrowUpRight className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-700 dark:text-gray-300">{entry.newStatus}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun historique disponible</p>
                <p className="text-sm text-gray-400 mt-1">Les modifications seront enregistrees ici</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== MILESTONE MODAL ========== */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingMilestone ? "Modifier le jalon" : "Ajouter un jalon"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du jalon *</label>
                <input
                  type="text"
                  value={milestoneForm.name}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Etude de faisabilite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date d'echeance</label>
                  <input
                    type="date"
                    value={milestoneForm.dueDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priorite</label>
                  <select
                    value={milestoneForm.priority}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="CRITICAL">Critique</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                  <select
                    value={milestoneForm.status}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="NOT_STARTED">Non demarre</option>
                    <option value="PENDING">En attente</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Termine</option>
                    <option value="DELAYED">En retard</option>
                    <option value="ON_HOLD">En pause</option>
                    <option value="CANCELLED">Annule</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Progression (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={milestoneForm.progress}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, progress: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget prevu</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={milestoneForm.plannedBudget}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, plannedBudget: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget reel</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={milestoneForm.actualBudget}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, actualBudget: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Livrables</label>
                <textarea
                  rows={2}
                  value={milestoneForm.deliverables}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, deliverables: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Liste des livrables attendus..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => { setShowMilestoneModal(false); setEditingMilestone(null); }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveMilestone}
                disabled={!milestoneForm.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {editingMilestone ? "Mettre a jour" : "Creer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== RISK MODAL ========== */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingRisk ? "Modifier le risque" : "Ajouter un risque"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du risque *</label>
                <input
                  type="text"
                  value={riskForm.title}
                  onChange={(e) => setRiskForm({ ...riskForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Risque de retard de livraison"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={riskForm.description}
                  onChange={(e) => setRiskForm({ ...riskForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
                  <select
                    value={riskForm.category}
                    onChange={(e) => setRiskForm({ ...riskForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="FINANCIAL">Financier</option>
                    <option value="OPERATIONAL">Operationnel</option>
                    <option value="TECHNICAL">Technique</option>
                    <option value="LEGAL">Juridique</option>
                    <option value="ENVIRONMENTAL">Environnemental</option>
                    <option value="SOCIAL">Social</option>
                    <option value="POLITICAL">Politique</option>
                    <option value="MARKET">Marche</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut</label>
                  <select
                    value={riskForm.status}
                    onChange={(e) => setRiskForm({ ...riskForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="IDENTIFIED">Identifie</option>
                    <option value="ANALYZING">En analyse</option>
                    <option value="MITIGATING">En mitigation</option>
                    <option value="MONITORING">Sous surveillance</option>
                    <option value="RESOLVED">Resolu</option>
                    <option value="ACCEPTED">Accepte</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Probabilite</label>
                  <select
                    value={riskForm.probability}
                    onChange={(e) => setRiskForm({ ...riskForm, probability: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="LOW">Faible</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Elevee</option>
                    <option value="CRITICAL">Critique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Impact</label>
                  <select
                    value={riskForm.impact}
                    onChange={(e) => setRiskForm({ ...riskForm, impact: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="LOW">Faible</option>
                    <option value="MEDIUM">Moyen</option>
                    <option value="HIGH">Eleve</option>
                    <option value="CRITICAL">Critique</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Strategie de mitigation</label>
                <textarea
                  rows={2}
                  value={riskForm.mitigationStrategy}
                  onChange={(e) => setRiskForm({ ...riskForm, mitigationStrategy: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Comment reduire ce risque..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan de contingence</label>
                <textarea
                  rows={2}
                  value={riskForm.contingencyPlan}
                  onChange={(e) => setRiskForm({ ...riskForm, contingencyPlan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Que faire si le risque se materialise..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => { setShowRiskModal(false); setEditingRisk(null); }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveRisk}
                disabled={!riskForm.title}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {editingRisk ? "Mettre a jour" : "Creer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== IMPACT MODAL ========== */}
      {showImpactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nouveau rapport d'impact
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date du rapport *</label>
                <input
                  type="date"
                  value={impactForm.reportDate}
                  onChange={(e) => setImpactForm({ ...impactForm, reportDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emplois directs</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.directJobs}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, directJobs: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emplois indirects</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.indirectJobs}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, indirectJobs: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenus locaux (USD)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.localRevenue}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, localRevenue: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contribution fiscale (USD)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.taxContribution}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, taxContribution: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exportations (USD)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.exportValue}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, exportValue: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Achats locaux (USD)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.localPurchases}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, localPurchases: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 h-10 flex items-end">Heures de formation</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={impactForm.trainingHours}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, trainingHours: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 h-10 flex items-end">Score environnemental (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={impactForm.environmentalScore}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, environmentalScore: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 h-10 flex items-end">Score social (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={impactForm.socialScore}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setImpactForm({ ...impactForm, socialScore: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={impactForm.notes}
                  onChange={(e) => setImpactForm({ ...impactForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Commentaires additionnels..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowImpactModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveImpact}
                disabled={!impactForm.reportDate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Supprimer ce projet ?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Cette action est irreversible. Toutes les donnees associees seront egalement supprimees.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : null}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
