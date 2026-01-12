"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Target,
  Award,
} from "lucide-react";
import { BidGetById, BidUpdate, TenderList, BidderList } from "@/app/services/admin/Procurement.service";

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

const statuses = [
  { value: "RECEIVED", label: "Reçue" },
  { value: "UNDER_REVIEW", label: "En cours d'examen" },
  { value: "TECHNICALLY_COMPLIANT", label: "Conforme techniquement" },
  { value: "TECHNICALLY_NON_COMPLIANT", label: "Non conforme techniquement" },
  { value: "FINANCIALLY_EVALUATED", label: "Évaluée financièrement" },
  { value: "SHORTLISTED", label: "Présélectionnée" },
  { value: "AWARDED", label: "Attribuée" },
  { value: "REJECTED", label: "Rejetée" },
  { value: "WITHDRAWN", label: "Retirée" },
];

export default function EditBidPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Reference data
  const [tenders, setTenders] = useState([]);
  const [bidders, setBidders] = useState([]);
  const [lots, setLots] = useState([]);

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
    submissionDate: "",
    status: "RECEIVED",

    // Financial
    financialOffer: "",
    currency: "USD",

    // Technical
    technicalProposal: "",
    technicalScore: "",
    technicalComments: "",

    // Financial evaluation
    financialScore: "",
    totalScore: "",
    rank: "",

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

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  // Fetch bid data
  useEffect(() => {
    const fetchBid = async () => {
      try {
        const response = await BidGetById(params.id);
        const data = response.data;

        if (data.success && data.data) {
          const bid = data.data;
          setFormData({
            tenderId: bid.tenderId || "",
            bidderId: bid.bidderId || "",
            lotId: bid.lotId || "",
            submissionDate: formatDateForInput(bid.submissionDate),
            status: bid.status || "RECEIVED",
            financialOffer: bid.financialOffer || "",
            currency: bid.currency || "USD",
            technicalProposal: bid.technicalProposal || "",
            technicalScore: bid.technicalScore || "",
            technicalComments: bid.technicalComments || "",
            financialScore: bid.financialScore || "",
            totalScore: bid.totalScore || "",
            rank: bid.rank || "",
            deliveryTime: bid.deliveryTime || "",
            deliveryUnit: bid.deliveryUnit || "DAYS",
            validityPeriod: bid.validityPeriod || 90,
            guaranteeProvided: bid.guaranteeProvided || false,
            guaranteeAmount: bid.guaranteeAmount || "",
            guaranteeReference: bid.guaranteeReference || "",
            guaranteeExpiryDate: formatDateForInput(bid.guaranteeExpiryDate),
            notes: bid.notes || "",
          });

          // Set selected tender and bidder
          if (bid.tender) {
            setSelectedTender(bid.tender);
          }
          if (bid.bidder) {
            setSelectedBidder(bid.bidder);
          }
        } else {
          setError(data.error || "Soumission non trouvée");
        }
      } catch (err) {
        setError("Erreur lors du chargement");
      }
    };

    if (params.id) {
      fetchBid();
    }
  }, [params.id]);

  // Fetch reference data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tendersRes, biddersRes] = await Promise.all([
          TenderList({ limit: 100 }),
          BidderList({ limit: 100 }),
        ]);

        const tendersData = tendersRes.data;
        const biddersData = biddersRes.data;

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
        technicalScore: formData.technicalScore ? parseFloat(formData.technicalScore) : null,
        financialScore: formData.financialScore ? parseFloat(formData.financialScore) : null,
        totalScore: formData.totalScore ? parseFloat(formData.totalScore) : null,
        rank: formData.rank ? parseInt(formData.rank) : null,
        lotId: formData.lotId || null,
      };

      const response = await BidUpdate(params.id, submitData);
      const data = response.data;

      if (data.success) {
        router.push(`/procurement/bids/${params.id}`);
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
            href={`/procurement/bids/${params.id}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-blue-600" />
              Modifier la soumission
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Modifiez les informations de cette soumission
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
        {/* Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Statut de la soumission
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut actuel
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tender Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Appel d'offres *
          </h2>

          <div className="space-y-4">
            {/* Selected Tender Display or Search */}
            {selectedTender ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-blue-800 dark:text-blue-300">
                      {selectedTender.reference}
                    </div>
                    <div className="text-blue-700 dark:text-blue-400 mt-1">
                      {selectedTender.title}
                    </div>
                    {selectedTender.estimatedBudget && (
                      <div className="text-sm text-blue-600 dark:text-blue-500 mt-2">
                        Budget estimé: {formatCurrency(selectedTender.estimatedBudget, selectedTender.currency)}
                      </div>
                    )}
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
            ) : (
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

                {showTenderDropdown && (
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
                        </button>
                      ))
                    )}
                  </div>
                )}
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
            {selectedBidder ? (
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
            ) : (
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

                {showBidderDropdown && (
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
            )}
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

        {/* Technical Evaluation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            Évaluation
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Score technique (%)
                </label>
                <input
                  type="number"
                  name="technicalScore"
                  value={formData.technicalScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Score financier (%)
                </label>
                <input
                  type="number"
                  name="financialScore"
                  value={formData.financialScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Score total (%)
                </label>
                <input
                  type="number"
                  name="totalScore"
                  value={formData.totalScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Classement
                </label>
                <input
                  type="number"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Commentaires d'évaluation
              </label>
              <textarea
                name="technicalComments"
                value={formData.technicalComments}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Commentaires sur l'évaluation technique et financière..."
              />
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
            href={`/procurement/bids/${params.id}`}
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
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
