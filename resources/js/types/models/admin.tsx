export interface AdminAuth {
    admin: Admin;
}
export interface Admin {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface AdminSharedData {
    name: string;
    quote: { message: string; author: string };
    auth: AdminAuth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}
