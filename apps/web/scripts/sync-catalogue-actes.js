import { Sector, Ministry, ActeAdministratif, PieceRequise } from '../models/index.js';

async function syncCatalogueActes() {
  try {
    console.log('Synchronisation des tables du catalogue des actes administratifs...');

    // Synchroniser les modeles
    await Sector.sync({ alter: true });
    console.log('Table sectors synchronisee.');

    await Ministry.sync({ alter: true });
    console.log('Table ministries synchronisee.');

    await ActeAdministratif.sync({ alter: true });
    console.log('Table actes_administratifs synchronisee.');

    await PieceRequise.sync({ alter: true });
    console.log('Table pieces_requises synchronisee.');

    // Verifier si des donnees existent deja
    const sectorsCount = await Sector.count();
    const ministriesCount = await Ministry.count();
    const actesCount = await ActeAdministratif.count();

    if (sectorsCount > 0 && ministriesCount > 0 && actesCount > 0) {
      console.log('Les donnees existent deja. Pas de seed necessaire.');
      console.log(`- ${sectorsCount} secteurs`);
      console.log(`- ${ministriesCount} ministeres`);
      console.log(`- ${actesCount} actes administratifs`);
      process.exit(0);
    }

    // Creer les secteurs d'activite
    console.log('\nCreation des secteurs d\'activite...');
    const sectors = await Sector.bulkCreate([
      { code: 'AGRI', name: 'Agriculture et elevage', description: 'Agriculture, elevage, peche et foresterie' },
      { code: 'MINE', name: 'Mines et carrieres', description: 'Extraction miniere et exploitation de carrieres' },
      { code: 'INDUS', name: 'Industries', description: 'Industries manufacturieres et transformation' },
      { code: 'COMM', name: 'Commerce', description: 'Commerce de gros et de detail' },
      { code: 'SERV', name: 'Services', description: 'Services aux entreprises et aux particuliers' },
      { code: 'BTP', name: 'BTP', description: 'Batiment et travaux publics' },
      { code: 'TRANS', name: 'Transport et logistique', description: 'Transport terrestre, aerien, maritime et logistique' },
      { code: 'TELE', name: 'Telecommunications', description: 'Telecommunications et technologies de l\'information' },
      { code: 'TOUR', name: 'Tourisme et hotellerie', description: 'Tourisme, hotellerie et restauration' },
      { code: 'SANTE', name: 'Sante', description: 'Sante et services medicaux' },
      { code: 'EDUC', name: 'Education', description: 'Education et formation professionnelle' },
      { code: 'ENERG', name: 'Energie', description: 'Production et distribution d\'energie' },
    ]);
    console.log(`${sectors.length} secteurs crees.`);

    // Creer les ministeres
    console.log('\nCreation des ministeres...');
    const ministries = await Ministry.bulkCreate([
      { code: 'MIN-PLAN', name: 'Ministere du Plan', shortName: 'Plan', description: 'Ministere du Plan' },
      { code: 'MIN-FIN', name: 'Ministere des Finances', shortName: 'Finances', description: 'Ministere des Finances' },
      { code: 'MIN-COM', name: 'Ministere du Commerce Exterieur', shortName: 'Commerce', description: 'Ministere du Commerce Exterieur' },
      { code: 'MIN-IND', name: 'Ministere de l\'Industrie', shortName: 'Industrie', description: 'Ministere de l\'Industrie' },
      { code: 'MIN-MINE', name: 'Ministere des Mines', shortName: 'Mines', description: 'Ministere des Mines' },
      { code: 'MIN-AGRI', name: 'Ministere de l\'Agriculture', shortName: 'Agriculture', description: 'Ministere de l\'Agriculture' },
      { code: 'MIN-TRANS', name: 'Ministere des Transports', shortName: 'Transports', description: 'Ministere des Transports et Voies de Communication' },
      { code: 'MIN-ENERG', name: 'Ministere de l\'Energie', shortName: 'Energie', description: 'Ministere de l\'Energie et Ressources Hydrauliques' },
      { code: 'MIN-ENV', name: 'Ministere de l\'Environnement', shortName: 'Environnement', description: 'Ministere de l\'Environnement et Developpement Durable' },
      { code: 'MIN-INT', name: 'Ministere de l\'Interieur', shortName: 'Interieur', description: 'Ministere de l\'Interieur et Securite' },
      { code: 'MIN-JUST', name: 'Ministere de la Justice', shortName: 'Justice', description: 'Ministere de la Justice' },
      { code: 'ANAPI', name: 'ANAPI', shortName: 'ANAPI', description: 'Agence Nationale pour la Promotion des Investissements' },
    ]);
    console.log(`${ministries.length} ministeres crees.`);

    // Recuperer les IDs des ministeres et secteurs
    const anapiMinistry = ministries.find(m => m.code === 'ANAPI');
    const mineMinistry = ministries.find(m => m.code === 'MIN-MINE');
    const comMinistry = ministries.find(m => m.code === 'MIN-COM');
    const indMinistry = ministries.find(m => m.code === 'MIN-IND');
    const envMinistry = ministries.find(m => m.code === 'MIN-ENV');

    const mineSector = sectors.find(s => s.code === 'MINE');
    const indusSector = sectors.find(s => s.code === 'INDUS');
    const commSector = sectors.find(s => s.code === 'COMM');

    // Creer les actes administratifs
    console.log('\nCreation des actes administratifs...');

    // 1. Agrement au Code des Investissements
    const agrementCI = await ActeAdministratif.create({
      code: 'AGR-CI-001',
      name: 'Agrement au Code des Investissements',
      shortName: 'Agrement CI',
      description: 'Agrement permettant de beneficier des avantages fiscaux et douaniers prevus par le Code des Investissements de la RDC',
      category: 'AGREMENT',
      ministryId: anapiMinistry.id,
      legalBasis: 'Loi n° 004/2002 du 21 fevrier 2002 portant Code des Investissements',
      legalDelayDays: 30,
      warningDelayDays: 5,
      cost: 500,
      currency: 'USD',
      validityMonths: 60,
      isRenewable: true,
      renewalDelayDays: 90,
      workflowType: 'AGREMENT',
      instructions: 'Deposer le dossier complet au guichet unique de l\'ANAPI. Delai de traitement: 30 jours ouvrables.',
      prerequisites: 'Etre une entreprise legalement constituee en RDC. Projet d\'investissement minimum de 200.000 USD.',
      isActive: true,
    });

    await PieceRequise.bulkCreate([
      { acteId: agrementCI.id, name: 'Statuts notaries de l\'entreprise', category: 'JURIDIQUE', isRequired: true, orderIndex: 1 },
      { acteId: agrementCI.id, name: 'Registre de Commerce (RCCM)', category: 'JURIDIQUE', isRequired: true, orderIndex: 2 },
      { acteId: agrementCI.id, name: 'Numero d\'Identification Nationale (NIF)', category: 'FISCAL', isRequired: true, orderIndex: 3 },
      { acteId: agrementCI.id, name: 'Numero d\'Impot', category: 'FISCAL', isRequired: true, orderIndex: 4 },
      { acteId: agrementCI.id, name: 'Business Plan detaille', category: 'FINANCIER', isRequired: true, orderIndex: 5 },
      { acteId: agrementCI.id, name: 'Etude de faisabilite', category: 'TECHNIQUE', isRequired: true, orderIndex: 6 },
      { acteId: agrementCI.id, name: 'Preuve de financement', category: 'FINANCIER', isRequired: true, orderIndex: 7 },
      { acteId: agrementCI.id, name: 'Attestation de domiciliation bancaire', category: 'FINANCIER', isRequired: true, orderIndex: 8 },
      { acteId: agrementCI.id, name: 'CV des dirigeants', category: 'IDENTITE', isRequired: false, orderIndex: 9 },
      { acteId: agrementCI.id, name: 'Etude d\'impact environnemental', category: 'TECHNIQUE', isRequired: false, orderIndex: 10 },
    ]);

    // 2. Licence d'importation
    const licenceImport = await ActeAdministratif.create({
      code: 'LIC-IMP-001',
      name: 'Licence d\'importation',
      shortName: 'Licence Import',
      description: 'Licence autorisant l\'importation de marchandises en RDC',
      category: 'LICENCE',
      ministryId: comMinistry.id,
      sectorId: commSector.id,
      legalBasis: 'Ordonnance-Loi n° 10/002 du 20 aout 2010',
      legalDelayDays: 15,
      warningDelayDays: 3,
      cost: 200,
      currency: 'USD',
      validityMonths: 12,
      isRenewable: true,
      renewalDelayDays: 30,
      workflowType: 'DOSSIER',
      isActive: true,
    });

    await PieceRequise.bulkCreate([
      { acteId: licenceImport.id, name: 'Demande ecrite', category: 'AUTRE', isRequired: true, orderIndex: 1 },
      { acteId: licenceImport.id, name: 'RCCM', category: 'JURIDIQUE', isRequired: true, orderIndex: 2 },
      { acteId: licenceImport.id, name: 'NIF', category: 'FISCAL', isRequired: true, orderIndex: 3 },
      { acteId: licenceImport.id, name: 'Facture pro forma', category: 'FINANCIER', isRequired: true, orderIndex: 4 },
      { acteId: licenceImport.id, name: 'Attestation de conformite', category: 'TECHNIQUE', isRequired: false, orderIndex: 5 },
    ]);

    // 3. Permis d'exploitation miniere
    const permisMinier = await ActeAdministratif.create({
      code: 'PER-MIN-001',
      name: 'Permis d\'exploitation miniere',
      shortName: 'PE Minier',
      description: 'Permis autorisant l\'exploitation de substances minerales',
      category: 'PERMIS',
      ministryId: mineMinistry.id,
      sectorId: mineSector.id,
      legalBasis: 'Loi n° 007/2002 du 11 juillet 2002 portant Code Minier',
      legalDelayDays: 60,
      warningDelayDays: 10,
      cost: 5000,
      currency: 'USD',
      validityMonths: 300,
      isRenewable: true,
      renewalDelayDays: 180,
      workflowType: 'DOSSIER',
      isActive: true,
    });

    await PieceRequise.bulkCreate([
      { acteId: permisMinier.id, name: 'Demande adressee au Ministre des Mines', category: 'AUTRE', isRequired: true, orderIndex: 1 },
      { acteId: permisMinier.id, name: 'Permis de recherche (PR)', category: 'JURIDIQUE', isRequired: true, orderIndex: 2 },
      { acteId: permisMinier.id, name: 'Etude de faisabilite technique', category: 'TECHNIQUE', isRequired: true, orderIndex: 3 },
      { acteId: permisMinier.id, name: 'Plan de developpement', category: 'TECHNIQUE', isRequired: true, orderIndex: 4 },
      { acteId: permisMinier.id, name: 'Etude d\'impact environnemental et social (EIES)', category: 'TECHNIQUE', isRequired: true, orderIndex: 5 },
      { acteId: permisMinier.id, name: 'Plan de gestion environnementale et sociale (PGES)', category: 'TECHNIQUE', isRequired: true, orderIndex: 6 },
      { acteId: permisMinier.id, name: 'Garantie financiere de rehabilitation', category: 'FINANCIER', isRequired: true, orderIndex: 7 },
      { acteId: permisMinier.id, name: 'Statuts de la societe', category: 'JURIDIQUE', isRequired: true, orderIndex: 8 },
    ]);

    // 4. Autorisation d'exploitation industrielle
    const autorisationIndus = await ActeAdministratif.create({
      code: 'AUT-IND-001',
      name: 'Autorisation d\'exploitation industrielle',
      shortName: 'Autorisation Indus',
      description: 'Autorisation d\'exploiter une unite industrielle en RDC',
      category: 'AUTORISATION',
      ministryId: indMinistry.id,
      sectorId: indusSector.id,
      legalBasis: 'Decret n° 08/010 du 30 janvier 2008',
      legalDelayDays: 45,
      warningDelayDays: 7,
      cost: 1000,
      currency: 'USD',
      validityMonths: null, // Illimite
      isRenewable: false,
      workflowType: 'DOSSIER',
      isActive: true,
    });

    await PieceRequise.bulkCreate([
      { acteId: autorisationIndus.id, name: 'Demande ecrite', category: 'AUTRE', isRequired: true, orderIndex: 1 },
      { acteId: autorisationIndus.id, name: 'Statuts de l\'entreprise', category: 'JURIDIQUE', isRequired: true, orderIndex: 2 },
      { acteId: autorisationIndus.id, name: 'RCCM', category: 'JURIDIQUE', isRequired: true, orderIndex: 3 },
      { acteId: autorisationIndus.id, name: 'NIF et Numero d\'impot', category: 'FISCAL', isRequired: true, orderIndex: 4 },
      { acteId: autorisationIndus.id, name: 'Plan de localisation', category: 'TECHNIQUE', isRequired: true, orderIndex: 5 },
      { acteId: autorisationIndus.id, name: 'Certificat d\'urbanisme', category: 'TECHNIQUE', isRequired: true, orderIndex: 6 },
      { acteId: autorisationIndus.id, name: 'Permis d\'environnement', category: 'TECHNIQUE', isRequired: true, orderIndex: 7 },
    ]);

    // 5. Certificat d'origine
    const certificatOrigine = await ActeAdministratif.create({
      code: 'CER-ORI-001',
      name: 'Certificat d\'origine',
      shortName: 'Certificat Origine',
      description: 'Document attestant l\'origine des marchandises exportees',
      category: 'CERTIFICAT',
      ministryId: comMinistry.id,
      sectorId: commSector.id,
      legalDelayDays: 5,
      warningDelayDays: 1,
      cost: 50,
      currency: 'USD',
      validityMonths: 6,
      isRenewable: false,
      workflowType: 'DOSSIER',
      isActive: true,
    });

    await PieceRequise.bulkCreate([
      { acteId: certificatOrigine.id, name: 'Demande ecrite', category: 'AUTRE', isRequired: true, orderIndex: 1 },
      { acteId: certificatOrigine.id, name: 'Facture commerciale', category: 'FINANCIER', isRequired: true, orderIndex: 2 },
      { acteId: certificatOrigine.id, name: 'Liste de colisage', category: 'AUTRE', isRequired: true, orderIndex: 3 },
      { acteId: certificatOrigine.id, name: 'Declaration d\'exportation', category: 'AUTRE', isRequired: true, orderIndex: 4 },
    ]);

    // 6. Attestation de conformite environnementale
    const attestationEnv = await ActeAdministratif.create({
      code: 'ATT-ENV-001',
      name: 'Attestation de conformite environnementale',
      shortName: 'ACE',
      description: 'Attestation delivree apres verification de la conformite environnementale d\'une installation',
      category: 'ATTESTATION',
      ministryId: envMinistry.id,
      legalBasis: 'Loi n° 11/009 du 09 juillet 2011 portant principes fondamentaux relatifs a la protection de l\'environnement',
      legalDelayDays: 30,
      warningDelayDays: 5,
      cost: 300,
      currency: 'USD',
      validityMonths: 24,
      isRenewable: true,
      renewalDelayDays: 60,
      workflowType: 'DOSSIER',
      isActive: true,
    });

    await PieceRequise.bulkCreate([
      { acteId: attestationEnv.id, name: 'Demande ecrite', category: 'AUTRE', isRequired: true, orderIndex: 1 },
      { acteId: attestationEnv.id, name: 'EIES approuvee', category: 'TECHNIQUE', isRequired: true, orderIndex: 2 },
      { acteId: attestationEnv.id, name: 'Rapport de mise en oeuvre du PGES', category: 'TECHNIQUE', isRequired: true, orderIndex: 3 },
      { acteId: attestationEnv.id, name: 'Permis environnemental', category: 'TECHNIQUE', isRequired: true, orderIndex: 4 },
    ]);

    // Compter les resultats
    const totalActes = await ActeAdministratif.count();
    const totalPieces = await PieceRequise.count();

    console.log('\n=== Resume ===');
    console.log(`Secteurs crees: ${sectors.length}`);
    console.log(`Ministeres crees: ${ministries.length}`);
    console.log(`Actes administratifs crees: ${totalActes}`);
    console.log(`Pieces requises creees: ${totalPieces}`);
    console.log('\nSynchronisation terminee avec succes!');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

syncCatalogueActes();
