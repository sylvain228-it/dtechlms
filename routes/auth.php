<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;

Route::group(['as' => 'auth.'], function () {
    // guest
    Route::middleware('guest.custom')->group(function () {
        Route::get('/login', [LoginController::class, 'login'])->name('login');
        Route::post('/login', [LoginController::class, 'store'])->name('login.store');

        Route::get('/register', [RegisterController::class, 'register'])->name('register');
        Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

        //    forgot password 
        Route::get('/mot-de-passe-oublie', [PasswordController::class, 'showLinkRequestForm'])->name('password.request');
        Route::post('/mot-de-passe-email', [PasswordController::class, 'sendResetLinkEmail'])->name('password.email');

        Route::get('/reset-password/{token}', [PasswordController::class, 'showResetForm'])->name('password.reset');
        Route::post('/change-password', [PasswordController::class, 'reset'])->name('password.update');
    });

    // auth
    Route::middleware('auth.custom')->group(function () {
        Route::get('/phone-number/verify', [VerificationController::class, 'otpNotice'])->name('numberOtp.notice');
        Route::post('/send-phone-number-otp', [VerificationController::class, 'resendOtp'])->name('otp')->middleware('throttle:6,1');
        Route::post('/check-phone-number-otp', [VerificationController::class, 'checkOtp'])->name('otp.check');


        // email
        Route::get('/email/verify', [VerificationController::class, 'notice'])->name('verification.notice');
        Route::get('/status/attente', [VerificationController::class, 'attente'])->name('verification.attente');


        Route::post('/email/verification-notification', [VerificationController::class, 'resend'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        Route::group(['prefix' => 'profile', 'as' => 'profile.'], function () {
            Route::get('/', [AuthController::class, 'profile'])->name('index');
            Route::get('/mise-a-jour', [AuthController::class, 'edit'])->name('edit');
            Route::put('/update', [AuthController::class, 'update'])->name('update');
            Route::post('photo', [AuthController::class, 'updatePhoto'])->name('updatePhoto');
        });

        Route::group(['prefix' => 'paramètre', 'as' => 'settings.'], function () {
            Route::get('/', [AuthController::class, 'settings'])->name('index');
            Route::put('/update-password', [AuthController::class, 'updateUserPassword'])->name('updateUserPassword');
        });
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/')->with('success', 'Email vérifié avec succès');
})->middleware('signed')->name('verification.verify');
