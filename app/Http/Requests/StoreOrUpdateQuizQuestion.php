<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrUpdateQuizQuestion extends FormRequest
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
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required|string',
            'question_type' => 'required|string',
            'points' => 'required|numeric|min:0',
            'order' => 'required|integer|min:0',
            'is_mandatory' => 'boolean',
            'feedback_correct' => 'nullable|string',
            'feedback_incorrect' => 'nullable|string',
        ];
    }
    public function messages()
    {
        return [
            'quiz_id.required' => 'Le quiz est requis.',
            'quiz_id.exists' => 'Le quiz sélectionné n\'existe pas.',
            'question_text.required' => 'Le texte de la question est requis.',
            'question_text.string' => 'Le texte de la question doit être une chaîne de caractères.',
            'question_type.required' => 'Le type de question est requis.',
            'question_type.string' => 'Le type de question doit être une chaîne de caractères.',
            'points.required' => 'Les points sont requis.',
            'points.numeric' => 'Les points doivent être un nombre.',
            'points.min' => 'Les points doivent être au minimum 0.',
            'order.required' => 'L\'ordre est requis.',
            'order.integer' => 'L\'ordre doit être un entier.',
            'order.min' => 'L\'ordre doit être au minimum 0.',
            'is_mandatory.boolean' => 'Le champ obligatoire doit être un booléen.',
            'feedback_correct.string' => 'Le commentaire positif doit être une chaîne de caractères.',
            'feedback_incorrect.string' => 'Le commentaire négatif doit être une chaîne de caractères.',
        ];
    }
}
