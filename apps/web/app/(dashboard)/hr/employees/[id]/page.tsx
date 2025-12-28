"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Users,
  CreditCard,
  FileText,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Heart,
  Baby,
  Shield,
} from "lucide-react";

// Tab types
type TabId = "personal" | "family" | "bank" | "documents" | "professional" | "emergency";

interface TabItem {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  { id: "personal", name: "Informations Personnelles", icon: User },
  { id: "family", name: "Agregat Familial", icon: Users },
  { id: "bank", name: "Comptes Bancaires", icon: CreditCard },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "professional", name: "Infos Professionnelles", icon: Briefcase },
  { id: "emergency", name: "Contacts d'Urgence", icon: Phone },
];

interface Employee {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string;
  photoUrl: string | null;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  provinceOfOrigin: string | null;
  nationality: string;
  maritalStatus: string;
  marriageDate: string | null;
  numberOfChildren: number;
  dependentsCount: number;
  addressLine1: string | null;
  neighborhood: string | null;
  commune: string | null;
  city: string | null;
  province: string | null;
  country: string;
  phonePrimary: string | null;
  phoneSecondary: string | null;
  personalEmail: string | null;
  workEmail: string;
  nationalIdNumber: string | null;
  passportNumber: string | null;
  socialSecurityNumber: string | null;
  department: { id: string; name: string } | null;
  position: { id: string; title: string } | null;
  grade: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  hireDate: string;
  contractType: string;
  baseSalary: number;
  currency: string;
  status: string;
  spouse?: {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    gender: string;
    dateOfBirth: string | null;
    phone: string | null;
    profession: string | null;
    employer: string | null;
    isBeneficiary: boolean;
  } | null;
  children?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    gender: string;
    dateOfBirth: string;
    relationshipType: string;
    isStudent: boolean;
    schoolName: string | null;
    isBeneficiary: boolean;
    receivesAllowance: boolean;
    allowanceAmount: number | null;
  }>;
  bankAccounts?: Array<{
    id: string;
    accountType: string;
    bankName: string;
    accountNumber: string;
    iban: string | null;
    swiftCode: string | null;
    accountHolderName: string;
    currency: string;
    isDefault: boolean;
    isActive: boolean;
  }>;
  identityDocuments?: Array<{
    id: string;
    documentType: string;
    documentNumber: string;
    issueDate: string | null;
    expiryDate: string | null;
    isVerified: boolean;
  }>;
  emergencyContacts?: Array<{
    id: string;
    fullName: string;
    relationship: string;
    phone: string;
    email: string | null;
    isPrimary: boolean;
  }>;
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEmployee(params.id as string);
    }
  }, [params.id]);

  const fetchEmployee = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hr/employees/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data.employee);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: currency || "CDF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "-";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ans`;
  };

  const getMaritalStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      single: "Celibataire",
      married: "Marie(e)",
      divorced: "Divorce(e)",
      widowed: "Veuf/Veuve",
      separated: "Separe(e)",
      civil_union: "Union libre",
    };
    return labels[status] || status;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Employe non trouve
        </p>
        <Link
          href="/hr/employees"
          className="mt-4 text-blue-600 hover:underline"
        >
          Retour a la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/hr/employees"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {employee.firstName.charAt(0)}
              {employee.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {employee.firstName} {employee.middleName || ""} {employee.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {employee.matricule} - {employee.position?.title || "Poste non defini"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusBadge(employee.status)}`}>
            {employee.status === "ACTIVE" && "Actif"}
            {employee.status === "INACTIVE" && "Inactif"}
            {employee.status === "ON_LEAVE" && "En conge"}
            {employee.status === "TERMINATED" && "Termine"}
          </span>
          <Link
            href={`/hr/employees/${employee.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Identity Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Identite
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Nom" value={employee.lastName} />
                  <InfoItem label="Post-nom" value={employee.middleName} />
                  <InfoItem label="Prenom" value={employee.firstName} />
                  <InfoItem label="Sexe" value={employee.gender === "M" ? "Masculin" : employee.gender === "F" ? "Feminin" : "Autre"} />
                  <InfoItem label="Date de naissance" value={formatDate(employee.dateOfBirth)} />
                  <InfoItem label="Age" value={calculateAge(employee.dateOfBirth)} />
                  <InfoItem label="Lieu de naissance" value={employee.placeOfBirth} />
                  <InfoItem label="Province d'origine" value={employee.provinceOfOrigin} />
                  <InfoItem label="Nationalite" value={employee.nationality} />
                </div>
              </div>

              {/* Marital Status Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Etat Civil
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Etat civil" value={getMaritalStatusLabel(employee.maritalStatus)} />
                  <InfoItem label="Date de mariage" value={formatDate(employee.marriageDate)} />
                  <InfoItem label="Nombre d'enfants" value={String(employee.numberOfChildren)} />
                  <InfoItem label="Personnes a charge" value={String(employee.dependentsCount)} />
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Coordonnees
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Adresse" value={employee.addressLine1} />
                  <InfoItem label="Quartier" value={employee.neighborhood} />
                  <InfoItem label="Commune" value={employee.commune} />
                  <InfoItem label="Ville" value={employee.city} />
                  <InfoItem label="Province" value={employee.province} />
                  <InfoItem label="Pays" value={employee.country} />
                  <InfoItem label="Telephone principal" value={employee.phonePrimary} icon={<Phone className="w-4 h-4" />} />
                  <InfoItem label="Telephone secondaire" value={employee.phoneSecondary} icon={<Phone className="w-4 h-4" />} />
                  <InfoItem label="Email personnel" value={employee.personalEmail} icon={<Mail className="w-4 h-4" />} />
                  <InfoItem label="Email professionnel" value={employee.workEmail} icon={<Mail className="w-4 h-4" />} />
                </div>
              </div>

              {/* Identity Documents Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Documents d'Identite
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="N Carte d'identite" value={employee.nationalIdNumber} />
                  <InfoItem label="N Passeport" value={employee.passportNumber} />
                  <InfoItem label="N INSS (Securite sociale)" value={employee.socialSecurityNumber} />
                </div>
              </div>
            </div>
          )}

          {/* Family Tab */}
          {activeTab === "family" && (
            <div className="space-y-6">
              {/* Spouse Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    Conjoint(e)
                  </h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                {employee.spouse ? (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoItem label="Nom complet" value={`${employee.spouse.firstName} ${employee.spouse.middleName || ""} ${employee.spouse.lastName}`} />
                      <InfoItem label="Sexe" value={employee.spouse.gender === "M" ? "Masculin" : "Feminin"} />
                      <InfoItem label="Date de naissance" value={formatDate(employee.spouse.dateOfBirth)} />
                      <InfoItem label="Telephone" value={employee.spouse.phone} />
                      <InfoItem label="Profession" value={employee.spouse.profession} />
                      <InfoItem label="Employeur" value={employee.spouse.employer} />
                      <InfoItem label="Beneficiaire assurance" value={employee.spouse.isBeneficiary ? "Oui" : "Non"} />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Aucun conjoint enregistre</p>
                )}
              </div>

              {/* Children Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Baby className="w-5 h-5 text-blue-600" />
                    Enfants ({employee.children?.length || 0})
                  </h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                {employee.children && employee.children.length > 0 ? (
                  <div className="space-y-4">
                    {employee.children.map((child, index) => (
                      <div key={child.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Enfant {index + 1}: {child.firstName} {child.lastName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <InfoItem label="Sexe" value={child.gender === "M" ? "Masculin" : "Feminin"} />
                          <InfoItem label="Date de naissance" value={formatDate(child.dateOfBirth)} />
                          <InfoItem label="Age" value={calculateAge(child.dateOfBirth)} />
                          <InfoItem label="Lien" value={child.relationshipType} />
                          <InfoItem label="Scolarise" value={child.isStudent ? "Oui" : "Non"} />
                          <InfoItem label="Ecole" value={child.schoolName} />
                          <InfoItem label="Beneficiaire assurance" value={child.isBeneficiary ? "Oui" : "Non"} />
                          <InfoItem label="Allocation" value={child.receivesAllowance ? formatCurrency(child.allowanceAmount || 0, "CDF") : "Non"} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Aucun enfant enregistre</p>
                )}
              </div>
            </div>
          )}

          {/* Bank Accounts Tab */}
          {activeTab === "bank" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Comptes Bancaires
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {employee.bankAccounts && employee.bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {employee.bankAccounts.map((account) => (
                    <div key={account.id} className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 ${account.isDefault ? "border-green-500" : "border-transparent"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">{account.bankName}</h4>
                          {account.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                              Par defaut
                            </span>
                          )}
                          {!account.isActive && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">
                              Inactif
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoItem label="Type" value={account.accountType === "bank" ? "Compte bancaire" : "Mobile Money"} />
                        <InfoItem label="N Compte" value={account.accountNumber} />
                        <InfoItem label="IBAN" value={account.iban} />
                        <InfoItem label="SWIFT/BIC" value={account.swiftCode} />
                        <InfoItem label="Titulaire" value={account.accountHolderName} />
                        <InfoItem label="Devise" value={account.currency} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Aucun compte bancaire enregistre</p>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Documents d'Identite
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {employee.identityDocuments && employee.identityDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Numero</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Delivre le</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Expire le</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Statut</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {employee.identityDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{doc.documentType}</td>
                          <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-300">{doc.documentNumber}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(doc.issueDate)}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(doc.expiryDate)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.isVerified ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                              {doc.isVerified ? "Verifie" : "Non verifie"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                <FileText className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Aucun document enregistre</p>
              )}
            </div>
          )}

          {/* Professional Info Tab */}
          {activeTab === "professional" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Affectation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Departement" value={employee.department?.name} />
                  <InfoItem label="Poste" value={employee.position?.title} />
                  <InfoItem label="Grade" value={employee.grade?.name} />
                  <InfoItem label="Categorie" value={employee.category?.name} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Contrat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Type de contrat" value={employee.contractType} />
                  <InfoItem label="Date d'embauche" value={formatDate(employee.hireDate)} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  Remuneration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Salaire de base" value={formatCurrency(employee.baseSalary, employee.currency)} />
                  <InfoItem label="Devise" value={employee.currency} />
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === "emergency" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  Contacts d'Urgence
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {employee.emergencyContacts && employee.emergencyContacts.length > 0 ? (
                <div className="space-y-4">
                  {employee.emergencyContacts.map((contact) => (
                    <div key={contact.id} className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 ${contact.isPrimary ? "border-red-500" : "border-transparent"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">{contact.fullName}</h4>
                          {contact.isPrimary && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900/30 dark:text-red-400">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoItem label="Relation" value={contact.relationship} />
                        <InfoItem label="Telephone" value={contact.phone} icon={<Phone className="w-4 h-4" />} />
                        <InfoItem label="Email" value={contact.email} icon={<Mail className="w-4 h-4" />} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Aucun contact d'urgence enregistre</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Info Item Component
function InfoItem({ label, value, icon }: { label: string; value: string | null | undefined; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center gap-2">
        {icon}
        {value || "-"}
      </dd>
    </div>
  );
}
