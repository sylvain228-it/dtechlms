<?php

use App\Http\Controllers\ManageStudentController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'simpleAuth'], function () {
    // Route::resource('geststudents', ManageStudentController::class);
    // Route::group(['prefix' => '/geststudents', 'as' => 'etudiants.'], function () {
    //     Route::get('/api/search-user', [ManageStudentController::class, 'searchUser'])->name('searchUser');
    //     Route::post('/api/assign-to-user', [ManageStudentController::class, 'assignToUser'])->name('assigntouser');
    // });
});
