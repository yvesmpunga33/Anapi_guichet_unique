// Script pour initialiser les 26 provinces de la RDC
import { Province } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

const provincesData = [
  { code: 'KIN', name: 'Kinshasa', capital: 'Kinshasa', population: 17000000, area: 9965 },
  { code: 'KOC', name: 'Kongo-Central', capital: 'Matadi', population: 5575000, area: 53920 },
  { code: 'KWA', name: 'Kwango', capital: 'Kenge', population: 2045000, area: 89974 },
  { code: 'KWI', name: 'Kwilu', capital: 'Kikwit', population: 5174000, area: 78219 },
  { code: 'MAI', name: 'Mai-Ndombe', capital: 'Inongo', population: 1768000, area: 127465 },
  { code: 'EQU', name: 'Equateur', capital: 'Mbandaka', population: 1626000, area: 103902 },
  { code: 'SUD', name: 'Sud-Ubangi', capital: 'Gemena', population: 2744000, area: 51648 },
  { code: 'NOR', name: 'Nord-Ubangi', capital: 'Gbadolite', population: 1482000, area: 56644 },
  { code: 'MON', name: 'Mongala', capital: 'Lisala', population: 1793000, area: 58141 },
  { code: 'TSH', name: 'Tshuapa', capital: 'Boende', population: 1316000, area: 132957 },
  { code: 'TOP', name: 'Tshopo', capital: 'Kisangani', population: 2614000, area: 199567 },
  { code: 'BAS', name: 'Bas-Uele', capital: 'Buta', population: 1093000, area: 148331 },
  { code: 'HAU', name: 'Haut-Uele', capital: 'Isiro', population: 1920000, area: 89683 },
  { code: 'ITU', name: 'Ituri', capital: 'Bunia', population: 4241000, area: 65658 },
  { code: 'NKI', name: 'Nord-Kivu', capital: 'Goma', population: 6655000, area: 59483 },
  { code: 'SKI', name: 'Sud-Kivu', capital: 'Bukavu', population: 5772000, area: 65070 },
  { code: 'MAN', name: 'Maniema', capital: 'Kindu', population: 2333000, area: 132250 },
  { code: 'HKA', name: 'Haut-Katanga', capital: 'Lubumbashi', population: 4617000, area: 132425 },
  { code: 'HLO', name: 'Haut-Lomami', capital: 'Kamina', population: 2540000, area: 108204 },
  { code: 'LUA', name: 'Lualaba', capital: 'Kolwezi', population: 1677000, area: 121308 },
  { code: 'TAN', name: 'Tanganyika', capital: 'Kalemie', population: 2482000, area: 134940 },
  { code: 'LOM', name: 'Lomami', capital: 'Kabinda', population: 2048000, area: 56426 },
  { code: 'SKA', name: 'Sankuru', capital: 'Lusambo', population: 1374000, area: 104331 },
  { code: 'KAS', name: 'Kasai', capital: 'Luebo', population: 3199000, area: 95631 },
  { code: 'KAC', name: 'Kasai-Central', capital: 'Kananga', population: 2976000, area: 60958 },
  { code: 'KAO', name: 'Kasai-Oriental', capital: 'Mbuji-Mayi', population: 5475000, area: 9545 },
];

async function seedProvinces() {
  console.log('Initialisation des 26 provinces de la RDC...\n');

  let created = 0;
  let skipped = 0;

  for (const provinceData of provincesData) {
    try {
      // Verifier si la province existe deja
      const existing = await Province.findOne({
        where: { code: provinceData.code }
      });

      if (existing) {
        console.log(`  [SKIP] ${provinceData.name} (${provinceData.code}) existe deja`);
        skipped++;
        continue;
      }

      // Creer la province
      await Province.create({
        id: uuidv4(),
        ...provinceData,
        isActive: true,
      });

      console.log(`  [OK] ${provinceData.name} (${provinceData.code}) creee`);
      created++;
    } catch (error) {
      console.error(`  [ERREUR] ${provinceData.name}: ${error.message}`);
    }
  }

  console.log(`\n=== Resume ===`);
  console.log(`Provinces creees: ${created}`);
  console.log(`Provinces ignorees (existantes): ${skipped}`);
  console.log(`Total provinces dans la base: ${created + skipped}`);
}

seedProvinces()
  .then(() => {
    console.log('\nTermine!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur:', error);
    process.exit(1);
  });
