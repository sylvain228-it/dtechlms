import AppLogo from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AdminAuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthAdminLayout({
    children,
    title,
    description,
}: PropsWithChildren<AdminAuthLayoutProps>) {
    return (
        <div className="min-h-svh flex-col gap-6 bg-background p-6 md:p-10">
            {/* logo */}
            <div className="mb-8 px-5 md:mx-20">
                <Link href={home()}>
                    <AppLogo className="me-auto max-h-[35px] object-contain" />
                </Link>
            </div>
            <div className="mx-auto grid w-full grid-cols-1 items-center justify-between gap-10 px-5 md:grid-cols-2 md:px-20">
                <div className="order-2 md:order-1">
                    {/* image */}
                    <img
                        src="/assets/batiment.jpg"
                        className="min-h-[90vh] w-full object-cover"
                        alt=""
                    />
                </div>
                {/* form */}
                <div className="order-1 mx-auto w-full max-w-md md:order-2">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            {/* <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>

                            <span className="sr-only">{title}</span>
                        </Link> */}

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                {/* social login icon */}
                                <div className="my-3 flex justify-between gap-4">
                                    <Link href="#" className="w-full">
                                        <div className="flex flex-1/2 justify-center rounded-md border border-gray-300 px-3 py-2">
                                            <img
                                                src="/assets/logo/google_icon.png"
                                                className="h-[40px] object-contain"
                                                alt=""
                                            />
                                        </div>
                                    </Link>
                                    <Link href="#" className="w-full">
                                        <div className="flex flex-1/2 justify-center rounded-md border border-gray-300 px-3 py-2">
                                            <img
                                                src="/assets/logo/facebook_icon.png"
                                                className="h-[40px] object-contain"
                                                alt=""
                                            />
                                        </div>
                                    </Link>
                                </div>

                                <div className="flex space-x-1">
                                    <hr className="my-4 w-full flex-1 border-t border-gray-300" />
                                    <span className="text-sm text-gray-500">
                                        ou
                                    </span>
                                    <hr className="my-4 w-full flex-1 border-t border-gray-300" />
                                </div>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
