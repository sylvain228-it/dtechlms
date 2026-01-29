<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventCalendarRequest;
use App\Models\EventCalendar;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherEventCalendarController extends Controller
{
    use AppUtilityTrait, TeacherTrait;
    public function checkEntity($entityType, $entityId)
    {
        if ($this->parseModel($entityType) === null) {
            return abort(404, 'Donnée invalide');
        } else {
            return $this->parseModel($entityType)::find($entityId);
        }
    }



    public function index()
    {
        $events = EventCalendar::orderBy('start_at', 'ASC')->get();
        return inertia('teachers/events/index', ['events' => $events]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response('');
        return inertia('teachers/events/form');
    }

    public function store(StoreEventCalendarRequest $request)
    {
        $data = $request->validated();
        $courseId = null;
        if (isset($data['entity_id'], $data['entity_type'])) {
            $this->checkEntity($data['entity_type'], $data['entity_id']);
            $courseId = $this->getCourseId($data['entity_type'], $data['entity_id']);
        }

        $event = new EventCalendar();
        $data['teacher_id'] = Auth::user()->id;
        $data['metadata'] = json_encode($data['metadata']);
        $data['course_id'] = $courseId;

        $data['eventable_type'] = $this->entityModelPath($data['entity_type']);
        $data['eventable_id'] = $data['entity_id'];

        $event->fill($data);
        $event->save();

        return redirect()->route('teachers.events.index')
            ->with('success', 'Evennement ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $event = EventCalendar::where('id', $id)->where('teacher_id', Auth::user()->id)->firstOrFail();
        return inertia('teachers/events/details', ['event' => $event]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $event = EventCalendar::where('id', $id)->where('teacher_id', Auth::user()->id)->firstOrFail();
        return inertia('teachers/events/form', ['event' => $event]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreEventCalendarRequest $request, $id)
    {
        $event = EventCalendar::where('id', $id)->where('teacher_id', Auth::user()->id)->firstOrFail();
        $data = $request->validated();
        $this->checkEntity($data['entity_type'], $data['entity_id']);

        $data['metadata'] = json_encode($data['metadata']);

        $data['eventable_type'] = $this->entityModelPath($data['entity_type']);
        $data['eventable_id'] = $data['entity_id'];

        $event->fill($data);
        $event->update();

        return redirect()->route('teachers.events.index')
            ->with('success', 'Evennement modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)

    {
        $event = EventCalendar::where('id', $id)->where('teacher_id', Auth::user()->id)->firstOrFail();
        $event->delete();

        return redirect()->route('teachers.events.index')
            ->with('success', 'Evennement suprimé avec succès');
    }
}
