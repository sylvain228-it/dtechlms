import { getQuizeTypeLabel, getSaveStatusLabel } from '@/lib/type';
import { formatBooleanText, formatDate } from '@/lib/utils';

import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { destroy, edit } from '@/routes/teachers/quizzes';
import { index as listQuizQuest } from '@/routes/teachers/quizzes/questions';
import { Quiz } from '@/types/models/others';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Edit, Trash } from 'lucide-react';
import QuizQuestionFormDialog from './questions/add-question-dialog';

type Props = {
    quize: Quiz;
};
export default function TeacherQuizeShow() {
    const { quize } = usePage().props as unknown as Props;

    const handleDelete = () => {
        if (!confirm('Confirmer la suppression de ce quiz ?')) return;
        router.delete(destroy([quize.activity?.id ?? '', quize.id]));
    };

    return (
        <TeacherLayouts title={`Quiz : ${quize.title}`}>
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            {quize.title}
                        </h1>
                        <div className="mt-2 text-sm text-gray-500">
                            <span className="mr-4 inline-block text-xs font-medium text-gray-600">
                                Type:
                            </span>
                            <span className="text-sm text-gray-700">
                                {getQuizeTypeLabel(quize.quiz_type)}
                            </span>

                            <span className="mr-2 ml-6 inline-block text-xs font-medium text-gray-600">
                                Durée:
                            </span>
                            <span className="text-sm text-gray-700">
                                {quize.time_limit_minutes
                                    ? `${quize.time_limit_minutes} min`
                                    : '—'}
                            </span>
                        </div>

                        {quize.description && (
                            <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                                {quize.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={edit([
                                quize.activity?.slug ?? '',
                                quize.slug,
                            ])}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <Edit size={16} /> Modifier
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            <Trash size={16} /> Supprimer
                        </button>
                    </div>
                </div>

                <div className="my-5 rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900">
                        Question
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <QuizQuestionFormDialog
                            quizId={quize.id}
                            title={quize.title}
                        />

                        <Link
                            href={listQuizQuest(quize.slug)}
                            className="btn-primary flex w-full items-center justify-center gap-4 !bg-blue-100 !text-app-blue"
                        >
                            <b>Liste de questions</b>
                            <ArrowRight size={30} className="text-app-blue" />
                        </Link>
                    </div>
                </div>

                {/* Content grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-4 lg:col-span-2">
                        {/* Pedagogical parameters */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Paramètres pédagogiques
                            </h2>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Type
                                    </p>
                                    <div className="mt-1 text-sm font-medium text-gray-800">
                                        {getQuizeTypeLabel(quize.quiz_type)}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Durée
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        {quize.time_limit_minutes
                                            ? `${quize.time_limit_minutes} min`
                                            : '—'}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tentatives max
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        {quize.max_attempts ?? '—'}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Obligatoire
                                    </p>
                                    <div className="mt-1 text-sm font-medium text-gray-800">
                                        {formatBooleanText(
                                            !!quize.is_mandatory,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">
                                Instructions
                            </h3>
                            <div className="mt-3 text-sm text-gray-700">
                                {(() => {
                                    const instructions = (
                                        quize as unknown as {
                                            quize_instructions?: string;
                                        }
                                    ).quize_instructions;
                                    return instructions &&
                                        instructions.length ? (
                                        <div>{instructions}</div>
                                    ) : (
                                        <div className="text-sm text-gray-400">
                                            Aucune instruction fournie.
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Behavior */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">
                                Comportement
                            </h3>
                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Mélanger les questions
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!quize.shuffle_questions,
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Mélanger les réponses
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!quize.shuffle_answers,
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Afficher résultats immédiatement
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!quize.show_results_immediately,
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Afficher réponses correctes
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!quize.show_correct_answers,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scoring */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">
                                Scoring
                            </h3>
                            <div className="mt-4 grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Score maximum
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quize.max_score ?? '—'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Seuil de réussite
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quize.success_threshold
                                            ? `${quize.success_threshold}${quize.note_unit}`
                                            : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column (meta) */}
                    <aside className="col-span-1">
                        <div className="sticky top-20 rounded-lg border bg-white p-6 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700">
                                Métadonnées
                            </h4>

                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Statut
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {getSaveStatusLabel(quize.status) ??
                                            '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Publié
                                    </div>
                                    <div className="mt-1">
                                        {formatDate(quize.published_at)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Score maximum
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quize.max_score ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Seuil de réussite
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {quize.success_threshold
                                            ? `${quize.success_threshold}%`
                                            : '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Version
                                    </div>
                                    <div className="mt-1">
                                        {quize.version ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Créé
                                    </div>
                                    <div className="mt-1">
                                        {formatDate(quize.created_at)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Dernière mise à jour
                                    </div>
                                    <div className="mt-1">
                                        {formatDate(quize.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
