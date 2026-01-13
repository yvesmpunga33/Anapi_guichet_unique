'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  RefreshCw,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
} from 'lucide-react';
import {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  generateGradeCode,
  initDefaultGrades,
} from '@/app/services/hr/gradeService';

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
function GradeFormDialog({ open, onClose, grade, onSave }) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    niveau: 1,
    salaireMin: '',
    salaireMax: '',
    devise: 'USD',
    indiceBase: 100,
    actif: true,
  });

  useEffect(() => {
    if (open) {
      if (grade) {
        setFormData({
          code: grade.code || '',
          nom: grade.nom || '',
          description: grade.description || '',
          niveau: grade.niveau || 1,
          salaireMin: grade.salaireMin || '',
          salaireMax: grade.salaireMax || '',
          devise: grade.devise || 'USD',
          indiceBase: grade.indiceBase || 100,
          actif: grade.actif !== false,
        });
      } else {
        handleGenerateCode();
      }
    }
  }, [grade, open]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const response = await generateGradeCode();
      if (response.success) {
        setFormData({
          code: response.data?.code || '',
          nom: '',
          description: '',
          niveau: 1,
          salaireMin: '',
          salaireMax: '',
          devise: 'USD',
          indiceBase: 100,
          actif: true,
        });
      }
    } catch (error) {
      console.error('Erreur generation code:', error);
      setFormData({
        code: '',
        nom: '',
        description: '',
        niveau: 1,
        salaireMin: '',
        salaireMax: '',
        devise: 'USD',
        indiceBase: 100,
        actif: true,
      });
    }
    setGenerating(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        niveau: parseInt(formData.niveau) || 1,
        salaireMin: formData.salaireMin ? parseFloat(formData.salaireMin) : null,
        salaireMax: formData.salaireMax ? parseFloat(formData.salaireMax) : null,
        indiceBase: parseInt(formData.indiceBase) || 100,
      };

      if (grade) {
        await updateGrade(grade.id, dataToSend);
      } else {
        await createGrade(dataToSend);
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {grade ? (
                <FormattedMessage id="hr.grades.edit" defaultMessage="Modifier le Grade" />
              ) : (
                <FormattedMessage id="hr.grades.new" defaultMessage="Nouveau Grade" />
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <FormattedMessage id="hr.grades.info" defaultMessage="Configuration du grade salarial" />
            </p>
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
                <FormattedMessage id="hr.grades.code" defaultMessage="Code" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.code}
                  onChange={handleChange('code')}
                  disabled={generating}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="G1"
                />
                {generating && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.grades.level" defaultMessage="Niveau" /> *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.niveau}
                onChange={handleChange('niveau')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.grades.name" defaultMessage="Nom du Grade" /> *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={handleChange('nom')}
              required
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Grade 1 - Debutant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.grades.description" defaultMessage="Description" />
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.grades.salaryMin" defaultMessage="Salaire Min" />
              </label>
              <input
                type="number"
                min="0"
                value={formData.salaireMin}
                onChange={handleChange('salaireMin')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.grades.salaryMax" defaultMessage="Salaire Max" />
              </label>
              <input
                type="number"
                min="0"
                value={formData.salaireMax}
                onChange={handleChange('salaireMax')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.grades.currency" defaultMessage="Devise" />
              </label>
              <select
                value={formData.devise}
                onChange={handleChange('devise')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="USD">USD</option>
                <option value="CDF">CDF</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.grades.baseIndex" defaultMessage="Indice de Base" />
            </label>
            <input
              type="number"
              min="0"
              value={formData.indiceBase}
              onChange={handleChange('indiceBase')}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="actif"
              checked={formData.actif}
              onChange={(e) => setFormData((prev) => ({ ...prev, actif: e.target.checked }))}
              className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
            />
            <label htmlFor="actif" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <FormattedMessage id="hr.grades.active" defaultMessage="Grade actif" />
            </label>
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
              disabled={loading || !formData.nom}
              className="flex-1 px-4 py-2.5 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: COLORS.gold }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {grade ? (
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
export default function GradesPage() {
  const intl = useIntl();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      };
      const response = await getGrades(params);
      if (response.success) {
        const sortedGrades = (response.data || []).sort((a, b) => (a.niveau || 0) - (b.niveau || 0));
        setGrades(sortedGrades);
        setTotal(response.pagination?.total || response.data?.length || 0);
      }
    } catch (error) {
      console.error('Erreur chargement grades:', error);
      showNotification(intl.formatMessage({ id: 'hr.grades.loadError', defaultMessage: 'Erreur lors du chargement des grades' }), 'error');
    }
    setLoading(false);
  }, [page, rowsPerPage, searchQuery, intl]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpenDialog = (grade = null) => {
    setSelectedGrade(grade);
    setDialogOpen(true);
  };

  const handleDelete = async (grade) => {
    if (!confirm(intl.formatMessage({ id: 'hr.grades.confirmDelete', defaultMessage: 'Etes-vous sur de vouloir supprimer ce grade?' }))) return;
    try {
      await deleteGrade(grade.id);
      showNotification(intl.formatMessage({ id: 'hr.grades.deleted', defaultMessage: 'Grade supprime avec succes' }));
      fetchGrades();
    } catch (error) {
      showNotification(error.message || intl.formatMessage({ id: 'hr.grades.deleteError', defaultMessage: 'Erreur lors de la suppression' }), 'error');
    }
  };

  const handleInitDefault = async () => {
    try {
      const response = await initDefaultGrades();
      if (response.success) {
        showNotification(response.message || intl.formatMessage({ id: 'hr.grades.initialized', defaultMessage: 'Grades initialises' }));
        fetchGrades();
      }
    } catch (error) {
      showNotification(intl.formatMessage({ id: 'hr.grades.initError', defaultMessage: 'Erreur initialisation' }), 'error');
    }
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const avgSalary = grades.length > 0
    ? grades.reduce((sum, g) => sum + (parseFloat(g.salaireMin) || 0), 0) / grades.length
    : 0;

  const stats = [
    {
      title: intl.formatMessage({ id: 'hr.grades.totalGrades', defaultMessage: 'Total Grades' }),
      value: total.toString(),
      icon: Award,
      gradient: 'bg-gradient-to-r from-amber-500 to-orange-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.grades.maxLevel', defaultMessage: 'Niveau Max' }),
      value: grades.length > 0 ? Math.max(...grades.map((g) => g.niveau || 0)).toString() : '0',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.grades.avgSalary', defaultMessage: 'Salaire Moyen' }),
      value: formatCurrency(avgSalary, 'USD'),
      icon: DollarSign,
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
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
            <FormattedMessage id="hr.grades.title" defaultMessage="Grades Salariaux" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <FormattedMessage id="hr.grades.subtitle" defaultMessage="Configuration des grades et echelons" />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleInitDefault}
            className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title={intl.formatMessage({ id: 'hr.grades.initDefault', defaultMessage: 'Initialiser grades par defaut' })}
          >
            <Download className="w-5 h-5" />
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
              placeholder={intl.formatMessage({ id: 'hr.grades.search', defaultMessage: 'Rechercher un grade...' })}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button onClick={fetchGrades} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Grades Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : grades.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            <FormattedMessage id="hr.grades.empty" defaultMessage="Aucun grade trouve" />
          </p>
          <button onClick={handleInitDefault} className="mt-2 text-[#D4A853] hover:underline">
            <FormattedMessage id="hr.grades.initDefault" defaultMessage="Initialiser les grades par defaut" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {grade.code || grade.niveau}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {grade.nom}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.grades.levelLabel', defaultMessage: 'Niveau' })} {grade.niveau}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Min:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(grade.salaireMin, grade.devise)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Max:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(grade.salaireMax, grade.devise)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4A853] to-amber-500 rounded-full"
                    style={{ width: `${((grade.niveau || 1) / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    grade.actif
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {grade.actif ? intl.formatMessage({ id: 'common.active', defaultMessage: 'Actif' }) : intl.formatMessage({ id: 'common.inactive', defaultMessage: 'Inactif' })}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenDialog(grade)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/30"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(grade)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {grades.length > 0 && (
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
      <GradeFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedGrade(null);
        }}
        grade={selectedGrade}
        onSave={() => {
          fetchGrades();
          showNotification(
            selectedGrade
              ? intl.formatMessage({ id: 'hr.grades.updated', defaultMessage: 'Grade mis a jour' })
              : intl.formatMessage({ id: 'hr.grades.created', defaultMessage: 'Grade cree' })
          );
        }}
      />
    </div>
  );
}
