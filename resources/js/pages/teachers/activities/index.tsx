import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Course, CourseActivity } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import CourseActivitiesDataTable from './datatable';

export default function CourseActivitiesIndex() {
    const { activities, course } = usePage().props as unknown as {
        activities: CourseActivity[];
        course: Course;
    };

    return (
        <TeacherLayouts title={`Liste des activités de : ${course.title}`}>
            <CourseActivitiesDataTable
                activities={activities}
                course={course}
            />
        </TeacherLayouts>
    );
}
