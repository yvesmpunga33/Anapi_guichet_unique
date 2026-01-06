import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { InternationalTreaty, User } from '../../../../../models/index.js';

// GET /api/business-climate/treaties/[id] - Get a single treaty
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const treaty = await InternationalTreaty.findByPk(id, {
      include: [
        { model: User, as: 'responsible', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
    });

    if (!treaty) {
      return NextResponse.json({ error: 'Traité non trouvé' }, { status: 404 });
    }

    return NextResponse.json(treaty);
  } catch (error) {
    console.error('Error fetching treaty:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du traité', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/business-climate/treaties/[id] - Update a treaty
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const treaty = await InternationalTreaty.findByPk(id);
    if (!treaty) {
      return NextResponse.json({ error: 'Traité non trouvé' }, { status: 404 });
    }

    await treaty.update({
      title: body.title,
      shortTitle: body.shortTitle,
      description: body.description,
      treatyType: body.treatyType,
      status: body.status,
      partnerCountries: body.partnerCountries || [],
      regionalOrganization: body.regionalOrganization || null,
      negotiationStartDate: body.negotiationStartDate || null,
      signedDate: body.signedDate || null,
      ratifiedDate: body.ratifiedDate || null,
      entryIntoForceDate: body.entryIntoForceDate || null,
      expiryDate: body.expiryDate || null,
      duration: body.duration || null,
      autoRenewal: body.autoRenewal || false,
      renewalPeriod: body.renewalPeriod || null,
      keyProvisions: body.keyProvisions || [],
      investorBenefits: body.investorBenefits || [],
      coveredSectors: body.coveredSectors || [],
      exclusions: body.exclusions || [],
      disputeResolution: body.disputeResolution || null,
      treatyTextUrl: body.treatyTextUrl || null,
      notes: body.notes || null,
      responsibleId: body.responsibleId || null,
    });

    const updatedTreaty = await InternationalTreaty.findByPk(id, {
      include: [
        { model: User, as: 'responsible', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
    });

    return NextResponse.json(updatedTreaty);
  } catch (error) {
    console.error('Error updating treaty:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du traité', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/business-climate/treaties/[id] - Delete a treaty
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const treaty = await InternationalTreaty.findByPk(id);
    if (!treaty) {
      return NextResponse.json({ error: 'Traité non trouvé' }, { status: 404 });
    }

    await treaty.destroy();

    return NextResponse.json({ message: 'Traité supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting treaty:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du traité', details: error.message },
      { status: 500 }
    );
  }
}
