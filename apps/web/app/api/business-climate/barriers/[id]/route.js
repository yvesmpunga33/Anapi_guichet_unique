import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  BusinessBarrier,
  BarrierResolution,
  Investor,
  Investment,
} from '../../../../../models/index.js';

// GET /api/business-climate/barriers/[id] - Get barrier details
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const barrier = await BusinessBarrier.findByPk(id, {
      include: [
        { model: Investor, as: 'investor', attributes: ['id', 'name', 'country', 'email', 'phone'] },
        { model: Investment, as: 'project', attributes: ['id', 'projectCode', 'projectName', 'sector'] },
        {
          model: BarrierResolution,
          as: 'resolutions',
          order: [['actionDate', 'DESC']],
        },
      ],
    });

    if (!barrier) {
      return NextResponse.json({ error: 'Obstacle non trouvé' }, { status: 404 });
    }

    return NextResponse.json(barrier);
  } catch (error) {
    console.error('Error fetching barrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'obstacle', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/business-climate/barriers/[id] - Update barrier
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const barrier = await BusinessBarrier.findByPk(id);
    if (!barrier) {
      return NextResponse.json({ error: 'Obstacle non trouvé' }, { status: 404 });
    }

    const previousStatus = barrier.status;

    // Update barrier
    await barrier.update({
      title: body.title || barrier.title,
      description: body.description || barrier.description,
      category: body.category || barrier.category,
      severity: body.severity || body.priority || barrier.severity,
      status: body.status || barrier.status,
      sector: body.sector !== undefined ? body.sector : barrier.sector,
      province: body.province !== undefined ? body.province : barrier.province,
      concernedAdministration: body.concernedAdministration || body.administrationConcerned || barrier.concernedAdministration,
      reporterName: body.reporterName || body.contactPerson || barrier.reporterName,
      reporterEmail: body.reporterEmail || body.contactEmail || barrier.reporterEmail,
      reporterPhone: body.reporterPhone || body.contactPhone || barrier.reporterPhone,
      estimatedImpact: body.estimatedImpact !== undefined ? parseFloat(body.estimatedImpact) || null : barrier.estimatedImpact,
      internalNotes: body.internalNotes !== undefined ? body.internalNotes : barrier.internalNotes,
      resolution: body.resolution !== undefined ? body.resolution : barrier.resolution,
      resolutionType: body.resolutionType !== undefined ? body.resolutionType : barrier.resolutionType,
      assignedToId: body.assignedToId !== undefined ? body.assignedToId : barrier.assignedToId,
    });

    // Create resolution entry if status changed
    if (body.status && body.status !== previousStatus) {
      await BarrierResolution.create({
        barrierId: barrier.id,
        actionType: 'STATUS_CHANGE',
        description: body.statusChangeReason || `Statut changé de ${previousStatus} à ${body.status}`,
        previousStatus,
        newStatus: body.status,
        performedById: session.user.id,
        actionDate: new Date(),
      });

      // Update specific dates based on status
      if (body.status === 'ACKNOWLEDGED' && !barrier.acknowledgedAt) {
        await barrier.update({ acknowledgedAt: new Date() });
      } else if (body.status === 'RESOLVED' && !barrier.resolvedAt) {
        await barrier.update({
          resolvedAt: new Date(),
          resolvedById: session.user.id,
        });
      } else if (body.status === 'CLOSED' && !barrier.closedAt) {
        await barrier.update({ closedAt: new Date() });
      }
    }

    // Reload with associations
    await barrier.reload({
      include: [
        { model: Investor, as: 'investor' },
        { model: Investment, as: 'project' },
        { model: BarrierResolution, as: 'resolutions' },
      ],
    });

    return NextResponse.json(barrier);
  } catch (error) {
    console.error('Error updating barrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'obstacle', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/business-climate/barriers/[id] - Delete barrier
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const barrier = await BusinessBarrier.findByPk(id);
    if (!barrier) {
      return NextResponse.json({ error: 'Obstacle non trouvé' }, { status: 404 });
    }

    // Delete associated resolutions first
    await BarrierResolution.destroy({ where: { barrierId: id } });

    // Delete barrier
    await barrier.destroy();

    return NextResponse.json({ success: true, message: 'Obstacle supprimé' });
  } catch (error) {
    console.error('Error deleting barrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'obstacle', details: error.message },
      { status: 500 }
    );
  }
}
