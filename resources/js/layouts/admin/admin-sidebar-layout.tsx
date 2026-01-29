import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { FlashData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AdminSidebarLayout({
    children,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { flash } = usePage().props as unknown as { flash: FlashData };
    if (flash != undefined && flash.success != undefined) {
        window.setTimeout(function () {
            const flashMsg = document.getElementById('flash-msg');
            if (flashMsg) {
                flashMsg.style.opacity = '0';
                flashMsg.remove();
                flashMsg.style.display = 'none';
                flashMsg.style.transition = 'opacity 2s ease-out';
            }
        }, 3000);
    }
    return (
        <>
            <AdminShell variant="sidebar">
                <AdminSidebar />
                <AdminContent variant="sidebar" className="overflow-x-hidden">
                    <AdminSidebarHeader />
                    {flash.success && (
                        <div
                            id="flash-msg"
                            className="fixed right-0 rounded bg-green-100 to-0% px-4 py-3 text-green-800 transition-opacity duration-300"
                        >
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div
                            id="flash-msg"
                            className="fixed right-0 rounded bg-green-100 to-0% px-4 py-3 text-green-800 transition-opacity duration-300"
                        >
                            {flash.error}
                        </div>
                    )}
                    <div className="p-3">{children}</div>
                </AdminContent>
            </AdminShell>
        </>
    );
}
