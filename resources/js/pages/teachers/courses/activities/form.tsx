import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';

import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { Spinner } from '@/components/ui/spinner';

import {
    ActivityScope,
    activityScopeLabels,
    ActivityType,
    activityTypeLabels,
    deliverableTypeLabels,
    evaluateTypeLabels,
    ModalityType,
    modalityTypeLabels,
    noteUnitLabels,
    plateformeConferenceLabels,
} from '@/lib/type';

import { Button } from '@/components/ui/button';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { ACTIVITY_RULES } from '@/lib/activityRules';
import { sendSyllabusToApi } from '@/lib/tasks';
import { getEntityData } from '@/routes/teachers';
import { store, update } from '@/routes/teachers/activities';
import { Course, CourseActivity } from '@/types/models/course';
import CustomTextEditor from '../text-editor';

type DataType = {
    key: string;
    value: string;
};
export default function ActivityForm() {
    const { course, activity, c_modality } = usePage().props as unknown as {
        course: Course;
        activity?: CourseActivity;
        c_modality: ModalityType;
    };
    const { errors } = usePage().props;
    console.log('error', errors);

    const isEdit = Boolean(activity);

    const { data, setData } = useForm({
        parent_course_id: course.id,
        course_id: activity?.course_id ?? '',
        module_id: activity?.module_id ?? '',
        sequence_id: activity?.sequence_id ?? '',

        title: activity?.title ?? '',
        description: activity?.description ?? '',
        activity_type: activity?.activity_type ?? '',
        order: activity?.order ?? '',
        estimated_minutes: activity?.estimated_minutes ?? null,
        scope: activity?.scope ?? '',

        modality: activity?.modality ?? course.modality,
        is_individual: !!activity?.is_individual,
        is_collaborative: !!activity?.is_collaborative,
        max_group_size: activity?.max_group_size ?? null,

        has_deliverable: !!activity?.has_deliverable,
        deliverable_type: activity?.deliverable_type ?? '',
        deliverable_deadline: activity?.deliverable_deadline ?? null,

        is_evaluated: !!activity?.is_evaluated,
        evaluation_type: activity?.evaluation_type ?? '',
        evaluation_weight: activity?.evaluation_weight ?? null,
        note_unit: activity?.note_unit ?? '',

        resources_summary: activity?.resources_summary ?? '',

        requires_feedback: !!activity?.requires_feedback,
        allows_resubmission: !!activity?.allows_resubmission,
        max_attempts: activity?.max_attempts ?? null,

        is_synchronous: !!activity?.is_synchronous,
        start_at: activity?.start_at
            ? new Date(activity.start_at).toISOString().slice(0, 16)
            : null,
        duration_minutes: activity?.duration_minutes ?? null,

        conference_platform: activity?.conference_platform ?? '',
        conference_url: activity?.conference_url ?? '',
        conference_meeting_id: activity?.conference_meeting_id ?? '',
        conference_passcode: activity?.conference_passcode ?? '',

        attendance_required: activity?.attendance_required,
        is_mandatory: activity?.is_mandatory,
        is_visible: activity?.is_visible ?? true,
    });

    const [processing, setProcessing] = useState(false);

    const rules = useMemo(
        () =>
            data.activity_type
                ? ACTIVITY_RULES[data.activity_type as ActivityType]
                : null,
        [data.activity_type],
    );

    useEffect(() => {
        if (!rules?.canBeEvaluated && data.is_evaluated) {
            setData('is_evaluated', false);
            setData('evaluation_type', '');
            setData('evaluation_weight', null);
        }
    }, [data.is_evaluated, rules?.canBeEvaluated, setData]);

    useEffect(() => {
        if (data.activity_type == 'assessment') {
            setData('is_evaluated', true);
        }
    }, [data.is_evaluated, data.activity_type, setData]);

    useEffect(() => {
        if (!rules?.canHaveDeliverable && data.has_deliverable) {
            setData('has_deliverable', false);
            setData('deliverable_type', '');
            setData('deliverable_deadline', null);
        }
    }, [data.has_deliverable, rules?.canHaveDeliverable, setData]);

    useEffect(() => {
        if (data.is_collaborative) {
            setData('is_individual', false);
        }
        if (data.is_individual) {
            setData('is_collaborative', false);
            setData('max_group_size', null);
        }
    }, [data.is_collaborative, data.is_individual, setData]);

    useEffect(() => {
        if (data.attendance_required) {
            setData('is_mandatory', true);
        }
    }, [data.attendance_required, setData]);

    useEffect(() => {
        if (data.activity_type == 'discussion') {
            setData('is_individual', false);
            setData('is_collaborative', true);
        }
    }, [data.activity_type, setData]);

    /* =======================
       LOGIQUE DÉRIVÉE
    ======================= */
    const showGroupSize = data.is_collaborative;
    const showEvaluation = data.is_evaluated;
    const showResubmission = data.allows_resubmission;
    const showConference =
        data.modality == 'online' || data.modality == 'hybrid';

    const [isRequesting, setIsRequesting] = React.useState(false);
    const [modulesData, setModulesData] = useState<DataType[]>([]);
    const [sequencesData, setSequencesData] = useState<DataType[]>([]);

    async function fetchDataFromApi(type: ActivityScope) {
        setModulesData([]);
        setSequencesData([]);
        setData('module_id', '');
        setData('sequence_id', '');
        if (type == 'course') {
            setData('course_id', course.id);
            return;
        }
        setData('course_id', '');

        try {
            setIsRequesting(true);
            const res = await fetch(
                `${getEntityData(course.slug).url}?scope=${type.toLowerCase()}`,
                {
                    method: 'GET',
                },
            );
            const result = await res.json();
            console.log('result', result);
            setIsRequesting(false);
            if (result.status == 200) {
                const entityData: DataType[] = [];
                for (const item of result.data) {
                    entityData.push({
                        key: item.id as unknown as string,
                        value: (item.title ?? item.name) as string,
                    });
                }
                console.log('daaa', entityData);
                if (type == 'module') {
                    setModulesData(entityData);
                    setSequencesData([]);
                } else if (type == 'sequence') {
                    setSequencesData(entityData);
                    setModulesData([]);
                }

                // handle success
            } else {
                // handle failure
                console.error('Donnée non trouvé');
                console.error('result.message', result.message);
            }
        } catch (err) {
            console.error('Erreur', err);
        }
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        async function submitSyllabusToApi() {
            await sendSyllabusToApi(isEdit ? activity?.id : 0).then(() => {
                const payload = {
                    ...data,
                    _method: isEdit ? 'put' : 'post',
                };
                setData('is_synchronous', is_synchronous);

                if (isEdit && activity) {
                    router.put(update([course.slug, activity.id]), payload, {
                        onFinish: () => setProcessing(false),
                    });
                } else {
                    router.post(store(course.slug), payload, {
                        onFinish: () => setProcessing(false),
                    });
                }
            });
        }
        submitSyllabusToApi();
    };
    function submitFormByClick(e: React.MouseEvent) {
        e.preventDefault();
        handleSubmit(e);
    }
    const is_synchronous = data.modality && data.modality != 'asynchronous';
    const isFormValid = Boolean(
        data.title &&
            data.activity_type &&
            data.modality &&
            (!is_synchronous || (data.start_at && data.duration_minutes)) &&
            (!data.is_evaluated || data.evaluation_type) &&
            (!data.has_deliverable || data.deliverable_type),
    );

    return (
        <TeacherLayouts
            title={isEdit ? 'Modifier activité' : 'Nouvelle activité'}
        >
            <Head title={isEdit ? 'Modifier activité' : 'Nouvelle activité'} />

            <div className="mx-auto mt-8 max-w-4xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h2 className="mb-4 text-lg font-semibold">
                        {isEdit ? "Modifier l'activité" : 'Nouvelle activité'}
                    </h2>
                    <Button
                        className="btn-primary"
                        disabled={processing || !isFormValid}
                        onClick={submitFormByClick}
                    >
                        {processing && <Spinner />}
                        {'Enregistrer'}
                    </Button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg border bg-white p-6 shadow"
                >
                    {/* INFOS GÉNÉRALES */}

                    <div className="mb-2">
                        <InputField
                            label="Ordre"
                            type="number"
                            required
                            value={data.order ?? ''}
                            onChange={(v) => setData('order', Number(v))}
                        />
                    </div>
                    <div className="mb-2">
                        <InputField
                            label="Titre"
                            value={data.title}
                            onChange={(v) => setData('title', v)}
                            error={errors.title}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <TextareaField
                            label="Description"
                            rows={3}
                            value={data.description}
                            onChange={(val) => setData('description', val)}
                            error={errors.description}
                        />
                    </div>

                    <div className="mb-4">
                        <SelectField
                            label="Type d'activité"
                            value={data.activity_type}
                            onChange={(v) => setData('activity_type', v)}
                            options={activityTypeLabels}
                            required
                        />
                    </div>
                    <div className="mb-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <SelectField
                            label="Portée"
                            value={data.scope}
                            disabled={isRequesting}
                            onChange={(v) => {
                                setData('scope', v as ActivityScope);
                                if (v != data.scope) {
                                    fetchDataFromApi(v as ActivityScope);
                                }
                            }}
                            options={activityScopeLabels}
                            required
                        />
                        {c_modality != 'asynchronous' && (
                            <SelectField
                                label="Mode de déroulement"
                                value={data.modality}
                                onChange={(v) =>
                                    setData('modality', v as ModalityType)
                                }
                                options={modalityTypeLabels}
                                required
                            />
                        )}{' '}
                    </div>

                    {modulesData.length > 0 && (
                        <div className="my-4">
                            <SelectField
                                label="Liste des modules"
                                emptyOption="Sélectionner un module"
                                value={data.module_id.toString()}
                                onChange={(v) =>
                                    setData('module_id', Number(v))
                                }
                                options={modulesData}
                                required
                            />
                        </div>
                    )}
                    {sequencesData.length > 0 && (
                        <div className="my-4">
                            <SelectField
                                label="Liste des séquences"
                                emptyOption="Sélectionner une séquence"
                                value={data.sequence_id.toString()}
                                onChange={(v) =>
                                    setData('sequence_id', Number(v))
                                }
                                options={sequencesData}
                                required
                            />
                        </div>
                    )}
                    {data.course_id != '' && data.scope == 'course' && (
                        <div className="text-md my-4 block rounded-sm border bg-gray-100/50 p-2 font-bold text-gray-600 sm:text-xl">
                            {course.title}
                        </div>
                    )}

                    {rules?.canBeEvaluated && (
                        <CheckboxField
                            label="Activité évaluée"
                            checked={data.is_evaluated}
                            onChange={(v) => {
                                if (data.activity_type != 'assessment') {
                                    setData('is_evaluated', v);
                                }
                            }}
                        />
                    )}

                    {/*ÉVALUATION */}
                    {data.is_evaluated && (
                        <div className="my-6 rounded border bg-gray-50 p-4">
                            {showEvaluation && (
                                <div className="mt-2 grid gap-2">
                                    <SelectField
                                        label="Type d'évaluation"
                                        value={data.evaluation_type}
                                        onChange={(v) =>
                                            setData('evaluation_type', v)
                                        }
                                        options={evaluateTypeLabels}
                                    />
                                    <SelectField
                                        label="Unité de notation"
                                        value={data.note_unit ?? 'fr'}
                                        onChange={(v) =>
                                            setData('note_unit', v)
                                        }
                                        options={noteUnitLabels}
                                        required
                                        error={errors.note_unit}
                                    />
                                    <InputField
                                        label={`Poids (${data.note_unit})`}
                                        type="number"
                                        value={data.evaluation_weight ?? ''}
                                        onChange={(v) =>
                                            setData(
                                                'evaluation_weight',
                                                v ? Number(v) : null,
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {rules?.canHaveDeliverable && (
                        <CheckboxField
                            label="Soumission requise"
                            checked={data.has_deliverable}
                            onChange={(v) => setData('has_deliverable', v)}
                        />
                    )}

                    {/* SOUMISSION */}
                    {data.has_deliverable && (
                        <div className="my-6">
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <SelectField
                                    label="Type de soumission"
                                    value={data.deliverable_type}
                                    onChange={(v) =>
                                        setData('deliverable_type', v)
                                    }
                                    options={deliverableTypeLabels}
                                    required
                                />

                                <InputField
                                    label="Date limite"
                                    type="datetime-local"
                                    value={data.deliverable_deadline ?? ''}
                                    onChange={(v) =>
                                        setData('deliverable_deadline', v)
                                    }
                                />
                            </div>
                            <div className="mt-4 flex gap-3">
                                <CheckboxField
                                    label="Re soumission"
                                    checked={data.allows_resubmission}
                                    onChange={(r) =>
                                        setData('allows_resubmission', r)
                                    }
                                />
                                {showResubmission && (
                                    <InputField
                                        label="Nombre maximum"
                                        type="number"
                                        value={data.max_attempts ?? ''}
                                        onChange={(v) =>
                                            setData(
                                                'max_attempts',
                                                v ? Number(v) : null,
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* group  */}
                    {rules?.allowGroupWork &&
                        data.activity_type != 'discussion' && (
                            <div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="flex gap-4">
                                        {!data.is_collaborative && (
                                            <CheckboxField
                                                label="Individuel"
                                                checked={data.is_individual}
                                                onChange={(c) =>
                                                    setData('is_individual', c)
                                                }
                                            />
                                        )}

                                        {!data.is_individual && (
                                            <CheckboxField
                                                label="Collaboratif"
                                                checked={data.is_collaborative}
                                                onChange={(c) =>
                                                    setData(
                                                        'is_collaborative',
                                                        c,
                                                    )
                                                }
                                            />
                                        )}
                                    </div>

                                    {showGroupSize && (
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
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                    {/* SYNCHRONISATION */}
                    {c_modality != 'asynchronous' &&
                        data.modality &&
                        data.modality != 'asynchronous' && (
                            <div className="mt-6">
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <InputField
                                        label="Début"
                                        required
                                        type="datetime-local"
                                        value={data.start_at ?? ''}
                                        onChange={(v) => setData('start_at', v)}
                                    />

                                    <InputField
                                        label="Durée (min)"
                                        type="number"
                                        required
                                        value={data.duration_minutes ?? ''}
                                        onChange={(v) =>
                                            setData(
                                                'duration_minutes',
                                                v ? Number(v) : null,
                                            )
                                        }
                                    />
                                </div>
                                {showConference && (
                                    <div>
                                        {/* VISIOCONFÉRENCE */}

                                        <div className="mt-6 grid gap-2 rounded border bg-gray-50 p-4">
                                            <h3 className="mb-3 font-semibold">
                                                Visioconférence
                                            </h3>
                                            <SelectField
                                                label="Plateforme"
                                                value={data.conference_platform}
                                                onChange={(v) =>
                                                    setData(
                                                        'conference_platform',
                                                        v,
                                                    )
                                                }
                                                options={
                                                    plateformeConferenceLabels
                                                }
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
                                                value={
                                                    data.conference_meeting_id
                                                }
                                                onChange={(v) =>
                                                    setData(
                                                        'conference_meeting_id',
                                                        v,
                                                    )
                                                }
                                            />
                                            <InputField
                                                label="Code"
                                                value={data.conference_passcode}
                                                onChange={(v) =>
                                                    setData(
                                                        'conference_passcode',
                                                        v,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {data.modality != 'asynchronous' && (
                            <CheckboxField
                                label="Présence obligatoire"
                                checked={data.attendance_required as boolean}
                                onChange={(v) =>
                                    setData('attendance_required', v)
                                }
                            />
                        )}

                        {data.modality == 'asynchronous' && (
                            <CheckboxField
                                label="Est Obligatoire"
                                checked={data.is_mandatory as boolean}
                                onChange={(v) => setData('is_mandatory', v)}
                            />
                        )}

                        <CheckboxField
                            label="Activité en temps réel"
                            checked={is_synchronous}
                            onChange={() => null}
                        />
                    </div>
                    <div className="my-6 grid gap-3 sm:grid-cols-2">
                        {rules?.canRequestFeedback && (
                            <div className="my-3">
                                {' '}
                                <CheckboxField
                                    label="Feedback enseignant requis."
                                    checked={data.requires_feedback}
                                    onChange={(val) =>
                                        setData('requires_feedback', val)
                                    }
                                />
                            </div>
                        )}
                        <CheckboxField
                            label="Visible"
                            checked={data.is_visible == true}
                            onChange={(v) => setData('is_visible', v)}
                        />
                    </div>

                    <div className="my-6">
                        <h3 className="mb-3 text-2xl font-semibold">
                            Ressources pédagogiques
                        </h3>
                        <CustomTextEditor isNew={!isEdit} />
                        <p className="text-xs text-red-500">
                            {errors.resources_summary}
                        </p>
                    </div>
                    {/* =======================
                        ACTIONS
                    ======================= */}
                    <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={() => history.back()}
                            className="rounded border px-4 py-2"
                        >
                            Annuler
                        </button>

                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={processing || !isFormValid}
                        >
                            {processing && <Spinner />}
                            {isEdit ? 'Enregistrer' : "Ajouter l'activité"}
                        </Button>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
