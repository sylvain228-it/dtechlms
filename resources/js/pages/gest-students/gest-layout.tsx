import PageBanner from '@/layouts/page-banner';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface GestStudentLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, title }: GestStudentLayoutProps) => (
    <>
        <Head title={title} />
        <PageBanner title={title} />
        <div className="my-8 px-5 md:px-10">{children}</div>
    </>
);
