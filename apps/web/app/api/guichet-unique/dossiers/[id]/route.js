import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

async function getAuthHeaders(request) {
  const authHeader = request.headers.get('authorization');
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get('authToken')?.value;
  const token = authHeader || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : '');

  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token })
  };
}

// GET - Get dossier by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const headers = await getAuthHeaders(request);

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la recuperation du dossier' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dossier:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Update dossier
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const headers = await getAuthHeaders(request);
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la mise a jour du dossier' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating dossier:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Delete dossier
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const headers = await getAuthHeaders(request);

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la suppression du dossier' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting dossier:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH - Validate workflow step
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const headers = await getAuthHeaders(request);
    const body = await request.json();

    // Vérifier l'action demandée
    if (body.action === 'validate_step') {
      const { isFinalStep, totalSteps, note } = body;

      // Récupérer d'abord le dossier actuel pour connaître l'étape courante
      const getDossierResponse = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}`, {
        method: 'GET',
        headers,
      });

      if (!getDossierResponse.ok) {
        return NextResponse.json(
          { error: 'Erreur lors de la récupération du dossier' },
          { status: getDossierResponse.status }
        );
      }

      const dossierData = await getDossierResponse.json();
      const currentDossier = dossierData.data?.dossier || dossierData.dossier;
      const currentStep = currentDossier?.currentStep || 1;

      // Calculer le nouvel état
      const newStep = isFinalStep ? currentStep : currentStep + 1;
      const newStatus = isFinalStep ? 'APPROVED' : currentDossier.status;

      // Mettre à jour le dossier via PUT
      const updateResponse = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentStep: newStep,
          status: newStatus,
          ...(isFinalStep && { decisionDate: new Date().toISOString() }),
          ...(note && { notes: note })
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        return NextResponse.json(
          { error: updateData.message || 'Erreur lors de la validation de l\'étape' },
          { status: updateResponse.status }
        );
      }

      // Retourner le dossier mis à jour
      return NextResponse.json({
        success: true,
        message: isFinalStep ? 'Dossier approuvé avec succès' : 'Étape validée avec succès',
        dossier: {
          ...currentDossier,
          currentStep: newStep,
          status: newStatus
        }
      });
    }

    // Si l'action n'est pas reconnue, retourner une erreur
    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error validating step:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
