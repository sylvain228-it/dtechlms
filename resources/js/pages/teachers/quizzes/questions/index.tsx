import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { QuizQuestion } from '@/types/models/others';
import { usePage } from '@inertiajs/react';
import QuizQuestDataTable from './datatable';

type Props = {
    quiz_quests: QuizQuestion[];
};
export default function TeacherQuizzesIndex() {
    const { quiz_quests } = usePage().props as unknown as Props;
    return (
        <TeacherLayouts title="Liste de questions du quize">
            <div className="my-2 flex justify-center border bg-gray-50 p-1 text-center">
                <b>Quize : </b> <span>{quiz_quests[0].quize?.title}</span>
            </div>
            <QuizQuestDataTable quizQuests={quiz_quests} />
        </TeacherLayouts>
    );
}
