import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import InstitutSidebarLayoutTemplate from './institut/institut-sidebar-layout';
import PageBanner from './page-banner';

interface InstitutLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({
    children,
    breadcrumbs,
    title,
    ...props
}: InstitutLayoutProps) => (
    <InstitutSidebarLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        <PageBanner title={title} />
        {children}
    </InstitutSidebarLayoutTemplate>
);
