import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dossierType = searchParams.get('dossierType');

    let url = `${API_URL}/api/v1/config/required-documents`;
    if (dossierType) {
      url += `?dossierType=${dossierType}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback required documents based on dossier type
      const fallbackDocuments = {
        'AGREMENT_REGIME': [
          { id: 1, name: 'Statuts notariés de l\'entreprise', code: 'STATUTS', required: true },
          { id: 2, name: 'RCCM (Registre de Commerce)', code: 'RCCM', required: true },
          { id: 3, name: 'Numéro d\'Identification Nationale (NIF)', code: 'NIF', required: true },
          { id: 4, name: 'Plan d\'affaires', code: 'BUSINESS_PLAN', required: true },
          { id: 5, name: 'Étude de faisabilité', code: 'FEASIBILITY', required: true },
          { id: 6, name: 'Attestation fiscale', code: 'TAX_CERT', required: false },
        ],
        'LICENCE_EXPLOITATION': [
          { id: 1, name: 'Statuts notariés de l\'entreprise', code: 'STATUTS', required: true },
          { id: 2, name: 'RCCM', code: 'RCCM', required: true },
          { id: 3, name: 'Attestation de capacité technique', code: 'TECH_CAPACITY', required: true },
          { id: 4, name: 'Certificat environnemental', code: 'ENV_CERT', required: true },
        ],
        'PERMIS_CONSTRUCTION': [
          { id: 1, name: 'Titre foncier', code: 'LAND_TITLE', required: true },
          { id: 2, name: 'Plan architectural', code: 'ARCH_PLAN', required: true },
          { id: 3, name: 'Étude d\'impact environnemental', code: 'EIA', required: true },
          { id: 4, name: 'Attestation d\'urbanisme', code: 'URBAN_CERT', required: true },
        ],
        'AUTORISATION_ACTIVITE': [
          { id: 1, name: 'RCCM', code: 'RCCM', required: true },
          { id: 2, name: 'NIF', code: 'NIF', required: true },
          { id: 3, name: 'Attestation de conformité', code: 'CONFORMITY', required: true },
        ],
      };

      const documents = fallbackDocuments[dossierType] || fallbackDocuments['AGREMENT_REGIME'];
      return NextResponse.json({ documents });
    }

    const data = await response.json();
    return NextResponse.json({
      documents: data.data?.documents || data.documents || data.data || []
    });
  } catch (error) {
    console.error('Error fetching required documents:', error);
    return NextResponse.json({
      documents: [
        { id: 1, name: 'Statuts de l\'entreprise', code: 'STATUTS', required: true },
        { id: 2, name: 'RCCM', code: 'RCCM', required: true },
        { id: 3, name: 'NIF', code: 'NIF', required: true },
      ]
    });
  }
}
