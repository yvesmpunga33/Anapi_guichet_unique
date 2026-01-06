"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  TrendingUp,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Eye,
  Heart,
  Share2,
  Globe,
  Leaf,
  Sun,
  Mountain,
  Plane,
  Factory,
  Building2,
  ChevronRight,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";

export default function InvestorOpportunitiesPage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [investmentRange, setInvestmentRange] = useState("all");

  const [opportunities, setOpportunities] = useState([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);

  useEffect(() => {
    setPageTitle("Opportunites d'Investissement");
  }, [setPageTitle]);

  const sectors = [
    { id: "agriculture", name: "Agriculture", icon: Leaf, color: "bg-green-500" },
    { id: "energie", name: "Energie", icon: Sun, color: "bg-yellow-500" },
    { id: "mines", name: "Mines", icon: Mountain, color: "bg-gray-600" },
    { id: "tourisme", name: "Tourisme", icon: Plane, color: "bg-blue-500" },
    { id: "industrie", name: "Industrie", icon: Factory, color: "bg-purple-500" },
    { id: "immobilier", name: "Immobilier", icon: Building2, color: "bg-indigo-500" },
  ];

  const regions = [
    "Kinshasa", "Haut-Katanga", "Nord-Kivu", "Sud-Kivu", "Kasai Central",
    "Kasai Oriental", "Lualaba", "Kongo Central", "Equateur", "Ituri"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturedOpportunities([
        {
          id: "opp-featured-1",
          title: "Parc agro-industriel de Bukanga Lonzo",
          sector: "Agriculture",
          region: "Kongo Central",
          investmentMin: 5000000,
          investmentMax: 50000000,
          roi: "15-25%",
          jobsCreation: 2000,
          description: "Opportunite exceptionnelle dans l'un des plus grands parcs agro-industriels d'Afrique centrale.",
          featured: true,
          deadline: "2026-06-30",
          partners: ["Gouvernement RDC", "Banque Mondiale"],
        },
        {
          id: "opp-featured-2",
          title: "Centrale hydroelectrique Grand Inga",
          sector: "Energie",
          region: "Kongo Central",
          investmentMin: 10000000,
          investmentMax: 100000000,
          roi: "12-18%",
          jobsCreation: 5000,
          description: "Participez au plus grand projet hydroelectrique du monde avec un potentiel de 40 000 MW.",
          featured: true,
          deadline: "2026-12-31",
          partners: ["SNEL", "Partenaires internationaux"],
        },
      ]);

      setOpportunities([
        {
          id: "opp-001",
          title: "Plantation de palmiers a huile",
          sector: "Agriculture",
          region: "Equateur",
          investmentMin: 500000,
          investmentMax: 2000000,
          roi: "18-22%",
          jobsCreation: 300,
          description: "Exploitation de 5000 hectares de palmiers a huile pour la production d'huile de palme certifiee.",
          status: "open",
          deadline: "2026-03-31",
        },
        {
          id: "opp-002",
          title: "Mine de cobalt - Kolwezi",
          sector: "Mines",
          region: "Lualaba",
          investmentMin: 3000000,
          investmentMax: 15000000,
          roi: "25-35%",
          jobsCreation: 500,
          description: "Exploitation d'un gisement de cobalt avec reserves estimees a 50 000 tonnes.",
          status: "open",
          deadline: "2026-02-28",
        },
        {
          id: "opp-003",
          title: "Resort ecotouristique - Lac Kivu",
          sector: "Tourisme",
          region: "Sud-Kivu",
          investmentMin: 1000000,
          investmentMax: 5000000,
          roi: "12-18%",
          jobsCreation: 150,
          description: "Construction d'un complexe ecotouristique haut de gamme sur les rives du Lac Kivu.",
          status: "open",
          deadline: "2026-05-15",
        },
        {
          id: "opp-004",
          title: "Usine de transformation de cacao",
          sector: "Industrie",
          region: "Nord-Kivu",
          investmentMin: 800000,
          investmentMax: 3000000,
          roi: "15-20%",
          jobsCreation: 200,
          description: "Unite de transformation de cacao en poudre et beurre de cacao pour l'exportation.",
          status: "open",
          deadline: "2026-04-30",
        },
        {
          id: "opp-005",
          title: "Parc solaire de Lubumbashi",
          sector: "Energie",
          region: "Haut-Katanga",
          investmentMin: 2000000,
          investmentMax: 10000000,
          roi: "10-15%",
          jobsCreation: 80,
          description: "Installation d'un parc solaire de 50 MW pour alimenter les zones industrielles.",
          status: "open",
          deadline: "2026-08-31",
        },
        {
          id: "opp-006",
          title: "Complexe immobilier - Kinshasa",
          sector: "Immobilier",
          region: "Kinshasa",
          investmentMin: 5000000,
          investmentMax: 20000000,
          roi: "20-28%",
          jobsCreation: 400,
          description: "Construction d'un complexe mixte bureaux/residences dans le quartier des affaires.",
          status: "open",
          deadline: "2026-07-15",
        },
      ]);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getSectorIcon = (sectorName) => {
    const sector = sectors.find((s) => s.name === sectorName);
    return sector ? sector.icon : Globe;
  };

  const getSectorColor = (sectorName) => {
    const sector = sectors.find((s) => s.name === sectorName);
    return sector ? sector.color : "bg-gray-500";
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === "all" || opp.sector === sectorFilter;
    const matchesRegion = regionFilter === "all" || opp.region === regionFilter;
    return matchesSearch && matchesSector && matchesRegion;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des opportunites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Opportunites d'Investissement</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Decouvrez les projets a fort potentiel en RDC</p>
        </div>
      </div>

      {/* Sector Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSectorFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            sectorFilter === "all"
              ? "bg-[#0A1628] text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#D4A853]"
          }`}
        >
          Tous les secteurs
        </button>
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <button
              key={sector.id}
              onClick={() => setSectorFilter(sector.name)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sectorFilter === sector.name
                  ? "bg-[#0A1628] text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#D4A853]"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {sector.name}
            </button>
          );
        })}
      </div>

      {/* Featured Opportunities */}
      {featuredOpportunities.length > 0 && sectorFilter === "all" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4A853]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Opportunites en vedette</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredOpportunities.map((opp) => {
              const SectorIcon = getSectorIcon(opp.sector);
              return (
                <div
                  key={opp.id}
                  className="relative bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl p-6 text-white overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#D4A853] text-[#0A1628] text-xs font-bold rounded-full">
                      EN VEDETTE
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 ${getSectorColor(opp.sector)} rounded-xl flex items-center justify-center`}>
                      <SectorIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{opp.title}</h3>
                      <p className="text-gray-300 text-sm mt-1">{opp.sector} - {opp.region}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">{opp.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-[#D4A853]">
                        {formatCurrency(opp.investmentMin)} - {formatCurrency(opp.investmentMax)}
                      </p>
                      <p className="text-xs text-gray-300">Investissement</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-[#D4A853]">{opp.roi}</p>
                      <p className="text-xs text-gray-300">ROI estime</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-[#D4A853]">{opp.jobsCreation.toLocaleString()}</p>
                      <p className="text-xs text-gray-300">Emplois</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      Date limite: {new Date(opp.deadline).toLocaleDateString("fr-FR")}
                    </div>
                    <Link
                      href={`/investor/opportunities/${opp.id}`}
                      className="inline-flex items-center px-4 py-2 bg-[#D4A853] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E5B964] transition-colors"
                    >
                      En savoir plus
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une opportunite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
          >
            <option value="all">Toutes les regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select
            value={investmentRange}
            onChange={(e) => setInvestmentRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
          >
            <option value="all">Tout investissement</option>
            <option value="small">Moins de $1M</option>
            <option value="medium">$1M - $5M</option>
            <option value="large">$5M - $20M</option>
            <option value="mega">Plus de $20M</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => {
          const SectorIcon = getSectorIcon(opp.sector);
          return (
            <div
              key={opp.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#D4A853]/50 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${getSectorColor(opp.sector)} rounded-xl flex items-center justify-center`}>
                    <SectorIcon className="w-6 h-6 text-white" />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#1E3A5F] dark:group-hover:text-[#D4A853] transition-colors">
                  {opp.title}
                </h3>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{opp.sector}</span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {opp.region}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm line-clamp-2">
                  {opp.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(opp.investmentMin)} - {formatCurrency(opp.investmentMax)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Investissement</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{opp.roi}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ROI estime</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {opp.jobsCreation} emplois
                  </div>
                  <Link
                    href={`/investor/opportunities/${opp.id}`}
                    className="text-[#1E3A5F] dark:text-[#D4A853] font-medium text-sm flex items-center hover:underline"
                  >
                    Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune opportunite trouvee</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Essayez de modifier vos criteres de recherche.
          </p>
        </div>
      )}

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vous ne trouvez pas ce que vous cherchez?</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Contactez-nous pour des opportunites personnalisees selon vos criteres.</p>
          </div>
          <Link
            href="/investor/contact"
            className="inline-flex items-center px-5 py-3 bg-[#0A1628] text-white font-semibold rounded-xl hover:bg-[#1E3A5F] transition-colors"
          >
            Contacter un conseiller
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
