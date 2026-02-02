import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StudentLayouts from '@/layouts/student/student-layouts';
import { subStrText } from '@/lib/tasks';
import { getQuizeTypeLabel } from '@/lib/type';
import { formatDate, formatMinutes } from '@/lib/utils';
import { details, start } from '@/routes/students/quizzes';
import { Quiz } from '@/types/models/others';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Clock, Eye, Play, Repeat } from 'lucide-react';
import React from 'react';

export default function StudentQuizzes() {
    const { quizzes } = usePage().props as unknown as { quizzes: Quiz[] };
    const [query, setQuery] = React.useState('');
    const [page, setPage] = React.useState(1);
    const perPage = 9;

    const filtered = (quizzes ?? []).filter(
        (q) =>
            (q.title ?? '').toLowerCase().includes(query.toLowerCase()) ||
            (q.description ?? '').toLowerCase().includes(query.toLowerCase()),
    );

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <StudentLayouts title="Quizzes">
            <div className="mx-auto mt-6 max-w-6xl px-4 pb-6">
                <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Liste des quizzes
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Passez vos évaluations et suivez vos scores.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Input
                                placeholder="Rechercher un quiz..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="w-72"
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
                        <div className="hidden sm:block">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setQuery('');
                                    setPage(1);
                                }}
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </div>

                {total === 0 ? (
                    <div className="rounded-lg border bg-white p-8 text-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Aucun quiz trouvé
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Aucun quiz ne correspond à votre recherche pour le
                            moment.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {paginated.map((quiz) => (
                                <article
                                    key={quiz.id}
                                    className="group max-w-xs rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex flex-col items-start justify-between gap-3">
                                        <h3 className="text-md line-clamp-2 font-semibold text-gray-900">
                                            {quiz.title ?? ''}
                                        </h3>
                                        <p className="mt-1 line-clamp-3 text-sm text-gray-500">
                                            {quiz.description ?? ''}
                                        </p>

                                        <Badge className="my-2">
                                            {subStrText(
                                                getQuizeTypeLabel(
                                                    quiz.quiz_type,
                                                ),
                                                0,
                                                35,
                                            )}
                                        </Badge>
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                                    <Repeat className="h-3 w-3" />
                                                    Tentatives:{' '}
                                                    {quiz.max_attempts}
                                                </div>
                                            </div>
                                            {quiz.is_mandatory && (
                                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                    Obligatoire
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {quiz.activity && (
                                        <div className="my-3 flex flex-wrap items-center gap-4">
                                            {quiz.activity?.start_at && (
                                                <div className="text-sm">
                                                    Début:{' '}
                                                    {formatDate(
                                                        quiz.activity
                                                            ?.start_at ?? '',
                                                    )}
                                                </div>
                                            )}
                                            {quiz.time_limit_minutes && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {formatMinutes(
                                                            quiz.time_limit_minutes,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex-shrink-0 text-right">
                                        <div className="mt-3 flex items-end gap-2">
                                            <Link
                                                href={start(quiz.slug)}
                                                className="inline-flex items-center rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                <Play className="mr-2 h-4 w-4" />
                                                Commencer
                                            </Link>

                                            <Link
                                                href={details(quiz.slug)}
                                                className="inline-flex items-center rounded border bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Détails
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {total} quiz(s)
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                >
                                    <span className="hidden sm:block">
                                        Précédent
                                    </span>
                                    <ArrowLeft className="text-2xl sm:hidden" />
                                </Button>
                                <div className="text-sm text-gray-600">
                                    Page {page} sur {pages}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page >= pages}
                                    onClick={() =>
                                        setPage((p) => Math.min(pages, p + 1))
                                    }
                                >
                                    <span className="hidden sm:block">
                                        Suivant
                                    </span>
                                    <ArrowRight className="text-2xl sm:hidden" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </StudentLayouts>
    );
}
