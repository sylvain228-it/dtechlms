import {
    CheckboxField,
    FormField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { searchUser, store, update } from '@/routes/institut/teachers';
import { User } from '@/types';
import { Teacher } from '@/types/models/institut';
import { router, useForm, usePage } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';

// interface FormErrors {
//     [key: string]: string;
// }

export default function CreateTeacher() {
    const { errors } = usePage().props;

    const [specialtyInput, setSpecialtyInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const { teacher } = usePage().props as unknown as {
        teacher: Teacher;
    };
    const { data, setData } = useForm({
        first_name: teacher == undefined ? '' : teacher.first_name!,
        last_name: teacher == undefined ? '' : teacher.last_name!,
        email: teacher == undefined ? '' : teacher.email!,
        phone_number: teacher == undefined ? '' : teacher.phone_number!,
        whatsapp_number: teacher == undefined ? '' : teacher.whatsapp_number!,
        create_new_user: false,
        birth_date:
            teacher == undefined
                ? ''
                : teacher.birth_date
                  ? new Date(teacher.birth_date).toISOString().split('T')[0]
                  : '',
        gender: teacher == undefined ? '' : teacher.gender!,
        qualification: teacher == undefined ? '' : teacher.qualification!,
        diplom: teacher == undefined ? '' : teacher.diplom!,
        exp_year: teacher == undefined ? '' : teacher.exp_year!,
        country: teacher == undefined ? '' : teacher.country!,
        city: teacher == undefined ? '' : teacher.city!,
        address: teacher == undefined ? '' : teacher.address!,
        bio: teacher == undefined ? '' : teacher.bio!,
        specialties: [] as string[],
        online_teaching:
            teacher == undefined ? false : teacher.online_teaching === 1,
        status: 'inactive',
        user_id: '',
        profile_picture: null as File | null,
    });

    const searchableUser =
        teacher == undefined || teacher.user_id == null ? true : false;
    // search user

    const [searchKey, setSearchKey] = React.useState('');
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const [searching, setSearching] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function searchUserBySearchKey(searchKey: string) {
        try {
            setSearching(true);

            const res = await fetch(
                `${searchUser().url}?search_key=${searchKey}`,
                {
                    method: 'GET',
                },
            );
            const result = await res.json();
            console.log('result', result);
            setSearching(false);
            if (result.user) {
                setUser(result.user as User);
                setError(null);
                // handle success
            } else {
                // handle failure
                console.error('Utilisateur non trouvé');
                console.error('result.message', result.message);
                setError(result.message || 'Utilisateur non trouvé');
                setUser(undefined);
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la recherche.');
            setSearching(false);
            console.error('Erreur', err);
        }
    }

    function handleSearch() {
        searchUserBySearchKey(searchKey);
    }

    function handleApply(e: React.MouseEvent) {
        e.preventDefault();
        if (!user) return;
        setData('user_id', user.id.toString());
        setData('first_name', user?.first_name);
        setData('last_name', user.last_name);
        setData('email', user.email);
        setData('phone_number', user.phone_number);
    }
    function handleCancelApply(e: React.MouseEvent) {
        e.preventDefault();
        setUser(undefined);
        setData('user_id', '');
        setData('first_name', '');
        setData('last_name', '');
        setData('email', '');
        setData('phone_number', '');
    }
    // fin

    useEffect(() => {
        if (teacher != undefined && teacher.specialties != null) {
            const parseSpe = JSON.parse(teacher.specialties);
            parseSpe.map((s: string) => {
                if (s.trim() && !data.specialties.includes(s)) {
                    setData('specialties', [...data.specialties, s]);
                }
            });
        }
    }, [data.specialties, setData, teacher]);

    const addSpecialty = () => {
        if (
            specialtyInput.trim() &&
            !data.specialties.includes(specialtyInput)
        ) {
            setData('specialties', [...data.specialties, specialtyInput]);
            setSpecialtyInput('');
        }
    };

    const removeSpecialty = (specialty: string) => {
        setData(
            'specialties',
            data.specialties.filter((s) => s !== specialty),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        async function submitForm() {
            const dataVal = {
                ...data,
                _method: teacher == undefined ? 'post' : 'put',
            };
            if (teacher != undefined) {
                router.post(update(teacher.id), dataVal, {
                    forceFormData: true,
                });
            } else {
                router.post(store(), dataVal);
            }
        }
        submitForm().then(() => {
            setProcessing(false);
        });
    };

    const genderOptions = [
        { key: 'M', value: 'Masculin' },
        { key: 'F', value: 'Féminin' },
        { key: 'O', value: 'Autre' },
    ];

    const isFormValid =
        data.first_name && data.last_name && data.email && data.phone_number;

    return (
        <InstitutLayouts
            title={
                teacher == undefined
                    ? 'Ajouter un Enseignant'
                    : "Modifier l'Enseignant"
            }
        >
            <div className="mx-auto mt-8 mb-8 max-w-4xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {teacher == undefined
                            ? 'Ajouter un Enseignant'
                            : "Modifier l'Enseignant"}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Complétez le formulaire ci-dessous pour
                        {teacher == undefined
                            ? " créer un nouveau profil d'enseignant"
                            : " modifier un profil d'enseignant existant"}
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    method="POST"
                    className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
                >
                    {/* user */}
                    {searchableUser && (
                        <div className="mt-6 grid grid-cols-1 gap-6">
                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h2 className="text-md font-medium text-gray-900">
                                    Enseignant à déjà un compte?/Rechercher
                                </h2>
                                <div className="mt-4">
                                    <div className="mb-3">
                                        <InputGroup className="w-full rounded-3xl py-5 focus:outline-0 focus-visible:outline-0">
                                            <InputGroupInput
                                                name="search_key"
                                                onChange={(e) =>
                                                    setSearchKey(e.target.value)
                                                }
                                                placeholder="Entrer son numéro, son email ou identifiant"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <Button
                                                    disabled={
                                                        searching ||
                                                        searchKey === ''
                                                    }
                                                    className="btn-primary"
                                                    onClick={handleSearch}
                                                >
                                                    {searching && <Spinner />}
                                                    <SearchIcon />
                                                    Vérifier
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </div>

                                    {user && (
                                        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {user.first_name}{' '}
                                                        {user.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.phone_number}
                                                    </p>
                                                </div>
                                                <div className="rounded-full bg-green-100 p-2">
                                                    <svg
                                                        className="h-5 w-5 text-green-600"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
                                            <p className="text-sm text-red-600">
                                                {error}
                                            </p>
                                        </div>
                                    )}
                                    {user && (
                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={handleApply}
                                                type="submit"
                                                className="btn-primary"
                                            >
                                                Appliquer
                                            </Button>
                                            <Button
                                                onClick={handleCancelApply}
                                                type="submit"
                                                className="btn-primary !bg-red-500"
                                            >
                                                <ImCancelCircle />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section: Informations Personnelles */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Informations Personnelles
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InputField
                                label="Prénom"
                                value={data.first_name}
                                onChange={(value) =>
                                    setData('first_name', value)
                                }
                                error={errors.first_name}
                                required
                                placeholder="ex: Jean"
                            />
                            <InputField
                                label="Nom"
                                value={data.last_name}
                                onChange={(value) =>
                                    setData('last_name', value)
                                }
                                error={errors.last_name}
                                required
                                placeholder="ex: Dupont"
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InputField
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                error={errors.email}
                                required
                                placeholder="ex: jean.dupont@example.com"
                            />
                            <InputField
                                label="Téléphone"
                                type="tel"
                                value={data.phone_number}
                                onChange={(value) =>
                                    setData('phone_number', value)
                                }
                                error={errors.phone_number}
                                required
                                placeholder="ex: +22861234567"
                            />
                            <InputField
                                label="Numéro whatsapp"
                                type="tel"
                                value={data.whatsapp_number}
                                onChange={(value) =>
                                    setData('whatsapp_number', value)
                                }
                                error={errors.whatsapp_number}
                                placeholder="ex: +22861234567"
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InputField
                                label="Date de Naissance"
                                type="date"
                                value={data.birth_date ?? ''}
                                onChange={(value) =>
                                    setData('birth_date', value)
                                }
                                error={errors.birth_date}
                            />
                            <SelectField
                                label="Sexe"
                                value={data.gender}
                                onChange={(value) => setData('gender', value)}
                                options={genderOptions}
                                error={errors.gender}
                            />
                        </div>
                    </div>

                    {/* Section: Qualifications Professionnelles */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Qualifications Professionnelles
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InputField
                                label="Qualification"
                                value={data.qualification}
                                onChange={(value) =>
                                    setData('qualification', value)
                                }
                                error={errors.qualification}
                                placeholder="ex: Bac+3"
                            />
                            <InputField
                                label="Diplôme"
                                value={data.diplom}
                                onChange={(value) => setData('diplom', value)}
                                error={errors.diplom}
                                placeholder="ex: Licence en Informatique"
                            />
                            <InputField
                                label="Années d'Expérience"
                                type="number"
                                value={data.exp_year}
                                onChange={(value) => setData('exp_year', value)}
                                error={errors.exp_year}
                                placeholder="ex: 5"
                            />
                        </div>

                        {/* Specialties */}
                        <div className="mt-4">
                            <FormField label="Spécialités">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={specialtyInput}
                                        onChange={(e) =>
                                            setSpecialtyInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSpecialty();
                                            }
                                        }}
                                        placeholder="Ajouter une spécialité..."
                                        className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSpecialty}
                                        className="rounded-lg bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                                {data.specialties.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {data.specialties.map((specialty) => (
                                            <span
                                                key={specialty}
                                                className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                                            >
                                                {specialty}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSpecialty(
                                                            specialty,
                                                        )
                                                    }
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </FormField>
                        </div>
                    </div>

                    {/* Section: Localisation */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Localisation
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <InputField
                                label="Pays"
                                value={data.country}
                                onChange={(value) => setData('country', value)}
                                error={errors.country}
                                placeholder="ex: Togo"
                            />
                            <InputField
                                label="Ville"
                                value={data.city}
                                onChange={(value) => setData('city', value)}
                                error={errors.city}
                                placeholder="ex: Lomé"
                            />
                            <InputField
                                label="Adresse"
                                value={data.address}
                                onChange={(value) => setData('address', value)}
                                error={errors.address}
                                placeholder="ex: 123 Rue de la Paix"
                            />
                        </div>
                    </div>

                    {/* Section: Biographie */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Biographie & Description
                        </h2>
                        <TextareaField
                            label="Biographie"
                            value={data.bio}
                            onChange={(value) => setData('bio', value)}
                            error={errors.bio}
                            placeholder="Décrivez votre expérience, vos spécialités et votre approche pédagogique..."
                            rows={5}
                        />
                    </div>

                    {searchableUser && (
                        <div>
                            {data.user_id != '' && user != undefined ? (
                                <div className="w-full bg-green-100 p-3 text-green-600">
                                    Utilisateur trouvé : {user.email}
                                </div>
                            ) : (
                                <>
                                    <div className="w-full bg-amber-100 p-3 text-amber-600">
                                        Un compte utilisateur n'a pas été
                                        sélectionné,{' '}
                                        <b>
                                            cocher cette case pour créer un
                                            nouveau compte qui sera associer à
                                            cet enseignant avec ses
                                            informations.
                                        </b>
                                    </div>
                                    <div className="mt-2 pb-6">
                                        <div className="space-y-4">
                                            <CheckboxField
                                                label="Créer un nouveau compte"
                                                checked={data.create_new_user}
                                                onChange={(checked) =>
                                                    setData(
                                                        'create_new_user',
                                                        checked,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {/* Actions */}
                    <div className="flex gap-4 border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <Button
                            type="submit"
                            disabled={processing || !isFormValid}
                            className="btn-primary flex-1"
                        >
                            {processing && <Spinner />}
                            {processing
                                ? `${teacher == undefined ? 'Enregistrement en cours...' : 'Mise à jour en cours...'}`
                                : `${teacher == undefined ? "Créer l'Enseignant" : "Modifier l'Enseignant"}`}
                        </Button>
                    </div>
                </form>
            </div>
        </InstitutLayouts>
    );
}
