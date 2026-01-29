'use client';

import AppLogo from '@/components/app-logo-icon';
import { Divider } from '@/components/divider';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AvatarFallbackShared from '@/layouts/public/avatar-fallback';
import { NavItem, SharedData } from '@/types';
import { Student } from '@/types/models/institut';
import { Link, usePage } from '@inertiajs/react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { LogOut, Settings, User, X } from 'lucide-react';
import { useState } from 'react';

function CourseDropdownItemsDesk({ navItems }: { navItems: NavItem[] }) {
    return (
        <div className="border-1 border-b bg-white p-2 shadow-sm dark:text-black">
            <ul>
                {navItems.map((item, idx) => (
                    <li key={idx}>
                        <Link href={item.href}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ProfileItemsTrigger({ student }: { student: Student | undefined }) {
    return (
        <Avatar className="size-8 overflow-hidden rounded-full">
            <AvatarImage
                src={student?.profile_picture_url ?? ''}
                alt={student?.first_name ?? ''}
            />
            <AvatarFallbackShared
                first_name={student?.first_name ?? ''}
                last_name={student?.last_name ?? ''}
            />
        </Avatar>
    );
}
export default function CourseHeaderNav() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { student } = usePage().props as unknown as Student;
    const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);

    const navItems = [{ title: 'Mes Cours', href: '/courses' }];

    const dropdownItems = [
        { title: 'Progression', href: '/progress' },
        { title: 'Certificats', href: '/certificates' },
        { title: 'Récompenses', href: '/badges' },
    ];

    const profileItemsTriggers = [
        { title: 'Mon Profil', href: '/profile', icon: User },
        { title: 'Paramètres', href: '/settings', icon: Settings },
        { title: 'Déconnexion', href: '/logout', icon: LogOut },
    ];

    return (
        <div>
            <nav className="z-50 border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <AppLogo className="h-[30px]" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    {item.title}
                                </Link>
                            ))}

                            {/* Dropdown */}
                        </div>

                        {/* Right Section - Desktop */}
                        {auth.user != null && (
                            <div className="hidden lg:block">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="size-10 rounded-full p-1"
                                        >
                                            <ProfileItemsTrigger
                                                student={
                                                    student as
                                                        | Student
                                                        | undefined
                                                }
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                    >
                                        <div>
                                            <CourseDropdownItemsDesk
                                                navItems={profileItemsTriggers}
                                            />
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* Mobile Menu Button */}

                        <button
                            onClick={() => setIsOpenMobileNav(!isOpenMobileNav)}
                            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
                        >
                            {isOpenMobileNav ? (
                                <X size={24} />
                            ) : (
                                <ProfileItemsTrigger
                                    student={student as Student | undefined}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </nav>
            {/* Mobile Navigation */}
            {isOpenMobileNav && (
                <div>
                    <div
                        onClick={() => setIsOpenMobileNav(!isOpenMobileNav)}
                        className="fixed top-0 z-40 h-full w-full bg-black/50"
                    ></div>
                    <div
                        className={`fixed right-0 bottom-0 z-50 w-full animate-in gap-4 overflow-y-auto rounded-t-lg bg-white p-4 shadow-lg transition-all duration-300 ease-in-out ${isOpenMobileNav ? 'slide-in-from-bottom' : 'slide-out-to-bottom'}`}
                    >
                        <div className="flex justify-end">
                            <button
                                onClick={() =>
                                    setIsOpenMobileNav(!isOpenMobileNav)
                                }
                                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                            >
                                {<X size={24} />}
                            </button>
                        </div>

                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                            >
                                {item.title}
                            </Link>
                        ))}

                        <Divider />
                        {/* profile nav */}
                        <div className="mb-3 flex items-center gap-3 px-4 py-2">
                            <ProfileItemsTrigger student={student as Student} />

                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Jean Dupont
                                </p>
                                <p className="text-xs text-gray-600">
                                    jean@example.com
                                </p>
                            </div>
                        </div>
                        {profileItemsTriggers.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    onClick={() => setIsOpenMobileNav(false)}
                                >
                                    <Icon size={16} />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
