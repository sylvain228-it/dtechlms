<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        // extract first_name and last_name from name
        $fullName = trim($input['name']);
        $nameParts = explode(' ', $fullName, 2);
        $input['last_name'] = $nameParts[0];
        // le reste est le first_name
        $input['first_name'] = $nameParts[1] ?? '';
        // generate username from email before the @
        $input['username'] = substr(strtolower(explode('@', $input['email'])[0]), 0, 13);

        return User::create([
            'username' => $input['username'],
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);
    }
}
