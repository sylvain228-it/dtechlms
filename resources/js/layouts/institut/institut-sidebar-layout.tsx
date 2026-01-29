import { InstitutContent } from '@/components/institut/institut-content';
import { InstitutShell } from '@/components/institut/institut-shell';
import { InstitutSidebar } from '@/components/institut/institut-sidebar';
import { InstitutSidebarHeader } from '@/components/institut/institut-sidebar-header';
import { FlashData, type BreadcrumbItem } from '@/types';
import { InstitutSharedData } from '@/types/models/institut';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoRemoveCircle } from 'react-icons/io5';

export default function InstitutSidebarLayout({
    children,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { flash } = usePage().props as unknown as { flash: FlashData };
    const page = usePage<InstitutSharedData>();
    const { auth } = page.props;
    const institut = auth.institut;
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'in_progress' | 'completed' | 'failed'
    >('idle');
    if (flash != undefined) {
        if (flash.success) {
            localStorage.removeItem('textHtmlContentState');
            localStorage.removeItem('textContentState');
            localStorage.removeItem('textEditContentState');
        }
        if (flash.success || flash.error) {
            window.setTimeout(function () {
                const flashMsg = document.getElementById(
                    `flash-${flash.success ? 's' : 'e'}msg`,
                );
                if (flashMsg) {
                    flashMsg.style.opacity = '0';
                    flashMsg.remove();
                    flashMsg.style.display = 'none';
                    flashMsg.style.transition = 'opacity 2s ease-out';
                }
            }, 3000);
        }
    }
    // useEffect for handleing upload_status from server session

    useEffect(() => {
        let pollInterval: NodeJS.Timeout | null = null;

        if (flash != undefined && flash.uploadStatus === 'start') {
            const checkUploadStatus = async () => {
                try {
                    const response = await fetch(`/api/upload-status/`);
                    const data = await response.json();

                    setUploadStatus(data.status);

                    if (
                        data.status === 'completed' ||
                        data.status === 'failed'
                    ) {
                        if (pollInterval) clearInterval(pollInterval);
                        // supprimer le status après affichage
                        setTimeout(() => {
                            setUploadStatus('idle');
                        }, 3000);
                        // delete status from server
                        await fetch(`/api/clear-upload-status/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': (
                                    document.querySelector(
                                        'meta[name="csrf-token"]',
                                    ) as HTMLMetaElement
                                ).content,
                            },
                        });
                    }
                } catch (error) {
                    console.error('Error checking upload status:', error);
                }
            };

            // Commencer à vérifier si l'upload a démarré
            checkUploadStatus(); // Vérifier une première fois immédiatement
            pollInterval = setInterval(checkUploadStatus, 1000);

            return () => {
                if (pollInterval) clearInterval(pollInterval);
            };
        }
    }, [flash]);
    return (
        <>
            <InstitutShell variant="sidebar">
                <InstitutSidebar institut={institut} />
                <InstitutContent
                    variant="sidebar"
                    className="overflow-x-hidden"
                >
                    {uploadStatus === 'in_progress' && (
                        <div className="fixed top-0 left-0 z-50 flex h-2 w-full animate-pulse bg-blue-600"></div>
                    )}
                    {uploadStatus === 'completed' && (
                        <div className="fixed top-20 right-4 z-50 flex gap-1 rounded bg-green-100 px-4 py-3 text-green-800">
                            <FaCheck /> Upload complété avec succès
                        </div>
                    )}
                    {uploadStatus === 'failed' && (
                        <div className="fixed top-20 right-4 z-50 flex gap-1 rounded bg-red-100 px-4 py-3 text-red-800">
                            <IoRemoveCircle /> Erreur lors de l'upload
                        </div>
                    )}
                    {flash.success && (
                        <div
                            id="flash-smsg"
                            className="fixed right-0 rounded bg-green-100 to-0% px-4 py-3 text-green-800 transition-opacity duration-300"
                        >
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div
                            id="flash-emsg"
                            className="fixed right-0 rounded bg-red-100 to-0% px-4 py-3 text-red-800 transition-opacity duration-300"
                        >
                            {flash.error}
                        </div>
                    )}
                    <InstitutSidebarHeader />

                    <div className="p-3">{children}</div>
                </InstitutContent>
            </InstitutShell>
        </>
    );
}
