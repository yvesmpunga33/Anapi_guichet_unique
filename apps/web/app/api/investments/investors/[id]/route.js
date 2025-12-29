import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import Investor from '../../../../../models/Investor.js';

// GET - Obtenir un investisseur par ID
export async function GET(request, { params }) {
  try {
    const session = await auth();
    console.log('[API Investor Detail] Session:', session ? 'authenticated' : 'null');

    // Temporairement desactive pour dev
    // if (!session) {
    //   return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    // }

    const { id } = await params;

    const investor = await Investor.findByPk(id);

    if (!investor) {
      return NextResponse.json(
        { error: 'Investisseur non trouve' },
        { status: 404 }
      );
    }

    // Calculate totals (sans investments pour l'instant)
    const investorData = investor.toJSON();

    const stats = {
      totalInvestments: 0,
      totalAmount: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalJobsCreated: 0,
    };

    return NextResponse.json({
      ...investorData,
      investments: [],
      stats,
    });
  } catch (error) {
    console.error('Error fetching investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'investisseur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un investisseur
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    console.log('[API Investor Update] Session:', session ? 'authenticated' : 'null');

    // Temporairement desactive pour dev
    // if (!session) {
    //   return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    // }

    const { id } = await params;
    const body = await request.json();

    const investor = await Investor.findByPk(id);

    if (!investor) {
      return NextResponse.json(
        { error: 'Investisseur non trouve' },
        { status: 404 }
      );
    }

    // Fields that can be updated
    const allowedFields = [
      'name',
      'type',
      'category',
      'country',
      'province',
      'city',
      'address',
      'email',
      'phone',
      'website',
      'contactPerson',
      'contactPosition',
      'contactEmail',
      'contactPhone',
      'rccm',
      'idNat',
      'nif',
      'status',
      'isVerified',
      'description',
    ];

    // Filter body to only include allowed fields
    const updateData = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await investor.update(updateData);

    // Fetch updated investor
    const updatedInvestor = await Investor.findByPk(id);

    return NextResponse.json({
      ...updatedInvestor.toJSON(),
      investments: [],
    });
  } catch (error) {
    console.error('Error updating investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'investisseur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un investisseur
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    console.log('[API Investor Delete] Session:', session ? 'authenticated' : 'null');

    // Temporairement desactive pour dev
    // if (!session) {
    //   return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    // }

    const { id } = await params;

    const investor = await Investor.findByPk(id);

    if (!investor) {
      return NextResponse.json(
        { error: 'Investisseur non trouve' },
        { status: 404 }
      );
    }

    await investor.destroy();

    return NextResponse.json({
      message: 'Investisseur supprime avec succes',
      id,
    });
  } catch (error) {
    console.error('Error deleting investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'investisseur' },
      { status: 500 }
    );
  }
}
