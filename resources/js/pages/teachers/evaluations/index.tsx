import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { CourseActivity } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import EvaluationsDataTable from './datatable';

type Props = {
    evaluations: CourseActivity[];
};
export default function TeacherEvaluationsIndex() {
    const { evaluations } = usePage().props as unknown as Props;

    return (
        <TeacherLayouts title="Liste des evaluations">
            <EvaluationsDataTable evaluations={evaluations} />
        </TeacherLayouts>
    );
}
