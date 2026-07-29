<?php

use App\Http\Controllers\Api\NoteController;
use Illuminate\Support\Facades\Route;

Route::post('notes/{id}/summary', [NoteController::class, 'summary']);
Route::apiResource('notes', NoteController::class);
