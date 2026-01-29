<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institut;
use Illuminate\Http\Request;

class AdminInstitutController extends Controller
{
    public function index()
    {
        $institut = Institut::all();
        return inertia('admin/institut/index', [
            'instituts' => $institut,
        ]);
    }
}
