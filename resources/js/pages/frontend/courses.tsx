import { PublicLayout } from '@/layouts/public/public-layout';
import { Course } from '@/types';
import { usePage } from '@inertiajs/react';

export default function CourseListPage() {
    const { courses } = usePage().props as unknown as { courses: Course[] };
    console.log(courses);
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-4xl font-bold">Liste des cours</h1>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course: Course) => (
                        <div
                            key={course.id}
                            className="rounded-lg border p-4 shadow"
                        >
                            <img
                                src={course.cover_url}
                                alt={course.title}
                                className="mb-4 h-48 w-full rounded object-cover"
                            />
                            <h2 className="mb-2 text-2xl font-semibold">
                                {course.title}
                            </h2>
                            <p className="mb-4 text-gray-700">
                                {course.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-blue-600">
                                    {course.price
                                        ? `${course.price} F`
                                        : 'Gratuit'}
                                </span>
                                <button className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                                    Voir le cours
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
