<?php

// namespace App\Http\Controllers\Teacher;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\StoreOrUpdateQuizRequest;
// use App\Models\Course;
// use App\Models\Quiz;
// use App\Traits\AppUtilityTrait;
// use App\Traits\TeacherTrait;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;

// class TeacherQuizeController extends Controller
// {
//     use AppUtilityTrait, TeacherTrait;
//     public function allEvaluations()
//     {
//         $teacher = $this->teacher();
//         $courseIds = Course::where('teacher_id', $teacher->id)->pluck('id')->toArray();
//         $quizzes = Quiz::with('parentCourse')->whereIn('parent_course_id', $courseIds)->get();
//         return inertia('teachers/quizzes/index', [
//             'quizzes' => $quizzes,
//         ]);
//     }
//     public function checkEntity($entityType, $entityId)
//     {
//         if ($this->parseModel($entityType) === null) {
//             return abort(404, 'Donnée invalide');
//         } else {
//             return $this->parseModel($entityType)::find($entityId);
//         }
//     }
//     public function index($entityType, $entityId)
//     {
//         $object = $this->checkEntity($entityType, $entityId);
//         if (!$object) {
//             return redirect()->back()->with('error', "Entité non trouvée");
//         }

//         $quizzes = $object->quizzes()->orderByDesc('created_at')->get();
//         // dd($quizzes);
//         return inertia('teachers/quizzes/index', ['quizzes' => $quizzes, 'entity_type' => $entityType, 'entity_id' => $entityId]);
//     }
//     public function create($entityType, $entityId)
//     {
//         $this->checkEntity($entityType, $entityId);
//         return inertia('teachers/quizzes/form', ['entity_type' => $entityType, 'entity_id' => $entityId]);
//     }

//     /**
//      * Store a newly created resource in storage.
//      */
//     public function store(StoreOrUpdateQuizRequest $request, $entityType, $entityId)
//     {
//         $this->checkEntity($entityType, $entityId);
//         $quize = new Quiz();
//         $data = $request->validated();
//         $data = array_merge($data, [
//             'slug' => $this->uniqueSlug(Quiz::class, $data['title']),
//         ]);
//         $data['quizzable_type'] = $this->entityModelPath($entityType);
//         $data['quizzable_id'] = $entityId;
//         $data['course_id'] = $this->getCourseId($entityType, $entityId);
//         $quize->fill($data);
//         $quize->save();
//         return redirect()->route('teachers.quizzes.entityQuizzes', [$entityType, $entityId])
//             ->with('success', 'Quize ajouté avec succès');
//     }

//     /**
//      * Display the specified resource.
//      */
//     public function show($slug, $entityType, $entityId)
//     {
//         $quize = Quiz::where('slug', $slug)->firstOrFail();
//         return inertia('teachers/quizzes/show', ['quize' => $quize, 'entity_type' => $entityType, 'entity_id' => $entityId]);
//     }


//     /**
//      * Show the form for editing the specified resource.
//      */
//     public function edit($slug, $entityType, $entityId)
//     {
//         $quize = Quiz::where('slug', $slug)->firstOrFail();
//         return inertia('teachers/quizzes/form', ['quize' => $quize, 'entity_type' => $entityType, 'entity_id' => $entityId]);
//     }

//     /**
//      * Update the specified resource in storage.
//      */
//     public function update(StoreOrUpdateQuizRequest $request, $id, $entityType, $entityId)
//     {
//         $this->checkEntity($entityType, $entityId);
//         $quize = Quiz::findOrFail($id);
//         $data = $request->validated();
//         $data = array_merge($data, [
//             'slug' => $this->uniqueSlug(Quiz::class, $data['title'], $quize->id),
//         ]);
//         $data['quizzable_type'] = $this->entityModelPath($entityType);
//         $data['quizzable_id'] = $entityId;
//         $data['course_id'] = $this->getCourseId($entityType, $entityId);
//         $quize->fill($data);
//         $quize->update();

//         return redirect()->route('teachers.quizzes.entityQuizzes', [$entityType, $entityId])
//             ->with('success', 'Quize modifié avec succès');
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(string $id, $entityType, $entityId)
//     {
//         $this->checkEntity($entityType, $entityId);
//         $quize = Quiz::findOrFail($id);
//         $quize->delete();

//         return redirect()->route('teachers.quizzes.entityQuizzes', [$entityType, $entityId])
//             ->with('success', 'Quize suprimé avec succès');
//     }
// }
