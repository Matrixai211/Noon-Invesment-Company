<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->file(public_path('index.html')));
Route::get('/admin', fn () => response()->file(public_path('admin.html')));
Route::get('/backend', fn () => response()->file(public_path('backend.html')));
