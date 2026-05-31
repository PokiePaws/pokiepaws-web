export type ApiRole = 'ADMIN' | 'VET' | 'OWNER' | 'WAREHOUSE' | 'GUEST';
export type UserRole = 'Staff' | 'Admin' | 'SuperAdmin' | 'Client';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    apiRole?: ApiRole;
}

export interface BackendLoginResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    role: ApiRole;
}

export interface BackendMfaRequiredResponse {
    mfaRequired: true;
    email?: string;
    message?: string;
}

export interface AuthSession {
    user: User;
}

export interface MfaPendingSession {
    mfaRequired: true;
    email: string;
    message?: string;
}

export type LoginResult = AuthSession | MfaPendingSession;

export function isMfaPendingSession(session: LoginResult): session is MfaPendingSession {
    return 'mfaRequired' in session && session.mfaRequired;
}

export function mapApiRole(role: ApiRole): UserRole {
    switch (role) {
        case 'ADMIN':
            return 'Admin';
        case 'VET':
        case 'WAREHOUSE':
            return 'Staff';
        case 'OWNER':
        case 'GUEST':
        default:
            return 'Client';
    }
}

export function getRedirectPath(role: UserRole) {
    if (role === 'Admin' || role === 'SuperAdmin') return '/admin';
    if (role === 'Staff') return '/staff';
    return '/dashboard';
}
