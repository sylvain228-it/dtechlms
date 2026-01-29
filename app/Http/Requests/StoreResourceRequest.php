<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResourceRequest extends FormRequest
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
            // Identification
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tmp_path' => ['nullable', 'string'],

            // Typologie de ressource
            'resource_type' => [
                'required',
                Rule::in([
                    'video',
                    'document',
                    'link',
                    'tool',
                    'dataset',
                    'audio',
                    'image',
                    'slide',
                    'external_activity',
                    'other',
                ]),
            ],

            // Support technique
            'storage_type' => [
                'required',
                Rule::in(['local', 's3', 'cloudinary', 'external']),
            ],

            'file_path' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:2048'],
            'url_public_id' => ['nullable', 'string', 'max:255'],
            'mime_type' => ['nullable', 'string', 'max:100'],
            'file_ext' => ['nullable', 'string', 'max:100'],
            'file_size' => ['nullable', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],

            // Accessibilité pédagogique
            'language' => ['nullable', 'string', 'max:10'],
            'has_subtitles' => ['boolean'],
            'has_transcript' => ['boolean'],
            'accessibility_level' => ['nullable', 'string', 'max:255'],

            // Usage pédagogique
            'pedagogical_role' => [
                'required',
                Rule::in(['core', 'support', 'extension', 'reference']),
            ],

            'is_mandatory' => ['boolean'],
            'is_downloadable' => ['boolean'],

            // Métadonnées pédagogiques
            'learning_objectives' => ['nullable', 'array'],
            'learning_objectives.*' => ['string', 'max:500'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],

            // Droits & licences
            'author' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'license' => ['nullable', 'string', 'max:255'],
            'access_instructions' => ['nullable', 'string'],
            'attribution' => ['nullable', 'string', 'max:255'],

            'is_visible' => ['boolean'],

            // Versioning
            'version' => ['nullable', 'integer', 'min:1'],
            'parent_id' => ['nullable', 'exists:resources,id'],
        ];
    }
    public function messages(): array
    {
        return [
            'resource_type.in' => 'Le type de ressource est invalide.',
            'storage_type.in' => 'Le type de stockage est invalide.',
            'pedagogical_role.in' => 'Le rôle pédagogique est invalide.',
            'status.in' => 'Le statut est invalide.',
            'url.url' => 'Le champ URL doit être une adresse valide.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'has_subtitles' => $this->boolean('has_subtitles'),
            'has_transcript' => $this->boolean('has_transcript'),
            'is_mandatory' => $this->boolean('is_mandatory'),
            'is_downloadable' => $this->boolean('is_downloadable'),
            'is_visible' => $this->boolean('is_visible'),
        ]);
    }
}
