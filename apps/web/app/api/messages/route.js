import { getMessages, sendMessage } from '../../../services/messageService.js';

// GET - Liste des messages (boite de reception ou envoyes)
export async function GET(request) {
  return getMessages(request);
}

// POST - Envoyer un nouveau message
export async function POST(request) {
  return sendMessage(request);
}
