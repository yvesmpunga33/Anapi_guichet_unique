import { NextResponse } from "next/server";
import { LegalDocumentType } from "../../../../../models/index.js";

// GET - Detail d'un type de document
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const type = await LegalDocumentType.findByPk(id);
    if (!type) {
      return NextResponse.json(
        { error: "Type de document non trouve" },
        { status: 404 }
      );
    }

    return NextResponse.json({ type });
  } catch (error) {
    console.error("Error fetching document type:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du type" },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un type de document
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const type = await LegalDocumentType.findByPk(id);
    if (!type) {
      return NextResponse.json(
        { error: "Type de document non trouve" },
        { status: 404 }
      );
    }

    // Verifier si le nouveau code n'est pas deja utilise
    if (data.code && data.code !== type.code) {
      const existing = await LegalDocumentType.findOne({
        where: { code: data.code },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Ce code existe deja" },
          { status: 400 }
        );
      }
    }

    await type.update({
      code: data.code ?? type.code,
      name: data.name ?? type.name,
      description: data.description ?? type.description,
      category: data.category ?? type.category,
      prefix: data.prefix ?? type.prefix,
      isActive: data.isActive ?? type.isActive,
      sortOrder: data.sortOrder ?? type.sortOrder,
    });

    return NextResponse.json({ type });
  } catch (error) {
    console.error("Error updating document type:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du type" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un type de document
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const type = await LegalDocumentType.findByPk(id);
    if (!type) {
      return NextResponse.json(
        { error: "Type de document non trouve" },
        { status: 404 }
      );
    }

    await type.destroy();

    return NextResponse.json({
      success: true,
      message: "Type de document supprime avec succes",
    });
  } catch (error) {
    console.error("Error deleting document type:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du type" },
      { status: 500 }
    );
  }
}
