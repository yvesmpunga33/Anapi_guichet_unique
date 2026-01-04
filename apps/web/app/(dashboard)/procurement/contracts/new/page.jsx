'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, DollarSign, Calendar, User, StickyNote, Loader2 } from 'lucide-react';

const statusOptions = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PENDING_SIGNATURE', label: 'En attente de signature' },
  { value: 'SIGNED', label: 'Signé' },
  { value: 'ACTIVE', label: 'Actif' },
];

const currencyOptions = ['USD', 'CDF', 'EUR'];

export default function NewContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tenderId: '',
    bidId: '',
    bidderId: '',
    contractValue: '',
    currency: 'USD',
    signatureDate: '',
    effectiveDate: '',
    startDate: '',
    endDate: '',
    deliveryDeadline: '',
    deliveryLocation: '',
    status: 'DRAFT',
    performanceGuarantee: '',
    guaranteeReference: '',
    guaranteeExpiryDate: '',
    advancePayment: '',
    advancePaymentDate: '',
    retentionPercentage: '',
    paymentTerms: '',
    penaltyClause: '',
    penaltyPercentagePerDay: '',
    maxPenaltyPercentage: '',
    signedByContractorName: '',
    signedByContractorTitle: '',
    notes: '',
  });

  useEffect(() => {
    fetchBidders();
    fetchTenders();
  }, []);

  useEffect(() => {
    if (formData.tenderId) {
      fetchBidsForTender(formData.tenderId);
    } else {
      setBids([]);
    }
  }, [formData.tenderId]);

  const fetchBidders = async () => {
    try {
      const response = await fetch('/api/procurement/bidders?limit=200&status=ACTIVE');
      const result = await response.json();
      if (result.success) {
        setBidders(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching bidders:', err);
    }
  };

  const fetchTenders = async () => {
    try {
      const response = await fetch('/api/procurement/tenders?limit=200');
      const result = await response.json();
      if (result.success) {
        setTenders(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching tenders:', err);
    }
  };

  const fetchBidsForTender = async (tenderId) => {
    try {
      const response = await fetch(`/api/procurement/bids?tenderId=${tenderId}&status=AWARDED`);
      const result = await response.json();
      if (result.success) {
        setBids(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill bidder when selecting a bid
    if (name === 'bidId' && value) {
      const selectedBid = bids.find((b) => b.id === value);
      if (selectedBid?.bidder) {
        setFormData((prev) => ({
          ...prev,
          bidId: value,
          bidderId: selectedBid.bidderId,
          contractValue: selectedBid.financialOffer || '',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.bidderId) {
      setError('Le titre et le soumissionnaire sont obligatoires');
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        contractValue: formData.contractValue ? parseFloat(formData.contractValue) : null,
        performanceGuarantee: formData.performanceGuarantee ? parseFloat(formData.performanceGuarantee) : null,
        advancePayment: formData.advancePayment ? parseFloat(formData.advancePayment) : null,
        retentionPercentage: formData.retentionPercentage ? parseFloat(formData.retentionPercentage) : null,
        penaltyPercentagePerDay: formData.penaltyPercentagePerDay ? parseFloat(formData.penaltyPercentagePerDay) : null,
        maxPenaltyPercentage: formData.maxPenaltyPercentage ? parseFloat(formData.maxPenaltyPercentage) : null,
        tenderId: formData.tenderId || null,
        bidId: formData.bidId || null,
      };

      const response = await fetch('/api/procurement/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/procurement/contracts/${result.data.id}`);
      } else {
        setError(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Common input styles
  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const selectClass = "w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/procurement/contracts"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouveau Contrat</h1>
          <p className="text-gray-600 dark:text-gray-400">Créer un nouveau contrat de passation de marché</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/50">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600 dark:text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informations de Base</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Titre du Contrat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ex: Fourniture de matériel informatique"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Description détaillée du contrat..."
              />
            </div>
            <div>
              <label className={labelClass}>Appel d'Offres (optionnel)</label>
              <select
                name="tenderId"
                value={formData.tenderId}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">-- Sélectionner un AO --</option>
                {tenders.map((tender) => (
                  <option key={tender.id} value={tender.id}>
                    {tender.reference} - {tender.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Soumission Gagnante (optionnel)</label>
              <select
                name="bidId"
                value={formData.bidId}
                onChange={handleChange}
                className={`${selectClass} ${!formData.tenderId ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!formData.tenderId}
              >
                <option value="">-- Sélectionner une soumission --</option>
                {bids.map((bid) => (
                  <option key={bid.id} value={bid.id}>
                    {bid.bidNumber} - {bid.bidder?.companyName} ({new Intl.NumberFormat('fr-FR').format(bid.financialOffer)} {bid.currency})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Attributaire <span className="text-red-500">*</span>
              </label>
              <select
                name="bidderId"
                value={formData.bidderId}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="">-- Sélectionner un soumissionnaire --</option>
                {bidders.map((bidder) => (
                  <option key={bidder.id} value={bidder.id}>
                    {bidder.companyName} {bidder.rccm ? `(RCCM: ${bidder.rccm})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={selectClass}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/50">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informations Financières</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Valeur du Contrat</label>
              <input
                type="number"
                name="contractValue"
                value={formData.contractValue}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Devise</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={selectClass}
              >
                {currencyOptions.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Garantie de Bonne Exécution</label>
              <input
                type="number"
                name="performanceGuarantee"
                value={formData.performanceGuarantee}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Référence Garantie</label>
              <input
                type="text"
                name="guaranteeReference"
                value={formData.guaranteeReference}
                onChange={handleChange}
                className={inputClass}
                placeholder="Numéro de garantie bancaire"
              />
            </div>
            <div>
              <label className={labelClass}>Expiration Garantie</label>
              <input
                type="date"
                name="guaranteeExpiryDate"
                value={formData.guaranteeExpiryDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Avance</label>
              <input
                type="number"
                name="advancePayment"
                value={formData.advancePayment}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Date de l'Avance</label>
              <input
                type="date"
                name="advancePaymentDate"
                value={formData.advancePaymentDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Retenue de Garantie (%)</label>
              <input
                type="number"
                name="retentionPercentage"
                value={formData.retentionPercentage}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className={inputClass}
                placeholder="Ex: 5"
              />
            </div>
            <div>
              <label className={labelClass}>Pénalité par Jour (%)</label>
              <input
                type="number"
                name="penaltyPercentagePerDay"
                value={formData.penaltyPercentagePerDay}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={inputClass}
                placeholder="Ex: 0.1"
              />
            </div>
            <div>
              <label className={labelClass}>Pénalité Maximum (%)</label>
              <input
                type="number"
                name="maxPenaltyPercentage"
                value={formData.maxPenaltyPercentage}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className={inputClass}
                placeholder="Ex: 10"
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelClass}>Conditions de Paiement</label>
              <textarea
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                rows={2}
                className={inputClass}
                placeholder="Ex: 30% à la commande, 70% à la livraison"
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelClass}>Clause de Pénalité</label>
              <textarea
                name="penaltyClause"
                value={formData.penaltyClause}
                onChange={handleChange}
                rows={2}
                className={inputClass}
                placeholder="Détails des pénalités en cas de retard..."
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/50">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dates</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Date de Signature</label>
              <input
                type="date"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date d'Effet</label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date de Début</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date de Fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Délai de Livraison</label>
              <input
                type="date"
                name="deliveryDeadline"
                value={formData.deliveryDeadline}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Lieu de Livraison</label>
              <input
                type="text"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ex: Kinshasa, Gombe"
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/50">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600 dark:text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Signataire (Attributaire)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nom du Signataire</label>
              <input
                type="text"
                name="signedByContractorName"
                value={formData.signedByContractorName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Nom complet"
              />
            </div>
            <div>
              <label className={labelClass}>Titre / Fonction</label>
              <input
                type="text"
                name="signedByContractorTitle"
                value={formData.signedByContractorTitle}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ex: Directeur Général"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/50">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-green-600 dark:text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
          </div>
          <div className="p-6">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Notes additionnelles..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/procurement/contracts"
            className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création...
              </>
            ) : (
              'Créer le Contrat'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
