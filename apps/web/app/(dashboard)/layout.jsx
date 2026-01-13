"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useIntl } from "react-intl";
import {
  LayoutDashboard,
  Users,
  Building,
  Building2,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Briefcase,
  MapPin,
  BarChart3,
  UserCog,
  GraduationCap,
  Layers,
  Calendar,
  DollarSign,
  Shield,
  Globe,
  Factory,
  ClipboardList,
  FileCheck,
  Workflow,
  Cog,
  Landmark,
  FileBadge,
  Award,
  ScrollText,
  Mail,
  Sun,
  Moon,
  Home,
  Scale,
  BookOpen,
  FileSignature,
  Bell,
  Gavel,
  ShoppingCart,
  FileSearch,
  HandshakeIcon,
  BadgeCheck,
  Search,
  AlertTriangle,
  MessageSquare,
  Users2,
  Handshake,
  Megaphone,
  Target,
  MapPinned,
  Share2,
  Upload,
  Star,
  Activity,
  Clock,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import MessageNotifications from "../../components/notifications/MessageNotifications";
import LanguageSelector from "../../components/LanguageSelector";
import { PageTitleProvider, usePageTitle } from "../../contexts/PageTitleContext";

// Avatar component with error handling and zoom capability
function UserAvatar({ src, name, size = 40, onClick }) {
  const [imageError, setImageError] = useState(false);
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  if (!src || imageError) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20 hover:border-white/40 transition-colors cursor-pointer"
        style={{ width: size, height: size }}
        onClick={onClick}
      >
        <span className="text-white font-semibold text-sm">{initial}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || "User"}
      width={size}
      height={size}
      className="rounded-full border-2 border-white/20 hover:border-white/40 transition-colors cursor-pointer object-cover"
      onError={() => setImageError(true)}
      onClick={onClick}
      unoptimized
    />
  );
}

// Photo zoom modal component
function PhotoZoomModal({ isOpen, onClose, src, name }) {
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Photo container */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            {src ? (
              <Image
                src={src}
                alt={name || "User"}
                width={280}
                height={280}
                className="rounded-full border-4 border-white/20 object-cover shadow-xl"
                unoptimized
              />
            ) : (
              <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/20 shadow-xl">
                <span className="text-white font-bold text-7xl">{initial}</span>
              </div>
            )}

            {/* User info */}
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-white">{name || "Utilisateur"}</h3>
              <p className="text-sm text-slate-400 mt-1">Cliquez ailleurs pour fermer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation structure with translation keys
const getNavigation = (intl) => [
  {
    titleKey: "nav.principal",
    title: "PRINCIPAL",
    items: [
      { nameKey: "nav.dashboard", name: intl.formatMessage({ id: "nav.dashboard", defaultMessage: "Tableau de bord" }), href: "/dashboard", icon: LayoutDashboard },
      { nameKey: "nav.notifications", name: intl.formatMessage({ id: "nav.notifications", defaultMessage: "Notifications" }), href: "/notifications", icon: Bell },
      { nameKey: "nav.messages", name: intl.formatMessage({ id: "nav.messages", defaultMessage: "Messages" }), href: "/messages", icon: Mail },
    ],
  },
  {
    titleKey: "nav.guichetUnique",
    title: intl.formatMessage({ id: "nav.guichetUnique", defaultMessage: "GUICHET UNIQUE" }),
    items: [
      { name: intl.formatMessage({ id: "nav.allFiles", defaultMessage: "Tous les dossiers" }), href: "/guichet-unique/dossiers", icon: FolderOpen },
      { name: intl.formatMessage({ id: "nav.approvals", defaultMessage: "Agréments" }), href: "/guichet-unique/agrements", icon: FileCheck },
      { name: intl.formatMessage({ id: "nav.licenses", defaultMessage: "Licences" }), href: "/guichet-unique/licences", icon: Award },
      { name: intl.formatMessage({ id: "nav.permits", defaultMessage: "Permis" }), href: "/guichet-unique/permis", icon: ScrollText },
      { name: intl.formatMessage({ id: "nav.authorizations", defaultMessage: "Autorisations" }), href: "/guichet-unique/autorisations", icon: FileBadge },
    ],
  },
  {
    titleKey: "nav.legal",
    title: intl.formatMessage({ id: "nav.legal", defaultMessage: "DIRECTION JURIDIQUE" }),
    items: [
      { name: intl.formatMessage({ id: "nav.legalDashboard", defaultMessage: "Tableau de bord" }), href: "/legal/dashboard", icon: Scale },
      { name: intl.formatMessage({ id: "nav.legalTexts", defaultMessage: "Textes juridiques" }), href: "/legal/texts", icon: BookOpen },
      { name: intl.formatMessage({ id: "nav.contracts", defaultMessage: "Contrats" }), href: "/legal/contracts", icon: FileSignature },
      { name: intl.formatMessage({ id: "nav.legalAlerts", defaultMessage: "Alertes" }), href: "/legal/alerts", icon: Bell },
      { name: intl.formatMessage({ id: "nav.legalConfig", defaultMessage: "Configurations" }), href: "/legal/configurations", icon: Settings },
    ],
  },
  {
    titleKey: "nav.investments",
    title: intl.formatMessage({ id: "nav.investments", defaultMessage: "GESTION DES INVESTISSEMENTS" }),
    items: [
      { name: intl.formatMessage({ id: "nav.investors", defaultMessage: "Investisseurs" }), href: "/investments/investors", icon: Briefcase },
      { name: intl.formatMessage({ id: "nav.investmentProjects", defaultMessage: "Projets d'investissement" }), href: "/investments/projects", icon: TrendingUp },
      { name: intl.formatMessage({ id: "nav.projectTracking", defaultMessage: "Suivi des projets" }), href: "/investments/tracking", icon: ClipboardList },
      { name: intl.formatMessage({ id: "nav.opportunities", defaultMessage: "Opportunités par province" }), href: "/investments/opportunities", icon: MapPinned },
    ],
  },
  {
    titleKey: "nav.businessClimate",
    title: intl.formatMessage({ id: "nav.businessClimate", defaultMessage: "CLIMAT DES AFFAIRES" }),
    items: [
      { name: intl.formatMessage({ id: "nav.businessClimateDashboard", defaultMessage: "Tableau de bord" }), href: "/business-climate", icon: BarChart3 },
      { name: intl.formatMessage({ id: "nav.barriers", defaultMessage: "Obstacles & Barrières" }), href: "/business-climate/barriers", icon: AlertTriangle },
      { name: intl.formatMessage({ id: "nav.mediations", defaultMessage: "Médiations" }), href: "/business-climate/mediations", icon: Handshake },
      { name: intl.formatMessage({ id: "nav.dialogues", defaultMessage: "Dialogues" }), href: "/business-climate/dialogues", icon: Users2 },
      { name: intl.formatMessage({ id: "nav.legalProposals", defaultMessage: "Propositions légales" }), href: "/business-climate/proposals", icon: Megaphone },
      { name: intl.formatMessage({ id: "nav.treaties", defaultMessage: "Traités internationaux" }), href: "/business-climate/treaties", icon: Globe },
      { name: intl.formatMessage({ id: "nav.climateIndicators", defaultMessage: "Indicateurs" }), href: "/business-climate/indicators", icon: Target },
    ],
  },
  {
    titleKey: "nav.referentials",
    title: intl.formatMessage({ id: "nav.referentials", defaultMessage: "RÉFÉRENTIELS" }),
    items: [
      { name: intl.formatMessage({ id: "nav.provinces", defaultMessage: "Provinces" }), href: "/referentiels/provinces", icon: MapPin },
      { name: intl.formatMessage({ id: "nav.cities", defaultMessage: "Villes" }), href: "/referentiels/villes", icon: Building },
      { name: intl.formatMessage({ id: "nav.communes", defaultMessage: "Communes" }), href: "/referentiels/communes", icon: Home },
      { name: intl.formatMessage({ id: "nav.sectors", defaultMessage: "Secteurs d'activité" }), href: "/referentiels/sectors", icon: Factory },
      { name: intl.formatMessage({ id: "nav.ministries", defaultMessage: "Ministères" }), href: "/referentiels/ministries", icon: Building2 },
    ],
  },
  {
    titleKey: "nav.ministries",
    title: intl.formatMessage({ id: "nav.ministries", defaultMessage: "MINISTÈRES" }),
    items: [
      { name: intl.formatMessage({ id: "nav.ministriesList", defaultMessage: "Liste des ministères" }), href: "/ministries", icon: Landmark },
      { name: intl.formatMessage({ id: "nav.authorizations", defaultMessage: "Autorisations" }), href: "/ministries/autorisations", icon: FileBadge },
      { name: intl.formatMessage({ id: "nav.licenses", defaultMessage: "Licences" }), href: "/ministries/licences", icon: Award },
      { name: intl.formatMessage({ id: "nav.permits", defaultMessage: "Permis" }), href: "/ministries/permis", icon: ScrollText },
    ],
  },
  {
    titleKey: "nav.procurement",
    title: intl.formatMessage({ id: "nav.procurement", defaultMessage: "PASSATION DE MARCHÉS" }),
    items: [
      { name: intl.formatMessage({ id: "nav.procurementDashboard", defaultMessage: "Tableau de bord" }), href: "/procurement", icon: BarChart3 },
      { name: intl.formatMessage({ id: "nav.tenders", defaultMessage: "Appels d'offres" }), href: "/procurement/tenders", icon: FileSearch },
      { name: intl.formatMessage({ id: "nav.bidders", defaultMessage: "Soumissionnaires" }), href: "/procurement/bidders", icon: Briefcase },
      { name: intl.formatMessage({ id: "nav.bids", defaultMessage: "Soumissions" }), href: "/procurement/bids", icon: ClipboardList },
      { name: intl.formatMessage({ id: "nav.procurementContracts", defaultMessage: "Contrats" }), href: "/procurement/contracts", icon: HandshakeIcon },
      { name: intl.formatMessage({ id: "nav.certificates", defaultMessage: "Certificats" }), href: "/procurement/certificates", icon: BadgeCheck },
      { name: intl.formatMessage({ id: "nav.procurementConfig", defaultMessage: "Configuration" }), href: "/procurement/config", icon: Cog },
    ],
  },
  {
    titleKey: "nav.documentSharing",
    title: intl.formatMessage({ id: "nav.documentSharing", defaultMessage: "PARTAGE DE DOCUMENTS" }),
    items: [
      { name: intl.formatMessage({ id: "nav.sharingDashboard", defaultMessage: "Tableau de bord" }), href: "/partage", icon: Share2, isExternal: true },
      { name: intl.formatMessage({ id: "nav.myDocuments", defaultMessage: "Mes documents" }), href: "/partage/documents", icon: FileText, isExternal: true },
      { name: intl.formatMessage({ id: "nav.myFolders", defaultMessage: "Mes dossiers" }), href: "/partage/dossiers", icon: FolderOpen, isExternal: true },
      { name: intl.formatMessage({ id: "nav.uploadDoc", defaultMessage: "Upload" }), href: "/partage/upload", icon: Upload, isExternal: true },
      { name: intl.formatMessage({ id: "nav.sharedWithMe", defaultMessage: "Partagés avec moi" }), href: "/partage/partages/recus", icon: Share2, isExternal: true },
      { name: intl.formatMessage({ id: "nav.favorites", defaultMessage: "Favoris" }), href: "/partage/favoris", icon: Star, isExternal: true },
      { name: intl.formatMessage({ id: "nav.activityLog", defaultMessage: "Journal d'activités" }), href: "/partage/activites", icon: Activity, isExternal: true },
    ],
  },
  {
    titleKey: "nav.reports",
    title: intl.formatMessage({ id: "nav.reports", defaultMessage: "ANALYSES & RAPPORTS" }),
    items: [
      { name: intl.formatMessage({ id: "nav.statistics", defaultMessage: "Statistiques" }), href: "/reports/statistics", icon: BarChart3 },
      { name: intl.formatMessage({ id: "nav.reportsList", defaultMessage: "Rapports" }), href: "/reports/list", icon: FileText },
    ],
  },
  {
    titleKey: "nav.hr",
    title: intl.formatMessage({ id: "nav.hr", defaultMessage: "RESSOURCES HUMAINES" }),
    items: [
      { name: intl.formatMessage({ id: "nav.hrDashboard", defaultMessage: "RH Dashboard" }), href: "/hr", icon: LayoutDashboard },
      {
        name: intl.formatMessage({ id: "nav.employees", defaultMessage: "Employés" }),
        icon: Users,
        subItems: [
          { name: intl.formatMessage({ id: "nav.employeesList", defaultMessage: "Liste des employés" }), href: "/hr/employees" },
          { name: intl.formatMessage({ id: "nav.newEmployee", defaultMessage: "Nouvel employé" }), href: "/hr/employees/new" },
        ]
      },
      {
        name: intl.formatMessage({ id: "nav.hrConfig", defaultMessage: "Configuration RH" }),
        icon: Settings,
        subItems: [
          { name: intl.formatMessage({ id: "nav.departments", defaultMessage: "Départements" }), href: "/hr/departments" },
          { name: intl.formatMessage({ id: "nav.positions", defaultMessage: "Postes" }), href: "/hr/positions" },
          { name: intl.formatMessage({ id: "nav.salaryGrades", defaultMessage: "Grades" }), href: "/hr/grades" },
          { name: intl.formatMessage({ id: "nav.categories", defaultMessage: "Catégories" }), href: "/hr/categories" },
          { name: intl.formatMessage({ id: "nav.hrConfigMain", defaultMessage: "Configuration" }), href: "/hr/config" },
        ]
      },
      {
        name: intl.formatMessage({ id: "nav.attendance", defaultMessage: "Présences" }),
        icon: Clock,
        subItems: [
          { name: intl.formatMessage({ id: "nav.dailyAttendance", defaultMessage: "Pointage journalier" }), href: "/hr/attendance" },
          { name: intl.formatMessage({ id: "nav.monthlyAttendance", defaultMessage: "Vue mensuelle" }), href: "/hr/attendance/monthly" },
          { name: intl.formatMessage({ id: "nav.attendanceJustifications", defaultMessage: "Justifications" }), href: "/hr/attendance/justifications" },
          { name: intl.formatMessage({ id: "nav.attendanceReports", defaultMessage: "Rapports" }), href: "/hr/attendance/report" },
        ]
      },
      {
        name: intl.formatMessage({ id: "nav.leaves", defaultMessage: "Congés" }),
        icon: Calendar,
        subItems: [
          { name: intl.formatMessage({ id: "nav.leaveRequests", defaultMessage: "Demandes de congés" }), href: "/hr/leaves" },
          { name: intl.formatMessage({ id: "nav.leaveCalendar", defaultMessage: "Calendrier" }), href: "/hr/leaves/calendar" },
          { name: intl.formatMessage({ id: "nav.leaveTypes", defaultMessage: "Types de congés" }), href: "/hr/leave-types" },
        ]
      },
      {
        name: intl.formatMessage({ id: "nav.payroll", defaultMessage: "Paie" }),
        icon: DollarSign,
        subItems: [
          { name: intl.formatMessage({ id: "nav.payrollList", defaultMessage: "Liste de paie" }), href: "/hr/payroll" },
          { name: intl.formatMessage({ id: "nav.payrollReports", defaultMessage: "Rapports" }), href: "/hr/payroll/reports" },
          { name: intl.formatMessage({ id: "nav.payrollArchives", defaultMessage: "Archives" }), href: "/hr/payroll/archives" },
        ]
      },
      {
        name: intl.formatMessage({ id: "nav.bonusesDeductions", defaultMessage: "Primes & Réductions" }),
        icon: TrendingUp,
        subItems: [
          { name: intl.formatMessage({ id: "nav.bonusesOverview", defaultMessage: "Vue d'ensemble" }), href: "/hr/bonuses" },
          { name: intl.formatMessage({ id: "nav.generalBonuses", defaultMessage: "Primes générales" }), href: "/hr/bonuses/general" },
          { name: intl.formatMessage({ id: "nav.individualBonuses", defaultMessage: "Primes individuelles" }), href: "/hr/bonuses/individual" },
          { name: intl.formatMessage({ id: "nav.generalDeductions", defaultMessage: "Retenues générales" }), href: "/hr/deductions/general" },
          { name: intl.formatMessage({ id: "nav.individualDeductions", defaultMessage: "Retenues individuelles" }), href: "/hr/deductions/individual" },
        ]
      },
    ],
  },
  {
    titleKey: "nav.admin",
    title: intl.formatMessage({ id: "nav.admin", defaultMessage: "ADMINISTRATION" }),
    items: [
      { name: intl.formatMessage({ id: "nav.users", defaultMessage: "Utilisateurs" }), href: "/admin/users", icon: UserCog },
      { name: intl.formatMessage({ id: "nav.rolesPermissions", defaultMessage: "Rôles & Permissions" }), href: "/admin/roles", icon: Shield },
      { name: intl.formatMessage({ id: "nav.settings", defaultMessage: "Paramètres" }), href: "/admin/settings", icon: Settings },
    ],
  },
  {
    titleKey: "nav.configuration",
    title: intl.formatMessage({ id: "nav.configuration", defaultMessage: "CONFIGURATION" }),
    items: [
      { name: intl.formatMessage({ id: "nav.adminActs", defaultMessage: "Actes administratifs" }), href: "/configuration/actes-administratifs", icon: FileCheck },
      { name: intl.formatMessage({ id: "nav.workflowSteps", defaultMessage: "Étapes de workflow" }), href: "/configuration/workflow-steps", icon: Workflow },
      { name: intl.formatMessage({ id: "nav.ministryWorkflows", defaultMessage: "Workflows ministères" }), href: "/configuration/ministry-workflows", icon: Cog },
      { name: intl.formatMessage({ id: "nav.ministryDepartments", defaultMessage: "Départements ministères" }), href: "/configuration/ministry-departments", icon: Building2 },
    ],
  },
];

// Header title component that uses PageTitleContext
function HeaderTitle({ navigation, pathname, intl, isActiveLink }) {
  const { pageTitle } = usePageTitle();

  // Priority: 1. Custom page title from context, 2. Navigation item name, 3. Default "Dashboard"
  const title = pageTitle ||
    navigation.flatMap(s => s.items).find(i => i.href && isActiveLink(i.href))?.name ||
    intl.formatMessage({ id: "nav.dashboard", defaultMessage: "Dashboard" });

  return (
    <h1 className="text-lg font-semibold text-white">
      {title}
    </h1>
  );
}

function DashboardLayoutContent({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const intl = useIntl();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [photoZoomOpen, setPhotoZoomOpen] = useState(false);

  // Get navigation with translations
  const navigation = getNavigation(intl);

  // IMPORTANT: Tous les hooks doivent être déclarés AVANT les conditions de retour
  const [expandedSections, setExpandedSections] = useState([]);

  // Initialiser les sections dépliées une fois que navigation est disponible
  useEffect(() => {
    if (navigation.length > 0) {
      setExpandedSections(navigation.map((s) => s.title));
    }
  }, []);

  // Dark mode toggle
  useEffect(() => {
    const savedMode = localStorage.getItem("anapi-dark-mode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Protection d'authentification - Rediriger vers login si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
    }
  }, [status, pathname]);

  // Afficher un écran de chargement pendant la vérification de session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher le contenu si non authentifié
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("anapi-dark-mode", (!darkMode).toString());
  };

  const toggleSection = (title) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActiveLink = (href) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">ANAPI</span>
              <p className="text-xs text-slate-400">Gestion RDC</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar min-h-0">
          {navigation.map((section) => (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                <span>{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedSections.includes(section.title) && (
                <ul className="mt-1 space-y-1">
                  {section.items.map((item) => {
                    // Item with subItems (accordion)
                    if (item.subItems) {
                      const isSubMenuOpen = expandedSections.includes(item.name);
                      const hasActiveSubItem = item.subItems.some(sub => sub.href && isActiveLink(sub.href));
                      return (
                        <li key={item.name}>
                          <button
                            onClick={() => toggleSection(item.name)}
                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
                              hasActiveSubItem
                                ? "bg-slate-800 text-white"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className={`w-5 h-5 ${hasActiveSubItem ? "text-blue-400" : "text-slate-400"}`} />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            {isSubMenuOpen ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          {isSubMenuOpen && (
                            <ul className="mt-1 ml-6 space-y-1 border-l border-slate-700 pl-3">
                              {item.subItems.map((subItem) => {
                                const isSubActive = subItem.href && isActiveLink(subItem.href);
                                return (
                                  <li key={subItem.name}>
                                    <Link
                                      href={subItem.href || "#"}
                                      className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                        isSubActive
                                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                      }`}
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    }
                    // Regular item (no subItems)
                    const isActive = item.href && isActiveLink(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href || "#"}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="flex-shrink-0 border-t border-slate-700 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <UserAvatar
              src={session?.user?.image}
              name={session?.user?.name}
              size={40}
              onClick={() => setPhotoZoomOpen(true)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || "Utilisateur"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center space-x-3 px-3 py-2.5 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar - Professional Header */}
        <header className="sticky top-0 z-30 bg-slate-800 dark:bg-slate-900 shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side - Mobile menu & Page title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <HeaderTitle
                  navigation={navigation}
                  pathname={pathname}
                  intl={intl}
                  isActiveLink={isActiveLink}
                />
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: "search.placeholder", defaultMessage: "Rechercher..." })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <LanguageSelector variant="compact" />

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg hover:bg-slate-700 text-white transition-colors"
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Messages Notifications */}
              <MessageNotifications />

              {/* Settings */}
              <button
                className="p-2.5 rounded-lg hover:bg-slate-700 text-white transition-colors"
                title={intl.formatMessage({ id: "header.settings", defaultMessage: "Paramètres" })}
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* User Profile with Photo */}
              <div className="flex items-center ml-2">
                <UserAvatar
                  src={session?.user?.image}
                  name={session?.user?.name}
                  size={40}
                  onClick={() => setPhotoZoomOpen(true)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>

      {/* Photo Zoom Modal */}
      <PhotoZoomModal
        isOpen={photoZoomOpen}
        onClose={() => setPhotoZoomOpen(false)}
        src={session?.user?.image}
        name={session?.user?.name}
      />

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}

// Main export with PageTitleProvider wrapper
export default function DashboardLayout({ children }) {
  return (
    <PageTitleProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PageTitleProvider>
  );
}
