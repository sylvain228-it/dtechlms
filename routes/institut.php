<?php

use App\Http\Controllers\Institut\CoursManageController;
use App\Http\Controllers\Institut\InstCourseController;
use App\Http\Controllers\Institut\InstitutCoursController;
use App\Http\Controllers\Institut\InstitutCourseModuleController;
use App\Http\Controllers\Institut\InstitutDashboardController;
use App\Http\Controllers\Institut\InstitutDomaineController;
use App\Http\Controllers\Institut\InstitutLoginController;
use App\Http\Controllers\Institut\InstitutModuleSequenceController;
use App\Http\Controllers\Institut\InstitutStudentsController;
use App\Http\Controllers\Institut\InstitutTeachersController;
use App\Http\Controllers\Institut\InstitutUserController;
use App\Http\Controllers\Institut\LocationController;
use App\Http\Controllers\Institut\ProfileInstitutController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => '/institut', 'middleware' => ['auth.institut'], 'as' => 'institut.'], function () {
    Route::get('/dashboard', [InstitutDashboardController::class, 'index'])->name('dashboard');
    Route::get('/docs', [InstitutDashboardController::class, 'docs'])->name('docs');
    Route::resource('domaines', InstitutDomaineController::class);
    Route::group(['prefix' => 'utilisateurs', 'as' => 'users.'], function () {
        Route::get('/', [InstitutUserController::class, 'index'])->name('index');
    });
    Route::group(['prefix' => 'teachers', 'as' => 'teachers.'], function () {
        Route::get('/', [InstitutTeachersController::class, 'index'])->name('index');
        Route::get('/ajouter', [InstitutTeachersController::class, 'form'])->name('create');
        Route::get('/edit/{id}', [InstitutTeachersController::class, 'edit'])->name('edit');
        Route::get('/show/{id}', [InstitutTeachersController::class, 'show'])->name('show');
        Route::post('/store', [InstitutTeachersController::class, 'store'])->name('store');
        Route::put('/update/{id}', [InstitutTeachersController::class, 'update'])->name('update');
        Route::delete('/delete/{id}', [InstitutTeachersController::class, 'destroy'])->name('destroy');
        Route::get('/api/search-user', [InstitutTeachersController::class, 'searchUser'])->name('searchUser');
        Route::post('/api/assign-to-user', [InstitutTeachersController::class, 'assignToUser'])->name('assigntouser');
    });

    Route::resource('courses', InstitutCoursController::class);
    Route::group(['prefix' => 'courses/{course}', 'as' => 'courses.'], function () {
        Route::post('/teachers/attach', [CoursManageController::class, 'attachTeacher'])->name('attachTeacher');
        Route::post('/teachers/unlink', [CoursManageController::class, 'unlinkTeacher'])->name('unlinkTeacher');
        Route::get('/inscrits', [CoursManageController::class, 'enrolled'])->name('enrolled');
        Route::post('/inscrition', [CoursManageController::class, 'enrollment'])->name('enrollment');
        Route::post('/désinscription', [CoursManageController::class, 'unlinkStudent'])->name('unlinkStudent');
    });
    Route::group(['prefix' => 'courses/', 'as' => 'courses.'], function () {
        Route::get('/', [CoursManageController::class, 'index'])->name('list');
        Route::get('/{slug}/details', [CoursManageController::class, 'details'])->name('details');
        Route::get('/{slug}/contenu', [CoursManageController::class, 'content'])->name('content');
    });




    // course modules and sequences routes
    Route::group(['prefix' => 'courses/{course}/modules', 'as' => 'courses.modules.'], function () {
        Route::get('/', [InstitutCourseModuleController::class, 'index'])->name('index');
        Route::get('/create', [InstitutCourseModuleController::class, 'create'])->name('create');
        Route::post('/store', [InstitutCourseModuleController::class, 'store'])->name('store');
        Route::get('/{module}/edit', [InstitutCourseModuleController::class, 'edit'])->name('edit');
        Route::get('/{module}', [InstitutCourseModuleController::class, 'show'])->name('show');
        Route::put('/{module}/update', [InstitutCourseModuleController::class, 'update'])->name('update');
        Route::delete('/{module}/delete', [InstitutCourseModuleController::class, 'destroy'])->name('destroy');

        // sequences routes
        Route::group(['prefix' => '/{module}/sequences', 'as' => 'sequences.'], function () {
            Route::get('/', [InstitutModuleSequenceController::class, 'index'])->name('index');
            Route::get('/create', [InstitutModuleSequenceController::class, 'create'])->name('create');
            Route::post('/store', [InstitutModuleSequenceController::class, 'store'])->name('store');
            Route::get('/{sequence}/edit', [InstitutModuleSequenceController::class, 'edit'])->name('edit');
            Route::get('/{sequence}', [InstitutModuleSequenceController::class, 'show'])->name('show');
            Route::put('/{sequence}/update', [InstitutModuleSequenceController::class, 'update'])->name('update');
            Route::delete('/{sequence}/delete', [InstitutModuleSequenceController::class, 'destroy'])->name('destroy');
        });
    });


    Route::group(['prefix' => 'profile', 'as' => 'profile.'], function () {
        Route::get('/', [ProfileInstitutController::class, 'profile'])->name('index');
        Route::get('/edit', [ProfileInstitutController::class, 'editProfile'])->name('edit');
        Route::post('/update', [ProfileInstitutController::class, 'update'])->name('update');
        Route::post('logo', [ProfileInstitutController::class, 'updateLogo'])->name('updatelogo');
    });

    Route::resource('locations', LocationController::class);


    // gestion students
    Route::resource('students', InstitutStudentsController::class);
    Route::group(['prefix' => '/students', 'as' => 'students.'], function () {
        Route::get('/api/search-user', [InstitutStudentsController::class, 'searchUser'])->name('searchUser');
        Route::post('/api/assign-to-user', [InstitutStudentsController::class, 'assignToUser'])->name('assigntouser');
    });
});
Route::group(['as' => 'institut.', 'middleware' => ['guest.custom']], function () {
    Route::get('/institut-login', [InstitutLoginController::class, 'showLoginForm'])->name('login');
    Route::post('/institut-login', [InstitutLoginController::class, 'login'])->name('login.store');
    Route::post('/institut-logout', [InstitutLoginController::class, 'logout'])->name('logout');
});
