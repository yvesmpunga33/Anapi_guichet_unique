import { NextResponse } from "next/server";
import { ProvinceUser, Province } from "@/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.PROVINCE_JWT_SECRET || process.env.JWT_SECRET || "province-portal-secret-key";

export async function GET(request) {
  try {
    // Recuperer le token depuis les headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token manquant" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Token invalide ou expire" },
        { status: 401 }
      );
    }

    // Recuperer l'utilisateur
    const user = await ProvinceUser.findOne({
      where: {
        id: decoded.userId,
        isActive: true,
      },
      include: [
        {
          model: Province,
          as: "province",
          attributes: ["id", "code", "name", "capital"],
        },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouve" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      photo: user.photo,
      phone: user.phone,
      department: user.department,
      position: user.position,
      permissions: user.permissions,
      province: user.province,
      lastLoginAt: user.lastLoginAt,
    });
  } catch (error) {
    console.error("Erreur get current user:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
