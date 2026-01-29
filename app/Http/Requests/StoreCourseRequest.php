<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     */
    public function authorize(): bool
    {
        // Remplacez par votre logique (policies/permissions) si nécessaire
        return true;
    }

    /**
     * Règles de validation pour la création d'un cours.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:300',
            'short_title' => 'nullable|string|max:150',
            'slug' => 'required|string|max:300|unique:courses,slug',
            'description' => 'nullable|string',
            'syllabus' => 'nullable|string',

            'category_id' => 'required|exists:categories,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'institut_id' => 'nullable|exists:instituts,id',

            'status' => ['nullable', Rule::in(['draft', 'review', 'published', 'archived'])],
            'review_status' => 'nullable|array',

            'course_type' => ['nullable', Rule::in(['professional', 'university', 'hybrid', 'online'])],
            'level' => ['nullable', Rule::in(['all_level', 'beginner', 'intermediate', 'advanced', 'expert'])],

            'language' => 'nullable|string|max:10',
            'academic_year' => 'nullable|string|max:20',

            'prerequisites' => 'nullable|array',
            'target_audience' => 'nullable|array',
            'learning_outcomes' => 'nullable|array',

            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',

            'duration_minutes' => 'nullable|integer|min:0',
            'total_hours' => 'nullable|integer|min:0',
            'estimated_days' => 'nullable|integer|min:0',
            'estimated_weeks' => 'nullable|integer|min:0',
            'estimated_months' => 'nullable|integer|min:0',

            'is_modular' => 'sometimes|boolean',
            'is_certifying' => 'sometimes|boolean',
            'certification_details' => 'nullable|string',
            'is_competency_based' => 'sometimes|boolean',

            'version' => 'nullable|integer|min:1',
            'parent_course_id' => 'nullable|exists:courses,id',

            'cover_url' => 'nullable|url',
            'cover_public_id' => 'nullable|string',

            'price' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Messages d'erreur personnalisés (FR).
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre du cours est requis.',
            'title.max' => 'Le titre ne doit pas dépasser :max caractères.',
            'slug.required' => 'Le slug est requis.',
            'slug.unique' => 'Ce slug est déjà utilisé.',
            'category_id.required' => 'La catégorie est requise.',
            'category_id.exists' => 'La catégorie sélectionnée est invalide.',
            'start_date.date' => 'La date de début est invalide.',
            'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
            'price.numeric' => 'Le prix doit être un nombre.',
        ];
    }

    /**
     * Normalisations avant validation (optionnel).
     */
    protected function prepareForValidation(): void
    {
        // Convertir certains champs venant de formulaires (ex: checkboxes) en boolean
        $this->merge([
            'is_modular' => $this->boolean('is_modular'),
            'is_certifying' => $this->boolean('is_certifying'),
            'is_competency_based' => $this->boolean('is_competency_based'),
        ]);
    }
}
