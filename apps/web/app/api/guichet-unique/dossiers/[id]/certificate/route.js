import { NextResponse } from 'next/server';
import { Dossier, Ministry, DossierStepValidation, User } from '../../../../../../models/index.js';

// GET - Générer le certificat PDF pour un dossier approuvé
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const dossier = await Dossier.findByPk(id, {
      include: [
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName', 'code'] },
        {
          model: DossierStepValidation,
          as: 'stepValidations',
          order: [['stepNumber', 'ASC']],
          include: [
            { model: User, as: 'validatedBy', attributes: ['id', 'name', 'email'] }
          ]
        },
      ],
    });

    if (!dossier) {
      return NextResponse.json({ error: 'Dossier non trouvé' }, { status: 404 });
    }

    if (dossier.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Le certificat n\'est disponible que pour les dossiers approuvés' },
        { status: 400 }
      );
    }

    // Générer le préfixe du certificat selon le type
    const getCertificatePrefix = (type) => {
      const prefixes = {
        'PERMIS': 'PER',
        'PERMIS_CONSTRUCTION': 'PER',
        'LICENCE': 'LIC',
        'LICENCE_EXPLOITATION': 'LIC',
        'AGREMENT': 'AGR',
        'AGREMENT_REGIME': 'AGR',
        'AUTORISATION': 'AUT',
        'AUTORISATION_ACTIVITE': 'AUT',
      };
      return prefixes[type] || 'CERT';
    };

    // Générer le HTML du certificat
    const certificateNumber = `${getCertificatePrefix(dossier.dossierType)}-${dossier.dossierNumber.replace('DOS-', '')}`;
    const approvalDate = dossier.decisionDate || dossier.updatedAt;
    const formattedDate = new Date(approvalDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const formatAmount = (amount, currency = 'USD') => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(amount || 0);
    };

    const getDossierTypeLabel = (type, sector, projectName) => {
      // Labels génériques par type de dossier
      const typeLabels = {
        'AGREMENT': 'Agrément',
        'AGREMENT_REGIME': 'Agrément au Régime Privilégié',
        'LICENCE': 'Licence',
        'LICENCE_EXPLOITATION': 'Licence d\'Exploitation',
        'PERMIS': 'Permis',
        'PERMIS_CONSTRUCTION': 'Permis',
        'AUTORISATION': 'Autorisation',
        'AUTORISATION_ACTIVITE': 'Autorisation',
      };

      const baseLabel = typeLabels[type] || 'Certificat';

      // Construire un label basé sur le secteur d'activité
      if (sector) {
        return `${baseLabel} - Secteur ${sector}`;
      }

      return baseLabel;
    };

    const getValidityPeriod = (type) => {
      const periods = {
        'AGREMENT': '5 ans',
        'AGREMENT_REGIME': '10 ans',
        'LICENCE': '3 ans',
        'LICENCE_EXPLOITATION': '3 ans',
        'PERMIS': '2 ans',
        'PERMIS_CONSTRUCTION': '2 ans',
        'AUTORISATION': '1 an',
        'AUTORISATION_ACTIVITE': '1 an',
      };
      return periods[type] || '5 ans';
    };

    // Configuration des styles par type de certificat
    const getCertificateStyle = (type) => {
      const styles = {
        // PERMIS - Bleu marine / Or (design actuel)
        'PERMIS': {
          primaryColor: '#1e3a5f',
          secondaryColor: '#c9a227',
          gradientStart: '#1e3a5f',
          gradientEnd: '#2c5282',
          watermarkColor: 'rgba(30, 58, 95, 0.03)',
          titleIcon: '🏗️',
          documentTitle: 'PERMIS',
          headerBg: 'linear-gradient(90deg, #1e3a5f, #2c5282)',
        },
        'PERMIS_CONSTRUCTION': {
          primaryColor: '#1e3a5f',
          secondaryColor: '#c9a227',
          gradientStart: '#1e3a5f',
          gradientEnd: '#2c5282',
          watermarkColor: 'rgba(30, 58, 95, 0.03)',
          titleIcon: '🏗️',
          documentTitle: 'PERMIS',
          headerBg: 'linear-gradient(90deg, #1e3a5f, #2c5282)',
        },
        // LICENCE - Violet / Argent
        'LICENCE': {
          primaryColor: '#5b21b6',
          secondaryColor: '#9ca3af',
          gradientStart: '#5b21b6',
          gradientEnd: '#7c3aed',
          watermarkColor: 'rgba(91, 33, 182, 0.03)',
          titleIcon: '📜',
          documentTitle: 'LICENCE',
          headerBg: 'linear-gradient(90deg, #5b21b6, #7c3aed)',
        },
        'LICENCE_EXPLOITATION': {
          primaryColor: '#5b21b6',
          secondaryColor: '#9ca3af',
          gradientStart: '#5b21b6',
          gradientEnd: '#7c3aed',
          watermarkColor: 'rgba(91, 33, 182, 0.03)',
          titleIcon: '📜',
          documentTitle: 'LICENCE',
          headerBg: 'linear-gradient(90deg, #5b21b6, #7c3aed)',
        },
        // AGREMENT - Vert émeraude / Or
        'AGREMENT': {
          primaryColor: '#047857',
          secondaryColor: '#d4af37',
          gradientStart: '#047857',
          gradientEnd: '#059669',
          watermarkColor: 'rgba(4, 120, 87, 0.03)',
          titleIcon: '✅',
          documentTitle: 'AGRÉMENT',
          headerBg: 'linear-gradient(90deg, #047857, #059669)',
        },
        'AGREMENT_REGIME': {
          primaryColor: '#047857',
          secondaryColor: '#d4af37',
          gradientStart: '#047857',
          gradientEnd: '#059669',
          watermarkColor: 'rgba(4, 120, 87, 0.03)',
          titleIcon: '✅',
          documentTitle: 'AGRÉMENT',
          headerBg: 'linear-gradient(90deg, #047857, #059669)',
        },
        // AUTORISATION - Rouge bordeaux / Bronze
        'AUTORISATION': {
          primaryColor: '#7f1d1d',
          secondaryColor: '#b8860b',
          gradientStart: '#7f1d1d',
          gradientEnd: '#991b1b',
          watermarkColor: 'rgba(127, 29, 29, 0.03)',
          titleIcon: '🔑',
          documentTitle: 'AUTORISATION',
          headerBg: 'linear-gradient(90deg, #7f1d1d, #991b1b)',
        },
        'AUTORISATION_ACTIVITE': {
          primaryColor: '#7f1d1d',
          secondaryColor: '#b8860b',
          gradientStart: '#7f1d1d',
          gradientEnd: '#991b1b',
          watermarkColor: 'rgba(127, 29, 29, 0.03)',
          titleIcon: '🔑',
          documentTitle: 'AUTORISATION',
          headerBg: 'linear-gradient(90deg, #7f1d1d, #991b1b)',
        },
      };

      // Par défaut, style PERMIS
      return styles[type] || styles['PERMIS'];
    };

    // Obtenir le style pour ce type de dossier
    const certStyle = getCertificateStyle(dossier.dossierType);

    // Générer les lignes de validation des étapes
    const validationStepsHtml = (dossier.stepValidations || []).map((v, index) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 9pt;">${v.stepNumber}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 9pt;">${v.stepName || 'Étape ' + v.stepNumber}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 9pt;">${v.validatedByName || 'Système'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 9pt;">${new Date(v.validatedAt).toLocaleDateString('fr-FR')}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 9pt; color: #2e7d32;">✓ Validé</td>
      </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Certificat ${certificateNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 0;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', Times, serif;
      background: #fff;
      color: #1a1a1a;
      line-height: 1.4;
    }

    .certificate {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm;
      background: #fff;
      position: relative;
    }

    .border-outer {
      border: 4px solid ${certStyle.primaryColor};
      padding: 3mm;
    }

    .border-inner {
      border: 2px solid ${certStyle.secondaryColor};
      padding: 8mm;
      min-height: 270mm;
      position: relative;
      background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
    }

    /* Watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 80pt;
      color: ${certStyle.watermarkColor};
      font-weight: bold;
      letter-spacing: 10px;
      pointer-events: none;
      z-index: 0;
    }

    .content-wrapper {
      position: relative;
      z-index: 1;
    }

    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 5mm;
      padding-bottom: 5mm;
      border-bottom: 2px solid #c9a227;
    }

    .flag-section {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 3mm;
    }

    .flag-stripe {
      width: 20mm;
      height: 3mm;
    }

    .flag-blue { background: #0052b4; }
    .flag-yellow { background: #ffda44; }
    .flag-red { background: #d80027; }

    .coat-of-arms {
      width: 25mm;
      height: 25mm;
      margin: 0 5mm;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18pt;
      color: ${certStyle.secondaryColor};
      border: 2px solid ${certStyle.secondaryColor};
      border-radius: 50%;
      background: #fafafa;
    }

    .country-name {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: ${certStyle.primaryColor};
      margin-bottom: 1mm;
    }

    .motto {
      font-size: 10pt;
      font-style: italic;
      color: #666;
      margin-bottom: 3mm;
    }

    .ministry-name {
      font-size: 11pt;
      color: ${certStyle.primaryColor};
      font-weight: bold;
      margin-bottom: 1mm;
    }

    .agency-section {
      background: ${certStyle.headerBg};
      color: white;
      padding: 3mm 5mm;
      margin: 3mm 0;
      border-radius: 2px;
    }

    .agency-name {
      font-size: 13pt;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .agency-full {
      font-size: 9pt;
      opacity: 0.9;
    }

    /* Certificate Title */
    .certificate-title {
      text-align: center;
      margin: 6mm 0 3mm 0;
    }

    .title-main {
      font-size: 28pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 8px;
      color: ${certStyle.primaryColor};
      margin-bottom: 2mm;
    }

    .title-type {
      font-size: 14pt;
      color: ${certStyle.secondaryColor};
      font-weight: bold;
    }

    .certificate-number-section {
      text-align: center;
      margin-bottom: 5mm;
    }

    .certificate-number {
      display: inline-block;
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 2mm 6mm;
      font-size: 11pt;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      color: ${certStyle.primaryColor};
    }

    /* Main Content */
    .main-content {
      margin: 4mm 0;
    }

    .intro-text {
      font-size: 11pt;
      text-align: justify;
      text-indent: 10mm;
      margin-bottom: 4mm;
      line-height: 1.6;
    }

    .certify-text {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      color: ${certStyle.primaryColor};
      margin: 4mm 0;
      padding: 3mm;
      background: ${certStyle.secondaryColor}15;
      border-left: 4px solid ${certStyle.secondaryColor};
      border-right: 4px solid ${certStyle.secondaryColor};
    }

    /* Info Boxes */
    .info-section {
      display: flex;
      gap: 4mm;
      margin: 5mm 0;
    }

    .info-box {
      flex: 1;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      padding: 4mm;
    }

    .info-box-title {
      font-size: 9pt;
      font-weight: bold;
      color: ${certStyle.primaryColor};
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid ${certStyle.secondaryColor};
      padding-bottom: 2mm;
      margin-bottom: 3mm;
    }

    .info-row {
      display: flex;
      margin-bottom: 2mm;
      font-size: 9pt;
    }

    .info-label {
      flex: 0 0 40%;
      color: #666;
    }

    .info-value {
      flex: 1;
      font-weight: bold;
      color: #1a1a1a;
    }

    /* Validation Table */
    .validation-section {
      margin: 5mm 0;
    }

    .section-title {
      font-size: 10pt;
      font-weight: bold;
      color: ${certStyle.primaryColor};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 3mm;
      padding-bottom: 1mm;
      border-bottom: 2px solid ${certStyle.secondaryColor};
    }

    .validation-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }

    .validation-table th {
      background: ${certStyle.primaryColor};
      color: white;
      padding: 6px 8px;
      text-align: left;
      font-size: 8pt;
      text-transform: uppercase;
    }

    /* Footer */
    .certificate-footer {
      margin-top: 5mm;
    }

    .date-location {
      text-align: center;
      font-style: italic;
      margin-bottom: 5mm;
      font-size: 10pt;
    }

    .signature-block {
      width: 35%;
      text-align: center;
    }

    .signature-title {
      font-size: 9pt;
      color: #666;
      margin-bottom: 12mm;
    }

    .signature-line {
      border-top: 1px solid #1a1a1a;
      margin-bottom: 2mm;
    }

    .signature-name {
      font-size: 10pt;
      font-weight: bold;
      color: ${certStyle.primaryColor};
    }

    .signature-role {
      font-size: 8pt;
      color: #666;
    }

    /* Seal - inline avec signatures */
    .seal-inline {
      width: 28mm;
      height: 28mm;
    }

    .seal-outer {
      width: 100%;
      height: 100%;
      border: 3px double ${certStyle.secondaryColor};
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.95);
    }

    .seal-text {
      font-size: 8pt;
      font-weight: bold;
      color: ${certStyle.primaryColor};
    }

    .seal-sub {
      font-size: 6pt;
      color: #666;
    }

    .seal-check {
      font-size: 12pt;
      color: #2e7d32;
      margin: 1mm 0;
    }

    /* QR Code - intégré dans les signatures */
    .qr-code-section {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .qr-code-container {
      width: 22mm;
      height: 22mm;
      padding: 1.5mm;
      background: white;
      border: 1px solid #ddd;
      border-radius: 3px;
    }

    .qr-code-container img {
      width: 100%;
      height: 100%;
    }

    .qr-code-label {
      font-size: 5pt;
      color: #666;
      margin-top: 1mm;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* Signatures avec QR code au centre */
    .signatures-with-qr {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 6mm;
      gap: 3mm;
    }

    /* Legal Footer */
    .legal-footer {
      text-align: center;
      font-size: 7pt;
      color: #888;
      border-top: 1px solid #e0e0e0;
      padding-top: 2mm;
      margin-top: 8mm;
    }

    @media print {
      .certificate {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border-outer">
      <div class="border-inner">
        <div class="watermark">ANAPI</div>

        <div class="content-wrapper">
          <!-- Header -->
          <div class="header">
            <div class="flag-section">
              <div class="flag-stripe flag-blue"></div>
              <div class="coat-of-arms">RDC</div>
              <div class="flag-stripe flag-yellow"></div>
            </div>
            <div class="country-name">République Démocratique du Congo</div>
            <div class="motto">"Justice - Paix - Travail"</div>
            <div class="ministry-name">${dossier.ministry?.name || 'Ministère du Plan'}</div>
            <div class="agency-section">
              <div class="agency-name">ANAPI</div>
              <div class="agency-full">Agence Nationale de Promotion des Investissements</div>
            </div>
          </div>

          <!-- Certificate Title -->
          <div class="certificate-title">
            <div class="title-main">${certStyle.documentTitle}</div>
            <div class="title-type">${getDossierTypeLabel(dossier.dossierType, dossier.sector, dossier.projectName)}</div>
          </div>

          <div class="certificate-number-section">
            <span class="certificate-number">${certificateNumber}</span>
          </div>

          <!-- Main Content -->
          <div class="main-content">
            <p class="intro-text">
              Le Directeur Général de l'Agence Nationale de Promotion des Investissements (ANAPI),
              vu la loi n° 004/2002 du 21 février 2002 portant Code des Investissements,
              vu le décret n° 065/2002 du 5 juin 2002 portant mesures d'application du Code des Investissements,
              et après examen du dossier n° <strong>${dossier.dossierNumber}</strong> conformément aux dispositions légales et réglementaires en vigueur,
            </p>

            <div class="certify-text">
              CERTIFIE QUE LE PROJET D'INVESTISSEMENT
            </div>

            <div class="info-section">
              <div class="info-box">
                <div class="info-box-title">Informations Investisseur</div>
                <div class="info-row">
                  <span class="info-label">Raison sociale :</span>
                  <span class="info-value">${dossier.investorName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Type :</span>
                  <span class="info-value">${dossier.investorType === 'company' ? 'Société' : 'Personne Physique'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">RCCM :</span>
                  <span class="info-value">${dossier.rccm || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">ID National :</span>
                  <span class="info-value">${dossier.idNat || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">NIF :</span>
                  <span class="info-value">${dossier.nif || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Pays :</span>
                  <span class="info-value">${dossier.investorCountry || 'RDC'}</span>
                </div>
              </div>

              <div class="info-box">
                <div class="info-box-title">Détails du Projet</div>
                <div class="info-row">
                  <span class="info-label">Dénomination :</span>
                  <span class="info-value">${dossier.projectName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Secteur :</span>
                  <span class="info-value">${dossier.sector || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Province :</span>
                  <span class="info-value">${dossier.projectProvince || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Ville :</span>
                  <span class="info-value">${dossier.projectCity || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Investissement :</span>
                  <span class="info-value">${formatAmount(dossier.investmentAmount, dossier.currency)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Emplois prévus :</span>
                  <span class="info-value">${(dossier.directJobs || 0)} directs / ${(dossier.indirectJobs || 0)} indirects</span>
                </div>
              </div>
            </div>

            <!-- Validation Steps -->
            ${(dossier.stepValidations && dossier.stepValidations.length > 0) ? `
            <div class="validation-section">
              <div class="section-title">Historique des Validations</div>
              <table class="validation-table">
                <thead>
                  <tr>
                    <th style="width: 10%;">N°</th>
                    <th style="width: 30%;">Étape</th>
                    <th style="width: 25%;">Validé par</th>
                    <th style="width: 20%;">Date</th>
                    <th style="width: 15%;">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  ${validationStepsHtml}
                </tbody>
              </table>
            </div>
            ` : ''}

            <p class="intro-text" style="margin-top: 4mm;">
              A été dûment examiné et approuvé par les services compétents de l'ANAPI.
              Ce certificat confère au bénéficiaire les avantages prévus par le Code des Investissements
              pour une durée de <strong>${getValidityPeriod(dossier.dossierType)}</strong> à compter de sa date de délivrance.
            </p>
          </div>

          <!-- Footer -->
          <div class="certificate-footer">
            <div class="date-location">
              Fait à Kinshasa, le ${formattedDate}
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 5mm;">
              <div class="signature-block">
                <div class="signature-title">Le Directeur des Opérations</div>
                <div class="signature-line"></div>
                <div class="signature-name">Jean-Pierre KABONGO</div>
                <div class="signature-role">Directeur des Opérations</div>
              </div>

              <div class="signature-block">
                <div class="signature-title">Le Directeur Général</div>
                <div class="signature-line"></div>
                <div class="signature-name">Marie LUMUMBA</div>
                <div class="signature-role">Directeur Général de l'ANAPI</div>
              </div>
            </div>

            <!-- QR Code et Sceau -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5mm; padding-top: 3mm; border-top: 1px dashed #ddd;">
              <!-- QR Code à gauche -->
              <div class="qr-code-section">
                <div class="qr-code-container">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://anapi.cd/verify/${certificateNumber}`)}" alt="QR Code de vérification" />
                </div>
                <div class="qr-code-label">Scanner pour vérifier</div>
              </div>

              <!-- Texte central -->
              <div style="text-align: center; flex: 1; padding: 0 5mm;">
                <div style="font-size: 8pt; color: #666; line-height: 1.4;">
                  Document officiel - ${certificateNumber}<br/>
                  Ce certificat est authentique et vérifiable<br/>
                  Avenue Colonel Lukusa, Kinshasa/Gombe, RDC<br/>
                  Tel: +243 81 XXX XXXX | www.anapi.cd
                </div>
              </div>

              <!-- Sceau à droite -->
              <div class="seal-inline">
                <div class="seal-outer">
                  <div class="seal-text">ANAPI</div>
                  <div class="seal-check">✓</div>
                  <div class="seal-sub">APPROUVÉ</div>
                  <div class="seal-sub">RDC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Retourner le HTML comme réponse (pour affichage ou conversion en PDF côté client)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du certificat' },
      { status: 500 }
    );
  }
}
