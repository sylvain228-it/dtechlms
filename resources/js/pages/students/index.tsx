import { StatCard } from '@/components/shared/stat-card';
import StudentLayouts from '@/layouts/student/student-layouts';
import { calendars } from '@/routes/students/activities';
import { index } from '@/routes/students/courses';
import { CourseActivity } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import { BookCheck, Calendar } from 'lucide-react';
import StudentCalendar from './calendars/calendar';

export default function StudentDashboard() {
    const { props } = usePage();
    const { activities } = props as unknown as {
        activities: CourseActivity[];
    };
    const { totalCourses, totalUpComingActivities } = props as unknown as {
        totalCourses: number;
        totalUpComingActivities: number;
    };

    return (
        <StudentLayouts title="Etudiant dashboard">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total activités avenir"
                    value={totalUpComingActivities ?? 0}
                    href={calendars().url}
                >
                    <Calendar />
                </StatCard>
                <StatCard
                    title="Total cours"
                    value={totalCourses ?? 0}
                    href={index().url}
                >
                    <BookCheck />
                </StatCard>
            </div>
            <div className="my-5">
                <StudentCalendar activities={activities} />
            </div>
        </StudentLayouts>
    );
}
