import { Student } from '@/types/models/institut';
import { usePage } from '@inertiajs/react';
import PartnerStudentsDataTable from './datatable';
import GestLayout from './gest-layout';

export default function StudentsIndex() {
    const { students } = usePage().props as unknown as {
        students: Student[];
    };
    return (
        <GestLayout title="Liste des étudiants">
            <PartnerStudentsDataTable students={students} />
        </GestLayout>
    );
}
