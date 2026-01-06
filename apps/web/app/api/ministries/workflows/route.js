import { NextResponse } from 'next/server';
import { MinistryWorkflow, Ministry } from '../../../../models/index.js';

// GET - Liste des workflows par ministère
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ministryId = searchParams.get('ministryId');
    const requestType = searchParams.get('requestType');

    const where = {};
    if (ministryId) where.ministryId = ministryId;
    if (requestType) where.requestType = requestType;

    const workflows = await MinistryWorkflow.findAll({
      where,
      include: [
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'code'] }
      ],
      order: [['ministryId', 'ASC'], ['requestType', 'ASC'], ['stepNumber', 'ASC']],
    });

    // Grouper par ministère et type
    const grouped = workflows.reduce((acc, workflow) => {
      const key = `${workflow.ministryId}-${workflow.requestType}`;
      if (!acc[key]) {
        acc[key] = {
          ministryId: workflow.ministryId,
          ministryName: workflow.ministry?.name,
          requestType: workflow.requestType,
          steps: [],
        };
      }
      acc[key].steps.push({
        id: workflow.id,
        stepNumber: workflow.stepNumber,
        stepName: workflow.stepName,
        stepDescription: workflow.stepDescription,
        responsibleRole: workflow.responsibleRole,
        estimatedDays: workflow.estimatedDays,
        requiredDocuments: workflow.requiredDocuments,
        isActive: workflow.isActive,
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: Object.values(grouped),
      total: workflows.length,
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des workflows', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour un workflow complet
export async function POST(request) {
  try {
    const data = await request.json();
    const { ministryId, requestType, steps } = data;

    if (!ministryId || !requestType || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'ministryId, requestType et steps sont requis' },
        { status: 400 }
      );
    }

    // Supprimer les anciennes étapes pour ce ministère/type
    await MinistryWorkflow.destroy({
      where: { ministryId, requestType }
    });

    // Créer les nouvelles étapes
    const createdSteps = await Promise.all(
      steps.map((step, index) =>
        MinistryWorkflow.create({
          ministryId,
          requestType,
          stepNumber: index + 1,
          stepName: step.stepName,
          stepDescription: step.stepDescription,
          responsibleRole: step.responsibleRole,
          estimatedDays: step.estimatedDays || 3,
          requiredDocuments: step.requiredDocuments || [],
          isActive: step.isActive !== false,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Workflow configure avec succes',
      data: createdSteps,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du workflow', details: error.message },
      { status: 500 }
    );
  }
}
