"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  FileCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  Building,
  Globe,
  Bell,
  Award,
  BarChart3,
  PieChart,
  Target,
  Users,
  MapPin,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Activity,
  Eye,
  Download,
  ExternalLink,
  Sparkles,
  TrendingDown,
  Wallet,
  Factory,
  Leaf,
  Sun,
  Mountain,
  Plane,
} from "lucide-react";
import { usePageTitle } from "../../contexts/PageTitleContext";

export default function InvestorLandingPage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // KPIs et statistiques de l'investisseur
  const [investorStats, setInvestorStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    totalInvestment: 0,
    employeesCreated: 0,
    taxBenefits: 0,
  });

  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    approvalRate: 0,
    avgProcessingDays: 0,
    complianceScore: 0,
    growthRate: 0,
  });

  useEffect(() => {
    setPageTitle("Accueil Investisseur");
  }, [setPageTitle]);

  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setInvestorStats({
        totalProjects: 5,
        activeProjects: 3,
        pendingApprovals: 2,
        approvedProjects: 2,
        rejectedProjects: 0,
        totalInvestment: 8500000,
        employeesCreated: 156,
        taxBenefits: 425000,
      });
      setPerformanceMetrics({
        approvalRate: 85,
        avgProcessingDays: 12,
        complianceScore: 92,
        growthRate: 23,
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Projets recents
  const recentProjects = [
    {
      id: 1,
      name: "Usine de transformation agricole",
      sector: "Agriculture",
      status: "approved",
      investment: 2500000,
      progress: 75,
      location: "Kasai",
      startDate: "2025-06-15",
    },
    {
      id: 2,
      name: "Centrale solaire Katanga",
      sector: "Energie",
      status: "pending",
      investment: 4000000,
      progress: 30,
      location: "Haut-Katanga",
      startDate: "2025-09-01",
    },
    {
      id: 3,
      name: "Hotel ecotouristique Virunga",
      sector: "Tourisme",
      status: "in_review",
      investment: 2000000,
      progress: 15,
      location: "Nord-Kivu",
      startDate: "2026-01-15",
    },
  ];

  // Demandes d'agrement
  const approvalRequests = [
    {
      id: 1,
      projectName: "Usine de transformation agricole",
      type: "Regime General",
      submittedDate: "2025-05-20",
      status: "approved",
      approvalDate: "2025-06-10",
    },
    {
      id: 2,
      projectName: "Centrale solaire Katanga",
      type: "Regime Preferentiel",
      submittedDate: "2025-11-15",
      status: "pending",
      currentStep: "Evaluation technique",
    },
    {
      id: 3,
      projectName: "Hotel ecotouristique Virunga",
      type: "Zone Economique Speciale",
      submittedDate: "2025-12-28",
      status: "in_review",
      currentStep: "Verification documents",
    },
  ];

  // Notifications importantes
  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Document requis",
      message: "Veuillez soumettre l'etude d'impact environnemental pour le projet Virunga",
      date: "Il y a 2 heures",
      urgent: true,
    },
    {
      id: 2,
      type: "success",
      title: "Agrement approuve",
      message: "Votre demande d'agrement pour l'usine agricole a ete approuvee",
      date: "Il y a 1 jour",
      urgent: false,
    },
    {
      id: 3,
      type: "info",
      title: "Rappel",
      message: "Rapport trimestriel a soumettre avant le 15 janvier 2026",
      date: "Il y a 3 jours",
      urgent: false,
    },
  ];

  // Secteurs d'opportunites
  const sectors = [
    { name: "Agriculture", icon: Leaf, growth: "+15%", projects: 120, color: "bg-green-500" },
    { name: "Energie", icon: Sun, growth: "+22%", projects: 85, color: "bg-yellow-500" },
    { name: "Mines", icon: Mountain, growth: "+8%", projects: 65, color: "bg-gray-600" },
    { name: "Tourisme", icon: Plane, growth: "+18%", projects: 45, color: "bg-blue-500" },
    { name: "Industrie", icon: Factory, growth: "+12%", projects: 78, color: "bg-purple-500" },
  ];

  // Avantages fiscaux
  const taxBenefits = [
    { title: "Exoneration impot", value: "10 ans", description: "Sur les benefices industriels et commerciaux" },
    { title: "Droits de douane", value: "0%", description: "Sur les equipements et materiels d'investissement" },
    { title: "TVA importation", value: "Exoneree", description: "Sur les biens d'equipement" },
    { title: "Rapatriement", value: "100%", description: "Libre rapatriement des benefices et capitaux" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Approuve" },
      pending: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", label: "En attente" },
      in_review: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "En cours" },
      rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Rejete" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de votre espace investisseur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628] rounded-2xl p-8 text-white shadow-xl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtdi00aC0ydjRoLTJ2LTJoLTR2NGgydjJoNHYtMmgyem0wLTMwdi0yaC0ydjJoLTR2Mmg0djRoMnYtNGgydi0yaC0yem0tMjQgMjhoMnYtNGgydi0ySDEydjJoLTJ2NGgydi0yaDJ6bTItMjRoMnYtMmgydi0yaC0ydi0yaC0ydjJoLTJ2Mmgydjh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-[#D4A853]/20 border border-[#D4A853]/30 rounded-full text-sm font-medium text-[#D4A853] mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Portail Investisseur ANAPI
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Bienvenue, {session?.user?.name || "Investisseur"}!
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Gerez vos investissements, suivez vos demandes d'agrement et decouvrez les opportunites en Republique Democratique du Congo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/investor/projects/new"
              className="inline-flex items-center px-5 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau projet
            </Link>
            <Link
              href="/investor/approvals/new"
              className="inline-flex items-center px-5 py-3 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              <FileCheck className="w-5 h-5 mr-2" />
              Demander agrement
            </Link>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="relative mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4A853]/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#D4A853]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{investorStats.totalProjects}</p>
                <p className="text-sm text-gray-300">Projets totaux</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{investorStats.approvedProjects}</p>
                <p className="text-sm text-gray-300">Agreees</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{investorStats.pendingApprovals}</p>
                <p className="text-sm text-gray-300">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(investorStats.totalInvestment)}</p>
                <p className="text-sm text-gray-300">Investissement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{performanceMetrics.approvalRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Taux d'approbation</p>
          <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${performanceMetrics.approvalRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingDown className="w-4 h-4 mr-1" />
              -3j
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{performanceMetrics.avgProcessingDays} jours</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Delai moyen traitement</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Moyenne nationale: 18 jours</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{performanceMetrics.complianceScore}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Score de conformite</p>
          <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${performanceMetrics.complianceScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#D4A853]/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#D4A853]" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{performanceMetrics.growthRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">+{performanceMetrics.growthRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Croissance annuelle</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Par rapport a 2025</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mes Projets - 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mes Projets d'Investissement</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Suivi de vos projets en cours</p>
            </div>
            <Link
              href="/investor/projects"
              className="text-sm text-[#1E3A5F] dark:text-[#D4A853] hover:underline flex items-center"
            >
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#D4A853]/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#1E3A5F] dark:group-hover:text-[#D4A853] transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {project.sector}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      {formatCurrency(project.investment)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(project.startDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <Link
                    href={`/investor/projects/${project.id}`}
                    className="text-[#1E3A5F] dark:text-[#D4A853] hover:underline text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progression</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#D4A853] rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D4A853]" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
              {notifications.filter(n => n.urgent).length} urgent
            </span>
          </div>
          <div className="p-4 space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === "warning"
                    ? "bg-orange-50 dark:bg-orange-900/20 border-l-orange-500"
                    : notification.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-l-green-500"
                    : "bg-blue-50 dark:bg-blue-900/20 border-l-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {notification.type === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  ) : notification.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{notification.date}</p>
                  </div>
                  {notification.urgent && (
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/investor/notifications"
              className="text-sm text-[#1E3A5F] dark:text-[#D4A853] hover:underline flex items-center justify-center"
            >
              Voir toutes les notifications
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Demandes d'Agrement */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4A853]" />
              Mes Demandes d'Agrement
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Suivez l'etat de vos demandes</p>
          </div>
          <Link
            href="/investor/approvals/new"
            className="inline-flex items-center px-4 py-2 bg-[#0A1628] text-white rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Projet</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type d'agrement</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date soumission</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Etape actuelle</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {approvalRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{request.projectName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 text-[#0A1628] dark:text-[#D4A853] text-xs font-medium rounded">
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(request.submittedDate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {request.currentStep || (request.approvalDate && `Approuve le ${new Date(request.approvalDate).toLocaleDateString("fr-FR")}`)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/investor/approvals/${request.id}`}
                      className="text-[#1E3A5F] dark:text-[#D4A853] hover:underline text-sm inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Avantages Fiscaux */}
      <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-[#D4A853]" />
              Vos Avantages Fiscaux
            </h2>
            <p className="text-gray-300 text-sm mt-1">Benefices accordes selon le Code des Investissements</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#D4A853]">{formatCurrency(investorStats.taxBenefits)}</p>
            <p className="text-sm text-gray-300">Economies estimees</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {taxBenefits.map((benefit, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-[#D4A853]">{benefit.value}</p>
              <p className="font-medium text-white mt-1">{benefit.title}</p>
              <p className="text-xs text-gray-300 mt-2">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Secteurs & Opportunites */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D4A853]" />
              Secteurs Porteurs en RDC
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Opportunites d'investissement par secteur</p>
          </div>
          <Link
            href="/investor/opportunities"
            className="text-sm text-[#1E3A5F] dark:text-[#D4A853] hover:underline flex items-center"
          >
            Explorer les opportunites
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sectors.map((sector, index) => (
            <Link
              key={index}
              href={`/investor/opportunities?sector=${sector.name.toLowerCase()}`}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#D4A853]/50 hover:shadow-md transition-all group text-center"
            >
              <div className={`w-12 h-12 ${sector.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <sector.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{sector.name}</h3>
              <p className="text-green-600 dark:text-green-400 font-medium text-sm mt-1">{sector.growth}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sector.projects} projets</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/investor/projects/new"
          className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white hover:shadow-lg hover:scale-105 transition-all"
        >
          <Plus className="w-8 h-8 mb-3" />
          <h3 className="font-semibold">Nouveau projet</h3>
          <p className="text-sm text-white/80 mt-1">Creer un projet d'investissement</p>
        </Link>
        <Link
          href="/investor/approvals/new"
          className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white hover:shadow-lg hover:scale-105 transition-all"
        >
          <FileCheck className="w-8 h-8 mb-3" />
          <h3 className="font-semibold">Demander agrement</h3>
          <p className="text-sm text-white/80 mt-1">Soumettre une demande</p>
        </Link>
        <Link
          href="/investor/documents"
          className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white hover:shadow-lg hover:scale-105 transition-all"
        >
          <FileText className="w-8 h-8 mb-3" />
          <h3 className="font-semibold">Mes documents</h3>
          <p className="text-sm text-white/80 mt-1">Gerer mes fichiers</p>
        </Link>
        <Link
          href="/investor/guide"
          className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white hover:shadow-lg hover:scale-105 transition-all"
        >
          <Globe className="w-8 h-8 mb-3" />
          <h3 className="font-semibold">Guide investisseur</h3>
          <p className="text-sm text-white/80 mt-1">Ressources et aide</p>
        </Link>
      </div>

      {/* Impact & Emplois */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D4A853]" />
            Impact sur l'emploi
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0A1628] dark:text-white">{investorStats.employeesCreated}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois crees</p>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Emplois directs</span>
                  <span className="font-medium text-gray-900 dark:text-white">98</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Emplois indirects</span>
                  <span className="font-medium text-gray-900 dark:text-white">58</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Previsions 2026</span>
                  <span className="font-medium text-green-600 dark:text-green-400">+85</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D4A853]" />
            Activite recente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Agrement approuve - Usine agricole</span>
              <span className="text-xs text-gray-400 ml-auto">2j</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Document soumis - Etude faisabilite</span>
              <span className="text-xs text-gray-400 ml-auto">5j</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Demande en revision - Hotel Virunga</span>
              <span className="text-xs text-gray-400 ml-auto">1sem</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Nouveau projet cree - Centrale solaire</span>
              <span className="text-xs text-gray-400 ml-auto">2sem</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact ANAPI */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Besoin d'assistance?</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Notre equipe est disponible pour vous accompagner dans vos demarches</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/investor/contact"
              className="inline-flex items-center px-4 py-2 bg-[#0A1628] text-white rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors"
            >
              Contacter ANAPI
            </Link>
            <Link
              href="/investor/guide"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              Guide de l'investisseur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
