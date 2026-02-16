import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { getSaveStatusColorClass, getSaveStatusLabel } from '@/lib/type';
import { show as showActivity } from '@/routes/teachers/activities';
import { create, destroy, edit, index } from '@/routes/teachers/criterias';
import { EvaluationCriteria } from '@/types/models/activity';
import { CourseActivity } from '@/types/models/course';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

type Props = {
    activity: CourseActivity;
    criteria: EvaluationCriteria;
};

const criterionTypeLabels: Record<string, string> = {
    knowledge: 'Connaissance',
    skill: 'Compétence',
    attitude: 'Attitude',
    transversal: 'Transversal',
};

const evaluationMethodLabels: Record<string, string> = {
    points: 'Points',
    rubric: "Grille d'évaluation",
    pass_fail: 'Validé/Non validé',
};

export default function TeacherEvaluationCriteriaDetails() {
    const { activity, criteria } = usePage().props as unknown as Props;

    const handleDelete = () => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer ce critère d'évaluation?",
            )
        ) {
            router.delete(destroy([activity.slug, criteria.id]));
        }
    };

    return (
        <TeacherLayouts
            title={`Détails - ${criteria.title} (${activity.title})`}
        >
            <div className="mx-auto mt-6 max-w-4xl px-4">
                {/* Breadcrumb & Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                            <Link
                                href={showActivity([activity.slug, ''])}
                                className="text-blue-600 hover:underline"
                            >
                                {activity.title}
                            </Link>
                            <span>/</span>
                            <Link
                                href={create(activity.slug)}
                                className="text-blue-600 hover:underline"
                            >
                                Critères d'évaluation
                            </Link>
                            <span>/</span>
                            <span className="font-medium text-gray-900">
                                {criteria.title}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {criteria.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={index(activity.slug)}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Link>
                        <Link
                            href={edit([activity.slug, criteria.id])}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <Edit className="h-4 w-4" />
                            Modifier
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="space-y-4 lg:col-span-2">
                        {/* Description */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Description
                            </h2>
                            <p className="mt-2 text-gray-700">
                                {criteria.description || (
                                    <span className="text-gray-400 italic">
                                        Aucune description fournie
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Configuration */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Configuration d'évaluation
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-md bg-gray-50 p-4">
                                    <div className="text-xs font-medium text-gray-600 uppercase">
                                        Type de critère
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                            {criterionTypeLabels[
                                                criteria.criterion_type
                                            ] || criteria.criterion_type}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-md bg-gray-50 p-4">
                                    <div className="text-xs font-medium text-gray-600 uppercase">
                                        Méthode d'évaluation
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-gray-900">
                                        {evaluationMethodLabels[
                                            criteria.evaluation_method
                                        ] || criteria.evaluation_method}
                                    </div>
                                </div>

                                <div className="rounded-md bg-gray-50 p-4">
                                    <div className="text-xs font-medium text-gray-600 uppercase">
                                        Pondération
                                    </div>
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className="text-2xl font-bold text-purple-600">
                                            {criteria.weight}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-md bg-gray-50 p-4">
                                    <div className="text-xs font-medium text-gray-600 uppercase">
                                        Statut
                                    </div>
                                    <div className="mt-2">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getSaveStatusColorClass(
                                                criteria.status,
                                            )}`}
                                        >
                                            {getSaveStatusLabel(
                                                criteria.status,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notation */}
                        {(criteria.max_score || criteria.success_threshold) && (
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                    Notation
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {criteria.max_score && (
                                        <div className="rounded-md border-l-4 border-l-green-500 bg-green-50 p-4">
                                            <div className="text-xs font-medium text-green-900 uppercase">
                                                Note maximale
                                            </div>
                                            <div className="mt-2 text-2xl font-bold text-green-700">
                                                {criteria.max_score}
                                            </div>
                                        </div>
                                    )}
                                    {criteria.success_threshold && (
                                        <div className="rounded-md border-l-4 border-l-orange-500 bg-orange-50 p-4">
                                            <div className="text-xs font-medium text-orange-900 uppercase">
                                                Seuil de réussite
                                            </div>
                                            <div className="mt-2 text-2xl font-bold text-orange-700">
                                                {criteria.success_threshold}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Options
                            </h2>
                            <div className="flex items-center gap-2">
                                {criteria.is_mandatory && (
                                    <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                                        ✓ Critère obligatoire
                                    </span>
                                )}
                                {!criteria.is_mandatory && (
                                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                                        Critère optionnel
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-4">
                        <div className="sticky top-20 space-y-4">
                            {/* Info card */}
                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                    Informations
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <div className="text-xs font-medium text-gray-500">
                                            Identifiant
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-gray-700">
                                            {criteria.id}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500">
                                            Slug
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-gray-700">
                                            {criteria.slug}
                                        </div>
                                    </div>
                                    {criteria.position && (
                                        <div>
                                            <div className="text-xs font-medium text-gray-500">
                                                Position
                                            </div>
                                            <div className="mt-1 font-medium text-gray-900">
                                                #{criteria.position}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="space-y-2">
                                <Link
                                    href={edit([activity.slug, criteria.id])}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                                >
                                    <Edit className="h-4 w-4" />
                                    Modifier le critère
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
