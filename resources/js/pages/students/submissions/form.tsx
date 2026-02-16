/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputField, TextareaField } from '@/components/shared/form';
import UploadListShared from '@/components/shared/upload-list-shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import StudentLayouts from '@/layouts/student/student-layouts';
import {
    FileType,
    getFileTypeLabel,
    getResourceTypeLabel,
    ResourceType,
} from '@/lib/type';
import { formatCompleteDate } from '@/lib/utils';
import { store } from '@/routes/students/activities/submissions';
import {
    ActivitySubmission,
    CourseActivity,
    SubmissionUpload,
} from '@/types/models/course';
import { router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    File,
    FileUp,
    Info,
    Loader,
} from 'lucide-react';
import React, { useState } from 'react';
import { CiCircleRemove } from 'react-icons/ci';

type UploadSelectedFileType = {
    requirement_id?: number;
    title?: string;
    tmp_path?: string | null;
    mime_type?: string | null;
    file_ext?: string | null;
    file_size?: number | null;
    file?: File | null;
    preview?: string | null;
    upload_progress?: number;
    isUploading?: boolean;
    isRemoving?: boolean;
};

export default function StudentSubmissionForm() {
    const { errors } = usePage().props as unknown as {
        errors: Record<string, string>;
    };
    const { submissionUploads, activity, submission, isResubmission } =
        usePage().props as unknown as {
            activity: CourseActivity;
            submission: ActivitySubmission;
            isResubmission: boolean;
            submissionUploads: SubmissionUpload[];
        };

    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const deliverableRequirements = activity.deliv_requirements;

    const [processing, setProcessing] = useState(false);

    const { data, setData } = useForm({
        activity_id: activity.id,
        title: submission?.title ?? '',
        description: submission?.description ?? '',
        submitted_files: submission?.submitted_files ?? '',
        uploadSelectedFile: [] as UploadSelectedFileType[],
    });

    // Vérifier si la date limite est dépassée
    const deadline = activity.deliverable_deadline
        ? new Date(activity.deliverable_deadline)
        : null;
    const now = new Date();
    const isLate = deadline && now > deadline;
    const isDeadlineSoon =
        deadline &&
        now < deadline &&
        deadline.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

    console.log('upload:::', data.uploadSelectedFile);
    // Gérer la sélection de fichiers

    async function handleFileChange(
        e: React.ChangeEvent<HTMLInputElement>,
        requirementId: number,
    ) {
        e.preventDefault();
        const f = e.target.files?.[0] ?? null;
        const uploaded = data.uploadSelectedFile.find(
            (item) => item.requirement_id === requirementId,
        );
        if (uploaded !== undefined) removeFile(uploaded);
        if (f) {
            setIsUploading(true);

            // preview
            const previewUrl = URL.createObjectURL(f);

            const fd = new FormData();
            fd.append('file', f);

            try {
                const thisSelectedFile: UploadSelectedFileType = {
                    file: f,
                    preview: previewUrl,
                    requirement_id: requirementId,
                    upload_progress: uploadProgress,
                    isUploading: true,
                };

                const resp = await axios.post('/upload-to-tmp', fd, {
                    onUploadProgress: (ev) => {
                        const percent = Math.round(
                            (ev.loaded * 100) / (ev.total || 1),
                        );
                        setUploadProgress(percent);
                        thisSelectedFile.upload_progress = percent;
                        setData('uploadSelectedFile', [
                            ...data.uploadSelectedFile,
                            thisSelectedFile,
                        ]);
                    },
                });
                const servData = await resp.data;
                // Passer les données du fichier en callback
                setData('uploadSelectedFile', [
                    ...data.uploadSelectedFile,
                    {
                        ...thisSelectedFile,
                        tmp_path: servData.path,
                        mime_type: servData.mime_type,
                        file_ext: servData.file_ext,
                        file_size: servData.file_size,
                        isUploading: false,
                    },
                ]);
            } catch (err) {
                console.log('error upload ', err);
                throw err;
            } finally {
                setIsUploading(false);
            }
        }
    }

    async function removeFile(uploaded: UploadSelectedFileType) {
        if (!uploaded.tmp_path) return;
        uploaded.isRemoving = true;
        setData('uploadSelectedFile', [...data.uploadSelectedFile, uploaded]);
        setIsRemoving(true);
        try {
            const fd = new FormData();
            fd.append('tmp_path', uploaded.tmp_path);
            await axios.post('/remove-from-tmp', fd);
            uploaded.preview = null;
            uploaded.upload_progress = 0;
            uploaded.isRemoving = false;
            setData('uploadSelectedFile', [
                ...data.uploadSelectedFile,
                uploaded,
            ]);
        } catch (err) {
            console.log('error upload ', uploaded.requirement_id, err);
            throw err;
        } finally {
            uploaded.isRemoving = false;
            setData('uploadSelectedFile', [
                ...data.uploadSelectedFile,
                uploaded,
            ]);
            setData(
                'uploadSelectedFile',
                data.uploadSelectedFile.filter(
                    (item) => item.requirement_id !== uploaded.requirement_id,
                ),
            );
            setIsRemoving(false);
        }
    }

    // Soumettre le formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('activity_id', data.activity_id.toString());
        const uploadedFiles: UploadSelectedFileType[] = [];
        data.uploadSelectedFile.forEach((item: UploadSelectedFileType) => {
            const title = deliverableRequirements?.find(
                (del) => del.id == item.requirement_id,
            )?.title;
            // Your logic here
            const select: UploadSelectedFileType = {
                tmp_path: item.tmp_path,
                mime_type: item.mime_type,
                file_ext: item.file_ext,
                file_size: item.file_size,
                requirement_id: item.requirement_id,
                title: title,
            };
            uploadedFiles.push(select);
        });
        formData.append('uploaded_list', JSON.stringify(uploadedFiles));

        router.post(store(activity.id), formData as any, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    function getAcceptedFileType(type: string) {
        switch (type) {
            case 'video':
                return 'video/*';
            case 'audio':
                return 'audio/*';
            case 'image':
                return 'image/*';
            default:
                return '';
        }
    }

    const isFormValid =
        data.title &&
        data.uploadSelectedFile.length > 0 &&
        !isUploading &&
        !isRemoving &&
        !processing;

    console.log('errors ', errors);
    const canResubmit = Boolean(
        submission &&
            submission.status !== 'graded' &&
            activity.allow_resubmission &&
            activity.deliverable_deadline &&
            new Date(activity.deliverable_deadline) > new Date() &&
            activity.max_attempts &&
            submission.nb_attempt < activity.max_attempts,
    );
    return (
        <StudentLayouts title="Formulaire de soumission d'activité">
            <div className="mx-auto max-w-4xl">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {activity.title}
                    </h1>
                    {activity.description && (
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {activity.description}
                        </p>
                    )}
                </div>

                {/* Alertes et infos */}
                <div className="mb-6 space-y-4">
                    {/* Alerte - Date limite dépassée */}
                    {isLate && !activity.allow_late_submission && (
                        <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                La date limite de soumission est dépassée. Les
                                soumissions ne sont plus acceptées pour cette
                                activité.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Alerte - Soumission tardive possible */}
                    {isLate && activity.allow_late_submission && (
                        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                                Vous soumettez après la date limite.
                                {activity.late_penalty_percentage && (
                                    <span>
                                        {' '}
                                        Une pénalité de{' '}
                                        {activity.late_penalty_percentage}% sera
                                        appliquée.
                                    </span>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Alerte - Date limite proche */}
                    {isDeadlineSoon && !isLate && (
                        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <AlertDescription className="text-orange-800 dark:text-orange-200">
                                La date limite est très proche :{' '}
                                {formatCompleteDate(
                                    activity.deliverable_deadline ?? '',
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Info - Soumission re-soumise */}
                    {submission && isResubmission && (
                        <div className="border-b pb-5">
                            {canResubmit && (
                                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                                        Vous re-soumettez cette activité. Votre
                                        version précédente sera remplacée.
                                        {activity.max_attempts &&
                                            submission.nb_attempt >= 1 && (
                                                <span>
                                                    Tentatives restantes :{' '}
                                                    <b>
                                                        {activity.max_attempts -
                                                            submission.nb_attempt}
                                                    </b>{' '}
                                                    sur{' '}
                                                    <b>
                                                        {activity.max_attempts}
                                                    </b>
                                                </span>
                                            )}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Dernière soumission :{' '}
                                    {formatCompleteDate(
                                        submission.created_at ?? '',
                                    )}{' '}
                                    - Statut :{' '}
                                    <span
                                        className={`font-medium ${
                                            submission.status === 'graded'
                                                ? 'text-green-600 dark:text-green-400'
                                                : submission.status ===
                                                    'submitted'
                                                  ? 'text-yellow-600 dark:text-yellow-400'
                                                  : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        {submission.status === 'graded'
                                            ? 'Évaluée'
                                            : submission.status === 'submitted'
                                              ? "En attente d'évaluation"
                                              : 'Non soumise'}
                                    </span>{' '}
                                </p>

                                {submissionUploads &&
                                    submissionUploads.length > 0 && (
                                        <>
                                            <h4 className="mt-4 mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                                Fichiers soumis :{' '}
                                            </h4>
                                            <UploadListShared
                                                submissionUploads={
                                                    submissionUploads
                                                }
                                            />
                                        </>
                                    )}
                            </div>
                        </div>
                    )}

                    {/* Info - Soumission déjà évaluée */}
                    {submission && submission.status === 'graded' && (
                        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                Cette activité a déjà été évaluée.
                                {activity.allow_resubmission ? (
                                    <span>
                                        {' '}
                                        Vous pouvez la re-soumettre pour
                                        amélioration.
                                    </span>
                                ) : (
                                    <span>
                                        {' '}
                                        Aucune re-soumission n&apos;est
                                        possible.
                                    </span>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Infos sur l'activité */}
                <div className="mb-8 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {activity.deliverable_deadline && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Date limite
                                </p>
                                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                    {formatCompleteDate(
                                        activity.deliverable_deadline ?? '',
                                    )}
                                </p>
                            </div>
                        )}

                        {activity.is_evaluated && (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Note maximale
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                        {activity.evaluation_max_weight}{' '}
                                        {activity.note_unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Moyènne
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                        {activity.evaluation_weight}{' '}
                                        {activity.note_unit}
                                    </p>
                                </div>
                            </>
                        )}

                        {activity.is_collaborative && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Type de travail
                                </p>
                                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                    Collaboratif
                                    {activity.max_group_size && (
                                        <span>
                                            {' '}
                                            (Max {activity.max_group_size})
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}

                        {activity.is_individual && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Type de travail
                                </p>
                                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                    Individuel
                                </p>
                            </div>
                        )}

                        {submission && submission.score !== null && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Note actuelle
                                </p>
                                <p className="mt-1 text-base font-semibold text-green-600 dark:text-green-400">
                                    {submission.score} /{' '}
                                    {activity.evaluation_max_weight}{' '}
                                    {activity.note_unit}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Formulaire */}
                {canResubmit && (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Titre optionnel */}
                            <div>
                                <InputField
                                    label="Titre de la soumission"
                                    type="text"
                                    value={data.title}
                                    onChange={(val) => setData('title', val)}
                                    error={errors.title}
                                    placeholder="Donnez un titre à votre soumission (optionnel)"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <TextareaField
                                    label="Description / Commentaires"
                                    value={data.description}
                                    onChange={(val) =>
                                        setData('description', val)
                                    }
                                    placeholder="Décrivez votre soumission, ajoutez des commentaires ou des explications..."
                                    rows={4}
                                    error={errors.description}
                                />
                            </div>

                            {/* Section fichiers - Conditionnelle */}
                            {activity.has_deliverable &&
                                deliverableRequirements && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Fichiers à soumettre
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>

                                        {/* Zone de dépôt de fichiers */}

                                        {deliverableRequirements.map((req) => {
                                            const thisSelectedFile =
                                                data.uploadSelectedFile.find(
                                                    (item) =>
                                                        item.requirement_id ===
                                                        req.id,
                                                );

                                            return (
                                                <div
                                                    className="mt-4"
                                                    key={req.id}
                                                >
                                                    <h3 className="text-md mb-3 font-medium text-gray-900 dark:text-white">
                                                        {req.title}
                                                    </h3>
                                                    {!thisSelectedFile && (
                                                        <label
                                                            htmlFor={`file-upload-${req.id}`}
                                                            className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                                        >
                                                            <div className="text-center">
                                                                <FileUp className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
                                                                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Cliquez ou
                                                                    glissez-déposez
                                                                    le fichier
                                                                    ici
                                                                </p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {req.file_type ==
                                                                    'file'
                                                                        ? getFileTypeLabel(
                                                                              req.allowed_file_type as FileType,
                                                                          )
                                                                        : getResourceTypeLabel(
                                                                              req.file_type as ResourceType,
                                                                          )}{' '}
                                                                    jusqu'à{' '}
                                                                    {
                                                                        req.max_size_mb
                                                                    }
                                                                    MB
                                                                </p>
                                                            </div>
                                                            <input
                                                                id={`file-upload-${req.id}`}
                                                                type="file"
                                                                accept={
                                                                    req.file_type ===
                                                                    'file'
                                                                        ? `.${req.allowed_file_type}`
                                                                        : getAcceptedFileType(
                                                                              req.allowed_file_type ??
                                                                                  '',
                                                                          )
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    handleFileChange(
                                                                        e,
                                                                        req.id,
                                                                    );
                                                                    console.log(
                                                                        'iiiddd:',
                                                                        req.id,
                                                                    );
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    )}
                                                    {thisSelectedFile?.isUploading && (
                                                        <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-6 py-10 text-center dark:border-blue-700 dark:bg-blue-900">
                                                            <Spinner />
                                                            <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">
                                                                Téléchargement
                                                                en cours...
                                                            </p>
                                                        </div>
                                                    )}

                                                    {thisSelectedFile !==
                                                        undefined &&
                                                        thisSelectedFile.preview !==
                                                            null && (
                                                            <div className="mb-4">
                                                                <Label>
                                                                    Aperçu
                                                                </Label>
                                                                <div className="mt-2 rounded border bg-muted p-2">
                                                                    {req.file_type ===
                                                                    'video' ? (
                                                                        <video
                                                                            src={
                                                                                thisSelectedFile.preview
                                                                            }
                                                                            controls
                                                                            className="max-h-96 w-full rounded"
                                                                        />
                                                                    ) : req.file_type ===
                                                                      'audio' ? (
                                                                        <audio
                                                                            src={
                                                                                thisSelectedFile.preview
                                                                            }
                                                                            controls
                                                                            className="w-full"
                                                                        />
                                                                    ) : req.file_type ===
                                                                      'image' ? (
                                                                        <img
                                                                            src={
                                                                                thisSelectedFile.preview
                                                                            }
                                                                            alt="Aperçu du fichier"
                                                                            className="max-h-96 w-full rounded object-contain"
                                                                        />
                                                                    ) : (
                                                                        <p className="text-sm text-gray-600">
                                                                            Aperçu
                                                                            non
                                                                            disponible
                                                                            pour
                                                                            ce
                                                                            type
                                                                            de
                                                                            fichier.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {thisSelectedFile && (
                                                        <div className="mt-4 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    {
                                                                        thisSelectedFile
                                                                            .file
                                                                            ?.name
                                                                    }
                                                                </p>
                                                                {thisSelectedFile &&
                                                                    thisSelectedFile.tmp_path !==
                                                                        null && (
                                                                        <Button
                                                                            disabled={
                                                                                thisSelectedFile.isRemoving ||
                                                                                uploadProgress !==
                                                                                    100
                                                                            }
                                                                            type="button"
                                                                            onClick={() => {
                                                                                removeFile(
                                                                                    thisSelectedFile,
                                                                                );
                                                                            }}
                                                                            className="cursor-pointer text-sm text-red-600 transition hover:text-red-700 hover:underline"
                                                                        >
                                                                            {thisSelectedFile.isRemoving && (
                                                                                <Spinner />
                                                                            )}
                                                                            <CiCircleRemove
                                                                                size={
                                                                                    30
                                                                                }
                                                                            />
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-full rounded-full bg-cblue transition-all duration-300"
                                                                    style={{
                                                                        width: `${thisSelectedFile.upload_progress}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {
                                                                    thisSelectedFile.upload_progress
                                                                }
                                                                % téléchargé
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                            {/* Boutons d'action */}
                            <div className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (activity.has_deliverable === 1 &&
                                            data.uploadSelectedFile.length ===
                                                0) ||
                                        !isFormValid
                                    }
                                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing && (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    )}
                                    {submission && isResubmission
                                        ? 'Re-soumettre'
                                        : 'Soumettre'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Message - Aucune action possible */}
                {submission &&
                    submission.status === 'graded' &&
                    !activity.allow_resubmission && (
                        <Alert className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                            <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <AlertDescription className="text-gray-800 dark:text-gray-200">
                                Cette activité a été évaluée et ne peut pas être
                                re-soumise.
                            </AlertDescription>
                        </Alert>
                    )}

                {/* Feedback reçu */}
                {submission && submission.feedback && (
                    <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
                        <h2 className="mb-4 text-lg font-semibold text-green-900 dark:text-green-200">
                            Retour de l'enseignant
                        </h2>
                        <p className="text-green-800 dark:text-green-200">
                            {submission.feedback}
                        </p>
                        {submission.feedback_details && (
                            <div className="mt-4 rounded bg-white/50 p-4 dark:bg-gray-800/50">
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {submission.feedback_details}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </StudentLayouts>
    );
}
