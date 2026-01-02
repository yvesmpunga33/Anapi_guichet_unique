"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  BookOpen,
  FileSignature,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Loader2,
} from "lucide-react";

export default function LegalDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/legal/stats");
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Textes juridiques",
      value: stats?.stats?.texts?.total || 0,
      subtitle: `${stats?.stats?.texts?.active || 0} en vigueur`,
      icon: BookOpen,
      color: "blue",
      href: "/legal/texts",
    },
    {
      title: "Contrats",
      value: stats?.stats?.contracts?.total || 0,
      subtitle: `${stats?.stats?.contracts?.active || 0} actifs`,
      icon: FileSignature,
      color: "green",
      href: "/legal/contracts",
    },
    {
      title: "Alertes en attente",
      value: stats?.stats?.alerts?.pending || 0,
      subtitle: `${stats?.stats?.alerts?.inProgress || 0} en cours`,
      icon: Bell,
      color: "orange",
      href: "/legal/alerts",
    },
    {
      title: "Contrats expirant",
      value: stats?.stats?.contracts?.expiringSoon || 0,
      subtitle: "Dans les 30 jours",
      icon: Clock,
      color: "red",
      href: "/legal/contracts?expiring=30",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    green: "bg-green-500/10 text-green-500 border-green-500/30",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    red: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-500" />
            Direction Juridique
          </h1>
          <p className="text-gray-400 mt-1">
            Tableau de bord - Veille juridique et gestion des contrats
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/legal/texts/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau texte
          </Link>
          <Link
            href="/legal/contracts/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau contrat
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="text-3xl font-bold text-white">{card.value}</h3>
            <p className="text-sm text-gray-400 mt-1">{card.title}</p>
            <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
          </Link>
        ))}
      </div>

      {/* Urgent Alerts */}
      {stats?.stats?.alerts?.urgent > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-400">
                {stats.stats.alerts.urgent} alerte(s) urgente(s)
              </h3>
              <p className="text-sm text-red-300">
                Des actions immediates sont requises
              </p>
            </div>
            <Link
              href="/legal/alerts?priority=HIGH"
              className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Voir les alertes
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Texts */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Textes recents
            </h2>
            <Link
              href="/legal/texts"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Voir tout
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {stats?.recent?.texts?.length > 0 ? (
              stats.recent.texts.map((text) => (
                <div
                  key={text.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {text.documentNumber}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[250px]">
                      {text.title}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      text.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : text.status === "DRAFT"
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {text.status === "ACTIVE"
                      ? "En vigueur"
                      : text.status === "DRAFT"
                      ? "Brouillon"
                      : text.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun texte juridique
              </p>
            )}
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-green-500" />
              Contrats recents
            </h2>
            <Link
              href="/legal/contracts"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Voir tout
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {stats?.recent?.contracts?.length > 0 ? (
              stats.recent.contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {contract.contractNumber}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[250px]">
                      {contract.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        contract.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : contract.status === "DRAFT"
                          ? "bg-gray-500/20 text-gray-400"
                          : contract.status === "EXPIRED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {contract.status === "ACTIVE"
                        ? "Actif"
                        : contract.status === "DRAFT"
                        ? "Brouillon"
                        : contract.status === "EXPIRED"
                        ? "Expire"
                        : contract.status}
                    </span>
                    {contract.endDate && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(contract.endDate).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun contrat</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/legal/texts/new"
            className="flex flex-col items-center p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm text-white">Ajouter un texte</span>
          </Link>
          <Link
            href="/legal/contracts/new"
            className="flex flex-col items-center p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FileSignature className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-white">Nouveau contrat</span>
          </Link>
          <Link
            href="/legal/alerts"
            className="flex flex-col items-center p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Bell className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm text-white">Voir les alertes</span>
          </Link>
          <Link
            href="/legal/contracts?expiring=30"
            className="flex flex-col items-center p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Clock className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-sm text-white">Echeances</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
