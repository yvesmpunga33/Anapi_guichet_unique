"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
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
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    title: "PRINCIPAL",
    items: [
      { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "GUICHET UNIQUE",
    items: [
      { name: "Dossiers", href: "/guichet-unique/dossiers", icon: FolderOpen },
      { name: "Demandes d'agrément", href: "/guichet-unique/agrements", icon: FileCheck },
    ],
  },
  {
    title: "GESTION DES INVESTISSEMENTS",
    items: [
      { name: "Investisseurs", href: "/investments/investors", icon: Briefcase },
      { name: "Projets d'investissement", href: "/investments/projects", icon: TrendingUp },
      { name: "Suivi des projets", href: "/investments/tracking", icon: ClipboardList },
    ],
  },
  {
    title: "RÉFÉRENTIELS",
    items: [
      { name: "Provinces", href: "/referentiels/provinces", icon: MapPin },
      { name: "Secteurs d'activité", href: "/referentiels/sectors", icon: Factory },
      { name: "Ministères", href: "/referentiels/ministries", icon: Building2 },
    ],
  },
  {
    title: "ANALYSES & RAPPORTS",
    items: [
      { name: "Statistiques", href: "/reports/statistics", icon: BarChart3 },
      { name: "Rapports", href: "/reports/list", icon: FileText },
    ],
  },
  {
    title: "RESSOURCES HUMAINES",
    items: [
      { name: "Employés", href: "/hr/employees", icon: Users },
      { name: "Départements", href: "/hr/departments", icon: Building2 },
      { name: "Postes", href: "/hr/positions", icon: Briefcase },
      { name: "Grades salariaux", href: "/hr/grades", icon: GraduationCap },
      { name: "Catégories", href: "/hr/categories", icon: Layers },
      { name: "Types de congés", href: "/hr/leave-types", icon: Calendar },
      { name: "Gestion des congés", href: "/hr/leaves", icon: Calendar },
      { name: "Paie", href: "/hr/payroll", icon: DollarSign },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      { name: "Utilisateurs", href: "/admin/users", icon: UserCog },
      { name: "Rôles & Permissions", href: "/admin/roles", icon: Shield },
      { name: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    navigation.map((s) => s.title)
  );

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>
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
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Breadcrumb or page title can go here */}
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {navigation.flatMap(s => s.items).find(i => i.href && isActiveLink(i.href))?.name || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications, search, etc. can be added here */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session?.user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.user?.role || "Administrateur"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {session?.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">{children}</main>
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
