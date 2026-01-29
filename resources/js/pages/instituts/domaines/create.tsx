import { CheckboxField, InputField } from '@/components/shared/form';
import SelectFormShared from '@/components/shared/select-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store, update } from '@/routes/institut/domaines';
import { Domaine } from '@/types/models/course';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function DomaineForm({
    domaines,
    domaine,
}: {
    domaines: Domaine[];
    domaine?: Domaine;
}) {
    const isEdit = !!domaine;
    const { errors } = usePage().props;
    const { data, setData } = useForm({
        name: isEdit ? domaine?.name : '',
        description: isEdit ? domaine?.description : '',
        domaine_id: isEdit ? domaine?.domaine_id : null,
        is_active: isEdit ? domaine?.is_active == 1 : true,
    });
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    }

    const [domValue, setDomValue] = useState<number | null>(
        domaine ? (domaine.domaine_id ?? null) : null,
    );
    const [processing, setProcessing] = useState(false);
    const isFormValid = data.name;
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        if (isEdit) {
            router.put(
                update(domaine!.id),
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
        <div className="mx-auto w-full rounded-xl p-5 shadow-sm">
            <h3 className="mb-3 font-bold">
                {isEdit ? 'Modifier le domaine' : 'Ajouter un domaine'}
            </h3>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="mb-3 grid gap-3">
                    <Input
                        type="hidden"
                        name="domaine_id"
                        id="domaine_id"
                        value={domValue ?? ''}
                        onChange={handleChange}
                    />
                    <div className="grid gap-2">
                        <InputField
                            label="Désignation"
                            type="text"
                            value={data.name}
                            placeholder="Désignation"
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                        />
                    </div>
                    <div className="grid gap-2">
                        <InputField
                            type="text"
                            value={data.description ?? ''}
                            placeholder="Description"
                            label="Description"
                            onChange={(val) => setData('description', val)}
                            error={errors.description}
                        />
                    </div>

                    {/* catégorie parente */}
                    <div className="grid gap-2">
                        <Label>Domaine parent</Label>
                        <SelectFormShared
                            options={domaines}
                            label="Sélectionner une catégorie"
                            value={domValue}
                            onSelect={(val) => setDomValue(val)}
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <CheckboxField
                            checked={data.is_active ?? false}
                            onChange={(val) =>
                                setData({ ...data, is_active: val })
                            }
                            label="Activer le domaine"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="btn-primary mt-4 w-full !py-6"
                        tabIndex={4}
                        disabled={processing || !isFormValid}
                        data-test="create-domaine-button"
                    >
                        {processing && <Spinner />}
                        {isEdit
                            ? 'Mettre à jour le domaine'
                            : 'Ajouter un domaine'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
