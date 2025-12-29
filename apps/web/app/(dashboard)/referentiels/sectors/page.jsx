"use client";

import { useState } from "react";
import {
  Factory,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Leaf,
  Cpu,
  Building2,
  Zap,
  Plane,
  ShoppingBag,
  Hammer,
  Pickaxe,
} from "lucide-react";

const sectorIcons = {
  mining: Pickaxe,
  agriculture: Leaf,
  technology: Cpu,
  industry: Factory,
  energy: Zap,
  tourism: Plane,
  commerce: ShoppingBag,
  construction: Hammer,
  services: Briefcase,
};

const mockSectors = [
  {
    id: "1",
    code: "MIN",
    name: "Mines et Extraction",
    description: "Exploitation miniere et extraction de ressources naturelles",
    icon: "mining",
    subSectors: ["Cuivre et Cobalt", "Or", "Diamant", "Coltan", "Autres mineraux"],
    investmentsCount: 45,
    totalInvestment: 850000000,
    jobsCreated: 15000,
    isActive: true,
    color: "orange",
  },
  {
    id: "2",
    code: "AGR",
    name: "Agriculture",
    description: "Agriculture, elevage et agro-industrie",
    icon: "agriculture",
    subSectors: ["Cultures vivrieres", "Cultures de rente", "Elevage", "Peche", "Agro-industrie"],
    investmentsCount: 32,
    totalInvestment: 120000000,
    jobsCreated: 8500,
    isActive: true,
    color: "green",
  },
  {
    id: "3",
    code: "TEC",
    name: "Technologies",
    description: "Technologies de l'information et telecommunications",
    icon: "technology",
    subSectors: ["Infrastructure IT", "Logiciels", "Telecommunications", "E-commerce", "Fintech"],
    investmentsCount: 18,
    totalInvestment: 45000000,
    jobsCreated: 2200,
    isActive: true,
    color: "blue",
  },
  {
    id: "4",
    code: "IND",
    name: "Industrie",
    description: "Industries manufacturieres et transformation",
    icon: "industry",
    subSectors: ["Agroalimentaire", "Textile", "Materiaux de construction", "Chimie", "Metallurgie"],
    investmentsCount: 28,
    totalInvestment: 180000000,
    jobsCreated: 6800,
    isActive: true,
    color: "purple",
  },
  {
    id: "5",
    code: "ENE",
    name: "Energie",
    description: "Production et distribution d'energie",
    icon: "energy",
    subSectors: ["Hydroelectricite", "Solaire", "Eolien", "Thermique", "Distribution"],
    investmentsCount: 15,
    totalInvestment: 320000000,
    jobsCreated: 3500,
    isActive: true,
    color: "yellow",
  },
  {
    id: "6",
    code: "TOU",
    name: "Tourisme et Hotellerie",
    description: "Tourisme, hotellerie et restauration",
    icon: "tourism",
    subSectors: ["Hotels", "Ecotourisme", "Restauration", "Transport touristique", "Loisirs"],
    investmentsCount: 22,
    totalInvestment: 85000000,
    jobsCreated: 4200,
    isActive: true,
    color: "cyan",
  },
  {
    id: "7",
    code: "COM",
    name: "Commerce",
    description: "Commerce de gros et de detail",
    icon: "commerce",
    subSectors: ["Grande distribution", "Commerce de detail", "Import-Export", "E-commerce"],
    investmentsCount: 35,
    totalInvestment: 95000000,
    jobsCreated: 5500,
    isActive: true,
    color: "pink",
  },
  {
    id: "8",
    code: "BTP",
    name: "Construction et BTP",
    description: "Batiment et travaux publics",
    icon: "construction",
    subSectors: ["Batiment", "Infrastructure", "Immobilier", "Genie civil"],
    investmentsCount: 40,
    totalInvestment: 250000000,
    jobsCreated: 12000,
    isActive: true,
    color: "slate",
  },
  {
    id: "9",
    code: "SER",
    name: "Services",
    description: "Services aux entreprises et particuliers",
    icon: "services",
    subSectors: ["Finance", "Assurance", "Conseil", "Transport", "Sante"],
    investmentsCount: 25,
    totalInvestment: 75000000,
    jobsCreated: 3800,
    isActive: true,
    color: "indigo",
  },
];

const colorClasses = {
  orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-700" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-700" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-700" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-700" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-700" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-700" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-700" },
  slate: { bg: "bg-slate-100 dark:bg-slate-900/30", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-700" },
};

export default function SectorsPage() {
  const [sectors, setSectors] = useState(mockSectors);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const filteredSectors = sectors.filter((sector) =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Mrd $`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} M $`;
    }
    return `${new Intl.NumberFormat("fr-FR").format(amount)} $`;
  };

  const stats = {
    total: sectors.length,
    totalInvestments: sectors.reduce((sum, s) => sum + s.investmentsCount, 0),
    totalAmount: sectors.reduce((sum, s) => sum + s.totalInvestment, 0),
    totalJobs: sectors.reduce((sum, s) => sum + s.jobsCreated, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Secteurs d'Activite
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Classification des secteurs economiques
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter Secteur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Secteurs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Factory className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalInvestments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Investissements</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Emplois Crees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {new Intl.NumberFormat("fr-FR").format(stats.totalJobs)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un secteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              <Factory className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 ${viewMode === "table" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              <Briefcase className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSectors.map((sector) => {
            const Icon = sectorIcons[sector.icon] || Factory;
            const colors = colorClasses[sector.color] || colorClasses.blue;

            return (
              <div
                key={sector.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${colors.border} overflow-hidden hover:shadow-md transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {sector.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{sector.code}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {sector.description}
                  </p>

                  {/* Sub-sectors */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sous-secteurs:</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.subSectors.slice(0, 3).map((sub, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                        >
                          {sub}
                        </span>
                      ))}
                      {sector.subSectors.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                          +{sector.subSectors.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{sector.investmentsCount}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Projets</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatAmount(sector.totalInvestment)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Montant</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{new Intl.NumberFormat("fr-FR").format(sector.jobsCreated)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Emplois</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Secteur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sous-secteurs</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Projets</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Investissements</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Emplois</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredSectors.map((sector) => {
                  const Icon = sectorIcons[sector.icon] || Factory;
                  const colors = colorClasses[sector.color] || colorClasses.blue;

                  return (
                    <tr key={sector.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{sector.name}</p>
                            <p className="text-xs text-gray-500">{sector.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{sector.subSectors.length} sous-secteurs</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{sector.investmentsCount}</td>
                      <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{formatAmount(sector.totalInvestment)}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Intl.NumberFormat("fr-FR").format(sector.jobsCreated)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredSectors.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Factory className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun secteur trouve</p>
        </div>
      )}
    </div>
  );
}
