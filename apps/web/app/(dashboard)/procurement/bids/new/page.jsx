"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileCheck,
  Building2,
  FileText,
  Package,
  Loader2,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  Search,
} from "lucide-react";

const deliveryUnits = [
  { value: "DAYS", label: "Jours" },
  { value: "WEEKS", label: "Semaines" },
  { value: "MONTHS", label: "Mois" },
];

const currencies = [
  { value: "USD", label: "USD - Dollar américain" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "CDF", label: "CDF - Franc congolais" },
];

export default function NewBidPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference data
  const [tenders, setTenders] = useState([]);
  const [bidders, setBidders] = useState([]);
  const [lots, setLots] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search states
  const [tenderSearch, setTenderSearch] = useState("");
  const [bidderSearch, setBidderSearch] = useState("");
  const [showTenderDropdown, setShowTenderDropdown] = useState(false);
  const [showBidderDropdown, setShowBidderDropdown] = useState(false);

  // Selected items display
  const [selectedTender, setSelectedTender] = useState(null);
  const [selectedBidder, setSelectedBidder] = useState(null);

  const [formData, setFormData] = useState({
    tenderId: "",
    bidderId: "",
    lotId: "",
    submissionDate: new Date().toISOString().split("T")[0],

    // Financial
    financialOffer: "",
    currency: "USD",

    // Technical
    technicalProposal: "",

    // Delivery
    deliveryTime: "",
    deliveryUnit: "DAYS",
    validityPeriod: 90,

    // Guarantee
    guaranteeProvided: false,
    guaranteeAmount: "",
    guaranteeReference: "",
    guaranteeExpiryDate: "",

    // Notes
    notes: "",
  });

  // Fetch tenders and bidders
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Charger tous les appels d'offres (pas seulement PUBLISHED pour les tests)
        const [tendersRes, biddersRes] = await Promise.all([
          fetch("/api/procurement/tenders?limit=100"),
          fetch("/api/procurement/bidders?limit=100"),
        ]);

        const [tendersData, biddersData] = await Promise.all([
          tendersRes.json(),
          biddersRes.json(),
        ]);

        if (tendersData.success) setTenders(tendersData.data || []);
        if (biddersData.success) setBidders(biddersData.data || []);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Fetch lots when tender changes
  useEffect(() => {
    const fetchLots = async () => {
      if (!formData.tenderId) {
        setLots([]);
        return;
      }
      try {
        const response = await fetch(`/api/procurement/tenders/${formData.tenderId}/lots`);
        const data = await response.json();
        if (data.success) {
          setLots(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching lots:", err);
        setLots([]);
      }
    };
    fetchLots();
  }, [formData.tenderId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked :
              type === "number" ? (value === "" ? "" : parseFloat(value)) :
              value,
    }));
  };

  const handleSelectTender = (tender) => {
    setFormData((prev) => ({ ...prev, tenderId: tender.id, lotId: "" }));
    setSelectedTender(tender);
    setTenderSearch("");
    setShowTenderDropdown(false);
  };

  const handleSelectBidder = (bidder) => {
    setFormData((prev) => ({ ...prev, bidderId: bidder.id }));
    setSelectedBidder(bidder);
    setBidderSearch("");
    setShowBidderDropdown(false);
  };

  const filteredTenders = tenders.filter((tender) =>
    tender.reference?.toLowerCase().includes(tenderSearch.toLowerCase()) ||
    tender.title?.toLowerCase().includes(tenderSearch.toLowerCase())
  );

  const filteredBidders = bidders.filter((bidder) =>
    bidder.companyName?.toLowerCase().includes(bidderSearch.toLowerCase()) ||
    bidder.rccm?.toLowerCase().includes(bidderSearch.toLowerCase()) ||
    bidder.nif?.toLowerCase().includes(bidderSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.tenderId) {
        throw new Error("L'appel d'offres est obligatoire");
      }
      if (!formData.bidderId) {
        throw new Error("Le soumissionnaire est obligatoire");
      }

      // Prepare data
      const submitData = {
        ...formData,
        financialOffer: formData.financialOffer ? parseFloat(formData.financialOffer) : null,
        guaranteeAmount: formData.guaranteeAmount ? parseFloat(formData.guaranteeAmount) : null,
        deliveryTime: formData.deliveryTime ? parseInt(formData.deliveryTime) : null,
        validityPeriod: formData.validityPeriod ? parseInt(formData.validityPeriod) : null,
        lotId: formData.lotId || null,
      };

      const response = await fetch("/api/procurement/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/procurement/bids`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "";
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/procurement/bids"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-blue-600" />
              Nouvelle soumission
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Enregistrez une nouvelle soumission pour un appel d'offres
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tender Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Appel d'offres *
          </h2>

          <div className="space-y-4">
            {/* Tender Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un appel d'offres par référence ou titre..."
                  value={tenderSearch}
                  onChange={(e) => {
                    setTenderSearch(e.target.value);
                    setShowTenderDropdown(true);
                  }}
                  onFocus={() => setShowTenderDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Dropdown */}
              {showTenderDropdown && !selectedTender && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredTenders.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun appel d'offres trouvé
                    </div>
                  ) : (
                    filteredTenders.map((tender) => (
                      <button
                        key={tender.id}
                        type="button"
                        onClick={() => handleSelectTender(tender)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-0"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {tender.reference}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {tender.title}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Budget: {formatCurrency(tender.estimatedBudget, tender.currency)}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Tender Display */}
            {selectedTender && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-blue-800 dark:text-blue-300">
                      {selectedTender.reference}
                    </div>
                    <div className="text-blue-700 dark:text-blue-400 mt-1">
                      {selectedTender.title}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-500 mt-2">
                      Budget estimé: {formatCurrency(selectedTender.estimatedBudget, selectedTender.currency)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTender(null);
                      setFormData((prev) => ({ ...prev, tenderId: "", lotId: "" }));
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Changer
                  </button>
                </div>
              </div>
            )}

            {/* Lot Selection */}
            {lots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Package className="w-4 h-4 inline mr-1" />
                  Lot spécifique (optionnel)
                </label>
                <select
                  name="lotId"
                  value={formData.lotId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les lots / Offre globale</option>
                  {lots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      Lot {lot.lotNumber} - {lot.title} ({formatCurrency(lot.estimatedValue)})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Laissez vide si la soumission couvre tous les lots
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bidder Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            Soumissionnaire *
          </h2>

          <div className="space-y-4">
            {/* Bidder Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, RCCM ou NIF..."
                  value={bidderSearch}
                  onChange={(e) => {
                    setBidderSearch(e.target.value);
                    setShowBidderDropdown(true);
                  }}
                  onFocus={() => setShowBidderDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Dropdown */}
              {showBidderDropdown && !selectedBidder && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredBidders.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun soumissionnaire trouvé
                    </div>
                  ) : (
                    filteredBidders.map((bidder) => (
                      <button
                        key={bidder.id}
                        type="button"
                        onClick={() => handleSelectBidder(bidder)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-0"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {bidder.companyName}
                        </div>
                        <div className="flex gap-3 mt-1">
                          {bidder.rccm && (
                            <span className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                              RCCM: {bidder.rccm}
                            </span>
                          )}
                          {bidder.nif && (
                            <span className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                              NIF: {bidder.nif}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Bidder Display */}
            {selectedBidder && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-green-800 dark:text-green-300">
                      {selectedBidder.companyName}
                    </div>
                    <div className="flex gap-3 mt-2">
                      {selectedBidder.rccm && (
                        <span className="text-sm text-green-700 dark:text-green-400">
                          RCCM: {selectedBidder.rccm}
                        </span>
                      )}
                      {selectedBidder.nif && (
                        <span className="text-sm text-green-700 dark:text-green-400">
                          NIF: {selectedBidder.nif}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBidder(null);
                      setFormData((prev) => ({ ...prev, bidderId: "" }));
                    }}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                  >
                    Changer
                  </button>
                </div>
              </div>
            )}

            {/* Link to create new bidder */}
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                Soumissionnaire non trouvé ?
              </span>
              <Link
                href="/procurement/bidders/new"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Créer un nouveau soumissionnaire
              </Link>
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Détails de la soumission
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de soumission
              </label>
              <input
                type="date"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période de validité (jours)
              </label>
              <input
                type="number"
                name="validityPeriod"
                value={formData.validityPeriod}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="90"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Durée pendant laquelle l'offre reste valide
              </p>
            </div>
          </div>
        </div>

        {/* Financial Offer */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Offre financière
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant de l'offre
              </label>
              <input
                type="number"
                name="financialOffer"
                value={formData.financialOffer}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Devise
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((cur) => (
                  <option key={cur.value} value={cur.value}>{cur.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Technical Proposal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Proposition technique
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Résumé de la proposition technique
              </label>
              <textarea
                name="technicalProposal"
                value={formData.technicalProposal}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez brièvement la proposition technique..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Délai de livraison / exécution
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unité de temps
                </label>
                <select
                  name="deliveryUnit"
                  value={formData.deliveryUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {deliveryUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Garantie de soumission
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="guaranteeProvided"
                checked={formData.guaranteeProvided}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Une garantie de soumission a été fournie
              </span>
            </label>

            {formData.guaranteeProvided && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Montant de la garantie
                  </label>
                  <input
                    type="number"
                    name="guaranteeAmount"
                    value={formData.guaranteeAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Référence de la garantie
                  </label>
                  <input
                    type="text"
                    name="guaranteeReference"
                    value={formData.guaranteeReference}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="N° de référence bancaire"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    name="guaranteeExpiryDate"
                    value={formData.guaranteeExpiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notes et observations
          </h2>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Notes internes sur cette soumission..."
          />
        </div>

        {/* Submit buttons */}
        <div className="flex items-center justify-end gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <Link
            href="/procurement/bids"
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer la soumission
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
