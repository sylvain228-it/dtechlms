import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { details } from '@/routes/students/courses';
import { Course, Enrollment } from '@/types/models/course';

import AvatarFallbackShared from '@/layouts/public/avatar-fallback';
import StudentLayouts from '@/layouts/student/student-layouts';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function StudentCourses() {
    const { enrollments } = usePage().props as unknown as {
        enrollments: Enrollment[];
    };
    const [query, setQuery] = React.useState('');
    const courses = [] as Course[];
    enrollments.forEach((item) => {
        courses.push(item.course as Course);
    });

    const filtered = courses.filter(
        (c: Course) =>
            c.title?.toLowerCase().includes(query.toLowerCase()) ||
            (c.description ?? '').toLowerCase().includes(query.toLowerCase()),
    );
    // const lessonsCount = student?.courses.sequentces?.length ?? 0;
    return (
        <StudentLayouts title="Mes cours">
            <div className="mx-auto mt-6 max-w-6xl px-4 pb-20">
                <div className="mb-6 flex flex-col items-center justify-between sm:flex-row">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Mes cours
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                            Accédez à vos cours, suivez votre progression et
                            retrouvez vos enseignants.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher un cours..."
                                className="form-input !w-72"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center">
                        <h2 className="text-lg font-semibold">
                            Aucun cours trouvé
                        </h2>
                        <p className="mt-2 text-sm">
                            Vous n'êtes inscrit à aucun cours pour le moment.
                            Explorez la plateforme pour trouver des cours
                            intéressants.
                        </p>
                        <div className="mt-4">
                            <Link
                                href={'/'}
                                className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Explorer les cours
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((course: Course) => (
                            <article
                                key={course.id}
                                className="group rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-cdcard"
                            >
                                <div className="relative h-40 overflow-hidden rounded-md">
                                    <Link href={details(course.slug)}>
                                        <img
                                            src={
                                                course.cover_url ??
                                                '/assets/course-placeholder.png'
                                            }
                                            alt={course.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </Link>
                                    {course.is_free ? (
                                        <div className="absolute top-3 left-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                                            Gratuit
                                        </div>
                                    ) : (
                                        <div className="absolute top-3 left-3 rounded-full bg-yellow-700 px-3 py-1 text-xs font-semibold text-white">
                                            Payant
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row">
                                    <div className="flex-1">
                                        <Link href={details(course.slug)}>
                                            <h3 className="text-md line-clamp-1 font-semibold text-gray-900 dark:text-gray-200">
                                                {course.title ?? ''}
                                            </h3>
                                        </Link>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-300">
                                            {course.description ?? ''}
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0 text-right">
                                        <Link
                                            href={details(course.slug)}
                                            className="mt-3 inline-block rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Accéder
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {course.teacher &&
                                            course.teacher
                                                .profile_picture_url && (
                                                <img
                                                    key={course.teacher.id}
                                                    src={
                                                        course.teacher
                                                            .profile_picture_url
                                                    }
                                                    alt={`${course.teacher.first_name} ${course.teacher.last_name}`}
                                                    className="h-8 w-8 rounded-full shadow-xs ring-1 ring-white"
                                                />
                                            )}
                                    </div>

                                    <div className="text-xs text-gray-500 dark:text-gray-300">
                                        Dernière mise à jour:{' '}
                                        {new Date(
                                            course.updated_at ?? '',
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mt-1 border-t px-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="cursor-pointer overflow-hidden rounded-full border dark:border-gray-100">
                                            {course.profile_picture_url !=
                                                null && (
                                                <AvatarImage
                                                    src={
                                                        course.teacher
                                                            ?.profile_picture_url ??
                                                        ''
                                                    }
                                                    alt={
                                                        course.teacher
                                                            ?.first_name
                                                    }
                                                />
                                            )}
                                            <AvatarFallbackShared
                                                first_name={
                                                    course.teacher
                                                        ?.first_name ??
                                                    course.teacher?.last_name
                                                }
                                            />
                                        </Avatar>
                                        <p className="line-clamp-1 text-sm text-gray-500 dark:text-gray-200">
                                            {course.teacher?.first_name ??
                                                ''}{' '}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayouts>
    );
}
