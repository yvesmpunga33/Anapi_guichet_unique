"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useIntl } from "react-intl";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Share2,
  Star,
  Clock,
  Trash2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Upload,
  Search,
  Bell,
  Sun,
  Moon,
  Home,
  Activity,
  Shield,
  MessageSquare,
  BarChart3,
  ArrowLeftRight,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PageTitleProvider, usePageTitle } from "../../contexts/PageTitleContext";
import { ShareNotificationProvider } from "../../contexts/ShareNotificationContext";
import { NotificationBell, UrgentDocumentSnackbar } from "../../components/partage/NotificationPanel";

// Avatar component
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

// Navigation structure for Document Sharing System
const getNavigation = (intl) => [
  {
    title: "TABLEAU DE BORD",
    items: [
      {
        name: "Vue d'ensemble",
        href: "/partage",
        icon: LayoutDashboard,
      },
      {
        name: "Statistiques",
        href: "/partage/statistiques",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "MES DOCUMENTS",
    items: [
      {
        name: "Tous les documents",
        href: "/partage/documents",
        icon: FileText,
      },
      {
        name: "Mes dossiers",
        href: "/partage/dossiers",
        icon: FolderOpen,
      },
      {
        name: "Upload",
        href: "/partage/upload",
        icon: Upload,
      },
    ],
  },
  {
    title: "PARTAGES",
    items: [
      {
        name: "Partagés avec moi",
        href: "/partage/partages/recus",
        icon: Share2,
      },
      {
        name: "Mes partages",
        href: "/partage/partages/envoyes",
        icon: ArrowLeftRight,
      },
      {
        name: "Liens publics",
        href: "/partage/partages/liens",
        icon: Users,
      },
    ],
  },
  {
    title: "ORGANISATION",
    items: [
      {
        name: "Favoris",
        href: "/partage/favoris",
        icon: Star,
      },
      {
        name: "Documents récents",
        href: "/partage/recents",
        icon: Clock,
      },
      {
        name: "Corbeille",
        href: "/partage/corbeille",
        icon: Trash2,
      },
    ],
  },
  {
    title: "ACTIVITÉ",
    items: [
      {
        name: "Journal d'activités",
        href: "/partage/activites",
        icon: Activity,
      },
      {
        name: "Notifications",
        href: "/partage/notifications",
        icon: Bell,
      },
      {
        name: "Commentaires",
        href: "/partage/commentaires",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        name: "Gestion des accès",
        href: "/partage/admin/acces",
        icon: Shield,
      },
      {
        name: "Paramètres",
        href: "/partage/admin/parametres",
        icon: Settings,
      },
    ],
  },
];

// Header title component
function HeaderTitle({ navigation, pathname, isActiveLink }) {
  const { pageTitle } = usePageTitle();

  const title =
    pageTitle ||
    navigation.flatMap((s) => s.items).find((i) => i.href && isActiveLink(i.href))?.name ||
    "Système de Partage";

  return <h1 className="text-lg font-semibold text-white">{title}</h1>;
}

function PartageLayoutContent({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const intl = useIntl();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);

  const navigation = getNavigation(intl);

  // Initialize all sections as expanded
  useEffect(() => {
    setExpandedSections(navigation.map((s) => s.title));
  }, []);

  // Dark mode
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
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActiveLink = (href) => {
    if (href === "/partage") {
      return pathname === "/partage";
    }
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

      {/* Sidebar - Same theme as dashboard */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <Link href="/partage" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">ANAPI</span>
              <p className="text-xs text-slate-400">Partage de Documents</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back to main app */}
        <div className="px-3 py-3 border-b border-slate-700">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Retour à ANAPI</span>
          </Link>
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
                          <item.icon
                            className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`}
                          />
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

        {/* Storage info */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-slate-700">
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Espace utilisé</span>
              <span>2.5 GB / 10 GB</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* User section */}
        <div className="flex-shrink-0 border-t border-slate-700 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <UserAvatar src={session?.user?.image} name={session?.user?.name} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || "Utilisateur"}
              </p>
              <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
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
        {/* Top bar - Same theme as dashboard */}
        <header className="sticky top-0 z-30 bg-slate-800 dark:bg-slate-900 shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side */}
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
                  isActiveLink={isActiveLink}
                />
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher des documents..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Upload button */}
              <Link
                href="/partage/upload"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </Link>

              {/* Dark Mode */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg hover:bg-slate-700 text-white transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications Bell with Panel */}
              <NotificationBell />

              {/* User */}
              <div className="flex items-center ml-2">
                <UserAvatar src={session?.user?.image} name={session?.user?.name} size={40} />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">{children}</main>

        {/* Urgent Document Snackbar */}
        <UrgentDocumentSnackbar />
      </div>

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

export default function PartageLayout({ children }) {
  return (
    <PageTitleProvider>
      <ShareNotificationProvider>
        <PartageLayoutContent>{children}</PartageLayoutContent>
      </ShareNotificationProvider>
    </PageTitleProvider>
  );
}
