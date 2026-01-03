"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Building2,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
  DollarSign,
  Award,
  FileCheck,
  PlusCircle,
  ChevronRight,
  Gavel,
  Target,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
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

const statusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  PUBLISHED: { label: "Publie", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  SUBMISSION_CLOSED: { label: "Cloture", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" },
  EVALUATION: { label: "Evaluation", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" },
  AWARDED: { label: "Attribue", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
  COMPLETED: { label: "Termine", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" },
  CANCELLED: { label: "Annule", color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
};

const contractStatusConfig = {
  DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
  SIGNED: { label: "Signe", color: "bg-blue-100 text-blue-800" },
  ACTIVE: { label: "En cours", color: "bg-green-100 text-green-800" },
  COMPLETED: { label: "Termine", color: "bg-emerald-100 text-emerald-800" },
  TERMINATED: { label: "Resilie", color: "bg-red-100 text-red-800" },
};

export default function ProcurementDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/procurement/dashboard?year=${year}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
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
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const tenders = data?.tenders || {};
  const bids = data?.bids || {};
  const bidders = data?.bidders || {};
  const contracts = data?.contracts || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/90 to-orange-600/90 dark:from-amber-800/70 dark:to-orange-700/70 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Gavel className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cellule de Passation de Marches</h1>
              <p className="text-amber-100 mt-1">
                Gestion des appels d'offres, soumissions et contrats
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y} className="text-gray-900">
                  {y}
                </option>
              ))}
            </select>
            <button
              onClick={fetchData}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link
              href="/procurement/tenders/new"
              className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nouvel Appel d'Offres
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Appels d'offres */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              {tenders.this_year || 0} cette annee
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tenders.total || 0}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Appels d'offres
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Publies: {tenders.published || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Evaluation: {tenders.evaluation || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Attribues: {tenders.awarded || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Brouillons: {tenders.draft || 0}</span>
            </div>
          </div>
        </div>

        {/* Soumissionnaires */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              parseInt(bidders.blacklisted) > 0
                ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            }`}>
              {parseInt(bidders.blacklisted) > 0 ? (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  {bidders.blacklisted} blacklistes
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Tous actifs
                </>
              )}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {bidders.total || 0}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Soumissionnaires enregistres
            </p>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Valeur totale des contrats:
            </div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(bidders.total_contracts_value || 0)}
            </div>
          </div>
        </div>

        {/* Contrats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              {contracts.active || 0} en cours
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {contracts.total || 0}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contrats
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progression moyenne</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {Math.round(contracts.avg_progress || 0)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.round(contracts.avg_progress || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Montants */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(contracts.total_value || 0)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Valeur totale des contrats
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Paye</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatCurrency(contracts.total_paid || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Budget AO</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {formatCurrency(tenders.total_budget || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {(data?.alerts?.upcomingDeadlines?.length > 0 || data?.alerts?.expiringContracts?.length > 0) && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
              Alertes et Echeances
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadlines AO */}
            {data?.alerts?.upcomingDeadlines?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                  Dates limites de soumission (7 jours)
                </h3>
                <div className="space-y-2">
                  {data.alerts.upcomingDeadlines.map((tender) => (
                    <Link
                      key={tender.id}
                      href={`/procurement/tenders/${tender.id}`}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {tender.reference} - {tender.title}
                      </span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap ml-2">
                        {format(new Date(tender.submission_deadline), "dd/MM/yyyy")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Contrats a echeance */}
            {data?.alerts?.expiringContracts?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                  Contrats a echeance (7 jours)
                </h3>
                <div className="space-y-2">
                  {data.alerts.expiringContracts.map((contract) => (
                    <Link
                      key={contract.id}
                      href={`/procurement/contracts/${contract.id}`}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {contract.contract_number} - {contract.title}
                      </span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap ml-2">
                        {format(new Date(contract.end_date), "dd/MM/yyyy")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appels d'offres recents */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Appels d'Offres Recents
            </h2>
            <Link
              href="/procurement/tenders"
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center"
            >
              Voir tout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {data?.recentTenders?.length > 0 ? (
              data.recentTenders.map((tender) => (
                <Link
                  key={tender.id}
                  href={`/procurement/tenders/${tender.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tender.reference}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        statusConfig[tender.status]?.color || "bg-gray-100 text-gray-800"
                      }`}>
                        {statusConfig[tender.status]?.label || tender.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {tender.title}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {formatCurrency(tender.estimated_budget, tender.currency)}
                    </div>
                    {tender.submission_deadline && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(tender.submission_deadline), "dd/MM/yyyy")}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun appel d'offres</p>
                <Link
                  href="/procurement/tenders/new"
                  className="inline-flex items-center mt-4 text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Creer un appel d'offres
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Soumissionnaires */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Top Entreprises
            </h2>
            <Link
              href="/procurement/bidders"
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center"
            >
              Voir tout
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {data?.topBidders?.length > 0 ? (
              data.topBidders.map((bidder, index) => (
                <Link
                  key={bidder.id}
                  href={`/procurement/bidders/${bidder.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? "bg-amber-500" :
                    index === 1 ? "bg-gray-400" :
                    index === 2 ? "bg-amber-700" : "bg-gray-300"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {bidder.company_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {bidder.total_contracts_won || 0} contrats
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {formatCurrency(bidder.total_contracts_value || 0)}
                    </div>
                    {bidder.rating && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Note: {bidder.rating}/5
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun soumissionnaire</p>
                <Link
                  href="/procurement/bidders/new"
                  className="inline-flex items-center mt-4 text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Ajouter une entreprise
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contrats Recents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-green-600" />
            Contrats Recents
          </h2>
          <Link
            href="/procurement/contracts"
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center"
          >
            Voir tout
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  N° Contrat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data?.recentContracts?.length > 0 ? (
                data.recentContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => window.location.href = `/procurement/contracts/${contract.id}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {contract.contract_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 dark:text-gray-300 truncate block max-w-xs">
                        {contract.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600 dark:text-gray-400">
                        {contract.contractor_name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(contract.contract_value, contract.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${contract.progress_percent || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.round(contract.progress_percent || 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        contractStatusConfig[contract.status]?.color || "bg-gray-100 text-gray-800"
                      }`}>
                        {contractStatusConfig[contract.status]?.label || contract.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun contrat</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/procurement/tenders"
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Appels d'Offres</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gerer les AO</p>
          </div>
        </Link>

        <Link
          href="/procurement/bidders"
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Soumissionnaires</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Registre entreprises</p>
          </div>
        </Link>

        <Link
          href="/procurement/contracts"
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors group"
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
            <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Contrats</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Suivi execution</p>
          </div>
        </Link>

        <Link
          href="/procurement/settings"
          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Configuration</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Types de documents</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
