import HeadingSmall from '@/components/heading-small';
import { InputField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import DisplayFlashMsg from '@/lib/display-flash-msg';
import { updateUserPassword } from '@/routes/auth/settings';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function UserPassord() {
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;
    const { data, setData, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.put(updateUserPassword(), data, {
            onFinish: onFinish,
        });
    }
    function onFinish() {
        setProcessing(false);
        reset();
    }
    const isValid =
        data.current_password != '' &&
        data.password != '' &&
        data.password_confirmation != '' &&
        data.password == data.password_confirmation;

    const [isObscurePass, setIsObscurePass] = useState(true);
    function handlePassText(e: React.MouseEvent) {
        e.preventDefault();
        setIsObscurePass(!isObscurePass);
    }
    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Mettre à jour le mot de passe"
                description="Pour garantir la sécurité de votre compte, assurez-vous d'utiliser un mot de passe long et aléatoire."
            />

            <DisplayFlashMsg />

            <form
                onSubmit={submit}
                className="space-y-6 rounded-lg bg-white p-6 shadow"
            >
                <div className="grid gap-2">
                    <InputField
                        label="Ancien mot de passe"
                        type={isObscurePass ? 'password' : 'text'}
                        value={data.current_password}
                        onChange={(val) => setData('current_password', val)}
                        placeholder="Mot de passe actuel"
                        error={errors.current_password}
                    />
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
    );
}
