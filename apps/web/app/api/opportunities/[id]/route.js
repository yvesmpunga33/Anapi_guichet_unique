import { NextResponse } from 'next/server';
import { ProvinceOpportunity, Province, Sector, OpportunityDocument, OpportunityApplication, User } from '../../../../models/index.js';
import { auth } from '../../../lib/auth.js';

// GET - Obtenir une opportunite par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const opportunity = await ProvinceOpportunity.findByPk(id, {
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name', 'capital', 'population', 'area'],
        },
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'code', 'name', 'description', 'color'],
        },
        {
          model: OpportunityDocument,
          as: 'requiredDocuments',
          order: [['sortOrder', 'ASC']],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    // Increment views count
    await opportunity.increment('viewsCount');

    // Parse JSON fields
    const result = opportunity.toJSON();
    if (result.advantages) {
      try { result.advantages = JSON.parse(result.advantages); } catch (e) { /* keep as string */ }
    }
    if (result.requirements) {
      try { result.requirements = JSON.parse(result.requirements); } catch (e) { /* keep as string */ }
    }

    return NextResponse.json({ opportunity: result });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'opportunite', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour une opportunite
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const opportunity = await ProvinceOpportunity.findByPk(id);

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    // Update fields
    const updateData = {
      title: data.title ?? opportunity.title,
      description: data.description ?? opportunity.description,
      provinceId: data.provinceId ?? opportunity.provinceId,
      sectorId: data.sectorId ?? opportunity.sectorId,
      minInvestment: data.minInvestment !== undefined ? parseFloat(data.minInvestment) : opportunity.minInvestment,
      maxInvestment: data.maxInvestment !== undefined ? parseFloat(data.maxInvestment) : opportunity.maxInvestment,
      expectedJobs: data.expectedJobs !== undefined ? parseInt(data.expectedJobs) : opportunity.expectedJobs,
      projectDuration: data.projectDuration ?? opportunity.projectDuration,
      location: data.location ?? opportunity.location,
      advantages: data.advantages ? JSON.stringify(data.advantages) : opportunity.advantages,
      requirements: data.requirements ? JSON.stringify(data.requirements) : opportunity.requirements,
      contactName: data.contactName ?? opportunity.contactName,
      contactEmail: data.contactEmail ?? opportunity.contactEmail,
      contactPhone: data.contactPhone ?? opportunity.contactPhone,
      deadline: data.deadline ?? opportunity.deadline,
      priority: data.priority ?? opportunity.priority,
      isFeatured: data.isFeatured ?? opportunity.isFeatured,
      imageUrl: data.imageUrl ?? opportunity.imageUrl,
    };

    // Handle status changes
    if (data.status && data.status !== opportunity.status) {
      updateData.status = data.status;
      if (data.status === 'PUBLISHED' && !opportunity.publishedAt) {
        updateData.publishedAt = new Date();
      } else if (data.status === 'CLOSED') {
        updateData.closedAt = new Date();
      }
    }

    await opportunity.update(updateData);

    // Update required documents if provided
    if (data.requiredDocuments && Array.isArray(data.requiredDocuments)) {
      // Delete existing documents
      await OpportunityDocument.destroy({ where: { opportunityId: id } });

      // Create new documents
      for (let i = 0; i < data.requiredDocuments.length; i++) {
        const doc = data.requiredDocuments[i];
        await OpportunityDocument.create({
          opportunityId: id,
          name: doc.name,
          description: doc.description || null,
          isRequired: doc.isRequired !== false,
          category: doc.category || 'OTHER',
          templateUrl: doc.templateUrl || null,
          sortOrder: i,
        });
      }
    }

    // Fetch updated opportunity
    const updatedOpportunity = await ProvinceOpportunity.findByPk(id, {
      include: [
        { model: Province, as: 'province' },
        { model: Sector, as: 'sector' },
        { model: OpportunityDocument, as: 'requiredDocuments' },
      ],
    });

    return NextResponse.json({ opportunity: updatedOpportunity });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'opportunite', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une opportunite
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const opportunity = await ProvinceOpportunity.findByPk(id);

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    // Check if there are applications
    const applicationsCount = await OpportunityApplication.count({
      where: { opportunityId: id },
    });

    if (applicationsCount > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer cette opportunite car elle a ${applicationsCount} candidature(s)` },
        { status: 400 }
      );
    }

    await opportunity.destroy();

    return NextResponse.json({ message: 'Opportunite supprimee avec succes' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'opportunite', details: error.message },
      { status: 500 }
    );
  }
}
