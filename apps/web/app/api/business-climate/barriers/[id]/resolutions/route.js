import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import {
  BusinessBarrier,
  BarrierResolution,
} from '../../../../../../models/index.js';

// POST /api/business-climate/barriers/[id]/resolutions - Add a resolution/action
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if barrier exists
    const barrier = await BusinessBarrier.findByPk(id);
    if (!barrier) {
      return NextResponse.json({ error: 'Obstacle non trouvé' }, { status: 404 });
    }

    const {
      actionType,
      description,
      newStatus,
      contactName,
      contactOrganization,
      contactEmail,
      followUpDate,
      outcome,
      isInternal,
    } = body;

    // Validate required fields
    if (!actionType || !description) {
      return NextResponse.json(
        { error: 'Type d\'action et description sont requis' },
        { status: 400 }
      );
    }

    // For STATUS_CHANGE, newStatus is required
    if (actionType === 'STATUS_CHANGE' && !newStatus) {
      return NextResponse.json(
        { error: 'Le nouveau statut est requis pour un changement de statut' },
        { status: 400 }
      );
    }

    // Create resolution entry
    const resolution = await BarrierResolution.create({
      barrierId: id,
      actionType,
      description,
      previousStatus: actionType === 'STATUS_CHANGE' ? barrier.status : null,
      newStatus: actionType === 'STATUS_CHANGE' ? newStatus : null,
      contactName: contactName || null,
      contactOrganization: contactOrganization || null,
      contactEmail: contactEmail || null,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      outcome: outcome || null,
      isInternal: isInternal || false,
      performedById: session.user.id,
      actionDate: new Date(),
    });

    // Update barrier status if it's a status change
    if (actionType === 'STATUS_CHANGE' && newStatus) {
      const updateData = { status: newStatus };

      // Update specific dates based on status
      if (newStatus === 'ACKNOWLEDGED' && !barrier.acknowledgedAt) {
        updateData.acknowledgedAt = new Date();
      } else if (newStatus === 'RESOLVED' && !barrier.resolvedAt) {
        updateData.resolvedAt = new Date();
        updateData.resolvedById = session.user.id;
      } else if (newStatus === 'CLOSED' && !barrier.closedAt) {
        updateData.closedAt = new Date();
      }

      await barrier.update(updateData);
    }

    return NextResponse.json(resolution, { status: 201 });
  } catch (error) {
    console.error('Error adding resolution:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'action', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/business-climate/barriers/[id]/resolutions - Get all resolutions for a barrier
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const resolutions = await BarrierResolution.findAll({
      where: { barrierId: id },
      order: [['actionDate', 'DESC']],
    });

    return NextResponse.json(resolutions);
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des actions', details: error.message },
      { status: 500 }
    );
  }
}
