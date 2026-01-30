"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReferentielMinistryList } from "@/app/services/admin/Referentiel.service";
import {
  Landmark,
  ChevronDown,
  Loader2,
  ArrowRight,
  LayoutDashboard,
  FileBadge,
  Award,
  ScrollText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
} from "lucide-react";

export default function MinistriesListPage() {
  const intl = useIntl();
  const { locale } = useLanguage();
  const [allMinistries, setAllMinistries] = useState([]);
  const [filteredMinistries, setFilteredMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [stats, setStats] = useState({});

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const response = await ReferentielMinistryList({ limit: 100 });
      const result = response.data;

      const data = result.data?.ministries || result.ministries || result.data || [];
      const activeMinistries = Array.isArray(data) ? data.filter(m => m.isActive !== false) : [];
      setAllMinistries(activeMinistries);
      setFilteredMinistries(activeMinistries);

      // Fetch stats for each ministry
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const statsPromises = activeMinistries.map(async (ministry) => {
        try {
          const statsRes = await fetch(`/api/ministries/${ministry.id}/dashboard`, { headers });
          const statsData = await statsRes.json();
          return { ministryId: ministry.id, stats: statsData.success ? statsData.globalStats : null };
        } catch {
          return { ministryId: ministry.id, stats: null };
        }
      });

      const allStats = await Promise.all(statsPromises);
      const statsMap = {};
      allStats.forEach(({ ministryId, stats }) => {
        statsMap[ministryId] = stats;
      });
      setStats(statsMap);
    } catch (err) {
      console.error("Erreur chargement ministeres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  // Filtrer les ministeres quand la selection change
  useEffect(() => {
    if (selectedMinistry) {
      setFilteredMinistries(allMinistries.filter(m => m.id === selectedMinistry));
    } else {
      setFilteredMinistries(allMinistries);
    }
  }, [selectedMinistry, allMinistries]);

  const getMinistryColor = (index) => {
    const colors = [
      "from-blue-500/80 to-blue-600/80 dark:from-blue-700/60 dark:to-blue-800/60",
      "from-purple-500/80 to-purple-600/80 dark:from-purple-700/60 dark:to-purple-800/60",
      "from-emerald-500/80 to-emerald-600/80 dark:from-emerald-700/60 dark:to-emerald-800/60",
      "from-amber-500/80 to-orange-500/80 dark:from-amber-700/60 dark:to-orange-700/60",
      "from-rose-500/80 to-pink-500/80 dark:from-rose-700/60 dark:to-pink-700/60",
      "from-cyan-500/80 to-teal-500/80 dark:from-cyan-700/60 dark:to-teal-700/60",
      "from-indigo-500/80 to-violet-500/80 dark:from-indigo-700/60 dark:to-violet-700/60",
      "from-slate-500/80 to-gray-500/80 dark:from-slate-600/60 dark:to-gray-600/60",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 dark:from-indigo-800/60 dark:to-purple-700/60 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Landmark className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{intl.formatMessage({ id: "ministries.title", defaultMessage: "Ministères" })}</h1>
            <p className="text-indigo-100 mt-1">
              {intl.formatMessage({ id: "ministries.subtitle", defaultMessage: "Accédez aux dashboards et gérez les demandes par ministère" })}
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="">{intl.formatMessage({ id: "ministries.allMinistries", defaultMessage: "Tous les ministères" })}</option>
              {allMinistries.map((ministry) => (
                <option key={ministry.id} value={ministry.id}>
                  {ministry.shortName || ministry.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <Link
            href="/configuration/ministry-workflows"
            className="inline-flex items-center px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-5 h-5 mr-2" />
            {intl.formatMessage({ id: "ministries.configureWorkflows", defaultMessage: "Configurer Workflows" })}
          </Link>
        </div>
      </div>

      {/* Ministries Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredMinistries.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
          <Landmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{intl.formatMessage({ id: "ministries.noMinistryFound", defaultMessage: "Aucun ministère trouvé" })}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinistries.map((ministry, index) => {
            const ministryStats = stats[ministry.id];
            return (
              <div
                key={ministry.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Ministry Header */}
                <div className={`bg-gradient-to-r ${getMinistryColor(index)} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Landmark className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {ministry.shortName || ministry.code}
                        </h3>
                        <p className="text-white/80 text-sm truncate max-w-[180px]">
                          {ministry.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6">
                  {ministryStats ? (
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg mx-auto mb-1">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{(ministryStats.total || 0).toLocaleString(locale)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{intl.formatMessage({ id: "ministries.total", defaultMessage: "Total" })}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg mx-auto mb-1">
                          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{(ministryStats.pending || 0).toLocaleString(locale)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{intl.formatMessage({ id: "ministries.pending", defaultMessage: "En attente" })}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg mx-auto mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{(ministryStats.approved || 0).toLocaleString(locale)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{intl.formatMessage({ id: "ministries.approved", defaultMessage: "Approuvées" })}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-lg mx-auto mb-1">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{(ministryStats.rejected || 0).toLocaleString(locale)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{intl.formatMessage({ id: "ministries.rejected", defaultMessage: "Rejetées" })}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 mb-6">
                      <p className="text-sm text-gray-400">{intl.formatMessage({ id: "ministries.statsUnavailable", defaultMessage: "Statistiques indisponibles" })}</p>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="space-y-2">
                    <Link
                      href={`/ministries/${ministry.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{intl.formatMessage({ id: "ministries.dashboard", defaultMessage: "Dashboard" })}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </Link>

                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/ministries/${ministry.id}/autorisations`}
                        className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <FileBadge className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{intl.formatMessage({ id: "ministries.authorizations", defaultMessage: "Autorisations" })}</span>
                      </Link>
                      <Link
                        href={`/ministries/${ministry.id}/licences`}
                        className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">{intl.formatMessage({ id: "ministries.licenses", defaultMessage: "Licences" })}</span>
                      </Link>
                      <Link
                        href={`/ministries/${ministry.id}/permis`}
                        className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                      >
                        <ScrollText className="w-5 h-5 text-orange-600 dark:text-orange-400 mb-1" />
                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{intl.formatMessage({ id: "ministries.permits", defaultMessage: "Permis" })}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
