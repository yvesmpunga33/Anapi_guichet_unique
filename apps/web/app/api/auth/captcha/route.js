import { NextResponse } from 'next/server';
import {
  getClientIP,
  isCaptchaRequired,
  generateCaptcha,
  verifyCaptcha,
  getAttemptCount,
} from '../../../lib/rate-limit.js';

// GET - Vérifier si CAPTCHA est requis et en générer un si nécessaire
export async function GET(request) {
  const ip = getClientIP(request);
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  const required = isCaptchaRequired(ip, email);
  const attempts = Math.max(
    getAttemptCount(ip, 'login'),
    email ? getAttemptCount(`email:${email}`, 'login') : 0
  );

  if (required) {
    const captcha = generateCaptcha(ip);
    return NextResponse.json({
      required: true,
      captchaId: captcha.id,
      question: captcha.question,
      attempts,
      message: 'Veuillez résoudre le CAPTCHA pour continuer',
    });
  }

  return NextResponse.json({
    required: false,
    attempts,
  });
}

// POST - Vérifier la réponse CAPTCHA
export async function POST(request) {
  try {
    const body = await request.json();
    const { captchaId, answer } = body;

    if (!captchaId || answer === undefined) {
      return NextResponse.json(
        { error: 'ID CAPTCHA et réponse requis' },
        { status: 400 }
      );
    }

    const result = verifyCaptcha(captchaId, answer);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        message: 'CAPTCHA validé',
      });
    }

    // Générer un nouveau CAPTCHA si la réponse est incorrecte
    const ip = getClientIP(request);
    const newCaptcha = generateCaptcha(ip);

    return NextResponse.json(
      {
        valid: false,
        error: result.error,
        newCaptchaId: newCaptcha.id,
        newQuestion: newCaptcha.question,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Captcha verification error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
