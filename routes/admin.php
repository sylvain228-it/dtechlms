<?php

use App\Http\Controllers\Admin\AdminCoursesController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDomaineController;
use App\Http\Controllers\Admin\AdminEtudiantsController;
use App\Http\Controllers\Admin\AdminInstitutController;
use App\Http\Controllers\Admin\AdminTeachersController;
use App\Http\Controllers\Admin\Auth\AdminLoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::group(['prefix' => '/dpanel', 'middleware' => ['auth.admin'], 'as' => 'admin.'], function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/instituts', [AdminInstitutController::class, 'index'])->name('instituts');
    Route::get('/teachers', [AdminTeachersController::class, 'index'])->name('teachers');
    Route::get('/cours', [AdminCoursesController::class, 'index'])->name('courses');
    Route::get('/etudiants', [AdminEtudiantsController::class, 'index'])->name('etudiants');
    Route::resource('domaines', AdminDomaineController::class);
});
Route::group(['as' => 'admin.', 'middleware' => ['guest']], function () {
    Route::get('/dpanel-login', [AdminLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/dpanel-login', [AdminLoginController::class, 'login'])->name('login.store');
    Route::post('/dpanel-logout', [AdminLoginController::class, 'logout'])->name('logout');
});
