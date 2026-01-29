import AuthInstitutLayoutTemplate from '../institut/auth-institut-layout';

export default function InstitutAuth({
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
        <AuthInstitutLayoutTemplate
            title={title}
            description={description}
            {...props}
        >
            {children}
        </AuthInstitutLayoutTemplate>
    );
}
