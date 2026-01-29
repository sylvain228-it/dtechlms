<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
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
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'domaine_id' => 'nullable|exists:domaines,id',

            'language' => 'required|in:fr,en,es',
            'start_date' => 'nullable|date|after_or_equal:today',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'academic_year' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_free' => 'nullable|boolean',
            // 'is_modular' => 'nullable|boolean',
            'is_certifying' => 'nullable|boolean',
            // 'is_competency_based' => 'nullable|boolean',
            // 'is_featured' => 'nullable|boolean',
            'status' => 'nullable|in:draft,published,archived',
            'course_type' => 'required|in:professional,university,modular',
            'modality' => 'required|in:onsite,hybrid,online,asynchronous',
            'level' => 'required|in:all_level,beginner,intermediate,advanced,expert',
            'total_hours' => 'required|numeric|min:0',
            'estimated_days' => 'nullable|numeric|min:0',
            'estimated_weeks' => 'nullable|numeric|min:0',
        ];

        if ($this->method() == "POST") {
            if (!session()->get('course_syllabus') || session()->get('course_syllabus') == "") {
                $rules += ['syllabus' => 'required|string'];
            }
            $rules += ['cover' => ['required', 'image', 'mimes:png,jpg,jpeg', 'max:2000']];
        } else if ($this->method() == "PUT") {
            if (!session()->get('course_edit_syllabus') || session()->get('course_edit_syllabus') == "") {
                $rules += ['syllabus' => 'required|string'];
            }
            $rules += ['cover' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2000']];
        }
        return $rules;
    }

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

    public function prepareForValidation(): void
    {
        $this->merge([
            'is_certifying' => $this->boolean('is_certifying'),
            // 'is_modular' => $this->boolean('is_modular'),
            // 'is_featured' => $this->boolean('is_featured'),
            'is_free' => $this->boolean('is_free'),
        ]);
    }
}
