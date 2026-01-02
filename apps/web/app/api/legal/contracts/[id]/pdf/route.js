import { NextResponse } from 'next/server';
import { Contract, ContractType, LegalDomain } from '../../../../../../models/index.js';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

// Générer un PDF professionnel pour le contrat
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const contract = await Contract.findByPk(id, {
      include: [
        { model: ContractType, as: 'contractType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
    }

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
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://anapi.gouv.cd'}/verify/contract/${contract.id}`;
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
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CONTRAT', 105, 52, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    const titleLines = doc.splitTextToSize(contract.title, 170);
    doc.text(titleLines, 105, 60, { align: 'center' });

    // Référence du contrat
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`N° ${contract.contractNumber}`, 105, 70 + (titleLines.length - 1) * 5, { align: 'center' });

    let yPos = 80 + (titleLines.length - 1) * 5;

    // ===== INFORMATIONS GÉNÉRALES =====
    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('INFORMATIONS GENERALES', 20, yPos + 7);
    yPos += 15;

    // Grille d'informations
    const infoGrid = [
      ['Type de contrat', contract.contractType?.name || '-'],
      ['Reference interne', contract.reference || '-'],
      ['Domaine juridique', contract.domain?.name || '-'],
      ['Statut', getStatusLabel(contract.status)],
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

    // ===== PARTIES AU CONTRAT =====
    if (contract.parties && contract.parties.length > 0) {
      doc.setFillColor(240, 249, 244);
      doc.rect(15, yPos, 180, 10, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('PARTIES AU CONTRAT', 20, yPos + 7);
      yPos += 15;

      contract.parties.forEach((party, index) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        doc.text(`${index + 1}. ${party.name}`, 20, yPos);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayColor);
        doc.text(`Role: ${party.role || '-'} | Contact: ${party.contact || '-'}`, 20, yPos + 5);
        yPos += 12;
      });
      yPos += 5;
    }

    // ===== DURÉE ET VALEUR =====
    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('DUREE ET VALEUR FINANCIERE', 20, yPos + 7);
    yPos += 15;

    // Dates
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.text('DATE DE DEBUT', 20, yPos);
    doc.setFontSize(9);
    doc.setTextColor(...textColor);
    doc.text(contract.startDate ? formatDate(contract.startDate) : '-', 20, yPos + 5);

    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.text('DATE DE FIN', 70, yPos);
    doc.setFontSize(9);
    doc.setTextColor(...textColor);
    doc.text(contract.endDate ? formatDate(contract.endDate) : 'Indefinie', 70, yPos + 5);

    // Valeur
    if (contract.value) {
      doc.setFontSize(7);
      doc.setTextColor(...grayColor);
      doc.text('VALEUR DU CONTRAT', 120, yPos);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(formatCurrency(contract.value, contract.currency), 120, yPos + 5);
    }
    yPos += 18;

    // ===== DESCRIPTION =====
    if (contract.description) {
      doc.setFillColor(240, 249, 244);
      doc.rect(15, yPos, 180, 10, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('DESCRIPTION', 20, yPos + 7);
      yPos += 15;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      const descLines = doc.splitTextToSize(contract.description, 170);
      doc.text(descLines, 20, yPos);
      yPos += descLines.length * 5 + 10;
    }

    // ===== CONDITIONS =====
    doc.setFillColor(240, 249, 244);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('CONDITIONS', 20, yPos + 7);
    yPos += 15;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(`• Type de renouvellement: ${getRenewalLabel(contract.renewalType)}`, 20, yPos);
    yPos += 5;
    doc.text(`• Alertes d'expiration: ${contract.alertEnabled ? 'Activees' : 'Desactivees'}`, 20, yPos);
    yPos += 15;

    // ===== SIGNATURES =====
    // Vérifier s'il faut une nouvelle page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    const sigY = 250;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Pour ANAPI', 35, sigY);
    doc.text('Pour le Cocontractant', 135, sigY);

    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.3);
    doc.line(20, sigY + 20, 80, sigY + 20);
    doc.line(120, sigY + 20, 180, sigY + 20);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Signature et cachet', 35, sigY + 25);
    doc.text('Signature et cachet', 135, sigY + 25);

    // ===== PIED DE PAGE =====
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 290, 210, 2, 'F');
    doc.setFillColor(...primaryColor);
    doc.rect(0, 292, 210, 5, 'F');

    doc.setFontSize(6);
    doc.setTextColor(...grayColor);
    doc.text(
      `Document genere le ${formatDate(new Date())} | Ref: ${contract.contractNumber} | ID: ${contract.id}`,
      105, 286, { align: 'center' }
    );

    // Générer le buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Contrat-${contract.contractNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating contract PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la generation du PDF', details: error.message },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

function getStatusLabel(status) {
  const labels = {
    DRAFT: 'Brouillon',
    PENDING_SIGNATURE: 'En attente de signature',
    ACTIVE: 'Actif',
    SUSPENDED: 'Suspendu',
    EXPIRED: 'Expire',
    TERMINATED: 'Resilie',
    RENEWED: 'Renouvele',
    ARCHIVED: 'Archive',
  };
  return labels[status] || status;
}

function getRenewalLabel(type) {
  const labels = {
    MANUAL: 'Manuel',
    AUTO: 'Automatique',
    TACIT: 'Tacite reconduction',
    NONE: 'Sans renouvellement',
  };
  return labels[type] || type;
}
