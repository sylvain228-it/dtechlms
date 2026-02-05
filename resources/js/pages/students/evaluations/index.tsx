import StudentLayouts from '@/layouts/student/student-layouts';
import { CourseActivity } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import StudentActivitiesShared from '../calendars/activities';

export default function StudentEvaluations() {
    const { evaluations } = usePage().props as unknown as {
        evaluations: CourseActivity[];
    };

    return (
        <StudentLayouts title="Liste des évaluations">
            <StudentActivitiesShared activities={evaluations} isAssessment />
        </StudentLayouts>
    );
}
