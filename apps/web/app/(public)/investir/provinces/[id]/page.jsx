"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PublicProvinceOpportunities } from "@/app/services/Public.service";
import {
  MapPin,
  ArrowLeft,
  Building,
  DollarSign,
  Users,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Star,
  Clock,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

// ANAPI Colors
const ANAPI_COLORS = {
  darkBlue: "#0A1628",
  mediumBlue: "#1E3A5F",
  gold: "#D4A853",
};

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return "N/A";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

export default function ProvinceOpportunitiesPage() {
  const params = useParams();
  const [province, setProvince] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page: currentPage,
          limit: 12,
        };
        if (search) queryParams.search = search;

        const response = await PublicProvinceOpportunities(params.id, queryParams);
        if (response.data?.province) {
          setProvince(response.data.province);
          setOpportunities(response.data.opportunities || []);
          setPagination(response.data.pagination || null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, currentPage, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: ANAPI_COLORS.gold, borderTopColor: "transparent" }}
          ></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!province) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Province non trouvee</p>
          <Link href="/" className="mt-4 inline-block text-[#D4A853] hover:underline">
            Retour a l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center border border-[#D4A853]/30">
                <Globe className="w-6 h-6 text-[#D4A853]" />
              </div>
              <span className="text-xl font-bold">ANAPI</span>
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 bg-[#D4A853] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E5B964] transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Province Hero */}
      <section className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#carte"
            className="inline-flex items-center text-gray-300 hover:text-[#D4A853] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour a la carte
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-[#D4A853] rounded-xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#0A1628]" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">{province.name}</h1>
                  <p className="text-gray-400">
                    Capitale: {province.capital || "N/A"}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 max-w-2xl">
                Decouvrez les opportunites d'investissement disponibles dans la province
                de {province.name}. Explorez les projets et trouvez celui qui correspond
                a vos objectifs.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#1E3A5F]/50 rounded-xl p-4 text-center min-w-[120px]">
                <p className="text-3xl font-bold text-[#D4A853]">
                  {pagination?.total || opportunities.length}
                </p>
                <p className="text-sm text-gray-400">Opportunites</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une opportunite..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {opportunities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucune opportunite disponible
              </h3>
              <p className="text-gray-500">
                Il n'y a pas encore d'opportunites publiees pour cette province.
              </p>
              <Link
                href="/#carte"
                className="mt-6 inline-flex items-center px-6 py-3 bg-[#0A1628] text-white font-semibold rounded-xl hover:bg-[#1E3A5F] transition-colors"
              >
                Explorer d'autres provinces
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <Link
                    key={opportunity.id}
                    href={`/investir/opportunites/${opportunity.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#D4A853]/30 transition-all group"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
                      {opportunity.imageUrl ? (
                        <img
                          src={opportunity.imageUrl}
                          alt={opportunity.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-16 h-16 text-[#D4A853]/50" />
                        </div>
                      )}
                      {opportunity.isFeatured && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4A853] text-[#0A1628] text-xs font-bold rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          En vedette
                        </div>
                      )}
                      {opportunity.sector && (
                        <div
                          className="absolute top-3 right-3 px-3 py-1 text-white text-xs font-medium rounded-full"
                          style={{ backgroundColor: opportunity.sector.color || "#1E3A5F" }}
                        >
                          {opportunity.sector.name}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#0A1628] mb-2 group-hover:text-[#D4A853] transition-colors line-clamp-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {opportunity.description || "Aucune description disponible"}
                      </p>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        {(opportunity.minInvestment || opportunity.maxInvestment) && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-[#D4A853]" />
                            <span className="text-gray-600">
                              {formatCurrency(opportunity.minInvestment)}
                              {opportunity.maxInvestment && ` - ${formatCurrency(opportunity.maxInvestment)}`}
                            </span>
                          </div>
                        )}
                        {opportunity.expectedJobs && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-[#D4A853]" />
                            <span className="text-gray-600">
                              {opportunity.expectedJobs.toLocaleString()} emplois prevus
                            </span>
                          </div>
                        )}
                        {opportunity.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-[#D4A853]" />
                            <span className="text-gray-600">{opportunity.location}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Ref: {opportunity.reference}
                        </span>
                        <span className="text-[#D4A853] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Voir les details
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#D4A853] text-[#0A1628]"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-[#D4A853]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1628] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center border border-[#D4A853]/30">
                <Globe className="w-6 h-6 text-[#D4A853]" />
              </div>
              <div>
                <span className="text-xl font-bold">ANAPI</span>
                <p className="text-xs text-gray-400">
                  Agence Nationale pour la Promotion des Investissements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-gray-400">
              <a href="tel:+243999925026" className="flex items-center gap-2 hover:text-[#D4A853] transition-colors">
                <Phone className="w-4 h-4" />
                +243 999 925 026
              </a>
              <a href="mailto:contact@anapi.cd" className="flex items-center gap-2 hover:text-[#D4A853] transition-colors">
                <Mail className="w-4 h-4" />
                contact@anapi.cd
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#1E3A5F] text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ANAPI - Tous droits reserves
          </div>
        </div>
      </footer>
    </div>
  );
}
