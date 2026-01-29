import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { InstitutProfileProps } from '@/types/models/institut';

export function InstitutInfo({
    institut,
    showEmail = false,
}: {
    institut: InstitutProfileProps;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {institut.logo_url != null && (
                    <AvatarImage src={institut.logo_url} alt={institut.name} />
                )}
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(institut.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{institut.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {institut.email}
                    </span>
                )}
            </div>
        </>
    );
}
