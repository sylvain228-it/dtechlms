<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrUpdateQuizAnswerRequest extends FormRequest
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
            'quiz_question_id' => ['required', 'exists:quiz_questions,id'],

            // Contenu
            'answer_text' => ['nullable', 'string', 'max:255'],
            'is_correct' => ['required', 'boolean'],
            'order' => ['required', 'integer', 'min:0'],

            // Numérique
            'numeric_value' => ['nullable', 'numeric'],
            'tolerance' => ['nullable', 'numeric', 'min:0'],
        ];
    }
    public function withValidator($validator)
    {
        $validator->sometimes(
            ['numeric_value', 'tolerance'],
            ['required', 'numeric'],
            fn() => request()->input('question_type') === 'numeric'
        );
    }
    public function messages(): array
    {
        return [
            'quiz_question_id.required' => 'L\'ID de la question est requis.',
            'quiz_question_id.exists' => 'La question sélectionnée n\'existe pas.',
            'answer_text.string' => 'Le texte de réponse doit être une chaîne de caractères.',
            'answer_text.max' => 'Le texte de réponse ne doit pas dépasser 255 caractères.',
            'is_correct.required' => 'Le statut de correction est requis.',
            'is_correct.boolean' => 'Le statut de correction doit être vrai ou faux.',
            'order.required' => 'L\'ordre est requis.',
            'order.integer' => 'L\'ordre doit être un nombre entier.',
            'order.min' => 'L\'ordre doit être au minimum 0.',
            'numeric_value.numeric' => 'La valeur numérique doit être un nombre.',
            'tolerance.numeric' => 'La tolérance doit être un nombre.',
            'tolerance.min' => 'La tolérance doit être au minimum 0.',
        ];
    }
}
