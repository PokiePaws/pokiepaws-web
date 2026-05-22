export const AUTH_ACCESS_TOKEN_COOKIE = 'pokiepaws_access_token';
export const AUTH_REFRESH_TOKEN_COOKIE = 'pokiepaws_refresh_token';
export const AUTH_USER_EMAIL_COOKIE = 'pokiepaws_user_email';
export const AUTH_USER_ROLE_COOKIE = 'pokiepaws_user_role';
export const AUTH_MFA_PENDING_EMAIL_COOKIE = 'pokiepaws_mfa_pending_email';
export const AUTH_MFA_COMPLETED_COOKIE = 'pokiepaws_mfa_completed';

export const authCookieOptions = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
};
