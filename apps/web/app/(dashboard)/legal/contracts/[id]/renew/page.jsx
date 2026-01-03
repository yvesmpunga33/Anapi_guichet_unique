"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  RefreshCcw,
  ArrowLeft,
  FileSignature,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Copy,
  FileText,
  History,
  Bell,
  Save,
} from "lucide-react";

export default function RenewContractPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [renewalData, setRenewalData] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    reference: "",
    startDate: "",
    endDate: "",
    value: "",
    currency: "USD",
    keepParties: true,
    keepObligations: true,
    notifyParties: false,
    notes: "",
  });

  useEffect(() => {
    fetchRenewalInfo();
  }, [params.id]);

  const fetchRenewalInfo = async () => {
    try {
      const response = await fetch(`/api/legal/contracts/${params.id}/renew`);
      if (response.ok) {
        const data = await response.json();
        setRenewalData(data);

        // Pre-remplir le formulaire avec les suggestions
        setFormData({
          title: `${data.contract.title} (Renouvellement)`,
          reference: "",
          startDate: data.suggestions.startDate,
          endDate: data.suggestions.endDate,
          value: data.suggestions.value || "",
          currency: data.suggestions.currency || "USD",
          keepParties: true,
          keepObligations: true,
          notifyParties: false,
          notes: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement");
      }
    } catch (err) {
      console.error("Error fetching renewal info:", err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      alert("Veuillez remplir les dates");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/legal/contracts/${params.id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/legal/contracts/${data.renewedContract.id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erreur lors du renouvellement");
      }
    } catch (err) {
      console.error("Error renewing contract:", err);
      alert("Erreur lors du renouvellement");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Erreur</h2>
          <p className="text-gray-400">{error}</p>
          <Link
            href={`/legal/contracts/${params.id}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au contrat
          </Link>
        </div>
      </div>
    );
  }

  const { contract, renewalInfo, suggestions, renewalHistory } = renewalData || {};

  // Verifier si le contrat peut etre renouvele
  if (!renewalInfo?.canRenew) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Renouvellement non disponible</h2>
          <p className="text-gray-400">
            Ce contrat ne peut pas etre renouvele car son statut est: {contract?.status}
          </p>
          <Link
            href={`/legal/contracts/${params.id}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au contrat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/legal/contracts/${params.id}`}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <RefreshCcw className="w-8 h-8 text-green-500" />
            Renouvellement de contrat
          </h1>
          <p className="text-gray-400 mt-1">Creer un nouveau contrat base sur le contrat existant</p>
        </div>
      </div>

      {/* Alerte expiration */}
      {renewalInfo?.isExpired ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <p className="text-red-400 font-medium">Contrat expire</p>
            <p className="text-gray-400 text-sm">
              Ce contrat a expire il y a {Math.abs(renewalInfo.daysRemaining)} jours
            </p>
          </div>
        </div>
      ) : renewalInfo?.daysRemaining <= 30 ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4">
          <Clock className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-yellow-400 font-medium">Expiration imminente</p>
            <p className="text-gray-400 text-sm">
              Ce contrat expire dans {renewalInfo.daysRemaining} jours
            </p>
          </div>
        </div>
      ) : null}

      {/* Contrat original */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-blue-500" />
          Contrat original
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Titre</p>
            <p className="text-white font-medium">{contract?.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Reference</p>
            <p className="text-white font-medium">{contract?.reference || "Non defini"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Periode</p>
            <p className="text-white">
              {new Date(contract?.startDate).toLocaleDateString("fr-FR")} -{" "}
              {new Date(contract?.endDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Duree originale</p>
            <p className="text-white">{renewalInfo?.originalDuration} jours</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Valeur</p>
            <p className="text-green-400 font-medium">
              {contract?.value
                ? `${parseFloat(contract.value).toLocaleString("fr-FR")} ${contract.currency || "USD"}`
                : "Non defini"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Type de renouvellement</p>
            <p className="text-white">
              {contract?.renewalType === "AUTO"
                ? "Automatique"
                : contract?.renewalType === "TACIT"
                ? "Tacite reconduction"
                : "Manuel"}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire de renouvellement */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations du nouveau contrat */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Nouveau contrat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reference (optionnel)
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleChange("reference", e.target.value)}
                placeholder="Auto-generee si vide"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Periode du nouveau contrat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date de debut *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date de fin *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Suggestion: meme duree que le contrat original ({renewalInfo?.originalDuration} jours)
          </p>
        </div>

        {/* Valeur */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Valeur financiere
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Montant</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Devise</label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="USD">Dollar US (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="CDF">Franc Congolais (CDF)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Copy className="w-5 h-5 text-green-500" />
            Options de renouvellement
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.keepParties}
                onChange={(e) => handleChange("keepParties", e.target.checked)}
                className="w-5 h-5 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-white">Conserver les parties</span>
                <p className="text-sm text-gray-400">
                  Reprendre les parties du contrat original ({contract?.parties?.length || 0} parties)
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.keepObligations}
                onChange={(e) => handleChange("keepObligations", e.target.checked)}
                className="w-5 h-5 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-white">Conserver les obligations</span>
                <p className="text-sm text-gray-400">Reprendre les obligations du contrat original</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyParties}
                onChange={(e) => handleChange("notifyParties", e.target.checked)}
                className="w-5 h-5 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  Notifier les parties par email
                </span>
                <p className="text-sm text-gray-400">
                  Envoyer un email aux parties ayant une adresse email
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Notes de renouvellement</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            placeholder="Notes ou commentaires sur ce renouvellement..."
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link
            href={`/legal/contracts/${params.id}`}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            Creer le renouvellement
          </button>
        </div>
      </form>

      {/* Historique des renouvellements */}
      {renewalHistory?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-purple-500" />
            Historique des renouvellements
          </h2>
          <div className="space-y-3">
            {renewalHistory.map((item) => (
              <Link
                key={item.id}
                href={`/legal/contracts/${item.id}`}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-gray-400">
                    {item.reference} |{" "}
                    {new Date(item.startDate).toLocaleDateString("fr-FR")} -{" "}
                    {new Date(item.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "RENEWED"
                        ? "bg-blue-500/20 text-blue-400"
                        : item.status === "EXPIRED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
