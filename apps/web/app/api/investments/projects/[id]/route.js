import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import Investment from '../../../../../models/Investment.js';
import Investor from '../../../../../models/Investor.js';
import ProjectHistory from '../../../../../models/ProjectHistory.js';

// Helper pour enregistrer dans l'historique
async function logHistory(projectId, action, data, session, request) {
  try {
    const forwardedFor = request?.headers?.get?.('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    await ProjectHistory.create({
      projectId,
      action,
      ...data,
      performedById: session?.user?.id || null,
      performedByName: session?.user?.name || 'Systeme',
      ipAddress,
    });
  } catch (err) {
    console.error('Error logging history:', err);
  }
}

// GET - Obtenir un projet par ID
export async function GET(request, { params }) {
  try {
    const session = await auth();
    console.log('[API Project Detail] Session:', session ? 'authenticated' : 'null');

    const { id } = await params;

    const project = await Investment.findByPk(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const projectData = project.toJSON();

    // Get investor info if exists
    let investor = null;
    if (projectData.investorId) {
      investor = await Investor.findByPk(projectData.investorId);
      if (investor) {
        investor = investor.toJSON();
      }
    }

    return NextResponse.json({
      ...projectData,
      investor,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du projet' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un projet
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    console.log('[API Project Update] Session:', session ? 'authenticated' : 'null');

    const { id } = await params;
    const body = await request.json();

    const project = await Investment.findByPk(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const previousData = project.toJSON();

    // Fields that can be updated
    const allowedFields = [
      'projectName',
      'description',
      'investorId',
      'sector',
      'subSector',
      'province',
      'city',
      'address',
      'amount',
      'currency',
      'jobsCreated',
      'jobsIndirect',
      'startDate',
      'endDate',
      'status',
      'progress',
    ];

    const updateData = {};
    const changedFields = [];
    for (const field of allowedFields) {
      if (body[field] !== undefined && body[field] !== previousData[field]) {
        updateData[field] = body[field];
        changedFields.push({
          field,
          previousValue: previousData[field],
          newValue: body[field],
        });
      }
    }

    // Handle status changes
    if (body.status === 'APPROVED' && project.status !== 'APPROVED') {
      updateData.approvalDate = new Date();
      updateData.approvedBy = session?.user?.id || null;
    }
    if (body.status === 'REJECTED' && project.status !== 'REJECTED') {
      updateData.rejectionDate = new Date();
      updateData.rejectedBy = session?.user?.id || null;
      updateData.rejectionReason = body.rejectionReason || null;
    }

    await project.update(updateData);

    // Log history entries for important changes
    if (changedFields.length > 0) {
      // Check for status change
      const statusChange = changedFields.find(c => c.field === 'status');
      if (statusChange) {
        let action = 'STATUS_CHANGED';
        if (statusChange.newValue === 'APPROVED') action = 'APPROVED';
        else if (statusChange.newValue === 'REJECTED') action = 'REJECTED';
        else if (statusChange.newValue === 'IN_PROGRESS') action = 'STARTED';
        else if (statusChange.newValue === 'COMPLETED') action = 'COMPLETED';
        else if (statusChange.newValue === 'CANCELLED') action = 'CANCELLED';

        await logHistory(id, action, {
          previousStatus: statusChange.previousValue,
          newStatus: statusChange.newValue,
          description: `Statut change de ${statusChange.previousValue || 'N/A'} a ${statusChange.newValue}`,
        }, session, request);
      }

      // Check for amount change
      const amountChange = changedFields.find(c => c.field === 'amount');
      if (amountChange) {
        await logHistory(id, 'AMOUNT_UPDATED', {
          fieldChanged: 'amount',
          previousValue: String(amountChange.previousValue),
          newValue: String(amountChange.newValue),
          description: `Montant modifie de ${amountChange.previousValue} a ${amountChange.newValue} ${updateData.currency || previousData.currency || 'USD'}`,
        }, session, request);
      }

      // Check for investor change
      const investorChange = changedFields.find(c => c.field === 'investorId');
      if (investorChange) {
        await logHistory(id, 'INVESTOR_CHANGED', {
          fieldChanged: 'investorId',
          previousValue: investorChange.previousValue,
          newValue: investorChange.newValue,
          description: 'Investisseur associe au projet modifie',
        }, session, request);
      }

      // Log general update for other changes
      const otherChanges = changedFields.filter(c => !['status', 'amount', 'investorId'].includes(c.field));
      if (otherChanges.length > 0) {
        await logHistory(id, 'UPDATED', {
          description: `Champs modifies: ${otherChanges.map(c => c.field).join(', ')}`,
          metadata: { changes: otherChanges },
        }, session, request);
      }
    }

    const updatedProject = await Investment.findByPk(id);

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du projet' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un projet
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    console.log('[API Project Delete] Session:', session ? 'authenticated' : 'null');

    const { id } = await params;

    const project = await Investment.findByPk(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    await project.destroy();

    return NextResponse.json({
      message: 'Projet supprime avec succes',
      id,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}
