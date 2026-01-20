/**
 * Service API pour la gestion de la paie
 */
import http from '../../http-common';

const ENDPOINT = '/hr-payroll/payrolls';

// === CALCUL ET TRAITEMENT ===

/**
 * Calculer la paie d'un employe (preview)
 */
export const calculerPaieEmploye = async (data) => {
  const response = await http.post(`${ENDPOINT}/calculer`, data);
  return response.data;
};

/**
 * Traiter la paie mensuelle (en masse)
 */
export const traiterPaieMensuelle = async (data) => {
  const response = await http.post(`${ENDPOINT}/traiter-mensuel`, data);
  return response.data;
};

// === FICHES DE PAIE ===

/**
 * Lister les fiches de paie
 */
export const getPayrolls = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

/**
 * Obtenir une fiche de paie par ID
 */
export const getPayrollById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Supprimer une fiche de paie
 */
export const deletePayroll = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// === WORKFLOW ===

/**
 * Valider une fiche de paie
 */
export const validerPayroll = async (id) => {
  const response = await http.post(`${ENDPOINT}/${id}/valider`);
  return response.data;
};

/**
 * Valider plusieurs fiches en masse
 */
export const validerPayrollsEnMasse = async (payrollIds) => {
  const response = await http.post(`${ENDPOINT}/valider-masse`, { payrollIds });
  return response.data;
};

/**
 * Marquer une fiche comme payee
 */
export const payerPayroll = async (id, data = {}) => {
  const response = await http.post(`${ENDPOINT}/${id}/payer`, data);
  return response.data;
};

/**
 * Marquer plusieurs fiches comme payees
 */
export const payerPayrollsEnMasse = async (payrollIds, modePaiement = 'virement', referencePaiement = null) => {
  const response = await http.post(`${ENDPOINT}/payer-masse`, { payrollIds, modePaiement, referencePaiement });
  return response.data;
};

// === RECAPITULATIFS ===

/**
 * Obtenir le recapitulatif mensuel
 */
export const getRecapitulatifMensuel = async (annee, mois) => {
  const response = await http.get(`${ENDPOINT}/recap/${annee}/${mois}`);
  return response.data;
};

/**
 * Obtenir les mois disponibles pour traitement
 */
export const getMoisDisponibles = async () => {
  const response = await http.get(`${ENDPOINT}/mois-disponibles`);
  return response.data;
};

// === ARCHIVES ===

/**
 * Archiver un mois
 */
export const archiverMois = async (annee, mois) => {
  const response = await http.post(`${ENDPOINT}/archiver`, { annee, mois });
  return response.data;
};

/**
 * Lister les archives
 */
export const getArchives = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const response = await http.get(`${ENDPOINT}/archives${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

/**
 * Obtenir une archive par ID
 */
export const getArchiveById = async (id) => {
  const response = await http.get(`${ENDPOINT}/archives/${id}`);
  return response.data;
};

// === HELPERS ===

/**
 * Formater un montant en devise
 */
export const formatMontant = (montant, devise = 'USD', locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: devise,
    minimumFractionDigits: 2
  }).format(montant || 0);
};

/**
 * Obtenir le nom du mois
 */
export const getNomMois = (mois, locale = 'fr-FR') => {
  const date = new Date(2000, mois - 1, 1);
  return date.toLocaleString(locale, { month: 'long' });
};

/**
 * Formater la periode
 */
export const formatPeriode = (annee, mois, locale = 'fr-FR') => {
  return `${getNomMois(mois, locale).charAt(0).toUpperCase() + getNomMois(mois, locale).slice(1)} ${annee}`;
};

/**
 * Statut avec couleur
 */
export const getStatutConfig = (statut) => {
  const configs = {
    brouillon: { label: 'Brouillon', color: 'default' },
    calcule: { label: 'Calcule', color: 'info' },
    valide: { label: 'Valide', color: 'warning' },
    paye: { label: 'Paye', color: 'success' },
    archive: { label: 'Archive', color: 'secondary' }
  };
  return configs[statut] || { label: statut, color: 'default' };
};

export default {
  calculerPaieEmploye,
  traiterPaieMensuelle,
  getPayrolls,
  getPayrollById,
  deletePayroll,
  validerPayroll,
  validerPayrollsEnMasse,
  payerPayroll,
  payerPayrollsEnMasse,
  getRecapitulatifMensuel,
  getMoisDisponibles,
  archiverMois,
  getArchives,
  getArchiveById,
  formatMontant,
  getNomMois,
  formatPeriode,
  getStatutConfig
};
