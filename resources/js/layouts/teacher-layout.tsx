import TeacherLayoutTemplate from '@/layouts/app/teacher-sidebar-layout';
import { subStrText } from '@/lib/tasks';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import PageBanner from './page-banner';

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
    <TeacherLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Head title={title} />
        <PageBanner title={subStrText(title, 0, 45)} />
        {children}
    </TeacherLayoutTemplate>
);
