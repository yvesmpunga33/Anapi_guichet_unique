import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { MinistryDepartment, Ministry } from '../../../../../models/index.js';

// GET /api/referentiels/ministry-departments/[id] - Récupérer un département
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const department = await MinistryDepartment.findByPk(id, {
      include: [
        { model: Ministry, as: 'ministry', attributes: ['id', 'code', 'name', 'shortName'] },
      ],
    });

    if (!department) {
      return NextResponse.json({ error: 'Departement non trouve' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: department.toJSON(),
    });
  } catch (error) {
    console.error('Error fetching ministry department:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du departement', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/referentiels/ministry-departments/[id] - Mettre à jour un département
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const department = await MinistryDepartment.findByPk(id);

    if (!department) {
      return NextResponse.json({ error: 'Departement non trouve' }, { status: 404 });
    }

    // Validation
    if (body.ministryId !== undefined && !body.ministryId) {
      return NextResponse.json(
        { error: 'Le ministere est obligatoire' },
        { status: 400 }
      );
    }
    if (body.name !== undefined && !body.name) {
      return NextResponse.json(
        { error: 'Le nom est obligatoire' },
        { status: 400 }
      );
    }

    // Mettre à jour
    await department.update({
      code: body.code !== undefined ? body.code : department.code,
      name: body.name !== undefined ? body.name : department.name,
      description: body.description !== undefined ? body.description : department.description,
      ministryId: body.ministryId !== undefined ? body.ministryId : department.ministryId,
      headName: body.headName !== undefined ? body.headName : department.headName,
      headTitle: body.headTitle !== undefined ? body.headTitle : department.headTitle,
      phone: body.phone !== undefined ? body.phone : department.phone,
      email: body.email !== undefined ? body.email : department.email,
      isActive: body.isActive !== undefined ? body.isActive : department.isActive,
    });

    const result = await MinistryDepartment.findByPk(id, {
      include: [
        { model: Ministry, as: 'ministry', attributes: ['id', 'code', 'name', 'shortName'] },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result.toJSON(),
      message: 'Departement mis a jour avec succes',
    });
  } catch (error) {
    console.error('Error updating ministry department:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du departement', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/referentiels/ministry-departments/[id] - Supprimer un département
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const department = await MinistryDepartment.findByPk(id);

    if (!department) {
      return NextResponse.json({ error: 'Departement non trouve' }, { status: 404 });
    }

    await department.destroy();

    return NextResponse.json({
      success: true,
      message: 'Departement supprime avec succes',
    });
  } catch (error) {
    console.error('Error deleting ministry department:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du departement', details: error.message },
      { status: 500 }
    );
  }
}
