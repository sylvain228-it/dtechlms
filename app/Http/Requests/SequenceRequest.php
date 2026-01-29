<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SequenceRequest extends FormRequest
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
            'module_id' => ['required', 'exists:modules,id'],

            // Identification
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Objectifs pédagogiques
            'syllabus' => ['nullable', 'string'],

            // Typologie pédagogique
            'sequence_type' => [
                'required',
                Rule::in([
                    'discovery',
                    'practice',
                    'integration',
                    'assessment',
                    'remediation',
                    'project',
                ]),
            ],

            // Organisation temporelle
            'order' => ['required', 'integer', 'min:1'],
            'estimated_hours' => ['nullable', 'integer', 'min:0'],
            'estimated_days' => ['nullable', 'integer', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],

            // Modalités pédagogiques
            'modality' => [
                'required',
                Rule::in([
                    'onsite',
                    'online',
                    'hybrid',
                    'asynchronous',
                ]),
            ],

            // Approche pédagogique

            // Évaluation
            'has_assessment' => ['boolean'],
            'assessment_weight' => ['nullable', 'numeric', 'min:0', 'max:100'],

            'is_mandatory' => ['boolean'],
            'is_visible' => ['boolean'],
            'language' => 'required|in:fr,en,es',
        ];
    }
    public function messages(): array
    {
        return [
            'module_id.required' => 'Le module est obligatoire.',
            'module_id.exists' => 'Le module sélectionné est invalide.',

            'title.required' => 'Le titre est obligatoire.',
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',

            'description.string' => 'La description doit être une chaîne de caractères.',

            'syllabus.string' => 'Le syllabus doit être une chaîne de caractères.',

            'order.required' => "L'ordre est obligatoire.",
            'order.integer' => "L'ordre doit être un entier.",
            'order.min' => "L'ordre doit être au moins :min.",

            'start_date.date' => 'La date de début doit être une date valide.',
            'end_date.date' => 'La date de fin doit être une date valide.',
            'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

            'assessment_weight.numeric' => "Le poids de l'évaluation doit être un nombre.",
            'assessment_weight.min' => "Le poids de l'évaluation doit être au moins :min.",
            'assessment_weight.max' => "Le poids de l'évaluation ne peut pas dépasser :max.",
        ];
    }

    /**
     * Prepare the data for validation.
     */
    public function prepareForValidation(): void
    {
        $this->merge([
            'has_assessment' => $this->boolean('has_assessment'),
            'is_mandatory' => $this->boolean('is_mandatory'),
            'is_visible' => $this->boolean('is_visible'),
        ]);
    }
}
