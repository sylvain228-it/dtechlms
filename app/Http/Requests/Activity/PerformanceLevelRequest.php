<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class PerformanceLevelRequest extends FormRequest
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
            'rubric_criteria_id' => ['required', 'exists:rubric_criterias,id'],
            'label' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'score_value' => ['nullable', 'numeric'],
            'min_score' => ['nullable', 'numeric'],
            'max_score' => ['nullable', 'numeric'],
            'is_passing' => ['boolean'],
            'position' => ['nullable', 'integer'],
            'color' => ['nullable', 'string'],
        ];
    }
}
