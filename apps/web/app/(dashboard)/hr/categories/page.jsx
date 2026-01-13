'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  RefreshCw,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
} from 'lucide-react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  generateCode,
} from '@/app/services/hr/categoryService';

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
function CategoryFormDialog({ open, onClose, category, onSave }) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    salaireBase: '',
    devise: 'USD',
    actif: true,
  });

  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          code: category.code || '',
          nom: category.nom || '',
          description: category.description || '',
          salaireBase: category.salaireBase || '',
          devise: category.devise || 'USD',
          actif: category.actif !== false,
        });
      } else {
        handleGenerateCode();
      }
    }
  }, [category, open]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const response = await generateCode();
      if (response.success) {
        setFormData({
          code: response.data?.code || '',
          nom: '',
          description: '',
          salaireBase: '',
          devise: 'USD',
          actif: true,
        });
      }
    } catch (error) {
      console.error('Erreur generation code:', error);
      setFormData({
        code: '',
        nom: '',
        description: '',
        salaireBase: '',
        devise: 'USD',
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
        salaireBase: formData.salaireBase ? parseFloat(formData.salaireBase) : null,
      };

      if (category) {
        await updateCategory(category.id, dataToSend);
      } else {
        await createCategory(dataToSend);
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
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {category ? (
                <FormattedMessage id="hr.categories.edit" defaultMessage="Modifier la Categorie" />
              ) : (
                <FormattedMessage id="hr.categories.new" defaultMessage="Nouvelle Categorie" />
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <FormattedMessage id="hr.categories.info" defaultMessage="Configuration de la categorie d'employe" />
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
                <FormattedMessage id="hr.categories.code" defaultMessage="Code" /> *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.code}
                  onChange={handleChange('code')}
                  required
                  disabled={generating}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="CAT001"
                />
                {generating && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.categories.name" defaultMessage="Nom" /> *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={handleChange('nom')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Cadre superieur"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.categories.description" defaultMessage="Description" />
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
                <FormattedMessage id="hr.categories.baseSalary" defaultMessage="Salaire de base" />
              </label>
              <input
                type="number"
                min="0"
                value={formData.salaireBase}
                onChange={handleChange('salaireBase')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.categories.currency" defaultMessage="Devise" />
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="actif"
              checked={formData.actif}
              onChange={(e) => setFormData((prev) => ({ ...prev, actif: e.target.checked }))}
              className="w-4 h-4 text-[#D4A853] border-gray-300 rounded focus:ring-[#D4A853]"
            />
            <label htmlFor="actif" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <FormattedMessage id="hr.categories.active" defaultMessage="Categorie active" />
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
              disabled={loading || !formData.nom || !formData.code}
              className="flex-1 px-4 py-2.5 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: COLORS.gold }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {category ? (
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
export default function CategoriesPage() {
  const intl = useIntl();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      };
      const response = await getCategories(params);
      if (response.success) {
        setCategories(response.data || []);
        setTotal(response.pagination?.total || response.data?.length || 0);
      }
    } catch (error) {
      console.error('Erreur chargement categories:', error);
      showNotification(intl.formatMessage({ id: 'hr.categories.loadError', defaultMessage: 'Erreur lors du chargement des categories' }), 'error');
    }
    setLoading(false);
  }, [page, rowsPerPage, searchQuery, intl]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (category) => {
    if (!confirm(intl.formatMessage({ id: 'hr.categories.confirmDelete', defaultMessage: 'Etes-vous sur de vouloir supprimer cette categorie?' }))) return;
    try {
      await deleteCategory(category.id);
      showNotification(intl.formatMessage({ id: 'hr.categories.deleted', defaultMessage: 'Categorie supprimee avec succes' }));
      fetchCategories();
    } catch (error) {
      showNotification(error.message || intl.formatMessage({ id: 'hr.categories.deleteError', defaultMessage: 'Erreur lors de la suppression' }), 'error');
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

  const totalEmployees = categories.reduce((sum, c) => sum + (c.nombreEmployes || 0), 0);
  const avgSalary = categories.length > 0
    ? categories.reduce((sum, c) => sum + (parseFloat(c.salaireBase) || 0), 0) / categories.length
    : 0;

  const stats = [
    {
      title: intl.formatMessage({ id: 'hr.categories.totalCategories', defaultMessage: 'Categories' }),
      value: total.toString(),
      icon: Layers,
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.categories.totalEmployees', defaultMessage: 'Employes total' }),
      value: totalEmployees.toString(),
      icon: Users,
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.categories.avgSalary', defaultMessage: 'Salaire moyen' }),
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
            <FormattedMessage id="hr.categories.title" defaultMessage="Categories de Travailleurs" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <FormattedMessage id="hr.categories.subtitle" defaultMessage="Classification des employes par categorie" />
          </p>
        </div>
        <div className="flex items-center gap-3">
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
              placeholder={intl.formatMessage({ id: 'hr.categories.search', defaultMessage: 'Rechercher une categorie...' })}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button onClick={fetchCategories} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
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
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Layers className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">
              <FormattedMessage id="hr.categories.empty" defaultMessage="Aucune categorie trouvee" />
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.categories.category" defaultMessage="Categorie" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.categories.description" defaultMessage="Description" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.categories.baseSalary" defaultMessage="Salaire de base" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.categories.employees" defaultMessage="Employes" />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="hr.categories.status" defaultMessage="Statut" />
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    <FormattedMessage id="common.actions" defaultMessage="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{cat.nom}</p>
                          <p className="text-sm text-[#D4A853]">{cat.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {cat.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(cat.salaireBase, cat.devise)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{cat.nombreEmployes || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          cat.actif
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {cat.actif ? intl.formatMessage({ id: 'common.active', defaultMessage: 'Active' }) : intl.formatMessage({ id: 'common.inactive', defaultMessage: 'Inactive' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(cat)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/30"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
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
        {categories.length > 0 && (
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
      <CategoryFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSave={() => {
          fetchCategories();
          showNotification(
            selectedCategory
              ? intl.formatMessage({ id: 'hr.categories.updated', defaultMessage: 'Categorie mise a jour' })
              : intl.formatMessage({ id: 'hr.categories.created', defaultMessage: 'Categorie creee' })
          );
        }}
      />
    </div>
  );
}
