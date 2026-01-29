<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UserStatusMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return to_route('auth.login');
        }
        if (Auth::user()->email_verified_at == null) {
            return redirect()->route('auth.verification.notice')->with('error', "Veuillez vérifier votre adresse email.");
        }
        // if (!Auth::check() || Auth::user()->status != "active") {
        //     return redirect()->route('verification.attente')->with('error', "Votre compte est inactif");
        // }
        return $next($request);
    }
}
