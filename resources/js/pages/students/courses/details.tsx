import DefualtProfileSvg from '@/components/profile-svg';
import { TagsInputBadge } from '@/components/shared/tags-input';
import StudentLayouts from '@/layouts/student/student-layouts';
import {
    getCourseLevelLabel,
    getLanguageLabel,
    getModalityTypeLabel,
    Language,
} from '@/lib/type';
import { content } from '@/routes/students/courses';
import { Course, CourseActivity, Module } from '@/types/models/course';
import { Teacher } from '@/types/models/institut';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    ListCollapseIcon,
    Star,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import StudentCalendar from '../calendars/calendar';
type Props = {
    course: Course;
    modules: Module[];
    activities: CourseActivity[];
};

export default function StudentCourseDetails() {
    const { course, modules, activities } = usePage().props as unknown as Props;

    const bannerStyle = {
        background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%), url(${course.cover_url}) no-repeat center/cover`,
        backgroundAttachment: 'fixed',
    };

    // Calcul des statistiques
    const totalModules = modules?.length || 0;
    const totalHours = course.total_hours || 0;
    const isFreeCourse = course.is_free === 1;
    const courseName = course.title || 'Cours sans titre';
    const courseDescription = course.description || '';
    const teacher = course.teacher as Teacher;
    const [showCourseDetails, setShowCourseDetails] = useState<boolean>(false);
    const [showCalendar, setShowCalendar] = useState(true);
    return (
        <StudentLayouts title="">
            <Head title={`${courseName} - détails`} />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Banner */}
                <div
                    className="relative h-[280px] w-full overflow-hidden bg-cover bg-center"
                    style={bannerStyle}
                >
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>

                    {/* Content */}
                    <div className="relative flex h-full items-end p-3 sm:p-6">
                        <div className="max-w-4xl">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                                    {getCourseLevelLabel(course.level)}
                                </span>
                                {isFreeCourse && (
                                    <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                        Gratuit
                                    </span>
                                )}
                            </div>
                            <h1 className="mb-3 text-4xl font-bold text-white drop-shadow-lg">
                                {courseName}
                            </h1>
                            <p className="max-w-2xl text-lg text-gray-100 drop-shadow">
                                Développez vos compétences avec ce cours complet
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="sticky top-[56px] z-30 border-b border-gray-200 bg-white shadow-sm">
                    <nav className="mx-auto flex gap-3 overflow-x-auto p-3 px-2 sm:max-w-6xl sm:p-6">
                        <button
                            onClick={() => {
                                if (!showCalendar) {
                                    setShowCalendar(true);
                                    setShowCourseDetails(false);
                                }
                            }}
                            className={`flex items-center gap-2 text-sm whitespace-nowrap sm:text-xl ${showCalendar ? 'border-b-2 font-semibold text-blue-600' : 'dark:text-gray-500'} border-blue-500 px-1 py-4`}
                        >
                            <Calendar size={16} />
                            Activités
                        </button>
                        <button
                            onClick={() => {
                                if (!showCourseDetails) {
                                    setShowCourseDetails(true);
                                    setShowCalendar(false);
                                }
                            }}
                            className={`flex items-center gap-2 text-sm whitespace-nowrap sm:text-xl ${showCourseDetails ? 'border-b-2 font-semibold text-blue-600' : 'dark:text-gray-500'} border-blue-500 px-1 py-4`}
                        >
                            <BookOpen size={16} />
                            Détails
                        </button>
                        <Link
                            href={content(course.slug)}
                            className="flex items-center gap-2 border-b-2 border-transparent px-1 py-4 text-sm whitespace-nowrap text-gray-600 transition hover:border-gray-300 hover:text-gray-900 sm:text-xl"
                        >
                            <ListCollapseIcon size={16} />
                            Contenu
                        </Link>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-6xl px-2 py-12 sm:px-8">
                    {showCourseDetails && (
                        <div className="grid grid-cols-1 gap-3 sm:p-6 lg:grid-cols-3">
                            {/* Left Column - Main Content */}
                            <div className="space-y-8 lg:col-span-2">
                                {/* Course Info Cards */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-6">
                                        <div className="mb-2 flex items-center gap-3">
                                            <BookOpen
                                                className="text-blue-600"
                                                size={24}
                                            />
                                            <span className="text-sm font-semibold text-gray-600">
                                                Modules
                                            </span>
                                        </div>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {totalModules}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-600">
                                            Sections à explorer
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-6">
                                        <div className="mb-2 flex items-center gap-3">
                                            <Clock
                                                className="text-purple-600"
                                                size={24}
                                            />
                                            <span className="text-sm font-semibold text-gray-600">
                                                Durée
                                            </span>
                                        </div>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {totalHours}h
                                        </p>
                                        <p className="mt-1 text-xs text-gray-600">
                                            Temps estimé
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-6">
                                        <div className="mb-2 flex items-center gap-3">
                                            <Star
                                                className="text-green-600"
                                                size={24}
                                            />
                                            <span className="text-sm font-semibold text-gray-600">
                                                Niveau
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-green-600">
                                            {getCourseLevelLabel(course.level)}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-600">
                                            Difficulté
                                        </p>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                        <BookOpen
                                            size={24}
                                            className="text-blue-600"
                                        />
                                        À propos du cours
                                    </h2>
                                    <div className="prose prose-sm max-w-none leading-relaxed text-gray-700">
                                        {courseDescription ? (
                                            <p>{courseDescription}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                Pas de description disponible
                                                pour ce cours.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Learning Outcomes Section */}
                                {course.learning_outcomes && (
                                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
                                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                            <CheckCircle
                                                size={24}
                                                className="text-green-600"
                                            />
                                            Ce que vous apprendrez
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {typeof course.learning_outcomes ===
                                            'string'
                                                ? JSON.parse(
                                                      course.learning_outcomes,
                                                  ).map(
                                                      (
                                                          outcome: string,
                                                          idx: number,
                                                      ) => (
                                                          <div
                                                              key={idx}
                                                              className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
                                                          >
                                                              <CheckCircle
                                                                  size={20}
                                                                  className="mt-1 flex-shrink-0 text-green-600"
                                                              />
                                                              <span className="text-gray-800">
                                                                  {outcome}
                                                              </span>
                                                          </div>
                                                      ),
                                                  )
                                                : null}
                                        </div>
                                    </div>
                                )}

                                {/* Modules Section */}
                                {modules && modules.length > 0 && (
                                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
                                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                            <BookOpen
                                                size={24}
                                                className="text-blue-600"
                                            />
                                            Contenu du cours ({totalModules}{' '}
                                            modules)
                                        </h2>
                                        <div className="space-y-3">
                                            {modules.map((module, index) => (
                                                <div
                                                    key={module.id}
                                                    className="rounded-lg border border-gray-200 p-5 transition-all hover:border-blue-300 hover:shadow-md"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                                                            {index + 1}
                                                        </div>
                                                        <h3 className="text-md mb-1 font-semibold text-gray-900 sm:text-lg">
                                                            {module.title}
                                                        </h3>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        {module.description && (
                                                            <p className="line-clamp-2 text-sm text-gray-600">
                                                                {
                                                                    module.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                                            {module.estimated_hours && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    {
                                                                        module.estimated_hours
                                                                    }
                                                                    h
                                                                </span>
                                                            )}
                                                            {module.is_mandatory && (
                                                                <span className="inline-block rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                                                                    Obligatoire
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prerequisites Section */}

                                {course.prerequisites && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-6">
                                        <h3 className="mb-3 text-xl font-bold text-black">
                                            Pré-requis
                                        </h3>
                                        <div className="flex items-start gap-4">
                                            <AlertCircle
                                                className="mt-1 flex-shrink-0 text-amber-600"
                                                size={24}
                                            />
                                            <TagsInputBadge
                                                tags={
                                                    JSON.parse(
                                                        course.prerequisites,
                                                    ) ?? []
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Teacher Info Section */}
                                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                        <Users
                                            size={24}
                                            className="text-blue-600"
                                        />
                                        À propos de l'enseignant
                                    </h2>
                                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                                        {teacher.profile_picture_url ? (
                                            <img
                                                src={
                                                    teacher.profile_picture_url ??
                                                    ''
                                                }
                                                alt={teacher.first_name}
                                                className="h-16 w-16 rounded-full"
                                            />
                                        ) : (
                                            <DefualtProfileSvg
                                                width={20}
                                                height={20}
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {teacher.first_name}{' '}
                                                {teacher.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {teacher.bio ||
                                                    'Pas de biographie disponible.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Course Info Card */}
                                <div className="sticky top-24 space-y-6 rounded-lg border border-gray-200 bg-white p-3 shadow-md sm:p-6">
                                    {/* Info Items */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                                Langue
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {getLanguageLabel(
                                                    course.language as Language,
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                                Modalité
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {getModalityTypeLabel(
                                                    course.modality,
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                                Type de cours
                                            </p>
                                            <p className="font-semibold text-gray-900 capitalize">
                                                {course.course_type ||
                                                    'Professionnel'}
                                            </p>
                                        </div>

                                        {course.is_certifying === 1 && (
                                            <div>
                                                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                                    Certification
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle
                                                        size={18}
                                                        className="text-green-600"
                                                    />
                                                    <p className="font-semibold text-green-600">
                                                        Certificat délivré
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200"></div>

                                    {/* Stats */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="flex items-center gap-2 text-gray-600">
                                                <Users size={18} />
                                                Inscrits
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {course.nb_of_enrollments || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* events */}
                {showCalendar && (
                    <div className="mx-auto max-w-6xl px-2 sm:px-8">
                        <StudentCalendar activities={activities} />
                    </div>
                )}
            </div>
        </StudentLayouts>
    );
}
