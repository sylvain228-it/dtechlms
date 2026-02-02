import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export function StatCard({
    title,
    value,
    children,
    href,
}: {
    title: string;
    value: number | string;
    children?: React.ReactNode;
    href?: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-cdcard">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-200">
                {children}
            </div>
            <div className="w-full">
                <div className="flex w-full justify-between gap-3 text-sm text-gray-500 dark:text-gray-300">
                    {href ? <Link href={href}>{title}</Link> : title}

                    {href && (
                        <ArrowRight className="block text-blue-500" size={25} />
                    )}
                </div>
                <div className="text-2xl font-semibold">{value}</div>
            </div>
        </div>
    );
}
