import AuthAdminLayoutTemplate from './admin/auth-admin-layout';

export default function AdminAuth({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <AuthAdminLayoutTemplate
            title={title}
            description={description}
            {...props}
        >
            {children}
        </AuthAdminLayoutTemplate>
    );
}
