import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    courses,
    dashboard,
    etudiants,
    instituts,
    teachers,
} from '@/routes/admin';
import domaines from '@/routes/admin/domaines';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Gauge } from 'lucide-react';
import { FaBook, FaUsers } from 'react-icons/fa';
import {
    FaBuildingColumns,
    FaGraduationCap,
    FaUsersLine,
} from 'react-icons/fa6';
import { GiTeacher } from 'react-icons/gi';
import { HiCheckCircle } from 'react-icons/hi2';
import { LiaCertificateSolid } from 'react-icons/lia';
import { LuBadge } from 'react-icons/lu';
import { MdCategory } from 'react-icons/md';
import AppLogo from '../app-logo-icon';
const mainNavItems: NavItem[] = [
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
        href: '#',
        icon: FaUsers,
    },
    {
        title: 'Cours',
        href: courses(),
        icon: FaBook,
    },
    {
        title: 'Organisations',
        href: instituts(),
        icon: FaBuildingColumns,
    },
    {
        title: 'Enseignants',
        href: teachers(),
        icon: GiTeacher,
    },
    {
        title: 'Etudiants',
        href: etudiants(),
        icon: FaUsersLine,
    },
    {
        title: 'Compétences',
        href: '#',
        icon: HiCheckCircle,
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

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-cblue">
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/* <NavAdmin /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
