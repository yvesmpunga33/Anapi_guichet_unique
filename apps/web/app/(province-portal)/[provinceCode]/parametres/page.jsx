"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Settings,
  Save,
  Loader2,
  Palette,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Menu,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { ProvinceSettingsGet, ProvinceSettingsUpdate } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const defaultMenuItems = [
  { key: "dashboard", label: "Tableau de bord", icon: "LayoutDashboard", enabled: true },
  { key: "actualites", label: "Actualites", icon: "Newspaper", enabled: true },
  { key: "bannieres", label: "Bannieres", icon: "MonitorPlay", enabled: true },
  { key: "evenements", label: "Evenements", icon: "CalendarDays", enabled: true },
  { key: "galerie", label: "Galerie", icon: "ImageIcon", enabled: true },
  { key: "realisations", label: "Realisations", icon: "Trophy", enabled: true },
  { key: "infrastructure", label: "Infrastructure", icon: "Building2", enabled: true },
  { key: "opportunites", label: "Opportunites", icon: "Briefcase", enabled: true },
  { key: "plan-directeur", label: "Plan Directeur", icon: "Map", enabled: true },
  { key: "education", label: "Education", icon: "GraduationCap", enabled: true },
  { key: "sante", label: "Sante", icon: "Heart", enabled: true },
  { key: "tourisme", label: "Tourisme", icon: "Compass", enabled: true },
  { key: "culture", label: "Culture", icon: "Palette", enabled: true },
  { key: "organisation", label: "Organisation", icon: "GitBranch", enabled: true },
  { key: "utilisateurs", label: "Utilisateurs", icon: "Users", enabled: true },
  { key: "parametres", label: "Parametres", icon: "Settings", enabled: true },
];

export default function ParametresPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const provinceSettings = provinceContext?.settings;
  const accentColor = provinceSettings?.accentColor || "#D4A853";

  const [settings, setSettings] = useState({
    // Branding
    provinceName: "",
    provinceSlogan: "",
    logo: "",
    favicon: "",
    accentColor: "#D4A853",
    secondaryColor: "#0A1628",

    // Contact
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",

    // Social Media
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    website: "",

    // SEO
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",

    // Features
    enableNews: true,
    enableEvents: true,
    enableGallery: true,
    enableOpportunities: true,
    enableTourism: true,
    enableChat: false,

    // Menu
    menuConfig: defaultMenuItems,

    // Governor Message
    governorName: "",
    governorTitle: "",
    governorPhoto: "",
    governorMessage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, [provinceCode]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await ProvinceSettingsGet(provinceCode);
      if (response.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data,
          menuConfig: response.data.menuConfig || defaultMenuItems,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement parametres:", err);
      // Demo data
      setSettings((prev) => ({
        ...prev,
        provinceName: "Province du Kasai Central",
        provinceSlogan: "La terre des diamants",
        email: "contact@kasaicentral.cd",
        phone: "+243 123 456 789",
        address: "Avenue de l'Independance",
        city: "Kananga",
        governorName: "Jean-Pierre Kabongo",
        governorTitle: "Gouverneur de Province",
        governorMessage: "Bienvenue sur le portail officiel de notre province. Notre engagement est de promouvoir le developpement economique et social pour le bien-etre de tous nos citoyens.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMenuToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      menuConfig: prev.menuConfig.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await ProvinceSettingsUpdate(provinceCode, settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "general", label: "General", icon: Settings },
    { key: "branding", label: "Apparence", icon: Palette },
    { key: "contact", label: "Contact", icon: Mail },
    { key: "social", label: "Reseaux sociaux", icon: Globe },
    { key: "gouverneur", label: "Gouverneur", icon: MessageSquare },
    { key: "menu", label: "Menu", icon: Menu },
    { key: "seo", label: "SEO", icon: Globe },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Settings className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Parametres
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configuration du portail provincial</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium"
          style={{ backgroundColor: accentColor }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          Parametres enregistres avec succes
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-100 dark:border-gray-700 px-4 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-current text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  style={activeTab === tab.key ? { borderColor: accentColor, color: accentColor } : {}}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de la province
                </label>
                <input
                  type="text"
                  name="provinceName"
                  value={settings.provinceName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  name="provinceSlogan"
                  value={settings.provinceSlogan}
                  onChange={handleChange}
                  placeholder="Ex: La terre des opportunites"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-4">Fonctionnalites</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "enableNews", label: "Actualites" },
                  { key: "enableEvents", label: "Evenements" },
                  { key: "enableGallery", label: "Galerie" },
                  { key: "enableOpportunities", label: "Opportunites" },
                  { key: "enableTourism", label: "Tourisme" },
                  { key: "enableChat", label: "Chat en ligne" },
                ].map((feat) => (
                  <label key={feat.key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      name={feat.key}
                      checked={settings[feat.key]}
                      onChange={handleChange}
                      className="w-4 h-4 rounded"
                      style={{ accentColor }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Branding Tab */}
          {activeTab === "branding" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Couleur principale
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="accentColor"
                      value={settings.accentColor}
                      onChange={handleChange}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => setSettings((prev) => ({ ...prev, accentColor: e.target.value }))}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Couleur secondaire
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleChange}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo (URL)
                </label>
                <input
                  type="text"
                  name="logo"
                  value={settings.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon (URL)
                </label>
                <input
                  type="text"
                  name="favicon"
                  value={settings.favicon}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Preview */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-4">Apercu</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: settings.accentColor }}>
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-white text-2xl font-bold">{settings.provinceName?.charAt(0) || "P"}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{settings.provinceName || "Nom de la province"}</h4>
                    <p className="text-sm text-gray-500">{settings.provinceSlogan || "Slogan"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="contact@province.cd"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telephone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    placeholder="+243 ..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Adresse complete"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={settings.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={settings.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="space-y-6 max-w-2xl">
              {[
                { key: "website", label: "Site web", icon: Globe, placeholder: "https://..." },
                { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
                { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/..." },
                { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
                { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/..." },
                { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/..." },
              ].map((social) => {
                const SocialIcon = social.icon;
                return (
                  <div key={social.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {social.label}
                    </label>
                    <div className="relative">
                      <SocialIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name={social.key}
                        value={settings[social.key]}
                        onChange={handleChange}
                        placeholder={social.placeholder}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Governor Tab */}
          {activeTab === "gouverneur" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom du Gouverneur
                  </label>
                  <input
                    type="text"
                    name="governorName"
                    value={settings.governorName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    name="governorTitle"
                    value={settings.governorTitle}
                    onChange={handleChange}
                    placeholder="Gouverneur de Province"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photo (URL)
                </label>
                <input
                  type="text"
                  name="governorPhoto"
                  value={settings.governorPhoto}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message de bienvenue
                </label>
                <textarea
                  name="governorMessage"
                  value={settings.governorMessage}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Message du Gouverneur affiche sur la page d'accueil..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm text-gray-500 mb-4">Activez ou desactivez les elements du menu lateral</p>
              {settings.menuConfig.map((item, idx) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-gray-900 dark:text-white">{item.label}</span>
                  </div>
                  <button
                    onClick={() => handleMenuToggle(item.key)}
                    className={`p-2 rounded-lg ${item.enabled ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}
                  >
                    {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta titre
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={settings.metaTitle}
                  onChange={handleChange}
                  placeholder="Titre pour les moteurs de recherche"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">{settings.metaTitle?.length || 0}/60 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta description
                </label>
                <textarea
                  name="metaDescription"
                  value={settings.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description pour les moteurs de recherche"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{settings.metaDescription?.length || 0}/160 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mots-cles
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={handleChange}
                  placeholder="province, investissement, developpement, ..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-3">Apercu Google</p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-blue-600 text-lg font-medium truncate">
                    {settings.metaTitle || settings.provinceName || "Titre de la page"}
                  </p>
                  <p className="text-green-700 text-sm">https://province.cd/{provinceCode}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                    {settings.metaDescription || "Description de la page pour les moteurs de recherche..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
