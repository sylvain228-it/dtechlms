import { Button } from '@/components/ui/button';
import { dashboard as studentDash } from '@/routes/students';
import { dashboard as teacherDash } from '@/routes/teachers';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { MdDashboard } from 'react-icons/md';

export default function UserPageBanner({ title }: { title: string }) {
    const bannerImg = '/assets/learn_bg.png';
    const bgStyle = {
        background: `url(${bannerImg}) no-repeat center/cover`,
    };
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const dashboardUrl =
        auth.user.account_role == 'student'
            ? studentDash().url
            : auth.user.account_role == 'teacher'
              ? teacherDash().url
              : '/';
    return (
        <div style={bgStyle} className="mb-4">
            <div className="flex w-full flex-col items-center justify-center gap-4 bg-black/40 p-7 text-white">
                <h3 className="text-xl font-bold lg:text-2xl">{title}</h3>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => history.back()}
                        className="btn-primary border border-app-blue !bg-transparent !py-1 text-white"
                    >
                        <ArrowLeft />
                    </Button>
                    <Link className="btn-primary" href={dashboardUrl}>
                        <MdDashboard />
                    </Link>
                </div>
            </div>
        </div>
    );
}
