"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { OpportunitiesByProvince, OpportunityList } from "@/app/services/Investor.service";
import {
  Briefcase,
  FileCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  Building,
  Globe,
  Bell,
  MapPinned,
  Factory,
  Users,
  X,
  Star,
  ChevronRight,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";
import DRCMap from "../../../components/maps/DRCMap";

export default function InvestorDashboard() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingApprovals: 0,
    approvedProjects: 0,
    totalInvestment: 0,
  });

  // Map and opportunities state
  const [mapData, setMapData] = useState({
    provinces: [],
    featuredOpportunities: [],
    stats: {},
  });
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceOpportunities, setProvinceOpportunities] = useState([]);
  const [showOpportunitiesModal, setShowOpportunitiesModal] = useState(false);

  useEffect(() => {
    setPageTitle("Tableau de bord");
  }, [setPageTitle]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalProjects: 3,
        pendingApprovals: 2,
        approvedProjects: 1,
        totalInvestment: 5500000,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch map data
  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await OpportunitiesByProvince();
      setMapData(response.data);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  // Handle province click - fetch opportunities for that province
  const handleProvinceClick = async (province) => {
    setSelectedProvince(province);
    setShowOpportunitiesModal(true);

    try {
      const response = await OpportunityList({ provinceId: province.id, status: 'PUBLISHED' });
      setProvinceOpportunities(response.data?.opportunities || []);
    } catch (error) {
      console.error("Error fetching province opportunities:", error);
      setProvinceOpportunities([]);
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: "approval",
      title: "Demande d'agrement soumise",
      description: "Projet Agricole Kasai - En attente de validation",
      date: "2026-01-03",
      status: "pending",
    },
    {
      id: 2,
      type: "project",
      title: "Projet cree",
      description: "Usine de transformation de manioc",
      date: "2026-01-01",
      status: "success",
    },
    {
      id: 3,
      type: "document",
      title: "Document televerse",
      description: "Etude de faisabilite - Projet Minier",
      date: "2025-12-28",
      status: "success",
    },
    {
      id: 4,
      type: "approval",
      title: "Agrement approuve",
      description: "Projet Tourisme Virunga",
      date: "2025-12-15",
      status: "approved",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "Votre demande d'agrement necessite des documents supplementaires",
      type: "warning",
      date: "Il y a 2 heures",
    },
    {
      id: 2,
      message: "Nouveau guide de l'investisseur disponible",
      type: "info",
      date: "Il y a 1 jour",
    },
    {
      id: 3,
      message: "Rappel: Soumettez votre rapport trimestriel avant le 15 janvier",
      type: "reminder",
      date: "Il y a 2 jours",
    },
  ];

  const quickActions = [
    {
      title: "Nouveau projet",
      description: "Creer un nouveau projet d'investissement",
      href: "/investor/projects/new",
      icon: Plus,
      color: "bg-[#0A1628] hover:bg-[#1E3A5F]",
    },
    {
      title: "Demander agrement",
      description: "Soumettre une demande d'agrement",
      href: "/investor/approvals/new",
      icon: FileCheck,
      color: "bg-[#1E3A5F] hover:bg-[#2E4A6F]",
    },
    {
      title: "Mes documents",
      description: "Gerer mes documents",
      href: "/investor/documents",
      icon: FileText,
      color: "bg-[#D4A853] hover:bg-[#E5B964] text-[#0A1628]",
    },
    {
      title: "Opportunites",
      description: "Decouvrir les secteurs porteurs",
      href: "/investor/opportunities",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] hover:from-[#1E3A5F] hover:to-[#2E4A6F]",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Bienvenue, {session?.user?.name || "Investisseur"}!
            </h1>
            <p className="mt-2 text-gray-300">
              Gerez vos investissements et suivez vos demandes d&apos;agrement en RDC
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              href="/investor/projects/new"
              className="inline-flex items-center px-4 py-2 bg-[#D4A853] text-[#0A1628] rounded-lg font-medium hover:bg-[#E5B964] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mes projets</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Link
            href="/investor/projects"
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline"
          >
            Voir tous les projets
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Agrements en attente</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {stats.pendingApprovals}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <Link
            href="/investor/approvals"
            className="mt-4 text-sm text-orange-600 dark:text-orange-400 flex items-center hover:underline"
          >
            Voir les demandes
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projets approuves</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {stats.approvedProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Taux d'approbation: 33%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Investissement total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(stats.totalInvestment)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 dark:text-green-400">
            +15% ce trimestre
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`${action.color} text-white rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className="w-8 h-8 mb-3" />
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm text-white/80 mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPinned className="w-5 h-5 text-[#D4A853]" />
                Opportunites d&apos;investissement par province
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Cliquez sur une province pour voir les opportunites disponibles
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0A1628] dark:text-[#D4A853]">{mapData.stats?.totalOpportunities || 0}</span>
                <span className="text-gray-500 dark:text-gray-400">opportunites</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0A1628] dark:text-[#D4A853]">
                  ${((mapData.stats?.totalInvestmentNeeded || 0) / 1000000).toFixed(0)}M
                </span>
                <span className="text-gray-500 dark:text-gray-400">USD requis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0A1628] dark:text-[#D4A853]">{mapData.stats?.totalExpectedJobs || 0}</span>
                <span className="text-gray-500 dark:text-gray-400">emplois</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Map */}
          <div className="lg:col-span-2 p-4 bg-gray-50 dark:bg-gray-900/50">
            <DRCMap
              provinces={mapData.provinces}
              onProvinceClick={handleProvinceClick}
              selectedProvinceId={selectedProvince?.id}
              className="h-[400px] lg:h-[500px]"
            />
          </div>

          {/* Featured Opportunities */}
          <div className="p-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D4A853]" />
              Opportunites en vedette
            </h3>
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {mapData.featuredOpportunities?.length > 0 ? (
                mapData.featuredOpportunities.map((opp) => (
                  <Link
                    key={opp.id}
                    href={`/investor/opportunities/${opp.id}`}
                    className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{opp.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPinned className="w-3 h-3" />
                          <span>{opp.province?.name}</span>
                        </div>
                        {opp.sector && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Factory className="w-3 h-3" />
                            <span>{opp.sector.name}</span>
                          </div>
                        )}
                        {opp.minInvestment && (
                          <p className="mt-2 text-[#0A1628] dark:text-[#D4A853] font-semibold text-sm">
                            ${(opp.minInvestment / 1000).toFixed(0)}K - ${(opp.maxInvestment / 1000).toFixed(0)}K USD
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MapPinned className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune opportunite en vedette</p>
                </div>
              )}
            </div>
            <Link
              href="/investor/opportunities"
              className="mt-4 block text-center text-sm text-[#1E3A5F] dark:text-[#D4A853] hover:underline font-medium"
            >
              Voir toutes les opportunites
              <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activites recentes</h2>
            <Link href="/investor/tracking" className="text-sm text-[#1E3A5F] dark:text-[#D4A853] hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === "approved"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : activity.status === "pending"
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                  }`}
                >
                  {activity.type === "approval" ? (
                    <FileCheck
                      className={`w-5 h-5 ${
                        activity.status === "approved"
                          ? "text-green-600 dark:text-green-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    />
                  ) : activity.type === "project" ? (
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(activity.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === "approved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : activity.status === "pending"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {activity.status === "approved"
                    ? "Approuve"
                    : activity.status === "pending"
                    ? "En attente"
                    : "Termine"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
              {notifications.length} nouveau(x)
            </span>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 border-l-[#D4A853]"
              >
                <div className="flex items-start gap-2">
                  {notification.type === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  ) : notification.type === "reminder" ? (
                    <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Bell className="w-5 h-5 text-[#D4A853] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/investor/notifications"
            className="mt-4 block text-center text-sm text-[#1E3A5F] dark:text-[#D4A853] hover:underline"
          >
            Voir toutes les notifications
          </Link>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="bg-gradient-to-r from-[#0A1628]/5 to-[#1E3A5F]/10 dark:from-[#0A1628]/30 dark:to-[#1E3A5F]/20 rounded-xl p-6 border border-[#1E3A5F]/20 dark:border-[#1E3A5F]/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#D4A853]" />
              Opportunites d&apos;investissement en RDC
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Decouvrez les secteurs porteurs et les avantages fiscaux offerts aux investisseurs
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              href="/investor/opportunities"
              className="inline-flex items-center px-4 py-2 bg-[#0A1628] text-white rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors"
            >
              Explorer les opportunites
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { sector: "Agriculture", growth: "+12%" },
            { sector: "Mines", growth: "+8%" },
            { sector: "Energie", growth: "+15%" },
            { sector: "Tourisme", growth: "+20%" },
          ].map((item) => (
            <div
              key={item.sector}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm"
            >
              <p className="font-medium text-gray-900 dark:text-white">{item.sector}</p>
              <p className="text-[#D4A853] font-semibold mt-1">{item.growth}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Province Opportunities Modal */}
      {showOpportunitiesModal && selectedProvince && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOpportunitiesModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPinned className="w-5 h-5 text-[#D4A853]" />
                    {selectedProvince.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedProvince.opportunitiesCount || 0} opportunite(s) disponible(s)
                  </p>
                </div>
                <button
                  onClick={() => setShowOpportunitiesModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {provinceOpportunities.length > 0 ? (
                  <div className="space-y-4">
                    {provinceOpportunities.map((opp) => (
                      <Link
                        key={opp.id}
                        href={`/investor/opportunities/${opp.id}`}
                        className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {opp.isFeatured && <Star className="w-4 h-4 text-[#D4A853] fill-[#D4A853]" />}
                              <h4 className="font-semibold text-gray-900 dark:text-white">{opp.title}</h4>
                            </div>
                            {opp.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {opp.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              {opp.sector && (
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Factory className="w-4 h-4" />
                                  <span>{opp.sector.name}</span>
                                </div>
                              )}
                              {opp.expectedJobs && (
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Users className="w-4 h-4" />
                                  <span>{opp.expectedJobs} emplois</span>
                                </div>
                              )}
                            </div>
                            {opp.minInvestment && (
                              <p className="mt-2 text-[#0A1628] dark:text-[#D4A853] font-semibold">
                                {formatCurrency(opp.minInvestment)}
                                {opp.maxInvestment && ` - ${formatCurrency(opp.maxInvestment)}`}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPinned className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucune opportunite disponible dans cette province
                    </p>
                    <Link
                      href="/investor/opportunities"
                      className="mt-4 inline-flex items-center text-[#1E3A5F] dark:text-[#D4A853] hover:underline"
                    >
                      Voir toutes les opportunites
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              {provinceOpportunities.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/investor/opportunities?province=${selectedProvince.id}`}
                    className="block w-full text-center py-2 px-4 bg-[#0A1628] text-white rounded-lg font-medium hover:bg-[#1E3A5F] transition-colors"
                  >
                    Voir toutes les opportunites de {selectedProvince.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
