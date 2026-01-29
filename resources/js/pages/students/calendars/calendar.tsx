import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { getModalityTypeLabel } from '@/lib/type';
import { formatCompleteDate, formatMinutes } from '@/lib/utils';
import { details } from '@/routes/students/activities';
import { CourseActivity } from '@/types/models/course';
import { Link } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMemo, useState } from 'react';

interface DayEventMap {
    [key: string]: CourseActivity[];
}

export default function StudentCalendar({
    activities,
}: {
    activities: CourseActivity[];
}) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Grouper les événements par date
    const activitiesByDate = useMemo(() => {
        const map: DayEventMap = {};
        activities.forEach((activity) => {
            const activityDate = new Date(activity.start_at ?? '');
            const dateKey = format(activityDate, 'yyyy-MM-dd');
            if (!map[dateKey]) {
                map[dateKey] = [];
            }
            map[dateKey].push(activity);
        });
        return map;
    }, [activities]);

    // Obtenir tous les jours avec des événements
    const daysWithActivities = useMemo(() => {
        return Object.keys(activitiesByDate).map((dateStr) => {
            return parse(dateStr, 'yyyy-MM-dd', new Date());
        });
    }, [activitiesByDate]);

    // Fonction pour obtenir les événements d'une date
    const getActivitiesForDate = (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return activitiesByDate[dateKey] || [];
    };

    const handleDayClick = (date: Date) => {
        const dayActivities = getActivitiesForDate(date);
        if (dayActivities.length > 0) {
            setSelectedDate(date);
        }
    };

    const getEndDate = (start_at: string, duration_minutes: number) => {
        return new Date(
            new Date(start_at ?? '').getTime() +
                (duration_minutes ?? 0) * 60000,
        );
    };
    const formatActivityTime = (activity: CourseActivity) => {
        const startDate = new Date(activity.start_at ?? '');
        const endDate = getEndDate(
            activity.start_at ?? '',
            activity.duration_minutes ?? 0,
        );

        const startTime = format(startDate, 'HH:mm', { locale: fr });
        if (endDate) {
            const endTime = format(endDate, 'HH:mm', { locale: fr });
            return `${startTime} - ${endTime}`;
        }
        return startTime;
    };

    return (
        <div>
            <h1 className="mb-2 text-3xl font-bold">
                Calendrier des activités avenirs
            </h1>
            <p className="mb-4 text-sm text-muted-foreground">
                {activities.length} activité{activities.length !== 1 ? 's' : ''}{' '}
                à venir
            </p>

            <TooltipProvider>
                <div className="my-4">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
                            {/* Calendrier */}
                            <div className="lg:col-span-2">
                                <Calendar
                                    mode="multiple"
                                    selected={daysWithActivities}
                                    onSelect={(dates) => {
                                        if (dates && dates.length > 0) {
                                            handleDayClick(dates[0]);
                                        }
                                    }}
                                    onDayClick={(date) => setSelectedDate(date)}
                                    className="w-full rounded-lg"
                                    disabled={(date) => {
                                        const dateKey = format(
                                            date,
                                            'yyyy-MM-dd',
                                        );
                                        return !activitiesByDate[dateKey];
                                    }}
                                />
                            </div>

                            {/* Détails des événements */}
                            <div className="lg:col-span-1">
                                <div className="border-l pl-4">
                                    <h3 className="mb-4 text-lg font-semibold">
                                        Activités
                                    </h3>

                                    {selectedDate ? (
                                        <div>
                                            <p className="mb-4 text-sm text-muted-foreground">
                                                {format(
                                                    selectedDate,
                                                    'd MMMM yyyy',
                                                    { locale: fr },
                                                )}
                                            </p>
                                            <div className="space-y-4">
                                                {getActivitiesForDate(
                                                    selectedDate,
                                                ).map((activity) => (
                                                    <Popover key={activity.id}>
                                                        <PopoverTrigger asChild>
                                                            <div className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 p-3 transition-colors hover:bg-blue-100">
                                                                <h4 className="truncate text-sm font-medium text-blue-900">
                                                                    {
                                                                        activity.title
                                                                    }
                                                                </h4>
                                                                <p className="mt-1 text-xs text-blue-700">
                                                                    {formatActivityTime(
                                                                        activity,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="font-semibold">
                                                                        {
                                                                            activity.title
                                                                        }
                                                                    </h4>
                                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                                        {
                                                                            activity.description
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-2 text-sm">
                                                                    <div>
                                                                        <span className="font-medium">
                                                                            Date/Heure:
                                                                        </span>
                                                                        <p className="text-muted-foreground">
                                                                            {format(
                                                                                new Date(
                                                                                    activity.start_at ??
                                                                                        '',
                                                                                ),
                                                                                'd MMMM yyyy HH:mm',
                                                                                {
                                                                                    locale: fr,
                                                                                },
                                                                            )}
                                                                            {activity.duration_minutes && (
                                                                                <>
                                                                                    {
                                                                                        ' - '
                                                                                    }
                                                                                    {formatCompleteDate(
                                                                                        getEndDate(
                                                                                            activity.start_at ??
                                                                                                '',
                                                                                            activity.duration_minutes ??
                                                                                                0,
                                                                                        ).toString(),
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </p>
                                                                    </div>

                                                                    {getModalityTypeLabel(
                                                                        activity.modality,
                                                                    )}

                                                                    {activity.duration_minutes && (
                                                                        <div>
                                                                            <span className="font-medium">
                                                                                Durée:
                                                                            </span>
                                                                            <p className="text-muted-foreground">
                                                                                {formatMinutes(
                                                                                    activity.duration_minutes,
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div>
                                                                        <span className="font-medium">
                                                                            Type:
                                                                        </span>
                                                                        <p className="text-muted-foreground">
                                                                            {activity.is_synchronous
                                                                                ? 'Synchrone'
                                                                                : 'Asynchrone'}
                                                                        </p>
                                                                    </div>
                                                                    <Link
                                                                        className="mt-2 text-blue-600 hover:underline"
                                                                        href={details(
                                                                            activity.slug,
                                                                        )}
                                                                    >
                                                                        Consulter
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Cliquez sur une date marquée pour
                                            voir les activités
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Liste de tous les activités */}
                        {activities.length > 0 && (
                            <div className="mt-8 border-t pt-8">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Tous les activités à venir
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {activities.map((activity) => (
                                        <Tooltip key={activity.id}>
                                            <TooltipTrigger asChild>
                                                <div className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md">
                                                    <h4 className="truncate text-sm font-medium">
                                                        {activity.title}
                                                    </h4>
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        {formatCompleteDate(
                                                            activity.start_at ??
                                                                '',
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatActivityTime(
                                                            activity,
                                                        )}
                                                    </p>
                                                    <Link
                                                        className="mt-2 text-blue-600 hover:underline"
                                                        href={details(
                                                            activity.slug,
                                                        )}
                                                    >
                                                        Consulter
                                                    </Link>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="max-w-sm">
                                                    <p className="font-medium">
                                                        {activity.title}
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        {activity.description}
                                                    </p>
                                                    <p className="mt-2 text-sm">
                                                        {formatCompleteDate(
                                                            activity.start_at ??
                                                                '',
                                                        )}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </TooltipProvider>
        </div>
    );
}
