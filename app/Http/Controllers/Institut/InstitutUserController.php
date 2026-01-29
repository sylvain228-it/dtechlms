<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutUserController extends Controller
{
    public function index()
    {
        $users = User::orderByDesc('created_at')->get();
        return Inertia::render('instituts/users/index', ['users' => $users]);
    }
}
