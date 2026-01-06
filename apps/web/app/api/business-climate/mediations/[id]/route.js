import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  MediationCase,
  BusinessBarrier,
  Investor,
  Investment,
  User,
} from '../../../../../models/index.js';

// GET /api/business-climate/mediations/[id] - Get a single mediation case
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const mediation = await MediationCase.findByPk(id, {
      include: [
        { model: Investor, as: 'investor', attributes: ['id', 'name', 'country'] },
        { model: Investment, as: 'project', attributes: ['id', 'projectCode', 'projectName'] },
        { model: User, as: 'mediator', attributes: ['id', 'name', 'email'] },
        { model: BusinessBarrier, as: 'barrier', attributes: ['id', 'reference', 'title'] },
      ],
    });

    if (!mediation) {
      return NextResponse.json({ error: 'Médiation non trouvée' }, { status: 404 });
    }

    return NextResponse.json(mediation);
  } catch (error) {
    console.error('Error fetching mediation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la médiation', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/business-climate/mediations/[id] - Update a mediation case
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const mediation = await MediationCase.findByPk(id);
    if (!mediation) {
      return NextResponse.json({ error: 'Médiation non trouvée' }, { status: 404 });
    }

    const {
      title,
      description,
      disputeType,
      status,
      priority,
      respondentName,
      respondentType,
      respondentContact,
      disputedAmount,
      currency,
      mediatorId,
      firstSessionAt,
      outcome,
      agreementSummary,
      internalNotes,
    } = body;

    await mediation.update({
      title: title || mediation.title,
      description: description || mediation.description,
      disputeType: disputeType || mediation.disputeType,
      status: status || mediation.status,
      priority: priority || mediation.priority,
      respondentName: respondentName !== undefined ? respondentName : mediation.respondentName,
      respondentType: respondentType !== undefined ? respondentType : mediation.respondentType,
      respondentContact: respondentContact !== undefined ? respondentContact : mediation.respondentContact,
      disputedAmount: disputedAmount !== undefined ? disputedAmount : mediation.disputedAmount,
      currency: currency || mediation.currency,
      mediatorId: mediatorId !== undefined ? mediatorId : mediation.mediatorId,
      firstSessionAt: firstSessionAt ? new Date(firstSessionAt) : mediation.firstSessionAt,
      outcome: outcome !== undefined ? outcome : mediation.outcome,
      agreementSummary: agreementSummary !== undefined ? agreementSummary : mediation.agreementSummary,
      internalNotes: internalNotes !== undefined ? internalNotes : mediation.internalNotes,
    });

    // Update dates based on status changes
    if (status === 'ACCEPTED' && !mediation.acceptedAt) {
      await mediation.update({ acceptedAt: new Date() });
    } else if ((status === 'AGREEMENT_REACHED' || status === 'CLOSED') && !mediation.closedAt) {
      await mediation.update({ closedAt: new Date() });
    }

    return NextResponse.json(mediation);
  } catch (error) {
    console.error('Error updating mediation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la médiation', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/business-climate/mediations/[id] - Delete a mediation case
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const mediation = await MediationCase.findByPk(id);
    if (!mediation) {
      return NextResponse.json({ error: 'Médiation non trouvée' }, { status: 404 });
    }

    await mediation.destroy();

    return NextResponse.json({ message: 'Médiation supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting mediation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la médiation', details: error.message },
      { status: 500 }
    );
  }
}
