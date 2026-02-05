import { InputField, SelectField } from '@/components/shared/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { BuildCoursStatusBadge } from '@/lib/simple-utility';
import { saveStatusLabels } from '@/lib/type';
import { formatDate } from '@/lib/utils';
import { dashboard } from '@/routes/institut';
import { details } from '@/routes/institut/courses';
import { BreadcrumbItem } from '@/types';
import { Course } from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
type CourseListPropos = {
    courses: Course[];
};
export default function InstitutCoursesListe() {
    const getInitials = useInitials();
    const { courses } = usePage().props as unknown as CourseListPropos;

    const [query, setQuery] = useState('');
    const [courseStatusFilter, setCourseStatus] = useState<string | undefined>(
        undefined,
    );
    const filtered = useMemo(() => {
        return (courses || []).filter((c) => {
            if (courseStatusFilter && c.status !== courseStatusFilter)
                return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                (c.title || '').toLowerCase().includes(q) ||
                (c.description || '').toLowerCase().includes(q) ||
                (c.teacher?.last_name || '').toLowerCase().includes(q)
            );
        });
    }, [query, courseStatusFilter, courses]);

    return (
        <InstitutLayouts breadcrumbs={breadcrumbs} title="Liste des cours">
            <div className="grid w-full grid-cols-1 items-center gap-2 sm:grid-cols-8 md:grid-cols-10">
                <div className="sm:col-span-4 md:col-span-6">
                    <InputField
                        label=""
                        placeholder="Rechercher par titre, description, teacher..."
                        value={query}
                        onChange={(val) => setQuery(val)}
                    />
                </div>
                <div className="sm:col-span-2 md:col-span-2">
                    <SelectField
                        options={saveStatusLabels}
                        emptyOption="Filtrer par statut"
                        label=""
                        value={courseStatusFilter ?? ''}
                        onChange={(val) => setCourseStatus(val)}
                    />
                </div>
                <Button
                    onClick={() => {
                        setQuery('');
                        setCourseStatus(undefined);
                    }}
                    className="btn-primary mt-2"
                >
                    Réinitialiser
                </Button>
            </div>

            <div className="mx-auto my-5">
                {filtered.length == 0 ? (
                    <div>Pas de course</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filtered.map((c, index) => {
                            const modulesCount = c.modules?.length || 0;
                            const sequencesCount = c.modules
                                ?.reduce(
                                    (acc, module) =>
                                        acc + (module.sequences?.length || 0),
                                    0,
                                )
                                .valueOf();
                            return (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-lg border bg-white shadow-lg transition-shadow duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <div className="relative">
                                        <Link href={details(c.slug)}>
                                            <img
                                                className="h-[120px] w-full object-cover"
                                                src={c.cover_url ?? ''}
                                                alt={c.title}
                                            />
                                        </Link>
                                        <div className="absolute right-2 -bottom-2">
                                            <BuildCoursStatusBadge
                                                status={c.status}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between px-4 py-2 text-sm text-gray-600">
                                        <div>Modules: {modulesCount}</div>
                                        <div>Séquences: {sequencesCount}</div>
                                    </div>

                                    <div className="px-4 pb-4">
                                        <Link href={details(c.slug)}>
                                            <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-800 capitalize">
                                                {c.title}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-blue-600">
                                                {c.price
                                                    ? `${c.price} F`
                                                    : 'Gratuit'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* teacher info */}
                                    <div className="border-t px-4 py-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="cursor-pointer overflow-hidden rounded-full">
                                                    {c.profile_picture_url !=
                                                        null && (
                                                        <AvatarImage
                                                            src={
                                                                c.teacher
                                                                    ?.profile_picture_url ??
                                                                ''
                                                            }
                                                            alt={
                                                                c.teacher
                                                                    ?.first_name
                                                            }
                                                        />
                                                    )}
                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(
                                                            c.teacher
                                                                ?.first_name ??
                                                                c.teacher
                                                                    ?.last_name ??
                                                                '',
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="line-clamp-1 text-sm text-gray-500">
                                                    {c.teacher?.first_name ??
                                                        ''}{' '}
                                                </p>
                                            </div>
                                            <span className="text-[10px] text-gray-400">
                                                le {formatDate(c.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </InstitutLayouts>
    );
}
