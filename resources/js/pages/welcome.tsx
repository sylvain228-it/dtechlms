import HomeCarousel from '@/components/public/home-carousel';
import TrendCourses from '@/components/public/trend-courses';
import { Spacer } from '@/components/spacer';
import PublicNavbar from '@/layouts/public/nav-bar';
import { Course } from '@/types/models/course';
import { usePage } from '@inertiajs/react';

export default function Welcome() {
    const { courses } = usePage().props as unknown as { courses: Course[] };
    return (
        <div>
            <PublicNavbar />
            <HomeCarousel />
            <div className="container">
                <Spacer />
                <TrendCourses coursesProp={courses} />
            </div>
        </div>
    );
}
