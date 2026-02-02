import { Button } from '@/components/ui/button';
import StudentLayouts from '@/layouts/student/student-layouts';
import { getQuizeTypeLabel } from '@/lib/type';
import { details } from '@/routes/students/activities';
import { index as indexQuizzes, start } from '@/routes/students/quizzes';
import { Quiz, QuizQuestion } from '@/types/models/others';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Eye, Play } from 'lucide-react';

export default function StudentQuizDetails() {
    const { quiz } = usePage().props as unknown as { quiz: Quiz };
    const questions = (quiz.questions ?? []) as QuizQuestion[];

    const questionCount = questions.length;

    return (
        <StudentLayouts title={`Quiz : ${quiz.title}`}>
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            {quiz.title}
                        </h1>
                        <div className="mt-2 text-sm text-gray-500">
                            <span className="mr-4 inline-block text-xs font-medium text-gray-600">
                                Type:
                            </span>
                            <span className="text-sm text-gray-700">
                                {getQuizeTypeLabel(quiz.quiz_type)}
                            </span>

                            <span className="mr-2 ml-6 inline-block text-xs font-medium text-gray-600">
                                Durée:
                            </span>
                            <span className="text-sm text-gray-700">
                                {quiz.time_limit_minutes
                                    ? `${quiz.time_limit_minutes} min`
                                    : '—'}
                            </span>
                        </div>

                        {quiz.description && (
                            <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                                {quiz.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Optional: link to activity details if exist */}
                        {quiz.activity && (
                            <Link
                                href={details(quiz.activity?.slug)}
                                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                            >
                                <Eye size={16} /> Voir l'activité
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={start(quiz.slug)}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Play size={16} /> Commencer
                        </Link>

                        <Link
                            href={indexQuizzes()}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            Quizzes <ArrowRight />
                        </Link>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Questions + instructions */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Total des questions
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {questionCount} question(s)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">
                                Instructions
                            </h3>
                            <div className="mt-3 text-sm text-gray-700">
                                {quiz.quize_instructions &&
                                quiz.quize_instructions.length ? (
                                    <div>{quiz.quize_instructions}</div>
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Aucune instruction fournie.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta */}
                    <aside className="col-span-1">
                        <div className="sticky top-20 rounded-lg border bg-white p-6 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700">
                                Informations
                            </h4>

                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Durée
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quiz.time_limit_minutes
                                            ? `${quiz.time_limit_minutes} min`
                                            : '—'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Tentatives maximum
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quiz.max_attempts ?? '—'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Score maximum
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quiz.max_score ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Seuil de réussite
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quiz.success_threshold
                                            ? `${quiz.success_threshold}${quiz.note_unit ?? ''}`
                                            : '-'}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        href={start(quiz.slug)}
                                        className="block w-full"
                                    >
                                        <Button className="inline-flex w-full items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
                                            <Play className="h-4 w-4" />{' '}
                                            Commencer le quiz
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </StudentLayouts>
    );
}
