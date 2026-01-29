import SubStrText from '@/lib/substr';
import { Course } from '@/types/models/course';
import { Link } from '@inertiajs/react';
import { FaGraduationCap } from 'react-icons/fa';

export default function CourseCard({ course }: { course: Course }) {
    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-lg transition-shadow duration-300 hover:scale-105 hover:shadow-xl">
            <Link href={`/course/${course.slug}`}>
                <img
                    className="h-[150px] w-full object-cover"
                    src={course.cover_url ?? ''}
                    alt={course.title}
                />
                {/* institu info */}
                <div className="mt-2 flex items-center gap-2 px-4">
                    <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={course.institut?.logo_url ?? ''}
                        alt={course.institut?.name}
                    />
                    <p className="text-sm text-gray-500">
                        <SubStrText
                            text={course.institut?.name ?? ''}
                            start={0}
                            end={20}
                        />
                    </p>
                </div>
                <div className="px-4 pt-2 pb-4">
                    <h3 className="mb-2 text-[15px] font-semibold text-gray-800 capitalize">
                        <SubStrText text={course.title} start={0} end={100} />
                    </h3>

                    <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">
                            {course.price ? `${course.price} F` : 'Gratuit'}
                        </span>
                    </div>
                    <div className="my-2">
                        <div className="flex items-center gap-2">
                            <FaGraduationCap />
                            <p className="text-sm text-app-blue">
                                Obtenir un diplôme
                            </p>
                        </div>
                        <p className="text-sm text-gray-600">Diplôme</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
