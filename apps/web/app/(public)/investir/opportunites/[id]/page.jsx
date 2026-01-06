"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  Building,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  Shield,
  Info,
  Download,
  ExternalLink,
  Share2,
} from "lucide-react";

// ANAPI Colors
const ANAPI_COLORS = {
  darkBlue: "#0A1628",
  mediumBlue: "#1E3A5F",
  gold: "#D4A853",
};

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return "Non specifie";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M USD`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K USD`;
  }
  return `$${amount.toLocaleString()} USD`;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "Non specifie";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Demo images for showcase
  const demoImages = [
    { url: null, caption: "Vue principale du projet" },
    { url: null, caption: "Site d'implantation" },
    { url: null, caption: "Infrastructure existante" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/opportunities/${params.id}`);
        const data = await res.json();

        if (data.opportunity) {
          setOpportunity(data.opportunity);
          setRelatedOpportunities(data.relatedOpportunities || []);
        }
      } catch (err) {
        console.error("Error fetching opportunity:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % demoImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + demoImages.length) % demoImages.length);
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

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Opportunite non trouvee</p>
          <Link href="/" className="mt-4 inline-block text-[#D4A853] hover:underline">
            Retour a l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const advantages = opportunity.advantages ? JSON.parse(opportunity.advantages) : [];
  const requirements = opportunity.requirements ? JSON.parse(opportunity.requirements) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center border border-[#D4A853]/30">
                <Globe className="w-6 h-6 text-[#D4A853]" />
              </div>
              <span className="text-xl font-bold">ANAPI</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#1E3A5F] rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <Link
                href="/login"
                className="px-5 py-2 bg-[#D4A853] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E5B964] transition-colors"
              >
                Postuler
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#D4A853] transition-colors">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/#carte" className="text-gray-500 hover:text-[#D4A853] transition-colors">
              Carte
            </Link>
            <span className="text-gray-300">/</span>
            {opportunity.province && (
              <>
                <Link
                  href={`/investir/provinces/${opportunity.province.id}`}
                  className="text-gray-500 hover:text-[#D4A853] transition-colors"
                >
                  {opportunity.province.name}
                </Link>
                <span className="text-gray-300">/</span>
              </>
            )}
            <span className="text-[#0A1628] font-medium truncate max-w-[200px]">
              {opportunity.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-[400px] bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
                {opportunity.imageUrl ? (
                  <img
                    src={opportunity.imageUrl}
                    alt={opportunity.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Building className="w-24 h-24 mx-auto text-[#D4A853]/30" />
                      <p className="mt-4 text-gray-400">{demoImages[activeImageIndex].caption}</p>
                    </div>
                  </div>
                )}

                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#0A1628]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#0A1628]" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {opportunity.isFeatured && (
                    <div className="px-3 py-1 bg-[#D4A853] text-[#0A1628] text-sm font-bold rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      En vedette
                    </div>
                  )}
                  {opportunity.sector && (
                    <div
                      className="px-3 py-1 text-white text-sm font-medium rounded-full"
                      style={{ backgroundColor: opportunity.sector.color || "#1E3A5F" }}
                    >
                      {opportunity.sector.name}
                    </div>
                  )}
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {demoImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeImageIndex ? "bg-[#D4A853]" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {demoImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === activeImageIndex ? "border-[#D4A853]" : "border-transparent"
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] flex items-center justify-center">
                      <Building className="w-6 h-6 text-[#D4A853]/50" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Ref: {opportunity.reference}</span>
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628] mt-1">
                    {opportunity.title}
                  </h1>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    opportunity.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {opportunity.status === "PUBLISHED" ? "Disponible" : opportunity.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {opportunity.province && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-[#D4A853]" />
                    <span>{opportunity.province.name}</span>
                  </div>
                )}
                {opportunity.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Target className="w-4 h-4 text-[#D4A853]" />
                    <span>{opportunity.location}</span>
                  </div>
                )}
                {opportunity.deadline && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-[#D4A853]" />
                    <span>Date limite: {formatDate(opportunity.deadline)}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-[#0A1628] mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#D4A853]" />
                  Description du projet
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {opportunity.description || "Aucune description disponible pour cette opportunite."}
                </p>
              </div>
            </div>

            {/* Advantages */}
            {advantages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0A1628] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#D4A853]" />
                  Avantages du projet
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-50 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0A1628] mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#D4A853]" />
                  Criteres requis
                </h3>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                    >
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0A1628] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4A853]" />
                  Documents a fournir
                </h3>
                <div className="space-y-3">
                  {opportunity.requiredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-[#0A1628]">
                            {doc.name}
                            {doc.isRequired && (
                              <span className="ml-2 text-xs text-red-500">*Obligatoire</span>
                            )}
                          </p>
                          {doc.description && (
                            <p className="text-sm text-gray-500">{doc.description}</p>
                          )}
                        </div>
                      </div>
                      {doc.templateUrl && (
                        <a
                          href={doc.templateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#D4A853] hover:underline text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Telecharger modele
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl p-6 text-white sticky top-24">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#D4A853]" />
                Investissement
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Montant minimum</p>
                  <p className="text-2xl font-bold text-[#D4A853]">
                    {formatCurrency(opportunity.minInvestment)}
                  </p>
                </div>

                {opportunity.maxInvestment && (
                  <div className="p-4 bg-[#1E3A5F]/50 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Montant maximum</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(opportunity.maxInvestment)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {opportunity.expectedJobs && (
                    <div className="p-3 bg-[#1E3A5F]/50 rounded-xl text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-[#D4A853]" />
                      <p className="text-lg font-bold">{opportunity.expectedJobs.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Emplois prevus</p>
                    </div>
                  )}
                  {opportunity.projectDuration && (
                    <div className="p-3 bg-[#1E3A5F]/50 rounded-xl text-center">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-[#D4A853]" />
                      <p className="text-lg font-bold">{opportunity.projectDuration}</p>
                      <p className="text-xs text-gray-400">Duree projet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#D4A853] text-[#0A1628] font-bold rounded-xl hover:bg-[#E5B964] transition-colors"
                >
                  <Briefcase className="w-5 h-5" />
                  Postuler maintenant
                </Link>
                <p className="text-xs text-center text-gray-400">
                  Connectez-vous pour soumettre votre candidature
                </p>
              </div>
            </div>

            {/* Contact Card */}
            {(opportunity.contactName || opportunity.contactEmail || opportunity.contactPhone) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0A1628] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#D4A853]" />
                  Contact
                </h3>

                <div className="space-y-4">
                  {opportunity.contactName && (
                    <div>
                      <p className="text-sm text-gray-500">Responsable</p>
                      <p className="font-medium text-[#0A1628]">{opportunity.contactName}</p>
                    </div>
                  )}
                  {opportunity.contactEmail && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href={`mailto:${opportunity.contactEmail}`}
                        className="font-medium text-[#D4A853] hover:underline flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {opportunity.contactEmail}
                      </a>
                    </div>
                  )}
                  {opportunity.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-500">Telephone</p>
                      <a
                        href={`tel:${opportunity.contactPhone}`}
                        className="font-medium text-[#D4A853] hover:underline flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {opportunity.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Opportunities */}
            {relatedOpportunities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#0A1628] mb-4">
                  Opportunites similaires
                </h3>
                <div className="space-y-3">
                  {relatedOpportunities.slice(0, 3).map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/investir/opportunites/${rel.id}`}
                      className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-[#0A1628] line-clamp-1">{rel.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        {rel.province && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>{rel.province.name}</span>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A1628] text-white py-12 mt-12">
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
