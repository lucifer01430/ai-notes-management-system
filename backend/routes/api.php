<?php

use App\Http\Controllers\Api\NoteController;
use Illuminate\Support\Facades\Route;

Route::post('notes/search', [NoteController::class, 'search']);
Route::post('notes/{id}/summary', [NoteController::class, 'summary']);
Route::apiResource('notes', NoteController::class);
