import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { noteUnitLabels, quizeTypeLabels, QuizType } from '@/lib/type';
import { store, update } from '@/routes/teachers/quizzes';
import { CourseActivity } from '@/types/models/course';
import { Quiz } from '@/types/models/others';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

type Props = {
    activity: CourseActivity;
    quize?: Quiz;
};
export default function QuizeForm() {
    // backend may return 'quize' prop
    const { activity, quize } = usePage().props as unknown as Props;
    const isEdit = !!quize;
    const { errors } = usePage().props;

    const { data, setData, reset } = useForm({
        activity_id: activity.id,
        title: quize?.title ?? '',
        description: quize?.description ?? '',
        quize_instructions: quize?.quize_instructions ?? '',
        note_unit: quize?.note_unit ?? '',
        quiz_type: quize?.quiz_type ?? 'formative',
        time_limit_minutes: quize?.time_limit_minutes ?? null,
        max_attempts: quize?.max_attempts ?? 1,
        is_mandatory: quize?.is_mandatory ?? false,
        shuffle_questions: quize?.shuffle_questions ?? true,
        shuffle_answers: quize?.shuffle_answers ?? true,
        show_results_immediately: quize?.show_results_immediately ?? true,
        show_correct_answers: quize?.show_correct_answers ?? false,
        max_score: quize?.max_score ?? null,
        success_threshold: quize?.success_threshold ?? null,
    });

    const [processing, setProcessing] = useState(false);
    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            ...data,
            _method: isEdit ? 'put' : 'post',
        };
        if (isEdit && quize?.id) {
            router.put(update([activity.id, quize.id]), payload, {
                onFinish: onFinish,
            });
        } else {
            router.post(store(activity.id), payload, {
                onFinish: onFinish,
            });
        }
    };
    function onFinish() {
        // reset form only if creating new quiz
        if (!isEdit) {
            reset();
        }
        setProcessing(false);
    }

    const isFormValid = Boolean(data.title && data.quiz_type);

    return (
        <TeacherLayouts title={isEdit ? 'Modifier le quiz' : 'Nouveau quiz'}>
            <div className="mx-auto mt-8 max-w-3xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        {isEdit ? 'Modifier le quiz' : 'Créer un quiz'}
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

                <form
                    onSubmit={submitForm}
                    className="rounded-lg border bg-white p-6 shadow"
                    method="POST"
                >
                    {/* Identification */}
                    <div className="mb-4">
                        <InputField
                            label="Titre"
                            value={data.title}
                            onChange={(v) => setData('title', v)}
                            required
                            error={errors.title}
                            placeholder="Titre du quiz"
                        />
                    </div>

                    <div className="mb-4">
                        <TextareaField
                            label="Description"
                            value={data.description ?? ''}
                            onChange={(v) => setData('description', v)}
                            rows={4}
                            placeholder="Courte description du quiz"
                            error={errors.description}
                        />
                    </div>

                    <div className="mb-4">
                        <SelectField
                            label="Type de quiz"
                            value={data.quiz_type ?? ''}
                            onChange={(v) =>
                                setData('quiz_type', v as QuizType)
                            }
                            options={quizeTypeLabels}
                            required
                            error={errors.quiz_type}
                        />
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <InputField
                            label="Durée (minutes)"
                            type="number"
                            value={data.time_limit_minutes ?? ''}
                            onChange={(v) =>
                                setData(
                                    'time_limit_minutes',
                                    v ? Number(v) : null,
                                )
                            }
                            error={errors.time_limit_minutes}
                            placeholder="ex: 30"
                        />
                        <InputField
                            label="Tentatives max"
                            type="number"
                            value={data.max_attempts ?? 1}
                            onChange={(v) =>
                                setData('max_attempts', v ? Number(v) : 1)
                            }
                            error={errors.max_attempts}
                            placeholder="ex: 3"
                        />
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <CheckboxField
                                label="Obligatoire"
                                checked={!!data.is_mandatory}
                                onChange={(v) => setData('is_mandatory', v)}
                            />
                        </div>
                        <div>
                            <CheckboxField
                                label="Mélanger les questions"
                                checked={!!data.shuffle_questions}
                                onChange={(v) =>
                                    setData('shuffle_questions', v)
                                }
                            />
                        </div>
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <CheckboxField
                                label="Mélanger les réponses"
                                checked={!!data.shuffle_answers}
                                onChange={(v) => setData('shuffle_answers', v)}
                            />
                        </div>
                        <div>
                            <CheckboxField
                                label="Afficher résultats immédiatement"
                                checked={!!data.show_results_immediately}
                                onChange={(v) =>
                                    setData('show_results_immediately', v)
                                }
                            />
                        </div>
                    </div>
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <SelectField
                            label="Unité de notation"
                            value={data.note_unit ?? 'fr'}
                            onChange={(v) => setData('note_unit', v)}
                            options={noteUnitLabels}
                            required
                            error={errors.note_unit}
                        />
                        <InputField
                            label="Score max"
                            type="number"
                            value={data.max_score ?? ''}
                            onChange={(v) =>
                                setData('max_score', v ? Number(v) : null)
                            }
                            error={errors.max_score}
                            placeholder="ex: 100"
                        />
                    </div>
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <CheckboxField
                                label="Afficher réponses correctes"
                                checked={!!data.show_correct_answers}
                                onChange={(v) =>
                                    setData('show_correct_answers', v)
                                }
                            />
                        </div>

                        <div>
                            <InputField
                                label={`Seuil de réussite (${data.note_unit ?? ''})`}
                                type="number"
                                value={data.success_threshold ?? ''}
                                onChange={(v) =>
                                    setData(
                                        'success_threshold',
                                        v ? Number(v) : null,
                                    )
                                }
                                error={errors.success_threshold}
                                placeholder="ex: 60"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <TextareaField
                            label="Instructions"
                            value={data.quize_instructions ?? ''}
                            onChange={(v) => setData('quize_instructions', v)}
                            rows={4}
                            placeholder="Les instructions du quiz"
                            error={errors.quize_instructions}
                        />
                    </div>

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
