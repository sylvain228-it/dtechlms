import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { Teacher } from '@/types/models/institut';
import { usePage } from '@inertiajs/react';
import InstitutTeachersDataTable from './datatable';

export default function InstitutTeachersIndex() {
    const { teachers } = usePage().props as unknown as {
        teachers: Teacher[];
    };
    return (
        <InstitutLayouts title="Liste d'enseignants">
            <InstitutTeachersDataTable teachers={teachers} />
        </InstitutLayouts>
    );
}
