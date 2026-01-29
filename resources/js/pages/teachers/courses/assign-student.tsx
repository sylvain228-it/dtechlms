import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { assignToStudent, searchStudent } from '@/routes';
import { Course } from '@/types/models/course';
import { Student } from '@/types/models/institut';
import { SearchIcon } from 'lucide-react';
import React from 'react';

export default function AssignStudentToCourse({ course }: { course: Course }) {
    const [searchKey, setSearchKey] = React.useState('');
    const [student, setStudent] = React.useState<Student | undefined>(
        undefined,
    );
    const [searching, setSearching] = React.useState(false);
    const [assigning, setAssigning] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function searchStudentBySearchKey(searchKey: string) {
        try {
            setSearching(true);
            const res = await fetch(
                `${searchStudent(course.slug).url}?search_key=${searchKey.toLowerCase()}`,
                {
                    method: 'GET',
                },
            );
            const result = await res.json();
            console.log('result', result);
            setSearching(false);
            if (result.student) {
                setStudent(result.student as Student);
                setError(null);
                // handle success
            } else {
                // handle failure
                console.error('Etudiant non trouvé');
                console.error('result.message', result.message);
                setError(result.message || 'Etudiant non trouvé');
                setStudent(undefined);
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la recherche.');
            setSearching(false);
            console.error('Erreur', err);
        }
    }

    function handleSearch() {
        searchStudentBySearchKey(searchKey);
    }
    function handleAsign(e: React.FormEvent) {
        e.preventDefault();
        if (!student || !course) return;
        setAssigning(true);
        const data = {
            student_id: student.id,
            course_id: course.id,
        };
        async function assignCourseToStudent() {
            try {
                const res = await fetch(`${assignToStudent(course.slug).url}`, {
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
        assignCourseToStudent();
    }
    return (
        <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
                Assigner ce cours à un étudiant
            </h3>
            <p className="text-sm text-gray-600">
                Cette fonctionnalité permet d'associer ce cours à un étudiant
                existant sur la plateforme.
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
                {student && (
                    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {student.first_name} {student.last_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {student.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {student.phone_number}
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
                {student && (
                    <form method="POST" onSubmit={handleAsign}>
                        <Button
                            disabled={assigning}
                            type="submit"
                            className="btn-primary"
                        >
                            {assigning && <Spinner />}
                            Associer l'étudiant(e)
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
