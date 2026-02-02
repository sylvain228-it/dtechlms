import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { TagsInput } from '@/components/shared/tags-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import {
    deliverableTypeLabels,
    EvaluateType,
    evaluateTypeLabels,
    langueLabels,
    ModalityType,
    modalityTypeLabels,
    noteUnitLabels,
    plateformeConferenceLabels,
} from '@/lib/type';
import { store, update } from '@/routes/teachers/evaluations';
import { CourseActivity } from '@/types/models/course';
import { Evaluation } from '@/types/models/others';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

type Props = {
    activity: CourseActivity;
    evaluation?: Evaluation;
    c_modality: ModalityType;
};
export default function EvaluationForm() {
    const { activity, evaluation, c_modality } = usePage()
        .props as unknown as Props;
    const isEdit = !!evaluation;
    const { errors } = usePage().props;
    const { data, setData, reset } = useForm({
        activity_id: activity.id,
        // Identification
        title: evaluation?.title ?? '',
        description: evaluation?.description ?? '',
        quiz_id: evaluation?.quiz_id ?? null,

        // Typologie
        evaluation_type: evaluation?.evaluation_type ?? 'formative',
        modality: evaluation?.modality ?? c_modality,

        // Organisation
        weight: evaluation?.weight ?? null,
        max_score: evaluation?.max_score ?? null,
        duration_minutes: evaluation?.duration_minutes ?? null,
        scheduled_at: evaluation?.scheduled_at
            ? new Date(evaluation.scheduled_at).toISOString().slice(0, 16)
            : null,
        is_mandatory: evaluation?.is_mandatory ?? false,

        // Ressources
        allowed_tools:
            isEdit && evaluation.allowed_tools != null
                ? (JSON.parse(evaluation?.allowed_tools) as string[])
                : ([] as string[]),
        resources_summary: evaluation?.resources_summary ?? '',

        // Feedback
        provides_feedback: evaluation?.provides_feedback ?? true,
        feedback_instructions: evaluation?.feedback_instructions ?? '',

        // Avancé
        is_group: evaluation?.is_group ?? false,
        max_group_size: evaluation?.max_group_size ?? null,
        allows_resubmission: evaluation?.allows_resubmission ?? false,
        max_attempts: evaluation?.max_attempts ?? 1,

        // Fenêtre temporelle
        start_at: evaluation?.start_at
            ? new Date(evaluation.start_at).toISOString().slice(0, 16)
            : null,
        end_at: evaluation?.end_at
            ? new Date(evaluation.end_at).toISOString().slice(0, 16)
            : null,

        // Accès
        is_synchronous: evaluation?.is_synchronous ?? false,
        allow_late_submission: evaluation?.allow_late_submission ?? false,
        late_penalty_percentage: evaluation?.late_penalty_percentage ?? null,

        deliverable_type: evaluation?.deliverable_type ?? '',
        note_unit: evaluation?.note_unit ?? '',
        conference_platform: evaluation?.conference_platform ?? '',
        conference_url: evaluation?.conference_url ?? '',
        conference_meeting_id: evaluation?.conference_meeting_id ?? '',
        conference_passcode: evaluation?.conference_passcode ?? '',

        // Sécurité
        lock_after_end: evaluation?.lock_after_end ?? false,
        shuffle_questions: evaluation?.shuffle_questions ?? false,

        // Métadonnées
        language: evaluation?.language ?? 'fr',
    });

    const [processing, setProcessing] = useState(false);

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            ...data,
            _method: isEdit ? 'put' : 'post',
        };
        if (isEdit && evaluation?.id) {
            router.put(update([activity.id, evaluation.id]), payload, {
                onFinish: onFinish,
            });
        } else {
            router.post(store(activity.id), payload, {
                onFinish: onFinish,
            });
        }
    };

    function onFinish() {
        if (!isEdit) {
            reset();
        }
        setProcessing(false);
    }

    const isFormValid = Boolean(
        data.title && data.evaluation_type && data.modality && data.language,
    );

    return (
        <TeacherLayouts
            title={isEdit ? "Modifier l'évaluation" : 'Nouvelle évaluation'}
        >
            <div className="mx-auto mt-8 max-w-4xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        {isEdit
                            ? "Modifier l'évaluation"
                            : 'Créer une évaluation'}
                    </h2>

                    <Button
                        className="btn-primary"
                        disabled={!isFormValid || processing}
                        onClick={(e) => {
                            e.preventDefault();
                            submitForm(e as unknown as React.FormEvent);
                        }}
                    >
                        {processing && <Spinner />}
                        Enregistrer
                    </Button>
                </div>
                <div className="my-4 border-l-2 border-cblue p-3">
                    <h4 className=" ">
                        <span className="capitalize">évaluation</span> pour
                        l'activité{' '}
                        <b>
                            <i>{activity.title}</i>
                        </b>
                    </h4>
                </div>
                <form
                    onSubmit={submitForm}
                    className="rounded-lg border bg-white p-6 shadow"
                    method="POST"
                >
                    {/* Identification */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Identification
                        </legend>

                        <div className="mb-4">
                            <InputField
                                label="Titre"
                                value={data.title}
                                onChange={(v) => setData('title', v)}
                                required
                                error={errors.title}
                                placeholder="Titre de l'évaluation"
                            />
                        </div>

                        <div className="mb-4">
                            <TextareaField
                                label="Description"
                                value={data.description ?? ''}
                                onChange={(v) => setData('description', v)}
                                rows={3}
                                placeholder="Description détaillée de l'évaluation"
                                error={errors.description}
                            />
                        </div>
                    </fieldset>

                    {/* Typologie */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Typologie
                        </legend>

                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <SelectField
                                label="Type d'évaluation"
                                value={data.evaluation_type ?? ''}
                                onChange={(v) =>
                                    setData(
                                        'evaluation_type',
                                        v as EvaluateType,
                                    )
                                }
                                options={evaluateTypeLabels}
                                required
                                error={errors.evaluation_type}
                            />

                            {c_modality != 'asynchronous' && (
                                <SelectField
                                    label="Lieu de déroulement"
                                    value={data.modality ?? ''}
                                    onChange={(v) => {
                                        setData('modality', v as ModalityType);
                                        setData(
                                            'is_synchronous',
                                            v == 'asynchronous',
                                        );
                                    }}
                                    options={modalityTypeLabels}
                                    required
                                    error={errors.modality}
                                />
                            )}
                        </div>
                    </fieldset>

                    {/* Organisation */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Organisation
                        </legend>

                        <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            <SelectField
                                label="Unité de notation"
                                value={data.note_unit ?? 'fr'}
                                onChange={(v) => setData('note_unit', v)}
                                options={noteUnitLabels}
                                required
                                error={errors.note_unit}
                            />
                            <InputField
                                label={`Poids (${data.note_unit ?? ''})`}
                                type="number"
                                value={data.weight ?? ''}
                                onChange={(v) =>
                                    setData('weight', v ? Number(v) : null)
                                }
                                error={errors.weight}
                                placeholder="ex: 20"
                            />

                            <InputField
                                label="Score maximum"
                                type="number"
                                value={data.max_score ?? ''}
                                onChange={(v) =>
                                    setData('max_score', v ? Number(v) : null)
                                }
                                error={errors.max_score}
                                placeholder="ex: 100"
                            />
                        </div>

                        <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            <InputField
                                label="Durée (minutes)"
                                type="number"
                                value={data.duration_minutes ?? ''}
                                onChange={(v) =>
                                    setData(
                                        'duration_minutes',
                                        v ? Number(v) : null,
                                    )
                                }
                                error={errors.duration_minutes}
                                placeholder="ex: 60"
                            />

                            {data.modality != 'asynchronous' && (
                                <InputField
                                    label="Programmée le"
                                    type="datetime-local"
                                    value={data.scheduled_at ?? ''}
                                    onChange={(v) => setData('scheduled_at', v)}
                                    error={errors.scheduled_at}
                                />
                            )}

                            <div>
                                <CheckboxField
                                    label="Obligatoire"
                                    checked={!!data.is_mandatory}
                                    onChange={(v) => setData('is_mandatory', v)}
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Ressources */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Ressources et outils
                        </legend>

                        <div className="mb-4">
                            <TagsInput
                                label="Outils autorisés"
                                value={data.allowed_tools}
                                onChange={(val) =>
                                    setData('allowed_tools', val)
                                }
                                placeholder="ex: Calculatrice, dictionnaire, etc."
                            />
                        </div>

                        <div className="mb-4">
                            <TextareaField
                                label="Résumé des ressources"
                                value={data.resources_summary ?? ''}
                                onChange={(v) =>
                                    setData('resources_summary', v)
                                }
                                rows={2}
                                placeholder="Ressources disponibles pour cette évaluation"
                                error={errors.resources_summary}
                            />
                        </div>
                    </fieldset>

                    {/* Feedback */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Retour d'information
                        </legend>

                        <div className="mb-4">
                            <CheckboxField
                                label="Fournir des retours"
                                checked={!!data.provides_feedback}
                                onChange={(v) =>
                                    setData('provides_feedback', v)
                                }
                            />
                        </div>

                        <div className="mb-4">
                            <TextareaField
                                label="Instructions pour les retours"
                                value={data.feedback_instructions ?? ''}
                                onChange={(v) =>
                                    setData('feedback_instructions', v)
                                }
                                rows={3}
                                placeholder="Directives pour la fourniture de retours"
                                error={errors.feedback_instructions}
                            />
                        </div>
                    </fieldset>

                    {/* Paramètres avancés */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Paramètres avancés
                        </legend>

                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div>
                                <CheckboxField
                                    label="Travail en groupe"
                                    checked={!!data.is_group}
                                    onChange={(v) => setData('is_group', v)}
                                />
                            </div>

                            {data.is_group && (
                                <InputField
                                    label="Taille max du groupe"
                                    type="number"
                                    value={data.max_group_size ?? ''}
                                    onChange={(v) =>
                                        setData(
                                            'max_group_size',
                                            v ? Number(v) : null,
                                        )
                                    }
                                    error={errors.max_group_size}
                                    placeholder="ex: 5"
                                />
                            )}
                        </div>

                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div>
                                <CheckboxField
                                    label="Autoriser la resoumission"
                                    checked={!!data.allows_resubmission}
                                    onChange={(v) =>
                                        setData('allows_resubmission', v)
                                    }
                                />
                            </div>

                            <InputField
                                label="Max tentatives"
                                type="number"
                                value={data.max_attempts ?? 1}
                                onChange={(v) =>
                                    setData('max_attempts', v ? Number(v) : 1)
                                }
                                error={errors.max_attempts}
                                placeholder="ex: 3"
                            />
                        </div>

                        <SelectField
                            label="Type de soumission"
                            value={data.deliverable_type}
                            onChange={(v) => setData('deliverable_type', v)}
                            options={deliverableTypeLabels}
                            required
                            error={errors.deliverable_type}
                        />

                        {/* <div className="mb-4">
                            <CheckboxField
                                label="Mélanger les questions"
                                checked={!!data.shuffle_questions}
                                onChange={(v) =>
                                    setData('shuffle_questions', v)
                                }
                            />
                        </div> */}
                    </fieldset>
                    {/* Fenêtre temporelle */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Fenêtre temporelle
                        </legend>

                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <InputField
                                label="Début"
                                type="datetime-local"
                                value={data.start_at ?? ''}
                                onChange={(v) => setData('start_at', v)}
                                error={errors.start_at}
                            />

                            <InputField
                                label="Fin"
                                type="datetime-local"
                                value={data.end_at ?? ''}
                                onChange={(v) => setData('end_at', v)}
                                error={errors.end_at}
                            />
                        </div>
                    </fieldset>
                    {data.is_synchronous && (
                        <div>
                            {/* Visioconférence */}
                            <fieldset className="mb-6 rounded border border-gray-200 p-4">
                                <legend className="text-base font-semibold text-gray-900">
                                    Visioconférence
                                </legend>

                                <div className="grid gap-2 rounded border bg-gray-50 p-4">
                                    <SelectField
                                        label="Plateforme"
                                        value={data.conference_platform}
                                        onChange={(v) =>
                                            setData('conference_platform', v)
                                        }
                                        options={plateformeConferenceLabels}
                                        required
                                    />

                                    <InputField
                                        label="URL"
                                        required
                                        value={data.conference_url}
                                        onChange={(v) =>
                                            setData('conference_url', v)
                                        }
                                    />
                                    <InputField
                                        label="Meeting ID"
                                        value={data.conference_meeting_id}
                                        onChange={(v) =>
                                            setData('conference_meeting_id', v)
                                        }
                                    />
                                    <InputField
                                        label="Code"
                                        value={data.conference_passcode}
                                        onChange={(v) =>
                                            setData('conference_passcode', v)
                                        }
                                    />
                                </div>
                            </fieldset>
                        </div>
                    )}
                    {/* Accès */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Accès et soumission
                        </legend>

                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div>
                                <CheckboxField
                                    label="Synchrone"
                                    checked={!!data.is_synchronous}
                                    onChange={() => {}}
                                />
                            </div>

                            <div>
                                <CheckboxField
                                    label="Autoriser soumission tardive"
                                    checked={!!data.allow_late_submission}
                                    onChange={(v) =>
                                        setData('allow_late_submission', v)
                                    }
                                />
                            </div>
                        </div>

                        {data.allow_late_submission && (
                            <div className="mb-4">
                                <InputField
                                    label="Pénalité tardive (%)"
                                    type="number"
                                    value={data.late_penalty_percentage ?? ''}
                                    onChange={(v) =>
                                        setData(
                                            'late_penalty_percentage',
                                            v ? Number(v) : null,
                                        )
                                    }
                                    error={errors.late_penalty_percentage}
                                    placeholder="ex: 10"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <CheckboxField
                                label="Verrouiller après la fin"
                                checked={!!data.lock_after_end}
                                onChange={(v) => setData('lock_after_end', v)}
                            />
                        </div>
                    </fieldset>

                    {/* Métadonnées */}
                    <fieldset className="mb-6 rounded border border-gray-200 p-4">
                        <legend className="text-base font-semibold text-gray-900">
                            Métadonnées
                        </legend>

                        <div className="mb-4">
                            <SelectField
                                label="Langue"
                                value={data.language ?? 'fr'}
                                onChange={(v) => setData('language', v)}
                                options={langueLabels}
                                required
                                error={errors.language}
                            />
                        </div>
                    </fieldset>

                    {/* Footer actions */}
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => history.back()}
                            className="border"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={!isFormValid || processing}
                        >
                            {processing && <Spinner />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
