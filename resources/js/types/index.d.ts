import { AccountRole } from '@/lib/type';
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

export interface Auth {
    user: User;
}
export interface FlashData {
    message: string;
    success: string;
    uploadStatus: string;
    error: string;
}

export interface User {
    id: number;
    username: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    account_role: AccountRole;
    [key: string]: unknown; // This allows for additional properties...
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | IconType | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    [key: string]: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
