import AppLogo from '@/components/app-logo-icon';
import { Divider } from '@/components/divider';
import DefualtProfileSvg from '@/components/profile-svg';
import { ProfileItemsTrigger } from '@/components/shared/user-profile-trigger';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoutUserBtn from '@/lib/logout-user';
import { login, register } from '@/routes/auth';
import { index as profile } from '@/routes/auth/profile';
import { index as settings } from '@/routes/auth/settings';
import { dashboard as studentDash } from '@/routes/students';
import { dashboard as teacherDash } from '@/routes/teachers';
import { SharedData, User as UserModel } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Eclipse, Settings, User, X } from 'lucide-react';
import { useState } from 'react';

function AuthButton() {
    return (
        <div className="flex items-center space-x-2">
            <Link
                href={login()}
                className="btn-primary !hover:bg-app-blue !hover:text-white !my-1 border border-current !bg-transparent !text-app-blue"
            >
                Se connecter
            </Link>
            <Link href={register()} className="btn-primary">
                S'inscrire
            </Link>
        </div>
    );
}
export default function PublicNavbar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
    const navItems = [{ title: 'Mes Cours', href: '/' }];

    const profileItemsTriggers = [
        { title: 'Mon Profil', href: profile().url, icon: User },
        { title: 'Paramètres', href: settings().url, icon: Settings },
    ];

    if (auth.user) {
        profileItemsTriggers.push({
            title: 'Mon interface',
            href:
                auth.user.account_role == 'student'
                    ? studentDash().url
                    : teacherDash().url,
            icon: Eclipse,
        });
    }
    function handleMenuOpenNav() {
        setIsOpenMobileNav(!isOpenMobileNav);
    }
    return (
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
                                    href={'/'}
                                    className="flex items-center gap-2"
                                >
                                    <AppLogo className="h-[30px]" />
                                </Link>
                            </div>
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

                            {auth.user == null && <AuthButton />}

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
                                                user={auth.user as UserModel}
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
                                                            <Icon size={16} />
                                                            {item.title}
                                                        </Link>
                                                    );
                                                },
                                            )}
                                        </div>
                                        <LogoutUserBtn />
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
                                <div>
                                    {auth.user == null ? (
                                        <DefualtProfileSvg />
                                    ) : (
                                        <ProfileItemsTrigger
                                            user={
                                                auth.user as
                                                    | UserModel
                                                    | undefined
                                            }
                                        />
                                    )}
                                </div>
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

                        {auth.user != null && (
                            <div>
                                <Divider />
                                <div className="mb-3 flex items-center gap-3 px-4 py-2">
                                    <ProfileItemsTrigger
                                        user={auth.user as UserModel}
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {auth.user.first_name == null &&
                                            auth.user.last_name == null ? (
                                                <span>
                                                    {auth.user.first_name}{' '}
                                                    {auth.user.last_name}
                                                </span>
                                            ) : (
                                                <span>
                                                    {auth.user.username}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {auth.user.email}
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

                                <LogoutUserBtn />
                            </div>
                        )}

                        {auth.user == null && (
                            <div>
                                <Divider />
                                <AuthButton />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
