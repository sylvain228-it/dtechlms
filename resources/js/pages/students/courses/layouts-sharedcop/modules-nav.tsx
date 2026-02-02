import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { reading } from '@/routes/students/courses';
import { Course, Module, Sequence } from '@/types/models/course';
import { Link } from '@inertiajs/react';
type Props = {
    modules: Module[];
    course: Course;
    wPx?: number;
    showModulesNav: boolean;
    sequenceId?: number;
    moduleId?: number;
};
export default function CourseModulesNav({
    modules,
    course,
    showModulesNav,
    sequenceId,
    moduleId,
}: Props) {
    return (
        <div
            className={`fixed top-[56px] left-0 z-50 h-full overflow-y-auto border-t border-r bg-white p-6 text-black shadow-sm transition-all duration-300 ease-in-out ${
                showModulesNav
                    ? `w-[290px] opacity-100 sm:w-[350px]`
                    : 'w-0 overflow-hidden opacity-0'
            }`}
        >
            <div className="mb-4">
                <Accordion
                    type="single"
                    collapsible
                    defaultValue={moduleId ? `module-${moduleId}` : undefined}
                >
                    {modules.map((module) => (
                        <AccordionItem
                            key={module.id}
                            value={`module-${module.id}`}
                        >
                            <AccordionTrigger>
                                <div>
                                    <h2 className="text-md mb-1 font-bold text-gray-600">
                                        Module {module.order}
                                    </h2>
                                    {module.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="mt-2 space-y-2">
                                    {(module.sequences as Sequence[]).map(
                                        (sequence) => (
                                            <li
                                                key={sequence.id}
                                                className={`p-2 text-sm text-gray-600 hover:text-blue-600 ${sequenceId === sequence.id ? 'border-cblue bg-cblue/5 border-l-2 font-semibold' : ''}`}
                                            >
                                                <Link
                                                    href={reading([
                                                        course.slug,
                                                        sequence.slug,
                                                    ])}
                                                >
                                                    <span>
                                                        {sequence.title}
                                                    </span>
                                                </Link>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
