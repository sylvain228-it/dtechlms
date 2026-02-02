import AppLogo from '@/components/app-logo-icon';
import { Divider } from '@/components/divider';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AvatarFallbackShared from '@/layouts/public/avatar-fallback';
import { cn, resolveUrl } from '@/lib/utils';
import { index as profile } from '@/routes/institut/profile';
import { dashboard } from '@/routes/students';
import { index } from '@/routes/students/courses';
import { BreadcrumbItem } from '@/types';
import {
    InstitutProfileProps,
    InstitutSharedData,
} from '@/types/models/institut';
import { Link, usePage } from '@inertiajs/react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { LogOut, Menu, Settings, User, X } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { IconType } from 'react-icons/lib';
import { institutMainNavItems } from './nav-items';

function ProfileItemsTrigger({
    institut,
}: {
    institut: InstitutProfileProps | undefined;
}) {
    return (
        <Avatar className="size-8 overflow-hidden rounded-full">
            <AvatarImage
                src={institut?.logo_url ?? ''}
                alt={institut?.name ?? ''}
            />
            <AvatarFallbackShared first_name={institut?.name ?? ''} />
        </Avatar>
    );
}

export default function InstitutSpaceLayouts({
    children,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const [mainMarginClass, setMainMarginClass] = useState(`lg:ml-[300px]`);

    window.addEventListener('resize', function () {
        if (window.innerWidth < 1024) {
            setIsOpenSidebarNav(false);
            setMainMarginClass('');
        } else if (window.innerWidth >= 1024) {
            setIsOpenSidebarNav(true);
            setMainMarginClass(`lg:ml-[300px]`);
        }
    });

    const page = usePage<InstitutSharedData>();
    const { auth } = page.props;
    const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
    const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(
        window.innerWidth >= 1024,
    );

    const navItems = [{ title: 'Mes Cours', href: index().url }];

    // const dropdownItems = [
    //     { title: 'Progression', href: '/progress' },
    //     { title: 'Certificats', href: '/certificates' },
    //     { title: 'Récompenses', href: '/badges' },
    // ];

    const profileItemsTriggers = [
        { title: 'Mon Profil', href: profile().url, icon: User },
        { title: 'Paramètres', href: '/settings', icon: Settings },
        { title: 'Déconnexion', href: '/logout', icon: LogOut },
    ];

    function handleMenuOpenNav() {
        setIsOpenMobileNav(!isOpenMobileNav);
    }
    function handleSidebarItemClic() {
        if (window.innerWidth < 1024) {
            setIsOpenSidebarNav(false);
        }
    }
    function handleSidebarTrigger() {
        setIsOpenSidebarNav(!isOpenSidebarNav);
        if (isOpenSidebarNav || window.innerWidth < 1024) {
            setMainMarginClass('');
        } else {
            setMainMarginClass(`lg:ml-[300px]`);
        }
    }
    const isActiveClass = '!bg-cblue !text-white';
    return (
        <>
            {/* header */}
            <div className="sticky top-0 right-0 left-0 z-40 sm:z-50">
                <nav
                    className={`h-[56px] border-b border-gray-200 bg-white shadow-sm`}
                >
                    <div className="mx-auto px-4 sm:w-full sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex gap-6">
                                <div className="order-last lg:order-first">
                                    <Link
                                        href={dashboard()}
                                        className="flex items-center gap-2"
                                    >
                                        <AppLogo className="h-[30px]" />
                                    </Link>
                                </div>
                                {!isOpenSidebarNav && (
                                    <Menu
                                        className="text-black"
                                        onClick={handleSidebarTrigger}
                                    />
                                )}
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
                            {auth.institut != null && (
                                <div className="hidden lg:block">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="size-10 rounded-full p-1"
                                            >
                                                <ProfileItemsTrigger
                                                    institut={
                                                        auth.institut as InstitutProfileProps
                                                    }
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-56 transition-all duration-300 ease-in-out"
                                            align="end"
                                        >
                                            <div>
                                                {profileItemsTriggers.map(
                                                    (item) => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                                onClick={() => {
                                                                    setIsOpenMobileNav(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                <Icon
                                                                    size={16}
                                                                />
                                                                {item.title}
                                                            </Link>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}

                            {/* Mobile Menu Button */}

                            <button
                                onClick={handleMenuOpenNav}
                                className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
                            >
                                {isOpenMobileNav ? (
                                    <X size={24} />
                                ) : (
                                    <ProfileItemsTrigger
                                        institut={
                                            auth.institut as
                                                | InstitutProfileProps
                                                | undefined
                                        }
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
                            onClick={handleMenuOpenNav}
                            className="fixed top-0 z-40 h-full w-full bg-black/50 transition-all duration-300 ease-in-out"
                        ></div>
                        <div
                            className={`fixed right-0 bottom-0 z-50 w-full animate-in gap-4 overflow-y-auto rounded-t-lg bg-white p-4 shadow-lg transition-all duration-300 ease-in-out ${isOpenMobileNav ? 'slide-in-from-bottom' : 'slide-out-to-bottom'}`}
                        >
                            <div className="flex justify-end">
                                <button
                                    onClick={handleMenuOpenNav}
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
                                <ProfileItemsTrigger
                                    institut={
                                        auth.institut as InstitutProfileProps
                                    }
                                />

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
                                        onClick={() => {
                                            setIsOpenMobileNav(false);
                                        }}
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

            {/* sidebar */}

            {/* Overlay */}
            <div>
                <div
                    onClick={() => setIsOpenSidebarNav(false)}
                    className={`fixed top-0 left-0 z-50 h-full w-full bg-black/50 transition-all duration-300 ease-in-out sm:top-[56px] sm:z-40 lg:hidden ${
                        isOpenSidebarNav
                            ? 'visible opacity-100'
                            : 'invisible opacity-0'
                    }`}
                ></div>

                <div
                    className={`fixed top-0 left-0 z-50 h-full overflow-y-auto border-t border-r bg-white px-6 text-black shadow-sm transition-all duration-300 ease-in-out sm:top-[56px] ${
                        isOpenSidebarNav
                            ? `w-full translate-x-0 sm:w-[300px]`
                            : '-translate-x-full'
                    }`}
                >
                    <div className="mb-4">
                        {isOpenSidebarNav && (
                            <div className="my-3 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-gray-500 uppercase">
                                    {auth != null && (
                                        <span>{auth.institut.name}</span>
                                    )}
                                </h3>
                                <X size={24} onClick={handleSidebarTrigger} />
                            </div>
                        )}
                        <ul>
                            {institutMainNavItems.map((item, idx) => {
                                const Icon = item.icon as IconType;

                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 ${
                                            page.url.startsWith(
                                                resolveUrl(item.href),
                                            )
                                                ? isActiveClass
                                                : ''
                                        }`}
                                        onClick={handleSidebarItemClic}
                                    >
                                        <Icon size={16} />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {/* main */}
            <div
                className={cn(
                    'p-1 transition-all duration-300 sm:p-6',
                    mainMarginClass,
                )}
            >
                {children}
            </div>
        </>
    );
}
