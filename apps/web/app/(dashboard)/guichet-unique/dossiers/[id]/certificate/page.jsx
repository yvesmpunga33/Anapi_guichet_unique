"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Printer,
  X,
  Award,
  CheckCircle2,
  Shield,
  FileCheck,
  Stamp,
} from "lucide-react";

// Configuration des types de dossiers avec couleurs distinctes
const dossierTypeConfig = {
  AGREMENT: {
    label: "Agrément",
    fullLabel: "CERTIFICAT D'AGRÉMENT AU RÉGIME INCITATIF",
    headerBg: "from-emerald-800 to-emerald-600",
    borderColor: "border-emerald-600",
    accentColor: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-800",
    icon: Award,
    pattern: "emerald"
  },
  AGREMENT_REGIME: {
    label: "Agrément au Régime",
    fullLabel: "CERTIFICAT D'AGRÉMENT AU RÉGIME INCITATIF",
    headerBg: "from-emerald-800 to-emerald-600",
    borderColor: "border-emerald-600",
    accentColor: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-800",
    icon: Award,
    pattern: "emerald"
  },
  LICENCE: {
    label: "Licence",
    fullLabel: "CERTIFICAT DE LICENCE D'EXPLOITATION",
    headerBg: "from-blue-900 to-blue-700",
    borderColor: "border-blue-600",
    accentColor: "text-blue-600",
    badgeBg: "bg-blue-100 text-blue-800",
    icon: FileCheck,
    pattern: "blue"
  },
  LICENCE_EXPLOITATION: {
    label: "Licence d'Exploitation",
    fullLabel: "CERTIFICAT DE LICENCE D'EXPLOITATION",
    headerBg: "from-blue-900 to-blue-700",
    borderColor: "border-blue-600",
    accentColor: "text-blue-600",
    badgeBg: "bg-blue-100 text-blue-800",
    icon: FileCheck,
    pattern: "blue"
  },
  PERMIS: {
    label: "Permis",
    fullLabel: "CERTIFICAT DE PERMIS",
    headerBg: "from-amber-700 to-amber-500",
    borderColor: "border-amber-500",
    accentColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-800",
    icon: Stamp,
    pattern: "amber"
  },
  PERMIS_CONSTRUCTION: {
    label: "Permis de Construction",
    fullLabel: "CERTIFICAT DE PERMIS DE CONSTRUCTION",
    headerBg: "from-amber-700 to-amber-500",
    borderColor: "border-amber-500",
    accentColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-800",
    icon: Stamp,
    pattern: "amber"
  },
  AUTORISATION: {
    label: "Autorisation",
    fullLabel: "CERTIFICAT D'AUTORISATION",
    headerBg: "from-purple-800 to-purple-600",
    borderColor: "border-purple-600",
    accentColor: "text-purple-600",
    badgeBg: "bg-purple-100 text-purple-800",
    icon: Shield,
    pattern: "purple"
  },
  AUTORISATION_ACTIVITE: {
    label: "Autorisation d'Activité",
    fullLabel: "CERTIFICAT D'AUTORISATION D'ACTIVITÉ",
    headerBg: "from-purple-800 to-purple-600",
    borderColor: "border-purple-600",
    accentColor: "text-purple-600",
    badgeBg: "bg-purple-100 text-purple-800",
    icon: Shield,
    pattern: "purple"
  },
};

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  // Charger les données du dossier
  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`/api/guichet-unique/dossiers/${params.id}`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const data = await response.json();
          const apiDossier = data.data?.dossier || data.dossier;

          if (apiDossier) {
            if (apiDossier.status !== 'APPROVED') {
              alert('Ce dossier n\'est pas encore approuve. Le certificat n\'est pas disponible.');
              router.push(`/guichet-unique/dossiers/${params.id}`);
              return;
            }

            setDossier({
              id: apiDossier.id,
              reference: apiDossier.dossierNumber || `GU-${apiDossier.id.substring(0, 8)}`,
              dossierType: apiDossier.dossierType || 'AGREMENT',
              investorName: apiDossier.investorName || '',
              investorType: apiDossier.investorType || 'company',
              rccm: apiDossier.rccm || '',
              idNat: apiDossier.idNat || '',
              nif: apiDossier.nif || '',
              projectName: apiDossier.projectName || '',
              projectDescription: apiDossier.projectDescription || '',
              sector: apiDossier.sector || '',
              subSector: apiDossier.subSector || '',
              province: apiDossier.projectProvince || '',
              city: apiDossier.projectCity || '',
              status: apiDossier.status,
              submittedAt: apiDossier.submittedAt || apiDossier.createdAt,
              decisionDate: apiDossier.decisionDate || new Date().toISOString(),
              amount: apiDossier.investmentAmount || 0,
              currency: apiDossier.currency || 'USD',
              jobsCreated: apiDossier.directJobs || 0,
              jobsIndirect: apiDossier.indirectJobs || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dossier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [params.id, router]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCertificateNumber = () => {
    if (!dossier) return '';
    const year = new Date(dossier.decisionDate).getFullYear();
    const typePrefix = dossier.dossierType?.substring(0, 3).toUpperCase() || 'CER';
    return `CERT-${typePrefix}-${year}-${dossier.reference?.split('-').pop() || '000001'}`;
  };

  const getVerificationUrl = () => {
    const certNumber = getCertificateNumber();
    return `https://anapi.gouv.cd/verify/${certNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du certificat...</p>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Certificat non disponible</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const typeConfig = dossierTypeConfig[dossier.dossierType] || dossierTypeConfig.AGREMENT;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Control Bar */}
      <div className="bg-white shadow-sm print:hidden sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">Certificat - {dossier.reference}</h1>
              <p className="text-sm text-gray-500">{typeConfig.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button
              onClick={() => window.close()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        <div
          ref={printRef}
          className="bg-white shadow-lg print:shadow-none"
          style={{ minHeight: "297mm" }}
        >
          {/* Decorative Border */}
          <div className={`border-[12px] border-double ${typeConfig.borderColor} m-3 print:m-2`}>

            {/* Header */}
            <div className={`bg-gradient-to-r ${typeConfig.headerBg} text-white p-6 text-center relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-800">RDC</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-xs uppercase tracking-[0.3em] opacity-80">Republique Democratique du Congo</h1>
                <h2 className="text-[10px] uppercase tracking-wider opacity-70 mt-1">Ministere de l'Industrie</h2>
                <div className="mt-3 border-t border-white/30 pt-3">
                  <h3 className="text-lg font-bold tracking-wide">AGENCE NATIONALE POUR LA PROMOTION</h3>
                  <h3 className="text-lg font-bold tracking-wide">DES INVESTISSEMENTS</h3>
                  <p className="text-sm opacity-80 mt-1">ANAPI</p>
                </div>
              </div>
            </div>

            {/* Certificate Type Banner */}
            <div className={`py-6 text-center border-b-4 ${typeConfig.borderColor}`}>
              <div className="flex justify-center mb-3">
                <div className={`w-16 h-16 rounded-full ${typeConfig.badgeBg} flex items-center justify-center`}>
                  <TypeIcon className={`w-8 h-8 ${typeConfig.accentColor}`} />
                </div>
              </div>
              <h1 className={`text-2xl font-bold ${typeConfig.accentColor} tracking-wide`}>
                {typeConfig.fullLabel}
              </h1>
              <p className={`text-lg font-semibold mt-2 ${typeConfig.accentColor}`}>
                N° {getCertificateNumber()}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="p-6 space-y-5">
              {/* Preamble */}
              <div className="text-center text-gray-700 text-sm leading-relaxed">
                <p className="mb-2">Le Directeur General de l'Agence Nationale pour la Promotion des Investissements,</p>
                <p className="mb-2 text-xs">Vu la loi n° 004/2002 du 21 fevrier 2002 portant Code des Investissements ;</p>
                <p className="mb-2 text-xs">Vu le Decret n° 065/2002 du 05 juin 2002 portant mesures d'application du Code des Investissements ;</p>
                <p className={`font-bold text-base mt-4 ${typeConfig.accentColor}`}>CERTIFIE QUE :</p>
              </div>

              {/* Beneficiary */}
              <div className={`bg-gray-50 rounded-lg p-4 border-l-4 ${typeConfig.borderColor}`}>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{dossier.investorName}</h3>
                  <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
                    {dossier.rccm && <span>RCCM: {dossier.rccm}</span>}
                    {dossier.idNat && <span>ID Nat: {dossier.idNat}</span>}
                    {dossier.nif && <span>NIF: {dossier.nif}</span>}
                  </div>
                </div>
              </div>

              {/* Project */}
              <div className="text-center text-gray-700 text-sm">
                <p className="mb-3">
                  {dossier.dossierType?.includes('AGREMENT') && "a ete agree au regime incitatif pour la realisation du projet :"}
                  {dossier.dossierType?.includes('LICENCE') && "a obtenu la licence d'exploitation pour :"}
                  {dossier.dossierType?.includes('PERMIS') && "a obtenu le permis pour :"}
                  {dossier.dossierType?.includes('AUTORISATION') && "a obtenu l'autorisation pour :"}
                </p>
                <div className={`bg-white rounded-lg p-4 border-2 ${typeConfig.borderColor}`}>
                  <h4 className={`text-lg font-bold ${typeConfig.accentColor}`}>{dossier.projectName}</h4>
                  {dossier.projectDescription && (
                    <p className="text-gray-600 mt-2 text-xs">{dossier.projectDescription}</p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider">Secteur</p>
                  <p className="font-semibold text-gray-900">{dossier.sector}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider">Localisation</p>
                  <p className="font-semibold text-gray-900">{dossier.city}, {dossier.province}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider">Investissement</p>
                  <p className="font-semibold text-gray-900">{formatAmount(dossier.amount, dossier.currency)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider">Emplois</p>
                  <p className="font-semibold text-gray-900">{dossier.jobsCreated} directs / {dossier.jobsIndirect} indirects</p>
                </div>
              </div>

              {/* Validity Statement */}
              <div className={`text-center p-4 border-t-2 border-b-2 ${typeConfig.borderColor} bg-gray-50`}>
                <p className="text-gray-700 text-xs">
                  Ce certificat est delivre conformement aux dispositions du Code des Investissements
                  et confere au beneficiaire les avantages prevus par la loi.
                </p>
                <div className={`flex justify-center items-center gap-2 mt-2 ${typeConfig.accentColor}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-semibold text-sm">Reference: {dossier.reference}</span>
                </div>
              </div>

              {/* Signature and QR Code */}
              <div className="flex justify-between items-end pt-4">
                {/* QR Code */}
                <div className="text-center">
                  <div className="border-2 border-gray-300 p-2 rounded-lg bg-white inline-block">
                    <QRCodeSVG
                      value={getVerificationUrl()}
                      size={100}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1 max-w-[120px]">
                    Scannez pour verifier l'authenticite
                  </p>
                </div>

                {/* Dates */}
                <div className="text-center text-xs text-gray-600">
                  <p>Soumis le: {formatDate(dossier.submittedAt)}</p>
                  <p>Delivre le: {formatDate(dossier.decisionDate)}</p>
                </div>

                {/* Signature */}
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-12">Fait a Kinshasa, le {formatDate(dossier.decisionDate)}</p>
                  <div className="border-t-2 border-gray-400 pt-2 w-48">
                    <p className="font-semibold text-gray-900 text-sm">Le Directeur General</p>
                    <p className="text-xs text-gray-600">ANAPI</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-center text-[9px] text-gray-500">
                <p>Document genere electroniquement - Valeur juridique conformement a la loi sur la signature electronique</p>
                <p className="mt-1">Verification: {getVerificationUrl()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 5mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
