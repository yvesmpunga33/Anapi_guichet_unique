// Rate Limiting pour protection contre les attaques par force brute
// Stockage en mémoire (pour production, utiliser Redis)

const rateLimitStore = new Map();
const captchaStore = new Map(); // Stockage des CAPTCHAs générés

// Configuration par type d'action
const RATE_LIMITS = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 tentatives par fenêtre
    blockDuration: 30 * 60 * 1000, // Bloquer 30 minutes après dépassement
    captchaThreshold: 3, // Afficher CAPTCHA après 3 tentatives
  },
  register: {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxAttempts: 3, // 3 inscriptions par heure par IP
    blockDuration: 60 * 60 * 1000, // Bloquer 1 heure
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100, // 100 requêtes par minute
    blockDuration: 5 * 60 * 1000, // Bloquer 5 minutes
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 heure
    maxAttempts: 3, // 3 demandes par heure
    blockDuration: 60 * 60 * 1000, // Bloquer 1 heure
  },
};

// Nettoyer les entrées expirées périodiquement
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now && !data.blocked) {
      rateLimitStore.delete(key);
    }
    if (data.blockedUntil && data.blockedUntil < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Nettoyer toutes les minutes

/**
 * Obtenir l'IP du client depuis la requête
 */
export function getClientIP(request) {
  // Headers standards pour les proxys
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

/**
 * Vérifier et appliquer le rate limiting
 * @param {string} identifier - IP ou identifiant unique (email pour login)
 * @param {string} action - Type d'action (login, register, api, passwordReset)
 * @returns {object} { allowed: boolean, remaining: number, resetTime: number, retryAfter?: number }
 */
export function checkRateLimit(identifier, action = 'api') {
  const config = RATE_LIMITS[action] || RATE_LIMITS.api;
  const key = `${action}:${identifier}`;
  const now = Date.now();

  let data = rateLimitStore.get(key);

  // Vérifier si bloqué
  if (data?.blockedUntil) {
    if (now < data.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: data.blockedUntil,
        retryAfter: Math.ceil((data.blockedUntil - now) / 1000),
        blocked: true,
      };
    }
    // Débloquer si le temps est écoulé
    rateLimitStore.delete(key);
    data = null;
  }

  // Nouvelle fenêtre ou fenêtre expirée
  if (!data || data.resetTime < now) {
    data = {
      attempts: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, data);

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: data.resetTime,
    };
  }

  // Incrémenter les tentatives
  data.attempts += 1;

  // Vérifier si limite dépassée
  if (data.attempts > config.maxAttempts) {
    data.blockedUntil = now + config.blockDuration;
    rateLimitStore.set(key, data);

    return {
      allowed: false,
      remaining: 0,
      resetTime: data.blockedUntil,
      retryAfter: Math.ceil(config.blockDuration / 1000),
      blocked: true,
    };
  }

  rateLimitStore.set(key, data);

  return {
    allowed: true,
    remaining: config.maxAttempts - data.attempts,
    resetTime: data.resetTime,
  };
}

/**
 * Réinitialiser le rate limit pour un identifiant (après login réussi par exemple)
 */
export function resetRateLimit(identifier, action = 'api') {
  const key = `${action}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Enregistrer une tentative échouée (pour les logins)
 * Combine IP + email pour une protection plus fine
 */
export function recordFailedAttempt(ip, email) {
  // Rate limit par IP
  checkRateLimit(ip, 'login');

  // Rate limit par email (protège contre attaque distribuée sur un compte)
  if (email) {
    checkRateLimit(`email:${email}`, 'login');
  }
}

/**
 * Vérifier si un login est autorisé (vérifie IP ET email)
 */
export function canAttemptLogin(ip, email) {
  const ipCheck = checkRateLimit(ip, 'login');

  if (!ipCheck.allowed) {
    return {
      allowed: false,
      reason: 'ip_blocked',
      retryAfter: ipCheck.retryAfter,
      message: `Trop de tentatives. Réessayez dans ${Math.ceil(ipCheck.retryAfter / 60)} minutes.`,
    };
  }

  if (email) {
    const emailCheck = checkRateLimit(`email:${email}`, 'login');
    if (!emailCheck.allowed) {
      return {
        allowed: false,
        reason: 'account_blocked',
        retryAfter: emailCheck.retryAfter,
        message: `Ce compte est temporairement verrouillé. Réessayez dans ${Math.ceil(emailCheck.retryAfter / 60)} minutes.`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Middleware helper pour les API routes
 */
export function withRateLimit(handler, action = 'api') {
  return async (request, context) => {
    const ip = getClientIP(request);
    const result = checkRateLimit(ip, action);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Trop de requêtes',
          message: `Limite de requêtes dépassée. Réessayez dans ${result.retryAfter} secondes.`,
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      );
    }

    // Ajouter les headers de rate limit à la réponse
    const response = await handler(request, context);

    // Cloner la réponse pour ajouter les headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-RateLimit-Remaining', String(result.remaining));
    newHeaders.set('X-RateLimit-Reset', String(result.resetTime));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

/**
 * Obtenir le nombre de tentatives pour un identifiant
 */
export function getAttemptCount(identifier, action = 'login') {
  const key = `${action}:${identifier}`;
  const data = rateLimitStore.get(key);
  return data?.attempts || 0;
}

/**
 * Vérifier si le CAPTCHA est requis
 */
export function isCaptchaRequired(ip, email) {
  const ipAttempts = getAttemptCount(ip, 'login');
  const emailAttempts = email ? getAttemptCount(`email:${email}`, 'login') : 0;
  const maxAttempts = Math.max(ipAttempts, emailAttempts);
  return maxAttempts >= RATE_LIMITS.login.captchaThreshold;
}

/**
 * Générer un CAPTCHA simple (opération mathématique)
 */
export function generateCaptcha(identifier) {
  const operations = ['+', '-', 'x'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1, num2, answer;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
      break;
    case 'x':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
  }

  const captchaId = `${identifier}_${Date.now()}`;
  const question = `${num1} ${operation} ${num2} = ?`;

  // Stocker la réponse (expire après 5 minutes)
  captchaStore.set(captchaId, {
    answer: String(answer),
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  // Nettoyer les anciens CAPTCHAs pour cet identifiant
  for (const [key] of captchaStore.entries()) {
    if (key.startsWith(`${identifier}_`) && key !== captchaId) {
      captchaStore.delete(key);
    }
  }

  return {
    id: captchaId,
    question,
  };
}

/**
 * Vérifier la réponse CAPTCHA
 */
export function verifyCaptcha(captchaId, userAnswer) {
  const captcha = captchaStore.get(captchaId);

  if (!captcha) {
    return { valid: false, error: 'CAPTCHA expiré ou invalide' };
  }

  if (Date.now() > captcha.expiresAt) {
    captchaStore.delete(captchaId);
    return { valid: false, error: 'CAPTCHA expiré' };
  }

  const isValid = String(userAnswer).trim() === captcha.answer;

  if (isValid) {
    captchaStore.delete(captchaId);
  }

  return {
    valid: isValid,
    error: isValid ? null : 'Réponse incorrecte'
  };
}

// Nettoyer les CAPTCHAs expirés périodiquement
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of captchaStore.entries()) {
    if (data.expiresAt < now) {
      captchaStore.delete(key);
    }
  }
}, 60 * 1000);

export default {
  checkRateLimit,
  resetRateLimit,
  recordFailedAttempt,
  canAttemptLogin,
  getClientIP,
  withRateLimit,
  getAttemptCount,
  isCaptchaRequired,
  generateCaptcha,
  verifyCaptcha,
  RATE_LIMITS,
};
