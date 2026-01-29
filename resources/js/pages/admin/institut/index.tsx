import AdminLayout from '@/layouts/admin-layout';
import { type Partner } from '@/types';
import { usePage } from '@inertiajs/react';
import PartnersDataTable from './datatable';
export default function AdminPartnersIndex() {
    const { partners } = usePage().props as unknown as { partners: Partner[] };
    console.log('Partners :', partners);
    return (
        <AdminLayout>
            <PartnersDataTable partners={partners} />
        </AdminLayout>
    );
}
