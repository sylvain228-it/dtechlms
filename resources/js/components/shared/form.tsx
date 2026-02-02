export const FormField: React.FC<{
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}> = ({ label, error, required = false, children }) => (
    <div>
        <label className="mb-2 block font-medium text-gray-700 dark:text-gray-400">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

export const InputField: React.FC<{
    label: string;
    type?: string;
    value: string | number;
    max?: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
}> = ({
    label,
    type = 'text',
    value,
    max,
    onChange,
    error,
    required,
    placeholder,
}) => (
    <FormField label={label} error={error} required={required}>
        <input
            type={type}
            value={value ?? ''}
            max={max ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${
                error ? '!border-red-300' : '!border-gray-300'
            } form-input`}
        />
    </FormField>
);

export const SelectField: React.FC<{
    label: string;
    value: string;
    disabled?: boolean;
    emptyOption?: string;
    onChange: (value: string) => void;
    options: Array<{ key: string; value: string }>;
    error?: string;
    required?: boolean;
}> = ({
    label,
    value,
    disabled,
    emptyOption,
    onChange,
    options,
    error,
    required,
}) => (
    <FormField label={label} error={error} required={required}>
        <select
            value={value ?? ''}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            disabled={disabled ?? false}
            className={`form-input w-full ${
                error ? 'border-red-300' : 'border-gray-300'
            } `}
        >
            <option value="" className="dark:text-gray-600">
                {emptyOption ?? 'Sélectionner une option'}
            </option>
            {options.map((option) => (
                <option
                    className="dark:text-gray-600"
                    key={option.key}
                    value={option.key}
                >
                    {option.value}
                </option>
            ))}
        </select>
    </FormField>
);

export const CheckboxField: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
    <div className="flex items-center space-x-3">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 transition focus:ring-blue-500"
        />
        <label className="text-gray-700">{label}</label>
    </div>
);

export const TextareaField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
    rows?: number;
}> = ({ label, value, onChange, error, required, placeholder, rows = 4 }) => (
    <FormField label={label} error={error} required={required}>
        <textarea
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            defaultValue={value ?? ''}
            rows={rows}
            className={`w-full rounded-lg border ${
                error ? 'border-red-300' : 'border-gray-300'
            } bg-gray-50 px-4 py-2 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none`}
        />
    </FormField>
);
