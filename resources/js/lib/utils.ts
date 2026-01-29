import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}
export function formatNumber(n?: number | null) {
    return typeof n === 'number' ? n : 0;
}
export function formatBoolean(value: number): boolean {
    return value === 1;
}
export function formatBooleanText(value: boolean): string {
    return value ? 'Oui' : 'Non';
}

export function formatHours(hours?: number | null) {
    if (!hours) return '0 h';
    return `${hours} h`;
}

export function formatMinutes(minutes?: number | null) {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatDate(date?: string | null) {
    if (!date) return '-';
    try {
        return new Date(date).toLocaleString();
    } catch {
        return date as string;
    }
}

export const formatCompleteDate = (dateString: string) => {
    if (!dateString) {
        return '-';
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export function sizeFromFormatBytes(bytes?: number | null) {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
