import { NextResponse } from 'next/server';
import { LegalAlert, Contract, JuridicalText } from '../../../../../models/index.js';

// GET - Detail d'une alerte
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const alert = await LegalAlert.findByPk(id, {
      include: [
        { model: Contract, as: 'contract' },
        { model: JuridicalText, as: 'document' },
      ],
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alerte non trouvee' }, { status: 404 });
    }

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'alerte' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour une alerte (resolution, dismiss, etc.)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const alert = await LegalAlert.findByPk(id);
    if (!alert) {
      return NextResponse.json({ error: 'Alerte non trouvee' }, { status: 404 });
    }

    // Ajouter a l'historique des actions
    const actionHistory = alert.actionHistory || [];
    if (data.status && data.status !== alert.status) {
      actionHistory.push({
        action: data.status,
        date: new Date().toISOString(),
        note: data.note || null,
      });
      data.actionHistory = actionHistory;
    }

    // Marquer comme resolu si status RESOLVED
    if (data.status === 'RESOLVED' && !data.resolvedAt) {
      data.resolvedAt = new Date();
    }

    await alert.update(data);

    const result = await LegalAlert.findByPk(id, {
      include: [
        { model: Contract, as: 'contract' },
        { model: JuridicalText, as: 'document' },
      ],
    });

    return NextResponse.json({ alert: result });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'alerte' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une alerte
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const alert = await LegalAlert.findByPk(id);
    if (!alert) {
      return NextResponse.json({ error: 'Alerte non trouvee' }, { status: 404 });
    }

    await alert.destroy();

    return NextResponse.json({ message: 'Alerte supprimee avec succes' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'alerte' },
      { status: 500 }
    );
  }
}
