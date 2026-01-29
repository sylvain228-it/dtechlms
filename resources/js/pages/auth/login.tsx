import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import DisplayFlashMsg from '@/lib/display-flash-msg';
import { register } from '@/routes/auth';
import { store } from '@/routes/auth/login';
import { request } from '@/routes/auth/password';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { errors } = usePage().props;
    const [isObscurePass, setIsObscurePass] = useState(true);
    function handlePassText(e: React.MouseEvent) {
        e.preventDefault();
        setIsObscurePass(!isObscurePass);
    }

    const [processing, setProcessing] = useState(false);
    const [values, setValues] = useState({
        login: null,
        password: null,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues((values) => ({
            ...values,
            [e.target.id]: e.target.value,
        }));
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setProcessing(true);
        async function submit() {
            router.post(store(), values, {
                onFinish: () => setProcessing(false),
            });
        }
        submit();
    }
    return (
        <AuthLayout
            title="Connectez-vous à votre compte"
            description="Entrez votre email et votre mot de passe ci-dessous pour vous connecter"
        >
            <Head title="Se connecter" />

            <DisplayFlashMsg />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
                method="POST"
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="login">Identifiant</Label>
                        <Input
                            id="login"
                            type="text"
                            name="login"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            placeholder="E-mail, téléphone ou indentifiant"
                            className="form-input"
                            onChange={handleChange}
                        />

                        <InputError message={errors.login} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Mot de passe</Label>

                            <TextLink
                                href={request()}
                                className="ml-auto text-sm"
                                tabIndex={5}
                            >
                                Mot de passe oublié ?
                            </TextLink>
                        </div>
                        <InputGroup className="form-input !focus:ring-0 !px-0">
                            <InputGroupInput
                                id="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                className="form-input"
                                type={isObscurePass ? 'password' : 'text'}
                                onChange={handleChange}
                            />
                            <InputGroupAddon align={'inline-end'}>
                                <button
                                    className="px-3"
                                    onClick={handlePassText}
                                >
                                    {isObscurePass ? (
                                        <MdVisibility size={20} />
                                    ) : (
                                        <MdVisibilityOff size={20} />
                                    )}
                                </button>
                            </InputGroupAddon>
                        </InputGroup>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember">Souviens-toi de moi</Label>
                    </div>

                    <Button
                        type="submit"
                        className="btn-primary mt-4 w-full !py-6"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner />}
                        Se connecter
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Vous n'avez pas de compte ?{' '}
                    <TextLink
                        className="text-app-blue"
                        href={register()}
                        tabIndex={5}
                    >
                        S'inscrire
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
