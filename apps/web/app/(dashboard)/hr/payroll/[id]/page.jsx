'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useIntl } from 'react-intl';
import Swal from 'sweetalert2';
import { QRCodeSVG } from 'qrcode.react';

import {
  ArrowLeft,
  Check,
  CreditCard,
  Printer,
  FileText,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Banknote,
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive,
} from 'lucide-react';

import {
  getPayrollById,
  validerPayroll,
  payerPayroll,
  formatMontant,
  getNomMois,
  getStatutConfig,
} from '@/app/services/hr/payrollService';

// Status badge component
const StatusBadge = ({ statut }) => {
  const config = getStatutConfig(statut);
  const statusStyles = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    secondary: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const icons = {
    brouillon: Clock,
    calcule: Calculator,
    valide: CheckCircle,
    paye: Banknote,
    archive: Archive,
  };

  const Icon = icons[statut] || Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusStyles[config.color] || statusStyles.default}`}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
};

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const intl = useIntl();
  const printRef = useRef();

  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const loadPayroll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPayrollById(id);
      if (response.success) {
        setPayroll(response.data);
      } else {
        setError(intl.formatMessage({ id: 'payroll.notFound', defaultMessage: 'Fiche de paie non trouvee' }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, intl]);

  useEffect(() => {
    if (id) loadPayroll();
  }, [id, loadPayroll]);

  const handleValider = async () => {
    setProcessing(true);
    try {
      const response = await validerPayroll(id);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'payroll.validatedSuccess', defaultMessage: 'Fiche validee avec succes' }),
          timer: 2000,
        });
        loadPayroll();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: err.message,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayer = async () => {
    setProcessing(true);
    try {
      const response = await payerPayroll(id);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'common.success', defaultMessage: 'Succes' }),
          text: intl.formatMessage({ id: 'payroll.paidSuccess', defaultMessage: 'Fiche marquee comme payee' }),
          timer: 2000,
        });
        loadPayroll();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: err.message,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Format amount
  const fmt = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#D4A853]" />
          <p className="text-gray-500 dark:text-gray-400">
            {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
          </p>
        </div>
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {error || intl.formatMessage({ id: 'payroll.notFound', defaultMessage: 'Fiche de paie non trouvee' })}
          </p>
          <button
            onClick={() => router.push('/hr/payroll')}
            className="mt-4 flex items-center gap-2 mx-auto rounded-xl bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <ArrowLeft className="h-4 w-4" />
            {intl.formatMessage({ id: 'common.back', defaultMessage: 'Retour' })}
          </button>
        </div>
      </div>
    );
  }

  const employee = payroll.employee;
  const enterprise = payroll.enterprise;
  const currency = payroll.currency?.code || 'USD';
  const periodeLabel = `${getNomMois(payroll.mois).charAt(0).toUpperCase() + getNomMois(payroll.mois).slice(1)} ${payroll.annee}`;

  return (
    <div className="space-y-6">
      {/* Action Bar - Hidden when printing */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/hr/payroll')}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {intl.formatMessage({ id: 'payroll.backToList', defaultMessage: 'Retour a la liste' })}
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'payroll.payslip', defaultMessage: 'Bulletin de Paie' })} - {payroll.reference}
            </h1>
            <StatusBadge statut={payroll.statut} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {payroll.statut === 'calcule' && (
            <button
              onClick={handleValider}
              disabled={processing}
              className="flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {intl.formatMessage({ id: 'payroll.validate', defaultMessage: 'Valider' })}
            </button>
          )}
          {payroll.statut === 'valide' && (
            <button
              onClick={handlePayer}
              disabled={processing}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              {intl.formatMessage({ id: 'payroll.markPaid', defaultMessage: 'Marquer Paye' })}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
          >
            <Printer className="h-4 w-4" />
            {intl.formatMessage({ id: 'common.print', defaultMessage: 'Imprimer' })}
          </button>
        </div>
      </div>

      {/* Pay Slip Document */}
      <div
        ref={printRef}
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg print:rounded-none print:shadow-none dark:bg-gray-800"
        id="print-content"
      >
        {/* Header */}
        <div className="border-b-4 border-[#0A1628] p-6 print:p-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] dark:text-white print:text-black">
                {enterprise?.name || 'ANAPI'}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 print:text-black">
                {enterprise?.address}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 print:text-black">
                {enterprise?.phone}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-[#0A1628] dark:text-white print:text-black">
                {intl.formatMessage({ id: 'payroll.payslipTitle', defaultMessage: 'BULLETIN DE PAIE' })}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 print:text-black">
                {intl.formatMessage({ id: 'payroll.periodFrom', defaultMessage: 'Periode du' })} 01 {intl.formatMessage({ id: 'payroll.to', defaultMessage: 'au' })} {new Date(payroll.annee, payroll.mois, 0).getDate()} {periodeLabel}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 print:text-black">
                {intl.formatMessage({ id: 'payroll.reference', defaultMessage: 'Reference' })}: {payroll.reference}
              </p>
            </div>
          </div>
        </div>

        {/* Employee & Company Info */}
        <div className="grid grid-cols-1 gap-4 p-6 print:p-4 md:grid-cols-2">
          {/* Employee */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700 print:border-black">
            <h4 className="mb-3 border-b border-gray-200 pb-2 font-bold text-[#0A1628] dark:border-gray-700 dark:text-white print:border-black print:text-black">
              {intl.formatMessage({ id: 'payroll.employeeInfo', defaultMessage: 'SALARIE' })}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.name', defaultMessage: 'Nom' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">
                  {employee?.nom} {employee?.postnom} {employee?.prenom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.matricule', defaultMessage: 'Matricule' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{employee?.matricule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.category', defaultMessage: 'Categorie' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{payroll.category?.nom || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.position', defaultMessage: 'Emploi' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{employee?.poste || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.department', defaultMessage: 'Departement' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{employee?.departement || '-'}</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700 print:border-black">
            <h4 className="mb-3 border-b border-gray-200 pb-2 font-bold text-[#0A1628] dark:border-gray-700 dark:text-white print:border-black print:text-black">
              {intl.formatMessage({ id: 'payroll.companyInfo', defaultMessage: 'ENTREPRISE' })}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.address', defaultMessage: 'Adresse' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{enterprise?.address || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">{intl.formatMessage({ id: 'payroll.cnssNo', defaultMessage: 'N CNSS' })}:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{enterprise?.noCnss || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">NAF:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{enterprise?.naf || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 print:text-black">SIRET:</span>
                <span className="font-medium text-gray-900 dark:text-white print:text-black">{enterprise?.siret || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto p-6 print:p-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 print:bg-gray-200">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-white print:border-black print:text-black">
                  Code
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-white print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.description', defaultMessage: 'Libelle de la rubrique' })}
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900 dark:border-gray-600 dark:text-white print:border-black print:text-black">
                  Base
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900 dark:border-gray-600 dark:text-white print:border-black print:text-black" colSpan={2}>
                  {intl.formatMessage({ id: 'payroll.employeeContributions', defaultMessage: 'Cotisations salarie' })}
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900 dark:border-gray-600 dark:text-white print:border-black print:text-black" colSpan={2}>
                  {intl.formatMessage({ id: 'payroll.employerContributions', defaultMessage: 'Cotisations employeur' })}
                </th>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-700/50 print:bg-gray-100">
                <th className="border border-gray-300 px-3 py-1 dark:border-gray-600 print:border-black"></th>
                <th className="border border-gray-300 px-3 py-1 dark:border-gray-600 print:border-black"></th>
                <th className="border border-gray-300 px-3 py-1 dark:border-gray-600 print:border-black"></th>
                <th className="border border-gray-300 px-3 py-1 text-center text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.rate', defaultMessage: 'Taux' })}
                </th>
                <th className="border border-gray-300 px-3 py-1 text-center text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.amount', defaultMessage: 'Montant' })}
                </th>
                <th className="border border-gray-300 px-3 py-1 text-center text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.rate', defaultMessage: 'Taux' })}
                </th>
                <th className="border border-gray-300 px-3 py-1 text-center text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.amount', defaultMessage: 'Montant' })}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Base Salary */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">1000</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.grossSalary', defaultMessage: 'Salaire Brut' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.salaireBase)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right font-semibold dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.salaireBrut)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
              </tr>

              {/* Gross Total */}
              <tr className="bg-gray-100 dark:bg-gray-700 print:bg-gray-200">
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">BRUT1</td>
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.grossSalaryTotal', defaultMessage: 'SALAIRE BRUT' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.salaireBrut)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
              </tr>

              {/* Health Section Header */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.health', defaultMessage: 'Sante' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={5}></td>
              </tr>

              {/* CNSS */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">C01</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">CNSS/INSS</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.salaireBrut)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center dark:border-gray-600 print:border-black print:text-black">{payroll.tauxCnssEmploye || 5}%</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.cnssEmploye)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center dark:border-gray-600 print:border-black print:text-black">{payroll.tauxCnssEmployeur || 9}%</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.cnssEmployeur)}</td>
              </tr>

              {/* INPP */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">C02</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">INPP</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.salaireBrut)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-center dark:border-gray-600 print:border-black print:text-black">1%</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.inppEmployeur)}</td>
              </tr>

              {/* ONEM */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">C03</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">ONEM</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.salaireBrut)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-center dark:border-gray-600 print:border-black print:text-black">0.2%</td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.onemEmployeur)}</td>
              </tr>

              {/* IPR Section Header */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.incomeTax', defaultMessage: 'Impot sur le Revenu (IPR)' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={5}></td>
              </tr>

              {/* Taxable Base */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">I01</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.taxableBase', defaultMessage: 'Base Imposable' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.baseImposable)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={4}></td>
              </tr>

              {/* IPR Gross */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">I02</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.iprGross', defaultMessage: 'IPR Brut (bareme progressif)' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.iprBrut)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={2}></td>
              </tr>

              {/* Family Allowance */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">I03</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.familyAllowance', defaultMessage: 'Abattement familial' })} ({payroll.chargesFamiliales} pers. x 2%)
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">-{fmt(payroll.abattementFamilial)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={2}></td>
              </tr>

              {/* Net IPR */}
              <tr>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">IPR</td>
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.netTaxable', defaultMessage: 'Net Imposable' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.iprNet)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={2}></td>
              </tr>

              {/* Bonuses */}
              {payroll.detailPrimes?.length > 0 && (
                <>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                    <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                      {intl.formatMessage({ id: 'payroll.bonuses', defaultMessage: 'Primes' })}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={5}></td>
                  </tr>
                  {payroll.detailPrimes.map((prime, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">P{String(idx + 1).padStart(2, '0')}</td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">{prime.nom}</td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                      <td className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black">{fmt(prime.montant)}</td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={2}></td>
                    </tr>
                  ))}
                </>
              )}

              {/* Other Deductions */}
              {payroll.detailRetenues?.length > 0 && (
                <>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                    <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                      {intl.formatMessage({ id: 'payroll.otherDeductions', defaultMessage: 'Autres Retenues' })}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={5}></td>
                  </tr>
                  {payroll.detailRetenues.map((ret, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">R{String(idx + 1).padStart(2, '0')}</td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black print:text-black">
                        {ret.nom}
                        {ret.source === 'absences' && ret.jours && (
                          <span className="block text-xs text-red-600 dark:text-red-400 print:text-black">
                            {ret.jours} jour(s) x {fmt(ret.base)} = {fmt(ret.montant)}
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                      <td className={`border border-gray-300 px-3 py-2 text-right dark:border-gray-600 print:border-black print:text-black ${ret.source === 'absences' ? 'text-red-600 dark:text-red-400' : ''}`}>
                        {fmt(ret.montant)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black" colSpan={2}></td>
                    </tr>
                  ))}
                </>
              )}

              {/* Total Contributions */}
              <tr className="bg-gray-100 dark:bg-gray-700 print:bg-gray-200">
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">TOTAL</td>
                <td className="border border-gray-300 px-3 py-2 font-bold dark:border-gray-600 print:border-black print:text-black">
                  {intl.formatMessage({ id: 'payroll.totalContributions', defaultMessage: 'Total Cotisations' })}
                </td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.totalRetenuesSalariales)}</td>
                <td className="border border-gray-300 px-3 py-2 dark:border-gray-600 print:border-black"></td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold dark:border-gray-600 print:border-black print:text-black">{fmt(payroll.totalChargesPatronales)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net to Pay Box */}
        <div className="mx-6 mb-6 rounded-xl border-2 border-[#0A1628] p-4 text-center print:mx-4 print:mb-4 print:border-black">
          <p className="text-sm font-semibold text-[#0A1628] dark:text-white print:text-black">
            {intl.formatMessage({ id: 'payroll.netToPayBeforeTax', defaultMessage: 'NET A PAYER AVANT IMPOT SUR LE REVENU' })}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#D4A853] print:text-black">
            {fmt(payroll.netAPayer)} {currency}
          </p>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between px-6 pb-4 text-xs print:px-4">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 print:text-black">
              {intl.formatMessage({ id: 'payroll.incomeTaxInfo', defaultMessage: 'Impot sur le revenu:' })}
            </p>
            <p className="text-gray-600 dark:text-gray-400 print:text-black">
              Base: {fmt(payroll.baseImposable)} | {intl.formatMessage({ id: 'payroll.customRate', defaultMessage: 'Taux personnalise' })} | {intl.formatMessage({ id: 'payroll.amount', defaultMessage: 'Montant' })}: {fmt(payroll.iprNet)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-700 dark:text-gray-300 print:text-black">
              {intl.formatMessage({ id: 'payroll.netToPay', defaultMessage: 'NET A PAYER' })}
            </p>
            <p className="text-lg font-bold text-[#0A1628] dark:text-white print:text-black">
              {fmt(payroll.netAPayer)} {currency}
            </p>
          </div>
        </div>

        {/* Footer with QR Code */}
        <div className="flex items-start justify-between border-t border-gray-200 p-6 print:border-black print:p-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 print:text-black">
            <p>IBAN: {employee?.iban || '-'}</p>
            <p>BIC: {employee?.bic || '-'}</p>
            <p>{intl.formatMessage({ id: 'payroll.bank', defaultMessage: 'Banque' })}: {employee?.banque || '-'}</p>
          </div>
          <div className="text-center">
            <p className="mb-2 text-xs text-gray-600 dark:text-gray-400 print:text-black">
              {intl.formatMessage({ id: 'payroll.paymentDate', defaultMessage: 'Date de paiement' })}: {payroll.datePaiement ? new Date(payroll.datePaiement).toLocaleDateString('fr-FR') : '-'}
            </p>
            <p className="mb-2 text-xs text-gray-600 dark:text-gray-400 print:text-black">
              {intl.formatMessage({ id: 'payroll.mode', defaultMessage: 'Mode' })}: {intl.formatMessage({ id: 'payroll.bankTransfer', defaultMessage: 'Virement bancaire' })}
            </p>
            <QRCodeSVG
              value={JSON.stringify({
                ref: payroll.reference,
                emp: employee?.matricule,
                net: payroll.netAPayer,
                periode: `${payroll.mois}/${payroll.annee}`,
                entreprise: enterprise?.name,
              })}
              size={60}
              level="M"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 print:text-black">
              {intl.formatMessage({ id: 'payroll.verification', defaultMessage: 'Verification' })}
            </p>
          </div>
          <div className="text-right text-xs text-gray-600 dark:text-gray-400 print:text-black">
            <p>{intl.formatMessage({ id: 'payroll.totalEmployerCost', defaultMessage: 'Cout total employeur' })}: {fmt(payroll.coutTotalEmployeur)} {currency}</p>
            <p>{intl.formatMessage({ id: 'payroll.editionDate', defaultMessage: 'Date d\'edition' })}: {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-content,
          #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
