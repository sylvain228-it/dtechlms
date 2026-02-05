import StudentLayouts from '@/layouts/student/student-layouts';
import {
    details,
    moduleDetails,
    sequenceDetails,
} from '@/routes/students/courses';
import { Course, CourseActivity } from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import ActivityDetailsShered from './details-shared';

export default function StudentActivityDetails() {
    const { activity, current_course } = usePage().props as unknown as {
        activity: CourseActivity;
        current_course: Course;
    };

    const sequence =
        activity.scope == 'sequence' && activity.sequence_id != null
            ? activity.sequence
            : null;
    const module =
        activity.scope == 'module' && activity.module_id != null
            ? activity.module
            : null;
    const course =
        activity.scope == 'course' && activity.course_id != null
            ? activity.course
            : null;
    return (
        <StudentLayouts title={`Détails activité ${activity.title}`}>
            <div className="border-b border-l-2 border-blue-900 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex justify-between gap-6">
                        <h2 className="mb-2 text-gray-500 sm:text-xl">
                            Activité du cours :{' '}
                            <b>
                                <i>
                                    <Link
                                        href={details(current_course.slug)}
                                        className="text-md line-clamp-2"
                                    >
                                        {current_course.title}
                                    </Link>
                                </i>
                            </b>
                        </h2>
                        <div
                            onClick={() => history.back()}
                            className="inline-block h-10 cursor-pointer rounded-sm border px-3 py-1 text-xl"
                        >
                            <ArrowRight size={30} className="text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mt-2 gap-2 text-sm text-gray-500">
                    <span>
                        {course && (
                            <>
                                <Link
                                    href={details(course?.slug)}
                                    className="text-blue-400"
                                >
                                    {course?.title ?? 'Cours inconnu'}
                                </Link>
                            </>
                        )}
                        {module && (
                            <span>
                                <Link
                                    href={moduleDetails([
                                        current_course.slug,
                                        module?.slug,
                                    ])}
                                    className="text-blue-400"
                                >
                                    {module?.title ?? 'Module'}
                                </Link>
                            </span>
                        )}
                        {sequence && (
                            <span>
                                <Link
                                    href={sequenceDetails([
                                        current_course.slug,
                                        sequence?.slug,
                                    ])}
                                    className="text-blue-400"
                                >
                                    {sequence?.title ?? 'Séquence'}
                                </Link>{' '}
                            </span>
                        )}

                        <span className="text-md mt-1 font-semibold text-gray-600">
                            / {activity.title}
                        </span>
                    </span>
                </div>
            </div>

            {/* détail activité */}

            <ActivityDetailsShered activity={activity} />
        </StudentLayouts>
    );
}
