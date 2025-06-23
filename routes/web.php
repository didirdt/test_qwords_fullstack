<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Auth/login');
});

Route::get('/register', function () {
    return Inertia::render('Auth/register');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tasks', function () {
        return Inertia::render('Task/index');
    });

    Route::get('/tasks/create', function () {
        return Inertia::render('Task/create');
    });
});
