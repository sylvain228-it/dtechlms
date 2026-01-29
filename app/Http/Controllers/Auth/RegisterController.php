<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Institut;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\NotifyInstitut;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RegisterController extends Controller
{
    use AppUtilityTrait;
    public function register()
    {
        return Inertia::render('auth/register');
    }
    public function store(Request $request)
    {
        $input = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'nullable|string|max:12',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'email.email' => 'L\'adresse email n\'est pas valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'phone_number.required' => 'Le numéro de téléphone est obligatoire.',
            'phone_number.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        $phone = $this->normalizePhoneNumber(ltrim($request->phone_number));
        if ($phone == null) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone est invalid.'],
            ]);
        } elseif (User::where('phone_number', $phone)->first()) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone existe déjà.'],
            ]);
        }
        try {
            // extract first_name and last_name from name
            $fullName = trim($input['name']);
            $nameParts = explode(' ', $fullName, 2);
            $input['last_name'] = $nameParts[0];
            // le reste est le first_name
            $input['first_name'] = $nameParts[1] ?? '';
            // generate username from email before the @
            $input['username'] = $this->generateUsername($input['email']);
            $input['phone_number'] = $phone;

            $user = User::create([
                'username' => $input['username'],
                'first_name' => $input['first_name'],
                'last_name' => $input['last_name'],
                'email' => $input['email'],
                'phone_number' => $input['phone_number'],
                'password' => $input['password'],
            ]);

            $user->sendEmailVerificationNotification();

            $institut = Institut::first();
            // $institutToken = $institut->createToken('institut_auto_login_token', ['*'])->plainTextToken;
            $institutLink = URL::temporarySignedRoute(
                'institut.users.index',
                now()->addMinutes(60),
                [
                    // 'token' => $this->$institutToken,
                    'email' => $user->email,
                ]
            );
            $institut->notify(new NotifyInstitut(
                "Nouveau utilisateur",
                "Un nouveau utilisateur sur " . config('app.name'),
                'Voir ces informations',
                $institutLink
            ));

            Notification::create([
                'type' => 'new_user',
                'title' => 'Nouveau utilisateur',
                'data' => json_encode([
                    'message' => "Un nouvau utilisateur " . config('app.name'),
                    'desty' => "institut",
                    'user_id' => $user->id,
                    'username' => $user->username,
                ]),
                'notifiable_type' => Institut::class,
                'notifiable_id' => $institut->id,
            ]);



            Auth::login($user);
            return redirect()->route('auth.verification.notice')->with('success', "Un nouveau lien de vérification a été envoyé à l'adresse électronique que vous avez fournie lors de votre inscription.");
        } catch (\Exception $e) {
            Log::error("Erreur d'inscription :: " . $e->getMessage());
            return response("Error : Quelques choses s'est mal passées");
        }
    }
}
