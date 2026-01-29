import { SidebarProvider } from '@/components/ui/sidebar';
import { InstitutSharedData } from '@/types/models/institut';
import { usePage } from '@inertiajs/react';

interface InstitutShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function InstitutShell({
    children,
    variant = 'header',
}: InstitutShellProps) {
    const isOpen = usePage<InstitutSharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
