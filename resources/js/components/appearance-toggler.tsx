import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

export default function AppearanceToggler() {
    const { appearance, updateAppearance } = useAppearance();
    return (
        <span>
            <button
                onClick={() =>
                    updateAppearance(appearance === 'dark' ? 'light' : 'dark')
                }
                className={cn(
                    'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                    // appearance === value
                    //     ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                    //     : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                )}
            >
                {appearance === 'dark' ? (
                    <Moon className="h-6 w-6 text-gray-800 dark:text-gray-300" />
                ) : (
                    <Sun className="h-6 w-6 text-gray-800 dark:text-gray-300" />
                )}
            </button>
        </span>
    );
}
