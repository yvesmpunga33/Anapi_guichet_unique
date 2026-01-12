"use client";

import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  User,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// Services
import { InvestorList, InvestorDelete } from "@/app/services/admin/Investor.service";

export default function InvestorsPage() {
  const intl = useIntl();
  const { locale } = useLanguage();

  const investorTypes = {
    company: { label: intl.formatMessage({ id: "investors.type.company", defaultMessage: "Societe" }), icon: Building2 },
    individual: { label: intl.formatMessage({ id: "investors.type.individual", defaultMessage: "Individuel" }), icon: User },
    organization: { label: intl.formatMessage({ id: "investors.type.organization", defaultMessage: "Organisation" }), icon: Globe },
    government: { label: intl.formatMessage({ id: "investors.type.government", defaultMessage: "Gouvernement" }), icon: Building2 },
  };

  const statusConfig = {
    ACTIVE: { label: intl.formatMessage({ id: "investors.status.active", defaultMessage: "Actif" }), color: "bg-green-100 text-green-700" },
    PENDING: { label: intl.formatMessage({ id: "investors.status.pending", defaultMessage: "En attente" }), color: "bg-yellow-100 text-yellow-700" },
    SUSPENDED: { label: intl.formatMessage({ id: "investors.status.suspended", defaultMessage: "Suspendu" }), color: "bg-red-100 text-red-700" },
    INACTIVE: { label: intl.formatMessage({ id: "investors.status.inactive", defaultMessage: "Inactif" }), color: "bg-gray-100 text-gray-700" },
  };

  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    pending: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [deleting, setDeleting] = useState(null);

  // Fetch investors from API
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      if (searchTerm) {
        params.search = searchTerm;
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      const response = await InvestorList(params);
      const data = response.data;

      setInvestors(data.investors || []);
      setStats(data.stats || { total: 0, active: 0, verified: 0, pending: 0 });
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      }));
    } catch (err) {
      console.error('Error fetching investors:', err);
      setError(err.response?.data?.message || err.message || intl.formatMessage({ id: "investors.error.loading", defaultMessage: "Erreur lors du chargement des investisseurs" }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchInvestors();
  }, [pagination.page, statusFilter, typeFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchInvestors();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Delete investor
  const handleDelete = async (investor) => {
    if (!confirm(intl.formatMessage({ id: "investors.confirm.delete", defaultMessage: "Etes-vous sur de vouloir supprimer l'investisseur \"{name}\" ?" }, { name: investor.name }))) {
      return;
    }

    try {
      setDeleting(investor.id);
      await InvestorDelete(investor.id);
      // Refresh the list
      fetchInvestors();
    } catch (err) {
      alert(err.response?.data?.message || err.message || intl.formatMessage({ id: "investors.error.delete", defaultMessage: "Erreur lors de la suppression" }));
    } finally {
      setDeleting(null);
    }
  };

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate total investments amount
  const totalInvestmentsAmount = investors.reduce((sum, i) => sum + (i.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {intl.formatMessage({ id: "investors.title", defaultMessage: "Investisseurs" })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {intl.formatMessage({ id: "investors.subtitle", defaultMessage: "Gestion du repertoire des investisseurs" })}
          </p>
        </div>
        <Link
          href="/investments/investors/new"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          {intl.formatMessage({ id: "investors.newInvestor", defaultMessage: "Nouvel Investisseur" })}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "investors.stats.total", defaultMessage: "Total Investisseurs" })}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "investors.stats.active", defaultMessage: "Actifs" })}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "investors.stats.verified", defaultMessage: "Verifies" })}</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.verified}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "investors.stats.investments", defaultMessage: "Investissements" })}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatAmount(totalInvestmentsAmount, "USD")}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "investors.searchPlaceholder", defaultMessage: "Rechercher par code, nom ou email..." })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{intl.formatMessage({ id: "investors.allTypes", defaultMessage: "Tous les types" })}</option>
              {Object.entries(investorTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{intl.formatMessage({ id: "investors.allStatuses", defaultMessage: "Tous les statuts" })}</option>
              {Object.entries(statusConfig).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <button
              onClick={fetchInvestors}
              className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={intl.formatMessage({ id: "common.refresh", defaultMessage: "Actualiser" })}
            >
              <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={fetchInvestors}
            className="ml-auto text-red-600 hover:text-red-700 font-medium text-sm"
          >
            {intl.formatMessage({ id: "investors.retry", defaultMessage: "Reessayer" })}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "investors.loading", defaultMessage: "Chargement des investisseurs..." })}</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "investors.table.investor", defaultMessage: "Investisseur" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "investors.table.contact", defaultMessage: "Contact" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "investors.table.location", defaultMessage: "Localisation" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "investors.table.investments", defaultMessage: "Investissements" })}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "investors.table.status", defaultMessage: "Statut" })}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {intl.formatMessage({ id: "investors.table.actions", defaultMessage: "Actions" })}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {investors.map((investor) => {
                  const status = statusConfig[investor.status] || statusConfig.PENDING;
                  const typeInfo = investorTypes[investor.type] || investorTypes.company;
                  const TypeIcon = typeInfo.icon;

                  return (
                    <tr
                      key={investor.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                            <TypeIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {investor.name}
                              </p>
                              {investor.isVerified && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {investor.investorCode}
                              </p>
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">
                                {typeInfo.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {investor.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">{investor.email}</span>
                            </div>
                          )}
                          {investor.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">{investor.phone}</span>
                            </div>
                          )}
                          {investor.contactPerson && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {investor.contactPerson} {investor.contactPosition ? `- ${investor.contactPosition}` : ''}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{investor.country || 'RDC'}</p>
                            {investor.province && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {investor.city ? `${investor.city}, ` : ''}{investor.province}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {investor.totalInvestments || 0} {intl.formatMessage({ id: "investors.projects", defaultMessage: "projets" })}
                            </span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-0.5">
                            {formatAmount(investor.totalAmount, investor.currency || 'USD')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {intl.formatMessage({ id: "investors.registeredOn", defaultMessage: "Inscrit le" })} {formatDate(investor.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/investments/investors/${investor.id}`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title={intl.formatMessage({ id: "investors.viewDetails", defaultMessage: "Voir details" })}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/investments/investors/${investor.id}?edit=true`}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title={intl.formatMessage({ id: "common.edit", defaultMessage: "Modifier" })}
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(investor)}
                            disabled={deleting === investor.id}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                            title={intl.formatMessage({ id: "common.delete", defaultMessage: "Supprimer" })}
                          >
                            {deleting === investor.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {investors.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "investors.noInvestorsFound", defaultMessage: "Aucun investisseur trouve" })}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {intl.formatMessage({ id: "investors.tryModifyFilters", defaultMessage: "Essayez de modifier vos filtres de recherche ou ajoutez un nouvel investisseur" })}
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {intl.formatMessage({ id: "investors.showing", defaultMessage: "Affichage de" })} <span className="font-medium">{investors.length}</span> {intl.formatMessage({ id: "investors.of", defaultMessage: "sur" })}{" "}
              <span className="font-medium">{pagination.total}</span> {intl.formatMessage({ id: "investors.investorsLabel", defaultMessage: "investisseurs" })}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
                {pagination.page}
              </span>
              {pagination.totalPages > 1 && (
                <span className="text-sm text-gray-500">/ {pagination.totalPages}</span>
              )}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
