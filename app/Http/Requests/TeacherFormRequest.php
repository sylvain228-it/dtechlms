<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TeacherFormRequest extends FormRequest
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
            // Informations personnelles
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'in:M,F,O'],
            'phone_number' => ['required', 'string', 'max:20'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],

            // Qualifications professionnelles
            'qualification' => ['nullable', 'string', 'max:255'],
            'diplom' => ['nullable', 'string', 'max:255'],
            'exp_year' => ['nullable', 'integer', 'min:0', 'max:70'],

            // Localisation
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],

            // Biographie
            'bio' => ['nullable', 'string', 'max:2000'],

            // Spécialités
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['string', 'max:255'],

            // Paramètres
            'online_teaching' => ['boolean'],
            'create_new_user' => ['boolean'],
            'status' => ['required', 'in:active,inactive'],

            // Photo de profil
            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,gif,webp', 'max:5120'],
        ];

        if ($this->method() == "POST") {
            $rules += [
                'email' => ['required', 'email', 'max:255', 'unique:teachers,email'],

            ];
        } else if ($this->method() == "PUT") {
            $rules += [
                'email' => ['required', 'email', 'max:255', 'unique:teachers,email,' . $this->route('id')],
            ];
        }

        return $rules;
    }
}
