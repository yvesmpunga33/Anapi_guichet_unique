import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Dossier, DossierDocument, Investor, User } from '../../../../../models/index.js';

// GET - Obtenir un dossier par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const dossier = await Dossier.findByPk(id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
        { model: Investor, as: 'investor' },
        {
          model: DossierDocument,
          as: 'documents',
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouve' },
        { status: 404 }
      );
    }

    return NextResponse.json({ dossier });
  } catch (error) {
    console.error('Error fetching dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du dossier' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre a jour un dossier
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;
    const data = await request.json();

    const dossier = await Dossier.findByPk(id);
    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouve' },
        { status: 404 }
      );
    }

    // Handle specific actions
    if (data.action === 'submit') {
      // Submit the dossier
      await dossier.update({
        status: 'SUBMITTED',
        submittedAt: new Date(),
      });
    } else if (data.action === 'assign') {
      // Assign to a user
      await dossier.update({
        assignedToId: data.assignedToId,
        assignedAt: new Date(),
        status: dossier.status === 'SUBMITTED' ? 'IN_REVIEW' : dossier.status,
      });
    } else if (data.action === 'approve') {
      await dossier.update({
        status: 'APPROVED',
        decisionDate: new Date(),
        decisionNote: data.decisionNote || null,
      });
    } else if (data.action === 'reject') {
      await dossier.update({
        status: 'REJECTED',
        decisionDate: new Date(),
        decisionNote: data.decisionNote || null,
      });
    } else if (data.action === 'request_documents') {
      await dossier.update({
        status: 'PENDING_DOCUMENTS',
        decisionNote: data.decisionNote || 'Documents supplementaires requis',
      });
    } else {
      // General update
      const updateData = {};

      // Investor info
      if (data.investorName !== undefined) updateData.investorName = data.investorName;
      if (data.investorType !== undefined) updateData.investorType = data.investorType;
      if (data.rccm !== undefined) updateData.rccm = data.rccm;
      if (data.idNat !== undefined) updateData.idNat = data.idNat;
      if (data.nif !== undefined) updateData.nif = data.nif;
      if (data.email !== undefined) updateData.investorEmail = data.email;
      if (data.phone !== undefined) updateData.investorPhone = data.phone;
      if (data.province !== undefined) updateData.investorProvince = data.province;
      if (data.city !== undefined) updateData.investorCity = data.city;
      if (data.address !== undefined) updateData.investorAddress = data.address;

      // Project info
      if (data.projectName !== undefined) updateData.projectName = data.projectName;
      if (data.projectDescription !== undefined) updateData.projectDescription = data.projectDescription;
      if (data.sector !== undefined) updateData.sector = data.sector;
      if (data.subSector !== undefined) updateData.subSector = data.subSector;
      if (data.projectProvince !== undefined) updateData.projectProvince = data.projectProvince;
      if (data.projectCity !== undefined) updateData.projectCity = data.projectCity;
      if (data.projectAddress !== undefined) updateData.projectAddress = data.projectAddress;

      // Financial info
      if (data.investmentAmount !== undefined) {
        updateData.investmentAmount = parseFloat(String(data.investmentAmount).replace(/[^0-9.-]/g, '')) || 0;
      }
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.directJobs !== undefined) updateData.directJobs = parseInt(data.directJobs) || 0;
      if (data.indirectJobs !== undefined) updateData.indirectJobs = parseInt(data.indirectJobs) || 0;
      if (data.startDate !== undefined) updateData.startDate = data.startDate || null;
      if (data.endDate !== undefined) updateData.endDate = data.endDate || null;

      // Status
      if (data.status !== undefined) updateData.status = data.status;

      await dossier.update(updateData);
    }

    // Reload with associations
    await dossier.reload({
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: DossierDocument, as: 'documents' },
      ],
    });

    return NextResponse.json({ dossier });
  } catch (error) {
    console.error('Error updating dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du dossier' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un dossier
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const dossier = await Dossier.findByPk(id);
    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouve' },
        { status: 404 }
      );
    }

    // Only allow deletion of drafts
    if (dossier.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Seuls les brouillons peuvent etre supprimes' },
        { status: 400 }
      );
    }

    // Delete associated documents
    await DossierDocument.destroy({ where: { dossierId: id } });

    // Delete the dossier
    await dossier.destroy();

    return NextResponse.json({ message: 'Dossier supprime avec succes' });
  } catch (error) {
    console.error('Error deleting dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du dossier' },
      { status: 500 }
    );
  }
}
