<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    use AppUtilityTrait;
    public function login()
    {
        return Inertia::render('auth/login');
    }
    public function store(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ], [
            'login.required' => 'L\'adresse email ou le numéro de téléphone est obligatoire.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        $loginInput = $request->input('login');
        if ($normalizedPhone = $this->normalizePhoneNumber($loginInput)) {
            $field = "phone_number";
            $loginInput = $normalizedPhone;
        } else if (filter_var($loginInput, FILTER_VALIDATE_EMAIL)) {
            $field = "email";
        } else {
            $field = 'username';
        }

        if (Auth::attempt([$field => $loginInput, 'password' => $request->password], $request->filled('remember'))) {
            $request->session()->regenerate();
            if (Auth::user()->account_role == "teacher") {
                return to_route('teachers.dashboard');
            }
            if (Auth::user()->account_role == "student") {
                return to_route('students.dashboard');
            }
            return redirect()->intended('/');
        }

        throw ValidationException::withMessages([
            'login' => ['Identifiants ou mot de passe incorrects.'],
        ]);
    }
}
