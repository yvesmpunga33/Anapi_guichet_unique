import { NextResponse } from "next/server";
import { LegalDomain } from "../../../../../models/index.js";

// GET - Detail d'un domaine juridique
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const domain = await LegalDomain.findByPk(id, {
      include: [
        { model: LegalDomain, as: "children", required: false },
        { model: LegalDomain, as: "parent", required: false },
      ],
    });
    if (!domain) {
      return NextResponse.json(
        { error: "Domaine juridique non trouve" },
        { status: 404 }
      );
    }

    return NextResponse.json({ domain });
  } catch (error) {
    console.error("Error fetching domain:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du domaine" },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un domaine juridique
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const domain = await LegalDomain.findByPk(id);
    if (!domain) {
      return NextResponse.json(
        { error: "Domaine juridique non trouve" },
        { status: 404 }
      );
    }

    // Verifier si le nouveau code n'est pas deja utilise
    if (data.code && data.code !== domain.code) {
      const existing = await LegalDomain.findOne({
        where: { code: data.code },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Ce code existe deja" },
          { status: 400 }
        );
      }
    }

    await domain.update({
      code: data.code ?? domain.code,
      name: data.name ?? domain.name,
      description: data.description ?? domain.description,
      parentId: data.parentId === "" ? null : (data.parentId ?? domain.parentId),
      isActive: data.isActive ?? domain.isActive,
      sortOrder: data.sortOrder ?? domain.sortOrder,
    });

    return NextResponse.json({ domain });
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du domaine" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un domaine juridique
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const domain = await LegalDomain.findByPk(id);
    if (!domain) {
      return NextResponse.json(
        { error: "Domaine juridique non trouve" },
        { status: 404 }
      );
    }

    // Verifier s'il y a des enfants
    const children = await LegalDomain.count({ where: { parentId: id } });
    if (children > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer: ce domaine a des sous-domaines" },
        { status: 400 }
      );
    }

    await domain.destroy();

    return NextResponse.json({
      success: true,
      message: "Domaine juridique supprime avec succes",
    });
  } catch (error) {
    console.error("Error deleting domain:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du domaine" },
      { status: 500 }
    );
  }
}
