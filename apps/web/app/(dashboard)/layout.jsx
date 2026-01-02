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
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import MessageNotifications from "../../components/notifications/MessageNotifications";
import LanguageSelector from "../../components/LanguageSelector";

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
    titleKey: "nav.configuration",
    title: intl.formatMessage({ id: "nav.configuration", defaultMessage: "CONFIGURATION" }),
    items: [
      { name: intl.formatMessage({ id: "nav.adminActs", defaultMessage: "Actes administratifs" }), href: "/configuration/actes-administratifs", icon: FileCheck },
      { name: intl.formatMessage({ id: "nav.workflowSteps", defaultMessage: "Étapes de workflow" }), href: "/configuration/workflow-steps", icon: Workflow },
      { name: intl.formatMessage({ id: "nav.ministryWorkflows", defaultMessage: "Workflows ministères" }), href: "/configuration/ministry-workflows", icon: Cog },
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
      { name: intl.formatMessage({ id: "nav.employees", defaultMessage: "Employés" }), href: "/hr/employees", icon: Users },
      { name: intl.formatMessage({ id: "nav.departments", defaultMessage: "Départements" }), href: "/hr/departments", icon: Building2 },
      { name: intl.formatMessage({ id: "nav.positions", defaultMessage: "Postes" }), href: "/hr/positions", icon: Briefcase },
      { name: intl.formatMessage({ id: "nav.salaryGrades", defaultMessage: "Grades salariaux" }), href: "/hr/grades", icon: GraduationCap },
      { name: intl.formatMessage({ id: "nav.categories", defaultMessage: "Catégories" }), href: "/hr/categories", icon: Layers },
      { name: intl.formatMessage({ id: "nav.leaveTypes", defaultMessage: "Types de congés" }), href: "/hr/leave-types", icon: Calendar },
      { name: intl.formatMessage({ id: "nav.leaveManagement", defaultMessage: "Gestion des congés" }), href: "/hr/leaves", icon: Calendar },
      { name: intl.formatMessage({ id: "nav.payroll", defaultMessage: "Paie" }), href: "/hr/payroll", icon: DollarSign },
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
];

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const intl = useIntl();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [photoZoomOpen, setPhotoZoomOpen] = useState(false);

  // Get navigation with translations
  const navigation = getNavigation(intl);

  const [expandedSections, setExpandedSections] = useState(
    navigation.map((s) => s.title)
  );

  // Dark mode toggle
  useEffect(() => {
    const savedMode = localStorage.getItem("anapi-dark-mode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

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
                <h1 className="text-lg font-semibold text-white">
                  {navigation.flatMap(s => s.items).find(i => i.href && isActiveLink(i.href))?.name || intl.formatMessage({ id: "nav.dashboard", defaultMessage: "Dashboard" })}
                </h1>
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
