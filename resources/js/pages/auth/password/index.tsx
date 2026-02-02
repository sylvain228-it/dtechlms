import { InputField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import DisplayFlashMsg from '@/lib/display-flash-msg';
import { login } from '@/routes/auth';
import { email } from '@/routes/auth/password';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PasswordRequest() {
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;
    const { data, setData, reset } = useForm({
        login: '',
    });

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.post(email(), data, {
            onFinish: onFinish,
        });
    }
    function onFinish() {
        setProcessing(false);
        reset();
    }
    const isValid = data.login != '';

    const bannerImg = '/assets/learn_bg.png';
    const bgStyle = {
        background: `url(${bannerImg}) no-repeat center/cover`,
    };
    return (
        <div
            className="flex min-h-screen items-center justify-center"
            style={bgStyle}
        >
            <div className="w-full max-w-md bg-white p-8 shadow-md sm:rounded-2xl dark:bg-gray-800">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Réinitialiser votre mot de passe
                </h2>

                <DisplayFlashMsg />
                <form onSubmit={submit} className="space-y-5">
                    <InputField
                        value={data.login}
                        onChange={(val) => setData('login', val)}
                        label="Identifiant"
                        placeholder="Adresse email, numéro ou identifiant"
                        required
                        error={errors.email}
                    />

                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={processing || !isValid}
                            className="btn-primary flex items-center gap-1"
                        >
                            {processing && <Spinner />}
                            Envoyer le lien de réinitialisation
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href={login()}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
