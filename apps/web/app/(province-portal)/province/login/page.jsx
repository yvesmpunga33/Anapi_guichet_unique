"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  MapPin,
  Building2,
  Loader2,
  AlertCircle,
  ChevronDown,
  Globe,
  ArrowRight,
  Shield,
} from "lucide-react";
import { ProvinceLogin, PublicProvinceListAll } from "@/app/services/Province.service";

// Couleurs ANAPI
const COLORS = {
  darkBlue: "#0A1628",
  mediumBlue: "#1E3A5F",
  gold: "#D4A853",
  lightGold: "#E5B964",
};

export default function ProvinceLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [showProvinceSelector, setShowProvinceSelector] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    provinceCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Charger la liste des provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await PublicProvinceListAll();
        const data = response.data;
        if (data?.provinces) {
          setProvinces(data.provinces);
        }
      } catch (err) {
        console.error("Erreur chargement provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Verifier si une province est pre-selectionnee dans l'URL
  useEffect(() => {
    const provinceCode = searchParams.get("province");
    if (provinceCode && provinces.length > 0) {
      const province = provinces.find(
        (p) => p.code?.toLowerCase() === provinceCode.toLowerCase()
      );
      if (province) {
        setSelectedProvince(province);
        setFormData((prev) => ({ ...prev, provinceCode: province.code }));
        setShowProvinceSelector(false);
      }
    }
  }, [searchParams, provinces]);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setFormData((prev) => ({ ...prev, provinceCode: province.code }));
    setShowProvinceSelector(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProvince) {
      setError("Veuillez selectionner une province");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const response = await ProvinceLogin({
        email: formData.email,
        password: formData.password,
        provinceCode: selectedProvince.code,
      });

      if (response.data?.success) {
        // Stocker le token si necessaire
        if (response.data.token) {
          localStorage.setItem("province_token", response.data.token);
          localStorage.setItem("province_code", selectedProvince.code);
        }
        // Rediriger vers le dashboard de la province
        router.push(`/${selectedProvince.code.toLowerCase()}`);
      } else {
        setError(response.data?.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur de connexion. Veuillez reessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628]">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#D4A853] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4A853]/20">
              <Globe className="w-8 h-8 text-[#0A1628]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ANAPI</h1>
              <p className="text-sm text-gray-400">Portail Provinces RDC</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Bienvenue sur le
                <br />
                <span className="text-[#D4A853]">Portail Provincial</span>
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-md">
                Gerez les opportunites d'investissement, les realisations et
                l'information de votre province en toute simplicite.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "Gestion des opportunites" },
                { icon: MapPin, label: "Carte interactive" },
                { icon: Shield, label: "Securise et fiable" },
                { icon: Globe, label: "26 Provinces connectees" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <feature.icon className="w-5 h-5 text-[#D4A853]" />
                  <span className="text-sm text-gray-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ANAPI - Agence Nationale pour la
            Promotion des Investissements
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#D4A853]/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#1E3A5F]/50 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#D4A853] rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-[#0A1628]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ANAPI</h1>
              <p className="text-xs text-gray-400">Portail Provinces</p>
            </div>
          </div>

          {/* Province Selector or Login Form */}
          {showProvinceSelector ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4A853] to-[#E5B964] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4A853]/20">
                  <MapPin className="w-8 h-8 text-[#0A1628]" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Selectionnez votre Province
                </h2>
                <p className="text-gray-400 mt-2">
                  Choisissez la province pour acceder a son portail
                </p>
              </div>

              {loadingProvinces ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#D4A853] animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {provinces.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => handleProvinceSelect(province)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#D4A853]/10 hover:border-[#D4A853]/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center group-hover:bg-[#D4A853]/20">
                        <MapPin className="w-5 h-5 text-[#D4A853]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-white group-hover:text-[#D4A853]">
                          {province.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {province.capital || "Capitale non definie"}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#D4A853] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors"
                >
                  Retour au site principal ANAPI
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              {/* Selected Province Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4A853] to-[#E5B964] rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-[#0A1628]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Province</p>
                    <h3 className="font-bold text-white">
                      {selectedProvince?.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowProvinceSelector(true)}
                  className="text-sm text-[#D4A853] hover:text-[#E5B964] transition-colors"
                >
                  Changer
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Connexion</h2>
                  <p className="text-gray-400 mt-1">
                    Entrez vos identifiants pour acceder au portail
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Votre mot de passe"
                      className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-white/5 text-[#D4A853] focus:ring-[#D4A853] focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-400">Se souvenir</span>
                  </label>
                  <Link
                    href="/province/forgot-password"
                    className="text-sm text-[#D4A853] hover:text-[#E5B964] transition-colors"
                  >
                    Mot de passe oublie?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#D4A853] to-[#E5B964] text-[#0A1628] font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
                <p className="text-sm text-gray-500">
                  Vous n'avez pas de compte?{" "}
                  <Link
                    href="/province/contact"
                    className="text-[#D4A853] hover:text-[#E5B964] font-medium"
                  >
                    Contactez l'administrateur
                  </Link>
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Retour au site ANAPI
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 168, 83, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 168, 83, 0.5);
        }
      `}</style>
    </div>
  );
}
