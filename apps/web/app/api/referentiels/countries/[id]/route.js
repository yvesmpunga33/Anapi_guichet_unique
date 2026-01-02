import { NextResponse } from "next/server";
import { Country } from "../../../../../models/index.js";

// GET - Detail d'un pays
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const country = await Country.findByPk(id);
    if (!country) {
      return NextResponse.json(
        { error: "Pays non trouve" },
        { status: 404 }
      );
    }

    return NextResponse.json({ country });
  } catch (error) {
    console.error("Error fetching country:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du pays" },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un pays
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const country = await Country.findByPk(id);
    if (!country) {
      return NextResponse.json(
        { error: "Pays non trouve" },
        { status: 404 }
      );
    }

    // Verifier si le nouveau code n'est pas deja utilise par un autre pays
    if (data.code && data.code.toUpperCase() !== country.code) {
      const existing = await Country.findOne({
        where: { code: data.code.toUpperCase() },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Un pays avec ce code existe deja" },
          { status: 400 }
        );
      }
    }

    await country.update({
      code: data.code?.toUpperCase() || country.code,
      code3: data.code3?.toUpperCase() ?? country.code3,
      name: data.name ?? country.name,
      nameFr: data.nameFr ?? country.nameFr,
      nameEn: data.nameEn ?? country.nameEn,
      nationality: data.nationality ?? country.nationality,
      nationalityFr: data.nationalityFr ?? country.nationalityFr,
      phoneCode: data.phoneCode ?? country.phoneCode,
      continent: data.continent ?? country.continent,
      isActive: data.isActive ?? country.isActive,
      sortOrder: data.sortOrder ?? country.sortOrder,
    });

    return NextResponse.json({ country });
  } catch (error) {
    console.error("Error updating country:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du pays" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un pays
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const country = await Country.findByPk(id);
    if (!country) {
      return NextResponse.json(
        { error: "Pays non trouve" },
        { status: 404 }
      );
    }

    await country.destroy();

    return NextResponse.json({
      success: true,
      message: "Pays supprime avec succes",
    });
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du pays" },
      { status: 500 }
    );
  }
}
