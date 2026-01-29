import { cn } from '@/lib/utils';

export default function InstitutLogo({
    url,
    className,
}: {
    url: string;
    className?: string;
}) {
    return (
        <>
            <img
                src={url}
                className={cn('max-h-[48px] object-contain', className)}
                alt=""
            />
        </>
    );
}
