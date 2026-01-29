import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import AdminLayoutTemplate from './admin/admin-sidebar-layout';
import PageBanner from './page-banner';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({
    children,
    breadcrumbs,
    title,
    ...props
}: AdminLayoutProps) => (
    <AdminLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        <PageBanner title={title} />
        {children}
    </AdminLayoutTemplate>
);
