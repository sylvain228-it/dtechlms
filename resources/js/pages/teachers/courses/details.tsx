import { Spacer } from '@/components/spacer';
import { Button } from '@/components/ui/button';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import GetHtmlContent from '@/lib/get-html-content';
import { loadExistTextHtmlIntoEditor } from '@/lib/lexical-headless';
import { index as activities } from '@/routes/teachers/activities';
import { edit } from '@/routes/teachers/courses';
import { index as moduleIndex } from '@/routes/teachers/modules';
import students from '@/routes/teachers/students';
import { Course, Module, Sequence } from '@/types/models/course';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import AssignStudentToCourse from './assign-student';

// function formatNumber(n?: number | null) {
//     return typeof n === 'number' ? n : 0;
// }
type TeacherCourseDetailsProps = {
    course: Course;
    modules: Module[];
    sequences: Sequence[];
    enrollments: number;
};
export default function TeacherCourseDetails() {
    const { course, modules, sequences, enrollments } = usePage()
        .props as unknown as TeacherCourseDetailsProps;

    async function handleEditClicked(e: React.MouseEvent) {
        e.preventDefault();
        loadExistTextHtmlIntoEditor(course.syllabus ?? '');
        setTimeout(() => {
            router.get(edit(course.slug));
        }, 10);
    }
    return (
        <TeacherLayouts title={course.title}>
            <div className="mx-auto mt-8 max-w-6xl px-4">
                <div>
                    <a href={course.cover_url ?? ''}>
                        <img
                            src={course.cover_url ?? ''}
                            alt={course.title}
                            className="mb-4 max-h-[300px] w-full rounded object-cover"
                        />
                    </a>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {course.title}
                            </h1>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                {course.description
                                    ? course.description
                                    : 'Aucune description'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleEditClicked}
                                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-cblue"
                            >
                                Modifier
                            </Button>
                        </div>
                    </div>

                    <Link
                        href={activities(course.slug)}
                        className="btn-primary my-5 flex items-center justify-center gap-2 text-center text-xl font-bold"
                    >
                        Activité <ArrowRight size={25} />
                    </Link>
                    <div className="my-5 mb-3 flex items-center justify-between">
                        <h3 className="text-xl font-bold lg:text-2xl">
                            Frais de formation :{' '}
                        </h3>
                        <h2 className="font-bold text-cblue lg:text-2xl">
                            {parseInt(course.price.toString())}F
                        </h2>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <Link href={moduleIndex(course.slug)}>
                                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                                    Modules
                                    <ArrowRight
                                        size={30}
                                        className="text-cblue"
                                    />
                                </div>
                                <div className="mt-1 text-2xl font-bold text-gray-900">
                                    {modules.length}
                                </div>
                            </Link>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-sm text-gray-500">
                                Séquences
                            </div>
                            <div className="mt-1 text-2xl font-bold text-gray-900">
                                {sequences.length}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <Link href={students.index()}>
                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                                        Étudiants inscrits
                                        <ArrowRight
                                            size={30}
                                            className="text-cblue"
                                        />
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-gray-900">
                                        {enrollments}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="grid gap-6 rounded-lg border bg-gray-50 p-4 text-center shadow-sm sm:grid-cols-2">
                        <AssignStudentToCourse course={course} />
                    </div>
                </div>
                <div className="p-6 md:col-span-8">
                    <Spacer />
                    <h3 className="text-xl font-bold lg:text-2xl">
                        Contenu du cours
                    </h3>
                    <Spacer height="5" />
                    <GetHtmlContent contentHtml={course.syllabus ?? ''} />
                </div>
            </div>
        </TeacherLayouts>
    );
}
