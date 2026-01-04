import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { ProcurementContract, Bidder, Tender, Ministry, User, sequelize } from '../../../../../models/index.js';

// GET - Générer les données pour le certificat
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    // Récupérer le contrat avec toutes les relations
    const contract = await ProcurementContract.findByPk(id, {
      include: [
        {
          model: Bidder,
          as: 'contractor',
          attributes: ['id', 'companyName', 'tradeName', 'rccm', 'idnat', 'nif', 'legalForm',
            'address', 'phone', 'email', 'representativeName', 'representativeTitle'],
        },
        {
          model: Tender,
          as: 'tender',
          include: [
            { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName'] },
          ],
        },
        { model: User, as: 'signedByClient', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
    }

    // Numéro du certificat
    const year = new Date(contract.signatureDate || contract.createdAt).getFullYear();
    const certificateNumber = `CERT-PM-${year}-${contract.contractNumber.replace(/[^0-9]/g, '')}`;

    // Préparer les données du certificat
    const certificateData = {
      certificateNumber,
      issueDate: new Date().toISOString(),

      // Informations du contrat
      contract: {
        id: contract.id,
        contractNumber: contract.contractNumber,
        title: contract.title,
        description: contract.description,
        contractValue: contract.contractValue,
        currency: contract.currency || 'USD',
        signatureDate: contract.signatureDate,
        startDate: contract.startDate,
        endDate: contract.endDate,
        status: contract.status,
      },

      // Informations de l'appel d'offres
      tender: contract.tender ? {
        reference: contract.tender.reference,
        title: contract.tender.title,
        type: contract.tender.type,
        category: contract.tender.category,
        ministry: contract.tender.ministry?.name,
        ministryAbbreviation: contract.tender.ministry?.shortName,
      } : null,

      // Informations de l'attributaire
      bidder: contract.contractor ? {
        companyName: contract.contractor.companyName,
        tradeName: contract.contractor.tradeName,
        rccm: contract.contractor.rccm,
        idnat: contract.contractor.idnat,
        nif: contract.contractor.nif,
        legalForm: contract.contractor.legalForm,
        address: contract.contractor.address,
        phone: contract.contractor.phone,
        email: contract.contractor.email,
        representativeName: contract.contractor.representativeName,
        representativeTitle: contract.contractor.representativeTitle,
      } : null,

      // Signataire
      signedBy: contract.signedByClient ? {
        name: contract.signedByClient.name,
        email: contract.signedByClient.email,
      } : null,

      // Informations ANAPI
      authority: {
        name: "Agence Nationale pour la Promotion des Investissements",
        abbreviation: "ANAPI",
        country: "République Démocratique du Congo",
        address: "Kinshasa, RDC",
      },
    };

    return NextResponse.json({
      success: true,
      data: certificateData,
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la generation du certificat', details: error.message },
      { status: 500 }
    );
  }
}
