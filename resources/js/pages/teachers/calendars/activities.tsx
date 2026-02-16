import { SelectField } from '@/components/shared/form';
import { Badge } from '@/components/ui/badge';
import { subStrText } from '@/lib/tasks';
import {
    activityStatusTypeLabels,
    activityTypeLabels,
    eventVisibilityTypeLabels,
    getActivityStatusColorClass,
    getActivityStatusTypeLabel,
    getActivityTypeLabel,
    getModalityTypeLabel,
    modalityTypeLabels,
} from '@/lib/type';
import { formatCompleteDate, formatMinutes } from '@/lib/utils';
import { show } from '@/routes/teachers/activities';
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

export default function TeacherActivities({
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Calendrier des activités
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Gérez et organisez vos activités pédagogiques
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {activities.length}
                                </p>
                            </div>
                            <Calendar className="h-10 w-10 text-blue-100" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    À venir
                                </p>
                                <p className="mt-2 text-3xl font-bold text-blue-600">
                                    {
                                        activities.filter(
                                            (e) =>
                                                e.activity_status ===
                                                'scheduled',
                                        ).length
                                    }
                                </p>
                            </div>
                            <Clock className="h-10 w-10 text-blue-100" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    En cours
                                </p>
                                <p className="mt-2 text-3xl font-bold text-green-600">
                                    {
                                        activities.filter(
                                            (e) => e.activity_status === 'live',
                                        ).length
                                    }
                                </p>
                            </div>
                            <Video className="h-10 w-10 text-green-100" />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Filtrés
                                </p>
                                <p className="mt-2 text-3xl font-bold text-purple-600">
                                    {filteredActivities.length}
                                </p>
                            </div>
                            <Search className="h-10 w-10 text-purple-100" />
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
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
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pr-4 pl-10 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Filter Toggle & View Mode */}
                    <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <button
                            onClick={() => setExpandedFilters(!expandedFilters)}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
                                        : 'text-gray-600 hover:bg-gray-100'
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
                    <div className="rounded-xl bg-white p-12 text-center shadow-md">
                        <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Aucun événement trouvé
                        </h3>
                        <p className="mt-2 text-gray-600">
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
                                        className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg"
                                    >
                                        {/* Color Bar */}
                                        <div
                                            className="h-1"
                                            style={{
                                                backgroundColor: '#3B82F6',
                                            }}
                                        />

                                        <div className="p-6">
                                            {/* Title */}
                                            <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                                {activity.title}
                                            </h3>

                                            {/* Description */}
                                            {activity.description && (
                                                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                                    {activity.description}
                                                </p>
                                            )}

                                            {/* Badges */}
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                <Badge
                                                    className={`text-xs font-semibold ${getactivityTypeColor(activity.activity_type)}`}
                                                >
                                                    {subStrText(
                                                        getActivityTypeLabel(
                                                            activity.activity_type,
                                                        ),
                                                        0,
                                                        35,
                                                    )}
                                                </Badge>
                                                <Badge
                                                    className={`text-xs font-semibold ${getActivityStatusColorClass(activity.activity_status)}`}
                                                >
                                                    {subStrText(
                                                        getActivityStatusTypeLabel(
                                                            activity.activity_status,
                                                        ),
                                                        0,
                                                        35,
                                                    )}
                                                </Badge>
                                            </div>

                                            {/* Date & Time */}
                                            <div className="space-y-2 border-t border-gray-200 pt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span>
                                                        {formatCompleteDate(
                                                            activity.start_at ??
                                                                '',
                                                        )}
                                                    </span>
                                                </div>

                                                {activity.duration_minutes && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <span>
                                                            Durée:{' '}
                                                            {formatMinutes(
                                                                activity.duration_minutes,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <span>
                                                        {getLocationIcon(
                                                            activity,
                                                        )}
                                                    </span>
                                                    <Badge>
                                                        {subStrText(
                                                            getModalityTypeLabel(
                                                                activity.modality,
                                                            ),
                                                            0,
                                                            30,
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-4">
                                                <Link
                                                    href={
                                                        activity.parent_course
                                                            ? show([
                                                                  activity
                                                                      .parent_course
                                                                      ?.slug,
                                                                  activity.slug,
                                                              ])
                                                            : '#'
                                                    }
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
                            <div className="space-y-3 overflow-hidden rounded-xl bg-white shadow-md">
                                {filteredActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="group flex flex-col items-start justify-between gap-4 border-b border-gray-200 p-2 transition-colors last:border-b-0 hover:bg-gray-50 sm:flex-row sm:items-center sm:p-4"
                                    >
                                        {/* Left: Color Bar + Info */}
                                        <div className="flex flex-1 items-start gap-4 sm:items-center">
                                            {/* Color Bar */}
                                            <div
                                                className="h-12 w-1 rounded-full"
                                                style={{
                                                    backgroundColor: '#3B82F6',
                                                }}
                                            />

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                {/* Title & Type */}
                                                <div className="mb-2 flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center">
                                                    <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                                        {activity.title}
                                                    </h3>
                                                    <Badge
                                                        className={`text-xs font-semibold whitespace-nowrap ${getactivityTypeColor(activity.activity_type)}`}
                                                    >
                                                        {subStrText(
                                                            getActivityTypeLabel(
                                                                activity.activity_type,
                                                            ),
                                                            0,
                                                            35,
                                                        )}
                                                    </Badge>
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold whitespace-nowrap ${getActivityStatusColorClass(activity.activity_status)}`}
                                                    >
                                                        {getActivityStatusTypeLabel(
                                                            activity.activity_status,
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Details Row */}
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span>
                                                                {formatCompleteDate(
                                                                    activity.start_at ??
                                                                        '',
                                                                )}
                                                            </span>
                                                        </div>

                                                        {activity.duration_minutes && (
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {formatMinutes(
                                                                        activity.duration_minutes,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span>
                                                            {getLocationIcon(
                                                                activity,
                                                            )}
                                                        </span>
                                                        <Badge>
                                                            {subStrText(
                                                                getModalityTypeLabel(
                                                                    activity.modality,
                                                                ),
                                                                0,
                                                                30,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="ml-4 flex gap-2">
                                            <Link
                                                href={
                                                    activity.parent_course
                                                        ? show([
                                                              activity
                                                                  .parent_course
                                                                  ?.slug,
                                                              activity.slug,
                                                          ])
                                                        : '#'
                                                }
                                                className="flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
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
                    <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
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
