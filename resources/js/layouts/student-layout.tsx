import StudentLayoutTemplate from '@/layouts/app/student-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

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
    <StudentLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        {children}
    </StudentLayoutTemplate>
);
