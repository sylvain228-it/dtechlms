import SubStrText from '@/lib/substr';
import { Course } from '@/types';
import { Link } from '@inertiajs/react';

export default function SimilarCourseCard({ course }: { course: Course }) {
    return (
        <Link href={`/course/${course.slug}`}>
            <div className="flex items-start gap-4 overflow-hidden rounded-lg border-b">
                <img
                    className="h-[50px] w-[70px] object-cover"
                    src={course.cover_url}
                    alt={course.title}
                />
                {/* institu info */}
                <div>
                    <h3 className="mb-1 text-[15px] font-semibold">
                        <SubStrText text={course.title} start={0} end={100} />
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">
                            {course.price ? `${course.price} F` : 'Gratuit'}
                        </span>
                    </div>
                    <div className="my-2 flex items-center gap-2">
                        <img
                            className="h-7 w-auto rounded-full object-contain"
                            src={course.institut.logo_url}
                            alt={course.institut.name}
                        />
                        <p className="text-sm text-gray-500">
                            <SubStrText
                                text={course.institut.name}
                                start={0}
                                end={20}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
