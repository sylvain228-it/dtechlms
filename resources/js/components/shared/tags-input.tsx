import { Label } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';

export function TagsInput({
    value = [],
    label,
    onChange,
    placeholder = '',
}: {
    value?: string[];
    label: string;
    onChange: (v: string[]) => void;
    placeholder?: string;
}) {
    const [input, setInput] = useState('');

    const add = () => {
        const val = input.trim();
        if (val && !value.includes(val)) {
            onChange([...value, val]);
            setInput('');
        }
    };

    const remove = (idx: number) => {
        const copy = [...value];
        copy.splice(idx, 1);
        onChange(copy);
    };

    return (
        <div>
            <div className="grid w-full gap-2">
                <Label>{label}</Label>
                <div className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                add();
                            }
                        }}
                        className="form-input flex-1"
                        placeholder={placeholder}
                    />
                    <button type="button" onClick={add} className="btn-primary">
                        <IoAdd size={20} />
                    </button>
                </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {value.map((v, i) => (
                    <span
                        key={`${v}-${i}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                        <span>{v}</span>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="text-red-500"
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

export function TagsInputBadge({ tags }: { tags: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-black dark:text-black"
                >
                    <span>{tag}</span>
                </span>
            ))}
        </div>
    );
}
