import { getProjects, createProject } from '../../../../services/investmentService.js';

// GET - Liste des projets d'investissement
export async function GET(request) {
  return getProjects(request);
}

// POST - Creer un projet d'investissement
export async function POST(request) {
  return createProject(request);
}
