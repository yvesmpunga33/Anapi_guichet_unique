import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Overtime, Employee, Payslip, User, HRDepartment, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des heures supplémentaires
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const employeeId = searchParams.get('employeeId');
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month'); // Format: YYYY-MM

    const where = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    } else if (month) {
      const [year, m] = month.split('-');
      const firstDay = new Date(year, parseInt(m) - 1, 1);
      const lastDay = new Date(year, parseInt(m), 0);
      where.date = { [Op.between]: [firstDay.toISOString().split('T')[0], lastDay.toISOString().split('T')[0]] };
    }

    const employeeWhere = {};
    if (departmentId) {
      employeeWhere.departmentId = departmentId;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Overtime.findAndCountAll({
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
        { model: User, as: 'requestedBy', attributes: ['id', 'name'] },
        { model: User, as: 'approvedBy', attributes: ['id', 'name'] },
        { model: Payslip, as: 'payslip', attributes: ['id', 'payslipNumber', 'month', 'year'] },
      ],
      limit,
      offset,
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      distinct: true,
    });

    // Statistiques
    const stats = await Overtime.findAll({
      where,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('hours')), 'totalHours'],
        [sequelize.fn('SUM', sequelize.col('compensation_amount')), 'totalCompensation'],
      ],
      group: ['status'],
    });

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching overtime:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des heures supplémentaires', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer une demande d'heures supplémentaires
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.employeeId || !body.date || !body.startTime || !body.endTime || !body.reason) {
      return NextResponse.json(
        { error: 'L\'employé, la date, les heures et la raison sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier que l'employé existe
    const employee = await Employee.findByPk(body.employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 });
    }

    // Calculer les heures
    const startTime = new Date(`2000-01-01T${body.startTime}`);
    const endTime = new Date(`2000-01-01T${body.endTime}`);
    let hours = (endTime - startTime) / (1000 * 60 * 60);

    // Si fin avant début, on suppose que c'est le lendemain
    if (hours < 0) {
      hours += 24;
    }

    // Déterminer le taux selon le type
    const rates = {
      REGULAR: 1.5,
      NIGHT: 1.75,
      WEEKEND: 2.0,
      HOLIDAY: 2.5,
      EMERGENCY: 2.0,
    };
    const rate = rates[body.type] || rates.REGULAR;

    const overtime = await Overtime.create({
      employeeId: body.employeeId,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      hours: hours.toFixed(2),
      type: body.type || 'REGULAR',
      rate,
      reason: body.reason,
      project: body.project,
      isPreApproved: body.isPreApproved || false,
      compensationType: body.compensationType || 'PAYMENT',
      notes: body.notes,
      requestedById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: overtime,
      message: 'Demande d\'heures supplémentaires créée avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating overtime:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Approuver/Rejeter des heures supplémentaires
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { ids, action, rejectionReason, hourlyRate } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs des demandes requis' }, { status: 400 });
    }

    if (!['APPROVE', 'REJECT', 'MARK_PAID'].includes(action)) {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }

    const overtimes = await Overtime.findAll({
      where: { id: { [Op.in]: ids } },
      include: [
        { model: Employee, as: 'employee' },
      ],
    });

    if (overtimes.length === 0) {
      return NextResponse.json({ error: 'Aucune demande trouvée' }, { status: 404 });
    }

    const results = [];

    for (const overtime of overtimes) {
      const updateData = {};

      if (action === 'APPROVE') {
        if (overtime.status !== 'PENDING') {
          results.push({ id: overtime.id, error: 'Demande déjà traitée' });
          continue;
        }

        updateData.status = 'APPROVED';
        updateData.approvedById = session.user.id;
        updateData.approvedAt = new Date();

        // Calculer la compensation si taux horaire fourni
        if (hourlyRate && overtime.compensationType === 'PAYMENT') {
          const compensation = parseFloat(overtime.hours) * parseFloat(overtime.rate) * hourlyRate;
          updateData.compensationAmount = compensation.toFixed(2);
        }

        // Calculer les heures de récupération si applicable
        if (overtime.compensationType === 'TIME_OFF') {
          updateData.compensationHours = (parseFloat(overtime.hours) * parseFloat(overtime.rate)).toFixed(2);
        }
      } else if (action === 'REJECT') {
        if (overtime.status !== 'PENDING') {
          results.push({ id: overtime.id, error: 'Demande déjà traitée' });
          continue;
        }

        updateData.status = 'REJECTED';
        updateData.rejectionReason = rejectionReason || 'Non spécifiée';
        updateData.approvedById = session.user.id;
        updateData.approvedAt = new Date();
      } else if (action === 'MARK_PAID') {
        if (overtime.status !== 'APPROVED') {
          results.push({ id: overtime.id, error: 'Demande non approuvée' });
          continue;
        }

        updateData.status = 'PAID';
        updateData.isPaid = true;
        updateData.paidAmount = overtime.compensationAmount;
        updateData.paidAt = new Date();
      }

      await overtime.update(updateData);
      results.push({ id: overtime.id, success: true });
    }

    return NextResponse.json({
      success: true,
      results,
      message: `${action} effectué sur ${results.filter(r => r.success).length} demande(s)`,
    });
  } catch (error) {
    console.error('Error updating overtime:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour', details: error.message },
      { status: 500 }
    );
  }
}
