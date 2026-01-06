"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
} from "lucide-react";

export default function InvestirLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const sectors = [
    {
      name: "Agriculture & Agroalimentaire",
      icon: Leaf,
      description: "80 millions d'hectares de terres arables, climat favorable",
      opportunities: "Transformation, exportation, irrigation",
      color: "bg-green-500",
    },
    {
      name: "Mines & Ressources",
      icon: Factory,
      description: "1er producteur mondial de cobalt, reserves de coltan, or, diamant",
      opportunities: "Extraction, raffinage, transformation locale",
      color: "bg-yellow-500",
    },
    {
      name: "Energie & Hydroelectricite",
      icon: Zap,
      description: "100 000 MW de potentiel hydroelectrique inexploite",
      opportunities: "Barrages, solaire, mini-reseaux",
      color: "bg-blue-500",
    },
    {
      name: "Tourisme & Hospitalite",
      icon: Globe,
      description: "Parcs nationaux, biodiversite unique, culture riche",
      opportunities: "Eco-tourisme, hotels, safaris",
      color: "bg-purple-500",
    },
    {
      name: "Infrastructure & BTP",
      icon: Building,
      description: "Besoins massifs en routes, ponts, batiments",
      opportunities: "Construction, materiaux, transport",
      color: "bg-orange-500",
    },
    {
      name: "Technologies & Digital",
      icon: TrendingUp,
      description: "Population jeune, croissance du mobile banking",
      opportunities: "Fintech, e-commerce, telecom",
      color: "bg-cyan-500",
    },
  ];

  const advantages = [
    {
      title: "Exoneration fiscale",
      description: "Jusqu'a 10 ans d'exoneration d'impots sur les benefices",
      icon: DollarSign,
    },
    {
      title: "Franchise douaniere",
      description: "Importation d'equipements en franchise de droits",
      icon: FileCheck,
    },
    {
      title: "Guichet unique",
      description: "Toutes vos demarches en un seul endroit",
      icon: Clock,
    },
    {
      title: "Protection juridique",
      description: "Garanties constitutionnelles et traites internationaux",
      icon: Shield,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Creez votre compte",
      description: "Inscrivez-vous sur notre plateforme en quelques minutes",
    },
    {
      number: "02",
      title: "Soumettez votre projet",
      description: "Decrivez votre projet d'investissement et ses objectifs",
    },
    {
      number: "03",
      title: "Obtenez l'agrement",
      description: "Beneficiez d'un accompagnement personnalise",
    },
    {
      number: "04",
      title: "Lancez votre activite",
      description: "Profitez des avantages fiscaux et douaniers",
    },
  ];

  const testimonials = [
    {
      name: "Jean-Pierre Mukendi",
      company: "AgriCongo SARL",
      sector: "Agroalimentaire",
      quote: "Grace a l'ANAPI, nous avons obtenu notre agrement en moins de 30 jours. L'accompagnement etait exceptionnel.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      company: "China Mining Corp",
      sector: "Mines",
      quote: "Les avantages fiscaux et le support de l'ANAPI ont ete determinants dans notre decision d'investir en RDC.",
      rating: 5,
    },
    {
      name: "Marc Dubois",
      company: "EnergiePlus",
      sector: "Energie",
      quote: "Le potentiel energetique de la RDC est immense. L'ANAPI nous a aide a naviguer les procedures administratives.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Quels sont les documents requis pour une demande d'agrement?",
      answer: "Les documents requis incluent: statuts de l'entreprise, business plan, etude de faisabilite, preuves de financement, et identite des actionnaires. Notre equipe vous guidera a chaque etape.",
    },
    {
      question: "Combien de temps prend l'obtention d'un agrement?",
      answer: "Le delai moyen est de 30 a 45 jours ouvrables. Avec notre processus digitalise, vous pouvez suivre l'avancement de votre dossier en temps reel.",
    },
    {
      question: "Quels secteurs beneficient des avantages fiscaux?",
      answer: "Tous les secteurs prioritaires beneficient d'avantages: agriculture, mines, energie, tourisme, industrie manufacturiere, technologies et infrastructures.",
    },
    {
      question: "Un investisseur etranger peut-il detenir 100% du capital?",
      answer: "Oui, la legislation congolaise permet aux investisseurs etrangers de detenir 100% du capital de leur entreprise dans la plupart des secteurs.",
    },
  ];

  const stats = [
    { value: "2.5", suffix: "Mrd $", label: "Investissements facilites" },
    { value: "500", suffix: "+", label: "Entreprises accompagnees" },
    { value: "50", suffix: "K+", label: "Emplois crees" },
    { value: "30", suffix: "jours", label: "Delai moyen d'agrement" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">ANAPI</span>
                <p className="text-xs text-gray-500">Investir en RDC</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#secteurs" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Secteurs
              </a>
              <a href="#avantages" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Avantages
              </a>
              <a href="#processus" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Processus
              </a>
              <a href="#faq" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
              >
                Commencer
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4">
            <a href="#secteurs" className="block text-gray-600 hover:text-green-600 font-medium py-2">
              Secteurs
            </a>
            <a href="#avantages" className="block text-gray-600 hover:text-green-600 font-medium py-2">
              Avantages
            </a>
            <a href="#processus" className="block text-gray-600 hover:text-green-600 font-medium py-2">
              Processus
            </a>
            <a href="#faq" className="block text-gray-600 hover:text-green-600 font-medium py-2">
              FAQ
            </a>
            <a href="#contact" className="block text-gray-600 hover:text-green-600 font-medium py-2">
              Contact
            </a>
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link href="/login" className="block text-center py-2 text-gray-700 font-medium">
                Se connecter
              </Link>
              <Link
                href="/register"
                className="block text-center py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg"
              >
                Commencer
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-100/50 to-transparent" />

        {/* Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-green-600" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Destination d'investissement #1 en Afrique Centrale
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Investissez en{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  RDC
                </span>
                <br />
                Le Geant Africain
              </h1>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                La Republique Democratique du Congo vous offre des opportunites d'investissement
                exceptionnelles dans un marche de 100 millions de consommateurs, avec des avantages
                fiscaux attractifs et un accompagnement personnalise.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
                >
                  Demarrer mon projet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <a
                  href="#secteurs"
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Voir les opportunites
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">100M+</p>
                  <p className="text-sm text-gray-500">Consommateurs</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">2.34M</p>
                  <p className="text-sm text-gray-500">km2 de superficie</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">9</p>
                  <p className="text-sm text-gray-500">Pays frontaliers</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative lg:pl-12">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Votre investissement</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      En cours
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Demande soumise", completed: true },
                      { label: "Documents verifies", completed: true },
                      { label: "Evaluation en cours", completed: false },
                      { label: "Agrement delivre", completed: false },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            step.completed ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Temps estime</span>
                      <span className="font-semibold text-green-600">15 jours restants</span>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 shadow-lg">
                  <p className="text-2xl font-bold">+500</p>
                  <p className="text-sm text-green-100">Projets agreees</p>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">+247 ce mois</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white">
                  {stat.value}
                  <span className="text-green-200">{stat.suffix}</span>
                </p>
                <p className="mt-2 text-green-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="secteurs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Secteurs Strategiques
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Decouvrez les secteurs prioritaires offrant les meilleures opportunites
              d'investissement en RDC
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 ${sector.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <sector.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{sector.name}</h3>
                <p className="text-gray-600 mb-4">{sector.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-green-600">Opportunites:</span>{" "}
                    {sector.opportunities}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="avantages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Pourquoi Investir en RDC?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Le Code des Investissements congolais offre des avantages substantiels
                aux investisseurs nationaux et etrangers.
              </p>

              <div className="mt-8 space-y-6">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <advantage.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{advantage.title}</h3>
                      <p className="text-gray-600 mt-1">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="inline-flex items-center mt-8 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Beneficier des avantages
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Regime Fiscal Attractif</h3>
              <div className="space-y-4">
                {[
                  "Exoneration de l'impot sur les benefices pendant 5 a 10 ans",
                  "Franchise de droits de douane sur les equipements",
                  "Exoneration de la TVA sur les importations",
                  "Amortissement accelere des investissements",
                  "Libre rapatriement des benefices",
                  "Protection contre la nationalisation",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processus" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Comment Ca Marche?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Un processus simple et digitalise pour obtenir votre agrement en quelques etapes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="text-5xl font-bold text-green-100 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-green-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Ils Nous Font Confiance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Decouvrez les temoignages d'investisseurs qui ont reussi en RDC avec l'ANAPI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.company} - {testimonial.sector}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
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
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Pret a Investir en RDC?
                </h2>
                <p className="mt-4 text-lg text-green-100">
                  Notre equipe est disponible pour vous accompagner dans votre projet
                  d'investissement. Contactez-nous pour un accompagnement personnalise.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>+243 81 555 0000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>contact@anapi.cd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>Kinshasa, Boulevard du 30 Juin</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-gray-900">
                <h3 className="text-xl font-semibold mb-4">Demande de Contact</h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500">
                      <option value="">Secteur d'interet</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="mines">Mines</option>
                      <option value="energie">Energie</option>
                      <option value="tourisme">Tourisme</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Decrivez brievement votre projet"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    Envoyer ma demande
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ANAPI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Agence Nationale pour la Promotion des Investissements en Republique
                Democratique du Congo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#secteurs" className="hover:text-white transition-colors">Secteurs</a></li>
                <li><a href="#avantages" className="hover:text-white transition-colors">Avantages</a></li>
                <li><a href="#processus" className="hover:text-white transition-colors">Processus</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Guide de l'investisseur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Code des investissements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formulaires</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Publications</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>+243 81 555 0000</li>
                <li>contact@anapi.cd</li>
                <li>Kinshasa, RDC</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ANAPI - Agence Nationale pour la Promotion des Investissements</p>
            <p className="mt-1">Republique Democratique du Congo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
