"use client";

import { useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Building2,
  Map,
} from "lucide-react";

interface Province {
  id: string;
  code: string;
  name: string;
  capital: string;
  region: string;
  population: number;
  surface: number;
  investmentsCount: number;
  totalInvestment: number;
  isActive: boolean;
}

const mockProvinces: Province[] = [
  { id: "1", code: "KIN", name: "Kinshasa", capital: "Kinshasa", region: "Ouest", population: 17000000, surface: 9965, investmentsCount: 45, totalInvestment: 125000000, isActive: true },
  { id: "2", code: "HKA", name: "Haut-Katanga", capital: "Lubumbashi", region: "Sud", population: 4800000, surface: 132425, investmentsCount: 32, totalInvestment: 450000000, isActive: true },
  { id: "3", code: "LUA", name: "Lualaba", capital: "Kolwezi", region: "Sud", population: 2500000, surface: 121308, investmentsCount: 28, totalInvestment: 380000000, isActive: true },
  { id: "4", code: "NKV", name: "Nord-Kivu", capital: "Goma", region: "Est", population: 8500000, surface: 59483, investmentsCount: 18, totalInvestment: 45000000, isActive: true },
  { id: "5", code: "SKV", name: "Sud-Kivu", capital: "Bukavu", region: "Est", population: 6500000, surface: 65070, investmentsCount: 15, totalInvestment: 35000000, isActive: true },
  { id: "6", code: "KOC", name: "Kongo Central", capital: "Matadi", region: "Ouest", population: 5800000, surface: 53920, investmentsCount: 22, totalInvestment: 85000000, isActive: true },
  { id: "7", code: "EQU", name: "Equateur", capital: "Mbandaka", region: "Nord", population: 2400000, surface: 103902, investmentsCount: 8, totalInvestment: 25000000, isActive: true },
  { id: "8", code: "TAN", name: "Tanganyika", capital: "Kalemie", region: "Sud", population: 3200000, surface: 134940, investmentsCount: 12, totalInvestment: 55000000, isActive: true },
  { id: "9", code: "HLO", name: "Haut-Lomami", capital: "Kamina", region: "Sud", population: 2800000, surface: 108204, investmentsCount: 6, totalInvestment: 15000000, isActive: true },
  { id: "10", code: "ITV", name: "Ituri", capital: "Bunia", region: "Est", population: 5700000, surface: 65658, investmentsCount: 10, totalInvestment: 28000000, isActive: true },
];

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState<Province[]>(mockProvinces);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const regions = [...new Set(provinces.map((p) => p.region))];

  const filteredProvinces = provinces.filter((province) => {
    const matchesSearch =
      province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.capital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" || province.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Mrd $`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} M $`;
    }
    return `${formatNumber(amount)} $`;
  };

  const stats = {
    total: provinces.length,
    totalPopulation: provinces.reduce((sum, p) => sum + p.population, 0),
    totalInvestments: provinces.reduce((sum, p) => sum + p.investmentsCount, 0),
    totalAmount: provinces.reduce((sum, p) => sum + p.totalInvestment, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Provinces
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Referentiel des provinces de la RDC
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter Province
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provinces</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Population</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatNumber(stats.totalPopulation)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
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
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatAmount(stats.totalAmount)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une province..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Toutes les regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Province</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Capitale</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Region</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Population</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Superficie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Investissements</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredProvinces.map((province) => (
                <tr key={province.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{province.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{province.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{province.capital}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {province.region}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {formatNumber(province.population)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {formatNumber(province.surface)} km²
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {province.investmentsCount} projets
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {formatAmount(province.totalInvestment)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProvinces.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucune province trouvee</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de <span className="font-medium">{filteredProvinces.length}</span> provinces
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
