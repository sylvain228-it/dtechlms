import { SelectField } from '@/components/shared/form';
import { Badge } from '@/components/ui/badge';
import { subStrText } from '@/lib/tasks';
import {
    activityStatusTypeLabels,
    activityTypeLabels,
    eventVisibilityTypeLabels,
    getActivityStatusTypeLabel,
    getActivityTypeLabel,
    getModalityTypeLabel,
    modalityTypeLabels,
} from '@/lib/type';
import { formatCompleteDate, formatMinutes } from '@/lib/utils';
import { details as show } from '@/routes/students/activities';
import { CourseActivity } from '@/types/models/course';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    ChevronDown,
    Clock,
    Grid3x3,
    List,
    MapPin,
    MapPinOff,
    Search,
    Video,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type FilterState = {
    search: string;
    activityType: string;
    status: string;
    activity_status: string;
    visibility: string;
    modality: string;
};

export default function StudentActivities({
    activities,
}: {
    activities: CourseActivity[];
}) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        activityType: '',
        status: '',
        activity_status: '',
        visibility: '',
        modality: '',
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [expandedFilters, setExpandedFilters] = useState(false);

    // Filtrage des événements
    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const matchSearch =
                activity.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                activity.description
                    ?.toLowerCase()
                    .includes(filters.search.toLowerCase());

            const matchactivityType =
                !filters.activityType ||
                activity.activity_type === filters.activityType;
            const matchStatus =
                !filters.status || activity.status === filters.status;
            const matchActivityStatus =
                !filters.activity_status ||
                activity.activity_status === filters.activity_status;
            const matchVisibility =
                !filters.visibility ||
                activity.visibility === filters.visibility;
            const matchmodality =
                !filters.modality || activity.modality === filters.modality;

            return (
                matchSearch &&
                matchactivityType &&
                matchStatus &&
                matchActivityStatus &&
                matchVisibility &&
                matchmodality
            );
        });
    }, [activities, filters]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            activityType: '',
            status: '',
            activity_status: '',
            visibility: '',
            modality: '',
        });
    };

    const isFiltered = Object.values(filters).some((val) => val !== '');

    const getStatusBadgeColor = (activity_status: string) => {
        switch (activity_status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'ongoing':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'canceled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getactivityTypeColor = (type: string) => {
        switch (type) {
            case 'formative':
                return 'text-blue-600 bg-blue-50';
            case 'summative':
                return 'text-purple-600 bg-purple-50';
            case 'certifying':
                return 'text-green-600 bg-green-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getLocationIcon = (activity: CourseActivity) => {
        if (!activity.is_synchronous) {
            return <MapPinOff className="h-4 w-4 text-gray-500" />;
        }
        if (activity.modality === 'onsite') {
            return <MapPin className="h-4 w-4 text-orange-500" />;
        }
        if (activity.modality === 'online') {
            return <Video className="h-4 w-4 text-blue-500" />;
        }
        return <MapPin className="h-4 w-4 text-purple-500" />;
    };

    return (
        <div className="min-h-screen py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-300">
                            Calendrier des activités
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Gérez et organisez vos activités pédagogiques
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-cdcard">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Total</p>
                                <p className="mt-2 text-3xl font-bold">
                                    {activities.length}
                                </p>
                            </div>
                            <Calendar className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-cdcard">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">À venir</p>
                                <p className="mt-2 text-3xl font-bold text-blue-600">
                                    {
                                        activities.filter(
                                            (e) => e.status === 'scheduled',
                                        ).length
                                    }
                                </p>
                            </div>
                            <Clock className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-cdcard">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">En cours</p>
                                <p className="mt-2 text-3xl font-bold text-green-600">
                                    {
                                        activities.filter(
                                            (e) => e.activity_status === 'live',
                                        ).length
                                    }
                                </p>
                            </div>
                            <Video className="h-10 w-10 text-green-400" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-cdcard">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Filtrés</p>
                                <p className="mt-2 text-3xl font-bold text-purple-600">
                                    {filteredActivities.length}
                                </p>
                            </div>
                            <Search className="h-10 w-10 text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-8 rounded-xl border border-gray-400 p-6 shadow-md">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un événement..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange('search', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-400"
                            />
                        </div>
                    </div>

                    {/* Filter Toggle & View Mode */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                        <button
                            onClick={() => setExpandedFilters(!expandedFilters)}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-400"
                        >
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                    expandedFilters ? 'rotate-180' : ''
                                }`}
                            />
                            Filtres avancés
                            {isFiltered && (
                                <span className="ml-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                                    {
                                        Object.values(filters).filter(
                                            (v) => v !== '',
                                        ).length
                                    }
                                </span>
                            )}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded-md px-3 py-2 transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Vue grille"
                            >
                                <Grid3x3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded-md px-3 py-2 transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400'
                                }`}
                                title="Vue liste"
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filters Grid */}
                    {expandedFilters && (
                        <div className="space-y-4 border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Type Event Filter */}

                                <SelectField
                                    label="Type d'activité"
                                    value={filters.activityType}
                                    emptyOption="Tous les types"
                                    options={activityTypeLabels}
                                    onChange={(val) =>
                                        handleFilterChange('activityType', val)
                                    }
                                />

                                {/* Status Filter */}
                                <SelectField
                                    label="Statut de l'activité"
                                    value={filters.activity_status}
                                    emptyOption="Tous les statuts d'activité"
                                    options={activityStatusTypeLabels}
                                    onChange={(val) =>
                                        handleFilterChange(
                                            'activity_status',
                                            val,
                                        )
                                    }
                                />

                                {/* Visibility Filter */}
                                <SelectField
                                    label="Visibilité"
                                    value={filters.visibility}
                                    emptyOption="Toutes les visibilités"
                                    options={eventVisibilityTypeLabels}
                                    onChange={(val) =>
                                        handleFilterChange('visibility', val)
                                    }
                                />

                                {/* Location Type Filter */}
                                <SelectField
                                    label="Type de lieu"
                                    value={filters.modality}
                                    emptyOption="Tous les lieux"
                                    options={modalityTypeLabels}
                                    onChange={(val) =>
                                        handleFilterChange('modality', val)
                                    }
                                />
                            </div>

                            {isFiltered && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <X className="h-4 w-4" />
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results */}
                {filteredActivities.length === 0 ? (
                    <div className="rounded-xl p-12 text-center shadow-md">
                        <Calendar className="mx-auto mb-4 h-16 w-16" />
                        <h3 className="text-lg font-semibold">
                            Aucun événement trouvé
                        </h3>
                        <p className="mt-2">
                            {isFiltered
                                ? 'Essayez de modifier vos critères de filtrage'
                                : 'Créez votre premier événement pour commencer'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-cdcard"
                                    >
                                        {/* Color Bar */}
                                        <div
                                            className="h-1"
                                            style={{
                                                backgroundColor: '#3B82F6',
                                            }}
                                        />

                                        <div className="p-3 sm:p-6">
                                            {/* Title */}
                                            <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-200">
                                                {activity.title}
                                            </h3>

                                            {/* Description */}
                                            {activity.description && (
                                                <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                                    {activity.description}
                                                </p>
                                            )}

                                            {/* Badges */}
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                <Badge
                                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getactivityTypeColor(activity.activity_type)}`}
                                                >
                                                    {subStrText(
                                                        getActivityTypeLabel(
                                                            activity.activity_type,
                                                        ),
                                                        0,
                                                        37,
                                                    )}
                                                </Badge>
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(activity.status)}`}
                                                >
                                                    {getActivityStatusTypeLabel(
                                                        activity.activity_status,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Date & Time */}
                                            <div className="mb-4 space-y-2 border-t border-gray-200 pt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span>
                                                        {formatCompleteDate(
                                                            activity.start_at ??
                                                                '',
                                                        )}
                                                    </span>
                                                </div>

                                                {activity.duration_minutes && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <span>
                                                            Durée:{' '}
                                                            {formatMinutes(
                                                                activity.duration_minutes,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                                                    {getLocationIcon(activity)}
                                                    <Badge>
                                                        {subStrText(
                                                            getModalityTypeLabel(
                                                                activity.modality,
                                                            ),
                                                            0,
                                                            35,
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-4">
                                                <Link
                                                    href={show(activity.slug)}
                                                    className="flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                    Détails
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className="space-y-2 overflow-hidden rounded-xl shadow-md">
                                {filteredActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="group flex flex-col gap-4 border-b border-gray-200 bg-white p-4 transition-colors last:border-b-0 hover:bg-gray-50 sm:p-6 lg:flex-row lg:items-center lg:justify-between dark:bg-cdcard dark:hover:bg-gray-800"
                                    >
                                        {/* Left: Color Bar + Info */}
                                        <div className="flex flex-1 items-start gap-3 sm:gap-4">
                                            {/* Color Bar */}
                                            <div
                                                className="h-12 w-1 flex-shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: '#3B82F6',
                                                }}
                                            />

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                {/* Title & Badges */}
                                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                                    <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600 sm:text-base dark:text-gray-200">
                                                        {activity.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge
                                                            className={`text-xs font-semibold whitespace-nowrap ${getactivityTypeColor(activity.activity_type)}`}
                                                        >
                                                            {subStrText(
                                                                getActivityTypeLabel(
                                                                    activity.activity_type,
                                                                ),
                                                                0,
                                                                37,
                                                            )}
                                                        </Badge>
                                                        <Badge
                                                            className={`text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(activity.status)}`}
                                                        >
                                                            {getActivityStatusTypeLabel(
                                                                activity.activity_status,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Details Row */}
                                                <div className="flex flex-wrap gap-3 text-xs text-gray-600 sm:gap-4 sm:text-sm dark:text-gray-400">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Calendar className="h-4 w-4 flex-shrink-0" />
                                                        <span className="line-clamp-1">
                                                            {formatCompleteDate(
                                                                activity.start_at ??
                                                                    '',
                                                            )}
                                                        </span>
                                                    </div>

                                                    {activity.duration_minutes && (
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            <Clock className="h-4 w-4 flex-shrink-0" />
                                                            <span>
                                                                {formatMinutes(
                                                                    activity.duration_minutes,
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        {getLocationIcon(
                                                            activity,
                                                        )}
                                                        <span className="line-clamp-1">
                                                            {getModalityTypeLabel(
                                                                activity.modality,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-shrink-0 items-center pt-2 sm:pt-0 lg:ml-4">
                                            <Link
                                                href={show(activity.slug)}
                                                className="flex items-center gap-2 text-sm font-medium whitespace-nowrap text-blue-600 transition-colors hover:text-blue-800 sm:text-base"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                                Détails
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Summary */}
                {filteredActivities.length > 0 && (
                    <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center dark:bg-blue-200">
                        <p className="text-sm text-blue-800">
                            Affichage de{' '}
                            <span className="font-semibold">
                                {filteredActivities.length}
                            </span>{' '}
                            activité
                            {filteredActivities.length > 1 ? 's' : ''}{' '}
                            {isFiltered && 'correspondant aux critères'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
