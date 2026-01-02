import { NextResponse } from "next/server";
import { Currency } from "../../../../../models/index.js";

// GET - Detail d'une devise
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const currency = await Currency.findByPk(id);
    if (!currency) {
      return NextResponse.json(
        { error: "Devise non trouvee" },
        { status: 404 }
      );
    }

    return NextResponse.json({ currency });
  } catch (error) {
    console.error("Error fetching currency:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la devise" },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour une devise
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const currency = await Currency.findByPk(id);
    if (!currency) {
      return NextResponse.json(
        { error: "Devise non trouvee" },
        { status: 404 }
      );
    }

    // Si on definit cette devise comme base, desactiver les autres
    if (data.isBaseCurrency && !currency.isBaseCurrency) {
      await Currency.update(
        { isBaseCurrency: false },
        { where: {} }
      );
    }

    await currency.update({
      code: data.code?.toUpperCase() || currency.code,
      name: data.name ?? currency.name,
      nameFr: data.nameFr ?? currency.nameFr,
      nameEn: data.nameEn ?? currency.nameEn,
      symbol: data.symbol ?? currency.symbol,
      decimals: data.decimals ?? currency.decimals,
      exchangeRate: data.exchangeRate ?? currency.exchangeRate,
      exchangeRateDate: data.exchangeRateDate ?? currency.exchangeRateDate,
      isBaseCurrency: data.isBaseCurrency ?? currency.isBaseCurrency,
      isActive: data.isActive ?? currency.isActive,
      sortOrder: data.sortOrder ?? currency.sortOrder,
    });

    return NextResponse.json({ currency });
  } catch (error) {
    console.error("Error updating currency:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la devise" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une devise
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const currency = await Currency.findByPk(id);
    if (!currency) {
      return NextResponse.json(
        { error: "Devise non trouvee" },
        { status: 404 }
      );
    }

    // Empecher la suppression de la devise de base
    if (currency.isBaseCurrency) {
      return NextResponse.json(
        { error: "Impossible de supprimer la devise de base" },
        { status: 400 }
      );
    }

    await currency.destroy();

    return NextResponse.json({
      success: true,
      message: "Devise supprimee avec succes",
    });
  } catch (error) {
    console.error("Error deleting currency:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la devise" },
      { status: 500 }
    );
  }
}
