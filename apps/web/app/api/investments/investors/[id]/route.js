import { getInvestorById, updateInvestor, deleteInvestor } from '../../../../../services/investorService.js';

// GET - Obtenir un investisseur par ID avec ses projets
export async function GET(request, { params }) {
  const { id } = await params;
  return getInvestorById(id);
}

// PUT - Mettre a jour un investisseur
export async function PUT(request, { params }) {
  const { id } = await params;
  return updateInvestor(id, request);
}

// DELETE - Supprimer un investisseur
export async function DELETE(request, { params }) {
  const { id } = await params;
  return deleteInvestor(id);
}
