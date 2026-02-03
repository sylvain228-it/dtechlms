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
import InstitutAuth from '@/layouts/instituts/institut-auth';
import { store } from '@/routes/institut/login';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

interface PartnerLoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function PartnerLogin({ status }: PartnerLoginProps) {
    const [processing, setProcessing] = useState(false);
    const [isObscurePass, setIsObscurePass] = useState(true);
    function handlePassText(e: React.MouseEvent) {
        e.preventDefault();
        setIsObscurePass(!isObscurePass);
    }
    const { errors } = usePage().props;

    const [values, setValues] = useState({
        email: null,
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
        router.post(store(), values, {
            onFinish: () => setProcessing(false),
        });
    }
    return (
        <InstitutAuth
            title="Connexion Partenaire"
            description="Connectez-vous pour accéder au tableau de bord partenaire"
        >
            <Head title="Se connecter" />

            <Form
                method="POST"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                {errors.login && (
                    <div className="mb-4 text-center text-sm font-medium text-red-600">
                        {errors.login}
                    </div>
                )}
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="E-mail"
                            className="form-input"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid gap-2">
                        <InputGroup className="form-input !focus:ring-0 !px-0">
                            <InputGroupInput
                                id="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                className="form-input"
                                onChange={handleChange}
                                type={isObscurePass ? 'password' : 'text'}
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
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </InstitutAuth>
    );
}
