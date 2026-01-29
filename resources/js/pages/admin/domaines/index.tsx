import AdminLayout from '@/layouts/admin-layout';
import { Domaine } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import DomaineForm from './create';
import DomaineDataTable from './datatable';

export default function DomainesIndex() {
    const { domaines } = usePage().props as unknown as {
        domaines: Domaine[];
    };
    const { domaine } = usePage().props as unknown as {
        domaine: Domaine | undefined;
    };

    return (
        <AdminLayout title="Liste de catégories">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
                <div className="order-last lg:order-first lg:col-span-4">
                    <DomaineDataTable domaines={domaines} />
                </div>
                <div className="order-first lg:order-last lg:col-span-4">
                    <DomaineForm domaines={domaines} domaine={domaine} />
                </div>
            </div>
        </AdminLayout>
    );
}
