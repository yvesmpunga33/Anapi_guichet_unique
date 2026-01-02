import { NextResponse } from "next/server";
import { Currency } from "../../../../models/index.js";

// GET - Liste des devises
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where = {};
    if (activeOnly) {
      where.isActive = true;
    }

    const currencies = await Currency.findAll({
      where,
      order: [["sortOrder", "ASC"]],
    });

    return NextResponse.json({ currencies });
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des devises" },
      { status: 500 }
    );
  }
}

// POST - Creer une devise
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation
    if (!data.code || !data.name || !data.symbol) {
      return NextResponse.json(
        { error: "Code, nom et symbole sont requis" },
        { status: 400 }
      );
    }

    // Verifier si le code existe deja
    const existing = await Currency.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: "Une devise avec ce code existe deja" },
        { status: 400 }
      );
    }

    const currency = await Currency.create({
      code: data.code.toUpperCase(),
      name: data.name,
      nameFr: data.nameFr || data.name,
      nameEn: data.nameEn || null,
      symbol: data.symbol,
      decimals: data.decimals ?? 2,
      exchangeRate: data.exchangeRate || 1,
      exchangeRateDate: data.exchangeRateDate || null,
      isBaseCurrency: data.isBaseCurrency || false,
      isActive: data.isActive !== false,
      sortOrder: data.sortOrder || 0,
    });

    return NextResponse.json({ currency }, { status: 201 });
  } catch (error) {
    console.error("Error creating currency:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la devise" },
      { status: 500 }
    );
  }
}
