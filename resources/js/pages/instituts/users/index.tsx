import { InputField, SelectField } from '@/components/shared/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { getAccountRoleLabel } from '@/lib/type';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InstitutUserProfile from '../shared/user-profile';

export default function UsersIndex() {
    const getInitials = useInitials();
    const { users } = usePage().props as unknown as {
        users: User[];
    };
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
    const filtered = useMemo(() => {
        return (users || []).filter((u) => {
            if (roleFilter && u.account_role !== roleFilter) return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                (u.first_name || '').toLowerCase().includes(q) ||
                (u.last_name || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q) ||
                (u.phone_number || '').toLowerCase().includes(q)
            );
        });
    }, [query, roleFilter, users]);
    const accountRole = [
        {
            key: 'guest',
            value: 'Utilisateur',
        },
        {
            key: 'student',
            value: 'Etudiant',
        },
        {
            key: 'teacher',
            value: 'Enseignant',
        },
    ];

    return (
        <InstitutLayouts title="Liste ds utilisateurs">
            <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-8 md:grid-cols-10">
                <div className="sm:col-span-4 md:col-span-4">
                    <InputField
                        label=""
                        placeholder="Rechercher par nom, prénom, numéro ou email..."
                        value={query}
                        onChange={(val) => setQuery(val)}
                    />
                </div>
                <div className="md:col-span-2">
                    <SelectField
                        options={accountRole}
                        label=""
                        value={roleFilter ?? ''}
                        onChange={(val) => setRoleFilter(val)}
                    />
                </div>
                <Button
                    onClick={() => {
                        setQuery('');
                        setRoleFilter(undefined);
                    }}
                    className="btn-primary mt-2"
                >
                    Réinitialiser
                </Button>
            </div>
            <div className="mx-auto my-5">
                {filtered.length == 0 ? (
                    <div>Pas d'utilisateur</div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-8">
                        {filtered.map((u) => (
                            <div
                                className="flex flex-col justify-center rounded border border-gray-200 bg-white p-3 shadow-xs"
                                key={u.id}
                            >
                                {' '}
                                <div className="grid justify-center">
                                    <Avatar className="size-24 cursor-pointer overflow-hidden rounded-full">
                                        {u.profile_picture_url != null && (
                                            <AvatarImage
                                                src={u.profile_picture_url}
                                                alt={u.username}
                                            />
                                        )}
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(u.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="mt-1 grid justify-center">
                                    <Badge
                                        title={u.username}
                                        variant={'outline'}
                                    >
                                        @-{getAccountRoleLabel(u.account_role)}
                                    </Badge>
                                </div>
                                <div className="mt-4 grid justify-center text-center">
                                    <h3>
                                        {u.first_name ?? ''} {u.last_name ?? ''}
                                    </h3>
                                    <InstitutUserProfile
                                        user={u}
                                        title="Détails"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </InstitutLayouts>
    );
}
