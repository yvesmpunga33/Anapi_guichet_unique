"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthCaptchaStatus, AuthCaptchaVerify } from "@/app/services/admin/Auth.service";

export default function Captcha({ email, onVerified, onCaptchaRequired }) {
  const [captchaState, setCaptchaState] = useState({
    required: false,
    captchaId: null,
    question: null,
    loading: true,
    error: null,
    verified: false,
  });
  const [answer, setAnswer] = useState("");

  // Vérifier si CAPTCHA est requis
  const checkCaptcha = useCallback(async () => {
    try {
      const response = await AuthCaptchaStatus(email);
      const data = response.data;

      setCaptchaState((prev) => ({
        ...prev,
        required: data?.required,
        captchaId: data?.captchaId || null,
        question: data?.question || null,
        loading: false,
        verified: false,
      }));

      if (onCaptchaRequired) {
        onCaptchaRequired(data?.required);
      }
    } catch {
      setCaptchaState((prev) => ({
        ...prev,
        loading: false,
        error: "Erreur de vérification",
      }));
    }
  }, [email, onCaptchaRequired]);

  useEffect(() => {
    checkCaptcha();
  }, [checkCaptcha]);

  // Vérifier la réponse CAPTCHA
  const verifyCaptcha = async (e) => {
    e?.preventDefault();

    if (!answer.trim()) {
      setCaptchaState((prev) => ({
        ...prev,
        error: "Veuillez entrer votre réponse",
      }));
      return;
    }

    setCaptchaState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await AuthCaptchaVerify(captchaState.captchaId, answer.trim());
      const data = response.data;

      if (data?.valid) {
        setCaptchaState((prev) => ({
          ...prev,
          verified: true,
          loading: false,
          error: null,
        }));
        if (onVerified) {
          onVerified(true);
        }
      } else {
        // Nouveau CAPTCHA généré
        setCaptchaState((prev) => ({
          ...prev,
          captchaId: data?.newCaptchaId,
          question: data?.newQuestion,
          loading: false,
          error: data?.error || "Réponse incorrecte",
          verified: false,
        }));
        setAnswer("");
        if (onVerified) {
          onVerified(false);
        }
      }
    } catch {
      setCaptchaState((prev) => ({
        ...prev,
        loading: false,
        error: "Erreur de vérification",
      }));
    }
  };

  // Rafraîchir le CAPTCHA
  const refreshCaptcha = async () => {
    setAnswer("");
    setCaptchaState((prev) => ({ ...prev, loading: true, error: null }));
    await checkCaptcha();
  };

  // Si pas requis ou déjà vérifié
  if (!captchaState.required || captchaState.verified) {
    return null;
  }

  // Loading initial
  if (captchaState.loading && !captchaState.question) {
    return (
      <div className="flex items-center justify-center py-4">
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-amber-700">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="font-medium text-sm">
          Verification de securite requise
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-md p-3 border border-amber-200">
        <p className="text-sm text-gray-600 mb-2">Resolvez ce calcul:</p>
        <p className="text-2xl font-bold text-gray-900 text-center py-2">
          {captchaState.question}
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verifyCaptcha(e)}
          placeholder="Votre reponse"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          disabled={captchaState.loading}
        />
        <button
          type="button"
          onClick={verifyCaptcha}
          disabled={captchaState.loading || !answer.trim()}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {captchaState.loading ? (
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            "Verifier"
          )}
        </button>
      </div>

      {/* Error */}
      {captchaState.error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {captchaState.error}
        </p>
      )}

      {/* Refresh */}
      <button
        type="button"
        onClick={refreshCaptcha}
        disabled={captchaState.loading}
        className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Nouveau calcul
      </button>
    </div>
  );
}
