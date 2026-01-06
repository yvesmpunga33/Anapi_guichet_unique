import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Attendance, Employee, Leave, User, HRDepartment } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des présences
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const employeeId = searchParams.get('employeeId');
    const departmentId = searchParams.get('departmentId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const where = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (date) {
      where.date = date;
    } else if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.date = { [Op.lte]: endDate };
    }

    if (status) {
      where.status = status;
    }

    const employeeWhere = {};
    if (departmentId) {
      employeeWhere.departmentId = departmentId;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          where: Object.keys(employeeWhere).length > 0 ? employeeWhere : undefined,
          attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'departmentId'],
          include: [
            { model: HRDepartment, as: 'department', attributes: ['id', 'name'] },
          ],
        },
        { model: Leave, as: 'leave', attributes: ['id', 'leaveTypeId', 'startDate', 'endDate'] },
        { model: User, as: 'validatedBy', attributes: ['id', 'name'] },
      ],
      limit,
      offset,
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      distinct: true,
    });

    // Statistiques du jour si date spécifiée
    let dailyStats = null;
    if (date) {
      const allForDate = await Attendance.findAll({
        where: { date },
        attributes: ['status'],
      });

      dailyStats = {
        total: allForDate.length,
        present: allForDate.filter(a => a.status === 'PRESENT').length,
        absent: allForDate.filter(a => a.status === 'ABSENT').length,
        late: allForDate.filter(a => a.status === 'LATE').length,
        onLeave: allForDate.filter(a => a.status === 'ON_LEAVE').length,
        remote: allForDate.filter(a => a.status === 'REMOTE').length,
        mission: allForDate.filter(a => a.status === 'MISSION').length,
        sick: allForDate.filter(a => a.status === 'SICK').length,
      };
    }

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      dailyStats,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des présences', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Enregistrer une présence
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.employeeId || !body.date) {
      return NextResponse.json(
        { error: 'L\'employé et la date sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que l'employé existe
    const employee = await Employee.findByPk(body.employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 });
    }

    // Vérifier s'il existe déjà une entrée pour cette date
    const existing = await Attendance.findOne({
      where: { employeeId: body.employeeId, date: body.date },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Une entrée de présence existe déjà pour cet employé à cette date' },
        { status: 400 }
      );
    }

    // Calculer les heures travaillées si check-in et check-out fournis
    let workingHours = null;
    let breakHours = null;

    if (body.checkIn && body.checkOut) {
      const checkIn = new Date(`2000-01-01T${body.checkIn}`);
      const checkOut = new Date(`2000-01-01T${body.checkOut}`);
      const totalMinutes = (checkOut - checkIn) / (1000 * 60);

      if (body.breakStart && body.breakEnd) {
        const breakStart = new Date(`2000-01-01T${body.breakStart}`);
        const breakEnd = new Date(`2000-01-01T${body.breakEnd}`);
        breakHours = (breakEnd - breakStart) / (1000 * 60 * 60);
        workingHours = (totalMinutes / 60) - breakHours;
      } else {
        workingHours = totalMinutes / 60;
      }
    }

    const attendance = await Attendance.create({
      employeeId: body.employeeId,
      date: body.date,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      breakStart: body.breakStart,
      breakEnd: body.breakEnd,
      workingHours: workingHours ? workingHours.toFixed(2) : null,
      breakHours: breakHours ? breakHours.toFixed(2) : null,
      overtimeHours: body.overtimeHours || 0,
      status: body.status || 'PRESENT',
      lateMinutes: body.lateMinutes || 0,
      earlyLeaveMinutes: body.earlyLeaveMinutes || 0,
      workLocation: body.workLocation || 'OFFICE',
      locationDetails: body.locationDetails,
      checkInLatitude: body.checkInLatitude,
      checkInLongitude: body.checkInLongitude,
      absenceReason: body.absenceReason,
      isJustified: body.isJustified || false,
      justificationDocument: body.justificationDocument,
      leaveId: body.leaveId,
      notes: body.notes,
      source: body.source || 'MANUAL',
    });

    return NextResponse.json({
      success: true,
      data: attendance,
      message: 'Présence enregistrée avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la présence', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mise à jour en masse (check-in/check-out)
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { action, employeeId, date } = body;

    if (!action || !employeeId) {
      return NextResponse.json(
        { error: 'Action et employé obligatoires' },
        { status: 400 }
      );
    }

    const today = date || new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    let attendance = await Attendance.findOne({
      where: { employeeId, date: today },
    });

    if (action === 'CHECK_IN') {
      if (attendance) {
        return NextResponse.json({ error: 'Check-in déjà effectué' }, { status: 400 });
      }

      attendance = await Attendance.create({
        employeeId,
        date: today,
        checkIn: currentTime,
        status: 'PRESENT',
        source: 'MANUAL',
      });
    } else if (action === 'CHECK_OUT') {
      if (!attendance) {
        return NextResponse.json({ error: 'Aucun check-in trouvé pour aujourd\'hui' }, { status: 400 });
      }

      if (attendance.checkOut) {
        return NextResponse.json({ error: 'Check-out déjà effectué' }, { status: 400 });
      }

      // Calculer les heures
      const checkIn = new Date(`2000-01-01T${attendance.checkIn}`);
      const checkOut = new Date(`2000-01-01T${currentTime}`);
      const workingHours = (checkOut - checkIn) / (1000 * 60 * 60);

      await attendance.update({
        checkOut: currentTime,
        workingHours: workingHours.toFixed(2),
        checkOutLatitude: body.latitude,
        checkOutLongitude: body.longitude,
      });
    } else if (action === 'BREAK_START') {
      if (!attendance) {
        return NextResponse.json({ error: 'Aucun check-in trouvé' }, { status: 400 });
      }
      await attendance.update({ breakStart: currentTime });
    } else if (action === 'BREAK_END') {
      if (!attendance || !attendance.breakStart) {
        return NextResponse.json({ error: 'Aucune pause en cours' }, { status: 400 });
      }
      const breakStart = new Date(`2000-01-01T${attendance.breakStart}`);
      const breakEnd = new Date(`2000-01-01T${currentTime}`);
      const breakHours = (breakEnd - breakStart) / (1000 * 60 * 60);

      await attendance.update({
        breakEnd: currentTime,
        breakHours: breakHours.toFixed(2),
      });
    }

    return NextResponse.json({
      success: true,
      data: attendance,
      message: `${action} effectué avec succès`,
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour', details: error.message },
      { status: 500 }
    );
  }
}
