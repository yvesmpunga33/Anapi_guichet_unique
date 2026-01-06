import {
  BusinessBarrier,
  BarrierResolution,
  MediationCase,
  StakeholderDialogue,
  DialogueParticipant,
  LegalProposal,
  InternationalTreaty,
  ClimateIndicator,
  ClimateIndicatorValue,
  sequelize
} from '../models/index.js';

async function syncBusinessClimate() {
  try {
    console.log('🔄 Synchronisation des modèles Climat des Affaires...\n');

    // Sync only business climate models
    const models = [
      ClimateIndicator,
      ClimateIndicatorValue,
      InternationalTreaty,
      LegalProposal,
      StakeholderDialogue,
      DialogueParticipant,
      BusinessBarrier,
      BarrierResolution,
      MediationCase,
    ];

    for (const model of models) {
      console.log(`   Synchronisation de ${model.tableName}...`);
      await model.sync({ alter: true });
    }

    console.log('✅ Synchronisation terminée avec succès!\n');

    // List new tables
    const [results] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN (
        'business_barriers',
        'barrier_resolutions',
        'mediation_cases',
        'stakeholder_dialogues',
        'dialogue_participants',
        'legal_proposals',
        'international_treaties',
        'climate_indicators',
        'climate_indicator_values'
      )
      ORDER BY table_name;
    `);

    console.log('📋 Tables créées/mises à jour:');
    results.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Module Climat des Affaires prêt!');

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

syncBusinessClimate();
