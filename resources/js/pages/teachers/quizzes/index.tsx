import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Quiz } from '@/types/models/others';
import { usePage } from '@inertiajs/react';
import QuizzesDataTable from './datatable';

type Props = {
    quizzes: Quiz[];
};
export default function TeacherQuizzesIndex() {
    const { quizzes } = usePage().props as unknown as Props;

    return (
        <TeacherLayouts title="Liste de quizzes">
            <QuizzesDataTable quizzes={quizzes} />
        </TeacherLayouts>
    );
}
