import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { WorkSchedule, Employee, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des horaires de travail
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const schedules = await WorkSchedule.findAll({
      where: { isActive: true },
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [['isDefault', 'DESC'], ['name', 'ASC']],
    });

    // Compter les employés par horaire
    const schedulesWithCount = await Promise.all(
      schedules.map(async (schedule) => {
        const employeeCount = await Employee.count({
          where: { workScheduleId: schedule.id },
        });
        return {
          ...schedule.toJSON(),
          employeeCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: schedulesWithCount,
    });
  } catch (error) {
    console.error('Error fetching work schedules:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des horaires', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un horaire de travail
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Le nom de l\'horaire est obligatoire' },
        { status: 400 }
      );
    }

    // Si c'est l'horaire par défaut, retirer le statut des autres
    if (body.isDefault) {
      await WorkSchedule.update(
        { isDefault: false },
        { where: { isDefault: true } }
      );
    }

    // Calculer les heures hebdomadaires
    let weeklyHours = 0;
    let workingDays = 0;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      if (body[`${day}WorkHours`]) {
        weeklyHours += parseFloat(body[`${day}WorkHours`]);
        workingDays++;
      } else if (body[`${day}Start`] && body[`${day}End`]) {
        const start = new Date(`2000-01-01T${body[`${day}Start`]}`);
        const end = new Date(`2000-01-01T${body[`${day}End`]}`);
        let hours = (end - start) / (1000 * 60 * 60);

        if (body[`${day}BreakStart`] && body[`${day}BreakEnd`]) {
          const breakStart = new Date(`2000-01-01T${body[`${day}BreakStart`]}`);
          const breakEnd = new Date(`2000-01-01T${body[`${day}BreakEnd`]}`);
          hours -= (breakEnd - breakStart) / (1000 * 60 * 60);
        }

        weeklyHours += hours;
        workingDays++;
      }
    });

    const schedule = await WorkSchedule.create({
      name: body.name,
      description: body.description,
      isDefault: body.isDefault || false,
      // Horaires par jour
      mondayStart: body.mondayStart,
      mondayEnd: body.mondayEnd,
      mondayBreakStart: body.mondayBreakStart,
      mondayBreakEnd: body.mondayBreakEnd,
      mondayWorkHours: body.mondayWorkHours,
      tuesdayStart: body.tuesdayStart,
      tuesdayEnd: body.tuesdayEnd,
      tuesdayBreakStart: body.tuesdayBreakStart,
      tuesdayBreakEnd: body.tuesdayBreakEnd,
      tuesdayWorkHours: body.tuesdayWorkHours,
      wednesdayStart: body.wednesdayStart,
      wednesdayEnd: body.wednesdayEnd,
      wednesdayBreakStart: body.wednesdayBreakStart,
      wednesdayBreakEnd: body.wednesdayBreakEnd,
      wednesdayWorkHours: body.wednesdayWorkHours,
      thursdayStart: body.thursdayStart,
      thursdayEnd: body.thursdayEnd,
      thursdayBreakStart: body.thursdayBreakStart,
      thursdayBreakEnd: body.thursdayBreakEnd,
      thursdayWorkHours: body.thursdayWorkHours,
      fridayStart: body.fridayStart,
      fridayEnd: body.fridayEnd,
      fridayBreakStart: body.fridayBreakStart,
      fridayBreakEnd: body.fridayBreakEnd,
      fridayWorkHours: body.fridayWorkHours,
      saturdayStart: body.saturdayStart,
      saturdayEnd: body.saturdayEnd,
      saturdayBreakStart: body.saturdayBreakStart,
      saturdayBreakEnd: body.saturdayBreakEnd,
      saturdayWorkHours: body.saturdayWorkHours,
      sundayStart: body.sundayStart,
      sundayEnd: body.sundayEnd,
      sundayBreakStart: body.sundayBreakStart,
      sundayBreakEnd: body.sundayBreakEnd,
      sundayWorkHours: body.sundayWorkHours,
      // Totaux
      weeklyHours,
      workingDays,
      // Tolérances
      lateToleranceMinutes: body.lateToleranceMinutes || 15,
      earlyLeaveToleranceMinutes: body.earlyLeaveToleranceMinutes || 15,
      // Heures supplémentaires
      overtimeThreshold: body.overtimeThreshold || 8,
      regularOvertimeRate: body.regularOvertimeRate || 1.5,
      weekendOvertimeRate: body.weekendOvertimeRate || 2.0,
      holidayOvertimeRate: body.holidayOvertimeRate || 2.5,
      nightOvertimeRate: body.nightOvertimeRate || 1.75,
      nightStartTime: body.nightStartTime || '22:00',
      nightEndTime: body.nightEndTime || '06:00',
      createdById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: schedule,
      message: 'Horaire de travail créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating work schedule:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'horaire', details: error.message },
      { status: 500 }
    );
  }
}
