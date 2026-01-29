<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentFormRequest extends FormRequest
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

            // 'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,gif,webp', 'max:5120'],
            'tmp_path' => ['nullable', 'string'],

            // Localisation
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],

            // Informations académiques
            'current_level' => ['nullable', 'string', 'max:255'],
            'program' => ['nullable', 'string', 'max:255'],
            'interests' => ['nullable', 'array'],
            'interests.*' => ['string', 'max:255'],
            'enrollment_date' => ['nullable', 'date'],
            'year' => ['nullable', 'string'],
            'session' => ['nullable', 'string', 'max:255'],
            'study_mode' => ['nullable', 'in:online,onsite,hybrid'],

            // Système & activité
            'is_active' => ['boolean'],
            'credits' => ['nullable', 'integer', 'min:0'],

            // Documents
            'documents' => ['nullable', 'array'],
            'documents.*' => ['string'],

            // Famille / contacts d'urgence
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:20'],
            'guardian_email' => ['nullable', 'email', 'max:255'],

            // Santé
            'medical_info' => ['nullable', 'string', 'max:1000'],
            'create_new_user' => ['boolean'],

            // Sécurité administrative
            'national_id' => ['nullable', 'string', 'max:255'],
            'is_verified' => ['boolean'],
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
    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'first_name.max' => 'Le prénom ne doit pas dépasser 255 caractères.',

            'last_name.required' => 'Le nom est obligatoire.',
            'last_name.max' => 'Le nom ne doit pas dépasser 255 caractères.',

            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit être une adresse valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'email.max' => 'L\'email ne doit pas dépasser 255 caractères.',

            'birth_date.date' => 'La date de naissance doit être une date valide.',
            'birth_date.before' => 'La date de naissance doit être dans le passé.',

            'gender.in' => 'Le sexe sélectionné est invalide.',
            'phone_number.max' => 'Le numéro de téléphone ne doit pas dépasser 20 caractères.',

            'profile_picture.image' => 'Le fichier doit être une image.',
            'profile_picture.mimes' => 'L\'image doit être un fichier JPEG, PNG, GIF ou WebP.',
            'profile_picture.max' => 'L\'image ne doit pas dépasser 5MB.',

            'country.max' => 'Le pays ne doit pas dépasser 255 caractères.',
            'city.max' => 'La ville ne doit pas dépasser 255 caractères.',
            'address.max' => 'L\'adresse ne doit pas dépasser 255 caractères.',
            'postal_code.max' => 'Le code postal ne doit pas dépasser 10 caractères.',

            'current_level.max' => 'Le niveau actuel ne doit pas dépasser 255 caractères.',
            'program.max' => 'Le programme ne doit pas dépasser 255 caractères.',
            'interests.array' => 'Les intérêts doivent être un tableau.',
            'interests.*.max' => 'Chaque intérêt ne doit pas dépasser 255 caractères.',
            'enrollment_date.date' => 'La date d\'inscription doit être une date valide.',
            'year.integer' => 'L\'année doit être un nombre entier.',
            'year.min' => 'L\'année doit être au minimum 2000.',
            'year.max' => 'L\'année ne peut pas être dans le futur.',
            'session.max' => 'La session ne doit pas dépasser 255 caractères.',
            'study_mode.in' => 'Le mode d\'étude sélectionné est invalide.',

            'is_active.boolean' => 'Le statut actif doit être un booléen.',
            'credits.integer' => 'Les crédits doivent être un nombre entier.',
            'credits.min' => 'Les crédits ne peuvent pas être négatifs.',

            'guardian_name.max' => 'Le nom du tuteur ne doit pas dépasser 255 caractères.',
            'guardian_phone.max' => 'Le téléphone du tuteur ne doit pas dépasser 20 caractères.',
            'guardian_email.email' => 'L\'email du tuteur doit être une adresse valide.',
            'guardian_email.max' => 'L\'email du tuteur ne doit pas dépasser 255 caractères.',

            'medical_info.max' => 'Les informations médicales ne doivent pas dépasser 1000 caractères.',

            'national_id.max' => 'L\'ID national ne doit pas dépasser 255 caractères.',
            'is_verified.boolean' => 'La vérification doit être un booléen.',
        ];
    }
    public function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_verified' => $this->boolean('is_verified'),
            'interests' => is_string($this->interests)
                ? array_filter(array_map('trim', explode(',', $this->interests)))
                : $this->interests,
        ]);
    }
}
