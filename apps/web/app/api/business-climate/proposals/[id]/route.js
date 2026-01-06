import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  LegalProposal,
  JuridicalText,
  User,
} from '../../../../../models/index.js';

// GET /api/business-climate/proposals/[id] - Get a single proposal
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const proposal = await LegalProposal.findByPk(id, {
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'approvedBy', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: JuridicalText, as: 'relatedText', attributes: ['id', 'reference', 'title', 'type'] },
      ],
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposition non trouvée' }, { status: 404 });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la proposition', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/business-climate/proposals/[id] - Update a proposal
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const proposal = await LegalProposal.findByPk(id);
    if (!proposal) {
      return NextResponse.json({ error: 'Proposition non trouvée' }, { status: 404 });
    }

    const {
      title,
      summary,
      fullText,
      proposalType,
      domain,
      status,
      priority,
      justification,
      expectedImpact,
      targetAuthority,
      targetedBarriers,
      relatedTextId,
      internalNotes,
      feedback,
      attachments,
    } = body;

    // Handle status changes
    let updateData = {
      title: title || proposal.title,
      summary: summary !== undefined ? summary : proposal.summary,
      fullText: fullText !== undefined ? fullText : proposal.fullText,
      proposalType: proposalType || proposal.proposalType,
      domain: domain || proposal.domain,
      status: status || proposal.status,
      priority: priority || proposal.priority,
      justification: justification !== undefined ? justification : proposal.justification,
      expectedImpact: expectedImpact !== undefined ? expectedImpact : proposal.expectedImpact,
      targetAuthority: targetAuthority !== undefined ? targetAuthority : proposal.targetAuthority,
      targetedBarriers: targetedBarriers || proposal.targetedBarriers,
      relatedTextId: relatedTextId !== undefined ? relatedTextId : proposal.relatedTextId,
      internalNotes: internalNotes !== undefined ? internalNotes : proposal.internalNotes,
      feedback: feedback !== undefined ? feedback : proposal.feedback,
      attachments: attachments || proposal.attachments,
    };

    // Track status changes
    if (status && status !== proposal.status) {
      if (status === 'SUBMITTED' && !proposal.submittedAt) {
        updateData.submittedAt = new Date();
      }
      if (status === 'FORWARDED' && !proposal.forwardedAt) {
        updateData.forwardedAt = new Date();
      }
      if (status === 'ADOPTED' && !proposal.adoptedAt) {
        updateData.adoptedAt = new Date();
      }
      if (status === 'APPROVED' && !proposal.approvedById) {
        updateData.approvedById = session.user.id;
      }
      if (feedback) {
        updateData.feedbackDate = new Date();
      }
    }

    await proposal.update(updateData);

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la proposition', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/business-climate/proposals/[id] - Delete a proposal
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const proposal = await LegalProposal.findByPk(id);
    if (!proposal) {
      return NextResponse.json({ error: 'Proposition non trouvée' }, { status: 404 });
    }

    // Only allow deletion of drafts
    if (proposal.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Seules les propositions en brouillon peuvent être supprimées' },
        { status: 400 }
      );
    }

    await proposal.destroy();

    return NextResponse.json({ message: 'Proposition supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la proposition', details: error.message },
      { status: 500 }
    );
  }
}
