// Components
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import DisplayFlashMsg from '@/lib/display-flash-msg';
import LogoutUserBtn from '@/lib/logout-user';
import { send } from '@/routes/auth/verification';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function VerifyEmail() {
    const [processing, setProcessing] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.post(
            send(),
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
        <AuthLayout
            title="Vérifier l'e-mail"
            description="Veuillez vérifier votre adresse courriel en cliquant sur le lien que nous venons de vous envoyer."
        >
            <Head title="Vérification des e-mails" />
            <DisplayFlashMsg />

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <Spinner />}
                    Renvoyer l'e-mail de vérification
                </Button>
            </form>
            <div className="flex justify-center">
                <LogoutUserBtn />
            </div>
        </AuthLayout>
    );
}
