import AdminLayout from '@/layouts/admin-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function AdminDashboard() {
    const { auth } = usePage().props;

    console.log('Admin Auth :', auth);
    return (
        <AdminLayout breadcrumbs={breadcrumbs} title="Tableau de bord">
            <div>
                <h1 className="text-3xl font-bold underline"> Admin </h1>
            </div>
        </AdminLayout>
    );
}
