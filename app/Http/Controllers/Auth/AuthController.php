<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\AppUtilityTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use AppUtilityTrait;
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
    public function profile()
    {
        return inertia('auth/profile/index');
    }
    public function edit()
    {
        return inertia('auth/profile/edit');
    }
    public function update(Request $request)
    {
        $user = User::find(Auth::id());
        $input = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone_number' => 'required|string|max:12',
        ], [
            'first_name.required' => 'Le prénom est obligatoire.',
            'phone_number.required' => 'Le numéro de téléphone est obligatoire.',
            'phone_number.unique' => 'Ce numéro de téléphone est déjà utilisé.',
        ]);

        $phone = $this->normalizePhoneNumber(ltrim($request->phone_number));
        if ($phone == null) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone est invalid.'],
            ]);
        } elseif (User::where('phone_number', $phone)->whereNot('id', $user->id)->first()) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone existe déjà.'],
            ]);
        }
        $user->update($input);
        return to_route('auth.profile.index')->with('success', 'Profile mise à jour avec succès');
    }

    public function settings()
    {
        return inertia('auth/settings/index');
    }

    public function updateUserPassword(Request $request)
    {
        $user = User::findOrFail(Auth::id());
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);
        try {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors(['current_password' => 'Mot de passe actuel incorrect.']);
            }

            $user->update([
                'password' => Hash::make($request->password),
            ]);
            return back()->with('success', 'Mot de passe changé avec succès.');
        } catch (Exception $e) {
            return back()->with('error', "Error : Quelques choses s'est mal passées");
        }
    }
}
