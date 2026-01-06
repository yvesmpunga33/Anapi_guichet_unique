import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

async function seedProposals() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Get an existing user ID (optional)
    const [users] = await sequelize.query('SELECT id FROM users LIMIT 1');
    const userId = users[0]?.id || null;
    console.log('User ID:', userId || 'No users, using null');

    // Insert 4 test proposals
    const proposals = [
      {
        reference: 'PROP-2026-0001',
        title: "Simplification des procédures d'enregistrement des entreprises",
        summary: "Proposition visant à réduire le nombre de jours nécessaires pour créer une entreprise en RDC de 30 à 7 jours.",
        proposalType: 'RECOMMENDATION',
        domain: 'BUSINESS_CREATION',
        status: 'DRAFT',
        priority: 'HIGH',
        justification: "Le temps de création d'entreprise en RDC est parmi les plus longs en Afrique, ce qui décourage les investisseurs potentiels.",
        expectedImpact: "Amélioration du classement Doing Business, augmentation du nombre de nouvelles entreprises créées.",
        targetAuthority: 'Ministère du Commerce Extérieur',
        submittedAt: null,
        adoptedAt: null,
        createdById: userId
      },
      {
        reference: 'PROP-2026-0002',
        title: 'Réforme du régime fiscal des investissements miniers',
        summary: "Proposition de modification du Code minier pour harmoniser les incitations fiscales avec les standards internationaux.",
        proposalType: 'LAW',
        domain: 'MINING',
        status: 'SUBMITTED',
        priority: 'HIGH',
        justification: "Les investisseurs miniers se plaignent de l'instabilité fiscale et de la complexité des régimes d'imposition.",
        expectedImpact: "Attraction de nouveaux investissements miniers estimés à 2 milliards USD sur 5 ans.",
        targetAuthority: 'Ministère des Mines',
        submittedAt: new Date(),
        adoptedAt: null,
        createdById: userId
      },
      {
        reference: 'PROP-2026-0003',
        title: "Création d'un guichet unique virtuel pour les licences commerciales",
        summary: "Mise en place d'une plateforme numérique permettant d'obtenir toutes les autorisations commerciales en ligne.",
        proposalType: 'DECREE',
        domain: 'TRADE',
        status: 'UNDER_REVIEW',
        priority: 'MEDIUM',
        justification: "La digitalisation des services publics est essentielle pour améliorer l'efficacité administrative.",
        expectedImpact: "Réduction des délais d'obtention des licences de 60%, économie de temps et d'argent pour les entreprises.",
        targetAuthority: 'Primature',
        submittedAt: null,
        adoptedAt: null,
        createdById: userId
      },
      {
        reference: 'PROP-2026-0004',
        title: 'Harmonisation des procédures douanières avec la ZLECAF',
        summary: "Adaptation du code des douanes aux exigences de la Zone de Libre-Échange Continentale Africaine.",
        proposalType: 'LAW',
        domain: 'CUSTOMS',
        status: 'ADOPTED',
        priority: 'URGENT',
        justification: "La RDC doit se conformer aux engagements pris dans le cadre de la ZLECAF pour bénéficier pleinement du marché unique africain.",
        expectedImpact: "Facilitation des échanges commerciaux intra-africains, croissance des exportations de 15%.",
        targetAuthority: 'Ministère des Finances',
        submittedAt: null,
        adoptedAt: new Date(),
        createdById: userId
      }
    ];

    for (const proposal of proposals) {
      await sequelize.query(`
        INSERT INTO legal_proposals (
          id, reference, title, summary, "proposalType", domain, status, priority,
          justification, "expectedImpact", "targetAuthority", "submittedAt", "adoptedAt",
          "createdById", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          :reference,
          :title,
          :summary,
          :proposalType,
          :domain,
          :status,
          :priority,
          :justification,
          :expectedImpact,
          :targetAuthority,
          :submittedAt,
          :adoptedAt,
          :createdById,
          NOW(),
          NOW()
        )
        ON CONFLICT (reference) DO NOTHING
      `, {
        replacements: proposal
      });
      console.log('Created:', proposal.reference);
    }

    console.log('Done! 4 proposals created.');
    await sequelize.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedProposals();
