import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type Admin } from '@/types';

export function AdminInfo({
    admin,
    showEmail = false,
}: {
    admin: Admin;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {admin.profile_picture_url != null && (
                    <AvatarImage
                        src={admin.profile_picture_url}
                        alt={admin.username}
                    />
                )}
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(admin.username)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{admin.username}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {admin.email}
                    </span>
                )}
            </div>
        </>
    );
}
