import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentLayouts from '@/layouts/student/student-layouts';
import { getQuizQuestionTypeLabel } from '@/lib/type';
import { Quiz, QuizQuestion } from '@/types/models/others';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

// -----------------------------
// Types
// -----------------------------
type StoredState = {
    currentIndex: number;
    answers: Record<number, number[] | number>; // questionId -> answerId(s)
    timeElapsed: number; // seconds
};

// -----------------------------
// Helpers
// -----------------------------
const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
};

// Local storage key helper
const storageKey = (quizIdOrSlug: number | string) =>
    `quiz_progress_${quizIdOrSlug}`;

// -----------------------------
// Main component
// -----------------------------
export default function StudentStartQuiz() {
    // Props provided by the server (Inertia) — fallback to sample data if missing
    const { quiz: serverQuiz, questions: serverQuestions } = usePage()
        .props as unknown as {
        quiz?: Quiz;
        questions?: QuizQuestion[];
    };

    const quiz = serverQuiz as Quiz;
    const questions = (
        serverQuestions && serverQuestions.length ? serverQuestions : []
    ) as QuizQuestion[];

    // Local component state (logic separated)
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [answers, setAnswers] = React.useState<
        Record<number, number[] | number>
    >({});
    const [timeElapsed, setTimeElapsed] = React.useState<number>(0);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(
        null,
    );
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const total = questions.length;

    // Timer ref to keep interval id
    const timerRef = React.useRef<number | null>(null);

    // Load persisted state from localStorage if present
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey(quiz.slug ?? quiz.id));
            if (raw) {
                const parsed = JSON.parse(raw) as StoredState;
                if (typeof parsed.currentIndex === 'number')
                    setCurrentIndex(parsed.currentIndex);
                if (parsed.answers)
                    setAnswers(
                        parsed.answers as Record<number, number[] | number>,
                    );
                if (typeof parsed.timeElapsed === 'number')
                    setTimeElapsed(parsed.timeElapsed);
            }
        } catch (e) {
            console.error('Error parsing stored quiz state', e);
        }
    }, [quiz.slug, quiz.id]);

    // Start timer on mount
    React.useEffect(() => {
        // Use window.setInterval for consistency in TS
        timerRef.current = window.setInterval(() => {
            setTimeElapsed((t) => t + 1);
        }, 1000) as unknown as number;

        const handleBeforeUnload = () => {
            saveLocal();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            saveLocal();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist to local storage whenever answers, currentIndex or timeElapsed change
    React.useEffect(() => {
        saveLocal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, currentIndex, timeElapsed]);

    // Save state helper
    function saveLocal() {
        try {
            const payload: StoredState = {
                currentIndex,
                answers,
                timeElapsed,
            };
            localStorage.setItem(
                storageKey(quiz.slug ?? quiz.id),
                JSON.stringify(payload),
            );
        } catch (e) {
            console.error('Could not save quiz state', e);
        }
    }

    // Clear stored state after successful submission
    function clearLocal() {
        try {
            localStorage.removeItem(storageKey(quiz.slug ?? quiz.id));
        } catch (e) {
            console.error('Could not clear quiz state', e);
        }
    }

    // Handle selection change (radio / checkbox)
    function handleSelect(
        question: QuizQuestion,
        answerId: number,
        multi: boolean,
    ) {
        setAnswers((prev) => {
            const copy = { ...prev };
            const qid = question.id;
            if (multi) {
                const existing = (copy[qid] as number[]) ?? [];
                const idx = existing.indexOf(answerId);
                if (idx >= 0) existing.splice(idx, 1);
                else existing.push(answerId);
                copy[qid] = existing;
            } else {
                copy[qid] = answerId;
            }
            return copy;
        });
    }

    // Navigation helpers
    function goNext() {
        if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
    }
    function goPrev() {
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    }

    // Validation — if question is mandatory, ensure there's at least one answer
    function isQuestionAnswered(q: QuizQuestion) {
        const a = answers[q.id];
        if (q.is_mandatory) {
            if (Array.isArray(a)) return a.length > 0;
            return !!a;
        }
        return true;
    }

    // Submit handler — send data to API then clear local
    async function handleSubmit() {
        // Basic validation
        const unanswered = questions.filter(
            (q) => q.is_mandatory && !isQuestionAnswered(q),
        );
        if (unanswered.length) {
            setErrorMessage(
                `Veuillez répondre à toutes les questions obligatoires (${unanswered.length}).`,
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        const payload = {
            quiz_id: quiz.id,
            answers: Object.entries(answers).map(([qid, value]) => ({
                question_id: Number(qid),
                answer: value,
            })),
            time_elapsed_seconds: timeElapsed,
        };

        try {
            // Replace endpoint with your real API endpoint
            const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Server responded ${res.status}`);

            const data = await res.json();
            clearLocal();
            setSuccessMessage('Quiz envoyé avec succès. Merci !');
            // Optionally redirect to results page, e.g. using Inertia
            // router.post(route('student.quizzes.submit', quiz.slug), payload)
        } catch (e) {
            console.error('Submission error', e);
            setErrorMessage(
                'Une erreur est survenue lors de l’envoi. Réessayez plus tard.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    // Render helpers
    const currentQuestion = questions[currentIndex];
    const selectedForCurrent = answers[currentQuestion?.id ?? -1];

    return (
        <StudentLayouts title={`Quiz : ${quiz.title ?? 'Quiz'}`}>
            <div className="mx-auto mt-6 max-w-3xl px-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {quiz.title ?? 'Quiz'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Progression:{' '}
                            <span className="font-medium">
                                Question {currentIndex + 1} / {total}
                            </span>
                        </p>
                    </div>

                    <div className="text-sm text-gray-600">
                        <div className="mb-1 text-right">Temps écoulé</div>
                        <div className="rounded-md bg-gray-100 px-3 py-1 font-mono text-sm">
                            {formatTime(timeElapsed)}
                        </div>
                    </div>
                </div>
                <Badge className="mb-4" variant={'outline'}>
                    {getQuizQuestionTypeLabel(currentQuestion.question_type)}
                </Badge>

                {errorMessage && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {successMessage}
                    </div>
                )}

                {/* Question card */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="text-sm text-gray-500">
                                Question {currentIndex + 1} •{' '}
                                {currentQuestion.points} pts
                            </div>
                            <h2 className="mt-2 text-lg font-semibold text-gray-800">
                                {currentQuestion.question_text}
                            </h2>

                            <div className="mt-4 space-y-3">
                                {(currentQuestion.answers ?? []).map((ans) => {
                                    const multi =
                                        currentQuestion.question_type ===
                                        'multiple_choice';
                                    const checked = multi
                                        ? Array.isArray(selectedForCurrent) &&
                                          (
                                              selectedForCurrent as number[]
                                          ).includes(ans.id)
                                        : selectedForCurrent === ans.id;

                                    return (
                                        <label
                                            key={ans.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition hover:bg-gray-50"
                                        >
                                            <input
                                                type={
                                                    multi ? 'checkbox' : 'radio'
                                                }
                                                name={`q_${currentQuestion.id}`}
                                                checked={checked}
                                                onChange={() =>
                                                    handleSelect(
                                                        currentQuestion,
                                                        ans.id,
                                                        multi,
                                                    )
                                                }
                                                className="h-4 w-4"
                                            />
                                            <div className="text-sm text-gray-700">
                                                {ans.answer_text}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <Button
                                variant="outline"
                                onClick={goPrev}
                                disabled={currentIndex === 0}
                            >
                                Précédent
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            {currentIndex < total - 1 ? (
                                <Button
                                    onClick={goNext}
                                    disabled={
                                        !isQuestionAnswered(currentQuestion)
                                    }
                                >
                                    Suivant
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Envoi...' : 'Envoyer'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-400">
                    Vos réponses sont automatiquement sauvegardées localement.
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/student/quizzes"
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Retour à la liste des quizzes
                    </Link>
                </div>
            </div>
        </StudentLayouts>
    );
}
