import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import * as teacherRoutes from '@/routes/teachers';
import courses from '@/routes/teachers/courses';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Calendar, Gauge, MessageCircleIcon } from 'lucide-react';

import { index as listEvents } from '@/routes/teachers/events';
import { index as skills } from '@/routes/teachers/skills';
import { index as listStudents } from '@/routes/teachers/students';
import { CiChat1 } from 'react-icons/ci';
import { FaBook, FaTools } from 'react-icons/fa';
import { FaGraduationCap, FaUsersLine } from 'react-icons/fa6';
import { HiCheckCircle } from 'react-icons/hi2';
import { LiaCertificateSolid } from 'react-icons/lia';
import { LuBadge } from 'react-icons/lu';
import AppLogo from '../app-logo-icon';
const mainNavItems: NavItem[] = [
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
        title: 'Evennements',
        href: listEvents(),
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

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

export function TeacherSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="bg-pink-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={teacherRoutes.dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} dashName="Enseignants" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
