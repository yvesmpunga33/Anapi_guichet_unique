'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Gift,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  Percent,
} from 'lucide-react';
import {
  getBonusTypes,
  createBonusType,
  updateBonusType,
  deleteBonusType,
} from '@/app/services/hr/bonusTypeService';

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
function BonusTypeFormDialog({ open, onClose, bonusType, onSave }) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    typeCalcul: 'FIXE',
    montantDefaut: '',
    tauxDefaut: '',
    estImposable: true,
    estRecurrent: false,
    frequence: 'MENSUEL',
    actif: true,
  });

  useEffect(() => {
    if (open) {
      if (bonusType) {
        setFormData({
          code: bonusType.code || '',
          nom: bonusType.nom || '',
          description: bonusType.description || '',
          typeCalcul: bonusType.typeCalcul || 'FIXE',
          montantDefaut: bonusType.montantDefaut || '',
          tauxDefaut: bonusType.tauxDefaut || '',
          estImposable: bonusType.estImposable !== false,
          estRecurrent: bonusType.estRecurrent === true,
          frequence: bonusType.frequence || 'MENSUEL',
          actif: bonusType.actif !== false,
        });
      } else {
        setFormData({
          code: '',
          nom: '',
          description: '',
          typeCalcul: 'FIXE',
          montantDefaut: '',
          tauxDefaut: '',
          estImposable: true,
          estRecurrent: false,
          frequence: 'MENSUEL',
          actif: true,
        });
      }
    }
  }, [bonusType, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        montantDefaut: formData.montantDefaut ? parseFloat(formData.montantDefaut) : null,
        tauxDefaut: formData.tauxDefaut ? parseFloat(formData.tauxDefaut) : null,
      };

      if (bonusType) {
        await updateBonusType(bonusType.id, dataToSend);
      } else {
        await createBonusType(dataToSend);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {bonusType ? (
                <FormattedMessage id="hr.bonusTypes.edit" defaultMessage="Modifier le Type de Prime" />
              ) : (
                <FormattedMessage id="hr.bonusTypes.new" defaultMessage="Nouveau Type de Prime" />
              )}
            </h2>
          </div>
          <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.bonusTypes.code" defaultMessage="Code" /> *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={handleChange('code')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="PRIME_ANC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.bonusTypes.calculationType" defaultMessage="Type de Calcul" />
              </label>
              <select
                value={formData.typeCalcul}
                onChange={handleChange('typeCalcul')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="FIXE">Montant Fixe</option>
                <option value="POURCENTAGE">Pourcentage du Salaire</option>
                <option value="FORMULE">Formule Personnalisee</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.bonusTypes.name" defaultMessage="Nom" /> *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={handleChange('nom')}
              required
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Prime d'anciennete"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.bonusTypes.description" defaultMessage="Description" />
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.typeCalcul === 'FIXE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FormattedMessage id="hr.bonusTypes.defaultAmount" defaultMessage="Montant par defaut" />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.montantDefaut}
                    onChange={handleChange('montantDefaut')}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
            {formData.typeCalcul === 'POURCENTAGE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FormattedMessage id="hr.bonusTypes.defaultRate" defaultMessage="Taux par defaut (%)" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tauxDefaut}
                    onChange={handleChange('tauxDefaut')}
                    className="w-full pr-8 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.bonusTypes.frequency" defaultMessage="Frequence" />
              </label>
              <select
                value={formData.frequence}
                onChange={handleChange('frequence')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="MENSUEL">Mensuel</option>
                <option value="TRIMESTRIEL">Trimestriel</option>
                <option value="ANNUEL">Annuel</option>
                <option value="PONCTUEL">Ponctuel</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="estImposable"
                checked={formData.estImposable}
                onChange={handleChange('estImposable')}
                className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
              />
              <label htmlFor="estImposable" className="text-sm text-gray-700 dark:text-gray-300">
                <FormattedMessage id="hr.bonusTypes.isTaxable" defaultMessage="Soumis a l'impot" />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="estRecurrent"
                checked={formData.estRecurrent}
                onChange={handleChange('estRecurrent')}
                className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
              />
              <label htmlFor="estRecurrent" className="text-sm text-gray-700 dark:text-gray-300">
                <FormattedMessage id="hr.bonusTypes.isRecurrent" defaultMessage="Prime recurrente (automatique)" />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="actif"
                checked={formData.actif}
                onChange={handleChange('actif')}
                className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
              />
              <label htmlFor="actif" className="text-sm text-gray-700 dark:text-gray-300">
                <FormattedMessage id="hr.bonusTypes.active" defaultMessage="Type actif" />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FormattedMessage id="common.cancel" defaultMessage="Annuler" />
            </button>
            <button
              type="submit"
              disabled={loading || !formData.nom || !formData.code}
              className="flex-1 px-4 py-2.5 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: COLORS.gold }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {bonusType ? (
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

// Main Page Component
export default function BonusTypesPage() {
  const intl = useIntl();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      };
      const response = await getBonusTypes(params);
      if (response.success) {
        setTypes(response.data || []);
        setTotal(response.pagination?.total || response.data?.length || 0);
      }
    } catch (error) {
      console.error('Erreur chargement types:', error);
      showNotification(intl.formatMessage({ id: 'hr.bonusTypes.loadError', defaultMessage: 'Erreur lors du chargement' }), 'error');
    }
    setLoading(false);
  }, [page, rowsPerPage, searchQuery, intl]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpenDialog = (type = null) => {
    setSelectedType(type);
    setDialogOpen(true);
  };

  const handleDelete = async (type) => {
    if (!confirm(intl.formatMessage({ id: 'hr.bonusTypes.confirmDelete', defaultMessage: 'Etes-vous sur de vouloir supprimer ce type?' }))) return;
    try {
      await deleteBonusType(type.id);
      showNotification(intl.formatMessage({ id: 'hr.bonusTypes.deleted', defaultMessage: 'Type supprime avec succes' }));
      fetchTypes();
    } catch (error) {
      showNotification(error.message || intl.formatMessage({ id: 'hr.bonusTypes.deleteError', defaultMessage: 'Erreur lors de la suppression' }), 'error');
    }
  };

  const typesTaxables = types.filter((t) => t.estImposable).length;
  const typesRecurrents = types.filter((t) => t.estRecurrent).length;

  const stats = [
    {
      title: intl.formatMessage({ id: 'hr.bonusTypes.totalTypes', defaultMessage: 'Types de Primes' }),
      value: total.toString(),
      icon: Gift,
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.bonusTypes.taxable', defaultMessage: 'Imposables' }),
      value: typesTaxables.toString(),
      icon: DollarSign,
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.bonusTypes.recurring', defaultMessage: 'Recurrents' }),
      value: typesRecurrents.toString(),
      icon: Percent,
      gradient: 'bg-gradient-to-r from-purple-500 to-violet-600',
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              <FormattedMessage id="hr.bonusTypes.title" defaultMessage="Types de Primes" />
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              <FormattedMessage id="hr.bonusTypes.subtitle" defaultMessage="Configuration des primes et bonus" />
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg shadow-sm transition-colors"
          style={{ backgroundColor: COLORS.gold }}
        >
          <Plus className="w-5 h-5" />
          <span><FormattedMessage id="common.add" defaultMessage="Ajouter" /></span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.bonusTypes.search', defaultMessage: 'Rechercher une prime...' })}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button onClick={fetchTypes} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : types.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Gift className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">
              <FormattedMessage id="hr.bonusTypes.empty" defaultMessage="Aucun type de prime configure" />
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.bonusTypes.type" defaultMessage="Type" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.bonusTypes.calculation" defaultMessage="Calcul" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.bonusTypes.value" defaultMessage="Valeur" />
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.bonusTypes.taxable" defaultMessage="Imposable" />
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.bonusTypes.status" defaultMessage="Statut" />
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="common.actions" defaultMessage="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {types.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{type.nom}</p>
                          <p className="text-sm text-[#D4A853]">{type.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {type.typeCalcul === 'FIXE' ? 'Fixe' : type.typeCalcul === 'POURCENTAGE' ? '%' : 'Formule'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {type.typeCalcul === 'FIXE' && type.montantDefaut
                        ? `$${parseFloat(type.montantDefaut).toLocaleString()}`
                        : type.typeCalcul === 'POURCENTAGE' && type.tauxDefaut
                        ? `${type.tauxDefaut}%`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${type.estImposable ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {type.estImposable ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${type.actif ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {type.actif ? intl.formatMessage({ id: 'common.active', defaultMessage: 'Actif' }) : intl.formatMessage({ id: 'common.inactive', defaultMessage: 'Inactif' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(type)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/30"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(type)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {types.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, total)} <FormattedMessage id="common.of" defaultMessage="sur" /> {total}
            </p>
            <div className="flex items-center gap-2">
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
        )}
      </div>

      {/* Dialog */}
      <BonusTypeFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedType(null);
        }}
        bonusType={selectedType}
        onSave={() => {
          fetchTypes();
          showNotification(
            selectedType
              ? intl.formatMessage({ id: 'hr.bonusTypes.updated', defaultMessage: 'Type mis a jour' })
              : intl.formatMessage({ id: 'hr.bonusTypes.created', defaultMessage: 'Type cree' })
          );
        }}
      />
    </div>
  );
}
