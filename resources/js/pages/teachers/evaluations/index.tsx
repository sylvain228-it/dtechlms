import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Evaluation } from '@/types/models/others';
import { usePage } from '@inertiajs/react';
import EvaluationsDataTable from './datatable';

type Props = {
    evaluations: Evaluation[];
    entity_type: string;
    entity_id: number;
};
export default function TeacherEvaluationsIndex() {
    const { entity_type, entity_id, evaluations } = usePage()
        .props as unknown as Props;

    return (
        <TeacherLayouts title="Liste des evaluations">
            <EvaluationsDataTable
                evaluations={evaluations}
                entity_type={entity_type}
                entity_id={entity_id}
            />
        </TeacherLayouts>
    );
}
