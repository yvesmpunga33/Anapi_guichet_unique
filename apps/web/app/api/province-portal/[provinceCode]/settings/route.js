import { NextResponse } from "next/server";
import { Province, ProvinceSettings } from "@/models";

// GET - Recuperer les parametres d'une province
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

    // Recuperer les parametres
    let settings = await ProvinceSettings.findOne({
      where: { provinceId: province.id },
    });

    // Si pas de parametres, creer des parametres par defaut
    if (!settings) {
      settings = await ProvinceSettings.create({
        provinceId: province.id,
        name: province.name,
        primaryColor: "#0A1628",
        secondaryColor: "#1E3A5F",
        accentColor: "#D4A853",
        menuConfig: [
          { id: "dashboard", label: "Tableau de bord", icon: "LayoutDashboard", path: "", enabled: true },
          { id: "news", label: "Actualites", icon: "Newspaper", path: "/actualites", enabled: true },
          { id: "opportunities", label: "Opportunites", icon: "Briefcase", path: "/opportunites", enabled: true },
          { id: "achievements", label: "Realisations", icon: "Trophy", path: "/realisations", enabled: true },
          { id: "events", label: "Evenements", icon: "Calendar", path: "/evenements", enabled: true },
          { id: "gallery", label: "Galerie", icon: "ImageIcon", path: "/galerie", enabled: true },
          { id: "infrastructure", label: "Infrastructure", icon: "Route", path: "/infrastructure", enabled: true },
          { id: "settings", label: "Configuration", icon: "Settings", path: "/configuration", enabled: true },
        ],
        isPublic: true,
      });
    }

    return NextResponse.json({
      success: true,
      id: settings.id,
      provinceId: province.id,
      name: settings.name || province.name,
      code: province.code,
      capital: province.capital,
      logo: settings.logo,
      banner: settings.banner,
      slogan: settings.slogan,
      description: settings.description,
      history: settings.history,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      website: settings.website,
      socialMedia: settings.socialMedia,
      menuConfig: settings.menuConfig,
      governorName: settings.governorName,
      governorPhoto: settings.governorPhoto,
      governorTitle: settings.governorTitle,
      governorBio: settings.governorBio,
      viceGovernorName: settings.viceGovernorName,
      viceGovernorPhoto: settings.viceGovernorPhoto,
      presidentName: settings.presidentName,
      presidentPhoto: settings.presidentPhoto,
      timezone: settings.timezone,
      currency: settings.currency,
      language: settings.language,
      isPublic: settings.isPublic,
      maintenanceMode: settings.maintenanceMode,
    });
  } catch (error) {
    console.error("Erreur get province settings:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour les parametres
export async function PUT(request, { params }) {
  try {
    const { provinceCode } = await params;
    const body = await request.json();

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

    // Mettre a jour ou creer les parametres
    let settings = await ProvinceSettings.findOne({
      where: { provinceId: province.id },
    });

    if (settings) {
      await settings.update(body);
    } else {
      settings = await ProvinceSettings.create({
        provinceId: province.id,
        ...body,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Parametres mis a jour",
      settings,
    });
  } catch (error) {
    console.error("Erreur update province settings:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
