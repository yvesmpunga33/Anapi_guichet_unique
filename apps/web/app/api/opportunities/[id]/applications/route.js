import { NextResponse } from 'next/server';
import { OpportunityApplication, ProvinceOpportunity, Investor, ApplicationDocument, OpportunityDocument, User } from '../../../../../models/index.js';
import { Op } from 'sequelize';
import { auth } from '../../../../lib/auth.js';

// GET - Liste des candidatures pour une opportunite
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const opportunity = await ProvinceOpportunity.findByPk(id);
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    const where = { opportunityId: id };
    if (status) {
      where.status = status;
    }

    const { count, rows: applications } = await OpportunityApplication.findAndCountAll({
      where,
      include: [
        {
          model: Investor,
          as: 'investor',
          attributes: ['id', 'companyName', 'email', 'phone', 'country'],
        },
        {
          model: ApplicationDocument,
          as: 'documents',
          include: [
            {
              model: OpportunityDocument,
              as: 'requiredDocument',
              attributes: ['id', 'name', 'isRequired'],
            },
          ],
        },
        {
          model: User,
          as: 'reviewedBy',
          attributes: ['id', 'name'],
        },
      ],
      order: [['submittedAt', 'DESC']],
      limit,
      offset,
    });

    // Stats
    const stats = {
      total: count,
      submitted: await OpportunityApplication.count({ where: { opportunityId: id, status: 'SUBMITTED' } }),
      underReview: await OpportunityApplication.count({ where: { opportunityId: id, status: 'UNDER_REVIEW' } }),
      shortlisted: await OpportunityApplication.count({ where: { opportunityId: id, status: 'SHORTLISTED' } }),
      approved: await OpportunityApplication.count({ where: { opportunityId: id, status: 'APPROVED' } }),
      rejected: await OpportunityApplication.count({ where: { opportunityId: id, status: 'REJECTED' } }),
    };

    return NextResponse.json({
      applications,
      stats,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des candidatures', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer une candidature (pour investisseur)
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Verify opportunity exists and is published
    const opportunity = await ProvinceOpportunity.findByPk(id);
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    if (opportunity.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Cette opportunite n\'est pas ouverte aux candidatures' },
        { status: 400 }
      );
    }

    if (opportunity.deadline && new Date(opportunity.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'La date limite de candidature est depassee' },
        { status: 400 }
      );
    }

    // Check if investor already applied
    const existingApplication = await OpportunityApplication.findOne({
      where: {
        opportunityId: id,
        investorId: data.investorId,
        status: { [Op.not]: 'WITHDRAWN' },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Vous avez deja une candidature en cours pour cette opportunite' },
        { status: 400 }
      );
    }

    // Generate reference
    const year = new Date().getFullYear();
    const count = await OpportunityApplication.count();
    const reference = `CAND-${year}-${String(count + 1).padStart(4, '0')}`;

    const application = await OpportunityApplication.create({
      reference,
      opportunityId: id,
      investorId: data.investorId,
      proposedAmount: data.proposedAmount ? parseFloat(data.proposedAmount) : null,
      proposedJobs: data.proposedJobs ? parseInt(data.proposedJobs) : null,
      motivation: data.motivation || null,
      experience: data.experience || null,
      timeline: data.timeline || null,
      status: data.submit ? 'SUBMITTED' : 'DRAFT',
      submittedAt: data.submit ? new Date() : null,
    });

    // Update opportunity applications count
    await opportunity.increment('applicationsCount');

    // Fetch created application
    const createdApplication = await OpportunityApplication.findByPk(application.id, {
      include: [
        { model: Investor, as: 'investor' },
        { model: ProvinceOpportunity, as: 'opportunity' },
      ],
    });

    return NextResponse.json({ application: createdApplication }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la candidature', details: error.message },
      { status: 500 }
    );
  }
}
