import { Divider } from '@/components/divider';
import GetHtmlContent from '@/lib/get-html-content';
import { getResourceIcon } from '@/lib/simple-utility';
import { getSequenceTypeLabel, ResourceType } from '@/lib/type';
import { formatHours } from '@/lib/utils';
import { Sequence } from '@/types/models/course';
import { EntityResource, Resource } from '@/types/models/others';
import { Download } from 'lucide-react';

export default function SequenceDetailsShared({
    sequence,
}: {
    sequence: Sequence;
}) {
    const sequenceResources = (sequence.resources as EntityResource[]).map(
        (res) => res.resource as Resource,
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left: Sequence Details */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Sequence Overview Card */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 p-8">
                            <h2 className="text-2xl font-bold text-white">
                                {sequence.title}
                            </h2>
                            <p className="mt-2 text-blue-50">
                                {sequence.description}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg">
                        {/* Assessment info */}
                        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-md mb-2 font-semibold text-gray-800">
                                Évaluation
                            </h3>
                            <div className="text-sm text-gray-700">
                                {sequence.has_assessment ? (
                                    <div>
                                        Présence d'une évaluation (poids:{' '}
                                        {sequence.assessment_weight ?? 'N/A'})
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        Aucune évaluation prévue.
                                    </div>
                                )}
                            </div>
                        </div>
                        <Divider />
                        {sequence.syllabus ? (
                            <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Contenu
                                </h2>
                                <GetHtmlContent
                                    contentHtml={sequence.syllabus}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700">
                            Informations
                        </h3>

                        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="col-span-2 flex items-center justify-between">
                                <dt className="text-gray-500">Type</dt>
                                <dd className="font-medium text-gray-900">
                                    {getSequenceTypeLabel(
                                        sequence.sequence_type,
                                    )}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <dt className="text-gray-500">Durée estimée</dt>
                                <dd className="font-medium text-gray-900">
                                    {formatHours(sequence.estimated_hours)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    {/* Sequence Resources */}
                    <div className="sticky top-24 overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                        <div className="border-b border-gray-200 bg-gray-50 p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <svg
                                    className="h-5 w-5 text-purple-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M7 9a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M7.465 14.146a1 1 0 01.109.11l4.233 4.233a1 1 0 001.414-1.414l-4.233-4.234a1 1 0 00-.158-.168 6 6 0 10-1.365 1.073z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Ressources
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {sequenceResources.length > 0 ? (
                                    sequenceResources.map((resource) => (
                                        <a
                                            key={resource.id}
                                            href={resource.url as string}
                                            className="group flex transform cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-all duration-200 hover:translate-x-1 hover:border-purple-300 hover:bg-purple-50"
                                        >
                                            <div className="mt-1 flex-shrink-0">
                                                {getResourceIcon(
                                                    (resource.resource_type as ResourceType) ||
                                                        'document',
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-purple-600">
                                                    {resource.title}
                                                </p>
                                                {resource.file_size && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        📦 {resource.file_size}
                                                    </p>
                                                )}
                                            </div>
                                            <Download className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-purple-600" />
                                        </a>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-sm text-gray-500">
                                        Aucune ressource
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
