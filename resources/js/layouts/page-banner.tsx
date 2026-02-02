import { Button } from '@/components/ui/button';
import { redirectToDash } from '@/routes';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { MdDashboard } from 'react-icons/md';

export default function PageBanner({ title }: { title: string }) {
    const bannerImg = '/assets/learn_bg.png';
    const bgStyle = {
        background: `url(${bannerImg}) no-repeat center/cover`,
    };
    return (
        <div style={bgStyle} className="mb-4">
            <div className="flex w-full flex-col items-center justify-center gap-4 bg-black/40 px-3 py-6 text-white sm:px-7">
                <h3 className="line-clamp-2 text-center text-xl font-bold lg:text-2xl">
                    {title}
                </h3>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => history.back()}
                        className="btn-primary border border-cblue !bg-transparent !py-1 text-white"
                    >
                        <ArrowLeft />
                    </Button>
                    <Link className="btn-primary" href={redirectToDash()}>
                        <MdDashboard />
                    </Link>
                </div>
            </div>
        </div>
    );
}
