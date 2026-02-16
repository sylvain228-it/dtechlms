import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import {
    getCriterionTypeLabel,
    getEvaluationMethodLabel,
    getSaveStatusColorClass,
    getSaveStatusLabel,
} from '@/lib/type';
import { show as showActivity } from '@/routes/teachers/activities';
import {
    create,
    destroy,
    edit,
    show as showCriteria,
} from '@/routes/teachers/criterias';
import { EvaluationCriteria } from '@/types/models/activity';
import { CourseActivity } from '@/types/models/course';
import { Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Edit, Eye, Plus, Trash2 } from 'lucide-react';

type Props = {
    activity: CourseActivity;
    criterias: EvaluationCriteria[];
};

export default function TeacherEvaluationCriterias() {
    const { activity, criterias } = usePage().props as unknown as Props;

    const handleDelete = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce critère?')) {
            router.delete(destroy([activity.slug, id]));
        }
    };

    return (
        <TeacherLayouts title={`Critères d'évaluation - ${activity.title}`}>
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Link
                                href={showActivity([activity.slug, ''])}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {activity.title}
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-sm font-medium text-gray-700">
                                Critères d'évaluation
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Critères d'évaluation
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {criterias.length} critère
                            {criterias.length !== 1 ? 's' : ''} créé
                            {criterias.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <Link
                            onClick={() => history.back()}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Link>
                        <Link
                            href={create(activity.slug)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter un critère
                        </Link>
                    </div>
                </div>

                {/* Empty state */}
                {criterias.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Aucun critère d'évaluation
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Commencez par créer votre premier critère
                            d'évaluation.
                        </p>
                        <Link
                            href={create(activity.slug)}
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Créer le premier critère
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table view */}
                        <div className="hidden overflow-x-auto rounded-lg border border-gray-200 shadow-sm md:block">
                            <table className="w-full">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Criterium
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Méthode
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Pondération
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {criterias.map((criteria) => (
                                        <tr
                                            key={criteria.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {criteria.title}
                                                    </p>
                                                    {criteria.description && (
                                                        <p className="line-clamp-1 text-sm text-gray-500">
                                                            {
                                                                criteria.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                    {getCriterionTypeLabel(
                                                        criteria.criterion_type,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {getEvaluationMethodLabel(
                                                    criteria.evaluation_method,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                                {criteria.weight}%
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getSaveStatusColorClass(
                                                        criteria.status,
                                                    )}`}
                                                >
                                                    {getSaveStatusLabel(
                                                        criteria.status,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={showCriteria([
                                                            activity.slug,
                                                            criteria.id,
                                                        ])}
                                                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50"
                                                        title="Voir les détails"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={edit([
                                                            activity.slug,
                                                            criteria.id,
                                                        ])}
                                                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                criteria.id,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card view */}
                        <div className="space-y-3 md:hidden">
                            {criterias.map((criteria) => (
                                <div
                                    key={criteria.id}
                                    className="rounded-lg border bg-white p-4 shadow-sm"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                        <div className="flex-1 pr-2">
                                            <p className="font-semibold text-gray-900">
                                                {criteria.title}
                                            </p>
                                            {criteria.description && (
                                                <p className="line-clamp-1 text-xs text-gray-500">
                                                    {criteria.description}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${getSaveStatusColorClass(
                                                criteria.status,
                                            )}`}
                                        >
                                            {getSaveStatusLabel(
                                                criteria.status,
                                            )}
                                        </span>
                                    </div>

                                    <div className="mb-3 flex gap-2">
                                        <span className="inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                            {getCriterionTypeLabel(
                                                criteria.criterion_type,
                                            )}
                                        </span>
                                        <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                            {getEvaluationMethodLabel(
                                                criteria.evaluation_method,
                                            )}
                                        </span>
                                        <span className="inline-block rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                                            Poids: {criteria.weight}
                                            {activity.note_unit}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex gap-1">
                                            <Link
                                                href={showCriteria([
                                                    activity.slug,
                                                    criteria.id,
                                                ])}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                                            >
                                                <Eye className="h-3 w-3" />
                                                Voir
                                            </Link>
                                            <Link
                                                href={edit([
                                                    activity.slug,
                                                    criteria.id,
                                                ])}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                                            >
                                                <Edit className="h-3 w-3" />
                                                Éditer
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDelete(criteria.id)
                                            }
                                            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Suppr
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </TeacherLayouts>
    );
}
