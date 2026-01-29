<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrUpdateLoactionRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'address_line' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'maps_url' => ['nullable', 'string', 'max:1000'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'Le nom de l\'emplacement est obligatoire.',
            'name.string' => 'Le nom de l\'emplacement doit être une chaîne de caractères.',
            'name.max' => 'Le nom de l\'emplacement ne doit pas dépasser 255 caractères.',
            'address.max' => 'L\'adresse ne doit pas dépasser 500 caractères.',
            'address_line.max' => 'La ligne d\'adresse ne doit pas dépasser 500 caractères.',
            'city.max' => 'La ville ne doit pas dépasser 255 caractères.',
            'state.max' => 'L\'état ne doit pas dépasser 255 caractères.',
            'country.max' => 'Le pays ne doit pas dépasser 255 caractères.',
            'maps_url.max' => 'L\'URL de Google Maps ne doit pas dépasser 1000 caractères.',
            'latitude.numeric' => 'La latitude doit être un nombre.',
            'latitude.between' => 'La latitude doit être comprise entre -90 et 90.',
            'longitude.numeric' => 'La longitude doit être un nombre.',
            'longitude.between' => 'La longitude doit être comprise entre -180 et 180.',
        ];
    }
}
