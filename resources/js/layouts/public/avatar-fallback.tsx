import { AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
type Propos = {
    first_name?: string;
    last_name?: string;
};
export default function AvatarFallbackShared({
    first_name,
    last_name,
}: Propos) {
    const getInitials = useInitials();
    return (
        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-cdcard dark:text-white">
            {getInitials(`${first_name ?? ''} ${last_name ?? ''}`)}
        </AvatarFallback>
    );
}
