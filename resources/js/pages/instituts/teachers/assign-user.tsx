import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { assigntouser, searchUser } from '@/routes/institut/teachers';
import { User } from '@/types';
import { SearchIcon } from 'lucide-react';
import React from 'react';

export default function InstitutTeachersAssignUser({
    teacherId,
}: {
    teacherId?: number;
}) {
    const [searchKey, setSearchKey] = React.useState('');
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const [searching, setSearching] = React.useState(false);
    const [assigning, setAssigning] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function searchUserBySearchKey(searchKey: string) {
        try {
            setSearching(true);
            const res = await fetch(
                `${searchUser().url}?search_key=${searchKey}`,
                {
                    method: 'GET',
                },
            );
            const result = await res.json();
            console.log('result', result);
            setSearching(false);
            if (result.user) {
                setUser(result.user as User);
                setError(null);
                // handle success
            } else {
                // handle failure
                console.error('Utilisateur non trouvé');
                console.error('result.message', result.message);
                setError(result.message || 'Utilisateur non trouvé');
                setUser(undefined);
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la recherche.');
            setSearching(false);
            console.error('Erreur', err);
        }
    }

    function handleSearch() {
        searchUserBySearchKey(searchKey);
    }
    function handleAsign(e: React.FormEvent) {
        e.preventDefault();
        // assign user to teacher
        if (!user || !teacherId) return;
        setAssigning(true);
        const data = {
            user_id: user.id,
            teacher_id: teacherId,
        };
        async function assignUserToTeacher() {
            try {
                const res = await fetch(`${assigntouser().url}`, {
                    method: 'POST',
                    // csrf token
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        ).content,
                    },
                    body: JSON.stringify(data),
                });
                const result = await res.json();
                console.log('result', result);
                setAssigning(false);
                if (res.status === 200) {
                    // handle success
                    window.location.reload();
                } else {
                    // handle failure
                    console.error("Échec de l'assignation");
                    setError(result.message || "Échec de l'assignation");
                }
            } catch (err) {
                setAssigning(false);
                console.error('Erreur', err);
            }
        }
        assignUserToTeacher();
    }
    return (
        <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Assigner ce profil à un utilisateur
            </h3>
            <p className="text-sm text-gray-600">
                Cette fonctionnalité permet d'associer ce profil d'enseignant à
                un compte utilisateur existant sur la plateforme.
            </p>
            <div className="mt-4">
                <InputGroup className="mb-3 w-full rounded-3xl py-5 focus:outline-0 focus-visible:outline-0">
                    <InputGroupInput
                        name="search_key"
                        onChange={(e) => setSearchKey(e.target.value)}
                        placeholder="Entrer son numéro ou son email"
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <Button
                            disabled={searching}
                            className="btn-primary"
                            onClick={handleSearch}
                        >
                            {searching && <Spinner />}
                            <SearchIcon />
                            Vérifier
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
                {user && (
                    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {user.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {user.phone_number}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-2">
                                <svg
                                    className="h-5 w-5 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
                {user && (
                    <form method="POST" onSubmit={handleAsign}>
                        <Button
                            disabled={assigning}
                            type="submit"
                            className="btn-primary"
                        >
                            {assigning && <Spinner />}
                            Assigner un utilisateur
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
