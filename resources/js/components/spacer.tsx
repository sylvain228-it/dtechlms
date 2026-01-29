import { cn } from '@/lib/utils';

export function Spacer({
    className,
    height = '12',
}: {
    className?: string;
    height?: string;
}) {
    return <div className={cn('w-full', className, `h-${height}`)} />;
}
