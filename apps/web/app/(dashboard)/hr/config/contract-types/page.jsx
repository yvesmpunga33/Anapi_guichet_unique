'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  getContractTypes,
  createContractType,
  updateContractType,
  deleteContractType,
} from '@/app/services/hr/contractTypeService';

// ANAPI Colors
const COLORS = {
  darkBlue: '#0A1628',
  gold: '#D4A853',
};

// Stats Card Component
function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className={`${gradient} rounded-xl p-5 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-sm opacity-90">{title}</p>
        </div>
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}

// Form Dialog Component
function ContractTypeFormDialog({ open, onClose, contractType, onSave }) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    defaultDuration: '',
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      if (contractType) {
        setFormData({
          code: contractType.code || '',
          name: contractType.name || '',
          description: contractType.description || '',
          defaultDuration: contractType.defaultDuration || '',
          sortOrder: contractType.sortOrder || 0,
          isActive: contractType.isActive !== false,
        });
      } else {
        setFormData({
          code: '',
          name: '',
          description: '',
          defaultDuration: '',
          sortOrder: 0,
          isActive: true,
        });
      }
      setError('');
    }
  }, [open, contractType]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      setError(intl.formatMessage({ id: 'hr.contractTypes.error.required', defaultMessage: 'Le code et le nom sont requis' }));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        defaultDuration: formData.defaultDuration ? parseInt(formData.defaultDuration) : null,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };

      let response;
      if (contractType) {
        response = await updateContractType(contractType.id, dataToSend);
      } else {
        response = await createContractType(dataToSend);
      }

      if (response.success) {
        onSave();
        onClose();
      } else {
        setError(response.message || intl.formatMessage({ id: 'hr.contractTypes.error.generic', defaultMessage: 'Une erreur est survenue' }));
      }
    } catch (err) {
      setError(err.message || intl.formatMessage({ id: 'hr.contractTypes.error.generic', defaultMessage: 'Une erreur est survenue' }));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.darkBlue }}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {contractType ? (
                <FormattedMessage id="hr.contractTypes.edit" defaultMessage="Modifier le Type de Contrat" />
              ) : (
                <FormattedMessage id="hr.contractTypes.new" defaultMessage="Nouveau Type de Contrat" />
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <FormattedMessage id="hr.contractTypes.info" defaultMessage="Informations du type de contrat" />
            </p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.contractTypes.code" defaultMessage="Code" /> *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={handleChange('code')}
                disabled={!!contractType}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                placeholder="CDI"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.contractTypes.name" defaultMessage="Nom" /> *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Contrat a Duree Indeterminee"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.contractTypes.description" defaultMessage="Description" />
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.contractTypes.defaultDuration" defaultMessage="Duree par defaut (mois)" />
              </label>
              <input
                type="number"
                value={formData.defaultDuration}
                onChange={handleChange('defaultDuration')}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.contractTypes.sortOrder" defaultMessage="Ordre d'affichage" />
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={handleChange('sortOrder')}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange('isActive')}
              className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              <FormattedMessage id="hr.contractTypes.active" defaultMessage="Type de contrat actif" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <FormattedMessage id="common.cancel" defaultMessage="Annuler" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: COLORS.gold }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {contractType ? (
                <FormattedMessage id="common.update" defaultMessage="Mettre a jour" />
              ) : (
                <FormattedMessage id="common.create" defaultMessage="Creer" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirm Dialog
function DeleteConfirmDialog({ open, onClose, contractType, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteContractType(contractType.id);
      if (response.success) {
        onConfirm();
        onClose();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          <FormattedMessage id="hr.contractTypes.confirmDelete" defaultMessage="Confirmer la suppression" />
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          <FormattedMessage
            id="hr.contractTypes.deleteMessage"
            defaultMessage="Etes-vous sur de vouloir supprimer le type de contrat"
          />{' '}
          <strong>{contractType?.name}</strong> ?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FormattedMessage id="common.cancel" defaultMessage="Annuler" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <FormattedMessage id="common.delete" defaultMessage="Supprimer" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function ContractTypesPage() {
  const intl = useIntl();
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractType, setSelectedContractType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const loadContractTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getContractTypes({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
      });

      if (response.success) {
        setContractTypes(response.data?.contractTypes || []);
        setTotal(response.data?.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des types de contrat:', err);
      showNotification(intl.formatMessage({ id: 'hr.contractTypes.loadError', defaultMessage: 'Erreur lors du chargement des types de contrat' }), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, intl]);

  useEffect(() => {
    loadContractTypes();
  }, [loadContractTypes]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpenDialog = (contractType = null) => {
    setSelectedContractType(contractType);
    setDialogOpen(true);
  };

  const handleSave = () => {
    loadContractTypes();
    showNotification(
      selectedContractType
        ? intl.formatMessage({ id: 'hr.contractTypes.updated', defaultMessage: 'Type de contrat mis a jour' })
        : intl.formatMessage({ id: 'hr.contractTypes.created', defaultMessage: 'Type de contrat cree' })
    );
  };

  const handleDeleteConfirm = () => {
    loadContractTypes();
    showNotification(intl.formatMessage({ id: 'hr.contractTypes.deleted', defaultMessage: 'Type de contrat supprime' }));
  };

  const STATS_CONFIG = [
    {
      title: intl.formatMessage({ id: 'hr.contractTypes.total', defaultMessage: 'Total Types de Contrat' }),
      value: total.toString(),
      icon: FileText,
      gradient: 'bg-gradient-to-r from-pink-500 to-rose-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.contractTypes.active', defaultMessage: 'Types Actifs' }),
      value: contractTypes.filter(ct => ct.isActive).length.toString(),
      icon: FileText,
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.contractTypes.inactive', defaultMessage: 'Types Inactifs' }),
      value: contractTypes.filter(ct => !ct.isActive).length.toString(),
      icon: FileText,
      gradient: 'bg-gradient-to-r from-gray-500 to-slate-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ ...notification, show: false })} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <FormattedMessage id="hr.contractTypes.title" defaultMessage="Types de Contrat" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <FormattedMessage id="hr.contractTypes.subtitle" defaultMessage="Gestion des types de contrat de travail" />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
            <Download className="w-5 h-5" />
            <span><FormattedMessage id="common.export" defaultMessage="Exporter" /></span>
          </button>
          <button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg shadow-sm transition-colors"
            style={{ backgroundColor: COLORS.gold }}
          >
            <Plus className="w-5 h-5" />
            <span><FormattedMessage id="common.add" defaultMessage="Ajouter" /></span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS_CONFIG.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.contractTypes.search', defaultMessage: 'Rechercher un type de contrat...' })}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button onClick={loadContractTypes} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.contractTypes.code" defaultMessage="Code" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.contractTypes.name" defaultMessage="Nom" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.contractTypes.description" defaultMessage="Description" />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.contractTypes.defaultDuration" defaultMessage="Duree (mois)" />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.contractTypes.status" defaultMessage="Statut" />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="common.actions" defaultMessage="Actions" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : contractTypes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    <FormattedMessage id="hr.contractTypes.empty" defaultMessage="Aucun type de contrat trouve" />
                  </td>
                </tr>
              ) : (
                contractTypes.map((contractType) => (
                  <tr key={contractType.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#D4A853]">{contractType.code}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {contractType.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {contractType.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {contractType.defaultDuration ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {contractType.defaultDuration} mois
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        contractType.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {contractType.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenDialog(contractType)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContractType(contractType);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, total)}{' '}
            <FormattedMessage id="common.of" defaultMessage="sur" /> {total}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * rowsPerPage >= total}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ContractTypeFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedContractType(null);
        }}
        contractType={selectedContractType}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedContractType(null);
        }}
        contractType={selectedContractType}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
