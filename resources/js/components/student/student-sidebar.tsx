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
import { dashboard } from '@/routes/students';
import { index as courses } from '@/routes/students/courses';
import { index as events } from '@/routes/students/events';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
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
import AppLogo from '../app-logo-icon';

const mainNavItems: NavItem[] = [
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
        title: 'Calendrier',
        href: events(),
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

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

export function StudentSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="bg-pink-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} dashName="Etudiants" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
