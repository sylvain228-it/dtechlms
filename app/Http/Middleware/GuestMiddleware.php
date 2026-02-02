<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class GuestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::guard('admin')->check()) {
            return to_route('admin.dashboard');
        } else if (Auth::guard('institut')->check()) {
            return to_route('institut.dashboard');
        }
        if (Auth::check()) {
            if (Auth::user()->account_role == 'student') {
                return to_route('students.dashboard');
            } else if (Auth::user()->account_role == 'teacher') {
                return to_route('teachers.dashboard');
            }
            return redirect('/');
        }
        return $next($request);
    }
}
