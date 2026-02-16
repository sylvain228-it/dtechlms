<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class GradingScaleRangeRequest extends FormRequest
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
            'grading_scale_id' => ['required', 'exists:grading_scales,id'],
            'letter' => ['required', 'string', 'max:2'],
            'min_score' => ['required', 'numeric'],
            'max_score' => ['required', 'numeric', 'gte:min_score'],
            'gpa_value' => ['nullable', 'numeric'],
            'mention' => ['nullable', 'string'],
            'color' => ['nullable', 'string'],
            'position' => ['nullable', 'integer'],
        ];
    }
}
