import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Quiz } from '@/types/models/others';
import { usePage } from '@inertiajs/react';
import QuizzesDataTable from './datatable';

type Props = {
    quizzes: Quiz[];
    entity_type: string;
    entity_id: number;
};
export default function TeacherQuizzesIndex() {
    const { entity_type, entity_id, quizzes } = usePage()
        .props as unknown as Props;

    return (
        <TeacherLayouts title="Liste de quizzes">
            <QuizzesDataTable
                quizzes={quizzes}
                entity_type={entity_type}
                entity_id={entity_id}
            />
        </TeacherLayouts>
    );
}
