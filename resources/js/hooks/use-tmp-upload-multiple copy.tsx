/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadElementType } from '@/types';
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
    const [tmpPath, setTmpPath] = useState<UploadElementType[]>([]);
    const [filePreview, setPreview] = useState<UploadElementType[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadElementType[]>(
        [],
    );
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const upload = useCallback(
        async (f: File | null, key: number) => {
            if (!f) return;
            setIsUploading(true);
            setFile(f);

            // preview
            const previewUrl = URL.createObjectURL(f);
            setPreview((prev) => [...prev, { key, value: previewUrl }]);

            const fd = new FormData();
            fd.append('file', f);

            try {
                const resp = await axios.post('/upload-to-tmp', fd, {
                    onUploadProgress: (ev) => {
                        const percent = Math.round(
                            (ev.loaded * 100) / (ev.total || 1),
                        );
                        setUploadProgress((prev) => [
                            ...prev.filter((p) => p.key !== key),
                            { key, value: percent.toString() },
                        ]);
                    },
                });
                setTmpPath((prev) => [...prev, { key, value: resp.data.path }]);
                opts.onUploadSuccess?.(resp.data);
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
        async (key: number) => {
            const pathItem = tmpPath.find((p) => p.key === key);
            if (!pathItem?.value) return;
            setIsRemoving(true);
            try {
                const fd = new FormData();
                fd.append('tmp_path', pathItem.value);
                await axios.post('/remove-from-tmp', fd);
                setTmpPath((prev) => prev.filter((p) => p.key !== key));
                setFile(null);
                setPreview((prev) => prev.filter((p) => p.key !== key));
                setUploadProgress((prev) => prev.filter((p) => p.key !== key));
                opts.onRemoveSuccess?.();
            } catch (err) {
                opts.onRemoveError?.(err);
                throw err;
            } finally {
                setIsRemoving(false);
            }
        },
        [tmpPath, opts],
    );

    // cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            filePreview.forEach((item) => {
                if (item.value) URL.revokeObjectURL(item.value);
            });
        };
    }, [filePreview]);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: number,
    ) => {
        const f = e.target.files?.[0] ?? null;
        if (f) upload(f, key);
        else {
            setFile(null);
            setPreview((prev) => prev.filter((p) => p.key !== key));
            setTmpPath((prev) => prev.filter((p) => p.key !== key));
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
        upload,
        remove,
        setTmpPath,
        setFile,
        setPreview,
    };
}
