import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { ClimateIndicator, ClimateIndicatorValue } from '../../../../../../models/index.js';

// GET - List all values for an indicator
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const values = await ClimateIndicatorValue.findAll({
      where: { indicatorId: id },
      order: [['year', 'DESC'], ['quarter', 'DESC'], ['month', 'DESC']],
    });

    return NextResponse.json(values);
  } catch (error) {
    console.error('Error fetching indicator values:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des valeurs', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a new value
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify indicator exists
    const indicator = await ClimateIndicator.findByPk(id);
    if (!indicator) {
      return NextResponse.json({ error: 'Indicateur non trouve' }, { status: 404 });
    }

    // Check if value already exists for this period
    const existingValue = await ClimateIndicatorValue.findOne({
      where: {
        indicatorId: id,
        year: body.year,
        quarter: body.quarter || null,
        month: body.month || null,
      },
    });

    if (existingValue) {
      return NextResponse.json(
        { error: 'Une valeur existe deja pour cette periode' },
        { status: 400 }
      );
    }

    // Create the value
    const value = await ClimateIndicatorValue.create({
      indicatorId: id,
      year: body.year,
      quarter: body.quarter || null,
      month: body.month || null,
      value: body.value,
      previousValue: body.previousValue || null,
      changePercentage: body.changePercentage || null,
      rank: body.rank || null,
      rankOutOf: body.rankOutOf || null,
      source: body.source || null,
      notes: body.notes || null,
      isVerified: body.isVerified || false,
      recordedById: session.user.id,
    });

    // Update indicator's last updated timestamp
    await indicator.update({ updatedAt: new Date() });

    return NextResponse.json(value, { status: 201 });
  } catch (error) {
    console.error('Error creating indicator value:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la valeur', details: error.message },
      { status: 500 }
    );
  }
}
