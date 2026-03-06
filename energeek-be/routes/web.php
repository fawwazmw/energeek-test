<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// API Documentation Routes
Route::get('/api-docs', function () {
    return redirect('/api-docs.html');
});

Route::get('/docs', function () {
    return redirect('/api-docs.html');
});
