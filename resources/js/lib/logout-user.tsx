import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes/auth';
import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LogoutUserBtn() {
    const [processing, setProcessing] = useState(false);
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.post(
            logout(),
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
