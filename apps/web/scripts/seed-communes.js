// Script pour initialiser les communes de la RDC
import { Commune, City, Province } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Communes de Kinshasa (24 communes)
const kinshasaCommunes = [
  { code: 'KIN-GOM', name: 'Gombe', population: 40000 },
  { code: 'KIN-LIN', name: 'Lingwala', population: 100000 },
  { code: 'KIN-BAR', name: 'Barumbu', population: 150000 },
  { code: 'KIN-KIN', name: 'Kinshasa', population: 250000 },
  { code: 'KIN-KIT', name: 'Kintambo', population: 180000 },
  { code: 'KIN-NGA', name: 'Ngaliema', population: 1500000 },
  { code: 'KIN-MNG', name: 'Mont-Ngafula', population: 400000 },
  { code: 'KIN-SEL', name: 'Selembao', population: 300000 },
  { code: 'KIN-BAN', name: 'Bandalungwa', population: 350000 },
  { code: 'KIN-KAS', name: 'Kasa-Vubu', population: 200000 },
  { code: 'KIN-NGN', name: 'Ngiri-Ngiri', population: 180000 },
  { code: 'KIN-KAL', name: 'Kalamu', population: 200000 },
  { code: 'KIN-LEM', name: 'Lemba', population: 450000 },
  { code: 'KIN-LIM', name: 'Limete', population: 700000 },
  { code: 'KIN-MAT', name: 'Matete', population: 300000 },
  { code: 'KIN-NGB', name: 'Ngaba', population: 150000 },
  { code: 'KIN-MAK', name: 'Makala', population: 250000 },
  { code: 'KIN-BUM', name: 'Bumbu', population: 350000 },
  { code: 'KIN-MAS', name: 'Masina', population: 900000 },
  { code: 'KIN-NDJ', name: "N'Djili", population: 500000 },
  { code: 'KIN-KIM', name: 'Kimbanseke', population: 1800000 },
  { code: 'KIN-NSE', name: 'Nsele', population: 400000 },
  { code: 'KIN-MLU', name: 'Maluku', population: 300000 },
  { code: 'KIN-NGS', name: 'Ngaba', population: 160000 },
];

// Communes de Lubumbashi
const lubumbashiCommunes = [
  { code: 'LUB-LUB', name: 'Lubumbashi', population: 800000 },
  { code: 'LUB-KAM', name: 'Kampemba', population: 400000 },
  { code: 'LUB-KEN', name: 'Kenya', population: 300000 },
  { code: 'LUB-KAT', name: 'Katuba', population: 350000 },
  { code: 'LUB-KAM2', name: 'Kamalondo', population: 150000 },
  { code: 'LUB-RUK', name: 'Ruashi', population: 250000 },
  { code: 'LUB-ANN', name: 'Annexe', population: 200000 },
];

// Communes de Goma
const gomaCommunes = [
  { code: 'GOM-GOM', name: 'Goma', population: 400000 },
  { code: 'GOM-KAR', name: 'Karisimbi', population: 350000 },
];

// Communes de Bukavu
const bukavuCommunes = [
  { code: 'BUK-IBD', name: 'Ibanda', population: 250000 },
  { code: 'BUK-KAD', name: 'Kadutu', population: 350000 },
  { code: 'BUK-BAG', name: 'Bagira', population: 200000 },
];

// Communes de Mbuji-Mayi
const mbujiMayiCommunes = [
  { code: 'MBJ-MBJ', name: 'Mbuji-Mayi', population: 600000 },
  { code: 'MBJ-KAN', name: 'Kanshi', population: 500000 },
  { code: 'MBJ-BIP', name: 'Bipemba', population: 400000 },
  { code: 'MBJ-DIB', name: 'Dibindi', population: 350000 },
  { code: 'MBJ-MUA', name: 'Muya', population: 300000 },
];

// Communes de Kananga
const kanangaCommunes = [
  { code: 'KNG-KNG', name: 'Kananga', population: 400000 },
  { code: 'KNG-NGA', name: 'Nganza', population: 350000 },
  { code: 'KNG-KAT', name: 'Katoka', population: 250000 },
  { code: 'KNG-LUK', name: 'Lukonga', population: 200000 },
  { code: 'KNG-NDI', name: 'Ndesha', population: 150000 },
];

// Communes de Kisangani
const kisanganiCommunes = [
  { code: 'KIS-KIS', name: 'Kisangani', population: 350000 },
  { code: 'KIS-MAK', name: 'Makiso', population: 300000 },
  { code: 'KIS-TSH', name: 'Tshopo', population: 250000 },
  { code: 'KIS-KAB', name: 'Kabondo', population: 200000 },
  { code: 'KIS-MAN', name: 'Mangobo', population: 150000 },
  { code: 'KIS-LUB', name: 'Lubunga', population: 100000 },
];

async function seedCommunes() {
  console.log('Initialisation des communes de la RDC...\n');

  const communesByCity = [
    { cityCode: 'KIN-001', communes: kinshasaCommunes },
    { cityCode: 'HKA-001', communes: lubumbashiCommunes },
    { cityCode: 'NKI-001', communes: gomaCommunes },
    { cityCode: 'SKI-001', communes: bukavuCommunes },
    { cityCode: 'KAO-001', communes: mbujiMayiCommunes },
    { cityCode: 'KAC-001', communes: kanangaCommunes },
    { cityCode: 'TOP-001', communes: kisanganiCommunes },
  ];

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const { cityCode, communes } of communesByCity) {
    // Trouver la ville
    const city = await City.findOne({
      where: { code: cityCode },
      include: [{ model: Province, as: 'province' }],
    });

    if (!city) {
      console.log(`[ERREUR] Ville ${cityCode} non trouvee`);
      continue;
    }

    console.log(`\n--- ${city.name} (${city.province?.name}) ---`);

    for (const communeData of communes) {
      try {
        // Verifier si la commune existe deja
        const existing = await Commune.findOne({
          where: {
            code: communeData.code,
            cityId: city.id,
          }
        });

        if (existing) {
          console.log(`  [SKIP] ${communeData.name} existe deja`);
          totalSkipped++;
          continue;
        }

        // Creer la commune
        await Commune.create({
          id: uuidv4(),
          ...communeData,
          cityId: city.id,
          isActive: true,
        });

        console.log(`  [OK] ${communeData.name} creee`);
        totalCreated++;
      } catch (error) {
        console.error(`  [ERREUR] ${communeData.name}: ${error.message}`);
      }
    }
  }

  console.log(`\n=== Resume ===`);
  console.log(`Communes creees: ${totalCreated}`);
  console.log(`Communes ignorees (existantes): ${totalSkipped}`);
}

seedCommunes()
  .then(() => {
    console.log('\nTermine!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur:', error);
    process.exit(1);
  });
