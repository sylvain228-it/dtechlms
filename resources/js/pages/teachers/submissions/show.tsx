import {
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import UploadListShared from '@/components/shared/upload-list-shared';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { getSubmissionStatusLabel, submissionStatusLabels } from '@/lib/type';
import { formatCompleteDate } from '@/lib/utils';
import {
    ActivitySubmission,
    Course,
    CourseActivity,
    DeliverableRequirements,
    SubmissionUpload,
} from '@/types/models/course';
import { Student } from '@/types/models/institut';
import { router, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function TeacherSubmissionDetails() {
    const {
        submission,
        submissionUploads,
        activity,
        parentCourse,
        student,
        delivRequirements,
    } = usePage().props as unknown as {
        submission: ActivitySubmission;
        submissionUploads: SubmissionUpload[];
        activity: CourseActivity;
        parentCourse: Course;
        student: Student;
        delivRequirements: DeliverableRequirements[];
    };

    const hasUploads = (submissionUploads ?? []).length > 0;

    const { data, setData, processing, errors, reset } = useForm({
        score: submission?.score ?? null,
        feedback: submission?.feedback ?? '',
        status: submission?.status ?? 'graded',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Post to a grading endpoint. Adjust route as needed server-side.
        router.post(`/teachers/submissions/${submission.id}/grade`, data, {
            onFinish: () => {
                // optional: reset form or show toast
            },
        });
    };

    return (
        <TeacherLayouts
            title={`Détails de la soumission - ${activity.title} (${parentCourse.title})`}
        >
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                            Détails de la soumission
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Activité:{' '}
                            <span className="font-medium text-gray-700">
                                {activity.title}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            Cours:{' '}
                            <span className="font-medium text-gray-700">
                                {parentCourse?.title}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="mb-4 border-b pb-4">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Soumis par
                                </h2>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="rounded-full bg-gray-100 p-3 text-sm font-semibold text-gray-700">
                                        {(student?.first_name ?? '').charAt(0)}
                                        {(student?.last_name ?? '').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {student?.first_name}{' '}
                                            {student?.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {student?.email ?? '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-md font-medium text-gray-900">
                                    Détails de la soumission
                                </h3>
                                {submission?.title && (
                                    <p className="mt-1 text-sm text-gray-600">
                                        {submission.title}
                                    </p>
                                )}
                                <div className="mt-3 text-sm text-gray-700">
                                    <h4 className="mb-2 font-medium text-gray-800">
                                        Description / Commentaires
                                    </h4>
                                    {submission?.description ? (
                                        <div className="prose max-w-none text-sm text-gray-700">
                                            {submission.description}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400">
                                            Aucun commentaire fourni.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="mb-3 text-sm font-medium text-gray-700">
                                    Fichiers joints
                                </h4>
                                {hasUploads ? (
                                    <UploadListShared
                                        submissionUploads={submissionUploads}
                                    />
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Aucun fichier joint pour cette
                                        soumission.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Evaluation form */}
                        <form
                            onSubmit={onSubmit}
                            className="rounded-lg border bg-white p-6 shadow-sm"
                        >
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Évaluer l'étudiant
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="sm:col-span-1">
                                    <InputField
                                        label="Note"
                                        type="number"
                                        value={data.score ?? ''}
                                        onChange={(v) => setData('score', v)}
                                        placeholder="Ex: 14"
                                        error={errors.score}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <SelectField
                                        label="Statut"
                                        value={data.status}
                                        options={submissionStatusLabels}
                                        onChange={(v) => setData('status', v)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <TextareaField
                                    label="Feedback / Commentaires"
                                    value={data.feedback ?? ''}
                                    onChange={(v) => setData('feedback', v)}
                                    rows={5}
                                    placeholder="Retour détaillé pour l'étudiant"
                                    error={errors.feedback}
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <Button
                                    className="btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        'Enregistrer la note'
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => reset()}
                                >
                                    Réinitialiser
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Meta aside */}
                    <aside className="col-span-1">
                        <div className="sticky top-20 rounded-lg border bg-white p-6 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700">
                                Informations
                            </h4>

                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Statut
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {submission
                                            ? getSubmissionStatusLabel(
                                                  submission.status,
                                              )
                                            : 'Pas de soumission'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Soumis le
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {submission?.submitted_at
                                            ? formatCompleteDate(
                                                  submission.submitted_at,
                                              )
                                            : '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Soumission tardive
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {submission?.late_submission
                                            ? 'Oui'
                                            : 'Non'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Note actuelle
                                    </div>
                                    <div className="mt-1 font-medium text-green-600">
                                        {submission?.score ?? '—'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
