<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Traits\AppUtilityTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InstitutLoginController extends Controller
{
    use AppUtilityTrait;
    public function showLoginForm()
    {
        return Inertia::render('instituts/auth/institut-login');
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        try {
            $loginInput = $request->input('email');
            if (Auth::guard('institut')->attempt(['email' => $loginInput, 'password' => $request->password])) {
                $request->session()->regenerate();
                return redirect()->route('institut.dashboard');
            }

            return back()->withErrors(['login' => 'Idenfiant ou mot de passe incorrect.'])->withInput();
        } catch (Exception $e) {
            return response("Error : Quelques choses s'est mal passées");
        }
    }

    public function logout(Request $request)
    {
        Auth::guard('institut')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('institut.login');
    }
}
