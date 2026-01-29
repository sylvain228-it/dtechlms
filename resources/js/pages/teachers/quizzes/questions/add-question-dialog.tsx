import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
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
import { Spinner } from '@/components/ui/spinner';
import { quizeQuestionTypeLabels } from '@/lib/type';
import { store, update } from '@/routes/teachers/quizzes/questions';
import { QuizQuestion } from '@/types/models/others';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import React from 'react';
import { IoAdd } from 'react-icons/io5';
type Props = {
    question?: QuizQuestion;
    quizId: number;
    title: string;
    className?: string;
    iconSize?: number;
    triggerTexte?: boolean;
};

export default function QuizQuestionFormDialog({
    question,
    quizId,
    title,
    className,
    iconSize,
    triggerTexte = true,
}: Props) {
    const { errors } = usePage().props;
    const [processing, setProcessing] = React.useState(false);

    const isEdit = !!question;
    const { data, setData, reset } = useForm({
        quiz_id: quizId,
        question_text: question?.question_text ?? '',
        question_type: question?.question_type ?? '',
        points: question?.points ?? '',
        order: question?.order ?? '',
        is_mandatory: question?.is_mandatory ?? true,
        feedback_correct: question?.feedback_correct ?? '',
        feedback_incorrect: question?.feedback_incorrect ?? '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (isEdit) {
            router.put(update([quizId, question.id]), data, {
                onFinish: handleOnFinish,
            });
        } else {
            router.post(store(quizId), data, {
                onFinish: handleOnFinish,
            });
        }
    };
    const handleOnFinish = () => {
        reset();
        setProcessing(false);
    };
    const isFormValid =
        data.quiz_id != 0 &&
        data.question_type != '' &&
        data.question_text != '' &&
        data.order != '' &&
        data.order != 0 &&
        data.points != '';
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className={
                        className ??
                        'btn-primary flex w-full items-center justify-center gap-4'
                    }
                >
                    <b>
                        {triggerTexte ? (isEdit ? 'Modifier' : 'Ajouter') : ''}
                    </b>
                    {isEdit ? (
                        <Edit size={iconSize ?? 30} />
                    ) : (
                        <IoAdd size={iconSize ?? 30} />
                    )}
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{'Ajouter une question'}</DialogTitle>
                    <DialogDescription>
                        Ajouter une question pour quize : <b>{title}</b>
                    </DialogDescription>
                </DialogHeader>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="mb-4 grid w-full gap-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <TextareaField
                                    label="Texte de la question"
                                    placeholder="Entrez la question"
                                    value={data.question_text ?? ''}
                                    onChange={(val) =>
                                        setData('question_text', val)
                                    }
                                    error={errors.question_text as string}
                                    required
                                />
                            </div>

                            <InputField
                                label="Ordre d'apparition"
                                type="number"
                                value={data.order}
                                onChange={(v) => setData('order', v)}
                                error={errors.order}
                                placeholder="ex: 1, 2, 3..."
                                required
                            />

                            <div className="sm:col-span-2">
                                <SelectField
                                    options={quizeQuestionTypeLabels}
                                    value={data.question_type}
                                    label="Type de question"
                                    onChange={(val) =>
                                        setData('question_type', val)
                                    }
                                    required
                                />
                            </div>

                            <InputField
                                label="Points attribués"
                                type="number"
                                value={data.points}
                                onChange={(v) => setData('points', v)}
                                error={errors.points}
                                placeholder="ex: 10"
                                required
                            />

                            <CheckboxField
                                label="Question obligatoire"
                                checked={!!data.is_mandatory}
                                onChange={(v) => setData('is_mandatory', v)}
                            />

                            <div className="sm:col-span-2">
                                <TextareaField
                                    label="Commentaire pour réponse correcte"
                                    value={data.feedback_correct ?? ''}
                                    onChange={(v) =>
                                        setData('feedback_correct', v)
                                    }
                                    rows={4}
                                    placeholder="Message affiché en cas de bonne réponse"
                                    error={errors.feedback_correct}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <TextareaField
                                    label="Commentaire pour mauvaise réponse"
                                    value={data.feedback_incorrect ?? ''}
                                    onChange={(v) =>
                                        setData('feedback_incorrect', v)
                                    }
                                    rows={4}
                                    placeholder="Message affiché en cas de mauvaise réponse"
                                    error={errors.feedback_incorrect}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Fermer</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="btn-primary w-full"
                                tabIndex={4}
                                disabled={!isFormValid || processing}
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
