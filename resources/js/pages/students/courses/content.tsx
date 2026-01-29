import { Divider } from '@/components/divider';
import { TagsInputBadge } from '@/components/shared/tags-input';
import GetHtmlContent from '@/lib/get-html-content';
import { Course, CourseActivity, Module } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import StudentCalendar from '../calendars/calendar';
import ReadingCoursLayouts from '../layouts-shared/reading-cours-layouts';
type Propos = {
    course: Course;
    modules: Module[];
    activities: CourseActivity[];
};
export default function StudentCourseContent() {
    const { course, modules, activities } = usePage()
        .props as unknown as Propos;
    const [showCalendar, setShowCalendar] = useState(true);
    const coursePrerequisites = course.prerequisites
        ? JSON.parse(course.prerequisites)
        : [];
    const courseLearningOutcomes = course.learning_outcomes
        ? JSON.parse(course.learning_outcomes)
        : [];
    return (
        <ReadingCoursLayouts
            title={`Contenu du cours - ${course.title}`}
            modules={modules}
            course={course}
        >
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Calendar className="h-4 w-4" />
                    {showCalendar ? 'Syllabus du cours' : 'Voir le calendrier'}
                </button>
            </div>
            {showCalendar && (
                <div className="mb-4">
                    <StudentCalendar activities={activities} />
                </div>
            )}
            {!showCalendar && (
                <div className="">
                    <h3 className="text-xl font-bold sm:text-2xl">
                        {course.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {course.description}
                    </p>

                    <Divider />
                    <div className="space-y-3">
                        <div>
                            <h4 className="mb-2 font-semibold">
                                Prérequis du cours
                            </h4>
                            <TagsInputBadge tags={coursePrerequisites} />
                        </div>
                        <div>
                            <h4 className="mb-2 font-semibold">
                                Objectifs du cours
                            </h4>
                            <TagsInputBadge tags={courseLearningOutcomes} />
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <h4 className="mb-2 font-semibold">
                            Syllabuse du cours
                        </h4>
                        <GetHtmlContent contentHtml={course.syllabus ?? ''} />
                    </div>
                </div>
            )}
        </ReadingCoursLayouts>
    );
}
