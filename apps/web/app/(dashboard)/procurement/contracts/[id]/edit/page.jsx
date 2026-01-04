'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const statusOptions = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PENDING_SIGNATURE', label: 'En attente de signature' },
  { value: 'SIGNED', label: 'Signé' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'SUSPENDED', label: 'Suspendu' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'TERMINATED', label: 'Résilié' },
  { value: 'CANCELLED', label: 'Annulé' },
];

const currencyOptions = ['USD', 'CDF', 'EUR'];

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export default function EditContractPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tenderId: '',
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
    progressPercent: '',
    totalPaid: '',
    completionDate: '',
    receptionDate: '',
    finalReceptionDate: '',
    terminationReason: '',
    terminationDate: '',
    signedByContractorName: '',
    signedByContractorTitle: '',
    notes: '',
  });

  useEffect(() => {
    fetchContract();
    fetchBidders();
    fetchTenders();
  }, [resolvedParams.id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/procurement/contracts/${resolvedParams.id}`);
      const result = await response.json();

      if (result.success) {
        const contract = result.data;
        setFormData({
          title: contract.title || '',
          description: contract.description || '',
          tenderId: contract.tenderId || '',
          bidderId: contract.bidderId || '',
          contractValue: contract.contractValue || '',
          currency: contract.currency || 'USD',
          signatureDate: formatDateForInput(contract.signatureDate),
          effectiveDate: formatDateForInput(contract.effectiveDate),
          startDate: formatDateForInput(contract.startDate),
          endDate: formatDateForInput(contract.endDate),
          deliveryDeadline: formatDateForInput(contract.deliveryDeadline),
          deliveryLocation: contract.deliveryLocation || '',
          status: contract.status || 'DRAFT',
          performanceGuarantee: contract.performanceGuarantee || '',
          guaranteeReference: contract.guaranteeReference || '',
          guaranteeExpiryDate: formatDateForInput(contract.guaranteeExpiryDate),
          advancePayment: contract.advancePayment || '',
          advancePaymentDate: formatDateForInput(contract.advancePaymentDate),
          retentionPercentage: contract.retentionPercentage || '',
          paymentTerms: contract.paymentTerms || '',
          penaltyClause: contract.penaltyClause || '',
          penaltyPercentagePerDay: contract.penaltyPercentagePerDay || '',
          maxPenaltyPercentage: contract.maxPenaltyPercentage || '',
          progressPercent: contract.progressPercent || '',
          totalPaid: contract.totalPaid || '',
          completionDate: formatDateForInput(contract.completionDate),
          receptionDate: formatDateForInput(contract.receptionDate),
          finalReceptionDate: formatDateForInput(contract.finalReceptionDate),
          terminationReason: contract.terminationReason || '',
          terminationDate: formatDateForInput(contract.terminationDate),
          signedByContractorName: contract.signedByContractorName || '',
          signedByContractorTitle: contract.signedByContractorTitle || '',
          notes: contract.notes || '',
        });
      } else {
        setError(result.error || 'Contrat non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidders = async () => {
    try {
      const response = await fetch('/api/procurement/bidders?limit=200');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.bidderId) {
      setError('Le titre et le soumissionnaire sont obligatoires');
      return;
    }

    try {
      setSaving(true);

      const dataToSend = {
        ...formData,
        contractValue: formData.contractValue ? parseFloat(formData.contractValue) : null,
        performanceGuarantee: formData.performanceGuarantee ? parseFloat(formData.performanceGuarantee) : null,
        advancePayment: formData.advancePayment ? parseFloat(formData.advancePayment) : null,
        retentionPercentage: formData.retentionPercentage ? parseFloat(formData.retentionPercentage) : null,
        penaltyPercentagePerDay: formData.penaltyPercentagePerDay ? parseFloat(formData.penaltyPercentagePerDay) : null,
        maxPenaltyPercentage: formData.maxPenaltyPercentage ? parseFloat(formData.maxPenaltyPercentage) : null,
        progressPercent: formData.progressPercent ? parseFloat(formData.progressPercent) : null,
        totalPaid: formData.totalPaid ? parseFloat(formData.totalPaid) : null,
        tenderId: formData.tenderId || null,
      };

      const response = await fetch(`/api/procurement/contracts/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/procurement/contracts/${resolvedParams.id}`);
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/procurement/contracts/${resolvedParams.id}`} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le Contrat</h1>
          <p className="text-gray-600">Mettre à jour les informations du contrat</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Informations de Base</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du Contrat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appel d'Offres</label>
              <select
                name="tenderId"
                value={formData.tenderId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Aucun --</option>
                {tenders.map((tender) => (
                  <option key={tender.id} value={tender.id}>
                    {tender.reference} - {tender.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attributaire <span className="text-red-500">*</span>
              </label>
              <select
                name="bidderId"
                value={formData.bidderId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">-- Sélectionner --</option>
                {bidders.map((bidder) => (
                  <option key={bidder.id} value={bidder.id}>
                    {bidder.companyName} {bidder.rccm ? `(RCCM: ${bidder.rccm})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Informations Financières</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valeur du Contrat</label>
              <input
                type="number"
                name="contractValue"
                value={formData.contractValue}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {currencyOptions.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé</label>
              <input
                type="number"
                name="totalPaid"
                value={formData.totalPaid}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progression (%)</label>
              <input
                type="number"
                name="progressPercent"
                value={formData.progressPercent}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Garantie de Bonne Exécution</label>
              <input
                type="number"
                name="performanceGuarantee"
                value={formData.performanceGuarantee}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Référence Garantie</label>
              <input
                type="text"
                name="guaranteeReference"
                value={formData.guaranteeReference}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Garantie</label>
              <input
                type="date"
                name="guaranteeExpiryDate"
                value={formData.guaranteeExpiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avance</label>
              <input
                type="number"
                name="advancePayment"
                value={formData.advancePayment}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'Avance</label>
              <input
                type="date"
                name="advancePaymentDate"
                value={formData.advancePaymentDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retenue de Garantie (%)</label>
              <input
                type="number"
                name="retentionPercentage"
                value={formData.retentionPercentage}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pénalité par Jour (%)</label>
              <input
                type="number"
                name="penaltyPercentagePerDay"
                value={formData.penaltyPercentagePerDay}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pénalité Maximum (%)</label>
              <input
                type="number"
                name="maxPenaltyPercentage"
                value={formData.maxPenaltyPercentage}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conditions de Paiement</label>
              <textarea
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Clause de Pénalité</label>
              <textarea
                name="penaltyClause"
                value={formData.penaltyClause}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dates</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Signature</label>
              <input
                type="date"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'Effet</label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Début</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Délai de Livraison</label>
              <input
                type="date"
                name="deliveryDeadline"
                value={formData.deliveryDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de Livraison</label>
              <input
                type="text"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'Achèvement</label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Réception Provisoire</label>
              <input
                type="date"
                name="receptionDate"
                value={formData.receptionDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Réception Définitive</label>
              <input
                type="date"
                name="finalReceptionDate"
                value={formData.finalReceptionDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Termination (if applicable) */}
        {(formData.status === 'TERMINATED' || formData.status === 'CANCELLED') && (
          <div className="bg-white rounded-lg shadow border-l-4 border-red-500">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-red-600">Résiliation / Annulation</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de Résiliation</label>
                <input
                  type="date"
                  name="terminationDate"
                  value={formData.terminationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif de Résiliation</label>
                <textarea
                  name="terminationReason"
                  value={formData.terminationReason}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Signataire (Attributaire)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Signataire</label>
              <input
                type="text"
                name="signedByContractorName"
                value={formData.signedByContractorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre / Fonction</label>
              <input
                type="text"
                name="signedByContractorTitle"
                value={formData.signedByContractorTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
          </div>
          <div className="p-6">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href={`/procurement/contracts/${resolvedParams.id}`}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
