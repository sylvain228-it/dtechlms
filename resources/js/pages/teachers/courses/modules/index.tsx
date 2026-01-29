import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Course, Module } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import CoursesModulesDataTable from './datatable';

export default function TeacherCoursModulesIndex() {
    const { modules } = usePage().props as unknown as {
        modules: Module[];
    };
    const { course } = usePage().props as unknown as {
        course: Course;
    };

    return (
        <TeacherLayouts title="Liste de modules du cours">
            <CoursesModulesDataTable modules={modules} course={course} />
        </TeacherLayouts>
    );
}
