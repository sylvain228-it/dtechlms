import {
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { sendSyllabusToApi } from '@/lib/tasks';
import {
    langueLabels,
    ModalityType,
    modalityTypeLabels,
    moduleTypeLabels,
} from '@/lib/type';
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
        modality: module?.modality ?? course.modality,
        is_mandatory: module?.is_mandatory ?? false,
        has_evaluation: module?.has_evaluation ?? false,
        evaluation_weight: module?.evaluation_weight ?? null,
        language: module?.language ?? course.language,
        is_visible: module?.is_visible ?? true,
    });

    const [processing, setProcessing] = useState(false);

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        async function submitSyllabusToApi() {
            await sendSyllabusToApi(isEdit ? module.id : 0).then(() => {
                const payload = {
                    ...data,
                    _method: isEdit ? 'put' : 'post',
                };

                if (isEdit) {
                    router.put(update([course.slug, module.id]), payload, {
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
        submitForm(e);
    }
    const isFormValid =
        data.title &&
        data.estimated_hours &&
        data.estimated_days &&
        data.module_type &&
        data.language &&
        data.syllabus &&
        data.modality;
    return (
        <TeacherLayouts
            title={isEdit ? 'Modifier le module' : 'Nouveau module'}
        >
            <Head title={isEdit ? 'Modifier module' : 'Nouveau module'} />

            <div className="mx-auto mt-8 max-w-3xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        {isEdit ? 'Modifier le module' : 'Créer un module'}
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
                    onSubmit={submitForm}
                    className="rounded-lg border bg-white p-6 shadow"
                    method="POST"
                >
                    <input
                        type="hidden"
                        name="course_id"
                        value={data.course_id as number}
                    />

                    {/* Informations générales */}
                    <div className="mb-4 grid gap-3">
                        <div>
                            <InputField
                                label="Titre"
                                value={data.title}
                                onChange={(val) => setData('title', val)}
                                placeholder="Titre du module"
                                required
                                error={errors.title}
                            />
                        </div>

                        <div>
                            <TextareaField
                                label="Description"
                                value={data.description}
                                onChange={(val) => setData('description', val)}
                                rows={3}
                                placeholder="Description du module"
                                error={errors.description}
                            />
                        </div>
                    </div>

                    {/* Organisation */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                        <div>
                            <InputField
                                label="Ordre"
                                type="number"
                                value={data.order}
                                onChange={(val) =>
                                    setData('order', Number(val))
                                }
                                error={errors.order}
                                required
                            />
                        </div>

                        <div>
                            <InputField
                                label="Heures estimées"
                                type="number"
                                value={data.estimated_hours ?? ''}
                                onChange={(val) =>
                                    setData(
                                        'estimated_hours',
                                        val ? Number(val) : null,
                                    )
                                }
                                error={errors.estimated_hours}
                            />
                        </div>
                        <div>
                            <InputField
                                label="Jours estimés"
                                type="number"
                                value={data.estimated_days ?? ''}
                                onChange={(val) =>
                                    setData(
                                        'estimated_days',
                                        val ? Number(val) : null,
                                    )
                                }
                                error={errors.estimated_days}
                            />
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

                        {course.modality != 'asynchronous' && (
                            <div className="grid gap-2">
                                <SelectField
                                    label="Mode de déroulement"
                                    value={data.modality ?? ''}
                                    onChange={(value) =>
                                        setData(
                                            'modality',
                                            value as ModalityType,
                                        )
                                    }
                                    required
                                    options={modalityTypeLabels}
                                    error={errors.modality}
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <SelectField
                                label="Langue du module"
                                value={data.language ?? ''}
                                onChange={(value) => setData('language', value)}
                                options={langueLabels}
                                error={errors.language}
                                required
                            />
                        </div>
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
                    <div className="my-4">
                        <h3 className="mb-3 text-2xl font-semibold">
                            Syllabus du module
                        </h3>
                        <CustomTextEditor isNew={!isEdit} />
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

                        <Button
                            type="submit"
                            disabled={processing || !isFormValid}
                            className="btn-primary"
                        >
                            {processing && <Spinner />}
                            {isEdit ? 'Enregistrer' : 'Ajouter le module'}
                        </Button>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
