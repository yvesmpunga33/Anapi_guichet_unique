"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, TrendingUp, FileText, Clock } from "lucide-react";

interface DashboardStats {
  summary: {
    totalInvestors: number;
    activeInvestors: number;
    investorGrowth: number;
    totalInvestments: number;
    investmentGrowth: number;
    totalAmount: number;
    amountGrowth: number;
    totalJobs: number;
    pendingApprovals: number;
    approvedThisMonth: number;
  };
  documents: Record<string, number>;
  recentInvestments: Array<{
    id: string;
    projectCode: string;
    name: string;
    amount: number;
    status: string;
    investor: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue sur le système de gestion ANAPI</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Investisseurs
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.summary.totalInvestors || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.summary.activeInvestors || 0} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Investissements
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.summary.totalInvestments || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(stats?.summary.totalAmount || 0)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Emplois à créer
            </CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.summary.totalJobs || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Emplois prévus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En attente
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.summary.pendingApprovals || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.summary.approvedThisMonth || 0} approuvés ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent investments */}
      <Card>
        <CardHeader>
          <CardTitle>Investissements récents</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentInvestments && stats.recentInvestments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-600">Code</th>
                    <th className="pb-3 font-medium text-gray-600">Projet</th>
                    <th className="pb-3 font-medium text-gray-600">Investisseur</th>
                    <th className="pb-3 font-medium text-gray-600">Montant</th>
                    <th className="pb-3 font-medium text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInvestments.map((investment) => (
                    <tr key={investment.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{investment.projectCode}</td>
                      <td className="py-3 text-sm">{investment.name}</td>
                      <td className="py-3 text-sm">{investment.investor}</td>
                      <td className="py-3 text-sm">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            investment.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : investment.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {investment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucun investissement récent
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
