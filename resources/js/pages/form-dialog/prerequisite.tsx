import { InputField, SelectField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { prerequisiteTypeLabels } from '@/lib/type';
import { fetchentitydata } from '@/routes';
import { CustomMapDataProposal, Prerequisite } from '@/types/models/others';
import { useForm, usePage } from '@inertiajs/react';
import { Edit2Icon } from 'lucide-react';
import React from 'react';

export default function PrerequisiteDialog({
    prerequisite,
    thisModelName,
    thisModelId,
}: {
    prerequisite?: Prerequisite;
    thisModelName: string;
    thisModelId: number;
}) {
    const { errors } = usePage().props;
    const [processing, setProcessing] = React.useState(false);
    const [loadedData, setLoadedData] = React.useState<CustomMapDataProposal[]>(
        [],
    );
    const isEdit = Boolean(prerequisite);
    const { data, setData } = useForm({
        entity_type: prerequisite ? prerequisite.entity_type : '',
        entity_id: prerequisite ? prerequisite.entity_id : '',
        prerequisite_type: prerequisite ? prerequisite.prerequisite_type : '',
        prerequisite_id: prerequisite ? prerequisite.prerequisite_id : null,
        description: prerequisite ? prerequisite.description : '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        // submit the form data here
        setProcessing(false);
    };

    const loadEntityDataApi = async () => {
        // load data from api :  get route
        if (!data.prerequisite_type || data.prerequisite_type === 'custom') {
            setLoadedData([]);
            return;
        }
        try {
            console.log(
                'Loading entity data for type:',
                data.prerequisite_type,
            );
            const response = await fetch(
                `${fetchentitydata([data.prerequisite_type, thisModelId]).url}`,
                { method: 'GET', headers: { Accept: 'application/json' } },
            );
            console.log('Response received:', response);
            const result = await response.json();
            if (response.ok) {
                console.log('Entity data loaded successfully:', result.old_id);
                for (const item of result.data) {
                    const element = {
                        id: item.id as number,
                        title: (item.name ??
                            item.title ??
                            'Sans titre') as string,
                    };
                    setLoadedData([...loadedData, element]);
                }
            } else {
                console.error('Failed to load entity data:', result);
            }
        } catch (error) {
            console.error('Error loading entity data:', error);
        }
    };
    const handleOnTypeChange = (val: string) => {
        console.log('Selected prerequisite type:', val);
        setData('prerequisite_type', val);
        // loadEntityDataApi();
        console.log('prerequisite type:', data.prerequisite_type);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="cursor-pointer border bg-transparent p-1 text-gray-500 hover:text-gray-700">
                    <Edit2Icon className="text-blue-500" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                <DialogHeader className="w-full">
                    <DialogTitle className="w-full">
                        {isEdit
                            ? 'Modifier le prérequis'
                            : 'Ajouter un prérequis'}
                    </DialogTitle>
                    <DialogDescription className="w-full">
                        {isEdit
                            ? 'Modifiez le prérequis du cours ici.'
                            : 'Ajoutez un prérequis au cours ici.'}
                    </DialogDescription>
                </DialogHeader>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="mb-4 grid w-full gap-4">
                        <div className="grid gap-3">
                            <InputField
                                label="Description"
                                type="text"
                                placeholder="Donner une description"
                                value={data.description ?? ''}
                                onChange={(val) => setData('description', val)}
                                error={errors.description as string}
                                required={data.prerequisite_type === 'custom'}
                            />
                            <SelectField
                                options={prerequisiteTypeLabels}
                                value={data.prerequisite_type}
                                label="Type de prérequis"
                                onChange={(val) => handleOnTypeChange(val)}
                            />

                            {data.prerequisite_type &&
                                loadedData.length > 0 && (
                                    <SelectField
                                        options={loadedData.map((item) => ({
                                            key: item.id.toString(),
                                            value: item.title,
                                        }))}
                                        value={
                                            data.prerequisite_id?.toString() ??
                                            ''
                                        }
                                        label="Sélectionner le prérequis"
                                        onChange={(val) =>
                                            setData(
                                                'prerequisite_id',
                                                val ? parseInt(val) : null,
                                            )
                                        }
                                        error={errors.prerequisite_id as string}
                                        required
                                    />
                                )}
                        </div>
                    </div>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline">Fermer</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="btn-primary w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="create-category-button"
                            >
                                {processing && <Spinner />}
                                Enregistrer
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
