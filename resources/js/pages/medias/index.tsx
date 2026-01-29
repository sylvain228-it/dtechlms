import { InputField, SelectField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { getResourceTypeLabel, resourceTypeLabels } from '@/lib/type';
import { sizeFromFormatBytes } from '@/lib/utils';
import { viewPdf } from '@/routes';
import {
    create,
    createEntityResource,
    deleteEntityResource,
    destroy,
    editEntityResource,
} from '@/routes/medias';
import {
    EntityResource,
    Resource as ResourceType,
} from '@/types/models/others';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { IoDocumentOutline } from 'react-icons/io5';
import MediasLayout from './medias-layout';

type Props = {
    allMedias: ResourceType[];
    entityResources: EntityResource[];
    entity_type: string;
    entity_id: number;
};

export default function MediasIndex() {
    const { allMedias, entityResources, entity_type, entity_id } = usePage()
        .props as unknown as Props;
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selected, setSelected] = useState<Record<number, boolean>>({});
    const [openMedia, setOpenMedia] = useState<ResourceType | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const medias =
        entity_type == undefined || entity_id == undefined
            ? allMedias
            : (entityResources.map((er) => er.resource) as ResourceType[]);
    const filtered = useMemo(() => {
        return (medias || []).filter((m) => {
            if (typeFilter && m.resource_type !== typeFilter) return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                (m.title || '').toLowerCase().includes(q) ||
                (m.slug || '').toLowerCase().includes(q) ||
                (m.mime_type || '').toLowerCase().includes(q)
            );
        });
    }, [medias, query, typeFilter]);

    function toggleSelect(id?: number) {
        if (!id) return;
        setSelected((s) => ({ ...s, [id]: !s[id] }));
    }
    function selectAllVisible() {
        const allSelected = filtered.every((m) => selected[m.id || 0]);
        const next: Record<number, boolean> = {};
        filtered.forEach((m) => {
            next[m.id || 0] = !allSelected;
        });
        setSelected(next);
    }
    function handleOnFinish() {
        setIsDeleting(false);
    }
    async function deleteMedia(id?: number) {
        if (!id) return;
        if (!confirm('Supprimer ce média ?')) return;
        const deleteUrl =
            entity_type && entity_id
                ? deleteEntityResource([id, entity_type, entity_id]).url
                : destroy(id).url;
        setIsDeleting(true);
        await router.delete(deleteUrl, {
            onFinish: handleOnFinish,
            onError: (e) => console.log('error ', e),
        });
    }

    async function deleteSelected() {
        const ids = Object.entries(selected)
            .filter(([, v]) => v)
            .map(([k]) => Number(k));
        if (!ids.length) return alert('Aucun média sélectionné');
        if (!confirm(`Supprimer ${ids.length} médias ?`)) return;
        // delete sequentially - backend bulk route not required here
        setIsDeleting(true);
        for (const id of ids) {
            const deleteUrl =
                entity_type && entity_id
                    ? deleteEntityResource([id, entity_type, entity_id]).url
                    : destroy(id).url;
            await router.delete(deleteUrl, {
                onFinish: handleOnFinish,
                onError: (e) => console.log('error ', e),
            });
        }
        setSelected({});
    }
    async function copyUrl(url?: string | null) {
        if (!url) return;
        await navigator.clipboard.writeText(url);
        alert('URL copiée');
    }
    const addMediaUrl =
        entity_type && entity_id
            ? createEntityResource([entity_type, entity_id])
            : create();
    function isImageFile(file_ext: string): boolean {
        return file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png';
    }
    return (
        <MediasLayout title="Médiathèque">
            <Head title="Médiathèque" />
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link
                            href={addMediaUrl}
                            className="inline-flex items-center gap-2"
                        >
                            Upload
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                        }
                    >
                        {viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
                    </Button>
                    <Button
                        disabled={isDeleting}
                        variant="destructive"
                        onClick={deleteSelected}
                    >
                        <div className="flex">
                            {isDeleting && <Spinner />}
                            Supprimer sélection
                        </div>
                    </Button>
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <InputField
                        label=""
                        placeholder="Rechercher par titre, ou type..."
                        value={query}
                        onChange={(val) => setQuery(val)}
                    />

                    <div className="min-w-[200px]">
                        <SelectField
                            options={resourceTypeLabels}
                            label=""
                            value={typeFilter ?? ''}
                            onChange={(val) => setTypeFilter(val)}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setQuery('');
                            setTypeFilter(undefined);
                        }}
                        className="btn-primary mt-2"
                    >
                        Réinitialiser
                    </Button>
                </div>
            </div>

            {/* Grid / List */}
            {viewMode === 'grid' ? (
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <input
                            type="checkbox"
                            aria-label="Select all"
                            checked={
                                filtered.length > 0 &&
                                filtered.every((m) => selected[m.id || 0])
                            }
                            onChange={selectAllVisible}
                        />
                        <div className="text-sm text-muted-foreground">
                            {filtered.length} éléments
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {filtered.map((m) => (
                            <div
                                key={m.id}
                                className="relative rounded border bg-card p-2"
                            >
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!!selected[m.id || 0]}
                                        onChange={() => toggleSelect(m.id)}
                                    />
                                    <div className="ml-auto flex gap-1">
                                        <button
                                            title="Aperçu"
                                            className="btn-ghost text-sm"
                                            onClick={() => setOpenMedia(m)}
                                        >
                                            Aperçu
                                        </button>
                                        <Link
                                            className="btn-ghost text-sm"
                                            href={editEntityResource([
                                                m.slug,
                                                entity_type,
                                                entity_id,
                                            ])}
                                        >
                                            Éditer
                                        </Link>
                                        <button
                                            title="Supprimer"
                                            disabled={isDeleting}
                                            className="btn-ghost text-sm text-destructive"
                                            onClick={() => deleteMedia(m.id)}
                                        >
                                            <div className="flex">
                                                {isDeleting && <Spinner />}
                                                Supprimer
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex h-40 items-center justify-center overflow-hidden rounded bg-muted">
                                    {/* image preview if image */}
                                    <div>
                                        {isImageFile(m.file_ext ?? '') &&
                                            m.url && (
                                                <img
                                                    src={m.url}
                                                    alt={m.title}
                                                    className="h-full max-h-[300px] w-full object-cover"
                                                />
                                            )}

                                        {m.file_ext && m.file_ext == 'pdf' && (
                                            <Link href={viewPdf(m.slug)}>
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <IoDocumentOutline
                                                        size={40}
                                                    />
                                                    <h3>Document PDF</h3>
                                                </div>
                                            </Link>
                                        )}
                                        {/* <div className="p-2 text-center text-sm">
                                            <div className="font-medium">
                                                {getResourceTypeLabel(
                                                    m.resource_type,
                                                )}
                                            </div>
                                            <div className="text-xs">
                                                {m.mime_type}
                                            </div>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="truncate font-medium">
                                        {m.attribution ?? ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 border-b p-2 font-semibold">
                        <div className="col-span-1" />
                        <div className="col-span-6">Titre</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Taille</div>
                        <div className="col-span-1">Actions</div>
                    </div>
                    {filtered.map((m) => (
                        <div
                            key={m.id}
                            className="grid grid-cols-12 items-center gap-2 rounded border p-2"
                        >
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    checked={!!selected[m.id || 0]}
                                    onChange={() => toggleSelect(m.id)}
                                />
                            </div>
                            <div className="col-span-6">
                                <div className="font-medium">{m.title}</div>
                                <div className="text-xs text-muted-foreground">
                                    {m.slug}
                                </div>
                            </div>
                            <div className="col-span-2">
                                {getResourceTypeLabel(m.resource_type)}
                            </div>
                            <div className="col-span-2">
                                {sizeFromFormatBytes(m.file_size)}
                            </div>
                            <div className="col-span-1 flex gap-2">
                                <button
                                    className="btn-ghost text-sm"
                                    onClick={() => setOpenMedia(m)}
                                >
                                    Aperçu
                                </button>
                                <Link
                                    className="btn-ghost text-sm"
                                    href={editEntityResource([
                                        m.slug,
                                        entity_type,
                                        entity_id,
                                    ])}
                                >
                                    Éditer
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview dialog */}
            <Dialog
                open={!!openMedia}
                onOpenChange={(open) => !open && setOpenMedia(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{openMedia?.title}</DialogTitle>
                        <DialogDescription>
                            {openMedia?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {openMedia?.resource_type == 'image' &&
                        openMedia?.url ? (
                            <img
                                src={openMedia.url}
                                alt={openMedia.title}
                                className="max-h-[400px] w-full rounded object-cover"
                            />
                        ) : (
                            <div className="rounded bg-muted p-6 text-center">
                                <div className="mb-2 font-medium">
                                    {openMedia?.mime_type}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {openMedia?.resource_type}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="text-sm">
                                <strong>Type:</strong>{' '}
                                {openMedia &&
                                    getResourceTypeLabel(
                                        openMedia.resource_type,
                                    )}
                            </div>
                            <div className="text-sm">
                                <strong>Taille:</strong>{' '}
                                {sizeFromFormatBytes(openMedia?.file_size)}
                            </div>
                            <div className="text-sm">
                                <strong>Mime:</strong> {openMedia?.mime_type}
                            </div>
                            <div className="text-sm">
                                <strong>Créé:</strong>{' '}
                                {openMedia?.created_at
                                    ? new Date(
                                          openMedia.created_at,
                                      ).toLocaleString()
                                    : ''}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button onClick={() => copyUrl(openMedia?.url)}>
                            Copier l'URL
                        </Button>
                        <a
                            className="btn"
                            href={openMedia?.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button>Ouvrir</Button>
                        </a>
                        <Button
                            variant="ghost"
                            onClick={() => setOpenMedia(null)}
                        >
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MediasLayout>
    );
}
