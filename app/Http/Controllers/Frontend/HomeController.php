<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function home()
    {
        $courses = Course::with(['institut'])->latest()->take(9)->get();
        return inertia('welcome', [
            'courses' => $courses,
        ]);
    }
}
