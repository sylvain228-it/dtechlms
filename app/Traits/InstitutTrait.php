<?php

namespace App\Traits;

use App\Models\Institut;
use Illuminate\Support\Facades\Auth;

trait InstitutTrait
{
    public function getAuthInstitut(): ?Institut
    {
        return Institut::find(Auth::guard('institut')->id());
    }
}
