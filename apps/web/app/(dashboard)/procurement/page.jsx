"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProcurementDashboard } from "@/app/services/admin/Procurement.service";
import {
  FileText,
  Building2,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  DollarSign,
  Award,
  FileCheck,
  PlusCircle,
  ChevronRight,
  Gavel,
  Target,
  RefreshCw,
  Eye,
  Activity,
  PieChart,
  BarChart3,
  Briefcase,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formatCurrency = (amount, currency = "USD") => {
  if (!amount) return "0";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num) => {
  if (!num) return "0";
  return new Intl.NumberFormat("fr-FR").format(num);
};

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", icon: FileText },
  PUBLISHED: { label: "Publié", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", icon: Eye },
  SUBMISSION_CLOSED: { label: "Clôturé", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: Clock },
  EVALUATION: { label: "Évaluation", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300", icon: Target },
  AWARDED: { label: "Attribué", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: Award },
  COMPLETED: { label: "Terminé", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300", icon: CheckCircle },
  CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", icon: XCircle },
};

const contractStatusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  SIGNED: { label: "Signé", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  ACTIVE: { label: "En cours", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
  COMPLETED: { label: "Terminé", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" },
  TERMINATED: { label: "Résilié", color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
};

// Simple bar chart component
const SimpleBarChart = ({ data, maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500"
            style={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Donut chart component
const DonutChart = ({ data, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let currentAngle = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="w-full h-full">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -currentAngle;
          currentAngle += percentage;

          return (
            <circle
              key={index}
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">{total}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Total</div>
        </div>
      </div>
    </div>
  );
};

export default function ProcurementDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await ProcurementDashboard(year);

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const tenders = data?.tenders || {};
  const bids = data?.bids || {};
  const bidders = data?.bidders || {};
  const contracts = data?.contracts || {};

  // Prepare chart data
  const tenderStatusData = [
    { label: "Brouillons", value: parseInt(tenders.draft) || 0, color: "#9CA3AF" },
    { label: "Publiés", value: parseInt(tenders.published) || 0, color: "#3B82F6" },
    { label: "Évaluation", value: parseInt(tenders.evaluation) || 0, color: "#8B5CF6" },
    { label: "Attribués", value: parseInt(tenders.awarded) || 0, color: "#10B981" },
    { label: "Terminés", value: parseInt(tenders.completed) || 0, color: "#059669" },
  ].filter(d => d.value > 0);

  const monthlyChartData = Array.from({ length: 12 }, (_, i) => {
    const monthData = data?.charts?.tendersMonthly?.find(m => parseInt(m.month) === i + 1);
    return {
      label: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i],
      value: parseInt(monthData?.count) || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Gavel className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Passation de Marchés</h1>
              <p className="text-blue-100 mt-1 text-sm lg:text-base">
                Tableau de bord - Gestion des appels d'offres et contrats
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur text-sm"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y} className="text-gray-900">
                  {y}
                </option>
              ))}
            </select>
            <button
              onClick={fetchData}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link
              href="/procurement/tenders/new"
              className="inline-flex items-center px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-medium transition-colors shadow-lg text-sm"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nouvel AO
            </Link>
          </div>
        </div>

        {/* Quick Stats in Header */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-200" />
              <div>
                <div className="text-2xl font-bold">{formatNumber(tenders.total)}</div>
                <div className="text-blue-200 text-sm">Appels d'offres</div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-green-200" />
              <div>
                <div className="text-2xl font-bold">{formatNumber(bids.total)}</div>
                <div className="text-blue-200 text-sm">Soumissions</div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-yellow-200" />
              <div>
                <div className="text-2xl font-bold">{formatNumber(bidders.total)}</div>
                <div className="text-blue-200 text-sm">Soumissionnaires</div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-purple-200" />
              <div>
                <div className="text-2xl font-bold">{formatNumber(contracts.total)}</div>
                <div className="text-blue-200 text-sm">Contrats</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {(data?.alerts?.upcomingDeadlines?.length > 0 || data?.alerts?.expiringContracts?.length > 0) && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
              Alertes et Échéances
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.alerts?.upcomingDeadlines?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Dates limites (7 jours)
                </h3>
                <div className="space-y-2">
                  {data.alerts.upcomingDeadlines.slice(0, 3).map((tender) => (
                    <Link
                      key={tender.id}
                      href={`/procurement/tenders/${tender.id}`}
                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-100 dark:border-amber-800/30"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {tender.reference}
                      </span>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap ml-2 bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">
                        {format(new Date(tender.submission_deadline), "dd/MM")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data?.alerts?.expiringContracts?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Contrats à échéance (7 jours)
                </h3>
                <div className="space-y-2">
                  {data.alerts.expiringContracts.slice(0, 3).map((contract) => (
                    <Link
                      key={contract.id}
                      href={`/procurement/contracts/${contract.id}`}
                      className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-100 dark:border-amber-800/30"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {contract.contract_number}
                      </span>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap ml-2 bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">
                        {format(new Date(contract.end_date), "dd/MM")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Appels d'offres */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              {tenders.this_year || 0} en {year}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatNumber(tenders.total)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Appels d'offres</p>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Publiés: {tenders.published || 0}
            </span>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Attribués: {tenders.awarded || 0}
            </span>
          </div>
        </div>

        {/* Soumissions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            {parseInt(bids.awarded) > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                <Award className="w-3 h-3 mr-1" />
                {bids.awarded} attribuées
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatNumber(bids.total)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Soumissions</p>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Reçues: {bids.received || 0}
            </span>
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Évaluées: {bids.evaluated || 0}
            </span>
          </div>
        </div>

        {/* Soumissionnaires */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
              parseInt(bidders.blacklisted) > 0
                ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                : "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300"
            }`}>
              {parseInt(bidders.blacklisted) > 0 ? (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  {bidders.blacklisted} blacklistés
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Tous actifs
                </>
              )}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatNumber(bidders.total)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Soumissionnaires</p>
          <div className="mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Valeur totale contrats:</span>
            <span className="ml-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
              {formatCurrency(bidders.total_contracts_value || 0)}
            </span>
          </div>
        </div>

        {/* Contrats */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              <Activity className="w-3 h-3 mr-1" />
              {contracts.active || 0} actifs
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatNumber(contracts.total)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Contrats</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Progression moyenne</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {Math.round(contracts.avg_progress || 0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-purple-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.round(contracts.avg_progress || 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-green-100 text-sm">Valeur totale des contrats</span>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(contracts.total_value || 0)}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-100">Montant payé</span>
              <span className="font-semibold">{formatCurrency(contracts.total_paid || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-blue-100 text-sm">Budget total des AO</span>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(tenders.total_budget || 0)}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-100">AO publiés</span>
              <span className="font-semibold">{tenders.published || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              AO par mois ({year})
            </h3>
          </div>
          <SimpleBarChart data={monthlyChartData} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appels d'offres récents */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Appels d'Offres Récents
            </h2>
            <Link
              href="/procurement/tenders"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center font-medium"
            >
              Voir tout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {data?.recentTenders?.length > 0 ? (
              data.recentTenders.map((tender) => {
                const StatusIcon = statusConfig[tender.status]?.icon || FileText;
                return (
                  <Link
                    key={tender.id}
                    href={`/procurement/tenders/${tender.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                        <StatusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {tender.reference}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig[tender.status]?.color || "bg-gray-100 text-gray-800"}`}>
                            {statusConfig[tender.status]?.label || tender.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {tender.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(tender.estimated_budget, tender.currency)}
                      </div>
                      {tender.submission_deadline && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {format(new Date(tender.submission_deadline), "dd/MM/yyyy")}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Aucun appel d'offres</p>
                <Link
                  href="/procurement/tenders/new"
                  className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Créer un appel d'offres
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Soumissionnaires + Status Distribution */}
        <div className="space-y-6">
          {/* Status Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Répartition des AO
            </h3>
            <div className="flex items-center justify-center">
              {tenderStatusData.length > 0 ? (
                <DonutChart data={tenderStatusData} />
              ) : (
                <div className="text-gray-400 text-sm">Pas de données</div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {tenderStatusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 dark:text-gray-400">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bidders */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top Entreprises
              </h2>
              <Link
                href="/procurement/bidders"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                Voir tout
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {data?.topBidders?.length > 0 ? (
                data.topBidders.slice(0, 5).map((bidder, index) => (
                  <Link
                    key={bidder.id}
                    href={`/procurement/bidders/${bidder.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? "bg-amber-500" :
                      index === 1 ? "bg-gray-400" :
                      index === 2 ? "bg-amber-700" : "bg-gray-300"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {bidder.company_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {bidder.total_contracts_won || 0} contrats
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        {formatCurrency(bidder.total_contracts_value || 0)}
                      </div>
                      {bidder.rating && (
                        <div className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {bidder.rating}
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Aucun soumissionnaire</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contrats Récents */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Contrats Récents
          </h2>
          <Link
            href="/procurement/contracts"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center font-medium"
          >
            Voir tout
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  N° Contrat
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valeur
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {data?.recentContracts?.length > 0 ? (
                data.recentContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/procurement/contracts/${contract.id}`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {contract.contract_number}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-700 dark:text-gray-300 truncate block max-w-xs text-sm">
                        {contract.title}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {contract.contractor_name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(contract.contract_value, contract.currency)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${contract.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {Math.round(contract.progress_percent || 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${contractStatusConfig[contract.status]?.color || "bg-gray-100 text-gray-800"}`}>
                        {contractStatusConfig[contract.status]?.label || contract.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">Aucun contrat</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link
          href="/procurement/tenders"
          className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group text-center"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Appels d'Offres</span>
        </Link>

        <Link
          href="/procurement/bids"
          className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group text-center"
        >
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
            <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Soumissions</span>
        </Link>

        <Link
          href="/procurement/bidders"
          className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all group text-center"
        >
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
            <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Soumissionnaires</span>
        </Link>

        <Link
          href="/procurement/contracts"
          className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group text-center"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Contrats</span>
        </Link>

        <Link
          href="/procurement/config"
          className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group text-center"
        >
          <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-600 transition-colors">
            <Target className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Configuration</span>
        </Link>
      </div>
    </div>
  );
}
