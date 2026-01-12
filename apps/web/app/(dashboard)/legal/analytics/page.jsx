"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  FileSignature,
  FileText,
  Bell,
  AlertTriangle,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Download,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import {
  LegalAnalytics,
  LegalNotificationSend,
} from "@/app/services/admin/Legal.service";

// Composant de graphique en barres simple
const BarChart = ({ data, labelKey, valueKey, color = "#22c55e", height = 200 }) => {
  const maxValue = Math.max(...data.map((d) => d[valueKey] || 0), 1);

  return (
    <div className="flex items-end gap-2 h-full" style={{ height }}>
      {data.map((item, index) => {
        const percentage = ((item[valueKey] || 0) / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">{item[valueKey] || 0}</span>
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                height: `${Math.max(percentage, 5)}%`,
                backgroundColor: color,
              }}
            />
            <span className="text-xs text-gray-500 truncate w-full text-center">
              {item[labelKey]?.slice(0, 3) || "N/A"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Composant de graphique camembert simple
const DonutChart = ({ data, colors, size = 150 }) => {
  const total = data.reduce((sum, d) => sum + (d.count || 0), 0);
  let currentAngle = 0;

  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.count / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 40 * Math.cos((Math.PI * (startAngle + angle)) / 180);
    const y2 = 50 + 40 * Math.sin((Math.PI * (startAngle + angle)) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[index % colors.length],
      label: item.status || item.type || item.priority || item.domain || "N/A",
      percentage: percentage.toFixed(1),
      count: item.count,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.path}
            fill={seg.color}
            className="transition-all duration-300 hover:opacity-80"
          />
        ))}
        <circle cx="50" cy="50" r="25" fill="#1e293b" />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="white" fontSize="12" fontWeight="bold">
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-400">{seg.label}</span>
            <span className="text-white font-medium">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant de carte KPI
const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "green" }) => {
  const colorClasses = {
    green: "bg-green-500/10 text-green-500",
    blue: "bg-blue-500/10 text-blue-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
    red: "bg-red-500/10 text-red-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
          {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default function LegalAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("12months");
  const [sendingNotifications, setSendingNotifications] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await LegalAnalytics({ period });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendDigestEmail = async () => {
    setSendingNotifications(true);
    try {
      const response = await LegalNotificationSend({ sendDigest: true });
      setNotificationStatus(response.data);
      setTimeout(() => setNotificationStatus(null), 5000);
    } catch (error) {
      console.error("Error sending notifications:", error);
      setNotificationStatus({ success: false, message: "Erreur lors de l'envoi" });
    } finally {
      setSendingNotifications(false);
    }
  };

  const statusColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];
  const priorityColors = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#3b82f6", LOW: "#6b7280" };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  const { summary, financial, contracts, alerts, texts } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-500" />
            Tableau de bord analytique
          </h1>
          <p className="text-gray-400 mt-1">Vue d'ensemble des indicateurs juridiques</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Periode */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
          >
            <option value="3months">3 derniers mois</option>
            <option value="6months">6 derniers mois</option>
            <option value="12months">12 derniers mois</option>
            <option value="all">Tout</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchAnalytics}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>

          {/* Envoyer digest */}
          <button
            onClick={sendDigestEmail}
            disabled={sendingNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {sendingNotifications ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Envoyer rapport
          </button>
        </div>
      </div>

      {/* Notification status */}
      {notificationStatus && (
        <div
          className={`p-4 rounded-lg ${notificationStatus.success ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}
        >
          {notificationStatus.message}
        </div>
      )}

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Contrats actifs"
          value={summary?.activeContracts || 0}
          subtitle={`${summary?.totalContracts || 0} au total`}
          icon={FileSignature}
          color="green"
        />
        <KPICard
          title="Textes en vigueur"
          value={summary?.activeTexts || 0}
          subtitle={`${summary?.totalTexts || 0} au total`}
          icon={FileText}
          color="blue"
        />
        <KPICard
          title="Alertes en attente"
          value={summary?.pendingAlerts || 0}
          subtitle={`${summary?.resolvedAlerts || 0} resolues`}
          icon={Bell}
          color="yellow"
        />
        <KPICard
          title="Taux de resolution"
          value={`${summary?.alertResolutionRate || 0}%`}
          subtitle="des alertes"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Valeurs financieres */}
      {financial && Object.keys(financial.totalValueByCurrency || {}).length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Valeur des contrats actifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(financial.totalValueByCurrency).map(([currency, value]) => (
              <div key={currency} className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">{currency}</p>
                <p className="text-2xl font-bold text-white">
                  {value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrats expirant */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-yellow-500" />
          Contrats expirant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400">Prochains 30 jours</p>
                <p className="text-3xl font-bold text-white">{contracts?.expiring?.next30Days || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400">30 a 60 jours</p>
                <p className="text-3xl font-bold text-white">{contracts?.expiring?.next60Days || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400">60 a 90 jours</p>
                <p className="text-3xl font-bold text-white">{contracts?.expiring?.next90Days || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/legal/contracts?filter=expiring"
            className="text-green-400 hover:text-green-300 text-sm inline-flex items-center gap-1"
          >
            Voir tous les contrats expirant
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Graphiques en grille */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contrats par statut */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-500" />
            Contrats par statut
          </h2>
          {contracts?.byStatus?.length > 0 ? (
            <DonutChart data={contracts.byStatus} colors={statusColors} />
          ) : (
            <p className="text-gray-400 text-center py-8">Aucune donnee</p>
          )}
        </div>

        {/* Alertes par priorite */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            Alertes par priorite
          </h2>
          {alerts?.byPriority?.length > 0 ? (
            <DonutChart
              data={alerts.byPriority}
              colors={alerts.byPriority.map((a) => priorityColors[a.priority] || "#6b7280")}
            />
          ) : (
            <p className="text-gray-400 text-center py-8">Aucune alerte en attente</p>
          )}
        </div>

        {/* Contrats par type */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-blue-500" />
            Contrats par type
          </h2>
          {contracts?.byType?.length > 0 ? (
            <div className="h-48">
              <BarChart
                data={contracts.byType}
                labelKey="type"
                valueKey="count"
                color="#3b82f6"
              />
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Aucune donnee</p>
          )}
        </div>

        {/* Textes par domaine */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Textes par domaine
          </h2>
          {texts?.byDomain?.length > 0 ? (
            <div className="h-48">
              <BarChart
                data={texts.byDomain}
                labelKey="domain"
                valueKey="count"
                color="#8b5cf6"
              />
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Aucune donnee</p>
          )}
        </div>
      </div>

      {/* Evolution des contrats */}
      {contracts?.overTime?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Evolution des contrats
          </h2>
          <div className="h-64">
            <BarChart
              data={contracts.overTime.map((c) => ({
                ...c,
                label: new Date(c.month).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
              }))}
              labelKey="label"
              valueKey="count"
              color="#22c55e"
              height={240}
            />
          </div>
        </div>
      )}

      {/* Top types par valeur */}
      {financial?.topContractTypesByValue?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Top types de contrats par valeur
          </h2>
          <div className="space-y-3">
            {financial.topContractTypesByValue.map((type, index) => {
              const maxValue = financial.topContractTypesByValue[0]?.totalValue || 1;
              const percentage = (type.totalValue / maxValue) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{type.type}</span>
                    <span className="text-gray-400">
                      {type.totalValue.toLocaleString("fr-FR")} ({type.count} contrats)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contrats recents */}
      {contracts?.recent?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Contrats recemment crees
          </h2>
          <div className="space-y-2">
            {contracts.recent.map((contract) => (
              <Link
                key={contract.id}
                href={`/legal/contracts/${contract.id}`}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{contract.title}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(contract.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right">
                  {contract.value && (
                    <p className="text-green-400 font-medium">
                      {parseFloat(contract.value).toLocaleString("fr-FR")} {contract.currency || "USD"}
                    </p>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      contract.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : contract.status === "DRAFT"
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
