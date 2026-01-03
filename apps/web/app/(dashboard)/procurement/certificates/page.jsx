"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Award,
  Search,
  Eye,
  Download,
  Printer,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
} from "lucide-react";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700",
  ACTIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  TERMINATED: "bg-red-100 text-red-700",
  SUSPENDED: "bg-yellow-100 text-yellow-700",
};

const statusLabels = {
  DRAFT: "Brouillon",
  ACTIVE: "Actif",
  COMPLETED: "Terminé",
  TERMINATED: "Résilié",
  SUSPENDED: "Suspendu",
};

export default function CertificatesPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Certificate preview
  const [selectedContract, setSelectedContract] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const certificateRef = useRef(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "ACTIVE,COMPLETED",
        year: yearFilter.toString(),
      });
      if (search) params.append("search", search);

      const response = await fetch(`/api/procurement/contracts?${params}`);
      const data = await response.json();

      if (data.success) {
        setContracts(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors du chargement des contrats");
    } finally {
      setLoading(false);
    }
  }, [search, yearFilter]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const loadCertificate = async (contractId) => {
    setLoadingCertificate(true);
    try {
      const response = await fetch(`/api/procurement/certificates/${contractId}`);
      const data = await response.json();

      if (data.success) {
        setCertificateData(data.data);
        setSelectedContract(contracts.find(c => c.id === contractId));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Erreur lors du chargement du certificat");
    } finally {
      setLoadingCertificate(false);
    }
  };

  const handlePrint = () => {
    if (certificateRef.current) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificat de Passation de Marché - ${certificateData?.certificateNumber}</title>
          <style>
            @page { margin: 20mm; size: A4; }
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 40px; }
            .certificate { max-width: 800px; margin: 0 auto; border: 3px double #1e3a5f; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 48px; margin-bottom: 10px; }
            .title { font-size: 28px; font-weight: bold; color: #1e3a5f; margin: 10px 0; }
            .subtitle { font-size: 16px; color: #666; }
            .cert-number { font-size: 14px; color: #888; margin: 20px 0; font-family: monospace; }
            .content { line-height: 1.8; margin: 30px 0; text-align: justify; }
            .company-name { font-weight: bold; font-size: 18px; color: #1e3a5f; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .info-box { background: #f8f9fa; padding: 15px; border-left: 3px solid #1e3a5f; }
            .info-label { font-size: 12px; color: #666; text-transform: uppercase; }
            .info-value { font-size: 14px; font-weight: bold; margin-top: 5px; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; width: 200px; }
            .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
            .date-stamp { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(30, 58, 95, 0.05); pointer-events: none; z-index: -1; }
          </style>
        </head>
        <body>
          ${certificateRef.current.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "—";
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-blue-600" />
          Certificats de Passation de Marchés
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Générez et imprimez les certificats pour les contrats attribués
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro de contrat ou entreprise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
            className="px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {[2026, 2025, 2024, 2023].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contracts List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Contrats éligibles ({contracts.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          ) : contracts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucun contrat éligible pour un certificat
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => loadCertificate(contract.id)}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-4 cursor-pointer transition-all ${
                    selectedContract?.id === contract.id
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-200 dark:border-slate-700 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
                          {contract.contractNumber}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[contract.status]}`}>
                          {statusLabels[contract.status]}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-900 dark:text-white mt-1 truncate">
                        {contract.title}
                      </h3>

                      {contract.bidder && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {contract.bidder.companyName}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatCurrency(contract.contractValue, contract.currency)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(contract.signatureDate)}
                        </span>
                      </div>
                    </div>

                    {selectedContract?.id === contract.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Aperçu du certificat
            </h2>
            {certificateData && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
              </div>
            )}
          </div>

          <div className="p-6 min-h-[600px] bg-gray-50 dark:bg-slate-900">
            {loadingCertificate ? (
              <div className="flex items-center justify-center h-full py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : certificateData ? (
              <div ref={certificateRef} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto" style={{ fontFamily: "'Times New Roman', serif" }}>
                {/* Certificate Content */}
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🏛️</div>
                  <h1 className="text-2xl font-bold text-blue-900 mb-2">
                    RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
                  </h1>
                  <p className="text-gray-600 text-sm mb-4">
                    {certificateData.authority.name}
                  </p>
                  <h2 className="text-xl font-bold text-blue-800 border-y-2 border-blue-800 py-3 my-4">
                    CERTIFICAT DE PASSATION DE MARCHÉ
                  </h2>
                  <p className="text-sm text-gray-500 font-mono">
                    N° {certificateData.certificateNumber}
                  </p>
                </div>

                <div className="text-gray-800 leading-relaxed mb-6 text-justify">
                  <p className="mb-4">
                    L'Agence Nationale pour la Promotion des Investissements (ANAPI), certifie par la présente que :
                  </p>

                  <p className="text-center my-6">
                    <span className="text-xl font-bold text-blue-900 border-b-2 border-blue-900 pb-1">
                      {certificateData.bidder?.companyName}
                    </span>
                  </p>

                  <p className="mb-4">
                    Entreprise immatriculée au RCCM sous le numéro <strong>{certificateData.bidder?.rccm || "—"}</strong>,
                    ayant son siège social à {certificateData.bidder?.address || "Kinshasa"}, représentée par
                    <strong> {certificateData.bidder?.representativeName || "—"}</strong> en qualité de
                    {certificateData.bidder?.representativeTitle || " Représentant légal"} ;
                  </p>

                  <p className="mb-4">
                    S'est vu attribuer le marché suivant :
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-6">
                    <p className="font-semibold text-blue-900 mb-2">{certificateData.contract.title}</p>
                    {certificateData.tender && (
                      <p className="text-sm text-gray-600">
                        Référence : {certificateData.tender.reference}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Montant du marché : <strong>{formatCurrency(certificateData.contract.contractValue, certificateData.contract.currency)}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Contrat N° : <strong>{certificateData.contract.contractNumber}</strong>
                    </p>
                  </div>

                  <p className="mb-4">
                    Ce certificat est délivré pour servir et valoir ce que de droit.
                  </p>
                </div>

                <div className="flex justify-between items-end mt-12">
                  <div className="text-sm text-gray-600">
                    <p>Fait à Kinshasa,</p>
                    <p>Le {formatDate(certificateData.issueDate)}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-16">Le Directeur Général</p>
                    <div className="border-t border-gray-400 w-48 pt-2">
                      <p className="text-sm text-gray-800">{certificateData.signedBy?.name || "Signature"}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Ce document est un certificat officiel de l'ANAPI. Toute falsification est passible de poursuites judiciaires.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500 dark:text-gray-400">
                <Award className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-center">
                  Sélectionnez un contrat pour<br />prévisualiser le certificat
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
