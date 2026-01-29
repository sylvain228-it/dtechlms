import PublicNavbar from '@/layouts/public/nav-bar';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import UserPageBanner from './user-page-banner';

interface UserLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, title }: UserLayoutProps) => (
    <>
        <Head title={title} />
        <PublicNavbar />
        <UserPageBanner title={title} />
        <div className="my-8 px-5 md:px-10">{children}</div>
    </>
);
