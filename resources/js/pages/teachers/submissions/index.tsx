import TeacherLayouts from '@/layouts/student/student-layouts';
import { getSubmissionStatusLabel, submissionStatusLabels } from '@/lib/type';
import { formatCompleteDate } from '@/lib/utils';
import { show as showSubmissionRoute } from '@/routes/teachers/submissions';
import { ActivitySubmission } from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 8;

export default function TeacherSubmissions() {
    const { submissions = [] } = usePage().props as unknown as {
        submissions: ActivitySubmission[];
    };

    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [courseFilter, setCourseFilter] = useState('all');
    const [activityFilter, setActivityFilter] = useState('all');
    const [studentFilter, setStudentFilter] = useState('all');
    const [page, setPage] = useState(1);

    const activitiesList: Array<{ key: string; value: string }> = Array.from(
        new Map(
            submissions
                .map((s) => s.activity)
                .filter((a) => a)
                .map((a) => [
                    a!.id.toString(),
                    { key: a!.id.toString(), value: a!.title },
                ]),
        ).values(),
    );

    const studentsList: Array<{ key: string; value: string }> = Array.from(
        new Map(
            submissions
                .map((s) => s.student)
                .filter((st) => st)
                .map((st) => [
                    st!.id.toString(),
                    {
                        key: st!.id.toString(),
                        value: st!.first_name + ' ' + st!.last_name,
                    },
                ]),
        ).values(),
    );

    const coursesList: Array<{ key: string; value: string }> = Array.from(
        new Map(
            submissions
                .map((s) => s.parent_course)
                .filter((c) => c)
                .map((c) => [
                    c!.id.toString(),
                    { key: c!.id.toString(), value: c!.title },
                ]),
        ).values(),
    );
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = Array.isArray(submissions) ? submissions : [];

        if (statusFilter !== 'all') {
            list = list.filter(
                (s) => (s.status ?? '').toLowerCase() === statusFilter,
            );
        }

        if (courseFilter !== 'all') {
            list = list.filter(
                (s) => (s.parent_course?.id ?? '').toString() === courseFilter,
            );
        }

        if (activityFilter !== 'all') {
            list = list.filter(
                (s) => (s.activity?.id ?? '').toString() === activityFilter,
            );
        }

        if (studentFilter !== 'all') {
            list = list.filter(
                (s) => (s.student?.id ?? '').toString() === studentFilter,
            );
        }

        if (q) {
            list = list.filter((s) => {
                const actTitle = (s.activity?.title ?? '')
                    .toString()
                    .toLowerCase();
                const subTitle = (s.title ?? '').toString().toLowerCase();
                return actTitle.includes(q) || subTitle.includes(q);
            });
        }

        return list;
    }, [
        submissions,
        query,
        statusFilter,
        courseFilter,
        activityFilter,
        studentFilter,
    ]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    function gotoPage(p: number) {
        const next = Math.min(Math.max(1, p), totalPages);
        setPage(next);
    }

    return (
        <TeacherLayouts title="Liste des soumissions">
            <div className="mx-auto mt-6 max-w-7xl px-4">
                <div className="mb-6 grid gap-4 md:items-center md:justify-between">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Les soumissions
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Historique des envois et état des évaluations
                            </p>
                        </div>

                        <label className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Rechercher activité ou titre..."
                                className="w-full rounded-md border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                    <div className="grid w-full grid-cols-1 items-center justify-between gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm"
                            >
                                <option value="all">Tous statuts</option>
                                {submissionStatusLabels.map((s) => (
                                    <option key={s.value} value={s.key}>
                                        {' '}
                                        {s.value}{' '}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={courseFilter}
                            onChange={(e) => {
                                setCourseFilter(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm"
                        >
                            <option value="all">Tous les cours</option>
                            {coursesList.map((c) => (
                                <option key={c.key} value={c.key}>
                                    {c.value}
                                </option>
                            ))}
                        </select>

                        <select
                            value={activityFilter}
                            onChange={(e) => {
                                setActivityFilter(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm"
                        >
                            <option value="all">Toutes les activités</option>
                            {activitiesList.map((a) => (
                                <option key={a.key} value={a.key}>
                                    {a.value}
                                </option>
                            ))}
                        </select>

                        <select
                            value={studentFilter}
                            onChange={(e) => {
                                setStudentFilter(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm"
                        >
                            <option value="all">Tous les étudiants</option>
                            {studentsList.map((st) => (
                                <option key={st.key} value={st.key}>
                                    {st.value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paged.length === 0 ? (
                        <div className="col-span-full rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                            Aucune soumission trouvée.
                        </div>
                    ) : (
                        paged.map((s) => (
                            <article
                                key={s.id}
                                className="rounded-lg border bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 pr-3">
                                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                                            {s.activity?.title ??
                                                'Activité inconnue'}
                                        </h3>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {s.title ?? '—'}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${s.status === 'graded' ? 'bg-green-50 text-green-700' : s.status === 'submitted' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {getSubmissionStatusLabel(s.status)}
                                        </span>
                                        <div className="text-xs text-gray-500">
                                            {s.submitted_at
                                                ? formatCompleteDate(
                                                      s.submitted_at,
                                                  )
                                                : '—'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="text-xs text-gray-500">
                                            Note:{' '}
                                            <span className="font-medium text-gray-800">
                                                {s.score ?? '—'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={
                                                showSubmissionRoute(
                                                    s.activity?.slug ?? '',
                                                ).url
                                            }
                                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50"
                                        >
                                            <Eye className="h-4 w-4" /> Voir
                                        </Link>
                                    </div>
                                </div>
                                {/* nom comple de l'étudant */}
                                <div>
                                    <div className="mt-4 text-xs text-gray-500">
                                        Soumis par:{' '}
                                        <span className="font-medium text-gray-800">
                                            {s.student?.first_name}{' '}
                                            {s.student?.last_name}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Affichage{' '}
                        {Math.min(
                            (page - 1) * PAGE_SIZE + 1,
                            filtered.length || 0,
                        )}
                        –{Math.min(page * PAGE_SIZE, filtered.length || 0)} sur{' '}
                        {filtered.length} soumission(s)
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => gotoPage(page - 1)}
                            disabled={page <= 1}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="hidden items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm sm:flex">
                            <button
                                onClick={() => gotoPage(1)}
                                className="px-2 text-sm"
                            >
                                1
                            </button>
                            <div className="px-2 text-sm">…</div>
                            <button
                                onClick={() => gotoPage(totalPages)}
                                className="px-2 text-sm"
                            >
                                {totalPages}
                            </button>
                        </div>
                        <button
                            onClick={() => gotoPage(page + 1)}
                            disabled={page >= totalPages}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </TeacherLayouts>
    );
}
