import { index as profile } from '@/routes/auth/profile';
import { index as settings } from '@/routes/auth/settings';
import { dashboard, docs } from '@/routes/students';
import { calendars } from '@/routes/students/activities';
import { index as courses } from '@/routes/students/courses';
import { index as evaluations } from '@/routes/students/evaluations';
import { index as quizzes } from '@/routes/students/quizzes';
import { type NavItem } from '@/types';
import { Book, BookOpen, Calendar, Gauge, Settings, User } from 'lucide-react';
import { MdPlaylistAddCheck } from 'react-icons/md';
export const profileItemsTriggers = [
    { title: 'Mon Profil', href: profile().url, icon: User },
    { title: 'Paramètres', href: settings().url, icon: Settings },
];
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
        title: 'Quizzes',
        href: quizzes(),
        icon: MdPlaylistAddCheck,
    },
    {
        title: 'Evaluations',
        href: evaluations(),
        icon: MdPlaylistAddCheck,
    },
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
    //     title: 'Mes compétences',
    //     href: '#',
    //     icon: HiCheckCircle,
    // },
    // {
    //     title: 'Mes badges',
    //     href: '#',
    //     icon: LuBadge,
    // },
    // {
    //     title: 'Mes certifications',
    //     href: '#',
    //     icon: LiaCertificateSolid,
    // },
    // {
    //     title: 'Mes diplômes',
    //     href: '#',
    //     icon: FaGraduationCap,
    // },
];

export const studentFooterNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: docs(),
        icon: BookOpen,
    },
];
