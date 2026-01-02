import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// GET - Servir les fichiers uploadés
export async function GET(request, { params }) {
  try {
    const { path: pathSegments } = await params;

    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "Chemin invalide" }, { status: 400 });
    }

    // Construire le chemin du fichier
    const relativePath = pathSegments.join("/");
    const filePath = path.join(process.cwd(), "uploads", relativePath);

    // Sécurité: vérifier que le chemin est bien dans uploads
    const uploadsDir = path.join(process.cwd(), "uploads");
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    // Vérifier que le fichier existe
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ error: "Fichier non trouve" }, { status: 404 });
    }

    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Déterminer le type MIME
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".doc": "application/msword",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".txt": "text/plain",
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Retourner le fichier
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture du fichier" },
      { status: 500 }
    );
  }
}
