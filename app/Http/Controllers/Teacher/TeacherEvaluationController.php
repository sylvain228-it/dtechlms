<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateEvaluationRequest;
use App\Models\Evaluation;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherEvaluationController extends Controller
{
    use AppUtilityTrait;
    public function checkEntity($entityType, $entityId)
    {
        if ($this->parseModel($entityType) === null) {
            return abort(404, 'Donnée invalide');
        } else {
            return $this->parseModel($entityType)::find($entityId);
        }
    }
    public function index($entityType, $entityId)
    {
        $object = $this->checkEntity($entityType, $entityId);
        if (!$object) {
            return redirect()->back()->with('error', "Entité non trouvée");
        }

        $evaluations = $object->evaluations()->orderByDesc('created_at')->get();
        // dd($evaluations);
        return inertia('teachers/evaluations/index', ['evaluations' => $evaluations, 'entity_type' => $entityType, 'entity_id' => $entityId]);
    }
    public function create($entityType, $entityId)
    {
        $object = $this->checkEntity($entityType, $entityId);
        $modality = $object->course->modality;
        return inertia('teachers/evaluations/form', ['entity_type' => $entityType, 'entity_id' => $entityId, 'c_modality' => $modality]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateEvaluationRequest $request, $entityType, $entityId)
    {
        $this->checkEntity($entityType, $entityId);
        $evaluation = new Evaluation();
        $data = $request->validated();
        $data = array_merge($data, [
            'slug' => $this->uniqueSlug(Evaluation::class, $data['title']),
        ]);
        $data['allowed_tools'] = json_encode($data['allowed_tools']);
        $data['evaluable_type'] = $this->entityModelPath($entityType);
        $data['evaluable_id'] = $entityId;
        $data['course_id'] = $this->getCourseId($entityType, $entityId);
        $evaluation->fill($data);
        $evaluation->save();

        // save or update event
        if ($data['modality'] != 'asynchronous') {
            $eventData = [
                'title' => $data['title'],
                'description' => $data['description'] ?? 'Évaluation: ' . $data['title'],
                'start_at' => $data['start_at'] ?? $data['scheduled_at'] ?? null,
                'end_at' => null,
                'duration_minutes' => $data['duration_minutes'] ?? null,
                'eventable_type' => Evaluation::class,
                'event_type' => 'evaluation',
                'status' => 'scheduled',
                'eventable_id' => $evaluation->id,
                'course_id' => $evaluation->course_id,
                'teacher_id' => Auth::id(),
                'is_synchronous' => $data['is_synchronous'] ?? false,
                'modality' => $data['modality'] ?? null,
                'visibility' => 'course',
            ];
            $this->saveOrUpdateEvent($eventData);
        }
        return redirect()->route('teachers.evaluations.entityEvaluations', [$entityType, $entityId])
            ->with('success', 'Evaluation ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show($slug, $entityType, $entityId)
    {
        $evaluation = Evaluation::where('slug', $slug)->firstOrFail();
        return inertia('teachers/evaluations/show', ['evaluation' => $evaluation, 'entity_type' => $entityType, 'entity_id' => $entityId]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug, $entityType, $entityId)
    {
        $evaluation = Evaluation::where('slug', $slug)->firstOrFail();
        $modality = $evaluation->course->modality;
        return inertia('teachers/evaluations/form', ['evaluation' => $evaluation, 'entity_type' => $entityType, 'entity_id' => $entityId, 'c_modality' => $modality]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateEvaluationRequest $request, $id, $entityType, $entityId)
    {
        $this->checkEntity($entityType, $entityId);
        $evaluation = Evaluation::findOrFail($id);
        $data = $request->validated();
        $data = array_merge($data, [
            'slug' => $this->uniqueSlug(Evaluation::class, $data['title'], $evaluation->id),
        ]);
        $data['allowed_tools'] = json_encode($data['allowed_tools']);
        $data['evaluable_type'] = $this->entityModelPath($entityType);
        $data['evaluable_id'] = $entityId;
        $data['course_id'] = $this->getCourseId($entityType, $entityId);
        $evaluation->fill($data);
        $evaluation->update();

        // save or update event
        if ($data['modality'] != 'asynchronous') {
            $eventData = [
                'title' => $data['title'],
                'description' => $data['description'] ?? 'Évaluation: ' . $data['title'],
                'start_at' => $data['start_at'] ?? $data['scheduled_at'] ?? null,
                'end_at' => null,
                'duration_minutes' => $data['duration_minutes'] ?? null,
                'eventable_type' => Evaluation::class,
                'event_type' => 'evaluation',
                'status' => 'scheduled',
                'eventable_id' => $evaluation->id,
                'course_id' => $evaluation->course_id,
                'teacher_id' => Auth::id(),
                'is_synchronous' => $data['is_synchronous'] ?? false,
                'modality' => $data['modality'] ?? null,
                'visibility' => 'course',
            ];
            $this->saveOrUpdateEvent($eventData);
        }
        return redirect()->route('teachers.evaluations.entityEvaluations', [$entityType, $entityId])
            ->with('success', 'Evaluation modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, $entityType, $entityId)
    {
        $this->checkEntity($entityType, $entityId);
        $evaluation = Evaluation::findOrFail($id);
        $evaluation->delete();

        return redirect()->route('teachers.evaluations.entityEvaluations', [$entityType, $entityId])
            ->with('success', 'Evaluation suprimé avec succès');
    }
}
