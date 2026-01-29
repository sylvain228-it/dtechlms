import { Course, Module, Sequence } from '@/types/models/course';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import CourseLayout from './shared/course-layout';
import InstitutCourseNavItem from './shared/course-nav-item';
import ModuleDetailsShared from './shared/module-details';
import SequenceDetailsShared from './shared/sequence-detail';

export default function InstitutCourseContent() {
    const { course } = usePage().props as unknown as { course: Course };
    const modules = useMemo(
        () => (course.modules || []) as Module[],
        [course.modules],
    );

    const [showSequenceDetails, setShowSequenceDetails] =
        useState<boolean>(false);

    // const selectedModule = useMemo(() => {
    //     return modules.find((m) => m.id === moduleSelectedId) || null;
    // }, [moduleSelectedId, modules]);

    const [selectedModule, setSelectedModule] = useState<Module | null>(
        modules.length > 0 ? modules[0] : null,
    );
    const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(
        null,
    );

    function handleModuleClick(module: Module) {
        setSelectedModule(module);
        setShowSequenceDetails(false);
    }
    function handleSequenceClick(sequence: Sequence) {
        setSelectedSequence(sequence);
        setShowSequenceDetails(true);
    }
    return (
        <CourseLayout title={'Contenu du cours'}>
            <div className="mx-auto my-5 px-5 md:px-20">
                <Head title={course.title} />
                {/* petite détails du cours */}
                <div className="my-5 border-b">
                    <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                        {course.title}
                    </h2>
                    <p className="mb-4 text-gray-600">{course.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    <aside className="h-full border-r md:col-span-3 md:pr-10">
                        <InstitutCourseNavItem
                            modules={modules}
                            onModuleClick={(m) => handleModuleClick(m)}
                            onSequenceClick={(seq) => handleSequenceClick(seq)}
                        />
                    </aside>
                    <main className="md:col-span-9">
                        {/* détails selected module */}
                        {selectedModule && !showSequenceDetails ? (
                            <ModuleDetailsShared module={selectedModule} />
                        ) : (
                            <div>
                                {selectedSequence && showSequenceDetails ? (
                                    <SequenceDetailsShared
                                        sequence={selectedSequence}
                                    />
                                ) : (
                                    <div className="text-gray-600">
                                        Sélectionnez un module pour voir les
                                        détails.
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </CourseLayout>
    );
}
