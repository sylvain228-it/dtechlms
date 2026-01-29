import { cn } from '@/lib/utils';

export function Divider({
    className,
}: {
    className?: string;
    height?: string;
}) {
    return <div className={cn('my-5 h-0.5 w-full bg-gray-300', className)} />;
}
