import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { PublicHoliday, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des jours fériés
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear();

    const where = {
      isActive: true,
      [Op.or]: [
        { isRecurring: true },
        sequelize.where(
          sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date"')),
          year
        ),
      ],
    };

    const holidays = await PublicHoliday.findAll({
      where,
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [['date', 'ASC']],
    });

    // Mapper les jours récurrents à l'année demandée
    const mappedHolidays = holidays.map(holiday => {
      const h = holiday.toJSON();
      if (h.isRecurring && h.recurringMonth && h.recurringDay) {
        h.date = `${year}-${h.recurringMonth.toString().padStart(2, '0')}-${h.recurringDay.toString().padStart(2, '0')}`;
      }
      return h;
    });

    // Trier par date
    mappedHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));

    return NextResponse.json({
      success: true,
      data: mappedHolidays,
      year: parseInt(year),
    });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des jours fériés', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un jour férié
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.name || !body.date) {
      return NextResponse.json(
        { error: 'Le nom et la date sont obligatoires' },
        { status: 400 }
      );
    }

    const dateObj = new Date(body.date);
    const recurringMonth = body.isRecurring ? dateObj.getMonth() + 1 : null;
    const recurringDay = body.isRecurring ? dateObj.getDate() : null;

    const holiday = await PublicHoliday.create({
      name: body.name,
      date: body.date,
      type: body.type || 'NATIONAL',
      isRecurring: body.isRecurring || false,
      recurringMonth,
      recurringDay,
      isPaid: body.isPaid !== false,
      overtimeRate: body.overtimeRate || 2.0,
      description: body.description,
      createdById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: holiday,
      message: 'Jour férié créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating holiday:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du jour férié', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un jour férié
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const holiday = await PublicHoliday.findByPk(id);
    if (!holiday) {
      return NextResponse.json({ error: 'Jour férié non trouvé' }, { status: 404 });
    }

    await holiday.update({ isActive: false });

    return NextResponse.json({
      success: true,
      message: 'Jour férié supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression', details: error.message },
      { status: 500 }
    );
  }
}
