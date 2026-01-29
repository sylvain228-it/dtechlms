import { Course, Module } from '@/types/models/course';
import { Head } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import CourseContentHeaderNav from './content-header-nav';
import CourseModulesNav from './modules-nav';

interface ReadingCourseLayoutProps {
    children: ReactNode;
    title: string;
    modules: Module[];
    course: Course;
    sequenceId?: number;
    moduleId?: number;
}

export default function ReadingCourseLayout({
    children,
    title,
    modules,
    course,
    sequenceId,
    moduleId,
}: ReadingCourseLayoutProps) {
    const [showModulesNav, setShowModulesNav] = useState(true);
    const [mainMarginClass, setMainMarginClass] = useState(`lg:ml-[350px]`);

    window.addEventListener('resize', function () {
        if (window.innerWidth < 1024) {
            setShowModulesNav(false);
            setMainMarginClass('');
        }
    });
    return (
        <>
            <Head title={title} />
            <CourseContentHeaderNav
                onMenuOpen={(val) => {
                    setShowModulesNav(val);
                    if (val) {
                        setMainMarginClass(`lg:ml-[350px]`);
                    } else {
                        setMainMarginClass('');
                    }
                }}
            />
            <div>
                <div>
                    {/* Overlay */}
                    <div
                        onClick={() => setShowModulesNav(false)}
                        className={`fixed top-[56px] left-0 z-40 h-full w-full bg-black/50 transition-all duration-300 ease-in-out lg:hidden ${
                            showModulesNav
                                ? 'visible opacity-100'
                                : 'invisible opacity-0'
                        }`}
                    ></div>
                </div>
                <CourseModulesNav
                    modules={modules}
                    showModulesNav={showModulesNav}
                    course={course}
                    sequenceId={sequenceId}
                    moduleId={moduleId}
                />
                <div
                    className={`p-6 transition-all duration-300 ${mainMarginClass}`}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
