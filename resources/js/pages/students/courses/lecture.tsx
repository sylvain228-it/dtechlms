import {
    Course,
    CourseActivity,
    Module,
    Sequence,
} from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import ActivityDetailsShered from '../activities/details-shared';
import ReadingCoursLayouts from '../layouts-shared/reading-cours-layouts';
import SequenceDetailsShared from '../layouts-shared/sequence-details-shared';

type Propos = {
    course: Course;
    modules: Module[];
    sequence: Sequence;
    activities: CourseActivity[];
};

export default function StudentCourseContent() {
    const { course, modules, sequence, activities } = usePage()
        .props as unknown as Propos;

    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [showSequenceDetails, setShowSequenceDetails] = useState(false);

    const currentActivity = useMemo(() => {
        return activities.length > 0
            ? activities[currentActivityIndex]
            : ({} as CourseActivity);
    }, [activities, currentActivityIndex]);

    const handlePrevious = () => {
        if (currentActivityIndex > 0) {
            setCurrentActivityIndex(currentActivityIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentActivityIndex < activities.length - 1) {
            setCurrentActivityIndex(currentActivityIndex + 1);
        }
    };

    return (
        <ReadingCoursLayouts
            title={sequence.title}
            modules={modules}
            course={course}
            sequenceId={sequence.id}
            moduleId={sequence.module_id}
        >
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowSequenceDetails(!showSequenceDetails)}
                    className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Info className="h-4 w-4" />
                    {showSequenceDetails ? 'Activités' : 'Détails séquence'}
                </button>
            </div>
            {/* détails séquence */}
            {showSequenceDetails && (
                <SequenceDetailsShared sequence={sequence} />
            )}
            {/* détail activité */}
            {!showSequenceDetails && (
                <div>
                    {activities.length > 0 ? (
                        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                            {/* Fixed Pagination Header */}
                            <div className="sticky top-[56px] z-30 border-b border-gray-200 bg-white shadow-sm">
                                <div className="px-2 py-4 sm:px-6">
                                    <div className="flex flex-col items-center justify-between sm:flex-row">
                                        <div className="flex-1">
                                            <h2 className="mb-2 text-xl font-semibold text-gray-900">
                                                {currentActivity?.title}
                                            </h2>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Activité{' '}
                                                    {currentActivityIndex + 1}{' '}
                                                    sur {activities.length}
                                                </span>
                                                <div className="h-2 max-w-xs flex-1 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                                                        style={{
                                                            width: `${((currentActivityIndex + 1) / activities.length) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="ml-6 flex items-center justify-end gap-3">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={
                                                    currentActivityIndex === 0
                                                }
                                                className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Activité précédente"
                                            >
                                                <ChevronLeft className="h-5 w-5 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={
                                                    currentActivityIndex ===
                                                    activities.length - 1
                                                }
                                                className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label="Activité suivante"
                                            >
                                                <ChevronRight className="h-5 w-5 text-gray-700" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <ActivityDetailsShered activity={currentActivity} />
                        </div>
                    ) : (
                        <div>
                            <p className="text-center text-sm text-gray-500">
                                Pas d'activité encore d'activité pour cette
                                séquence
                            </p>
                        </div>
                    )}
                </div>
            )}
        </ReadingCoursLayouts>
    );
}
