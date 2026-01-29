<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActivityRequest extends FormRequest
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
            'scope' => ['required', 'in:course,module,sequence'],
            'parent_course_id' => ['required', 'integer', 'exists:courses,id'],

            'course_id' => [
                'nullable',
                'required_if:scope,course',
                'prohibited_unless:scope,course',
                'exists:courses,id',
            ],

            'module_id' => [
                'nullable',
                'required_if:scope,module',
                'prohibited_unless:scope,module',
                'exists:modules,id',
            ],

            'sequence_id' => [
                'nullable',
                'required_if:scope,sequence',
                'prohibited_unless:scope,sequence',
                'exists:sequences,id',
            ],

            // Identification
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Typologie d’activité
            'activity_type' => [
                'required',
                Rule::in([
                    'lecture',
                    'quiz',
                    'exercise',
                    'practical_work',
                    'case_study',
                    'project',
                    'simulation',
                    'challenge',
                    'discussion',
                    'assessment',
                ]),
            ],

            // Consignes pédagogiques
            'instructions' => ['nullable', 'string'],

            // Organisation
            'order' => ['required', 'integer', 'min:1'],
            'estimated_minutes' => ['nullable', 'integer', 'min:0'],

            // Modalités
            'modality' => [
                'required',
                Rule::in([
                    'onsite',
                    'online',
                    'hybrid',
                    'asynchronous',
                ]),
            ],

            'is_individual' => ['boolean'],
            'is_collaborative' => ['boolean'],
            'max_group_size' => ['nullable', 'integer', 'min:1'],

            // Livrables
            'has_deliverable' => ['boolean'],
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
            'deliverable_deadline' => ['nullable', 'date'],

            // Évaluation
            'is_evaluated' => ['boolean'],
            'evaluation_type' => [
                'nullable',
                Rule::in(['formative', 'summative', 'certifying']),
            ],
            'evaluation_weight' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'note_unit' => [
                'nullable',
                Rule::in([
                    '%',
                    'pt',
                ]),
            ],

            'resources_summary' => ['nullable', 'string'],

            // Feedback et accompagnement
            'requires_feedback' => ['boolean'],
            'allows_resubmission' => ['boolean'],
            'max_attempts' => ['nullable', 'integer', 'min:1'],

            'is_synchronous' => ['boolean'],

            // Planification
            'start_at' => ['nullable', 'required_unless:modality,asynchronous', 'date'],
            'duration_minutes' => ['nullable', 'required_unless:modality,asynchronous', 'integer', 'min:1'],

            // Visioconférence
            'conference_platform' => ['nullable', 'string', 'max:255'],
            'conference_url' => ['nullable', 'string', 'max:255'],
            'conference_meeting_id' => ['nullable', 'string', 'max:255'],
            'conference_passcode' => ['nullable', 'string', 'max:255'],

            // Présence
            'attendance_required' => ['boolean'],
            'is_mandatory' => ['boolean'],
            'is_visible' => ['boolean'],
        ];
    }
    public function prepareForValidation(): void
    {
        $this->merge([
            'is_certifying' => $this->boolean('is_certifying'),
            'is_mandatory' => $this->boolean('is_mandatory'),
            'is_visible' => $this->boolean('is_visible'),
            'attendance_required' => $this->boolean('attendance_required'),
        ]);
    }
}
