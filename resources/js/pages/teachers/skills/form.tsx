import {
    CheckboxField,
    InputField,
    SelectField,
    TextareaField,
} from '@/components/shared/form';
import SelectFormShared from '@/components/shared/select-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { langueLabels, skillTypeLabels } from '@/lib/type';
import { store, update } from '@/routes/teachers/skills';
import { Domaine } from '@/types/models/course';
import { Skill } from '@/types/models/skill';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

type SkillFormProps = {
    skill?: Skill;
    domaines: Domaine[];
};
export default function SkillForm() {
    // backend may return 'skill' prop
    const { skill, domaines } = usePage().props as unknown as SkillFormProps;
    const isEdit = !!skill;
    const { errors } = usePage().props;

    const { data, setData, reset } = useForm({
        code: skill?.code ?? '',
        name: skill?.name ?? '',
        description: skill?.description ?? '',
        domaine_id: skill?.domaine_id ?? null,
        sub_domaine_id: skill?.sub_domaine_id ?? null,
        type: skill?.type ?? '',
        level_min: skill?.level_min ?? null,
        level_max: skill?.level_max ?? null,
        framework: skill?.framework ?? '',
        is_active: skill?.is_active ?? true,
        is_certifiable: skill?.is_certifiable ?? false,
        language: skill?.language ?? 'fr',
        source: skill?.source ?? '',
    });

    const [processing, setProcessing] = useState(false);
    const [domValue, setDomValue] = useState<number | null>(
        skill ? (skill.domaine_id ?? null) : null,
    );
    const [subDomValue, setSubDomValue] = useState<number | null>(
        skill ? (skill.sub_domaine_id ?? null) : null,
    );
    const subDomaines = useMemo(() => {
        if (!data.domaine_id) return [];
        return (domaines.find((d) => d.id === data.domaine_id)?.subdomaines ||
            []) as Domaine[];
    }, [data.domaine_id, domaines]);
    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            ...data,
            _method: isEdit ? 'put' : 'post',
        };
        if (isEdit && skill?.id) {
            router.put(update(skill.id), payload, {
                onFinish: onFinish,
            });
        } else {
            router.post(store(), payload, {
                onFinish: onFinish,
            });
        }
    };
    function onFinish() {
        // reset form only if creating new skill
        if (!isEdit) {
            reset();
        }
        setProcessing(false);
    }
    function handleChangeDomain(val: number | null) {
        setDomValue(val);
        setData('domaine_id', val);
    }
    function handleChangeSubDomain(val: number | null) {
        setSubDomValue(val);
        setData('sub_domaine_id', val);
    }

    const isFormValid = data.code && data.name && data.type && data.language;

    return (
        <TeacherLayouts
            title={isEdit ? 'Modifier la compétence' : 'Nouvelle compétence'}
        >
            <div className="mx-auto mt-8 max-w-3xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        {isEdit
                            ? 'Modifier la compétence'
                            : 'Créer une compétence'}
                    </h2>

                    <Button
                        className="btn-primary"
                        disabled={!isFormValid || processing}
                        onClick={(e) => {
                            e.preventDefault();
                            submitForm(e as unknown as React.FormEvent);
                        }}
                    >
                        {processing && <Spinner />}
                        Enregistrer
                    </Button>
                </div>

                <form
                    onSubmit={submitForm}
                    className="rounded-lg border bg-white p-6 shadow"
                    method="POST"
                >
                    {/* Identification */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <InputField
                            label="Code"
                            value={data.code}
                            onChange={(v) => setData('code', v)}
                            required
                            error={errors.code}
                            placeholder="ex: SKL-001"
                        />
                        <InputField
                            label="Nom"
                            value={data.name}
                            onChange={(v) => setData('name', v)}
                            required
                            error={errors.name}
                            placeholder="Nom de la compétence"
                        />
                    </div>

                    <div className="mb-4">
                        <TextareaField
                            label="Description"
                            value={data.description ?? ''}
                            onChange={(v) => setData('description', v)}
                            rows={4}
                            placeholder="Courte description de la compétence"
                            error={errors.description}
                        />
                    </div>

                    {/* Structuration */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Domaine</Label>
                            <SelectFormShared
                                options={domaines}
                                label="Sélectionner une catégorie"
                                value={domValue}
                                onSelect={(val) => handleChangeDomain(val)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Sous Domaine</Label>
                            <SelectFormShared
                                options={subDomaines}
                                label="Sélectionner une sous catégorie"
                                value={subDomValue}
                                onSelect={(val) => handleChangeSubDomain(val)}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <SelectField
                            label="Type"
                            value={data.type ?? ''}
                            onChange={(v) => setData('type', v)}
                            options={skillTypeLabels}
                            required
                            error={errors.type}
                        />
                    </div>

                    {/* Niveau & cadre */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                        <InputField
                            label="Niveau min"
                            type="number"
                            value={data.level_min ?? ''}
                            onChange={(v) =>
                                setData('level_min', v ? Number(v) : null)
                            }
                            error={errors.level_min}
                            placeholder="ex: 1"
                        />
                        <InputField
                            label="Niveau max"
                            type="number"
                            value={data.level_max ?? ''}
                            onChange={(v) =>
                                setData('level_max', v ? Number(v) : null)
                            }
                            error={errors.level_max}
                            placeholder="ex: 5"
                        />
                        <InputField
                            label="Cadre / Framework"
                            value={data.framework ?? ''}
                            onChange={(v) => setData('framework', v)}
                            error={errors.framework}
                            placeholder="ex: Référence européenne / internal"
                        />
                    </div>

                    {/* Gouvernance */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <CheckboxField
                                label="Active"
                                checked={!!data.is_active}
                                onChange={(v) => setData('is_active', v)}
                            />
                        </div>

                        <div>
                            <CheckboxField
                                label="Certifiable"
                                checked={!!data.is_certifiable}
                                onChange={(v) => setData('is_certifiable', v)}
                            />
                        </div>
                    </div>

                    {/* Métadonnées */}
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <SelectField
                            label="Langue"
                            value={data.language ?? ''}
                            onChange={(v) => setData('language', v)}
                            options={langueLabels}
                            required
                            error={errors.language}
                        />

                        <InputField
                            label="Source"
                            value={data.source ?? ''}
                            onChange={(v) => setData('source', v)}
                            error={errors.source}
                            placeholder="ex: bank, partner, manual"
                        />
                    </div>

                    {/* Footer actions */}
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => history.back()}
                            className="border"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={!isFormValid || processing}
                        >
                            {processing && <Spinner />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </div>
        </TeacherLayouts>
    );
}
