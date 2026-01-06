"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Briefcase,
  FileCheck,
  Award,
  Bell,
  Settings,
  Mail,
  Sun,
  Moon,
  Globe,
  FileText,
  TrendingUp,
  ClipboardList,
  User,
  Building,
  HelpCircle,
  Phone,
  Search,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PageTitleProvider, usePageTitle } from "../../contexts/PageTitleContext";

// Avatar component with error handling
function UserAvatar({ src, name, size = 40, onClick }) {
  const [imageError, setImageError] = useState(false);
  const initial = name?.charAt(0)?.toUpperCase() || "I";

  if (!src || imageError) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8924A] flex items-center justify-center border-2 border-white/20 hover:border-white/40 transition-colors cursor-pointer"
        style={{ width: size, height: size }}
        onClick={onClick}
      >
        <span className="text-[#0A1628] font-semibold text-sm">{initial}</span>
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
  const initial = name?.charAt(0)?.toUpperCase() || "I";

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
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

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
              <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8924A] flex items-center justify-center border-4 border-white/20 shadow-xl">
                <span className="text-[#0A1628] font-bold text-7xl">{initial}</span>
              </div>
            )}

            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-white">{name || "Investisseur"}</h3>
              <p className="text-sm text-slate-400 mt-1">Cliquez ailleurs pour fermer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation structure for investors
const investorNavigation = [
  {
    title: "PRINCIPAL",
    items: [
      { name: "Accueil", href: "/investor", icon: Home },
      { name: "Tableau de bord", href: "/investor-home", icon: LayoutDashboard },
      { name: "Notifications", href: "/investor/notifications", icon: Bell },
      { name: "Messages", href: "/investor-messages", icon: Mail },
    ],
  },
  {
    title: "MES INVESTISSEMENTS",
    items: [
      { name: "Mes projets", href: "/investor/projects", icon: Briefcase },
      { name: "Nouveau projet", href: "/investor/projects/new", icon: TrendingUp },
      { name: "Suivi des demandes", href: "/investor/tracking", icon: ClipboardList },
    ],
  },
  {
    title: "AGREMENTS & AUTORISATIONS",
    items: [
      { name: "Mes agrements", href: "/investor/approvals", icon: FileCheck },
      { name: "Demander un agrement", href: "/investor/approvals/new", icon: Award },
      { name: "Documents requis", href: "/investor/documents", icon: FileText },
    ],
  },
  {
    title: "OPPORTUNITES",
    items: [
      { name: "Secteurs porteurs", href: "/investor/opportunities", icon: TrendingUp },
      { name: "Appels d'offres", href: "/investor/tenders", icon: FolderOpen },
      { name: "Partenariats", href: "/investor/partnerships", icon: Building },
    ],
  },
  {
    title: "MON COMPTE",
    items: [
      { name: "Mon profil", href: "/investor/profile", icon: User },
      { name: "Mon entreprise", href: "/investor/company", icon: Building },
      { name: "Parametres", href: "/investor/settings", icon: Settings },
    ],
  },
  {
    title: "AIDE & SUPPORT",
    items: [
      { name: "Guide de l'investisseur", href: "/investor/guide", icon: HelpCircle },
      { name: "Contacter ANAPI", href: "/investor/contact", icon: Phone },
    ],
  },
];

// Header title component that uses PageTitleContext
function HeaderTitle({ navigation, pathname, isActiveLink }) {
  const { pageTitle } = usePageTitle();

  const title = pageTitle ||
    navigation.flatMap(s => s.items).find(i => i.href && isActiveLink(i.href))?.name ||
    "Portail Investisseur";

  return (
    <h1 className="text-lg font-semibold text-white">
      {title}
    </h1>
  );
}

function InvestorLayoutContent({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [photoZoomOpen, setPhotoZoomOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    investorNavigation.map((s) => s.title)
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
    if (href === "/investor") {
      return pathname === "/investor";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0A1628] to-[#1E3A5F] text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-[#1E3A5F]">
          <Link href="/investor-home" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D4A853] rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#0A1628]" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">ANAPI</span>
              <p className="text-xs text-[#D4A853]">Portail Investisseur</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-[#1E3A5F] text-[#D4A853]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar min-h-0">
          {investorNavigation.map((section) => (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#D4A853] uppercase tracking-wider hover:text-white transition-colors"
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
                              ? "bg-[#D4A853] text-[#0A1628] shadow-lg shadow-[#D4A853]/30"
                              : "text-gray-300 hover:bg-[#1E3A5F] hover:text-white"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? "text-[#0A1628]" : "text-[#D4A853]"}`} />
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
        <div className="flex-shrink-0 border-t border-[#1E3A5F] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <UserAvatar
              src={session?.user?.image}
              name={session?.user?.name}
              size={40}
              onClick={() => setPhotoZoomOpen(true)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || "Investisseur"}
              </p>
              <p className="text-xs text-[#D4A853] truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center space-x-3 px-3 py-2.5 w-full text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Deconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar - Professional Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] dark:from-[#0A1628] dark:to-[#1E3A5F] shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side - Mobile menu & Page title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#1E3A5F] text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <HeaderTitle
                  navigation={investorNavigation}
                  pathname={pathname}
                  isActiveLink={isActiveLink}
                />
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1E3A5F]/50 border border-[#1E3A5F] rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50 focus:border-[#D4A853]"
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg hover:bg-[#1E3A5F] text-white transition-colors"
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Notifications */}
              <button
                className="p-2.5 rounded-lg hover:bg-[#1E3A5F] text-white transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4A853] rounded-full"></span>
              </button>

              {/* Messages */}
              <Link
                href="/investor-messages"
                className="p-2.5 rounded-lg hover:bg-[#1E3A5F] text-white transition-colors relative"
                title="Messages"
              >
                <Mail className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4A853] rounded-full"></span>
              </Link>

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

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="px-4 lg:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} ANAPI - Agence Nationale pour la Promotion des Investissements</p>
            <p className="mt-1">Republique Democratique du Congo</p>
          </div>
        </footer>
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
          background-color: rgba(212, 168, 83, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(212, 168, 83, 0.5);
        }
      `}</style>
    </div>
  );
}

// Main export with PageTitleProvider wrapper
export default function InvestorLayout({ children }) {
  return (
    <PageTitleProvider>
      <InvestorLayoutContent>{children}</InvestorLayoutContent>
    </PageTitleProvider>
  );
}
