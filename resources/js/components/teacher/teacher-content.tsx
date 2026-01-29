import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface TeacherContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function TeacherContent({
    variant = 'header',
    children,
    ...props
}: TeacherContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main
            className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4"
            {...props}
        >
            {children}
        </main>
    );
}
