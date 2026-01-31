import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Evaluation } from '@/types/models/others';
import { usePage } from '@inertiajs/react';
import EvaluationsDataTable from './datatable';

type Props = {
    evaluations: Evaluation[];
};
export default function TeacherEvaluationsIndex() {
    const { evaluations } = usePage().props as unknown as Props;

    return (
        <TeacherLayouts title="Liste des evaluations">
            <EvaluationsDataTable evaluations={evaluations} />
        </TeacherLayouts>
    );
}
