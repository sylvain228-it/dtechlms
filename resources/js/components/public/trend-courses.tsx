import { Course } from '@/types/models/course';
import { Spacer } from '../spacer';
import CourseCard from './course-card';

export default function TrendCourses({
    coursesProp,
}: {
    coursesProp: Course[];
}) {
    return (
        <div>
            <h2 className="mb-4 text-3xl font-bold">
                Les cours les plus en vues{' '}
            </h2>
            <Spacer height="4" />
            <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {coursesProp.map((course: Course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
