import bcrypt from 'bcryptjs';
import sequelize from '../app/lib/sequelize.js';
import User from '../models/User.js';
import Investor from '../models/Investor.js';
import Investment from '../models/Investment.js';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync tables
    await User.sync({ alter: true });
    await Investor.sync({ alter: true });
    await Investment.sync({ alter: true });
    console.log('Tables synced');

    // Create admin user if not exists
    const adminEmail = 'admin@anapi.cd';
    let admin = await User.findOne({ where: { email: adminEmail } });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const { v4: uuidv4 } = await import('uuid');
      admin = await User.create({
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin ANAPI',
        role: 'ADMIN',
        isActive: true,
      });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', admin.email);
    }

    // Create test investors if none exist
    const investorCount = await Investor.count();
    let investors = [];

    if (investorCount === 0) {
      const investorsData = [
        {
          investorCode: 'INV-2024-00001',
          name: 'Congo Mining Corporation',
          type: 'company',
          category: 'Multinationale',
          country: 'Afrique du Sud',
          province: 'Lualaba',
          city: 'Kolwezi',
          email: 'contact@congomining.com',
          phone: '+243 81 234 5678',
          status: 'ACTIVE',
          isVerified: true,
        },
        {
          investorCode: 'INV-2024-00002',
          name: 'AgroTech RDC SARL',
          type: 'company',
          category: 'PME',
          country: 'RDC',
          province: 'Equateur',
          city: 'Mbandaka',
          email: 'info@agrotechrdc.cd',
          phone: '+243 99 876 5432',
          status: 'ACTIVE',
          isVerified: true,
        },
        {
          investorCode: 'INV-2024-00003',
          name: 'Jean-Pierre Mukendi',
          type: 'individual',
          category: 'Investisseur prive',
          country: 'RDC',
          province: 'Nord-Kivu',
          city: 'Goma',
          email: 'jp.mukendi@gmail.com',
          status: 'ACTIVE',
          isVerified: true,
        },
        {
          investorCode: 'INV-2024-00004',
          name: 'TechInvest Africa Ltd',
          type: 'company',
          category: "Fonds d'investissement",
          country: 'Kenya',
          email: 'invest@techinvest.africa',
          status: 'PENDING',
          isVerified: false,
        },
        {
          investorCode: 'INV-2024-00005',
          name: 'Congo Cement Industries',
          type: 'company',
          category: 'Grande entreprise',
          country: 'RDC',
          province: 'Kongo Central',
          city: 'Matadi',
          email: 'direction@congociment.cd',
          status: 'SUSPENDED',
          isVerified: true,
        },
        {
          investorCode: 'INV-2024-00006',
          name: 'African Development Fund',
          type: 'organization',
          category: 'Institution financiere',
          country: "Cote d'Ivoire",
          email: 'projects@adf.org',
          status: 'ACTIVE',
          isVerified: true,
        },
      ];

      for (const investorData of investorsData) {
        const inv = await Investor.create(investorData);
        investors.push(inv);
      }
      console.log(`Created ${investors.length} test investors`);
    } else {
      investors = await Investor.findAll();
      console.log(`${investorCount} investors already exist`);
    }

    // Create test projects if none exist
    const projectCount = await Investment.count();
    if (projectCount === 0 && investors.length > 0) {
      const projectsData = [
        {
          projectCode: 'PRJ-2024-00001',
          projectName: 'Extension Mine de Cuivre Kolwezi',
          description: 'Projet d\'extension de la capacite de production de la mine de cuivre avec nouvelles installations de traitement',
          investorId: investors[0]?.id,
          sector: 'Mines',
          subSector: 'Cuivre et Cobalt',
          province: 'Lualaba',
          city: 'Kolwezi',
          amount: 45000000,
          currency: 'USD',
          jobsCreated: 1200,
          jobsIndirect: 3500,
          startDate: new Date('2023-06-01'),
          endDate: new Date('2026-12-31'),
          status: 'IN_PROGRESS',
          progress: 65,
        },
        {
          projectCode: 'PRJ-2024-00002',
          projectName: 'Plantation de Palmiers a Huile',
          description: 'Creation d\'une plantation industrielle de palmiers a huile avec usine de transformation',
          investorId: investors[1]?.id,
          sector: 'Agriculture',
          subSector: 'Oleagineux',
          province: 'Equateur',
          city: 'Mbandaka',
          amount: 8500000,
          currency: 'USD',
          jobsCreated: 450,
          jobsIndirect: 1200,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2027-03-01'),
          status: 'APPROVED',
          progress: 25,
        },
        {
          projectCode: 'PRJ-2024-00003',
          projectName: 'Hotel Touristique Goma',
          description: 'Construction d\'un hotel 4 etoiles avec centre de conferences et spa',
          investorId: investors[2]?.id,
          sector: 'Tourisme',
          subSector: 'Hotellerie',
          province: 'Nord-Kivu',
          city: 'Goma',
          amount: 2500000,
          currency: 'USD',
          jobsCreated: 150,
          jobsIndirect: 400,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2026-06-01'),
          status: 'UNDER_REVIEW',
          progress: 0,
        },
        {
          projectCode: 'PRJ-2024-00004',
          projectName: 'Data Center Kinshasa',
          description: 'Installation d\'un centre de donnees moderne avec solutions cloud pour entreprises',
          investorId: investors[3]?.id,
          sector: 'Technologies',
          subSector: 'Infrastructure IT',
          province: 'Kinshasa',
          city: 'Kinshasa',
          amount: 15000000,
          currency: 'USD',
          jobsCreated: 80,
          jobsIndirect: 250,
          startDate: new Date('2024-09-01'),
          status: 'SUBMITTED',
          progress: 0,
        },
        {
          projectCode: 'PRJ-2024-00005',
          projectName: 'Usine de Ciment Matadi',
          description: 'Construction d\'une nouvelle ligne de production de ciment',
          investorId: investors[4]?.id,
          sector: 'Industrie',
          subSector: 'Materiaux de construction',
          province: 'Kongo Central',
          city: 'Matadi',
          amount: 35000000,
          currency: 'USD',
          jobsCreated: 300,
          jobsIndirect: 800,
          startDate: new Date('2023-01-01'),
          endDate: new Date('2025-06-30'),
          status: 'REJECTED',
          progress: 0,
          rejectionReason: 'Etude d\'impact environnemental insuffisante',
        },
        {
          projectCode: 'PRJ-2024-00006',
          projectName: 'Centrale Solaire Lubumbashi',
          description: 'Installation d\'une centrale solaire photovoltaique de 50MW',
          investorId: investors[5]?.id,
          sector: 'Energie',
          subSector: 'Energies renouvelables',
          province: 'Haut-Katanga',
          city: 'Lubumbashi',
          amount: 68000000,
          currency: 'USD',
          jobsCreated: 200,
          jobsIndirect: 500,
          startDate: new Date('2022-03-01'),
          endDate: new Date('2024-03-01'),
          status: 'COMPLETED',
          progress: 100,
          approvalDate: new Date('2022-01-15'),
        },
      ];

      for (const projectData of projectsData) {
        await Investment.create(projectData);
      }
      console.log(`Created ${projectsData.length} test projects`);
    } else {
      console.log(`${projectCount} projects already exist`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('  Email: admin@anapi.cd');
    console.log('  Password: Admin123!');

    process.exit(0);
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seed();
