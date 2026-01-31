import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { QuizAnswer, QuizQuestion } from '@/types/models/others';
import { usePage } from '@inertiajs/react';
import QuestResponsesDataTable from './datatable';

type Props = {
    quiz_quest_answers: QuizAnswer[];
    question: QuizQuestion;
};
export default function TeacherQuizzesIndex() {
    const { quiz_quest_answers, question } = usePage()
        .props as unknown as Props;
    return (
        <TeacherLayouts
            title={`Liste des réponse pour : ${question.question_text}`}
        >
            {quiz_quest_answers.length > 0 && (
                <div className="my-2 flex justify-center border bg-gray-50 p-1 text-center">
                    <b>Quize : </b> <span>{question.quize?.title}</span> /
                    <b> {question.question_text} </b>
                </div>
            )}
            <QuestResponsesDataTable
                questAnswers={quiz_quest_answers}
                question={question}
            />
        </TeacherLayouts>
    );
}
