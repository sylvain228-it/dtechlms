import { dashboard } from '@/routes/students';
import { calendars } from '@/routes/students/activities';
import { index as courses } from '@/routes/students/courses';
import { type NavItem } from '@/types';
import {
    Book,
    BookOpen,
    Calendar,
    Gauge,
    MessageCircleIcon,
} from 'lucide-react';
import { CiChat1 } from 'react-icons/ci';
import { FaTools } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa6';
import { HiCheckCircle } from 'react-icons/hi2';
import { LiaCertificateSolid } from 'react-icons/lia';
import { LuBadge } from 'react-icons/lu';
export const studentMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: Gauge,
    },
    {
        title: 'Mes cours',
        href: courses(),
        icon: Book,
    },
    {
        title: 'Calendrier des activités',
        href: calendars(),
        icon: Calendar,
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
        title: 'Mes compétences',
        href: '#',
        icon: HiCheckCircle,
    },
    {
        title: 'Mes badges',
        href: '#',
        icon: LuBadge,
    },
    {
        title: 'Mes certifications',
        href: '#',
        icon: LiaCertificateSolid,
    },
    {
        title: 'Mes diplômes',
        href: '#',
        icon: FaGraduationCap,
    },
];

export const studentFooterNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];
