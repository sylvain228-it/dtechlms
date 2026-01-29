import GetHtmlContent from '@/lib/get-html-content';
import { getModalityTypeLabel, getModuleTypeLabel } from '@/lib/type';
import { formatMinutes } from '@/lib/utils';
import { Module } from '@/types/models/course';

export default function ModuleDetailsShared({ module }: { module: Module }) {
    const sequencesCount = module.sequences ? module.sequences.length : 0;
    const totalEstimatedHours = module.sequences?.reduce(
        (acc, s) => acc + (s.estimated_hours ?? 0),
        0,
    );
    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                {module.title}
            </h3>
            <p className="text-gray-600">{module.description}</p>
            <div className="mt-6">
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                        Type: {getModuleTypeLabel(module.module_type)}
                    </span>
                    <span className="inline-flex items-center rounded bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                        Mode: {getModalityTypeLabel(module.modality)}
                    </span>
                    <span className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                        Version: {module.version ?? 1}
                    </span>
                    {module.is_visible && (
                        <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Visible
                        </span>
                    )}
                    <span className="inline-flex items-center rounded bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                        Ordre: {module.order}
                    </span>
                </div>
            </div>
            <div className="my-6 flex items-center justify-between border-t pt-4">
                <h2 className="text-lg font-medium text-gray-900">
                    Séquences ({sequencesCount})
                </h2>
                <div className="text-sm text-gray-500">
                    Durée totale:{' '}
                    {formatMinutes(
                        (module.estimated_hours ?? totalEstimatedHours ?? 0) *
                            60,
                    )}
                </div>
            </div>
            {module.syllabus && (
                <div className="mt-6 border-t">
                    <h3 className="my-5 text-lg font-semibold text-gray-800">
                        Contenu du module
                    </h3>
                    <GetHtmlContent contentHtml={module.syllabus} />
                </div>
            )}
        </div>
    );
}
