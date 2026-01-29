<?php

use App\Http\Controllers\Student\StudentActivityController;
use App\Http\Controllers\Student\StudentCoursController;
use App\Http\Controllers\Student\StudentDashboardController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => '/apprenants', 'middleware' => ['status.user', 'student'], 'as' => 'students.'], function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'dashboard'])->name('dashboard');
    Route::group(['as' => 'courses.'], function () {
        Route::get('/mes-cours', [StudentCoursController::class, 'courses'])->name('index');
        Route::get('/apprentissage/{course}', [StudentCoursController::class, 'details'])->name('details');
        Route::get('/apprentissage/{course}/contenu', [StudentCoursController::class, 'content'])->name('content');
        Route::get('/apprentissage/{course}/lecture/{sequence}', [StudentCoursController::class, 'reading'])->name('reading');

        Route::get('/course/{course}/détails-module/{module}', [StudentActivityController::class, 'moduleDetails'])->name('moduleDetails');
        Route::get('/course/{course}/détails-séquence/{sequence}', [StudentActivityController::class, 'sequenceDetails'])->name('sequenceDetails');
    });

    // activities
    Route::group(['prefix' => 'activités/', 'as' => 'activities.'], function () {
        Route::get('/calendrier', [StudentActivityController::class, 'index'])->name('calendars');
        Route::get('/détails/{activity}', [StudentActivityController::class, 'details'])->name('details');
    });
});
