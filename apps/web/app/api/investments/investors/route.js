import { getInvestors, createInvestor } from '../../../../services/investorService.js';

// GET - Liste des investisseurs
export async function GET(request) {
  return getInvestors(request);
}

// POST - Creer un investisseur
export async function POST(request) {
  return createInvestor(request);
}
