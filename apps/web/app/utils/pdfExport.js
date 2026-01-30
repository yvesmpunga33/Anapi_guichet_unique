import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Format date for PDF
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Common PDF header
const addHeader = (doc, title, subtitle = 'Direction du Climat des Affaires') => {
  // Header background
  doc.setFillColor(0, 102, 204); // Blue header
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 35, 'F');

  // Logo placeholder text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ANAPI', 14, 15);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Agence Nationale pour la Promotion des Investissements', 14, 22);
  doc.text(subtitle, 14, 28);

  // Document title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Imprime le ${formatDate(new Date())}`, doc.internal.pageSize.getWidth() - 14, 30, { align: 'right' });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  return 45; // Return Y position after header
};

// Common PDF footer
const addFooter = (doc, pageNumber) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setDrawColor(200, 200, 200);
  doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('ANAPI - Document confidentiel', 14, pageHeight - 12);
  doc.text(`Page ${pageNumber}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
  doc.setTextColor(0, 0, 0);
};

// Export Business Barrier to PDF
export const exportBarrierToPDF = (barrier) => {
  const doc = new jsPDF();
  let y = addHeader(doc, 'FICHE OBSTACLE', 'Direction du Climat des Affaires');

  // Reference and Status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference: ${barrier.reference || '-'}`, 14, y);

  const statusLabels = {
    REPORTED: 'Signale',
    ACKNOWLEDGED: 'Accuse reception',
    UNDER_ANALYSIS: 'En analyse',
    IN_PROGRESS: 'En cours',
    ESCALATED: 'Escalade',
    RESOLVED: 'Resolu',
    CLOSED: 'Ferme',
    REJECTED: 'Rejete',
  };

  doc.setFont('helvetica', 'normal');
  doc.text(`Statut: ${statusLabels[barrier.status] || barrier.status}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
  y += 10;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(barrier.title || 'Sans titre', 180);
  doc.text(titleLines, 14, y);
  y += titleLines.length * 8 + 5;

  // Info table
  const infoData = [
    ['Categorie', barrier.category || '-'],
    ['Severite', barrier.severity || '-'],
    ['Secteur', barrier.sector || '-'],
    ['Province', barrier.province || '-'],
    ['Date de signalement', formatDate(barrier.reportedAt)],
    ['Administration concernee', barrier.concernedAdministration || '-'],
    ['Impact estime', formatCurrency(barrier.estimatedImpact)],
    ['Delai objectif', `${barrier.targetResolutionDays || 30} jours`],
  ];

  doc.autoTable({
    startY: y,
    head: [['Information', 'Valeur']],
    body: infoData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Description
  if (barrier.description) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(barrier.description, 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 10;
  }

  // Investor info
  if (barrier.investor || barrier.reporterName) {
    if (y > 220) {
      doc.addPage();
      y = addHeader(doc, 'FICHE OBSTACLE (suite)', 'Direction du Climat des Affaires');
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact / Investisseur', 14, y);
    y += 6;

    const contactData = [];
    if (barrier.reporterName) contactData.push(['Rapporteur', barrier.reporterName]);
    if (barrier.reporterEmail) contactData.push(['Email', barrier.reporterEmail]);
    if (barrier.reporterPhone) contactData.push(['Telephone', barrier.reporterPhone]);
    if (barrier.investor?.name) contactData.push(['Investisseur', barrier.investor.name]);
    if (barrier.investor?.country) contactData.push(['Pays', barrier.investor.country]);

    if (contactData.length > 0) {
      doc.autoTable({
        startY: y,
        body: contactData,
        theme: 'plain',
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  }

  // Resolution history
  if (barrier.resolutions && barrier.resolutions.length > 0) {
    if (y > 200) {
      doc.addPage();
      y = addHeader(doc, 'FICHE OBSTACLE (suite)', 'Direction du Climat des Affaires');
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Historique des actions', 14, y);
    y += 6;

    const actionLabels = {
      STATUS_CHANGE: 'Changement de statut',
      COMMENT: 'Commentaire',
      ASSIGNMENT: 'Assignation',
      MEETING: 'Reunion',
      ESCALATION: 'Escalade',
      RESOLUTION: 'Resolution',
      CONTACT_ADMIN: 'Contact administration',
    };

    const resolutionData = barrier.resolutions.map(r => [
      actionLabels[r.actionType] || r.actionType,
      r.description || '-',
      formatDate(r.actionDate),
    ]);

    doc.autoTable({
      startY: y,
      head: [['Action', 'Description', 'Date']],
      body: resolutionData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
      columnStyles: {
        1: { cellWidth: 100 },
      },
    });
  }

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`obstacle_${barrier.reference || barrier.id}.pdf`);
};

// Export Mediation to PDF
export const exportMediationToPDF = (mediation) => {
  const doc = new jsPDF();
  let y = addHeader(doc, 'FICHE MEDIATION', 'Direction du Climat des Affaires');

  const statusLabels = {
    INITIATED: 'Initiee',
    ASSIGNED: 'Assignee',
    IN_PROGRESS: 'En cours',
    AWAITING_RESPONSE: 'En attente de reponse',
    NEGOTIATION: 'Negociation',
    AGREEMENT_REACHED: 'Accord atteint',
    RESOLVED: 'Resolue',
    FAILED: 'Echouee',
    ESCALATED: 'Escaladee',
    CLOSED: 'Fermee',
  };

  // Reference and Status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference: ${mediation.caseNumber || mediation.reference || '-'}`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut: ${statusLabels[mediation.status] || mediation.status}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
  y += 10;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(mediation.title || 'Sans titre', 180);
  doc.text(titleLines, 14, y);
  y += titleLines.length * 8 + 5;

  // Info table
  const infoData = [
    ['Type', mediation.mediationType || '-'],
    ['Priorite', mediation.priority || '-'],
    ['Date d\'ouverture', formatDate(mediation.startDate || mediation.filedAt)],
    ['Partie plaignante', mediation.complainantName || '-'],
    ['Partie defenderesse', mediation.respondentName || '-'],
    ['Valeur en litige', formatCurrency(mediation.disputeValue)],
  ];

  doc.autoTable({
    startY: y,
    head: [['Information', 'Valeur']],
    body: infoData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Description
  if (mediation.description || mediation.issueDescription) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description du differend', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(mediation.description || mediation.issueDescription || '', 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 10;
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`mediation_${mediation.caseNumber || mediation.id}.pdf`);
};

// Export Dialogue to PDF
export const exportDialogueToPDF = (dialogue) => {
  const doc = new jsPDF();
  let y = addHeader(doc, 'FICHE DIALOGUE', 'Direction du Climat des Affaires');

  const statusLabels = {
    PLANNED: 'Planifie',
    CONFIRMED: 'Confirme',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Complete',
    CANCELLED: 'Annule',
    POSTPONED: 'Reporte',
    FOLLOW_UP: 'Suivi',
  };

  // Reference and Status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference: ${dialogue.reference || '-'}`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut: ${statusLabels[dialogue.status] || dialogue.status}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
  y += 10;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(dialogue.title || 'Sans titre', 180);
  doc.text(titleLines, 14, y);
  y += titleLines.length * 8 + 5;

  // Info table
  const infoData = [
    ['Type de dialogue', dialogue.dialogueType || '-'],
    ['Date et heure', formatDate(dialogue.scheduledDate)],
    ['Lieu', dialogue.location || dialogue.venue || '-'],
    ['Organisateur', dialogue.organizer || '-'],
    ['Secteur', dialogue.sector || '-'],
    ['Nombre de participants', dialogue.expectedParticipants || '-'],
  ];

  doc.autoTable({
    startY: y,
    head: [['Information', 'Valeur']],
    body: infoData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Description / Agenda
  if (dialogue.description || dialogue.agenda) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Objectifs / Agenda', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(dialogue.description || dialogue.agenda || '', 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 10;
  }

  // Participants
  if (dialogue.participants && dialogue.participants.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Participants', 14, y);
    y += 6;

    const participantData = dialogue.participants.map(p => [
      p.name || '-',
      p.organization || '-',
      p.role || '-',
    ]);

    doc.autoTable({
      startY: y,
      head: [['Nom', 'Organisation', 'Role']],
      body: participantData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`dialogue_${dialogue.reference || dialogue.id}.pdf`);
};

// Export Proposal to PDF
export const exportProposalToPDF = (proposal) => {
  const doc = new jsPDF();
  let y = addHeader(doc, 'FICHE PROPOSITION LEGALE', 'Direction du Climat des Affaires');

  const statusLabels = {
    DRAFT: 'Brouillon',
    SUBMITTED: 'Soumise',
    UNDER_REVIEW: 'En revision',
    APPROVED: 'Approuvee',
    REJECTED: 'Rejetee',
    IMPLEMENTING: 'En implementation',
    IMPLEMENTED: 'Implementee',
    ARCHIVED: 'Archivee',
  };

  // Reference and Status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference: ${proposal.reference || '-'}`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut: ${statusLabels[proposal.status] || proposal.status}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
  y += 10;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(proposal.title || 'Sans titre', 180);
  doc.text(titleLines, 14, y);
  y += titleLines.length * 8 + 5;

  // Info table
  const infoData = [
    ['Type de reforme', proposal.reformType || proposal.proposalType || '-'],
    ['Categorie', proposal.category || '-'],
    ['Priorite', proposal.priority || '-'],
    ['Ministere responsable', proposal.responsibleMinistry || '-'],
    ['Date de soumission', formatDate(proposal.submittedAt)],
    ['Date cible', formatDate(proposal.targetDate)],
  ];

  doc.autoTable({
    startY: y,
    head: [['Information', 'Valeur']],
    body: infoData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Description
  if (proposal.description || proposal.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resume de la proposition', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(proposal.description || proposal.summary || '', 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 10;
  }

  // Expected Impact
  if (proposal.expectedImpact) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Impact attendu', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const impactLines = doc.splitTextToSize(proposal.expectedImpact, 180);
    doc.text(impactLines, 14, y);
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`proposition_${proposal.reference || proposal.id}.pdf`);
};

// Export Treaty to PDF
export const exportTreatyToPDF = (treaty) => {
  const doc = new jsPDF();
  let y = addHeader(doc, 'FICHE TRAITE INTERNATIONAL', 'Direction du Climat des Affaires');

  const statusLabels = {
    NEGOTIATING: 'En negociation',
    SIGNED: 'Signe',
    RATIFICATION_PENDING: 'Ratification en cours',
    RATIFIED: 'Ratifie',
    IN_FORCE: 'En vigueur',
    SUSPENDED: 'Suspendu',
    TERMINATED: 'Termine',
    EXPIRED: 'Expire',
    RENEGOTIATING: 'En renegociation',
  };

  const typeLabels = {
    BIT: 'Traite bilateral d\'investissement',
    FTA: 'Accord de libre-echange',
    DTA: 'Convention fiscale',
    INVESTMENT_PROTECTION: 'Protection des investissements',
    ECONOMIC_PARTNERSHIP: 'Partenariat economique',
    TRADE_AGREEMENT: 'Accord commercial',
    MULTILATERAL: 'Accord multilateral',
    REGIONAL: 'Accord regional',
    SECTOR_SPECIFIC: 'Accord sectoriel',
  };

  // Reference and Status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference: ${treaty.reference || '-'}`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut: ${statusLabels[treaty.status] || treaty.status}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
  y += 10;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(treaty.title || treaty.name || 'Sans titre', 180);
  doc.text(titleLines, 14, y);
  y += titleLines.length * 8 + 5;

  // Info table
  const countries = treaty.partnerCountries?.join(', ') || treaty.countries?.join(', ') || '-';
  const infoData = [
    ['Type de traite', typeLabels[treaty.treatyType] || treaty.type || '-'],
    ['Pays partenaires', countries],
    ['Organisation regionale', treaty.regionalOrganization || '-'],
    ['Date de signature', formatDate(treaty.signedDate || treaty.signatureDate)],
    ['Date de ratification', formatDate(treaty.ratificationDate)],
    ['Date d\'entree en vigueur', formatDate(treaty.entryIntoForceDate)],
    ['Date d\'expiration', formatDate(treaty.expirationDate)],
  ];

  doc.autoTable({
    startY: y,
    head: [['Information', 'Valeur']],
    body: infoData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Description
  if (treaty.description || treaty.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(treaty.description || treaty.summary || '', 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 10;
  }

  // Key Provisions
  if (treaty.keyProvisions) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Dispositions cles', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const provLines = doc.splitTextToSize(treaty.keyProvisions, 180);
    doc.text(provLines, 14, y);
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`traite_${treaty.reference || treaty.id}.pdf`);
};

// Export Indicator to PDF
export const exportIndicatorToPDF = (indicator) => {
  const doc = new jsPDF();
  let y = addHeader(doc, 'FICHE INDICATEUR', 'Direction du Climat des Affaires');

  const categoryLabels = {
    DOING_BUSINESS: 'Doing Business',
    INVESTMENT_CLIMATE: 'Climat d\'investissement',
    GOVERNANCE: 'Gouvernance',
    INFRASTRUCTURE: 'Infrastructure',
    HUMAN_CAPITAL: 'Capital humain',
    COMPETITIVENESS: 'Competitivite',
    TRADE: 'Commerce',
    CORRUPTION: 'Corruption',
    EASE_OF_BUSINESS: 'Facilite des affaires',
    CUSTOM: 'Personnalise',
  };

  const measureLabels = {
    SCORE: 'Score',
    RANK: 'Classement',
    PERCENTAGE: 'Pourcentage',
    DAYS: 'Jours',
    COUNT: 'Comptage',
    CURRENCY: 'Montant',
    INDEX: 'Indice',
    RATIO: 'Ratio',
  };

  // Code and Category
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Code: ${indicator.code || '-'}`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Categorie: ${categoryLabels[indicator.category] || indicator.category}`, doc.internal.pageSize.getWidth() - 14, y, { align: 'right' });
  y += 10;

  // Name
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const nameLines = doc.splitTextToSize(indicator.name || 'Sans nom', 180);
  doc.text(nameLines, 14, y);
  y += nameLines.length * 8 + 5;

  // Info table
  const infoData = [
    ['Type de mesure', measureLabels[indicator.measureType] || indicator.measureType || '-'],
    ['Unite', indicator.unit || '-'],
    ['Source de donnees', indicator.dataSource || '-'],
    ['Frequence de mise a jour', indicator.updateFrequency || '-'],
    ['Valeur cible', indicator.targetValue ? `${indicator.targetValue} (${indicator.targetYear || '-'})` : '-'],
    ['Direction favorable', indicator.betterDirection === 'HIGHER' ? 'Plus eleve' : 'Plus bas'],
  ];

  doc.autoTable({
    startY: y,
    head: [['Information', 'Valeur']],
    body: infoData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 10 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Description
  if (indicator.description) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(indicator.description, 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 10;
  }

  // Values history
  if (indicator.values && indicator.values.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Historique des valeurs', 14, y);
    y += 6;

    const valueData = indicator.values.map(v => [
      v.year + (v.quarter ? ` Q${v.quarter}` : ''),
      v.value,
      v.rank ? `#${v.rank}${v.rankOutOf ? ` / ${v.rankOutOf}` : ''}` : '-',
      v.changePercentage ? `${v.changePercentage > 0 ? '+' : ''}${v.changePercentage}%` : '-',
    ]);

    doc.autoTable({
      startY: y,
      head: [['Periode', 'Valeur', 'Rang', 'Variation']],
      body: valueData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`indicateur_${indicator.code || indicator.id}.pdf`);
};

// Export list to PDF (generic for tables)
export const exportListToPDF = (title, columns, data, filename) => {
  const doc = new jsPDF('landscape');
  let y = addHeader(doc, title, 'Direction du Climat des Affaires');

  doc.autoTable({
    startY: y,
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => c.accessor(row))),
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i);
  }

  doc.save(`${filename}.pdf`);
};
