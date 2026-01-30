'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import {
  ArrowLeft,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Percent,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Loader2,
} from 'lucide-react';

import {
  getBonuses,
  createBonus,
  updateBonus,
  deleteBonus,
  toggleBonusStatus,
  generateReference,
  formatBonusAmount,
  formatBonusPeriod,
} from '@/app/services/hr/bonusService';
import { getCategories } from '@/app/services/hr/categoryService';

// Month names
const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
];

const getMonthName = (month) => MONTHS[(month - 1) % 12] || `Mois ${month}`;

// Type Badge Component
function TypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        type === 'fixe'
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      }`}
    >
      {type === 'fixe' ? <DollarSign className="h-3 w-3" /> : <Percent className="h-3 w-3" />}
      {type === 'fixe' ? 'Fixe' : '%'}
    </span>
  );
}

// Status Badge Component
function StatusBadge({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
      }`}
    >
      {active ? 'Actif' : 'Inactif'}
    </button>
  );
}

// Bonus Form Dialog Component
function BonusFormDialog({ open, onClose, bonus, onSave, categories, intl }) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    categoryId: '',
    nom: '',
    description: '',
    type: 'fixe',
    montant: '',
    frequence: 'unique',
    annee: currentYear,
    moisDebut: new Date().getMonth() + 1,
    moisFin: 12,
    motif: '',
  });
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    if (open) {
      if (bonus) {
        setFormData({
          categoryId: bonus.categoryId || '',
          nom: bonus.nom || '',
          description: bonus.description || '',
          type: bonus.type || 'fixe',
          montant: bonus.montant || '',
          frequence: bonus.frequence || 'unique',
          annee: bonus.annee || currentYear,
          moisDebut: bonus.moisDebut || 1,
          moisFin: bonus.moisFin || 12,
          motif: bonus.motif || '',
        });
        setReference(bonus.reference || '');
      } else {
        setFormData({
          categoryId: '',
          nom: '',
          description: '',
          type: 'fixe',
          montant: '',
          frequence: 'unique',
          annee: currentYear,
          moisDebut: new Date().getMonth() + 1,
          moisFin: 12,
          motif: '',
        });
        loadReference();
      }
    }
  }, [open, bonus]);

  const loadReference = async () => {
    try {
      const res = await generateReference(currentYear);
      if (res.success) {
        setReference(res.data.reference);
      }
    } catch (error) {
      console.error('Erreur generation reference:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      Swal.fire('Erreur', 'Veuillez selectionner une categorie', 'error');
      return;
    }
    if (!formData.nom) {
      Swal.fire('Erreur', 'Veuillez entrer le nom de la prime', 'error');
      return;
    }
    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      Swal.fire('Erreur', 'Veuillez entrer un montant valide', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        employeeId: null,
        montant: parseFloat(formData.montant),
        moisFin: formData.frequence === 'periode' ? formData.moisFin : null,
      };

      let response;
      if (bonus) {
        response = await updateBonus(bonus.id, dataToSend);
      } else {
        response = await createBonus(dataToSend);
      }

      if (response.success) {
        Swal.fire('Succes', bonus ? 'Prime mise a jour' : 'Prime creee avec succes', 'success');
        onSave();
        onClose();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Swal.fire('Erreur', error.message || 'Une erreur est survenue', 'error');
    } finally {
      setSaving(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0A1628] px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {bonus ? intl.formatMessage({ id: 'hr.bonuses.editBonus', defaultMessage: 'Modifier la prime' }) : intl.formatMessage({ id: 'hr.bonuses.newGeneralBonus', defaultMessage: 'Nouvelle Prime Generale' })}
              </h2>
              {reference && (
                <p className="text-sm text-white/70">Reference: {reference}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Category Selection */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.category', defaultMessage: 'Categorie' })} *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">{intl.formatMessage({ id: 'hr.bonuses.selectCategory', defaultMessage: 'Selectionner une categorie' })}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.code} - {cat.nom}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.bonuses.categoryHelp', defaultMessage: 'La prime sera appliquee a tous les employes de cette categorie' })}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.bonusName', defaultMessage: 'Nom de la prime' })} *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Ex: Prime de categorie"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.description', defaultMessage: 'Description' })}
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description optionnelle"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.type', defaultMessage: 'Type' })}
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="fixe"
                    checked={formData.type === 'fixe'}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="h-4 w-4 border-gray-300 text-[#D4A853] focus:ring-[#D4A853]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.bonuses.fixedAmount', defaultMessage: 'Montant Fixe' })}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="pourcentage"
                    checked={formData.type === 'pourcentage'}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="h-4 w-4 border-gray-300 text-[#D4A853] focus:ring-[#D4A853]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.bonuses.percentage', defaultMessage: 'Pourcentage' })}</span>
                </label>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.type === 'fixe' ? intl.formatMessage({ id: 'hr.bonuses.amountCDF', defaultMessage: 'Montant (CDF)' }) : intl.formatMessage({ id: 'hr.bonuses.percentageValue', defaultMessage: 'Pourcentage (%)' })} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => handleChange('montant', e.target.value)}
                  min="0"
                  step={formData.type === 'pourcentage' ? '0.1' : '1'}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {formData.type === 'fixe' ? 'CDF' : '%'}
                </span>
              </div>
            </div>

            {/* Frequency */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.frequency', defaultMessage: 'Frequence' })}
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="frequence"
                    value="unique"
                    checked={formData.frequence === 'unique'}
                    onChange={(e) => handleChange('frequence', e.target.value)}
                    className="h-4 w-4 border-gray-300 text-[#D4A853] focus:ring-[#D4A853]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.bonuses.unique', defaultMessage: 'Unique (1 mois)' })}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="frequence"
                    value="periode"
                    checked={formData.frequence === 'periode'}
                    onChange={(e) => handleChange('frequence', e.target.value)}
                    className="h-4 w-4 border-gray-300 text-[#D4A853] focus:ring-[#D4A853]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.bonuses.period', defaultMessage: 'Periode (plusieurs mois)' })}</span>
                </label>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.year', defaultMessage: 'Annee' })}
              </label>
              <select
                value={formData.annee}
                onChange={(e) => handleChange('annee', parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Start Month */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.startMonth', defaultMessage: 'Mois debut' })}
              </label>
              <select
                value={formData.moisDebut}
                onChange={(e) => handleChange('moisDebut', parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>

            {/* End Month */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.endMonth', defaultMessage: 'Mois fin' })}
              </label>
              <select
                value={formData.moisFin}
                onChange={(e) => handleChange('moisFin', parseInt(e.target.value, 10))}
                disabled={formData.frequence === 'unique'}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index + 1} disabled={index + 1 < formData.moisDebut}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.bonuses.reason', defaultMessage: 'Motif / Justification' })}
              </label>
              <textarea
                value={formData.motif}
                onChange={(e) => handleChange('motif', e.target.value)}
                rows={2}
                placeholder="Motif de la prime..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' })}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              {bonus ? intl.formatMessage({ id: 'common.update', defaultMessage: 'Mettre a jour' }) : intl.formatMessage({ id: 'hr.bonuses.createBonus', defaultMessage: 'Creer la prime' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GeneralBonusesPage() {
  const intl = useIntl();
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [bonuses, setBonuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bonusesRes, categoriesRes] = await Promise.all([
        getBonuses({
          page: page + 1,
          limit: rowsPerPage,
          search,
          annee: selectedYear,
        }),
        getCategories({ limit: 100, actif: true }),
      ]);

      if (bonusesRes.success) {
        const data = bonusesRes.data?.data || bonusesRes.data || [];
        const generalBonuses = data.filter((b) => b.categoryId && !b.employeeId);
        setBonuses(generalBonuses);
        setTotal(generalBonuses.length);
      }

      if (categoriesRes.success) {
        // Extract categories array safely
        const catsArray = categoriesRes.data?.categories || categoriesRes.data?.data || categoriesRes.data || [];
        setCategories(Array.isArray(catsArray) ? catsArray : []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenDialog = (bonus = null) => {
    setSelectedBonus(bonus);
    setDialogOpen(true);
  };

  const handleDelete = async (bonus) => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.bonuses.deleteConfirm', defaultMessage: 'Supprimer la prime?' }),
      text: `Voulez-vous vraiment supprimer la prime "${bonus.nom}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
      confirmButtonText: intl.formatMessage({ id: 'common.yesDelete', defaultMessage: 'Oui, supprimer' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteBonus(bonus.id);
        if (response.success) {
          Swal.fire(intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprimee!' }), 'La prime a ete supprimee.', 'success');
          loadData();
        }
      } catch (error) {
        Swal.fire('Erreur', error.message, 'error');
      }
    }
  };

  const handleToggleStatus = async (bonus) => {
    try {
      const response = await toggleBonusStatus(bonus.id);
      if (response.success) {
        loadData();
      }
    } catch (error) {
      Swal.fire('Erreur', error.message, 'error');
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/hr/bonuses')}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.bonuses.generalBonuses', defaultMessage: 'Primes Generales' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.bonuses.generalBonusesSubtitle', defaultMessage: "Primes par categorie d'employes" })}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700"
        >
          <Plus className="h-5 w-5" />
          {intl.formatMessage({ id: 'hr.bonuses.newBonus', defaultMessage: 'Nouvelle Prime' })}
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'common.search', defaultMessage: 'Rechercher...' })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.reference', defaultMessage: 'Reference' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.category', defaultMessage: 'Categorie' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.bonus', defaultMessage: 'Prime' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.type', defaultMessage: 'Type' })}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.amount', defaultMessage: 'Montant' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.period', defaultMessage: 'Periode' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.bonuses.status', defaultMessage: 'Statut' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A1628] border-t-transparent" />
                      <p className="mt-3 text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'common.loading', defaultMessage: 'Chargement...' })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : bonuses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.bonuses.noGeneralBonuses', defaultMessage: 'Aucune prime generale trouvee' })}
                    </p>
                  </td>
                </tr>
              ) : (
                bonuses.map((bonus) => (
                  <tr key={bonus.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{bonus.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white"
                          style={{ backgroundColor: bonus.category?.couleur || '#6b7280' }}
                        >
                          {bonus.category?.code?.[0] || 'C'}
                        </span>
                        <span className="text-gray-900 dark:text-white">{bonus.category?.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{bonus.nom}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <TypeBadge type={bonus.type} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
                      {formatBonusAmount(bonus)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {formatBonusPeriod(bonus, getMonthName)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge active={bonus.actif} onClick={() => handleToggleStatus(bonus)} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenDialog(bonus)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          title={intl.formatMessage({ id: 'common.edit', defaultMessage: 'Modifier' })}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bonus)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Supprimer' })}
                        >
                          <Trash2 className="h-4 w-4" />
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'common.rowsPerPage', defaultMessage: 'Lignes par page:' })}
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {[10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, total)} sur {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <BonusFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bonus={selectedBonus}
        onSave={loadData}
        categories={categories}
        intl={intl}
      />
    </div>
  );
}
