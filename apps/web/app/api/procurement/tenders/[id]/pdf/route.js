import { NextResponse } from 'next/server';
import { Tender, TenderLot, Ministry, sequelize } from '../../../../../../models/index.js';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

// Générer un PDF professionnel pour l'appel d'offres
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Récupérer l'appel d'offres sans includes User
    const tender = await Tender.findByPk(id);

    if (!tender) {
      return NextResponse.json({ error: 'Appel d\'offres non trouve' }, { status: 404 });
    }

    const tenderJson = tender.toJSON();

    // Enrichir avec le ministère
    if (tenderJson.ministryId) {
      const ministry = await Ministry.findByPk(tenderJson.ministryId, {
        attributes: ['id', 'code', 'name', 'shortName'],
      });
      tenderJson.ministry = ministry ? ministry.toJSON() : null;
    }

    // Récupérer les lots
    const lots = await TenderLot.findAll({
      where: { tenderId: id },
      order: [['lotNumber', 'ASC']],
    });
    tenderJson.lots = lots.map(l => l.toJSON());

    // Créer le PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Couleurs ANAPI
    const primaryColor = [0, 107, 63]; // Vert
    const secondaryColor = [252, 209, 22]; // Jaune
    const textColor = [26, 26, 26];
    const grayColor = [102, 102, 102];

    // Générer le QR Code
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://anapi.gouv.cd'}/verify/tender/${tenderJson.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#006B3F', light: '#FFFFFF' },
    });

    // ===== EN-TÊTE =====
    // Bande verte en haut
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 4, 'F');
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 4, 210, 2, 'F');

    // Logo ANAPI (texte stylisé)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('ANAPI', 15, 20);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Agence Nationale pour la Promotion des Investissements', 15, 26);
    doc.text('Republique Democratique du Congo', 15, 30);

    // QR Code en haut à droite
    doc.addImage(qrCodeDataUrl, 'PNG', 175, 10, 25, 25);
    doc.setFontSize(5);
    doc.setTextColor(...grayColor);
    doc.text('Scanner pour verifier', 180, 38);

    // Ligne de séparation
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);

    // ===== TITRE DU DOCUMENT =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('AVIS D\'APPEL D\'OFFRES', 105, 52, { align: 'center' });

    // Type d'appel d'offres
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(getTypeLabel(tenderJson.type), 105, 58, { align: 'center' });

    // Référence
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`Référence: ${tenderJson.reference}`, 105, 66, { align: 'center' });

    let yPos = 75;

    // ===== INFORMATIONS DE L'AUTORITÉ CONTRACTANTE =====
    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('AUTORITE CONTRACTANTE', 20, yPos + 7);
    yPos += 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(tenderJson.ministry?.name || 'Agence Nationale pour la Promotion des Investissements', 20, yPos);
    yPos += 15;

    // ===== OBJET DU MARCHÉ =====
    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('OBJET DU MARCHE', 20, yPos + 7);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    const titleLines = doc.splitTextToSize(tenderJson.title, 170);
    doc.text(titleLines, 20, yPos);
    yPos += titleLines.length * 5 + 5;

    if (tenderJson.objective) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const objLines = doc.splitTextToSize(tenderJson.objective, 170);
      doc.text(objLines, 20, yPos);
      yPos += objLines.length * 4 + 10;
    } else {
      yPos += 5;
    }

    // ===== INFORMATIONS CLÉS =====
    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('INFORMATIONS CLES', 20, yPos + 7);
    yPos += 15;

    // Grille d'informations
    const infoGrid = [
      ['Categorie', getCategoryLabel(tenderJson.category)],
      ['Budget estime', formatCurrency(tenderJson.estimatedBudget, tenderJson.currency)],
      ['Source de financement', tenderJson.fundingSource || 'Budget national'],
      ['Exercice fiscal', tenderJson.fiscalYear?.toString() || new Date().getFullYear().toString()],
    ];

    doc.setFont('helvetica', 'normal');
    infoGrid.forEach(([label, value], index) => {
      const xPos = index % 2 === 0 ? 20 : 110;
      if (index % 2 === 0 && index > 0) yPos += 12;

      doc.setFontSize(7);
      doc.setTextColor(...grayColor);
      doc.text(label.toUpperCase(), xPos, yPos);
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      doc.text(value || '-', xPos, yPos + 5);
    });
    yPos += 20;

    // ===== LOTS =====
    if (tenderJson.lots && tenderJson.lots.length > 0) {
      doc.setFillColor(240, 249, 244);
      doc.rect(15, yPos, 180, 10, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(`LOTS (${tenderJson.lots.length})`, 20, yPos + 7);
      yPos += 15;

      tenderJson.lots.forEach((lot, index) => {
        // Vérifier s'il faut une nouvelle page
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        doc.text(`Lot ${lot.lotNumber}: ${lot.title}`, 20, yPos);

        if (lot.estimatedValue) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...grayColor);
          doc.text(`Montant estime: ${formatCurrency(lot.estimatedValue, tenderJson.currency)}`, 20, yPos + 5);
          yPos += 5;
        }

        yPos += 8;
      });
      yPos += 5;
    }

    // ===== CALENDRIER =====
    // Vérifier s'il faut une nouvelle page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CALENDRIER', 20, yPos + 7);
    yPos += 15;

    const dates = [
      ['Date de publication', formatDate(tenderJson.publishDate)],
      ['Date limite de soumission', formatDateTime(tenderJson.submissionDeadline)],
      ['Date d\'ouverture des plis', formatDateTime(tenderJson.openingDate)],
      ['Periode d\'evaluation', `${formatDate(tenderJson.evaluationStartDate)} - ${formatDate(tenderJson.evaluationEndDate)}`],
    ];

    dates.forEach(([label, value]) => {
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      doc.text(label + ':', 20, yPos);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text(value || '-', 80, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    });
    yPos += 10;

    // ===== CRITÈRES D'ÉVALUATION =====
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CRITERES D\'EVALUATION', 20, yPos + 7);
    yPos += 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(`• Ponderation technique: ${tenderJson.technicalCriteriaWeight || 70}%`, 20, yPos);
    yPos += 6;
    doc.text(`• Ponderation financiere: ${tenderJson.financialCriteriaWeight || 30}%`, 20, yPos);
    yPos += 6;
    doc.text(`• Score technique minimum requis: ${tenderJson.minimumTechnicalScore || 60}%`, 20, yPos);
    yPos += 15;

    // ===== CONDITIONS DE PARTICIPATION =====
    if (tenderJson.eligibilityCriteria) {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(240, 249, 244);
      doc.rect(15, yPos, 180, 10, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('CONDITIONS DE PARTICIPATION', 20, yPos + 7);
      yPos += 15;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      const condLines = doc.splitTextToSize(tenderJson.eligibilityCriteria, 170);
      doc.text(condLines, 20, yPos);
      yPos += condLines.length * 4 + 10;
    }

    // ===== PIED DE PAGE =====
    // S'assurer que le pied de page est sur la dernière page
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(...secondaryColor);
    doc.rect(0, pageHeight - 12, 210, 2, 'F');
    doc.setFillColor(...primaryColor);
    doc.rect(0, pageHeight - 10, 210, 10, 'F');

    doc.setFontSize(6);
    doc.setTextColor(...grayColor);
    doc.text(
      `Document genere le ${formatDate(new Date())} | Ref: ${tenderJson.reference} | ID: ${tenderJson.id}`,
      105, pageHeight - 14, { align: 'center' }
    );

    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('ANAPI - Agence Nationale pour la Promotion des Investissements', 105, pageHeight - 5, { align: 'center' });

    // Générer le buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="AO-${tenderJson.reference}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating tender PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la generation du PDF', details: error.message },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires
function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(value, currency = 'USD') {
  if (!value) return 'Non defini';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(value);
}

function getTypeLabel(type) {
  const labels = {
    OPEN: 'Appel d\'offres ouvert',
    RESTRICTED: 'Appel d\'offres restreint',
    NEGOTIATED: 'Marche negocie',
    DIRECT: 'Marche direct',
    FRAMEWORK: 'Accord-cadre',
  };
  return labels[type] || type;
}

function getCategoryLabel(category) {
  const labels = {
    WORKS: 'Travaux',
    GOODS: 'Fournitures',
    SERVICES: 'Services',
    CONSULTING: 'Consultance',
  };
  return labels[category] || category;
}

function getStatusLabel(status) {
  const labels = {
    DRAFT: 'Brouillon',
    PENDING_APPROVAL: 'En attente d\'approbation',
    PUBLISHED: 'Publie',
    SUBMISSION_CLOSED: 'Soumissions cloturees',
    EVALUATION: 'En evaluation',
    AWARDED: 'Attribue',
    CANCELLED: 'Annule',
    COMPLETED: 'Termine',
  };
  return labels[status] || status;
}
