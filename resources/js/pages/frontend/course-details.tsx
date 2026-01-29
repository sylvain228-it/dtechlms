import { Divider } from '@/components/divider';
import SimilarCourseCard from '@/components/public/similar-course-card';
import { Spacer } from '@/components/spacer';
import { Avatar } from '@/components/ui/avatar';
import { PublicLayout } from '@/layouts/public/public-layout';
import GetHtmlContent from '@/lib/get-html-content';
import SubStrText from '@/lib/substr';
import { cn } from '@/lib/utils';
import { Course } from '@/types';
import { Button } from '@headlessui/react';
import { usePage } from '@inertiajs/react';

export default function CourseDetailstPage() {
    const { course } = usePage().props as unknown as { course: Course };
    const { courses } = usePage().props as unknown as { courses: Course[] };
    console.log(course);
    const bannerImg = '/assets/banner/cours-detail-banner.png';
    return (
        <PublicLayout>
            <div>
                <div className="w-full bg-app-gray p-6">
                    <div className="container grid lg:max-h-[400px] lg:grid-cols-2">
                        <div>
                            {/* partner logo */}
                            {course.partner && (
                                <img
                                    src={course.institut.logo_url}
                                    alt={course.institut.name}
                                    className="mb-4 h-10 w-auto object-contain"
                                />
                            )}
                            <h3 className="mb-4 text-2xl font-bold capitalize">
                                {course.title}
                            </h3>
                            <p className="mb-3 font-normal">
                                <SubStrText
                                    text={course.description}
                                    start={0}
                                    end={200}
                                />
                            </p>
                            <div className="mb-3 flex items-center gap-3">
                                <Avatar>
                                    <img src="/assets/proff.jpg" alt="" />
                                </Avatar>
                                <h3>
                                    Instructeur :{' '}
                                    <a href="#" className="font-bold underline">
                                        Sylvain ANANI
                                    </a>
                                    <b className="ml-2">+10 plus </b>
                                </h3>
                            </div>
                            <div className="mt-7">
                                <Button
                                    className={cn(
                                        'btn-primary text-2xl font-bold transition-all duration-300 hover:scale-95',
                                    )}
                                >
                                    S'incrire Maintenant
                                </Button>
                            </div>
                        </div>
                        <div>
                            <img
                                src={bannerImg}
                                className="hidden max-h-[400px] w-full object-cover object-right-top opacity-15 lg:block"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* content */}
                        <div className="p-6 md:col-span-8">
                            <GetHtmlContent contentHtml={course.syllabus} />

                            <Spacer />
                            <Divider />
                            <Spacer />
                            <div>
                                <h2 className="mb-4 text-3xl font-bold">
                                    Les cours les plus en vues{' '}
                                </h2>
                                <div className="mt-4 grid gap-3">
                                    {courses.map((course: Course) => (
                                        <SimilarCourseCard
                                            key={course.id}
                                            course={course}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* rigth aside */}
                        <div className="border-l p-6 md:col-span-4">
                            <img
                                src={course.cover_url}
                                alt={course.title}
                                className="mb-4 w-full rounded object-cover"
                            />
                            <h2 className="mb-2 text-2xl font-semibold">
                                {course.title}
                            </h2>
                            <p className="mb-4 text-gray-700">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
