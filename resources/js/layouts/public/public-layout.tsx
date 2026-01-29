import { ReactNode } from 'react';
import { AppPublicHeader } from './app-public-header';
import { PublicFooter } from './public-footer';

interface PublicLayoutProps {
    children: ReactNode;
}
export const PublicLayout = ({ children }: PublicLayoutProps) => {
    return (
        <>
            <div className="flex min-h-screen flex-col justify-between">
                <header className="p-4 shadow-md">
                    {/* Navigation bar */}
                    {/* <PublicNav /> */}
                    <AppPublicHeader />
                </header>
                <main className="flex-grow">
                    {/* Main content */} {children}
                </main>
                <footer className="p-4 shadow-md">
                    {/* Footer content */}
                    <PublicFooter />
                </footer>
            </div>
        </>
    );
};
