import { FlashData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function DisplayFlashMsg() {
    const { flash } = usePage().props as unknown as { flash: FlashData };
    return (
        <div>
            {flash.success && (
                <div
                    id="flash-smsg"
                    className="mb-4 rounded bg-green-100 px-4 py-3 text-sm text-green-800"
                >
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div
                    id="flash-smsg"
                    className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-800"
                >
                    {flash.error}
                </div>
            )}
        </div>
    );
}
