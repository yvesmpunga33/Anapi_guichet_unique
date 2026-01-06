import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Bid, Bidder, Tender, TenderLot, BidderRating } from '../../../../../models/index.js';
import { Op } from 'sequelize';

// POST - Comparer des offres
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { bidIds, tenderId, criteria } = body;

    if (!bidIds || bidIds.length < 2) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner au moins 2 offres à comparer' },
        { status: 400 }
      );
    }

    // Récupérer les offres avec les détails
    const bids = await Bid.findAll({
      where: { id: { [Op.in]: bidIds } },
      include: [
        {
          model: Bidder,
          as: 'bidder',
          attributes: ['id', 'companyName', 'code', 'rccm', 'email', 'phone'],
          include: [
            {
              model: BidderRating,
              as: 'ratings',
              where: { status: 'APPROVED' },
              required: false,
              attributes: ['overallScore', 'qualityScore', 'deliveryScore'],
            },
          ],
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'reference', 'title', 'estimatedBudget', 'currency'],
        },
        {
          model: TenderLot,
          as: 'lot',
          attributes: ['id', 'title', 'estimatedBudget'],
        },
      ],
      order: [['totalScore', 'DESC']],
    });

    if (bids.length === 0) {
      return NextResponse.json({ error: 'Aucune offre trouvée' }, { status: 404 });
    }

    // Préparer les données de comparaison
    const comparison = {
      tender: bids[0].tender,
      criteria: criteria || {
        financial: { weight: 40, label: 'Offre Financière' },
        technical: { weight: 35, label: 'Score Technique' },
        administrative: { weight: 15, label: 'Conformité Administrative' },
        experience: { weight: 10, label: 'Expérience et Réputation' },
      },
      bids: [],
      analysis: {
        lowestPrice: null,
        highestPrice: null,
        averagePrice: 0,
        priceRange: 0,
        highestTechnicalScore: null,
        bestOverall: null,
      },
    };

    let totalPrice = 0;
    let lowestPrice = Infinity;
    let highestPrice = 0;
    let highestTechnicalScore = 0;
    let highestTotalScore = 0;

    bids.forEach((bid, index) => {
      const financialOffer = parseFloat(bid.financialOffer) || 0;
      const technicalScore = parseFloat(bid.technicalScore) || 0;
      const administrativeScore = parseFloat(bid.administrativeScore) || 0;
      const totalScore = parseFloat(bid.totalScore) || 0;

      // Calculer la note moyenne du fournisseur
      const ratings = bid.bidder?.ratings || [];
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + parseFloat(r.overallScore || 0), 0) / ratings.length
        : null;

      const bidData = {
        id: bid.id,
        bidNumber: bid.bidNumber,
        bidder: {
          id: bid.bidder?.id,
          companyName: bid.bidder?.companyName,
          code: bid.bidder?.code,
          email: bid.bidder?.email,
          phone: bid.bidder?.phone,
          averageRating: avgRating ? avgRating.toFixed(2) : null,
          ratingsCount: ratings.length,
        },
        lot: bid.lot ? { id: bid.lot.id, title: bid.lot.title } : null,
        financialOffer,
        technicalScore,
        administrativeScore,
        totalScore,
        status: bid.status,
        submittedAt: bid.submittedAt,
        // Scores normalisés pour la comparaison
        scores: {
          financial: 0,
          technical: technicalScore,
          administrative: administrativeScore,
          experience: avgRating ? avgRating * 20 : 50, // Convertir sur 100
        },
        rank: index + 1,
        highlights: [],
        concerns: [],
      };

      // Analyse des forces et faiblesses
      if (financialOffer > 0) {
        totalPrice += financialOffer;
        if (financialOffer < lowestPrice) {
          lowestPrice = financialOffer;
          comparison.analysis.lowestPrice = { bidId: bid.id, bidder: bid.bidder?.companyName, amount: financialOffer };
        }
        if (financialOffer > highestPrice) {
          highestPrice = financialOffer;
          comparison.analysis.highestPrice = { bidId: bid.id, bidder: bid.bidder?.companyName, amount: financialOffer };
        }
      }

      if (technicalScore > highestTechnicalScore) {
        highestTechnicalScore = technicalScore;
        comparison.analysis.highestTechnicalScore = { bidId: bid.id, bidder: bid.bidder?.companyName, score: technicalScore };
      }

      if (totalScore > highestTotalScore) {
        highestTotalScore = totalScore;
        comparison.analysis.bestOverall = { bidId: bid.id, bidder: bid.bidder?.companyName, score: totalScore };
      }

      comparison.bids.push(bidData);
    });

    // Calculer les scores financiers normalisés (le moins cher = 100)
    if (lowestPrice > 0 && lowestPrice < Infinity) {
      comparison.bids.forEach(bid => {
        if (bid.financialOffer > 0) {
          bid.scores.financial = Math.round((lowestPrice / bid.financialOffer) * 100);
        }
      });
    }

    // Statistiques globales
    comparison.analysis.averagePrice = bids.length > 0 ? Math.round(totalPrice / bids.length) : 0;
    comparison.analysis.priceRange = highestPrice - lowestPrice;
    comparison.analysis.priceRangePercent = lowestPrice > 0
      ? Math.round(((highestPrice - lowestPrice) / lowestPrice) * 100)
      : 0;

    // Identifier les forces et faiblesses de chaque offre
    comparison.bids.forEach(bid => {
      const isLowestPrice = bid.financialOffer === lowestPrice;
      const isHighestPrice = bid.financialOffer === highestPrice;
      const isBestTechnical = bid.technicalScore === highestTechnicalScore;

      if (isLowestPrice) bid.highlights.push('Prix le plus bas');
      if (isBestTechnical) bid.highlights.push('Meilleur score technique');
      if (bid.bidder.averageRating >= 4) bid.highlights.push('Fournisseur bien noté');
      if (bid.scores.administrative >= 90) bid.highlights.push('Dossier administratif complet');

      if (isHighestPrice && bids.length > 2) bid.concerns.push('Prix le plus élevé');
      if (bid.technicalScore < 60) bid.concerns.push('Score technique faible');
      if (!bid.bidder.averageRating && bid.bidder.ratingsCount === 0) bid.concerns.push('Fournisseur sans historique');
    });

    // Calculer le score pondéré final
    const weights = comparison.criteria;
    comparison.bids.forEach(bid => {
      bid.weightedScore = Math.round(
        (bid.scores.financial * (weights.financial?.weight || 40) / 100) +
        (bid.scores.technical * (weights.technical?.weight || 35) / 100) +
        (bid.scores.administrative * (weights.administrative?.weight || 15) / 100) +
        (bid.scores.experience * (weights.experience?.weight || 10) / 100)
      );
    });

    // Trier par score pondéré
    comparison.bids.sort((a, b) => b.weightedScore - a.weightedScore);
    comparison.bids.forEach((bid, index) => {
      bid.rank = index + 1;
    });

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing bids:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la comparaison des offres', details: error.message },
      { status: 500 }
    );
  }
}
