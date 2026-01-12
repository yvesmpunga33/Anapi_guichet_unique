import { NextResponse } from "next/server";
import { Province, ProvinceOpportunity, ProvinceNews, ProvinceEvent, ProvinceAchievement, ProvinceGallery, ProvinceInfrastructure } from "@/models";
import { Op, fn, col, literal } from "sequelize";

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
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Stats des opportunites
    const opportunitiesTotal = await ProvinceOpportunity.count({
      where: { provinceId },
    });
    const opportunitiesPublished = await ProvinceOpportunity.count({
      where: { provinceId, status: "PUBLISHED" },
    });
    const opportunitiesRecent = await ProvinceOpportunity.count({
      where: {
        provinceId,
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
    });

    // Stats des investissements (somme des opportunites)
    const investmentStats = await ProvinceOpportunity.findOne({
      where: { provinceId, status: "PUBLISHED" },
      attributes: [
        [fn("SUM", col("minInvestment")), "totalMin"],
        [fn("COUNT", col("id")), "count"],
      ],
      raw: true,
    });

    // Stats des actualites
    const newsTotal = await ProvinceNews?.count?.({ where: { provinceId } }) || 0;
    const newsPublished = await ProvinceNews?.count?.({
      where: { provinceId, status: "PUBLISHED" }
    }) || 0;

    // Stats des evenements
    const eventsUpcoming = await ProvinceEvent?.count?.({
      where: {
        provinceId,
        startDate: { [Op.gte]: now },
        status: "PUBLISHED",
      },
    }) || 0;
    const eventsThisMonth = await ProvinceEvent?.count?.({
      where: {
        provinceId,
        startDate: {
          [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
          [Op.lt]: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    }) || 0;

    // Stats des realisations
    const achievementsTotal = await ProvinceAchievement?.count?.({
      where: { provinceId },
    }) || 0;
    const achievementsRecent = await ProvinceAchievement?.count?.({
      where: {
        provinceId,
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
    }) || 0;

    // Stats de la galerie
    const galleryImages = await ProvinceGallery?.count?.({
      where: { provinceId, mediaType: "IMAGE" },
    }) || 0;
    const galleryVideos = await ProvinceGallery?.count?.({
      where: { provinceId, mediaType: "VIDEO" },
    }) || 0;

    // Stats de l'infrastructure
    const infrastructureTotal = await ProvinceInfrastructure?.count?.({
      where: { provinceId },
    }) || 0;
    const infrastructureOperational = await ProvinceInfrastructure?.count?.({
      where: { provinceId, status: "OPERATIONNEL" },
    }) || 0;
    const infrastructureInProgress = await ProvinceInfrastructure?.count?.({
      where: { provinceId, status: "EN_TRAVAUX" },
    }) || 0;

    // Calculer les tendances (mock pour l'instant)
    const calculateTrend = (current, previous) => {
      if (!previous) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return NextResponse.json({
      success: true,
      opportunities: {
        total: opportunitiesTotal,
        published: opportunitiesPublished,
        draft: opportunitiesTotal - opportunitiesPublished,
        trend: calculateTrend(opportunitiesRecent, Math.floor(opportunitiesRecent * 0.9)),
      },
      investments: {
        total: parseInt(investmentStats?.totalMin || 0),
        count: parseInt(investmentStats?.count || 0),
        trend: 8,
      },
      visitors: {
        total: 12450,
        today: 234,
        trend: 15,
      },
      events: {
        upcoming: eventsUpcoming,
        thisMonth: eventsThisMonth,
        trend: eventsUpcoming > 0 ? 10 : 0,
      },
      achievements: {
        total: achievementsTotal,
        recent: achievementsRecent,
        trend: achievementsRecent > 0 ? 10 : 0,
      },
      news: {
        total: newsTotal,
        published: newsPublished,
        draft: newsTotal - newsPublished,
        trend: 5,
      },
      gallery: {
        images: galleryImages,
        videos: galleryVideos,
        trend: 20,
      },
      infrastructure: {
        total: infrastructureTotal,
        operational: infrastructureOperational,
        inProgress: infrastructureInProgress,
        trend: 7,
      },
    });
  } catch (error) {
    console.error("Erreur get dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
