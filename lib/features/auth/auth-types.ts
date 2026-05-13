export type ApiRole = 'ADMIN' | 'VET' | 'OWNER' | 'WAREHOUSE' | 'GUEST';
export type UserRole = 'Staff' | 'Admin' | 'SuperAdmin' | 'Client';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface BackendLoginResponse {
    token: string;
    email: string;
    role: ApiRole;
}

export interface AuthSession {
    user: User;
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
