"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  MapPin,
  Factory,
  Calendar,
  Download,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
} from "lucide-react";

const statsCards = [
  {
    title: "Total Investissements",
    value: "$1.89 Mrd",
    change: 12.5,
    changeLabel: "vs mois dernier",
    icon: DollarSign,
    color: "green",
  },
  {
    title: "Projets Actifs",
    value: "248",
    change: 8.2,
    changeLabel: "vs mois dernier",
    icon: TrendingUp,
    color: "blue",
  },
  {
    title: "Investisseurs",
    value: "156",
    change: 15.3,
    changeLabel: "vs mois dernier",
    icon: Users,
    color: "purple",
  },
  {
    title: "Emplois Crees",
    value: "62,450",
    change: -2.4,
    changeLabel: "vs mois dernier",
    icon: Building2,
    color: "orange",
  },
];

const investmentBySector = [
  { label: "Mines", value: 850, percentage: 45, color: "bg-orange-500" },
  { label: "Energie", value: 320, percentage: 17, color: "bg-yellow-500" },
  { label: "Agriculture", value: 180, percentage: 10, color: "bg-green-500" },
  { label: "Industrie", value: 250, percentage: 13, color: "bg-purple-500" },
  { label: "BTP", value: 150, percentage: 8, color: "bg-slate-500" },
  { label: "Autres", value: 140, percentage: 7, color: "bg-gray-400" },
];

const investmentByProvince = [
  { label: "Haut-Katanga", value: 450, percentage: 24, color: "bg-blue-500" },
  { label: "Lualaba", value: 380, percentage: 20, color: "bg-blue-400" },
  { label: "Kinshasa", value: 290, percentage: 15, color: "bg-blue-300" },
  { label: "Kongo Central", value: 180, percentage: 10, color: "bg-cyan-500" },
  { label: "Nord-Kivu", value: 120, percentage: 6, color: "bg-cyan-400" },
  { label: "Autres", value: 470, percentage: 25, color: "bg-gray-400" },
];

const monthlyData = [
  { month: "Jan", investments: 45, amount: 120 },
  { month: "Fev", investments: 52, amount: 145 },
  { month: "Mar", investments: 38, amount: 98 },
  { month: "Avr", investments: 65, amount: 180 },
  { month: "Mai", investments: 48, amount: 135 },
  { month: "Jun", investments: 72, amount: 210 },
  { month: "Jul", investments: 55, amount: 155 },
  { month: "Aou", investments: 61, amount: 175 },
  { month: "Sep", investments: 78, amount: 225 },
  { month: "Oct", investments: 82, amount: 240 },
  { month: "Nov", investments: 69, amount: 195 },
  { month: "Dec", investments: 85, amount: 260 },
];

const topInvestors = [
  { name: "Congo Mining Corporation", amount: 450, country: "Afrique du Sud", projects: 5 },
  { name: "African Development Fund", amount: 320, country: "Cote d'Ivoire", projects: 8 },
  { name: "TechInvest Africa Ltd", amount: 180, country: "Kenya", projects: 3 },
  { name: "AgroTech RDC SARL", amount: 120, country: "RDC", projects: 4 },
  { name: "Congo Cement Industries", amount: 95, country: "RDC", projects: 2 },
];

const colorClasses = {
  green: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-100 dark:bg-green-900/30" },
  blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100 dark:bg-blue-900/30" },
  purple: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-100 dark:bg-purple-900/30" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-100 dark:bg-orange-900/30" },
};

export default function StatisticsPage() {
  const [period, setPeriod] = useState("12m");

  const maxMonthlyAmount = Math.max(...monthlyData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Statistiques
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Vue d'ensemble des investissements en RDC
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="30d">30 derniers jours</option>
            <option value="3m">3 derniers mois</option>
            <option value="6m">6 derniers mois</option>
            <option value="12m">12 derniers mois</option>
            <option value="all">Tout</option>
          </select>
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCcw className="w-5 h-5 text-gray-500" />
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const colors = colorClasses[stat.color];
          const Icon = stat.icon;
          const isPositive = stat.change > 0;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment by Sector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Investissements par Secteur
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Repartition en millions USD
              </p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {investmentBySector.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.value}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment by Province */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Investissements par Province
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Repartition geographique
              </p>
            </div>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {investmentByProvince.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.value}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Evolution Mensuelle
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nombre de projets et montants investis
            </p>
          </div>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64">
          <div className="flex items-end justify-between h-48 gap-2">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.amount / maxMonthlyAmount) * 100}%` }}
                  title={`$${item.amount}M`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Montant (M$)</span>
          </div>
        </div>
      </div>

      {/* Top Investors */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Investisseurs
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Par montant total investi
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Investisseur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Pays</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Projets</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Montant Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {topInvestors.map((investor, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-gray-100 text-gray-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-50 text-gray-500"
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{investor.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{investor.country}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm">
                      {investor.projects} projets
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${investor.amount}M
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <Factory className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">9</p>
          <p className="text-sm opacity-80">Secteurs couverts</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <MapPin className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">26</p>
          <p className="text-sm opacity-80">Provinces actives</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <Building2 className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm opacity-80">Ministeres partenaires</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <Calendar className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">18j</p>
          <p className="text-sm opacity-80">Delai moyen traitement</p>
        </div>
      </div>
    </div>
  );
}
