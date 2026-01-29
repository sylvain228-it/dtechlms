import DefualtProfileSvg from '@/components/profile-svg';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { getAccountRoleLabel } from '@/lib/type';
import { User } from '@/types';
import { MdVisibility } from 'react-icons/md';
export default function InstitutUserProfile({
    user,
    title,
}: {
    user: User;
    title?: string;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="btn-primary flex items-center gap-2"
                >
                    {title ?? "Voir l'utilisateur"}
                    <MdVisibility />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                <DialogHeader className="w-full">
                    <DialogTitle className="w-full">
                        Profile Utilisateur
                    </DialogTitle>
                    <DialogDescription className="w-full">
                        Informations de l'utilisateur
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        {user.profile_picture_url ? (
                            <Avatar>
                                <img
                                    src={user.profile_picture_url}
                                    className="h-[50px] w-[50px] object-center"
                                    alt=""
                                />
                            </Avatar>
                        ) : (
                            <DefualtProfileSvg />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">
                                Téléphone
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                                {user.phone_number || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">
                                Rôle
                            </h3>
                            <p className="mt-1 text-sm text-gray-900">
                                {getAccountRoleLabel(user.account_role)}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
