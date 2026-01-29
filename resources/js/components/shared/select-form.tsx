import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
type SelectFormSharedProps = {
    options: any;
    value?: number | null;
    onSelect: (selected: number) => void;
    label?: string;
    emptyOption?: string;
};
export default function SelectFormShared({
    options,
    value,
    onSelect,
    label,
    emptyOption,
}: SelectFormSharedProps) {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find(
        (item: any) => item.id === (value ?? 0),
    );
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedOption
                        ? selectedOption.name || selectedOption.title
                        : (label ?? 'Sélectionner une option...')}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Rechercher une option..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>
                            {emptyOption ?? 'Pas de résultat'}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={`${item.id}`}
                                    onSelect={(currentValue) => {
                                        onSelect(
                                            currentValue ===
                                                (value ?? 0).toFixed()
                                                ? 0
                                                : parseInt(currentValue),
                                        );

                                        setOpen(false);
                                    }}
                                >
                                    {item.name || item.title}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === item.id
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
    );
}
