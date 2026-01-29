import { cn } from '@/lib/utils';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <>
            <img
                src="/assets/logo/logo_rect.png"
                className={cn('h-[56px] object-contain', className)}
                alt=""
            />
        </>
    );
}
