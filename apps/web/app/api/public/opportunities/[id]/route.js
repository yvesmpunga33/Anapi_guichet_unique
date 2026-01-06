import { NextResponse } from 'next/server';
import { ProvinceOpportunity, Province, Sector, OpportunityDocument } from '../../../../../models/index.js';

// GET - Detail d'une opportunite publique
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const opportunity = await ProvinceOpportunity.findOne({
      where: {
        id,
        status: 'PUBLISHED', // Only published opportunities are public
      },
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name', 'capital'],
        },
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'code', 'name', 'color', 'icon'],
        },
        {
          model: OpportunityDocument,
          as: 'requiredDocuments',
          attributes: ['id', 'name', 'description', 'isRequired', 'category', 'templateUrl'],
          order: [['sortOrder', 'ASC']],
        },
      ],
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee ou non publiee' },
        { status: 404 }
      );
    }

    // Increment views count
    await opportunity.increment('viewsCount');

    // Get related opportunities from same province/sector
    const relatedOpportunities = await ProvinceOpportunity.findAll({
      where: {
        status: 'PUBLISHED',
        id: { $ne: id },
        $or: [
          { provinceId: opportunity.provinceId },
          { sectorId: opportunity.sectorId },
        ],
      },
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'name'],
        },
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'name', 'color'],
        },
      ],
      limit: 4,
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      opportunity,
      relatedOpportunities,
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'opportunite', details: error.message },
      { status: 500 }
    );
  }
}
