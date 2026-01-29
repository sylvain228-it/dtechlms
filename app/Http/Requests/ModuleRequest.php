<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ModuleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Relations
            'course_id' => ['required', 'exists:courses,id'],
            // Informations générales
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'syllabus' => ['nullable', 'string'],

            // Organisation pédagogique
            'order' => ['required', 'integer', 'min:1'],
            'estimated_hours' => ['nullable', 'integer', 'min:0'],
            'estimated_days' => ['nullable', 'integer', 'min:0'],

            // Typologie pédagogique
            'module_type' => [
                'required',
                Rule::in([
                    'core',
                    'elective',
                    'remedial',
                    'advanced',
                    'capstone',
                ]),
            ],

            // Modalités
            'modality' => [
                'required',
                Rule::in([
                    'onsite',
                    'online',
                    'hybrid',
                    'asynchronous'
                ]),
            ],


            // Approche pédagogique
            'is_competency_based' => ['boolean'],
            'is_certifying' => ['boolean'],
            'is_mandatory' => ['boolean'],

            // Évaluation
            'has_evaluation' => ['boolean'],
            'evaluation_weight' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],


            // Métadonnées
            'language' => 'required|in:fr,en,es',
            'is_visible' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'course_id.required' => 'Le cours est obligatoire.',
            'course_id.exists' => 'Le cours sélectionné n\'existe pas.',
            'course_id.integer' => 'L\'ID du cours doit être un nombre.',

            'title.required' => 'Le titre est obligatoire.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',

            'description.max' => 'La description ne doit pas dépasser 1000 caractères.',

            'order.integer' => 'L\'ordre doit être un nombre entier.',
            'order.min' => 'L\'ordre ne peut pas être négatif.',

            'is_active.boolean' => 'Le statut actif doit être un booléen.',
            'is_free.boolean' => 'Le statut gratuit doit être un booléen.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Casts utiles pour les checkboxes / JSON
        $this->merge([
            'is_competency_based' => $this->boolean('is_competency_based'),
            'is_certifying' => $this->boolean('is_certifying'),
            'is_mandatory' => $this->boolean('is_mandatory'),
            'has_evaluation' => $this->boolean('has_evaluation'),
            'is_visible' => $this->boolean('is_visible'),
        ]);
    }
}
