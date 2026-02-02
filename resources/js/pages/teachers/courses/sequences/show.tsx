import { Divider } from '@/components/divider';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import GetHtmlContent from '@/lib/get-html-content';
import { handleEditClicked } from '@/lib/tasks';
import { getActivityTypeLabel, getSequenceTypeLabel } from '@/lib/type';
import { formatHours } from '@/lib/utils';
import {
    show as activityShow,
    create as createActivity,
    index as listActivity,
} from '@/routes/teachers/activities';
import { show as courseShow } from '@/routes/teachers/courses';
import { show as moduleShow } from '@/routes/teachers/modules';
import {
    destroy,
    edit,
    index as sequencesIndex,
} from '@/routes/teachers/sequences';
import { Course, Module, Sequence } from '@/types/models/course';
import { Link, router, usePage } from '@inertiajs/react';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';

export default function SequenceDetails() {
    const { sequence } = usePage().props as unknown as {
        sequence: Sequence & { module?: Module };
    };

    const module = sequence.module as Module | undefined;
    const course = module?.course as Course | undefined;
    const activities = sequence.activities || [];

    // Actions
    const handleDelete = () => {
        if (!confirm('Confirmer la suppression de cette séquence ?')) return;
        if (!module || !course) return;
        router.delete(destroy([course.slug!, module.id!, sequence.id]));
    };

    const editUrl =
        sequence.module && sequence.module.course
            ? edit([
                  sequence.module.course.slug,
                  sequence.module?.id ?? '',
                  sequence.id,
              ]).url
            : '#';

    return (
        <TeacherLayouts title={`Séquence : ${sequence.title}`}>
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={course ? courseShow(course.slug) : '#'}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Cours
                            </Link>
                            <span className="text-sm text-gray-400">/</span>
                            <Link
                                href={
                                    module && course
                                        ? moduleShow([course.slug, module.id])
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

                        <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-gray-600">
                            {sequence.description ? (
                                sequence.description
                            ) : (
                                <span className="text-gray-400">
                                    Aucune description fournie.
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) =>
                                handleEditClicked(
                                    e,
                                    sequence.syllabus ?? '',
                                    editUrl,
                                )
                            }
                            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <IoPencil /> Modifier
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            <IoTrash /> Supprimer
                        </button>

                        <Link
                            href={listActivity(sequence.slug)}
                            className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            Activités
                        </Link>
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

                        {/* activités */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Activités
                                </h2>
                                {/* lien ajouter */}
                                <Link
                                    className="btn-primary !px-3 !py-1"
                                    href={createActivity(sequence.slug)}
                                >
                                    <IoAdd
                                        size={20}
                                        className="text-white"
                                    />{' '}
                                </Link>
                            </div>
                            <div className="mt-3 text-sm text-gray-700">
                                {activities.length > 0 ? (
                                    <div>
                                        <ul className="space-y-3">
                                            {activities
                                                .slice(0, 10)
                                                .map((activity) => (
                                                    <li
                                                        key={activity.id}
                                                        className="rounded-md border p-4 hover:bg-gray-50"
                                                    >
                                                        <Link
                                                            href={activityShow([
                                                                sequence!.slug,
                                                                activity.id,
                                                            ])}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {activity.title}
                                                        </Link>
                                                        <p className="text-sm text-gray-600">
                                                            Type:{' '}
                                                            {getActivityTypeLabel(
                                                                activity.activity_type,
                                                            )}
                                                        </p>
                                                    </li>
                                                ))}
                                        </ul>
                                        {activities.length > 10 && (
                                            <div className="mt-4">
                                                <Link
                                                    href={listActivity(
                                                        sequence.slug,
                                                    )}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Voir les {activities.length}{' '}
                                                    activités
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        Aucune activité pour cette séquence.
                                    </div>
                                )}
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

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">
                                        Visibilité
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {sequence.is_visible
                                            ? 'Visible'
                                            : 'Masqué'}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Statut</dt>
                                    <dd className="font-medium text-gray-900">
                                        {sequence.status}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Créée</dt>
                                    <dd className="font-medium text-gray-900">
                                        {sequence.created_at
                                            ? new Date(
                                                  sequence.created_at,
                                              ).toLocaleString()
                                            : '-'}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">
                                        Dernière modification
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {sequence.updated_at
                                            ? new Date(
                                                  sequence.updated_at,
                                              ).toLocaleString()
                                            : '-'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700">
                                Navigation
                            </h3>
                            <ul className="mt-2 space-y-2 text-sm text-gray-600">
                                <li>
                                    <Link
                                        href={
                                            module && course
                                                ? moduleShow([
                                                      course.slug,
                                                      module.id,
                                                  ])
                                                : '#'
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        Retour au module
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={
                                            course
                                                ? courseShow(course.slug)
                                                : '#'
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        Retour au cours
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={
                                            module && course
                                                ? sequencesIndex([
                                                      course.slug,
                                                      module.id,
                                                  ])
                                                : '#'
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        Toutes les séquences
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
