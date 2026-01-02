import { NextResponse } from 'next/server';
import { DossierDocument } from '../../../../../models/index.js';
import fs from 'fs';
import path from 'path';

// Fonction pour generer une page de demonstration
function generateDemoPage(documentName, documentId) {
  // Decoder le nom du document si encodé
  const decodedName = decodeURIComponent(documentName || documentId || 'Document');
  const isPdf = decodedName.toLowerCase().endsWith('.pdf');
  const isExcel = decodedName.toLowerCase().endsWith('.xlsx') || decodedName.toLowerCase().endsWith('.xls');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${decodedName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
            color: white;
            padding: 20px;
          }
          .container {
            text-align: center;
            padding: 50px 40px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            max-width: 500px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: ${isPdf ? '#ef4444' : isExcel ? '#22c55e' : '#3b82f6'};
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
          }
          h2 {
            font-size: 20px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .filename {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-bottom: 30px;
            word-break: break-all;
          }
          .info {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          .info-row:last-child { margin-bottom: 0; }
          .label { color: rgba(255, 255, 255, 0.6); }
          .value { color: white; font-weight: 500; }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.4);
            border-radius: 20px;
            color: #86efac;
            font-size: 12px;
          }
          .note {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">${isPdf ? '📄' : isExcel ? '📊' : '📁'}</div>
          <h2>Apercu du document</h2>
          <p class="filename">${decodedName}</p>
          <div class="info">
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">${isPdf ? 'PDF' : isExcel ? 'Excel' : 'Document'}</span>
            </div>
            <div class="info-row">
              <span class="label">Statut:</span>
              <span class="status-badge">
                <span>●</span> Disponible
              </span>
            </div>
          </div>
          <p class="note">
            Ce document est un apercu de demonstration.<br>
            Les fichiers reels seront affiches une fois uploades dans le systeme.
          </p>
        </div>
      </body>
    </html>
  `;
}

// GET - Visualiser un document (retourne le fichier pour l'affichage dans le navigateur)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verifier si c'est un document mock (commence par "mock-")
    if (id.startsWith('mock-')) {
      const documentName = id.replace('mock-', '');
      return new NextResponse(generateDemoPage(documentName, id), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Chercher le document dans la base de donnees
    let document = null;
    try {
      document = await DossierDocument.findByPk(id);
    } catch (dbError) {
      console.log('Document not found in DB, showing demo page');
    }

    if (!document) {
      // Pour les documents non trouves, retourner une page de demonstration
      return new NextResponse(generateDemoPage(id, id), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Construire le chemin absolu du fichier
    // Le filePath stocké est relatif (ex: /uploads/guichet-unique/dossiers/xxx/file.pdf)
    let filePath = document.filePath;

    // Si le chemin est relatif (commence par /), construire le chemin absolu
    if (filePath && filePath.startsWith('/')) {
      filePath = path.join(process.cwd(), 'public', filePath);
    }

    if (!filePath || !fs.existsSync(filePath)) {
      console.error('File not found at path:', filePath);
      return NextResponse.json(
        { error: 'Fichier non trouve', path: filePath },
        { status: 404 }
      );
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(filePath);

    // Determiner le type MIME
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${document.originalName || document.name}"`,
      },
    });
  } catch (error) {
    console.error('Error viewing document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la visualisation du document' },
      { status: 500 }
    );
  }
}
