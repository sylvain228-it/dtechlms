import {
    CheckboxField,
    InputField,
    SelectField,
} from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { sendSyllabusToApi } from '@/lib/tasks';
import {
    courseLevelLabels,
    courseTypesLabels,
    langueLabels,
    modalityTypeLabels,
} from '@/lib/type';
import { cn } from '@/lib/utils';
import { store, update } from '@/routes/teachers/courses';
import { Course, Domaine } from '@/types/models/course';
import { Input } from '@headlessui/react';
import { router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import CustomTextEditor from './text-editor';

export default function TeacherCoursesCreate() {
    const { errors } = usePage().props;
    const { domaines } = usePage().props as unknown as {
        domaines: Domaine[];
    };
    const { course } = usePage().props as unknown as {
        course: Course;
    };

    const [values, setValues] = useState({
        title: course !== undefined ? course.title : '',
        price: course !== undefined ? course.price : '',
        level: course !== undefined ? course.level : '',
        language: course !== undefined ? course.language : 'fr',
        course_type: course !== undefined ? course.course_type : '',
        modality: course !== undefined ? course.modality : '',
        academic_year: course !== undefined ? course.academic_year : '',
        description: course !== undefined ? course.description : '',
        cover: null,
        domaine_id: course !== undefined ? course.domaine_id : '',
        estimated_days: course !== undefined ? course.estimated_days : '',
        total_hours: course !== undefined ? course.total_hours : '',
        start_date: course !== undefined ? course.start_date : '',
        is_free: course == undefined ? 0 : course.is_free === 1,
        is_certifying: course == undefined ? 0 : course.is_certifying === 1,
        // is_modular: course == undefined ? 0 : course.is_modular === 1,
        // is_competency_based:
        //     course == undefined ? 0 : course.is_competency_based === 1,
        estimated_weeks: course !== undefined ? course.estimated_weeks : '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }
    function handleAreChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setValues({
            ...values,
            [e.target.name]: e.target.files == null ? null : e.target.files[0],
        });
    }

    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [domValue, setDomValue] = useState(
        course != undefined && course.domaine_id != null
            ? course.domaine_id
            : 0,
    );

    function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        submitForm();
    }

    function submitForm() {
        setProcessing(true);
        async function submitForm() {
            try {
                const oldId = course != undefined ? course.id : 0;
                await sendSyllabusToApi(oldId).then(() => {
                    const data = {
                        ...values,
                        _method: course == undefined ? 'post' : 'put',
                    };

                    if (course != undefined) {
                        router.post(update(course.id), data, {
                            forceFormData: true,
                            onFinish: () => setProcessing(false),
                        });
                    } else {
                        router.post(store(), data, {
                            forceFormData: true,
                            onFinish: () => setProcessing(false),
                        });
                    }
                });
            } catch (err) {
                console.error('Failed to convert editor state to HTML', err);
            }
        }
        submitForm();
    }

    function submitFormByClick(e: React.MouseEvent) {
        e.preventDefault();
        submitForm();
    }

    const listYears = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
        listYears.push(`${i}-${i + 1}`);
    }

    const isFormValid =
        values.description &&
        values.title &&
        values.price &&
        values.total_hours &&
        values.academic_year &&
        values.course_type &&
        values.level &&
        values.modality;

    return (
        <TeacherLayouts
            title={
                course == undefined
                    ? 'Ajouter un cours'
                    : `Modifier ${course.title}`
            }
        >
            <div className="mx-auto p-5 shadow md:max-w-4xl">
                <div className="mb-5 flex items-center justify-between border-b p-3">
                    <h1 className="text-2xl font-bold">
                        {course == undefined
                            ? 'Ajouter un cours'
                            : 'Modifier le cours'}
                    </h1>
                    <Button
                        className="btn-primary"
                        disabled={processing || !isFormValid}
                        onClick={submitFormByClick}
                    >
                        {processing && <Spinner />}
                        {'Enregistrer'}
                    </Button>
                </div>
                <form
                    className="mb-5"
                    method="POST"
                    id="submitForm"
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                >
                    {/* other form inputs like title, description, etc. */}
                    <Input
                        type="hidden"
                        name="domaine_id"
                        id="domaine_id"
                        value={domValue === 0 ? '' : domValue}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                        {/* catégorie parente */}

                        <div className="grid gap-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Domaine du cours
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {domValue
                                            ? domaines.find(
                                                  (catego) =>
                                                      catego.id === domValue,
                                              )?.name
                                            : 'Sélectionner un domaine...'}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-full p-0"
                                    align="start"
                                >
                                    <Command>
                                        <CommandInput
                                            placeholder="Rechercher un domaine..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                Pas de domaine trouvée.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {domaines.map((catego) => (
                                                    <CommandItem
                                                        key={catego.id}
                                                        value={`${catego.id}`}
                                                        onSelect={(
                                                            currentValue,
                                                        ) => {
                                                            setDomValue(
                                                                currentValue ===
                                                                    domValue.toFixed()
                                                                    ? 0
                                                                    : parseInt(
                                                                          currentValue,
                                                                      ),
                                                            );
                                                            setValues({
                                                                ...values,
                                                                domaine_id:
                                                                    currentValue,
                                                            });

                                                            setOpen(false);
                                                        }}
                                                    >
                                                        {catego.name}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                domValue ===
                                                                    catego.id
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-2">
                            <SelectField
                                label="Année Scolaire"
                                value={values.academic_year ?? ''}
                                onChange={(value) =>
                                    setValues({
                                        ...values,
                                        ['academic_year']: value,
                                    })
                                }
                                required
                                options={listYears.map((year) => ({
                                    key: year,
                                    value: year,
                                }))}
                                error={errors.academic_year}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Titre du cours
                            </Label>
                            <input
                                type="text"
                                className="form-input"
                                name="title"
                                placeholder="Titre du cours"
                                value={values.title}
                                onChange={handleChange}
                                id=""
                            />
                            <p className="text-xs text-red-500">
                                {errors.title}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Prix du cours
                            </Label>
                            <input
                                type="number"
                                className="form-input"
                                name="price"
                                value={values.price}
                                placeholder="Prix du cours"
                                onChange={handleChange}
                                id=""
                            />
                            <p className="text-xs text-red-500">
                                {errors.price}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Durée en heure
                            </Label>
                            <input
                                type="number"
                                className="form-input"
                                name="total_hours"
                                value={values.total_hours ?? ''}
                                placeholder="Durée de la formation en heure"
                                onChange={handleChange}
                                id=""
                            />
                            <p className="text-xs text-red-500">
                                {errors.total_hours}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Estimation en jours
                            </Label>
                            <input
                                type="number"
                                className="form-input"
                                name="estimated_days"
                                value={values.estimated_days ?? ''}
                                placeholder="Durée estimée en jours"
                                onChange={handleChange}
                                id=""
                            />
                            <p className="text-xs text-red-500">
                                {errors.estimated_days}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Estimation en semaine
                            </Label>
                            <input
                                type="number"
                                className="form-input"
                                name="estimated_weeks"
                                value={values.estimated_weeks ?? ''}
                                placeholder="Durée estimée en semaine"
                                onChange={handleChange}
                                id=""
                            />
                            <p className="text-xs text-red-500">
                                {errors.estimated_weeks}
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <SelectField
                                label="Type de cours"
                                value={values.course_type ?? ''}
                                onChange={(value) =>
                                    setValues({
                                        ...values,
                                        ['course_type']: value,
                                    })
                                }
                                required
                                options={courseTypesLabels}
                                error={errors.course_type}
                            />
                        </div>

                        <div className="grid gap-2">
                            <SelectField
                                label="Niveau du cours"
                                value={values.level ?? ''}
                                onChange={(value) =>
                                    setValues({
                                        ...values,
                                        ['level']: value,
                                    })
                                }
                                required
                                options={courseLevelLabels}
                                error={errors.level}
                            />
                        </div>

                        <div className="grid gap-2">
                            <SelectField
                                label="Modalité"
                                value={values.modality ?? ''}
                                onChange={(value) =>
                                    setValues({
                                        ...values,
                                        ['modality']: value,
                                    })
                                }
                                required
                                options={modalityTypeLabels}
                                error={errors.modality}
                            />
                        </div>
                        <div className="grid gap-2">
                            <SelectField
                                label="Langue du cours"
                                value={values.language ?? ''}
                                onChange={(value) =>
                                    setValues({
                                        ...values,
                                        ['language']: value,
                                    })
                                }
                                options={langueLabels}
                                error={errors.language}
                            />
                        </div>

                        <div className="grid gap-2">
                            <InputField
                                label="Date du début"
                                type="date"
                                value={values.start_date ?? ''}
                                onChange={(value) =>
                                    setValues({ ...values, start_date: value })
                                }
                                error={errors.start_date}
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Petite description
                            </Label>
                            <textarea
                                name="description"
                                className="form-input"
                                id=""
                                placeholder="Petite descitpion"
                                onChange={handleAreChange}
                                defaultValue={values.description ?? ''}
                            ></textarea>
                            <p className="text-xs text-red-500">
                                {errors.description}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <CheckboxField
                                label="Cours gratuit?"
                                checked={values.is_free == 1 ? true : false}
                                onChange={(checked) =>
                                    setValues({
                                        ...values,
                                        is_free: checked,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <CheckboxField
                                label="Cours Certifiant?"
                                checked={
                                    values.is_certifying == 1 ? true : false
                                }
                                onChange={(checked) =>
                                    setValues({
                                        ...values,
                                        is_certifying: checked,
                                    })
                                }
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label className="mb-2 block font-medium text-gray-700">
                                Image de couverture
                            </Label>
                            {course != undefined &&
                                course.cover_url != null && (
                                    <div className="my-3">
                                        <a href={course.cover_url}>
                                            <img
                                                src={course.cover_url}
                                                className="max-h-[200px] w-full object-cover"
                                                alt=""
                                            />
                                        </a>
                                    </div>
                                )}
                            <input
                                type="file"
                                className="form-input"
                                name="cover"
                                id=""
                                onChange={handleFileChange}
                            />
                            <p className="text-xs text-red-500">
                                {errors.cover}
                            </p>
                        </div>
                    </div>
                    <div className="my-4">
                        <h3 className="mb-3 text-2xl font-semibold">
                            Syllabus du cours
                        </h3>
                        <CustomTextEditor isNew={course == undefined} />
                        <p className="text-xs text-red-500">
                            {errors.syllabus}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="btn-primary mt-4 w-full"
                        tabIndex={4}
                        disabled={processing || !isFormValid}
                        data-test="create-category-button"
                    >
                        {processing && <Spinner />}
                        {'Enregistrer le cours'}
                    </Button>
                </form>
            </div>
        </TeacherLayouts>
    );
}
