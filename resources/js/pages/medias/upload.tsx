import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { TagsInput } from '@/components/shared/tags-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTmpUpload } from '@/hooks/use-tmp-upload';
import {
    langueLabels,
    PedagogicalRole,
    pedagogicalRoleLabels,
    resourceTypeLabels,
    storageTypeLabels,
} from '@/lib/type';
import {
    store,
    storeEntityResource,
    update,
    updateEntityResource,
} from '@/routes/medias';
import { Resource } from '@/types/models/others';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { CiCircleRemove } from 'react-icons/ci';
import { FaUpload } from 'react-icons/fa';
import MediasLayout from './medias-layout';

type UploadMediasProps = {
    media?: Resource | null;
    entity_type?: string | null;
    entity_id?: number | null;
};
export default function UploadMedias() {
    // entity_type / entity_id (optional) passed by controller when uploading a resource for an entity
    const { media, entity_type, entity_id } = usePage()
        .props as unknown as UploadMediasProps;
    const { errors } = usePage().props as unknown as {
        errors: Record<string, string>;
    };
    const isEdit = !!media;
    const [acceptedFileTypes, setAcceptedFileTypes] = useState<string>('');
    const { data, setData, reset } = useForm({
        title: media?.title ?? '',
        description: media?.description ?? '',
        resource_type: media?.resource_type ?? ('' as string),
        storage_type: media?.storage_type ?? ('local' as string),
        file: null as File | null,
        url: '',
        url_public_id: '',
        mime_type: '',
        file_ext: '',
        file_size: null as number | null,
        duration_minute: null as number | null,
        language: media?.language ?? 'fr',
        accessibility_level: media?.accessibility_level ?? '',
        pedagogical_role: media?.pedagogical_role ?? 'support',
        is_mandatory: isEdit ? media?.is_mandatory == 1 : false,
        is_downloadable: isEdit ? media?.is_downloadable == 1 : false,
        learning_objectives:
            isEdit && media.learning_objectives != null
                ? (JSON.parse(media?.learning_objectives) as string[])
                : ([] as string[]),
        keywords:
            isEdit && media.keywords != null
                ? (JSON.parse(media?.keywords) as string[])
                : ([] as string[]),
        tags:
            isEdit && media.tags != null
                ? (JSON.parse(media?.tags) as string[])
                : ([] as string[]),
        author: '',
        source: '',
        license: '',
        access_instructions: '',
        is_visible: isEdit ? media.is_visible == 1 : true,
        tmp_path: '',
    });

    const {
        file: selectedFile,
        tmpPath,
        filePreview,
        uploadProgress,
        isRemoving,
        handleFileChange,
        isUploading,
        remove,
    } = useTmpUpload({
        onUploadSuccess: (data) => {
            setData('tmp_path', data.path);
            setData('mime_type', data.mime_type);
            setData('file_size', data.file_size);
            setData('file_ext', data.file_ext);
        },
        onRemoveSuccess: () => setData('tmp_path', ''),
    });

    const [processing, setProcessing] = useState(false);

    const isUploadResourceType =
        data.resource_type === 'video' ||
        data.resource_type === 'audio' ||
        data.resource_type === 'document' ||
        data.resource_type === 'image';
    const showDurationField =
        isUploadResourceType &&
        data.resource_type !== 'document' &&
        data.resource_type !== 'image';
    useEffect(() => {
        // cleanup preview URL on unmount
        return () => {
            if (filePreview) URL.revokeObjectURL(filePreview);
        };
    }, [filePreview]);

    async function submitForm(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setData('file_size', selectedFile ? selectedFile.size : null);
        setData('mime_type', selectedFile ? selectedFile.type : '');

        // Attach entity if present
        const uploadUrl =
            entity_type && entity_id
                ? storeEntityResource([entity_type, entity_id]).url
                : store().url;
        const updateUrl =
            entity_type && entity_id
                ? updateEntityResource([media?.id ?? 0, entity_type, entity_id])
                      .url
                : update(media?.id ?? 0).url;
        if (isEdit) {
            await router.post(updateUrl, data, {
                forceFormData: true,
                onFinish: handleOnFinish,
            });
        } else {
            await router.post(uploadUrl, data, {
                forceFormData: true,
                onFinish: handleOnFinish,
            });
        }
    }
    function handleOnFinish() {
        setProcessing(false);
        reset(
            'file',
            'title',
            'description',
            'url',
            'mime_type',
            'file_size',
            'tags',
            'keywords',
        );
    }
    function setAcceptedFileTypesForResourceType(resourceType: string) {
        switch (resourceType) {
            case 'video':
                setAcceptedFileTypes('video/*');
                break;
            case 'audio':
                setAcceptedFileTypes('audio/*');
                break;
            case 'image':
                setAcceptedFileTypes('image/*');
                break;
            case 'document':
                setAcceptedFileTypes(
                    '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.odt',
                );
                break;
            default:
                setAcceptedFileTypes('');
        }
    }

    useEffect(() => {
        (() => {
            setAcceptedFileTypesForResourceType(data.resource_type);
        })();
    }, [data.resource_type]);

    useEffect(() => setData('tmp_path', tmpPath), [setData, tmpPath]);
    const isFormValid =
        data.title &&
        data.resource_type &&
        (isUploadResourceType && !isEdit ? data.tmp_path !== '' : true) &&
        !isUploading &&
        !isRemoving &&
        !processing &&
        (!isUploadResourceType ||
            data.url === '' ||
            /^https?:\/\//.test(data.url));
    console.log('errors', errors);
    return (
        <MediasLayout title="Upload médias">
            <Head title="Upload médias" />
            <div className="mx-auto mt-8 max-w-3xl">
                <form
                    onSubmit={submitForm}
                    className="rounded-lg border bg-white p-6 shadow"
                    encType="multipart/form-data"
                >
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Uploader un média
                    </h2>

                    {/* Identification */}
                    <div className="mb-4 grid gap-3">
                        <div>
                            <InputField
                                label="Titre"
                                value={data.title}
                                onChange={(val) => setData('title', val)}
                                placeholder="Titre"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <TextareaField
                                label="Description"
                                placeholder="Description"
                                value={data.description}
                                onChange={(val) => setData('description', val)}
                                rows={3}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Typologie & Support technique */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <SelectField
                            label="Type de ressource"
                            value={data.resource_type}
                            options={resourceTypeLabels}
                            onChange={(val) => setData('resource_type', val)}
                            error={errors.resource_type}
                        />
                        {isUploadResourceType && (
                            <>
                                <SelectField
                                    label="Stockage"
                                    value={data.storage_type}
                                    options={storageTypeLabels}
                                    onChange={(val) =>
                                        setData('storage_type', val)
                                    }
                                    error={errors.storage_type}
                                />
                                <div className="col-span-2">
                                    {data.tmp_path == '' && !isUploading && (
                                        <div>
                                            <Label
                                                htmlFor="uploadFile"
                                                className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-gray-50 p-3 hover:bg-gray-100"
                                            >
                                                <FaUpload size={40} />
                                                <div className="mt-2 text-sm text-gray-600">
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : 'Aucun fichier sélectionné'}
                                                </div>
                                            </Label>
                                            <input
                                                type="file"
                                                id="uploadFile"
                                                accept={acceptedFileTypes}
                                                disabled={
                                                    data.tmp_path !== ''
                                                        ? true
                                                        : false
                                                }
                                                className="hidden"
                                                onChange={(e) => {
                                                    handleFileChange(e);
                                                    console.log(
                                                        'File selected:',
                                                        e.target.files,
                                                    );
                                                }}
                                            />
                                            {errors.file && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.file}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {/* Preview / metadata */}
                                    {filePreview && (
                                        <div className="mb-4">
                                            <Label>Aperçu</Label>
                                            <div className="mt-2 rounded border bg-muted p-2">
                                                {data.resource_type ===
                                                'video' ? (
                                                    <video
                                                        src={filePreview}
                                                        controls
                                                        className="max-h-96 w-full rounded"
                                                    />
                                                ) : data.resource_type ===
                                                  'audio' ? (
                                                    <audio
                                                        src={filePreview}
                                                        controls
                                                        className="w-full"
                                                    />
                                                ) : data.resource_type ===
                                                  'image' ? (
                                                    <img
                                                        src={filePreview}
                                                        alt="Aperçu du fichier"
                                                        className="max-h-96 w-full rounded object-contain"
                                                    />
                                                ) : (
                                                    <p className="text-sm text-gray-600">
                                                        Aperçu non disponible
                                                        pour ce type de fichier.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {selectedFile && (
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {selectedFile.name}
                                                </p>
                                                <Button
                                                    disabled={
                                                        isRemoving ||
                                                        uploadProgress !== 100
                                                    }
                                                    type="button"
                                                    onClick={remove}
                                                    className="cursor-pointer text-sm text-red-600 transition hover:text-red-700 hover:underline"
                                                >
                                                    {isRemoving && <Spinner />}
                                                    <CiCircleRemove size={30} />
                                                </Button>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-app-blue transition-all duration-300"
                                                    style={{
                                                        width: `${uploadProgress}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {uploadProgress}% téléchargé
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {!isUploadResourceType && (
                            <div>
                                <InputField
                                    label="URL (optionnel)"
                                    value={data.url}
                                    onChange={(val) => setData('url', val)}
                                    placeholder="https://..."
                                    error={errors.url}
                                />
                            </div>
                        )}
                    </div>

                    {/* Accessibility & Pedagogy */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div
                            className={showDurationField ? '' : 'sm:col-span-2'}
                        >
                            <SelectField
                                label="Langue"
                                value={data.language}
                                options={langueLabels}
                                onChange={(val) => setData('language', val)}
                                error={errors.language}
                            />
                        </div>

                        {showDurationField && (
                            <div>
                                <InputField
                                    label="Durée (minutes)"
                                    placeholder='Durée en minutes, ex: "60" pour 1 heure'
                                    type="number"
                                    value={data.duration_minute ?? ''}
                                    onChange={(val) =>
                                        setData(
                                            'duration_minute',
                                            val ? Number(val) : null,
                                        )
                                    }
                                />
                            </div>
                        )}
                    </div>
                    <SelectField
                        label="Rôle pédagogique"
                        value={data.pedagogical_role}
                        options={pedagogicalRoleLabels}
                        onChange={(val) =>
                            setData('pedagogical_role', val as PedagogicalRole)
                        }
                        error={errors.pedagogical_role}
                    />
                    <div className="my-4 grid gap-2">
                        <TagsInput
                            label="Objectifs d'apprentissage"
                            value={data.learning_objectives}
                            onChange={(val) =>
                                setData('learning_objectives', val)
                            }
                            placeholder="Objectifs d'apprentissage"
                        />
                        <TagsInput
                            label="Mots-clés"
                            value={data.keywords}
                            onChange={(val) => setData('keywords', val)}
                            placeholder="Mots-clés"
                        />
                        <TagsInput
                            label="Tags"
                            value={data.tags}
                            onChange={(val) => setData('tags', val)}
                            placeholder="Tags"
                        />
                    </div>

                    {/* Droits / statut / versioning */}
                    {isUploadResourceType && (
                        <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-4">
                                <CheckboxField
                                    label="C'est téléchargeable"
                                    checked={data.is_downloadable}
                                    onChange={(v) =>
                                        setData('is_downloadable', !!v)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="mb-4">
                        <TextareaField
                            label="Instructions d'accès / Notes internes"
                            placeholder="Instructions d'accès / Notes internes"
                            value={data.access_instructions}
                            onChange={(val) =>
                                setData('access_instructions', val)
                            }
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={processing || !isFormValid}
                        >
                            {processing && <Spinner />} Enregistrer
                        </Button>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                // reset a few fields
                                reset(
                                    'file',
                                    'title',
                                    'description',
                                    'url',
                                    'mime_type',
                                    'file_size',
                                    'tags',
                                    'keywords',
                                );
                            }}
                        >
                            Réinitialiser
                        </Button>
                    </div>
                </form>
            </div>
        </MediasLayout>
    );
}
