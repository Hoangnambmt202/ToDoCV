<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Request;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\TaskController;

Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class,'user']);
    Route::put('/update', [AuthController::class, 'update']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/show/{id}', [TaskController::class, 'show']);
    Route::put('/update/{id}', [TaskController::class, 'update']);
    Route::delete('/delete/{id}', [TaskController::class, 'destroy']);
});