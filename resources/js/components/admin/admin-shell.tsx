import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AdminShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AdminShell({ children, variant = 'header' }: AdminShellProps) {
    const isOpen = usePage<AdminSharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
