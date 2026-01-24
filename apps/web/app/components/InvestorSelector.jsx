"use client";

import { useState } from "react";
import { Search, UserCheck, X } from "lucide-react";
import InvestorSearchModal from "./modals/InvestorSearchModal";

export default function InvestorSelector({
  selectedInvestor,
  onSelect,
  onClear,
  label = "Investisseur existant",
  description = "Selectionnez un investisseur existant ou remplissez le formulaire ci-dessous pour en creer un nouveau.",
  required = false,
  error = null,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={`p-4 bg-blue-500/10 border rounded-xl ${error ? 'border-red-500/50' : 'border-blue-500/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              {label}
              {required && <span className="text-orange-500 ml-1">*</span>}
            </span>
          </div>
          {!selectedInvestor && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          )}
        </div>

        {selectedInvestor && (
          <div className="flex items-center justify-between mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">{selectedInvestor.name}</p>
                <p className="text-xs text-gray-400">
                  {selectedInvestor.investorCode && `${selectedInvestor.investorCode} • `}
                  {selectedInvestor.type === 'company' ? 'Societe' : 'Individuel'}
                  {selectedInvestor.email && ` • ${selectedInvestor.email}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Changer d'investisseur"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClear}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Retirer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!selectedInvestor && description && (
          <p className="text-xs text-gray-500 mt-3">
            {description}
          </p>
        )}

        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}
      </div>

      <InvestorSearchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={onSelect}
      />
    </>
  );
}
