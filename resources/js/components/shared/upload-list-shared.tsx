import { sizeFromFormatBytes } from '@/lib/utils';
import { SubmissionUpload } from '@/types/models/course';
import { Download, File } from 'lucide-react';

export default function UploadListShared({
    submissionUploads,
}: {
    submissionUploads: SubmissionUpload[];
}) {
    return (
        <div>
            <ul className="space-y-2">
                {submissionUploads.map((up) => (
                    <li
                        key={up.id}
                        className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3"
                    >
                        <div className="flex items-center gap-3">
                            <File className="h-5 w-5 text-gray-600" />
                            <div>
                                <div className="text-sm font-medium text-gray-800">
                                    {up.title ?? `Fichier.${up.file_ext}`}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {up.mime_type} •{' '}
                                    {sizeFromFormatBytes(up.file_size)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={up.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Download className="h-4 w-4" /> Télécharger
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
