import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { Domaine } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import AdminDomaineForm from './create';
import DomaineDataTable from './datatable';

export default function DomainesIndex() {
    const { domaines, domaine } = usePage().props as unknown as {
        domaines: Domaine[];
        domaine: Domaine | undefined;
    };

    return (
        <InstitutLayouts title="Liste de catégories">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
                <div className="order-last lg:order-first lg:col-span-4">
                    <DomaineDataTable domaines={domaines} />
                </div>
                <div className="order-first lg:order-last lg:col-span-2">
                    <AdminDomaineForm domaines={domaines} domaine={domaine} />
                </div>
            </div>
        </InstitutLayouts>
    );
}
