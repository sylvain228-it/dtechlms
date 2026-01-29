import { InputField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { store, update } from '@/routes/institut/locations';
import { Location } from '@/types/models/institut';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function LoactionForm() {
    const { location } = usePage().props as unknown as {
        location?: Location;
    };
    const { errors } = usePage().props;

    const isEdit = !!location;
    const { data, setData } = useForm({
        name: isEdit ? location?.name : '',
        address: isEdit ? location?.address : '',
        address_line: isEdit ? location?.address_line : '',
        city: isEdit ? location?.city : '',
        country: isEdit ? location?.country : 'Togo',
        maps_url: isEdit ? location?.maps_url : '',
        latitude: isEdit ? location?.latitude : '',
        longitude: isEdit ? location?.longitude : '',
    });

    const [processing, setProcessing] = useState(false);
    const isFormValid = data.name && data.address && data.city && data.country;
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        if (isEdit) {
            router.put(
                update(location!.id),
                { ...data, _method: 'put' },
                {
                    onFinish: onFinish,
                },
            );
        } else {
            router.post(store(), data, {
                onFinish: onFinish,
            });
        }
    }
    function onFinish() {
        setProcessing(false);
    }
    return (
        <InstitutLayouts title="Formulaire d'établissement">
            <div className="mx-auto w-full rounded-xl p-5 shadow-sm">
                <h3 className="mb-3 font-bold">
                    {isEdit
                        ? "Modifier l'établissement"
                        : 'Ajouter un établissement'}
                </h3>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="mb-3 grid gap-3">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <InputField
                                label="Nom"
                                type="text"
                                value={data.name}
                                placeholder="Désignation"
                                onChange={(val) => setData('name', val)}
                                error={errors.name}
                            />
                            <InputField
                                label="Pays"
                                type="text"
                                value={data.country ?? ''}
                                placeholder="Pays"
                                onChange={(val) => setData('country', val)}
                                error={errors.country}
                            />
                            <div className="sm:col-span-2 md:col-span-1">
                                <InputField
                                    label="Ville"
                                    type="text"
                                    value={data.city ?? ''}
                                    placeholder="Ville"
                                    onChange={(val) => setData('city', val)}
                                    error={errors.city}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InputField
                                type="text"
                                value={data.address ?? ''}
                                placeholder="Adresse"
                                label="Adresse"
                                onChange={(val) => setData('address', val)}
                                error={errors.address}
                            />
                            <InputField
                                type="text"
                                value={data.address_line ?? ''}
                                placeholder="Complément d'adresse"
                                label="Complément d'adresse"
                                onChange={(val) => setData('address_line', val)}
                                error={errors.address_line}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <InputField
                                type="number"
                                value={data.latitude ?? ''}
                                placeholder="Latitude"
                                label="Latitude"
                                onChange={(val) => setData('latitude', val)}
                                error={errors.latitude}
                            />
                            <InputField
                                type="number"
                                value={data.longitude ?? ''}
                                placeholder="Longitude"
                                label="Longitude"
                                onChange={(val) => setData('longitude', val)}
                                error={errors.longitude}
                            />
                            <div className="sm:col-span-2 md:col-span-1">
                                <InputField
                                    type="text"
                                    value={data.maps_url ?? ''}
                                    placeholder="Lien Google Maps"
                                    label="Lien Google Maps"
                                    onChange={(val) => setData('maps_url', val)}
                                    error={errors.maps_url}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="btn-primary mt-4 w-full !py-6"
                            tabIndex={4}
                            disabled={processing || !isFormValid}
                        >
                            {processing && <Spinner />}
                            {isEdit
                                ? "Mettre à jour l'établissement"
                                : 'Ajouter un établissement'}
                        </Button>
                    </div>
                </form>
            </div>
        </InstitutLayouts>
    );
}
