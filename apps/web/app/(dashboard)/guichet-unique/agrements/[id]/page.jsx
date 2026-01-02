"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  FileCheck,
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Send,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  RotateCcw,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  Hash,
  DollarSign,
  Users,
  Briefcase,
  Shield,
  Eye,
  Printer,
  Share2,
  MoreVertical,
  CheckCheck,
  XOctagon,
  HelpCircle,
  History,
} from "lucide-react";

// Configurations (memes que la page liste)
const approvalTypes = {
  AGREMENT_REGIME: { label: "Agrement au Regime", color: "bg-purple-100 text-purple-700", bgColor: "bg-purple-500" },
  EXONERATION_FISCALE: { label: "Exoneration Fiscale", color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-500" },
  LICENCE_EXPLOITATION: { label: "Licence d'Exploitation", color: "bg-green-100 text-green-700", bgColor: "bg-green-500" },
  PERMIS_CONSTRUCTION: { label: "Permis de Construction", color: "bg-orange-100 text-orange-700", bgColor: "bg-orange-500" },
  AUTORISATION_IMPORT: { label: "Autorisation Import", color: "bg-cyan-100 text-cyan-700", bgColor: "bg-cyan-500" },
};

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-700", icon: FileText },
  SUBMITTED: { label: "Soumise", color: "bg-blue-100 text-blue-700", icon: Clock },
  UNDER_REVIEW: { label: "En examen", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  PENDING_INFO: { label: "Info requise", color: "bg-orange-100 text-orange-700", icon: AlertCircle },
  APPROVED: { label: "Approuvee", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  REJECTED: { label: "Rejetee", color: "bg-red-100 text-red-700", icon: XCircle },
  REVISION: { label: "En revision", color: "bg-purple-100 text-purple-700", icon: RotateCcw },
};

const priorityConfig = {
  LOW: { label: "Basse", color: "bg-gray-100 text-gray-600" },
  NORMAL: { label: "Normale", color: "bg-blue-100 text-blue-600" },
  HIGH: { label: "Haute", color: "bg-orange-100 text-orange-600" },
  URGENT: { label: "Urgente", color: "bg-red-100 text-red-600" },
};

// Donnees mock (memes IDs que la page liste)
const mockApprovals = {
  "1": {
    id: "1",
    requestNumber: "AGR-2024-00089",
    investorName: "Congo Mining Corporation",
    investorType: "company",
    approvalType: "AGREMENT_REGIME",
    description: "Demande d'agrement au regime preferentiel pour projet minier dans la province du Katanga. Ce projet vise l'extraction et le traitement de minerais de cuivre et de cobalt.",
    status: "UNDER_REVIEW",
    priority: "HIGH",
    submittedAt: "2024-01-15",
    dueDate: "2024-02-15",
    assignedTo: { name: "Jean Kabila", email: "jean.kabila@anapi.cd", role: "Analyste Senior" },
    currentStep: "Examen technique",
    investorDetails: {
      rccm: "CD/KIN/RCCM/24-A-00456",
      idNat: "01-100-N78542K",
      nif: "A2400789",
      address: "123 Avenue du Commerce, Gombe, Kinshasa",
      phone: "+243 999 123 456",
      email: "contact@congomining.cd",
      website: "www.congomining.cd",
      sector: "Mines et extraction",
      employeesCount: 250,
      capital: "5,000,000 USD",
      representative: "Pierre Mutombo, Directeur General",
    },
    projectDetails: {
      title: "Projet Minier Katanga Sud",
      location: "Province du Katanga",
      investmentAmount: "25,000,000 USD",
      jobsCreated: 500,
      duration: "10 ans",
      startDate: "2024-06-01",
    },
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-15", completedBy: "Systeme" },
      { name: "Verification documents", status: "completed", completedAt: "2024-01-17", completedBy: "Marie Lumumba" },
      { name: "Examen technique", status: "in_progress", startedAt: "2024-01-18", assignedTo: "Jean Kabila" },
      { name: "Examen juridique", status: "pending" },
      { name: "Decision finale", status: "pending" },
    ],
    documents: [
      { id: "d1", name: "Statuts de la societe.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2024-01-15", status: "verified" },
      { id: "d2", name: "RCCM.pdf", type: "PDF", size: "1.1 MB", uploadedAt: "2024-01-15", status: "verified" },
      { id: "d3", name: "Etude d'impact environnemental.pdf", type: "PDF", size: "15.8 MB", uploadedAt: "2024-01-15", status: "pending" },
      { id: "d4", name: "Business Plan.pdf", type: "PDF", size: "8.2 MB", uploadedAt: "2024-01-15", status: "verified" },
      { id: "d5", name: "Preuve de capital.pdf", type: "PDF", size: "3.5 MB", uploadedAt: "2024-01-15", status: "verified" },
    ],
    comments: [
      { id: "c1", author: "Marie Lumumba", role: "Agent de verification", date: "2024-01-17", content: "Tous les documents requis sont presents et conformes. Dossier transmis pour examen technique.", type: "note" },
      { id: "c2", author: "Jean Kabila", role: "Analyste Senior", date: "2024-01-18", content: "Analyse technique en cours. Etude d'impact environnemental necessaire avant decision.", type: "note" },
    ],
    history: [
      { date: "2024-01-15 09:30", action: "Demande soumise", user: "Congo Mining Corporation" },
      { date: "2024-01-15 14:00", action: "Assignee pour verification", user: "Systeme" },
      { date: "2024-01-17 11:15", action: "Documents verifies", user: "Marie Lumumba" },
      { date: "2024-01-18 08:45", action: "Examen technique demarre", user: "Jean Kabila" },
    ],
  },
  "2": {
    id: "2",
    requestNumber: "AGR-2024-00088",
    investorName: "AgroTech RDC SARL",
    investorType: "company",
    approvalType: "EXONERATION_FISCALE",
    description: "Demande d'exoneration fiscale pour importation d'equipements agricoles modernes destines a l'agriculture de precision.",
    status: "PENDING_INFO",
    priority: "NORMAL",
    submittedAt: "2024-01-12",
    dueDate: "2024-02-12",
    assignedTo: { name: "Marie Lumumba", email: "marie.lumumba@anapi.cd", role: "Agent de verification" },
    currentStep: "Documents manquants",
    investorDetails: {
      rccm: "CD/KIN/RCCM/23-B-00123",
      idNat: "01-200-N45678K",
      nif: "A2300456",
      address: "45 Boulevard du 30 Juin, Kinshasa",
      phone: "+243 815 789 012",
      email: "info@agrotechrdc.cd",
      website: "www.agrotechrdc.cd",
      sector: "Agriculture",
      employeesCount: 85,
      capital: "1,500,000 USD",
      representative: "Jean-Claude Mbeki, CEO",
    },
    projectDetails: {
      title: "Modernisation Agricole Bandundu",
      location: "Province de Bandundu",
      investmentAmount: "3,500,000 USD",
      jobsCreated: 150,
      duration: "5 ans",
      startDate: "2024-04-01",
    },
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-12", completedBy: "Systeme" },
      { name: "Verification documents", status: "pending" },
      { name: "Examen fiscal", status: "pending" },
      { name: "Decision finale", status: "pending" },
    ],
    documents: [
      { id: "d1", name: "Statuts SARL.pdf", type: "PDF", size: "1.8 MB", uploadedAt: "2024-01-12", status: "verified" },
      { id: "d2", name: "Liste equipements.xlsx", type: "Excel", size: "0.5 MB", uploadedAt: "2024-01-12", status: "verified" },
    ],
    comments: [
      { id: "c1", author: "Marie Lumumba", role: "Agent", date: "2024-01-14", content: "Documents incomplets. Certificat d'origine des equipements manquant.", type: "request" },
    ],
    history: [
      { date: "2024-01-12 10:00", action: "Demande soumise", user: "AgroTech RDC SARL" },
      { date: "2024-01-14 16:30", action: "Documents supplementaires demandes", user: "Marie Lumumba" },
    ],
  },
  "3": {
    id: "3",
    requestNumber: "AGR-2024-00087",
    investorName: "TechInvest Africa Ltd",
    investorType: "company",
    approvalType: "LICENCE_EXPLOITATION",
    description: "Licence d'exploitation pour centre de donnees de derniere generation a Kinshasa.",
    status: "APPROVED",
    priority: "NORMAL",
    submittedAt: "2024-01-08",
    dueDate: "2024-02-08",
    assignedTo: { name: "Pierre Tshisekedi", email: "pierre.tshisekedi@anapi.cd", role: "Directeur" },
    currentStep: "Termine",
    investorDetails: {
      rccm: "CD/KIN/RCCM/23-C-00789",
      idNat: "01-300-N12345K",
      nif: "A2301234",
      address: "78 Avenue de la Science, Kinshasa",
      phone: "+243 812 345 678",
      email: "contact@techinvest.africa",
      website: "www.techinvest.africa",
      sector: "Technologies de l'information",
      employeesCount: 120,
      capital: "10,000,000 USD",
      representative: "Samuel Okonkwo, Managing Director",
    },
    projectDetails: {
      title: "Data Center Kinshasa One",
      location: "Zone economique speciale de Kinshasa",
      investmentAmount: "50,000,000 USD",
      jobsCreated: 200,
      duration: "20 ans",
      startDate: "2024-03-01",
    },
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-08", completedBy: "Systeme" },
      { name: "Verification documents", status: "completed", completedAt: "2024-01-10", completedBy: "Marie Lumumba" },
      { name: "Examen technique", status: "completed", completedAt: "2024-01-15", completedBy: "Jean Kabila" },
      { name: "Decision finale", status: "completed", completedAt: "2024-01-18", completedBy: "Pierre Tshisekedi" },
    ],
    documents: [
      { id: "d1", name: "Business Plan Complet.pdf", type: "PDF", size: "25 MB", uploadedAt: "2024-01-08", status: "verified" },
      { id: "d2", name: "Etude de faisabilite.pdf", type: "PDF", size: "18 MB", uploadedAt: "2024-01-08", status: "verified" },
      { id: "d3", name: "Certificats.zip", type: "Archive", size: "5 MB", uploadedAt: "2024-01-08", status: "verified" },
    ],
    comments: [
      { id: "c1", author: "Pierre Tshisekedi", role: "Directeur", date: "2024-01-18", content: "Dossier approuve. Projet strategique pour le developpement numerique du pays.", type: "decision" },
    ],
    history: [
      { date: "2024-01-08 08:00", action: "Demande soumise", user: "TechInvest Africa Ltd" },
      { date: "2024-01-10 15:00", action: "Documents verifies", user: "Marie Lumumba" },
      { date: "2024-01-15 17:30", action: "Examen technique complete", user: "Jean Kabila" },
      { date: "2024-01-18 10:00", action: "Demande APPROUVEE", user: "Pierre Tshisekedi" },
    ],
  },
  "4": {
    id: "4",
    requestNumber: "AGR-2024-00086",
    investorName: "Jean-Pierre Mukendi",
    investorType: "individual",
    approvalType: "PERMIS_CONSTRUCTION",
    description: "Permis de construction pour hotel touristique 4 etoiles dans la ville de Goma.",
    status: "SUBMITTED",
    priority: "URGENT",
    submittedAt: "2024-01-20",
    dueDate: "2024-01-30",
    assignedTo: { name: "Non assigne", email: "", role: "" },
    currentStep: "En attente d'assignation",
    investorDetails: {
      idNat: "01-400-N98765K",
      nif: "P2400123",
      address: "25 Avenue Nyiragongo, Goma",
      phone: "+243 998 765 432",
      email: "jpmukendi@gmail.com",
      sector: "Tourisme et hotellerie",
      capital: "2,000,000 USD",
    },
    projectDetails: {
      title: "Hotel Kivu Palace",
      location: "Goma, Nord-Kivu",
      investmentAmount: "8,000,000 USD",
      jobsCreated: 120,
      duration: "3 ans (construction)",
      startDate: "2024-06-01",
    },
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-20", completedBy: "Systeme" },
      { name: "Assignation", status: "pending" },
      { name: "Examen urbanistique", status: "pending" },
      { name: "Decision finale", status: "pending" },
    ],
    documents: [
      { id: "d1", name: "Plans architecturaux.pdf", type: "PDF", size: "45 MB", uploadedAt: "2024-01-20", status: "pending" },
      { id: "d2", name: "Titre foncier.pdf", type: "PDF", size: "2 MB", uploadedAt: "2024-01-20", status: "pending" },
    ],
    comments: [],
    history: [
      { date: "2024-01-20 11:00", action: "Demande soumise", user: "Jean-Pierre Mukendi" },
    ],
  },
  "5": {
    id: "5",
    requestNumber: "AGR-2024-00085",
    investorName: "Congo Cement Industries",
    investorType: "company",
    approvalType: "AUTORISATION_IMPORT",
    description: "Autorisation d'importation d'equipements industriels pour cimenterie.",
    status: "REJECTED",
    priority: "HIGH",
    submittedAt: "2024-01-05",
    dueDate: "2024-02-05",
    assignedTo: { name: "Marie Lumumba", email: "marie.lumumba@anapi.cd", role: "Agent" },
    currentStep: "Rejete",
    investorDetails: {
      rccm: "CD/KIN/RCCM/22-D-00567",
      idNat: "01-500-N11111K",
      nif: "A2200567",
      address: "Zone industrielle de Limete, Kinshasa",
      phone: "+243 811 222 333",
      email: "import@congocement.cd",
      sector: "Industrie lourde",
      employeesCount: 450,
      capital: "20,000,000 USD",
      representative: "Albert Ngoy, DG",
    },
    projectDetails: {
      title: "Extension Usine Limete",
      location: "Limete, Kinshasa",
      investmentAmount: "15,000,000 USD",
      jobsCreated: 80,
      duration: "2 ans",
      startDate: "2024-04-01",
    },
    steps: [
      { name: "Reception", status: "completed", completedAt: "2024-01-05", completedBy: "Systeme" },
      { name: "Verification documents", status: "completed", completedAt: "2024-01-07", completedBy: "Marie Lumumba" },
      { name: "Examen douanier", status: "completed", completedAt: "2024-01-10", completedBy: "Service Douanes" },
      { name: "Decision finale", status: "rejected", completedAt: "2024-01-12", completedBy: "Comite" },
    ],
    documents: [
      { id: "d1", name: "Liste equipements.pdf", type: "PDF", size: "3 MB", uploadedAt: "2024-01-05", status: "verified" },
      { id: "d2", name: "Proforma factures.pdf", type: "PDF", size: "8 MB", uploadedAt: "2024-01-05", status: "verified" },
    ],
    comments: [
      { id: "c1", author: "Comite d'examen", role: "Commission", date: "2024-01-12", content: "Demande rejetee. Les equipements mentionnes sont disponibles localement. Priere de privilegier la production nationale.", type: "decision" },
    ],
    history: [
      { date: "2024-01-05 09:00", action: "Demande soumise", user: "Congo Cement Industries" },
      { date: "2024-01-07 14:00", action: "Documents verifies", user: "Marie Lumumba" },
      { date: "2024-01-10 16:00", action: "Examen douanier termine", user: "Service Douanes" },
      { date: "2024-01-12 11:00", action: "Demande REJETEE", user: "Comite d'examen" },
    ],
  },
};

export default function AgrementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newComment, setNewComment] = useState("");
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [actionModal, setActionModal] = useState({ type: null, isOpen: false });
  const [actionComment, setActionComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fonctions pour les actions
  const openActionModal = (type) => {
    setActionModal({ type, isOpen: true });
    setActionComment("");
  };

  const closeActionModal = () => {
    setActionModal({ type: null, isOpen: false });
    setActionComment("");
  };

  const handleAction = async () => {
    if (!actionModal.type) return;

    setActionLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour le statut localement
      const newStatus = actionModal.type === 'approve' ? 'APPROVED'
        : actionModal.type === 'reject' ? 'REJECTED'
        : 'PENDING_INFO';

      const actionText = actionModal.type === 'approve' ? 'Demande APPROUVEE'
        : actionModal.type === 'reject' ? 'Demande REJETEE'
        : 'Informations supplementaires demandees';

      setApproval(prev => ({
        ...prev,
        status: newStatus,
        history: [
          { date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: actionText, user: 'Yves Mpunga' },
          ...prev.history
        ],
        comments: actionComment ? [
          { id: Date.now().toString(), author: 'Yves Mpunga', role: 'Administrateur', date: new Date().toISOString().split('T')[0], content: actionComment, type: 'decision' },
          ...prev.comments
        ] : prev.comments
      }));

      closeActionModal();

      // Afficher une notification de succès avec SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Action effectuee',
        text: `${actionText} avec succes!`,
        confirmButtonColor: actionModal.type === 'approve' ? '#16a34a' :
                           actionModal.type === 'reject' ? '#dc2626' : '#ea580c',
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error performing action:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'action',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setActionLoading(false);
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
    window.open(`/api/documents/${doc.id}/download`, '_blank');
  };

  // Charger les etapes de workflow depuis la configuration
  useEffect(() => {
    const fetchWorkflowSteps = async () => {
      try {
        const response = await fetch('/api/config/workflow-steps?type=AGREMENT');
        if (response.ok) {
          const data = await response.json();
          setWorkflowSteps(data.steps || []);
        }
      } catch (error) {
        console.error('Error fetching workflow steps:', error);
      }
    };
    fetchWorkflowSteps();
  }, []);

  useEffect(() => {
    // Simuler le chargement des donnees
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        const data = mockApprovals[params.id];
        setApproval(data || null);
        setLoading(false);
      }, 300);
    };
    loadData();
  }, [params.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Verifie</span>;
      case "pending":
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">En attente</span>;
      case "rejected":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Rejete</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileCheck className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Demande non trouvee
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          La demande d'agrement que vous recherchez n'existe pas ou a ete supprimee.
        </p>
        <Link
          href="/guichet-unique/agrements"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const status = statusConfig[approval.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;
  const type = approvalTypes[approval.approvalType];
  const priority = priorityConfig[approval.priority];
  const daysRemaining = getDaysRemaining(approval.dueDate);
  const completedSteps = approval.steps.filter((s) => s.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Type Badge - Titre principal */}
      <div className={`inline-flex items-center px-4 py-2 rounded-xl text-base font-semibold ${type?.color || 'bg-gray-100 text-gray-700'}`}>
        <Shield className="w-5 h-5 mr-2" />
        {type?.label || approval.approvalType}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/guichet-unique/agrements"
            className="mt-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {approval.requestNumber}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${status.color}`}>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                {status.label}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${priority.color}`}>
                {priority.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Soumis le {formatDate(approval.submittedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Printer className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>

          {/* Actions selon le statut */}
          {(approval.status === "UNDER_REVIEW" || approval.status === "SUBMITTED") && (
            <>
              <button
                onClick={() => openActionModal('request_info')}
                className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Demander infos
              </button>
              <button
                onClick={() => openActionModal('reject')}
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <XOctagon className="w-4 h-4 mr-2" />
                Rejeter
              </button>
              <button
                onClick={() => openActionModal('approve')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Approuver
              </button>
            </>
          )}
          {approval.status === "PENDING_INFO" && (
            <>
              <button
                onClick={() => openActionModal('reject')}
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <XOctagon className="w-4 h-4 mr-2" />
                Rejeter
              </button>
              <button
                onClick={() => openActionModal('approve')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Approuver
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="border-b border-gray-100 dark:border-gray-700">
              <nav className="flex -mb-px">
                {[
                  { id: "overview", label: "Apercu", icon: Eye },
                  { id: "documents", label: "Documents", icon: FileText },
                  { id: "comments", label: "Commentaires", icon: MessageSquare },
                  { id: "history", label: "Historique", icon: History },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === "documents" && (
                      <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                        {approval.documents.length}
                      </span>
                    )}
                    {tab.id === "comments" && approval.comments.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                        {approval.comments.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                    <p className="text-gray-900 dark:text-white">{approval.description}</p>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Details du projet</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Titre</p>
                          <p className="font-medium text-gray-900 dark:text-white">{approval.projectDetails.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Localisation</p>
                          <p className="font-medium text-gray-900 dark:text-white">{approval.projectDetails.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Investissement</p>
                          <p className="font-medium text-gray-900 dark:text-white">{approval.projectDetails.investmentAmount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Emplois crees</p>
                          <p className="font-medium text-gray-900 dark:text-white">{approval.projectDetails.jobsCreated}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investor Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Informations de l'investisseur</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          {approval.investorType === "company" ? (
                            <Building2 className="w-6 h-6 text-blue-600" />
                          ) : (
                            <User className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{approval.investorName}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{approval.investorDetails.sector}</p>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            {approval.investorDetails.rccm && (
                              <div className="flex items-center gap-2 text-sm">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-500">RCCM:</span>
                                <span className="text-gray-900 dark:text-white">{approval.investorDetails.rccm}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">ID Nat:</span>
                              <span className="text-gray-900 dark:text-white">{approval.investorDetails.idNat}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-white">{approval.investorDetails.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-white">{approval.investorDetails.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="space-y-3">
                  {approval.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} • {doc.size} • {formatDate(doc.uploadedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getDocumentStatusBadge(doc.status)}
                        <button
                          onClick={() => openDocumentPreview(doc)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                          title="Visualiser le document"
                        >
                          <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                          title="Telecharger le document"
                        >
                          <Download className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === "comments" && (
                <div className="space-y-4">
                  {approval.comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucun commentaire pour le moment</p>
                    </div>
                  ) : (
                    approval.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-600">
                            {comment.author.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.role}</span>
                            <span className="text-xs text-gray-400">• {formatDate(comment.date)}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Comment */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ajouter un commentaire..."
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="space-y-4">
                  {approval.history.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        {index < approval.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                        <p className="text-sm text-gray-500">
                          {item.user} • {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Progress Card - Etapes dynamiques */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Progression</h3>
            <div className="space-y-3">
              {(workflowSteps.length > 0 ? workflowSteps : approval.steps).map((step, index) => {
                // Determiner le statut de l'etape basé sur les données mock ou workflow
                const approvalStep = approval.steps.find(s => s.name.toLowerCase().includes(step.name?.toLowerCase()?.split(' ')[0]) || index < approval.steps.length && approval.steps[index]);
                const stepStatus = approvalStep?.status || (index < completedSteps ? "completed" : index === completedSteps ? "in_progress" : "pending");
                const stepData = approvalStep || step;

                return (
                  <div key={step.id || index} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        stepStatus === "completed" ? "bg-green-500" :
                        stepStatus === "in_progress" ? "" :
                        stepStatus === "rejected" ? "bg-red-500" :
                        "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={stepStatus === "in_progress" ? { backgroundColor: step.color || "#3B82F6" } : {}}
                    >
                      {stepStatus === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : stepStatus === "rejected" ? (
                        <XCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs text-white font-bold">{step.stepNumber || index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${
                        stepStatus === "completed" ? "text-green-600" :
                        stepStatus === "in_progress" ? "text-blue-600" :
                        stepStatus === "rejected" ? "text-red-600" :
                        "text-gray-500 dark:text-gray-400"
                      }`}>
                        {step.name}
                      </p>
                      {step.description && stepStatus !== "completed" && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">{step.description}</p>
                      )}
                      {stepData.completedAt && (
                        <p className="text-xs text-gray-500">{formatDate(stepData.completedAt)}</p>
                      )}
                      {stepStatus === "in_progress" && step.responsibleRole && (
                        <p className="text-xs text-gray-500">Responsable: {step.responsibleRole}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Progression</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {completedSteps}/{workflowSteps.length || approval.steps.length} etapes
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(completedSteps / (workflowSteps.length || approval.steps.length)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Deadline Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Echeance</h3>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                daysRemaining < 0 ? "bg-red-100" : daysRemaining <= 7 ? "bg-orange-100" : "bg-blue-100"
              }`}>
                <Calendar className={`w-6 h-6 ${
                  daysRemaining < 0 ? "text-red-600" : daysRemaining <= 7 ? "text-orange-600" : "text-blue-600"
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(approval.dueDate)}</p>
                <p className={`text-sm ${
                  daysRemaining < 0 ? "text-red-600" : daysRemaining <= 7 ? "text-orange-600" : "text-gray-500"
                }`}>
                  {daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} jours en retard`
                    : `${daysRemaining} jours restants`}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned To Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Assigne a</h3>
            {approval.assignedTo.name !== "Non assigne" ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {approval.assignedTo.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{approval.assignedTo.name}</p>
                  <p className="text-sm text-gray-500">{approval.assignedTo.role}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Non assigne</p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Assigner maintenant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de prévisualisation de document */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{previewDocument.name}</h3>
                  <p className="text-sm text-gray-500">{previewDocument.type} • {previewDocument.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getDocumentStatusBadge(previewDocument.status)}
                <button
                  onClick={() => downloadDocument(previewDocument)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Telecharger"
                >
                  <Download className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={closeDocumentPreview}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Fermer"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Contenu de prévisualisation */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
              {previewDocument.type === "PDF" || previewDocument.name.endsWith('.pdf') ? (
                <div className="w-full h-full min-h-[600px]">
                  {/* Aperçu PDF avec iframe - utilise l'URL du document */}
                  <iframe
                    src={`/api/documents/${previewDocument.id}/view`}
                    className="w-full h-full min-h-[600px] border-0"
                    title={previewDocument.name}
                  />
                </div>
              ) : previewDocument.type === "Excel" || previewDocument.name.endsWith('.xlsx') || previewDocument.name.endsWith('.xls') ? (
                <div className="w-full h-full min-h-[500px] flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {previewDocument.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Fichier Excel
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
              ) : previewDocument.name.endsWith('.zip') || previewDocument.type === "Archive" ? (
                <div className="w-full h-full min-h-[500px] flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Paperclip className="w-10 h-10 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {previewDocument.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Archive compressee
                    </p>
                    <button
                      onClick={() => downloadDocument(previewDocument)}
                      className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Telecharger l'archive
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

      {/* Modal d'action (Approuver, Rejeter, Demander infos) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            {/* Header */}
            <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
              actionModal.type === 'approve' ? 'bg-green-50 dark:bg-green-900/20' :
              actionModal.type === 'reject' ? 'bg-red-50 dark:bg-red-900/20' :
              'bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  actionModal.type === 'approve' ? 'bg-green-100 dark:bg-green-900/50' :
                  actionModal.type === 'reject' ? 'bg-red-100 dark:bg-red-900/50' :
                  'bg-orange-100 dark:bg-orange-900/50'
                }`}>
                  {actionModal.type === 'approve' ? (
                    <CheckCheck className={`w-6 h-6 text-green-600`} />
                  ) : actionModal.type === 'reject' ? (
                    <XOctagon className={`w-6 h-6 text-red-600`} />
                  ) : (
                    <HelpCircle className={`w-6 h-6 text-orange-600`} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {actionModal.type === 'approve' ? 'Approuver la demande' :
                     actionModal.type === 'reject' ? 'Rejeter la demande' :
                     'Demander des informations'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {approval?.requestNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {actionModal.type === 'approve'
                  ? 'Vous etes sur le point d\'approuver cette demande. Cette action est irreversible.'
                  : actionModal.type === 'reject'
                  ? 'Vous etes sur le point de rejeter cette demande. Veuillez fournir une justification.'
                  : 'Veuillez specifier les informations supplementaires requises.'}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {actionModal.type === 'approve' ? 'Commentaire (optionnel)' :
                   actionModal.type === 'reject' ? 'Motif du rejet *' :
                   'Informations demandees *'}
                </label>
                <textarea
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  rows={4}
                  placeholder={
                    actionModal.type === 'approve' ? 'Ajoutez un commentaire si necessaire...' :
                    actionModal.type === 'reject' ? 'Expliquez les raisons du rejet...' :
                    'Listez les documents ou informations manquantes...'
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {(actionModal.type === 'reject' || actionModal.type === 'request_info') && !actionComment && (
                <p className="text-sm text-red-500 mt-2">
                  Ce champ est obligatoire
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
              <button
                onClick={closeActionModal}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading || ((actionModal.type === 'reject' || actionModal.type === 'request_info') && !actionComment)}
                className={`inline-flex items-center px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionModal.type === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : actionModal.type === 'reject'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </>
                ) : (
                  <>
                    {actionModal.type === 'approve' ? (
                      <CheckCheck className="w-4 h-4 mr-2" />
                    ) : actionModal.type === 'reject' ? (
                      <XOctagon className="w-4 h-4 mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {actionModal.type === 'approve' ? 'Confirmer l\'approbation' :
                     actionModal.type === 'reject' ? 'Confirmer le rejet' :
                     'Envoyer la demande'}
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
