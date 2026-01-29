<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrUpdateSkillRequest extends FormRequest
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
        $skillId = $this->route('skill');

        return [
            // Identification
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('skills', 'code')->ignore($skillId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Structuration
            'domaine_id' => ['nullable', 'integer'],
            'sub_domaine_id' => ['nullable', 'integer'],
            'type' => [
                'required',
                Rule::in(['technical', 'methodological', 'behavioral', 'transversal']),
            ],

            // Niveau et cadre
            'level_min' => ['nullable', 'integer', 'min:0', 'max:8'],
            'level_max' => ['nullable', 'integer', 'min:0', 'max:8', 'gte:level_min'],
            'framework' => ['nullable', 'string', 'max:255'],

            // Gouvernance
            'is_active' => ['boolean'],
            'is_certifiable' => ['boolean'],

            // Versioning / hiérarchie
            'version' => ['nullable', 'integer', 'min:1'],

            // Métadonnées
            'language' => ['nullable', 'string', 'max:10'],
            'source' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'Ce code de compétence existe déjà.',
            'level_max.gte' => 'Le niveau maximum doit être supérieur ou égal au niveau minimum.',
            'parent_id.exists' => 'La compétence parente sélectionnée est invalide.',
        ];
    }
}
