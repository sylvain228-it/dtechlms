import { PDFViewer } from '@embedpdf/react-pdf-viewer';
import { usePage } from '@inertiajs/react';
export default function ViewPdf() {
    const { pdf_url } = usePage().props as unknown as { pdf_url: string };
    console.log('url', pdf_url);
    return (
        <div style={{ height: '100vh' }}>
            <PDFViewer
                config={{
                    src: pdf_url,
                    theme: { preference: 'light' },
                }}
            />
        </div>
    );
}
