import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { ProjectHistory, Investment } from '../../../../../../models/index.js';

// GET - Liste de l'historique d'un projet
export async function GET(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;

    // Verifier que le projet existe
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const action = searchParams.get('action');

    // Build where clause
    const where = { projectId: id };
    if (action) {
      where.action = action;
    }

    const { count, rows: history } = await ProjectHistory.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return NextResponse.json({
      history,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + history.length < count,
      },
    });
  } catch (error) {
    console.error('Error fetching project history:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'historique' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une entree dans l'historique
export async function POST(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;

    // Verifier que le projet existe
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      action,
      previousStatus,
      newStatus,
      fieldChanged,
      previousValue,
      newValue,
      description,
      metadata,
    } = body;

    // Validation de l'action
    const validActions = [
      'CREATED', 'UPDATED', 'STATUS_CHANGED', 'DOCUMENT_UPLOADED',
      'DOCUMENT_DELETED', 'INVESTOR_CHANGED', 'AMOUNT_UPDATED',
      'APPROVED', 'REJECTED', 'STARTED', 'COMPLETED', 'CANCELLED',
      'COMMENT_ADDED', 'MILESTONE_REACHED'
    ];

    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }

    // Get IP address from request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    const historyEntry = await ProjectHistory.create({
      projectId: id,
      action,
      previousStatus,
      newStatus,
      fieldChanged,
      previousValue,
      newValue,
      description,
      metadata: metadata || {},
      performedById: session?.user?.id || null,
      performedByName: session?.user?.name || 'Systeme',
      ipAddress,
    });

    return NextResponse.json(historyEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating history entry:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'entree d\'historique' },
      { status: 500 }
    );
  }
}
