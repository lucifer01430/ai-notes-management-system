<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use App\Services\GeminiSummaryService;
use Illuminate\Support\Facades\Log;
use Throwable;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = Note::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Notes retrieved successfully.',
            'data' => $notes,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNoteRequest $request)
    {
        $note = Note::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Note created successfully.',
            'data' => $note,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $note = Note::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Note retrieved successfully.',
            'data' => $note,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNoteRequest $request, string $id)
    {
        $note = Note::findOrFail($id);
        $note->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Note updated successfully.',
            'data' => $note,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note deleted successfully.',
        ], 200);
    }

    /**
     * Generate and store an AI summary for the specified resource.
     */
    public function summary(GeminiSummaryService $summaryService, string $id)
    {
        $note = Note::findOrFail($id);

        try {
            $note->update([
                'summary' => $summaryService->generate($note->content),
            ]);
        } catch (Throwable $exception) {
            Log::warning('Gemini note summary generation failed.', [
                'note_id' => $note->id,
                'exception' => $exception,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to generate note summary at this time.',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'message' => 'Note summary generated successfully.',
            'data' => $note,
        ], 200);
    }
}
