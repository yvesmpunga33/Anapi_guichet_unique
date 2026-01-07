import { getProjectById, updateProject, deleteProject } from '../../../../../services/investmentService.js';

// GET - Obtenir un projet par ID
export async function GET(request, { params }) {
  const { id } = await params;
  return getProjectById(id);
}

// PUT - Mettre a jour un projet
export async function PUT(request, { params }) {
  const { id } = await params;
  return updateProject(id, request);
}

// DELETE - Supprimer un projet
export async function DELETE(request, { params }) {
  const { id } = await params;
  return deleteProject(id);
}
