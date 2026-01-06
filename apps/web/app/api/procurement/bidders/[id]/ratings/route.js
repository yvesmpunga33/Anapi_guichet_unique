import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { BidderRating, Bidder, ProcurementContract, Tender, User } from '../../../../../../models/index.js';

// GET - Liste des évaluations d'un fournisseur
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier que le fournisseur existe
    const bidder = await Bidder.findByPk(id);
    if (!bidder) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    const ratings = await BidderRating.findAll({
      where: { bidderId: id },
      include: [
        {
          model: ProcurementContract,
          as: 'contract',
          attributes: ['id', 'contractNumber', 'title']
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'reference', 'title']
        },
        { model: User, as: 'evaluatedBy', attributes: ['id', 'name'] },
        { model: User, as: 'approvedBy', attributes: ['id', 'name'] },
      ],
      order: [['evaluationDate', 'DESC']],
    });

    // Calculer la note moyenne globale
    const approvedRatings = ratings.filter(r => r.status === 'APPROVED');
    const averageScore = approvedRatings.length > 0
      ? approvedRatings.reduce((sum, r) => sum + parseFloat(r.overallScore || 0), 0) / approvedRatings.length
      : null;

    // Statistiques détaillées
    const stats = {
      totalRatings: ratings.length,
      approvedRatings: approvedRatings.length,
      averageScore: averageScore ? averageScore.toFixed(2) : null,
      averageByCategory: {},
      recommendation: null,
    };

    if (approvedRatings.length > 0) {
      const categories = ['qualityScore', 'deliveryScore', 'priceScore', 'communicationScore', 'complianceScore', 'safetyScore', 'environmentalScore'];

      categories.forEach(cat => {
        const values = approvedRatings.map(r => parseFloat(r[cat])).filter(v => !isNaN(v));
        if (values.length > 0) {
          stats.averageByCategory[cat] = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
        }
      });

      // Déterminer la recommandation globale
      if (averageScore >= 4.5) {
        stats.recommendation = 'HIGHLY_RECOMMENDED';
      } else if (averageScore >= 3.5) {
        stats.recommendation = 'RECOMMENDED';
      } else if (averageScore >= 2.5) {
        stats.recommendation = 'ACCEPTABLE';
      } else if (averageScore >= 1.5) {
        stats.recommendation = 'CONDITIONAL';
      } else {
        stats.recommendation = 'NOT_RECOMMENDED';
      }
    }

    return NextResponse.json({
      success: true,
      data: ratings,
      stats,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des évaluations', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer une évaluation
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Vérifier que le fournisseur existe
    const bidder = await Bidder.findByPk(id);
    if (!bidder) {
      return NextResponse.json({ error: 'Fournisseur non trouvé' }, { status: 404 });
    }

    // Validation
    if (!body.evaluationType) {
      return NextResponse.json(
        { error: 'Le type d\'évaluation est obligatoire' },
        { status: 400 }
      );
    }

    const rating = await BidderRating.create({
      bidderId: id,
      contractId: body.contractId,
      tenderId: body.tenderId,
      evaluationType: body.evaluationType,
      evaluationDate: body.evaluationDate || new Date(),
      evaluationPeriod: body.evaluationPeriod,
      // Scores
      qualityScore: body.qualityScore,
      deliveryScore: body.deliveryScore,
      priceScore: body.priceScore,
      communicationScore: body.communicationScore,
      complianceScore: body.complianceScore,
      safetyScore: body.safetyScore,
      environmentalScore: body.environmentalScore,
      criteriaWeights: body.criteriaWeights,
      // Incidents
      incidentsCount: body.incidentsCount || 0,
      penaltiesApplied: body.penaltiesApplied || 0,
      delaysCount: body.delaysCount || 0,
      totalDelayDays: body.totalDelayDays || 0,
      // Commentaires
      strengths: body.strengths,
      weaknesses: body.weaknesses,
      improvements: body.improvements,
      recommendation: body.recommendation,
      notes: body.notes,
      evaluatedById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: rating,
      message: 'Évaluation créée avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'évaluation', details: error.message },
      { status: 500 }
    );
  }
}
