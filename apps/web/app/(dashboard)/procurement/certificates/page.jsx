"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const contractIdFromUrl = searchParams.get('contractId');

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
        // Load certificate from URL if contractId is provided
        if (contractIdFromUrl && data.data.find(c => c.id === contractIdFromUrl)) {
          loadCertificate(contractIdFromUrl);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors du chargement des contrats");
    } finally {
      setLoading(false);
    }
  }, [search, yearFilter, contractIdFromUrl]);

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
            @page { margin: 0; size: A4; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Times New Roman', Georgia, serif;
              background: #fff;
              width: 210mm;
              min-height: 297mm;
            }
            .certificate-wrapper {
              width: 210mm;
              min-height: 297mm;
              padding: 15mm;
              position: relative;
              background: linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%);
            }
            .certificate-border {
              border: 3px solid #1a365d;
              padding: 8mm;
              min-height: calc(297mm - 30mm);
              position: relative;
            }
            .certificate-inner {
              border: 1px solid #2c5282;
              padding: 10mm;
              min-height: calc(297mm - 52mm);
              position: relative;
            }
            .corner-ornament {
              position: absolute;
              width: 40px;
              height: 40px;
              border: 2px solid #c5a028;
            }
            .corner-tl { top: 5mm; left: 5mm; border-right: none; border-bottom: none; }
            .corner-tr { top: 5mm; right: 5mm; border-left: none; border-bottom: none; }
            .corner-bl { bottom: 5mm; left: 5mm; border-right: none; border-top: none; }
            .corner-br { bottom: 5mm; right: 5mm; border-left: none; border-top: none; }

            .header { text-align: center; margin-bottom: 8mm; }
            .republic-title {
              font-size: 14pt;
              font-weight: bold;
              color: #1a365d;
              letter-spacing: 3px;
              margin-bottom: 3mm;
            }
            .motto {
              font-size: 10pt;
              font-style: italic;
              color: #4a5568;
              margin-bottom: 5mm;
            }
            .agency-name {
              font-size: 12pt;
              font-weight: bold;
              color: #2b6cb0;
              letter-spacing: 2px;
              margin-bottom: 8mm;
            }

            .emblem {
              width: 60px;
              height: 60px;
              margin: 0 auto 5mm;
              background: linear-gradient(135deg, #c5a028 0%, #d4af37 50%, #c5a028 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 10px rgba(197, 160, 40, 0.3);
            }
            .emblem-inner {
              width: 50px;
              height: 50px;
              background: #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24pt;
            }

            .certificate-title {
              font-size: 22pt;
              font-weight: bold;
              color: #1a365d;
              text-align: center;
              margin: 8mm 0;
              padding: 5mm 0;
              border-top: 2px solid #c5a028;
              border-bottom: 2px solid #c5a028;
              letter-spacing: 4px;
              text-transform: uppercase;
            }

            .cert-number {
              text-align: center;
              font-size: 10pt;
              color: #718096;
              font-family: 'Courier New', monospace;
              margin-bottom: 8mm;
            }

            .content {
              line-height: 2;
              text-align: justify;
              font-size: 11pt;
              color: #2d3748;
              margin: 5mm 0;
            }
            .content p { margin-bottom: 4mm; }

            .company-highlight {
              text-align: center;
              margin: 8mm 0;
              padding: 5mm;
            }
            .company-name {
              font-size: 16pt;
              font-weight: bold;
              color: #1a365d;
              border-bottom: 2px solid #c5a028;
              padding-bottom: 3mm;
              display: inline-block;
            }

            .contract-box {
              background: linear-gradient(to right, #f7fafc, #edf2f7, #f7fafc);
              border: 1px solid #cbd5e0;
              border-left: 4px solid #1a365d;
              padding: 5mm;
              margin: 5mm 0;
              font-size: 10pt;
            }
            .contract-title {
              font-weight: bold;
              color: #1a365d;
              font-size: 11pt;
              margin-bottom: 2mm;
            }
            .contract-details { color: #4a5568; }
            .contract-amount {
              font-size: 12pt;
              font-weight: bold;
              color: #2b6cb0;
              margin-top: 2mm;
            }

            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: 15mm;
              padding-top: 5mm;
            }
            .date-location {
              font-size: 10pt;
              color: #4a5568;
            }
            .signature-block {
              text-align: center;
              width: 60mm;
            }
            .signature-title {
              font-size: 10pt;
              color: #4a5568;
              margin-bottom: 20mm;
            }
            .signature-line {
              border-top: 1px solid #1a365d;
              padding-top: 2mm;
            }
            .signature-name {
              font-weight: bold;
              color: #1a365d;
            }

            .official-seal {
              position: absolute;
              bottom: 25mm;
              right: 25mm;
              width: 70px;
              height: 70px;
              border: 2px dashed #c5a028;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #c5a028;
              font-size: 8pt;
              text-align: center;
              opacity: 0.7;
            }

            .legal-notice {
              text-align: center;
              font-size: 8pt;
              color: #a0aec0;
              margin-top: 10mm;
              padding-top: 3mm;
              border-top: 1px solid #e2e8f0;
            }

            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              font-size: 80pt;
              color: rgba(26, 54, 93, 0.03);
              font-weight: bold;
              pointer-events: none;
              white-space: nowrap;
              letter-spacing: 10px;
            }
          </style>
        </head>
        <body>
          ${certificateRef.current.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
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

  const numberToWords = (amount) => {
    // Simplified French number to words for amounts
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

    if (amount >= 1000000) {
      const millions = Math.floor(amount / 1000000);
      const remainder = amount % 1000000;
      return (millions === 1 ? 'un million' : numberToWords(millions) + ' millions') + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    if (amount >= 1000) {
      const thousands = Math.floor(amount / 1000);
      const remainder = amount % 1000;
      return (thousands === 1 ? 'mille' : numberToWords(thousands) + ' mille') + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    if (amount >= 100) {
      const hundreds = Math.floor(amount / 100);
      const remainder = amount % 100;
      return (hundreds === 1 ? 'cent' : numberToWords(hundreds) + ' cent') + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    if (amount >= 20) {
      const ten = Math.floor(amount / 10);
      const unit = amount % 10;
      return tens[ten] + (unit > 0 ? '-' + units[unit] : '');
    }
    return units[amount] || String(amount);
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

          <div className="p-6 min-h-[600px] bg-gray-100 dark:bg-slate-900 overflow-auto">
            {loadingCertificate ? (
              <div className="flex items-center justify-center h-full py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : certificateData ? (
              <div ref={certificateRef} className="certificate-wrapper mx-auto" style={{ fontFamily: "'Times New Roman', Georgia, serif", maxWidth: '700px' }}>
                {/* Professional Certificate Design */}
                <div className="certificate-border bg-white rounded-sm shadow-xl" style={{ border: '3px solid #1a365d', padding: '20px' }}>
                  <div className="certificate-inner" style={{ border: '1px solid #2c5282', padding: '25px', position: 'relative' }}>
                    {/* Corner Ornaments */}
                    <div className="corner-ornament corner-tl" style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', borderTop: '2px solid #c5a028', borderLeft: '2px solid #c5a028' }}></div>
                    <div className="corner-ornament corner-tr" style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderTop: '2px solid #c5a028', borderRight: '2px solid #c5a028' }}></div>
                    <div className="corner-ornament corner-bl" style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', borderBottom: '2px solid #c5a028', borderLeft: '2px solid #c5a028' }}></div>
                    <div className="corner-ornament corner-br" style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderBottom: '2px solid #c5a028', borderRight: '2px solid #c5a028' }}></div>

                    {/* Watermark */}
                    <div className="watermark" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '60px', color: 'rgba(26, 54, 93, 0.04)', fontWeight: 'bold', pointerEvents: 'none', whiteSpace: 'nowrap', letterSpacing: '8px' }}>
                      ANAPI
                    </div>

                    {/* Header */}
                    <div className="header text-center mb-6" style={{ position: 'relative', zIndex: 1 }}>
                      {/* Emblem */}
                      <div className="emblem mx-auto mb-3" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #c5a028 0%, #d4af37 50%, #c5a028 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 15px rgba(197, 160, 40, 0.3)' }}>
                        <div style={{ width: '58px', height: '58px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                          🏛️
                        </div>
                      </div>

                      <h1 className="republic-title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a365d', letterSpacing: '3px', marginBottom: '4px' }}>
                        RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
                      </h1>
                      <p className="motto" style={{ fontSize: '11px', fontStyle: 'italic', color: '#4a5568', marginBottom: '8px' }}>
                        Justice - Paix - Travail
                      </p>
                      <p className="agency-name" style={{ fontSize: '13px', fontWeight: 'bold', color: '#2b6cb0', letterSpacing: '2px' }}>
                        AGENCE NATIONALE POUR LA PROMOTION DES INVESTISSEMENTS
                      </p>
                    </div>

                    {/* Certificate Title */}
                    <h2 className="certificate-title text-center" style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a365d', margin: '20px 0', padding: '12px 0', borderTop: '2px solid #c5a028', borderBottom: '2px solid #c5a028', letterSpacing: '4px', textTransform: 'uppercase' }}>
                      Certificat de Passation de Marché
                    </h2>

                    {/* Certificate Number */}
                    <p className="cert-number text-center" style={{ fontSize: '11px', color: '#718096', fontFamily: 'Courier New, monospace', marginBottom: '20px' }}>
                      N° {certificateData.certificateNumber}
                    </p>

                    {/* Content */}
                    <div className="content" style={{ lineHeight: '1.9', textAlign: 'justify', fontSize: '12px', color: '#2d3748', position: 'relative', zIndex: 1 }}>
                      <p style={{ marginBottom: '12px' }}>
                        L'Agence Nationale pour la Promotion des Investissements (ANAPI), organisme public placé sous la tutelle du Ministère du Plan, certifie par la présente que :
                      </p>

                      {/* Company Name Highlight */}
                      <div className="company-highlight text-center" style={{ margin: '20px 0', padding: '15px' }}>
                        <span className="company-name" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', borderBottom: '2px solid #c5a028', paddingBottom: '6px', display: 'inline-block' }}>
                          {certificateData.bidder?.companyName || '—'}
                        </span>
                      </div>

                      <p style={{ marginBottom: '12px' }}>
                        Entreprise immatriculée au Registre du Commerce et du Crédit Mobilier (RCCM) sous le numéro <strong>{certificateData.bidder?.rccm || '—'}</strong>,
                        {certificateData.bidder?.idnat && <> ID National : <strong>{certificateData.bidder.idnat}</strong>,</>}
                        ayant son siège social à <strong>{certificateData.bidder?.address || 'Kinshasa, RDC'}</strong>,
                        représentée par <strong>{certificateData.bidder?.representativeName || 'le représentant légal'}</strong>
                        {certificateData.bidder?.representativeTitle && <> en qualité de <strong>{certificateData.bidder.representativeTitle}</strong></>} ;
                      </p>

                      <p style={{ marginBottom: '12px' }}>
                        S'est vu attribuer le marché public ci-après désigné, conformément aux dispositions légales et réglementaires en vigueur en République Démocratique du Congo :
                      </p>

                      {/* Contract Box */}
                      <div className="contract-box" style={{ background: 'linear-gradient(to right, #f7fafc, #edf2f7, #f7fafc)', border: '1px solid #cbd5e0', borderLeft: '4px solid #1a365d', padding: '15px', margin: '15px 0', fontSize: '11px' }}>
                        <p className="contract-title" style={{ fontWeight: 'bold', color: '#1a365d', fontSize: '13px', marginBottom: '8px' }}>
                          {certificateData.contract.title}
                        </p>
                        {certificateData.tender && (
                          <p className="contract-details" style={{ color: '#4a5568', marginBottom: '4px' }}>
                            Référence de l'Appel d'Offres : <strong>{certificateData.tender.reference}</strong>
                          </p>
                        )}
                        <p className="contract-details" style={{ color: '#4a5568', marginBottom: '4px' }}>
                          Numéro du Contrat : <strong>{certificateData.contract.contractNumber}</strong>
                        </p>
                        <p className="contract-amount" style={{ fontSize: '14px', fontWeight: 'bold', color: '#2b6cb0', marginTop: '8px' }}>
                          Montant du Marché : {formatCurrency(certificateData.contract.contractValue, certificateData.contract.currency)}
                        </p>
                        {certificateData.contract.contractValue && (
                          <p style={{ fontSize: '10px', color: '#718096', marginTop: '4px', fontStyle: 'italic' }}>
                            Soit : {numberToWords(Math.floor(parseFloat(certificateData.contract.contractValue)))} {certificateData.contract.currency}
                          </p>
                        )}
                      </div>

                      <p style={{ marginBottom: '8px' }}>
                        En foi de quoi, le présent certificat lui est délivré pour servir et valoir ce que de droit.
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '15px', position: 'relative', zIndex: 1 }}>
                      <div className="date-location" style={{ fontSize: '11px', color: '#4a5568' }}>
                        <p>Fait à Kinshasa,</p>
                        <p>Le {formatDate(certificateData.issueDate)}</p>
                      </div>

                      <div className="signature-block text-center" style={{ width: '180px' }}>
                        <p className="signature-title" style={{ fontSize: '11px', color: '#4a5568', marginBottom: '45px' }}>
                          Le Directeur Général
                        </p>
                        <div className="signature-line" style={{ borderTop: '1px solid #1a365d', paddingTop: '6px' }}>
                          <p className="signature-name" style={{ fontWeight: 'bold', color: '#1a365d', fontSize: '11px' }}>
                            {certificateData.signedBy?.name || '___________________'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Official Seal Placeholder */}
                    <div className="official-seal" style={{ position: 'absolute', bottom: '60px', right: '40px', width: '70px', height: '70px', border: '2px dashed #c5a028', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c5a028', fontSize: '8px', textAlign: 'center', opacity: '0.6' }}>
                      <span>SCEAU<br/>OFFICIEL</span>
                    </div>

                    {/* Legal Notice */}
                    <div className="legal-notice text-center" style={{ fontSize: '9px', color: '#a0aec0', marginTop: '25px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                      <p>Ce document est un certificat officiel de l'Agence Nationale pour la Promotion des Investissements (ANAPI).</p>
                      <p style={{ marginTop: '3px' }}>Toute falsification, altération ou usage frauduleux est passible de poursuites judiciaires conformément aux lois de la RDC.</p>
                    </div>
                  </div>
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
