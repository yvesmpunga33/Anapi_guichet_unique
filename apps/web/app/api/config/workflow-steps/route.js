import { NextResponse } from 'next/server';
import { WorkflowStep } from '../../../../models/index.js';

// GET - Liste des etapes de workflow
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowType = searchParams.get('type') || 'AGREMENT';
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const where = { workflowType };
    if (activeOnly) {
      where.isActive = true;
    }

    const steps = await WorkflowStep.findAll({
      where,
      order: [['stepNumber', 'ASC']],
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('Error fetching workflow steps:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des etapes' },
      { status: 500 }
    );
  }
}

// POST - Creer une nouvelle etape
export async function POST(request) {
  try {
    const data = await request.json();

    // Valider les donnees requises
    if (!data.name || !data.workflowType) {
      return NextResponse.json(
        { error: 'Le nom et le type de workflow sont requis' },
        { status: 400 }
      );
    }

    // Determiner le prochain numero d'etape
    const lastStep = await WorkflowStep.findOne({
      where: { workflowType: data.workflowType },
      order: [['stepNumber', 'DESC']],
    });

    const stepNumber = data.stepNumber || (lastStep ? lastStep.stepNumber + 1 : 1);

    // Creer l'etape
    const step = await WorkflowStep.create({
      ...data,
      stepNumber,
    });

    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow step:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'Ce numero d\'etape existe deja pour ce type de workflow' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'etape' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour une etape
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'ID de l\'etape requis' },
        { status: 400 }
      );
    }

    const step = await WorkflowStep.findByPk(data.id);
    if (!step) {
      return NextResponse.json(
        { error: 'Etape non trouvee' },
        { status: 404 }
      );
    }

    await step.update(data);

    return NextResponse.json(step);
  } catch (error) {
    console.error('Error updating workflow step:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'etape' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une etape
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'etape requis' },
        { status: 400 }
      );
    }

    const step = await WorkflowStep.findByPk(id);
    if (!step) {
      return NextResponse.json(
        { error: 'Etape non trouvee' },
        { status: 404 }
      );
    }

    // Supprimer l'etape
    await step.destroy();

    // Reordonner les etapes restantes
    const remainingSteps = await WorkflowStep.findAll({
      where: { workflowType: step.workflowType },
      order: [['stepNumber', 'ASC']],
    });

    for (let i = 0; i < remainingSteps.length; i++) {
      await remainingSteps[i].update({ stepNumber: i + 1 });
    }

    return NextResponse.json({ message: 'Etape supprimee avec succes' });
  } catch (error) {
    console.error('Error deleting workflow step:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'etape' },
      { status: 500 }
    );
  }
}
