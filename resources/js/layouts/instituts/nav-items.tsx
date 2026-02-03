import { dashboard, docs } from '@/routes/institut';
import { list } from '@/routes/institut/courses';
import domaines from '@/routes/institut/domaines';
import { index as listLoca } from '@/routes/institut/locations';
import { index as geststudents } from '@/routes/institut/students';
import teachers from '@/routes/institut/teachers';
import { index as listUsers } from '@/routes/institut/users';
import { type NavItem } from '@/types';
import { BookOpen, Gauge } from 'lucide-react';
import { FaBook } from 'react-icons/fa';
import { FaUsers, FaUsersLine } from 'react-icons/fa6';
import { GiTeacher } from 'react-icons/gi';
import { HiMiniBuildingLibrary } from 'react-icons/hi2';
import { MdCategory } from 'react-icons/md';
export const institutMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: Gauge,
    },
    {
        title: 'Domaines',
        href: domaines.index(),
        icon: MdCategory,
    },
    {
        title: 'Utilisateurs',
        href: listUsers(),
        icon: FaUsers,
    },
    {
        title: 'Cours',
        href: list(),
        icon: FaBook,
    },

    {
        title: 'Enseignants',
        href: teachers.index(),
        icon: GiTeacher,
    },
    {
        title: 'Etudiants',
        href: geststudents(),
        icon: FaUsersLine,
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
    //     title: 'Compétences',
    //     href: '#',
    //     icon: HiCheckCircle,
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
    {
        title: 'Etablissements',
        href: listLoca(),
        icon: HiMiniBuildingLibrary,
    },
];

export const institutFooterNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: docs(),
        icon: BookOpen,
    },
];
