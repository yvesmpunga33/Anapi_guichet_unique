import { NextResponse } from "next/server";
import { Country } from "../../../../models/index.js";
import { Op } from "sequelize";

// GET - Liste des pays
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const continent = searchParams.get("continent");
    const search = searchParams.get("search");

    const where = {};
    if (activeOnly) {
      where.isActive = true;
    }
    if (continent) {
      where.continent = continent;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { nameFr: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const countries = await Country.findAll({
      where,
      order: [
        ["sortOrder", "ASC"],
        ["nameFr", "ASC"],
      ],
    });

    // Get distinct continents for filtering
    const continents = await Country.findAll({
      attributes: ["continent"],
      where: { continent: { [Op.ne]: null } },
      group: ["continent"],
      order: [["continent", "ASC"]],
    });

    return NextResponse.json({
      countries,
      continents: continents.map((c) => c.continent),
      total: countries.length,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des pays" },
      { status: 500 }
    );
  }
}

// POST - Creer un nouveau pays
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation
    if (!data.code || !data.name || !data.nameFr) {
      return NextResponse.json(
        { error: "Code, nom et nom francais sont requis" },
        { status: 400 }
      );
    }

    // Verifier si le code existe deja
    const existing = await Country.findOne({
      where: { code: data.code.toUpperCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un pays avec ce code existe deja" },
        { status: 400 }
      );
    }

    const country = await Country.create({
      code: data.code.toUpperCase(),
      code3: data.code3?.toUpperCase() || null,
      name: data.name,
      nameFr: data.nameFr,
      nameEn: data.nameEn || null,
      nationality: data.nationality || null,
      nationalityFr: data.nationalityFr || null,
      phoneCode: data.phoneCode || null,
      continent: data.continent || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    });

    return NextResponse.json({ country }, { status: 201 });
  } catch (error) {
    console.error("Error creating country:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du pays" },
      { status: 500 }
    );
  }
}
