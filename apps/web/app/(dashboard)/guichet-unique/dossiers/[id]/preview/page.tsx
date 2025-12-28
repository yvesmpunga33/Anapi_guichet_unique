"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Download,
  X,
  Building2,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
} from "lucide-react";

interface Dossier {
  id: string;
  reference: string;
  investorName: string;
  investorType: string;
  investorEmail: string;
  investorPhone: string;
  investorAddress: string;
  investorCountry: string;
  projectName: string;
  projectDescription: string;
  sector: string;
  subSector: string;
  province: string;
  city: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
  amount: number;
  currency: string;
  jobsCreated: number;
  jobsIndirect: number;
  currentStep: number;
  totalSteps: number;
  startDate: string;
  endDate: string;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  UNDER_REVIEW: "En cours d'examen",
  PENDING_DOCUMENTS: "Documents requis",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  COMPLETED: "Terminé",
};

const workflowSteps = [
  { step: 1, name: "Soumission", description: "Dépôt du dossier" },
  { step: 2, name: "Vérification", description: "Contrôle documents" },
  { step: 3, name: "Examen Technique", description: "Analyse technique" },
  { step: 4, name: "Examen Juridique", description: "Validation légale" },
  { step: 5, name: "Commission", description: "Décision finale" },
  { step: 6, name: "Agrément", description: "Délivrance" },
];

const mockDossier: Dossier = {
  id: "1",
  reference: "GU-2024-00125",
  investorName: "Congo Mining Corporation",
  investorType: "company",
  investorEmail: "contact@congomining.com",
  investorPhone: "+243 81 234 5678",
  investorAddress: "Avenue de la Paix, 123",
  investorCountry: "Afrique du Sud",
  projectName: "Extension Mine de Cuivre Kolwezi",
  projectDescription: "Projet d'extension de la capacité de production de la mine de cuivre avec nouvelles installations de traitement du minerai et infrastructure logistique associée.",
  sector: "Mines et Extraction",
  subSector: "Cuivre et Cobalt",
  province: "Lualaba",
  city: "Kolwezi",
  status: "UNDER_REVIEW",
  submittedAt: "2024-01-15",
  updatedAt: "2024-01-20",
  amount: 15000000,
  currency: "USD",
  jobsCreated: 500,
  jobsIndirect: 1500,
  currentStep: 3,
  totalSteps: 6,
  startDate: "2024-06-01",
  endDate: "2026-12-31",
};

export default function DossierPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setDossier({ ...mockDossier, id: params.id as string });
      setLoading(false);
    }, 300);
  }, [params.id]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Dossier non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar - Hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.close()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fermer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">Aperçu du dossier</h1>
              <p className="text-sm text-gray-500">{dossier.reference}</p>
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
              title="Fermer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Content */}
      <div className="max-w-5xl mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        <div
          ref={printRef}
          className="bg-white shadow-lg print:shadow-none"
          style={{ minHeight: "297mm" }}
        >
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 print:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-900">AN</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">ANAPI</h1>
                  <p className="text-blue-200 text-sm">Agence Nationale pour la Promotion des Investissements</p>
                  <p className="text-blue-200 text-xs">République Démocratique du Congo</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-200">Référence</p>
                <p className="text-xl font-bold">{dossier.reference}</p>
                <p className="text-sm text-blue-200 mt-2">Statut</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {statusLabels[dossier.status] || dossier.status}
                </span>
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="border-b-4 border-blue-600 p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 text-center uppercase tracking-wider">
              Fiche de Suivi de Dossier d'Investissement
            </h2>
            <p className="text-center text-gray-500 mt-1">
              Document généré le {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 print:p-6 space-y-8">
            {/* Project Information */}
            <section>
              <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-200 pb-2 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
                Informations du Projet
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Nom du Projet</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{dossier.projectName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Description</p>
                  <p className="text-gray-700 mt-1 leading-relaxed">{dossier.projectDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Secteur d'Activité</p>
                  <p className="text-gray-900 font-medium mt-1">{dossier.sector}</p>
                  <p className="text-sm text-gray-500">{dossier.subSector}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Localisation</p>
                  <p className="text-gray-900 font-medium mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {dossier.city}, {dossier.province}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Date de Début Prévue</p>
                  <p className="text-gray-900 font-medium mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(dossier.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Date de Fin Prévue</p>
                  <p className="text-gray-900 font-medium mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(dossier.endDate)}
                  </p>
                </div>
              </div>
            </section>

            {/* Investment Details */}
            <section>
              <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-200 pb-2 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
                Détails de l'Investissement
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700 uppercase tracking-wider">Montant de l'Investissement</p>
                  <p className="text-2xl font-bold text-green-800 mt-2">{formatAmount(dossier.amount, dossier.currency)}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700 uppercase tracking-wider">Emplois Directs</p>
                  <p className="text-2xl font-bold text-blue-800 mt-2">{dossier.jobsCreated.toLocaleString("fr-FR")}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-700 uppercase tracking-wider">Emplois Indirects</p>
                  <p className="text-2xl font-bold text-purple-800 mt-2">{dossier.jobsIndirect.toLocaleString("fr-FR")}</p>
                </div>
              </div>
            </section>

            {/* Investor Information */}
            <section>
              <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-200 pb-2 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">3</span>
                Informations de l'Investisseur
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {dossier.investorType === "company" ? (
                      <Building2 className="w-7 h-7 text-white" />
                    ) : (
                      <User className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-gray-900">{dossier.investorName}</p>
                    <p className="text-sm text-gray-500">
                      {dossier.investorType === "company" ? "Société" : "Investisseur Individuel"}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{dossier.investorEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{dossier.investorPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{dossier.investorCountry}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{dossier.investorAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Workflow Progress */}
            <section>
              <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-200 pb-2 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">4</span>
                État d'Avancement du Dossier
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  {workflowSteps.map((step, index) => (
                    <div key={step.step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 ${
                            step.step < dossier.currentStep
                              ? "bg-green-500 border-green-500 text-white"
                              : step.step === dossier.currentStep
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          {step.step < dossier.currentStep ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            step.step
                          )}
                        </div>
                        <p className={`text-xs mt-2 font-medium text-center ${
                          step.step <= dossier.currentStep
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-400 text-center">{step.description}</p>
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${
                          step.step < dossier.currentStep
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Key Dates */}
            <section>
              <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-200 pb-2 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">5</span>
                Dates Clés
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date de Soumission</span>
                  <span className="font-medium text-gray-900">{formatDate(dossier.submittedAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Dernière Mise à Jour</span>
                  <span className="font-medium text-gray-900">{formatDate(dossier.updatedAt)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t-4 border-blue-600 p-6 bg-gray-50 mt-8">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <p className="font-medium text-gray-700">ANAPI - Agence Nationale pour la Promotion des Investissements</p>
                <p>Kinshasa, République Démocratique du Congo</p>
              </div>
              <div className="text-right">
                <p>Document confidentiel</p>
                <p>Page 1/1</p>
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
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
