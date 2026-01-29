import { Avatar, AvatarImage } from '@/components/ui/avatar';
import AvatarFallbackShared from '@/layouts/public/avatar-fallback';
import { User } from '@/types';

export function ProfileItemsTrigger({ user }: { user: User | undefined }) {
    return (
        <Avatar className="size-8 overflow-hidden rounded-full">
            <AvatarImage
                src={user?.profile_picture_url ?? ''}
                alt={user?.first_name ?? ''}
            />
            <AvatarFallbackShared
                first_name={user?.first_name ?? ''}
                last_name={user?.last_name ?? ''}
            />
        </Avatar>
    );
}
