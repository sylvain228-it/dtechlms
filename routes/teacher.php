<?php

use App\Http\Controllers\Teacher\ProfileTeacherController;
use App\Http\Controllers\Teacher\SkillController;
use App\Http\Controllers\Teacher\TeacherCoursController;
use App\Http\Controllers\Teacher\TeacherCourseModuleController;
use App\Http\Controllers\Teacher\TeacherCoursManageController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\TeacherEvaluationController;
use App\Http\Controllers\Teacher\TeacherEventCalendarController;
use App\Http\Controllers\Teacher\TeacherModuleSequenceController;
use App\Http\Controllers\Teacher\TeacherQuestionResponseController;
use App\Http\Controllers\Teacher\TeacherQuizeController;
use App\Http\Controllers\Teacher\TeacherQuizeQuestionController;
use App\Http\Controllers\Teacher\TeacherCourseActivity;
use App\Http\Controllers\Teacher\TeacherStudentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => '/enseignants', 'middleware' => ['status.user', 'teacher'], 'as' => 'teachers.'], function () {

    Route::resource('courses', TeacherCoursController::class);
    Route::group(['prefix' => 'courses/{course}', 'as' => 'courses.'], function () {
        Route::get('/inscrits', [TeacherCoursManageController::class, 'enrolled'])->name('enrolled');
        Route::post('/student/attach', [TeacherCoursManageController::class, 'attachStudent'])->name('attachStudent');
        Route::post('/student/unlink', [TeacherCoursManageController::class, 'unlinkStudent'])->name('unlinkStudent');
        Route::post('/inscrition', [TeacherCoursManageController::class, 'enrollment'])->name('enrollment');
    });
    // course sections and lessons routes
    Route::group(['prefix' => 'courses/{course}'], function () {
        Route::resource('modules', TeacherCourseModuleController::class);

        // lessons routes
        Route::group(['prefix' => '/{module}'], function () {
            Route::resource('sequences', TeacherModuleSequenceController::class);
        });
    });
    Route::group(['prefix' => 'courses/{course}'], function () {
        Route::resource('activities', TeacherCourseActivity::class);
        Route::get('/api/get-entity-data', [TeacherCourseActivity::class, 'getEntityData'])->name('getEntityData');
    });
    Route::resource('skills', SkillController::class);
    Route::get('liste-des-activites', [TeacherCourseActivity::class, 'allActivities'])->name('allActivities');
    Route::get('liste-des-evaluation', [TeacherEvaluationController::class, 'allEvaluations'])->name('allEvaluations');
    Route::get('liste-des-quizzes', [TeacherQuizeController::class, 'allQuizzes'])->name('allQuizzes');


    Route::group(['prefix' => 'profile', 'as' => 'profile.'], function () {
        Route::get('/', [ProfileTeacherController::class, 'profile'])->name('index');
        Route::get('/edit', [ProfileTeacherController::class, 'editProfile'])->name('edit');
        Route::post('/update', [ProfileTeacherController::class, 'update'])->name('update');
        Route::post('logo', [ProfileTeacherController::class, 'updateLogo'])->name('updatelogo');
    });

    Route::resource('events', TeacherEventCalendarController::class);


    Route::get('dashboard', [TeacherDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('mes-cours', [TeacherCoursManageController::class, 'courses'])->name('mycourses');

    Route::group(['prefix' => '/{activity}'], function () {
        Route::resource('quizzes', TeacherQuizeController::class);
    });
    Route::group(['prefix' => '/{quiz}', 'as' => 'quizzes.'], function () {
        // quize questions
        Route::resource('questions', TeacherQuizeQuestionController::class);
        // quize questions response
        Route::group(['prefix' => '/{question}'], function () {
            Route::resource('responses', TeacherQuestionResponseController::class);
        });
    });

    // students
    Route::group(['prefix' => 'students/', 'as' => 'students.'], function () {
        Route::get('/', [TeacherStudentController::class, 'index'])->name('index');
    });

    // evaluations
    Route::group(['prefix' => '/{activity}'], function () {
        Route::resource('evaluations', TeacherEvaluationController::class);
    });
});
