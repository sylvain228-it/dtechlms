import { StatCard } from '@/components/shared/stat-card';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { dashboard } from '@/routes/institut';
import { list as listCourses } from '@/routes/institut/courses';
import { index as listStudents } from '@/routes/institut/students';
import { index as listTeachers } from '@/routes/institut/teachers';
import { BreadcrumbItem } from '@/types';
import { BookCheck } from 'lucide-react';
import { MdPerson3 } from 'react-icons/md';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
type Props = {
    students_count: number;
    teachers_count: number;
    courses_count: number;
};
export default function InstitutDashboard({
    students_count,
    teachers_count,
    courses_count,
}: Props) {
    return (
        <InstitutLayouts
            breadcrumbs={breadcrumbs}
            title="Tableau de bord Institut"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total étudiants"
                    value={students_count ?? 0}
                    href={listStudents().url}
                >
                    <MdPerson3 />
                </StatCard>
                <StatCard
                    title="Total enseignants"
                    value={teachers_count ?? 0}
                    href={listTeachers().url}
                >
                    <MdPerson3 />
                </StatCard>
                <StatCard
                    title="Total cours"
                    value={courses_count ?? 0}
                    href={listCourses().url}
                >
                    <BookCheck />
                </StatCard>
            </div>
        </InstitutLayouts>
    );
}
