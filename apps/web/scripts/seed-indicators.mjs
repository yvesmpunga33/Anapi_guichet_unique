import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

async function seedIndicators() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if tables exist
    const [tables] = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('climate_indicators', 'climate_indicator_values')");
    console.log('Tables found:', tables.map(t => t.tablename).join(', '));

    if (!tables.find(t => t.tablename === 'climate_indicators')) {
      console.log('Table climate_indicators does not exist. Creating it...');

      // Create table
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS climate_indicators (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(50) DEFAULT 'INVESTMENT_CLIMATE',
          "subCategory" VARCHAR(100),
          "measureType" VARCHAR(50) DEFAULT 'SCORE',
          unit VARCHAR(50),
          "betterDirection" VARCHAR(20) DEFAULT 'HIGHER',
          "dataSource" VARCHAR(255),
          "updateFrequency" VARCHAR(50) DEFAULT 'ANNUALLY',
          "targetValue" DECIMAL(15,4),
          "targetYear" INTEGER,
          "isActive" BOOLEAN DEFAULT true,
          "displayOrder" INTEGER DEFAULT 0,
          metadata JSONB DEFAULT '{}',
          "createdById" VARCHAR(50),
          "createdAt" TIMESTAMPTZ NOT NULL,
          "updatedAt" TIMESTAMPTZ NOT NULL
        )
      `);
      console.log('Created climate_indicators table');
    }

    if (!tables.find(t => t.tablename === 'climate_indicator_values')) {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS climate_indicator_values (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "indicatorId" UUID NOT NULL REFERENCES climate_indicators(id),
          year INTEGER NOT NULL,
          quarter INTEGER,
          month INTEGER,
          value DECIMAL(15,4) NOT NULL,
          "previousValue" DECIMAL(15,4),
          "changePercentage" DECIMAL(10,2),
          rank INTEGER,
          "rankOutOf" INTEGER,
          "regionalAverage" DECIMAL(15,4),
          "regionalRank" INTEGER,
          notes TEXT,
          source VARCHAR(255),
          "sourceUrl" VARCHAR(500),
          "publishedDate" TIMESTAMPTZ,
          "isVerified" BOOLEAN DEFAULT false,
          "verifiedAt" TIMESTAMPTZ,
          "verifiedById" VARCHAR(50),
          "createdById" VARCHAR(50),
          "createdAt" TIMESTAMPTZ NOT NULL,
          "updatedAt" TIMESTAMPTZ NOT NULL
        )
      `);
      console.log('Created climate_indicator_values table');
    }

    // Insert test indicators
    const indicators = [
      {
        code: 'DB_DTF',
        name: 'Doing Business - Distance to Frontier',
        description: 'Score global mesurant la facilité de faire des affaires en RDC par rapport aux meilleures pratiques mondiales.',
        category: 'DOING_BUSINESS',
        subCategory: 'Score Global',
        measureType: 'SCORE',
        unit: 'points',
        betterDirection: 'HIGHER',
        dataSource: 'Banque Mondiale',
        updateFrequency: 'ANNUALLY',
        targetValue: 60,
        targetYear: 2030,
        displayOrder: 1,
      },
      {
        code: 'DB_RANK',
        name: 'Classement Doing Business',
        description: 'Position de la RDC dans le classement mondial Doing Business.',
        category: 'DOING_BUSINESS',
        subCategory: 'Classement Mondial',
        measureType: 'RANK',
        unit: null,
        betterDirection: 'LOWER',
        dataSource: 'Banque Mondiale',
        updateFrequency: 'ANNUALLY',
        targetValue: 100,
        targetYear: 2030,
        displayOrder: 2,
      },
      {
        code: 'DB_SB_DAYS',
        name: "Délai de création d'entreprise",
        description: "Nombre de jours nécessaires pour créer une entreprise en RDC.",
        category: 'DOING_BUSINESS',
        subCategory: 'Starting a Business',
        measureType: 'DAYS',
        unit: 'jours',
        betterDirection: 'LOWER',
        dataSource: 'Banque Mondiale',
        updateFrequency: 'ANNUALLY',
        targetValue: 7,
        targetYear: 2028,
        displayOrder: 3,
      },
      {
        code: 'CPI_SCORE',
        name: 'Indice de Perception de la Corruption',
        description: 'Score de perception de la corruption selon Transparency International.',
        category: 'CORRUPTION',
        subCategory: null,
        measureType: 'SCORE',
        unit: 'points',
        betterDirection: 'HIGHER',
        dataSource: 'Transparency International',
        updateFrequency: 'ANNUALLY',
        targetValue: 40,
        targetYear: 2030,
        displayOrder: 4,
      },
      {
        code: 'FDI_INFLOW',
        name: 'Investissements Directs Étrangers',
        description: "Flux entrants d'investissements directs étrangers en RDC.",
        category: 'INVESTMENT_CLIMATE',
        subCategory: 'IDE',
        measureType: 'CURRENCY',
        unit: 'millions USD',
        betterDirection: 'HIGHER',
        dataSource: 'CNUCED',
        updateFrequency: 'ANNUALLY',
        targetValue: 5000,
        targetYear: 2030,
        displayOrder: 5,
      },
    ];

    for (const ind of indicators) {
      const [result] = await sequelize.query(`
        INSERT INTO climate_indicators (
          id, code, name, description, category, "subCategory", "measureType",
          unit, "betterDirection", "dataSource", "updateFrequency",
          "targetValue", "targetYear", "isActive", "displayOrder",
          "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), :code, :name, :description, :category, :subCategory, :measureType,
          :unit, :betterDirection, :dataSource, :updateFrequency,
          :targetValue, :targetYear, true, :displayOrder,
          NOW(), NOW()
        )
        ON CONFLICT (code) DO NOTHING
        RETURNING id
      `, {
        replacements: ind
      });

      if (result && result[0]) {
        console.log('Created:', ind.code, '- ID:', result[0].id);

        // Add historical values
        const values = [];
        if (ind.code === 'DB_DTF') {
          values.push(
            { year: 2020, value: 36.2, rank: 183, rankOutOf: 190, changePercentage: 0.3 },
            { year: 2019, value: 35.9, rank: 184, rankOutOf: 190, changePercentage: 1.1 },
            { year: 2018, value: 35.5, rank: 182, rankOutOf: 190, changePercentage: null },
          );
        } else if (ind.code === 'DB_RANK') {
          values.push(
            { year: 2020, value: 183, rank: null, rankOutOf: null, changePercentage: -0.5 },
            { year: 2019, value: 184, rank: null, rankOutOf: null, changePercentage: 1.1 },
            { year: 2018, value: 182, rank: null, rankOutOf: null, changePercentage: null },
          );
        } else if (ind.code === 'DB_SB_DAYS') {
          values.push(
            { year: 2020, value: 27, rank: null, rankOutOf: null, changePercentage: -10 },
            { year: 2019, value: 30, rank: null, rankOutOf: null, changePercentage: -6.25 },
            { year: 2018, value: 32, rank: null, rankOutOf: null, changePercentage: null },
          );
        } else if (ind.code === 'CPI_SCORE') {
          values.push(
            { year: 2024, value: 20, rank: 162, rankOutOf: 180, changePercentage: 0 },
            { year: 2023, value: 20, rank: 166, rankOutOf: 180, changePercentage: -4.8 },
            { year: 2022, value: 21, rank: 169, rankOutOf: 180, changePercentage: null },
          );
        } else if (ind.code === 'FDI_INFLOW') {
          values.push(
            { year: 2023, value: 1800, rank: null, rankOutOf: null, changePercentage: 12.5 },
            { year: 2022, value: 1600, rank: null, rankOutOf: null, changePercentage: 14.3 },
            { year: 2021, value: 1400, rank: null, rankOutOf: null, changePercentage: null },
          );
        }

        for (const val of values) {
          await sequelize.query(`
            INSERT INTO climate_indicator_values (
              id, "indicatorId", year, value, "previousValue", "changePercentage",
              rank, "rankOutOf", "isVerified", "createdAt", "updatedAt"
            ) VALUES (
              gen_random_uuid(), :indicatorId, :year, :value, :previousValue, :changePercentage,
              :rank, :rankOutOf, true, NOW(), NOW()
            )
          `, {
            replacements: {
              indicatorId: result[0].id,
              year: val.year,
              value: val.value,
              previousValue: null,
              changePercentage: val.changePercentage,
              rank: val.rank,
              rankOutOf: val.rankOutOf,
            }
          });
          console.log('  - Added value for year', val.year);
        }
      } else {
        console.log('Already exists:', ind.code);
      }
    }

    console.log('Done! Test indicators created.');
    await sequelize.close();
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seedIndicators();
