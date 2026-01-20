"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  FolderOpen,
  Building2,
  User,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Download,
  Printer,
  Share2,
  MessageSquare,
  Paperclip,
  Send,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Users,
  Factory,
  TrendingUp,
  History,
  X,
  Eye,
  Maximize2,
  Minimize2,
  Landmark,
  Trash2,
} from "lucide-react";

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "text-gray-600", bgColor: "bg-gray-100", icon: FileText },
  SUBMITTED: { label: "Soumis", color: "text-blue-600", bgColor: "bg-blue-100", icon: Clock },
  UNDER_REVIEW: { label: "En cours d'examen", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertCircle },
  PENDING_DOCUMENTS: { label: "Documents requis", color: "text-orange-600", bgColor: "bg-orange-100", icon: FileText },
  APPROVED: { label: "Approuve", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle2 },
  REJECTED: { label: "Rejete", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle },
  COMPLETED: { label: "Termine", color: "text-purple-600", bgColor: "bg-purple-100", icon: CheckCircle2 },
};

// Configuration des catégories de documents
const documentCategoryConfig = {
  RCCM: { label: "RCCM", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  ID_NATIONAL: { label: "ID National", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  NIF: { label: "NIF", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  BUSINESS_PLAN: { label: "Business Plan", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  FINANCIAL_PROOF: { label: "Preuve Financière", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  TECHNICAL_STUDY: { label: "Étude Technique", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  OTHER: { label: "Autre", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
};

const mockDossier = {
  id: "1",
  reference: "GU-2024-00125",
  investorName: "Congo Mining Corporation",
  investorType: "company",
  investorEmail: "contact@congomining.com",
  investorPhone: "+243 81 234 5678",
  investorAddress: "Avenue de la Paix, 123",
  investorCountry: "Afrique du Sud",
  projectName: "Extension Mine de Cuivre Kolwezi",
  projectDescription: "Projet d'extension de la capacite de production de la mine de cuivre avec nouvelles installations de traitement du minerai et infrastructure logistique associee.",
  sector: "Mines et Extraction",
  subSector: "Cuivre et Cobalt",
  province: "Lualaba",
  city: "Kolwezi",
  status: "UNDER_REVIEW",
  submittedAt: "2024-01-15",
  updatedAt: "2024-01-20",
  amount: 15000000,
  currency: "USD",
  jobsCreated: 500,
  jobsIndirect: 1500,
  currentStep: 3,
  totalSteps: 6,
  startDate: "2024-06-01",
  endDate: "2026-12-31",
  documents: [
    { name: "Business Plan.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2024-01-15" },
    { name: "Etude de Faisabilite.pdf", type: "PDF", size: "5.8 MB", uploadedAt: "2024-01-15" },
    { name: "Etude Impact Environnemental.pdf", type: "PDF", size: "3.2 MB", uploadedAt: "2024-01-15" },
    { name: "Statuts Entreprise.pdf", type: "PDF", size: "856 KB", uploadedAt: "2024-01-15" },
    { name: "Bilans Financiers.xlsx", type: "XLSX", size: "1.2 MB", uploadedAt: "2024-01-15" },
  ],
  timeline: [
    { date: "2024-01-20", action: "Dossier assigne pour examen technique", user: "Jean Kabila", status: "info" },
    { date: "2024-01-18", action: "Verification des documents completee", user: "Marie Lumumba", status: "success" },
    { date: "2024-01-16", action: "Dossier recu et enregistre", user: "Systeme", status: "info" },
    { date: "2024-01-15", action: "Dossier soumis par l'investisseur", user: "Congo Mining Corporation", status: "info" },
  ],
  comments: [
    { id: "1", user: "Jean Kabila", message: "Documents conformes. En attente de l'avis du service technique.", date: "2024-01-20" },
    { id: "2", user: "Marie Lumumba", message: "Tous les documents requis ont ete fournis.", date: "2024-01-18" },
  ],
};

// Les etapes seront chargees dynamiquement depuis la configuration

export default function DossierDetailPage() {
  const params = useParams();
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const router = useRouter();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newComment, setNewComment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('OTHER');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepNote, setStepNote] = useState('');
  const [validatingStep, setValidatingStep] = useState(false);
  const [ministries, setMinistries] = useState([]);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // États pour les données géographiques du modal d'édition
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [editCities, setEditCities] = useState([]);
  const [loadingEditCities, setLoadingEditCities] = useState(false);
  const [editCommunes, setEditCommunes] = useState([]);
  const [loadingEditCommunes, setLoadingEditCommunes] = useState(false);

  // Fonction pour uploader un document
  const handleUploadDocument = async () => {
    if (!uploadFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('name', uploadName || uploadFile.name);
      formData.append('description', uploadDescription);
      formData.append('category', uploadCategory);

      const response = await fetch(`/api/guichet-unique/dossiers/${params.id}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Ajouter le nouveau document à la liste
        setDossier(prev => ({
          ...prev,
          documents: [
            {
              id: data.document.id,
              name: data.document.name,
              fileName: data.document.fileName,
              filePath: data.document.filePath,
              type: data.document.mimeType?.includes('pdf') ? 'PDF' :
                    data.document.mimeType?.includes('sheet') || data.document.mimeType?.includes('excel') ? 'XLSX' : 'Document',
              mimeType: data.document.mimeType,
              size: formatFileSize(data.document.fileSize),
              uploadedAt: data.document.createdAt,
              category: data.document.category,
              description: data.document.description,
            },
            ...prev.documents,
          ],
        }));
        // Fermer le modal et réinitialiser
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadName('');
        setUploadDescription('');
        setUploadCategory('OTHER');

        // Notification de succès
        Swal.fire({
          icon: 'success',
          title: 'Document ajouté',
          text: 'Le document a été uploadé avec succès.',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error || 'Erreur lors de l\'upload du document.',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'upload du document.',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setUploading(false);
    }
  };

  // Fonction pour ouvrir la prévisualisation
  const openDocumentPreview = (doc) => {
    setPreviewDocument(doc);
  };

  // Fonction pour fermer la prévisualisation
  const closeDocumentPreview = () => {
    setPreviewDocument(null);
  };

  // Fonction pour télécharger un document
  const downloadDocument = (doc) => {
    // Ouvrir le lien de téléchargement dans une nouvelle fenêtre
    if (doc.id) {
      window.open(`/api/documents/${doc.id}/download`, '_blank');
    } else {
      // Pour les documents mock sans ID réel
      window.open(`/api/documents/mock-${doc.name}/download`, '_blank');
    }
  };

  // Charger les ministères
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await fetch('/api/referentiels/ministries');
        if (response.ok) {
          const data = await response.json();
          setMinistries(data.ministries || data || []);
        }
      } catch (error) {
        console.error('Error fetching ministries:', error);
      }
    };
    fetchMinistries();
  }, []);

  // Charger les provinces depuis l'API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch('/api/referentiels/provinces?activeOnly=true');
        if (response.ok) {
          const data = await response.json();
          setProvinces(data.provinces || []);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Charger les villes quand la province change dans le formulaire d'édition
  useEffect(() => {
    const fetchCities = async () => {
      if (!editFormData.provinceId) {
        setEditCities([]);
        return;
      }
      try {
        setLoadingEditCities(true);
        const response = await fetch(`/api/referentiels/provinces/${editFormData.provinceId}/cities`);
        if (response.ok) {
          const data = await response.json();
          setEditCities(data.cities || []);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setEditCities([]);
      } finally {
        setLoadingEditCities(false);
      }
    };
    fetchCities();
  }, [editFormData.provinceId]);

  // Charger les communes quand la ville change dans le formulaire d'édition
  useEffect(() => {
    const fetchCommunes = async () => {
      if (!editFormData.cityId) {
        setEditCommunes([]);
        return;
      }
      try {
        setLoadingEditCommunes(true);
        const response = await fetch(`/api/referentiels/cities/${editFormData.cityId}/communes`);
        if (response.ok) {
          const data = await response.json();
          setEditCommunes(data.communes || []);
        }
      } catch (error) {
        console.error('Error fetching communes:', error);
        setEditCommunes([]);
      } finally {
        setLoadingEditCommunes(false);
      }
    };
    fetchCommunes();
  }, [editFormData.cityId]);

  // Charger les etapes de workflow depuis la configuration
  useEffect(() => {
    const fetchWorkflowSteps = async () => {
      try {
        // Déterminer l'URL du backend
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const baseUrl = hostname === 'anapi.futurissvision.com' || hostname === 'www.anapi.futurissvision.com'
          ? 'https://anapibackend.futurissvision.com/api/v1'
          : 'http://localhost:3502/api/v1';

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${baseUrl}/config/workflow-steps?type=AGREMENT`, { headers });
        if (response.ok) {
          const data = await response.json();
          // Transformer les etapes pour avoir le format attendu
          const steps = (data.steps || []).map(s => ({
            step: s.step,
            name: s.name,
            description: s.description,
            color: s.color,
            icon: s.icon,
            responsibleRole: s.responsibleRole,
          }));
          setWorkflowSteps(steps);
        } else {
          throw new Error('Failed to fetch workflow steps');
        }
      } catch (error) {
        console.error('Error fetching workflow steps:', error);
        // Fallback aux etapes par defaut si l'API echoue
        setWorkflowSteps([
          { step: 1, name: "Soumission", description: "Depot du dossier", color: "#3B82F6" },
          { step: 2, name: "Verification", description: "Controle documents", color: "#10B981" },
          { step: 3, name: "Examen Technique", description: "Analyse technique", color: "#F59E0B" },
          { step: 4, name: "Decision finale", description: "Approbation", color: "#8B5CF6" },
        ]);
      }
    };
    fetchWorkflowSteps();
  }, []);

  // Ouvrir le modal d'édition avec les données du dossier
  const openEditModal = () => {
    setEditFormData({
      projectName: dossier.projectName || '',
      projectDescription: dossier.projectDescription || '',
      amount: dossier.amount || 0,
      status: dossier.status || 'DRAFT',
      jobsCreated: dossier.jobsCreated || 0,
      jobsIndirect: dossier.jobsIndirect || 0,
      ministryId: dossier.ministry?.id || '',
      sector: dossier.sector || '',
      // Province, Ville, Commune avec IDs
      provinceId: dossier.provinceId || '',
      province: dossier.province || '',
      cityId: dossier.cityId || '',
      city: dossier.city || '',
      communeId: dossier.communeId || '',
      commune: dossier.commune || '',
      startDate: dossier.startDate ? dossier.startDate.split('T')[0] : '',
      endDate: dossier.endDate ? dossier.endDate.split('T')[0] : '',
    });
    setShowEditModal(true);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/guichet-unique/dossiers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_details',
          ...editFormData,
          investmentAmount: editFormData.amount,
          directJobs: editFormData.jobsCreated,
          indirectJobs: editFormData.jobsIndirect,
          // Province, Ville, Commune avec noms et IDs
          projectProvince: editFormData.province,
          projectProvinceId: editFormData.provinceId,
          projectCity: editFormData.city,
          projectCityId: editFormData.cityId,
          projectCommune: editFormData.commune,
          projectCommuneId: editFormData.communeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour le dossier local
        setDossier(prev => ({
          ...prev,
          projectName: editFormData.projectName,
          projectDescription: editFormData.projectDescription,
          amount: editFormData.amount,
          status: editFormData.status,
          jobsCreated: editFormData.jobsCreated,
          jobsIndirect: editFormData.jobsIndirect,
          ministry: ministries.find(m => m.id === editFormData.ministryId) || null,
          sector: editFormData.sector,
          province: editFormData.province,
          provinceId: editFormData.provinceId,
          city: editFormData.city,
          cityId: editFormData.cityId,
          commune: editFormData.commune,
          communeId: editFormData.communeId,
          startDate: editFormData.startDate,
          endDate: editFormData.endDate,
        }));
        setShowEditModal(false);

        // Notification de succès
        Swal.fire({
          icon: 'success',
          title: 'Modifications enregistrées',
          text: 'Le dossier a été mis à jour avec succès.',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error || 'Erreur lors de la mise à jour du dossier.',
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      console.error('Error updating dossier:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour du dossier.',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setSaving(false);
    }
  };

  // Supprimer le dossier avec confirmation
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      html: `
        <p>Êtes-vous sûr de vouloir supprimer ce dossier ?</p>
        <p class="text-sm text-gray-500 mt-2"><strong>Référence:</strong> ${dossier.reference}</p>
        <p class="text-sm text-gray-500"><strong>Projet:</strong> ${dossier.projectName}</p>
        <p class="text-sm text-red-500 mt-3">Cette action est irréversible.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        // Déterminer l'URL du backend
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const baseUrl = hostname === 'anapi.futurissvision.com' || hostname === 'www.anapi.futurissvision.com'
          ? 'https://anapibackend.futurissvision.com/api/v1'
          : 'http://localhost:3502/api/v1';

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`${baseUrl}/guichet-unique/dossiers/${params.id}`, {
          method: 'DELETE',
          headers,
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Dossier supprimé',
            text: 'Le dossier a été supprimé avec succès.',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          });
          // Rediriger vers la liste des dossiers
          router.push('/guichet-unique/dossiers');
        } else {
          const error = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.error || 'Erreur lors de la suppression du dossier.',
            confirmButtonColor: '#3B82F6',
          });
        }
      } catch (error) {
        console.error('Error deleting dossier:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la suppression du dossier.',
          confirmButtonColor: '#3B82F6',
        });
      }
    }
  };

  useEffect(() => {
    // Charger le dossier réel depuis l'API
    const fetchDossier = async () => {
      try {
        const response = await fetch(`/api/guichet-unique/dossiers/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          // Transformer les données de l'API pour correspondre à la structure attendue
          const apiDossier = data.dossier;
          setDossier({
            id: apiDossier.id,
            reference: apiDossier.dossierNumber || `GU-${apiDossier.id.substring(0, 8)}`,
            investorName: apiDossier.investorName || '',
            investorType: apiDossier.investorType || 'company',
            investorEmail: apiDossier.investorEmail || '',
            investorPhone: apiDossier.investorPhone || '',
            investorAddress: apiDossier.investorAddress || '',
            investorCountry: apiDossier.investorCountry || 'RDC',
            projectName: apiDossier.projectName || '',
            projectDescription: apiDossier.projectDescription || '',
            sector: apiDossier.sector || '',
            subSector: apiDossier.subSector || '',
            province: apiDossier.projectProvince || '',
            provinceId: apiDossier.projectProvinceId || '',
            city: apiDossier.projectCity || '',
            cityId: apiDossier.projectCityId || '',
            commune: apiDossier.projectCommune || '',
            communeId: apiDossier.projectCommuneId || '',
            status: apiDossier.status || 'DRAFT',
            submittedAt: apiDossier.submittedAt || apiDossier.createdAt,
            updatedAt: apiDossier.updatedAt,
            amount: apiDossier.investmentAmount || 0,
            currency: apiDossier.currency || 'USD',
            jobsCreated: apiDossier.directJobs || 0,
            jobsIndirect: apiDossier.indirectJobs || 0,
            currentStep: apiDossier.currentStep || 1,
            totalSteps: 6,
            startDate: apiDossier.startDate,
            endDate: apiDossier.endDate,
            dossierType: apiDossier.dossierType || '',
            // Ministère responsable
            ministry: apiDossier.ministry || null,
            // Transformer les documents de l'API
            documents: (apiDossier.documents || []).map(doc => ({
              id: doc.id,
              name: doc.name || doc.fileName,
              fileName: doc.fileName,
              filePath: doc.filePath,
              type: doc.mimeType?.includes('pdf') ? 'PDF' :
                    doc.mimeType?.includes('sheet') || doc.mimeType?.includes('excel') ? 'XLSX' :
                    doc.mimeType?.includes('image') ? 'Image' : 'Document',
              mimeType: doc.mimeType,
              size: doc.fileSize ? formatFileSize(doc.fileSize) : 'N/A',
              uploadedAt: doc.createdAt,
              category: doc.category,
              description: doc.description,
            })),
            timeline: apiDossier.timeline || [
              { date: apiDossier.createdAt, action: 'Dossier créé', user: 'Système', status: 'info' }
            ],
            comments: apiDossier.comments || [],
          });
        } else {
          // Fallback aux données mock si l'API n'est pas disponible
          console.warn('[DEV] API non disponible, utilisation des données de démonstration');
          setDossier({ ...mockDossier, id: params.id });
        }
      } catch (error) {
        console.warn('[DEV] Erreur API, utilisation des données de démonstration:', error.message);
        setDossier({ ...mockDossier, id: params.id });
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [params.id]);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Fonction pour ouvrir le modal de validation d'étape
  const openStepValidation = (step) => {
    // Ne pas permettre de valider si le dossier est déjà approuvé ou si ce n'est pas l'étape courante
    if (step.step === dossier.currentStep && dossier.status !== 'APPROVED') {
      setSelectedStep(step);
      setStepNote('');
      setShowStepModal(true);
    }
  };

  // Fonction pour valider l'étape actuelle
  const handleValidateStep = async () => {
    if (!selectedStep) return;

    setValidatingStep(true);
    try {
      const isFinalStep = selectedStep.step === workflowSteps.length;
      const response = await fetch(`/api/guichet-unique/dossiers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate_step',
          note: stepNote,
          stepName: selectedStep.name,
          isFinalStep,
          totalSteps: workflowSteps.length,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour le dossier local
        setDossier(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          status: data.dossier.status || prev.status,
        }));
        setShowStepModal(false);
        setSelectedStep(null);
        setStepNote('');

        // Afficher une notification de succès
        Swal.fire({
          icon: 'success',
          title: isFinalStep ? 'Dossier approuvé!' : 'Étape validée',
          text: isFinalStep
            ? 'Le dossier a été approuvé avec succès!'
            : `L'étape "${selectedStep.name}" a été validée avec succès.`,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        // Fallback en mode développement: simuler la validation localement
        console.warn('[DEV] API non disponible, simulation de la validation locale');
        const newStatus = isFinalStep ? 'APPROVED' : dossier.status;
        setDossier(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          status: newStatus,
          timeline: [
            {
              date: new Date().toISOString().split('T')[0],
              action: isFinalStep ? 'Dossier approuvé' : `Étape "${selectedStep.name}" validée`,
              user: 'Admin ANAPI',
              status: 'success',
            },
            ...prev.timeline,
          ],
        }));
        setShowStepModal(false);
        setSelectedStep(null);
        setStepNote('');

        Swal.fire({
          icon: 'success',
          title: isFinalStep ? 'Dossier approuvé!' : 'Étape validée',
          text: isFinalStep
            ? 'Le dossier a été approuvé avec succès! (Mode démo)'
            : `L'étape "${selectedStep.name}" a été validée. (Mode démo)`,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }
    } catch (error) {
      console.warn('[DEV] Erreur API, simulation de la validation locale:', error.message);
      // Fallback en mode développement: simuler la validation localement
      const isFinalStep = selectedStep.step === workflowSteps.length;
      const newStatus = isFinalStep ? 'APPROVED' : dossier.status;
      setDossier(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        status: newStatus,
        timeline: [
          {
            date: new Date().toISOString().split('T')[0],
            action: isFinalStep ? 'Dossier approuvé' : `Étape "${selectedStep.name}" validée`,
            user: 'Admin ANAPI',
            status: 'success',
          },
          ...prev.timeline,
        ],
      }));
      setShowStepModal(false);
      setSelectedStep(null);
      setStepNote('');

      Swal.fire({
        icon: 'success',
        title: isFinalStep ? 'Dossier approuvé!' : 'Étape validée',
        text: isFinalStep
          ? 'Le dossier a été approuvé avec succès! (Mode démo)'
          : `L'étape "${selectedStep.name}" a été validée. (Mode démo)`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    } finally {
      setValidatingStep(false);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && dossier) {
      const comment = {
        id: Date.now().toString(),
        user: "Yves Mpunga",
        message: newComment,
        date: new Date().toISOString().split("T")[0],
      };
      setDossier({
        ...dossier,
        comments: [comment, ...dossier.comments],
      });
      setNewComment("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dossier non trouve</h2>
        <p className="text-gray-500 mt-2">Le dossier demande n'existe pas ou a ete supprime.</p>
        <Link href="/guichet-unique/dossiers" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const status = statusConfig[dossier.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;
  const totalSteps = workflowSteps.length || dossier.totalSteps;
  const progress = (dossier.currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/guichet-unique/dossiers"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {dossier.reference}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                {status.label}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {dossier.projectName}
            </p>
            {/* Ministère responsable - affiché dans le header */}
            {dossier.ministry && (
              <div className="flex items-center gap-2 mt-2">
                <Landmark className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {dossier.ministry.name}
                </span>
                {dossier.ministry.shortName && (
                  <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-700 dark:text-indigo-300">
                    {dossier.ministry.shortName}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`/guichet-unique/dossiers/${dossier.id}/preview`, '_blank')}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Apercu PDF"
          >
            <Printer className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={() => window.open(`/guichet-unique/dossiers/${dossier.id}/preview`, '_blank')}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Telecharger PDF"
          >
            <Download className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Partager">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={openEditModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Supprimer ce dossier"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Workflow Progress - Etapes dynamiques */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6">Progression du dossier</h3>
        {workflowSteps.length > 0 ? (
          <div className="relative overflow-x-auto pb-4">
            <div className="min-w-max">
            {/* Ligne de progression en arrière-plan */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 dark:bg-gray-600" />
            <div
              className="absolute top-5 left-8 h-1 bg-green-500 transition-all duration-500"
              style={{ width: `calc(${((dossier.currentStep - 1) / (workflowSteps.length - 1)) * 100}% - 4rem)` }}
            />

            {/* Étapes */}
            <div className="relative flex justify-between">
              {workflowSteps.map((step, index) => {
                const isCurrentStep = step.step === dossier.currentStep;
                const isCompleted = step.step < dossier.currentStep || (isCurrentStep && dossier.status === 'APPROVED');
                const isClickable = isCurrentStep && dossier.status !== 'APPROVED';

                return (
                  <div
                    key={step.step}
                    className={`flex flex-col items-center ${isClickable ? 'cursor-pointer group' : ''}`}
                    style={{ width: `${100 / workflowSteps.length}%` }}
                    onClick={() => isClickable && openStepValidation(step)}
                  >
                    {/* Cercle de l'étape */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 ${
                        isCompleted
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                          : isCurrentStep
                          ? "text-white shadow-lg ring-4 ring-opacity-30 group-hover:scale-110 group-hover:ring-opacity-50"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                      }`}
                      style={isCurrentStep ? {
                        backgroundColor: step.color || '#3B82F6',
                        '--tw-ring-color': step.color || '#3B82F6',
                        boxShadow: `0 10px 25px -5px ${step.color || '#3B82F6'}40`,
                      } : {}}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.step
                      )}
                    </div>

                    {/* Nom de l'étape */}
                    <p className={`text-sm mt-3 font-semibold text-center px-1 ${
                      step.step <= dossier.currentStep
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    } ${isClickable ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}`}>
                      {step.name}
                    </p>

                    {/* Description */}
                    <p className={`text-xs mt-1 text-center px-2 max-w-[150px] leading-relaxed ${
                      isCurrentStep
                        ? "text-gray-700 dark:text-gray-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.description}
                    </p>

                    {/* Indicateur "Cliquez pour valider" pour l'étape courante ou "Terminé" si approuvé */}
                    {isCurrentStep && dossier.status !== 'APPROVED' && (
                      <span className="mt-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        Cliquez pour valider
                      </span>
                    )}
                    {isCurrentStep && dossier.status === 'APPROVED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/api/guichet-unique/dossiers/${params.id}/certificate`, '_blank');
                        }}
                        className="mt-2 text-xs px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Voir le certificat
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Chargement des etapes...</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {[
            { id: "overview", label: "Apercu", icon: FolderOpen },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "timeline", label: "Historique", icon: History },
            { id: "comments", label: "Commentaires", icon: MessageSquare },
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
              {tab.id === "comments" && dossier.comments.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {dossier.comments.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations du Projet</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white mt-1">{dossier.projectDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Secteur</p>
                    <p className="text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                      <Factory className="w-4 h-4 text-gray-400" />
                      {dossier.sector}
                    </p>
                    <p className="text-xs text-gray-400">{dossier.subSector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Localisation</p>
                    <p className="text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {dossier.city}, {dossier.province}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de debut</p>
                    <p className="text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(dossier.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date de fin prevue</p>
                    <p className="text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(dossier.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details de l'Investissement</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex flex-col h-full min-h-[100px]">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-600 dark:text-green-400">Montant</span>
                  </div>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300 mt-auto">
                    {formatAmount(dossier.amount, dossier.currency)}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex flex-col h-full min-h-[100px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">Emplois directs</span>
                  </div>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-auto">
                    {dossier.jobsCreated.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 flex flex-col h-full min-h-[100px]">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-purple-600 dark:text-purple-400">Emplois indirects</span>
                  </div>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-auto">
                    {dossier.jobsIndirect.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Investor Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investisseur</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  {dossier.investorType === "company" ? (
                    <Building2 className="w-7 h-7 text-white" />
                  ) : (
                    <User className="w-7 h-7 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{dossier.investorName}</p>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    {dossier.investorType === "company" ? "Societe" : "Individuel"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{dossier.investorEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{dossier.investorPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{dossier.investorCountry}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{dossier.investorAddress}</span>
                </div>
              </div>
            </div>

            {/* Ministère responsable */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ministère responsable</h3>
              {dossier.ministry ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{dossier.ministry.name}</p>
                    {dossier.ministry.shortName && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-700 dark:text-indigo-300">
                        {dossier.ministry.shortName}
                      </span>
                    )}
                    {dossier.ministry.code && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Code: {dossier.ministry.code}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <Landmark className="w-5 h-5" />
                  <span className="text-sm italic">Aucun ministère assigné</span>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dates cles</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex justify-between flex-1">
                    <span className="text-gray-500 dark:text-gray-400">Soumis le</span>
                    <span className="text-gray-900 dark:text-white font-medium">{formatDate(dossier.submittedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div className="flex justify-between flex-1">
                    <span className="text-gray-500 dark:text-gray-400">Derniere MAJ</span>
                    <span className="text-gray-900 dark:text-white font-medium">{formatDate(dossier.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex justify-between flex-1">
                    <span className="text-gray-500 dark:text-gray-400">Debut projet</span>
                    <span className="text-gray-900 dark:text-white font-medium">{formatDate(dossier.startDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex justify-between flex-1">
                    <span className="text-gray-500 dark:text-gray-400">Fin prevue</span>
                    <span className="text-gray-900 dark:text-white font-medium">{formatDate(dossier.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documents ({dossier.documents.length})</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-200"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Ajouter un document
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dossier.documents.map((doc, index) => {
              const categoryInfo = documentCategoryConfig[doc.category] || documentCategoryConfig.OTHER;
              return (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.type === 'PDF' || doc.name.endsWith('.pdf')
                        ? 'bg-red-100 dark:bg-red-900/30'
                        : doc.type === 'XLSX' || doc.name.endsWith('.xlsx') || doc.name.endsWith('.xls')
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        doc.type === 'PDF' || doc.name.endsWith('.pdf')
                          ? 'text-red-600 dark:text-red-400'
                          : doc.type === 'XLSX' || doc.name.endsWith('.xlsx') || doc.name.endsWith('.xls')
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} - {formatDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDocumentPreview(doc)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Visualiser"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Telecharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Historique du dossier</h3>
          <div className="space-y-6">
            {dossier.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    event.status === "success" ? "bg-green-500" :
                    event.status === "error" ? "bg-red-500" : "bg-blue-500"
                  }`} />
                  {index < dossier.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-600 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{event.action}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{event.user}</span>
                    <span>•</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {event.note && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg italic">
                      "{event.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "comments" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Commentaires</h3>
          </div>

          {/* Add Comment */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">YM</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dossier.comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                      {comment.user.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{comment.user}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.date)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modifier le dossier</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Nom du projet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={editFormData.projectName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, projectName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editFormData.projectDescription || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, projectDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Ministère responsable - NOUVEAU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-indigo-500" />
                    <span>Ministère responsable</span>
                  </div>
                </label>
                <select
                  value={editFormData.ministryId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, ministryId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">-- Aucun ministère assigné --</option>
                  {ministries.map((ministry) => (
                    <option key={ministry.id} value={ministry.id}>
                      {ministry.name} {ministry.shortName ? `(${ministry.shortName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secteur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secteur
                </label>
                <input
                  type="text"
                  value={editFormData.sector || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, sector: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Province, Ville, Commune en cascade */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Province
                  </label>
                  <select
                    value={editFormData.provinceId || ''}
                    onChange={(e) => {
                      const province = provinces.find(p => p.id === e.target.value);
                      setEditFormData({
                        ...editFormData,
                        provinceId: e.target.value,
                        province: province?.name || '',
                        cityId: '',
                        city: '',
                        communeId: '',
                        commune: '',
                      });
                      setEditCommunes([]);
                    }}
                    disabled={loadingProvinces}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">
                      {loadingProvinces ? 'Chargement...' : 'Selectionnez'}
                    </option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>{prov.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ville
                  </label>
                  <select
                    value={editFormData.cityId || ''}
                    onChange={(e) => {
                      const city = editCities.find(c => c.id === e.target.value);
                      setEditFormData({
                        ...editFormData,
                        cityId: e.target.value,
                        city: city?.name || '',
                        communeId: '',
                        commune: '',
                      });
                    }}
                    disabled={!editFormData.provinceId || loadingEditCities}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">
                      {loadingEditCities
                        ? 'Chargement...'
                        : !editFormData.provinceId
                          ? 'Province d\'abord'
                          : 'Selectionnez'}
                    </option>
                    {editCities.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Commune
                  </label>
                  <select
                    value={editFormData.communeId || ''}
                    onChange={(e) => {
                      const commune = editCommunes.find(c => c.id === e.target.value);
                      setEditFormData({
                        ...editFormData,
                        communeId: e.target.value,
                        commune: commune?.name || '',
                      });
                    }}
                    disabled={!editFormData.cityId || loadingEditCommunes}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">
                      {loadingEditCommunes
                        ? 'Chargement...'
                        : !editFormData.cityId
                          ? 'Ville d\'abord'
                          : editCommunes.length === 0
                            ? 'Aucune commune'
                            : 'Selectionnez'}
                    </option>
                    {editCommunes.map((commune) => (
                      <option key={commune.id} value={commune.id}>{commune.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  value={editFormData.status || 'DRAFT'}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(statusConfig).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              {/* Montant et Emplois */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Montant (USD)
                  </label>
                  <input
                    type="number"
                    value={editFormData.amount || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emplois directs
                  </label>
                  <input
                    type="number"
                    value={editFormData.jobsCreated || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, jobsCreated: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emplois indirects
                  </label>
                  <input
                    type="number"
                    value={editFormData.jobsIndirect || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, jobsIndirect: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={editFormData.startDate || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de fin prévue
                  </label>
                  <input
                    type="date"
                    value={editFormData.endDate || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Footer avec barre de progression */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              {/* Progress bar when saving */}
              {saving && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Enregistrement en cours...
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Veuillez patienter</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-2.5 rounded-full animate-progress-bar"></div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center min-w-[140px] justify-center"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation de document */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2">
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ${
            isFullscreen
              ? 'w-full h-full max-w-none max-h-none rounded-none'
              : 'max-w-5xl w-full max-h-[90vh]'
          }`}>
            {/* Header du modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  previewDocument.type === 'PDF' || previewDocument.name.endsWith('.pdf')
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : previewDocument.type === 'XLSX' || previewDocument.name.endsWith('.xlsx') || previewDocument.name.endsWith('.xls')
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    previewDocument.type === 'PDF' || previewDocument.name.endsWith('.pdf')
                      ? 'text-red-600'
                      : previewDocument.type === 'XLSX' || previewDocument.name.endsWith('.xlsx') || previewDocument.name.endsWith('.xls')
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{previewDocument.name}</h3>
                  <p className="text-sm text-gray-500">{previewDocument.type || 'Document'} • {previewDocument.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isFullscreen ? "Reduire" : "Plein ecran"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => downloadDocument(previewDocument)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Telecharger"
                >
                  <Download className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => {
                    closeDocumentPreview();
                    setIsFullscreen(false);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Fermer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Contenu de prévisualisation */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
              {previewDocument.type === "PDF" || previewDocument.name.endsWith('.pdf') ? (
                <div className="w-full h-full min-h-[600px]">
                  {/* Aperçu PDF avec iframe */}
                  <iframe
                    src={previewDocument.id ? `/api/documents/${previewDocument.id}/view` : `/api/documents/mock-${encodeURIComponent(previewDocument.name)}/view`}
                    className="w-full h-full min-h-[600px] border-0"
                    title={previewDocument.name}
                  />
                </div>
              ) : previewDocument.type === "XLSX" || previewDocument.name.endsWith('.xlsx') || previewDocument.name.endsWith('.xls') ? (
                <div className="w-full h-full min-h-[500px] flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {previewDocument.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Fichier Excel - {previewDocument.size}
                    </p>
                    <button
                      onClick={() => downloadDocument(previewDocument)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Telecharger pour ouvrir
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[500px] flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {previewDocument.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Apercu non disponible pour ce type de fichier
                    </p>
                    <button
                      onClick={() => downloadDocument(previewDocument)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Telecharger le fichier
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer du modal */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Uploade le {formatDate(previewDocument.uploadedAt)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeDocumentPreview}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Fermer
                </button>
                <button
                  onClick={() => downloadDocument(previewDocument)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Telecharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'upload de document */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ajouter un document</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadName('');
                  setUploadDescription('');
                  setUploadCategory('OTHER');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Zone de depot de fichier */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  uploadFile
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploadFile(file);
                      if (!uploadName) setUploadName(file.name);
                    }
                  }}
                />
                {uploadFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{uploadFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(uploadFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-300">Cliquez pour selectionner un fichier</p>
                    <p className="text-sm text-gray-400 mt-1">PDF, Word, Excel, Images (max 10MB)</p>
                  </>
                )}
              </div>

              {/* Nom du document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du document
                </label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Nom du document"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Categorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categorie
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="RCCM">RCCM</option>
                  <option value="ID_NATIONAL">ID National</option>
                  <option value="NIF">NIF</option>
                  <option value="BUSINESS_PLAN">Business Plan</option>
                  <option value="FINANCIAL_PROOF">Preuve Financiere</option>
                  <option value="TECHNICAL_STUDY">Etude Technique</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Description du document..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadName('');
                  setUploadDescription('');
                  setUploadCategory('OTHER');
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleUploadDocument}
                disabled={!uploadFile || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Paperclip className="w-4 h-4 mr-2" />
                    Uploader
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de validation d'étape */}
      {showStepModal && selectedStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedStep.color || '#3B82F6' }}
                >
                  {selectedStep.step}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Valider l'étape
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedStep.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Attention:</strong> En validant cette étape, le dossier passera à l'étape suivante.
                  {selectedStep.step === workflowSteps.length && (
                    <span className="block mt-1 text-green-600 dark:text-green-400">
                      C'est la dernière étape. Le dossier sera marqué comme <strong>Approuvé</strong>.
                    </span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note de validation (optionnel)
                </label>
                <textarea
                  value={stepNote}
                  onChange={(e) => setStepNote(e.target.value)}
                  placeholder="Ajoutez une note pour cette validation..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Informations sur l'étape suivante */}
              {selectedStep.step < workflowSteps.length && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Prochaine étape</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {workflowSteps[selectedStep.step]?.name || 'Étape suivante'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowStepModal(false);
                  setSelectedStep(null);
                  setStepNote('');
                }}
                disabled={validatingStep}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleValidateStep}
                disabled={validatingStep}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {validatingStep ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Validation...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Valider l'étape
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
