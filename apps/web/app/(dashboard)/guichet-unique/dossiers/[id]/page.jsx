"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

const workflowSteps = [
  { step: 1, name: "Soumission", description: "Depot du dossier" },
  { step: 2, name: "Verification", description: "Controle documents" },
  { step: 3, name: "Examen Technique", description: "Analyse technique" },
  { step: 4, name: "Examen Juridique", description: "Validation legale" },
  { step: 5, name: "Commission", description: "Decision finale" },
  { step: 6, name: "Agrement", description: "Delivrance" },
];

export default function DossierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newComment, setNewComment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDossier({ ...mockDossier, id: params.id });
      setLoading(false);
    }, 500);
  }, [params.id]);

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
  const progress = (dossier.currentStep / dossier.totalSteps) * 100;

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
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </button>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Progression du dossier</h3>
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => (
            <div key={step.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step.step < dossier.currentStep
                      ? "bg-green-500 text-white"
                      : step.step === dossier.currentStep
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.step < dossier.currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.step
                  )}
                </div>
                <p className={`text-xs mt-2 font-medium ${
                  step.step <= dossier.currentStep
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{step.description}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  step.step < dossier.currentStep
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-600"
                }`} />
              )}
            </div>
          ))}
        </div>
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
            <button className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-200">
              <Paperclip className="w-4 h-4 mr-2" />
              Ajouter un document
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dossier.documents.map((doc, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} - {formatDate(doc.uploadedAt)}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
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
                    event.status === "success" ? "bg-green-500" : "bg-blue-500"
                  }`} />
                  {index < dossier.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-600 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{event.action}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{event.user}</span>
                    <span>•</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modifier le dossier</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du projet
                </label>
                <input
                  type="text"
                  defaultValue={dossier.projectName}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  defaultValue={dossier.projectDescription}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Montant (USD)
                  </label>
                  <input
                    type="number"
                    defaultValue={dossier.amount}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <select
                    defaultValue={dossier.status}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(statusConfig).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emplois directs
                  </label>
                  <input
                    type="number"
                    defaultValue={dossier.jobsCreated}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emplois indirects
                  </label>
                  <input
                    type="number"
                    defaultValue={dossier.jobsIndirect}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Save logic here
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
