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

// Print Dialog Component
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

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-[#D4A853]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.employees.employeeCard', defaultMessage: 'Fiche Employe' })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-white hover:bg-[#0A1628]/90"
            >
              <Printer className="h-4 w-4" />
              {intl.formatMessage({ id: 'common.print', defaultMessage: 'Imprimer' })}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Print Content */}
        <div ref={printRef} className="p-6" id="print-content">
          {/* Header */}
          <div className="mb-6 border-b-2 border-[#0A1628] pb-4 text-center">
            <h1 className="text-2xl font-bold text-[#0A1628]">ANAPI</h1>
            <h2 className="text-xl font-semibold">
              {intl.formatMessage({ id: 'hr.employees.employeeCardTitle', defaultMessage: 'FICHE EMPLOYE' })}
            </h2>
            <p className="text-sm text-gray-500">
              {intl.formatMessage({ id: 'hr.employees.printDate', defaultMessage: 'Imprime le' })}:{' '}
              {new Date().toLocaleDateString(locale, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Photo and Main Info */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-44 w-44 items-center justify-center overflow-hidden rounded-lg border-4 border-[#0A1628] bg-gray-100 shadow-lg">
                {employee.photo ? (
                  <img
                    src={getPhotoUrl(employee.photo)}
                    alt={`${employee.prenom} ${employee.nom}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-[#0A1628]">
                    {employee.prenom?.[0]}
                    {employee.nom?.[0]}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {employee.prenom} {employee.postnom && `${employee.postnom} `}
                {employee.nom}
              </h3>
              <span className="mt-2 inline-block rounded-full bg-[#0A1628] px-3 py-1 text-sm font-semibold text-white">
                {employee.matricule}
              </span>
              <div className="mt-2 flex justify-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyles(employee.statut)}`}>
                  {employee.statut || intl.formatMessage({ id: 'common.undefined', defaultMessage: 'Non defini' })}
                </span>
                <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getContractStyles(employee.typeContrat)}`}>
                  {employee.typeContrat || intl.formatMessage({ id: 'common.undefined', defaultMessage: 'Non defini' })}
                </span>
              </div>
            </div>

            <div className="col-span-2 rounded-lg border border-gray-200 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-[#0A1628]">
                <Briefcase className="h-5 w-5" />
                {intl.formatMessage({ id: 'hr.employees.professionalInfo', defaultMessage: 'Informations Professionnelles' })}
              </h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.department', defaultMessage: 'Departement' })}</p>
                  <p className="font-medium">{employee.departement || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.position', defaultMessage: 'Poste' })}</p>
                  <p className="font-medium">{employee.poste || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.category', defaultMessage: 'Categorie' })}</p>
                  <p className="font-medium">{employee.categorie || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.grade', defaultMessage: 'Grade' })}</p>
                  <p className="font-medium">{employee.grade || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.hireDate', defaultMessage: "Date d'embauche" })}</p>
                  <p className="font-medium">{formatDate(employee.dateEmbauche)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.contractEndDate', defaultMessage: 'Date fin contrat' })}</p>
                  <p className="font-medium">{formatDate(employee.dateFinContrat)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.contractType', defaultMessage: 'Type contrat' })}</p>
                  <p className="font-medium">{employee.typeContrat || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.baseSalary', defaultMessage: 'Salaire de base' })}</p>
                  <p className="font-semibold text-green-600">{formatCurrency(employee.salaireBase)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.status', defaultMessage: 'Statut' })}</p>
                  <p className="font-medium">{employee.statut || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-[#0A1628]">
              <Users className="h-5 w-5" />
              {intl.formatMessage({ id: 'hr.employees.personalInfo', defaultMessage: 'Informations Personnelles' })}
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.gender', defaultMessage: 'Genre' })}</p>
                <p className="font-medium">
                  {employee.genre === 'M'
                    ? intl.formatMessage({ id: 'hr.employees.male', defaultMessage: 'Masculin' })
                    : employee.genre === 'F'
                      ? intl.formatMessage({ id: 'hr.employees.female', defaultMessage: 'Feminin' })
                      : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.birthDate', defaultMessage: 'Date de naissance' })}</p>
                <p className="font-medium">{formatDate(employee.dateNaissance)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.birthPlace', defaultMessage: 'Lieu de naissance' })}</p>
                <p className="font-medium">{employee.lieuNaissance || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.nationality', defaultMessage: 'Nationalite' })}</p>
                <p className="font-medium">{employee.nationalite || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.idNumber', defaultMessage: "N Carte d'identite" })}</p>
                <p className="font-medium">{employee.numeroIdentite || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.maritalStatus', defaultMessage: 'Etat civil' })}</p>
                <p className="font-medium">
                  {employee.etatCivil ? employee.etatCivil.charAt(0).toUpperCase() + employee.etatCivil.slice(1) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.childrenCount', defaultMessage: "Nombre d'enfants" })}</p>
                <p className="font-medium">{employee.nombreEnfants ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.spouseName', defaultMessage: 'Nom du conjoint' })}</p>
                <p className="font-medium">{employee.nomConjoint || '-'}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-[#0A1628]">
              <Phone className="h-5 w-5" />
              {intl.formatMessage({ id: 'hr.employees.contactInfo', defaultMessage: 'Coordonnees' })}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.email', defaultMessage: 'Email' })}</p>
                  <p className="font-medium">{employee.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.phone1', defaultMessage: 'Telephone 1' })}</p>
                  <p className="font-medium">{employee.telephone1 || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.phone2', defaultMessage: 'Telephone 2' })}</p>
                  <p className="font-medium">{employee.telephone2 || '-'}</p>
                </div>
              </div>
              <div className="col-span-3 flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.fullAddress', defaultMessage: 'Adresse complete' })}</p>
                  <p className="font-medium">
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
          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-[#0A1628]">
              <CreditCard className="h-5 w-5" />
              {intl.formatMessage({ id: 'hr.employees.bankInfo', defaultMessage: 'Informations Bancaires' })}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.bank', defaultMessage: 'Banque' })}</p>
                <p className="font-medium">{employee.banque || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.bankCode', defaultMessage: 'Code banque' })}</p>
                <p className="font-medium">{employee.numeroBanque || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.accountNumber', defaultMessage: 'Numero compte' })}</p>
                <p className="font-medium">{employee.numeroCompte || '-'}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-[#0A1628]">
              <AlertCircle className="h-5 w-5" />
              {intl.formatMessage({ id: 'hr.employees.emergencyContact', defaultMessage: "Contact d'urgence" })}
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.contactName', defaultMessage: 'Nom' })}</p>
                <p className="font-medium">{employee.nomUrgence || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.relationship', defaultMessage: 'Lien' })}</p>
                <p className="font-medium">{employee.lienUrgence || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{intl.formatMessage({ id: 'hr.employees.phone', defaultMessage: 'Telephone' })}</p>
                <p className="font-medium">{employee.telephoneUrgence || '-'}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t border-gray-200 pt-4 text-center">
            <p className="text-xs text-gray-500">
              {intl.formatMessage({ id: 'hr.employees.documentGenerated', defaultMessage: 'Document genere automatiquement par ANAPI' })}
            </p>
            <p className="text-xs text-gray-500">
              {intl.formatMessage({ id: 'hr.employees.confidentialNotice', defaultMessage: 'Ce document est strictement confidentiel et reserve a usage interne.' })}
            </p>
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
    setContextMenu({
      visible: true,
      x: rect.left - 100,
      y: rect.bottom + 5,
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
                      {employee.departement || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {employee.poste || '-'}
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
