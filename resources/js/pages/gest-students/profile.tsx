import { getStudyLevelLabel, StudyLevel } from '@/lib/type';
import { destroy, edit } from '@/routes/geststudents';
import { Student } from '@/types/models/institut';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PartnerStudentAssignUser from './assign-user';
import GestLayout from './gest-layout';
import PartnerUserProfile from './user-profile';

function parseArrayField(field?: string | string[] | null): string[] {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // ignore
    }
    return (field as string)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
}

export default function PartnerStudentProfile() {
    const { student } = usePage().props as unknown as {
        student: Student;
    };

    if (!student) {
        return (
            <div>
                <Head title="Profil étudiant" />
                <div className="mx-auto mt-12 max-w-4xl rounded-xl border border-gray-100 bg-white p-8 shadow">
                    <p className="text-center text-gray-600">
                        Aucun étudiant trouvé.
                    </p>
                </div>
            </div>
        );
    }

    const interests = parseArrayField(student.interests);
    const documents = Array.isArray(student.documents)
        ? student.documents
        : parseArrayField(student.documents);

    const handleDelete = () => {
        if (
            !confirm(
                'Confirmer la suppression de cet étudiant ? Cette action est irréversible.',
            )
        )
            return;
        router.post(destroy(student.id), { _method: 'delete' });
    };

    return (
        <GestLayout title="Profile étudiant">
            <Head
                title={`${student.first_name ?? ''} ${student.last_name ?? ''}`}
            />
            <div className="mx-auto mt-8 mb-12 max-w-5xl">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-6 p-6 md:flex-row">
                        {/* Left column: avatar + basic */}
                        <div className="flex-shrink-0">
                            <div className="h-36 w-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                {student.profile_picture_url ? (
                                    <img
                                        src={student.profile_picture_url}
                                        alt={`${student.first_name} ${student.last_name}`}
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
                                    {student.first_name ?? ''}{' '}
                                    {student.last_name ?? ''}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {student.current_level
                                        ? getStudyLevelLabel(
                                              student.current_level as StudyLevel,
                                          )
                                        : '—'}
                                </p>

                                <div className="mt-3 space-y-1 text-sm text-gray-700">
                                    {student.email && (
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Email:{' '}
                                            </span>
                                            <a
                                                href={`mailto:${student.email}`}
                                                className="text-blue-600"
                                            >
                                                {student.email}
                                            </a>
                                        </div>
                                    )}
                                    {student.phone_number && (
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Téléphone:{' '}
                                            </span>
                                            <a
                                                href={`tel:${student.phone_number}`}
                                                className="text-blue-600"
                                            >
                                                {student.phone_number}
                                            </a>
                                        </div>
                                    )}
                                    {student.student_code && (
                                        <div>
                                            <span className="font-medium text-gray-800">
                                                Matricule:{' '}
                                            </span>
                                            <span className="text-gray-700">
                                                {student.student_code}
                                            </span>
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
                                        <div
                                            className={`rounded px-3 py-1 text-sm font-medium ${
                                                student.is_active
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {student.is_active
                                                ? 'Actif'
                                                : 'Inactif'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <div className="flex gap-3">
                                        <Link
                                            href={edit(student.id)}
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

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                        Infos académiques
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Niveau:{' '}
                                            </span>
                                            {student.current_level
                                                ? getStudyLevelLabel(
                                                      student.current_level as StudyLevel,
                                                  )
                                                : '—'}
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                        Localisation & Contact
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Adresse:{' '}
                                            </span>
                                            {(student.address ?? '') +
                                                (student.postal_code
                                                    ? `, ${student.postal_code}`
                                                    : '') || '—'}
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Ville / Pays:{' '}
                                            </span>
                                            {(student.city ?? '') +
                                                (student.country
                                                    ? `, ${student.country}`
                                                    : '') || '—'}
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-800">
                                                Crédits:{' '}
                                            </span>
                                            {typeof student.credits === 'number'
                                                ? student.credits
                                                : '—'}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Intérêts
                                </h3>
                                {interests.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {interests.map((i) => (
                                            <span
                                                key={i}
                                                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                                            >
                                                {i}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Aucun intérêt renseigné.
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Contacts d'urgence
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Nom:{' '}
                                        </span>
                                        {student.guardian_name ?? '—'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Téléphone:{' '}
                                        </span>
                                        {student.guardian_phone ?? '—'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-800">
                                            Email:{' '}
                                        </span>
                                        {student.guardian_email ?? '—'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Documents
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {student.profile_picture_url && (
                                        <a
                                            href={student.profile_picture_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                                        >
                                            Photo
                                        </a>
                                    )}
                                    {student.student_code && (
                                        <span className="rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200">
                                            Code: {student.student_code}
                                        </span>
                                    )}
                                    {documents && documents.length > 0 ? (
                                        documents.map((doc, idx: number) => {
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
                                                    className="rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                                                >
                                                    {name}
                                                </a>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Aucun document disponible.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {student.medical_info && (
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                        Informations médicales
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {student.medical_info}
                                    </p>
                                </div>
                            )}

                            {/* assigner ce profile à un utilisateur */}
                            {student.user_id === null ? (
                                <PartnerStudentAssignUser
                                    studentId={student.id}
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
                                            student.user && (
                                                <PartnerUserProfile
                                                    user={student.user}
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
        </GestLayout>
    );
}
