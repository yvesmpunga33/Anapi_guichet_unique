import http from '../../http-common';

// ============ CAPTCHA ============
export const CaptchaGet = () => {
  return http.get('/auth/captcha');
};

export const CaptchaVerify = (captchaId, answer) => {
  return http.post('/auth/captcha/verify', { captchaId, answer });
};

export const CaptchaRefresh = (captchaId) => {
  return http.post('/auth/captcha/refresh', { captchaId });
};
