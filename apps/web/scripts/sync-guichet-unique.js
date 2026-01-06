import sequelize from '../app/lib/sequelize.js';
import { Dossier, ApprovalRequest, Investor, User } from '../models/index.js';

async function syncGuichetUnique() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // First, ensure User and Investor tables exist
    console.log('\nSyncing User table...');
    await User.sync({ alter: true });
    console.log('User table synced');

    console.log('Syncing Investor table...');
    await Investor.sync({ alter: true });
    console.log('Investor table synced');

    // Sync Dossier model without foreign key constraints first
    console.log('\nSyncing Dossier table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dossiers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "dossierNumber" VARCHAR(255) NOT NULL UNIQUE,
        "dossierType" VARCHAR(50) NOT NULL,
        "investorId" UUID,
        "investorType" VARCHAR(20) DEFAULT 'company',
        "investorName" VARCHAR(255) NOT NULL,
        rccm VARCHAR(255),
        "idNat" VARCHAR(255),
        nif VARCHAR(255),
        "investorEmail" VARCHAR(255) NOT NULL,
        "investorPhone" VARCHAR(255) NOT NULL,
        "investorProvince" VARCHAR(255),
        "investorCity" VARCHAR(255),
        "investorAddress" TEXT,
        "investorCountry" VARCHAR(255) DEFAULT 'RDC',
        "projectName" VARCHAR(255) NOT NULL,
        "projectDescription" TEXT,
        sector VARCHAR(255) NOT NULL,
        "subSector" VARCHAR(255),
        "projectProvince" VARCHAR(255) NOT NULL,
        "projectCity" VARCHAR(255),
        "projectAddress" TEXT,
        "investmentAmount" DECIMAL(18,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        "directJobs" INTEGER DEFAULT 0,
        "indirectJobs" INTEGER DEFAULT 0,
        "startDate" DATE,
        "endDate" DATE,
        status VARCHAR(50) DEFAULT 'DRAFT',
        "currentStep" INTEGER DEFAULT 1,
        "assignedToId" UUID,
        "assignedAt" TIMESTAMPTZ,
        "submittedAt" TIMESTAMPTZ,
        "reviewedAt" TIMESTAMPTZ,
        "decisionDate" TIMESTAMPTZ,
        "decisionNote" TEXT,
        "createdById" UUID,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Dossier table synced');

    // Sync DossierDocument table
    console.log('Syncing DossierDocument table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dossier_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "dossierId" UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'OTHER',
        "fileName" VARCHAR(255) NOT NULL,
        "filePath" VARCHAR(255) NOT NULL,
        "fileSize" INTEGER,
        "mimeType" VARCHAR(255),
        "uploadedById" UUID,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('DossierDocument table synced');

    // Sync ApprovalRequest model (for agrements)
    console.log('Syncing ApprovalRequest table...');
    await ApprovalRequest.sync({ alter: true });
    console.log('ApprovalRequest table synced');

    // Check the dossiers table columns
    const dossierResult = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'dossiers' ORDER BY ordinal_position"
    );
    console.log('\nDossiers table columns:');
    dossierResult[0].forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    // Count existing dossiers
    const dossierCount = await Dossier.count();
    console.log(`\nExisting dossiers: ${dossierCount}`);

    // Count existing approval requests
    const approvalCount = await ApprovalRequest.count();
    console.log(`Existing approval requests: ${approvalCount}`);

    console.log('\nGuichet Unique database sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

syncGuichetUnique();
