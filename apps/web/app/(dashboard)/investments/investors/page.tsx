"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  User,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Investor {
  id: string;
  investorCode: string;
  name: string;
  type: string;
  category: string;
  country: string;
  province?: string;
  city?: string;
  email: string;
  phone: string;
  contactPerson?: string;
  contactPosition?: string;
  status: string;
  isVerified: boolean;
  totalInvestments: number;
  totalAmount: number;
  currency: string;
  registrationDate: string;
  lastActivity: string;
}

const investorTypes: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  company: { label: "Societe", icon: Building2 },
  individual: { label: "Individuel", icon: User },
  organization: { label: "Organisation", icon: Globe },
  government: { label: "Gouvernement", icon: Building2 },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Actif", color: "bg-green-100 text-green-700" },
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  SUSPENDED: { label: "Suspendu", color: "bg-red-100 text-red-700" },
  INACTIVE: { label: "Inactif", color: "bg-gray-100 text-gray-700" },
};

const mockInvestors: Investor[] = [
  {
    id: "1",
    investorCode: "INV-2024-00125",
    name: "Congo Mining Corporation",
    type: "company",
    category: "Multinationale",
    country: "Afrique du Sud",
    province: "Lualaba",
    city: "Kolwezi",
    email: "contact@congomining.com",
    phone: "+243 81 234 5678",
    contactPerson: "John Smith",
    contactPosition: "Directeur General",
    status: "ACTIVE",
    isVerified: true,
    totalInvestments: 3,
    totalAmount: 45000000,
    currency: "USD",
    registrationDate: "2023-06-15",
    lastActivity: "2024-01-20",
  },
  {
    id: "2",
    investorCode: "INV-2024-00124",
    name: "AgroTech RDC SARL",
    type: "company",
    category: "PME",
    country: "RDC",
    province: "Equateur",
    city: "Mbandaka",
    email: "info@agrotechrdc.cd",
    phone: "+243 99 876 5432",
    contactPerson: "Marie Kabila",
    contactPosition: "Presidente",
    status: "ACTIVE",
    isVerified: true,
    totalInvestments: 2,
    totalAmount: 8500000,
    currency: "USD",
    registrationDate: "2023-08-20",
    lastActivity: "2024-01-18",
  },
  {
    id: "3",
    investorCode: "INV-2024-00123",
    name: "Jean-Pierre Mukendi",
    type: "individual",
    category: "Investisseur prive",
    country: "RDC",
    province: "Nord-Kivu",
    city: "Goma",
    email: "jp.mukendi@gmail.com",
    phone: "+243 81 555 1234",
    status: "ACTIVE",
    isVerified: true,
    totalInvestments: 1,
    totalAmount: 2500000,
    currency: "USD",
    registrationDate: "2023-09-10",
    lastActivity: "2024-01-15",
  },
  {
    id: "4",
    investorCode: "INV-2024-00122",
    name: "TechInvest Africa Ltd",
    type: "company",
    category: "Fonds d'investissement",
    country: "Kenya",
    email: "invest@techinvest.africa",
    phone: "+254 20 123 4567",
    contactPerson: "Sarah Ouma",
    contactPosition: "Investment Manager",
    status: "PENDING",
    isVerified: false,
    totalInvestments: 1,
    totalAmount: 8000000,
    currency: "USD",
    registrationDate: "2024-01-10",
    lastActivity: "2024-01-18",
  },
  {
    id: "5",
    investorCode: "INV-2024-00121",
    name: "Congo Cement Industries",
    type: "company",
    category: "Grande entreprise",
    country: "RDC",
    province: "Kongo Central",
    city: "Matadi",
    email: "direction@congociment.cd",
    phone: "+243 81 999 8888",
    contactPerson: "Albert Mbeki",
    contactPosition: "DG Adjoint",
    status: "SUSPENDED",
    isVerified: true,
    totalInvestments: 2,
    totalAmount: 35000000,
    currency: "USD",
    registrationDate: "2022-03-15",
    lastActivity: "2024-01-12",
  },
  {
    id: "6",
    investorCode: "INV-2024-00120",
    name: "African Development Fund",
    type: "organization",
    category: "Institution financiere",
    country: "Cote d'Ivoire",
    email: "projects@adf.org",
    phone: "+225 20 123 456",
    contactPerson: "Fatou Diallo",
    contactPosition: "Chargee de projets",
    status: "ACTIVE",
    isVerified: true,
    totalInvestments: 5,
    totalAmount: 120000000,
    currency: "USD",
    registrationDate: "2021-01-20",
    lastActivity: "2024-01-19",
  },
];

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>(mockInvestors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const filteredInvestors = investors.filter((investor) => {
    const matchesSearch =
      investor.investorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || investor.status === statusFilter;
    const matchesType = typeFilter === "all" || investor.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = {
    total: investors.length,
    active: investors.filter((i) => i.status === "ACTIVE").length,
    verified: investors.filter((i) => i.isVerified).length,
    totalAmount: investors.reduce((sum, i) => sum + i.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Investisseurs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestion du repertoire des investisseurs
          </p>
        </div>
        <Link
          href="/investments/investors/new"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvel Investisseur
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Investisseurs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verifies</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.verified}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Investissements</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatAmount(stats.totalAmount, "USD")}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par code, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les types</option>
              {Object.entries(investorTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Investisseur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Investissements
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInvestors.map((investor) => {
                const status = statusConfig[investor.status] || statusConfig.PENDING;
                const typeInfo = investorTypes[investor.type] || investorTypes.company;
                const TypeIcon = typeInfo.icon;

                return (
                  <tr
                    key={investor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {investor.name}
                            </p>
                            {investor.isVerified && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {investor.investorCode}
                            </p>
                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">
                              {typeInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{investor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{investor.phone}</span>
                        </div>
                        {investor.contactPerson && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {investor.contactPerson} - {investor.contactPosition}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{investor.country}</p>
                          {investor.province && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {investor.city}, {investor.province}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {investor.totalInvestments} projets
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-0.5">
                          {formatAmount(investor.totalAmount, investor.currency)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Inscrit le {formatDate(investor.registrationDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/investments/investors/${investor.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Voir details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucun investisseur trouve</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de <span className="font-medium">{filteredInvestors.length}</span> investisseurs
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
