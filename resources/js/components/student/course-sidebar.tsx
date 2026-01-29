import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Course, Module, Sequence } from '@/types/models/course';

export default function CourseSidebar({ course }: { course: Course }) {
    const modules = course.modules ?? [];

    const scrollToSequence = (sequenceId?: number) => {
        if (!sequenceId) return;
        const el = document.getElementById(`sequence-${sequenceId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[80vh] overflow-auto rounded-md border bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                    Table des matières
                </h3>

                {modules.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        Aucun module disponible.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {modules.map((m: Module) => (
                            <div key={m.id} className="rounded-sm">
                                <Collapsible>
                                    <div className="flex items-center justify-between">
                                        <CollapsibleTrigger asChild>
                                            <button className="w-full text-left text-sm font-medium text-gray-800">
                                                {m.title}{' '}
                                                <span className="ml-2 text-xs text-gray-400">
                                                    ({m.sequences?.length ?? 0})
                                                </span>
                                            </button>
                                        </CollapsibleTrigger>
                                    </div>

                                    <CollapsibleContent>
                                        <div className="mt-2 space-y-2 pl-2">
                                            {(m.sequences ?? []).map(
                                                (s: Sequence) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() =>
                                                            scrollToSequence(
                                                                s.id,
                                                            )
                                                        }
                                                        className="w-full truncate text-left text-sm text-gray-600 hover:text-indigo-600"
                                                    >
                                                        {s.title}
                                                    </button>
                                                ),
                                            )}
                                            {(m.sequences ?? []).length ===
                                                0 && (
                                                <div className="text-xs text-gray-400">
                                                    Aucune séquence.
                                                </div>
                                            )}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
