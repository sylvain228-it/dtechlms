import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import PageBanner from '../page-banner';
import TeacherLayoutsTemplate from './teacher-space-layouts';

interface TeacherLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({
    children,
    title,
    breadcrumbs,
    ...props
}: TeacherLayoutProps) => (
    <TeacherLayoutsTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        <PageBanner title={title} />
        {children}
    </TeacherLayoutsTemplate>
);
