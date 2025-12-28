import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { Employee, HRDepartment, Position, SalaryGrade, WorkerCategory, sequelize } from '../../../../models';

// GET /api/hr/employees - Liste tous les employés
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      const { Op } = await import('sequelize');
      where[Op.or as any] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { matricule: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (status) {
      where.status = status;
    }

    const { count: total, rows: employees } = await Employee.findAndCountAll({
      where,
      offset,
      limit,
      include: [
        {
          model: HRDepartment,
          as: 'department',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'title', 'code'],
        },
        {
          model: SalaryGrade,
          as: 'grade',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: WorkerCategory,
          as: 'category',
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des employés' },
      { status: 500 }
    );
  }
}

// POST /api/hr/employees - Créer un employé
export async function POST(request: Request) {
  const t = await sequelize.transaction();

  try {
    const session = await auth();

    if (!session) {
      await t.rollback();
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      middleName,
      email,
      phone,
      dateOfBirth,
      placeOfBirth,
      gender,
      maritalStatus,
      nationality,
      nationalId,
      address,
      city,
      province,
      departmentId,
      positionId,
      gradeId,
      categoryId,
      hireDate,
      contractType,
      baseSalary,
      currency,
    } = body;

    if (!firstName || !lastName || !email || !hireDate) {
      await t.rollback();
      return NextResponse.json(
        { error: 'Prénom, nom, email et date d\'embauche requis' },
        { status: 400 }
      );
    }

    // Generate matricule
    const count = await Employee.count({ transaction: t });
    const year = new Date().getFullYear();
    const matricule = `EMP-${year}-${String(count + 1).padStart(5, '0')}`;

    const employee = await Employee.create(
      {
        matricule,
        firstName,
        lastName,
        middleName,
        email,
        phone,
        dateOfBirth,
        placeOfBirth,
        gender: gender || 'MALE',
        maritalStatus: maritalStatus || 'SINGLE',
        nationality: nationality || 'Congolaise',
        nationalId,
        address,
        city,
        province,
        departmentId: departmentId || null,
        positionId: positionId || null,
        gradeId: gradeId || null,
        categoryId: categoryId || null,
        hireDate,
        contractType: contractType || 'CDI',
        baseSalary: baseSalary || 0,
        currency: currency || 'CDF',
        status: 'ACTIVE',
      },
      { transaction: t }
    );

    await t.commit();

    // Retrieve with associations
    const createdEmployee = await Employee.findByPk(employee.id, {
      include: [
        { model: HRDepartment, as: 'department' },
        { model: Position, as: 'position' },
        { model: SalaryGrade, as: 'grade' },
        { model: WorkerCategory, as: 'category' },
      ],
    });

    return NextResponse.json(createdEmployee, { status: 201 });
  } catch (error) {
    await t.rollback();
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'employé' },
      { status: 500 }
    );
  }
}
