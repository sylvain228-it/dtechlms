import { FileText, Image, Play } from 'lucide-react';
import { ResourceType } from './type';

export const getCoursStatusLabel = (status: string) => {
    switch (status) {
        case 'draft':
            return 'Brouillon';
        case 'review':
            return 'En révision';
        case 'published':
            return 'Publié';
        case 'archived':
            return 'Archivé';
        default:
            return 'Inconnu';
    }
};

// build cours status text (bg color) utility function
export const getCoursStatusBgColor = (status: string) => {
    switch (status) {
        case 'draft':
            return 'bg-gray-200 text-gray-800';
        case 'review':
            return 'bg-yellow-200 text-yellow-800';
        case 'published':
            return 'bg-green-200 text-green-800';
        case 'archived':
            return 'bg-red-200 text-red-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
};

export function BuildCoursStatusBadge({ status }: { status: string }) {
    const label = getCoursStatusLabel(status);
    const bgColor = getCoursStatusBgColor(status);
    return (
        <span
            className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${bgColor}`}
        >
            {label}
        </span>
    );
}

export const getResourceIcon = (type: ResourceType) => {
    switch (type) {
        case 'video':
            return <Play className="h-5 w-5 text-red-500" />;
        case 'image':
            return <Image className="h-5 w-5 text-blue-500" />;
        case 'document':
            return <FileText className="h-5 w-5 text-blue-600" />;
        default:
            return <FileText className="h-5 w-5 text-gray-500" />;
    }
};
