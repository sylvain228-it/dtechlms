import DefualtProfileSvg from '@/components/profile-svg';
import {
    CheckboxField,
    InputField,
    SelectField,
} from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { useTmpUpload } from '@/hooks/use-tmp-upload';
import { genderOptionLabels, studyLevelLabels } from '@/lib/type';
import { searchUser, store, update } from '@/routes/institut/students';
import { User } from '@/types';
import { Student } from '@/types/models/institut';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CiCircleRemove } from 'react-icons/ci';
import { ImCancelCircle } from 'react-icons/im';
import GestLayout from './gest-layout';

export default function CreateEtudiant() {
    const { errors } = usePage().props;
    // const [profilePicturePreview, setProfilePicturePreview] = useState<
    //     string | null
    // >(null);
    const { student } = usePage().props as unknown as {
        student: Student;
    };
    const [processing, setProcessing] = useState(false);
    // const [isFileRemoving, setIsFileRemoving] = useState(false);

    // upload file states
    // const [selectedFile, setSelectedFile] = useState(null as File | null);
    // const [uploadProgress, setUploadProgress] = useState(0);

    const searchableUser =
        student == undefined || student.user_id == null ? true : false;
    // search user

    const [searchKey, setSearchKey] = React.useState('');
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const [searching, setSearching] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const { data, setData, reset } = useForm({
        first_name: student?.first_name ?? '',
        last_name: student?.last_name ?? '',
        email: student?.email ?? '',
        create_new_user: false,
        phone_number: student?.phone_number ?? '',
        whatsapp_number: student?.whatsapp_number ?? '',
        birth_date:
            student == undefined
                ? ''
                : student.birth_date
                  ? new Date(student.birth_date).toISOString().split('T')[0]
                  : '',

        gender: student?.gender ?? '',
        current_level: student?.current_level ?? '',
        country: student?.country ?? '',
        city: student?.city ?? '',
        address: student?.address ?? '',
        is_active: student?.is_active === 1,
        user_id: student?.user_id ?? '',
        tmp_path: '',
    });
    const isEdit = !!student;
    const {
        file: selectedFile,
        tmpPath,
        filePreview,
        uploadProgress,
        isRemoving,
        handleFileChange,
        remove,
    } = useTmpUpload({
        onUploadSuccess: (data) => setData('tmp_path', data.path),
        onRemoveSuccess: () => setData('tmp_path', ''),
    });
    // upload file to tmp function

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        async function submitForm() {
            const dataVal = {
                ...data,
                _method: student == undefined ? 'post' : 'put',
            };
            if (student != undefined) {
                router.post(update(student.id), dataVal, {
                    forceFormData: true,
                    onSuccess: onSuccess,
                });
            } else {
                router.post(store(), dataVal, { onSuccess: onSuccess });
            }
        }
        submitForm();
    };

    function onSuccess() {
        setProcessing(false);
        reset();
    }
    const listYears = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
        listYears.push(`${i}-${i + 1}`);
    }

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

    useEffect(() => setData('tmp_path', tmpPath), [setData, tmpPath]);
    const isFormValid =
        data.first_name && data.last_name && data.email && data.phone_number;

    return (
        <GestLayout title="Fiche d'enregistrement d'étudiant">
            <Head
                title={!isEdit ? 'Ajouter un Etudiant' : "Modifier l'Etudiant"}
            />
            <div className="mx-auto mt-8 mb-8 max-w-4xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {!isEdit
                            ? 'Ajouter un Etudiant'
                            : "Modifier l'Etudiant"}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Complétez le formulaire ci-dessous pour
                        {!isEdit
                            ? " créer un nouveau profil d'Etudiant"
                            : " modifier un profil d'Etudiant existant"}
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    method="POST"
                    className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
                >
                    {/* Section: Photo de Profil */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Photo de Profil
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100">
                                {filePreview ? (
                                    <img
                                        src={filePreview}
                                        alt="Aperçu"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <>
                                        {isEdit &&
                                        student.profile_picture_url != null ? (
                                            <img
                                                src={
                                                    student.profile_picture_url
                                                }
                                                alt="Aperçu"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <DefualtProfileSvg />
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={
                                        data.tmp_path !== '' ? true : false
                                    }
                                    className="hidden"
                                    id="profile-picture"
                                />
                                <label
                                    htmlFor="profile-picture"
                                    className="inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                >
                                    Télécharger une photo
                                </label>
                                <p className="mt-2 text-sm text-gray-600">
                                    JPG, PNG ou GIF. Max 5MB.
                                </p>
                                {selectedFile && (
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-700">
                                                {selectedFile.name}
                                            </p>
                                            <Button
                                                disabled={
                                                    isRemoving ||
                                                    uploadProgress !== 100
                                                }
                                                type="button"
                                                onClick={remove}
                                                className="cursor-pointer text-sm text-red-600 transition hover:text-red-700 hover:underline"
                                            >
                                                {isRemoving && <Spinner />}
                                                <CiCircleRemove size={30} />
                                            </Button>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full rounded-full bg-app-blue transition-all duration-300"
                                                style={{
                                                    width: `${uploadProgress}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {uploadProgress}% téléchargé
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Informations Personnelles */}
                    {searchableUser && (
                        <div className="mt-6 grid grid-cols-1 gap-6">
                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h2 className="text-md font-medium text-gray-900">
                                    Etudiant à déjà un compte?/Rechercher
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
                                placeholder="ex: +22890123456"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InputField
                                label="Numéro whatsapp"
                                type="tel"
                                value={data.whatsapp_number}
                                onChange={(value) =>
                                    setData('whatsapp_number', value)
                                }
                                error={errors.whatsapp_number}
                                placeholder="ex: +22890123456"
                            />
                            <InputField
                                label="Date de Naissance"
                                type="date"
                                // max={new Date().toISOString().split('T')[0]}
                                value={data.birth_date ?? ''}
                                onChange={(value) =>
                                    setData('birth_date', value)
                                }
                                error={errors.birth_date}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4">
                            <SelectField
                                label="Sexe"
                                value={data.gender}
                                onChange={(value) => setData('gender', value)}
                                options={genderOptionLabels}
                                error={errors.gender}
                            />
                        </div>
                    </div>

                    {/* Section: Qualifications Académiques */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Qualifications Académiques
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <SelectField
                                label="Niveau d'Études Actuel"
                                value={data.current_level}
                                onChange={(value) =>
                                    setData('current_level', value)
                                }
                                options={studyLevelLabels}
                                error={errors.gender}
                            />
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

                    {/* Section: status */}
                    <div className="pb-6">
                        <h2 className="mb-6 text-lg font-semibold text-gray-800">
                            Statut de l'Étudiant
                        </h2>
                        <div className="space-y-4">
                            <CheckboxField
                                label="Actif"
                                checked={data.is_active}
                                onChange={(checked) =>
                                    setData('is_active', checked)
                                }
                            />
                        </div>
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
                    <div className="flex gap-4 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={
                                processing ||
                                !isFormValid ||
                                isRemoving ||
                                ((selectedFile &&
                                    uploadProgress < 100) as boolean)
                            }
                            className="btn-primary flex items-center"
                        >
                            {processing && <Spinner />}
                            {processing
                                ? `${student == undefined ? 'Enregistrement en cours...' : 'Mise à jour en cours...'}`
                                : `${student == undefined ? "Créer l'Etudiant" : "Modifier l'Etudiant"}`}
                        </button>
                    </div>
                </form>
            </div>
        </GestLayout>
    );
}
