import { useInitials } from '@/hooks/use-initials';
import { logout } from '@/routes/admin';
import { AdminSharedData } from '@/types/models/admin';
import { Form, router, usePage } from '@inertiajs/react';
import { LogOutIcon } from 'lucide-react';
import { IoSettings } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';

export function AdminSidebarHeader() {
    const page = usePage<AdminSharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(logout());
    };
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-2">
                <SidebarTrigger className="-ml-1" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="size-8 cursor-pointer overflow-hidden rounded-full">
                            {auth.admin.profile_picture_url != null && (
                                <AvatarImage
                                    src={auth.admin.profile_picture_url}
                                    alt={auth.admin.username}
                                />
                            )}
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(auth.admin.username)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>
                                Paramètre
                                <DropdownMenuShortcut>
                                    <IoSettings />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        {/* logout */}
                        <Form onClick={handleLogout}>
                            <DropdownMenuItem className="cursor-pointer">
                                Se déconnecter
                                <DropdownMenuShortcut>
                                    <LogOutIcon className="text-red-500" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
