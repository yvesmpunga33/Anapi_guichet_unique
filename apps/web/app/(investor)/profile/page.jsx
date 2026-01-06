"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Camera,
  Shield,
  Key,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";

export default function InvestorProfilePage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    rccm: "",
    idNat: "",
    taxNumber: "",
    address: "",
    city: "",
    country: "",
    website: "",
    sector: "",
    description: "",
    verified: false,
  });

  useEffect(() => {
    setPageTitle("Mon Profil");
  }, [setPageTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({
        firstName: session?.user?.name?.split(" ")[0] || "Jean",
        lastName: session?.user?.name?.split(" ")[1] || "Dupont",
        email: session?.user?.email || "jean.dupont@example.com",
        phone: "+243 999 123 456",
        companyName: "Dupont Investments SARL",
        companyType: "SARL",
        rccm: "RCCM/KIN/123456",
        idNat: "01-123-N12345X",
        taxNumber: "A1234567B",
        address: "123 Avenue de la Paix",
        city: "Kinshasa",
        country: "RDC",
        website: "www.dupont-investments.cd",
        sector: "Agriculture, Energie",
        description: "Societe d'investissement specialisee dans les secteurs agricoles et energetiques en RDC.",
        verified: true,
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [session]);

  const handleSave = () => {
    setEditing(false);
    // API call would go here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtdi00aC0ydjRoLTJ2LTJoLTR2NGgydjJoNHYtMmgyem0wLTMwdi0yaC0ydjJoLTR2Mmg0djRoMnYtNGgydi0yaC0yem0tMjQgMjhoMnYtNGgydi0ySDEydjJoLTJ2NGgydi0yaDJ6bTItMjRoMnYtMmgydi0yaC0ydi0yaC0ydjJoLTJ2Mmgydjh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-[#D4A853] rounded-2xl flex items-center justify-center text-[#0A1628] text-3xl font-bold">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-[#1E3A5F] shadow-lg transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
              {profile.verified && (
                <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Verifie
                </span>
              )}
            </div>
            <p className="text-[#D4A853] font-medium mt-1">{profile.companyName}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-300">
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {profile.email}
              </span>
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {profile.phone}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {profile.city}, {profile.country}
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 p-2">
            {[
              { id: "profile", label: "Informations", icon: User },
              { id: "company", label: "Entreprise", icon: Building },
              { id: "security", label: "Securite", icon: Shield },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#0A1628] text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informations personnelles</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prenom</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telephone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ville</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pays</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#D4A853] text-[#0A1628] font-medium rounded-lg hover:bg-[#E5B964] transition-colors"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    Enregistrer
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "company" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informations de l'entreprise</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de societe</label>
                  <select
                    value={profile.companyType}
                    onChange={(e) => setProfile({ ...profile, companyType: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  >
                    <option value="SARL">SARL</option>
                    <option value="SA">SA</option>
                    <option value="SAS">SAS</option>
                    <option value="EI">Entreprise Individuelle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RCCM</label>
                  <input
                    type="text"
                    value={profile.rccm}
                    onChange={(e) => setProfile({ ...profile, rccm: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID National</label>
                  <input
                    type="text"
                    value={profile.idNat}
                    onChange={(e) => setProfile({ ...profile, idNat: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Numero Impot</label>
                  <input
                    type="text"
                    value={profile.taxNumber}
                    onChange={(e) => setProfile({ ...profile, taxNumber: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Web</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secteurs d'activite</label>
                  <input
                    type="text"
                    value={profile.sector}
                    onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A853] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Securite du compte</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 rounded-xl flex items-center justify-center">
                        <Key className="w-6 h-6 text-[#0A1628] dark:text-[#D4A853]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Mot de passe</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Derniere modification il y a 3 mois</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      Modifier
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Authentification a deux facteurs</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">Active</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      Gerer
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0A1628]/10 dark:bg-[#D4A853]/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#0A1628] dark:text-[#D4A853]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Sessions actives</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2 appareils connectes</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences de notification</h2>

              <div className="space-y-4">
                {[
                  { id: "email_projects", label: "Mises a jour des projets", description: "Recevoir des emails sur l'avancement de vos projets", enabled: true },
                  { id: "email_approvals", label: "Statut des agrements", description: "Notifications sur le statut de vos demandes d'agrement", enabled: true },
                  { id: "email_opportunities", label: "Nouvelles opportunites", description: "Alertes sur les nouvelles opportunites d'investissement", enabled: true },
                  { id: "email_newsletter", label: "Newsletter ANAPI", description: "Actualites et informations sur le climat des affaires", enabled: false },
                  { id: "sms_urgent", label: "Alertes SMS urgentes", description: "Notifications SMS pour les actions urgentes requises", enabled: true },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{notification.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4A853] rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-[#D4A853]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
