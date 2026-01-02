import { NextResponse } from 'next/server';
import { MinistryRequest, MinistryRequestHistory, MinistryRequestDocument, MinistryWorkflow, Ministry, Investor } from '../../../../../models/index.js';
import { auth } from '../../../../lib/auth.js';

// GET - Détails d'une demande
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const ministryRequest = await MinistryRequest.findByPk(id, {
      include: [
        { model: Ministry, as: 'ministry' },
        { model: Investor, as: 'investor' },
        {
          model: MinistryRequestHistory,
          as: 'history',
          order: [['createdAt', 'DESC']],
        },
        {
          model: MinistryRequestDocument,
          as: 'documents',
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!ministryRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    // Récupérer les étapes du workflow
    const workflowSteps = await MinistryWorkflow.findAll({
      where: {
        ministryId: ministryRequest.ministryId,
        requestType: ministryRequest.requestType,
        isActive: true,
      },
      order: [['stepNumber', 'ASC']],
    });

    return NextResponse.json({
      success: true,
      data: ministryRequest,
      workflowSteps,
    });
  } catch (error) {
    console.error('Error fetching ministry request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une demande (action du ministère)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;
    const data = await request.json();

    const ministryRequest = await MinistryRequest.findByPk(id);

    if (!ministryRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    const previousStatus = ministryRequest.status;
    const updateData = {};
    let historyAction = 'STEP_COMPLETED';
    let historyComment = data.comment || null;

    // Traiter les différentes actions
    switch (data.action) {
      case 'APPROVE':
        // Passer à l'étape suivante ou approuver définitivement
        if (ministryRequest.currentStep >= ministryRequest.totalSteps) {
          updateData.status = 'APPROVED';
          updateData.decisionDate = new Date();
          updateData.decisionNote = data.comment;
          historyAction = 'APPROVED';
        } else {
          updateData.currentStep = ministryRequest.currentStep + 1;
          updateData.status = 'IN_PROGRESS';
          updateData.lastStepAt = new Date();
          historyAction = 'STEP_COMPLETED';
        }
        break;

      case 'REJECT':
        updateData.status = 'REJECTED';
        updateData.decisionDate = new Date();
        updateData.rejectionReason = data.reason || data.comment;
        historyAction = 'REJECTED';
        break;

      case 'HOLD':
        updateData.status = 'PENDING_DOCUMENTS';
        historyAction = 'DOCUMENTS_REQUESTED';
        break;

      case 'ASSIGN':
        updateData.assignedToId = data.assignedToId;
        updateData.assignedAt = new Date();
        updateData.status = 'IN_PROGRESS';
        historyAction = 'ASSIGNED';
        break;

      case 'CONTACT':
        historyAction = 'CONTACT_APPLICANT';
        // TODO: Envoyer email/notification
        break;

      case 'COMMENT':
        historyAction = 'COMMENT_ADDED';
        break;

      default:
        // Mise à jour simple des champs
        if (data.status) updateData.status = data.status;
        if (data.priority) updateData.priority = data.priority;
        if (data.currentStep) updateData.currentStep = data.currentStep;
    }

    await ministryRequest.update(updateData);

    // Récupérer l'étape actuelle du workflow
    const currentWorkflowStep = await MinistryWorkflow.findOne({
      where: {
        ministryId: ministryRequest.ministryId,
        requestType: ministryRequest.requestType,
        stepNumber: ministryRequest.currentStep,
      },
    });

    // Créer l'historique
    await MinistryRequestHistory.create({
      requestId: id,
      stepNumber: ministryRequest.currentStep,
      stepName: currentWorkflowStep?.stepName || `Etape ${ministryRequest.currentStep}`,
      action: historyAction,
      previousStatus,
      newStatus: ministryRequest.status,
      comment: historyComment,
      performedById: session?.user?.id,
      performedByName: session?.user?.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Demande mise a jour avec succes',
      data: ministryRequest,
    });
  } catch (error) {
    console.error('Error updating ministry request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une demande (brouillon uniquement)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const ministryRequest = await MinistryRequest.findByPk(id);

    if (!ministryRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    if (ministryRequest.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Seuls les brouillons peuvent etre supprimes' },
        { status: 400 }
      );
    }

    await ministryRequest.destroy();

    return NextResponse.json({
      success: true,
      message: 'Demande supprimee avec succes',
    });
  } catch (error) {
    console.error('Error deleting ministry request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression', details: error.message },
      { status: 500 }
    );
  }
}
