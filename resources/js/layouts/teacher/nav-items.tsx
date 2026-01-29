import * as teacherRoutes from '@/routes/teachers';
import courses from '@/routes/teachers/courses';
import { type NavItem } from '@/types';
import { BookOpen, Calendar, Gauge, MessageCircleIcon } from 'lucide-react';

import { index as skills } from '@/routes/teachers/skills';
import { index as listStudents } from '@/routes/teachers/students';
import { CiChat1 } from 'react-icons/ci';
import { FaBook, FaTools } from 'react-icons/fa';
import { FaGraduationCap, FaUsersLine } from 'react-icons/fa6';
import { HiCheckCircle } from 'react-icons/hi2';
import { LiaCertificateSolid } from 'react-icons/lia';
import { LuBadge } from 'react-icons/lu';
export const teacherMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: teacherRoutes.dashboard(),
        icon: Gauge,
    },
    {
        title: 'Cours',
        href: courses.index(),
        icon: FaBook,
    },

    {
        title: 'Etudiants',
        href: listStudents(),
        icon: FaUsersLine,
    },
    {
        title: 'Calendrier des activités',
        href: teacherRoutes.allActivities(),
        icon: Calendar,
    },
    {
        title: 'Compétences',
        href: skills(),
        icon: HiCheckCircle,
    },
    {
        title: 'Discussions',
        href: '#',
        icon: CiChat1,
    },
    {
        title: 'Messages',
        href: '#',
        icon: MessageCircleIcon,
    },
    {
        title: 'Outils',
        href: '#',
        icon: FaTools,
    },
    {
        title: 'Badges',
        href: '#',
        icon: LuBadge,
    },
    {
        title: 'Certifications',
        href: '#',
        icon: LiaCertificateSolid,
    },
    {
        title: 'Diplômes',
        href: '#',
        icon: FaGraduationCap,
    },
];

export const teacherFooterNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];
