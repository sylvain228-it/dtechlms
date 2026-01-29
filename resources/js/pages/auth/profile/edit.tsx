import { InputField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/auth/profile';
import { SharedData, User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '../user-layout';

export default function UserEditProfile() {
    const page = usePage<SharedData>();
    const { auth } = page.props as unknown as { auth: { user: User } };
    const user = auth.user as User;
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;
    const { data, setData, reset } = useForm({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        phone_number: user?.phone_number ?? '',
    });

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        await router.put(update(), data, {
            onFinish: onFinish,
        });
    }
    function onFinish() {
        setProcessing(false);
        reset();
    }
    const isValid =
        data.first_name != '' &&
        data.last_name != '' &&
        data.phone_number != '';
    return (
        <UserLayout title="Mise à jour profile">
            <div className="mx-auto max-w-3xl p-4">
                <Head title="Modifier le profil" />
                <h1 className="mb-4 text-2xl font-semibold">
                    Modifier le profil
                </h1>
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-lg bg-white p-6 shadow"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InputField
                            label="Prénom"
                            value={data.first_name}
                            onChange={(v) => setData('first_name', v)}
                            error={errors.first_name}
                        />

                        <InputField
                            label="Nom"
                            value={data.last_name}
                            onChange={(v) => setData('last_name', v)}
                            error={errors.last_name}
                        />

                        <InputField
                            label="Téléphone"
                            value={data.phone_number}
                            onChange={(v) => setData('phone_number', v)}
                            error={errors.phone_number}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        {/* <CheckboxField
                            label="Activer la double authentification"
                            checked={data.two_factor_enabled}
                            onChange={(val) =>
                                setData('two_factor_enabled', val)
                            }
                        /> */}

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
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
