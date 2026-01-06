"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePageTitle } from "../../../../../contexts/PageTitleContext";
import {
  BarChart3,
  ArrowLeft,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  Loader2,
  Globe,
  Clock,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  Activity,
  Info,
  Printer,
} from "lucide-react";
import Swal from "sweetalert2";

const categoryConfig = {
  DOING_BUSINESS: { label: "Doing Business", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  INVESTMENT_CLIMATE: { label: "Climat d'investissement", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40" },
  GOVERNANCE: { label: "Gouvernance", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  INFRASTRUCTURE: { label: "Infrastructure", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  HUMAN_CAPITAL: { label: "Capital humain", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  COMPETITIVENESS: { label: "Compétitivité", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/40" },
  TRADE: { label: "Commerce", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  CORRUPTION: { label: "Corruption", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  EASE_OF_BUSINESS: { label: "Facilité des affaires", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  CUSTOM: { label: "Personnalisé", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-600" },
};

const measureTypeLabels = {
  SCORE: "Score",
  RANK: "Classement",
  PERCENTAGE: "Pourcentage",
  DAYS: "Jours",
  COUNT: "Comptage",
  CURRENCY: "Montant",
  INDEX: "Indice",
  RATIO: "Ratio",
};

const frequencyLabels = {
  DAILY: "Quotidien",
  WEEKLY: "Hebdomadaire",
  MONTHLY: "Mensuel",
  QUARTERLY: "Trimestriel",
  ANNUALLY: "Annuel",
};

export default function IndicatorDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [indicator, setIndicator] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    fetchIndicator();
  }, [id]);

  useEffect(() => {
    if (indicator) {
      document.title = `${indicator.name} | Indicateurs | ANAPI`;
      // Set header title
      setPageTitle(indicator.name);
    }
    // Clear title when leaving page
    return () => setPageTitle(null);
  }, [indicator, setPageTitle]);

  const fetchIndicator = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business-climate/indicators/${id}`);
      if (response.ok) {
        const data = await response.json();
        setIndicator(data);
      } else if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Introuvable",
          text: "Cet indicateur n'existe pas.",
          confirmButtonColor: "#9333ea",
        }).then(() => router.push("/business-climate/indicators"));
      }
    } catch (error) {
      console.error("Error fetching indicator:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger l'indicateur",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Supprimer l'indicateur ?",
      text: "Cette action est irréversible. L'indicateur sera définitivement supprimé.",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/business-climate/indicators/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await Swal.fire({
            icon: "success",
            title: "Supprimé",
            text: "L'indicateur a été supprimé avec succès",
            confirmButtonColor: "#9333ea",
            timer: 2000,
            timerProgressBar: true,
          });
          router.push("/business-climate/indicators");
        } else {
          const error = await response.json();
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: error.error || "Impossible de supprimer l'indicateur",
            confirmButtonColor: "#9333ea",
          });
        }
      } catch (error) {
        console.error("Error deleting indicator:", error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de la suppression",
          confirmButtonColor: "#9333ea",
        });
      }
    }
  };

  const formatValue = (value, measureType, unit) => {
    if (value === null || value === undefined) return "-";
    const numValue = parseFloat(value);

    switch (measureType) {
      case "SCORE":
        return `${numValue.toFixed(1)} / 100`;
      case "RANK":
        return `#${numValue}`;
      case "PERCENTAGE":
        return `${numValue.toFixed(1)}%`;
      case "DAYS":
        return `${numValue} jours`;
      case "CURRENCY":
        return `${numValue.toLocaleString("fr-FR")} ${unit || "USD"}`;
      case "INDEX":
        return numValue.toFixed(2);
      default:
        return numValue.toLocaleString("fr-FR");
    }
  };

  const getTrendIcon = (value, betterDirection) => {
    if (!value || value.changePercentage === null) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }

    const change = parseFloat(value.changePercentage);
    const betterIsHigher = betterDirection === "HIGHER";

    if (change > 0) {
      return betterIsHigher
        ? <TrendingUp className="w-4 h-4 text-green-500" />
        : <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (change < 0) {
      return betterIsHigher
        ? <TrendingDown className="w-4 h-4 text-red-500" />
        : <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!indicator) {
    return null;
  }

  const catConfig = categoryConfig[indicator.category] || categoryConfig.CUSTOM;
  const latestValue = indicator.values && indicator.values.length > 0 ? indicator.values[0] : null;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          aside, header, nav {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .lg\\:pl-72 {
            padding-left: 0 !important;
          }
          .dark\\:bg-gray-800, .dark\\:bg-gray-900 {
            background: white !important;
          }
          .dark\\:text-white, .dark\\:text-gray-100, .dark\\:text-gray-200, .dark\\:text-gray-300 {
            color: black !important;
          }
          .dark\\:text-gray-400 {
            color: #666 !important;
          }
          .dark\\:border-gray-700, .dark\\:border-gray-600 {
            border-color: #ddd !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          .rounded-xl {
            border: 1px solid #ddd !important;
          }
          table {
            font-size: 11px !important;
          }
          h1 {
            font-size: 18px !important;
          }
          h2 {
            font-size: 14px !important;
          }
          .text-4xl {
            font-size: 24px !important;
          }
          .text-3xl {
            font-size: 20px !important;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 print:p-0 print:bg-white">
        {/* Print Header */}
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ANAPI - Indicateur du Climat des Affaires</h1>
              <p className="text-gray-600">Republique Democratique du Congo</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Imprime le {new Date().toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Link
            href="/business-climate/indicators"
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 print:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                {indicator.code}
              </span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${catConfig.bg} ${catConfig.color}`}>
                {catConfig.label}
              </span>
              {!indicator.isActive && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  Inactif
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {indicator.name}
            </h1>
            {indicator.subCategory && (
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {indicator.subCategory}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <Link
            href={`/business-climate/indicators/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Value Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Valeur actuelle
            </h2>

            {latestValue ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatValue(latestValue.value, indicator.measureType, indicator.unit)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {latestValue.year}
                    {latestValue.quarter && ` T${latestValue.quarter}`}
                    {latestValue.month && ` M${latestValue.month}`}
                  </p>
                </div>
                <div className="text-right">
                  {latestValue.changePercentage !== null && (
                    <div className="flex items-center gap-2 justify-end mb-2">
                      {getTrendIcon(latestValue, indicator.betterDirection)}
                      <span className={`text-lg font-semibold ${
                        parseFloat(latestValue.changePercentage) > 0
                          ? indicator.betterDirection === "HIGHER" ? "text-green-500" : "text-red-500"
                          : parseFloat(latestValue.changePercentage) < 0
                            ? indicator.betterDirection === "HIGHER" ? "text-red-500" : "text-green-500"
                            : "text-gray-400"
                      }`}>
                        {parseFloat(latestValue.changePercentage) > 0 ? "+" : ""}
                        {parseFloat(latestValue.changePercentage).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {latestValue.rank && (
                    <div className="flex items-center gap-2 justify-end text-amber-500">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">
                        Rang #{latestValue.rank}
                        {latestValue.rankOutOf && ` / ${latestValue.rankOutOf}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune valeur enregistrée</p>
              </div>
            )}

            {/* Target Progress */}
            {indicator.targetValue && latestValue && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objectif {indicator.targetYear}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {formatValue(indicator.targetValue, indicator.measureType, indicator.unit)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (parseFloat(latestValue.value) / parseFloat(indicator.targetValue)) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                  {((parseFloat(latestValue.value) / parseFloat(indicator.targetValue)) * 100).toFixed(1)}% de l'objectif
                </p>
              </div>
            )}
          </div>

          {/* Historical Values */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Historique des valeurs
              </h2>
              <Link
                href={`/business-climate/indicators/${id}/values/new`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 print:hidden"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Link>
            </div>

            {indicator.values && indicator.values.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-3 font-medium">Période</th>
                      <th className="pb-3 font-medium">Valeur</th>
                      <th className="pb-3 font-medium">Variation</th>
                      <th className="pb-3 font-medium">Rang</th>
                      <th className="pb-3 font-medium">Vérifié</th>
                      <th className="pb-3 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {indicator.values.map((value) => (
                      <tr key={value.id} className="text-sm">
                        <td className="py-3 text-gray-900 dark:text-white font-medium">
                          {value.year}
                          {value.quarter && ` T${value.quarter}`}
                          {value.month && ` M${value.month}`}
                        </td>
                        <td className="py-3 text-gray-900 dark:text-white">
                          {formatValue(value.value, indicator.measureType, indicator.unit)}
                        </td>
                        <td className="py-3">
                          {value.changePercentage !== null ? (
                            <span className={`flex items-center gap-1 ${
                              parseFloat(value.changePercentage) > 0
                                ? indicator.betterDirection === "HIGHER" ? "text-green-500" : "text-red-500"
                                : parseFloat(value.changePercentage) < 0
                                  ? indicator.betterDirection === "HIGHER" ? "text-red-500" : "text-green-500"
                                  : "text-gray-400"
                            }`}>
                              {getTrendIcon(value, indicator.betterDirection)}
                              {parseFloat(value.changePercentage) > 0 ? "+" : ""}
                              {parseFloat(value.changePercentage).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-300">
                          {value.rank ? (
                            <span>
                              #{value.rank}
                              {value.rankOutOf && ` / ${value.rankOutOf}`}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          {value.isVerified ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-300" />
                          )}
                        </td>
                        <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">
                          {value.source || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune valeur historique</p>
                <Link
                  href={`/business-climate/indicators/${id}/values/new`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une valeur
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Détails
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type de mesure</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {measureTypeLabels[indicator.measureType] || indicator.measureType}
                </p>
              </div>

              {indicator.unit && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Unité</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {indicator.unit}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Direction souhaitée</p>
                <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  {indicator.betterDirection === "HIGHER" ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Plus c'est élevé, mieux c'est
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      Plus c'est bas, mieux c'est
                    </>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fréquence de mise à jour</p>
                <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {frequencyLabels[indicator.updateFrequency] || indicator.updateFrequency}
                </p>
              </div>

              {indicator.dataSource && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Source des données</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    {indicator.dataSource}
                  </p>
                </div>
              )}

              {indicator.description && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {indicator.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Target Card */}
          {indicator.targetValue && (
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-100 dark:border-purple-800 p-6">
              <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objectif
              </h2>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                {formatValue(indicator.targetValue, indicator.measureType, indicator.unit)}
              </p>
              {indicator.targetYear && (
                <p className="text-purple-600 dark:text-purple-400">
                  À atteindre en {indicator.targetYear}
                </p>
              )}
            </div>
          )}

          {/* Metadata Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Informations système
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Créé le</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(indicator.createdAt)}
                </span>
              </div>
              {indicator.createdBy && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Par</span>
                  <span className="text-gray-900 dark:text-white">
                    {indicator.createdBy.firstName} {indicator.createdBy.lastName}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Ordre d'affichage</span>
                <span className="text-gray-900 dark:text-white">
                  {indicator.displayOrder}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
