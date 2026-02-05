import { Divider } from '@/components/divider';
import GetHtmlContent from '@/lib/get-html-content';
import { getResourceIcon } from '@/lib/simple-utility';
import {
    DeliverableType,
    EvaluateType,
    getActivityTypeLabel,
    getDeliverableTypeLabel,
    getEvaluateTypeLabel,
    getPlateformeConferenceLabel,
    ResourceType,
} from '@/lib/type';
import {
    formatBooleanText,
    formatCompleteDate,
    formatMinutes,
} from '@/lib/utils';
import { details as quizeDetails } from '@/routes/students/quizzes';
import { CourseActivity } from '@/types/models/course';
import { EntityResource, Resource } from '@/types/models/others';
import { Link } from '@inertiajs/react';
import { Separator } from '@radix-ui/react-separator';
import { ArrowRight, Download } from 'lucide-react';

export default function ActivityDetailsShered({
    activity,
}: {
    activity: CourseActivity;
}) {
    const activityResources = (activity.resources as EntityResource[]).map(
        (res) => res.resource as Resource,
    );
    const canRequiredAttendance =
        activity.activity_type == 'lecture' ||
        activity.activity_type == 'discussion';

    const quiz = activity.activity_type == 'quiz' ? activity.quiz : null;
    return (
        <div className="min-h-screen">
            {/* Main Content */}
            <div className="px-2 py-8 sm:px-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left: Content Area */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Activity Card */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                            {/* Activity Content */}
                            <div className="p-3 sm:p-6">
                                {/* Activity Type Badge */}
                                <div className="mb-6">
                                    <span className="inline-block rounded-lg border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 text-sm font-semibold text-cblue">
                                        {getActivityTypeLabel(
                                            activity.activity_type,
                                        ) || 'Lecture'}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                        Description
                                    </h3>
                                    <p className="leading-relaxed text-gray-700">
                                        {activity.description ||
                                            "Contenu de l'activité"}
                                    </p>
                                </div>

                                {/* Estimated Time */}
                                {activity.estimated_minutes && (
                                    <div className="mb-8 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50">
                                        <svg
                                            className="h-5 w-5 text-amber-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-2.828 2.829a1 1 0 101.414 1.414L9 11.414V6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-amber-800">
                                            Durée estimée:{' '}
                                            <strong>
                                                {formatMinutes(
                                                    activity.estimated_minutes,
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                )}

                                {/* Content/Exercise */}
                                <div className="border-b border-gray-200 bg-gray-50">
                                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div className="rounded-lg bg-gray-50 p-3">
                                                <div className="text-xs text-gray-500">
                                                    Durée estimée
                                                </div>
                                                <div className="mt-1 text-lg font-bold text-gray-900">
                                                    {formatMinutes(
                                                        activity.estimated_minutes,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-lg bg-gray-50 p-3">
                                                <div className="text-xs text-gray-500">
                                                    Durée planifiée
                                                </div>
                                                <div className="mt-1 text-lg font-bold text-gray-900">
                                                    {formatMinutes(
                                                        activity.duration_minutes,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Evaluation & Livrables */}
                                    <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Évaluation & Livrables
                                        </h3>
                                        <Separator className="my-3" />
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    Evaluée
                                                </div>
                                                <div className="mt-1 text-sm font-bold text-gray-900">
                                                    {activity.is_evaluated
                                                        ? 'Oui'
                                                        : 'Non'}
                                                </div>
                                            </div>
                                            {activity.is_evaluated && (
                                                <>
                                                    <div>
                                                        <div className="text-sm text-gray-500">
                                                            Type d'évaluation
                                                        </div>
                                                        <div className="mt-1 text-sm font-bold text-gray-900">
                                                            {activity.evaluation_type
                                                                ? getEvaluateTypeLabel(
                                                                      activity.evaluation_type as EvaluateType,
                                                                  )
                                                                : '-'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">
                                                            Poids
                                                        </div>
                                                        <div className="mt-1 text-sm font-bold text-gray-900">
                                                            {activity.evaluation_weight ??
                                                                '-'}
                                                            {activity.note_unit}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    A un livrable
                                                </div>
                                                <div className="mt-1 text-sm font-bold text-gray-900">
                                                    {formatBooleanText(
                                                        activity.has_deliverable ==
                                                            1,
                                                    )}
                                                </div>
                                            </div>
                                            {activity.has_deliverable && (
                                                <>
                                                    <div>
                                                        <div className="text-sm text-gray-500">
                                                            Type
                                                        </div>
                                                        <div className="mt-1 text-sm font-bold text-gray-900">
                                                            {activity.deliverable_type
                                                                ? getDeliverableTypeLabel(
                                                                      activity.deliverable_type as DeliverableType,
                                                                  )
                                                                : '-'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">
                                                            Date limite
                                                        </div>
                                                        <div className="mt-1 text-sm font-bold text-gray-900">
                                                            {formatCompleteDate(
                                                                activity.deliverable_deadline ??
                                                                    '',
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="grid gap-4 md:grid-cols-3">
                                            {activity.requires_feedback && (
                                                <div>
                                                    <div className="text-sm text-gray-500">
                                                        Feedback requis
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold text-gray-900">
                                                        {activity.requires_feedback
                                                            ? 'Oui'
                                                            : 'Non'}
                                                    </div>
                                                </div>
                                            )}
                                            {activity.has_deliverable && (
                                                <>
                                                    <div>
                                                        <div className="text-sm text-gray-500">
                                                            Autorise
                                                            resoumission
                                                        </div>
                                                        <div className="mt-1 text-sm font-bold text-gray-900">
                                                            {activity.allows_resubmission
                                                                ? 'Oui'
                                                                : 'Non'}
                                                        </div>
                                                    </div>
                                                    {activity.max_attempts && (
                                                        <div>
                                                            <div className="text-sm text-gray-500">
                                                                Nombre max de
                                                                tentatives
                                                            </div>
                                                            <div className="mt-1 text-sm font-bold text-gray-900">
                                                                {activity.max_attempts ??
                                                                    '-'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {quiz && (
                                        <div className="my-5 border-b border-gray-200 bg-gray-50 p-4 shadow-sm">
                                            <Separator className="my-3" />
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <div className="text-sm text-gray-500">
                                                        {activity.is_evaluated
                                                            ? 'Evaluation quize'
                                                            : 'Quize'}
                                                    </div>
                                                </div>
                                                {quiz.success_threshold && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-sm text-gray-500">
                                                            Seuil de succès
                                                        </div>
                                                        <div className="mt-1 text-sm font-bold text-gray-900">
                                                            {Number(
                                                                quiz.success_threshold,
                                                            )}{' '}
                                                            {activity.note_unit}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="md:col-span-2">
                                                    <div className="text-sm text-gray-500">
                                                        Titre
                                                    </div>
                                                    <div className="text-md mt-1 line-clamp-1 font-bold text-gray-600">
                                                        <Link
                                                            href={quizeDetails(
                                                                quiz.slug,
                                                            )}
                                                        >
                                                            {quiz.title}
                                                        </Link>
                                                    </div>
                                                    <div className="text-md mt-4 font-bold text-blue-600">
                                                        <Link
                                                            className="btn-primary flex max-w-[300px] items-center justify-center gap-2"
                                                            href={quizeDetails(
                                                                quiz.slug,
                                                            )}
                                                        >
                                                            Détails du quiz
                                                            <ArrowRight />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Divider />
                                    {activity.resources_summary && (
                                        <div>
                                            <Separator className="my-4" />
                                            <h3 className="text-md font-semibold text-gray-700">
                                                Consignes pédagogiques,
                                                Ressources & résumé
                                            </h3>
                                            <div className="mt-2 text-sm text-gray-600">
                                                <GetHtmlContent
                                                    contentHtml={
                                                        activity.resources_summary ??
                                                        ''
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Resources Sidebar */}
                    <div className="order-first lg:order-last lg:col-span-1">
                        <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                            <div className="p-6">
                                <h4 className="text-md font-semibold text-gray-700">
                                    Planification
                                </h4>
                                <div className="mt-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Début
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {formatCompleteDate(
                                                activity.start_at ?? '',
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Synchronous
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {formatBooleanText(
                                                activity.is_synchronous,
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Durée
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {formatMinutes(
                                                activity.duration_minutes,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {activity.conference_platform ||
                                activity.conference_url ? (
                                    <>
                                        <Separator className="my-3" />
                                        <h5 className="text-sm font-semibold text-gray-700">
                                            Visioconférence
                                        </h5>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-28 text-xs text-gray-500">
                                                    Plateforme
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    {activity.conference_platform
                                                        ? getPlateformeConferenceLabel(
                                                              activity.conference_platform,
                                                          )
                                                        : '-'}
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="w-28 text-xs text-gray-500">
                                                    URL
                                                </div>
                                                <div className="font-medium text-cblue">
                                                    <a
                                                        href={
                                                            activity.conference_url ??
                                                            '#'
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {
                                                            activity.conference_url
                                                        }
                                                    </a>
                                                </div>
                                            </div>
                                            {activity.conference_meeting_id && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="w-28 text-xs text-gray-500">
                                                        ID
                                                    </div>
                                                    <div className="font-medium text-gray-900">
                                                        {
                                                            activity.conference_meeting_id
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : null}

                                <Separator className="my-3" />

                                <h5 className="text-sm font-semibold text-gray-700">
                                    Visibilité & présence
                                </h5>
                                <div className="mt-2 text-sm text-gray-600">
                                    {canRequiredAttendance && (
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                Présence requise
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {formatBooleanText(
                                                    activity.attendance_required,
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {!canRequiredAttendance && (
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                Obligatoire
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {activity.is_mandatory
                                                    ? 'Oui'
                                                    : 'Non'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                            {/*  */}
                            <div className="p-6">
                                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <svg
                                        className="h-5 w-5 text-purple-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M7 9a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M7.465 14.146a1 1 0 01.109.11l4.233 4.233a1 1 0 001.414-1.414l-4.233-4.234a1 1 0 00-.158-.168 6 6 0 10-1.365 1.073z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Ressources
                                </h3>

                                <div className="space-y-3">
                                    {activityResources.length > 0 ? (
                                        activityResources.map((resource) => (
                                            <a
                                                key={resource.id}
                                                href={resource.url as string}
                                                className="group flex transform cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-all duration-200 hover:translate-x-1 hover:border-purple-300 hover:bg-purple-50"
                                            >
                                                <div className="mt-1 flex-shrink-0">
                                                    {getResourceIcon(
                                                        (resource.resource_type as ResourceType) ||
                                                            'document',
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-purple-600">
                                                        {resource.title}
                                                    </p>
                                                    {resource.duration_minute && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            ⏱️{' '}
                                                            {formatMinutes(
                                                                resource.duration_minute,
                                                            )}
                                                        </p>
                                                    )}
                                                    {resource.file_size && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            📦{' '}
                                                            {resource.file_size}
                                                        </p>
                                                    )}
                                                </div>
                                                <Download className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-purple-600" />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="py-4 text-center text-sm text-gray-500">
                                            Aucune ressource disponible
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
