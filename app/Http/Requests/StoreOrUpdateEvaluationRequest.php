<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrUpdateEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Relations
            'quiz_id' => ['nullable', 'exists:quizzes,id'],
            'activity_id' => ['required', 'exists:activities,id'],

            // Identification
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Typologie
            'evaluation_type' => [
                'required',
                Rule::in(['formative', 'summative', 'certifying']),
            ],

            // Modalité
            'modality' => [
                'required',
                Rule::in(['onsite', 'online', 'hybrid', 'asynchronous']),
            ],

            'deliverable_type' => [
                'nullable',
                Rule::in([
                    'file',
                    'link',
                    'github_repo_link',
                    'video',
                    'audio',
                    'text'
                ]),
            ],
            'note_unit' => [
                'nullable',
                Rule::in([
                    '%',
                    'pt',
                ]),
            ],

            // Visioconférence
            'conference_platform' => ['nullable', 'string', 'max:255'],
            'conference_url' => ['nullable', 'string', 'max:255'],
            'conference_meeting_id' => ['nullable', 'string', 'max:255'],
            'conference_passcode' => ['nullable', 'string', 'max:255'],

            // Organisation
            'weight' => ['nullable', 'numeric', 'min:0'],
            'max_score' => ['nullable', 'integer', 'min:1'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'scheduled_at' => ['nullable', 'date'],
            'is_mandatory' => ['required', 'boolean'],

            // Ressources
            'allowed_tools' => ['nullable', 'array'],
            'allowed_tools.*' => ['string', 'max:500'],
            'resources_summary' => ['nullable', 'string'],

            // Feedback
            'provides_feedback' => ['required', 'boolean'],
            'feedback_instructions' => ['nullable', 'string'],

            // Avancé
            'is_group' => ['required', 'boolean'],
            'max_group_size' => ['nullable', 'integer', 'min:2'],
            'allows_resubmission' => ['required', 'boolean'],
            'max_attempts' => ['nullable', 'integer', 'min:1'],

            // Fenêtre temporelle
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after:start_at'],

            // Accès
            'is_synchronous' => ['required', 'boolean'],
            'allow_late_submission' => ['required', 'boolean'],
            'late_penalty_percentage' => ['nullable', 'integer', 'between:0,100'],

            // Sécurité
            'lock_after_end' => ['required', 'boolean'],
            'shuffle_questions' => ['required', 'boolean'],

            // Métadonnées
            'language' => ['required', 'string', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre de l\'évaluation est obligatoire.',
            'evaluation_type.in' => 'Le type d\'évaluation sélectionné est invalide.',
            'modality.in' => 'Le mode de diffusion est invalide.',
            'max_score.min' => 'Le score maximum doit être supérieur à zéro.',
            'duration_minutes.min' => 'La durée doit être supérieure à zéro.',
            'end_at.after' => 'La date de fin doit être postérieure à la date de début.',
            'late_penalty_percentage.between' => 'La pénalité de retard doit être comprise entre 0 et 100 %.',
            'max_group_size.min' => 'Un groupe doit contenir au moins 2 personnes.',
            'language.required' => 'La langue est obligatoire.',
        ];
    }
}
