<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use function Symfony\Component\Clock\now;

class SimpleTaskController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileNameExt = now()->format('YmdHis') . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('tmp', $fileNameExt);
            $mime_type = $file->getClientMimeType();
            $file_size = $file->getSize();
            $file_ext = $file->getClientOriginalExtension();
            $data = [
                'status' => 200,
                'path' => $path,
                'mime_type' => $mime_type,
                'file_size' => $file_size,
                'file_ext' => $file_ext,
            ];
            return response()->json($data, 200);
        }
        return response()->json(['error' => 'No file uploaded'], 400);
    }
    // remove file from tmp
    public function remove(Request $request)
    {
        $path = $request->input('tmp_path');
        if (Storage::exists($path)) {
            Storage::delete($path);
            return response()->json(['message' => 'File removed'], 200);
        }
        return response()->json(['error' => 'File not found'], 400);
    }

    public function textEditorToSession(Request $request)
    {
        // save html content to session
        $key = $request->input('oldId') == 0 ? 'text_syllabus' : 'text_edit_syllabus';
        $request->session()->put($key, $request->input('syllabus'));
        return response()->json(['message' => 'Syllabus saved to session']);
    }
}
