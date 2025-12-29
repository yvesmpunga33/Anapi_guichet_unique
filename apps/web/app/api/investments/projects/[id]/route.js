import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import Investment from '../../../../../models/Investment.js';
import Investor from '../../../../../models/Investor.js';

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
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
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
