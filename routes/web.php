<?php

use App\Http\Controllers\Frontend\CoursController;
use App\Http\Controllers\Frontend\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// auth
include __DIR__ . '/auth.php';



Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/course/{slug}', [CoursController::class, 'details'])->name('courseDetails');


Route::middleware(['auth.custom', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';


// student routes
include __DIR__ . '/student.php';
include __DIR__ . '/global.php';
// teacher routes
include __DIR__ . '/teacher.php';
include __DIR__ . '/geststudents.php';
include __DIR__ . '/course.php';
