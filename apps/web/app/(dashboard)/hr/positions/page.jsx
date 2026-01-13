'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Building2,
  RefreshCw,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
} from 'lucide-react';
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  generatePositionCode,
  initDefaultPositions,
} from '@/app/services/hr/positionService';
import { getDepartments } from '@/app/services/hr/departmentService';
import { getGrades } from '@/app/services/hr/gradeService';

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
function PositionFormDialog({ open, onClose, position, departments, grades, onSave }) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    departmentId: '',
    gradeMinId: '',
    description: '',
    salaireMin: '',
    salaireMax: '',
    niveauHierarchique: 5,
    effectifCible: 1,
    actif: true,
  });

  useEffect(() => {
    if (open) {
      if (position) {
        setFormData({
          code: position.code || '',
          nom: position.nom || '',
          departmentId: position.departmentId || '',
          gradeMinId: position.gradeMinId || '',
          description: position.description || '',
          salaireMin: position.salaireMin || '',
          salaireMax: position.salaireMax || '',
          niveauHierarchique: position.niveauHierarchique || 5,
          effectifCible: position.effectifCible || 1,
          actif: position.actif !== false,
        });
      } else {
        handleGenerateCode();
      }
    }
  }, [position, open]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const response = await generatePositionCode();
      if (response.success) {
        setFormData({
          code: response.data?.code || '',
          nom: '',
          departmentId: '',
          gradeMinId: '',
          description: '',
          salaireMin: '',
          salaireMax: '',
          niveauHierarchique: 5,
          effectifCible: 1,
          actif: true,
        });
      }
    } catch (error) {
      console.error('Erreur generation code:', error);
      setFormData({
        code: '',
        nom: '',
        departmentId: '',
        gradeMinId: '',
        description: '',
        salaireMin: '',
        salaireMax: '',
        niveauHierarchique: 5,
        effectifCible: 1,
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
        salaireMin: formData.salaireMin ? parseFloat(formData.salaireMin) : null,
        salaireMax: formData.salaireMax ? parseFloat(formData.salaireMax) : null,
        departmentId: formData.departmentId || null,
        gradeMinId: formData.gradeMinId || null,
        niveauHierarchique: parseInt(formData.niveauHierarchique) || 5,
        effectifCible: parseInt(formData.effectifCible) || 1,
      };

      if (position) {
        await updatePosition(position.id, dataToSend);
      } else {
        await createPosition(dataToSend);
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.darkBlue }}>
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {position ? (
                <FormattedMessage id="hr.positions.edit" defaultMessage="Modifier le Poste" />
              ) : (
                <FormattedMessage id="hr.positions.new" defaultMessage="Nouveau Poste" />
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <FormattedMessage id="hr.positions.info" defaultMessage="Informations du poste de travail" />
            </p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.code" defaultMessage="Code" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.code}
                  onChange={handleChange('code')}
                  disabled={generating}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="POS-XXX"
                />
                {generating && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.name" defaultMessage="Nom du Poste" /> *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={handleChange('nom')}
                required
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.department" defaultMessage="Departement" />
              </label>
              <select
                value={formData.departmentId}
                onChange={handleChange('departmentId')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">
                  {intl.formatMessage({ id: 'common.none', defaultMessage: 'Aucun' })}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.gradeMin" defaultMessage="Grade Minimum" />
              </label>
              <select
                value={formData.gradeMinId}
                onChange={handleChange('gradeMinId')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">
                  {intl.formatMessage({ id: 'common.none', defaultMessage: 'Aucun' })}
                </option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.code} - {grade.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FormattedMessage id="hr.positions.description" defaultMessage="Description" />
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
                <FormattedMessage id="hr.positions.salaryMin" defaultMessage="Salaire Minimum" />
              </label>
              <input
                type="number"
                value={formData.salaireMin}
                onChange={handleChange('salaireMin')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.salaryMax" defaultMessage="Salaire Maximum" />
              </label>
              <input
                type="number"
                value={formData.salaireMax}
                onChange={handleChange('salaireMax')}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.hierarchyLevel" defaultMessage="Niveau Hierarchique" />
              </label>
              <input
                type="number"
                value={formData.niveauHierarchique}
                onChange={handleChange('niveauHierarchique')}
                min={1}
                max={10}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FormattedMessage id="hr.positions.targetHeadcount" defaultMessage="Effectif Cible" />
              </label>
              <input
                type="number"
                value={formData.effectifCible}
                onChange={handleChange('effectifCible')}
                min={1}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
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
              <FormattedMessage id="hr.positions.active" defaultMessage="Poste actif" />
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
              {position ? (
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
export default function PositionsPage() {
  const intl = useIntl();
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        departmentId: filterDepartment,
      };
      const response = await getPositions(params);
      if (response.success) {
        setPositions(response.data || []);
        setTotal(response.pagination?.total || response.data?.length || 0);
      }
    } catch (error) {
      console.error('Erreur chargement positions:', error);
      showNotification(intl.formatMessage({ id: 'hr.positions.loadError', defaultMessage: 'Erreur lors du chargement des postes' }), 'error');
    }
    setLoading(false);
  }, [page, rowsPerPage, searchQuery, filterDepartment, intl]);

  const fetchDependencies = async () => {
    try {
      const [deptRes, gradeRes] = await Promise.all([
        getDepartments({ limit: 100 }),
        getGrades({ limit: 100 }),
      ]);
      if (deptRes.success) setDepartments(deptRes.data || []);
      if (gradeRes.success) setGrades(gradeRes.data || []);
    } catch (error) {
      console.error('Erreur chargement dependances:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpenDialog = (position = null) => {
    setSelectedPosition(position);
    setDialogOpen(true);
  };

  const handleDelete = async (position) => {
    if (!confirm(intl.formatMessage({ id: 'hr.positions.confirmDelete', defaultMessage: 'Etes-vous sur de vouloir supprimer ce poste?' }))) return;
    try {
      await deletePosition(position.id);
      showNotification(intl.formatMessage({ id: 'hr.positions.deleted', defaultMessage: 'Poste supprime avec succes' }));
      fetchPositions();
    } catch (error) {
      showNotification(error.message || intl.formatMessage({ id: 'hr.positions.deleteError', defaultMessage: 'Erreur lors de la suppression' }), 'error');
    }
  };

  const handleInitDefault = async () => {
    try {
      const response = await initDefaultPositions();
      if (response.success) {
        showNotification(response.message || intl.formatMessage({ id: 'hr.positions.initialized', defaultMessage: 'Postes initialises' }));
        fetchPositions();
      }
    } catch (error) {
      showNotification(intl.formatMessage({ id: 'hr.positions.initError', defaultMessage: 'Erreur initialisation' }), 'error');
    }
  };

  const totalEmployes = positions.reduce((acc, p) => acc + (p.nombreEmployes || 0), 0);

  const stats = [
    {
      title: intl.formatMessage({ id: 'hr.positions.totalPositions', defaultMessage: 'Total Postes' }),
      value: total.toString(),
      icon: Briefcase,
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.positions.departments', defaultMessage: 'Departements' }),
      value: departments.length.toString(),
      icon: Building2,
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      title: intl.formatMessage({ id: 'hr.positions.assignedEmployees', defaultMessage: 'Employes Assignes' }),
      value: totalEmployes.toString(),
      icon: Users,
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
            <FormattedMessage id="hr.positions.title" defaultMessage="Gestion des Postes" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <FormattedMessage id="hr.positions.subtitle" defaultMessage="Configuration des postes de travail" />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleInitDefault}
            className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title={intl.formatMessage({ id: 'hr.positions.initDefault', defaultMessage: 'Initialiser postes par defaut' })}
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

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={intl.formatMessage({ id: 'hr.positions.search', defaultMessage: 'Rechercher un poste...' })}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
                setPage(0);
              }}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[200px]"
            >
              <option value="">
                {intl.formatMessage({ id: 'hr.positions.allDepartments', defaultMessage: 'Tous les departements' })}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.nom}
                </option>
              ))}
            </select>
          </div>
          <button onClick={fetchPositions} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.code" defaultMessage="Code" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.name" defaultMessage="Nom" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.department" defaultMessage="Departement" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.gradeMin" defaultMessage="Grade Min." />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.employees" defaultMessage="Employes" />
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.salary" defaultMessage="Salaire" />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="hr.positions.status" defaultMessage="Statut" />
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FormattedMessage id="common.actions" defaultMessage="Actions" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p><FormattedMessage id="hr.positions.empty" defaultMessage="Aucun poste trouve" /></p>
                    <button onClick={handleInitDefault} className="mt-2 text-[#D4A853] hover:underline">
                      <FormattedMessage id="hr.positions.initDefault" defaultMessage="Initialiser les postes par defaut" />
                    </button>
                  </td>
                </tr>
              ) : (
                positions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#D4A853]">{position.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{position.nom}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{position.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      {position.department ? (
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: `${position.department.couleur || '#667eea'}20`,
                            color: position.department.couleur || '#667eea',
                          }}
                        >
                          {position.department.nom}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {position.gradeMin ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full border border-[#D4A853] text-[#D4A853] flex items-center gap-1 w-fit">
                          <Award className="w-3 h-3" />
                          {position.gradeMin.code}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${position.nombreEmployes > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {position.nombreEmployes || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {position.salaireMin || position.salaireMax ? (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          ${parseFloat(position.salaireMin || 0).toLocaleString()} - ${parseFloat(position.salaireMax || 0).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${position.actif ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {position.actif ? intl.formatMessage({ id: 'common.active', defaultMessage: 'Actif' }) : intl.formatMessage({ id: 'common.inactive', defaultMessage: 'Inactif' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenDialog(position)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(position)}
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
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, total)} <FormattedMessage id="common.of" defaultMessage="sur" /> {total}
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

      {/* Dialog */}
      <PositionFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition}
        departments={departments}
        grades={grades}
        onSave={() => {
          fetchPositions();
          showNotification(
            selectedPosition
              ? intl.formatMessage({ id: 'hr.positions.updated', defaultMessage: 'Poste mis a jour' })
              : intl.formatMessage({ id: 'hr.positions.created', defaultMessage: 'Poste cree' })
          );
        }}
      />
    </div>
  );
}
