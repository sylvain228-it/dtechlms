import UploadListShared from '@/components/shared/upload-list-shared';
import { Button } from '@/components/ui/button';
import StudentLayouts from '@/layouts/student/student-layouts';
import { getSubmissionStatusLabel } from '@/lib/type';
import { formatCompleteDate } from '@/lib/utils';
import { details } from '@/routes/students/activities';
import { create as createSubmissionRoute } from '@/routes/students/activities/submissions';
import {
    ActivitySubmission,
    Course,
    CourseActivity,
    SubmissionUpload,
} from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, Download } from 'lucide-react';

export default function StudentSubmissionDetails() {
    const { submission, submissionUploads, activity, parentCourse } = usePage()
        .props as unknown as {
        submission: ActivitySubmission;
        submissionUploads: SubmissionUpload[];
        activity: CourseActivity;
        parentCourse: Course;
    };

    const hasUploads = (submissionUploads ?? []).length > 0;

    const statusBadge = (status?: string) => {
        switch (status) {
            case 'graded':
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                        <CheckCircle className="h-4 w-4" /> Évaluée
                    </span>
                );
            case 'submitted':
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        <Clock className="h-4 w-4" /> Soumise
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        {status ?? '—'}
                    </span>
                );
        }
    };

    return (
        <StudentLayouts title="Détails de la soumission">
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                            {activity.title}
                        </h1>
                        <div className="mt-2 text-sm text-gray-500">
                            <span className="mr-4 inline-block text-xs font-medium text-gray-600">
                                Course:
                            </span>
                            <span className="text-sm text-gray-700">
                                {parentCourse?.title ?? '-'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={createSubmissionRoute(activity.slug).url}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            Retour / Nouvelle soumission
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-start justify-between border-b pb-4">
                                <div className="pr-4">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Détails de l'activité
                                    </h2>
                                    <p className="text-md mt-1 text-gray-800 hover:text-cblue">
                                        <Link href={details(activity.slug)}>
                                            {activity.title}
                                        </Link>
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                                        {activity.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start justify-between">
                                <div className="pr-4">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Détails de la soumission
                                    </h2>
                                    {submission?.title && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {submission.title}
                                        </p>
                                    )}
                                </div>
                                <div>{statusBadge(submission?.status)}</div>
                            </div>

                            <div className="mt-4 text-sm text-gray-700">
                                <h3 className="mb-2 font-medium text-gray-800">
                                    Description / Commentaires
                                </h3>
                                {submission?.description ? (
                                    <div className="prose max-w-none text-sm text-gray-700">
                                        {submission.description}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Aucune description fournie.
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
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

                            {/* Feedback */}
                            <div className="mt-6">
                                <h4 className="mb-2 text-sm font-medium text-gray-700">
                                    Retour de l'enseignant
                                </h4>
                                {submission?.feedback ? (
                                    <div className="rounded-md border border-green-100 bg-green-50 p-4 text-sm text-gray-800">
                                        {submission.feedback}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Aucun feedback pour le moment.
                                    </div>
                                )}
                            </div>
                        </div>
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
                                        Note
                                    </div>
                                    <div className="mt-1 font-medium text-green-600">
                                        {submission?.score ?? '—'}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {submission ? (
                                        <div className="flex flex-col gap-2">
                                            {hasUploads && (
                                                <Button asChild>
                                                    <a
                                                        href={
                                                            submissionUploads[0]
                                                                .url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2"
                                                    >
                                                        <Download className="h-4 w-4" />{' '}
                                                        Télécharger le premier
                                                        fichier
                                                    </a>
                                                </Button>
                                            )}

                                            {submission.status !== 'graded' && (
                                                <Link
                                                    href={
                                                        createSubmissionRoute(
                                                            activity.slug,
                                                        ).url
                                                    }
                                                    className="block"
                                                >
                                                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                                        Re-soumettre
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={
                                                createSubmissionRoute(
                                                    activity.slug,
                                                ).url
                                            }
                                            className="block"
                                        >
                                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                                Soumettre maintenant
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </StudentLayouts>
    );
}
