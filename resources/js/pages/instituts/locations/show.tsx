import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { formatDate } from '@/lib/utils';
import { destroy, edit } from '@/routes/institut/locations';
import { Location } from '@/types/models/institut';
import { Link, router, usePage } from '@inertiajs/react';

export default function LocationDetails() {
    const { location } = usePage().props as unknown as {
        location: Location;
    };

    if (!location) {
        return (
            <InstitutLayouts title="Détails de l'établissement">
                <div className="mx-auto mt-12 max-w-4xl rounded-xl border border-gray-100 bg-white p-8 shadow">
                    <p className="text-center text-gray-600">
                        Aucun établissement trouvé.
                    </p>
                </div>
            </InstitutLayouts>
        );
    }

    const handleDelete = () => {
        if (
            !confirm(
                'Confirmer la suppression de cet établissement ? Cette action est irréversible.',
            )
        ) {
            return;
        }
        router.post(destroy(location.id), { _method: 'delete' });
    };

    const mapsSrc = location.maps_url
        ? location.maps_url
        : location.latitude && location.longitude
          ? `https://maps.google.com?q=${location.latitude},${location.longitude}&z=15&output=embed`
          : null;

    return (
        <InstitutLayouts title={`Détails de l'établissement: ${location.name}`}>
            <div className="mx-auto mt-8 mb-12 max-w-5xl">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Cover */}
                    <div className="h-56 w-full overflow-hidden rounded-t-xl bg-gray-100">
                        {location.cover_url ? (
                            <img
                                src={location.cover_url as string}
                                alt={location.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-300">
                                <svg
                                    className="h-16 w-16"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-3 3 3 4-3 4 3z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* Left column: thumbnail + basic info */}
                            <div className="flex-shrink-0">
                                <div className="h-36 w-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    {location.cover_url ? (
                                        <img
                                            src={location.cover_url as string}
                                            alt={location.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <svg
                                                className="h-16 w-16"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2a7 7 0 110 14 7 7 0 010-14zm0 16c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 space-y-2">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {location.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {location.address ??
                                            'Adresse non renseignée'}
                                    </p>
                                </div>
                            </div>

                            {/* Right column: actions & details */}
                            <div className="flex-1">
                                <div className="flex flex-col justify-between gap-4 md:flex-row">
                                    <div>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <p className="text-sm text-gray-600">
                                                {location.address_line ?? ''}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {(location.city ?? '') +
                                                    (location.country
                                                        ? `, ${location.country}`
                                                        : '')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div className="flex gap-3">
                                            <Link
                                                href={edit(location.id)}
                                                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 ring-inset hover:bg-gray-50"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                            Infos
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>
                                                <span className="font-medium text-gray-800">
                                                    Créé le:{' '}
                                                </span>
                                                {formatDate(
                                                    location.created_at,
                                                )}
                                            </li>
                                            <li>
                                                <span className="font-medium text-gray-800">
                                                    Mis à jour:{' '}
                                                </span>
                                                {formatDate(
                                                    location.updated_at,
                                                )}
                                            </li>
                                            <li>
                                                <span className="font-medium text-gray-800">
                                                    Latitude / Longitude:{' '}
                                                </span>
                                                {location.latitude ?? '—'}
                                                {location.longitude
                                                    ? ` / ${location.longitude}`
                                                    : ''}
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                            Coordonnées
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            <p>{location.address ?? '—'}</p>
                                            {location.maps_url && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Lien Maps disponible
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Map & sections */}
                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Emplacement
                                </h3>
                                {mapsSrc ? (
                                    <div className="h-64 w-full overflow-hidden rounded-md border border-gray-100">
                                        <iframe
                                            src={mapsSrc}
                                            className="h-full w-full"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                        Pas de position Maps disponible.
                                    </div>
                                )}
                            </div>{' '}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Détails rapides
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="rounded-md bg-gray-50 px-3 py-2">
                                        <div className="text-xs text-gray-500">
                                            Ville
                                        </div>
                                        <div className="font-medium text-gray-800">
                                            {location.city ?? '—'}
                                        </div>
                                    </div>
                                    <div className="rounded-md bg-gray-50 px-3 py-2">
                                        <div className="text-xs text-gray-500">
                                            Pays
                                        </div>
                                        <div className="font-medium text-gray-800">
                                            {location.country ?? '—'}
                                        </div>
                                    </div>
                                    <div className="rounded-md bg-gray-50 px-3 py-2">
                                        <div className="text-xs text-gray-500">
                                            Adresses
                                        </div>
                                        <div className="font-medium break-words text-gray-800">
                                            {location.address ?? '—'}
                                            {/* adresse ligne */}
                                            {location.address_line
                                                ? `, ${location.address_line}`
                                                : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </InstitutLayouts>
    );
}
