import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface InstitutContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function InstitutContent({
    variant = 'header',
    children,
    ...props
}: InstitutContentProps) {
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
