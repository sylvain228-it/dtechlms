<?php

namespace App\Http\Requests\Institut;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InstitutProfileRequest extends FormRequest
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
            'type' => ['required', Rule::in(['university', 'training_center'])],
            'website_url' => ['nullable', 'url', 'max:255'],
            'email' => ['nullable', 'email', 'max:150'],
            'contact_email' => ['nullable', 'email', 'max:150'],
            'tel' => ['nullable', 'string', 'max:50'],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            's_address' => ['nullable', 'string'],
            'country' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'born_date' => ['nullable', 'date', 'before_or_equal:today'],
        ];
    }
}
