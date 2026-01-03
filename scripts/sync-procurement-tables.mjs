import {
  sequelize,
  ProcurementDocumentType,
  Tender,
  TenderLot,
  TenderDocument,
  TenderHistory,
  Bidder,
  BidderDocument,
  Bid,
  BidDocument,
  ProcurementContract,
  ContractExecution,
  ContractDocument,
  EvaluationCommittee,
} from '../apps/web/models/index.js';

async function syncProcurementTables() {
  console.log('Synchronisation des tables de passation de marches...\n');

  try {
    // Sync all procurement tables in order (base tables first, then dependent tables)
    // Use force: false to preserve data, alter: true to update schema

    // Phase 1: Tables independantes
    console.log('Phase 1: Tables independantes...');
    await ProcurementDocumentType.sync({ alter: true });
    console.log('  ✓ ProcurementDocumentType');

    // Phase 2: Tables avec foreign keys simples
    console.log('\nPhase 2: Tables principales...');

    // Creer Tender sans foreign keys problematiques d'abord
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_tenders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reference VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        objective TEXT,
        products_or_services TEXT,
        type VARCHAR(50) DEFAULT 'OPEN',
        category VARCHAR(50) DEFAULT 'GOODS',
        status VARCHAR(50) DEFAULT 'DRAFT',
        estimated_budget DECIMAL(18,2),
        currency VARCHAR(10) DEFAULT 'USD',
        minimum_budget DECIMAL(18,2),
        maximum_budget DECIMAL(18,2),
        publish_date TIMESTAMP,
        submission_deadline TIMESTAMP,
        opening_date TIMESTAMP,
        evaluation_start_date TIMESTAMP,
        evaluation_end_date TIMESTAMP,
        award_date TIMESTAMP,
        contract_start_date TIMESTAMP,
        contract_end_date TIMESTAMP,
        delivery_deadline INTEGER,
        delivery_unit VARCHAR(20) DEFAULT 'DAYS',
        delivery_location VARCHAR(500),
        technical_criteria_weight DECIMAL(5,2) DEFAULT 70.00,
        financial_criteria_weight DECIMAL(5,2) DEFAULT 30.00,
        minimum_technical_score DECIMAL(5,2) DEFAULT 70.00,
        eligibility_criteria TEXT,
        technical_criteria JSONB,
        financial_criteria JSONB,
        guarantee_required BOOLEAN DEFAULT false,
        guarantee_percentage DECIMAL(5,2),
        guarantee_type VARCHAR(100),
        ministry_id UUID,
        department_id UUID,
        created_by_id UUID,
        approved_by_id UUID,
        approval_date TIMESTAMP,
        approval_notes TEXT,
        cancellation_reason TEXT,
        cancelled_by_id UUID,
        cancellation_date TIMESTAMP,
        is_archived BOOLEAN DEFAULT false,
        archived_at TIMESTAMP,
        archived_by_id UUID,
        fiscal_year INTEGER,
        budget_line VARCHAR(100),
        funding_source VARCHAR(255),
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ Tender');

    // Creer Bidder
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_bidders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(50) UNIQUE NOT NULL,
        company_name VARCHAR(500) NOT NULL,
        trade_name VARCHAR(255),
        legal_form VARCHAR(100),
        rccm VARCHAR(100),
        idnat VARCHAR(100),
        nif VARCHAR(100),
        niss VARCHAR(100),
        capital_social DECIMAL(18,2),
        currency VARCHAR(10) DEFAULT 'USD',
        founding_date DATE,
        country_id UUID,
        province_id UUID,
        city_id UUID,
        address TEXT,
        postal_code VARCHAR(20),
        phone VARCHAR(50),
        phone2 VARCHAR(50),
        fax VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(255),
        contact_person VARCHAR(255),
        contact_title VARCHAR(100),
        contact_phone VARCHAR(50),
        contact_email VARCHAR(255),
        bank_name VARCHAR(255),
        bank_account_number VARCHAR(100),
        bank_swift_code VARCHAR(50),
        main_activity TEXT,
        sectors JSONB,
        employee_count INTEGER,
        annual_revenue DECIMAL(18,2),
        certifications JSONB,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        blacklist_reason TEXT,
        blacklist_start_date DATE,
        blacklist_end_date DATE,
        blacklisted_by_id UUID,
        rating DECIMAL(3,2),
        total_contracts_won INTEGER DEFAULT 0,
        total_contracts_value DECIMAL(18,2) DEFAULT 0,
        logo VARCHAR(500),
        notes TEXT,
        created_by_id UUID,
        verified_by_id UUID,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ Bidder');

    // Phase 3: Tables dependantes
    console.log('\nPhase 3: Tables dependantes...');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_tender_lots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tender_id UUID REFERENCES procurement_tenders(id) ON DELETE CASCADE,
        lot_number INTEGER NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        specifications TEXT,
        quantity DECIMAL(18,2),
        unit VARCHAR(50),
        estimated_value DECIMAL(18,2),
        awarded_value DECIMAL(18,2),
        status VARCHAR(50) DEFAULT 'OPEN',
        awarded_bidder_id UUID REFERENCES procurement_bidders(id),
        award_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ TenderLot');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_tender_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tender_id UUID REFERENCES procurement_tenders(id) ON DELETE CASCADE,
        document_type_id UUID REFERENCES procurement_document_types(id),
        title VARCHAR(500) NOT NULL,
        description TEXT,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        filepath VARCHAR(500) NOT NULL,
        filetype VARCHAR(100),
        filesize INTEGER,
        is_public BOOLEAN DEFAULT true,
        version INTEGER DEFAULT 1,
        uploaded_by_id UUID,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ TenderDocument');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_tender_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tender_id UUID REFERENCES procurement_tenders(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        previous_status VARCHAR(50),
        new_status VARCHAR(50),
        description TEXT,
        metadata JSONB,
        performed_by_id UUID,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ TenderHistory');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_evaluation_committees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tender_id UUID REFERENCES procurement_tenders(id) ON DELETE CASCADE,
        user_id UUID NOT NULL,
        role VARCHAR(50) DEFAULT 'MEMBER',
        specialization VARCHAR(255),
        can_evaluate_technical BOOLEAN DEFAULT true,
        can_evaluate_financial BOOLEAN DEFAULT true,
        has_voting_right BOOLEAN DEFAULT true,
        nominated_by_id UUID,
        nomination_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        recused_reason TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ EvaluationCommittee');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_bidder_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bidder_id UUID REFERENCES procurement_bidders(id) ON DELETE CASCADE,
        document_type_id UUID REFERENCES procurement_document_types(id),
        title VARCHAR(500) NOT NULL,
        description TEXT,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        filepath VARCHAR(500) NOT NULL,
        filetype VARCHAR(100),
        filesize INTEGER,
        expiry_date DATE,
        is_verified BOOLEAN DEFAULT false,
        verified_by_id UUID,
        verified_at TIMESTAMP,
        uploaded_by_id UUID,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ BidderDocument');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_bids (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tender_id UUID REFERENCES procurement_tenders(id) ON DELETE CASCADE,
        bidder_id UUID REFERENCES procurement_bidders(id),
        lot_id UUID REFERENCES procurement_tender_lots(id),
        reference VARCHAR(100) UNIQUE NOT NULL,
        submission_date TIMESTAMP DEFAULT NOW(),
        financial_offer DECIMAL(18,2),
        currency VARCHAR(10) DEFAULT 'USD',
        technical_proposal TEXT,
        delivery_time INTEGER,
        delivery_unit VARCHAR(20) DEFAULT 'DAYS',
        validity_period INTEGER,
        guarantee_provided BOOLEAN DEFAULT false,
        guarantee_amount DECIMAL(18,2),
        guarantee_reference VARCHAR(255),
        guarantee_expiry_date DATE,
        status VARCHAR(50) DEFAULT 'RECEIVED',
        administrative_score DECIMAL(5,2),
        administrative_status VARCHAR(50) DEFAULT 'PENDING',
        administrative_notes TEXT,
        technical_score DECIMAL(5,2),
        technical_details JSONB,
        technical_notes TEXT,
        financial_score DECIMAL(5,2),
        financial_details JSONB,
        financial_notes TEXT,
        total_score DECIMAL(5,2),
        ranking INTEGER,
        rejection_reason TEXT,
        disqualification_reason TEXT,
        evaluated_by_id UUID,
        evaluation_date TIMESTAMP,
        received_by_id UUID,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ Bid');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_bid_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bid_id UUID REFERENCES procurement_bids(id) ON DELETE CASCADE,
        document_type_id UUID REFERENCES procurement_document_types(id),
        category VARCHAR(50) DEFAULT 'ADMINISTRATIVE',
        title VARCHAR(500) NOT NULL,
        description TEXT,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        filepath VARCHAR(500) NOT NULL,
        filetype VARCHAR(100),
        filesize INTEGER,
        is_compliant BOOLEAN,
        compliance_notes TEXT,
        checked_by_id UUID,
        checked_at TIMESTAMP,
        uploaded_by_id UUID,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ BidDocument');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tender_id UUID REFERENCES procurement_tenders(id),
        bid_id UUID REFERENCES procurement_bids(id),
        bidder_id UUID REFERENCES procurement_bidders(id),
        lot_id UUID REFERENCES procurement_tender_lots(id),
        contract_number VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        contract_value DECIMAL(18,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        signature_date DATE,
        effective_date DATE,
        start_date DATE,
        end_date DATE,
        delivery_deadline DATE,
        delivery_location VARCHAR(500),
        status VARCHAR(50) DEFAULT 'DRAFT',
        performance_guarantee DECIMAL(18,2),
        guarantee_reference VARCHAR(255),
        guarantee_expiry_date DATE,
        advance_payment DECIMAL(18,2),
        advance_payment_date DATE,
        retention_percentage DECIMAL(5,2),
        payment_terms TEXT,
        penalty_clause TEXT,
        penalty_percentage_per_day DECIMAL(5,2),
        max_penalty_percentage DECIMAL(5,2),
        total_penalty_applied DECIMAL(18,2) DEFAULT 0,
        progress_percent DECIMAL(5,2) DEFAULT 0,
        total_paid DECIMAL(18,2) DEFAULT 0,
        remaining_amount DECIMAL(18,2),
        completion_date DATE,
        reception_date DATE,
        final_reception_date DATE,
        termination_reason TEXT,
        termination_date DATE,
        ministry_id UUID,
        managed_by_id UUID,
        signed_by_client_id UUID,
        signed_by_contractor_name VARCHAR(255),
        signed_by_contractor_title VARCHAR(255),
        created_by_id UUID,
        is_archived BOOLEAN DEFAULT false,
        archived_at TIMESTAMP,
        certificate_number VARCHAR(100) UNIQUE,
        certificate_issued_at TIMESTAMP,
        certificate_issued_by_id UUID,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ ProcurementContract');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_contract_executions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contract_id UUID REFERENCES procurement_contracts(id) ON DELETE CASCADE,
        phase VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) DEFAULT 'MILESTONE',
        planned_date DATE,
        actual_date DATE,
        status VARCHAR(50) DEFAULT 'PLANNED',
        progress_percent DECIMAL(5,2),
        quantity_planned DECIMAL(18,2),
        quantity_delivered DECIMAL(18,2),
        unit VARCHAR(50),
        amount_planned DECIMAL(18,2),
        amount_paid DECIMAL(18,2),
        currency VARCHAR(10) DEFAULT 'USD',
        payment_date DATE,
        payment_reference VARCHAR(255),
        invoice_number VARCHAR(100),
        invoice_date DATE,
        penalty_amount DECIMAL(18,2),
        penalty_reason TEXT,
        delay_days INTEGER,
        quality_score DECIMAL(5,2),
        quality_notes TEXT,
        inspection_report TEXT,
        inspected_by_id UUID,
        inspection_date DATE,
        approved_by_id UUID,
        approval_date DATE,
        created_by_id UUID,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ ContractExecution');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS procurement_contract_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contract_id UUID REFERENCES procurement_contracts(id) ON DELETE CASCADE,
        execution_id UUID REFERENCES procurement_contract_executions(id),
        document_type_id UUID REFERENCES procurement_document_types(id),
        category VARCHAR(50) DEFAULT 'CONTRACT',
        title VARCHAR(500) NOT NULL,
        description TEXT,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        filepath VARCHAR(500) NOT NULL,
        filetype VARCHAR(100),
        filesize INTEGER,
        version INTEGER DEFAULT 1,
        is_signed BOOLEAN DEFAULT false,
        signed_at TIMESTAMP,
        uploaded_by_id UUID,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✓ ContractDocument');

    // Add default document types
    console.log('\nAjout des types de documents par defaut...\n');

    const defaultDocTypes = [
      { code: 'DAO', name: 'Dossier d\'Appel d\'Offres', category: 'TENDER', isRequired: true, sortOrder: 1 },
      { code: 'CAHIER_CHARGES', name: 'Cahier des Charges', category: 'TENDER', isRequired: true, sortOrder: 2 },
      { code: 'SPECS_TECH', name: 'Specifications Techniques', category: 'TENDER', isRequired: false, sortOrder: 3 },
      { code: 'ADDITIF', name: 'Additif / Rectificatif', category: 'TENDER', isRequired: false, sortOrder: 4 },
      { code: 'PV_OUVERTURE', name: 'Proces-verbal d\'ouverture des plis', category: 'TENDER', isRequired: false, sortOrder: 5 },
      { code: 'RAPPORT_EVAL', name: 'Rapport d\'evaluation', category: 'TENDER', isRequired: false, sortOrder: 6 },
      { code: 'LETTRE_SOUMISSION', name: 'Lettre de Soumission', category: 'BID', isRequired: true, sortOrder: 10 },
      { code: 'OFFRE_TECH', name: 'Offre Technique', category: 'BID', isRequired: true, sortOrder: 11 },
      { code: 'OFFRE_FIN', name: 'Offre Financiere', category: 'BID', isRequired: true, sortOrder: 12 },
      { code: 'CAUTION_SOUMISSION', name: 'Caution de Soumission', category: 'BID', isRequired: false, sortOrder: 13 },
      { code: 'RCCM', name: 'Registre de Commerce (RCCM)', category: 'BID', isRequired: true, sortOrder: 14 },
      { code: 'NIF', name: 'Numero d\'Impot Fiscal (NIF)', category: 'BID', isRequired: true, sortOrder: 15 },
      { code: 'IDNAT', name: 'Identification Nationale (IDNAT)', category: 'BID', isRequired: true, sortOrder: 16 },
      { code: 'ATTESTATION_FISC', name: 'Attestation Fiscale', category: 'BID', isRequired: true, sortOrder: 17 },
      { code: 'ATTESTATION_CNSS', name: 'Attestation CNSS/INSS', category: 'BID', isRequired: false, sortOrder: 18 },
      { code: 'BILANS', name: 'Bilans Financiers', category: 'BID', isRequired: false, sortOrder: 19 },
      { code: 'REFERENCES', name: 'References / Attestations de bonne execution', category: 'BID', isRequired: false, sortOrder: 20 },
      { code: 'CONTRAT', name: 'Contrat Signe', category: 'CONTRACT', isRequired: true, sortOrder: 30 },
      { code: 'CAUTION_BONNE_EXEC', name: 'Caution de Bonne Execution', category: 'CONTRACT', isRequired: false, sortOrder: 31 },
      { code: 'AVENANT', name: 'Avenant au Contrat', category: 'CONTRACT', isRequired: false, sortOrder: 32 },
      { code: 'ORDRE_SERVICE', name: 'Ordre de Service', category: 'CONTRACT', isRequired: false, sortOrder: 33 },
      { code: 'BON_LIVRAISON', name: 'Bon de Livraison', category: 'EXECUTION', isRequired: false, sortOrder: 40 },
      { code: 'PV_RECEPTION', name: 'Proces-verbal de Reception', category: 'EXECUTION', isRequired: false, sortOrder: 41 },
      { code: 'FACTURE', name: 'Facture', category: 'EXECUTION', isRequired: false, sortOrder: 42 },
      { code: 'RAPPORT_SUIVI', name: 'Rapport de Suivi', category: 'EXECUTION', isRequired: false, sortOrder: 43 },
      { code: 'CERTIFICAT', name: 'Certificat de Passation de Marche', category: 'EXECUTION', isRequired: false, sortOrder: 44 },
    ];

    for (const docType of defaultDocTypes) {
      try {
        const [instance, created] = await ProcurementDocumentType.findOrCreate({
          where: { code: docType.code },
          defaults: docType,
        });
        if (created) console.log(`  ✓ ${docType.code}: cree`);
      } catch (error) {
        // Ignore duplicates
      }
    }

    console.log('\n✓ Synchronisation terminee avec succes!');
    process.exit(0);

  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    process.exit(1);
  }
}

syncProcurementTables();
