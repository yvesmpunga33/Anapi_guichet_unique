import { NextResponse } from 'next/server';
import { DossierDocument } from '../../../../../models/index.js';
import fs from 'fs';
import path from 'path';

// GET - Telecharger un document
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Chercher le document dans la base de donnees
    const document = await DossierDocument.findByPk(id);

    if (!document) {
      // Pour les documents mock, generer un PDF de demonstration
      const demoContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 150 >>
stream
BT
/F1 24 Tf
100 700 Td
(Document de demonstration) Tj
0 -50 Td
/F1 14 Tf
(ID: ${id}) Tj
0 -30 Td
(Ce document est genere automatiquement) Tj
0 -30 Td
(pour les besoins de demonstration.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000268 00000 n
0000000470 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
549
%%EOF
      `;

      return new NextResponse(demoContent.trim(), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="document-${id}.pdf"`,
        },
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
      '.zip': 'application/zip',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const fileName = document.originalName || document.name || `document-${id}${ext}`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Erreur lors du telechargement du document' },
      { status: 500 }
    );
  }
}
