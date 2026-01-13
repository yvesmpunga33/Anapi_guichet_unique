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
  User,
  Users,
  DollarSign,
  Percent,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Loader2,
  Building2,
  Briefcase,
  MinusCircle,
} from 'lucide-react';

import {
  getDeductions,
  createDeduction,
  updateDeduction,
  deleteDeduction,
  toggleDeductionStatus,
  generateReference,
  formatDeductionAmount,
} from '@/app/services/hr/deductionService';
import { formatBonusPeriod } from '@/app/services/hr/bonusService';
import { getEmployees, getPhotoUrl } from '@/app/services/hr/employeeService';
import { getDeductionTypes } from '@/app/services/hr/deductionTypeService';

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

// Employee Select Dialog Component
function EmployeeSelectDialog({ open, onClose, employees, onSelect, intl }) {
  const [search, setSearch] = useState('');
  const [hoveredEmployee, setHoveredEmployee] = useState(null);

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = search.toLowerCase();
    const fullName = `${emp.prenom || ''} ${emp.nom || ''} ${emp.postNom || ''}`.toLowerCase();
    const matricule = (emp.matricule || '').toLowerCase();
    const departement = (emp.departement || emp.department || '').toLowerCase();
    const poste = (emp.poste || emp.position || '').toLowerCase();
    return fullName.includes(searchLower) || matricule.includes(searchLower) ||
           departement.includes(searchLower) || poste.includes(searchLower);
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] min-h-[70vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {intl.formatMessage({ id: 'hr.deductions.selectEmployee', defaultMessage: 'Selectionner un Employe' })}
              </h2>
              <p className="text-sm text-white/70">
                {employees.length} employes disponibles - {filteredEmployees.length} affiches
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
              {filteredEmployees.length} resultat{filteredEmployees.length > 1 ? 's' : ''}
            </span>
            <button onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'hr.deductions.searchEmployee', defaultMessage: 'Rechercher par nom, matricule, departement ou poste...' })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.deductions.noEmployeeFound', defaultMessage: 'Aucun employe trouve' })}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                {intl.formatMessage({ id: 'hr.deductions.tryDifferentSearch', defaultMessage: 'Essayez avec un autre terme de recherche' })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => {
                    onSelect(emp);
                    onClose();
                  }}
                  onMouseEnter={() => setHoveredEmployee(emp.id)}
                  onMouseLeave={() => setHoveredEmployee(null)}
                  className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                    hoveredEmployee === emp.id
                      ? 'border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-transparent bg-white shadow dark:bg-gray-700'
                  }`}
                >
                  {/* Employee Header */}
                  <div
                    className={`p-3 transition-colors ${
                      hoveredEmployee === emp.id
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
                        {emp.photo ? (
                          <img src={getPhotoUrl(emp.photo)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                            {emp.prenom?.[0]}{emp.nom?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-semibold text-white">
                          {emp.prenom} {emp.nom}
                        </p>
                        {emp.postNom && (
                          <p className="truncate text-sm text-white/80">{emp.postNom}</p>
                        )}
                        <span className="mt-1 inline-block rounded bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                          {emp.matricule}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="space-y-2 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30">
                        <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Departement</p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {emp.departement || emp.department || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-orange-100 dark:bg-orange-900/30">
                        <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Poste</p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {emp.poste || emp.position || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {emp.categorie || emp.category || 'N/A'}
                      </span>
                      {emp.salaireBase && (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {Number(emp.salaireBase).toLocaleString('fr-FR')} CDF
                        </span>
                      )}
                    </div>
                    <button
                      className={`mt-2 w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
                        hoveredEmployee === emp.id
                          ? 'bg-red-600 text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {hoveredEmployee === emp.id ? 'Selectionner' : 'Choisir'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {intl.formatMessage({ id: 'common.close', defaultMessage: 'Fermer' })}
          </button>
        </div>
      </div>
    </div>
  );
}

// Deduction Form Dialog Component
function DeductionFormDialog({ open, onClose, deduction, onSave, employees, deductionTypes, intl }) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    employeeId: '',
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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState('');
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (deduction) {
        setFormData({
          employeeId: deduction.employeeId || '',
          nom: deduction.nom || '',
          description: deduction.description || '',
          type: deduction.type || 'fixe',
          montant: deduction.montant || '',
          frequence: deduction.frequence || 'unique',
          annee: deduction.annee || currentYear,
          moisDebut: deduction.moisDebut || 1,
          moisFin: deduction.moisFin || 12,
          motif: deduction.motif || '',
        });
        setSelectedEmployee(deduction.employee || null);
        setReference(deduction.reference || '');
      } else {
        setFormData({
          employeeId: '',
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
        setSelectedEmployee(null);
        loadReference();
      }
    }
  }, [open, deduction]);

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
    // If changing deduction type, load associated values
    if (field === 'nom' && deductionTypes.length > 0) {
      const selectedDeductionType = deductionTypes.find((t) => t.nom === value);
      if (selectedDeductionType) {
        setFormData((prev) => ({
          ...prev,
          nom: value,
          type: selectedDeductionType.type || prev.type,
          montant: selectedDeductionType.montant || prev.montant,
          description: selectedDeductionType.description || prev.description,
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setFormData((prev) => ({ ...prev, employeeId: employee?.id || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId) {
      Swal.fire('Erreur', 'Veuillez selectionner un employe', 'error');
      return;
    }
    if (!formData.nom) {
      Swal.fire('Erreur', 'Veuillez entrer le nom de la reduction', 'error');
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
        montant: parseFloat(formData.montant),
        moisFin: formData.frequence === 'periode' ? formData.moisFin : null,
      };

      let response;
      if (deduction) {
        response = await updateDeduction(deduction.id, dataToSend);
      } else {
        response = await createDeduction(dataToSend);
      }

      if (response.success) {
        Swal.fire('Succes', deduction ? 'Reduction mise a jour' : 'Reduction creee avec succes', 'success');
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500">
              <MinusCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {deduction ? intl.formatMessage({ id: 'hr.deductions.editDeduction', defaultMessage: 'Modifier la reduction' }) : intl.formatMessage({ id: 'hr.deductions.newIndividualDeduction', defaultMessage: 'Nouvelle Reduction Individuelle' })}
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
            {/* Employee Selection */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.deductions.employee', defaultMessage: 'Employe' })} *
              </label>
              <div
                onClick={() => setEmployeeDialogOpen(true)}
                className="cursor-pointer rounded-xl border border-gray-200 p-4 transition-colors hover:border-[#D4A853] hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {selectedEmployee ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                      {selectedEmployee.photo ? (
                        <img src={getPhotoUrl(selectedEmployee.photo)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-medium">{selectedEmployee.prenom?.[0]}{selectedEmployee.nom?.[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedEmployee.prenom} {selectedEmployee.nom} {selectedEmployee.postNom || ''}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.matricule}</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                    >
                      {intl.formatMessage({ id: 'common.change', defaultMessage: 'Changer' })}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 dark:text-gray-400">
                        {intl.formatMessage({ id: 'hr.deductions.clickToSelect', defaultMessage: 'Cliquez pour selectionner un employe' })}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      {intl.formatMessage({ id: 'common.select', defaultMessage: 'Selectionner' })}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Deduction Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.deductions.deductionType', defaultMessage: 'Type de reduction' })} *
              </label>
              <select
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">{intl.formatMessage({ id: 'hr.deductions.selectDeductionType', defaultMessage: 'Selectionner un type' })}</option>
                {deductionTypes.map((type) => (
                  <option key={type.id} value={type.nom}>
                    {type.nom} {type.montant && `(${type.type === 'pourcentage' ? `${type.montant}%` : `${Number(type.montant).toLocaleString()} CDF`})`}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: 'hr.deductions.deductionTypeHelp', defaultMessage: 'Selectionner un type charge automatiquement le montant' })}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.deductions.description', defaultMessage: 'Description' })}
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
                {intl.formatMessage({ id: 'hr.deductions.type', defaultMessage: 'Type' })}
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
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.deductions.fixedAmount', defaultMessage: 'Montant Fixe' })}</span>
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
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.deductions.percentage', defaultMessage: 'Pourcentage' })}</span>
                </label>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.type === 'fixe' ? intl.formatMessage({ id: 'hr.deductions.amountCDF', defaultMessage: 'Montant (CDF)' }) : intl.formatMessage({ id: 'hr.deductions.percentageValue', defaultMessage: 'Pourcentage (%)' })} *
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
                {intl.formatMessage({ id: 'hr.deductions.frequency', defaultMessage: 'Frequence' })}
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
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.deductions.unique', defaultMessage: 'Unique (1 mois)' })}</span>
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
                  <span className="text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: 'hr.deductions.period', defaultMessage: 'Periode (plusieurs mois)' })}</span>
                </label>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {intl.formatMessage({ id: 'hr.deductions.year', defaultMessage: 'Annee' })}
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
                {intl.formatMessage({ id: 'hr.deductions.startMonth', defaultMessage: 'Mois debut' })}
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
                {intl.formatMessage({ id: 'hr.deductions.endMonth', defaultMessage: 'Mois fin' })}
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
                {intl.formatMessage({ id: 'hr.deductions.reason', defaultMessage: 'Motif / Justification' })}
              </label>
              <textarea
                value={formData.motif}
                onChange={(e) => handleChange('motif', e.target.value)}
                rows={2}
                placeholder="Motif de la reduction..."
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MinusCircle className="h-5 w-5" />
              )}
              {deduction ? intl.formatMessage({ id: 'common.update', defaultMessage: 'Mettre a jour' }) : intl.formatMessage({ id: 'hr.deductions.createDeduction', defaultMessage: 'Creer la reduction' })}
            </button>
          </div>
        </form>
      </div>

      {/* Employee Select Dialog */}
      <EmployeeSelectDialog
        open={employeeDialogOpen}
        onClose={() => setEmployeeDialogOpen(false)}
        employees={employees}
        onSelect={handleEmployeeSelect}
        intl={intl}
      />
    </div>
  );
}

export default function IndividualDeductionsPage() {
  const intl = useIntl();
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [deductions, setDeductions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [deductionTypesList, setDeductionTypesList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [deductionsRes, employeesRes, deductionTypesRes] = await Promise.all([
        getDeductions({
          page: page + 1,
          limit: rowsPerPage,
          search,
          annee: selectedYear,
          mois: selectedMonth || undefined,
        }),
        getEmployees({ limit: 500 }),
        getDeductionTypes({ actif: 'true', limit: 100 }),
      ]);

      if (deductionsRes.success) {
        const data = deductionsRes.data?.data || deductionsRes.data || [];
        const individualDeductions = data.filter((d) => d.employeeId);
        setDeductions(individualDeductions);
        setTotal(deductionsRes.data?.total || individualDeductions.length);
      }

      if (employeesRes.success) {
        const empData = Array.isArray(employeesRes.data) ? employeesRes.data : [];
        setEmployees(empData);
      }

      if (deductionTypesRes.success) {
        const typesData = Array.isArray(deductionTypesRes.data) ? deductionTypesRes.data : [];
        setDeductionTypesList(typesData);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, selectedYear, selectedMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenDialog = (deduction = null) => {
    setSelectedDeduction(deduction);
    setDialogOpen(true);
  };

  const handleDelete = async (deduction) => {
    const result = await Swal.fire({
      title: intl.formatMessage({ id: 'hr.deductions.deleteConfirm', defaultMessage: 'Supprimer la reduction?' }),
      text: `Voulez-vous vraiment supprimer "${deduction.nom}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonText: intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Annuler' }),
      confirmButtonText: intl.formatMessage({ id: 'common.yesDelete', defaultMessage: 'Oui, supprimer' }),
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteDeduction(deduction.id);
        if (response.success) {
          Swal.fire(intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Supprimee!' }), 'La reduction a ete supprimee.', 'success');
          loadData();
        }
      } catch (error) {
        Swal.fire('Erreur', error.message, 'error');
      }
    }
  };

  const handleToggleStatus = async (deduction) => {
    try {
      const response = await toggleDeductionStatus(deduction.id);
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
            onClick={() => router.push('/hr/deductions')}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intl.formatMessage({ id: 'hr.deductions.individualDeductions', defaultMessage: 'Reductions Individuelles' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {intl.formatMessage({ id: 'hr.deductions.individualDeductionsSubtitle', defaultMessage: 'Gestion des reductions par employe' })}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
        >
          <Plus className="h-5 w-5" />
          {intl.formatMessage({ id: 'hr.deductions.newDeduction', defaultMessage: 'Nouvelle Reduction' })}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-5 text-white shadow-lg">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold">{total}</h3>
              <p className="text-sm text-white/85">{intl.formatMessage({ id: 'hr.deductions.totalDeductions', defaultMessage: 'Total Reductions' })}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <User className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#D4A853] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{intl.formatMessage({ id: 'hr.deductions.allMonths', defaultMessage: 'Tous les mois' })}</option>
              {MONTHS.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
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
                  {intl.formatMessage({ id: 'hr.deductions.reference', defaultMessage: 'Reference' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.employee', defaultMessage: 'Employe' })}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.deduction', defaultMessage: 'Reduction' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.type', defaultMessage: 'Type' })}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.amount', defaultMessage: 'Montant' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.period', defaultMessage: 'Periode' })}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {intl.formatMessage({ id: 'hr.deductions.status', defaultMessage: 'Statut' })}
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
              ) : deductions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {intl.formatMessage({ id: 'hr.deductions.noIndividualDeductions', defaultMessage: 'Aucune reduction individuelle trouvee' })}
                    </p>
                  </td>
                </tr>
              ) : (
                deductions.map((deduction) => (
                  <tr key={deduction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{deduction.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0A1628] text-white">
                          {deduction.employee?.photo ? (
                            <img src={getPhotoUrl(deduction.employee.photo)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium">{deduction.employee?.prenom?.[0]}{deduction.employee?.nom?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {deduction.employee?.prenom} {deduction.employee?.nom}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{deduction.employee?.matricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{deduction.nom}</p>
                      {deduction.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{deduction.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <TypeBadge type={deduction.type} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-red-600 dark:text-red-400">
                      -{formatDeductionAmount(deduction)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">{formatBonusPeriod(deduction, getMonthName)}</p>
                        <span className="mt-1 inline-flex rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                          {deduction.frequence === 'unique' ? 'Unique' : 'Periode'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge active={deduction.actif} onClick={() => handleToggleStatus(deduction)} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenDialog(deduction)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          title={intl.formatMessage({ id: 'common.edit', defaultMessage: 'Modifier' })}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(deduction)}
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
      <DeductionFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        deduction={selectedDeduction}
        onSave={loadData}
        employees={employees}
        deductionTypes={deductionTypesList}
        intl={intl}
      />
    </div>
  );
}
