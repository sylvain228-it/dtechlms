import { TagsInputBadge } from '@/components/shared/tags-input';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import {
    getDeliverableTypeLabel,
    getEvaluateTypeLabel,
    getModalityTypeLabel,
    getPlateformeConferenceLabel,
} from '@/lib/type';
import { formatBooleanText, formatDate } from '@/lib/utils';
import {
    destroyEvaluation as destroy,
    editEvaluation as edit,
} from '@/routes/teachers/evaluations';
import { entityQuizzes } from '@/routes/teachers/quizzes';
import { Evaluation } from '@/types/models/others';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Edit, Trash } from 'lucide-react';

type Props = {
    evaluation: Evaluation;
    entity_type: string;
    entity_id: number;
};
export default function TeacherEvaluationShow() {
    const { entity_type, entity_id, evaluation } = usePage()
        .props as unknown as Props;

    const handleDelete = () => {
        if (!confirm('Confirmer la suppression de cette évaluation ?')) return;
        router.delete(destroy([evaluation.slug, entity_type, entity_id]));
    };

    return (
        <TeacherLayouts title={`Evaluation : ${evaluation.title}`}>
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            {evaluation.title}
                        </h1>
                        <div className="mt-2 flex gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Type : </span>
                                <span>
                                    {getEvaluateTypeLabel(
                                        evaluation.evaluation_type,
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Mode : </span>
                                <span>
                                    {getModalityTypeLabel(evaluation.modality)}
                                </span>
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
                        <Link
                            href={edit([
                                evaluation.slug,
                                entity_type,
                                entity_id,
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

                {/* Content grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main column */}
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
                                            ? `${evaluation.weight}${evaluation.note_unit || '%'}`
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
                                        {formatDate(evaluation.scheduled_at) ||
                                            '—'}
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

                        {/* Ressources */}
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
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Fournir des retours
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!evaluation.provides_feedback,
                                        )}
                                    </div>
                                </div>
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
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Max tentatives
                                    </p>
                                    <div className="mt-1 font-medium">
                                        {evaluation.max_attempts ?? '—'}
                                    </div>
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
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Fenêtre temporelle
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-600">
                                        Début
                                    </p>
                                    <div className="mt-1 text-sm">
                                        {formatDate(evaluation.start_at) || '—'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Fin</p>
                                    <div className="mt-1 text-sm">
                                        {formatDate(evaluation.end_at) || '—'}
                                    </div>
                                </div>
                            </div>
                            {evaluation.deliverable_type && (
                                <div className="mt-3">
                                    <p className="text-xs text-gray-600">
                                        Type de livrable
                                    </p>
                                    <div className="mt-1 text-sm">
                                        {getDeliverableTypeLabel(
                                            evaluation.deliverable_type as
                                                | 'file'
                                                | 'link'
                                                | 'text'
                                                | 'video'
                                                | 'audio'
                                                | 'github_repo_link',
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                                    {evaluation.conference_url}
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
                                                {evaluation.conference_passcode}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </fieldset>
                        )}
                    </div>

                    {/* Right column (meta) */}
                    <aside className="col-span-1">
                        <fieldset className="mb-6 rounded border border-gray-200 p-4">
                            <legend className="text-base font-semibold text-gray-900">
                                Métadonnées
                            </legend>

                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Statut
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {getEvaluateTypeLabel(
                                            evaluation.status,
                                        ) || '—'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Quiz associé
                                    </div>
                                    <Link
                                        href={entityQuizzes([
                                            'evaluation',
                                            evaluation.id,
                                        ])}
                                    >
                                        <div className="flex items-center gap-1">
                                            <dt className="font-bold text-app-blue">
                                                Liste/ajouter
                                            </dt>
                                            <ArrowRight className="text-app-blue" />
                                        </div>
                                    </Link>
                                </div>

                                <hr className="my-3" />

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Créé
                                    </div>
                                    <div className="mt-1 text-xs">
                                        {formatDate(evaluation.created_at)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Mis à jour
                                    </div>
                                    <div className="mt-1 text-xs">
                                        {formatDate(evaluation.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
