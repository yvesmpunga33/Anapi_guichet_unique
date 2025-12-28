"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";

interface Employee {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: { id: string; name: string } | null;
  position: { id: string; title: string } | null;
  grade: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  status: string;
  hireDate: string;
  baseSalary: number;
  currency: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hr/employees");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: currency || "CDF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      ON_LEAVE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      TERMINATED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status] || styles.INACTIVE;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Employés
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {employees.length} employé{employees.length > 1 ? "s" : ""} au total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEmployees}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            title="Actualiser"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
            <Upload className="w-5 h-5" />
          </button>
          <Link
            href="/hr/employees/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, matricule ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
              <option value="ON_LEAVE">En congé</option>
              <option value="TERMINATED">Terminé</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">Aucun employé trouvé</p>
            <p className="text-sm mt-1">
              {searchTerm || statusFilter !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par ajouter un nouvel employé"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date d'embauche
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Salaire
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {employee.firstName.charAt(0)}
                          {employee.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.matricule} • {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {employee.department?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {employee.position?.title || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {formatDate(employee.hireDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {formatCurrency(employee.baseSalary, employee.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          employee.status
                        )}`}
                      >
                        {employee.status === "ACTIVE" && "Actif"}
                        {employee.status === "INACTIVE" && "Inactif"}
                        {employee.status === "ON_LEAVE" && "En congé"}
                        {employee.status === "TERMINATED" && "Terminé"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/hr/employees/${employee.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/30"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/hr/employees/${employee.id}/edit`}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors dark:hover:bg-amber-900/30"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
