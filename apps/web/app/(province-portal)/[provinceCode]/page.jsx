"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  Eye,
  FileText,
  Calendar,
  Trophy,
  Newspaper,
  Image as ImageIcon,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  MoreHorizontal,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ProvinceDashboardStats, ProvinceDashboardRecent } from "@/app/services/Province.service";
import { useProvince } from "./layout";

// Couleurs par defaut
const COLORS = {
  primary: "#0A1628",
  secondary: "#1E3A5F",
  accent: "#D4A853",
};

export default function ProvinceDashboard() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;

  const [stats, setStats] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const accentColor = settings?.accentColor || COLORS.accent;

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, recentRes] = await Promise.all([
        ProvinceDashboardStats(provinceCode),
        ProvinceDashboardRecent(provinceCode),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (recentRes.data) setRecentData(recentRes.data);
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      // Mock data for demo
      setStats({
        opportunities: { total: 24, published: 18, draft: 6, trend: 12 },
        investments: { total: 45000000, count: 12, trend: 8 },
        visitors: { total: 12450, today: 234, trend: 15 },
        events: { upcoming: 5, thisMonth: 8, trend: -3 },
        achievements: { total: 32, recent: 5, trend: 10 },
        news: { total: 156, published: 142, draft: 14, trend: 5 },
        gallery: { images: 245, videos: 18, trend: 20 },
        infrastructure: { total: 48, operational: 35, inProgress: 13, trend: 7 },
      });
      setRecentData({
        recentNews: [
          { id: 1, title: "Inauguration du nouveau pont sur la riviere Kasai", date: "2026-01-10", views: 1234 },
          { id: 2, title: "Forum des investisseurs 2026 annonce", date: "2026-01-09", views: 856 },
          { id: 3, title: "Nouvelle zone economique speciale approuvee", date: "2026-01-08", views: 2341 },
        ],
        recentOpportunities: [
          { id: 1, title: "Projet agricole - Zone Nord", sector: "Agriculture", investment: 5000000, applications: 12 },
          { id: 2, title: "Construction centre commercial", sector: "Commerce", investment: 15000000, applications: 8 },
          { id: 3, title: "Usine de transformation", sector: "Industrie", investment: 25000000, applications: 5 },
        ],
        upcomingEvents: [
          { id: 1, title: "Conference des gouverneurs", date: "2026-01-20", location: "Kinshasa" },
          { id: 2, title: "Salon de l'investissement", date: "2026-02-01", location: settings?.capital || "Capitale" },
        ],
        recentActivities: [
          { id: 1, action: "Nouvelle opportunite publiee", user: "Admin", time: "Il y a 2h" },
          { id: 2, action: "Actualite mise a jour", user: "Editeur", time: "Il y a 4h" },
          { id: 3, action: "Nouvel investisseur inscrit", user: "Systeme", time: "Il y a 6h" },
          { id: 4, action: "Evenement cree", user: "Manager", time: "Hier" },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [provinceCode]);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || "0";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto" style={{ color: accentColor }} />
          <p className="mt-4 text-gray-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // KPI Cards data
  const kpiCards = [
    {
      title: "Opportunites",
      value: stats?.opportunities?.total || 0,
      subtitle: `${stats?.opportunities?.published || 0} publiees`,
      trend: stats?.opportunities?.trend || 0,
      icon: Briefcase,
      color: "#3B82F6",
      link: `/${provinceCode}/opportunites`,
    },
    {
      title: "Investissements",
      value: formatCurrency(stats?.investments?.total || 0),
      subtitle: `${stats?.investments?.count || 0} projets`,
      trend: stats?.investments?.trend || 0,
      icon: DollarSign,
      color: "#10B981",
      link: `/${provinceCode}/investisseurs`,
    },
    {
      title: "Visiteurs",
      value: formatNumber(stats?.visitors?.total || 0),
      subtitle: `${stats?.visitors?.today || 0} aujourd'hui`,
      trend: stats?.visitors?.trend || 0,
      icon: Eye,
      color: "#8B5CF6",
      link: "#",
    },
    {
      title: "Evenements",
      value: stats?.events?.upcoming || 0,
      subtitle: `${stats?.events?.thisMonth || 0} ce mois`,
      trend: stats?.events?.trend || 0,
      icon: Calendar,
      color: "#F59E0B",
      link: `/${provinceCode}/evenements`,
    },
  ];

  const secondaryStats = [
    {
      title: "Realisations",
      value: stats?.achievements?.total || 0,
      icon: Trophy,
      color: "#EC4899",
      link: `/${provinceCode}/realisations`,
    },
    {
      title: "Actualites",
      value: stats?.news?.total || 0,
      icon: Newspaper,
      color: "#06B6D4",
      link: `/${provinceCode}/actualites`,
    },
    {
      title: "Galerie",
      value: `${stats?.gallery?.images || 0} / ${stats?.gallery?.videos || 0}`,
      subtitle: "images / videos",
      icon: ImageIcon,
      color: "#84CC16",
      link: `/${provinceCode}/galerie`,
    },
    {
      title: "Infrastructure",
      value: stats?.infrastructure?.total || 0,
      icon: Building2,
      color: "#F97316",
      link: `/${provinceCode}/infrastructure`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Bienvenue sur le portail de la province {settings?.name || provinceCode}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>

      {/* Governor Message Card */}
      {settings?.governorName && (
        <div
          className="bg-gradient-to-r rounded-2xl p-6 text-white shadow-lg"
          style={{
            backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              {settings.governorPhoto ? (
                <Image
                  src={settings.governorPhoto}
                  alt={settings.governorName}
                  width={80}
                  height={80}
                  className="rounded-xl border-2 border-white/20"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: accentColor, color: COLORS.primary }}
                >
                  {settings.governorName[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-1">Message du Gouverneur</p>
              <h3 className="text-lg font-semibold" style={{ color: accentColor }}>
                {settings.governorName}
              </h3>
              <p className="text-sm text-gray-300">{settings.governorTitle || "Gouverneur de Province"}</p>
              {settings.slogan && (
                <p className="mt-3 text-gray-200 italic">"{settings.slogan}"</p>
              )}
            </div>
            <Link
              href={`/${provinceCode}/messages`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: accentColor, color: COLORS.primary }}
            >
              Voir les messages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <Link
            key={idx}
            href={kpi.link}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${kpi.color}15` }}
              >
                <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  kpi.trend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {kpi.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(kpi.trend)}%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {kpi.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {kpi.subtitle}
              </p>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium group-hover:gap-2 transition-all" style={{ color: kpi.color }}>
              Voir details
              <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {secondaryStats.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.link}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div className="overflow-hidden">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {stat.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent News */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5" style={{ color: accentColor }} />
              Actualites recentes
            </h2>
            <Link
              href={`/${provinceCode}/actualites`}
              className="text-sm font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentData?.recentNews?.map((news) => (
              <Link
                key={news.id}
                href={`/${provinceCode}/actualites/${news.id}`}
                className="block p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                  {news.title}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(news.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(news.views)} vues
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: accentColor }} />
              Activite recente
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {recentData?.recentActivities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.user} - {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities & Events */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5" style={{ color: accentColor }} />
              Opportunites populaires
            </h2>
            <Link
              href={`/${provinceCode}/opportunites`}
              className="text-sm font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentData?.recentOpportunities?.map((opp) => (
              <div key={opp.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {opp.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{opp.sector}</p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: accentColor }}>
                    {formatCurrency(opp.investment)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {opp.applications} candidatures
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: accentColor }} />
              Evenements a venir
            </h2>
            <Link
              href={`/${provinceCode}/evenements`}
              className="text-sm font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Voir tout
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {recentData?.upcomingEvents?.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <span className="text-lg font-bold">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xs">
                    {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </p>
                </div>
              </div>
            ))}
            {(!recentData?.upcomingEvents || recentData.upcomingEvents.length === 0) && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500">Aucun evenement a venir</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Nouvelle actualite", icon: Newspaper, href: `/${provinceCode}/actualites/nouveau` },
            { label: "Ajouter opportunite", icon: Briefcase, href: `/${provinceCode}/opportunites/nouveau` },
            { label: "Creer evenement", icon: Calendar, href: `/${provinceCode}/evenements/nouveau` },
            { label: "Ajouter realisation", icon: Trophy, href: `/${provinceCode}/realisations/nouveau` },
            { label: "Upload galerie", icon: ImageIcon, href: `/${provinceCode}/galerie/upload` },
            { label: "Configuration", icon: Building2, href: `/${provinceCode}/configuration` },
          ].map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-center"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <action.icon className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
