import AppLogo from '@/components/app-logo-icon';
import { Divider } from '@/components/divider';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AvatarFallbackShared from '@/layouts/public/avatar-fallback';
import { profileItemsTriggers } from '@/layouts/student/nav-items';
import LogoutUserBtn from '@/lib/logout-user';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/students';
import { index, reading } from '@/routes/students/courses';
import { SharedData } from '@/types';
import { Course, Module, Sequence } from '@/types/models/course';
import { Student } from '@/types/models/institut';
import { Head, Link, usePage } from '@inertiajs/react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { ListCollapseIcon, Menu, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface ReadingCourseLayoutProps {
    children: ReactNode;
    title: string;
    modules: Module[];
    course: Course;
    sequenceId?: number;
    moduleId?: number;
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

export default function ReadingCourseLayout({
    children,
    title,
    modules,
    course,
    sequenceId,
    moduleId,
}: ReadingCourseLayoutProps) {
    const [mainMarginClass, setMainMarginClass] = useState(`lg:ml-[400px]`);

    window.addEventListener('resize', function () {
        if (window.innerWidth < 1024) {
            setIsOpenSidebarNav(false);
            setMainMarginClass('');
        } else if (window.innerWidth >= 1024) {
            setIsOpenSidebarNav(true);
            setMainMarginClass(`lg:ml-[400px]`);
        }
    });

    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { student } = usePage().props as unknown as Student;
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
            setMainMarginClass(`lg:ml-[400px]`);
        }
    }

    return (
        <>
            <Head title={title} />

            {/* header */}
            <div className="sticky top-0 right-0 left-0 z-40 sm:z-50">
                <nav
                    className={`h-[56px] border-b border-gray-200 bg-white shadow-sm dark:bg-cdark`}
                >
                    <div className="mx-auto px-4 sm:w-full sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-6">
                                <div className="order-last p-2 lg:order-first dark:bg-white">
                                    <Link
                                        href={dashboard()}
                                        className="flex items-center gap-2"
                                    >
                                        <AppLogo className="h-[30px]" />
                                    </Link>
                                </div>
                                {!isOpenSidebarNav && (
                                    <Menu
                                        className=""
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
                                        className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200"
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
                                        <DropdownMenuTrigger
                                            asChild
                                            className="border dark:border-gray-400"
                                        >
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
                                            className="w-56 transition-all duration-300 ease-in-out dark:bg-cdcard"
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
                                                                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200"
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
                                                <LogoutUserBtn />
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
                                    student={student as Student}
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
                            <LogoutUserBtn />
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
                    className={`fixed top-0 left-0 z-50 h-full overflow-y-auto border-t border-r bg-white p-6 shadow-sm transition-all duration-300 ease-in-out sm:top-[56px] dark:bg-cdcard ${
                        isOpenSidebarNav
                            ? `w-full translate-x-0 sm:w-[400px]`
                            : '-translate-x-full'
                    }`}
                >
                    <div className="mb-4">
                        {isOpenSidebarNav && (
                            <div className="flex justify-between">
                                <h3 className="line-clamp-1 text-xl font-bold">
                                    {course.title}
                                </h3>
                                <X size={24} onClick={handleSidebarTrigger} />
                            </div>
                        )}
                        <Accordion
                            type="single"
                            collapsible
                            defaultValue={
                                moduleId ? `module-${moduleId}` : undefined
                            }
                        >
                            {modules.map((module) => (
                                <AccordionItem
                                    key={module.id}
                                    value={`module-${module.id}`}
                                >
                                    <AccordionTrigger>
                                        <div>
                                            <h2 className="text-md mb-1 font-bold text-gray-600 dark:text-gray-400">
                                                Module {module.order}
                                            </h2>
                                            {module.title}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="mt-2 space-y-2">
                                            {(
                                                module.sequences as Sequence[]
                                            ).map((sequence) => (
                                                <div className="flex items-center gap-1">
                                                    <ListCollapseIcon
                                                        size={10}
                                                    />
                                                    <li
                                                        key={sequence.id}
                                                        className={`p-2 text-sm text-gray-600 hover:text-blue-400 dark:text-gray-300 ${sequenceId === sequence.id ? 'border-l-2 border-cblue bg-cblue/5 font-semibold' : ''}`}
                                                    >
                                                        <Link
                                                            href={reading([
                                                                course.slug,
                                                                sequence.slug,
                                                            ])}
                                                        >
                                                            <span
                                                                onClick={
                                                                    handleSidebarItemClic
                                                                }
                                                            >
                                                                {sequence.title}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
            {/* main */}
            <div
                className={cn(
                    'p-2 transition-all duration-300 sm:p-6',
                    mainMarginClass,
                )}
            >
                {children}
            </div>
        </>
    );
}
