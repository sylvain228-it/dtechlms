import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function DropdownTools() {
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    return (
        <DropdownMenu onOpenChange={(isOpen) => setIsOpenDropdown(isOpen)}>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 border-b-2 border-transparent px-1 py-4 text-gray-600 transition hover:border-gray-300 hover:text-gray-900">
                    Outils {isOpenDropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <ul>
                    <li>ddd</li>
                    <li>ddd</li>
                    <li>ddd</li>
                    <li>ddd</li>
                </ul>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
