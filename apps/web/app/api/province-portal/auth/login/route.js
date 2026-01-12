import { NextResponse } from "next/server";
import { ProvinceUser, Province, ProvinceSettings } from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.PROVINCE_JWT_SECRET || process.env.JWT_SECRET || "province-portal-secret-key";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, provinceCode } = body;

    // Validation
    if (!email || !password || !provinceCode) {
      return NextResponse.json(
        { success: false, message: "Email, mot de passe et province requis" },
        { status: 400 }
      );
    }

    // Trouver la province
    const province = await Province.findOne({
      where: { code: provinceCode.toUpperCase(), isActive: true },
    });

    if (!province) {
      return NextResponse.json(
        { success: false, message: "Province non trouvee ou inactive" },
        { status: 404 }
      );
    }

    // Trouver l'utilisateur
    const user = await ProvinceUser.findOne({
      where: {
        email: email.toLowerCase(),
        provinceId: province.id,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Verifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Mettre a jour la derniere connexion
    await user.update({ lastLoginAt: new Date() });

    // Generer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        provinceId: province.id,
        provinceCode: province.code,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Recuperer les parametres de la province
    const settings = await ProvinceSettings.findOne({
      where: { provinceId: province.id },
    });

    return NextResponse.json({
      success: true,
      message: "Connexion reussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        photo: user.photo,
        department: user.department,
        position: user.position,
      },
      province: {
        id: province.id,
        code: province.code,
        name: province.name,
        capital: province.capital,
      },
      settings: settings
        ? {
            logo: settings.logo,
            primaryColor: settings.primaryColor,
            accentColor: settings.accentColor,
          }
        : null,
    });
  } catch (error) {
    console.error("Erreur login province:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
