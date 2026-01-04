'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const statusLabels = {
  DRAFT: 'Brouillon',
  PENDING_SIGNATURE: 'En attente de signature',
  SIGNED: 'Signé',
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  COMPLETED: 'Terminé',
  TERMINATED: 'Résilié',
  CANCELLED: 'Annulé',
};

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-300',
  PENDING_SIGNATURE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  SIGNED: 'bg-blue-100 text-blue-800 border-blue-300',
  ACTIVE: 'bg-green-100 text-green-800 border-green-300',
  SUSPENDED: 'bg-orange-100 text-orange-800 border-orange-300',
  COMPLETED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  TERMINATED: 'bg-red-100 text-red-800 border-red-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function ContractDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [resolvedParams.id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/procurement/contracts/${resolvedParams.id}`);
      const result = await response.json();

      if (result.success) {
        setContract(result.data);
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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/procurement/contracts/${resolvedParams.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        router.push('/procurement/contracts');
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-red-800">{error}</h3>
        <Link href="/procurement/contracts" className="mt-4 inline-block text-green-600 hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  if (!contract) return null;

  const progressPercent = parseFloat(contract.progressPercent) || 0;
  const totalPaid = parseFloat(contract.totalPaid) || 0;
  const contractValue = parseFloat(contract.contractValue) || 0;
  const remaining = contractValue - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/procurement/contracts" className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Contrat {contract.contractNumber}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[contract.status]}`}>
              {statusLabels[contract.status]}
            </span>
          </div>
          <p className="text-gray-600">{contract.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {(contract.status === 'ACTIVE' || contract.status === 'COMPLETED') && (
            <Link
              href={`/procurement/certificates?contractId=${contract.id}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Certificat
            </Link>
          )}
          <Link
            href={`/procurement/contracts/${contract.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </Link>
          {['DRAFT', 'CANCELLED'].includes(contract.status) && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Valeur du Contrat</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(contractValue, contract.currency)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">Montant Payé</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(totalPaid, contract.currency)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Reste à Payer</p>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(remaining, contract.currency)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
          <p className="text-sm font-medium text-gray-500">Progression</p>
          <div className="flex items-center mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
              <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="text-xl font-bold text-indigo-600">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Informations du Contrat</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Numéro de Contrat</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.contractNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Devise</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.currency}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Titre</dt>
                  <dd className="mt-1 text-sm text-gray-900">{contract.title}</dd>
                </div>
                {contract.description && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{contract.description}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Dates Importantes</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de Signature</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contract.signatureDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date d'Effet</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contract.effectiveDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de Début</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contract.startDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de Fin</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contract.endDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Délai de Livraison</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(contract.deliveryDeadline)}</dd>
                </div>
                {contract.deliveryLocation && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lieu de Livraison</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.deliveryLocation}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Informations Financières</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contract.performanceGuarantee && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Garantie de Bonne Exécution</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(contract.performanceGuarantee, contract.currency)}</dd>
                  </div>
                )}
                {contract.guaranteeReference && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Référence Garantie</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.guaranteeReference}</dd>
                  </div>
                )}
                {contract.guaranteeExpiryDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expiration Garantie</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(contract.guaranteeExpiryDate)}</dd>
                  </div>
                )}
                {contract.advancePayment && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Avance</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(contract.advancePayment, contract.currency)}</dd>
                  </div>
                )}
                {contract.retentionPercentage && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Retenue de Garantie</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.retentionPercentage}%</dd>
                  </div>
                )}
                {contract.penaltyPercentagePerDay && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Pénalité par Jour</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contract.penaltyPercentagePerDay}%</dd>
                  </div>
                )}
                {contract.paymentTerms && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Conditions de Paiement</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{contract.paymentTerms}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Notes */}
          {contract.notes && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{contract.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bidder Info */}
          {contract.bidder && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Attributaire</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{contract.bidder.companyName}</h3>
                    {contract.bidder.code && (
                      <p className="text-sm text-gray-500">Code: {contract.bidder.code}</p>
                    )}
                  </div>
                </div>
                <dl className="space-y-2 text-sm">
                  {contract.bidder.rccm && (
                    <div>
                      <dt className="text-gray-500">RCCM</dt>
                      <dd className="text-gray-900">{contract.bidder.rccm}</dd>
                    </div>
                  )}
                  {contract.bidder.idnat && (
                    <div>
                      <dt className="text-gray-500">ID National</dt>
                      <dd className="text-gray-900">{contract.bidder.idnat}</dd>
                    </div>
                  )}
                  {contract.bidder.email && (
                    <div>
                      <dt className="text-gray-500">Email</dt>
                      <dd className="text-gray-900">{contract.bidder.email}</dd>
                    </div>
                  )}
                  {contract.bidder.phone && (
                    <div>
                      <dt className="text-gray-500">Téléphone</dt>
                      <dd className="text-gray-900">{contract.bidder.phone}</dd>
                    </div>
                  )}
                  {contract.bidder.contactPerson && (
                    <div>
                      <dt className="text-gray-500">Contact</dt>
                      <dd className="text-gray-900">{contract.bidder.contactPerson}</dd>
                    </div>
                  )}
                </dl>
                <Link
                  href={`/procurement/bidders/${contract.bidder.id}`}
                  className="mt-4 inline-flex items-center text-sm text-green-600 hover:underline"
                >
                  Voir le profil
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Tender Info */}
          {contract.tender && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Appel d'Offres</h2>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{contract.tender.reference}</h3>
                <p className="text-sm text-gray-600 mb-4">{contract.tender.title}</p>
                {contract.tender.ministry && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Ministère:</span> {contract.tender.ministry.name}
                  </p>
                )}
                {contract.tender.estimatedBudget && (
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Budget estimé:</span> {formatCurrency(contract.tender.estimatedBudget, contract.tender.currency)}
                  </p>
                )}
                <Link
                  href={`/procurement/tenders/${contract.tender.id}`}
                  className="mt-4 inline-flex items-center text-sm text-green-600 hover:underline"
                >
                  Voir l'appel d'offres
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Certificate Info */}
          {contract.certificateNumber && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-indigo-50">
                <h2 className="text-lg font-semibold text-gray-900">Certificat</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{contract.certificateNumber}</p>
                    <p className="text-sm text-gray-500">Émis le {formatDate(contract.certificateIssuedAt)}</p>
                  </div>
                </div>
                <Link
                  href={`/procurement/certificates?contractId=${contract.id}`}
                  className="inline-flex items-center text-sm text-indigo-600 hover:underline"
                >
                  Voir le certificat
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Métadonnées</h2>
            </div>
            <div className="p-6 text-sm">
              <dl className="space-y-2">
                <div>
                  <dt className="text-gray-500">Créé le</dt>
                  <dd className="text-gray-900">{formatDate(contract.createdAt)}</dd>
                </div>
                {contract.createdBy && (
                  <div>
                    <dt className="text-gray-500">Créé par</dt>
                    <dd className="text-gray-900">{contract.createdBy.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">Modifié le</dt>
                  <dd className="text-gray-900">{formatDate(contract.updatedAt)}</dd>
                </div>
                {contract.signedBy && (
                  <div>
                    <dt className="text-gray-500">Signé par (Client)</dt>
                    <dd className="text-gray-900">{contract.signedBy.name}</dd>
                  </div>
                )}
                {contract.signedByContractorName && (
                  <div>
                    <dt className="text-gray-500">Signé par (Attributaire)</dt>
                    <dd className="text-gray-900">
                      {contract.signedByContractorName}
                      {contract.signedByContractorTitle && ` - ${contract.signedByContractorTitle}`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">Supprimer le contrat</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
