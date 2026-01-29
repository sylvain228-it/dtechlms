import { SelectField } from '@/components/shared/form';
import { TagsInput } from '@/components/shared/tags-input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { sendSyllabusToApi } from '@/lib/tasks';
import { modalityTypeLabels, moduleTypeLabels } from '@/lib/type';
import { store, update } from '@/routes/teachers/modules';
import { Course, Module } from '@/types/models/course';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import CustomTextEditor from '../text-editor';

type ModuleProps = {
    module?: Module;
    course: Course;
    newOrder?: number;
};

export default function CourseModuleForm() {
    const { module, course, newOrder } = usePage()
        .props as unknown as ModuleProps;

    const isEdit = !!module;

    const { data, setData, errors } = useForm({
        course_id: module?.course_id ?? course?.id ?? '',
        title: module?.title ?? '',
        description: module?.description ?? '',
        syllabus: module?.syllabus ?? '',
        order: module?.order ?? newOrder ?? 1,
        estimated_hours: module?.estimated_hours ?? null,
        estimated_days: module?.estimated_days ?? null,
        module_type: module?.module_type ?? '',
        modality: module?.modality ?? '',
        prerequisites: JSON.parse(module?.prerequisites ?? '[]') as string[],
        is_mandatory: module?.is_mandatory ?? false,
        has_evaluation: module?.has_evaluation ?? false,
        evaluation_weight: module?.evaluation_weight ?? null,
        learning_outcomes: JSON.parse(
            module?.learning_outcomes ?? '[]',
        ) as string[],
        assessment_strategy: JSON.parse(
            module?.assessment_strategy ?? '[]',
        ) as string[],
        teaching_methods: JSON.parse(
            module?.teaching_methods ?? '[]',
        ) as string[],
        language: module?.language ?? course.language ?? 'fr',
        is_visible: module?.is_visible ?? true,
    });

    // const moduleOptions = useMemo(() => {
    //     return (course.modules || [])
    //         .filter((m: Module) => !isEdit || m.id !== module?.id)
    //         .map((m: Module) => ({ id: m.id, title: m.title }));
    // }, [course.modules, isEdit, module]);

    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        async function submitSyllabusToApi() {
            await sendSyllabusToApi(isEdit ? module.id : 0).then(() => {
                const payload = {
                    ...data,
                    _method: isEdit ? 'put' : 'post',
                };

                if (isEdit) {
                    router.put(update([course.slug, module.id]), payload);
                } else {
                    router.post(store(course.slug), payload);
                }
            });
        }
        submitSyllabusToApi();
        // Wait a bit to let inertia start and then clear processing when done
        setTimeout(() => setProcessing(false), 400);
    };

    const moduleLang = [
        { key: 'fr', value: 'Française' },
        { key: 'en', value: 'Englaise' },
        { key: 'es', value: 'Espagnole' },
    ];

    return (
        <TeacherLayouts
            title={isEdit ? 'Modifier le module' : 'Nouveau module'}
        >
            <Head title={isEdit ? 'Modifier module' : 'Nouveau module'} />

            <div className="mx-auto mt-8 max-w-3xl">
                <form
                    onSubmit={submit}
                    className="rounded-lg border bg-white p-6 shadow"
                    method="POST"
                >
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        {isEdit ? 'Modifier le module' : 'Créer un module'}
                    </h2>

                    <input
                        type="hidden"
                        name="course_id"
                        value={data.course_id as number}
                    />

                    {/* Informations générales */}
                    <div className="mb-4 grid gap-3">
                        <div>
                            <Label>Titre</Label>
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="form-input w-full"
                                placeholder="Titre du module"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Description</Label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="form-input w-full"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Organisation */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                        <div>
                            <Label>Ordre</Label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={(e) =>
                                    setData('order', Number(e.target.value))
                                }
                                className="form-input"
                                min={1}
                            />
                            {errors.order && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.order}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Heures estimées</Label>
                            <input
                                type="number"
                                value={data.estimated_hours ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'estimated_hours',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                                className="form-input"
                                min={0}
                            />
                            {errors.estimated_hours && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.estimated_hours}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Jours estimés</Label>
                            <input
                                type="number"
                                value={data.estimated_days ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'estimated_days',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                                className="form-input"
                                min={0}
                            />
                            {errors.estimated_days && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.estimated_days}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Typologie & Modalités */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <SelectField
                            label="Type de module"
                            value={data.module_type ?? ''}
                            onChange={(value) => setData('module_type', value)}
                            required
                            options={moduleTypeLabels}
                            error={errors.module_type}
                        />

                        <div className="grid gap-2">
                            <SelectField
                                label="Mode de déroulement"
                                value={data.modality ?? ''}
                                onChange={(value) => setData('modality', value)}
                                required
                                options={modalityTypeLabels}
                                error={errors.modality}
                            />
                        </div>
                    </div>

                    {/* Prérequis */}
                    <div className="mb-4">
                        <TagsInput
                            label="Prérequis"
                            value={data.prerequisites || []}
                            onChange={(v) => setData('prerequisites', v)}
                            placeholder="Ajouter un prérequis et appuyer sur Entrée"
                        />
                        {errors.prerequisites && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.prerequisites}
                            </p>
                        )}
                    </div>

                    {/* Approche pédagogique & Évaluation */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!data.is_mandatory}
                                    onChange={(e) =>
                                        setData(
                                            'is_mandatory',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">Obligatoire</span>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!data.has_evaluation}
                                    onChange={(e) =>
                                        setData(
                                            'has_evaluation',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">Évaluation</span>
                            </label>

                            {data.has_evaluation && (
                                <div>
                                    <Label>Poids de l'évaluation (%)</Label>
                                    <input
                                        type="number"
                                        value={data.evaluation_weight ?? ''}
                                        onChange={(e) =>
                                            setData(
                                                'evaluation_weight',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
                                            )
                                        }
                                        className="form-input"
                                        min={0}
                                        max={100}
                                    />
                                    {errors.evaluation_weight && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.evaluation_weight}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Versioning & Avancé */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <SelectField
                                label="Langue du module"
                                value={data.language ?? ''}
                                onChange={(value) => setData('language', value)}
                                options={moduleLang}
                                error={errors.language}
                            />
                        </div>

                        <div>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!data.is_visible}
                                    onChange={(e) =>
                                        setData('is_visible', e.target.checked)
                                    }
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">Visible</span>
                            </label>
                        </div>
                    </div>

                    {/* Enseignement & Évaluation avancée */}
                    <div className="mb-4 grid gap-3">
                        <div>
                            <TagsInput
                                label="Objectifs d'apprentissage"
                                value={data.learning_outcomes || []}
                                onChange={(v) =>
                                    setData('learning_outcomes', v)
                                }
                                placeholder="Ajouter un objectif et appuyer sur Entrée"
                            />
                            {errors.learning_outcomes && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.learning_outcomes}
                                </p>
                            )}
                        </div>

                        <div>
                            <TagsInput
                                label="Stratégie d'évaluation"
                                value={data.assessment_strategy || []}
                                onChange={(v) =>
                                    setData('assessment_strategy', v)
                                }
                                placeholder="Ajouter une stratégie et appuyer sur Entrée"
                            />
                            {errors.assessment_strategy && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.assessment_strategy}
                                </p>
                            )}
                        </div>

                        <div>
                            <TagsInput
                                label="Méthodes pédagogiques"
                                value={data.teaching_methods || []}
                                onChange={(v) => setData('teaching_methods', v)}
                                placeholder="Ajouter une méthode et appuyer sur Entrée"
                            />
                            {errors.teaching_methods && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.teaching_methods}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="my-4">
                        <h3 className="mb-3 text-2xl font-semibold">
                            Syllabus du module
                        </h3>
                        <CustomTextEditor isNew={module == undefined} />
                        <p className="text-xs text-red-500">
                            {errors.syllabus}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={() => history.back()}
                            className="rounded border px-4 py-2"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            {processing && <Spinner />}
                            {isEdit ? 'Enregistrer' : 'Ajouter le module'}
                        </button>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
