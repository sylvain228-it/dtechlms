import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Course } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import CoursesDataTable from './datatable';

export default function TeacherCoursIndex() {
    const { courses } = usePage().props as unknown as { courses: Course[] };

    // get htmlContent from localstorage

    return (
        <TeacherLayouts title="Liste de cours">
            <CoursesDataTable courses={courses} />
        </TeacherLayouts>
    );
}
