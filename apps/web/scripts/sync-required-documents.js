import { sequelize, RequiredDocument } from '../models/index.js';

async function syncRequiredDocuments() {
  try {
    console.log('Synchronisation de la table required_documents...');

    // Synchroniser le modèle avec la base de données
    await RequiredDocument.sync({ alter: true });
    console.log('Table required_documents synchronisée!');

    // Vérifier si des données existent déjà
    const count = await RequiredDocument.count();
    if (count > 0) {
      console.log(`${count} documents requis existent déjà. Aucune donnée de seed ajoutée.`);
      return;
    }

    // Données de seed pour les documents requis
    const requiredDocuments = [
      // AGREMENT_REGIME
      { code: 'RCCM', name: 'Registre de commerce (RCCM)', dossierType: 'AGREMENT_REGIME', isRequired: true, order: 1 },
      { code: 'ID_NAT', name: 'Identification nationale (ID NAT)', dossierType: 'AGREMENT_REGIME', isRequired: true, order: 2 },
      { code: 'NIF', name: 'Numero d\'Impot Fiscal (NIF)', dossierType: 'AGREMENT_REGIME', isRequired: true, order: 3 },
      { code: 'STATUTS', name: 'Statuts de la societe', dossierType: 'AGREMENT_REGIME', isRequired: true, order: 4 },
      { code: 'BUSINESS_PLAN', name: 'Plan d\'affaires', dossierType: 'AGREMENT_REGIME', isRequired: true, order: 5 },
      { code: 'PREUVE_FIN', name: 'Preuve de capacite financiere', dossierType: 'AGREMENT_REGIME', isRequired: true, order: 6 },

      // LICENCE_EXPLOITATION
      { code: 'RCCM', name: 'Registre de commerce (RCCM)', dossierType: 'LICENCE_EXPLOITATION', isRequired: true, order: 1 },
      { code: 'ID_NAT', name: 'Identification nationale (ID NAT)', dossierType: 'LICENCE_EXPLOITATION', isRequired: true, order: 2 },
      { code: 'NIF', name: 'Numero d\'Impot Fiscal (NIF)', dossierType: 'LICENCE_EXPLOITATION', isRequired: true, order: 3 },
      { code: 'BUSINESS_PLAN', name: 'Plan d\'affaires', dossierType: 'LICENCE_EXPLOITATION', isRequired: true, order: 4 },
      { code: 'PREUVE_FIN', name: 'Preuve de capacite financiere', dossierType: 'LICENCE_EXPLOITATION', isRequired: true, order: 5 },
      { code: 'AUTOR_SECT', name: 'Autorisation sectorielle', dossierType: 'LICENCE_EXPLOITATION', isRequired: false, order: 6 },

      // PERMIS_CONSTRUCTION
      { code: 'RCCM', name: 'Registre de commerce (RCCM)', dossierType: 'PERMIS_CONSTRUCTION', isRequired: true, order: 1 },
      { code: 'ID_NAT', name: 'Identification nationale (ID NAT)', dossierType: 'PERMIS_CONSTRUCTION', isRequired: true, order: 2 },
      { code: 'TITRE_FONC', name: 'Titre foncier ou contrat de bail', dossierType: 'PERMIS_CONSTRUCTION', isRequired: true, order: 3 },
      { code: 'PLANS_ARCH', name: 'Plans architecturaux', dossierType: 'PERMIS_CONSTRUCTION', isRequired: true, order: 4 },
      { code: 'ETUDE_IMPACT', name: 'Etude d\'impact environnemental', dossierType: 'PERMIS_CONSTRUCTION', isRequired: false, order: 5 },
      { code: 'AUTOR_URB', name: 'Autorisation d\'urbanisme', dossierType: 'PERMIS_CONSTRUCTION', isRequired: false, order: 6 },

      // AUTORISATION_ACTIVITE
      { code: 'RCCM', name: 'Registre de commerce (RCCM)', dossierType: 'AUTORISATION_ACTIVITE', isRequired: true, order: 1 },
      { code: 'ID_NAT', name: 'Identification nationale (ID NAT)', dossierType: 'AUTORISATION_ACTIVITE', isRequired: true, order: 2 },
      { code: 'BUSINESS_PLAN', name: 'Plan d\'affaires', dossierType: 'AUTORISATION_ACTIVITE', isRequired: true, order: 3 },
      { code: 'PREUVE_FIN', name: 'Preuve de capacite financiere', dossierType: 'AUTORISATION_ACTIVITE', isRequired: true, order: 4 },
      { code: 'CERT_CONF', name: 'Certificat de conformite', dossierType: 'AUTORISATION_ACTIVITE', isRequired: false, order: 5 },
      { code: 'AUTOR_SPEC', name: 'Autorisation specifique au secteur', dossierType: 'AUTORISATION_ACTIVITE', isRequired: false, order: 6 },

      // DECLARATION_INVESTISSEMENT
      { code: 'RCCM', name: 'Registre de commerce (RCCM)', dossierType: 'DECLARATION_INVESTISSEMENT', isRequired: true, order: 1 },
      { code: 'ID_NAT', name: 'Identification nationale (ID NAT)', dossierType: 'DECLARATION_INVESTISSEMENT', isRequired: true, order: 2 },
      { code: 'BUSINESS_PLAN', name: 'Plan d\'affaires', dossierType: 'DECLARATION_INVESTISSEMENT', isRequired: true, order: 3 },
      { code: 'FORM_DECL', name: 'Formulaire de declaration', dossierType: 'DECLARATION_INVESTISSEMENT', isRequired: true, order: 4 },

      // DEMANDE_TERRAIN
      { code: 'RCCM', name: 'Registre de commerce (RCCM)', dossierType: 'DEMANDE_TERRAIN', isRequired: true, order: 1 },
      { code: 'ID_NAT', name: 'Identification nationale (ID NAT)', dossierType: 'DEMANDE_TERRAIN', isRequired: true, order: 2 },
      { code: 'BUSINESS_PLAN', name: 'Plan d\'affaires', dossierType: 'DEMANDE_TERRAIN', isRequired: true, order: 3 },
      { code: 'PLAN_SITE', name: 'Plan du site demande', dossierType: 'DEMANDE_TERRAIN', isRequired: false, order: 4 },
      { code: 'ETUDE_IMPACT', name: 'Etude d\'impact environnemental', dossierType: 'DEMANDE_TERRAIN', isRequired: false, order: 5 },
    ];

    // Insérer les données
    await RequiredDocument.bulkCreate(requiredDocuments);
    console.log(`${requiredDocuments.length} documents requis insérés avec succès!`);

    // Afficher le résumé par type
    const types = [...new Set(requiredDocuments.map(d => d.dossierType))];
    for (const type of types) {
      const typeCount = requiredDocuments.filter(d => d.dossierType === type).length;
      console.log(`  - ${type}: ${typeCount} documents`);
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

syncRequiredDocuments();
