import InputError from '@/components/input-error';
import { CheckboxField, InputField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { store, update } from '@/routes/admin/domaines';
import { Domaine } from '@/types/models/course';
import { Form, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export default function DomaineForm({
    domaines,
    domaine,
}: {
    domaines: Domaine[];
    domaine?: Domaine;
}) {
    const { errors } = usePage().props;
    const [values, setValues] = useState({
        name: domaine ? domaine.name : '',
        description: domaine ? domaine.description : '',
        domaine_id: domaine ? domaine.domaine_id : null,
        is_active: domaine ? domaine.is_active : true,
    });
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }

    const [open, setOpen] = useState(false);
    const [domValue, setDomValue] = useState(
        domaine != undefined && domaine.domaine_id != null
            ? domaine.domaine_id
            : 0,
    );
    const isFormValid = values.name;
    return (
        <div className="mx-auto w-full rounded-xl p-5 shadow-sm">
            <h3 className="mb-3 font-bold">
                {domaine == undefined
                    ? 'Ajouter un domaine'
                    : 'Modifier le domaine'}
            </h3>
            <Form
                method={domaine == undefined ? 'POST' : 'PUT'}
                action={domaine == undefined ? store() : update(domaine.id)}
                onSuccess={() => {
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        is_active: true,
                    });
                    domaine = undefined;
                }}
            >
                {({ processing }) => (
                    <>
                        <div className="mb-3 grid gap-3">
                            <Input
                                type="hidden"
                                name="domaine_id"
                                id="domaine_id"
                                value={domValue === 0 ? '' : domValue}
                                onChange={handleChange}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="name">Désignation</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={values.name}
                                    className="form-input"
                                    placeholder="Désignation"
                                    onChange={handleChange}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <InputField
                                    type="text"
                                    value={values.description ?? ''}
                                    placeholder="Description"
                                    label="Description"
                                    onChange={(val) =>
                                        setValues({
                                            ...values,
                                            description: val,
                                        })
                                    }
                                    error={errors.description}
                                />
                            </div>

                            {/* catégorie parente */}
                            <div className="grid gap-2">
                                <Label>Domaine parent</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {domValue
                                                ? domaines.find(
                                                      (catego) =>
                                                          catego.id ===
                                                          domValue,
                                                  )?.name
                                                : 'Sélectionner une catégorie...'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Rechercher une catégorie..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    Pas de catégorie trouvée.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {domaines.map((catego) => (
                                                        <CommandItem
                                                            key={catego.id}
                                                            value={`${catego.id}`}
                                                            onSelect={(
                                                                currentValue,
                                                            ) => {
                                                                setDomValue(
                                                                    currentValue ===
                                                                        domValue.toFixed()
                                                                        ? 0
                                                                        : parseInt(
                                                                              currentValue,
                                                                          ),
                                                                );

                                                                setOpen(false);
                                                            }}
                                                        >
                                                            {catego.name}
                                                            <Check
                                                                className={cn(
                                                                    'ml-auto',
                                                                    domValue ===
                                                                        catego.id
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex items-center space-x-3">
                                <CheckboxField
                                    checked={values.is_active ?? false}
                                    onChange={(val) =>
                                        setValues({ ...values, is_active: val })
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
                                {domaine == undefined
                                    ? 'Ajouter la catégorie'
                                    : 'Mettre à jour la catégorie'}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
