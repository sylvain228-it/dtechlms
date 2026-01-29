export default function GetHtmlContent({
    contentHtml,
}: {
    contentHtml: string;
}) {
    return (
        <div
            className="article-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
    );
}
