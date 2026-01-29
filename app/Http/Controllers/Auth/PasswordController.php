<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Mockery\CountValidator\Exception;

class PasswordController extends Controller
{
    use AppUtilityTrait;
    public function showLinkRequestForm()
    {
        return inertia('auth/password/index');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
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

        // Détection du type de saisie
        $user = User::where($field, $loginInput)->first();

        if (!$user || !$user->email) {
            return response()->json([
                'message' => 'Si le compte existe, un lien de réinitialisation a été envoyé.'
            ]);
        }

        // Envoi du lien par email
        $status = Password::sendResetLink([
            'email' => $user->email
        ]);

        return $status === Password::RESET_LINK_SENT
            ? back()->with('success', __($status == "passwords.sent" ? "Lien de réinitialisation vous a été envoyé par email" : "Envoyé"))
            : back()->with('error', __($status == "passwords.user" ? "Compte non trouvé" : "Error"));
    }

    public function showResetForm(Request $request, $token)
    {
        return inertia('auth/password/reset', ['token' => $token, 'email' => $request->email]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);
        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return redirect()
                    ->route('auth.login')
                    ->with('success', 'Mot de passe réinitialisé avec succès.');
            }
            return back()->with('error', 'Le lien est invalide ou expiré.');
        } catch (Exception $e) {
            return response("Error : Quelques choses s'est mal passées");
        }
    }
}
