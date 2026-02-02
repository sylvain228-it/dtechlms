import { TagsInputBadge } from '@/components/shared/tags-input';
import { Badge } from '@/components/ui/badge';
import StudentLayouts from '@/layouts/student/student-layouts';
import { subStrText } from '@/lib/tasks';
import {
    DeliverableType,
    getDeliverableTypeLabel,
    getEvaluateTypeLabel,
    getModalityTypeLabel,
    getPlateformeConferenceLabel,
} from '@/lib/type';
import { formatBooleanText, formatCompleteDate, formatDate } from '@/lib/utils';
import { details } from '@/routes/students/activities';
import { Evaluation } from '@/types/models/others';
import { Link, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';

export default function StudentEvaluationDetails() {
    const { evaluation } = usePage().props as unknown as {
        evaluation: Evaluation;
    };

    return (
        <StudentLayouts title={`Évaluation : ${evaluation.title}`}>
            <div className="mx-auto mt-6 max-w-6xl px-4 pb-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            {evaluation.title}
                        </h1>
                        <div className="mt-2 flex flex-col gap-4 text-sm text-gray-600 sm:flex-row">
                            <div>
                                <span className="font-medium">Type : </span>
                                <Badge>
                                    {subStrText(
                                        getEvaluateTypeLabel(
                                            evaluation.evaluation_type,
                                        ),
                                        0,
                                        35,
                                    )}
                                </Badge>
                            </div>
                            <div>
                                <span className="font-medium">Mode : </span>
                                <Badge>
                                    {subStrText(
                                        getModalityTypeLabel(
                                            evaluation.modality,
                                        ),
                                        0,
                                        35,
                                    )}
                                </Badge>
                            </div>
                            {evaluation.duration_minutes && (
                                <div>
                                    <span className="font-medium">
                                        Durée :{' '}
                                    </span>
                                    <span>
                                        {evaluation.duration_minutes} min
                                    </span>
                                </div>
                            )}
                        </div>

                        {evaluation.description && (
                            <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                                {evaluation.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Optional: link to activity details if exist */}
                        {evaluation.activity && (
                            <Link
                                href={details(evaluation?.activity?.slug)}
                                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                            >
                                <Eye size={16} /> Voir l'activité
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        {/* Organisation */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Organisation
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Poids
                                    </p>
                                    <div className="mt-1 text-sm font-medium text-gray-800">
                                        {evaluation.weight
                                            ? `${Number(evaluation.weight)}${evaluation.note_unit || '%'}`
                                            : '—'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Score maximum
                                    </p>
                                    <div className="mt-1 text-sm font-medium text-gray-800">
                                        {evaluation.max_score ?? '—'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Durée
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        {evaluation.duration_minutes
                                            ? `${evaluation.duration_minutes} min`
                                            : '—'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Programmée
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        {formatCompleteDate(
                                            evaluation.scheduled_at ?? '',
                                        ) || '—'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Obligatoire
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.is_mandatory,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ressources et outils */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Ressources et outils
                            </h2>
                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                {evaluation.allowed_tools && (
                                    <div>
                                        <p className="mb-2 text-xs font-medium text-gray-600">
                                            Outils autorisés
                                        </p>
                                        <TagsInputBadge
                                            tags={JSON.parse(
                                                evaluation.allowed_tools ??
                                                    '[]',
                                            )}
                                        />
                                    </div>
                                )}
                                {evaluation.resources_summary && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-600">
                                            Résumé des ressources
                                        </p>
                                        <p className="mt-1">
                                            {evaluation.resources_summary}
                                        </p>
                                    </div>
                                )}
                                {!evaluation.allowed_tools &&
                                    !evaluation.resources_summary && (
                                        <p className="text-gray-400">
                                            Aucune ressource ou outil défini.
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Retour d'information
                            </h2>
                            <div className="mt-4 space-y-3">
                                {evaluation.feedback_instructions && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-600">
                                            Instructions
                                        </p>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {evaluation.feedback_instructions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Paramètres avancés */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Paramètres avancés
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Travail en groupe
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.is_group,
                                        )}
                                    </div>
                                </div>
                                {evaluation.is_group &&
                                    evaluation.max_group_size && (
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                Taille max groupe
                                            </p>
                                            <div className="mt-1 font-medium">
                                                {evaluation.max_group_size}
                                            </div>
                                        </div>
                                    )}
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Resoumission autorisée
                                    </p>

                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.allows_resubmission,
                                        )}
                                    </div>
                                    {evaluation.max_attempts && (
                                        <div className="mt-1">
                                            <p className="text-xs text-gray-600">
                                                Max tentatives
                                            </p>
                                            <div className="mt-1 font-medium">
                                                {evaluation.max_attempts ?? '—'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-gray-600">
                                        Mélanger questions
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.shuffle_questions,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fenêtre temporelle */}
                        {evaluation.deliverable_type && (
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <div className="mt-3">
                                    <p className="text-xs text-gray-600">
                                        Type de livrable
                                    </p>
                                    <div className="mt-1 text-sm">
                                        {getDeliverableTypeLabel(
                                            evaluation.deliverable_type as DeliverableType,
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accès et soumission */}
                        <fieldset className="mb-6 rounded border border-gray-200 p-4">
                            <legend className="text-base font-semibold text-gray-900">
                                Accès et soumission
                            </legend>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Synchrone
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.is_synchronous,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Soumission tardive autorisée
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.allow_late_submission,
                                        )}
                                    </div>
                                </div>
                                {evaluation.allow_late_submission &&
                                    evaluation.late_penalty_percentage !==
                                        null && (
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                Pénalité tardive
                                            </p>
                                            <div className="mt-1 font-medium">
                                                {
                                                    evaluation.late_penalty_percentage
                                                }
                                                %
                                            </div>
                                        </div>
                                    )}
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Verrouiller après fin
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.lock_after_end,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Visioconférence */}
                        {evaluation.is_synchronous && (
                            <div>
                                <fieldset className="mb-6 rounded border border-gray-200 p-4">
                                    <legend className="text-base font-semibold text-gray-900">
                                        Fenêtre temporelle
                                    </legend>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                Début
                                            </p>
                                            <div className="mt-1 text-sm">
                                                {formatDate(
                                                    evaluation.start_at,
                                                ) || '—'}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                Fin
                                            </p>
                                            <div className="mt-1 text-sm">
                                                {formatDate(
                                                    evaluation.end_at,
                                                ) || '—'}
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="mb-6 rounded border border-gray-200 p-4">
                                    <legend className="text-base font-semibold text-gray-900">
                                        Visioconférence
                                    </legend>
                                    <div className="mt-4 space-y-3">
                                        {evaluation.conference_platform && (
                                            <div>
                                                <p className="text-xs text-gray-600">
                                                    Plateforme
                                                </p>
                                                <div className="mt-1 text-sm">
                                                    {getPlateformeConferenceLabel(
                                                        evaluation.conference_platform as
                                                            | 'zoom'
                                                            | 'teams'
                                                            | 'google_meet',
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {evaluation.conference_url && (
                                            <div>
                                                <p className="text-xs text-gray-600">
                                                    URL
                                                </p>
                                                <div className="mt-1">
                                                    <a
                                                        href={
                                                            evaluation.conference_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        {
                                                            evaluation.conference_url
                                                        }
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {evaluation.conference_meeting_id && (
                                            <div>
                                                <p className="text-xs text-gray-600">
                                                    ID de réunion
                                                </p>
                                                <div className="mt-1 font-mono text-sm text-gray-800">
                                                    {
                                                        evaluation.conference_meeting_id
                                                    }
                                                </div>
                                            </div>
                                        )}
                                        {evaluation.conference_passcode && (
                                            <div>
                                                <p className="text-xs text-gray-600">
                                                    Code d'accès
                                                </p>
                                                <div className="mt-1 font-mono text-sm text-gray-800">
                                                    {
                                                        evaluation.conference_passcode
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </fieldset>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayouts>
    );
}
