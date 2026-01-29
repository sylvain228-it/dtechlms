import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { getSkillTypeLabel } from '@/lib/type';
import { formatBooleanText, formatDate } from '@/lib/utils';
import { destroy, edit } from '@/routes/teachers/skills';
import { Skill } from '@/types/models/skill';
import { Link, router, usePage } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';

export default function TeacherSkillShow() {
    const { skill } = usePage().props as unknown as { skill: Skill };

    const handleDelete = () => {
        if (!confirm('Confirmer la suppression de cette compétence ?')) return;
        router.delete(destroy(skill.id));
    };

    return (
        <TeacherLayouts title={`Compétence : ${skill.name}`}>
            <div className="mx-auto mt-6 max-w-6xl px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            {skill.name}
                        </h1>
                        <div className="mt-2 text-sm text-gray-500">
                            <span className="mr-2 inline-block text-xs font-medium text-gray-600">
                                Code:
                            </span>
                            <span className="text-sm text-gray-700">
                                {skill.code}
                            </span>
                        </div>

                        {skill.description && (
                            <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                                {skill.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={edit(skill.code)}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                        >
                            <Edit size={16} /> Modifier
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            <Trash size={16} /> Supprimer
                        </button>
                    </div>
                </div>

                {/* Content grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="col-span-2 space-y-4">
                        {/* Basic info card */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium text-gray-900">
                                Informations
                            </h2>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Type
                                    </p>
                                    <div className="mt-1 text-sm font-medium text-gray-800">
                                        {getSkillTypeLabel(skill.type) ??
                                            skill.type}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Domaine
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        <b>
                                            {skill.domaine
                                                ? skill.domaine?.name
                                                : '-'}
                                        </b>
                                        {skill.subdomaine
                                            ? ` — ${skill.subdomaine.name}`
                                            : ''}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Cadre / Framework
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        {skill.framework ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Niveaux
                                    </p>
                                    <div className="mt-1 text-sm text-gray-800">
                                        {skill.level_min ?? '-'} —{' '}
                                        {skill.level_max ?? '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Learning outcomes */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">
                                Résultats d’apprentissage
                            </h3>
                            <div className="mt-3 space-y-3">
                                {skill.learning_outcomes &&
                                skill.learning_outcomes.length > 0 ? (
                                    skill.learning_outcomes.map((l, idx) => (
                                        <div
                                            key={l.id ?? idx}
                                            className="rounded-md border bg-gray-50 p-3"
                                        >
                                            <div className="text-sm font-medium text-gray-800">
                                                {l.label}
                                            </div>
                                            {l.description && (
                                                <div className="mt-1 text-xs text-gray-600">
                                                    {l.description}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Aucun résultat d’apprentissage défini.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Indicators */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">
                                Indicateurs
                            </h3>
                            <div className="mt-3 space-y-2">
                                {skill.indicators &&
                                skill.indicators.length > 0 ? (
                                    <ul className="space-y-2">
                                        {skill.indicators.map((ind, idx) => (
                                            <li
                                                key={ind.id ?? idx}
                                                className="rounded-md border p-3"
                                            >
                                                <div className="text-sm font-medium text-gray-800">
                                                    {ind.label}
                                                </div>
                                                {ind.description && (
                                                    <div className="mt-1 text-xs text-gray-600">
                                                        {ind.description}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Aucun indicateur défini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right column (meta) */}
                    <aside className="col-span-1">
                        <div className="sticky top-20 rounded-lg border bg-white p-6 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-700">
                                Métadonnées
                            </h4>

                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Langue
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {skill.language ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Source
                                    </div>
                                    <div className="mt-1">
                                        {skill.source ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Active
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(!!skill.is_active)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Certifiable
                                    </div>
                                    <div className="mt-1 font-medium">
                                        {formatBooleanText(
                                            !!skill.is_certifiable,
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Version
                                    </div>
                                    <div className="mt-1">
                                        {skill.version ?? '-'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Créé
                                    </div>
                                    <div className="mt-1">
                                        {formatDate(skill.created_at)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-gray-500">
                                        Dernière mise à jour
                                    </div>
                                    <div className="mt-1">
                                        {formatDate(skill.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </TeacherLayouts>
    );
}
