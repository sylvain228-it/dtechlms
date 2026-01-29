import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { CourseActivity } from '@/types/models/course';
import { usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import TeacherActivities from './activities';
import TeacherCalendar from './calendar';

type ActivitysIndexProps = {
    activities: CourseActivity[];
};

export default function TeacherAllActivitiesIndex() {
    const { activities } = usePage().props as unknown as ActivitysIndexProps;
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <TeacherLayouts title="Calendrier des activités">
            {/* toggle show calendar */}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Calendar className="h-4 w-4" />
                    {showCalendar ? 'Voir la liste' : 'Voir le calendrier'}
                </button>
            </div>
            {showCalendar && (
                <div className="mb-4">
                    <TeacherCalendar activities={activities} />
                </div>
            )}
            {/* Additional content can go here */}
            {!showCalendar && <TeacherActivities activities={activities} />}
        </TeacherLayouts>
    );
}
