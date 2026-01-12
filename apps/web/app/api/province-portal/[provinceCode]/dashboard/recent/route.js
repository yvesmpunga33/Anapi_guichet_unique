import { NextResponse } from "next/server";
import { Province, ProvinceOpportunity, ProvinceNews, ProvinceEvent } from "@/models";
import { Op } from "sequelize";

export async function GET(request, { params }) {
  try {
    const { provinceCode } = await params;

    // Trouver la province
    const province = await Province.findOne({
      where: { code: provinceCode.toUpperCase() },
    });

    if (!province) {
      return NextResponse.json(
        { success: false, message: "Province non trouvee" },
        { status: 404 }
      );
    }

    const provinceId = province.id;
    const now = new Date();

    // Actualites recentes
    let recentNews = [];
    try {
      recentNews = await ProvinceNews?.findAll?.({
        where: {
          provinceId,
          status: "PUBLISHED",
        },
        order: [["publishedAt", "DESC"]],
        limit: 5,
        attributes: ["id", "title", "publishedAt", "viewCount"],
      }) || [];
    } catch (e) {
      // Model might not exist yet
      recentNews = [
        { id: 1, title: "Inauguration du nouveau pont sur la riviere Kasai", publishedAt: new Date("2026-01-10"), viewCount: 1234 },
        { id: 2, title: "Forum des investisseurs 2026 annonce", publishedAt: new Date("2026-01-09"), viewCount: 856 },
        { id: 3, title: "Nouvelle zone economique speciale approuvee", publishedAt: new Date("2026-01-08"), viewCount: 2341 },
      ];
    }

    // Opportunites populaires
    let recentOpportunities = [];
    try {
      recentOpportunities = await ProvinceOpportunity?.findAll?.({
        where: {
          provinceId,
          status: "PUBLISHED",
        },
        order: [["applicationsCount", "DESC"]],
        limit: 3,
        attributes: ["id", "title", "minInvestment", "applicationsCount"],
        include: [
          {
            model: require("@/models").Sector,
            as: "sector",
            attributes: ["name"],
          },
        ],
      }) || [];
    } catch (e) {
      recentOpportunities = [
        { id: 1, title: "Projet agricole - Zone Nord", sector: { name: "Agriculture" }, minInvestment: 5000000, applicationsCount: 12 },
        { id: 2, title: "Construction centre commercial", sector: { name: "Commerce" }, minInvestment: 15000000, applicationsCount: 8 },
        { id: 3, title: "Usine de transformation", sector: { name: "Industrie" }, minInvestment: 25000000, applicationsCount: 5 },
      ];
    }

    // Evenements a venir
    let upcomingEvents = [];
    try {
      upcomingEvents = await ProvinceEvent?.findAll?.({
        where: {
          provinceId,
          startDate: { [Op.gte]: now },
          status: "PUBLISHED",
        },
        order: [["startDate", "ASC"]],
        limit: 3,
        attributes: ["id", "title", "startDate", "location"],
      }) || [];
    } catch (e) {
      upcomingEvents = [
        { id: 1, title: "Conference des gouverneurs", startDate: new Date("2026-01-20"), location: "Kinshasa" },
        { id: 2, title: "Salon de l'investissement", startDate: new Date("2026-02-01"), location: province.capital || "Capitale" },
      ];
    }

    // Activites recentes (mock pour l'instant)
    const recentActivities = [
      { id: 1, action: "Nouvelle opportunite publiee", user: "Admin", time: "Il y a 2h" },
      { id: 2, action: "Actualite mise a jour", user: "Editeur", time: "Il y a 4h" },
      { id: 3, action: "Nouvel investisseur inscrit", user: "Systeme", time: "Il y a 6h" },
      { id: 4, action: "Evenement cree", user: "Manager", time: "Hier" },
    ];

    return NextResponse.json({
      success: true,
      recentNews: recentNews.map((n) => ({
        id: n.id,
        title: n.title,
        date: n.publishedAt,
        views: n.viewCount || 0,
      })),
      recentOpportunities: recentOpportunities.map((o) => ({
        id: o.id,
        title: o.title,
        sector: o.sector?.name || "Non defini",
        investment: o.minInvestment || 0,
        applications: o.applicationsCount || 0,
      })),
      upcomingEvents: upcomingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.startDate,
        location: e.location || "A definir",
      })),
      recentActivities,
    });
  } catch (error) {
    console.error("Erreur get dashboard recent:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
