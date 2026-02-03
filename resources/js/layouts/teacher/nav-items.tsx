import {
    allActivities,
    allEvaluations,
    allQuizzes,
    dashboard,
    docs,
} from '@/routes/teachers';
import { index as courses } from '@/routes/teachers/courses';
import { type NavItem } from '@/types';
import { BookOpen, Calendar, Gauge } from 'lucide-react';

import { index as listStudents } from '@/routes/teachers/students';
import { FaBook } from 'react-icons/fa';
import { FaUsersLine } from 'react-icons/fa6';
import { MdPlaylistAddCheck } from 'react-icons/md';
export const teacherMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: Gauge,
    },
    {
        title: 'Cours',
        href: courses(),
        icon: FaBook,
    },

    {
        title: 'Etudiants',
        href: listStudents(),
        icon: FaUsersLine,
    },
    {
        title: 'Calendrier des activités',
        href: allActivities(),
        icon: Calendar,
    },
    {
        title: 'Evaluations',
        href: allEvaluations(),
        icon: MdPlaylistAddCheck,
    },
    {
        title: 'Quizzes',
        href: allQuizzes(),
        icon: MdPlaylistAddCheck,
    },
    // {
    //     title: 'Compétences',
    //     href: skills(),
    //     icon: HiCheckCircle,
    // },
    // {
    //     title: 'Discussions',
    //     href: '#',
    //     icon: CiChat1,
    // },
    // {
    //     title: 'Messages',
    //     href: '#',
    //     icon: MessageCircleIcon,
    // },
    // {
    //     title: 'Outils',
    //     href: '#',
    //     icon: FaTools,
    // },
    // {
    //     title: 'Badges',
    //     href: '#',
    //     icon: LuBadge,
    // },
    // {
    //     title: 'Certifications',
    //     href: '#',
    //     icon: LiaCertificateSolid,
    // },
    // {
    //     title: 'Diplômes',
    //     href: '#',
    //     icon: FaGraduationCap,
    // },
];

export const teacherFooterNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: docs(),
        icon: BookOpen,
    },
];
