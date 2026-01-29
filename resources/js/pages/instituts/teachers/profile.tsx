import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { destroy, edit } from '@/routes/institut/teachers';
import { Teacher } from '@/types/models/institut';
import { Link, router, usePage } from '@inertiajs/react';
import InstitutUserProfile from '../shared/user-profile';
import InstitutTeachersAssignUser from './assign-user';

function parseSpecialties(s?: string | string[] | null): string[] {
    if (!s) return [];
    if (Array.isArray(s)) return s;
    try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        console.warn('Failed to parse specialties:', s);
    }
    // if comma separated string
    return (s as string)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
}

export default function InstitutTeacherProfile() {
    const { teacher } = usePage().props as unknown as {
        teacher: Teacher;
    };

    if (!teacher) {
        return (
            <InstitutLayouts title="Profil enseignant">
                <div className="mx-auto mt-12 max-w-4xl rounded-xl border border-gray-100 bg-white p-8 shadow">
                    <p className="text-center text-gray-600">
                        Aucun enseignant trouvé.
                    </p>
                </div>
            </InstitutLayouts>
        );
    }

    const specialties = parseSpecialties(teacher.specialties);
    const rating = teacher.rating ?? null;

    const handleDelete = () => {
        if (
            !confirm(
                'Confirmer la suppression de cet enseignant ? Cette action est irréversible.',
            )
        ) {
            return;
        }
        // use POST with _method=delete for compatibility
        router.post(destroy(teacher.id), {
            _method: 'delete',
        });
    };

    return (
        <InstitutLayouts
            title={`${teacher.first_name ?? ''} ${teacher.last_name ?? ''}`}
        >
            <div className="mx-auto mt-8 mb-12 max-w-5xl">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6 md:flex-row">
                        {/* Left column: avatar + contact */}
                        <div className="flex-shrink-0">
                            <div className="h-36 w-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                {teacher.profile_picture_url ? (
                                    <img
                                        src={teacher.profile_picture_url}
                                        alt={`${teacher.first_name} ${teacher.last_name}`}
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
                                    {teacher.first_name ?? ''}{' '}
                                    {teacher.last_name ?? ''}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {teacher.qualification ?? ''}
                                </p>

                                <div className="mt-3 space-y-1 text-sm text-gray-700">
                                    {teacher.email && (
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Email:{' '}
                                            </span>
                                            <a
                                                href={`mailto:${teacher.email}`}
                                                className="text-blue-600"
                                            >
                                                {teacher.email}
                                            </a>
                                        </div>
                                    )}
                                    {teacher.phone_number && (
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Téléphone:{' '}
                                            </span>
                                            <a
                                                href={`tel:${teacher.phone_number}`}
                                                className="text-blue-600"
                                            >
                                                {teacher.phone_number}
                                            </a>
                                        </div>
                                    )}
                                    {teacher.whatsapp_number && (
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                WhatsApp:{' '}
                                            </span>
                                            <a
                                                href={`https://wa.me/${teacher.whatsapp_number.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600"
                                            >
                                                {teacher.whatsapp_number}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column: details */}
                        <div className="flex-1">
                            <div className="flex flex-col justify-between gap-4 md:flex-row">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-700">
                                            {teacher.status ?? '—'}
                                        </div>
                                        {rating !== null ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg
                                                    className="h-5 w-5 text-yellow-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.962c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.377 2.455c-.784.57-1.84-.197-1.54-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.629 9.389c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.951-.69L9.05 2.927z" />
                                                </svg>
                                                <span className="font-semibold">
                                                    {rating}
                                                </span>
                                                <span className="text-gray-500">
                                                    (
                                                    {teacher.reviews_count ?? 0}{' '}
                                                    avis)
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <p className="mt-3 text-sm text-gray-600">
                                        {teacher.bio ??
                                            'Aucune biographie fournie.'}
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    <div className="flex gap-3">
                                        <Link
                                            href={edit(teacher.id)}
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
                                        Spécialités
                                    </h3>
                                    {specialties.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {specialties.map((s) => (
                                                <span
                                                    key={s}
                                                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Aucune spécialité renseignée.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                        Infos
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Diplôme:{' '}
                                            </span>
                                            {teacher.diplom ?? '—'}
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Qualification:{' '}
                                            </span>
                                            {teacher.qualification ?? '—'}
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Années d'expérience:{' '}
                                            </span>
                                            {teacher.exp_year ?? '—'}
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Localisation:{' '}
                                            </span>
                                            {(teacher.city ?? '') +
                                                (teacher.country
                                                    ? `, ${teacher.country}`
                                                    : '') || '—'}
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Date de naissance:{' '}
                                            </span>
                                            {teacher.birth_date?.toString()},
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Documents & Liens
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {teacher.cv_path && (
                                        <a
                                            href={teacher.cv_path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 ring-inset hover:bg-gray-100"
                                        >
                                            CV
                                        </a>
                                    )}
                                    {teacher.portfolio_url && (
                                        <a
                                            href={teacher.portfolio_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 ring-inset hover:bg-gray-100"
                                        >
                                            Portfolio
                                        </a>
                                    )}
                                    {/* {teacher.documents &&
                                        Array.isArray(teacher.documents) &&
                                        teacher.documents.length > 0 &&
                                        teacher.documents.map(
                                            (doc: string, idx: number) => {
                                                const url =
                                                    typeof doc === 'string'
                                                        ? doc
                                                        : doc.url;
                                                const name =
                                                    typeof doc === 'string'
                                                        ? `Document ${idx + 1}`
                                                        : (doc.name ??
                                                          `Document ${idx + 1}`);
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 ring-inset hover:bg-gray-100"
                                                    >
                                                        {name}
                                                    </a>
                                                );
                                            },
                                        )} */}
                                </div>
                            </div>

                            {/* assigner ce profile à un utilisateur */}
                            {teacher.user_id === null ? (
                                <InstitutTeachersAssignUser
                                    teacherId={teacher.id}
                                />
                            ) : (
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                        Utilisateur associé
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Ce profil d'enseignant est actuellement
                                        associé à un compte utilisateur sur la
                                        plateforme.
                                    </p>
                                    <div className="mt-4">
                                        {
                                            /* <PartnerUserProfile*/
                                            teacher.user && (
                                                <InstitutUserProfile
                                                    user={teacher.user}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </InstitutLayouts>
    );
}
