'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/contexts/LanguageContext';
import Swal from 'sweetalert2';

import {
  Users,
  UserCheck,
  UserMinus,
  Building2,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Printer,
  Download,
  RefreshCw,
  Filter,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CreditCard,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

import {
  getEmployees,
  getEmployeeStats,
  deleteEmployee,
  getPhotoUrl,
} from '@/app/services/hr';

// Status colors configuration
const getStatusStyles = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  switch (status.toLowerCase()) {
    case 'actif':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'en conge':
    case 'en congé':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'inactif':
    case 'suspendu':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getContractStyles = (type) => {
  if (!type) return 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400';
  switch (type.toUpperCase()) {
    case 'CDI':
      return 'border-[#0A1628] text-[#0A1628] dark:border-blue-400 dark:text-blue-400';
    case 'CDD':
      return 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400';
    case 'STAGE':
      return 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400';
    case 'INTERIM':
      return 'border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-400';
    default:
      return 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400';
  }
};

// Stats Card Component
function StatCard({ stat, loading }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${stat.bgClass}`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">
            {loading ? (
              <div className="h-8 w-12 animate-pulse rounded bg-white/20" />
            ) : (
              stat.value
            )}
          </h3>
          <p className="text-sm text-white/85">{stat.title}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
          <stat.icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

// Print Dialog Component - Professional Employee Card
function PrintDialog({ employee, isOpen, onClose, locale, intl }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined || amount === '') return 'Non defini';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'Non defini';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateSeniority = (hireDate) => {
    if (!hireDate) return null;
    const today = new Date();
    const hire = new Date(hireDate);
    const years = today.getFullYear() - hire.getFullYear();
    const months = today.getMonth() - hire.getMonth();
    if (years === 0) {
      return months <= 0 ? 'Moins d\'un mois' : `${months} mois`;
    }
    return years === 1 ? '1 an' : `${years} ans`;
  };

  if (!isOpen || !employee) return null;

  const photoUrl = getPhotoUrl(employee.photo);
  const age = calculateAge(employee.dateNaissance);
  const seniority = calculateSeniority(employee.dateEmbauche);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-[210mm] overflow-auto rounded-lg bg-white shadow-2xl">
        {/* Modal Header - Not printed */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A1628]">
              <Printer className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {intl.formatMessage({ id: 'hr.employees.employeeCard', defaultMessage: 'Fiche Employe' })}
              </h2>
              <p className="text-sm text-gray-500">{employee.prenom} {employee.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-5 py-2.5 font-medium text-white transition-all hover:bg-[#0A1628]/90 hover:shadow-lg"
            >
              <Printer className="h-4 w-4" />
              {intl.formatMessage({ id: 'common.print', defaultMessage: 'Imprimer' })}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Print Content - A4 Format */}
        <div ref={printRef} className="bg-white p-8 print:p-6" id="print-content">
          {/* Official Header with Logo Band */}
          <div className="mb-6 print:mb-4">
            {/* Top Band */}
            <div className="flex items-center justify-between rounded-t-lg bg-[#0A1628] px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <span className="text-xl font-bold text-[#0A1628]">ANAPI</span>
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-bold tracking-wide">AGENCE NATIONALE POUR LA PROMOTION DES INVESTISSEMENTS</h1>
                  <p className="text-sm text-gray-300">Direction des Ressources Humaines</p>
                </div>
              </div>
              <div className="text-right text-white">
                <p className="text-sm">Document officiel</p>
                <p className="text-xs text-gray-300">Ref: {employee.matricule}</p>
              </div>
            </div>

            {/* Gold Accent Line */}
            <div className="h-1.5 bg-gradient-to-r from-[#D4A853] via-[#F4D03F] to-[#D4A853]"></div>

            {/* Title */}
            <div className="border-b-2 border-gray-200 bg-gray-50 py-3 text-center">
              <h2 className="text-2xl font-bold tracking-widest text-[#0A1628]">FICHE INDIVIDUELLE D'EMPLOYE</h2>
              <p className="mt-1 text-sm text-gray-600">
                Editee le {new Date().toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="mb-6 grid grid-cols-12 gap-6 print:gap-4">
            {/* Left Column - Photo & Identity */}
            <div className="col-span-4">
              {/* Photo Card */}
              <div className="rounded-lg border-2 border-[#0A1628] bg-white p-4 text-center shadow-md">
                <div className="mx-auto mb-3 h-40 w-36 overflow-hidden rounded-lg border-4 border-[#D4A853] bg-gray-100 shadow-inner">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={`${employee.prenom} ${employee.nom}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#1a2d4a] ${photoUrl ? 'hidden' : ''}`}
                  >
                    <span className="text-4xl font-bold text-white">
                      {employee.prenom?.[0]}{employee.nom?.[0]}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#0A1628]">
                  {employee.prenom} {employee.postnom ? `${employee.postnom} ` : ''}{employee.nom}
                </h3>

                <div className="mt-2 inline-block rounded-md bg-[#0A1628] px-4 py-1.5">
                  <span className="font-mono text-sm font-bold tracking-wider text-[#D4A853]">{employee.matricule}</span>
                </div>

                <div className="mt-3 flex justify-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(employee.statut)}`}>
                    {employee.statut || 'Non defini'}
                  </span>
                </div>

                {seniority && (
                  <p className="mt-3 text-sm text-gray-600">
                    <Calendar className="mr-1 inline h-4 w-4" />
                    Anciennete: <span className="font-semibold">{seniority}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Professional Info */}
            <div className="col-span-8 space-y-4">
              {/* Professional Information */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-200 bg-[#0A1628] px-4 py-2 rounded-t-lg">
                  <Briefcase className="h-5 w-5 text-[#D4A853]" />
                  <h4 className="font-semibold text-white">
                    {intl.formatMessage({ id: 'hr.employees.professionalInfo', defaultMessage: 'Informations Professionnelles' })}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4">
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Departement</p>
                      <p className="font-semibold text-gray-900">{employee.departement_nom || employee.departement || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="mt-0.5 h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Poste / Fonction</p>
                      <p className="font-semibold text-gray-900">{employee.poste_nom || employee.poste || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Categorie</p>
                    <p className="font-semibold text-gray-900">{employee.categorie_nom || employee.categorie || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Grade / Echelon</p>
                    <p className="font-semibold text-gray-900">{employee.grade_nom || employee.grade || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Type de Contrat</p>
                    <p className="font-semibold text-gray-900">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-sm ${getContractStyles(employee.typeContrat)}`}>
                        {employee.typeContrat || '-'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Date d'embauche</p>
                    <p className="font-semibold text-gray-900">{formatDate(employee.dateEmbauche)}</p>
                  </div>
                  {employee.dateFinContrat && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Fin de Contrat</p>
                      <p className="font-semibold text-gray-900">{formatDate(employee.dateFinContrat)}</p>
                    </div>
                  )}
                  <div className="col-span-2 rounded-lg bg-green-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-green-700">Salaire de Base Mensuel</p>
                    <p className="text-xl font-bold text-green-700">
                      {formatCurrency(employee.salaireBase || employee.salaire_base || employee.categorie_salaire, employee.salaireDevise || employee.salaire_devise || 'USD')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm print:mb-3">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
              <Users className="h-5 w-5 text-[#0A1628]" />
              <h4 className="font-semibold text-[#0A1628]">
                {intl.formatMessage({ id: 'hr.employees.personalInfo', defaultMessage: 'Informations Personnelles' })}
              </h4>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4 print:grid-cols-4 print:gap-2 print:p-3 print:text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Genre</p>
                <p className="font-medium text-gray-900">
                  {employee.genre === 'M' ? 'Masculin' : employee.genre === 'F' ? 'Feminin' : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Date de Naissance</p>
                <p className="font-medium text-gray-900">
                  {formatDate(employee.dateNaissance)}
                  {age && <span className="ml-1 text-gray-500">({age} ans)</span>}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Lieu de Naissance</p>
                <p className="font-medium text-gray-900">{employee.lieuNaissance || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Nationalite</p>
                <p className="font-medium text-gray-900">{employee.nationalite || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">N° Carte d'Identite</p>
                <p className="font-medium text-gray-900">{employee.numeroIdentite || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Etat Civil</p>
                <p className="font-medium text-gray-900">
                  {employee.etatCivil ? employee.etatCivil.charAt(0).toUpperCase() + employee.etatCivil.slice(1) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Nombre d'Enfants</p>
                <p className="font-medium text-gray-900">{employee.nombreEnfants ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Nom du Conjoint</p>
                <p className="font-medium text-gray-900">{employee.nomConjoint || '-'}</p>
              </div>
            </div>
          </div>

          {/* Contact & Address Section */}
          <div className="mb-4 grid grid-cols-2 gap-4 print:mb-3 print:gap-3">
            {/* Contact */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
                <Phone className="h-5 w-5 text-[#0A1628]" />
                <h4 className="font-semibold text-[#0A1628]">Coordonnees</h4>
              </div>
              <div className="space-y-3 p-4 print:space-y-2 print:p-3 print:text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{employee.email || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Telephone Principal</p>
                    <p className="font-medium text-gray-900">{employee.telephone1 || '-'}</p>
                  </div>
                </div>
                {employee.telephone2 && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telephone Secondaire</p>
                      <p className="font-medium text-gray-900">{employee.telephone2}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Adresse</p>
                    <p className="font-medium text-gray-900">
                      {employee.adresse || '-'}
                      {employee.commune && `, ${employee.commune}`}
                      {employee.ville && `, ${employee.ville}`}
                      {employee.province && ` - ${employee.province}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Info */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
                <CreditCard className="h-5 w-5 text-[#0A1628]" />
                <h4 className="font-semibold text-[#0A1628]">Informations Bancaires</h4>
              </div>
              <div className="space-y-3 p-4 print:space-y-2 print:p-3 print:text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Banque</p>
                  <p className="font-medium text-gray-900">{employee.banque || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Code Banque</p>
                  <p className="font-mono font-medium text-gray-900">{employee.numeroBanque || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Numero de Compte</p>
                  <p className="font-mono font-medium text-gray-900">{employee.numeroCompte || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 shadow-sm print:mb-4">
            <div className="flex items-center gap-2 border-b border-red-200 bg-red-100 px-4 py-2 rounded-t-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Contact d'Urgence</h4>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 print:gap-2 print:p-3 print:text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-red-600">Nom Complet</p>
                <p className="font-semibold text-gray-900">{employee.nomUrgence || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-red-600">Lien de Parente</p>
                <p className="font-semibold text-gray-900">{employee.lienUrgence || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-red-600">Telephone</p>
                <p className="font-semibold text-gray-900">{employee.telephoneUrgence || '-'}</p>
              </div>
            </div>
          </div>

          {/* Official Footer */}
          <div className="border-t-2 border-[#0A1628] pt-4 print:pt-3">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="mb-8 text-sm text-gray-600">Signature de l'employe</p>
                <div className="border-b border-gray-400 w-48"></div>
              </div>
              <div className="text-right">
                <p className="mb-8 text-sm text-gray-600">Le Directeur des Ressources Humaines</p>
                <div className="border-b border-gray-400 w-48 ml-auto"></div>
              </div>
            </div>
            <div className="mt-6 text-center print:mt-4">
              <p className="text-xs text-gray-500">
                Document genere automatiquement par le Systeme de Gestion des Ressources Humaines - ANAPI
              </p>
              <p className="mt-1 text-xs font-semibold text-red-600">
                DOCUMENT STRICTEMENT CONFIDENTIEL - RESERVE A L'USAGE INTERNE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
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
            font-size: 11pt;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mb-3 {
            margin-bottom: 0.75rem !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:gap-2 {
            gap: 0.5rem !important;
          }
          .print\\:gap-3 {
            gap: 0.75rem !important;
          }
          .print\\:p-3 {
            padding: 0.75rem !important;
          }
          .print\\:pt-3 {
            padding-top: 0.75rem !important;
          }
          .print\\:mt-4 {
            margin-top: 1rem !important;
          }
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          .print\\:space-y-2 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function EmployeesListPage() {
  const router = useRouter();
  const intl = useIntl();
  const { locale } = useLanguage();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    enConge: 0,
    departements: 0,
  });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, employee: null });
  const [printDialog, setPrintDialog] = useState({ open: false, employee: null });

  // Load stats
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await getEmployeeStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load employees
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      });
      if (response.success) {
        const employeesData = response.data?.employees || response.data || [];
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
        setTotalEmployees(response.data?.pagination?.total || response.pagination?.total || employeesData.length || 0);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      Swal.fire({
        title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
        text: intl.formatMessage({ id: 'hr.employees.loadError', defaultMessage: 'Impossible de charger les employes' }),
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [page, rowsPerPage, searchQuery]);

  // Listen for company changes
  useEffect(() => {
    const handleCompanyChange = () => {
      setPage(0);
      loadEmployees();
      loadStats();
    };

    window.addEventListener('activeCompanyChanged', handleCompanyChange);
    return () => {
      window.removeEventListener('activeCompanyChanged', handleCompanyChange);
    };
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, employee) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 200; // Approximate menu height
    const menuWidth = 180;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate optimal position
    let x = rect.left - menuWidth + rect.width;
    let y = rect.bottom + 5;

    // Check if menu would go off the bottom of screen
    if (y + menuHeight > viewportHeight) {
      y = rect.top - menuHeight - 5; // Show above instead
    }

    // Check if menu would go off the right edge
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }

    // Check if menu would go off the left edge
    if (x < 10) {
      x = 10;
    }

    setContextMenu({
      visible: true,
      x,
      y,
      employee,
    });
  };

  const handleMenuClose = () => {
    setContextMenu({ visible: false, x: 0, y: 0, employee: null });
  };

  const handleViewEmployee = (employee) => {
    router.push(`/hr/employees/${employee.id}`);
    handleMenuClose();
  };

  const handleEditEmployee = (employee) => {
    router.push(`/hr/employees/${employee.id}/edit`);
    handleMenuClose();
  };

  const handleDeleteEmployee = async (employee) => {
    handleMenuClose();
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.employees.deleteConfirmTitle', defaultMessage: 'Confirmer la suppression' }),
      html: intl.formatMessage(
        { id: 'hr.employees.deleteConfirmMessage', defaultMessage: 'Voulez-vous vraiment supprimer <strong>{name}</strong>?' },
        { name: `${employee.prenom} ${employee.nom}` }
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0A1628',
      confirmButtonText: intl.formatMessage({ id: 'common.confirmDelete', defaultMessage: 'Oui, supprimer' }),
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteEmployee(employee.id);
        if (response.success) {
          Swal.fire({
            title: intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprime!' }),
            text: intl.formatMessage(
              { id: 'hr.employees.deleteSuccess', defaultMessage: '{name} a ete supprime avec succes' },
              { name: `${employee.prenom} ${employee.nom}` }
            ),
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          loadEmployees();
          loadStats();
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          title: intl.formatMessage({ id: 'common.error', defaultMessage: 'Erreur' }),
          text: error.message || intl.formatMessage({ id: 'hr.employees.deleteError', defaultMessage: 'Impossible de supprimer' }),
          icon: 'error',
        });
      }
    }
  };

  const handlePrintEmployee = (employee) => {
    setPrintDialog({ open: true, employee });
    handleMenuClose();
  };

  const handleRefresh = () => {
    loadEmployees();
    loadStats();
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        handleMenuClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.employees.stats.totalEmployees', defaultMessage: 'Total Employes' }),
      value: stats.total,
      icon: Users,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    },
    {
      title: intl.formatMessage({ id: 'hr.employees.stats.activeEmployees', defaultMessage: 'Employes Actifs' }),
      value: stats.actifs,
      icon: UserCheck,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.employees.stats.onLeave', defaultMessage: 'En Conge' }),
      value: stats.enConge,
      icon: UserMinus,
      bgClass: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.employees.stats.departments', defaultMessage: 'Departements' }),
      value: stats.departements,
      icon: Building2,
      bgClass: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
  ];

  const totalPages = Math.ceil(totalEmployees / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: 'hr.employees.title', defaultMessage: 'Gestion des Employes' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intl.formatMessage({ id: 'hr.employees.subtitle', defaultMessage: 'Gerez les employes de votre organisation' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title={intl.formatMessage({ id: 'common.refresh', defaultMessage: 'Actualiser' })}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <Download className="h-5 w-5" />
            <span className="hidden sm:inline">
              {intl.formatMessage({ id: 'common.export', defaultMessage: 'Exporter' })}
            </span>
          </button>
          <Link
            href="/hr/employees/new"
            className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#0A1628]/90"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">
              {intl.formatMessage({ id: 'common.add', defaultMessage: 'Ajouter' })}
            </span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={statsLoading} />
        ))}
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={intl.formatMessage({ id: 'hr.employees.searchPlaceholder', defaultMessage: 'Rechercher par nom, matricule, email...' })}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {intl.formatMessage({ id: 'common.filter', defaultMessage: 'Filtres' })}
                </span>
              </button>
              <button className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.photo', defaultMessage: 'Photo' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.matricule', defaultMessage: 'Matricule' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.fullName', defaultMessage: 'Nom Complet' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.department', defaultMessage: 'Departement' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.position', defaultMessage: 'Poste' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.type', defaultMessage: 'Type' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.status', defaultMessage: 'Statut' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.employees.table.hireDate', defaultMessage: 'Embauche' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                      <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'hr.employees.loading', defaultMessage: 'Chargement des employes...' })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.employees.noEmployees', defaultMessage: 'Aucun employe trouve' })}
                    </p>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                        {employee.photo ? (
                          <img
                            src={getPhotoUrl(employee.photo)}
                            alt={`${employee.prenom} ${employee.nom}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {employee.prenom?.[0]}
                            {employee.nom?.[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#0A1628] dark:text-[#D4A853]">
                        {employee.matricule}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employee.prenom} {employee.nom}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {employee.departement_nom || employee.departement || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {employee.poste_nom || employee.poste || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getContractStyles(employee.typeContrat)}`}
                      >
                        {employee.typeContrat || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(employee.statut)}`}
                      >
                        {employee.statut || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {employee.dateEmbauche
                        ? new Date(employee.dateEmbauche).toLocaleDateString(locale)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => handleMenuOpen(e, employee)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'common.rowsPerPage', defaultMessage: 'Lignes par page:' })}
            </span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {[5, 10, 25, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {intl.formatMessage(
                { id: 'common.displayedRows', defaultMessage: '{from}-{to} sur {count}' },
                {
                  from: page * rowsPerPage + 1,
                  to: Math.min((page + 1) * rowsPerPage, totalEmployees),
                  count: totalEmployees,
                }
              )}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 min-w-[160px] rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-600 dark:bg-gray-800"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleViewEmployee(contextMenu.employee)}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4" />
            {intl.formatMessage({ id: 'common.viewDetails', defaultMessage: 'Voir details' })}
          </button>
          <button
            onClick={() => handleEditEmployee(contextMenu.employee)}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Edit className="h-4 w-4" />
            {intl.formatMessage({ id: 'common.edit', defaultMessage: 'Modifier' })}
          </button>
          <button
            onClick={() => handlePrintEmployee(contextMenu.employee)}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Printer className="h-4 w-4" />
            {intl.formatMessage({ id: 'hr.employees.printCard', defaultMessage: 'Imprimer fiche' })}
          </button>
          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
          <button
            onClick={() => handleDeleteEmployee(contextMenu.employee)}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            {intl.formatMessage({ id: 'common.delete', defaultMessage: 'Supprimer' })}
          </button>
        </div>
      )}

      {/* Print Dialog */}
      <PrintDialog
        employee={printDialog.employee}
        isOpen={printDialog.open}
        onClose={() => setPrintDialog({ open: false, employee: null })}
        locale={locale}
        intl={intl}
      />
    </div>
  );
}
