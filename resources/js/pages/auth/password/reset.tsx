import HeadingSmall from '@/components/heading-small';
import { InputField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import DisplayFlashMsg from '@/lib/display-flash-msg';
import { update } from '@/routes/auth/password';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
type ResetProps = {
    token: string | null;
    email: string | null;
};
export default function ResetPassword() {
    const [processing, setProcessing] = useState(false);
    const { token, email } = usePage().props as unknown as ResetProps;
    const { errors } = usePage().props;
    const { data, setData, reset } = useForm({
        email: email ?? '',
        token: token ?? '',
        password: '',
        password_confirmation: '',
    });

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.post(update(), data, {
            onFinish: onFinish,
        });
    }
    function onFinish() {
        setProcessing(false);
        reset();
    }
    const isValid =
        data.email != '' &&
        data.token != '' &&
        data.password != '' &&
        data.password_confirmation != '' &&
        data.password == data.password_confirmation;

    const [isObscurePass, setIsObscurePass] = useState(true);
    function handlePassText(e: React.MouseEvent) {
        e.preventDefault();
        setIsObscurePass(!isObscurePass);
    }

    const bannerImg = '/assets/learn_bg.png';
    const bgStyle = {
        background: `url(${bannerImg}) no-repeat center/cover`,
    };
    return (
        <div
            className="flex min-h-screen items-center justify-center"
            style={bgStyle}
        >
            <div className="w-full max-w-lg bg-white p-8 shadow-md sm:rounded-2xl dark:bg-gray-800">
                <HeadingSmall title="Réinitialiser le mot de passe" />

                <DisplayFlashMsg />
                <form
                    onSubmit={submit}
                    className="mt-3 space-y-6 rounded-lg p-6 shadow"
                >
                    <div className="grid gap-2">
                        <Label>{data.email}</Label>
                    </div>

                    <div className="grid gap-2">
                        <InputField
                            label="Mot de passe"
                            type={isObscurePass ? 'password' : 'text'}
                            value={data.password}
                            onChange={(val) => setData('password', val)}
                            placeholder="Nouveau mot de passe "
                            error={errors.password}
                        />
                    </div>

                    <div className="grid gap-2">
                        <InputField
                            label="Confirmation"
                            type={isObscurePass ? 'password' : 'text'}
                            value={data.password_confirmation}
                            onChange={(val) =>
                                setData('password_confirmation', val)
                            }
                            placeholder="Confirmer le mot de passe "
                            error={errors.password_confirmation}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="">Afficher les mots de passes</Label>
                        <button className="px-3" onClick={handlePassText}>
                            {isObscurePass ? (
                                <MdVisibility size={20} />
                            ) : (
                                <MdVisibilityOff size={20} />
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={processing || !isValid}
                            className="btn-primary flex items-center gap-1"
                        >
                            {processing && <Spinner />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
