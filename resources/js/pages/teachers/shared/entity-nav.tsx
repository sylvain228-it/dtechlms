import { entityResources } from '@/routes/medias';
import { entityEvaluations } from '@/routes/teachers/evaluations';
import { entityQuizzes } from '@/routes/teachers/quizzes';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export function EntityNavItems({
    entity_type,
    entity_id,
}: {
    entity_type: string;
    entity_id: number;
}) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-left text-sm font-medium text-gray-700">
                Ressources / Tests
            </h3>

            <div className="mt-3 grid gap-3 text-sm text-gray-600">
                <Link href={entityResources([entity_type, entity_id])}>
                    <div className="flex items-center justify-between gap-1 bg-blue-50 p-2">
                        <dt className="font-bold text-app-blue">Ressources</dt>
                        <ArrowRight className="text-app-blue" />
                    </div>
                </Link>
                <Link href={entityQuizzes([entity_type, entity_id])}>
                    <div className="flex items-center justify-between gap-1 bg-blue-50 p-2">
                        <dt className="font-bold text-app-blue">Quize</dt>
                        <ArrowRight className="text-app-blue" />
                    </div>
                </Link>
                <Link href={entityEvaluations([entity_type, entity_id])}>
                    <div className="flex items-center justify-between gap-1 bg-blue-50 p-2">
                        <dt className="font-bold text-app-blue">
                            Evaluations/Exercices
                        </dt>
                        <ArrowRight className="text-app-blue" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
