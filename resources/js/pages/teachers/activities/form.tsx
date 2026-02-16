import { router, useForm, usePage } from '@inertiajs/react';
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
    DeliverableType,
    deliverableTypeLabels,
    evaluateTypeLabels,
    FileType,
    fileTypeLabels,
    getDeliverableTypeLabel,
    getFileTypeLabel,
    ModalityType,
    modalityTypeLabels,
    noteUnitLabels,
    plateformeConferenceLabels,
} from '@/lib/type';

import { Divider } from '@/components/divider';
import { TagsInput } from '@/components/shared/tags-input';
import { Button } from '@/components/ui/button';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { ACTIVITY_RULES } from '@/lib/activityRules';
import { sendSyllabusToApi } from '@/lib/tasks';
import { getEntityData } from '@/routes/teachers';
import { store, update } from '@/routes/teachers/activities';
import {
    Course,
    CourseActivity,
    DeliverableRequirements,
} from '@/types/models/course';
import { Trash2 } from 'lucide-react';
import CustomTextEditor from '../courses/text-editor';

type DataType = {
    key: string;
    value: string;
};
export default function ActivityForm() {
    const { course, activity, c_modality, nextOrder } = usePage()
        .props as unknown as {
        course: Course;
        activity?: CourseActivity;
        c_modality: ModalityType;
        nextOrder?: number;
    };
    const { errors } = usePage().props;

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
        deliverable_deadline: activity?.deliverable_deadline
            ? new Date(activity.deliverable_deadline).toISOString().slice(0, 16)
            : null,
        deliverable_count: activity?.deliverable_count ?? 1,
        deliverable_type: '',
        allow_deliverable_file_type: '',
        deliverable_title: '',
        deliverable_max_size: 1,
        deliverable_types: '',
        deliverable_requirements: isEdit
            ? (activity?.deliv_requirements ??
              ([] as DeliverableRequirements[]))
            : ([] as DeliverableRequirements[]),

        is_evaluated: !!activity?.is_evaluated,
        evaluation_type: activity?.evaluation_type ?? '',
        evaluation_weight: activity?.evaluation_weight ?? null,
        evaluation_max_weight: activity?.evaluation_max_weight ?? null,
        note_unit: activity?.note_unit ?? '',
        allow_late_submission: !!activity?.allow_late_submission,

        late_penalty_percentage: activity?.late_penalty_percentage ?? null,
        lock_after_end: !!activity?.lock_after_end,

        requires_feedback: !!activity?.requires_feedback,
        allows_resubmission: !!activity?.allows_resubmission,
        max_attempts: activity?.max_attempts ?? null,

        is_synchronous: !!activity?.is_synchronous,
        start_at: activity?.start_at
            ? new Date(activity.start_at).toISOString().slice(0, 16)
            : null,

        // Ressources
        allowed_tools:
            isEdit && activity?.allowed_tools != null
                ? (JSON.parse(activity?.allowed_tools) as string[])
                : ([] as string[]),

        // Feedback
        feedback_instructions: activity?.feedback_instructions ?? '',
        duration_minutes: activity?.duration_minutes ?? null,

        conference_platform: activity?.conference_platform ?? '',
        conference_url: activity?.conference_url ?? '',
        conference_meeting_id: activity?.conference_meeting_id ?? '',
        conference_passcode: activity?.conference_passcode ?? '',

        attendance_required: activity?.attendance_required,
        is_mandatory: activity?.is_mandatory,
        is_visible: activity?.is_visible ?? true,
    });

    console.log('req ', activity?.deliv_requirements);
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
            setData('order', nextOrder ?? '');
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
                setData('order', result.nextOrder);
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
            await sendSyllabusToApi(isEdit ? (activity?.id ?? 0) : 0).then(
                () => {
                    setData('is_synchronous', is_synchronous);
                    const payload = {
                        ...data,
                        allowed_tools: JSON.stringify(data.allowed_tools),
                        deliverable_requirements: JSON.stringify(
                            data.deliverable_requirements,
                        ),
                    };

                    if (isEdit && activity) {
                        router.put(
                            update([course.slug, activity.id]),
                            payload,
                            {
                                onFinish: () => setProcessing(false),
                            },
                        );
                    } else {
                        router.post(store(course.slug), payload, {
                            onFinish: () => {
                                setProcessing(false);
                                console.log('errors', errors);
                            },
                        });
                    }
                },
            );
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
            (!data.has_deliverable ||
                data.deliverable_requirements.length ===
                    data.deliverable_count),
    );
    const showSelectEntity =
        modulesData.length > 0 ||
        sequencesData.length > 0 ||
        data.scope == 'course';
    function setDeliverableRequirements(e: React.MouseEvent) {
        e.preventDefault();
        if (
            !data.has_deliverable ||
            !data.deliverable_title ||
            !data.deliverable_type ||
            data.deliverable_requirements.length === data.deliverable_count
        )
            return;
        let id = 1;
        if (
            data.deliverable_requirements &&
            data.deliverable_requirements.length > 0
        ) {
            id =
                data.deliverable_requirements[
                    data.deliverable_requirements.length - 1
                ].id + 1;
        }
        setData('deliverable_requirements', [
            ...data.deliverable_requirements,

            {
                id: id,
                order: id,
                title: data.deliverable_title,
                file_type: data.deliverable_type as DeliverableType,
                max_size_mb: data.deliverable_max_size,
                allowed_file_type:
                    data.deliverable_type == 'file'
                        ? data.allow_deliverable_file_type
                        : undefined,
            },
        ]);
    }
    const showRequirementsForm =
        data.has_deliverable &&
        data.deliverable_count > 0 &&
        data.deliverable_requirements.length < data.deliverable_count;
    const showRequirements = Boolean(
        data.has_deliverable && data.deliverable_requirements.length > 0,
    );
    const disabledRequirementBtn = Boolean(
        !data.deliverable_title ||
            !data.deliverable_type ||
            (data.deliverable_type == 'file' &&
                !data.allow_deliverable_file_type),
    );
    return (
        <TeacherLayouts
            title={isEdit ? 'Modifier activité' : 'Nouvelle activité'}
        >
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
                    className="rounded-lg border bg-white p-3 shadow sm:p-6"
                >
                    {/* INFOS GÉNÉRALES */}

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
                            error={errors.scope}
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
                                error={errors.modality}
                            />
                        )}{' '}
                    </div>

                    {showSelectEntity && (
                        <fieldset className="my-5 rounded border border-gray-200 p-4">
                            <legend className="text-base font-semibold text-gray-900">
                                Organisation dans le cours
                            </legend>
                            {modulesData.length > 0 && (
                                <div className="my-2">
                                    <SelectField
                                        label="Liste des modules"
                                        emptyOption="Sélectionner un module"
                                        value={data.module_id.toString()}
                                        onChange={(v) =>
                                            setData('module_id', Number(v))
                                        }
                                        options={modulesData}
                                        required
                                        error={errors.module_id}
                                    />
                                </div>
                            )}
                            {sequencesData.length > 0 && (
                                <div className="my-2">
                                    <SelectField
                                        label="Liste des séquences"
                                        emptyOption="Sélectionner une séquence"
                                        value={data.sequence_id.toString()}
                                        onChange={(v) =>
                                            setData('sequence_id', Number(v))
                                        }
                                        options={sequencesData}
                                        required
                                        error={errors.sequence_id}
                                    />
                                </div>
                            )}
                            {data.course_id != '' && data.scope == 'course' && (
                                <div className="text-md my-2 block rounded-sm border bg-gray-100/50 p-2 font-bold text-gray-600 sm:text-xl">
                                    {course.title}
                                </div>
                            )}

                            <div className="mt-3">
                                <InputField
                                    label="Ordre"
                                    type="number"
                                    required
                                    value={data.order ?? ''}
                                    onChange={(v) =>
                                        setData('order', Number(v))
                                    }
                                    error={errors.order}
                                />
                            </div>
                        </fieldset>
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
                                        required
                                        error={errors.evaluation_type}
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
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <InputField
                                            label={`Note maximale (${data.note_unit})`}
                                            type="number"
                                            value={
                                                data.evaluation_max_weight ?? ''
                                            }
                                            required
                                            onChange={(v) =>
                                                setData(
                                                    'evaluation_max_weight',
                                                    v ? Number(v) : null,
                                                )
                                            }
                                            error={errors.evaluation_max_weight}
                                        />
                                        <InputField
                                            label={`Moyènne (${data.note_unit})`}
                                            type="number"
                                            required
                                            value={data.evaluation_weight ?? ''}
                                            onChange={(v) =>
                                                setData(
                                                    'evaluation_weight',
                                                    v ? Number(v) : null,
                                                )
                                            }
                                            error={errors.evaluation_weight}
                                        />
                                    </div>
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
                                <InputField
                                    label="Nombre de soumissions attendues"
                                    type="number"
                                    value={data.deliverable_count ?? 1}
                                    min="1"
                                    required
                                    onChange={(v) =>
                                        setData('deliverable_count', Number(v))
                                    }
                                    error={errors.deliverable_count}
                                />

                                <InputField
                                    label="Date limite"
                                    type="datetime-local"
                                    value={data.deliverable_deadline ?? ''}
                                    onChange={(v) =>
                                        setData('deliverable_deadline', v)
                                    }
                                    error={errors.deliverable_deadline}
                                />
                                <fieldset className="mb-4 rounded border border-gray-200 p-4 shadow-md sm:col-span-2">
                                    <legend className="text-sm font-medium text-gray-900">
                                        Infos sur le(s) livrable(s) attendue(s)
                                    </legend>
                                    {errors &&
                                        errors.deliverable_requirements && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors.deliverable_requirements
                                                }
                                            </p>
                                        )}
                                    {showRequirementsForm && (
                                        <div>
                                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                <InputField
                                                    label="Titre du livrable"
                                                    type="text"
                                                    value={
                                                        data.deliverable_title
                                                    }
                                                    placeholder='ex: "Rapport de laboratoire", "Fichier de code", "Document de réflexion", etc.'
                                                    required
                                                    onChange={(v) =>
                                                        setData(
                                                            'deliverable_title',
                                                            v,
                                                        )
                                                    }
                                                />
                                                <InputField
                                                    label="Taille maximum (en Mo)"
                                                    type="number"
                                                    value={
                                                        data.deliverable_max_size ??
                                                        1
                                                    }
                                                    min="1"
                                                    required
                                                    onChange={(v) =>
                                                        setData(
                                                            'deliverable_max_size',
                                                            Number(v),
                                                        )
                                                    }
                                                />
                                                <SelectField
                                                    label="Type de soumission"
                                                    value={
                                                        data.deliverable_type as DeliverableType
                                                    }
                                                    emptyOption='ex: "Fichier", "Texte en ligne", "Lien vers un dépôt Git", etc.'
                                                    onChange={(v) =>
                                                        setData(
                                                            'deliverable_type',
                                                            v,
                                                        )
                                                    }
                                                    options={
                                                        deliverableTypeLabels
                                                    }
                                                    required
                                                />

                                                {data.deliverable_type ==
                                                    'file' && (
                                                    <SelectField
                                                        label="Type de fichier autorisé"
                                                        value={
                                                            data.allow_deliverable_file_type ??
                                                            ('' as FileType)
                                                        }
                                                        onChange={(v) =>
                                                            setData(
                                                                'allow_deliverable_file_type',
                                                                v as FileType,
                                                            )
                                                        }
                                                        options={fileTypeLabels}
                                                        disabled={
                                                            data.deliverable_type !=
                                                            'file'
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <button
                                                className={`btn-primary mt-4 ${
                                                    disabledRequirementBtn &&
                                                    'cursor-not-allowed opacity-50'
                                                }`}
                                                onClick={
                                                    setDeliverableRequirements
                                                }
                                                disabled={
                                                    disabledRequirementBtn
                                                }
                                            >
                                                Ajouter un livrable attendu
                                            </button>
                                        </div>
                                    )}

                                    {showRequirements && (
                                        <div className="mt-4">
                                            {showRequirementsForm && (
                                                <Divider />
                                            )}
                                            <h3 className="mb-2 text-lg font-semibold">
                                                Livrables attendus
                                            </h3>

                                            {data.deliverable_requirements.map(
                                                (req) => (
                                                    <div
                                                        key={req.id}
                                                        className="p- mb-2 rounded border bg-gray-100 p-3 shadow-sm"
                                                    >
                                                        <div className="flex flex-wrap items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {req.title}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Type:{' '}
                                                                    {getDeliverableTypeLabel(
                                                                        req.file_type as DeliverableType,
                                                                    )}
                                                                </p>
                                                                {req.file_type ==
                                                                    'file' && (
                                                                    <p className="text-sm text-gray-600">
                                                                        Fichier
                                                                        autorisé
                                                                        :{' '}
                                                                        {getFileTypeLabel(
                                                                            req.allowed_file_type as FileType,
                                                                        )}
                                                                    </p>
                                                                )}
                                                                {req.max_size_mb && (
                                                                    <p className="text-sm text-gray-600">
                                                                        Taille
                                                                        max:{' '}
                                                                        {
                                                                            req.max_size_mb
                                                                        }{' '}
                                                                        Mo
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setData(
                                                                        'deliverable_requirements',
                                                                        data.deliverable_requirements.filter(
                                                                            (
                                                                                r,
                                                                            ) =>
                                                                                r.id !==
                                                                                req.id,
                                                                        ),
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </fieldset>
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
                                        error={errors.max_attempts}
                                    />
                                )}
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <CheckboxField
                                    label="Autoriser soumission tardive"
                                    checked={!!data.allow_late_submission}
                                    onChange={(v) =>
                                        setData('allow_late_submission', v)
                                    }
                                />
                                {data.allow_late_submission && (
                                    <div className="mb-4">
                                        <InputField
                                            label="Pénalité tardive (%)"
                                            type="number"
                                            value={
                                                data.late_penalty_percentage ??
                                                ''
                                            }
                                            onChange={(v) =>
                                                setData(
                                                    'late_penalty_percentage',
                                                    v ? Number(v) : null,
                                                )
                                            }
                                            error={
                                                errors.late_penalty_percentage
                                            }
                                            placeholder="ex: 10"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <CheckboxField
                                    label="Verrouiller après la fin"
                                    checked={!!data.lock_after_end}
                                    onChange={(v) =>
                                        setData('lock_after_end', v)
                                    }
                                />
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
                                            error={errors.max_group_size}
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
                                        error={errors.start_at}
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
                                        error={errors.duration_minutes}
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
                                                error={
                                                    errors.conference_platform
                                                }
                                            />

                                            <InputField
                                                label="URL"
                                                required
                                                value={data.conference_url}
                                                onChange={(v) =>
                                                    setData('conference_url', v)
                                                }
                                                error={errors.conference_url}
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
                                                error={
                                                    errors.conference_meeting_id
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
                                                error={
                                                    errors.conference_passcode
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Ressources */}
                    <fieldset className="my-5 rounded border border-gray-200 p-4">
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
                    </fieldset>

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
                    <div className="my-6">
                        {/* Feedback */}
                        {rules?.canRequestFeedback && (
                            <fieldset className="mb-6 rounded border border-gray-200 p-4">
                                <legend className="text-base font-semibold text-gray-900">
                                    Retour d'information
                                </legend>
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
                        )}
                    </div>
                    <CheckboxField
                        label="Visible"
                        checked={data.is_visible == true}
                        onChange={(v) => setData('is_visible', v)}
                    />

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
                    <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
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
