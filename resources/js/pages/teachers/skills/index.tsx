import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { Skill } from '@/types/models/skill';
import { usePage } from '@inertiajs/react';
import SkillsDataTable from './datatable';

export default function TeacherSkillsIndex() {
    const { skills } = usePage().props as unknown as {
        skills: Skill[];
    };

    return (
        <TeacherLayouts title="Liste de compétences">
            <SkillsDataTable skills={skills} />
        </TeacherLayouts>
    );
}
