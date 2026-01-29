import { CheckboxField, SelectField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { sendSyllabusToApi } from '@/lib/tasks';
import {
    langueLabels,
    ModalityType,
    modalityTypeLabels,
    sequenceTypeLabels,
} from '@/lib/type';
import { store, update } from '@/routes/teachers/sequences';
import { Module, Sequence } from '@/types/models/course';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import CustomTextEditor from '../text-editor';
type Props = {
    module: Module;
    sequence?: Sequence;
    newOrder?: number;
    c_modality: ModalityType;
};

export default function SequenceForm() {
    const { module, newOrder, sequence, c_modality } = usePage()
        .props as unknown as Props;

    const isEdit = !!sequence;

    const { data, setData, errors } = useForm({
        module_id: module.id,
        title: sequence?.title ?? '',
        description: sequence?.description ?? '',
        sequence_type: sequence?.sequence_type ?? '',
        order: sequence?.order ?? newOrder ?? 0,
        is_visible: sequence?.is_visible ?? true,
        syllabus: sequence?.syllabus ?? '',
        estimated_hours: sequence?.estimated_hours ?? null,
        estimated_days: sequence?.estimated_days ?? null,
        modality: sequence?.modality ?? module.modality,
        is_mandatory: sequence?.is_mandatory == 1,
        has_assessment: sequence?.has_assessment == 1,
        assessment_weight: sequence?.assessment_weight ?? null,
        language: sequence?.language ?? module.language,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        async function submitSyllabusToApi() {
            await sendSyllabusToApi(isEdit ? module.id : 0).then(() => {
                const formData = {
                    ...data,
                    _method: isEdit ? 'put' : 'post',
                };
                if (isEdit) {
                    router.put(
                        update([module.course!.slug, module.id, sequence.id]),
                        formData,
                        {
                            onFinish: () => setProcessing(false),
                        },
                    );
                } else {
                    router.post(
                        store([module.course!.slug, module.id]),
                        formData,
                        {
                            onFinish: () => setProcessing(false),
                        },
                    );
                }
            });
        }
        submitSyllabusToApi();
    };
    function submitFormByClick(e: React.MouseEvent) {
        e.preventDefault();
        handleSubmit(e);
    }
    const isFormValid =
        data.description &&
        data.title &&
        data.estimated_hours &&
        data.estimated_days &&
        data.sequence_type &&
        data.language &&
        data.syllabus &&
        data.modality;
    return (
        <TeacherLayouts
            title={isEdit ? 'Modifier la séquence' : 'Créer une séquence'}
        >
            <Head title={isEdit ? 'Modifier séquence' : 'Nouvelle séquence'} />

            <div className="mx-auto mt-8 max-w-3xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        {isEdit ? 'Modifier la séquence' : 'Nouvelle séquence'}
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
                    method="POST"
                >
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label>Cours/Séquence</Label>
                            <div className="rounded-sm border p-2">
                                <span className="text-[14px]">
                                    {module.course?.title}
                                </span>
                                <div className="text-[18px] font-bold">
                                    {module.title}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>Titre</Label>
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="form-input w-full"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="">
                            <Label>Description</Label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="form-input w-full"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                        {/* Organisation */}
                        <div className="grid gap-3 sm:grid-cols-3">
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
                        <div className="grid gap-2">
                            <SelectField
                                label="Langue de la séquence"
                                value={data.language ?? ''}
                                onChange={(value) => setData('language', value)}
                                options={langueLabels}
                                error={errors.language}
                            />
                        </div>
                        <div className="grid gap-2">
                            <SelectField
                                label="Type de séquence"
                                value={data.sequence_type ?? ''}
                                onChange={(value) =>
                                    setData('sequence_type', value)
                                }
                                options={sequenceTypeLabels}
                                error={errors.sequence_type}
                            />
                        </div>
                        {c_modality != 'asynchronous' && (
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

                        {/* Approche pédagogique & Évaluation */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!!data.has_assessment}
                                        onChange={(e) =>
                                            setData(
                                                'has_assessment',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">Évaluation</span>
                                </label>

                                {data.has_assessment && (
                                    <div>
                                        <Label>Poids de l'évaluation (%)</Label>
                                        <input
                                            type="number"
                                            value={data.assessment_weight ?? ''}
                                            onChange={(e) =>
                                                setData(
                                                    'assessment_weight',
                                                    e.target.value
                                                        ? Number(e.target.value)
                                                        : null,
                                                )
                                            }
                                            className="form-input"
                                            min={0}
                                            max={100}
                                        />
                                        {errors.assessment_weight && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.assessment_weight}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-2">
                                <CheckboxField
                                    label="Obligatoire"
                                    checked={!!data.is_mandatory}
                                    onChange={(val) =>
                                        setData('is_mandatory', val)
                                    }
                                />
                            </div>
                            <div>
                                <CheckboxField
                                    label="Visible"
                                    checked={!!data.is_visible}
                                    onChange={(val) =>
                                        setData('is_visible', val)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="my-4">
                        <h3 className="mb-3 text-2xl font-semibold">
                            Syllabus de la séquence
                        </h3>
                        <CustomTextEditor isNew={!isEdit} />
                        <p className="text-xs text-red-500">
                            {errors.syllabus}
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t pt-4">
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
                            {isEdit ? 'Enregistrer' : 'Ajouter le chapitre'}
                        </Button>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
