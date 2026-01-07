"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useIntl } from "react-intl";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Camera,
  Mail,
  Phone,
  Building2,
  Check,
  User,
  Users,
  Loader2,
  Lock,
  Briefcase,
  Shield,
  LayoutGrid,
  Eye,
  EyeOff,
  UserPlus,
  Save,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

// Liste des modules disponibles
const AVAILABLE_MODULES = [
  { id: "dashboard", name: "Tableau de bord", description: "Accès au tableau de bord principal" },
  { id: "messages", name: "Messages", description: "Messagerie interne" },
  { id: "guichet-unique", name: "Guichet Unique", description: "Gestion des dossiers d'agrément" },
  { id: "investments", name: "Investissements", description: "Suivi des projets d'investissement" },
  { id: "referentiels", name: "Référentiels", description: "Données de référence" },
  { id: "ministries", name: "Ministères", description: "Gestion des ministères" },
  { id: "configuration", name: "Configuration", description: "Paramètres système" },
  { id: "reports", name: "Rapports", description: "Statistiques et rapports" },
  { id: "hr", name: "Ressources Humaines", description: "Gestion du personnel" },
  { id: "admin", name: "Administration", description: "Administration système" },
];

const ROLES = [
  { id: "agent", name: "Agent", description: "Traitement des dossiers", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "manager", name: "Manager", description: "Supervision d'équipe", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "admin", name: "Administrateur", description: "Accès complet", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: "investor", name: "Investisseur", description: "Accès investisseur", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { id: "partner", name: "Partenaire", description: "Accès partenaire", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400" },
];

export default function UsersPage() {
  const intl = useIntl();
  const [users, setUsers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showModulesDropdown, setShowModulesDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const modulesDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
    department: "",
    phone: "",
    ministryId: "",
    modules: [],
    isActive: true,
    photo: null,
    photoPreview: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchMinistries();
  }, []);

  // Close modules dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modulesDropdownRef.current && !modulesDropdownRef.current.contains(event.target)) {
        setShowModulesDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistries = async () => {
    try {
      const response = await fetch("/api/referentiels/ministries");
      if (response.ok) {
        const data = await response.json();
        setMinistries(data.ministries || data || []);
      }
    } catch (error) {
      console.error("Error fetching ministries:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, statusFilter]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!editingUser && !formData.password.trim()) newErrors.password = "Le mot de passe est requis";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "agent",
        department: user.department || "",
        phone: user.phone || "",
        ministryId: user.ministryId || "",
        modules: user.modules || [],
        isActive: user.isActive !== false,
        photo: null,
        photoPreview: user.image || null,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "agent",
        department: "",
        phone: "",
        ministryId: "",
        modules: [],
        isActive: true,
        photo: null,
        photoPreview: null,
      });
    }
    setErrors({});
    setShowPassword(false);
    setShowModulesDropdown(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "agent",
      department: "",
      phone: "",
      ministryId: "",
      modules: [],
      isActive: true,
      photo: null,
      photoPreview: null,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La taille de l'image ne doit pas dépasser 5 Mo");
        return;
      }
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleModuleToggle = (moduleId) => {
    const currentModules = formData.modules || [];
    if (currentModules.includes(moduleId)) {
      setFormData({
        ...formData,
        modules: currentModules.filter((m) => m !== moduleId),
      });
    } else {
      setFormData({
        ...formData,
        modules: [...currentModules, moduleId],
      });
    }
  };

  const selectAllModules = () => {
    setFormData({
      ...formData,
      modules: AVAILABLE_MODULES.map((m) => m.id),
    });
  };

  const deselectAllModules = () => {
    setFormData({
      ...formData,
      modules: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      formDataToSend.append("role", formData.role);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("ministryId", formData.ministryId);
      formDataToSend.append("modules", JSON.stringify(formData.modules));
      formDataToSend.append("isActive", formData.isActive.toString());
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        handleCloseModal();
        fetchUsers();

        Swal.fire({
          icon: 'success',
          title: editingUser ? 'Utilisateur modifié' : 'Utilisateur créé',
          text: editingUser
            ? 'Les modifications ont été enregistrées avec succès.'
            : 'Le nouvel utilisateur a été créé avec succès.',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: data.error || "Une erreur est survenue lors de l'enregistrement.",
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue lors de l'enregistrement.",
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeleteConfirm(null);
        fetchUsers();

        Swal.fire({
          icon: 'success',
          title: 'Utilisateur supprimé',
          text: 'L\'utilisateur a été supprimé avec succès.',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: data.error || "Une erreur est survenue lors de la suppression.",
          confirmButtonColor: '#3B82F6',
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue lors de la suppression.",
        confirmButtonColor: '#3B82F6',
      });
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = ROLES.find((r) => r.id === role?.toLowerCase()) || ROLES[0];
    return roleConfig;
  };

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <UserPlus className="w-5 h-5" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total utilisateurs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Comptes actifs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Administrateurs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Tous les rôles</option>
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <button
            onClick={() => fetchUsers()}
            className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Créer le premier utilisateur
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Ministère</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Modules</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => {
                  const roleConfig = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full object-cover" unoptimized />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.department || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />{user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4" />{user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
                          {roleConfig.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.ministry ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{user.ministry.shortName || user.ministry.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(user.modules || []).slice(0, 2).map((moduleId) => (
                            <span key={moduleId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {AVAILABLE_MODULES.find((m) => m.id === moduleId)?.name || moduleId}
                            </span>
                          ))}
                          {(user.modules || []).length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              +{user.modules.length - 2}
                            </span>
                          )}
                          {(!user.modules || user.modules.length === 0) && <span className="text-sm text-gray-400">Aucun</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {user.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(user)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Formulaire Unique Professionnel */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header avec photo */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {formData.photoPreview ? (
                      <Image src={formData.photoPreview} alt="Preview" width={72} height={72} className="w-18 h-18 rounded-2xl object-cover border-4 border-white/30 shadow-lg" unoptimized />
                    ) : (
                      <div className="w-18 h-18 rounded-2xl bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-white text-blue-600 rounded-xl hover:bg-gray-100 shadow-lg transition-transform hover:scale-105"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                      {editingUser ? "Modifiez les informations du compte" : "Remplissez le formulaire pour créer un compte"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Formulaire unique */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Section: Informations personnelles */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2.5 border ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-shadow`}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2.5 border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-shadow`}
                          placeholder="jean.dupont@exemple.com"
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          placeholder="+243 XXX XXX XXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Département / Service
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          placeholder="Direction des Investissements"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Section: Sécurité et Rôle */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Sécurité et accès
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Mot de passe {editingUser ? "(laisser vide pour conserver)" : <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`w-full pl-10 pr-12 py-2.5 border ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-shadow`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Rôle <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                        >
                          {ROLES.map((role) => (
                            <option key={role.id} value={role.id}>{role.name} - {role.description}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Ministère de rattachement
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.ministryId}
                          onChange={(e) => setFormData({ ...formData, ministryId: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                        >
                          <option value="">-- Aucun ministère --</option>
                          {ministries.map((ministry) => (
                            <option key={ministry.id} value={ministry.id}>{ministry.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">Compte actif</p>
                          <p className="text-xs text-gray-500">Peut se connecter</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Section: Modules */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      Modules autorisés ({formData.modules.length})
                    </h3>
                    <div className="flex gap-2 text-sm">
                      <button
                        type="button"
                        onClick={selectAllModules}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Tout sélectionner
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        type="button"
                        onClick={deselectAllModules}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
                      >
                        Tout désélectionner
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {AVAILABLE_MODULES.map((module) => (
                      <label
                        key={module.id}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.modules.includes(module.id)
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.modules.includes(module.id)}
                          onChange={() => handleModuleToggle(module.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          formData.modules.includes(module.id)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}>
                          {formData.modules.includes(module.id) && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {module.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                {saving && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {editingUser ? "Mise à jour en cours..." : "Création en cours..."}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20 min-w-[160px] justify-center transition-all hover:shadow-xl hover:shadow-blue-600/30"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{editingUser ? "Mettre à jour" : "Créer"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong className="text-gray-900 dark:text-white">{showDeleteConfirm.name}</strong> ?<br />
              <span className="text-sm text-red-500">Cette action est irréversible.</span>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
