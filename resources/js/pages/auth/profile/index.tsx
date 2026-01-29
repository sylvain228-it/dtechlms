import { edit } from '@/routes/auth/profile';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, Mail, Phone, Shield } from 'lucide-react';
import UserLayout from '../user-layout';

function initials(name?: string) {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserProfile() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const fullName =
        `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim();
    const joined = auth.user.created_at
        ? new Date(auth.user.created_at).toLocaleDateString()
        : '';

    return (
        <UserLayout title="Mon profile">
            <section className="mx-auto max-w-5xl p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <div className="flex flex-col items-center rounded-lg bg-white/80 p-6 shadow-sm dark:bg-slate-800">
                            <div className="relative mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                {auth.user.profile_picture_url ? (
                                    <img
                                        src={
                                            auth.user
                                                .profile_picture_url as string
                                        }
                                        alt={fullName || auth.user.username}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-semibold">
                                        {initials(
                                            fullName || auth.user.username,
                                        )}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-center text-xl font-medium text-slate-900 dark:text-slate-100">
                                {fullName || auth.user.username}
                            </h2>

                            <div className="mt-4 flex w-full flex-col gap-2">
                                <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm">
                                    <Mail size={16} />
                                    <span className="truncate">
                                        {auth.user.email}
                                    </span>
                                </div>

                                {auth.user.phone_number && (
                                    <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm">
                                        <Phone size={16} />
                                        <span>{auth.user.phone_number}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle size={16} />
                                        <span>
                                            {auth.user.email_verified_at
                                                ? 'Email vérifié'
                                                : 'Email non vérifié'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Shield size={14} />
                                        <span>
                                            {auth.user.two_factor_enabled
                                                ? '2FA activé'
                                                : '2FA désactivé'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-slate-400">
                                    <Calendar
                                        size={14}
                                        className="inline-block"
                                    />
                                    <span className="ml-2">
                                        Membre depuis {joined}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="rounded-lg bg-white/80 p-6 shadow-sm dark:bg-slate-800">
                            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                À propos
                            </h3>

                            <div className="grid gap-3 rounded-md border border-slate-100 p-4 dark:border-slate-700">
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    Informations personnelles
                                </h4>
                                <p className="te flex-wrapxt-sm flex justify-between border-t border-l p-3 text-slate-500">
                                    Nom d'utilisateur:{' '}
                                    <span className="font-medium text-slate-700 dark:text-slate-100">
                                        {auth.user.username}
                                    </span>
                                </p>
                                <p className="te flex-wrapxt-sm flex justify-between border-t border-l p-3 text-slate-500">
                                    Email:{' '}
                                    <span className="font-medium text-slate-700 dark:text-slate-100">
                                        {auth.user.email}
                                    </span>
                                </p>
                                {auth.user.phone_number && (
                                    <p className="flex flex-wrap justify-between border-t border-l p-3 text-sm text-slate-500">
                                        Téléphone:{' '}
                                        <span className="font-medium text-slate-700 dark:text-slate-100">
                                            {auth.user.phone_number}
                                        </span>
                                    </p>
                                )}
                                {fullName && (
                                    <p className="flex flex-wrap justify-between border-t border-l p-3 text-sm text-slate-500">
                                        Nom complet:{' '}
                                        <span className="font-medium text-slate-700 dark:text-slate-100">
                                            {fullName}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <Link
                                className="btn-primary mt-4 block w-full text-center"
                                href={edit()}
                            >
                                Mettre à jour
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
