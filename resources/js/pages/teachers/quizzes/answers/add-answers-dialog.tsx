import {
    CheckboxField,
    InputField,
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
import { QuizQuestionType } from '@/lib/type';
import { store, update } from '@/routes/teachers/quizzes/responses';
import { QuizAnswer, QuizQuestion } from '@/types/models/others';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import React from 'react';
import { IoAdd } from 'react-icons/io5';
type Props = {
    quizId: number;
    response?: QuizAnswer;
    question: QuizQuestion | null;
    title: string;
    className?: string;
    iconSize?: number;
    triggerTexte?: boolean;
};

export default function QuestionAnswerFormDialog({
    quizId,
    response,
    question,
    title,
    className,
    iconSize,
    triggerTexte = true,
}: Props) {
    const { errors } = usePage().props;
    const [processing, setProcessing] = React.useState(false);

    const isEdit = !!response;
    const { data, setData, reset } = useForm({
        quiz_question_id: question?.id,
        answer_text: response?.answer_text ?? '',
        numeric_value: response?.numeric_value ?? '',
        tolerance: response?.tolerance ?? '',
        order: response?.order ?? '',
        is_correct: response?.is_correct ?? false,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (isEdit) {
            router.put(update([quizId, question?.id ?? 0, response.id]), data, {
                onFinish: handleOnFinish,
            });
        } else {
            router.post(store([quizId, question?.id ?? 0]), data, {
                onFinish: handleOnFinish,
            });
        }
    };
    const handleOnFinish = () => {
        reset();
        setProcessing(false);
    };
    const isFormValid = quizId != 0 && question != null;
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
                    <DialogTitle>{'Ajouter une réponse'}</DialogTitle>
                    <DialogDescription>
                        Ajouter une réponse pour la question{' '}
                        <b>{question?.question_text}</b> du quize :{' '}
                        <b>{title}</b>
                    </DialogDescription>
                </DialogHeader>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="mb-4 grid w-full gap-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <TextareaField
                                    label="Texte de la réponse"
                                    placeholder="Entrez le contenu de la réponse"
                                    value={data.answer_text ?? ''}
                                    onChange={(val) =>
                                        setData('answer_text', val)
                                    }
                                    error={errors.answer_text as string}
                                    required
                                />
                            </div>

                            <InputField
                                label="Ordre d'apparition"
                                type="number"
                                value={data.order}
                                onChange={(v) => setData('order', v)}
                                error={errors.order}
                                placeholder="Exemple: 1, 2, 3..."
                                required
                            />

                            {question &&
                                question.question_type ==
                                    ('numeric' as QuizQuestionType) && (
                                    <div>
                                        <InputField
                                            label="Valeur numérique"
                                            type="number"
                                            value={data.numeric_value}
                                            onChange={(v) =>
                                                setData('numeric_value', v)
                                            }
                                            error={errors.numeric_value}
                                            placeholder="Exemple: 10 points"
                                            required
                                        />

                                        <InputField
                                            label="Tolérance"
                                            type="number"
                                            value={data.tolerance}
                                            onChange={(v) =>
                                                setData('tolerance', v)
                                            }
                                            error={errors.tolerance}
                                            placeholder="Exemple: 2"
                                            required
                                        />
                                    </div>
                                )}

                            <CheckboxField
                                label="Bonne réponse"
                                checked={!!data.is_correct}
                                onChange={(v) => setData('is_correct', v)}
                            />
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
