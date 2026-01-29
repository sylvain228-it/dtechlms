import { StatCard } from '@/components/shared/stat-card';
import { Spacer } from '@/components/spacer';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { dashboard } from '@/routes/teachers';
import { index as showCourses } from '@/routes/teachers/courses';
import { index as showEvents } from '@/routes/teachers/events';
import { index as showStudents } from '@/routes/teachers/students';
import { type BreadcrumbItem } from '@/types';
import { CourseActivity } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import { BookCheck, Calendar } from 'lucide-react';
import { FaUsersLine } from 'react-icons/fa6';
import TeacherCalendar from './calendars/calendar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function TeacherDashboard() {
    const { props } = usePage();

    const { activities } = props as unknown as { activities: CourseActivity[] };
    const { totalCourses, totalUpComingActivities, studentsCount } =
        props as unknown as {
            totalCourses: number;
            totalUpComingActivities: number;
            studentsCount: number;
        };

    return (
        <TeacherLayouts breadcrumbs={breadcrumbs} title="Tableau de bord">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total activités avenir"
                        value={totalUpComingActivities ?? 0}
                        href={showEvents().url}
                    >
                        <Calendar />
                    </StatCard>
                    <StatCard
                        title="Total cours"
                        value={totalCourses}
                        href={showCourses().url}
                    >
                        <BookCheck />
                    </StatCard>

                    <StatCard
                        title="Total étudiants"
                        value={studentsCount}
                        href={showStudents().url}
                    >
                        <FaUsersLine />
                    </StatCard>
                </div>
            </div>
            <Spacer />
            <TeacherCalendar activities={activities} />
        </TeacherLayouts>
    );
}
