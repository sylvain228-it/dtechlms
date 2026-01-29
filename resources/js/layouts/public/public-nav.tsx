import AppLogo from '@/components/app-logo-icon';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { login, register } from '@/routes/auth';
import { Link } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';

export const PublicNav = () => {
    return (
        <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-4">
                <AppLogo className="h-[20px]" />
                <Link>Découvrir</Link>
                <InputGroup>
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <nav className="">
                <ul className="flex items-center space-x-2">
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>
                    {/* auth */}
                    <li>
                        <div className="flex items-center space-x-2">
                            <Link
                                href={login()}
                                className="btn-primary !hover:bg-app-blue !hover:text-white !my-1 border border-current !bg-transparent !text-app-blue"
                            >
                                Se connecter
                            </Link>
                            <Link href={register()} className="btn-primary">
                                S'inscrire
                            </Link>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
