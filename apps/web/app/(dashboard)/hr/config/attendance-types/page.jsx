'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Clock,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  getAttendanceTypes,
  createAttendanceType,
  updateAttendanceType,
  deleteAttendanceType,
} from '@/app/services/hr/attendanceTypeService';

// ANAPI Colors
const COLORS = {
  darkBlue: '#0A1628',
  gold: '#D4A853',
};

// Form Dialog Component
function AttendanceTypeFormDialog({ open, onClose, attendanceType, onSave }) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    affectePresence: true,
    estPaye: true,
    couleur: '#3b82f6',
    actif: true,
  });

  useEffect(() => {
    if (open) {
      if (attendanceType) {
        setFormData({
          code: attendanceType.code || '',
          nom: attendanceType.nom || '',
          description: attendanceType.description || '',
          affectePresence: attendanceType.affectePresence !== false,
          estPaye: attendanceType.estPaye !== false,
          couleur: attendanceType.couleur || '#3b82f6',
          actif: attendanceType.actif !== false,
        });
      } else {
        setFormData({
          code: '',
          nom: '',
          description: '',
          affectePresence: true,
          estPaye: true,
          couleur: '#3b82f6',
          actif: true,
        });
      }
    }
  }, [attendanceType, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (attendanceType) {
        await updateAttendanceType(attendanceType.id, formData);
      } else {
        await createAttendanceType(formData);
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.darkBlue }}>
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {attendanceType ? (
                <FormattedMessage id="hr.attendanceTypes.edit" defaultMessage="Modifier le Type" />
              ) : (
                <FormattedMessage id="hr.attendanceTypes.new" defaultMessage="Nouveau Type de Presence" />
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
                <FormattedMessage id="hr.attendanceTypes.code" defaultMessage="Code" /> *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={handleChange('code')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="PRES"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.attendanceTypes.color" defaultMessage="Couleur" />
              </label>
              <input
                type="color"
                value={formData.couleur}
                onChange={handleChange('couleur')}
                className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.attendanceTypes.name" defaultMessage="Nom" /> *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={handleChange('nom')}
              required
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Present"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.attendanceTypes.description" defaultMessage="Description" />
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="affectePresence"
                checked={formData.affectePresence}
                onChange={handleChange('affectePresence')}
                className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
              />
              <label htmlFor="affectePresence" className="text-sm text-gray-700 dark:text-gray-300">
                <FormattedMessage id="hr.attendanceTypes.affectsAttendance" defaultMessage="Compte comme presence" />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="estPaye"
                checked={formData.estPaye}
                onChange={handleChange('estPaye')}
                className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
              />
              <label htmlFor="estPaye" className="text-sm text-gray-700 dark:text-gray-300">
                <FormattedMessage id="hr.attendanceTypes.isPaid" defaultMessage="Jour paye" />
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
                <FormattedMessage id="hr.attendanceTypes.active" defaultMessage="Type actif" />
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
              {attendanceType ? (
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
export default function AttendanceTypesPage() {
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
      const response = await getAttendanceTypes(params);
      if (response.success) {
        setTypes(response.data || []);
        setTotal(response.pagination?.total || response.data?.length || 0);
      }
    } catch (error) {
      console.error('Erreur chargement types:', error);
      showNotification(intl.formatMessage({ id: 'hr.attendanceTypes.loadError', defaultMessage: 'Erreur lors du chargement' }), 'error');
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
    if (!confirm(intl.formatMessage({ id: 'hr.attendanceTypes.confirmDelete', defaultMessage: 'Etes-vous sur de vouloir supprimer ce type?' }))) return;
    try {
      await deleteAttendanceType(type.id);
      showNotification(intl.formatMessage({ id: 'hr.attendanceTypes.deleted', defaultMessage: 'Type supprime avec succes' }));
      fetchTypes();
    } catch (error) {
      showNotification(error.message || intl.formatMessage({ id: 'hr.attendanceTypes.deleteError', defaultMessage: 'Erreur lors de la suppression' }), 'error');
    }
  };

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
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: COLORS.darkBlue }}
          >
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              <FormattedMessage id="hr.attendanceTypes.title" defaultMessage="Types de Presence" />
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              <FormattedMessage id="hr.attendanceTypes.subtitle" defaultMessage="Configuration des types de pointage" />
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

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.attendanceTypes.search', defaultMessage: 'Rechercher...' })}
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

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : types.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            <FormattedMessage id="hr.attendanceTypes.empty" defaultMessage="Aucun type de presence configure" />
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((type) => (
            <div
              key={type.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${type.couleur || '#3b82f6'}20` }}
                  >
                    <Clock className="w-5 h-5" style={{ color: type.couleur || '#3b82f6' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{type.nom}</h3>
                    <p className="text-xs text-[#D4A853]">{type.code}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    type.actif
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type.actif ? intl.formatMessage({ id: 'common.active', defaultMessage: 'Actif' }) : intl.formatMessage({ id: 'common.inactive', defaultMessage: 'Inactif' })}
                </span>
              </div>

              {type.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {type.description}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {type.affectePresence ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    <FormattedMessage id="hr.attendanceTypes.countsAsPresent" defaultMessage="Presence" />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {type.estPaye ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    <FormattedMessage id="hr.attendanceTypes.paid" defaultMessage="Paye" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 pt-4 border-t border-gray-100 dark:border-gray-700">
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
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {types.length > 0 && (
        <div className="flex items-center justify-between">
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

      {/* Dialog */}
      <AttendanceTypeFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedType(null);
        }}
        attendanceType={selectedType}
        onSave={() => {
          fetchTypes();
          showNotification(
            selectedType
              ? intl.formatMessage({ id: 'hr.attendanceTypes.updated', defaultMessage: 'Type mis a jour' })
              : intl.formatMessage({ id: 'hr.attendanceTypes.created', defaultMessage: 'Type cree' })
          );
        }}
      />
    </div>
  );
}
