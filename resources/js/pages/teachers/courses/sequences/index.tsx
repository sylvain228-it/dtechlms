import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Module, Sequence } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import ModuleSequenceDataTable from './datatable';

export default function SequencesIndex() {
    const { sequences } = usePage().props as unknown as {
        sequences: Sequence[];
    };
    const { module } = usePage().props as unknown as {
        module: Module;
    };

    return (
        <TeacherLayouts title="Liste de séquences du cours">
            <ModuleSequenceDataTable sequences={sequences} module={module} />
        </TeacherLayouts>
    );
}
