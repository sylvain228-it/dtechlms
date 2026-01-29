import { Divider } from '@/components/divider';
import StudentLayouts from '@/layouts/student/student-layouts';
import GetHtmlContent from '@/lib/get-html-content';
import { subStrText } from '@/lib/tasks';
import { getModalityTypeLabel, getModuleTypeLabel } from '@/lib/type';
import { details } from '@/routes/students/courses';
import { Course, Module } from '@/types/models/course';
import { Link, usePage } from '@inertiajs/react';

export default function CoursModuleShow() {
    const { module, course } = usePage().props as unknown as {
        module: Module;
        course: Course;
    };

    return (
        <StudentLayouts title={`Module : ${module.title}`}>
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={details(course.slug)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Cours
                            </Link>
                            <span className="text-sm text-gray-400">/</span>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {module.title}
                            </h1>
                        </div>

                        <p className="mt-2 max-w-2xl text-sm text-gray-600">
                            {subStrText(module.description ?? '', 0, 100)}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                                Type: {getModuleTypeLabel(module.module_type)}
                            </span>
                            <span className="inline-flex items-center rounded bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                                Mode: {getModalityTypeLabel(module.modality)}
                            </span>
                            <span className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                Version: {module.version ?? 1}
                            </span>
                            {module.is_visible && (
                                <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                    Visible
                                </span>
                            )}
                            <span className="inline-flex items-center rounded bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                                Ordre: {module.order}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-medium text-gray-900">
                            Description
                        </h2>
                        <div className="my-3 text-sm text-gray-700">
                            {module.description ?? (
                                <span className="text-gray-400">
                                    Aucune description fournie.
                                </span>
                            )}
                        </div>
                    </div>

                    <Divider />
                    <div className="my-5">
                        {module.syllabus && (
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                    Contenu du module
                                </h3>
                                <GetHtmlContent contentHtml={module.syllabus} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayouts>
    );
}
