<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth.custom')->group(function () {



    // Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
    //     ->name('two-factor.show');
});
