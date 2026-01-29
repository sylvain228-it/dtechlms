<?php

namespace App\Http\Controllers;

use App\Models\EntityType;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;

class InternalApiController extends Controller
{
    use AppUtilityTrait;
    public function loadEntityData($model, $old_id)
    {
        if ($this->parseModel($model) === null) {
            return response()->json(['error' => 'Model not found'], 404);
        }
        if (is_numeric($old_id) && intval($old_id) > 0) {
            $data = $this->parseModel($model)::whereNot('id', intval($old_id))->get();
        }
        $data = $this->parseModel($model)::all();
        // Logic to load entity data based on model and old_id
        return response()->json([
            'model' => $model,
            'old_id' => $old_id,
            'data' => $data // Replace with actual data retrieval logic
        ]);
    }
}
