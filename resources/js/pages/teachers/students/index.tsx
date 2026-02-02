import { InputField, SelectField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { getModalityTypeLabel, getStudyLevelLabel } from '@/lib/type';
import { Course } from '@/types/models/course';
import { Student, TeacherStudent } from '@/types/models/institut';
import { usePage } from '@inertiajs/react';
import { BookOpen, Mail, MapPin, Phone, User } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
    teacher_students: TeacherStudent[];
    courses: Course[];
};

function StudentProfileCard({ student }: { student: Student }) {
    const fullName =
        `${student.first_name || ''} ${student.last_name || ''}`.trim() ||
        'Étudiant sans nom';
    const initials =
        (student.first_name?.[0] || 'S') + (student.last_name?.[0] || 'A');

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition hover:shadow-lg">
            {/* Header background */}
            <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-500" />

            {/* Profile picture & basic info */}
            <div className="relative px-4 pb-4">
                <div className="flex items-end gap-4">
                    {/* Avatar */}
                    <div className="-mt-10 flex-shrink-0">
                        {student.profile_picture_url ? (
                            <img
                                src={student.profile_picture_url}
                                alt={fullName}
                                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gray-200 text-lg font-semibold text-gray-700 shadow-sm">
                                {initials}
                            </div>
                        )}
                    </div>

                    {/* Name & status */}
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-gray-900">
                            {fullName}
                        </h3>
                        {student.is_active ? (
                            <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                Actif
                            </span>
                        ) : (
                            <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                Inactif
                            </span>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-200" />

                {/* Info grid */}
                <div className="space-y-2 text-sm text-gray-600">
                    {/* Email */}
                    {student.email && (
                        <div className="flex items-start gap-2 truncate">
                            <Mail
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-gray-400"
                            />
                            <a
                                href={`mailto:${student.email}`}
                                className="truncate text-blue-600 hover:underline"
                            >
                                {student.email}
                            </a>
                        </div>
                    )}

                    {/* Phone */}
                    {student.phone_number && (
                        <div className="flex items-start gap-2">
                            <Phone
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-gray-400"
                            />
                            <span>{student.phone_number}</span>
                        </div>
                    )}

                    {/* Location */}
                    {(student.city || student.country) && (
                        <div className="flex items-start gap-2">
                            <MapPin
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-gray-400"
                            />
                            <span className="truncate">
                                {[student.city, student.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    )}

                    {/* Program */}
                    {student.program && (
                        <div className="flex items-start gap-2">
                            <BookOpen
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-gray-400"
                            />
                            <span className="truncate">{student.program}</span>
                        </div>
                    )}

                    {/* Student code */}
                    {student.student_code && (
                        <div className="flex items-start gap-2">
                            <User
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-gray-400"
                            />
                            <span className="font-mono text-xs">
                                {student.student_code}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-3 flex flex-wrap gap-1 border-t border-gray-200 pt-3">
                    {student.current_level && (
                        <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {getStudyLevelLabel(student.current_level)}
                        </span>
                    )}
                    {student.study_mode && (
                        <span className="inline-block rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                            {getModalityTypeLabel(student.study_mode)}
                        </span>
                    )}
                    {/* {student.credits && student.credits > 0 && (
                        <span className="inline-block rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                            {student.credits} crédits
                        </span>
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default function TeacherStudentsIndex() {
    const { teacher_students, courses } = usePage().props as unknown as Props;
    const [query, setQuery] = useState('');
    const [courseIdFilter, setCourseIdFilter] = useState<number | undefined>(
        undefined,
    );
    const filtered = useMemo(() => {
        return (teacher_students || [])
            .filter((ts) => {
                if (courseIdFilter && ts.course_id !== courseIdFilter)
                    return false;
                return !courseIdFilter || ts.course_id === courseIdFilter;
            })
            .map((item) => item.student)
            .filter((s) => {
                if (!s) return false;
                const q = query.toLowerCase();
                return (
                    (s.first_name || '').toLowerCase().includes(q) ||
                    (s.last_name || '').toLowerCase().includes(q) ||
                    (s.email || '').toLowerCase().includes(q) ||
                    (s.phone_number || '').toLowerCase().includes(q)
                );
            }) as Student[];
    }, [query, courseIdFilter, teacher_students]);

    return (
        <TeacherLayouts title="Liste des étudiants">
            <div className="grid w-full grid-cols-1 items-center justify-center gap-4 sm:grid-cols-5 md:grid-cols-5">
                <div className="sm:col-span-2 md:col-span-2">
                    <InputField
                        label=""
                        placeholder="Rechercher par nom, prénom, numéro ou email..."
                        value={query}
                        onChange={(val) => setQuery(val)}
                    />
                </div>
                <SelectField
                    options={courses.map((course) => ({
                        key: course.id.toString(),
                        value: course.title,
                    }))}
                    label=""
                    emptyOption="Filtrer par cours"
                    value={courseIdFilter?.toString() ?? ''}
                    onChange={(val) => setCourseIdFilter(Number(val))}
                />
                <Button
                    onClick={() => {
                        setQuery('');
                        setCourseIdFilter(undefined);
                    }}
                    className="btn-primary mt-2"
                >
                    Réinitialiser
                </Button>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Mes étudiants
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Total :{' '}
                        <span className="font-semibold">{filtered.length}</span>{' '}
                        étudiant(s)
                    </p>
                </div>

                {/* Students grid */}
                {filtered.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((student) => (
                            <StudentProfileCard
                                key={student.id}
                                student={student}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                        <User size={48} className="mx-auto text-gray-400" />
                        <p className="mt-4 text-lg font-medium text-gray-700">
                            Aucun étudiant trouvé
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Vous n'avez pas encore d'étudiants assignés.
                        </p>
                    </div>
                )}
            </div>
        </TeacherLayouts>
    );
}
