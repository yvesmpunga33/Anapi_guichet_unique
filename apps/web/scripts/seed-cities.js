// Script pour initialiser les principales villes de la RDC
import { City, Province } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Villes par province (code province -> liste de villes)
const citiesData = {
  KIN: [
    { code: 'KIN-001', name: 'Kinshasa', isCapital: true, population: 17000000 },
    { code: 'KIN-002', name: 'Gombe', population: 40000 },
    { code: 'KIN-003', name: 'Lingwala', population: 100000 },
    { code: 'KIN-004', name: 'Barumbu', population: 150000 },
    { code: 'KIN-005', name: 'Kinshasa (commune)', population: 250000 },
    { code: 'KIN-006', name: 'Kintambo', population: 180000 },
    { code: 'KIN-007', name: 'Ngaliema', population: 1500000 },
    { code: 'KIN-008', name: 'Mont-Ngafula', population: 400000 },
    { code: 'KIN-009', name: 'Selembao', population: 300000 },
    { code: 'KIN-010', name: 'Bandalungwa', population: 350000 },
    { code: 'KIN-011', name: 'Kasa-Vubu', population: 200000 },
    { code: 'KIN-012', name: 'Ngiri-Ngiri', population: 180000 },
    { code: 'KIN-013', name: 'Kalamu', population: 200000 },
    { code: 'KIN-014', name: 'Lemba', population: 450000 },
    { code: 'KIN-015', name: 'Limete', population: 700000 },
    { code: 'KIN-016', name: 'Matete', population: 300000 },
    { code: 'KIN-017', name: 'Ngaba', population: 150000 },
    { code: 'KIN-018', name: 'Makala', population: 250000 },
    { code: 'KIN-019', name: 'Bumbu', population: 350000 },
    { code: 'KIN-020', name: 'Ngiri-Ngiri', population: 180000 },
    { code: 'KIN-021', name: 'Masina', population: 900000 },
    { code: 'KIN-022', name: "N'Djili", population: 500000 },
    { code: 'KIN-023', name: 'Kimbanseke', population: 1800000 },
    { code: 'KIN-024', name: 'Nsele', population: 400000 },
  ],
  KOC: [
    { code: 'KOC-001', name: 'Matadi', isCapital: true, population: 350000 },
    { code: 'KOC-002', name: 'Boma', population: 180000 },
    { code: 'KOC-003', name: 'Moanda', population: 100000 },
    { code: 'KOC-004', name: 'Tshela', population: 50000 },
    { code: 'KOC-005', name: 'Mbanza-Ngungu', population: 80000 },
    { code: 'KOC-006', name: 'Lukala', population: 40000 },
    { code: 'KOC-007', name: 'Songololo', population: 30000 },
    { code: 'KOC-008', name: 'Kasangulu', population: 60000 },
  ],
  HKA: [
    { code: 'HKA-001', name: 'Lubumbashi', isCapital: true, population: 2000000 },
    { code: 'HKA-002', name: 'Likasi', population: 450000 },
    { code: 'HKA-003', name: 'Kipushi', population: 120000 },
    { code: 'HKA-004', name: 'Kasumbalesa', population: 80000 },
    { code: 'HKA-005', name: 'Kambove', population: 50000 },
  ],
  LUA: [
    { code: 'LUA-001', name: 'Kolwezi', isCapital: true, population: 500000 },
    { code: 'LUA-002', name: 'Dilolo', population: 40000 },
    { code: 'LUA-003', name: 'Fungurume', population: 30000 },
    { code: 'LUA-004', name: 'Mutshatsha', population: 25000 },
  ],
  NKI: [
    { code: 'NKI-001', name: 'Goma', isCapital: true, population: 1000000 },
    { code: 'NKI-002', name: 'Butembo', population: 700000 },
    { code: 'NKI-003', name: 'Beni', population: 400000 },
    { code: 'NKI-004', name: 'Rutshuru', population: 100000 },
    { code: 'NKI-005', name: 'Masisi', population: 80000 },
    { code: 'NKI-006', name: 'Walikale', population: 60000 },
    { code: 'NKI-007', name: 'Lubero', population: 90000 },
  ],
  SKI: [
    { code: 'SKI-001', name: 'Bukavu', isCapital: true, population: 900000 },
    { code: 'SKI-002', name: 'Uvira', population: 300000 },
    { code: 'SKI-003', name: 'Baraka', population: 80000 },
    { code: 'SKI-004', name: 'Kamituga', population: 100000 },
    { code: 'SKI-005', name: 'Kabare', population: 60000 },
    { code: 'SKI-006', name: 'Walungu', population: 50000 },
  ],
  KAO: [
    { code: 'KAO-001', name: 'Mbuji-Mayi', isCapital: true, population: 2500000 },
    { code: 'KAO-002', name: 'Tshilenge', population: 80000 },
    { code: 'KAO-003', name: 'Kabeya-Kamwanga', population: 50000 },
  ],
  KAC: [
    { code: 'KAC-001', name: 'Kananga', isCapital: true, population: 1200000 },
    { code: 'KAC-002', name: 'Luiza', population: 80000 },
    { code: 'KAC-003', name: 'Demba', population: 60000 },
    { code: 'KAC-004', name: 'Dibaya', population: 50000 },
  ],
  EQU: [
    { code: 'EQU-001', name: 'Mbandaka', isCapital: true, population: 500000 },
    { code: 'EQU-002', name: 'Bikoro', population: 60000 },
    { code: 'EQU-003', name: 'Ingende', population: 40000 },
    { code: 'EQU-004', name: 'Bolomba', population: 35000 },
  ],
  TOP: [
    { code: 'TOP-001', name: 'Kisangani', isCapital: true, population: 1200000 },
    { code: 'TOP-002', name: 'Isangi', population: 80000 },
    { code: 'TOP-003', name: 'Basoko', population: 60000 },
    { code: 'TOP-004', name: 'Yahuma', population: 40000 },
    { code: 'TOP-005', name: 'Ubundu', population: 50000 },
  ],
  ITU: [
    { code: 'ITU-001', name: 'Bunia', isCapital: true, population: 400000 },
    { code: 'ITU-002', name: 'Aru', population: 120000 },
    { code: 'ITU-003', name: 'Mahagi', population: 100000 },
    { code: 'ITU-004', name: 'Djugu', population: 80000 },
    { code: 'ITU-005', name: 'Irumu', population: 70000 },
  ],
  TAN: [
    { code: 'TAN-001', name: 'Kalemie', isCapital: true, population: 200000 },
    { code: 'TAN-002', name: 'Moba', population: 80000 },
    { code: 'TAN-003', name: 'Kongolo', population: 70000 },
    { code: 'TAN-004', name: 'Manono', population: 60000 },
  ],
  MAN: [
    { code: 'MAN-001', name: 'Kindu', isCapital: true, population: 200000 },
    { code: 'MAN-002', name: 'Kasongo', population: 80000 },
    { code: 'MAN-003', name: 'Lubutu', population: 50000 },
    { code: 'MAN-004', name: 'Kailo', population: 40000 },
  ],
  KAS: [
    { code: 'KAS-001', name: 'Luebo', isCapital: true, population: 100000 },
    { code: 'KAS-002', name: 'Tshikapa', population: 500000 },
    { code: 'KAS-003', name: 'Ilebo', population: 80000 },
    { code: 'KAS-004', name: 'Mweka', population: 60000 },
  ],
  HLO: [
    { code: 'HLO-001', name: 'Kamina', isCapital: true, population: 200000 },
    { code: 'HLO-002', name: 'Kabongo', population: 80000 },
    { code: 'HLO-003', name: 'Malemba-Nkulu', population: 60000 },
    { code: 'HLO-004', name: 'Bukama', population: 50000 },
  ],
  KWI: [
    { code: 'KWI-001', name: 'Kikwit', isCapital: true, population: 400000 },
    { code: 'KWI-002', name: 'Bandundu', population: 150000 },
    { code: 'KWI-003', name: 'Gungu', population: 60000 },
    { code: 'KWI-004', name: 'Idiofa', population: 50000 },
  ],
  KWA: [
    { code: 'KWA-001', name: 'Kenge', isCapital: true, population: 100000 },
    { code: 'KWA-002', name: 'Kahemba', population: 40000 },
    { code: 'KWA-003', name: 'Feshi', population: 30000 },
    { code: 'KWA-004', name: 'Kasongo-Lunda', population: 50000 },
  ],
  MAI: [
    { code: 'MAI-001', name: 'Inongo', isCapital: true, population: 60000 },
    { code: 'MAI-002', name: 'Kiri', population: 30000 },
    { code: 'MAI-003', name: 'Kutu', population: 25000 },
    { code: 'MAI-004', name: 'Mushie', population: 20000 },
  ],
  SUD: [
    { code: 'SUD-001', name: 'Gemena', isCapital: true, population: 120000 },
    { code: 'SUD-002', name: 'Libenge', population: 50000 },
    { code: 'SUD-003', name: 'Zongo', population: 40000 },
    { code: 'SUD-004', name: 'Budjala', population: 30000 },
  ],
  NOR: [
    { code: 'NOR-001', name: 'Gbadolite', isCapital: true, population: 80000 },
    { code: 'NOR-002', name: 'Mobayi-Mbongo', population: 40000 },
    { code: 'NOR-003', name: 'Yakoma', population: 30000 },
  ],
  MON: [
    { code: 'MON-001', name: 'Lisala', isCapital: true, population: 100000 },
    { code: 'MON-002', name: 'Bumba', population: 80000 },
    { code: 'MON-003', name: 'Bongandanga', population: 40000 },
  ],
  TSH: [
    { code: 'TSH-001', name: 'Boende', isCapital: true, population: 60000 },
    { code: 'TSH-002', name: 'Befale', population: 30000 },
    { code: 'TSH-003', name: 'Ikela', population: 25000 },
  ],
  BAS: [
    { code: 'BAS-001', name: 'Buta', isCapital: true, population: 80000 },
    { code: 'BAS-002', name: 'Aketi', population: 40000 },
    { code: 'BAS-003', name: 'Ango', population: 30000 },
  ],
  HAU: [
    { code: 'HAU-001', name: 'Isiro', isCapital: true, population: 150000 },
    { code: 'HAU-002', name: 'Wamba', population: 60000 },
    { code: 'HAU-003', name: 'Watsa', population: 50000 },
    { code: 'HAU-004', name: 'Dungu', population: 40000 },
    { code: 'HAU-005', name: 'Faradje', population: 30000 },
  ],
  LOM: [
    { code: 'LOM-001', name: 'Kabinda', isCapital: true, population: 150000 },
    { code: 'LOM-002', name: 'Mwene-Ditu', population: 200000 },
    { code: 'LOM-003', name: 'Ngandajika', population: 80000 },
    { code: 'LOM-004', name: 'Lubao', population: 60000 },
  ],
  SKA: [
    { code: 'SKA-001', name: 'Lusambo', isCapital: true, population: 60000 },
    { code: 'SKA-002', name: 'Lodja', population: 80000 },
    { code: 'SKA-003', name: 'Katako-Kombe', population: 40000 },
  ],
};

async function seedCities() {
  console.log('Initialisation des principales villes de la RDC...\n');

  let totalCreated = 0;
  let totalSkipped = 0;

  // Recuperer toutes les provinces
  const provinces = await Province.findAll();
  const provinceMap = {};
  provinces.forEach(p => {
    provinceMap[p.code] = p.id;
  });

  for (const [provinceCode, cities] of Object.entries(citiesData)) {
    const provinceId = provinceMap[provinceCode];

    if (!provinceId) {
      console.log(`[ERREUR] Province ${provinceCode} non trouvee`);
      continue;
    }

    console.log(`\n--- ${provinceCode} ---`);

    for (const cityData of cities) {
      try {
        // Verifier si la ville existe deja
        const existing = await City.findOne({
          where: {
            code: cityData.code,
            provinceId: provinceId,
          }
        });

        if (existing) {
          console.log(`  [SKIP] ${cityData.name} existe deja`);
          totalSkipped++;
          continue;
        }

        // Creer la ville
        await City.create({
          id: uuidv4(),
          ...cityData,
          provinceId: provinceId,
          isActive: true,
        });

        console.log(`  [OK] ${cityData.name} creee`);
        totalCreated++;
      } catch (error) {
        console.error(`  [ERREUR] ${cityData.name}: ${error.message}`);
      }
    }
  }

  console.log(`\n=== Resume ===`);
  console.log(`Villes creees: ${totalCreated}`);
  console.log(`Villes ignorees (existantes): ${totalSkipped}`);
}

seedCities()
  .then(() => {
    console.log('\nTermine!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur:', error);
    process.exit(1);
  });
