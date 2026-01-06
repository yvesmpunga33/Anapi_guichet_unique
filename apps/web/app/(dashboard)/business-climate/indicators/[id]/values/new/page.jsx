"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../../../../../../contexts/PageTitleContext";

export default function NewIndicatorValuePage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(false);
  const [indicator, setIndicator] = useState(null);
  const [loadingIndicator, setLoadingIndicator] = useState(true);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    quarter: "",
    month: "",
    value: "",
    previousValue: "",
    rank: "",
    rankOutOf: "",
    source: "",
    notes: "",
    isVerified: false,
  });

  useEffect(() => {
    fetchIndicator();
  }, [id]);

  useEffect(() => {
    if (indicator) {
      document.title = `Ajouter valeur - ${indicator.name} | ANAPI`;
      setPageTitle(`Nouvelle valeur - ${indicator.name}`);
    }
    return () => setPageTitle(null);
  }, [indicator, setPageTitle]);

  const fetchIndicator = async () => {
    try {
      const response = await fetch(`/api/business-climate/indicators/${id}`);
      if (response.ok) {
        const data = await response.json();
        setIndicator(data);
        // Pre-fill previous value from latest value
        if (data.values && data.values.length > 0) {
          setFormData(prev => ({
            ...prev,
            previousValue: data.values[0].value,
          }));
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Indicateur non trouvé",
          confirmButtonColor: "#9333ea",
        }).then(() => router.push("/business-climate/indicators"));
      }
    } catch (error) {
      console.error("Error fetching indicator:", error);
    } finally {
      setLoadingIndicator(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const calculateChangePercentage = () => {
    if (formData.value && formData.previousValue) {
      const current = parseFloat(formData.value);
      const previous = parseFloat(formData.previousValue);
      if (previous !== 0) {
        return ((current - previous) / previous * 100).toFixed(2);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.value) {
      Swal.fire({
        icon: "warning",
        title: "Champs requis",
        text: "La valeur est obligatoire",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    setLoading(true);

    try {
      const changePercentage = calculateChangePercentage();

      const response = await fetch(`/api/business-climate/indicators/${id}/values`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          changePercentage: changePercentage ? parseFloat(changePercentage) : null,
          quarter: formData.quarter || null,
          month: formData.month || null,
          rank: formData.rank || null,
          rankOutOf: formData.rankOutOf || null,
        }),
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Valeur ajoutee",
          text: "La valeur a ete ajoutee avec succes",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push(`/business-climate/indicators/${id}`);
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error || "Erreur lors de l'ajout",
          confirmButtonColor: "#9333ea",
        });
      }
    } catch (error) {
      console.error("Error adding value:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'ajout de la valeur",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingIndicator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!indicator) {
    return null;
  }

  const changePercentage = calculateChangePercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/business-climate/indicators/${id}`}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-purple-600" />
            Ajouter une valeur
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {indicator.name} ({indicator.code})
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 space-y-6">
          {/* Period */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Periode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Annee <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2050"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trimestre (optionnel)
                </label>
                <select
                  name="quarter"
                  value={formData.quarter}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-</option>
                  <option value="1">T1 (Jan-Mar)</option>
                  <option value="2">T2 (Avr-Jun)</option>
                  <option value="3">T3 (Jul-Sep)</option>
                  <option value="4">T4 (Oct-Dec)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mois (optionnel)
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleDateString("fr-FR", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Value */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Valeur
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valeur actuelle <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  step="0.01"
                  placeholder={`Ex: ${indicator.measureType === "SCORE" ? "42.5" : indicator.measureType === "RANK" ? "175" : "100"}`}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Type: {indicator.measureType} {indicator.unit && `(${indicator.unit})`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valeur precedente (pour calcul variation)
                </label>
                <input
                  type="number"
                  name="previousValue"
                  value={formData.previousValue}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Valeur de la periode precedente"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {changePercentage && (
                  <p className={`text-sm mt-1 font-medium ${parseFloat(changePercentage) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Variation: {parseFloat(changePercentage) >= 0 ? "+" : ""}{changePercentage}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ranking */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Classement (optionnel)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rang
                </label>
                <input
                  type="number"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ex: 175"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sur combien de pays
                </label>
                <input
                  type="number"
                  name="rankOutOf"
                  value={formData.rankOutOf}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ex: 190"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Source & Notes */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Source et notes
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source des donnees
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder={indicator.dataSource || "Ex: Rapport Doing Business 2024"}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Notes ou commentaires sur cette valeur..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isVerified"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isVerified" className="text-sm text-gray-700 dark:text-gray-300">
                  Donnee verifiee et validee
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4">
            <Link
              href={`/business-climate/indicators/${id}`}
              className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
