<?php

use App\Http\Controllers\Course\DependencyController;
use App\Http\Controllers\Course\PrerequisiteController;
use App\Http\Controllers\Course\TeachingMethodController;
use App\Http\Controllers\Course\ToolController;
use App\Http\Controllers\InternalApiController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'course/{course}/', 'middleware' => ['simpleAuth', 'as' => 'course.']], function () {
    // prerequisites routes
    Route::group(['prefix' => 'prerequisites', 'as' => 'prerequisites.'], function () {
        Route::get('/', [PrerequisiteController::class, 'index'])->name('index');
        Route::post('/attach', [PrerequisiteController::class, 'attachPrerequisite'])->name('attach');
        Route::post('/detach', [PrerequisiteController::class, 'detachPrerequisite'])->name('detach');
    });
    // dependencies routes
    Route::group(['prefix' => 'dependencies', 'as' => 'dependencies.'], function () {
        Route::get('/', [DependencyController::class, 'dependenciesIndex'])->name('index');
        Route::post('/attach', [DependencyController::class, 'attachDependency'])->name('attach');
        Route::post('/detach', [DependencyController::class, 'detachDependency'])->name('detach');
    });
    // teaching methods and tools routes can be added here in the future
    Route::resource('teaching-methods', TeachingMethodController::class);
    Route::resource('tools', ToolController::class);

    // load data api
});
Route::get('fetch-model-data/{model}/{old_id}', [InternalApiController::class, 'loadEntityData'])->name('fetchentitydata');
