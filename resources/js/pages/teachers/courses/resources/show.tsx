import { TagsInputBadge } from '@/components/shared/tags-input';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import GetHtmlContent from '@/lib/get-html-content';
import SubStrText from '@/lib/substr';
import { show } from '@/routes/teachers/courses';
import { destroy, edit } from '@/routes/teachers/modules';
import sequences from '@/routes/teachers/sequences';
import { Module, Sequence } from '@/types/models/course';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { IoAdd } from 'react-icons/io5';

function formatMinutes(mins?: number | null) {
    if (!mins) return '0 min';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h${m ? ` ${m}min` : ''}`;
}

export default function TeacherCoursModuleShow() {
    const { module } = usePage().props as unknown as {
        module: Module & { sequences?: Sequence[] };
    };

    // Action delete
    const handleDelete = () => {
        if (!confirm('Confirmer la suppression de cette section ?')) return;
        router.delete(destroy([module.course!.slug, module.id]));
    };

    // Sequences & stats
    const moduleSequences = module.sequences ?? [];
    const totalLessons = moduleSequences.length;
    const visibleCount = moduleSequences.filter(
        (s) => s.is_visible == 1,
    ).length;
    const videoCount = moduleSequences.filter(
        (s) => s.lesson_type === 'video',
    ).length;
    const audioCount = moduleSequences.filter(
        (s) => s.lesson_type === 'audio',
    ).length;
    const documentCount = moduleSequences.filter((s) =>
        ['document', 'text', 'resource'].includes(s.lesson_type),
    ).length;
    const quizCount = moduleSequences.filter(
        (s) => s.lesson_type === 'quiz' || (s as any).has_quiz,
    ).length;
    const assignmentCount = moduleSequences.filter(
        (s) => s.lesson_type === 'assignment' || (s as any).has_assignment,
    ).length;
    const totalEstimatedHours = moduleSequences.reduce(
        (acc, s) => acc + (s.estimated_hours ?? 0),
        0,
    );

    return (
        <TeacherLayouts title={`Séquence: ${module.title}`}>
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={show(module.course!.slug)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Cours
                            </Link>
                            <span className="text-sm text-gray-400">/</span>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {module.title}
                            </h1>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm text-gray-600">
                            <SubStrText
                                text={module.description ?? ''}
                                start={0}
                                end={100}
                            />
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                                Type: {module.module_type}
                            </span>
                            <span className="inline-flex items-center rounded bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                                Mode: {module.modality}
                            </span>
                            <span className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                Version: {module.version ?? 1}
                            </span>
                            {module.is_visible && (
                                <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                    Visible
                                </span>
                            )}
                            <span className="inline-flex items-center rounded bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                                Ordre: {module.order}
                            </span>
                        </div>
                        <div className="mx-auto my-4 max-w-6xl">
                            <Link
                                // href={edit([module.course!.slug, module.id])}
                                className="btn-primary mb-3 flex items-center justify-between text-center"
                            >
                                Ressources
                                <IoAdd size={30} className="font-bold" />
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={edit([module.course!.slug, module.id])}
                            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            Modifier
                        </Link>

                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Supprimer
                        </button>

                        <Link
                            href={
                                module.course
                                    ? sequences.index([
                                          module.course!.slug,
                                          module.id,
                                      ])
                                    : '#'
                            }
                            className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            Séquences <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main */}
                    <div className="col-span-2 space-y-4">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Description
                            </h2>
                            <div className="my-3 text-sm text-gray-700">
                                {module.description ?? (
                                    <span className="text-gray-400">
                                        Aucune description fournie.
                                    </span>
                                )}
                            </div>
                            {/* Prerequisites */}
                            {module.prerequisites && (
                                <div className="mb-4">
                                    <h3 className="text-md mb-2 font-semibold text-gray-800">
                                        Prérequis
                                    </h3>
                                    <TagsInputBadge
                                        tags={JSON.parse(
                                            module.prerequisites ?? [],
                                        )}
                                    />
                                </div>
                            )}

                            {/* Learning Outcomes */}
                            {module.learning_outcomes && (
                                <div className="mb-4">
                                    <h3 className="text-md mb-2 font-semibold text-gray-800">
                                        Résultats d'apprentissage
                                    </h3>
                                    <TagsInputBadge
                                        tags={JSON.parse(
                                            module.learning_outcomes ?? [],
                                        )}
                                    />
                                </div>
                            )}

                            {/* Assessment Strategy */}
                            {module.assessment_strategy && (
                                <div className="mb-4">
                                    <h3 className="text-md mb-2 font-semibold text-gray-800">
                                        Stratégie d'évaluation
                                    </h3>
                                    <TagsInputBadge
                                        tags={JSON.parse(
                                            module.assessment_strategy ?? [],
                                        )}
                                    />
                                </div>
                            )}

                            {/* Teaching Methods */}
                            {module.teaching_methods && (
                                <div className="mb-4">
                                    <h3 className="text-md mb-2 font-semibold text-gray-800">
                                        Méthodes d'enseignement
                                    </h3>
                                    <TagsInputBadge
                                        tags={JSON.parse(
                                            module.teaching_methods ?? [],
                                        )}
                                    />
                                </div>
                            )}

                            {module.syllabus && (
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                        Contenu du module
                                    </h3>
                                    <GetHtmlContent
                                        contentHtml={module.syllabus}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Séquences ({totalLessons})
                                </h2>
                                <div className="text-sm text-gray-500">
                                    Durée totale:{' '}
                                    {formatMinutes(
                                        (module.estimated_hours ??
                                            totalEstimatedHours) * 60,
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 divide-y">
                                {moduleSequences.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-gray-500">
                                        Aucune séquence pour ce module.
                                    </div>
                                ) : (
                                    moduleSequences.map((sequence) => (
                                        <div
                                            key={sequence.id}
                                            className="flex items-start gap-4 py-4"
                                        >
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100 p-2 text-gray-600">
                                                {sequence.lesson_type ===
                                                    'video' && (
                                                    <svg
                                                        className="h-full w-full text-red-500"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M4 6c0-1.1.9-2 2-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm6.5 8.5V9l5 2.75-5 2.75z" />
                                                    </svg>
                                                )}
                                                {sequence.lesson_type ===
                                                    'audio' && (
                                                    <svg
                                                        className="h-full w-full text-indigo-500"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M12 2L2 7l10 5 10-5-10-5zm0 6.5L4.24 7 12 3.5 19.76 7 12 8.5zM4 9.5v5.5c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9.5L12 14 4 9.5z" />
                                                    </svg>
                                                )}
                                                {[
                                                    'document',
                                                    'text',
                                                    'resource',
                                                ].includes(
                                                    sequence.lesson_type,
                                                ) && (
                                                    <svg
                                                        className="h-full w-full text-yellow-500"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M14 2H6a2 2 0 00-2 2v16l6-3 6 3V4a2 2 0 00-2-2z" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="flex w-full flex-col">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Link className="text-sm font-medium text-gray-900 hover:underline">
                                                            {sequence.title}
                                                        </Link>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {sequence.description ??
                                                                ''}
                                                        </div>
                                                    </div>

                                                    <div className="text-right text-xs text-gray-500">
                                                        <div className="font-medium text-gray-900">
                                                            {sequence.estimated_hours ??
                                                                '-'}{' '}
                                                            h
                                                        </div>
                                                        <div className="mt-1">
                                                            {sequence.is_visible ? (
                                                                <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                                                    Visible
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                                                    Masqué
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-4">
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700">
                                Statistiques
                            </h3>

                            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="col-span-2 flex items-center justify-between">
                                    <dt className="text-gray-500">
                                        Total séquences
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {totalLessons}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Visibles</dt>
                                    <dd className="font-medium text-gray-900">
                                        {visibleCount}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Durée (h)</dt>
                                    <dd className="font-medium text-gray-900">
                                        {module.estimated_hours ??
                                            totalEstimatedHours}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Vidéos</dt>
                                    <dd className="font-medium text-gray-900">
                                        {videoCount}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Audio</dt>
                                    <dd className="font-medium text-gray-900">
                                        {audioCount}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Documents</dt>
                                    <dd className="font-medium text-gray-900">
                                        {documentCount}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Quiz</dt>
                                    <dd className="font-medium text-gray-900">
                                        {quizCount}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Devoirs</dt>
                                    <dd className="font-medium text-gray-900">
                                        {assignmentCount}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700">
                                Paramètres
                            </h3>
                            <ul className="mt-2 space-y-2 text-sm text-gray-600">
                                <li>
                                    <span className="font-medium text-gray-800">
                                        Visible:
                                    </span>{' '}
                                    {module.is_visible ? 'Oui' : 'Non'}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-800">
                                        Ordre:
                                    </span>{' '}
                                    {module.order}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-800">
                                        Créée:
                                    </span>{' '}
                                    {new Date(
                                        module.created_at ?? '',
                                    ).toLocaleString()}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-800">
                                        Dernière modification:
                                    </span>{' '}
                                    {new Date(
                                        module.updated_at ?? '',
                                    ).toLocaleString()}
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
