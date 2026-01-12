"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Trophy,
  Calendar,
  Image as ImageIcon,
  Route,
  GraduationCap,
  Heart,
  Landmark,
  Building2,
  Users,
  FileText,
  Activity,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  MapPin,
  Globe,
  Home,
} from "lucide-react";
import { ProvinceSettingsGet, ProvinceGetCurrentUser } from "@/app/services/Province.service";

// Context pour partager les donnees de la province
const ProvinceContext = createContext(null);

export const useProvince = () => useContext(ProvinceContext);

// Configuration du menu par defaut
const defaultMenuConfig = [
  { id: "dashboard", label: "Tableau de bord", icon: "LayoutDashboard", path: "", enabled: true },
  { id: "news", label: "Actualites", icon: "Newspaper", path: "/actualites", enabled: true },
  { id: "opportunities", label: "Opportunites", icon: "Briefcase", path: "/opportunites", enabled: true },
  { id: "achievements", label: "Realisations", icon: "Trophy", path: "/realisations", enabled: true },
  { id: "events", label: "Evenements", icon: "Calendar", path: "/evenements", enabled: true },
  { id: "gallery", label: "Galerie", icon: "ImageIcon", path: "/galerie", enabled: true },
  { id: "infrastructure", label: "Infrastructure", icon: "Route", path: "/infrastructure", enabled: true },
  { id: "education", label: "Education", icon: "GraduationCap", path: "/education", enabled: false },
  { id: "health", label: "Sante", icon: "Heart", path: "/sante", enabled: false },
  { id: "tourism", label: "Tourisme & Culture", icon: "Landmark", path: "/tourisme", enabled: false },
  { id: "organization", label: "Organisation", icon: "Building2", path: "/organisation", enabled: false },
  { id: "investors", label: "Investisseurs", icon: "Users", path: "/investisseurs", enabled: false },
  { id: "jobs", label: "Emplois", icon: "FileText", path: "/emplois", enabled: false },
  { id: "economy", label: "Activites Economiques", icon: "Activity", path: "/economie", enabled: false },
  { id: "hr", label: "Ressources Humaines", icon: "Users", path: "/rh", enabled: false },
  { id: "settings", label: "Configuration", icon: "Settings", path: "/configuration", enabled: true },
];

// Map des icones
const iconMap = {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Trophy,
  Calendar,
  ImageIcon,
  Route,
  GraduationCap,
  Heart,
  Landmark,
  Building2,
  Users,
  FileText,
  Activity,
  Settings,
};

export default function ProvinceLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const provinceCode = params.provinceCode;

  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Charger les parametres de la province
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, userRes] = await Promise.all([
          ProvinceSettingsGet(provinceCode),
          ProvinceGetCurrentUser(),
        ]);

        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }
        if (userRes.data) {
          setUser(userRes.data);
        }
      } catch (err) {
        console.error("Erreur chargement donnees province:", err);
        // Si erreur d'auth, rediriger vers login
        if (err.response?.status === 401) {
          router.push(`/province/login?province=${provinceCode}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (provinceCode) {
      fetchData();
    }
  }, [provinceCode, router]);

  // Obtenir le menu configure ou par defaut
  const menuConfig = settings?.menuConfig || defaultMenuConfig;
  const enabledMenuItems = menuConfig.filter((item) => item.enabled !== false);

  // Couleurs personnalisees de la province
  const primaryColor = settings?.primaryColor || "#0A1628";
  const secondaryColor = settings?.secondaryColor || "#1E3A5F";
  const accentColor = settings?.accentColor || "#D4A853";

  const handleLogout = () => {
    localStorage.removeItem("province_token");
    localStorage.removeItem("province_code");
    router.push("/province/login");
  };

  const isActiveRoute = (path) => {
    const fullPath = `/${provinceCode}${path}`;
    if (path === "") {
      return pathname === `/${provinceCode}`;
    }
    return pathname.startsWith(fullPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: accentColor, borderTopColor: "transparent" }}
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du portail...</p>
        </div>
      </div>
    );
  }

  return (
    <ProvinceContext.Provider value={{ settings, user, provinceCode }}>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Sidebar Desktop */}
          <aside
            className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
              sidebarOpen ? "w-64" : "w-20"
            } hidden lg:block`}
            style={{ backgroundColor: primaryColor }}
          >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
              {sidebarOpen ? (
                <div className="flex items-center gap-3">
                  {settings?.logo ? (
                    <Image
                      src={settings.logo}
                      alt={settings?.name || "Province"}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h1 className="font-bold text-white truncate">
                      {settings?.name || provinceCode}
                    </h1>
                    <p className="text-xs text-gray-400 truncate">Portail Provincial</p>
                  </div>
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto"
                  style={{ backgroundColor: accentColor }}
                >
                  <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 hidden lg:block"
              >
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
              {enabledMenuItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = isActiveRoute(item.path);

                return (
                  <Link
                    key={item.id}
                    href={`/${provinceCode}${item.path}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    style={isActive ? { backgroundColor: accentColor, color: primaryColor } : {}}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              {sidebarOpen ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.role || "Utilisateur"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg"
                    title="Deconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg flex justify-center"
                  title="Deconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </aside>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside
            className={`fixed left-0 top-0 z-50 h-screen w-72 transform transition-transform lg:hidden ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ backgroundColor: primaryColor }}
          >
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: accentColor }}
                >
                  <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h1 className="font-bold text-white">{settings?.name || provinceCode}</h1>
                  <p className="text-xs text-gray-400">Portail Provincial</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
              {enabledMenuItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = isActiveRoute(item.path);

                return (
                  <Link
                    key={item.id}
                    href={`/${provinceCode}${item.path}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    style={isActive ? { backgroundColor: accentColor, color: primaryColor } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0] || "U"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div
            className={`transition-all duration-300 ${
              sidebarOpen ? "lg:ml-64" : "lg:ml-20"
            }`}
          >
            {/* Top Header */}
            <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between shadow-sm">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Breadcrumb ou Search */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <Link href={`/${provinceCode}`} className="hover:text-gray-700">
                    <Home className="w-4 h-4" />
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {enabledMenuItems.find((item) => isActiveRoute(item.path))?.label ||
                      "Tableau de bord"}
                  </span>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Search className="w-5 h-5" />
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      {user?.firstName?.[0] || "U"}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href={`/${provinceCode}/profil`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </Link>
                      <Link
                        href={`/${provinceCode}/configuration`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Parametres
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Deconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Link to public site */}
                <Link
                  href="/"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Site ANAPI"
                >
                  <Globe className="w-4 h-4" />
                </Link>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </div>
    </ProvinceContext.Provider>
  );
}
