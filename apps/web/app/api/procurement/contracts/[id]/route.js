import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { ProcurementContract, Bidder, Tender, Bid, Ministry, User } from '../../../../../models/index.js';

// GET - Détail d'un contrat
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const contract = await ProcurementContract.findByPk(id, {
      include: [
        {
          model: Bidder,
          as: 'contractor',
          attributes: ['id', 'companyName', 'code', 'rccm', 'idnat', 'address', 'phone', 'email', 'contactPerson', 'contactPhone'],
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'reference', 'title', 'description', 'estimatedBudget', 'currency', 'status'],
          include: [
            { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName'] },
          ],
        },
        {
          model: Bid,
          as: 'bid',
          attributes: ['id', 'bidNumber', 'financialOffer', 'totalScore'],
        },
        { model: User, as: 'signedByClient', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] },
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName'] },
      ],
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouvé' }, { status: 404 });
    }

    // Map contractor to bidder for frontend compatibility
    const mappedContract = contract.toJSON();
    mappedContract.bidder = mappedContract.contractor;
    delete mappedContract.contractor;

    return NextResponse.json({
      success: true,
      data: mappedContract,
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contrat', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Modifier un contrat
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const contract = await ProcurementContract.findByPk(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouvé' }, { status: 404 });
    }

    // Mise à jour des champs autorisés
    const updatableFields = [
      'title', 'description', 'contractValue', 'currency',
      'signatureDate', 'effectiveDate', 'startDate', 'endDate',
      'deliveryDeadline', 'deliveryLocation', 'status',
      'performanceGuarantee', 'guaranteeReference', 'guaranteeExpiryDate',
      'advancePayment', 'advancePaymentDate', 'retentionPercentage',
      'paymentTerms', 'penaltyClause', 'penaltyPercentagePerDay', 'maxPenaltyPercentage',
      'totalPenaltyApplied', 'progressPercent', 'totalPaid', 'remainingAmount',
      'completionDate', 'receptionDate', 'finalReceptionDate',
      'terminationReason', 'terminationDate',
      'ministryId', 'managedById', 'signedByClientId',
      'signedByContractorName', 'signedByContractorTitle',
      'certificateNumber', 'certificateIssuedAt', 'certificateIssuedById',
      'notes', 'isArchived', 'archivedAt',
      'tenderId', 'bidId', 'bidderId', 'lotId'
    ];

    const updateData = {};
    updatableFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    await contract.update(updateData);

    const result = await ProcurementContract.findByPk(id, {
      include: [
        { model: Bidder, as: 'contractor', attributes: ['id', 'companyName', 'rccm'] },
        { model: Tender, as: 'tender', attributes: ['id', 'reference', 'title'] },
        { model: Bid, as: 'bid', attributes: ['id', 'bidNumber', 'financialOffer'] },
      ],
    });

    // Map contractor to bidder for frontend compatibility
    const mappedResult = result.toJSON();
    mappedResult.bidder = mappedResult.contractor;
    delete mappedResult.contractor;

    return NextResponse.json({
      success: true,
      data: mappedResult,
      message: 'Contrat mis à jour avec succès',
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contrat', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un contrat
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const contract = await ProcurementContract.findByPk(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouvé' }, { status: 404 });
    }

    // Vérifier que le contrat peut être supprimé
    if (!['DRAFT', 'CANCELLED'].includes(contract.status)) {
      return NextResponse.json(
        { error: 'Seuls les contrats en brouillon ou annulés peuvent être supprimés' },
        { status: 400 }
      );
    }

    await contract.destroy();

    return NextResponse.json({
      success: true,
      message: 'Contrat supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contrat', details: error.message },
      { status: 500 }
    );
  }
}
