import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { ApprovalRequest, Investor, User } from '../../../../../models/index.js';

// GET - Obtenir une demande d'agrement par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const agrement = await ApprovalRequest.findByPk(id, {
      include: [
        { model: Investor, as: 'investor' },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!agrement) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    return NextResponse.json({ agrement });
  } catch (error) {
    console.error('Error fetching agrement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la demande' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre a jour une demande d'agrement
export async function PATCH(request, { params }) {
  try {
    const _session = await auth();
    const { id } = await params;
    const data = await request.json();

    const agrement = await ApprovalRequest.findByPk(id, {
      include: [{ model: Investor, as: 'investor' }],
    });

    if (!agrement) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    // Handle specific actions
    if (data.action === 'submit') {
      await agrement.update({
        status: 'SUBMITTED',
        submittedAt: new Date(),
      });
    } else if (data.action === 'assign') {
      await agrement.update({
        assignedToId: data.assignedToId,
        assignedAt: new Date(),
        status: agrement.status === 'SUBMITTED' ? 'IN_REVIEW' : agrement.status,
      });
    } else if (data.action === 'approve') {
      await agrement.update({
        status: 'APPROVED',
        decisionDate: new Date(),
        decisionNote: data.decisionNote || null,
      });
    } else if (data.action === 'reject') {
      await agrement.update({
        status: 'REJECTED',
        decisionDate: new Date(),
        decisionNote: data.decisionNote || null,
      });
    } else {
      // General update
      const updateData = {};

      if (data.approvalType !== undefined) updateData.approvalType = data.approvalType;
      if (data.regime !== undefined) updateData.regime = data.regime;
      if (data.projectName !== undefined) updateData.projectName = data.projectName;
      if (data.projectDescription !== undefined) updateData.projectDescription = data.projectDescription;
      if (data.investmentAmount !== undefined) {
        updateData.investmentAmount = parseFloat(String(data.investmentAmount).replace(/[^0-9.-]/g, '')) || 0;
      }
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.directJobs !== undefined) {
        updateData.directJobs = parseInt(data.directJobs) || 0;
        updateData.jobsToCreate = (parseInt(data.directJobs) || 0) + (agrement.indirectJobs || 0);
      }
      if (data.indirectJobs !== undefined) {
        updateData.indirectJobs = parseInt(data.indirectJobs) || 0;
        updateData.jobsToCreate = (agrement.directJobs || 0) + (parseInt(data.indirectJobs) || 0);
      }
      if (data.province !== undefined) updateData.province = data.province;
      if (data.sector !== undefined) updateData.sector = data.sector;
      if (data.status !== undefined) updateData.status = data.status;

      await agrement.update(updateData);

      // Update investor if provided
      if (agrement.investor && (data.investorName || data.email || data.phone)) {
        await agrement.investor.update({
          name: data.investorName || agrement.investor.name,
          email: data.email || agrement.investor.email,
          phone: data.phone || agrement.investor.phone,
          province: data.investorProvince || agrement.investor.province,
          city: data.investorCity || agrement.investor.city,
          address: data.investorAddress || agrement.investor.address,
        });
      }
    }

    // Reload with associations
    await agrement.reload({
      include: [
        { model: Investor, as: 'investor' },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
      ],
    });

    return NextResponse.json({ agrement });
  } catch (error) {
    console.error('Error updating agrement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la demande' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une demande d'agrement
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const agrement = await ApprovalRequest.findByPk(id);
    if (!agrement) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    // Only allow deletion of drafts
    if (agrement.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Seuls les brouillons peuvent etre supprimes' },
        { status: 400 }
      );
    }

    await agrement.destroy();

    return NextResponse.json({ message: 'Demande supprimee avec succes' });
  } catch (error) {
    console.error('Error deleting agrement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la demande' },
      { status: 500 }
    );
  }
}
