import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Dossier, DossierDocument, DossierSector, Sector, Ministry, Investor, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// Generer un numero de dossier unique
async function generateDossierNumber() {
  const year = new Date().getFullYear();
  const prefix = 'DOS';

  // Trouver le dernier numero de l'annee
  const lastDossier = await Dossier.findOne({
    where: {
      dossierNumber: {
        [Op.like]: `${prefix}-${year}-%`
      }
    },
    order: [['dossierNumber', 'DESC']]
  });

  let nextNumber = 1;
  if (lastDossier) {
    const lastNumber = parseInt(lastDossier.dossierNumber.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${year}-${String(nextNumber).padStart(5, '0')}`;
}

// GET - Liste des dossiers avec pagination et filtres
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const dossierType = searchParams.get('type');
    const province = searchParams.get('province');
    const ministryId = searchParams.get('ministryId');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { dossierNumber: { [Op.iLike]: `%${search}%` } },
        { projectName: { [Op.iLike]: `%${search}%` } },
        { investorName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (dossierType) {
      // Supporter les filtres de catégorie (ex: "AGREMENT" filtre aussi "AGREMENT_REGIME")
      // et les filtres exacts (ex: "AGREMENT_REGIME")
      const typeCategories = {
        'AGREMENT': ['AGREMENT', 'AGREMENT_REGIME'],
        'LICENCE': ['LICENCE', 'LICENCE_EXPLOITATION'],
        'PERMIS': ['PERMIS', 'PERMIS_CONSTRUCTION'],
        'AUTORISATION': ['AUTORISATION', 'AUTORISATION_ACTIVITE'],
      };

      if (typeCategories[dossierType]) {
        where.dossierType = { [Op.in]: typeCategories[dossierType] };
      } else {
        where.dossierType = dossierType;
      }
    }

    if (province) {
      where.projectProvince = province;
    }

    if (ministryId) {
      where.ministryId = ministryId;
    }

    const { count, rows: dossiers } = await Dossier.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: Sector,
          as: 'sectors',
          through: { attributes: ['isPrimary'] },
          include: [
            { model: Ministry, as: 'ministry', attributes: ['id', 'code', 'name'] }
          ],
        },
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'name', 'shortName', 'code'],
        },
      ],
    });

    // Calculate stats - filtrer par type et ministère si spécifiés
    const statsWhere = {};
    if (dossierType) {
      const typeCategories = {
        'AGREMENT': ['AGREMENT', 'AGREMENT_REGIME'],
        'LICENCE': ['LICENCE', 'LICENCE_EXPLOITATION'],
        'PERMIS': ['PERMIS', 'PERMIS_CONSTRUCTION'],
        'AUTORISATION': ['AUTORISATION', 'AUTORISATION_ACTIVITE'],
      };
      if (typeCategories[dossierType]) {
        statsWhere.dossierType = { [Op.in]: typeCategories[dossierType] };
      } else {
        statsWhere.dossierType = dossierType;
      }
    }

    if (ministryId) {
      statsWhere.ministryId = ministryId;
    }

    const stats = await Dossier.findAll({
      where: statsWhere,
      attributes: [
        'status',
        [Dossier.sequelize.fn('COUNT', Dossier.sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const statsMap = {
      total: count,
      draft: 0,
      submitted: 0,
      inReview: 0,
      approved: 0,
      rejected: 0,
    };

    stats.forEach((s) => {
      switch (s.status) {
        case 'DRAFT':
          statsMap.draft = parseInt(s.count);
          break;
        case 'SUBMITTED':
          statsMap.submitted = parseInt(s.count);
          break;
        case 'IN_REVIEW':
          statsMap.inReview = parseInt(s.count);
          break;
        case 'APPROVED':
          statsMap.approved = parseInt(s.count);
          break;
        case 'REJECTED':
          statsMap.rejected = parseInt(s.count);
          break;
      }
    });

    return NextResponse.json({
      data: dossiers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats: statsMap,
    });
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des dossiers' },
      { status: 500 }
    );
  }
}

// POST - Creer un nouveau dossier
export async function POST(request) {
  const transaction = await sequelize.transaction();

  try {
    const session = await auth();
    const data = await request.json();

    // Generer le numero de dossier
    const dossierNumber = await generateDossierNumber();

    // Extraire les secteurs (tableau d'IDs)
    const sectorIds = data.sectors || [];
    const primarySector = sectorIds.length > 0 ? sectorIds[0] : null;

    // Trouver le premier secteur pour la compatibilité avec le champ legacy
    let sectorName = data.subSector || '';
    if (primarySector) {
      const sector = await Sector.findByPk(primarySector);
      if (sector) {
        sectorName = sector.name;
      }
    }

    // Creer le dossier
    const dossier = await Dossier.create({
      dossierNumber,
      dossierType: data.dossierType,
      // Investor info
      investorType: data.investorType || 'company',
      investorName: data.investorName,
      rccm: data.rccm,
      idNat: data.idNat,
      nif: data.nif,
      investorEmail: data.email,
      investorPhone: data.phone,
      investorProvince: data.province,
      investorCity: data.city,
      investorAddress: data.address,
      investorCountry: data.country || 'RDC',
      // Project info
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      sector: sectorName, // Champ legacy pour compatibilité
      subSector: data.subSector,
      projectProvince: data.projectProvince,
      projectCity: data.projectCity,
      projectAddress: data.projectAddress,
      // Financial info
      investmentAmount: parseFloat(String(data.investmentAmount || '0').replace(/[^0-9.-]/g, '')) || 0,
      currency: data.currency || 'USD',
      directJobs: parseInt(data.directJobs) || 0,
      indirectJobs: parseInt(data.indirectJobs) || 0,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      // Status
      status: data.isDraft ? 'DRAFT' : 'SUBMITTED',
      submittedAt: data.isDraft ? null : new Date(),
      createdById: session?.user?.id || null,
    }, { transaction });

    // Creer les associations dossier-secteurs
    if (sectorIds.length > 0) {
      const dossierSectors = sectorIds.map((sectorId, index) => ({
        dossierId: dossier.id,
        sectorId,
        isPrimary: index === 0, // Premier secteur = secteur principal
      }));

      await DossierSector.bulkCreate(dossierSectors, { transaction });
    }

    await transaction.commit();

    // Récupérer le dossier avec ses secteurs
    const dossierWithSectors = await Dossier.findByPk(dossier.id, {
      include: [
        {
          model: Sector,
          as: 'sectors',
          through: { attributes: ['isPrimary'] },
        },
      ],
    });

    return NextResponse.json({
      success: true,
      dossier: dossierWithSectors,
      message: data.isDraft
        ? 'Brouillon enregistre avec succes'
        : 'Dossier soumis avec succes',
    }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du dossier', details: error.message },
      { status: 500 }
    );
  }
}
