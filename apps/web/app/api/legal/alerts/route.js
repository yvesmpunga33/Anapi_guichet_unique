import { NextResponse } from 'next/server';
import { LegalAlert, Contract, JuridicalText, ContractType, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// Générer un numéro d'alerte unique
async function generateAlertNumber() {
  const year = new Date().getFullYear();
  const prefix = `ALERT-${year}`;

  const lastAlert = await LegalAlert.findOne({
    where: {
      alertNumber: { [Op.like]: `${prefix}-%` }
    },
    order: [['alertNumber', 'DESC']],
  });

  let nextNumber = 1;
  if (lastAlert) {
    const match = lastAlert.alertNumber.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
}

// GET - Liste des alertes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const assignedToId = searchParams.get('assignedToId');

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;

    const { count, rows: alerts } = await LegalAlert.findAndCountAll({
      where,
      include: [
        {
          model: Contract,
          as: 'contract',
          include: [{ model: ContractType, as: 'contractType' }]
        },
        { model: JuridicalText, as: 'document' },
      ],
      order: [
        ['priority', 'DESC'],
        ['dueDate', 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json({
      alerts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des alertes' },
      { status: 500 }
    );
  }
}

// POST - Créer une alerte
export async function POST(request) {
  try {
    const data = await request.json();

    const alertNumber = await generateAlertNumber();

    const alert = await LegalAlert.create({
      ...data,
      alertNumber,
      status: 'PENDING',
    });

    const result = await LegalAlert.findByPk(alert.id, {
      include: [
        { model: Contract, as: 'contract' },
        { model: JuridicalText, as: 'document' },
      ],
    });

    return NextResponse.json({ alert: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'alerte' },
      { status: 500 }
    );
  }
}
