import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

// Fallback workflow steps for each dossier type
const fallbackWorkflowSteps = {
  'AGREMENT': [
    { id: 1, stepNumber: 1, name: 'Reception', description: 'Reception et enregistrement du dossier', icon: 'FileText', color: 'blue' },
    { id: 2, stepNumber: 2, name: 'Verification', description: 'Controle des documents', icon: 'Search', color: 'indigo' },
    { id: 3, stepNumber: 3, name: 'Examen fiscal', description: 'Analyse fiscale du dossier', icon: 'Calculator', color: 'purple' },
    { id: 4, stepNumber: 4, name: 'Decision finale', description: 'Prise de decision', icon: 'CheckCircle', color: 'green', isFinal: true },
  ],
  'AGREMENT_REGIME': [
    { id: 1, stepNumber: 1, name: 'Reception', description: 'Reception et enregistrement du dossier', icon: 'FileText', color: 'blue' },
    { id: 2, stepNumber: 2, name: 'Verification', description: 'Controle des documents', icon: 'Search', color: 'indigo' },
    { id: 3, stepNumber: 3, name: 'Examen fiscal', description: 'Analyse fiscale du dossier', icon: 'Calculator', color: 'purple' },
    { id: 4, stepNumber: 4, name: 'Decision finale', description: 'Prise de decision', icon: 'CheckCircle', color: 'green', isFinal: true },
  ],
  'LICENCE': [
    { id: 1, stepNumber: 1, name: 'Soumission', description: 'Depot de la demande', icon: 'FileText', color: 'amber' },
    { id: 2, stepNumber: 2, name: 'Verification', description: 'Controle documentaire', icon: 'Search', color: 'amber' },
    { id: 3, stepNumber: 3, name: 'Analyse technique', description: 'Evaluation technique', icon: 'Settings', color: 'amber' },
    { id: 4, stepNumber: 4, name: 'Inspection', description: 'Visite de terrain', icon: 'MapPin', color: 'amber' },
    { id: 5, stepNumber: 5, name: 'Approbation', description: 'Decision finale', icon: 'CheckCircle', color: 'green', isFinal: true },
  ],
  'LICENCE_EXPLOITATION': [
    { id: 1, stepNumber: 1, name: 'Soumission', description: 'Depot de la demande', icon: 'FileText', color: 'amber' },
    { id: 2, stepNumber: 2, name: 'Verification', description: 'Controle documentaire', icon: 'Search', color: 'amber' },
    { id: 3, stepNumber: 3, name: 'Analyse technique', description: 'Evaluation technique', icon: 'Settings', color: 'amber' },
    { id: 4, stepNumber: 4, name: 'Inspection', description: 'Visite de terrain', icon: 'MapPin', color: 'amber' },
    { id: 5, stepNumber: 5, name: 'Approbation', description: 'Decision finale', icon: 'CheckCircle', color: 'green', isFinal: true },
  ],
  'PERMIS': [
    { id: 1, stepNumber: 1, name: 'Depot', description: 'Depot du dossier', icon: 'FileText', color: 'orange' },
    { id: 2, stepNumber: 2, name: 'Verification', description: 'Verification administrative', icon: 'ClipboardCheck', color: 'orange' },
    { id: 3, stepNumber: 3, name: 'Etude technique', description: 'Analyse des plans', icon: 'Ruler', color: 'orange' },
    { id: 4, stepNumber: 4, name: 'Enquete publique', description: 'Consultation publique', icon: 'Users', color: 'orange' },
    { id: 5, stepNumber: 5, name: 'Delivrance', description: 'Emission du permis', icon: 'Award', color: 'green', isFinal: true },
  ],
  'PERMIS_CONSTRUCTION': [
    { id: 1, stepNumber: 1, name: 'Depot', description: 'Depot du dossier', icon: 'FileText', color: 'orange' },
    { id: 2, stepNumber: 2, name: 'Verification', description: 'Verification administrative', icon: 'ClipboardCheck', color: 'orange' },
    { id: 3, stepNumber: 3, name: 'Etude technique', description: 'Analyse des plans', icon: 'Ruler', color: 'orange' },
    { id: 4, stepNumber: 4, name: 'Enquete publique', description: 'Consultation publique', icon: 'Users', color: 'orange' },
    { id: 5, stepNumber: 5, name: 'Delivrance', description: 'Emission du permis', icon: 'Award', color: 'green', isFinal: true },
  ],
  'AUTORISATION': [
    { id: 1, stepNumber: 1, name: 'Soumission', description: 'Depot de la demande', icon: 'FileText', color: 'purple' },
    { id: 2, stepNumber: 2, name: 'Verification documentaire', description: 'Controle des documents', icon: 'Search', color: 'purple' },
    { id: 3, stepNumber: 3, name: 'Analyse ANAPI', description: 'Evaluation par ANAPI', icon: 'Building', color: 'purple' },
    { id: 4, stepNumber: 4, name: 'Transmission Ministere', description: 'Envoi au ministere', icon: 'Send', color: 'purple' },
    { id: 5, stepNumber: 5, name: 'Examen Ministere', description: 'Evaluation ministerielle', icon: 'Landmark', color: 'purple' },
    { id: 6, stepNumber: 6, name: 'Verification conformite', description: 'Controle final', icon: 'ShieldCheck', color: 'purple' },
    { id: 7, stepNumber: 7, name: 'Approbation autorite', description: 'Validation finale', icon: 'UserCheck', color: 'purple' },
    { id: 8, stepNumber: 8, name: 'Delivrance Autorisation', description: 'Emission de l\'autorisation', icon: 'Award', color: 'green', isFinal: true },
  ],
  'AUTORISATION_ACTIVITE': [
    { id: 1, stepNumber: 1, name: 'Soumission', description: 'Depot de la demande', icon: 'FileText', color: 'purple' },
    { id: 2, stepNumber: 2, name: 'Verification documentaire', description: 'Controle des documents', icon: 'Search', color: 'purple' },
    { id: 3, stepNumber: 3, name: 'Analyse ANAPI', description: 'Evaluation par ANAPI', icon: 'Building', color: 'purple' },
    { id: 4, stepNumber: 4, name: 'Transmission Ministere', description: 'Envoi au ministere', icon: 'Send', color: 'purple' },
    { id: 5, stepNumber: 5, name: 'Examen Ministere', description: 'Evaluation ministerielle', icon: 'Landmark', color: 'purple' },
    { id: 6, stepNumber: 6, name: 'Verification conformite', description: 'Controle final', icon: 'ShieldCheck', color: 'purple' },
    { id: 7, stepNumber: 7, name: 'Approbation autorite', description: 'Validation finale', icon: 'UserCheck', color: 'purple' },
    { id: 8, stepNumber: 8, name: 'Delivrance Autorisation', description: 'Emission de l\'autorisation', icon: 'Award', color: 'green', isFinal: true },
  ],
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const activeOnly = searchParams.get('activeOnly');

    let url = `${API_URL}/api/v1/config/workflow-steps`;
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (activeOnly) params.append('activeOnly', activeOnly);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback workflow steps based on dossier type
      const steps = fallbackWorkflowSteps[type] || fallbackWorkflowSteps['AGREMENT'];
      return NextResponse.json({ steps });
    }

    const data = await response.json();
    return NextResponse.json({
      steps: data.data?.steps || data.steps || data.data || []
    });
  } catch (error) {
    console.error('Error fetching workflow steps:', error);
    // Return fallback on error
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const steps = fallbackWorkflowSteps[type] || fallbackWorkflowSteps['AGREMENT'];
    return NextResponse.json({ steps });
  }
}
