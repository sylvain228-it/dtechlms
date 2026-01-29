<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\NotifyUser;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Mockery\CountValidator\Exception;

class VerificationController extends Controller
{
    use AppUtilityTrait;
    public function notice()
    {
        if (Auth::user()->email_verified_at != null || Auth::user()->email_verified_at != "") {
            return redirect('/');
        }
        return inertia('auth/verify-email');
    }
    public function otpNotice()
    {
        if (Auth::user()->phone_verified_at != null || Auth::user()->phone_verified_at != "") {
            return redirect('/');
        }
        return inertia('auth/verify-phone');
    }
    public function resendOtp()
    {
        if (Auth::user()->phone_verified_at != null || Auth::user()->phone_verified_at != "") {
            return redirect('/');
        }
        try {
            $user = Auth::user();
            // send verify phone number
            $sendOpt = $this->sendOtp($user->phone);
            $otp = $sendOpt['otp'] ?? 0;
            Cookie::queue('checkOtp', "$otp", 15);
            return redirect()->back()->with('success', 'Un code à 6 chiffres vous a été renvoyé par SMS.');
        } catch (Exception $e) {
            return redirect()->back()->with("error", "Quelques choses s'est mal passées");
        }
        return inertia('auth/verify-phone');
    }
    public function checkOtp(Request $request)
    {
        if (Auth::user()->phone_verified_at != null || Auth::user()->phone_verified_at != "") {
            return redirect('/');
        }
        $request->validate([
            'otpNumber' => ['required', 'numeric', 'digits:6']
        ]);
        if (!$request->hasCookie('checkOtp')) {
            return redirect()->back()->with('error', 'Code invalide ou expiré.');
        }

        try {
            $otp = $request->cookie('checkOtp');
            $user = Auth::user();
            if ((int)$request->otpNumber == (int)$otp) {
                $user = User::find($user->id);
                $user->phone_verified_at = now();
                $user->update();
                if ($user->email != null) {
                    $messagesLines = [
                        "Nous sommes ravis de vous accueillir sur notre plateforme partage de lien gagner par clic.",
                        'Merci de nous faire confiance !',
                        'Votre compte est en cours de vérification. Vous recevrez très bientôt un e-mail ou sms avec votre code d’activation pour accéder à votre espace personnel.'
                    ];
                    $user->notify(new NotifyUser(
                        "Bienvenue sur notre plateforme",
                        $messagesLines
                    ));
                }
                Cookie::queue(Cookie::forget('checkOtp'));
                return redirect('/')->with('success', 'Numéro de téléphone confirmé avec succès !');
            }
            return redirect()->back()->with('error', 'Code invalide');
        } catch (Exception $e) {
            return redirect()->back()->with("error", "Quelques choses s'est mal passées");
        }
        return view('auth.verify-phone');
    }
    public function attente()
    {
        if (Auth::user()->status != "inactive") {
            return redirect('/');
        }
        return inertia('auth/attente');
    }



    public function resend(Request $request)
    {
        if (Auth::user()->email_verified_at != null || Auth::user()->email_verified_at != "") {
            return redirect('/');
        }
        try {
            if ($request->user()->hasVerifiedEmail()) {
                return redirect('/');
            }

            $request->user()->sendEmailVerificationNotification();

            return back()->with('success', 'Le lien de vérification a été renvoyé.');
        } catch (Exception $e) {
            return response("Error : Quelques choses s'est mal passées");
        }
    }
}
