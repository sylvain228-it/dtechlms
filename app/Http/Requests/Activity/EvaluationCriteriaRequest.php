<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class EvaluationCriteriaRequest extends FormRequest
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
            'activity_id' => ['required', 'exists:activities,id'],
            'skill_id' => ['nullable', 'exists:skills,id'],
            'title' => ['required', 'string'],
            'weight' => ['required', 'numeric'],
            'max_score' => ['nullable', 'numeric'],
            'success_threshold' => ['nullable', 'numeric'],
            'is_mandatory' => ['boolean'],
            'criterion_type' => ['required', 'in:knowledge,skill,attitude,transversal'],
            'evaluation_method' => ['required', 'in:points,rubric,pass_fail'],
            'status' => ['required', 'in:draft,published,archived'],
        ];
    }
}
