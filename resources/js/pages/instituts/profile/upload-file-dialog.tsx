import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { updatelogo } from '@/routes/institut/profile';
import { router, usePage } from '@inertiajs/react';
import { Edit2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function UploadFileDialog({
    inputName,
    className,
}: {
    inputName: string;
    className?: string;
}) {
    const { errors } = usePage().props;

    const [values, setValues] = useState({
        inputName: null,
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setValues({
            ...values,
            [e.target.name]: e.target.files == null ? null : e.target.files[0],
        });
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const data = {
            ...values,
        };
        router.post(updatelogo(), data);
    };
    const [processing, setProcessing] = useState(false);
    useEffect(() => {
        (() => {
            setProcessing(false);
        })();
    }, [errors]);
    return (
        <Dialog>
            <DialogTrigger
                asChild
                className={cn('absolute', className ?? 'top-5 right-5')}
            >
                <Button
                    variant="outline"
                    className="bg-cblue/30 cursor-pointer text-white"
                >
                    <Edit2Icon />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                <DialogHeader className="w-full">
                    <DialogTitle className="w-full">
                        {inputName == 'cover' ? 'Photo couverture' : 'Logo'}
                    </DialogTitle>
                    <DialogDescription className="w-full">
                        {inputName == 'cover'
                            ? 'Mise à jour photo couverture'
                            : 'Mise à jour logo'}
                    </DialogDescription>
                </DialogHeader>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="grid w-full gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">
                                {inputName == 'cover'
                                    ? 'Image de couverture'
                                    : 'Image du logo'}
                            </Label>
                            <input
                                type="file"
                                className="form-input !w-full"
                                name={inputName}
                                id=""
                                onChange={handleFileChange}
                            />
                            {errors.inputName && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.inputName}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline">Fermer</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="btn-primary w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="create-category-button"
                            >
                                {processing && <Spinner />}
                                Enregistrer
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
