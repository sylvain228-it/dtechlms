import UserAvater from './user-avatar';

export default function GetDatableProfile({ url }: { url: string }) {
    return url ? (
        <a href={url}>
            <img
                src={url}
                alt="Aperçu"
                className="h-full w-full object-cover"
            />
        </a>
    ) : (
        <UserAvater />
    );
}
