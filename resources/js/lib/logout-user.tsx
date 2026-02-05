import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout as userLogout } from '@/routes/auth';
import { logout as instLogout } from '@/routes/institut/auth/index';
import { InstitutSharedData } from '@/types/models/institut';
import { router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LogoutUserBtn() {
    const [processing, setProcessing] = useState(false);
    const page = usePage<InstitutSharedData>();
    const { auth } = page.props;
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.post(
            auth.institut != null ? instLogout() : userLogout(),
            {},
            {
                onFinish: onFinish,
            },
        );
    }
    function onFinish() {
        setProcessing(false);
    }
    return (
        <form onSubmit={submit}>
            <div className="flex items-center gap-3">
                <Button
                    variant={'link'}
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1 text-red-600"
                >
                    {processing && <Spinner />}
                    <LogOut /> Se déconnecter
                </Button>
            </div>
        </form>
    );
}
