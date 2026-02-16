/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import {
    CriterionType,
    criterionTypeLabels,
    EvaluationMethod,
    evaluationMethodLabels,
    SaveStatus,
    saveStatusLabels,
} from '@/lib/type';
import { index, store, update } from '@/routes/teachers/criterias';
import { EvaluationCriteria } from '@/types/models/activity';
import { CourseActivity } from '@/types/models/course';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React, { useState } from 'react';

type Props = {
    activity: CourseActivity;
    criteria?: EvaluationCriteria;
};

export default function TeacherEvaluationCriteriaForm() {
    const { activity, criteria } = usePage().props as unknown as Props;
    const isEdit = !!criteria;
    const { errors } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const { data, setData, reset } = useForm({
        activity_id: activity.id,
        skill_id: criteria?.skill_id ?? null,
        title: criteria?.title ?? '',
        description: criteria?.description ?? '',
        weight: criteria?.weight ?? 1,
        max_score: criteria?.max_score ?? null,
        success_threshold: criteria?.success_threshold ?? null,
        is_mandatory: criteria?.is_mandatory ?? false,
        criterion_type: criteria?.criterion_type ?? 'knowledge',
        evaluation_method: criteria?.evaluation_method ?? 'points',
        status: criteria?.status ?? 'draft',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (isEdit && criteria) {
            router.put(update([activity.id, criteria.id]), data, {
                onFinish: handleFinesh,
            });
        } else {
            router.post(store(activity.id), data, {
                onFinish: handleFinesh,
            });
        }
    };

    function handleFinesh() {
        setProcessing(false);
        reset();
        router.visit(index(activity.slug));
    }
    const isFormValid = Boolean(
        data.title &&
            data.criterion_type &&
            data.evaluation_method &&
            data.status &&
            data.weight,
    );

    return (
        <TeacherLayouts
            title={
                isEdit
                    ? `Modifier le critère - ${activity.title}`
                    : `Créer un critère - ${activity.title}`
            }
        >
            <div className="mx-auto mt-6 max-w-4xl px-4">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isEdit
                                ? 'Modifier le critère'
                                : 'Créer un critère'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Activité:{' '}
                            <span className="font-medium">
                                {activity.title}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmit(e as any);
                            }}
                            disabled={!isFormValid || processing}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            {processing && <Spinner />}
                            <Save className="h-4 w-4" />
                            {isEdit ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Identification */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Identification
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Titre du critère"
                                value={data.title}
                                onChange={(v) => setData('title', v)}
                                required
                                error={errors.title as string}
                                placeholder="Ex: Clarté de la présentation"
                            />

                            <SelectField
                                label="Type de critère"
                                value={data.criterion_type}
                                options={criterionTypeLabels}
                                onChange={(v) =>
                                    setData(
                                        'criterion_type',
                                        v as CriterionType,
                                    )
                                }
                                required
                                error={errors.criterion_type as string}
                            />
                        </div>

                        <div className="mt-4">
                            <TextareaField
                                label="Description"
                                value={data.description ?? ''}
                                onChange={(v) => setData('description', v)}
                                rows={3}
                                placeholder="Description détaillée du critère d'évaluation"
                                error={errors.description as string}
                            />
                        </div>
                    </div>

                    {/* Configuration d'évaluation */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Configuration d'évaluation
                        </h2>

                        <div className="grid gap-4 md:grid-cols-3">
                            <SelectField
                                label="Méthode d'évaluation"
                                value={data.evaluation_method}
                                options={evaluationMethodLabels}
                                onChange={(v) =>
                                    setData(
                                        'evaluation_method',
                                        v as EvaluationMethod,
                                    )
                                }
                                required
                                error={errors.evaluation_method as string}
                            />

                            <InputField
                                label="Pondération (%)"
                                type="number"
                                value={data.weight}
                                onChange={(v) =>
                                    setData('weight', v ? parseFloat(v) : 0)
                                }
                                required
                                error={errors.weight as string}
                                placeholder="1-100"
                            />

                            <SelectField
                                label="Statut"
                                value={data.status}
                                options={saveStatusLabels}
                                onChange={(v) =>
                                    setData('status', v as SaveStatus)
                                }
                                required
                                error={errors.status as string}
                            />
                        </div>
                    </div>

                    {/* Scoring */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Notation
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField
                                label="Note maximum"
                                type="number"
                                value={data.max_score ?? ''}
                                onChange={(v) =>
                                    setData(
                                        'max_score',
                                        v ? parseFloat(v) : null,
                                    )
                                }
                                error={errors.max_score as string}
                                placeholder="Ex: 20"
                            />

                            <InputField
                                label="Seuil de réussite"
                                type="number"
                                value={data.success_threshold ?? ''}
                                onChange={(v) =>
                                    setData(
                                        'success_threshold',
                                        v ? parseFloat(v) : null,
                                    )
                                }
                                error={errors.success_threshold as string}
                                placeholder="Ex: 10"
                            />
                        </div>
                    </div>

                    {/* Options additionnelles */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Options
                        </h2>

                        <div className="space-y-3">
                            <CheckboxField
                                label="Critère obligatoire"
                                checked={data.is_mandatory}
                                onChange={(v) => setData('is_mandatory', v)}
                            />

                            {data.evaluation_method === 'points' && (
                                <div className="rounded bg-blue-50 p-3 text-sm text-blue-800">
                                    Conseil: Configurez la note maximum et le
                                    seuil de réussite pour une évaluation
                                    précise.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-3 border-t pt-6">
                        <Button
                            type="submit"
                            disabled={!isFormValid || processing}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            {processing && <Spinner />}
                            <Save className="h-4 w-4" />
                            {isEdit ? 'Mettre à jour' : 'Créer'}
                        </Button>

                        <Link
                            href={index(activity.slug)}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
