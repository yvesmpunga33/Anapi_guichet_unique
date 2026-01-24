"use client";

import { useState, useEffect } from "react";
import {
  X,
  Search,
  Loader2,
  Building2,
  User,
  Users,
  CheckCircle2,
  Hash,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

export default function InvestorSearchModal({
  isOpen,
  onClose,
  onSelect,
  title = "Rechercher un investisseur",
  description = "Selectionnez un investisseur existant dans la base de donnees"
}) {
  const [investorSearch, setInvestorSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allInvestors, setAllInvestors] = useState([]);
  const [loadingAllInvestors, setLoadingAllInvestors] = useState(false);

  // Charger tous les investisseurs quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && allInvestors.length === 0) {
      loadAllInvestors();
    }
  }, [isOpen]);

  // Réinitialiser la recherche quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setInvestorSearch("");
    }
  }, [isOpen]);

  // Fonction pour charger tous les investisseurs
  const loadAllInvestors = async () => {
    try {
      setLoadingAllInvestors(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/investors/search?q=&limit=100`, {
        headers,
      });
      const result = await response.json();
      setAllInvestors(result.investors || []);
      setSearchResults(result.investors || []);
    } catch (err) {
      console.error("Erreur chargement investisseurs:", err);
      setAllInvestors([]);
      setSearchResults([]);
    } finally {
      setLoadingAllInvestors(false);
    }
  };

  // Filtrer les investisseurs localement quand on tape
  useEffect(() => {
    if (!isOpen) return;

    if (!investorSearch || investorSearch.length === 0) {
      setSearchResults(allInvestors);
      return;
    }

    const query = investorSearch.toLowerCase();
    const filtered = allInvestors.filter(inv =>
      (inv.name && inv.name.toLowerCase().includes(query)) ||
      (inv.email && inv.email.toLowerCase().includes(query)) ||
      (inv.investorCode && inv.investorCode.toLowerCase().includes(query)) ||
      (inv.rccm && inv.rccm.toLowerCase().includes(query)) ||
      (inv.nif && inv.nif.toLowerCase().includes(query)) ||
      (inv.phone && inv.phone.includes(query))
    );
    setSearchResults(filtered);
  }, [investorSearch, allInvestors, isOpen]);

  const handleSelect = (investor) => {
    onSelect(investor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header du modal */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="relative">
            <input
              type="text"
              value={investorSearch}
              onChange={(e) => setInvestorSearch(e.target.value)}
              placeholder="Rechercher par nom, code, RCCM, email..."
              className="w-full px-4 py-3 pl-11 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            {loadingAllInvestors && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
            )}
          </div>
          {allInvestors.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {investorSearch ? `Filtrage parmi ${allInvestors.length} investisseurs...` : `${allInvestors.length} investisseurs disponibles`}
            </p>
          )}
        </div>

        {/* Liste des résultats */}
        <div className="flex-1 overflow-y-auto p-2">
          {loadingAllInvestors && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
              <p className="text-gray-400">Chargement des investisseurs...</p>
            </div>
          )}

          {!loadingAllInvestors && searchResults.length === 0 && investorSearch.length > 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium">Aucun investisseur trouve</p>
              <p className="text-sm text-gray-500 mt-1">Essayez avec d'autres termes de recherche</p>
            </div>
          )}

          {!loadingAllInvestors && searchResults.length === 0 && investorSearch.length === 0 && allInvestors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium">Aucun investisseur enregistre</p>
              <p className="text-sm text-gray-500 mt-1">Creez d'abord un investisseur dans le module Investissements</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((investor) => (
                <button
                  key={investor.id}
                  type="button"
                  onClick={() => handleSelect(investor)}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-blue-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      investor.type === 'company'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {investor.type === 'company' ? (
                        <Building2 className="w-6 h-6" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                          {investor.name}
                        </p>
                        {investor.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {investor.investorCode && (
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {investor.investorCode}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          investor.type === 'company'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {investor.type === 'company' ? 'Societe' : 'Individuel'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {investor.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3" />
                            {investor.email}
                          </span>
                        )}
                        {investor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {investor.phone}
                          </span>
                        )}
                      </div>
                      {(investor.rccm || investor.nif) && (
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                          {investor.rccm && <span>RCCM: {investor.rccm}</span>}
                          {investor.nif && <span>NIF: {investor.nif}</span>}
                        </div>
                      )}
                    </div>

                    {/* Indicateur de sélection */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer du modal */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {searchResults.length > 0
                ? `${searchResults.length} investisseur(s) trouve(s)`
                : 'Cliquez sur un investisseur pour le selectionner'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
