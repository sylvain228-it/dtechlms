import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import PageBanner from '../page-banner';
import StudentLayoutsTemplate from './student-space-layouts';

interface StudentLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({
    children,
    title,
    breadcrumbs,
    ...props
}: StudentLayoutProps) => (
    <StudentLayoutsTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        <PageBanner title={title} />
        {children}
    </StudentLayoutsTemplate>
);
