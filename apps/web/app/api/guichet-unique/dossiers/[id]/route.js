import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Dossier, DossierDocument, Investor, User, Ministry, DossierStepValidation, Province, City } from '../../../../../models/index.js';

// GET - Obtenir un dossier par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const dossier = await Dossier.findByPk(id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
        { model: Investor, as: 'investor' },
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName', 'code'] },
        {
          model: DossierDocument,
          as: 'documents',
          separate: true,
          order: [['createdAt', 'DESC']],
        },
        { model: Province, as: 'investorProvinceRef', attributes: ['id', 'code', 'name'] },
        { model: City, as: 'investorCityRef', attributes: ['id', 'code', 'name'] },
        { model: Province, as: 'projectProvinceRef', attributes: ['id', 'code', 'name'] },
        { model: City, as: 'projectCityRef', attributes: ['id', 'code', 'name'] },
      ],
    });

    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouve' },
        { status: 404 }
      );
    }

    // Récupérer les validations d'étapes pour construire la timeline
    const stepValidations = await DossierStepValidation.findAll({
      where: { dossierId: id },
      order: [['validatedAt', 'ASC']],
    });

    // Construire la timeline à partir des validations
    const timeline = [];

    // Ajouter la création du dossier
    timeline.push({
      date: dossier.createdAt,
      action: 'Dossier créé',
      user: dossier.createdBy?.name || 'Système',
      status: 'info',
    });

    // Ajouter la soumission si le dossier a été soumis
    if (dossier.submittedAt) {
      timeline.push({
        date: dossier.submittedAt,
        action: 'Dossier soumis',
        user: dossier.createdBy?.name || 'Investisseur',
        status: 'info',
      });
    }

    // Ajouter les validations d'étapes
    stepValidations.forEach(validation => {
      timeline.push({
        date: validation.validatedAt,
        action: `Étape ${validation.stepNumber} validée: ${validation.stepName}`,
        user: validation.validatedByName || 'Agent',
        note: validation.note,
        status: validation.status === 'VALIDATED' ? 'success' : 'info',
        stepNumber: validation.stepNumber,
        stepName: validation.stepName,
      });
    });

    // Ajouter l'approbation ou le rejet si applicable
    if (dossier.status === 'APPROVED' && dossier.decisionDate) {
      timeline.push({
        date: dossier.decisionDate,
        action: 'Dossier approuvé',
        user: 'Commission',
        note: dossier.decisionNote,
        status: 'success',
      });
    } else if (dossier.status === 'REJECTED' && dossier.decisionDate) {
      timeline.push({
        date: dossier.decisionDate,
        action: 'Dossier rejeté',
        user: 'Commission',
        note: dossier.decisionNote,
        status: 'error',
      });
    }

    // Trier par date
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Ajouter la timeline au dossier
    const dossierWithTimeline = dossier.toJSON();
    dossierWithTimeline.timeline = timeline;

    return NextResponse.json({ dossier: dossierWithTimeline });
  } catch (error) {
    console.error('Error fetching dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du dossier' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre a jour un dossier
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;
    const data = await request.json();

    const dossier = await Dossier.findByPk(id);
    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouve' },
        { status: 404 }
      );
    }

    // Handle specific actions
    if (data.action === 'submit') {
      // Submit the dossier
      await dossier.update({
        status: 'SUBMITTED',
        submittedAt: new Date(),
      });
    } else if (data.action === 'assign') {
      // Assign to a user
      await dossier.update({
        assignedToId: data.assignedToId,
        assignedAt: new Date(),
        status: dossier.status === 'SUBMITTED' ? 'IN_REVIEW' : dossier.status,
      });
    } else if (data.action === 'approve') {
      await dossier.update({
        status: 'APPROVED',
        decisionDate: new Date(),
        decisionNote: data.decisionNote || null,
      });
    } else if (data.action === 'reject') {
      await dossier.update({
        status: 'REJECTED',
        decisionDate: new Date(),
        decisionNote: data.decisionNote || null,
      });
    } else if (data.action === 'request_documents') {
      await dossier.update({
        status: 'PENDING_DOCUMENTS',
        decisionNote: data.decisionNote || 'Documents supplementaires requis',
      });
    } else if (data.action === 'advance_step') {
      // Avancer à l'étape suivante du workflow
      const currentStep = dossier.currentStep || 1;
      const nextStep = data.targetStep || currentStep + 1;

      await dossier.update({
        currentStep: nextStep,
        // Mettre à jour le statut si necessaire
        status: nextStep > 1 ? 'IN_REVIEW' : dossier.status,
      });
    } else if (data.action === 'set_step') {
      // Définir une étape spécifique (pour correction/retour en arrière)
      if (data.step && data.step >= 1) {
        await dossier.update({
          currentStep: data.step,
        });
      }
    } else if (data.action === 'validate_step') {
      // Valider l'étape actuelle et passer à la suivante
      const currentStep = dossier.currentStep || 1;
      const totalSteps = data.totalSteps || 4; // Nombre total d'étapes
      const stepNote = data.note || `Étape ${currentStep} validée`;
      const stepName = data.stepName || `Étape ${currentStep}`;

      // Enregistrer la validation dans l'historique
      await DossierStepValidation.create({
        dossierId: id,
        stepNumber: currentStep,
        stepName: stepName,
        validatedById: session?.user?.id || null,
        validatedByName: session?.user?.name || 'Système',
        note: stepNote,
        validatedAt: new Date(),
        status: 'VALIDATED',
      });

      // Mettre à jour le dossier
      const updateData = {};

      // Si c'est la dernière étape, marquer comme approuvé mais ne pas dépasser
      if (data.isFinalStep || currentStep >= totalSteps) {
        updateData.currentStep = totalSteps; // Rester sur la dernière étape
        updateData.status = 'APPROVED';
        updateData.decisionDate = new Date();
        updateData.decisionNote = data.note || 'Dossier approuvé';
      } else {
        // Passer à l'étape suivante
        updateData.currentStep = currentStep + 1;
        if (currentStep === 1) {
          updateData.status = 'IN_REVIEW';
        }
      }

      await dossier.update(updateData);
    } else {
      // General update
      const updateData = {};

      // Investor info
      if (data.investorName !== undefined) updateData.investorName = data.investorName;
      if (data.investorType !== undefined) updateData.investorType = data.investorType;
      if (data.rccm !== undefined) updateData.rccm = data.rccm;
      if (data.idNat !== undefined) updateData.idNat = data.idNat;
      if (data.nif !== undefined) updateData.nif = data.nif;
      if (data.email !== undefined) updateData.investorEmail = data.email;
      if (data.phone !== undefined) updateData.investorPhone = data.phone;
      if (data.province !== undefined) updateData.investorProvince = data.province;
      if (data.city !== undefined) updateData.investorCity = data.city;
      if (data.address !== undefined) updateData.investorAddress = data.address;

      // Project info
      if (data.projectName !== undefined) updateData.projectName = data.projectName;
      if (data.projectDescription !== undefined) updateData.projectDescription = data.projectDescription;
      if (data.sector !== undefined) updateData.sector = data.sector;
      if (data.subSector !== undefined) updateData.subSector = data.subSector;
      if (data.projectProvince !== undefined) updateData.projectProvince = data.projectProvince;
      if (data.projectProvinceId !== undefined) updateData.projectProvinceId = data.projectProvinceId || null;
      if (data.projectCity !== undefined) updateData.projectCity = data.projectCity;
      if (data.projectCityId !== undefined) updateData.projectCityId = data.projectCityId || null;
      if (data.projectAddress !== undefined) updateData.projectAddress = data.projectAddress;
      if (data.investorProvinceId !== undefined) updateData.investorProvinceId = data.investorProvinceId || null;
      if (data.investorCityId !== undefined) updateData.investorCityId = data.investorCityId || null;

      // Financial info
      if (data.investmentAmount !== undefined) {
        updateData.investmentAmount = parseFloat(String(data.investmentAmount).replace(/[^0-9.-]/g, '')) || 0;
      }
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.directJobs !== undefined) updateData.directJobs = parseInt(data.directJobs) || 0;
      if (data.indirectJobs !== undefined) updateData.indirectJobs = parseInt(data.indirectJobs) || 0;
      if (data.startDate !== undefined) updateData.startDate = data.startDate || null;
      if (data.endDate !== undefined) updateData.endDate = data.endDate || null;

      // Ministry responsable
      if (data.ministryId !== undefined) updateData.ministryId = data.ministryId || null;

      // Status
      if (data.status !== undefined) updateData.status = data.status;

      await dossier.update(updateData);
    }

    // Reload with associations
    await dossier.reload({
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName', 'code'] },
        { model: DossierDocument, as: 'documents' },
        { model: Province, as: 'projectProvinceRef', attributes: ['id', 'code', 'name'] },
        { model: City, as: 'projectCityRef', attributes: ['id', 'code', 'name'] },
        { model: Province, as: 'investorProvinceRef', attributes: ['id', 'code', 'name'] },
        { model: City, as: 'investorCityRef', attributes: ['id', 'code', 'name'] },
      ],
    });

    return NextResponse.json({ dossier });
  } catch (error) {
    console.error('Error updating dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du dossier' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un dossier
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const dossier = await Dossier.findByPk(id);
    if (!dossier) {
      return NextResponse.json(
        { error: 'Dossier non trouve' },
        { status: 404 }
      );
    }

    // Only allow deletion of drafts
    if (dossier.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Seuls les brouillons peuvent etre supprimes' },
        { status: 400 }
      );
    }

    // Delete associated documents
    await DossierDocument.destroy({ where: { dossierId: id } });

    // Delete the dossier
    await dossier.destroy();

    return NextResponse.json({ message: 'Dossier supprime avec succes' });
  } catch (error) {
    console.error('Error deleting dossier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du dossier' },
      { status: 500 }
    );
  }
}
