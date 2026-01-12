"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  UserPlus,
  Key,
  MoreVertical,
  UserCheck,
  UserX,
} from "lucide-react";
import { ProvinceUserList, ProvinceUserDelete, ProvinceUserToggleStatus } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const roleConfig = {
  ADMIN: { label: "Administrateur", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: Shield },
  EDITOR: { label: "Editeur", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Edit },
  MODERATOR: { label: "Moderateur", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: UserCheck },
  VIEWER: { label: "Lecteur", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: Eye },
};

export default function UtilisateursPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 });

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = {};
      if (search) queryParams.search = search;
      if (roleFilter !== "all") queryParams.role = roleFilter;
      if (statusFilter !== "all") queryParams.isActive = statusFilter === "active";

      const response = await ProvinceUserList(provinceCode, queryParams);
      if (response.data) {
        setUsers(response.data.users || response.data.data || []);
        setStats(response.data.stats || stats);
      }
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
      // Demo data
      setUsers([
        {
          id: 1,
          firstName: "Jean",
          lastName: "Kabongo",
          email: "jean.kabongo@province.cd",
          phone: "+243 123 456 789",
          role: "ADMIN",
          isActive: true,
          lastLogin: "2026-01-12T10:30:00Z",
          createdAt: "2024-06-15",
          avatar: null,
        },
        {
          id: 2,
          firstName: "Marie",
          lastName: "Kalombo",
          email: "marie.kalombo@province.cd",
          phone: "+243 123 456 780",
          role: "EDITOR",
          isActive: true,
          lastLogin: "2026-01-11T15:45:00Z",
          createdAt: "2024-08-20",
          avatar: null,
        },
        {
          id: 3,
          firstName: "Paul",
          lastName: "Mukendi",
          email: "paul.mukendi@province.cd",
          phone: "+243 123 456 781",
          role: "MODERATOR",
          isActive: true,
          lastLogin: "2026-01-10T09:15:00Z",
          createdAt: "2024-10-05",
          avatar: null,
        },
        {
          id: 4,
          firstName: "Sophie",
          lastName: "Mwamba",
          email: "sophie.mwamba@province.cd",
          phone: "+243 123 456 782",
          role: "VIEWER",
          isActive: false,
          lastLogin: "2025-12-20T14:20:00Z",
          createdAt: "2025-01-10",
          avatar: null,
        },
      ]);
      setStats({ total: 4, active: 3, admins: 1 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [provinceCode, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceUserDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchUsers(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await ProvinceUserToggleStatus(provinceCode, user.id, !user.isActive);
      fetchUsers(true);
    } catch (err) {
      console.error("Erreur changement statut:", err);
    }
    setActionMenuOpen(null);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatDateTime = (date) => {
    if (!date) return "Jamais";
    const d = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((now - d) / (1000 * 60 * 60));
    if (diffHours < 1) return "Il y a quelques minutes";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffHours < 48) return "Hier";
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Users className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Utilisateurs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestion des comptes utilisateurs du portail</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchUsers(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/utilisateurs/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <UserPlus className="w-5 h-5" />
            Nouvel utilisateur
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "#6366F1" },
          { label: "Actifs", value: stats.active, icon: CheckCircle2, color: "#10B981" },
          { label: "Admins", value: stats.admins, icon: Shield, color: "#EF4444" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les roles</option>
            {Object.entries(roleConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucun utilisateur</h3>
          <p className="text-gray-500 mt-1">Ajoutez des utilisateurs pour gerer le portail</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Derniere connexion</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => {
                const role = roleConfig[user.role] || roleConfig.VIEWER;
                const RoleIcon = role.icon;

                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: accentColor }}>
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(user.firstName, user.lastName)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">Cree le {formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {role.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <XCircle className="w-3.5 h-3.5" />
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDateTime(user.lastLogin)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 relative">
                        <Link href={`/${provinceCode}/utilisateurs/${user.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/${provinceCode}/utilisateurs/${user.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenuOpen === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10">
                              <button
                                onClick={() => handleToggleStatus(user)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="w-4 h-4 text-orange-500" />
                                    Desactiver
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 text-green-500" />
                                    Activer
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {}}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Key className="w-4 h-4 text-blue-500" />
                                Reinitialiser MDP
                              </button>
                              <hr className="my-1 border-gray-100 dark:border-gray-700" />
                              <button
                                onClick={() => { setShowDeleteModal(user); setActionMenuOpen(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer l'utilisateur</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Etes-vous sur de vouloir supprimer <strong>{showDeleteModal.firstName} {showDeleteModal.lastName}</strong> ?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
