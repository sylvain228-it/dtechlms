import { Spacer } from '@/components/spacer';
import GetHtmlContent from '@/lib/get-html-content';
import AssignStudentToCourse from '@/pages/teachers/courses/assign-student';
import { content } from '@/routes/institut/courses';
import { Course } from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import CourseLayout from './shared/course-layout';

export default function InstitutCourseDetails() {
    const { course } = usePage().props as unknown as { course: Course };
    const modulesCount = course.modules?.length ?? 0;
    const sequencesCount = course.sequences?.length ?? 0;
    const enrollments = course.enrollments?.length ?? 0;
    return (
        <CourseLayout title={'Détail du cours'}>
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
                    </div>
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
                            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                                Modules
                            </div>
                            <div className="mt-1 text-2xl font-bold text-gray-900">
                                {modulesCount}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-sm text-gray-500">
                                Séquences
                            </div>
                            <div className="mt-1 text-2xl font-bold text-gray-900">
                                {sequencesCount}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="rounded-lg bg-gray-50 p-4 text-center">
                                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                                    Étudiants inscrits
                                </div>
                                <div className="mt-1 text-2xl font-bold text-gray-900">
                                    {enrollments}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link
                        className="btn-primary my-6 flex !w-full items-center justify-center gap-3 font-bold text-white"
                        href={content(course.slug)}
                    >
                        Contenu du cours{' '}
                        <ArrowRight size={30} className="text-white" />
                    </Link>
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
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
        </CourseLayout>
    );
}
