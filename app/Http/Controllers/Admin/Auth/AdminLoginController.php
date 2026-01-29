<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Traits\AppUtilityTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminLoginController extends Controller
{
    use AppUtilityTrait;
    public function showLoginForm()
    {
        return Inertia::render('admin/auth/admin-login');
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        try {
            $loginInput = $request->input('email');
            if (Auth::guard('admin')->attempt(['email' => $loginInput, 'password' => $request->password])) {
                $request->session()->regenerate();
                return redirect()->route('admin.dashboard');
            }

            return back()->withErrors(['login' => 'Idenfiant ou mot de passe incorrect.'])->withInput();
        } catch (Exception $e) {
            return response("Error : Quelques choses s'est mal passées");
        }
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
