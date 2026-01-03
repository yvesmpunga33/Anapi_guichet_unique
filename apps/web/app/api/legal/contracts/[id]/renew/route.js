import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { Contract, ContractType, LegalAlert } from '../../../../../../models/index.js';
import { sendEmail } from '../../../../../lib/email.js';
import { Op } from 'sequelize';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// GET - Obtenir les informations de renouvellement
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const contract = await Contract.findByPk(id, {
      include: [{
        model: ContractType,
        as: 'contractType',
      }],
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
    }

    const today = new Date();
    const endDate = new Date(contract.endDate);
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Calculer la nouvelle date de fin suggeree (meme duree)
    const startDate = new Date(contract.startDate);
    const originalDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const suggestedStartDate = new Date(endDate);
    suggestedStartDate.setDate(suggestedStartDate.getDate() + 1);
    const suggestedEndDate = new Date(suggestedStartDate);
    suggestedEndDate.setDate(suggestedEndDate.getDate() + originalDuration);

    // Historique des renouvellements
    const renewalHistory = await Contract.findAll({
      where: {
        [Op.or]: [
          { renewedFromId: id },
          { id: contract.renewedFromId },
        ],
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'reference', 'startDate', 'endDate', 'status', 'createdAt'],
    });

    return NextResponse.json({
      contract: {
        id: contract.id,
        title: contract.title,
        reference: contract.reference,
        status: contract.status,
        startDate: contract.startDate,
        endDate: contract.endDate,
        value: contract.value,
        currency: contract.currency,
        renewalType: contract.renewalType,
        parties: contract.parties,
        type: contract.contractType,
      },
      renewalInfo: {
        daysRemaining,
        isExpired: daysRemaining < 0,
        originalDuration,
        renewalType: contract.renewalType,
        canRenew: ['ACTIVE', 'EXPIRED'].includes(contract.status),
      },
      suggestions: {
        startDate: suggestedStartDate.toISOString().split('T')[0],
        endDate: suggestedEndDate.toISOString().split('T')[0],
        value: contract.value,
        currency: contract.currency,
      },
      renewalHistory,
    });
  } catch (error) {
    console.error('Error getting renewal info:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des informations' },
      { status: 500 }
    );
  }
}

// POST - Creer un renouvellement de contrat
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      reference,
      startDate,
      endDate,
      value,
      currency,
      parties,
      keepParties,
      keepObligations,
      notes,
      notifyParties,
    } = body;

    // Recuperer le contrat original
    const originalContract = await Contract.findByPk(id, {
      include: [{
        model: ContractType,
        as: 'contractType',
      }],
    });

    if (!originalContract) {
      return NextResponse.json({ error: 'Contrat original non trouve' }, { status: 404 });
    }

    // Verifier que le contrat peut etre renouvele
    if (!['ACTIVE', 'EXPIRED'].includes(originalContract.status)) {
      return NextResponse.json(
        { error: 'Ce contrat ne peut pas etre renouvele' },
        { status: 400 }
      );
    }

    // Generer une nouvelle reference
    const year = new Date().getFullYear();
    const count = await Contract.count({
      where: {
        reference: { [Op.like]: `CTR-${year}-%` },
      },
    });
    const newReference = reference || `CTR-${year}-${String(count + 1).padStart(4, '0')}-RNW`;

    // Creer le nouveau contrat (renouvellement)
    const renewedContract = await Contract.create({
      title: title || `${originalContract.title} (Renouvellement)`,
      reference: newReference,
      typeId: originalContract.typeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      value: value || originalContract.value,
      currency: currency || originalContract.currency,
      description: originalContract.description,
      parties: keepParties ? originalContract.parties : (parties || []),
      obligations: keepObligations ? originalContract.obligations : [],
      renewalType: originalContract.renewalType,
      alertEnabled: originalContract.alertEnabled,
      alertDays: originalContract.alertDays,
      status: 'DRAFT',
      renewedFromId: originalContract.id,
      createdById: session.user?.id,
      renewalNotes: notes,
    });

    // Mettre a jour le contrat original
    await originalContract.update({
      status: 'RENEWED',
      renewedToId: renewedContract.id,
      renewedAt: new Date(),
      renewedById: session.user?.id,
    });

    // Resoudre les alertes liees au contrat original
    await LegalAlert.update(
      {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedById: session.user?.id,
        resolutionNotes: `Contrat renouvele - Nouveau contrat: ${newReference}`,
      },
      {
        where: {
          relatedId: originalContract.id,
          relatedType: 'CONTRACT',
          status: 'PENDING',
        },
      }
    );

    // Envoyer des notifications si demande
    if (notifyParties && originalContract.parties?.length > 0) {
      for (const party of originalContract.parties) {
        if (party.email) {
          try {
            await sendEmail(party.email, 'contractRenewalReminder', {
              contractTitle: renewedContract.title,
              renewalType: renewedContract.renewalType,
              contractUrl: `${BASE_URL}/legal/contracts/${renewedContract.id}`,
              renewUrl: `${BASE_URL}/legal/contracts/${renewedContract.id}/edit`,
            });
          } catch (error) {
            console.error(`Error sending notification to ${party.email}:`, error);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contrat renouvele avec succes',
      originalContract: {
        id: originalContract.id,
        status: 'RENEWED',
      },
      renewedContract: {
        id: renewedContract.id,
        title: renewedContract.title,
        reference: renewedContract.reference,
        status: renewedContract.status,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error renewing contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors du renouvellement du contrat' },
      { status: 500 }
    );
  }
}
