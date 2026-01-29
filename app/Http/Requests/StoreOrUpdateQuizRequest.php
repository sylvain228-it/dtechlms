<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrUpdateQuizRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'quize_instructions' => ['nullable', 'string'],

            // Paramètres pédagogiques
            'quiz_type' => [
                'required',
                Rule::in(['diagnostic', 'formative', 'summative']),
            ],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1'],
            'max_attempts' => ['required', 'integer', 'min:1'],
            'is_mandatory' => ['required', 'boolean'],

            // Comportement
            'shuffle_questions' => ['required', 'boolean'],
            'shuffle_answers' => ['required', 'boolean'],
            'show_results_immediately' => ['required', 'boolean'],
            'show_correct_answers' => ['required', 'boolean'],
            'note_unit' => [
                'nullable',
                Rule::in([
                    '%',
                    'pt',
                ]),
            ],
            // Scoring
            'max_score' => ['nullable', 'numeric', 'min:0'],
            'success_threshold' => ['nullable', 'numeric', 'min:0'],
        ];
    }
    public function messages()
    {
        return [
            'title.required' => 'Le titre du quiz est requis.',
            'title.string' => 'Le titre du quiz doit être une chaîne de caractères.',
            'title.max' => 'Le titre du quiz ne doit pas dépasser 255 caractères.',
            'description.string' => 'La description doit être une chaîne de caractères.',
            'quize_instructions.string' => 'les instructions doit être une chaîne de caractères.',
            'quiz_type.required' => 'Le type de quiz est requis.',
            'quiz_type.in' => 'Le type de quiz sélectionné est invalide.',
            'time_limit_minutes.integer' => 'La limite de temps doit être un nombre entier.',
            'time_limit_minutes.min' => 'La limite de temps doit être au moins 1 minute.',
            'max_attempts.required' => 'Le champ nombre maximum de tentatives est requis.',
            'max_attempts.integer' => 'Le nombre maximum de tentatives doit être un nombre entier.',
            'max_attempts.min' => 'Le nombre maximum de tentatives doit être au moins 1.',
            'is_mandatory.required' => 'Le champ obligatoire est requis.',
            'is_mandatory.boolean' => 'Le champ obligatoire doit être vrai ou faux.',
            'shuffle_questions.required' => 'Le champ mélanger les questions est requis.',
            'shuffle_questions.boolean' => 'Le champ mélanger les questions doit être vrai ou faux.',
            'shuffle_answers.required' => 'Le champ mélanger les réponses est requis.',
            'shuffle_answers.boolean' => 'Le champ mélanger les réponses doit être vrai ou faux.',
            'show_results_immediately.required' => 'Le champ afficher les résultats immédiatement est requis.',
            'show_results_immediately.boolean' => 'Le champ afficher les résultats immédiatement doit être vrai ou faux.',
            'show_correct_answers.required' => 'Le champ afficher les bonnes réponses est requis.',
            'show_correct_answers.boolean' => 'Le champ afficher les bonnes réponses doit être vrai ou faux.',
            'max_score.numeric' => 'Le score maximum doit être numérique.',
            'max_score.min' => 'Le score maximum doit être au moins 0.',
            'success_threshold.numeric' => 'Le seuil de réussite doit être numérique.',
            'success_threshold.min' => 'Le seuil de réussite doit être au moins 0.',
        ];
    }
}
