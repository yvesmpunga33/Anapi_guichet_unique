"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Mail,
  Server,
  Save,
  TestTube,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
} from "lucide-react";

export default function ConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [message, setMessage] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [testEmail, setTestEmail] = useState("");
  const [activeTab, setActiveTab] = useState("email");

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/config");
      const data = await response.json();
      if (response.ok) {
        setConfigs(data.configs || []);
        setGrouped(data.grouped || {});
      }
    } catch (error) {
      console.error("Error fetching configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value } : c))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configs: configs.map((c) => ({ key: c.key, value: c.value })),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Configurations enregistrees avec succes",
        });
        fetchConfigs(); // Rafraichir
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors de l'enregistrement",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de connexion",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_email",
          testEmail,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error + (data.details ? `: ${data.details}` : ""),
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors du test",
      });
    } finally {
      setTesting(false);
    }
  };

  const togglePassword = (key) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getConfigsByCategory = (category) => {
    return configs.filter((c) => c.category === category);
  };

  const renderConfigField = (config) => {
    const isPassword = config.type === "password";
    const showPassword = showPasswords[config.key];

    if (config.type === "boolean") {
      return (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              handleChange(config.key, config.value === "true" ? "false" : "true")
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.value === "true" ? "bg-green-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.value === "true" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-400">
            {config.value === "true" ? "Active" : "Desactive"}
          </span>
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          type={isPassword && !showPassword ? "password" : config.type === "number" ? "number" : "text"}
          value={config.value || ""}
          onChange={(e) => handleChange(config.key, e.target.value)}
          placeholder={config.description}
          disabled={!config.isEditable}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => togglePassword(config.key)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    );
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
            href="/dashboard"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-green-500" />
              Configuration Systeme
            </h1>
            <p className="text-gray-400 mt-1">
              Parametres globaux de l'application
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchConfigs}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </div>
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
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("email")}
          className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "email"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Mail className="w-4 h-4" />
          Configuration Email
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "general"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4" />
          General
        </button>
      </div>

      {/* Email Configuration */}
      {activeTab === "email" && (
        <div className="space-y-6">
          {/* SMTP Settings */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Parametres SMTP
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Configurez votre serveur de messagerie pour l'envoi d'emails
              </p>
            </div>
            <div className="p-6 space-y-4">
              {getConfigsByCategory("email").map((config) => (
                <div key={config.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      {config.key.replace(/_/g, " ").replace(/smtp /i, "SMTP ").replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    {renderConfigField(config)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Email */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TestTube className="w-5 h-5 text-purple-400" />
                Tester la configuration
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Envoyez un email de test pour verifier que la configuration fonctionne
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">
                    Email de destination (optionnel)
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@exemple.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser votre email de session
                  </p>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTestEmail}
                    disabled={testing}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {testing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    Envoyer un test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aide */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Guide de configuration
            </h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-1">Gmail</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Serveur: smtp.gmail.com</li>
                  <li>Port: 587 (TLS) ou 465 (SSL)</li>
                  <li>Activez "Acces moins securise" ou utilisez un mot de passe d'application</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Outlook/Office 365</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Serveur: smtp.office365.com</li>
                  <li>Port: 587</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Serveur personnalise</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Contactez votre administrateur systeme pour les parametres</li>
                  <li>Utilisez le port 587 pour STARTTLS ou 465 pour SSL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Configuration */}
      {activeTab === "general" && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Settings className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                Aucune configuration generale disponible pour le moment
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
