<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventCalendarRequest extends FormRequest
{
    public function authorize(): bool
    {
        // À adapter selon ta logique (policy, rôle, etc.)
        return true;
    }

    public function rules(): array
    {

        return [
            // Titre & description
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Type d'événement
            'event_type' => [
                'required',
                Rule::in([
                    'general',
                    'course',
                    'module',
                    'sequence',
                    'activity',
                    'evaluation',
                    'quiz',
                    'conference',
                    'exam',
                    'custom'
                ]),
            ],

            // Polymorphique
            'entity_type'   => ['required', 'string'],
            'entity_id' => ['required', 'integer'],

            // Dates
            'start_at' => ['required', 'date'],
            'end_at'   => ['nullable', 'date', 'after_or_equal:start_at'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],

            // Mode

            'modality' => [
                'required',
                Rule::in([
                    'onsite',
                    'online',
                    'hybrid',
                ]),
            ],
            // Lieu / plateforme
            'modality' => [
                'required',
                Rule::in(['online', 'physical', 'hybrid']),
            ],

            'location'             => ['nullable', 'string', 'max:255'],
            'conference_platform'  => ['nullable', 'string', 'max:100'],
            'conference_url'       => ['nullable', 'url'],
            'conference_meeting_id' => ['nullable', 'string', 'max:100'],
            'conference_passcode'  => ['nullable', 'string', 'max:100'],

            // Visibilité
            'visibility' => [
                'required',
                Rule::in(['public', 'course', 'module', 'private']),
            ],

            // UI
            'color' => ['nullable', 'string', 'max:20'],

            // Métadonnées
            'metadata' => ['nullable', 'array'],
            'metadata.*' => ['string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'end_at.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
            'conference_url.url'    => 'L\'URL de la conférence doit être valide.',
        ];
    }
}
