/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

type UseTmpUploadOptions = {
    onUploadSuccess?: (data: any) => void;
    onUploadError?: (err: any) => void;
    onRemoveSuccess?: () => void;
    onRemoveError?: (err: any) => void;
};

export function useTmpUploadMultiple(opts: UseTmpUploadOptions = {}) {
    const [file, setFile] = useState<File | null>(null);
    const [tmpPath, setTmpPath] = useState<string>('');
    const [filePreview, setPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const upload = useCallback(
        async (f: File | null) => {
            if (!f) return;
            setIsUploading(true);
            setFile(f);

            // preview
            const previewUrl = URL.createObjectURL(f);
            setPreview(previewUrl);

            const fd = new FormData();
            fd.append('file', f);

            try {
                const resp = await axios.post('/upload-to-tmp', fd, {
                    onUploadProgress: (ev) => {
                        const percent = Math.round(
                            (ev.loaded * 100) / (ev.total || 1),
                        );
                        setUploadProgress(percent);
                    },
                });
                setTmpPath(resp.data.path);
                // Passer les données du fichier en callback
                opts.onUploadSuccess?.({
                    ...resp.data,
                });
            } catch (err) {
                opts.onUploadError?.(err);
                throw err;
            } finally {
                setIsUploading(false);
            }
        },
        [opts],
    );

    const remove = useCallback(
        async (tmpPath: string | null) => {
            if (!tmpPath) return;
            setIsRemoving(true);
            try {
                const fd = new FormData();
                fd.append('tmp_path', tmpPath);
                await axios.post('/remove-from-tmp', fd);
                setTmpPath('');
                setFile(null);
                setPreview(null);
                setUploadProgress(0);
                opts.onRemoveSuccess?.();
            } catch (err) {
                opts.onRemoveError?.(err);
                throw err;
            } finally {
                setIsRemoving(false);
            }
        },
        [opts],
    );

    // cleanup preview URL when component unmounts / preview changes
    useEffect(() => {
        return () => {
            if (filePreview) URL.revokeObjectURL(filePreview);
        };
    }, [filePreview]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        tmpPath?: string | null,
    ) => {
        const f = e.target.files?.[0] ?? null;
        if (tmpPath) remove(tmpPath);
        if (f) upload(f);
        else {
            setFile(null);
            setPreview(null);
            setTmpPath('');
        }
    };

    return {
        file,
        tmpPath,
        filePreview,
        uploadProgress,
        isUploading,
        isRemoving,
        handleFileChange,
        upload, // optional direct call
        remove,
        setTmpPath,
        setFile,
        setPreview,
    };
}
