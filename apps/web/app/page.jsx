"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Globe,
  TrendingUp,
  Shield,
  Users,
  Building,
  Leaf,
  Zap,
  Factory,
  MapPin,
  Award,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X,
  Play,
  Star,
  Clock,
  FileCheck,
  DollarSign,
  Briefcase,
  FileText,
  Scale,
  HeartHandshake,
  BarChart3,
  ChevronRight,
  Sparkles,
  Target,
  Rocket,
  BadgeCheck,
  Landmark,
  ScrollText,
  ClipboardCheck,
  Building2,
  Handshake,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Globe2,
  Cpu,
  TreePine,
  Gem,
  Sun,
  Palmtree,
  HardHat,
  Smartphone,
  Map,
} from "lucide-react";

// Dynamic import for the map component
const DRCMapPublic = dynamic(
  () => import("../components/maps/DRCMapPublic"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] bg-[#0A1628] rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#D4A853] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Services principaux de l'ANAPI
  const services = [
    {
      id: "guichet-unique",
      title: "Guichet Unique",
      subtitle: "Un seul point d'entree",
      icon: Building2,
      description:
        "Centralisez toutes vos demarches administratives en un seul endroit. Soumission, suivi et obtention de vos documents officels.",
      features: [
        "Soumission de dossiers en ligne",
        "Suivi en temps reel",
        "Delais garantis",
        "Accompagnement personnalise",
      ],
      color: "from-green-500 to-emerald-600",
      stats: { value: "30", label: "jours en moyenne" },
    },
    {
      id: "agrements",
      title: "Agrements & Avantages",
      subtitle: "Code des investissements",
      icon: Award,
      description:
        "Beneficiez des avantages fiscaux et douaniers du Code des Investissements. Exonerations, franchises et protections garanties.",
      features: [
        "Exoneration fiscale jusqu'a 10 ans",
        "Franchise douaniere",
        "Protection juridique",
        "Rapatriement des benefices",
      ],
      color: "from-blue-500 to-indigo-600",
      stats: { value: "500+", label: "entreprises agreees" },
    },
    {
      id: "climat-affaires",
      title: "Climat des Affaires",
      subtitle: "Reformes & Dialogue",
      icon: LineChart,
      description:
        "Participez a l'amelioration du climat des affaires. Signalez les obstacles, proposez des reformes et dialoguez avec les autorites.",
      features: [
        "Signalement des barrieres",
        "Mediation des litiges",
        "Dialogue public-prive",
        "Suivi des reformes",
      ],
      color: "from-purple-500 to-violet-600",
      stats: { value: "85%", label: "taux de resolution" },
    },
    {
      id: "juridique",
      title: "Direction Juridique",
      subtitle: "Securite & Conformite",
      icon: Scale,
      description:
        "Accedez a notre base documentaire juridique. Contrats, textes legaux et veille reglementaire pour securiser vos operations.",
      features: [
        "Base documentaire complete",
        "Modeles de contrats",
        "Veille reglementaire",
        "Alertes personnalisees",
      ],
      color: "from-amber-500 to-orange-600",
      stats: { value: "1000+", label: "documents juridiques" },
    },
  ];

  // Secteurs d'investissement
  const sectors = [
    {
      name: "Agriculture",
      icon: TreePine,
      potential: "80M hectares",
      color: "bg-green-500",
    },
    {
      name: "Mines",
      icon: Gem,
      potential: "#1 Cobalt",
      color: "bg-yellow-500",
    },
    {
      name: "Energie",
      icon: Sun,
      potential: "100 000 MW",
      color: "bg-blue-500",
    },
    {
      name: "Tourisme",
      icon: Palmtree,
      potential: "5 sites UNESCO",
      color: "bg-purple-500",
    },
    {
      name: "Infrastructure",
      icon: HardHat,
      potential: "$50Mrd besoins",
      color: "bg-orange-500",
    },
    {
      name: "Tech & Digital",
      icon: Smartphone,
      potential: "100M utilisateurs",
      color: "bg-cyan-500",
    },
  ];

  // Statistiques cles
  const stats = [
    {
      value: "2.5",
      suffix: "Mrd $",
      label: "Investissements facilites",
      icon: TrendingUp,
    },
    {
      value: "500",
      suffix: "+",
      label: "Entreprises accompagnees",
      icon: Building,
    },
    {
      value: "50",
      suffix: "K+",
      label: "Emplois crees",
      icon: Users,
    },
    {
      value: "100",
      suffix: "M",
      label: "Consommateurs",
      icon: Globe,
    },
  ];

  // Avantages du Code des Investissements
  const advantages = [
    {
      icon: DollarSign,
      title: "Exoneration Fiscale",
      description: "Jusqu'a 10 ans d'exoneration d'impots sur les benefices selon le secteur et la zone",
      highlight: "10 ans",
    },
    {
      icon: FileCheck,
      title: "Franchise Douaniere",
      description: "Importation d'equipements et materiels en franchise totale de droits de douane",
      highlight: "0% droits",
    },
    {
      icon: Shield,
      title: "Protection Juridique",
      description: "Garanties constitutionnelles contre la nationalisation et protection des traites internationaux",
      highlight: "Garantie",
    },
    {
      icon: Rocket,
      title: "Rapatriement Libre",
      description: "Liberte totale de rapatriement des benefices, dividendes et capitaux investis",
      highlight: "100% libre",
    },
  ];

  // Processus d'investissement
  const processSteps = [
    {
      step: "01",
      title: "Inscription",
      description: "Creez votre compte investisseur en quelques minutes",
      icon: Users,
    },
    {
      step: "02",
      title: "Soumission",
      description: "Deposez votre projet et documents via le Guichet Unique",
      icon: FileText,
    },
    {
      step: "03",
      title: "Evaluation",
      description: "Votre dossier est evalue par nos experts dans les delais",
      icon: ClipboardCheck,
    },
    {
      step: "04",
      title: "Agrement",
      description: "Recevez votre agrement et beneficiez des avantages",
      icon: BadgeCheck,
    },
  ];

  // Temoignages
  const testimonials = [
    {
      name: "Jean-Pierre Mukendi",
      role: "PDG",
      company: "AgriCongo SARL",
      sector: "Agroalimentaire",
      quote:
        "L'ANAPI nous a accompagne de A a Z. En moins de 30 jours, nous avions notre agrement et pouvions demarrer notre activite avec tous les avantages fiscaux.",
      image: null,
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Directrice Regionale",
      company: "Global Mining Corp",
      sector: "Mines",
      quote:
        "Le Guichet Unique a revolutionne notre experience. Plus besoin de courir entre les ministeres. Tout est centralise et transparent.",
      image: null,
      rating: 5,
    },
    {
      name: "Marc Dubois",
      role: "Fondateur",
      company: "EnergiePlus",
      sector: "Energie",
      quote:
        "Le potentiel hydroelectrique de la RDC est immense. Grace a l'ANAPI, nous avons pu naviguer facilement les procedures administratives.",
      image: null,
      rating: 5,
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Qui peut beneficier des services de l'ANAPI?",
      answer:
        "Tout investisseur, national ou etranger, souhaitant realiser un projet d'investissement en RDC peut beneficier de nos services. Que vous soyez une grande entreprise, une PME ou un entrepreneur individuel, nous vous accompagnons.",
    },
    {
      question: "Quels sont les delais pour obtenir un agrement?",
      answer:
        "Le delai moyen est de 30 jours ouvrables pour un dossier complet. Vous pouvez suivre l'avancement de votre demande en temps reel via notre plateforme digitale.",
    },
    {
      question: "Quels secteurs sont eligibles aux avantages fiscaux?",
      answer:
        "Les secteurs prioritaires incluent: agriculture, mines, energie, tourisme, industrie manufacturiere, technologies, infrastructure et BTP. Chaque secteur beneficie d'avantages specifiques selon le Code des Investissements.",
    },
    {
      question: "Comment fonctionne le Guichet Unique?",
      answer:
        "Le Guichet Unique centralise toutes les demarches administratives liees a votre investissement. Vous deposez vos documents une seule fois, et nous coordonnons avec tous les ministeres et administrations concernes.",
    },
    {
      question: "Un investisseur etranger peut-il detenir 100% du capital?",
      answer:
        "Oui, la legislation congolaise permet aux investisseurs etrangers de detenir 100% du capital de leur entreprise dans la plupart des secteurs, sans obligation de partenariat local.",
    },
  ];

  // Partenaires (logos)
  const partners = [
    "Banque Mondiale",
    "FMI",
    "BAD",
    "Union Europeenne",
    "PNUD",
    "IFC",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#D4A853]/30 transition-shadow border border-[#D4A853]/20">
                <Globe className="w-7 h-7 text-[#D4A853]" />
              </div>
              <div>
                <span
                  className={`text-xl font-bold ${
                    scrolled ? "text-[#0A1628]" : "text-white"
                  }`}
                >
                  ANAPI
                </span>
                <p
                  className={`text-xs ${
                    scrolled ? "text-gray-500" : "text-[#D4A853]"
                  }`}
                >
                  Agence Nationale pour la Promotion des Investissements
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center space-x-6">
              {[
                { href: "#services", label: "Services" },
                { href: "#secteurs", label: "Secteurs" },
                { href: "#carte", label: "Carte" },
                { href: "#avantages", label: "Avantages" },
                { href: "#processus", label: "Processus" },
                { href: "#faq", label: "FAQ" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-medium text-sm transition-colors whitespace-nowrap ${
                    scrolled
                      ? "text-gray-600 hover:text-[#D4A853]"
                      : "text-white/90 hover:text-[#D4A853]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden xl:flex items-center space-x-4">
              <Link
                href="/login"
                className={`font-medium text-sm transition-colors whitespace-nowrap ${
                  scrolled
                    ? "text-[#0A1628] hover:text-[#D4A853]"
                    : "text-white hover:text-[#D4A853]"
                }`}
              >
                Se connecter
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg shadow-[#D4A853]/30 hover:shadow-xl hover:shadow-[#D4A853]/40 hover:-translate-y-0.5 whitespace-nowrap"
              >
                Rendez-vous
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2 rounded-lg ${
                scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? (
                <X
                  className={`w-6 h-6 ${
                    scrolled ? "text-[#0A1628]" : "text-white"
                  }`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 ${
                    scrolled ? "text-[#0A1628]" : "text-white"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0A1628] border-t border-[#1E3A5F] py-4 px-4 space-y-4 shadow-lg">
            {[
              { href: "#services", label: "Services" },
              { href: "#secteurs", label: "Secteurs" },
              { href: "#carte", label: "Carte" },
              { href: "#avantages", label: "Avantages" },
              { href: "#processus", label: "Processus" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-[#D4A853] font-medium py-2"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#1E3A5F] space-y-3">
              <Link
                href="/login"
                className="block text-center py-3 text-white font-medium border border-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F]"
              >
                Se connecter
              </Link>
              <Link
                href="/login"
                className="block text-center py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E5B964]"
              >
                Rendez-vous
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with gradient overlay - ANAPI colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628]" />

        {/* Globe/Map overlay effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#1E3A5F]/50 to-transparent blur-sm" />
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtdi00aC0ydjRoLTJ2LTJoLTR2NGgydjJoNHYtMmgyem0wLTMwdi0yaC0ydjJoLTR2Mmg0djRoMnYtNGgydi0yaC0yem0tMjQgMjhoMnYtNGgydi0ySDEydjJoLTJ2NGgydi0yaDJ6bTItMjRoMnYtMmgydi0yaC0ydi0yaC0ydjJoLTJ2Mmgydjh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#D4A853]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#1E3A5F]/30 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-[#1E3A5F]/50 backdrop-blur-sm border border-[#D4A853]/30 rounded-full text-sm font-medium text-white mb-8">
                <Sparkles className="w-4 h-4 mr-2 text-[#D4A853]" />
                Plateforme Officielle d'Investissement en RDC
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                For promising investments
                <span className="block mt-2 text-white">
                  in the Democratic Republic
                </span>
                <span className="block mt-2 text-[#D4A853]">
                  of Congo
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                The National Agency for Investment Promotion (ANAPI) is the Congolese
                government's advisory body on investment promotion and improving
                the business climate.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#0A1628] transition-all group"
                >
                  <ChevronRight className="w-5 h-5 mr-2" />
                  LEARN MORE
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-semibold rounded-lg hover:bg-[#E5B964] transition-all shadow-lg shadow-[#D4A853]/30 hover:shadow-xl group"
                >
                  <ChevronRight className="w-5 h-5 mr-2" />
                  CONTACT US
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] border-2 border-[#D4A853] flex items-center justify-center text-[#D4A853] text-sm font-bold"
                      >
                        {String.fromCharCode(65 + i - 1)}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">500+</p>
                    <p className="text-gray-400 text-sm">Entreprises</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-[#1E3A5F]" />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#D4A853] fill-[#D4A853]"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">4.9/5</p>
                    <p className="text-gray-400 text-sm">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main card */}
                <div className="bg-[#1E3A5F]/50 backdrop-blur-md border border-[#D4A853]/20 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4A853] to-[#B8924A] rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-[#0A1628]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          Tableau de bord Investisseur
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Vue d'ensemble de vos projets
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#D4A853]/20 text-[#D4A853] text-sm font-medium rounded-full">
                      Actif
                    </span>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: "Projets actifs", value: "3" },
                      { label: "En attente", value: "1" },
                      { label: "Agreees", value: "2" },
                      { label: "Investissement", value: "$2.5M" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-[#0A1628]/50 rounded-lg p-3 border border-[#1E3A5F]"
                      >
                        <p className="text-gray-400 text-xs">{item.label}</p>
                        <p className="text-white text-xl font-bold">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Projet AgriTech</span>
                      <span className="text-white font-medium">75%</span>
                    </div>
                    <div className="h-2 bg-[#0A1628] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4A853] to-[#E5B964] rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs">
                      Evaluation en cours - 5 jours restants
                    </p>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-2xl animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4A853]/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#D4A853]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1628] text-sm">
                        Agrement approuve!
                      </p>
                      <p className="text-gray-500 text-xs">Il y a 2 minutes</p>
                    </div>
                  </div>
                </div>

                {/* Stats badge */}
                <div className="absolute -bottom-4 -left-6 bg-gradient-to-r from-[#D4A853] to-[#E5B964] rounded-xl p-4 shadow-xl">
                  <p className="text-3xl font-bold text-[#0A1628]">$2.5Mrd</p>
                  <p className="text-[#0A1628]/70 text-sm">
                    Investissements facilites
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a
            href="#services"
            className="flex flex-col items-center text-gray-400 hover:text-[#D4A853] transition-colors"
          >
            <span className="text-sm mb-2">Decouvrir</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group cursor-default"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#0A1628]/5 to-[#1E3A5F]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-[#1E3A5F]" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
                    {stat.value}
                    <span className="text-[#D4A853]">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4 mr-2" />
              Nos Services
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              Une Plateforme Complete pour vos Investissements
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              De la creation de compte a l'obtention de votre agrement, nous vous
              accompagnons a chaque etape de votre projet d'investissement.
            </p>
          </div>

          {/* Services tabs */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Tabs navigation */}
            <div className="lg:col-span-4 space-y-3">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => setActiveService(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    activeService === index
                      ? "bg-white shadow-lg border-l-4 border-[#D4A853]"
                      : "hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#0A1628]"
                    >
                      <service.icon className="w-6 h-6 text-[#D4A853]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0A1628]">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {service.subtitle}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${
                        activeService === index ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Active service content */}
            <div className="lg:col-span-8">
              <div
                className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl p-8 text-white h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {services[activeService].title}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        {services[activeService].subtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#D4A853]">
                        {services[activeService].stats.value}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {services[activeService].stats.label}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-gray-300 mb-8">
                    {services[activeService].description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {services[activeService].features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-[#1E3A5F]/50 rounded-lg p-3 border border-[#D4A853]/10"
                      >
                        <CheckCircle className="w-5 h-5 text-[#D4A853] flex-shrink-0" />
                        <span className="text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link
                      href="/login"
                      className="inline-flex items-center px-6 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all group"
                    >
                      Acceder au service
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="secteurs" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Globe2 className="w-4 h-4 mr-2" />
              Opportunites
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              Secteurs Strategiques d'Investissement
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              La RDC offre des opportunites exceptionnelles dans des secteurs cles
              avec un potentiel de croissance enorme.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, index) => (
              <Link
                key={index}
                href="/investir"
                className="group bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#D4A853]/50 hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className="w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                >
                  <sector.icon className="w-8 h-8 text-[#D4A853]" />
                </div>
                <h3 className="font-semibold text-[#0A1628] mb-1">
                  {sector.name}
                </h3>
                <p className="text-sm text-[#D4A853] font-medium">
                  {sector.potential}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/investir"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] text-white font-semibold rounded-xl hover:from-[#1E3A5F] hover:to-[#0A1628] transition-all shadow-lg hover:shadow-xl group"
            >
              Explorer toutes les opportunites
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="carte" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Map className="w-4 h-4 mr-2" />
              Carte Interactive
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              Explorez les Opportunites par Province
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Decouvrez les opportunites d'investissement dans chacune des 26 provinces
              de la RDC. Cliquez sur une province pour voir les projets disponibles.
            </p>
          </div>

          <DRCMapPublic />
        </div>
      </section>

      {/* Advantages Section */}
      <section id="avantages" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-[#D4A853]/20 text-[#0A1628] rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4 mr-2 text-[#D4A853]" />
                Code des Investissements
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
                Des Avantages Exceptionnels pour vos Investissements
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                La RDC offre l'un des regimes fiscaux les plus attractifs d'Afrique
                pour les investisseurs nationaux et etrangers.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {advantages.map((advantage, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#D4A853]/30 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#0A1628]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A853] transition-colors">
                        <advantage.icon className="w-6 h-6 text-[#1E3A5F] group-hover:text-[#0A1628] transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#0A1628]">
                            {advantage.title}
                          </h3>
                          <span className="px-2 py-0.5 bg-[#D4A853]/20 text-[#0A1628] text-xs font-medium rounded-full">
                            {advantage.highlight}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#D4A853]" />
                  Regime Fiscal Complet
                </h3>
                <div className="space-y-4">
                  {[
                    "Exoneration de l'impot sur les benefices (5 a 10 ans)",
                    "Franchise de droits de douane sur equipements",
                    "Exoneration de la TVA sur les importations",
                    "Amortissement accelere des investissements",
                    "Libre rapatriement des benefices et capitaux",
                    "Protection contre toute nationalisation",
                    "Stabilisation du regime fiscal",
                    "Acces aux traites bilateraux de protection",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4A853] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-[#1E3A5F]">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-colors w-full justify-center group"
                  >
                    Beneficier des avantages
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Decorative badge */}
              <div className="absolute -top-6 -right-6 bg-[#D4A853] text-[#0A1628] rounded-full p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-xs font-medium">ANS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processus" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              Processus Simple
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              Comment Ca Marche?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Un processus entierement digitalise pour obtenir votre agrement en
              toute simplicite.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4A853]/20 via-[#D4A853] to-[#D4A853]/20 transform -translate-y-1/2" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center relative z-10 hover:shadow-xl hover:border-[#D4A853]/30 transition-all group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <step.icon className="w-10 h-10 text-[#D4A853]" />
                    </div>
                    <div className="text-sm font-bold text-[#D4A853] mb-2">
                      Etape {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A1628] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-lg hover:shadow-xl group"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <HeartHandshake className="w-4 h-4 mr-2" />
              Temoignages
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              Ils Nous Font Confiance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Decouvrez les experiences de nos investisseurs qui ont reussi en RDC
              avec l'accompagnement de l'ANAPI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#D4A853]/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-[#D4A853] fill-[#D4A853]"
                    />
                  ))}
                </div>

                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-full flex items-center justify-center text-[#D4A853] text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1628]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                    <p className="text-xs text-[#D4A853] font-medium">
                      {testimonial.sector}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">
            Partenaires Internationaux
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors cursor-default"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4 mr-2" />
              FAQ
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628]">
              Questions Frequentes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Trouvez les reponses a vos questions sur l'investissement en RDC
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#D4A853]/50 transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-[#0A1628] pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4A853] flex-shrink-0 transition-transform ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtdi00aC0ydjRoLTJ2LTJoLTR2NGgydjJoNHYtMmgyem0wLTMwdi0yaC0ydjJoLTR2Mmg0djRoMnYtNGgydi0yaC0yem0tMjQgMjhoMnYtNGgydi0ySDEydjJoLTJ2NGgydi0yaDJ6bTItMjRoMnYtMmgydi0yaC0ydi0yaC0ydjJoLTJ2Mmgydjh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Pret a Investir en RDC?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Rejoignez les centaines d'entreprises qui ont fait confiance a l'ANAPI
            pour reussir leur investissement en Republique Democratique du Congo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#D4A853] text-[#0A1628] font-semibold rounded-xl hover:bg-[#E5B964] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
            >
              Creer mon compte gratuitement
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5 mr-2" />
              Nous contacter
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#D4A853]" />
              <span>Inscription gratuite</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#D4A853]" />
              <span>Accompagnement expert</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#D4A853]" />
              <span>Resultats garantis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium mb-4">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-6">
                Besoin d'Assistance?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Notre equipe est disponible pour repondre a toutes vos questions et
                vous accompagner dans votre projet d'investissement.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0A1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A1628]">Telephone</h4>
                    <p className="text-gray-600">+243 999 925 026</p>
                    <p className="text-gray-600">+243 81 555 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0A1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A1628]">Email</h4>
                    <p className="text-gray-600">contact@anapi.cd</p>
                    <p className="text-gray-600">investir@anapi.cd</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0A1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A1628]">Adresse</h4>
                    <p className="text-gray-600">
                      Boulevard du 30 Juin, Immeuble ANAPI
                    </p>
                    <p className="text-gray-600">Kinshasa, Gombe - RDC</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0A1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A1628]">Heures d'ouverture</h4>
                    <p className="text-gray-600">Lundi - Vendredi: 8h00 - 16h00</p>
                    <p className="text-gray-600">Samedi: 8h00 - 12h00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#0A1628] mb-6">
                Envoyez-nous un message
              </h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    placeholder="+243..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'interet
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent text-gray-500">
                    <option value="">Selectionnez un secteur</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="mines">Mines & Ressources</option>
                    <option value="energie">Energie</option>
                    <option value="tourisme">Tourisme</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="tech">Technologies</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Decrivez votre projet ou posez vos questions..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] text-white font-semibold rounded-xl hover:from-[#1E3A5F] hover:to-[#0A1628] transition-all shadow-lg hover:shadow-xl"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-xl flex items-center justify-center border border-[#D4A853]/30">
                  <Globe className="w-7 h-7 text-[#D4A853]" />
                </div>
                <div>
                  <span className="text-xl font-bold">ANAPI</span>
                  <p className="text-xs text-[#D4A853]">Agence Nationale pour la Promotion des Investissements</p>
                </div>
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm">
                L'Agence Nationale pour la Promotion des Investissements est votre
                partenaire de confiance pour reussir votre investissement en
                Republique Democratique du Congo.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "youtube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center hover:bg-[#D4A853] hover:text-[#0A1628] transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <Globe className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#D4A853]">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Guichet Unique
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Agrements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Climat des Affaires
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Direction Juridique
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#D4A853]">Ressources</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Guide de l'investisseur
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Code des investissements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Formulaires
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Publications
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#D4A853]">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Politique de confidentialite
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#D4A853] transition-colors">
                    Mentions legales
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1E3A5F]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} ANAPI - Agence Nationale pour la
                Promotion des Investissements
              </p>
              <p className="text-[#D4A853] text-sm">
                Republique Democratique du Congo
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
