"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  FileSignature,
  Calendar,
  Loader2,
  RefreshCw,
  Settings,
  ArrowLeft,
} from "lucide-react";

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState(null);
  const [expiringContracts, setExpiringContracts] = useState([]);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [message, setMessage] = useState(null);
  const [emailConfig, setEmailConfig] = useState({
    configured: false,
    provider: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Recuperer le statut des notifications
      const statusRes = await fetch("/api/legal/notifications");
      const statusData = await statusRes.json();
      if (statusRes.ok) {
        setStats(statusData.stats);
        setEmailConfig(statusData.config);
      }

      // Recuperer les contrats expirant
      const contractsRes = await fetch("/api/legal/contracts?expiring=30");
      const contractsData = await contractsRes.json();
      if (contractsRes.ok) {
        setExpiringContracts(contractsData.contracts || []);
      }

      // Recuperer les alertes en attente
      const alertsRes = await fetch("/api/legal/alerts?status=PENDING&limit=10");
      const alertsData = await alertsRes.json();
      if (alertsRes.ok) {
        setPendingAlerts(alertsData.alerts || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (type, data = {}) => {
    setSending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/legal/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...data }),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: result.message || "Notification envoyee avec succes",
        });
        fetchData(); // Rafraichir les donnees
      } else {
        setMessage({
          type: "error",
          text: result.error || "Erreur lors de l'envoi",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de connexion",
      });
    } finally {
      setSending(false);
    }
  };

  const sendContractExpiringNotification = async (contractId) => {
    await sendNotification("contract_expiring", { contractId });
  };

  const sendDailyDigest = async () => {
    await sendNotification("daily_digest");
  };

  const sendAllExpiringNotifications = async () => {
    for (const contract of expiringContracts) {
      await sendNotification("contract_expiring", { contractId: contract.id });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/legal/dashboard"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Bell className="w-8 h-8 text-green-500" />
              Notifications Email
            </h1>
            <p className="text-gray-400 mt-1">
              Gestion des notifications et alertes par email
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Configuration Email */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Configuration Email
          </h2>
          <Link
            href="/admin/config"
            className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            <Settings className="w-4 h-4" />
            Configurer SMTP
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-400">Statut</p>
            <p className={`text-lg font-medium ${emailConfig.configured ? "text-green-400" : "text-yellow-400"}`}>
              {emailConfig.configured ? "Configure" : "Mode simulation"}
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-400">Fournisseur</p>
            <p className="text-lg font-medium text-white">
              {emailConfig.provider || "Non configure"}
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-400">Note</p>
            <p className="text-sm text-gray-300">
              {emailConfig.configured
                ? "Les emails seront envoyes reellement"
                : "Les emails sont simules (voir console serveur)"}
            </p>
          </div>
        </div>
        {!emailConfig.configured && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center justify-between">
            <p className="text-sm text-yellow-400">
              Pour activer l'envoi reel d'emails, configurez les parametres SMTP dans la page de configuration.
            </p>
            <Link
              href="/admin/config"
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
            >
              Configurer
            </Link>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Envoyer digest quotidien */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Digest Quotidien</h3>
              <p className="text-sm text-gray-400">
                Resume des alertes et contrats a surveiller
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Alertes en attente</span>
              <span className="text-white font-medium">{stats?.pendingAlerts || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Contrats expirant (30j)</span>
              <span className="text-white font-medium">{stats?.expiringContracts || 0}</span>
            </div>
            <button
              onClick={sendDailyDigest}
              disabled={sending}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Envoyer le digest
            </button>
          </div>
        </div>

        {/* Notifications contrats expirant */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Alertes Expiration</h3>
              <p className="text-sm text-gray-400">
                Notifier les parties des contrats expirant
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Contrats dans 30 jours</span>
              <span className="text-orange-400 font-medium">{expiringContracts.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Parties a notifier</span>
              <span className="text-white font-medium">
                {expiringContracts.reduce((acc, c) => acc + (c.parties?.length || 0), 0)}
              </span>
            </div>
            <button
              onClick={sendAllExpiringNotifications}
              disabled={sending || expiringContracts.length === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              Notifier toutes les parties
            </button>
          </div>
        </div>
      </div>

      {/* Contrats expirant bientot */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-orange-400" />
            Contrats expirant dans 30 jours
          </h2>
        </div>
        {expiringContracts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-400">Aucun contrat n'expire dans les 30 prochains jours</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {expiringContracts.map((contract) => {
              const daysLeft = Math.ceil(
                (new Date(contract.endDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div key={contract.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${daysLeft <= 7 ? "bg-red-500/20" : "bg-orange-500/20"}`}>
                      <Calendar className={`w-5 h-5 ${daysLeft <= 7 ? "text-red-400" : "text-orange-400"}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{contract.title}</p>
                      <p className="text-sm text-gray-400">
                        {contract.contractNumber} - Expire le {new Date(contract.endDate).toLocaleDateString("fr-FR")}
                      </p>
                      {contract.parties?.length > 0 && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3" />
                          {contract.parties.map(p => p.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      daysLeft <= 7
                        ? "bg-red-500/20 text-red-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {daysLeft} jours
                    </span>
                    <button
                      onClick={() => sendContractExpiringNotification(contract.id)}
                      disabled={sending}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Notifier
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alertes en attente */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Alertes en attente
          </h2>
        </div>
        {pendingAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-400">Aucune alerte en attente</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {pendingAlerts.map((alert) => (
              <div key={alert.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    alert.priority === "HIGH" ? "bg-red-500/20" :
                    alert.priority === "MEDIUM" ? "bg-yellow-500/20" : "bg-blue-500/20"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.priority === "HIGH" ? "text-red-400" :
                      alert.priority === "MEDIUM" ? "text-yellow-400" : "text-blue-400"
                    }`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-400">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Echeance: {new Date(alert.dueDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    alert.priority === "HIGH" ? "bg-red-500/20 text-red-400" :
                    alert.priority === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {alert.priority}
                  </span>
                  <Link
                    href={`/legal/alerts`}
                    className="text-sm text-green-400 hover:text-green-300"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
