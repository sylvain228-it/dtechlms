import { Divider } from '@/components/divider';
import StudentLayouts from '@/layouts/student/student-layouts';
import GetHtmlContent from '@/lib/get-html-content';
import { getSequenceTypeLabel } from '@/lib/type';
import { formatHours } from '@/lib/utils';
import { details, moduleDetails } from '@/routes/students/courses';
import { Course, Module, Sequence } from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';

export default function SequenceDetails() {
    const { sequence, course } = usePage().props as unknown as {
        sequence: Sequence;
        course: Course;
    };

    const module = sequence.module as Module | undefined;

    return (
        <StudentLayouts title={`Séquence : ${sequence.title}`}>
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={course ? details(course.slug) : '#'}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Cours
                            </Link>
                            <span className="text-sm text-gray-400">/</span>
                            <Link
                                href={
                                    module && course
                                        ? moduleDetails([
                                              course.slug,
                                              module.slug,
                                          ])
                                        : '#'
                                }
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Module
                            </Link>
                            <span className="text-sm text-gray-400">/</span>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {sequence.title}
                            </h1>
                        </div>

                        <p className="mt-2 line-clamp-1 max-w-2xl text-sm text-gray-600">
                            {sequence.description ? (
                                sequence.description
                            ) : (
                                <span className="text-gray-400">
                                    Aucune description fournie.
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            {/* Assessment info */}
                            <div className="mt-4">
                                <h3 className="text-md mb-2 font-semibold text-gray-800">
                                    Évaluation
                                </h3>
                                <div className="text-sm text-gray-700">
                                    {sequence.has_assessment ? (
                                        <div>
                                            Présence d'une évaluation (poids:{' '}
                                            {sequence.assessment_weight ??
                                                'N/A'}
                                            )
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            Aucune évaluation prévue.
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* contenu */}
                            <div className="mt-4">
                                <div className="my-3 text-sm text-gray-700">
                                    <p className="mb-2">
                                        {sequence.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Ressources
                            </h2>
                            <div className="mt-3 text-sm text-gray-700">
                                {/* Les ressources seront listées ici si disponibles */}
                                <div className="text-gray-500">
                                    Aucune ressource attachée pour le moment.
                                </div>
                            </div>
                        </div>
                        <Divider />
                        {sequence.syllabus ? (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Contenu
                                </h2>
                                <GetHtmlContent
                                    contentHtml={sequence.syllabus}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                    {/* Sidebar */}
                    <aside className="space-y-4">
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700">
                                Informations
                            </h3>

                            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="col-span-2 flex items-center justify-between">
                                    <dt className="text-gray-500">Type</dt>
                                    <dd className="font-medium text-gray-900">
                                        {getSequenceTypeLabel(
                                            sequence.sequence_type,
                                        )}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">
                                        Durée estimée
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {formatHours(sequence.estimated_hours)}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Ordre</dt>
                                    <dd className="font-medium text-gray-900">
                                        {sequence.order ?? '-'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </aside>{' '}
                </div>
            </div>
        </StudentLayouts>
    );
}
