export default function SubStrText({
    text,
    start,
    end,
    elipse = true,
}: {
    text: string;
    start: number;
    end: number;
    elipse?: boolean;
}) {
    const truncated = text.substring(start, end);
    const hasEllipse = elipse && text.length > end;

    return (
        <span>
            {truncated}
            {hasEllipse ? '...' : ''}
        </span>
    );
}
