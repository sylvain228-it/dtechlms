<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    public function details($slug)
    {
        // Fetch course details by slug
        $course = Course::with(['institut'])->where('slug', $slug)->firstOrFail();
        // cours similaires de même catégorie
        $courses = Course::with(['institut'])->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->take(9)
            ->get();

        return inertia('frontend/course-details', [
            'course' => $course,
            'courses' => $courses,
        ]);
    }
}
