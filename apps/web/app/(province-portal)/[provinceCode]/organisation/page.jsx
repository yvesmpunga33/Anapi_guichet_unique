"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  Grid3X3,
  List,
  UserCircle,
  Crown,
  Shield,
  Briefcase,
  Award,
  Calendar,
  GitBranch,
} from "lucide-react";
import { ProvinceOrganizationList, ProvinceOrganizationDelete } from "@/app/services/Province.service";
import { useProvince } from "../layout";

const roleConfig = {
  GOUVERNEUR: { label: "Gouverneur", color: "#D4A853", icon: Crown },
  VICE_GOUVERNEUR: { label: "Vice-Gouverneur", color: "#8B5CF6", icon: Shield },
  MINISTRE: { label: "Ministre Provincial", color: "#3B82F6", icon: Briefcase },
  DIRECTEUR: { label: "Directeur", color: "#10B981", icon: Award },
  CHEF_SERVICE: { label: "Chef de Service", color: "#F59E0B", icon: Users },
  CONSEILLER: { label: "Conseiller", color: "#6366F1", icon: UserCircle },
  AUTRE: { label: "Autre", color: "#64748B", icon: UserCircle },
};

const departmentTypes = {
  CABINET: { label: "Cabinet", color: "#D4A853" },
  MINISTERE: { label: "Ministere Provincial", color: "#3B82F6" },
  DIRECTION: { label: "Direction Provinciale", color: "#10B981" },
  SERVICE: { label: "Service", color: "#F59E0B" },
  DIVISION: { label: "Division", color: "#8B5CF6" },
};

export default function OrganisationPage() {
  const params = useParams();
  const provinceCode = params.provinceCode;
  const provinceContext = useProvince();
  const settings = provinceContext?.settings;
  const accentColor = settings?.accentColor || "#D4A853";

  const [organization, setOrganization] = useState({ members: [], departments: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("organigramme");
  const [expandedDepts, setExpandedDepts] = useState(new Set(["CABINET", "MINISTERE"]));

  const fetchOrganization = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await ProvinceOrganizationList(provinceCode);
      if (response.data) {
        setOrganization(response.data);
      }
    } catch (err) {
      console.error("Erreur chargement organisation:", err);
      // Demo data
      setOrganization({
        members: [
          {
            id: 1,
            name: "Jean-Pierre Kabongo",
            role: "GOUVERNEUR",
            department: "CABINET",
            title: "Gouverneur de Province",
            photo: null,
            phone: "+243 123 456 789",
            email: "gouverneur@province.cd",
            startDate: "2024-01-15",
            bio: "Expert en administration publique avec plus de 20 ans d'experience.",
          },
          {
            id: 2,
            name: "Marie Kalombo",
            role: "VICE_GOUVERNEUR",
            department: "CABINET",
            title: "Vice-Gouverneur charge des Affaires Politiques",
            photo: null,
            phone: "+243 123 456 780",
            email: "vg@province.cd",
            startDate: "2024-01-15",
            bio: "Ancienne diplomate et specialiste des relations internationales.",
          },
          {
            id: 3,
            name: "Paul Mukendi",
            role: "MINISTRE",
            department: "MINISTERE",
            title: "Ministre Provincial de l'Economie",
            ministry: "Economie et Finances",
            photo: null,
            phone: "+243 123 456 781",
            email: "economie@province.cd",
            startDate: "2024-02-01",
          },
          {
            id: 4,
            name: "Sophie Mwamba",
            role: "MINISTRE",
            department: "MINISTERE",
            title: "Ministre Provincial des Infrastructures",
            ministry: "Infrastructures et Travaux Publics",
            photo: null,
            phone: "+243 123 456 782",
            email: "infra@province.cd",
            startDate: "2024-02-01",
          },
          {
            id: 5,
            name: "Jacques Tshimanga",
            role: "MINISTRE",
            department: "MINISTERE",
            title: "Ministre Provincial de l'Education",
            ministry: "Education et Formation",
            photo: null,
            phone: "+243 123 456 783",
            email: "education@province.cd",
            startDate: "2024-02-01",
          },
          {
            id: 6,
            name: "Anne Nkulu",
            role: "DIRECTEUR",
            department: "DIRECTION",
            title: "Directeur du Cabinet",
            photo: null,
            phone: "+243 123 456 784",
            email: "dircab@province.cd",
            startDate: "2024-02-15",
          },
          {
            id: 7,
            name: "Robert Kasongo",
            role: "CONSEILLER",
            department: "CABINET",
            title: "Conseiller Principal",
            specialty: "Affaires Economiques",
            photo: null,
            phone: "+243 123 456 785",
            email: "conseiller@province.cd",
            startDate: "2024-03-01",
          },
        ],
        departments: [
          {
            id: 1,
            type: "CABINET",
            name: "Cabinet du Gouverneur",
            description: "Direction executive de la province",
            headCount: 25,
            location: "Batiment administratif principal",
          },
          {
            id: 2,
            type: "MINISTERE",
            name: "Ministere Provincial de l'Economie",
            description: "Gestion economique et financiere",
            headCount: 45,
            location: "Immeuble des finances",
          },
          {
            id: 3,
            type: "MINISTERE",
            name: "Ministere Provincial des Infrastructures",
            description: "Developpement des infrastructures",
            headCount: 80,
            location: "Quartier administratif",
          },
          {
            id: 4,
            type: "MINISTERE",
            name: "Ministere Provincial de l'Education",
            description: "Gestion du secteur educatif",
            headCount: 120,
            location: "Centre-ville",
          },
        ],
        stats: {
          totalMembers: 7,
          departments: 4,
          ministries: 3,
        },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [provinceCode]);

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    setDeleting(true);
    try {
      await ProvinceOrganizationDelete(provinceCode, showDeleteModal.id);
      setShowDeleteModal(null);
      fetchOrganization(true);
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleDept = (deptType) => {
    setExpandedDepts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptType)) {
        newSet.delete(deptType);
      } else {
        newSet.add(deptType);
      }
      return newSet;
    });
  };

  const filteredMembers = organization.members?.filter(
    (m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.title?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const groupedByDepartment = filteredMembers.reduce((acc, member) => {
    const dept = member.department || "AUTRE";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <GitBranch className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            Organisation Provinciale
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Structure et membres du gouvernement provincial</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchOrganization(true)} disabled={refreshing} className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link href={`/${provinceCode}/organisation/nouveau`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: accentColor }}>
            <Plus className="w-5 h-5" />
            Ajouter membre
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Membres", value: organization.stats?.totalMembers || filteredMembers.length, icon: Users, color: "#6366F1" },
          { label: "Departements", value: organization.stats?.departments || organization.departments?.length, icon: Building2, color: "#10B981" },
          { label: "Ministeres", value: organization.stats?.ministries || 0, icon: Briefcase, color: "#F59E0B" },
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

      {/* View Toggle & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("organigramme")} className={`px-4 py-2 text-sm font-medium ${viewMode === "organigramme" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <GitBranch className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode("liste")} className={`px-4 py-2 text-sm font-medium ${viewMode === "liste" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <List className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode("cartes")} className={`px-4 py-2 text-sm font-medium ${viewMode === "cartes" ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <Users className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucun membre</h3>
          <p className="text-gray-500 mt-1">Ajoutez des membres a l'organigramme</p>
        </div>
      ) : viewMode === "organigramme" ? (
        /* Organigramme View */
        <div className="space-y-4">
          {Object.entries(departmentTypes).map(([deptKey, deptConfig]) => {
            const members = groupedByDepartment[deptKey] || [];
            if (members.length === 0) return null;
            const isExpanded = expandedDepts.has(deptKey);

            return (
              <div key={deptKey} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Department Header */}
                <button
                  onClick={() => toggleDept(deptKey)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-10 rounded-full" style={{ backgroundColor: deptConfig.color }} />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{deptConfig.label}</h3>
                      <p className="text-sm text-gray-500">{members.length} membre(s)</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </button>

                {/* Members */}
                {isExpanded && (
                  <div className="px-5 pb-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => {
                      const roleInfo = roleConfig[member.role] || roleConfig.AUTRE;
                      const RoleIcon = roleInfo.icon;

                      return (
                        <div key={member.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            {/* Photo */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600">
                              {member.photo ? (
                                <Image src={member.photo} alt="" width={64} height={64} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${roleInfo.color}20` }}>
                                  <RoleIcon className="w-8 h-8" style={{ color: roleInfo.color }} />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                              <p className="text-sm font-medium" style={{ color: roleInfo.color }}>{roleInfo.label}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{member.title}</p>
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="mt-4 space-y-1.5">
                            {member.email && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone className="w-3 h-3" />
                                {member.phone}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-end gap-1">
                            <Link href={`/${provinceCode}/organisation/${member.id}`} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link href={`/${provinceCode}/organisation/${member.id}/modifier`} className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setShowDeleteModal(member)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : viewMode === "cartes" ? (
        /* Cards View */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const roleInfo = roleConfig[member.role] || roleConfig.AUTRE;
            const RoleIcon = roleInfo.icon;

            return (
              <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header with role color */}
                <div className="h-2" style={{ backgroundColor: roleInfo.color }} />

                <div className="p-5 text-center">
                  {/* Photo */}
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mb-4">
                    {member.photo ? (
                      <Image src={member.photo} alt="" width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${roleInfo.color}20` }}>
                        <RoleIcon className="w-12 h-12" style={{ color: roleInfo.color }} />
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: roleInfo.color }}>
                    {roleInfo.label}
                  </span>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{member.title}</p>

                  {/* Contact */}
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2">
                    <Link href={`/${provinceCode}/organisation/${member.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/${provinceCode}/organisation/${member.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setShowDeleteModal(member)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {filteredMembers.map((member) => {
            const roleInfo = roleConfig[member.role] || roleConfig.AUTRE;
            const RoleIcon = roleInfo.icon;

            return (
              <div key={member.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-4">
                {/* Photo */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600">
                  {member.photo ? (
                    <Image src={member.photo} alt="" width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${roleInfo.color}20` }}>
                      <RoleIcon className="w-6 h-6" style={{ color: roleInfo.color }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: roleInfo.color }}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{member.title}</p>
                </div>

                {/* Contact */}
                <div className="hidden md:block text-sm text-gray-500">
                  {member.email && <div>{member.email}</div>}
                  {member.phone && <div>{member.phone}</div>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link href={`/${provinceCode}/organisation/${member.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/${provinceCode}/organisation/${member.id}/modifier`} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setShowDeleteModal(member)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supprimer le membre</h3>
                <p className="text-sm text-gray-500">Cette action est irreversible</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Etes-vous sur de vouloir supprimer "<strong>{showDeleteModal.name}</strong>" de l'organigramme ?
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
