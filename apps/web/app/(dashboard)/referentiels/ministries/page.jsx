"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  FileCheck,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";

const mockMinistries = [
  {
    id: "1",
    code: "MINPLAN",
    name: "Ministere du Plan",
    shortName: "Plan",
    minister: "Christian Mwando",
    address: "Boulevard du 30 Juin, Kinshasa",
    phone: "+243 81 234 5678",
    email: "contact@minplan.gouv.cd",
    website: "www.minplan.gouv.cd",
    competences: ["Planification economique", "Coordination des investissements", "Statistiques nationales"],
    approvalsCount: 156,
    pendingApprovals: 23,
    avgProcessingDays: 15,
    isActive: true,
  },
  {
    id: "2",
    code: "MINECOM",
    name: "Ministere de l'Economie Nationale",
    shortName: "Economie",
    minister: "Vital Kamerhe",
    address: "Avenue des 3Z, Kinshasa",
    phone: "+243 81 345 6789",
    email: "contact@minecom.gouv.cd",
    website: "www.economie.gouv.cd",
    competences: ["Politique economique", "Commerce interieur", "Prix et approvisionnement"],
    approvalsCount: 89,
    pendingApprovals: 12,
    avgProcessingDays: 10,
    isActive: true,
  },
  {
    id: "3",
    code: "MINMINES",
    name: "Ministere des Mines",
    shortName: "Mines",
    minister: "Antoinette N'Samba",
    address: "Avenue Kasai, Kinshasa",
    phone: "+243 81 456 7890",
    email: "contact@minmines.gouv.cd",
    website: "www.mines.gouv.cd",
    competences: ["Permis miniers", "Regulations minieres", "Cadastre minier"],
    approvalsCount: 234,
    pendingApprovals: 45,
    avgProcessingDays: 30,
    isActive: true,
  },
  {
    id: "4",
    code: "MININD",
    name: "Ministere de l'Industrie",
    shortName: "Industrie",
    minister: "Julien Paluku",
    address: "Boulevard Triomphal, Kinshasa",
    phone: "+243 81 567 8901",
    email: "contact@minind.gouv.cd",
    competences: ["Developpement industriel", "Licences industrielles", "Zones franches"],
    approvalsCount: 67,
    pendingApprovals: 8,
    avgProcessingDays: 12,
    isActive: true,
  },
  {
    id: "5",
    code: "MINCOM",
    name: "Ministere du Commerce Exterieur",
    shortName: "Commerce Ext.",
    minister: "Jean-Lucien Bussa",
    address: "Avenue de la Paix, Kinshasa",
    phone: "+243 81 678 9012",
    email: "contact@mincom.gouv.cd",
    competences: ["Licences d'importation", "Exportation", "Accords commerciaux"],
    approvalsCount: 312,
    pendingApprovals: 56,
    avgProcessingDays: 7,
    isActive: true,
  },
  {
    id: "6",
    code: "MINFINANCES",
    name: "Ministere des Finances",
    shortName: "Finances",
    minister: "Nicolas Kazadi",
    address: "Boulevard du 30 Juin, Kinshasa",
    phone: "+243 81 789 0123",
    email: "contact@minfinances.gouv.cd",
    website: "www.finances.gouv.cd",
    competences: ["Exonerations fiscales", "Conventions d'etablissement", "Douanes"],
    approvalsCount: 178,
    pendingApprovals: 34,
    avgProcessingDays: 20,
    isActive: true,
  },
  {
    id: "7",
    code: "MINAT",
    name: "Ministere de l'Amenagement du Territoire",
    shortName: "Amenagement",
    minister: "Guy Loando",
    address: "Avenue Lukusa, Kinshasa",
    phone: "+243 81 890 1234",
    email: "contact@minat.gouv.cd",
    competences: ["Permis de construction", "Urbanisme", "Cadastre foncier"],
    approvalsCount: 145,
    pendingApprovals: 28,
    avgProcessingDays: 25,
    isActive: true,
  },
  {
    id: "8",
    code: "MINENVIR",
    name: "Ministere de l'Environnement",
    shortName: "Environnement",
    minister: "Eve Bazaiba",
    address: "Avenue des Cliniques, Kinshasa",
    phone: "+243 81 901 2345",
    email: "contact@minenvir.gouv.cd",
    competences: ["Etudes d'impact environnemental", "Permis environnementaux", "Protection des forets"],
    approvalsCount: 98,
    pendingApprovals: 19,
    avgProcessingDays: 35,
    isActive: true,
  },
];

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState(mockMinistries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  const filteredMinistries = ministries.filter((ministry) =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: ministries.length,
    totalApprovals: ministries.reduce((sum, m) => sum + m.approvalsCount, 0),
    pendingApprovals: ministries.reduce((sum, m) => sum + m.pendingApprovals, 0),
    avgDays: Math.round(ministries.reduce((sum, m) => sum + m.avgProcessingDays, 0) / ministries.length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ministeres
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Ministeres partenaires pour les autorisations
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter Ministere
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ministeres</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Approbations</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.totalApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Delai Moyen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.avgDays} jours</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un ministere..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMinistries.map((ministry) => (
          <div
            key={ministry.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {ministry.shortName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ministry.code}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                {ministry.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Ministre: {ministry.minister}
              </p>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{ministry.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{ministry.phone}</span>
                </div>
                {ministry.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{ministry.website}</span>
                  </div>
                )}
              </div>

              {/* Competences */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Competences:</p>
                <div className="flex flex-wrap gap-1">
                  {ministry.competences.map((comp, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{ministry.approvalsCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Approbations</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{ministry.pendingApprovals}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">En attente</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{ministry.avgProcessingDays}j</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Delai moy.</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMinistries.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun ministere trouve</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Affichage de <span className="font-medium">{filteredMinistries.length}</span> ministeres
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
          <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
