import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Module, Sequence } from '@/types/models/course';
export default function InstitutCourseNavItem({
    modules,
    onModuleClick,
    onSequenceClick,
}: {
    modules: Module[];
    onModuleClick: (module: Module) => void;
    onSequenceClick: (sequence: Sequence) => void;
}) {
    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                {modules.map((module, index) => (
                    <AccordionItem key={index} value={`item-${module.order}`}>
                        <AccordionTrigger>
                            <h3 onClick={() => onModuleClick(module)}>
                                {module.title} (
                                {(module.sequences || []).length})
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            {/* liste des leçons */}
                            <ul className="list-disc pl-5">
                                {((module.sequences || []) as Sequence[]).map(
                                    (seq) => (
                                        <li
                                            key={seq.id}
                                            onClick={() => onSequenceClick(seq)}
                                            className="mb-2 cursor-pointer hover:underline"
                                        >
                                            {seq.title}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
