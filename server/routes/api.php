<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SearchController;
use App\Http\Controllers\API\CategoryController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/update', [AuthController::class, 'update']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Tasks API
    Route::put('/tasks/{id}/toggle-important', [TaskController::class, 'toggleImportant']);
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    // Search API
    Route::get('/search', [SearchController::class, 'search']);
    Route::get('/search/advanced', [SearchController::class, 'advancedSearch']);
    Route::get('/search/suggestions', [SearchController::class, 'suggestions']);

    // Category API
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

// Public routes
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/login', [AuthController::class, 'login']);