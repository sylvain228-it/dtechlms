<?php

use App\Http\Controllers\Student\StudentActivityController;
use App\Http\Controllers\Student\StudentCoursController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentEvaluationController;
use App\Http\Controllers\Student\StudentQuizeController;
use App\Http\Controllers\Student\StudentSubmissionController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => '/apprenants', 'middleware' => ['status.user', 'student'], 'as' => 'students.'], function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/docs', [StudentDashboardController::class, 'docs'])->name('docs');
    Route::group(['as' => 'courses.'], function () {
        Route::get('/mes-cours', [StudentCoursController::class, 'courses'])->name('index');
        Route::get('/apprentissage/{course}', [StudentCoursController::class, 'details'])->name('details');
        Route::get('/apprentissage/{course}/contenu', [StudentCoursController::class, 'content'])->name('content');
        Route::get('/apprentissage/{course}/lecture/{sequence}', [StudentCoursController::class, 'reading'])->name('reading');

        Route::get('/course/{course}/détails-module/{module}', [StudentActivityController::class, 'moduleDetails'])->name('moduleDetails');
        Route::get('/course/{course}/détails-séquence/{sequence}', [StudentActivityController::class, 'sequenceDetails'])->name('sequenceDetails');
    });

    // activities
    Route::group(['prefix' => 'activites/', 'as' => 'activities.'], function () {
        Route::get('/calendrier', [StudentActivityController::class, 'index'])->name('calendars');
        Route::get('/details/{activity}', [StudentActivityController::class, 'details'])->name('details');

        // submissions
        Route::get('/submissions', [StudentSubmissionController::class, 'index'])->name('submissions');
        Route::group(['prefix' => '{activity}/submissions', 'as' => 'submissions.'], function () {
            Route::get('create', [StudentSubmissionController::class, 'create'])->name('create');
            Route::post('store', [StudentSubmissionController::class, 'store'])->name('store');
            Route::get('details', [StudentSubmissionController::class, 'show'])->name('show');
            Route::put('update', [StudentSubmissionController::class, 'update'])->name('update');
            Route::delete('destroy', [StudentSubmissionController::class, 'destroy'])->name('destroy');
        });
    });

    // quizes
    Route::group(['prefix' => 'quizzes/', 'as' => 'quizzes.'], function () {
        Route::get('/', [StudentQuizeController::class, 'index'])->name('index');
        Route::get('/details/{quiz}', [StudentQuizeController::class, 'details'])->name('details');
        Route::get('/{quiz}/start', [StudentQuizeController::class, 'start'])->name('start');
        Route::get('/{quiz}/submit', [StudentQuizeController::class, 'submit'])->name('submit');
    });

    // évaluations
    Route::group(['prefix' => 'evaluations/', 'as' => 'evaluations.'], function () {
        Route::get('/', [StudentEvaluationController::class, 'index'])->name('index');
    });
});
