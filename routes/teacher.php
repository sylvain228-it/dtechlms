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
    Route::get('liste-des-activités', [TeacherCourseActivity::class, 'allActivities'])->name('allActivities');
    Route::resource('skills', SkillController::class);


    Route::group(['prefix' => 'profile', 'as' => 'profile.'], function () {
        Route::get('/', [ProfileTeacherController::class, 'profile'])->name('index');
        Route::get('/edit', [ProfileTeacherController::class, 'editProfile'])->name('edit');
        Route::post('/update', [ProfileTeacherController::class, 'update'])->name('update');
        Route::post('logo', [ProfileTeacherController::class, 'updateLogo'])->name('updatelogo');
    });

    Route::resource('events', TeacherEventCalendarController::class);


    Route::get('dashboard', [TeacherDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('mes-cours', [TeacherCoursManageController::class, 'courses'])->name('mycourses');

    Route::group(['prefix' => '/{activity}/quizzes/', 'as' => 'quizzes.'], function () {
        Route::get('/', [TeacherQuizeController::class, 'index'])->name('index');
        Route::get('create', [TeacherQuizeController::class, 'create'])->name('create');
        Route::post('store', [TeacherQuizeController::class, 'store'])->name('store');
        Route::get('détails/{quiz}', [TeacherQuizeController::class, 'show'])->name('show');
        Route::get('{quiz}/edit', [TeacherQuizeController::class, 'edit'])->name('edit');
        Route::put('update/{quiz}', [TeacherQuizeController::class, 'update'])->name('update');
        Route::delete('delete/{quiz}', [TeacherQuizeController::class, 'destroy'])->name('destroy');

        // quize questions
        Route::group(['prefix' => '{quiz}/', 'as' => 'questions.'], function () {
            Route::get('/', [TeacherQuizeQuestionController::class, 'index'])->name('index');
            Route::get('create', [TeacherQuizeQuestionController::class, 'create'])->name('create');
            Route::post('store', [TeacherQuizeQuestionController::class, 'store'])->name('store');
            Route::get('détails/{id}', [TeacherQuizeQuestionController::class, 'show'])->name('show');
            Route::get('edit/{id}', [TeacherQuizeQuestionController::class, 'edit'])->name('edit');
            Route::put('update/{id}', [TeacherQuizeQuestionController::class, 'update'])->name('update');
            Route::delete('delete/{id}', [TeacherQuizeQuestionController::class, 'destroy'])->name('destroy');
        });
        // quize questions response
        Route::group(['prefix' => '{quiz}/réponse/{question}/', 'as' => 'responses.'], function () {
            Route::get('/', [TeacherQuestionResponseController::class, 'index'])->name('index');
            Route::get('create', [TeacherQuestionResponseController::class, 'create'])->name('create');
            Route::post('store', [TeacherQuestionResponseController::class, 'store'])->name('store');
            Route::get('détails/{id}', [TeacherQuestionResponseController::class, 'show'])->name('show');
            Route::get('edit/{id}', [TeacherQuestionResponseController::class, 'edit'])->name('edit');
            Route::put('update/{id}', [TeacherQuestionResponseController::class, 'update'])->name('update');
            Route::delete('delete/{id}', [TeacherQuestionResponseController::class, 'destroy'])->name('destroy');
        });
    });

    // students
    Route::group(['prefix' => 'students/', 'as' => 'students.'], function () {
        Route::get('/', [TeacherStudentController::class, 'index'])->name('index');
    });

    // evaluations
    Route::group(['prefix' => '/{activity}/évaluations/', 'as' => 'evaluations.'], function () {
        Route::get('', [TeacherEvaluationController::class, 'index'])->name('index');
        Route::get('create/', [TeacherEvaluationController::class, 'create'])->name('create');
        Route::post('store/', [TeacherEvaluationController::class, 'store'])->name('store');
        Route::get('détails/{evaluation}/', [TeacherEvaluationController::class, 'show'])->name('show');
        Route::get('{evaluation}/edit/', [TeacherEvaluationController::class, 'edit'])->name('edit');
        Route::put('update/{evaluation}/', [TeacherEvaluationController::class, 'update'])->name('update');
        Route::delete('delete/{evaluation}/', [TeacherEvaluationController::class, 'destroy'])->name('destroy');
    });
});
