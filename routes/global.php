<?php

use App\Http\Controllers\Global\AssignCoursToStudentController;
use App\Http\Controllers\Global\ResourceController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['simpleAuth']], function () {
    Route::post('/upload-to-tmp', [App\Http\Controllers\SimpleTaskController::class, 'upload'])->name('uploadToTmp');
    Route::post('/remove-from-tmp', [App\Http\Controllers\SimpleTaskController::class, 'remove'])->name('removeFromTmp');
    Route::get('text-editor-to-session', [App\Http\Controllers\SimpleTaskController::class, 'textEditorToSession'])->name('textEditorToSession');
    Route::get('/api/upload-status/', function () {
        $status = Cache::get("upload_status", 'idle');
        return response()->json(['status' => $status]);
    });
    // suppression du status après récupération
    Route::post('/api/clear-upload-status/', function () {
        Cache::forget("upload_status");
        return response()->json(['status' => 'cleared']);
    });

    // assign cours to student
    Route::get('/api/search-student/{cours}', [AssignCoursToStudentController::class, 'searchStudent'])->name('searchStudent');
    Route::post('/api/assign-to-student/{cours}', [AssignCoursToStudentController::class, 'assignToStudent'])->name('assignToStudent');

    // 
    Route::get('/redirect-to-dashboard', function () {
        if (Auth::check() && Auth::user()->account_role == "teacher") {
            return to_route('teachers.dashboard');
        } else if (Auth::guard('institut')) {
            return to_route('institut.dashboard');
        } else {
            abort(403, "Interdit");
        }
    })->name('redirectToDash');

    Route::resource('medias', ResourceController::class);
    Route::group(['prefix' => 'medias/', 'as' => 'medias.'], function () {
        Route::get('{entity_type}/{entity_id}', [ResourceController::class, 'entityResources'])->name('entityResources');
        Route::get('upload/{entity_type}/{entity_id}', [ResourceController::class, 'createEntityResource'])->name('createEntityResource');
        Route::get('upload/{slug}/{entity_type}/{entity_id}', [ResourceController::class, 'editEntityResource'])->name('editEntityResource');
        Route::post('upload/{entity_type}/{entity_id}', [ResourceController::class, 'storeEntityResource'])->name('storeEntityResource');
        Route::post('update-upload/{id}/{entity_type}/{entity_id}', [ResourceController::class, 'updateEntityResource'])->name('updateEntityResource');
        Route::delete('delete-upload/{id}/{entity_type}/{entity_id}', [ResourceController::class, 'deleteEntityResource'])->name('deleteEntityResource');
    });
    Route::get('pdfviewer/{media_slug}', [ResourceController::class, 'viewPdf'])->name('viewPdf');
});
