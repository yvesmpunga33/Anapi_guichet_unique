import { NextResponse } from 'next/server';
import { WorkflowStep } from '../../../../../models/index.js';

// POST - Reordonner les etapes
export async function POST(request) {
  try {
    const { steps } = await request.json();

    if (!steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Liste des etapes requise' },
        { status: 400 }
      );
    }

    // Mettre a jour l'ordre de chaque etape
    for (let i = 0; i < steps.length; i++) {
      await WorkflowStep.update(
        { stepNumber: i + 1 },
        { where: { id: steps[i].id } }
      );
    }

    return NextResponse.json({ message: 'Ordre mis a jour avec succes' });
  } catch (error) {
    console.error('Error reordering workflow steps:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la reordonnation des etapes' },
      { status: 500 }
    );
  }
}
