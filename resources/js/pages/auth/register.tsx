import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes/auth';
import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function Register() {
    const [isObscurePass, setIsObscurePass] = useState(true);
    function handlePassText(e: React.MouseEvent) {
        e.preventDefault();
        setIsObscurePass(!isObscurePass);
    }
    return (
        <>
            <div>
                <AuthLayout
                    title="Créer un compte"
                    description="Entrez vos coordonnées ci-dessous pour créer votre compte"
                >
                    <Head title="Register" />
                    <Form
                        {...register.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                        method="POST"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Nom complet
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            className={cn('form-input')}
                                            name="name"
                                            placeholder="Nom complet"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Adresse email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="form-input"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Téléphone</Label>
                                        <Input
                                            className="form-input"
                                            type="tel"
                                            autoComplete="phone"
                                            name="phone_number"
                                            placeholder="ex: +22861234567"
                                        />
                                        <InputError
                                            message={errors.phone_number}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Mot de passe
                                        </Label>
                                        <Input
                                            id="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                            className="form-input"
                                            type={
                                                isObscurePass
                                                    ? 'password'
                                                    : 'text'
                                            }
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirmer le mot de passe
                                        </Label>

                                        <Input
                                            id="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            className="form-input"
                                            placeholder="Confirmer le mot de passe"
                                            type={
                                                isObscurePass
                                                    ? 'password'
                                                    : 'text'
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor="password_confirmation">
                                            Afficher les mots de passes
                                        </Label>
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
                                    </div>

                                    <Button
                                        type="submit"
                                        className={cn('btn-primary !py-6')}
                                        tabIndex={5}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Créer un compte
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    Vous avez déjà un compte ?{' '}
                                    <TextLink
                                        className="text-app-blue"
                                        href={login()}
                                        tabIndex={6}
                                    >
                                        Se connecter
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </AuthLayout>
            </div>
        </>
    );
}
