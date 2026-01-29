import { NavFooter } from '@/components/nav-footer';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/institut';
import { list } from '@/routes/institut/courses';
import domaines from '@/routes/institut/domaines';
import { index as listLoca } from '@/routes/institut/locations';
import { index as geststudents } from '@/routes/institut/students';
import teachers from '@/routes/institut/teachers';
import { index as listUsers } from '@/routes/institut/users';
import { type NavItem } from '@/types';
import { InstitutProfileProps } from '@/types/models/institut';
import { Link } from '@inertiajs/react';
import { BookOpen, Gauge, MessageCircleIcon } from 'lucide-react';
import { CiChat1 } from 'react-icons/ci';
import { FaBook, FaTools } from 'react-icons/fa';
import { FaGraduationCap, FaUsers, FaUsersLine } from 'react-icons/fa6';
import { GiTeacher } from 'react-icons/gi';
import { HiCheckCircle, HiMiniBuildingLibrary } from 'react-icons/hi2';
import { LiaCertificateSolid } from 'react-icons/lia';
import { LuBadge } from 'react-icons/lu';
import { MdCategory } from 'react-icons/md';
import AppLogo from '../app-logo-icon';
import InstitutLogo from '../partner-logo';
import { PartnerNavMain } from '../partner-nav-main';
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
    {
        title: 'Etablissements',
        href: listLoca(),
        icon: HiMiniBuildingLibrary,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

export function InstitutSidebar({
    institut,
}: {
    institut: InstitutProfileProps | undefined;
}) {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-pink-100">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                {institut == undefined ? (
                                    <AppLogo />
                                ) : (
                                    <InstitutLogo url={institut.logo_url!} />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <PartnerNavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-transparent">
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/* <NavAdmin /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
